# Menu search, swipe hint, phone orders, hidden gallery: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the owner-approved changes: menu search, the swipe hint, the phone-order block with the delivery
range, the gallery hidden from navigation, reservations by phone and January 1 closed.

**Architecture:** Static export stays as is. Search filters the server-rendered menu in place: each item carries a
normalized `data-search` string, a client toolbar hides non-matching items, groups and sections, and tells the chips
which categories are left. No menu data is shipped to the client twice.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 4, next-intl, Vitest,
Playwright.

**Spec:** [docs/superpowers/specs/2026-11-15-menu-search-design/README.md](../../specs/2026-11-15-menu-search-design/README.md)
(on top of the MVP spec `docs/superpowers/specs/2026-11-12-website-design/`).

## Routing

Main session: Opus 5.5 (orchestrates, does not implement).

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | Phone orders + delivery range, gallery hidden, dev origins | `implementer-sonnet` | `reviewer-opus` | Facts, copy and nav; fully specified |
| 2 | Sticky menu toolbar: search box look, swipe hint, measured offset | `implementer-sonnet` | `reviewer-opus` | One client component; look approved |
| 3 | Search filtering, no-results, analytics, a11y | `implementer-sonnet` | `reviewer-opus` | Pure function + DOM filter; algorithm pinned here |
| 4 | Reservations line, January 1 closed (status, hours note, JSON-LD) | `implementer-sonnet` | `reviewer-opus` | Hours algorithm pinned in the task |
| — | Final branch review | — | `reviewer-opus` | One review; no money or production data |

## Starting state

Branch `site-improvements`. Commit `wip: approved visual spike` holds the throwaway spike the owner approved by eye:
`PhoneOrder.tsx`, `deliveryRange`, the spike search box and hint in `CategoryChips.tsx`, the nav without gallery,
`allowedDevOrigins`. Tasks turn it into tested code; they may rewrite any spike line. The spike broke tests that
expect the old delivery note and the gallery link: Task 1 fixes those.

## Global Constraints

- Every fact (phone, miles, apps) comes from `src/data/restaurant.ts`; never hard-coded in components or messages.
- Client components get strings as props; no `useTranslations`. Every CTA link is a `TrackedLink`.
- Copy is exactly the spec's (ES and EN). Miles render as `1.5` in both languages.
- Mobile/desktop switch is `lg` (1024px). The swipe hint and fade exist only below `lg`.
- Code style: the repo has no Prettier; keep the existing ~120-column style. Do not run `prettier --write`.
- `next dev` may write `AGENTS.md`: delete it, never commit it. Never put `NEXT_PUBLIC_GA_ID` in `.env.local`.
- Docs change in the same commit as code (spec pages named per task).
- Acceptance for the branch: `npm run ci` green, `CHROME_PATH=/usr/bin/google-chrome npx lhci autorun` green,
  `npm run check:ga` green (run alone).

## Review Focus

1. Customer types while scrolled deep into the menu → the results must be in view (the page scrolls back to the top
   of the menu list), not hidden above the viewport. Test in Task 3.
2. Search for a dish in a subcategory (e.g. drinks) → the subcategory `h3` stays above the hit; empty subcategories
   and empty card/row lists disappear without leaving gaps. Test in Task 3.
3. Clearing the search after tapping a chip → full menu back, chips all back, active-chip highlighting still works.
   Test in Task 3.
4. Hint text shown/hidden changes the sticky block height → chip-tap jumps must still land each section heading just
   below the sticky block (offset is measured, not a constant). Test in Task 2.
5. JavaScript off → no search box, full menu, swipe hint and fade visible, all 13 chips work. Test in Task 2.

## Tasks

- [Task 1: Phone orders, delivery range, gallery hidden](task-01-phone-orders.md)
- [Task 2: Sticky menu toolbar](task-02-menu-toolbar.md)
- [Task 3: Search filtering](task-03-search.md)
- [Task 4: Reservations and holidays](task-04-reservations-holidays.md)

## Decisions log

- 2026-11-15 (Opus): Task 4 added after the owner answered Q3 (reservations by phone) and Q4 (holidays).
- 2026-11-15 (Opus): spike kept as the starting point (owner approved the look); tasks own its tests and clean-up.
- 2026-11-15 (Opus): Task 2 deep-link test bound is `< stack + 40`, not the plan's `+ 24` (sections have 20-28px top padding).
- 2026-11-15 (Opus): Task 2 also re-scrolls to the `#hash` after the search box mounts, and centering the active chip does not count as a swipe.
- 2026-11-15 (Opus): Task 2 review minors moved into the loop: malformed `#hash` no longer crashes, the swipe hint never comes back, offset uses `getBoundingClientRect`, no-JS deep link matches the fallback.
- 2026-11-15 (Opus): Task 3 `search` events drop terms with "@" or 5+ digits (`isTrackableSearchTerm`), since GA4 policy forbids personal data.
- 2026-11-15 (Opus): Task 3 sends the `search` event once per term typed (differs from the last one sent), so a re-search later counts again.
- 2026-11-15 (Opus): the footer hours also show "Cerrado el 1 de enero." (spec: everywhere hours show).
- 2026-11-15 (Opus): final fix wave includes the cheap minors (privacy wording, this log, dead `showPrompt`, `scroll-padding-top`, empty `closedDates` guard, search box spacing, `nyDate` comment, spec 03/05 notes).
- 2026-11-15 (Opus): scroll-padding attempt removed (resolved to auto); WCAG 2.4.11 left open in the handoff.
