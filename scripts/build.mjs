// Zero-dependency static build: renders src/pages/*.mjs into dist/ with shared head, header and footer,
// fingerprints CSS/JS for long-term caching, and writes sitemap.xml, robots.txt and host config.
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_URL } from '../src/site.config.mjs';
import { head, header, footer, imageUrl } from '../src/layout.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });

const fingerprint = (file, ext) => {
  const content = readFileSync(join(src, 'assets', file));
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 10);
  const name = `${file.replace(/\.\w+$/, '')}.${hash}.${ext}`;
  writeFileSync(join(dist, 'assets', name), content);
  return `/assets/${name}`;
};
const assets = { css: fingerprint('styles.css', 'css'), js: fingerprint('site.js', 'js') };

cpSync(join(src, 'images'), join(dist, 'images'), { recursive: true, filter: (p) => !p.endsWith('manifest.json') });
cpSync(join(src, 'assets', 'favicon.svg'), join(dist, 'favicon.svg'));
cpSync(join(src, 'assets', 'icons'), dist, { recursive: true });
writeFileSync(join(dist, 'site.webmanifest'), JSON.stringify({
  name: 'Kairos Cuts',
  short_name: 'Kairos Cuts',
  start_url: '/',
  display: 'browser',
  background_color: '#0d0d0d',
  theme_color: '#0d0d0d',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

const manifest = JSON.parse(readFileSync(join(src, 'images', 'manifest.json'), 'utf8'));
const pageFiles = readdirSync(join(src, 'pages')).filter((f) => f.endsWith('.mjs'));
const pages = [];
for (const f of pageFiles) pages.push((await import(pathToFileURL(join(src, 'pages', f)).href)).default);

for (const page of pages) {
  let preload = '';
  if (page.preloadImage) {
    const m = manifest[page.preloadImage];
    const srcset = m.widths.map((w) => `${imageUrl(page.preloadImage, w)} ${w}w`).join(', ');
    preload = `<link rel="preload" as="image" href="${imageUrl(page.preloadImage, m.widths[1])}" imagesrcset="${srcset}" imagesizes="${page.preloadSizes}" fetchpriority="high" />`;
  }
  const html = head({ ...page, preload, assets }) + header(page.path) + page.body + footer(assets);
  const out = page.output ? join(dist, page.output) : join(dist, page.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html.replace(/\n{3,}/g, '\n\n'));
}

const today = new Date().toISOString().slice(0, 10);
const indexable = pages.filter((p) => !p.noindex).sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

// Netlify and Cloudflare Pages both read _redirects and _headers. Old Webflow URLs are 301'd to their closest equivalent.
writeFileSync(join(dist, '_redirects'), `# Old Webflow URLs
/old-home-2                 /            301
/thank-you                  /            301
/template-utilities/*       /            301
`);

writeFileSync(join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000

/404.html
  X-Robots-Tag: noindex
`);

console.log(`Built ${pages.length} pages → dist/ (${indexable.length} in sitemap)`);
console.log(`  css ${assets.css}\n  js  ${assets.js}`);
