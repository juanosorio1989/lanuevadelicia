import type { IsoWeekday, Locale } from "@/types/content";

/** 23 -> '$23', 12.99 -> '$12.99'. Prices come from data and are never rounded. */
export function formatPrice(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** Long weekday name for an ISO weekday (2024-01-01 is a Monday). 'lunes' / 'Monday'. */
export function weekdayName(day: IsoWeekday, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, day)));
}

const rangeWords = { es: { pair: "y", range: "a" }, en: { pair: "and", range: "to" } } as const;

/**
 * Weekday label for a list of consecutive ISO weekdays, (Intl casing: Spanish lowercase, English capitalized):
 * one day "lunes", two "sábado y domingo" / "Saturday and Sunday", longer "lunes a viernes" / "Monday to Friday".
 */
export function dayRange(days: IsoWeekday[], locale: Locale): string {
  const first = weekdayName(days[0], locale);
  if (days.length === 1) return first;
  const last = weekdayName(days[days.length - 1], locale);
  const word = days.length === 2 ? rangeWords[locale].pair : rangeWords[locale].range;
  return `${first} ${word} ${last}`;
}

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
