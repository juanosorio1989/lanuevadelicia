import type { IsoWeekday, Locale } from "@/types/content";

/** 23 -> '$23', 12.99 -> '$12.99'. Prices come from data and are never rounded. */
export function formatPrice(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** Long weekday name for an ISO weekday (2024-01-01 is a Monday). 'lunes' / 'Monday'. */
export function weekdayName(day: IsoWeekday, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, day)));
}

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
