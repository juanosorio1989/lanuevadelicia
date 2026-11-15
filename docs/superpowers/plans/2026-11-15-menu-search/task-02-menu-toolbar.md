# Task 2: Sticky menu toolbar (search box look, swipe hint, measured offset)

Implementer: `implementer-sonnet`. Reviewer: `reviewer-opus`. Spec sections 1 (look, no-JS) and 2.

**Files:**
- Create: `src/components/menu/MenuToolbar.tsx` (client)
- Modify: `src/components/menu/CategoryChips.tsx` (spike; restore the repo's ~120-col style, the spike was
  Prettier-formatted by mistake)
- Modify: `src/app/[locale]/menu/page.tsx`, `messages/es.json`, `messages/en.json`
- Test: `tests/e2e/menu.spec.ts`

**Interfaces:**
- Produces: `MenuToolbar({ chips: Chip[]; labels: MenuToolbarLabels })`, `data-testid="menu-toolbar"`, the sticky
  block (`sticky top-[var(--menu-header-h)] z-30`). Renders, in order: the search box (only after hydration), then
  `CategoryChips`. Task 3 adds state and props to it.
- Produces: `type MenuToolbarLabels = { chips: string; swipeHint: string; search: string }` (exported from
  `MenuToolbar.tsx`), filled from `menu.chipsLabel`, `menu.swipeHint`, `menu.searchLabel`.
- Produces: `CategoryChips({ chips, label, swipeHint })`: renders the hint line, then a `relative` box with the
  `nav[data-testid=menu-chips]` and the fade. No sticky wrapper of its own. Its IntersectionObserver `rootMargin` top
  uses the bottom of the closest `[data-testid=menu-toolbar]`.
- Produces: the search `<input type="search">` inside `<div role="search">`, accessible name = `labels.search`
  (sr-only label), placeholder = `labels.search`. Copy: es "Buscar en el menú…", en "Search the menu…" (spike keys
  exist; verify).

Look (approved, keep the spike's classes): search box `rounded-full border-[1.5px] border-sand-100 bg-white min-h-11`,
magnifier `Search` 18px `text-green-900`, focus border `green-900`; hint `text-[0.8125rem] font-bold text-terra-700`,
`lg:hidden`, text `{swipeHint} →`, `aria-hidden`; fade `w-14` gradient from `cream-50` with `ChevronRight` 22px over
the chip row only, `lg:hidden`, `aria-hidden`, `pointer-events-none`, opacity 0 at the end of the row.

Behavior:
- Hint hides (`hidden`) once the chip row is scrolled > 8px or does not overflow; it does not come back. Fade hides at
  the end of the row. Without JS both render visible.
- Search box renders only after mount (no-JS HTML has no search box).
- **Measured offset:** `MenuToolbar` measures its own height with a `ResizeObserver` and sets
  `--menu-sticky-offset` on its parent element to `calc(var(--menu-header-h) + <height>px + 0.25rem)`. `page.tsx`
  keeps a static fallback for no-JS equal to header + hint + chip row (compute it from the rendered no-JS height at
  390px; replace the spike's `7.25rem`).

- [ ] **Step 1: Write the failing tests** (`tests/e2e/menu.spec.ts`)

```ts
test.describe("390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("search box and swipe hint; hint styled like the category note; hides after swiping", async ({ page }) => {
    await page.goto("/es/menu/");
    const toolbar = page.getByTestId("menu-toolbar");
    await expect(toolbar.getByRole("searchbox", { name: "Buscar en el menú…" })).toBeVisible();
    const hint = page.getByTestId("menu-swipe-hint");
    await expect(hint).toHaveText("Desliza para ver más categorías →");
    const style = (sel: string) => page.locator(sel).first().evaluate((e) => { const s = getComputedStyle(e); return [s.color, s.fontWeight, s.fontSize]; });
    expect(await style("[data-testid=menu-swipe-hint]")).toEqual(await style("#desayunos h2 + p"));
    await page.getByTestId("menu-chips").evaluate((n) => { n.scrollLeft = 150; });
    await expect(hint).toBeHidden();
  });
  test("toolbar stays under the header after scrolling", async ({ page }) => {
    await page.goto("/es/menu/");
    await page.mouse.wheel(0, 2000);
    await expect(page.getByRole("searchbox")).toBeInViewport();
    const s = await sticky(page);
    const top = await page.getByTestId("menu-toolbar").evaluate((e) => e.getBoundingClientRect().top);
    expect(Math.abs(top - s.header)).toBeLessThanOrEqual(1);
  });
});
test("en: search box label", async ({ page }) => {
  await page.goto("/en/menu/");
  await expect(page.getByRole("searchbox", { name: "Search the menu…" })).toBeVisible();
});
test("desktop: no swipe hint", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/es/menu/");
  await expect(page.getByTestId("menu-swipe-hint")).toBeHidden();
});
```
In the existing "JS disabled" describe, add: at 390px, `getByRole("searchbox")` count 0, hint visible, 13 chip links.

Review Focus 4: extend the existing deep-link loop with a fourth setup `["390px after swiping chips", ...]` that loads
`/en/menu/`, scrolls the chip row by 150px (hint hides, toolbar shrinks), then clicks the "Cocktails" chip; the
`#cocteles h2` top must be `>= stack` and `< stack + 24`. Add the same `< stack + 24` upper bound to the existing three
setups.

- [ ] **Step 2: Run to see them fail**

Run: `npm run build && npx playwright test tests/e2e/menu.spec.ts`
Expected: FAIL (no `menu-toolbar` test id yet; style or offset assertions).

- [ ] **Step 3: Implement `MenuToolbar` and the `CategoryChips` split as described above**

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm run build && npx playwright test tests/e2e/menu.spec.ts tests/e2e/site.spec.ts`
Expected: all pass (site.spec runs axe, console/CSP errors, one h1, no horizontal scroll at 320px).

- [ ] **Step 5: Commit**

```bash
git add src/components/menu src/app/[locale]/menu/page.tsx messages tests/e2e/menu.spec.ts
git commit -m "feat: sticky menu toolbar with search box and swipe hint"
```
