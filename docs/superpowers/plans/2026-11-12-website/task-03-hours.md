# Task 3: Hours and today's-special logic

Spec pages: 03 ("Open-now logic", "Today's special"), 09 (unit tests).

**Files:**
- Create: `src/lib/hours.ts`
- Test: `tests/unit/hours.test.ts`
- Modify: `package.json` (`"test": "vitest run && TZ=Europe/London vitest run tests/unit/hours.test.ts"`)

**Interfaces:**
- Consumes: `Hours`, `IsoWeekday`, `SpecialDay` from `src/types/content.ts`.
- Produces:
  ```ts
  export function nyNow(now: Date, timeZone?: string): { weekday: IsoWeekday; minutes: number } // minutes since 00:00 local
  export type OpenStatus =
    | { state: 'open'; closesAt: string }                 // 'HH:MM'
    | { state: 'closing-soon'; closesAt: string }         // ≤ 60 min to close
    | { state: 'closed'; opensAt: string; opensDay: 'today' | 'tomorrow' | IsoWeekday };
  export function getOpenStatus(now: Date, hours: Hours, timeZone?: string): OpenStatus
  export function pickToday<T extends { day: IsoWeekday }>(now: Date, days: T[], timeZone?: string): T | undefined
  export function formatTime(hhmm: string, locale: 'es' | 'en'): string  // '21:00' → '9:00 p.m.' (es) / '9:00 PM' (en)
  ```
  `timeZone` defaults to `'America/New_York'`. Use `Intl.DateTimeFormat(…, { timeZone, weekday:'short', hour:'2-digit',
  minute:'2-digit', hourCycle:'h23' }).formatToParts`. Never use the machine's local time.

- [ ] **Step 1: Write `tests/unit/hours.test.ts`**

Build instants with explicit offsets, so they are unambiguous: EST is `-05:00`, EDT is `-04:00`. `H` is the
restaurant hours from Task 2.
```ts
// Mon 2026-11-16 (EST)
expect(getOpenStatus(new Date('2026-11-16T08:59:00-05:00'), H)).toEqual({ state:'closed', opensAt:'09:00', opensDay:'today' });
expect(getOpenStatus(new Date('2026-11-16T09:00:00-05:00'), H)).toEqual({ state:'open', closesAt:'21:00' });
expect(getOpenStatus(new Date('2026-11-16T20:00:00-05:00'), H)).toEqual({ state:'closing-soon', closesAt:'21:00' });
expect(getOpenStatus(new Date('2026-11-16T19:59:00-05:00'), H)).toEqual({ state:'open', closesAt:'21:00' });
expect(getOpenStatus(new Date('2026-11-16T21:00:00-05:00'), H)).toEqual({ state:'closed', opensAt:'09:00', opensDay:'tomorrow' });
// Fri 2026-11-20 closes at 22:00
expect(getOpenStatus(new Date('2026-11-20T21:59:00-05:00'), H)).toEqual({ state:'closing-soon', closesAt:'22:00' });
expect(getOpenStatus(new Date('2026-11-20T22:00:00-05:00'), H).state).toBe('closed');
// Sun 23:30 → opens Monday (tomorrow)
expect(getOpenStatus(new Date('2026-11-22T23:30:00-05:00'), H)).toEqual({ state:'closed', opensAt:'09:00', opensDay:'tomorrow' });
// DST start, Sun 2026-03-08: 09:30 EDT is open
expect(getOpenStatus(new Date('2026-03-08T09:30:00-04:00'), H).state).toBe('open');
// DST end, Sun 2026-11-01: 08:30 EST is closed, opens today
expect(getOpenStatus(new Date('2026-11-01T08:30:00-05:00'), H)).toEqual({ state:'closed', opensAt:'09:00', opensDay:'today' });
// 03:00 UTC Tuesday = 22:00 EST Monday → still Monday in NY
expect(nyNow(new Date('2026-11-17T03:00:00Z')).weekday).toBe(1);
expect(pickToday(new Date('2026-11-17T03:00:00Z'), [{day:1,x:'mon'},{day:2,x:'tue'}])?.x).toBe('mon');
expect(formatTime('21:00','es')).toBe('9:00 p.m.');
expect(formatTime('09:00','en')).toBe('9:00 AM');
```
These must also pass under `TZ=Europe/London` (the second run in `npm test`). That is Review Focus #1.

- [ ] **Step 2: Run** `npx vitest run tests/unit/hours.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement** `src/lib/hours.ts` with the signatures above. A rule with `close <= open` is invalid (the
schema rejects it); after-midnight hours are not needed.

- [ ] **Step 4: Run** `npm test` → PASS (both the normal run and the London-TZ run).

- [ ] **Step 5: Commit** `feat: add New York open-status and weekday helpers`
