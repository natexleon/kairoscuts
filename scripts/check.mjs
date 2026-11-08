// Validates the built site in dist/: metadata, canonicals, headings, structured data, links, images and sitemap.
// Exits non-zero on any error so it can gate a deploy.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, BOOKING_URL, business, menu, priceLabel } from '../src/site.config.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const urlFor = (file) => {
  const rel = '/' + relative(dist, file).replace(/\\/g, '/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};
const resolveLocal = (href) => {
  const path = decodeURI(href.split('#')[0].split('?')[0]);
  if (path === '') return true;
  const target = join(dist, path);
  return existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
};
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

const titles = new Map();
const descriptions = new Map();
const ids = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const url = urlFor(file);
  const name = url;
  const noindex = /<meta name="robots" content="noindex/.test(html);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title) fail(name, 'missing <title>');
  else {
    if (title.length > 65) warn(name, `title is ${title.length} chars (may truncate): ${title}`);
    if (titles.has(title)) fail(name, `duplicate title with ${titles.get(title)}`);
    titles.set(title, name);
  }
  if (!desc) fail(name, 'missing meta description');
  else {
    if (desc.length < 70 || desc.length > 170) warn(name, `description is ${desc.length} chars`);
    if (descriptions.has(desc)) fail(name, `duplicate description with ${descriptions.get(desc)}`);
    descriptions.set(desc, name);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (noindex) {
    if (canonical) fail(name, 'noindex page should not declare a canonical');
  } else {
    if (canonical !== SITE_URL + url) fail(name, `canonical ${canonical} ≠ ${SITE_URL + url}`);
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image']) if (!html.includes(`property="${p}"`)) fail(name, `missing ${p}`);
    const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
    if (ogUrl !== canonical) fail(name, 'og:url does not match canonical');
    const ogImg = html.match(/property="og:image" content="([^"]+)"/)?.[1] || '';
    if (!ogImg.startsWith(SITE_URL) || !resolveLocal(ogImg.slice(SITE_URL.length))) fail(name, `og:image not found: ${ogImg}`);
  }

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(name, `expected 1 <h1>, found ${h1s.length}`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) fail(name, `heading jumps from h${levels[i - 1]} to h${l}`); });

  // Structured data must parse; @id values must be absolute and every BarberShop node identical across pages.
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { fail(name, `invalid JSON-LD: ${e.message}`); continue; }
    if (data['@context'] !== 'https://schema.org') fail(name, 'JSON-LD missing @context');
    for (const node of data['@graph'] || [data]) {
      if (!node['@type']) fail(name, 'JSON-LD node without @type');
      if (node['@id'] && !node['@id'].startsWith(SITE_URL)) fail(name, `relative @id ${node['@id']}`);
      if (/aggregateRating|"review"/.test(JSON.stringify(node))) fail(name, 'self-serving review/rating markup found');
      if (node['@id']) {
        const s = JSON.stringify(node);
        if (ids.has(node['@id']) && ids.get(node['@id']) !== s) fail(name, `${node['@id']} differs between pages`);
        ids.set(node['@id'], s);
      }
      if (node['@type'] === 'BreadcrumbList') for (const li of node.itemListElement) if (!resolveLocal(li.item.slice(SITE_URL.length))) fail(name, `breadcrumb target missing: ${li.item}`);
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) fail(name, `img without alt: ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(name, `img without width/height: ${tag.slice(0, 80)}`);
    if (tag.includes('data:image')) fail(name, 'inline data: image');
    for (const s of (tag.match(/srcset="([^"]+)"/)?.[1] || '').split(',').map((x) => x.trim().split(' ')[0]).filter(Boolean)) if (!resolveLocal(s)) fail(name, `missing image ${s}`);
    const srcAttr = tag.match(/\ssrc="([^"]+)"/)?.[1];
    if (srcAttr && !resolveLocal(srcAttr)) fail(name, `missing image ${srcAttr}`);
  }

  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    if (!resolveLocal(m[1])) fail(name, `broken internal link ${m[1]}`);
    const hash = m[1].split('#')[1];
    if (hash) {
      const targetFile = join(dist, m[1].split('#')[0] || '/', m[1].split('#')[0].endsWith('.html') ? '' : 'index.html');
      const target = existsSync(targetFile) ? readFileSync(targetFile, 'utf8') : '';
      if (!new RegExp(`id="${hash}"`).test(target)) fail(name, `anchor #${hash} not found in ${m[1].split('#')[0] || '/'}`);
    }
  }
  for (const m of html.matchAll(/href="(#[^"]+)"/g)) if (!html.includes(`id="${m[1].slice(1)}"`)) fail(name, `in-page anchor ${m[1]} missing`);

  if (!noindex) {
    const bookLinks = html.split(BOOKING_URL).length - 1;
    if (bookLinks < 2) fail(name, `only ${bookLinks} booking links`);
    for (const m of html.matchAll(/<a [^>]*href="https:\/\/www\.fresha\.com[^"]*"[^>]*>/g)) {
      if (!m[0].includes(`href="${BOOKING_URL}"`)) fail(name, `unexpected Fresha URL: ${m[0]}`);
      if (!m[0].includes('rel="noopener"')) fail(name, 'external booking link without rel=noopener');
    }
    const body = text(html);
    if (!body.includes(business.phoneDisplay)) fail(name, 'phone number missing from page');
    if (!body.includes('142 King Street West')) fail(name, 'address missing from page');
  }
  if (/1,654|1,664/.test(html)) fail(name, 'hard-coded review count — use business.reviewFloor');
}

// Every published price must appear verbatim on the services page.
const servicesHtml = text(readFileSync(join(dist, 'services', 'index.html'), 'utf8'));
for (const cat of menu) for (const item of cat.items) {
  const needle = `${item.name} ${item.duration ? item.duration + ' ' : ''}${priceLabel(item)}`.replace(/&/g, '&');
  if (!servicesHtml.includes(needle)) fail('/services/', `price row not found: "${needle}"`);
}

// Sitemap ↔ pages
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = htmlFiles.filter((f) => !/<meta name="robots" content="noindex/.test(readFileSync(f, 'utf8'))).map((f) => SITE_URL + urlFor(f));
for (const u of indexable) if (!locs.includes(u)) fail('sitemap.xml', `missing ${u}`);
for (const u of locs) if (!indexable.includes(u)) fail('sitemap.xml', `lists non-indexable or missing page ${u}`);

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'blocks the whole site');
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail('robots.txt', 'missing sitemap reference');

// Every indexable page must be reachable through a plain <a href> from some other page.
const linked = new Set();
for (const f of htmlFiles) for (const m of readFileSync(f, 'utf8').matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) linked.add(m[1]);
for (const u of indexable) { const p = u.slice(SITE_URL.length); if (p !== '/' && !linked.has(p)) fail(p, 'orphan page — no internal links point to it'); }

console.log(`Checked ${htmlFiles.length} HTML files, ${locs.length} sitemap URLs, ${ids.size} JSON-LD entities.`);
for (const w of warnings) console.log('  warn  ' + w);
for (const e of errors) console.log('  ERROR ' + e);
if (errors.length) { console.log(`\n${errors.length} error(s).`); process.exit(1); }
console.log('All checks passed.');
