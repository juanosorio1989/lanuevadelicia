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
- A home-page JS budget under 120 KB gzipped.

## Open questions (non-blocking; each has a fallback)

| # | Question | Fallback if unanswered |
|---|----------|------------------------|
| Q1 | Is (718) 672-3456 the main restaurant phone, or only delivery? Is it the number on Google? | Use it as the main phone |
| Q2 | The Google Place ID (ChIJ…), for the "leave a review" link, the directions `destination_place_id` and `geo` | "Leave a review" goes to the Maps listing; no `geo` |
| Q3 | Do they take reservations? | `acceptsReservations: false`, no reservation copy |
| Q4 | Holiday closures or special hours? | Not modeled; a banner can be added in data later |
| Q5 | Verified transit directions (subway/bus) | Leave them out |
| Q6 | Do reviews really highlight "sabor casero" and "atención cálida"? | Drop that line |
| Q7 | Fix the two calentado descriptions that look swapped or incomplete? | Publish the printed text (spelling fixed) |
| Q8 | One-line OK that the dafotografia photos may be used on the website | Required before launch |
| Q9 | A vector (SVG/AI) logo? | Use the PNG |

## Phase 2 (not in the MVP)

A catering and events page with a validated form (React Hook Form + Zod, sent through a Cloudflare Pages Function or
a form service). A small CMS for the menu. A holiday-hours banner. More gallery photos and short videos (the Playbook
library has 23+ videos). The AWS migration.
