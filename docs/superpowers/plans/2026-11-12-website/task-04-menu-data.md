# Task 4 (Opus): Menu and specials data

Spec pages: 04 (categories, item rules, specials table), 06 (photo ids), 02 (price rule).
Why Opus: these are public prices and descriptions, read visually from the PDFs. A wrong price ships to customers.

**Files:**
- Modify: `src/data/menu.ts` (fill `categories`, `menuItems`), `src/data/specials.ts` (fill `specials`)
- Create: `docs/content/README.md` (index) and `docs/content/menu-review.md` (owner proof list, see Step 5)
- Test: `tests/unit/menu-content.test.ts`

**Interfaces:**
- Consumes: `MenuCategory`, `MenuItem`, `SpecialDay`, `validateContent()` (Task 2). Photo ids: use the slugs Task 5
  will create. The rule is `<group>/<kebab-case of the menu item id>`, for example `dishes/bandeja-paisa`, with the
  item id equal to the kebab-case Spanish name without accents. If Task 5 is not merged yet, leave `image` unset and
  list the intended ids in `docs/content/menu-review.md`. Task 5 sets them.
- Produces: `categories` (13 entries, ids and order exactly as in spec 04), `menuItems`, and `specials` (7 entries).

- [ ] **Step 1: Write `tests/unit/menu-content.test.ts`** (exact values pinned from the spec and PDF)

```ts
expect(categories.map(c => c.id)).toEqual(['desayunos','antojitos','ricuras','pollo','mariscos','ensaladas',
  'especiales','infantil','extras','postres','bebidas','cocteles','cervezas']);
const byId = Object.fromEntries(menuItems.map(i => [i.id, i]));
expect(byId['bandeja-paisa'].price).toBe(23);
expect(byId['picada-doble'].price).toBe(65);
expect(byId['calentado-con-chuleta-y-huevos-al-gusto'].price).toBe(12.99);
expect(byId['arroz-a-la-marinera'].price).toBe(28);
expect(byId['entrana-a-la-marinera'].price).toBe(43);
expect(byId['arepa-asada'].price).toBe(3);
expect(menuItems.filter(i => i.featured).sort((a,b)=>a.featuredOrder!-b.featuredOrder!).map(i => i.id))
  .toEqual(['bandeja-paisa','calentado-con-chuleta-y-huevos-al-gusto','arroz-a-la-marinera','picada-doble']);
expect(specials.map(s => [s.day, s.price])).toEqual([[1,13],[2,13],[3,13],[4,13],[5,15],[6,15],[7,15]]);
expect(specials.find(s => s.day === 4)?.alternative?.es).toBe('Sancocho de pescado con mojarra frita');
expect(menuItems.every(i => i.name.es && i.name.en)).toBe(true);
expect(JSON.stringify(menuItems)).not.toMatch(/tounge|beed|soupe|onios|Ask far|seafoodrice|chower/);
```

- [ ] **Step 2: Run it** → FAIL (empty data).

- [ ] **Step 3: Transcribe** every item in both PDFs (`assets-inbox/Menus/`)

Render the pages to images (`pdftoppm -r 110 -png`) and **read each price from the image**. Use the `reference/`
text extracts only as a help. Follow every rule in spec 04: spelling fixes, `descriptionEs` as a faithful rendering,
options for flavors and in-milk/in-water, notes per category, the specials table verbatim, and "Sopa grande adicional
$6" plus "Cualquier carne de los especiales $7".

- [ ] **Step 4: Run** `npm test` → PASS (including `validateContent()`).

- [ ] **Step 5: Write `docs/content/menu-review.md`** for the owner: a table of every item (category, ES name, EN
name, price, PDF page), followed by "Needs owner check": the two calentado descriptions (spec Q7), any price that
was hard to read, and every `descriptionEs`/`nameEn` Claude wrote. Link it from `docs/content/README.md`.

- [ ] **Step 6: Commit** `feat: add full bilingual menu and weekly specials data`
