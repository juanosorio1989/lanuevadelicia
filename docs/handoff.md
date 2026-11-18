# Handoff

Updated 2026-11-17.

## Done

- Website MVP merged into `main` 2026-11-12 (spec `docs/superpowers/specs/2026-11-12-website-design/`, plan
  `docs/superpowers/plans/2026-11-12-website/`). Owner copy to review: `docs/content/copy-review.md`.
- `site-improvements` (merged into `main` 2026-11-17, cc39d41; spec `docs/superpowers/specs/2026-11-15-menu-search-design/`, plan
  `docs/superpowers/plans/2026-11-15-menu-search/`): menu search and sticky toolbar with swipe hint, phone orders and
  delivery range, gallery hidden from nav and sitemap, reservations by phone, closed every January 1, and
  `allowedDevOrigins` for phone testing. Tasks reviewed; final branch review fixes applied. Merged.
- 2026-11-17 (spec `docs/superpowers/specs/2026-11-17-hours-logo-design/`): happy hour is its own card under the hours
  table ("Horario" label added) and the closed-dates note is hidden everywhere (January 1 logic and JSON-LD stay).
- 2026-11-17: header scroll state uses hysteresis (on past 80px, off below 8px) to stop a flicker loop caused by
  scroll anchoring while the header shrinks; hours title is now a table caption, hidden on `/visit/`.
- 2026-11-17: "Inicio / Home" added as the first nav item (header, mobile panel, footer); in `main`, merged 2026-11-17.
- 2026-11-17 (spec `docs/superpowers/specs/2026-11-17-menu-descriptions-design/`): 12 menu descriptions filled from Uber
  Eats (sides, desserts, three drinks); 48 of 138 items now have one. Owner proof list: `docs/content/menu-review.md`.
- 2026-11-17 (spec `docs/superpowers/specs/2026-11-17-root-rewrite-design/`): `/` serves the
  Spanish home with a 200 rewrite instead of a 302 (saves ~1.5 s LCP); nav and language switch treat `/` as `/es/`.
  Verified on the branch preview; merged 2026-11-17.
- `npm run ci` green; Lighthouse mobile budgets met.

## Deployed

- Cloudflare Pages project `lanuevadelicia` (created 2026-11-17), Git-connected to `main`: every push to `main`
  rebuilds production at https://lanuevadelicia.pages.dev (first build ~2 min, commit 0850ab2). Build `npm run build`,
  output `out`. Production vars: `NODE_VERSION=22`, `NEXT_PUBLIC_GA_ID=G-W4XL44MY1C`,
  `NEXT_PUBLIC_SITE_URL=https://lanuevadelicia.pages.dev`. Preview vars: same minus `NEXT_PUBLIC_GA_ID`.

## Next

1. On https://lanuevadelicia.pages.dev: PageSpeed Insights check (spec 10 Q12), owner COPY-REVIEW (`docs/content/copy-review.md`,
   including the privacy/GA4 wording, now mentioning menu searches).
2. When the owner has a domain: add it in Pages > Custom domains and change `NEXT_PUBLIC_SITE_URL` (Production)
   to it, then redeploy.
3. Deferred nits: 80px logo: smallest srcset entry is 384w, enough up to DPR 4 (needs 320w); acceptable; mazamorra option price not in Menu JSON-LD (ruled out for now).
   No component render test for NavLinks/LanguageSwitch on `/` (helper `src/i18n/pathname.ts` is unit-tested; preview
   checked EN link and aria-current); any new `usePathname()` caller must use `localizedPathname`.

## Open questions (owner)

See spec page 10: Q2 Place ID, Q5 transit, Q6 review highlights, Q7 calentado descriptions, Q9 vector logo, Q12 PSI
LCP. Answered 2026-11-15: Q3 reservations (by phone), Q4 holidays (closed January 1), Q8 photo permission (yes).
Storefront photos (day/night) arrived and are live as of 2026-11-17 (`/visit/`, `/our-story/`, gallery); interior and team photos are still pending, no date. 12 Instagram dish photos added to menu cards.

- Q9: `assets-inbox/logo2.pdf` (2026-11-12) is a T-shirt "Made in Colombia" stamp. Its ring is vector, but the
  central plaque is raster (~980 px), so it does not answer Q9. The owner decided the stamp is for the T-shirt only,
  not the site. Still needed: the designer's original `.ai`/`.svg`/`.eps`.

- WCAG 2.2 2.4.11 Focus Not Obscured on /menu/: keyboard focus can land under the sticky toolbar; a working
  scroll-padding-top must resolve to px and needs section scroll-margin set to 0 with JS on (they add up), so it
  touches the tested offset logic. Do it as its own change.

## Notes

- `assets-inbox/` (~300 MB raw photos and the menu PDFs) and `.superpowers/` (mockups, SDD ledger) are gitignored
  and local only.
- Talk to the user in Spanish (they switch to English sometimes). Code and docs are English.
