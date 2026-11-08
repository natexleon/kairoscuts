import { business, barbers, reviews, MAPS_URL, INSTAGRAM_URL } from '../site.config.mjs';
import { img, bookAttrs, addressHtml, hoursList, barberCard, reviewCard, menuAccordion, closingCta, barbershopNode, websiteNode, webPageNode } from '../layout.mjs';

const path = '/';
const title = 'Kairos Cuts | Barbershop in Stoney Creek, Hamilton';
const description = "Book your next haircut at Kairos Cuts in Stoney Creek. Gentlemen's cuts $35, fades, beard trims and more. Seven barbers and convenient online booking.";
const barberName = Object.fromEntries(barbers.map((b) => [b.id, b.name]));

const igTiles = [
  ['haircut-in-progress-kairos-cuts', 'A haircut in progress at Kairos Cuts'],
  ['beard-trim-kairos-cuts', 'Beard work at Kairos Cuts'],
  ['locs-kairos-cuts', 'Locs at Kairos Cuts'],
  ['kairos-cuts-crew', 'The Kairos Cuts crew'],
  ['fade-kairos-cuts', 'Fade work at Kairos Cuts'],
  ['textured-styling-kairos-cuts', 'Textured styling at Kairos Cuts'],
  ['kairos-cuts-waiting-area', 'In the Kairos Cuts waiting area'],
  ['kairos-cuts-storefront-king-street-west-stoney-creek', 'The Kairos Cuts team outside the shop on King Street West in Stoney Creek'],
];

const body = `
<main id="main">

  <!-- Hero -->
  <div class="hero" data-section="hero">
    <div class="hero-bg" id="heroBg">${img('dee-owner-kairos-cuts-stoney-creek', { alt: 'Dee, owner and master barber, smiling inside Kairos Cuts in Stoney Creek', sizes: '(min-width: 1151px) 66vw, 100vw', priority: true })}</div>
    <div class="hero-shade"></div>
    <div class="hero-content">
      <a class="hero-award" href="#awards"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#laurel" /></svg><span>Fresha Best in Class · <b>2023 &amp; 2026</b></span></a>
      <h1 class="hero-title"><span class="ht-lead">More than a cut.</span><span class="ht-lead ht-blue">It's the</span><span class="ht-main">Kairos experience.</span></h1>
      <p class="hero-copy">Old-school craftsmanship. Genuine connections. A barbershop you'll keep coming back to.</p>
      <a class="hero-proof" href="#reviews"><span class="star" aria-hidden="true">★</span>${business.rating}<span class="sep" aria-hidden="true">·</span><span class="count">${business.reviewFloor} Reviews</span></a>
      <div class="hero-actions"><a class="btn hero-cta" ${bookAttrs}>Book a chair <span class="arr" aria-hidden="true">↗</span></a></div>
    </div>
    <div class="hero-caption">Dee — owner &amp; master barber, 35+ years behind the chair</div>
  </div>

  <!-- Scrolling wordmark -->
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <span>Kairos Cuts <i>—</i> Est. ${business.founded} <i>—</i>&nbsp;</span><span>Kairos Cuts <i>—</i> Est. ${business.founded} <i>—</i>&nbsp;</span>
    </div>
  </div>

  <!-- Services -->
  <section class="services" id="services" data-section="prices">
    <div class="wrap">
      <div class="head">
        <div>
          <p class="label rv">Services</p>
          <h2 class="big rv d1">Prices</h2>
        </div>
        <p class="rv d2">Men's haircuts, fades, beard trims and kids' cuts at our Stoney Creek barbershop. The price on this list is the price at the chair — pick your cut, pick your barber, book online.</p>
      </div>
      <div class="menu rv d1">${menuAccordion()}
      </div>
      <p class="note rv">Debit and credit transactions are subject to a processing fee. Cancellations online or by phone. Walk-ins welcome when a chair is free.</p>    </div>
  </section>

  <!-- Barbers -->
  <section class="barbers-sec" id="barbers" data-section="barbers">
    <div class="wrap">
      <p class="label rv">The Barbers</p>
      <h2 class="big rv d1">Pick your barber</h2>
      <p class="intro-copy rv d2">Ask for someone by name on Fresha, or take the first free chair. All seven cut at the same address in Stoney Creek.</p>
      <ul class="rail barber-rail rv d1" id="barberRail" tabindex="0" aria-label="Barbers — swipe to see all seven">
        ${barbers.map((b) => barberCard(b)).join('\n        ')}
      </ul>
      <div class="dots barber-dots" data-dots="barberRail" role="group" aria-label="Choose a barber card"></div>
      <div class="b-alt rv">
        <p>Not sure who to choose?</p>
        <a class="btn ghost" ${bookAttrs}>Book first available</a>
      </div>
    </div>
  </section>

  <!-- Reviews -->
  <section class="reviews-sec" id="reviews" data-section="reviews">
    <div class="wrap">
      <div class="rev-head">
        <div>
          <p class="label rv">Customer Reviews</p>
          <h2 class="big rv d1">Don't just take our word for it.</h2>
          <p class="rev-sub rv d2">${business.rating} <span class="star" aria-hidden="true">★</span><span class="sep" aria-hidden="true">·</span>${business.reviewFloor} Verified Reviews on Fresha</p>
        </div>
      </div>
      <ul class="rail rev-track" id="revTrack" tabindex="0" aria-label="Verified client reviews — swipe for more">
        ${reviews.map((r) => reviewCard(r, barberName[r.barber])).join('\n        ')}
      </ul>
      <div class="rev-controls">
        <p class="rev-count" aria-hidden="true"><b id="revIdx">01</b> / <span id="revTotal">${String(reviews.length).padStart(2, '0')}</span></p>
        <div class="rev-nav">
          <button type="button" id="revPrev" aria-label="Previous review">←</button>
          <button type="button" id="revNext" aria-label="Next review">→</button>
        </div>
      </div>
      <p class="rev-more"><a class="dir-link" ${bookAttrs}>More reviews on Fresha ↗</a></p>
    </div>
  </section>

  <!-- Showcase -->
  <section class="showcase" id="work" data-section="work">
    <div class="wrap">
      <p class="label center rv">The Work</p>
      <h2 class="big rv d1">Every hair type.<br />Every chair.</h2>
      <p class="rv d2">Dee has cut all hair types for 35+ years. Shia handles braids and locs, and the rest of the crew covers fades, beards, kids, and seniors — every day.</p>
      <ul class="rail gallery rv d2" id="workRail" tabindex="0" aria-label="Our work — swipe for more">
        <li><figure class="g-card">${img('fade-haircut-kairos-cuts', { alt: 'A barber finishing a fade haircut in the chair at Kairos Cuts', sizes: '(min-width: 761px) 33vw, 84vw' })}<figcaption><a class="g-title" href="/services/fade-haircuts/">Fade Haircut</a><span class="g-price">$40</span></figcaption></figure></li>
        <li><figure class="g-card">${img('gentlemens-haircut-kairos-cuts', { alt: "A finished gentlemen's haircut at Kairos Cuts", sizes: '(min-width: 761px) 33vw, 84vw' })}<figcaption><a class="g-title" href="/services/mens-haircuts/">Gentlemen's Haircut</a><span class="g-price">$35</span></figcaption></figure></li>
        <li><figure class="g-card">${img('locs-by-shia-kairos-cuts', { alt: 'Locs styled by Shia at Kairos Cuts', sizes: '(min-width: 761px) 33vw, 84vw' })}<figcaption><a class="g-title" href="/services/#braids-and-locs">Braids &amp; Locs</a><span class="g-note">With Shia</span></figcaption></figure></li>
      </ul>
      <div class="swipe-hint" aria-hidden="true"><span class="sh-bar"><span class="sh-thumb" id="workThumb"></span></span><span class="sh-label">Swipe →</span></div>
      <div class="cta-row rv"><a class="btn" ${bookAttrs}>Book</a></div>
    </div>
  </section>

  <!-- Awards -->
  <section class="awards-sec" id="awards" data-section="awards">
    <div class="wrap">
      <p class="label center rv">Recognition</p>
      <h2 class="big rv d1">Best in Class.<br /><span class="gold">Twice.</span></h2>
      <p class="lede rv d2">Two Best in Class awards. Thousands of cuts. A reputation built one client at a time.</p>
      <div class="medals">
        <div class="medal rv d1" role="img" aria-label="Fresha Best in Class 2023">
          <svg viewBox="0 0 200 200" aria-hidden="true"><use href="#laurel" /></svg>
          <div class="disc" aria-hidden="true"><span class="m-src">Fresha</span><span class="m-title">Best in<br />Class</span><span class="m-yr">2023</span><span class="m-stars">★★★★★</span></div>
        </div>
        <div class="medal rv d2" role="img" aria-label="Fresha Best in Class 2026">
          <svg viewBox="0 0 200 200" aria-hidden="true"><use href="#laurel" /></svg>
          <div class="disc" aria-hidden="true"><span class="m-src">Fresha</span><span class="m-title">Best in<br />Class</span><span class="m-yr">2026</span><span class="m-stars">★★★★★</span></div>
        </div>
      </div>
      <div class="award-note rv d3">
        <svg viewBox="0 0 200 200" aria-hidden="true"><use href="#laurel" /></svg>
        <span><span class="an-label">Fresha Highly Recommended</span><span class="an-year">2025</span></span>
      </div>
    </div>
  </section>

  <!-- Intro -->
  <section class="intro" id="about" data-section="about">
    <div class="wrap">
      <div class="scissors rv" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.2 7.8 20 19M8.2 16.2 20 5"/></svg>
      </div>
      <p class="label center rv">The Shop</p>
      <p class="lede rv d1">Seven barbers. One standard. Every haircut should be worth coming back for.</p>
      <p class="body rv d2">Kairos Cuts has been part of Stoney Creek since 2019. Owner Dee started cutting hair at 16, learning the craft under Big Ray and Mark T. in Mississauga. Today, seven barbers bring that same dedication to every cut, fade, beard, and style. Good people, great cuts, and a shop that feels like home.</p>
    </div>
  </section>

  <!-- Location -->
  <section class="location" id="visit" data-section="find-us">
    <div class="wrap">
      <p class="label rv">Your chair's waiting</p>
      <h2 class="big rv d1">Find Us</h2>
      <div class="loc-grid rv d1">
        <div class="loc-photo full">${img('kairos-cuts-team-stoney-creek-barbershop', { alt: 'The full Kairos Cuts crew seated on the couch inside the shop, with the Kairos Cuts floor logo in the foreground', sizes: '(min-width: 861px) 50vw, 100vw' })}</div>
        <div class="loc-panel">
          <p class="label">Stoney Creek</p>
          <h3>Kairos Cuts</h3>
          <a class="addr" href="${MAPS_URL}" target="_blank" rel="noopener">${addressHtml}</a>
          <p class="phone"><a href="tel:${business.phoneE164}">${business.phoneDisplay}</a><br /><a href="mailto:${business.email}">${business.email}</a></p>
          ${hoursList()}
          <div class="loc-actions">
            <a class="btn" ${bookAttrs}>Book</a>
            <a class="btn ghost" href="${MAPS_URL}" target="_blank" rel="noopener">Get directions</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Instagram -->
  <section id="instagram" data-section="instagram">
    <div class="wrap">
      <p class="label center rv">Follow the shop</p>
      <h2 class="big rv d1" style="text-align:center;">Instagram Feed</h2>
      <p class="rv d2" style="text-align:center;color:var(--muted);margin:16px auto 0;max-width:52ch;">Fresh cuts off the floor, posted as they happen.</p>
      <div class="ig-grid" id="igGrid">
        ${igTiles.map(([name, alt]) => `<a class="ig-tile" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">${img(name, { alt, sizes: '(min-width: 761px) 25vw, 50vw' })}<span class="veil">@kairoscuts</span></a>`).join('\n        ')}
      </div>
      <div class="ig-actions">
        <button type="button" class="btn ghost ig-more" id="igMore" aria-controls="igGrid">View more</button>
        <a class="dir-link" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Follow @kairoscuts ↗</a>
      </div>
    </div>
  </section>
${closingCta()}
</main>`;

export default {
  path,
  title,
  description,
  preloadImage: 'dee-owner-kairos-cuts-stoney-creek',
  preloadSizes: '(min-width: 1151px) 66vw, 100vw',
  jsonld: [barbershopNode(), websiteNode(), webPageNode({ path, title, description, image: 'dee-owner-kairos-cuts-stoney-creek', breadcrumb: false })],
  body,
};
