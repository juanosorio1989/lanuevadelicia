# Root rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/` answers 200 with the Spanish home page (no 302 hop), and the nav and language switch behave on `/`
exactly as on `/es/`.

**Architecture:** One `_redirects` line changes from 302 to a 200 rewrite. Client components that read
`usePathname()` normalize `/` to `/es/` through one helper. The rewrite itself is verified on the branch preview
deploy, because the local static server does not emulate `_redirects`.

**Tech Stack:** Next.js 16 static export, React 19, next-intl, Vitest, Playwright, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-11-17-root-rewrite-design/README.md`

**Branch:** `root-rewrite`.

## Routing

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | Helper + NavLinks/LanguageSwitch + `_redirects` + check script + docs | implementer-sonnet | reviewer-opus | Small, fully specified |
| 2 | Push branch, verify on the preview deploy | Opus 5.5 (main) | — | Needs push, browser and judgment |
| Final | Branch review | — | reviewer-opus | Lab rule |

Main session: Opus 5.5 (orchestrates).

## Global Constraints

- `routing.defaultLocale` (from `src/i18n/routing.ts`) is the source of the default locale; never hard-code `"es"`
  in the helper.
- Canonical URLs, hreflang, sitemap and `public/index.html` do not change.
- Docs change in the same commit as code. English only.

## Review Focus

1. `/` with the EN link: must go to `/en/`, not `/` (unit test on the helper + preview check).
2. `/` and "Inicio": `aria-current="page"` on the home item (preview check).
3. Hydration on `/`: no React mismatch warning in the console (preview check).
4. `/es/nope/` must still return 404, not the home page (preview check).
5. Paths without a trailing slash (`/es/menu`) must still map unchanged (unit test).

---

### Task 1: Normalize the root path and switch to a 200 rewrite

**Files:**
- Create: `src/i18n/pathname.ts`
- Modify: `src/components/layout/NavLinks.tsx`, `src/components/layout/LanguageSwitch.tsx`, `public/_redirects`,
  `scripts/check-out.mjs:24`
- Test: `tests/unit/pathname.test.ts`
- Docs: `docs/superpowers/specs/2026-11-12-website-design/03-site-and-pages.md:19`, `07-technical.md:24-27`,
  `09-testing-launch.md:11-14`, `10-decisions-open.md:19` (and the Q12 row: note the rewrite removes the redirect
  cost; keep Q12 open until the preview check)

**Interfaces:**
- Produces: `export function localizedPathname(pathname: string): string` in `src/i18n/pathname.ts`.

- [ ] **Step 1: Write the failing test** `tests/unit/pathname.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { localizedPathname } from "@/i18n/pathname";

describe("localizedPathname", () => {
  it("maps the root to the default locale home", () => expect(localizedPathname("/")).toBe("/es/"));
  it("maps an empty path to the default locale home", () => expect(localizedPathname("")).toBe("/es/"));
  it("keeps locale paths", () => {
    expect(localizedPathname("/es/")).toBe("/es/");
    expect(localizedPathname("/en/menu/")).toBe("/en/menu/");
    expect(localizedPathname("/es/menu")).toBe("/es/menu");
  });
});
```

- [ ] **Step 2:** `npx vitest run tests/unit/pathname.test.ts` → FAIL (module not found).
- [ ] **Step 3:** Implement `localizedPathname` (`""` or `"/"` → `` `/${routing.defaultLocale}/` ``, anything else
  unchanged). In `NavLinks` and `LanguageSwitch`, wrap the hook: `const pathname = localizedPathname(usePathname());`.
  Nothing else in those components changes.
- [ ] **Step 4:** `npx vitest run tests/unit/pathname.test.ts` → PASS.
- [ ] **Step 5:** `public/_redirects` becomes exactly `/ /es/ 200`; `scripts/check-out.mjs` requires
  `"/ /es/ 200"`. Update the four spec pages to say "rewrite (200)" and why (spec `2026-11-17-root-rewrite-design`).
- [ ] **Step 6:** `npm run ci` → all green (existing e2e for `/` still passes through the `out/index.html` fallback).
- [ ] **Step 7: Commit** `feat: serve the Spanish home at / with a 200 rewrite` (code + tests + docs).

### Task 2: Verify on the preview deploy (Opus)

- [ ] `git push -u origin root-rewrite`; wait for the Cloudflare preview build; get its URL
  (`https://root-rewrite.lanuevadelicia.pages.dev`).
- [ ] `curl -sI <preview>/` → `HTTP/2 200`; `curl -s <preview>/ | grep -c '<html lang="es"'` → `1`;
  `curl -so /dev/null -w '%{http_code}' <preview>/es/nope/` → `404`.
- [ ] Browser at `<preview>/`: EN link href `/en/`, home nav item `aria-current="page"`, no console errors.
- [ ] Lighthouse mobile on `<preview>/` and `<preview>/es/`: no redirect audit savings on `/`; record LCPs in spec 10 Q12.
- [ ] If Pages serves the meta-refresh `index.html` at `/`: stop, report, revisit the spec.
- [ ] Update `docs/handoff.md`; commit.
