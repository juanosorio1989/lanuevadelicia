# 09. Testing and launch

## Automated tests

- **Unit (Vitest):** `lib/hours.ts` (open, closing soon and closed states at boundaries: 8:59/9:00, 20:59/21:00 Mon–Thu,
  21:59/22:00 Fri–Sun, the day rollover, DST weeks, all in `America/New_York` regardless of the machine's timezone),
  today's-special selection by weekday, link builders (directions URL encoding, `tel:`), and the Zod validation of all
  data files (every item has `es` and `en` names; prices are positive; featured items exist and have images; every
  `image` id exists in `photos.ts`; every special has a flyer).
- **End-to-end (Playwright, against the built `out/` served statically):**
  - `/` lands on `/es/` (via `out/index.html` locally; via `_redirects` on the preview deploy). The language switch
    keeps the page (`/es/menu/` ↔ `/en/menu/`).
  - On the preview deploy, an unknown URL (`/es/nope/`) returns **status 404** with the bilingual 404 page, not a 200
    redirect.
  - Mobile viewport (390×844): the bottom bar is visible on every page, with correct hrefs (directions URL, `tel:`,
    menu).
  - The menu chips scroll to their sections, and the menu works with JavaScript disabled.
  - The map does not load until clicked. After a click, an iframe exists.
  - The open-now badge shows the right state with a mocked clock (Playwright `clock`).
  - No console errors on any page.
- **Accessibility:** `@axe-core/playwright` on every page in both locales. Zero serious or critical violations.
- **Build checks:** `next build` succeeds with the static export. No broken internal links (a crawl of `out/`). The
  sitemap lists 14 URLs (7 pages × 2 locales). Every page has a title, a description, a canonical and hreflang.

## Budgets (Lighthouse, mobile, on the preview deploy)

Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Module JS
shipped on the home page (`/es/`) at most 170 KB gzipped, excluding the `noModule` polyfill (Claude's call). Reason: the
Next 16 + React 19 baseline alone is about 122 KB gzipped, so the original 120 KB target was not reachable; the Lighthouse
mobile performance score of 90 or more stays the binding gate.

## Manual checks

Real iPhone and Android: tap Cómo llegar (it opens the Maps app with the right place), tap Llamar, scroll the menu,
switch language. Desktop Chrome, Safari and Firefox at 1280 and 1920 widths.

## Launch checklist

1. The owner reviews all ES and EN copy and the full menu with prices (a printed or PDF proof of the menu page).
2. Restaurant photos are in, or the substitutes from [06-photos.md](06-photos.md) are in place. No placeholders
   remain.
3. Q2 (Place ID) is resolved, or its fallback is accepted.
4. The GA4 property is created by the owner, the ID is set in Cloudflare, and the events are verified in DebugView.
5. The owner approves the DNS cutover: existing records are copied to Cloudflare, the nameservers move, both custom
   domains are added to Pages, and the www → apex Redirect Rule is created. Then HTTPS works on the apex and www, and
   any email on the domain still works.
6. Search Console is verified and the sitemap submitted. The GBP website link is updated.
7. Rich Results Test passes on Home and Menu.
8. Lighthouse budgets are met on production.
