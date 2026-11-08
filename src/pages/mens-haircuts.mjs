import { business, barbers, reviews, findService, MAPS_URL } from '../site.config.mjs';
import { img, bookAttrs, priceRows, pageHead, closingCta, faqHtml, faqNode, reviewCard, hoursList, addressHtml, barbershopNode, websiteNode, webPageNode, breadcrumbNode, serviceNode } from '../layout.mjs';

const path = '/services/mens-haircuts/';
const title = "Men's Haircuts in Stoney Creek | Kairos Cuts Barbershop";
const description = "Gentlemen's haircuts for $35 at Kairos Cuts in Stoney Creek, Hamilton. Classic, scissors-only, buzz and senior cuts from seven barbers. Book your barber online.";
const crumbs = [['/', 'Home'], ['/services/', 'Services'], [path, "Men's haircuts"]];
const barberName = Object.fromEntries(barbers.map((b) => [b.id, b.name]));

const items = ["Gentlemen's Haircut", 'Scissors Only', 'Buzz Cut, 1 Level', 'Senior Cut', 'Cut & Design', 'Apprentice Cut', "Gentleman's Haircut + Beard"].map(findService);
const featured = reviews.filter((r) => /Gentlemen's Haircut|Seniors Haircut/.test(r.service)).slice(0, 3);

const faqs = [
  ["How much is a men's haircut at Kairos Cuts?", "A Gentlemen's Haircut is $35 (CAD). Other options include Scissors Only for $45, a Buzz Cut (one level) for $27, a Senior Cut for $28 and an Apprentice Cut for $25."],
  ["How long does a gentlemen's haircut take?", "A Gentlemen's Haircut is booked as a 45-minute appointment. Adding a beard makes it a 45-minute to 1 hour 15 minute appointment for $40."],
  ['Can I choose my barber?', 'Yes. When you book on Fresha you can pick a specific barber, or take the first available chair.'],
  ['Do you take walk-ins?', 'Walk-ins are welcome when a chair is free. Booking online is the surest way to get the time and barber you want.'],
  ['Do you cut hair for seniors?', 'Yes. A Senior Cut is $28.'],
];

const body = `
<main id="main">
${pageHead({
  crumbs,
  label: "Men's haircuts",
  title: "Men's haircuts in Stoney Creek",
  lede: "A gentlemen's haircut at Kairos Cuts is booked as a full 45-minute appointment, so there's time to talk through the cut before the clippers come out. Seven barbers, one shop on King Street West, and prices that are the price at the chair.",
  facts: `<ul class="facts"><li>Gentlemen's cut <b>$35</b></li><li><b>45 min</b> appointment</li><li>${business.rating} ★ · <b>${business.reviewFloor}</b> reviews</li></ul>`,
  actions: `<a class="btn" ${bookAttrs}>Book a haircut</a><a class="dir-link" href="/services/fade-haircuts/">Looking for a fade? →</a>`,
})}

  <section class="block" data-section="options">
    <div class="wrap split">
      <div>
        <p class="label">Options &amp; prices</p>
        <h2>Haircut options</h2>
        <div class="menu-block"><ul class="price-list">
          ${priceRows(items)}
        </ul></div>
        <p class="note" style="margin-top:20px;">Prices in Canadian dollars. Want a fade instead? See <a class="inline-link" href="/services/fade-haircuts/">fade haircuts</a> ($40). Beard-only work and more on the <a class="inline-link" href="/services/#beard">full menu</a>.</p>
      </div>
      <div class="photo-pair">
        <figure>${img('gentlemens-haircut-kairos-cuts', { alt: "A finished gentlemen's haircut at Kairos Cuts", sizes: '(min-width: 861px) 22vw, 46vw' })}<figcaption>Gentlemen's haircut</figcaption></figure>
        <figure>${img('haircut-in-progress-kairos-cuts', { alt: 'A barber working on a haircut at Kairos Cuts', sizes: '(min-width: 861px) 22vw, 46vw' })}<figcaption>In the chair</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="block alt" data-section="why">
    <div class="wrap">
      <p class="label">Why Kairos Cuts</p>
      <h2>What clients come back for</h2>
      <div class="prose">
        <ul>
          <li><strong>Time in the chair.</strong> Gentlemen's haircuts are booked for 45 minutes, not squeezed in.</li>
          <li><strong>Experience.</strong> Owner Dee has cut all hair types for 35+ years, after starting as an apprentice at 16.</li>
          <li><strong>Reputation.</strong> Rated ${business.rating} on Fresha from ${business.reviewFloor} verified reviews, with Fresha Best in Class awards in 2023 and 2026.</li>
          <li><strong>Choice.</strong> Seven barbers at one address — <a href="/barbers/">book with someone by name</a> or take the first free chair.</li>
        </ul>
      </div>
      <ul class="rev-grid">
        ${featured.map((r) => reviewCard(r, barberName[r.barber])).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="block" data-section="expect">
    <div class="wrap">
      <p class="label">Your appointment</p>
      <h2>What to expect</h2>
      <ol class="steps">
        <li><span><strong>Book online</strong>Pick your service, your barber and a time on Fresha — or walk in when a chair is free.</span></li>
        <li><span><strong>Arrive at the shop</strong>142 King Street West, Unit 1, in Stoney Creek.</span></li>
        <li><span><strong>Talk it through</strong>Tell your barber what you want before they start. A reference photo helps.</span></li>
        <li><span><strong>Pay at the chair</strong>The listed price is the price. Debit and credit transactions carry a processing fee.</span></li>
      </ol>
    </div>
  </section>

  <section class="block alt" data-section="visit">
    <div class="wrap">
      <p class="label">Visit</p>
      <h2>Hours &amp; location</h2>
      <div class="visit-card">
        <div><h3>Address</h3><p><a href="${MAPS_URL}" target="_blank" rel="noopener">${addressHtml}</a></p></div>
        <div><h3>Hours</h3>${hoursList()}</div>
        <div><h3>Contact</h3><p><a href="tel:${business.phoneE164}">${business.phoneDisplay}</a><br /><a href="mailto:${business.email}">${business.email}</a></p></div>
      </div>
    </div>
  </section>

  <section class="block" data-section="faq">
    <div class="wrap">
      <p class="label">Questions</p>
      <h2>Men's haircut FAQ</h2>
      ${faqHtml(faqs)}
    </div>
  </section>
${closingCta()}
</main>`;

export default {
  path,
  title,
  description,
  jsonld: [
    barbershopNode(), websiteNode(),
    webPageNode({ path, title, description, image: 'gentlemens-haircut-kairos-cuts' }),
    breadcrumbNode(path, crumbs),
    serviceNode({ path, name: "Men's haircuts", serviceType: "Men's haircut", description: "Gentlemen's haircuts, scissors-only cuts, buzz cuts, senior cuts and custom cut designs at Kairos Cuts in Stoney Creek.", items }),
    faqNode(path, faqs),
  ],
  body,
};
