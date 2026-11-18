# Root rewrite instead of redirect (2026-11-17)

## Why

Lighthouse (mobile, live site 2026-11-17) puts the `/` → `/es/` 302 at about 1.5 s of the home page LCP (spec 10
Q12). `/` is the URL people type and the one the Google Business profile and the custom domain will send them to.

## Goals

- `/` answers **200** with the Spanish home page (`/es/`) on Cloudflare Pages, with no redirect hop.
- The page served at `/` behaves exactly like `/es/`: the EN link goes to `/en/`, "Inicio" is marked as the current
  page, and there is no hydration warning in the console.

## Non-goals

- No language detection. Canonical URLs, hreflang and the sitemap keep pointing to `/es/...` (unchanged).
- GA4: visits to `/` are reported with page path `/`, not `/es/`. Accepted.
- `public/index.html` (meta-refresh fallback for other hosts) stays.

## Approaches

- **A. 200 rewrite in `_redirects` (picked by the owner):** `/ /es/ 200`. No extra round trip on any visit.
- B. 301 instead of 302: the browser caches it, so only repeat visits skip the hop; the first visit (the one
  PageSpeed measures) still pays it, and a 301 is hard to undo.
- Rejected: a real `app/page.tsx` root page; it duplicates the locale routing for no gain over A.

## Design

1. `public/_redirects`: `/ /es/ 200`. `scripts/check-out.mjs` expects that line.
2. `usePathname()` returns `/` on the rewritten page. A small helper (for example `localizedPathname(pathname)` in
   `src/i18n/`) maps `/` to `/${routing.defaultLocale}/` and returns other paths unchanged. `NavLinks` and
   `LanguageSwitch` use it. Unit tests cover `/`, `/es/`, `/en/menu/`, `/es/menu` (no trailing slash).
3. Docs: spec 03, 07, 09 and 10 say "rewrite (200)" instead of "redirect (302)"; handoff updated.

## Verification

Local e2e cannot emulate `_redirects` (see `scripts/serve-with-headers.mjs`), so the rewrite is checked on the branch
preview deploy (Cloudflare builds one per pushed branch):

- `curl -sI <preview>/` → `200`, body has `<html lang="es"`; `/es/nope/` still `404`.
- In a browser at `<preview>/`: EN link → `/en/`, "Inicio" has `aria-current="page"`, no console errors.
- Lighthouse mobile on `<preview>/`: no redirect audit; LCP compared with `/es/`.

If Pages serves `out/index.html` (the meta-refresh fallback) instead of applying the rule, stop and revisit the design.
