# 10. Decisions, calls, open questions

## Owner decisions (from the brainstorm, 2026-11-11/12)

- CTA priority: visit → call → delivery apps → events (a single line).
- Bilingual site, Spanish default. Code and docs in English.
- Visual direction B (contemporary editorial) with C touches. Homepage and menu mockups approved.
- Hosting: Cloudflare Pages now, AWS later, so a static export.
- Story told through the restaurant, not the owners. No team nationality. "Más de 30 años" is OK. Story text
  approved.
- Reviews: the Google rating as text plus links. No copied reviews.
- Catering: phase 2.
- Low-res photos excluded. The 4 doubtful photo names are confirmed. The weekly special flyers are used as they are.
- The official name has no "s". Instagram is @lanuevadeliciarestaurante. Hours as listed in 02.

## Calls made by Claude (the owner can override)

- Same English path segments for both locales (`/es/our-story/`).
- `/` → `/es/` redirect. `x-default` → Spanish.
- Rating shown as "450+ reseñas" (rounded down).
- A privacy page for the GA4 disclosure. No cookie banner.
- `priceRange: "$$"`.
- Excluding `Cervezas.jpg` (500×750) under the same low-res rule.
- `next-image-export-optimizer` for images.
- The EN story translation and all `descriptionEs` text are written by Claude, for owner review.
- Light theme only.
- The "what to expect" row on Our story.
- A home-page JS budget of at most 170 KB gzipped (module JS, excluding the `noModule` polyfill; the Next 16 + React 19 baseline is about 122 KB).
- One bilingual 404 page. Native `<dialog>` for the gallery and the mobile nav. A permissive script CSP (required by
  static export). One-day cache on images. ISO weekday numbering.

## Open questions (non-blocking; each has a fallback)

| # | Question | Fallback if unanswered |
|---|----------|------------------------|
| Q2 | The Google Place ID (ChIJ…), for the "leave a review" link, the directions `destination_place_id` and `geo` | "Leave a review" goes to the Maps listing; no `geo` |
| Q3 | Do they take reservations? | `acceptsReservations: false`, no reservation copy |
| Q4 | Holiday closures or special hours? | Not modeled; a banner can be added in data later |
| Q5 | Verified transit directions (subway/bus) | Leave them out |
| Q6 | Do reviews really highlight "sabor casero" and "atención cálida"? | Drop that line |
| Q7 | Fix the two calentado descriptions that look swapped or incomplete? | Publish the printed text (spelling fixed) |
| Q8 | One-line OK that the dafotografia photos may be used on the website | Required before launch |
| Q9 | A vector (SVG/AI) logo? | Use the PNG |
| Q11 | A contact for the privacy page | **Claude's call:** `info@lanuevadelicia.com` on the privacy page only (not shown elsewhere unless the owner asks) |
| Q12 | Simulated (PageSpeed Insights) LCP on /es/ is ~3.5 s, ~65% render delay; re-measure on the preview deploy and fix before launch checklist item 8. | Ship if the real-device and devtools-throttled LCP stay under 2.5 s |

## Resolved after the builder check (owner, 2026-11-12)

- **Q1, the phone:** (718) 672-3456 is the main restaurant phone, also used for delivery, and it is the number on
  Google.
- **Q10, the domain and accounts:** the only other service is the email `info@lanuevadelicia.com`, on Hostinger
  Mail. The repo owner holds the Hostinger and GitHub accounts. **No Cloudflare account exists yet. The repo owner
  creates it at launch** (Claude never creates it). Public DNS on 2026-11-12, all of which must be recreated in the
  Cloudflare zone before the nameservers move:
  - `MX` 5 `mx1.hostinger.com`, 10 `mx2.hostinger.com`
  - `TXT` (apex) `v=spf1 include:_spf.mail.hostinger.com ~all`
  - `CNAME` `hostingermail-{a,b,c}._domainkey` → `hostingermail-{a,b,c}.dkim.mail.hostinger.com` (DKIM, DNS only,
    not proxied)
  - `CNAME` `autodiscover` → `autodiscover.mail.hostinger.com`, `autoconfig` → `autoconfig.mail.hostinger.com`
  - `ftp` → 82.25.83.67 (the Hostinger web host; can be dropped once WordPress is retired)
  - The apex and `www` currently point to Hostinger (82.25.83.67); they become the Pages custom domains.
  Cloudflare's import scan usually finds these. Check against this list anyway, and send a test email in and out
  after the switch. No `_dmarc` record exists today (adding one is optional and out of scope).

## Phase 2 (not in the MVP)

A catering and events page with a validated form (React Hook Form + Zod, sent through a Cloudflare Pages Function or
a form service). A small CMS for the menu. A holiday-hours banner. More gallery photos and short videos (the Playbook
library has 23+ videos). The AWS migration.
