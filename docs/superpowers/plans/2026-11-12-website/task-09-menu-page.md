# Task 9: Menu page

Spec pages: 03 ("Menu"), 04, 05.

**Files:**
- Create: `src/components/menu/{MenuCategorySection.tsx, MenuItemRow.tsx, MenuItemCard.tsx, CategoryChips.tsx}`
- Modify: `src/app/[locale]/menu/page.tsx`, `messages/{es,en}.json` (`menu.*`)
- Test: `tests/e2e/menu.spec.ts`

**Interfaces:**
- Consumes: `categories`, `menuItems` (Task 4); `photos` (Task 5); `Img`, `track` (Task 6); `DishCard` (Task 8 may be
  reused for the card).
- Produces: section anchors `id={category.id}` (for example `#cocteles`). Task 12 builds the Menu JSON-LD from the
  same data.

- [ ] **Step 1: Write `tests/e2e/menu.spec.ts`**

- 13 chips in spec 04 order, and 13 `section[id]` elements with the same ids. Each chip `href` is `#<id>`.
- Every available item appears once. Items with an `image` render as cards before the rows in their section.
  Hidden items (`available: false`) are absent (use a test fixture only if one exists; otherwise assert that the
  count equals `menuItems.filter(i => i.available !== false).length`).
- Option prices render (for example juices show both "$7" and "$6").
- The price note "Precios en el restaurante" is visible on `/es/menu/`, and "In-restaurant prices" on `/en/menu/`.
- **Review Focus #4:** `goto('/en/menu/#cocteles')` → the `#cocteles h2` bounding-box top is ≥ the bottom of the
  sticky header plus the chip bar (use `scroll-margin-top` on sections).
- **Review Focus #3:** with JS disabled, clicking the chip "Postres" changes the URL to `#postres`, and the section
  is in view.
- With JS on, after scrolling to `#mariscos`, that chip has `aria-current="true"`.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** per spec 03 "Menu"

The chips are a server-rendered list of anchors. `CategoryChips` is a client enhancement that uses
`IntersectionObserver` to set `aria-current` and to scroll the active chip into view horizontally. A chip tap calls
`track('view_menu_category', {category})`. Featured items get the "Favorito"/"Favorite" tag. Desktop rows use 2 columns, and mobile uses 1 column with the 104×92
thumbnail card.

- [ ] **Step 4: Run** `npm run build && npm run e2e -- menu` → PASS.

- [ ] **Step 5: Commit** `feat: build crawlable bilingual menu page`
