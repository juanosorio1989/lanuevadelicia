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
- **Root redirect:** `public/_redirects` contains `/ /es/ 302` (Cloudflare). Also ship `out/index.html` with
  `<meta http-equiv="refresh" content="0; url=/es/">` and a `<link rel="canonical" href="/es/">` as a fallback for
  hosts without redirect rules (AWS later can use a CloudFront Function instead).
- **Headers:** `public/_headers` sets long cache for `/_next/static/*` and `/images/*`, plus basic security headers
  (X-Content-Type-Options, Referrer-Policy, a CSP that allows GA4 and the Google Maps embed).

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
  subcategory?: string;     // e.g. 'jugos', 'shots'
  name: L10n;
  description?: L10n;
  price?: number;           // USD; omit when only options carry prices
  options?: { label: L10n; price?: number }[]; // flavors, "en leche/en agua"
  image?: PhotoId;
  featured?: boolean;
  available?: boolean;      // default true
  allergens?: string[];     // unused in MVP
}
interface MenuCategory { id: CategoryId; name: L10n; note?: L10n; order: number; }
interface SpecialDay { day: 1|2|3|4|5|6|7; main: L10n; alternative?: L10n; price: number; flyer: PhotoId; }
interface Hours { days: (1|2|3|4|5|6|7)[]; open: 'HH:MM'; close: 'HH:MM' }[]  // America/New_York
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
- Domain: DNS is at Hostinger today. Pointing `lanuevadelicia.com` and `www` to Cloudflare Pages (either move the
  nameservers to Cloudflare, or set CNAME records at Hostinger) **is an owner-approved manual step at launch**. No
  cloud resource is created and no DNS is changed without asking. `www` redirects to the apex. The Hostinger
  WordPress "Coming Soon" site is retired after the cutover.
- AWS later: S3 (private) + CloudFront with OAC, the same `out/`, a CloudFront Function for `/` → `/es/` and for
  `index.html` resolution. Out of scope now; the static export keeps it possible.

## Content updates

Menu and price changes are edits to `src/data/*.ts` followed by a push; Cloudflare rebuilds in about 1–2 minutes.
A CMS can replace the data files later without touching components, because components only read typed data.
