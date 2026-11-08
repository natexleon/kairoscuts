import { business, barbers, reviews } from '../site.config.mjs';
import { img, esc, bookAttrs, pageHead, closingCta, barbershopNode, websiteNode, webPageNode, breadcrumbNode } from '../layout.mjs';

const path = '/barbers/';
const title = 'Our Barbers | Kairos Cuts Barbershop, Stoney Creek';
const description = 'Meet the seven barbers at Kairos Cuts in Stoney Creek: owner and master barber Dee, Tiago, Joban, Dami, Shia, Shi and Dante. Book with your barber online.';
const crumbs = [['/', 'Home'], ['/barbers/', 'Barbers']];

// Only facts published by the shop (its websites and Fresha) — nothing inferred.
const bios = {
  dee: `Dee owns Kairos Cuts and has been cutting all hair types for 35+ years. He started at 16 as an apprentice under Big Ray and Mark T. at Trinbago Barber Shop in Mississauga, learning old-school technique he still uses today, blended with newer styles.`,
  tiago: 'Tiago is one of the shop\'s senior barbers.',
  joban: 'Joban is one of the shop\'s senior barbers. His verified reviews include fade haircuts and cut-and-beard appointments.',
  dami: 'Dami is a barber at Kairos Cuts.',
  shia: `Shia is the shop's braid and loc specialist. Braids and locs aren't on the published price list, so check Shia's services on Fresha. <a href="/services/#braids-and-locs">More on braids &amp; locs</a>.`,
  shi: 'Shi is an apprentice barber on the Kairos Cuts team.',
  dante: 'Dante is an apprentice barber on the Kairos Cuts team.',
};
const quoteFor = { dee: 'Sher L', tiago: 'Riley L', joban: 'Parm G', dami: 'Paul A' };

const profile = (b) => {
  const r = reviews.find((x) => x.who === quoteFor[b.id]);
  return `
      <article class="profile" id="${b.id}">
        <div class="p-photo">${img(b.image, { alt: b.alt, sizes: '(min-width: 701px) 300px, 340px' })}</div>
        <div class="prose">
          <h2>${b.name}</h2>
          <p class="p-role">${b.role}</p>
          ${b.rated ? `<p class="p-rate"><span class="stars" aria-hidden="true">★★★★★</span> Rated ${business.rating} on Fresha</p>` : ''}
          <p>${bios[b.id]}</p>
          ${r ? `<blockquote><p style="margin:0;color:var(--bone);">“${esc(r.text)}”</p><footer>${esc(r.who)} · ${esc(r.service)}</footer></blockquote>` : ''}
          <div class="page-actions"><a class="btn" ${bookAttrs}>Book with ${b.name}</a></div>
        </div>
      </article>`;
};

const body = `
<main id="main">
${pageHead({
  crumbs,
  label: 'The barbers',
  title: 'Meet the barbers',
  lede: `Seven barbers work the floor at Kairos Cuts in Stoney Creek, led by owner and master barber Dee. Book with someone by name on Fresha, or take the first free chair.`,
  actions: `<a class="btn" ${bookAttrs}>Book first available</a><a class="dir-link" href="/services/">See services &amp; prices →</a>`,
})}

  <section class="block" data-section="profiles">
    <div class="wrap">
      <nav aria-label="Jump to a barber"><ul class="facts">${barbers.map((b) => `<li><a href="#${b.id}" style="color:inherit;text-decoration:none;">${b.name}</a></li>`).join('')}</ul></nav>
      <div class="profiles">${barbers.map(profile).join('')}
      </div>
    </div>
  </section>

  <section class="block alt" data-section="related">
    <div class="wrap">
      <p class="label">Services</p>
      <h2>What the team does</h2>
      <ul class="link-cards">
        <li><a href="/services/mens-haircuts/"><span class="lc-title">Men's haircuts</span><span class="lc-text">Gentlemen's cuts from $35, booked for 45 minutes.</span><span class="lc-go">View →</span></a></li>
        <li><a href="/services/fade-haircuts/"><span class="lc-title">Fade haircuts</span><span class="lc-text">$40 fades and $45 fade + beard.</span><span class="lc-go">View →</span></a></li>
        <li><a href="/services/#braids-and-locs"><span class="lc-title">Braids &amp; locs</span><span class="lc-text">With Shia, the shop's braid and loc specialist.</span><span class="lc-go">View →</span></a></li>
        <li><a href="/services/#kids"><span class="lc-title">Kids &amp; young men</span><span class="lc-text">Kids' cuts for all ages from $30.</span><span class="lc-go">View →</span></a></li>
      </ul>
    </div>
  </section>
${closingCta()}
</main>`;

export default {
  path,
  title,
  description,
  jsonld: [barbershopNode(), websiteNode(), webPageNode({ path, title, description, image: 'kairos-cuts-team-stoney-creek-barbershop' }), breadcrumbNode(path, crumbs)],
  body,
};
