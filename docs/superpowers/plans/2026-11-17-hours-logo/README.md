# Hours, happy hour card and logo size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Happy hour gets its own terracotta card outside the hours table, the "closed on January 1" note disappears
from the UI, and the header logo grows to 64px mobile / 80px desktop.

**Architecture:** Presentation-only changes in `HoursTable`, `Footer` and `Header`. The January 1 data and logic
(`restaurant.closedDates`, open status, JSON-LD) are untouched.

**Tech Stack:** Next.js 16 static export, React 19, Tailwind 4, next-intl, lucide-react, Playwright, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-17-hours-logo-design/README.md`

**Branch:** `site-improvements` (not merged yet; this work rides along with it).

## Routing

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | Hours label, happy hour card, remove closed note (HoursTable, Footer, messages, tests, docs) | implementer-sonnet | reviewer-opus | UI + copy, fully specified |
| 2 | Header logo 64/80px | implementer-sonnet | reviewer-opus | One-file UI change, fully specified |
| Final | Branch review | — | reviewer-opus | Lab rule |

Main session: Opus 5.5 (orchestrates).

## Global Constraints

- Never hard-code a fact: times, price and days come from `src/data/restaurant.ts`.
- Strings live in `messages/es.json` and `messages/en.json`; `HoursTable` is a server component using
  `getTranslations`.
- Colors only from tokens: `bg-terra-700`, `text-cream-50`, `bg-cream-50`, `text-terra-700`.
- Do not change `restaurant.closedDates`, `src/lib/hours.ts`, `src/lib/seo.ts`, `OpenStatusLive`, or the e2e test
  "open status is closed on January 1".
- Scrolled header logo stays `h-10`; `--menu-header-h` in `src/app/[locale]/menu/page.tsx` stays unchanged.
- Docs change in the same commit as code. English in code and docs.
- `next dev` may write `AGENTS.md`: delete it, never commit it.
- Acceptance for the branch: `npm run ci` green; `CHROME_PATH=/usr/bin/google-chrome npx lhci autorun` green.

## Review Focus

1. 320px width: the card's title row (icon + "Happy hour" + price pill) must not overflow; the existing
   no-horizontal-scroll test in `site.spec.ts` covers it, plus Task 1 adds a pill-wrap check.
2. English page: card reads "Happy hour" + "cocktails $8" and English day names (Task 1 e2e covers `/en/visit/`).
3. Axe color contrast on the card (cream-50 on terra-700, 5.1:1) — covered by `site.spec.ts` axe run.
4. Header at 320px with the 64px logo: items must not wrap — covered by the existing
   "header logo and wrapping across widths" tests in `chrome.spec.ts`.
5. `/menu/` sticky toolbar after scroll: header shrinks to the same height as before — Task 2 asserts the scrolled
   logo height is 40px.

---

### Task 1: Hours label, happy hour card, no closed note

**Files:**
- Modify: `src/components/shared/HoursTable.tsx`
- Modify: `src/components/layout/Footer.tsx:57-61` (remove closed-dates paragraph and the `formatClosedDates` import;
  drop the `hours` translator there if it becomes unused)
- Modify: `src/lib/format.ts:40-43` (delete `formatClosedDates`; keep `formatMonthDay` only if still used elsewhere —
  check with grep; if unused, delete it and the `monthNames`/`rangeWords.pair` it alone needs)
- Modify: `messages/es.json`, `messages/en.json` (`hours` namespace)
- Modify: `tests/unit/format.test.ts` (remove the `formatClosedDates` block, and `formatMonthDay` tests if deleted)
- Modify: `tests/e2e/home.spec.ts:91-96,116-125`, `tests/e2e/pages.spec.ts:62-66,74-97`,
  `tests/e2e/chrome.spec.ts:94-111`
- Modify: `docs/superpowers/specs/2026-11-15-menu-search-design/README.md:91-92` (append: "Superseded 2026-11-17:
  the note is no longer shown; see `../2026-11-17-hours-logo-design/`."), `docs/handoff.md`

**Interfaces:**
- Produces: `data-testid="happy-hour"` on the card root; message keys `hours.title` (new), `hours.happyHour`,
  `hours.happyHourValue`, `hours.happyHourWindow` (kept); `hours.closedNote` removed.

**Copy:** `hours.title`: es "Horario", en "Opening hours".

**Markup** (inside the existing wrapper `div`):
1. `<p>` label with `hours.title`: `text-xs font-bold uppercase tracking-wider text-muted-600 mb-1`.
2. The table with the opening-hours rows and the breakfast row only (happy hour row removed).
3. Card `div data-testid="happy-hour"`: `mt-3 rounded-lg bg-terra-700 px-3.5 py-3 text-sm text-cream-50`.
   - Title row: `flex flex-wrap items-center justify-between gap-2 font-bold`; left: `<Martini aria-hidden="true"
     size={18} />` + `t("happyHour")` in an inline-flex `gap-1.5` span; right: pill span
     `rounded-full bg-cream-50 px-2.5 py-0.5 text-[0.8125rem] text-terra-700` with
     `t("happyHourValue", { price: formatPrice(restaurant.happyHourCocktailPrice) })`.
   - `<ul className="mt-1.5">` with one `<li>` per `restaurant.happyHour` window using `hours.happyHourWindow`
     (same args as today).

- [ ] **Step 1: Update the e2e tests first**

`home.spec.ts`: rename the happy hour test to "home happy hour card shows its times, outside the hours table"; assert
`page.getByTestId("happy-hour").first()` contains "Happy hour", "cócteles a $8",
"Lunes a viernes: 12:00 p.m. – 7:00 p.m.", "Sábado y domingo: 5:00 p.m. – 8:00 p.m.", and
`page.locator("table").first()` does NOT contain "Happy hour". Replace the "390px: closed-dates note" test with
"390px: happy hour card is separated from the directions button" (same 8px gap logic, anchored on the card), and add
`await expect(page.locator("main")).not.toContainText("Cerrado el")`.

Add to `home.spec.ts`: "320px: happy hour pill stays inside the card" — viewport 320x700, `/es/`, card box and pill
box (`card.locator("span.rounded-full")`): `pill.x + pill.width <= card.x + card.width`.

`pages.spec.ts`: "visit (en): reservations and closed date" → rename "visit (en): reservations, happy hour card, no
closed note"; assert the card contains "cocktails $8" and
"12:00 p.m. – 7:00 p.m."; assert main not contains "Closed on". In "visit (es) …" replace
`table toContainText("Happy hour")` with `getByTestId("happy-hour")` containing "Happy hour", add
`main toContainText("Horario")`, and replace `toContainText("Cerrado el 1 de enero.")` with
`not.toContainText("Cerrado el")`; rename the test dropping "note".

`chrome.spec.ts`: footer test asserts `not.toContainText("Cerrado el")`; the English footer test becomes
`not.toContainText("Closed on")` and is renamed "footer has no closed-date note in English".

- [ ] **Step 2: Build and run those e2e tests to see them fail**

Run: `npm run build && npx playwright test tests/e2e/home.spec.ts tests/e2e/pages.spec.ts tests/e2e/chrome.spec.ts`
Expected: FAIL on the new happy-hour-card and no-closed-note assertions.

- [ ] **Step 3: Implement the markup, messages, Footer and format.ts changes above; update `format.test.ts`**

- [ ] **Step 4: Run the full suite**

Run: `npm run ci`
Expected: all green (typecheck, lint, unit, build, check:out, check:links, e2e incl. axe and 320px no-scroll).

- [ ] **Step 5: Update docs (spec note, handoff "Done" line), delete `AGENTS.md` if present, commit**

```bash
git add src messages tests docs
git commit -m "feat: happy hour card outside the hours table; hide the closed-dates note"
```

### Task 2: Bigger header logo

**Files:**
- Modify: `src/components/layout/Header.tsx:32-38`
- Test: `tests/e2e/chrome.spec.ts` (inside or next to "header logo and wrapping across widths")
- Modify: `docs/handoff.md` (deferred-nit line about "56px logo loads the 384w file": update to 80px)

**Values:** `sizes="80px"`; className height classes become `h-16 … group-data-[scrolled]:h-10 … lg:h-20`
(keep every other class). Note `lg:h-20` must not override the scrolled state on desktop: today
`group-data-[scrolled]:h-10` and `lg:h-14` coexist; verify which wins on desktop after scroll and keep today's
behavior (if desktop currently shrinks on scroll, it must still shrink to 40px; use
`lg:group-data-[scrolled]:h-10` if needed).

- [ ] **Step 1: Write the failing e2e test** "logo is 64px on mobile, 80px on desktop, 40px after scroll":
  at 390x844 on `/es/`, logo `boundingBox().height` is 64 (±1); at 1280x800 it is 80 (±1); after
  `page.mouse.wheel(0, 800)` and waiting for `header[data-scrolled]` (or the attribute the shell sets — read
  `HeaderShell`), height is 40 (±1) at both widths (use `expect.poll` for the transition).
- [ ] **Step 2: Run it, expect FAIL** — `npm run build && npx playwright test tests/e2e/chrome.spec.ts`
- [ ] **Step 3: Change the classes and `sizes`**
- [ ] **Step 4: `npm run ci`** — all green, including the existing header-wrapping tests at every width and
  `menu.spec.ts` sticky offsets.
- [ ] **Step 5: Commit** — `git commit -m "feat: bigger header logo (64px mobile, 80px desktop)"`

### After both tasks

- Final branch review (reviewer-opus), then `CHROME_PATH=/usr/bin/google-chrome npx lhci autorun`.
- Owner looks at it on the dev server.
