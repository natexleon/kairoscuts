import { business, menu, barbers } from '../site.config.mjs';
import { img, bookAttrs, bookAttrsFor, priceRows, pageHead, closingCta, faqHtml, faqNode, barbershopNode, websiteNode, webPageNode, breadcrumbNode, addressText } from '../layout.mjs';

const path = '/services/';
const title = 'Barber Services & Prices | Kairos Cuts, Stoney Creek';
const description = "The full Kairos Cuts menu: gentlemen's cuts $35, fades $40, beard trims $25 and kids' cuts $30 (CAD). Stoney Creek barbershop with online booking.";
const crumbs = [['/', 'Home'], ['/services/', 'Services & prices']];

const catCopy = {
  'signature-cuts': `Classic gentlemen's cuts, <a href="/services/fade-haircuts/">fades</a>, scissors-only cuts, buzz cuts, senior cuts and custom designs. More on our <a href="/services/mens-haircuts/">men's haircuts</a> page.`,
  'hair-and-beard': 'Beard work on its own, or booked together with a haircut or fade in one appointment.',
  'young-gentlemen': "Haircuts for kids of all ages, plus cuts and fades for young men aged 10 to 15.",
  'finishing-touches': 'Line ups, shampoo, conditioner and hot towel services.',
};
const catIds = { 'hair-and-beard': 'beard', 'young-gentlemen': 'kids' };

const faqs = [
  ["How much is a men's haircut at Kairos Cuts?", "A Gentlemen's Haircut is $35 for a 45-minute appointment. A Fade Haircut is $40, Scissors Only is $45, and a Buzz Cut (one level) is $27. All prices are in Canadian dollars."],
  ['Does Kairos Cuts do beard trims?', 'Yes. A Beard service is $25 for 30 minutes. You can also book a Gentleman\'s Haircut + Beard for $40 or a Fade + Beard for $45.'],
  ["Does Kairos Cuts cut kids' hair?", "Yes. A Kids Haircut is $30 and is for all ages (30–45 minutes). Young men aged 10 to 15 can book a Young Man's Basic Cut for $30 or a Young Man's Fade for $38."],
  ['Who does braids and hairstyling at Kairos Cuts?', "Shia is the shop's hairstylist and braid specialist. Shia's services aren't on the published price list — see options and availability on Shia's own booking page, or call the shop."],
  ['Can I book online or walk in?', `You can book any service and choose your barber online through Fresha, or call ${business.phoneDisplay}. Walk-ins are welcome when a chair is free.`],
  ['Is there a fee for paying by card?', 'Debit and credit transactions are subject to a processing fee. Cancellations can be made online or by phone.'],
];

const body = `
<main id="main">
${pageHead({
  crumbs,
  label: 'Services',
  title: 'Barbershop services &amp; prices',
  lede: `Every service at Kairos Cuts, ${addressText}, with published prices in Canadian dollars. The price listed is the price at the chair.`,
  facts: `<ul class="facts"><li>Gentlemen's cut <b>$35</b></li><li>Fades <b>$40</b></li><li>Beard <b>$25</b></li><li>Kids <b>$30</b></li></ul>`,
  actions: `<a class="btn" ${bookAttrs}>Book online</a><a class="dir-link" href="tel:${business.phoneE164}">Call ${business.phoneDisplay}</a>`,
})}

  <section class="block" data-section="menu">
    <div class="wrap">
      <p class="label">Menu</p>
      <h2>Full price list</h2>
      ${menu.map((cat) => `
      <div class="menu-block" id="${catIds[cat.id] || cat.id}">
        <h3>${cat.title}</h3>
        <p class="cat-desc">${catCopy[cat.id]}</p>
        <ul class="price-list">
          ${priceRows(cat.items)}
        </ul>
      </div>`).join('')}
      <p class="note" style="margin-top:28px;">Debit and credit transactions are subject to a processing fee. Cancellations online or by phone. Walk-ins welcome when a chair is free.</p>
    </div>
  </section>

  <section class="block alt" id="braids-and-styling" data-section="braids-and-styling">
    <div class="wrap split">
      <div class="prose">
        <p class="label">Braids &amp; styling</p>
        <h2>Braiding and hairstyling with Shia</h2>
        <p>Shia specializes in professional braiding and hairstyling, creating customized looks for every client. With attention to detail and a passion for hair, Shia provides a comfortable, high-quality experience that leaves you feeling confident and refreshed.</p>
        <p>Shia's services aren't part of the published price list above and are booked separately. See the options and availability on Shia's booking page, or call the shop at <a href="tel:${business.phoneE164}">${business.phoneDisplay}</a>.</p>
        <div class="page-actions"><a class="btn" ${bookAttrsFor(barbers.find((b) => b.id === 'shia'))}>Book with Shia</a><a class="dir-link" href="/barbers/#shia">About Shia →</a></div>
      </div>
      <div class="photo-pair">
        <figure>${img('shia-hairstyling-kairos-cuts', { alt: "Shia styling a client's hair at Kairos Cuts", sizes: '(min-width: 861px) 22vw, 46vw' })}</figure>
        <figure>${img('shia-styling-client-kairos-cuts', { alt: "Shia working with a client in the chair at Kairos Cuts", sizes: '(min-width: 861px) 22vw, 46vw' })}</figure>
      </div>
    </div>
  </section>

  <section class="block" data-section="faq">
    <div class="wrap">
      <p class="label">Questions</p>
      <h2>Services FAQ</h2>
      ${faqHtml(faqs)}
    </div>
  </section>

  <section class="block alt" data-section="related">
    <div class="wrap">
      <p class="label">Keep exploring</p>
      <h2>Find the right cut</h2>
      <ul class="link-cards">
        <li><a href="/services/mens-haircuts/"><span class="lc-title">Men's haircuts</span><span class="lc-text">Gentlemen's cuts, scissors-only, buzz and senior cuts.</span><span class="lc-go">From $25 →</span></a></li>
        <li><a href="/services/fade-haircuts/"><span class="lc-title">Fade haircuts</span><span class="lc-text">$40 fades, or $45 with a beard, booked by the hour.</span><span class="lc-go">From $38 →</span></a></li>
        <li><a href="/barbers/"><span class="lc-title">Our barbers</span><span class="lc-text">Meet Dee and the team, and book with someone by name.</span><span class="lc-go">Meet the team →</span></a></li>
      </ul>
    </div>
  </section>
${closingCta()}
</main>`;

export default {
  path,
  title,
  description,
  jsonld: [barbershopNode(), websiteNode(), webPageNode({ path, title, description, image: 'gentlemens-haircut-kairos-cuts' }), breadcrumbNode(path, crumbs), faqNode(path, faqs)],
  body,
};
