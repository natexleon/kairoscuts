# Kairos Cuts — SEO implementation & operations plan

Canonical site: `https://kairoscuts.com/` (apex, HTTPS, trailing slashes on directory URLs).
Source of truth for business facts: `src/site.config.mjs`. Change a fact there, run `npm test`, redeploy `dist/`.

---

## 1. Audit (before this work)

| Issue | Where | SEO impact | Fix |
|---|---|---|---|
| Single 10 MB HTML file with base64 photos | New design | Slow first load; images not indexable; no OG image possible | Split into static pages + `/images/*.jpg` with descriptive names and `srcset` |
| Only one URL | New design | One page can't target services, fades, barbers separately | Added `/services/`, `/services/mens-haircuts/`, `/services/fade-haircuts/`, `/barbers/` |
| No canonical, both `www` and apex return 200 | Live Webflow site | Duplicate hosts split signals | Self-referencing canonicals on apex; set apex as primary domain at host (301 `www`) |
| Template pages in sitemap (`/template-utilities/*`, `/thank-you` titled "Webflow HTML website template", `/old-home-2`) | Live Webflow site | Thin/duplicate pages indexed under the brand | 301s in `dist/_redirects`; new sitemap lists only real pages |
| No structured data | Both | Weak entity understanding for Google/Bing/AI | `BarberShop` + `WebSite` + `WebPage` + `BreadcrumbList` + `Service` + `FAQPage` JSON-LD |
| Generic title "Kairos Cuts", description lacks services | Live Webflow site | Low relevance for "barber Stoney Creek" | Unique titles/descriptions per page |
| Hero photo as CSS background | New design | LCP image discovered late | `<img fetchpriority="high">` + `<link rel="preload">` with responsive sizes |
| No favicon (`data:,`) | New design | Generic icon in search results | `/favicon.svg` (scissors mark from the site) |
| Review count hard-coded (1,654, Fresha now shows 1,664) | New design | Stale claims | `1,650+` floor from config |
| 5.0 stars shown for Shia, Shi, Dante | New design | Fresha shows no rating for them | Rating shown only where Fresha shows one |
| No analytics, no Search Console | Both | No measurement | Event hooks in `site.js`; setup steps below |
| Mobile has no nav menu | New design | Inner pages reachable only via footer/contextual links | Footer "Explore" links + contextual links on every page |
| Old "Send us a message" form | Live Webflow site | Not ported (owner confirmed no form needed) | Phone + email links on every page |

Rendering: plain static HTML — every price, address, hour and FAQ answer is in the server response; no JavaScript is needed to read content. Accordions on the homepage use `<details>`, which is in the HTML; `/services/` shows the full menu un-collapsed.

## 2. URLs

| URL | Status | Target intent (hypothesis — validate with Search Console) |
|---|---|---|
| `/` | Updated | barbershop Stoney Creek · barber Stoney Creek · barber shop Hamilton · brand ("kairos cuts") |
| `/services/` | New (replaces Webflow `/services`) | barber prices Stoney Creek · beard trim · kids haircut · braids & locs (sections `#beard`, `#kids`, `#braids-and-locs`) |
| `/services/mens-haircuts/` | New | men's haircut Stoney Creek / Hamilton |
| `/services/fade-haircuts/` | New | fade haircut Stoney Creek / Hamilton |
| `/barbers/` | New | barbers at Kairos Cuts · "[barber name] Kairos Cuts" |
| `/404.html` | New, `noindex` | — |

Redirects (`dist/_redirects`, read by Netlify and Cloudflare Pages): `/old-home-2`, `/thank-you`, `/template-utilities/*` → `/` (301). Webflow `/services` is served by `/services/` — static hosts redirect the missing slash automatically; confirm after launch (section 9).

Deliberately **not** created (insufficient unique content — would be thin or duplicate): separate beard, kids, braids-and-locs, reviews, about, contact and city pages. Revisit when there is first-hand material (see section 7).

Keyword list status: no search-volume or ranking data was available, so every keyword above is a hypothesis. Do not report volumes until measured.

## 3. Structured data

One identical `BarberShop` node (`@id: https://kairoscuts.com/#barbershop`) is emitted on every page from `site.config.mjs`; `npm run check` fails if any page's copy differs. It includes name, URL, description, images, telephone, email, founding date, postal address, `hasMap`, area served, opening hours, price range, awards (Fresha Best in Class 2023/2026, Highly Recommended 2025), `sameAs` (Instagram, Fresha), a `ReserveAction` to Fresha, and an `OfferCatalog` of all 17 services in CAD.

Intentionally omitted:
- `aggregateRating` / `review` — self-serving review markup is not eligible for stars and is against Google's guidelines. Reviews stay as visible text.
- `geo` — OpenStreetMap only resolves the street, not the building. Add coordinates from the Google Business Profile pin once confirmed.
- `logo` — no official logo file exists. Add `logo` when one is supplied (square PNG ≥ 112 px).
- FAQ rich results are limited to government/health sites, so `FAQPage` is there for clarity only — no rich result is expected.

Validate after deploy: [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/) for each URL.

## 4. Facts that need owner confirmation

| Fact | Conflict | Current site value |
|---|---|---|
| Friday hours | ✅ Confirmed by owner | Mon–Thu 10 AM–7 PM, **Fri 10 AM–8 PM**, Sat 9 AM–5 PM — update the Webflow site/GBP if they still say 7 PM |
| Dee's experience | ✅ Confirmed | 35+ years |
| Address locality | ✅ Confirmed: Hamilton | Schema `addressLocality: Hamilton`; visible text "Stoney Creek, Hamilton" |
| Unit number | ✅ Confirmed | "142 King Street West, Unit 1" — make sure GBP includes "Unit 1" |
| Contact form | ✅ Not needed | Phone + email links only |
| Shampoo prices | Webflow lists Shampoo and Shampoo/Conditioner without prices | $8 / $10 (from the brief) |
| Walk-ins | Stated on Webflow ("we accept walk-in traffic") | Kept |
| Shi's title "Curly-Puff Barber" | Fresha lists "Apprentice" only | Kept from the previous site |
| Shaves / custom designs | Webflow mentions shaves; no shave service on Fresha | Not listed |
| Payment methods | Only "debit and credit subject to a fee" is known | `paymentAccepted` omitted |
| Webflow "Regulations" (memberships, Yclients, 15-minute late policy) | Looks outdated | Not ported — confirm whether any policy should appear |

## 5. Google Business Profile & listings checklist

- [ ] Primary category **Barber shop**. Review secondary categories honestly (e.g. "Hair salon" only if braids/locs styling is a core offer).
- [ ] Business name exactly **Kairos Cuts** — no keywords.
- [ ] Address identical to the site: `142 King Street West, Unit 1, Hamilton, ON L8G 0A9` (Stoney Creek area); confirm the map pin sits on the building.
- [ ] Phone `(905) 662-1810`; website `https://kairoscuts.com/`.
- [ ] Hours — Mon–Thu 10–7, Fri 10–8, Sat 9–5, Sun closed. Make GBP, Fresha, the door sign and `site.config.mjs` match.
- [ ] Booking/appointment link: the Fresha URL (or enable Fresha's Reserve with Google integration if available on your plan).
- [ ] Services with prices — copy the 17 services from `/services/`.
- [ ] Photos: storefront (exterior, to help people find the door), interior, team, recent work. Geotagging adds nothing; descriptive filenames are fine.
- [ ] Description: plain language, mention established 2019, services, Stoney Creek/Hamilton. No keyword stuffing.
- [ ] Reviews: ask after each appointment (a QR code at the chair linking to the GBP review form). Reply to every review. Never offer incentives or post reviews yourselves.
- [ ] Apple Business Connect, Bing Places (import from GBP), Yelp, Facebook page — same NAP everywhere.
- [ ] Citation/backlink ideas (legitimate only): Stoney Creek BIA / Chamber of Commerce membership, local sponsorships (youth sports), Hamilton community event listings, Fresha profile linking back to the website, local press for the Best in Class awards.

## 6. Search Console, Bing & analytics

1. **Search Console** → Add property → *Domain* `kairoscuts.com` → add the TXT record at your DNS provider (covers `www` and apex). Alternative: URL-prefix property with the HTML tag — paste the token into `GOOGLE_SITE_VERIFICATION` in `src/site.config.mjs` and rebuild.
2. Submit `https://kairoscuts.com/sitemap.xml`.
3. Use *URL Inspection → Request indexing* for `/`, `/services/`, `/services/mens-haircuts/`, `/services/fade-haircuts/`, `/barbers/`.
4. After the DNS switch, check *Pages* for the old Webflow URLs showing as "Page with redirect".
5. **Bing Webmaster Tools** → import from Search Console.
6. **Analytics (optional):** add a GA4 (or privacy-friendly) tag to `head()` in `src/layout.mjs`. `site.js` already sends these events to `gtag`/`dataLayer` once a tag exists — with `page_section` (hero, header, barbers, closing-cta, …) and `link_text`:
   - `booking_click` — outbound clicks to Fresha (**not** confirmed bookings). Mark as a key event.
   - `phone_click`, `directions_click`, `email_click`, `instagram_click`.
   Confirmed bookings live in Fresha's reports; if Fresha offers a conversion pixel/GA integration on your plan, connect it there.

## 7. Measurement framework

Track monthly in Search Console (Performance → Queries, filter by "contains"):

| Group | Query filter | Page that should rank |
|---|---|---|
| Brand | `kairos` | `/` |
| Stoney Creek barbershop | `stoney creek` + `barber` | `/` |
| Hamilton barbershop | `hamilton` + `barber` | `/` |
| Men's haircut | `haircut`, `men's` | `/services/mens-haircuts/` |
| Fade | `fade` | `/services/fade-haircuts/` |
| Beard | `beard` | `/services/#beard` (consider a page if impressions grow) |
| Kids | `kids`, `child` | `/services/#kids` |
| Braids & locs | `braid`, `loc` | `/services/#braids-and-locs` |

Also record GBP Insights (calls, direction requests, website clicks) and Fresha bookings. For AI answers, check monthly by hand in ChatGPT search, Perplexity, Gemini and Copilot with the questions in the brief, and note whether Kairos Cuts is named and whether the facts are correct — there's no reliable automated measure.

## 8. Content plan (outlines only — publish when Dee/the team can add first-hand detail and photos)

1. **What to expect at your first Kairos Cuts appointment** — booking on Fresha, arriving, consultation, payment fee, rebooking. *Needs:* the team's real process, photo of the front desk.
2. **Fade haircut vs. classic gentlemen's cut** — difference, upkeep, which to book. *Needs:* side-by-side photos of real clients (with permission).
3. **Kids' haircuts at Kairos Cuts** — ages, how barbers handle first cuts, tips for parents. *Needs:* Dee's guidance; the case for a `/services/kids-haircuts/` page.
4. **How often should you get a haircut or line up?** — real rebooking intervals the barbers recommend.
5. **Beard care between appointments** — line maintenance, products the shop actually uses.
6. **Braids and locs with Shia** — styles offered, prices, time, hair prep. *Needs:* Shia's input and portfolio — then promote `#braids-and-locs` to its own page.

Skip generic articles that repeat what every barbershop site says.

## 9. Launch & post-launch checks

1. `npm test` (build + checks) must pass.
2. Deploy `dist/` (Netlify Drop, Cloudflare Pages, or a Git-connected build with publish directory `dist`).
3. At the host: add `kairoscuts.com` **and** `www.kairoscuts.com`, set the apex as primary so `www` 301s to it, enable HTTPS.
4. At the DNS provider: point only the website records (A / CNAME) away from Webflow. **Do not touch MX records** (email).
5. Test: `https://www.kairoscuts.com/services` → 301 → `https://kairoscuts.com/services/`; `/thank-you` → `/`; a made-up URL → 404 page.
6. Run the Rich Results Test on `/` and `/services/fade-haircuts/`.
7. Unpublish the Webflow site only after the new site is confirmed live.
8. Preview/staging domains (e.g. `*.netlify.app`, `*.pages.dev`): canonicals already point to the live domain; with the custom domain set as primary, Netlify also redirects its own subdomain. Don't share preview links publicly.
