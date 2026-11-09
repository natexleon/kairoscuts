import { readFileSync } from 'node:fs';
import { SITE_URL, GOOGLE_SITE_VERIFICATION, BOOKING_URL, INSTAGRAM_URL, MAPS_URL, business, menu, priceLabel } from './site.config.mjs';

const manifest = JSON.parse(readFileSync(new URL('./images/manifest.json', import.meta.url), 'utf8'));

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const abs = (path) => SITE_URL + path;
export const imageUrl = (name, width) => `/images/${name}-${width ?? manifest[name].widths.at(-1)}.jpg`;

// Responsive <img>. Width/height come from the original photo so the browser reserves space (no layout shift).
export function img(name, { alt, sizes = '100vw', cls = '', priority = false, attrs = '' }) {
  const m = manifest[name];
  if (!m) throw new Error(`No image named ${name}`);
  if (alt === undefined) throw new Error(`Missing alt for ${name}`);
  const srcset = m.widths.map((w) => `${imageUrl(name, w)} ${w}w`).join(', ');
  const fallback = imageUrl(name, m.widths[Math.min(1, m.widths.length - 1)]);
  const loading = priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  return `<img${cls ? ` class="${cls}"` : ''} src="${fallback}" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${loading}${attrs ? ' ' + attrs : ''} />`;
}

export const bookAttrs = `href="${BOOKING_URL}" target="_blank" rel="noopener"`;
export const bookAttrsFor = (barber) => barber?.bookingUrl ? `href="${barber.bookingUrl}" target="_blank" rel="noopener"` : bookAttrs;

const addressLines = `${business.address.street}<br />${business.address.locality}, ${business.address.city}, <span class="nw">${business.address.region} ${business.address.postalCode}</span>`;
export const addressHtml = addressLines;
export const addressText = `${business.address.street}, ${business.address.locality}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`;

export const hoursList = (cls = 'hours') => `<ul class="${cls}">${business.hours.map((h) => `<li><span>${h.label}</span><span>${h.display}</span></li>`).join('')}</ul>`;

export const priceRows = (items) => items.map((i) => `<li><span class="name">${esc(i.name)}${i.duration ? ` <small>${esc(i.duration)}</small>` : ''}</span><span class="amt">${esc(priceLabel(i))}</span></li>`).join('\n');

const NAV = [
  ['/services/', 'Services'],
  ['/barbers/', 'Barbers'],
  ['/#reviews', 'Reviews'],
  ['/#about', 'The Shop'],
  ['/#visit', 'Visit'],
];

export function head({ path, title, description, jsonld = [], noindex = false, preload = '', assets }) {
  const url = abs(path);
  const ogImg = abs('/images/og-kairos-cuts-stoney-creek.jpg');
  const graph = jsonld.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonld })}</script>` : '';
  return `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="color-scheme" content="dark" />
<meta name="theme-color" content="#0d0d0d" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
${noindex ? '<meta name="robots" content="noindex, follow" />' : `<link rel="canonical" href="${url}" />`}
${GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(GOOGLE_SITE_VERIFICATION)}" />` : ''}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Kairos Cuts" />
<meta property="og:locale" content="en_CA" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${ogImg}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="The Kairos Cuts team outside the barbershop on King Street West in Stoney Creek" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
${preload}
<link rel="stylesheet" href="${assets.css}" />
${graph}
</head>
<body>
${LAUREL_DEFS}
<a class="skip-link" href="#main">Skip to content</a>`;
}

export function header(path) {
  const links = NAV.map(([href, label]) => {
    const current = href === path || (href !== '/' && !href.includes('#') && path.startsWith(href));
    return `<a href="${href}"${current ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('\n      ');
  return `
<header class="site" id="siteHeader">
  <div class="header-in">
    <a class="brand" href="/" aria-label="Kairos Cuts — home">Kairos <em>Cuts</em><small>Stoney Creek</small></a>
    <nav class="main" aria-label="Main">
      ${links}
    </nav>
    <a class="header-book" ${bookAttrs} data-section="header">Book</a>
  </div>
</header>`;
}

export function closingCta() {
  return `
  <section class="closing" aria-labelledby="closingTitle" data-section="closing-cta">
    <div class="wrap">
      <h2 class="closing-title" id="closingTitle">Your next great cut starts here.</h2>
      <p>Seven barbers. One standard. Your chair is waiting.</p>
      <a class="btn-light" ${bookAttrs}>Book a chair <span class="arr" aria-hidden="true">↗</span></a>
    </div>
  </section>`;
}

export function footer(assets) {
  return `
<footer class="site" data-section="footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-brand">Kairos <em>Cuts</em></div>
        <p>Barbershop in Stoney Creek, Hamilton, since ${business.founded}. Seven barbers, one standard.</p>
      </div>
      <div>
        <h2>Visit</h2>
        <p><a href="${MAPS_URL}" target="_blank" rel="noopener">${addressLines}</a></p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="/services/">Services &amp; prices</a></li>
          <li><a href="/services/mens-haircuts/">Men's haircuts</a></li>
          <li><a href="/services/fade-haircuts/">Fade haircuts</a></li>
          <li><a href="/barbers/">Our barbers</a></li>
          <li><a href="/#reviews">Reviews</a></li>
          <li><a href="/#visit">Hours &amp; location</a></li>
        </ul>
      </div>
      <div>
        <h2>Contact &amp; Book</h2>
        <ul>
          <li><a href="tel:${business.phoneE164}">${business.phoneDisplay}</a></li>
          <li><a href="mailto:${business.email}">${business.email}</a></li>
          <li><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">@kairoscuts</a></li>
          <li style="margin-top:10px;"><a ${bookAttrs} style="color:var(--blue-bright);font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:13px;">Book on Fresha →</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot-strip">
    <div class="tag"><span>More than a cut</span><span>Est. ${business.founded} · Stoney Creek</span><span>© <span id="year">2026</span> Kairos Cuts</span></div>
    <div class="giant" aria-hidden="true">Kairos</div>
  </div>
</footer>
<script src="${assets.js}" defer></script>
</body>
</html>
`;
}

export function pageHead({ crumbs, label, title, lede, actions = '', facts = '' }) {
  const items = crumbs.map(([href, name], i) => i === crumbs.length - 1
    ? `<li><span aria-current="page">${name}</span></li>`
    : `<li><a href="${href}">${name}</a></li>`).join('');
  return `
  <section class="page-head" data-section="page-head">
    <div class="wrap">
      <nav aria-label="Breadcrumb"><ol class="crumbs">${items}</ol></nav>
      <p class="label">${label}</p>
      <h1 class="page-title">${title}</h1>
      <p class="page-lede">${lede}</p>
      ${facts}
      <div class="page-actions">${actions}</div>
    </div>
  </section>`;
}

/* ---------- Shared components ---------- */

export function barberCard(b, { sizes = '(min-width: 900px) 25vw, 86vw' } = {}) {
  const rate = b.rated ? `<span class="brate"><span class="stars" aria-hidden="true">★★★★★</span> ${business.rating}${b.extra ? ` · ${b.extra}` : ''}</span>` : (b.extra ? `<span class="brate">${b.extra}</span>` : '');
  return `<li data-label="${b.name}"><article class="bcard">
          <div class="photo">${img(b.image, { alt: b.alt, sizes })}<div class="bname"><a href="/barbers/#${b.id}">${b.name}</a></div></div>
          <div class="bmeta"><span class="brole">${b.role}</span>${rate}<a class="book" ${bookAttrsFor(b)}>Book with ${b.name}</a></div>
        </article></li>`;
}

export function reviewCard(r, barberName) {
  return `<li><article class="rev-card"><div class="rstars" aria-label="5 out of 5 stars">★★★★★<b>5.0</b></div><p>${esc(r.text)}</p><div class="rwho"><strong>${esc(r.who)}</strong> · ${esc(r.service)} with ${barberName}</div></article></li>`;
}

export function menuAccordion() {
  return menu.map((cat, i) => `
        <details class="menu-cat" name="price-menu">
          <summary><span class="mc-num">${String(i + 1).padStart(2, '0')}</span><span class="mc-head"><span class="mc-title">${esc(cat.title)}</span><span class="mc-meta">${cat.items.length} services · From <b>$${cat.from}</b></span></span><span class="mc-icon" aria-hidden="true"></span></summary>
          <ul class="price-list">
            ${priceRows(cat.items)}
          </ul>
        </details>`).join('');
}

/* ---------- Structured data ---------- */

export const ORG_ID = abs('/#barbershop');
export const WEBSITE_ID = abs('/#website');

function offerFor(item) {
  const offer = { '@type': 'Offer', priceCurrency: 'CAD', itemOffered: { '@type': 'Service', name: item.name } };
  if (item.andUp) offer.priceSpecification = { '@type': 'PriceSpecification', minPrice: item.price, priceCurrency: 'CAD' };
  else offer.price = item.price;
  return offer;
}

const DAY_MAP = { Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday', Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday' };

export function barbershopNode() {
  return {
    '@type': 'BarberShop',
    '@id': ORG_ID,
    name: business.name,
    url: abs('/'),
    description: 'Barbershop in Stoney Creek, Hamilton, Ontario, established in 2019. Men\'s haircuts, fades, beard trims, kids\' cuts, and braiding and hairstyling, with online booking through Fresha.',
    image: [abs('/images/og-kairos-cuts-stoney-creek.jpg'), abs(imageUrl('kairos-cuts-team-stoney-creek-barbershop')), abs(imageUrl('dee-owner-kairos-cuts-stoney-creek'))],
    telephone: business.phoneE164,
    email: business.email,
    foundingDate: business.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    hasMap: MAPS_URL,
    areaServed: [{ '@type': 'Place', name: 'Stoney Creek, Hamilton, Ontario' }, { '@type': 'City', name: 'Hamilton' }],
    openingHoursSpecification: business.hours.filter((h) => !h.closed).map((h) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: h.days.map((d) => DAY_MAP[d]), opens: h.opens, closes: h.closes,
    })),
    priceRange: 'CA$5–CA$55+',
    currenciesAccepted: 'CAD',
    award: business.awards,
    sameAs: [INSTAGRAM_URL, BOOKING_URL],
    potentialAction: { '@type': 'ReserveAction', target: { '@type': 'EntryPoint', urlTemplate: BOOKING_URL, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] } },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Kairos Cuts services',
      itemListElement: menu.map((cat) => ({ '@type': 'OfferCatalog', name: cat.title, itemListElement: cat.items.map(offerFor) })),
    },
  };
}

export function websiteNode() {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: abs('/'), name: 'Kairos Cuts', inLanguage: 'en-CA', publisher: { '@id': ORG_ID } };
}

export function webPageNode({ path, title, description, type = 'WebPage', image, breadcrumb = true }) {
  const node = { '@type': type, '@id': abs(path) + '#webpage', url: abs(path), name: title, description, inLanguage: 'en-CA', isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORG_ID } };
  if (image) node.primaryImageOfPage = { '@type': 'ImageObject', url: abs(imageUrl(image)) };
  if (breadcrumb) node.breadcrumb = { '@id': abs(path) + '#breadcrumb' };
  return node;
}

export function breadcrumbNode(path, crumbs) {
  return {
    '@type': 'BreadcrumbList', '@id': abs(path) + '#breadcrumb',
    itemListElement: crumbs.map(([href, name], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(href) })),
  };
}

export function serviceNode({ path, name, serviceType, description, items }) {
  return {
    '@type': 'Service', '@id': abs(path) + '#service', name, serviceType, description,
    provider: { '@id': ORG_ID }, areaServed: { '@type': 'Place', name: 'Stoney Creek, Hamilton, Ontario' },
    offers: items.map(offerFor),
  };
}

export function faqNode(path, faqs) {
  return {
    '@type': 'FAQPage', '@id': abs(path) + '#faq',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
  };
}

export function faqHtml(faqs) {
  return `<div class="faq">${faqs.map(([q, a]) => `<div class="faq-item"><h3>${q}</h3><p>${a}</p></div>`).join('')}</div>`;
}

const LAUREL_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <g id="laurel-leaf">
      <ellipse cx="100" cy="16" rx="4.2" ry="10.5" transform="rotate(58 100 16)" />
      <ellipse cx="100" cy="32" rx="4.2" ry="10.5" transform="rotate(122 100 32)" opacity=".8" />
    </g>
    <g id="laurel-half" fill="currentColor">
      <path d="M86.8 174.8A76 76 0 0 1 49.2 43.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
      <use href="#laurel-leaf" transform="rotate(198 100 100)" />
      <use href="#laurel-leaf" transform="rotate(218 100 100)" />
      <use href="#laurel-leaf" transform="rotate(238 100 100)" />
      <use href="#laurel-leaf" transform="rotate(258 100 100)" />
      <use href="#laurel-leaf" transform="rotate(278 100 100)" />
      <use href="#laurel-leaf" transform="rotate(298 100 100)" />
      <use href="#laurel-leaf" transform="rotate(316 100 100)" />
      <ellipse cx="106" cy="24" rx="3.8" ry="9.5" transform="rotate(326 100 100) rotate(90 106 24)" />
    </g>
    <g id="laurel">
      <use href="#laurel-half" />
      <use href="#laurel-half" transform="translate(200 0) scale(-1 1)" />
    </g>
  </defs>
</svg>`;
