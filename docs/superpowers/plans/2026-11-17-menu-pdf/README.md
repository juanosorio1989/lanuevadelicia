# Menu PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The old `/menu` link lands on the web menu, the menu page links to the owner's PDF, and the one missing
dessert is added.

**Spec:** `docs/superpowers/specs/2026-11-17-menu-pdf-design/README.md`

**Branch:** `menu-pdf`.

## Routing

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | `_redirects`, PDF asset, cache header, check script, PDF link + GA4 event, tests, docs | implementer-sonnet | reviewer-opus | Small, fully specified |
| 2 | Baileys Brownie Martini in Postres + menu-review + counts | implementer-sonnet | reviewer-opus | Data-only, fully specified |
| 3 | Push branch, verify on the preview deploy | Opus 5.5 (main) | — | Needs push, browser, judgment |
| Final | Branch review | — | reviewer-opus | Lab rule |

Main session: Opus 5.5 (orchestrates).

## Global constraints

- Read `CLAUDE.md`. Strings live in `messages/{es,en}.json`; client components get strings as props; every CTA uses
  `TrackedLink`. Docs change in the same commit as code. English in code and docs.
- Do not put `NEXT_PUBLIC_GA_ID` in any env file. Delete any `AGENTS.md` that `next dev` writes.
- The local static server does not emulate `_redirects`; redirects are verified in Task 3 on the preview.

## Task 1: redirects, PDF and link

**Files:**
- Modify `public/_redirects`: keep `/ /es/ 200` as the first line; add, after it:
  ```
  /menu /es/menu/ 301
  /menu/ /es/menu/ 301
  ```
- Create `public/la-nueva-delicia-menu.pdf`: `cp assets-inbox/menu.pdf public/la-nueva-delicia-menu.pdf`
  (byte-identical; commit it).
- Modify `public/_headers`: add a block before `/*`:
  ```
  /la-nueva-delicia-menu.pdf
    Cache-Control: public, max-age=86400
  ```
- Modify `scripts/check-out.mjs`: the `_redirects` check also requires `"/menu /es/menu/ 301"` and
  `"/menu/ /es/menu/ 301"`; add `if (!existsSync("out/la-nueva-delicia-menu.pdf")) errors.push("missing out/la-nueva-delicia-menu.pdf");`
  and require `"/la-nueva-delicia-menu.pdf"` in `out/_headers`.
- Modify `src/lib/analytics.ts`: add `view_menu_pdf: { location: TrackLocation };` to `EventParams`.
- Modify `messages/es.json` and `messages/en.json`, namespace `menu`, add:
  - es: `"pdfLink": "Ver o descargar el menú (PDF)"`, `"newTab": "(se abre en una pestaña nueva)"`
  - en: `"pdfLink": "View or download the menu (PDF)"`, `"newTab": "(opens in a new tab)"`
- Modify `src/app/[locale]/menu/page.tsx`: directly after the `<p className="mt-1.5 text-muted-600">{t("priceNote")}</p>`
  add (inside the same header `div`):
  ```tsx
  <p className="mt-2">
    <TrackedLink
      href="/la-nueva-delicia-menu.pdf"
      event="view_menu_pdf"
      params={{ location: "menu" }}
      external
      type="application/pdf"
      className="font-bold text-green-800 underline underline-offset-4 hover:text-green-900"
    >
      {t("pdfLink")}
      <span className="sr-only"> {t("newTab")}</span>
    </TrackedLink>
  </p>
  ```
  Import `TrackedLink` from `@/components/layout/TrackedLink`. If `text-green-800` is not a defined token in
  `src/app/globals.css`, use the same link color classes as the existing `specialsLink` link in
  `src/components/menu/MenuCategorySection.tsx` (check there first and prefer those; keep the 44px-free inline-link
  pattern the site already uses for inline links).
- Modify `tests/unit/analytics.test.ts`: one test that `track("view_menu_pdf", { location: "menu" })` calls gtag
  with `("event", "view_menu_pdf", { locale: "es", location: "menu" })`, following the existing `search` test.
- Modify `tests/e2e/menu.spec.ts`: one test looping `es`/`en`: on `/${l}/menu/`, the link with the localized
  `pdfLink` text (exact name includes the sr-only suffix, so match with a regex on the visible text, e.g.
  `getByRole("link", { name: /\(PDF\)/ })`) has `href="/la-nueva-delicia-menu.pdf"`, `target="_blank"`,
  `rel` containing `noopener`; and `page.request.get("/la-nueva-delicia-menu.pdf")` returns 200 with a
  `content-type` containing `application/pdf`.
- Docs (same commit): spec 08 (`docs/superpowers/specs/2026-11-12-website-design/08-seo-analytics.md`) event table
  gets a row after `search`: `` | `view_menu_pdf` | Menu PDF link | `location` (menu) | ``; README.md: if it lists
  files in `public/`, mention the PDF; `docs/handoff.md` Done gets one line for this branch and Notes gets "To update
  the menu PDF, replace `public/la-nueva-delicia-menu.pdf` with the owner's new file (same name)."

**Acceptance:** `npm run typecheck && npm run lint && npm test` pass; `npm run build && npm run check:out` pass;
`npx playwright test tests/e2e/menu.spec.ts` passes. `cmp assets-inbox/menu.pdf public/la-nueva-delicia-menu.pdf`
prints nothing. Commit: `feat: menu PDF link and /menu redirect`.

## Task 2: Baileys Brownie Martini

**Files:**
- Modify `src/data/menu.ts`, `postres` array: after the `flan-con-caramelo` entry add
  `{ id: "baileys-brownie-martini", name: t("Baileys Brownie Martini", "Baileys Brownie Martini"), price: 14 },`
  and change the comment above `const postres` to `// Food Menu.pdf page 7; Baileys Brownie Martini from menu.pdf (April 2026)`.
- Modify `docs/content/menu-review.md`: insert the row after row 91 (Flan con caramelo):
  `| 92 | Postres | Baileys Brownie Martini | Baileys Brownie Martini | $14.00 | menu.pdf (Apr 2026) |` and renumber
  every following row (+1; last row becomes 139). In the intro, after the sources sentence, add: "`menu.pdf`
  (April 2026, served on the site) was compared on 2026-11-17: all prices match; it adds Baileys Brownie Martini."
- Modify `docs/handoff.md`: "48 of 138 items" → "48 of 139 items".
- Tests: run `npm test`; if any unit test asserts a total item count or the postres list, update it to include the
  new item (do not change the description count, 48).

**Acceptance:** `npm test` and `npx playwright test tests/e2e/menu.spec.ts` pass; `grep -c "^| [0-9]" docs/content/menu-review.md`
counts the menu table rows consistently (last menu row numbered 139). Commit: `feat: add Baileys Brownie Martini to desserts`.

## Task 3: preview verification (Opus)

Push `menu-pdf`; on the preview URL: `curl -I` `/menu` and `/menu/` → 301 `location: /es/menu/`;
`/la-nueva-delicia-menu.pdf` → 200 `application/pdf`; check the link on `/es/menu/` and `/en/menu/`. Then final
branch review, `npm run ci`, merge to `main`, push, verify on production.
