import { barbers, reviews, findService } from '../site.config.mjs';
import { img, bookAttrs, priceRows, pageHead, closingCta, faqHtml, faqNode, reviewCard, barbershopNode, websiteNode, webPageNode, breadcrumbNode, serviceNode } from '../layout.mjs';

const path = '/services/fade-haircuts/';
const title = 'Fade Haircuts in Stoney Creek | Kairos Cuts Barbershop';
const description = "Fade haircuts at Kairos Cuts in Stoney Creek, Hamilton: $40 for a 45–60 minute appointment, or $45 with a beard. Young Man's Fade $38. Book your barber online.";
const crumbs = [['/', 'Home'], ['/services/', 'Services'], [path, 'Fade haircuts']];
const barberName = Object.fromEntries(barbers.map((b) => [b.id, b.name]));

const items = ['Fade Haircut', 'Fade + Beard', "Young Man's Fade", 'Line Up'].map(findService);
const fadeReviews = reviews.filter((r) => r.service === 'Fade Haircut');

const faqs = [
  ['How much is a fade at Kairos Cuts?', 'A Fade Haircut is $40 (CAD). A Fade + Beard is $45, and a Young Man\'s Fade is $38.'],
  ['How long does a fade take?', 'A Fade Haircut is booked for 45 minutes to 1 hour. A Fade + Beard is booked for 1 hour 15 minutes.'],
  ['Can I get my beard done with my fade?', 'Yes — book the Fade + Beard ($45) so both are covered in one appointment.'],
  ['Do you do fades for teens?', "Yes. The Young Man's Fade is $38 and sits with the shop's young gentlemen services."],
  ['How do I book a fade with a specific barber?', 'Choose Fade Haircut on Fresha, then pick your barber and time. You can also take the first available barber.'],
];

const body = `
<main id="main">
${pageHead({
  crumbs,
  label: 'Fade haircuts',
  title: 'Fade haircuts in Stoney Creek',
  lede: 'Clean fades at Kairos Cuts, booked for 45 minutes to an hour so the blend gets the time it needs. $40 for a fade, or $45 with your beard done in the same appointment.',
  facts: `<ul class="facts"><li>Fade <b>$40</b></li><li><b>45 min – 1 hr</b></li><li>Fade + beard <b>$45</b></li></ul>`,
  actions: `<a class="btn" ${bookAttrs}>Book a fade</a><a class="dir-link" href="/services/mens-haircuts/">Prefer a classic cut? →</a>`,
})}

  <section class="block" data-section="what">
    <div class="wrap split">
      <div class="prose">
        <p class="label">The cut</p>
        <h2>What is a fade?</h2>
        <p>A fade takes the hair on the sides and back from very short to longer as it moves up the head, with no hard line where the lengths meet. The length on top can stay long, short or anywhere in between.</p>
        <p>The main choices are how high the fade starts and how short it goes at the bottom. A lower fade keeps more length around the sides; a higher one gives a sharper contrast with the top.</p>
        <h3 style="margin-top:28px;">Getting the fade you want</h3>
        <ul>
          <li>Say where you want the fade to start and how short you want it at the bottom.</li>
          <li>Bring a photo of a fade you like — it's the quickest way to agree on the look.</li>
          <li>Ask about the top too: length, texture and whether you want a part or line up.</li>
        </ul>
      </div>
      <div class="photo-pair">
        <figure>${img('fade-haircut-kairos-cuts', { alt: 'A barber finishing a fade haircut in the chair at Kairos Cuts', sizes: '(min-width: 861px) 22vw, 46vw' })}<figcaption>Fade in progress</figcaption></figure>
        <figure>${img('fade-kairos-cuts', { alt: 'A finished fade at Kairos Cuts', sizes: '(min-width: 861px) 22vw, 46vw' })}<figcaption>Finished fade</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="block alt" data-section="prices">
    <div class="wrap">
      <p class="label">Prices</p>
      <h2>Fade prices &amp; times</h2>
      <div class="menu-block"><ul class="price-list">
        ${priceRows(items)}
      </ul></div>
      <p class="note" style="margin-top:20px;">Prices in Canadian dollars. Debit and credit transactions are subject to a processing fee. See the <a class="inline-link" href="/services/">full menu</a> for every service.</p>
      <div class="page-actions"><a class="btn" ${bookAttrs}>Book a fade + beard</a></div>
    </div>
  </section>

  <section class="block" data-section="reviews">
    <div class="wrap">
      <p class="label">From the chair</p>
      <h2>What fade clients say</h2>
      <ul class="rev-grid">
        ${fadeReviews.map((r) => reviewCard(r, barberName[r.barber])).join('\n        ')}
      </ul>
      <p class="note" style="margin-top:20px;">These verified Fresha reviews are from fade appointments with Joban. You can book a fade with any barber — <a class="inline-link" href="/barbers/">meet the team</a>.</p>
    </div>
  </section>

  <section class="block alt" data-section="faq">
    <div class="wrap">
      <p class="label">Questions</p>
      <h2>Fade haircut FAQ</h2>
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
    webPageNode({ path, title, description, image: 'fade-haircut-kairos-cuts' }),
    breadcrumbNode(path, crumbs),
    serviceNode({ path, name: 'Fade haircuts', serviceType: 'Fade haircut', description: 'Fade haircuts at Kairos Cuts in Stoney Creek, with fade and beard combinations and fades for young men.', items }),
    faqNode(path, faqs),
  ],
  body,
};
