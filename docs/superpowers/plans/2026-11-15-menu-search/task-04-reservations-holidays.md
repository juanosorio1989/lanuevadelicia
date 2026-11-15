# Task 4: Reservations and holidays

Implementer: `implementer-sonnet`. Reviewer: `reviewer-opus`. Spec section 5. Runs after Task 1 (`PhoneOrder`).

**Files:**
- Modify: `src/types/content.ts` (`Restaurant.closedDates`), `src/data/restaurant.ts`
- Modify: `src/lib/hours.ts`, `src/components/shared/OpenStatusLive.tsx` (pass closed dates)
- Modify: `src/components/shared/HoursTable.tsx` (holiday note), `src/components/shared/PhoneOrder.tsx`
- Modify: `src/lib/seo.ts` (`acceptsReservations`, `specialOpeningHoursSpecification`), `src/lib/format.ts`
- Modify: `messages/es.json`, `messages/en.json`
- Modify: `docs/superpowers/specs/2026-11-12-website-design/02-business-facts.md` (rows "Reservations: by phone, no
  minimum" and "Holidays: regular hours; closed every January 1", source "Owner, 2026-11-15")
- Test: `tests/unit/hours.test.ts`, `tests/unit/seo.test.ts`, `tests/unit/format.test.ts`, `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes (Task 1): `PhoneOrder`.
- Produces: `type ClosedDate = { month: number; day: number }` (1-based month); `restaurant.closedDates: ClosedDate[]`
  = `[{ month: 1, day: 1 }]`.
- Produces: `getOpenStatus(now: Date, hours: Hours, timeZone = NY, closedDates: ClosedDate[] = []): OpenStatus`
  (same return type; existing callers keep working).
- Produces: `formatMonthDay(d: ClosedDate, locale: Locale): string` in `src/lib/format.ts`: es `"1 de enero"`,
  en `"January 1"` (built from fixed month-name arrays, like `formatTime`, so ICU variants cannot change it).
- Produces: `nextClosedDates(from: Date, closedDates: ClosedDate[], count: number): string[]` in `src/lib/hours.ts`:
  the next `count` ISO dates (`YYYY-MM-DD`, New York calendar, today included) that fall on a closed date, ascending.

Copy:

| key | es | en |
|-----|----|----|
| `delivery.reservations` | `<b>Reservas:</b> llámanos al <phone></phone>.` | `<b>Reservations:</b> call <phone></phone>.` |
| `hours.holidayNote` | `Abierto los días festivos en horario regular, excepto el {dates}.` | `Open on holidays, regular hours, except {dates}.` |

`{dates}` = the closed dates through `formatMonthDay`, joined with " y " / " and " (one date today).

Algorithm for `getOpenStatus` with closed dates (replace the current body's day logic):
```
from the NY calendar date (y, m, d), weekday and minutes of `now`:
  dayInfo(i) = calendar date y-m-(d+i) via Date.UTC(y, m-1, d+i) → { month, day, weekday }
  closed(i)  = closedDates has dayInfo(i).month/day
if !closed(0) and today's rule exists:   (unchanged open / closing-soon / opens-today logic)
for i in 1..8:
  if !closed(i) and rule for dayInfo(i).weekday exists:
     return closed state, opensAt = rule.open, opensDay = i === 1 ? 'tomorrow' : dayInfo(i).weekday
throw
```

- [ ] **Step 1: Write the failing tests**

`tests/unit/hours.test.ts` (H = `restaurant.hours`, C = `[{ month: 1, day: 1 }]`; 2027-01-01 is a Friday):
```ts
expect(getOpenStatus(new Date("2027-01-01T12:00:00-05:00"), H, undefined, C)).toEqual({ state: "closed", opensAt: "09:00", opensDay: "tomorrow" });
expect(getOpenStatus(new Date("2027-01-01T08:00:00-05:00"), H, undefined, C)).toEqual({ state: "closed", opensAt: "09:00", opensDay: "tomorrow" });
expect(getOpenStatus(new Date("2026-12-31T22:30:00-05:00"), H, undefined, C)).toEqual({ state: "closed", opensAt: "09:00", opensDay: 6 });
expect(getOpenStatus(new Date("2027-01-02T08:00:00-05:00"), H, undefined, C)).toEqual({ state: "closed", opensAt: "09:00", opensDay: "today" });
expect(getOpenStatus(new Date("2027-01-01T12:00:00-05:00"), H)).toEqual({ state: "open", closesAt: "22:00" });
// London machine zone: the NY date decides (01:00 Jan 1 London = Dec 31 20:00 NY, Thursday, open until 21:00)
expect(getOpenStatus(new Date("2027-01-01T01:00:00Z"), H, undefined, C)).toEqual({ state: "closing-soon", closesAt: "21:00" });
expect(nextClosedDates(new Date("2026-11-15T12:00:00-05:00"), C, 2)).toEqual(["2027-01-01", "2028-01-01"]);
expect(nextClosedDates(new Date("2027-01-01T12:00:00-05:00"), C, 1)).toEqual(["2027-01-01"]);
```
`tests/unit/format.test.ts`: `formatMonthDay({ month: 1, day: 1 }, "es")` → `"1 de enero"`; `"en"` → `"January 1"`;
`{ month: 12, day: 25 }` → `"25 de diciembre"` / `"December 25"`.

`tests/unit/seo.test.ts`: `restaurantJsonLd("es")` has `acceptsReservations: true` and a
`specialOpeningHoursSpecification` of 2 entries, each `{ "@type": "OpeningHoursSpecification", opens: "00:00",
closes: "00:00", validFrom: d, validThrough: d }` with `d` from `nextClosedDates(new Date(), restaurant.closedDates, 2)`.
Also `restaurant.closedDates` toEqual `[{ month: 1, day: 1 }]` (in `data.test.ts`).

`tests/e2e/pages.spec.ts`:
- visit (es): `phone-order` contains "Reservas: llámanos al (718) 672-3456."; `main` contains "Abierto los días
  festivos en horario regular, excepto el 1 de enero."
- visit (en): "Reservations: call (718) 672-3456." and "Open on holidays, regular hours, except January 1."
- "open status is closed on January 1": `page.clock.setFixedTime(new Date("2027-01-01T12:00:00-05:00"))` before
  `goto("/es/visit/")` → `open-status` has text "Cerrado · abre mañana a las 9:00 a.m.".

- [ ] **Step 2: Run them**

Run: `npm test && npm run build && npx playwright test tests/e2e/pages.spec.ts`
Expected: the new cases FAIL.

- [ ] **Step 3: Implement as specified; `OpenStatusLive` passes `restaurant.closedDates`**

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm test && npm run build && npx playwright test tests/e2e/pages.spec.ts tests/e2e/home.spec.ts tests/e2e/seo.spec.ts tests/e2e/site.spec.ts`
Expected: all pass (`npm test` includes the `TZ=Europe/London` hours run).

- [ ] **Step 5: Commit**

```bash
git add src messages tests docs/superpowers/specs
git commit -m "feat: reservations by phone; closed every January 1 (status, hours note, JSON-LD)"
```
