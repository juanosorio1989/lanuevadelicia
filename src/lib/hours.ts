import type { ClosedDate, Hours, IsoWeekday } from '@/types/content';

const NY = 'America/New_York';
const WEEKDAYS: Record<string, IsoWeekday> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

/** Weekday and minutes since local midnight in the given zone (never the machine zone). */
export function nyNow(now: Date, timeZone: string = NY): { weekday: IsoWeekday; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    weekday: WEEKDAYS[get('weekday')],
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  };
}

export type OpenStatus =
  | { state: 'open'; closesAt: string }
  | { state: 'closing-soon'; closesAt: string }
  | { state: 'closed'; opensAt: string; opensDay: 'today' | 'tomorrow' | IsoWeekday };

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const ruleFor = (hours: Hours, day: IsoWeekday) => hours.find((r) => r.days.includes(day));

/** Calendar date (year, month, day) in the given zone. */
function nyDate(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/** The calendar day `offset` days after (year, month, day), via UTC so no DST or machine zone is involved. */
function dayInfo(year: number, month: number, day: number, offset: number) {
  const d = new Date(Date.UTC(year, month - 1, day + offset));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    weekday: (d.getUTCDay() === 0 ? 7 : d.getUTCDay()) as IsoWeekday,
  };
}

const isClosed = (closedDates: ClosedDate[], month: number, day: number) =>
  closedDates.some((c) => c.month === month && c.day === day);

export function getOpenStatus(
  now: Date,
  hours: Hours,
  timeZone: string = NY,
  closedDates: ClosedDate[] = [],
): OpenStatus {
  const { minutes } = nyNow(now, timeZone);
  const { year, month, day } = nyDate(now, timeZone);
  const info = (i: number) => dayInfo(year, month, day, i);
  const t = info(0);
  const today = isClosed(closedDates, t.month, t.day) ? undefined : ruleFor(hours, t.weekday);
  if (today) {
    const open = toMin(today.open);
    const close = toMin(today.close);
    if (minutes >= open && minutes < close) {
      return close - minutes <= 60
        ? { state: 'closing-soon', closesAt: today.close }
        : { state: 'open', closesAt: today.close };
    }
    if (minutes < open) return { state: 'closed', opensAt: today.open, opensDay: 'today' };
  }
  for (let i = 1; i <= 8; i++) {
    const d = info(i);
    if (isClosed(closedDates, d.month, d.day)) continue;
    const rule = ruleFor(hours, d.weekday);
    if (rule) return { state: 'closed', opensAt: rule.open, opensDay: i === 1 ? 'tomorrow' : d.weekday };
  }
  throw new Error('No opening hours defined');
}

/** The next `count` ISO dates (New York calendar, today included) that fall on a closed date, ascending. */
export function nextClosedDates(from: Date, closedDates: ClosedDate[], count: number): string[] {
  if (closedDates.length === 0) return [];
  const { year, month, day } = nyDate(from, NY);
  const out: string[] = [];
  // Four years plus a day covers a Feb 29 closure.
  for (let i = 0; out.length < count && i < 366 * 5; i++) {
    const d = dayInfo(year, month, day, i);
    if (isClosed(closedDates, d.month, d.day)) {
      out.push(`${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`);
    }
  }
  return out;
}

export function pickToday<T extends { day: IsoWeekday }>(now: Date, days: T[], timeZone: string = NY): T | undefined {
  const { weekday } = nyNow(now, timeZone);
  return days.find((d) => d.day === weekday);
}

/** '21:00' -> '9:00 p.m.' (es) / '9:00 PM' (en). Built by hand so ICU variants cannot change it. */
export function formatTime(hhmm: string, locale: 'es' | 'en'): string {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const pm = h >= 12;
  const suffix = locale === 'es' ? (pm ? 'p.m.' : 'a.m.') : pm ? 'PM' : 'AM';
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}
