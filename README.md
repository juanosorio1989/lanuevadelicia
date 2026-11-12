# La Nueva Delicia website

Bilingual (es/en) static website for the La Nueva Delicia restaurant in Jackson Heights, NY. Next.js (App Router,
static export), TypeScript, Tailwind CSS, next-intl. Hosted on Cloudflare Pages.

## Commands

Node 22 is the target (`.nvmrc`); Node >= 20.9 works.

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server |
| `npm run build` | Validates content (`prebuild`: `tests/unit/data.test.ts`), static export to `out/`, then `next-image-export-optimizer` writes the WebP variants to `out/nextImageExportOptimizer/` (about 30 s) |
| `npm run check:out` | Checks the shape of `out/` (redirect, locales, 404, and the content of `_headers` / `_redirects`) |
| `npm run check:links` | Crawls `out/**/*.html` and fails on any broken internal `href`/`src` or `#id` (including same-page `#id` links) |
| `npm run check:ga` | Builds once with `NEXT_PUBLIC_GA_ID=G-TEST123` and checks the gtag loader is in the HTML; moves `out/` aside and restores it, so run it on its own |
| `npm run serve:out` | Serves `out/` on http://localhost:4173 (plain `serve`) |
| `npm run serve:headers` | Serves `out/` on :4173 like Cloudflare Pages: applies `out/_headers` (so the CSP is live), gzip, a 308 to the slash form for directories (like Pages), `404.html` with status 404; `_redirects` and `:placeholder` header patterns are not emulated. Playwright and Lighthouse use this one |
| `npm test` | Unit tests (Vitest), plus a second `TZ=Europe/London` run of the hours tests (open status must follow New York time) |
| `npm run e2e` | End-to-end tests (Playwright; serves `out/` itself, run `build` first). `site.spec.ts` runs axe (WCAG 2.2 AA, no serious or critical), console and CSP errors, one `h1`, image alt text and no horizontal scroll at 320px on all 14 URLs |
| `npm run ci` | `typecheck`, `lint`, `test`, `build`, `check:out`, `check:links`, `e2e` |
| `npm run lhci` | Lighthouse (mobile, devtools throttling) on `/es/`, `/es/menu/`, `/en/` against `out/`; needs Chrome (`CHROME_PATH` if it is not on the default path). Budgets in `lighthouserc.json` |
| `npm run lhci:simulate` | Same for `/es/` only with Lighthouse's default simulated throttling (what PageSpeed Insights shows); LCP <= 2.5 s at warn level, so it never fails. CI runs it with `continue-on-error`. Config: `lighthouserc.simulate.json` |
| `npm run photos` | Re-imports the approved photos from `assets-inbox/` (not committed) into `public/images/` (long side 2400px, JPEG q82, EXIF-oriented, no metadata), regenerates `src/data/photos.ts` and the favicon and app icons. The approved list is `scripts/photo-manifest.ts` |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |

First time: `npm install && npx playwright install chromium`.

CI is `.github/workflows/ci.yml` (Node 22): `npm run ci`, `npx lhci autorun`, `npm run lhci:simulate` (warn only), `npm run check:ga`. Workflow permissions are read-only and runs are cancelled when a newer push arrives on the same ref. The repo lives on GitHub (`origin`); CI runs on every push and pull request.

## Notes

- `serve.json`: `serve` only resolves `/es/` to `es/index.html` with `cleanUrls` at its default, so it is not set to `false`.
- `public/_redirects` and `public/_headers` are Cloudflare Pages files, copied to `out/`.

## Site chrome

- `src/components/layout/`: `Header`, `MobileNav` (native `<dialog>`), `MobileActionBar` (below `lg`; the desktop header nav, phone and directions button switch at `lg` too), `LanguageSwitch`, `Footer`, `SkipLink`, `TrackedLink` (an `<a>` that calls `track()`; use it for every CTA).
- `src/app/[locale]/layout.tsx` wraps pages in `<main id="main">`. Pages must not render their own `<main>`.
- Chrome copy lives under `nav`, `cta` and `footer` in `messages/{es,en}.json`. Chrome text must not use `h1`-`h3` (the global heading color is green and the chrome is on dark backgrounds). The heading color is in `@layer base`, so a utility such as `text-cream-50` overrides it on dark sections.

## Home page

- `src/components/home/`: `Hero`, `Favorites`, `TodaySpecial` (server wrapper) + `TodaySpecialLive` (client; swaps in today's special in New York time, static HTML shows a teaser with no dish or price), `StoryTeaser`, `ReviewsBand`, `VisitBlock`. Copy is under `home.*` in `messages/{es,en}.json`.
- `src/components/shared/` (reused by Specials and Visit): `OpenStatus` (client, renders nothing until mounted), `HoursTable`, `MapEmbed` (client, click-to-load), `DeliveryLinks`, `DishCard`, `PhotoPlaceholder` (dev only). Status and hours copy: `status.*`, `hours.*`, `map.*`.
- Keep client components small: pass display strings, never the `photos` manifest or `menuItems`. `src/lib/photo.ts` (`getPhoto`) is server-only.
- The story teaser uses `dishes/picada-doble` until restaurant photos exist; the Q6 "lo que más destacan" line is intentionally absent.

## Story, gallery, visit, privacy and 404

- Our story reuses the approved `home.story` text; a dish photo stands in until restaurant photos exist.
- Gallery: `GalleryGrid` (client) gets only `{src,width,height,alt}`; thumbnails are plain `<a href>` links to the image (work without JS) and open a native `<dialog>`. The "El restaurante" group appears only once `restaurant` photos exist.
- Visit reuses `HoursTable`, `DeliveryLinks` (copy now in the `delivery` namespace) and the click-to-load `MapEmbed`. No transit info.
- Privacy copy and the 404 copy are drafts pending owner review (COPY-REVIEW).

## Specials page

- `src/components/specials/`: `SpecialDayCard` (server; one `<section id="day-1..7">` per weekday, Monday first, flyer + main dish + price + optional alternative with the price note) and `TodayHighlighter` (client, renders nothing; in New York time it sets `aria-current="date"` on today's card, unhides its "Hoy" badge and scrolls to it on first load when there is no URL hash). Without JS nothing is highlighted.
- "Sopa grande adicional" is read from the `especiales` menu item, not hard-coded. Copy is under `specials.*` in `messages/{es,en}.json`. All flyers load lazily (today is only known on the client).

## Menu page

- `src/components/menu/`: `MenuCategorySection` (H2, note, photo cards, then text rows; Bebidas and Cervezas group by `subcategory`), `MenuItemCard` (104x92 thumbnail on mobile, vertical card from `md`), `MenuItemRow`, and `CategoryChips` (the only client code: sticky anchor chips, an `IntersectionObserver` sets `aria-current` and keeps the active chip in view, a tap calls `track('view_menu_category')`). Without JS the chips are plain `#id` links.
- Sections have `id={category.id}`. `scroll-margin-top` comes from `--menu-sticky-offset` (header + chip bar), set on the page wrapper (in rem) in `src/app/[locale]/menu/page.tsx`; if the header or chip height changes, update `--menu-header-h` and `--menu-sticky-offset` there (the e2e deep-link test pins it).
- Options: priced options render as price lines ("En leche $7"); unpriced options render as one neutral " · " list. Copy is under `menu.*` in `messages/{es,en}.json`.

## Quality gates and deploy

- Budgets ([spec 09](docs/superpowers/specs/2026-11-12-website-design/09-testing-launch.md)): Lighthouse mobile performance >= 90, accessibility >= 95, best practices >= 95, SEO = 100, LCP <= 2.5 s, CLS <= 0.1, and module JS on `/es/` <= 170 KB gzipped (the Next 16 + React 19 baseline is about 122 KB; the original 120 KB target was not reachable).
- Headers, CSP and hosting ([spec 07](docs/superpowers/specs/2026-11-12-website-design/07-technical.md)): `public/_headers` and `public/_redirects` are Cloudflare Pages files; `check:out` verifies their content and the e2e tests run with the CSP applied.
- GA4 (`src/components/analytics/GoogleAnalytics.tsx`, [spec 08](docs/superpowers/specs/2026-11-12-website-design/08-seo-analytics.md)) loads only when `NEXT_PUBLIC_GA_ID` is set (set it in Cloudflare Pages settings; `.env.example` lists it). Without it the page makes no request to Google.
- Client JS stays small: there is no `NextIntlClientProvider`. Client components get their strings as props from a server wrapper (`OpenStatus` -> `OpenStatusLive`, `MapEmbed` -> `MapEmbedLive`, `TodaySpecial`, `Header` -> `NavLinks`/`MobileNav`/`LanguageSwitch`). Do not call `useTranslations`/`useLocale` or next-intl's `Link` in client or shared components; use plain `<a href="/${locale}/...">` with explicit locale paths.
- Cloudflare Pages: build command `npm run build`, output `out`.

## Updating the menu

Edit `src/data/menu.ts` (items, prices, options; `es` and `en` side by side) or `src/data/specials.ts`, then run `npm run ci`. The build validates the data with Zod and fails on a bad price or a missing translation. Push; Cloudflare rebuilds in about 1-2 minutes. For a new photo, add it to `scripts/photo-manifest.ts` and run `npm run photos`. The owner proof list is `docs/content/menu-review.md`.

## Content

- Facts: `src/data/restaurant.ts` (spec 02). Menu, specials, photos: `src/data/{menu,specials,photos}.ts` (`photos.ts` is generated by `npm run photos`; do not edit it by hand).
- Menu item photos: the mapping is `itemId` in `scripts/photo-manifest.ts`; the item's `image` points back to it, and the photo alt text is derived from the item name (re-run `npm run photos` after renaming an item with a photo).
- Owner proof list for the menu: [docs/content/menu-review.md](docs/content/menu-review.md).
- Types in `src/types/content.ts`; Zod schemas and `validateContent()` in `src/data/schemas.ts`; link builders in `src/lib/links.ts`.

## SEO

- `src/lib/seo.ts`: `pageUrl`, `buildMetadata` (canonical, `hreflang` es/en/x-default to the Spanish page, Open Graph `es_US`/`en_US`, Twitter card), `restaurantJsonLd` (Home and Visit) and `menuJsonLd` (Menu). No `aggregateRating`, `review` or `geo` (add `geo` only once the owner gives coordinates).
- Titles and descriptions live in `messages/{es,en}.json` under `meta.*`; each page's `generateMetadata` reads them. `src/app/sitemap.ts` and `src/app/robots.ts` are `force-static` and written to `out/`. `check:out` requires them. The 404 page is `noindex`.
- The share image `public/og/home.jpg` (1200x630) is generated from the committed bandeja paisa master by `npm run photos`.
- The site origin comes from `NEXT_PUBLIC_SITE_URL` (default `https://lanuevadelicia.com`).

## Docs

- Spec: [docs/superpowers/specs/2026-11-12-website-design/](docs/superpowers/specs/2026-11-12-website-design/README.md)
- Plan: [docs/superpowers/plans/2026-11-12-website/](docs/superpowers/plans/2026-11-12-website/)
