# Task 10: Weekly specials page

Spec pages: 03 ("Weekly specials"), 04 (specials table and notes).

**Files:**
- Create: `src/components/specials/{SpecialDayCard.tsx, TodayHighlighter.tsx}`
- Modify: `src/app/[locale]/specials/page.tsx`, `messages/{es,en}.json` (`specials.*`, day names)
- Test: `tests/e2e/specials.spec.ts`

**Interfaces:**
- Consumes: `specials` (Task 4), `photos` (Task 5), `pickToday` (Task 3), `Img` (Task 6).
- Produces: anchors `id="day-<1..7>"`.

- [ ] **Step 1: Write `tests/e2e/specials.spec.ts`**

- 7 day sections, Monday first, each with its flyer image (alt contains the dish text) and its main dish as text.
- Thursday shows both "Mondongo con chuleta de cerdo" and "Sancocho de pescado con mojarra frita". The alternative
  shows no price, but the note "el precio puede cambiar según la elección de la carne" is present.
- Prices: Mon–Thu "$13", Fri–Sun "$15". "Sopa grande adicional" "$6" is present.
- With the clock fixed to Friday `2026-11-20T12:00:00-05:00`, `#day-5` has `aria-current="date"` and a visible "Hoy"
  badge.
- With JS disabled, no day has `aria-current`.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement**

The day cards are server-rendered. `TodayHighlighter` (client) sets `aria-current` and the badge, and scrolls to
today on first load (only when there is no hash). The flyers load lazily, except today's.

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Commit** `feat: build weekly specials page`
