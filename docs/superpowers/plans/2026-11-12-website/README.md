# La Nueva Delicia Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (es default, en) static marketing site for La Nueva Delicia described in the spec, ready
to deploy on Cloudflare Pages.

**Architecture:** Next.js App Router with `output: 'export'`, so it builds to plain files in `out/`. next-intl uses a
`[locale]` segment, with no middleware. All content lives in typed, Zod-validated TypeScript data files. Dynamic bits
(open-now, today's special, map, dialogs, chip highlight) are small client components. Pages are Server Components.

**Tech Stack:** Next.js (latest stable), React, TypeScript strict, Tailwind CSS, next-intl, Zod, Lucide,
next-image-export-optimizer, sharp (import script), Vitest, Playwright, @axe-core/playwright, @lhci/cli. Node 22 LTS.

**Spec:** `docs/superpowers/specs/2026-11-12-website-design/` (README plus pages 01–10). Every implementer reads the
spec pages named in their task.

## Routing

Main session: **Opus 5.5** (it orchestrates and does not implement normal tasks).

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | Scaffold, static export, i18n skeleton, test harness, hosting files | implementer-sonnet | reviewer-opus | Config detailed in the task |
| 2 | Types, Zod schemas, restaurant facts, link builders | implementer-sonnet | reviewer-opus | Exact values given |
| 3 | Hours and today's-special logic | implementer-sonnet | reviewer-opus | Pure functions, tests given |
| 4 | Menu and specials data transcription plus Spanish copy | **implementer-opus** | reviewer-opus | Production data: public prices, read visually from the PDF |
| 5 | Photo import script and photo registry | implementer-sonnet | reviewer-opus | Mechanical, lists given |
| 6 | Design tokens, fonts, `Button`, `Img`, `track()` | implementer-sonnet | reviewer-opus | Tokens given |
| 7 | Site chrome: header, mobile nav, bottom bar, language switch, footer | implementer-sonnet | reviewer-opus | Layout given |
| 8 | Home page | implementer-sonnet | reviewer-opus | Sections given |
| 9 | Menu page | implementer-sonnet | reviewer-opus | Layout given |
| 10 | Specials page | implementer-sonnet | reviewer-opus | Layout given |
| 11 | Story, Gallery, Visit, Privacy, 404 | implementer-sonnet | reviewer-opus | Layout given |
| 12 | SEO: metadata, hreflang, sitemap, robots, JSON-LD, OG | implementer-sonnet | reviewer-opus | Rules given |
| 13 | GA4 loader, CSP check, cross-site e2e/axe/links, Lighthouse, CI | implementer-sonnet | reviewer-opus | Commands given |

Order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13. Tasks 3, 4 and 5 only depend on Task 2. Per task:
implement → reviewer-opus → fix → re-review. Then one final branch review. Launch (Cloudflare account, DNS, GA4
property, Search Console) is **not** a plan task. It is the owner-in-the-loop checklist in spec page 09, run by Opus
with the user.

Branch: `website-mvp`, off `website-design`. Commit per task. There is no Git remote yet: Opus asks the user before
creating a GitHub repo or pushing.

## Task files

[task-01](task-01-scaffold.md) · [task-02](task-02-data-core.md) · [task-03](task-03-hours.md) ·
[task-04](task-04-menu-data.md) · [task-05](task-05-photos.md) · [task-06](task-06-design-primitives.md) ·
[task-07](task-07-chrome.md) · [task-08](task-08-home.md) · [task-09](task-09-menu-page.md) ·
[task-10](task-10-specials.md) · [task-11](task-11-other-pages.md) · [task-12](task-12-seo.md) ·
[task-13](task-13-quality-ci.md)

## Global Constraints

- `next.config`: `output: 'export'`, `trailingSlash: true`. No middleware, server actions, runtime route handlers or
  ISR (spec 07).
- Locales `['es','en']`, default `es`, `localePrefix: 'always'`. The same English path segments in both locales:
  `/menu/ /specials/ /our-story/ /gallery/ /visit/ /privacy/` (spec 03).
- `app/layout.tsx` passes children through. `app/[locale]/layout.tsx` renders `<html lang>`. There is no
  `app/page.tsx`. `app/not-found.tsx` renders its own `<html lang="es">` (spec 07).
- Facts come only from `src/data/restaurant.ts`, never hard-coded in components. Address
  `93-16B 37th Ave, Jackson Heights, NY 11372`; phone `tel:+17186723456`, displayed as `(718) 672-3456` (spec 02).
- Never invent a price, ingredient, review, hour or story. Copy that is not in the spec goes in a `// COPY-REVIEW`
  list in the PR notes for the owner.
- Weekdays are ISO: 1 = Monday … 7 = Sunday. All time logic is in `America/New_York`.
- Colors: only the spec 05 tokens. Small terracotta text and button backgrounds use `terra-700 #A2471F`, never
  `#C85E36`.
- Targets are at least 44px. Visible focus. One H1 per page. Every `<img>` has bilingual alt text. The menu works
  with JS off.
- Do not use `aggregateRating`/`review` in JSON-LD. Show the rating as "4.4 ★ · 450+" text.
- Home-page module JS is at most 170 KB gzipped (excluding the noModule polyfill; the Next 16 + React 19 baseline is about 122 KB). No Radix dialogs: use native `<dialog>`.
- Code, comments and docs in English. UI copy in `messages/{es,en}.json` or the bilingual data files.
- Docs change in the same commit as code (lab rule). Each task updates `README.md` (project root) sections it
  affects.

## Review Focus

1. **A visitor whose phone is in another timezone** (a tourist on Bogotá or London time) must still see the open
   status and today's special in New York time. Pinned in Task 3 (`TZ=Europe/London` test run).
2. **A 320px-wide phone** (iPhone SE, large font): no horizontal page scroll. The chips scroll inside their own row,
   and the bottom bar labels don't overflow. Pinned in Task 13 e2e (`scrollWidth <= innerWidth` on every page).
3. **JS disabled or slow hydration:** no open/closed badge, no dish or price in the home "today" teaser, and every
   nav, menu chip and CTA still works as a plain link. Pinned in Task 8 and Task 9 e2e (`javaScriptEnabled: false`).
4. **A deep link to a menu section** (`/en/menu/#cocteles`): the section heading is not hidden under the sticky
   header and chips. Pinned in Task 9 e2e (heading top ≥ the sticky stack's height).
5. **Unknown or wrong URLs** (`/fr/`, `/es/nope/`, `/menu/` without a locale): a real 404 page, not a crash, a 200
   or a redirect loop. Pinned in Task 1 (build output check) and Task 13 (e2e on the served `out/`).
