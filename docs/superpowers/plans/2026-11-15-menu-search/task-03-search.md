# Task 3: Search filtering, no-results, analytics, accessibility

Implementer: `implementer-sonnet`. Reviewer: `reviewer-opus`. Spec section 1.

**Files:**
- Create: `src/lib/search.ts`, `tests/unit/search.test.ts`
- Modify: `src/components/menu/MenuItemCard.tsx`, `MenuItemRow.tsx`, `MenuCategorySection.tsx`, `MenuToolbar.tsx`,
  `CategoryChips.tsx`, `src/app/[locale]/menu/page.tsx`
- Modify: `src/lib/analytics.ts`, `tests/unit/analytics.test.ts`
- Modify: `messages/es.json`, `messages/en.json`
- Modify: `docs/superpowers/specs/2026-11-12-website-design/08-seo-analytics.md` (events table)
- Test: `tests/e2e/menu.spec.ts`

**Interfaces:**
- Consumes (Task 2): `MenuToolbar`, `MenuToolbarLabels`, `CategoryChips`, `data-testid="menu-toolbar"`.
- Produces (`src/lib/search.ts`):
  - `normalizeSearch(s: string): string`: Unicode NFD, drop combining marks (U+0300–U+036F), lower-case, every run of
    non-letter/non-digit characters becomes one space, trimmed. `"Fríjoles, ¡Mañana!"` → `"frijoles manana"`.
  - `matchesSearch(normalizedText: string, query: string): boolean`: splits `normalizeSearch(query)` on spaces; true
    when every token is a substring of `normalizedText`; true for an empty or blank query.
- Produces (DOM contract, server-rendered):
  - each item `li[data-item]` gets `data-search={normalizeSearch(`${item.name[locale]} ${item.description?.[locale] ?? ""}`)}`;
  - each card/row `ul` that holds items gets `data-search-list`; each subcategory group `div` gets `data-search-group`;
  - the menu sections' container in `page.tsx` gets `data-menu-list`.
- Produces: `EventParams.search: { search_term: string }`; `TrackLocation` gains `"menu"`.
- Produces: `CategoryChips` prop `hiddenIds?: ReadonlySet<string>`: a chip whose id is in it renders its `li` with
  `hidden`.
- Produces: `MenuToolbar` props become `{ chips; labels: MenuToolbarLabels; phone: { display: string; href: string } }`
  (from `restaurant.phone.display` and `telHref()` in `page.tsx`). `MenuToolbarLabels` gains
  `clear`, `noResults`, `noResultsCall`, `resultsOne`, `resultsOther`.

Copy (new `menu.*` keys):

| key | es | en |
|-----|----|----|
| `searchClear` | Borrar búsqueda | Clear search |
| `noResults` | No encontramos ese plato. | We couldn't find that dish. |
| `noResultsCall` | Llámanos al | Call us at |
| `resultsOne` | 1 plato | 1 dish |
| `resultsOther` | `{count} platos` (client replaces `{count}`) | `{count} dishes` |

Privacy copy (`privacy.analytics`): es "…qué páginas se visitan, qué botones se tocan y qué se busca en el menú. …";
en "…which pages are visited, which buttons are tapped and what is searched for in the menu. …" (rest unchanged).

Filter algorithm (`applyFilter` inside `MenuToolbar`, run on every query change against `[data-menu-list]`):
```
for each li[data-item]: hidden = !matchesSearch(li.dataset.search, query)
for each [data-search-list], then [data-search-group], then section[id]:
  hidden = query non-empty AND no descendant li[data-item]:not([hidden])
visible categories = ids of sections not hidden → CategoryChips hiddenIds = all chip ids minus those
count = number of visible li[data-item]
```
An empty query removes every `hidden` set by the filter.

Behavior:
- Clear button (✕ `X` icon, `aria-label={labels.clear}`, min 44×44) shows only when the query is non-empty; it and
  Escape (in the input) empty the query and keep focus in the input.
- Scroll into view (Review Focus 1): on a query change, if the top of `[data-menu-list]` is above the toolbar's
  bottom, `window.scrollTo` (instant) so it sits right under the toolbar.
- No results: right after the sticky block, `data-testid="menu-no-results"`, a paragraph
  `{noResults} {noResultsCall} <phone link>.`; the phone link is a `TrackedLink` `event="click_call"`
  `params={{ location: "menu" }}` `href={phone.href}` with text `phone.display`.
- Live region: a visually hidden `role="status"` in the toolbar; empty when the query is empty; otherwise
  `resultsOne` / `resultsOther` with the count, or the `noResults` text at 0.
- Analytics: 1 s after the last change, if `query.trim().toLowerCase()` has ≥ 2 characters and differs from the last
  term sent, `track("search", { search_term })`. Clear the timer on unmount.

- [ ] **Step 1: Write the failing unit tests**

`tests/unit/search.test.ts`:
```ts
expect(normalizeSearch("Fríjoles, ¡Mañana!")).toBe("frijoles manana");
expect(normalizeSearch("  JUGO   de  Maracuyá ")).toBe("jugo de maracuya");
expect(matchesSearch("cazuela de frijoles con pezuna", "PEZUÑA frijol")).toBe(true);
expect(matchesSearch("jugo de mora", "jugo mango")).toBe(false);
expect(matchesSearch("anything", "   ")).toBe(true);
expect(matchesSearch("bandeja paisa", "paisa bandeja")).toBe(true);
```
`tests/unit/analytics.test.ts`: `track("search", { search_term: "bandeja" })` calls gtag with
`("event", "search", { locale: "es", search_term: "bandeja" })`.

- [ ] **Step 2: Run them**

Run: `npx vitest run tests/unit/search.test.ts tests/unit/analytics.test.ts`
Expected: FAIL (module not found / type error).

- [ ] **Step 3: Implement `src/lib/search.ts` and the analytics types; run Step 2 again → PASS**

- [ ] **Step 4: Write the failing e2e tests** (`tests/e2e/menu.spec.ts`, `describe("search")`)

Expected counts are computed in the test from `menuItems` (available only) with `normalizeSearch`/`matchesSearch`,
never hard-coded. Helper `expected(locale, q)` = that count; `visibleItems = page.locator("main li[data-item]:visible")`.
- "filters by name, ignoring accents and case (es)": type `FRIJOLES` → `visibleItems` count = `expected("es", "frijoles")`
  (> 0 and < all); every visible chip's `href` id is a visible section; hidden sections' chips are hidden.
- "en matches English text": `/en/menu/`, type `beans` → count = `expected("en", "beans")` > 0.
- "every word must match": type `jugo mora` → count = `expected("es", "jugo mora")`.
- "subcategory heading stays with its hit" (Review Focus 2): pick the first available item with a `subcategory` in a
  category that has ≥ 2 subcategories; search its exact ES name; its group `h3` is visible; every other
  `[data-search-group]` in that section is hidden; no visible `[data-search-list]` is empty.
- "no results offers the phone": type `zzzz` → `menu-no-results` visible with "No encontramos ese plato. Llámanos al
  (718) 672-3456."; its link `href` = `telHref()`; no visible `main section[id]`; status region says the no-results
  text.
- "clear and Escape restore the full menu; chips still work" (Review Focus 3): type `pollo`, click "Borrar búsqueda" →
  `visibleItems` count = all available, 13 visible chips, clear button hidden, input focused; type `pollo`, press
  Escape → same; then click chip "Postres" → it gets `aria-current="true"` and `#postres` is in view.
- "typing deep in the page brings results into view" (Review Focus 1): at 390px, scroll 4000px, type `bandeja` → the
  first visible item is in the viewport and below the toolbar.
- "live region counts dishes": type `bandeja` → `role=status` text = `resultsOne` or `resultsOther` with the expected
  count.
- "sends one search event after a pause": `page.addInitScript(() => { (window as any).__ev = []; (window as any).gtag = (...a: unknown[]) => (window as any).__ev.push(a); })`;
  type `b`, wait 1200 ms → no `search` event; type `andeja`, wait 1200 ms → exactly one `["event","search",{…search_term:"bandeja"}]`.

- [ ] **Step 5: Run them**

Run: `npm run build && npx playwright test tests/e2e/menu.spec.ts`
Expected: the new search tests FAIL.

- [ ] **Step 6: Implement the DOM contract, filter, clear, scroll, no-results, live region and analytics as above;
  update spec 08 (add `search` row: "Menu search, 1 s after typing stops, 2+ chars, once per term" | `search_term`;
  add `menu` to the `click_call` locations) and the privacy copy**

- [ ] **Step 7: Verify the whole branch**

Run: `npm run ci && CHROME_PATH=/usr/bin/google-chrome npx lhci autorun`
Expected: all green; Lighthouse budgets pass on `/es/menu/`. Then, on its own: `npm run check:ga` → passes.

- [ ] **Step 8: Commit**

```bash
git add src tests messages docs/superpowers/specs
git commit -m "feat: menu search with accent-insensitive filtering, no-results phone link and search analytics"
```
