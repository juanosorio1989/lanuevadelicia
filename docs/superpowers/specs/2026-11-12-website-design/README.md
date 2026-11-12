# La Nueva Delicia website: design

Status: draft for owner review (2026-11-12). Brainstormed with the owners' relative (the repo owner) in Spanish; this
spec is in English per lab rules.

A bilingual (Spanish default, English) marketing website for La Nueva Delicia, a family-owned Colombian restaurant
in Jackson Heights, Queens, NY. Its job is to bring people to the restaurant.

## Pages of this spec

| Page | What it covers |
|------|----------------|
| [01-intent.md](01-intent.md) | Why, audience, goals, non-goals, anti-goals |
| [02-business-facts.md](02-business-facts.md) | Verified facts (NAP, hours, links, rating) and where each came from |
| [03-site-and-pages.md](03-site-and-pages.md) | Sitemap, routes, every page section by section, mobile rules |
| [04-menu.md](04-menu.md) | Menu structure, categories, data rules, translation rules |
| [05-design-system.md](05-design-system.md) | Visual direction, tokens, type, components, imagery |
| [06-photos.md](06-photos.md) | Photo inventory, what is used, what is excluded, processing |
| [07-technical.md](07-technical.md) | Stack, static export, i18n, data files, hosting |
| [08-seo-analytics.md](08-seo-analytics.md) | Local SEO, structured data, GA4 events |
| [09-testing-launch.md](09-testing-launch.md) | Tests, budgets, launch checklist |
| [10-decisions-open.md](10-decisions-open.md) | Owner decisions, calls made by Claude, open questions, phase 2 |

## Reference material

- `reference/food-menu-extracted.txt`, `reference/drinks-menu-extracted.txt`: `pdftotext -layout` output of the
  printed menus. **The PDFs in `assets-inbox/Menus/` are the source of truth**; the text has layout glitches.
- Approved mockups (not committed, `.superpowers/` is gitignored):
  `.superpowers/brainstorm/25925-1794460062/content/inicio-v1.html` (homepage) and `menu-v1.html` (menu).
  [03-site-and-pages.md](03-site-and-pages.md) describes them fully, so they are not required to build.
- Raw assets: `assets-inbox/` (local only, ~300 MB, not committed).
