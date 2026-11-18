# New photos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 12 menu items get photos, `/visit/` shows the storefront by day, `/our-story/` the storefront at night.

**Architecture:** Add entries to `scripts/photo-manifest.ts`, point menu items' `image` at them, regenerate with
`npm run photos`, use the two restaurant photos in the two pages.

**Tech Stack:** Next.js 16 static export, sharp, next-image-export-optimizer, Vitest, Playwright, Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-11-17-new-photos-design/README.md` (mapping tables are the source of truth).

**Branch:** `new-photos`.

## Routing

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | Manifest + menu images + regenerate + two pages + docs | implementer-sonnet | reviewer-opus | Fully specified by the spec tables |
| Final | Branch review | — | reviewer-opus | Lab rule |

Main session: Opus 5.5 (orchestrates).

## Global Constraints

- Sources, item ids, photo ids and alt texts exactly as in the spec tables. Do not use the video or
  `Ricuras de la casa/Lomo de cerdo empanizado.jpg`.
- `assets-inbox/` is read only and never committed. Generated `public/images/**` masters and `src/data/photos.ts` are
  committed.
- Docs change in the same commit as code. English only.

## Review Focus

1. Every new `image` resolves (unit test `tests/unit/menu-content.test.ts` checks both sides).
2. Lighthouse budgets on `/visit/` and `/our-story/` still pass with the new images (LCP, CLS).
3. The `/visit/` storefront photo must have explicit dimensions (no layout shift) and not be `priority`.
4. Existing photos must not change: `npm run photos` is idempotent; `git diff --stat public/images` shows only new files.

---

### Task 1: Import the new photos and use them

**Files:**
- Modify: `scripts/photo-manifest.ts`, `src/data/menu.ts`, `src/data/photos.ts` (generated),
  `src/app/[locale]/visit/page.tsx`, `src/app/[locale]/our-story/page.tsx`
- Create: `public/images/dishes/<item-id>.jpg` ×12, `public/images/restaurant/fachada-{dia,noche}.jpg` (generated)
- Docs: `docs/superpowers/specs/2026-11-12-website-design/06-photos.md` (new photos, owner decisions, the skipped
  file), `docs/handoff.md` (storefront photos done; interior photos still pending)

- [ ] **Step 1:** In `photo-manifest.ts`, add the 12 `item("dishes", source, itemId)` entries under their folder
  comments (add `// MENU INFANTIL`), and a helper `place(source: string, id: string, es: string, en: string)` returning
  `{ source, id: \`restaurant/${id}\`, group: "restaurant", alt: { es, en } }` with the two storefront entries (alt
  copied verbatim from the spec).
- [ ] **Step 2:** In `src/data/menu.ts`, add `image: "dishes/<item-id>"` to the 12 items (turn one-line rows into
  objects where needed).
- [ ] **Step 3:** `npx vitest run tests/unit/menu-content.test.ts tests/unit/photos.test.ts` → PASS.
- [ ] **Step 4:** `npm run photos` → prints the new ids; `git status` shows only new files under `public/images/`
  plus `src/data/photos.ts` (and icons unchanged).
- [ ] **Step 5:** `/our-story/`: use `getPhoto("restaurant/fachada-noche")`, drop the stand-in comment.
  `/visit/`: the right column becomes a `div` with the storefront photo (`Img`, `sizes="(min-width: 768px) 56vw,
  100vw"`, `className="h-64 w-full rounded-card object-cover md:h-80"`, not priority) above `MapEmbed`, gap `gap-4`
  (`flex flex-col`).
- [ ] **Step 6:** `npm run ci` → green. `CHROME_PATH=/usr/bin/google-chrome npx lhci autorun` → all assertions pass.
- [ ] **Step 7:** One commit `feat: storefront and Instagram dish photos` (code, generated files, docs).
