# Task 11: Our story, Gallery, Visit, Privacy, 404

Spec pages: 03 ("Our story", "Gallery", "Visit us", "Click-to-load map"), 06 (restaurant photo rules), 08 (privacy
disclosure).

**Files:**
- Modify: `src/app/[locale]/{our-story,gallery,visit,privacy}/page.tsx`, `src/app/not-found.tsx` (style it with the
  tokens), `messages/{es,en}.json`
- Create: `src/components/gallery/{GalleryGrid.tsx, GalleryDialog.tsx}`
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `OpenStatus`, `HoursTable`, `MapEmbed`, `DeliveryLinks`, `PhotoPlaceholder` (Task 8); `photos` (Task 5);
  `restaurant` (Task 2).

- [ ] **Step 1: Write `tests/e2e/pages.spec.ts`**

- Our story (`/es/our-story/`): it contains the approved ES story text verbatim (spec 03), the three "what to
  expect" items, and Cómo llegar plus Ver menú buttons. There is no owner name or nationality wording: assert that
  the page text does not match `/colombian(o|a)s? (team|equipo)|equipo colombiano|dueñ/i`.
- Gallery: it shows groups "Comida" and "Bebidas". "El restaurante" is absent while there are no `restaurant`
  photos. Clicking a thumbnail opens a `<dialog open>` with the larger image and its alt text. Escape closes it.
- Visit: the address, the hours table with the two rules, the breakfast and happy-hour lines, 3 delivery links, the
  "¿Evento o grupo grande? Llámanos." line, and the delivery-distance note. There is no transit text.
- Privacy: it mentions Google Analytics and `info@lanuevadelicia.com`, in both locales.
- 404 (`/es/nope/`): styled with the tokens, in both languages, and the 4 links work.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** per spec 03. The privacy copy is short and plain: what GA4 collects (anonymous usage),
why (to improve the site), no ads, the contact email. Put it under COPY-REVIEW.

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Commit** `feat: build story, gallery, visit, privacy and 404 pages`
