import type { Hours, IsoWeekday } from '@/types/content';

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

export function getOpenStatus(now: Date, hours: Hours, timeZone: string = NY): OpenStatus {
  const { weekday, minutes } = nyNow(now, timeZone);
  const today = ruleFor(hours, weekday);
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
  for (let i = 1; i <= 7; i++) {
    const day = (((weekday - 1 + i) % 7) + 1) as IsoWeekday;
    const rule = ruleFor(hours, day);
    if (rule) return { state: 'closed', opensAt: rule.open, opensDay: i === 1 ? 'tomorrow' : day };
  }
  throw new Error('No opening hours defined');
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
