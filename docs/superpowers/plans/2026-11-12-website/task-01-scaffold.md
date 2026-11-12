# Task 1: Scaffold, static export, i18n skeleton, test harness

Spec pages: 03 (routes), 07 (static export, root layout, redirect, 404, headers).

**Files:**
- Create: `package.json`, `tsconfig.json` (strict), `next.config.ts`, `postcss.config.mjs`, `src/app/globals.css`
  (Tailwind import only, for now), `eslint` config from create-next-app
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `messages/es.json`, `messages/en.json`
- Create: `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
  (placeholder H1 from messages)
- Create: `public/index.html`, `public/_redirects`, `public/_headers`
- Create: `vitest.config.ts`, `playwright.config.ts`, `serve.json`, `tests/unit/smoke.test.ts`, `tests/e2e/routing.spec.ts`,
  `scripts/check-out.mjs`
- Create: `README.md` (project root: what it is, commands, the spec and plan links), `.env.example`, `.nvmrc` (`22`)
- Modify: `.gitignore` (add `node_modules/`, `.next/`, `out/`, `test-results/`, `playwright-report/`, `.env*` except `.env.example`)

**Interfaces:**
- Produces: `routing` (`defineRouting({ locales: ['es','en'], defaultLocale: 'es', localePrefix: 'always' })`) and
  `type Locale = 'es' | 'en'` exported from `src/i18n/routing.ts`. `Link`, `usePathname`, `getPathname` from
  `src/i18n/navigation.ts` (`createNavigation(routing)`). Every page and layout calls `setRequestLocale(locale)` and
  exports `generateStaticParams = () => routing.locales.map(l => ({ locale: l }))` (layout). npm scripts: `dev`,
  `build`, `test` (vitest run), `e2e` (playwright test), `serve:out`, `check:out`, `lint`, `typecheck`.

- [ ] **Step 1: Create the app**

Run `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack`
(answer prompts to keep existing files). Then `npm i next-intl zod lucide-react` and
`npm i -D vitest @vitest/coverage-v8 @playwright/test @axe-core/playwright serve`, plus `npx playwright install chromium`.

- [ ] **Step 2: Configure the static export and next-intl**

`next.config.ts`: `output: 'export'`, `trailingSlash: true`, wrapped with `createNextIntlPlugin('./src/i18n/request.ts')`.
`request.ts` uses `getRequestConfig(async ({ requestLocale }) => …)` and falls back to `routing.defaultLocale` for
unknown values. `src/app/layout.tsx` returns `children` only. `[locale]/layout.tsx` validates the locale with
`hasLocale` (calls `notFound()` otherwise), calls `setRequestLocale`, and renders
`<html lang={locale}><body><NextIntlClientProvider>…`. Also `export const dynamicParams = false`.

- [ ] **Step 3: Root fallback, 404 and hosting files**

- `public/index.html`: exactly the meta refresh to `/es/` plus `<link rel="canonical" href="https://lanuevadelicia.com/es/">`
  and a visible link "Ir al sitio / Go to site".
- `src/app/not-found.tsx`: its own `<html lang="es"><body>`. Spanish block "Página no encontrada" plus English
  "Page not found", with links to `/es/menu/`, `/es/visit/`, `/en/menu/`, `/en/visit/`. Plain CSS is fine at this
  stage (Task 11 styles it).
- `public/_redirects`: `/ /es/ 302`.
- `public/_headers`: the exact rules from spec 07 "Headers" (cache for `/_next/static/*`, `/images/*`,
  `/nextImageExportOptimizer/*`, and the security headers with the CSP string copied verbatim).
- `serve.json`: `{ "trailingSlash": true, "cleanUrls": false }`. Script `serve:out` = `serve out -l 4173 -c ../serve.json`
  (adjust the path so it resolves).

- [ ] **Step 4: Write the output check `scripts/check-out.mjs`**

It exits non-zero unless these exist: `out/index.html` (contains `url=/es/`), `out/es/index.html`,
`out/en/index.html`, `out/404.html` (contains "Página no encontrada" and "Page not found"), `out/_redirects`,
`out/_headers`. It also checks that `out/es/index.html` contains `<html lang="es"` and `out/en/index.html` contains
`<html lang="en"`, and that **no** `out/fr/` exists.

- [ ] **Step 5: Write tests**

`tests/unit/smoke.test.ts`: `expect(routing.locales).toEqual(['es','en'])` and `expect(routing.defaultLocale).toBe('es')`.

`tests/e2e/routing.spec.ts` (baseURL `http://localhost:4173`; Playwright `webServer` runs `npm run serve:out`):
- `GET /` ends at `/es/` (follow the meta refresh: `await page.goto('/'); await expect(page).toHaveURL(/\/es\/$/)`).
- `/es/` and `/en/` return 200 and show the H1.
- `request.get('/es/nope/')` and `request.get('/fr/')` return status 404, and the body contains "Página no encontrada".

- [ ] **Step 6: Run**

`npm run typecheck && npm run lint && npm test && npm run build && npm run check:out && npm run e2e`.
Expected: all pass, and `check:out` prints `out/ OK`.

- [ ] **Step 7: Commit**

`git add -A && git commit -m "feat: scaffold static Next.js site with next-intl and test harness"`
