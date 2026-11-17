# Menu descriptions from Uber Eats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 12 menu items without a description get the es/en descriptions fixed in the spec; two small test/a11y
follow-ups from the hours/logo review ride along.

**Architecture:** Data-only change in `src/data/menu.ts` plus the owner proof list; Task 2 touches one test and the
visit page heading.

**Tech Stack:** TypeScript data, Zod build validation, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-menu-descriptions-design/README.md` (the description table there is the
exact copy to use).

**Branch:** `site-improvements`.

## Routing

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | 12 descriptions in `menu.ts`, unit test, owner review section | implementer-sonnet | reviewer-opus | Copy fixed in spec, transcription + test |
| 2 | Flicker test delta 100; `/visit/` hours table named by its h2 | implementer-sonnet | reviewer-opus | Two small specified changes |
| Final | Branch review | — | reviewer-opus | Lab rule |

Main session: Opus 5.5.

## Global Constraints

- Descriptions verbatim from the spec table; do not touch names, prices, options or existing descriptions.
- Docs change in the same commit as code; English in code and docs (menu copy itself is es/en data).
- Delete `AGENTS.md` if it appears; never commit it. Never set `NEXT_PUBLIC_GA_ID`.
- Acceptance: `npm run ci` green.

## Review Focus

1. A description typo or swapped es/en — the unit test compares against the spec table values.
2. An existing description overwritten — the unit test asserts the count of items with descriptions is exactly
   previous (36) + 12 = 48.
3. Menu search: descriptions are searchable (check `src/lib/search.ts` uses description); a search for "plátano" now
   matches tostones and maduros — covered by an assertion in Task 1.

---

### Task 1: Fill 12 descriptions

**Files:**
- Modify: `src/data/menu.ts` (add `description: t(es, en)` to the 12 ids in the spec table)
- Test: `tests/unit/menu-content.test.ts`
- Modify: `docs/content/menu-review.md` (new section, see spec "Owner review"), `docs/handoff.md` (Done line)

- [ ] **Step 1: Failing test** `"descriptions filled from Uber Eats (2026-11-17)"`: a table of the 12 `[id, es, en]`
  copied from the spec; for each, `menuItems.find(i => i.id === id)!.description` equals `{ es, en }`. Plus
  `expect(menuItems.filter(i => i.description).length).toBe(48)`. If `src/lib/search.ts` searches descriptions, add:
  searching "platano" (accent-insensitive) returns ids including `tostones` and `maduros-fritos` (use the search
  module's exported function; read it for the signature).
- [ ] **Step 2:** `npx vitest run tests/unit/menu-content.test.ts` → FAIL.
- [ ] **Step 3:** Add the 12 descriptions. Update `menu-review.md`: section "Descriptions from Uber Eats
  (2026-11-17)" with a table (ES name | ES description | EN description), a Q7 note ("Uber Eats describes the chicken
  calentado as mixed rice and beans with grilled chicken cutlet and eggs; the site keeps the printed line until you
  confirm"), and the list of items still without a description from the spec's non-goals.
- [ ] **Step 4:** `npm run ci` → green.
- [ ] **Step 5:** Commit `feat: menu descriptions for sides, desserts and drinks (from Uber Eats)`.

### Task 2: Review follow-ups

**Files:**
- Modify: `tests/e2e/chrome.spec.ts:162` (`[30, 60]` → `[30, 60, 100]`; for delta 100 assert the attribute changed
  exactly once and ends set; for 30 and 60 keep "at most once")
- Modify: `src/components/shared/HoursTable.tsx` (new optional prop `labelledBy?: string` → `aria-labelledby` on
  `<table>`), `src/app/[locale]/visit/page.tsx:37-38` (h2 gets `id="hours-title"`, HoursTable gets
  `labelledBy="hours-title"`)
- Test: `tests/e2e/pages.spec.ts` — on `/es/visit/`, `page.getByRole("table", { name: "Horario" })` is visible.

- [ ] **Step 1:** Write both test changes; build; run; the visit table test FAILS (delta-100 may already pass —
  report it).
- [ ] **Step 2:** Implement the prop and ids.
- [ ] **Step 3:** `npm run ci` → green.
- [ ] **Step 4:** Commit `test: flicker check above the threshold; name the visit hours table`.
