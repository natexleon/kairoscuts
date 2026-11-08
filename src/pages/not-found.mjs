import { bookAttrs } from '../layout.mjs';

export default {
  path: '/404.html',
  output: '404.html',
  title: 'Page not found | Kairos Cuts',
  description: 'This page does not exist. Find services, prices, barbers and booking for Kairos Cuts in Stoney Creek.',
  noindex: true,
  jsonld: [],
  body: `
<main id="main">
  <section class="page-head not-found" data-section="404">
    <div class="wrap">
      <p class="label">404</p>
      <h1 class="page-title">This page isn't here.</h1>
      <p class="page-lede">The link may be old or mistyped. Everything you need is a tap away.</p>
      <div class="page-actions">
        <a class="btn" ${bookAttrs}>Book a chair</a>
        <a class="dir-link" href="/">Home</a>
        <a class="dir-link" href="/services/">Services &amp; prices</a>
        <a class="dir-link" href="/barbers/">Barbers</a>
      </div>
    </div>
  </section>
</main>`,
};
