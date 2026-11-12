# Task 8: Home page

Spec pages: 03 ("Home" — sections 1–7 and the approved story text), 05.

**Files:**
- Create: `src/components/home/{Hero.tsx, Favorites.tsx, TodaySpecial.tsx, StoryTeaser.tsx, ReviewsBand.tsx, VisitBlock.tsx}`,
  `src/components/shared/{OpenStatus.tsx, HoursTable.tsx, MapEmbed.tsx, DeliveryLinks.tsx, DishCard.tsx, PhotoPlaceholder.tsx}`
- Modify: `src/app/[locale]/page.tsx`, `messages/{es,en}.json` (`home.*`, `status.*`, `hours.*`)
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `restaurant`, links (Task 2); `getOpenStatus`, `pickToday`, `formatTime` (Task 3); `menuItems`,
  `specials` (Task 4); `photos` (Task 5); `Button`, `Img`, `Eyebrow`, `track` (Task 6); `TrackedLink` (Task 7).
- Produces (reused by Tasks 10 and 11): `<OpenStatus locale />` (client; renders nothing until mounted);
  `<HoursTable locale />`; `<MapEmbed locale />` (client; a static card with a "Ver mapa"/"View map" button; on
  click it renders the iframe from `mapsEmbedUrl()` with a `title`, and calls `track('load_map', …)`);
  `<DeliveryLinks locale location />`; `<DishCard item photo locale />`; `<PhotoPlaceholder label />` (it renders only
  when `process.env.NODE_ENV !== 'production'`, otherwise `null`).

- [ ] **Step 1: Write `tests/e2e/home.spec.ts`**

- The H1 on `/es/` is "El sabor de Colombia, cerca de ti.", and on `/en/` it is "The authentic taste of Colombia,
  close to home."
- With a mocked clock (`page.clock.setFixedTime(new Date('2026-11-17T12:00:00-05:00'))`, a Tuesday), the status reads
  "Abierto ahora" and "9:00 p.m.". The today block shows "Ajiaco con arroz con pollo" and "$13". With
  `2026-11-17T22:30:00-05:00`, it reads "Cerrado" and "9:00 a.m.".
- Favorites: exactly 4 cards in order: Bandeja Paisa, Calentado…, Arroz a la marinera, Picada doble.
- The rating text contains "4.4" and "450+". The reviews links go to `reviewsUrl()` / `writeReviewUrl()`.
- `iframe[src*="google.com/maps"]` count is 0 on load, and 1 after clicking "Ver mapa".
- **Review Focus #3:** in a context with `javaScriptEnabled: false`, there is no "Abierto"/"Cerrado" text, the
  today block contains no `$` and no dish name, and its link points to `/es/specials/`.
- The page contains no element with `data-placeholder` in a production build.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement**

Build the sections in spec 03 order with the exact copy given there. ES strings go in `messages/es.json`, and EN
strings are a faithful translation listed under COPY-REVIEW. Drop the "lo que más destacan" line unless spec Q6 is
resolved (it is not, so leave it out). The story teaser uses the approved text and the dish photo
`dishes/picada-doble` until restaurant photos exist (no placeholder in production). The hero uses
`dishes/bandeja-paisa` with `priority`.

- [ ] **Step 4: Run** `npm run build && npm run e2e -- home` → PASS.

- [ ] **Step 5: Commit** `feat: build home page`
