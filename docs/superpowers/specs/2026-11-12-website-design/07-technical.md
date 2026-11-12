# 07. Technical design

## Stack (from the brief, adapted for static hosting)

Next.js (App Router, latest stable), React, TypeScript (strict), Tailwind CSS, shadcn/ui (only where it helps),
Lucide icons, next-intl, Zod. No database, no backend API. React Hook Form is not needed in the MVP (no forms).

## Static export (owner decision: Cloudflare Pages now, AWS later)

- `output: 'export'`, `trailingSlash: true`. `next build` writes `out/`, which is plain static files that work
  unchanged on Cloudflare Pages and later on S3 + CloudFront.
- No middleware, no server actions, no route handlers that need a runtime, no ISR. Anything dynamic (open-now,
  today's special, active menu chip, map load, gallery dialog) is a small client component.
- **Images:** `next/image` default optimization is not available in export. Use `next-image-export-optimizer`
  (generates WebP variants at build) through a single `<Img>` wrapper component, so the optimizer can be swapped
  later. Claude's call; an equivalent sharp-based prebuild script is acceptable if the library blocks the build.
  Priority-load only the hero image.
- **i18n with next-intl in export mode:** `app/[locale]/…` with `generateStaticParams` for `es` and `en`, and
  `setRequestLocale` in every layout and page. Messages live in `messages/es.json` and `messages/en.json` (UI strings
  only). Content with two languages (menu, facts, specials) keeps `es` and `en` fields side by side in the TypeScript
  data files.
- **Root layout pattern (next-intl):** `app/layout.tsx` only passes `children` through (no `<html>`).
  `app/[locale]/layout.tsx` renders `<html lang={locale}>`. There is **no** `app/page.tsx`.
- **Root redirect:** `public/_redirects` contains `/ /es/ 302` (Cloudflare). `public/index.html` (copied to
  `out/index.html` because no `app/page.tsx` exists) is a fallback for hosts without redirect rules:
  `<meta http-equiv="refresh" content="0; url=/es/">` plus `<link rel="canonical" href="https://lanuevadelicia.com/es/">`.
  On AWS later, a CloudFront Function does the redirect.
- **404:** `app/not-found.tsx` renders its own `<html lang="es">` and is a single **bilingual** 404 page (Spanish
  first, English below) with links to `/es/menu/`, `/es/visit/`, `/en/menu/` and `/en/visit/` (Claude's call). This
  makes Next write `out/404.html`, which Cloudflare Pages serves with status 404. Without it, Pages falls back to SPA
  mode and every bad URL returns 200 (a soft 404). On AWS, a CloudFront custom error response points at `/404.html`.
  `app/[locale]/not-found.tsx` is optional (it only renders on an explicit `notFound()`).
- **`sitemap.ts` / `robots.ts`:** `export const dynamic = 'force-static'`.
- **Headers (`public/_headers`):**
  - `/_next/static/*` → `Cache-Control: public, max-age=31536000, immutable` (content-hashed).
  - Images (`/images/*` and the optimizer output folder `/nextImageExportOptimizer/*`) →
    `public, max-age=86400`, because file names carry no hash and a replaced photo must show up within a day.
  - Security: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a CSP that
    is necessarily permissive for scripts. A static export inlines the RSC payload scripts and nonces need a server,
    so: `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com`;
    `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`;
    `img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com`;
    `frame-src https://www.google.com https://maps.google.com`; `style-src 'self' 'unsafe-inline'`;
    `font-src 'self'`; `default-src 'self'`. Verify there are no CSP console errors on the preview.

## Project structure

```
src/
  app/[locale]/{page.tsx, menu/, specials/, our-story/, gallery/, visit/, privacy/, layout.tsx, not-found.tsx}
  app/{sitemap.ts, robots.ts}          # static output
  components/{layout,home,menu,specials,gallery,visit,ui}/
  data/{restaurant.ts, menu.ts, specials.ts, photos.ts}
  i18n/{routing.ts, request.ts}
  lib/{hours.ts, links.ts, seo.ts, analytics.ts}
  types/{restaurant.ts, menu.ts}
messages/{es.json, en.json}
public/{images/…, _redirects, _headers, favicon…}
scripts/import-photos.ts
```

## Data models (shape; the builder finalizes them)

```ts
type Locale = 'es' | 'en';
type L10n = { es: string; en: string };

interface MenuItem {
  id: string;               // kebab-case, stable
  category: CategoryId;
  subcategory?: L10n;       // e.g. { es: 'Jugos naturales', en: 'Fresh juices' }
  name: L10n;
  description?: L10n;
  price?: number;           // USD; omit when only options carry prices
  options?: { label: L10n; price?: number }[]; // flavors (no price), "en leche/en agua" (own price)
  image?: PhotoId;
  featured?: boolean;
  available?: boolean;      // default true
  allergens?: string[];     // unused in MVP
}
interface MenuCategory { id: CategoryId; name: L10n; note?: L10n; order: number; }
// Weekdays use ISO numbering everywhere: 1 = Monday … 7 = Sunday (NOT JS getDay(), where Sunday = 0).
type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface SpecialDay { day: IsoWeekday; main: L10n; alternative?: L10n; price: number; flyer: PhotoId; }
interface HoursRule { days: IsoWeekday[]; open: string; close: string } // 'HH:MM', 24h, America/New_York
type Hours = HoursRule[];  // MVP: [{days:[1,2,3,4],open:'09:00',close:'21:00'},{days:[5,6,7],open:'09:00',close:'22:00'}]
```

`restaurant.ts` holds every fact from [02-business-facts.md](02-business-facts.md). All data files are validated with
Zod schemas at build (a failed validation fails the build), so a bad price or a missing translation never ships.

## Environment

`NEXT_PUBLIC_GA_ID` (GA4 measurement id; if unset, analytics is not loaded) and `NEXT_PUBLIC_SITE_URL`
(`https://lanuevadelicia.com`). Commit `.env.example`; real values go in Cloudflare Pages settings. No secrets exist
in this project.

## Hosting and deploy

- GitHub repo → Cloudflare Pages Git integration. Build command `npm run build`, output `out`, Node LTS. Preview
  deployments for branches.
- Domain: DNS is at Hostinger today. Cloudflare Pages accepts an **apex** custom domain only when the zone is on
  Cloudflare, so the plan is: **move the nameservers to Cloudflare** (the registration can stay at Hostinger).
  Before the switch, copy every existing DNS record (MX, email SPF/DKIM, verification TXT, other subdomains) into the
  Cloudflare zone, so nothing breaks (see Q10). Then add `lanuevadelicia.com` and `www.lanuevadelicia.com` as custom
  domains on the Pages project. **www → apex** is a Cloudflare Redirect Rule on the zone (301), because `_redirects`
  cannot match on hostname. Every step is an owner-approved manual step at launch: no account, cloud resource or DNS
  change without asking. The Hostinger WordPress "Coming Soon" site is retired after the cutover.
- AWS later: S3 (private) + CloudFront with OAC, the same `out/`, a CloudFront Function for `/` → `/es/` and for
  `index.html` resolution. Out of scope now; the static export keeps it possible.

## Content updates

Menu and price changes are edits to `src/data/*.ts` followed by a push; Cloudflare rebuilds in about 1–2 minutes.
A CMS can replace the data files later without touching components, because components only read typed data.
