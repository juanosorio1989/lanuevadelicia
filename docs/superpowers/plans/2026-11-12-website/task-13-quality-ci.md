# Task 13: GA4 loader, CSP check, site-wide quality gates, CI

Spec pages: 08 (GA4), 07 (CSP), 09 (tests, budgets).

**Files:**
- Create: `src/components/analytics/GoogleAnalytics.tsx`, `tests/e2e/site.spec.ts`, `scripts/check-links.mjs`, `scripts/serve-with-headers.mjs`,
  `lighthouserc.json`, `.github/workflows/ci.yml`
- Modify: `src/app/[locale]/layout.tsx` (mount GA), `.env.example` (`NEXT_PUBLIC_GA_ID=`, `NEXT_PUBLIC_SITE_URL=https://lanuevadelicia.com`),
  `README.md` (the full command list, how to update the menu, the deploy notes linking spec 07 and 09)

**Interfaces:**
- Consumes: everything. Produces: npm scripts `check:links`, `lhci`, `ci` (`typecheck && lint && test && build &&
  check:out && check:links && e2e`).

- [ ] **Step 1: GA4.** Use `@next/third-parties/google`'s `GoogleAnalytics` only when `NEXT_PUBLIC_GA_ID` is set.
  Test in `site.spec.ts`: a build without the env makes no request to `googletagmanager.com`. Build a second time
  with `NEXT_PUBLIC_GA_ID=G-TEST123` (CI matrix or a separate script `build:ga`) and assert the gtag script tag is
  present.

- [ ] **Step 2: Write `tests/e2e/site.spec.ts`** covering every one of the 14 URLs:
  - axe (`@axe-core/playwright`, tags `wcag2a, wcag2aa, wcag21aa, wcag22aa`): zero `serious` or `critical`.
  - No console errors, and no CSP violations. Serve with the `_headers` CSP applied: in the Playwright `webServer`,
    run a tiny `scripts/serve-with-headers.mjs` (node http plus static files) that parses `out/_headers` and applies
    the headers, so the CSP is exercised locally.
  - **Review Focus #2:** at 320×640, `document.documentElement.scrollWidth <= window.innerWidth` on every page.
  - **Review Focus #5:** `/menu/`, `/fr/` and `/es/nope/` return 404 with the 404 page.
  - Every `img` has a non-empty `alt`. Exactly one `h1` per page.

- [ ] **Step 3: `scripts/check-links.mjs`.** It crawls `out/**/*.html`, resolves every internal `href`/`src`
  against `out/`, and exits 1 listing the broken links.

- [ ] **Step 4: Lighthouse.** `lighthouserc.json` runs against `out/` through the static server on `/es/`, `/es/menu/`
  and `/en/`, mobile preset. Assertions: performance ≥ 0.9, accessibility ≥ 0.95, best-practices ≥ 0.95, seo = 1,
  LCP ≤ 2500, CLS ≤ 0.1, `total-byte-weight` sanity check, and a script resource-size budget of 170 KB on `/es/` (see spec 09).

- [ ] **Step 5: CI.** `.github/workflows/ci.yml` on push and pull_request: Node 22, `npm ci`,
  `npx playwright install --with-deps chromium`, `npm run ci`, then `npx lhci autorun`. (It only runs once Opus and
  the user create a GitHub remote; that is not part of this task.)

- [ ] **Step 6: Run** `npm run ci && npx lhci autorun` → all pass. Report the Lighthouse scores in the task notes.

- [ ] **Step 7: Commit** `chore: add GA4, site-wide accessibility and link checks, Lighthouse budgets and CI`
