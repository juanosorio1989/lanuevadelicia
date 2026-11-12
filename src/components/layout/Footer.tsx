import { getLocale, getTranslations } from "next-intl/server";
import { restaurant } from "@/data/restaurant";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatTime } from "@/lib/hours";
import { directionsUrl, telHref } from "@/lib/links";
import { NAV_ITEMS } from "./nav-items";
import { TrackedLink } from "./TrackedLink";

const linkClass =
  "inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50";
const labelClass = "mb-1 text-xs font-bold uppercase tracking-[0.12em] text-sand-100";

function dayRange(days: number[], locale: Locale): string {
  // 2024-01-01 is a Monday, so ISO weekday n maps to day n of that month.
  const name = (d: number) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, d)));
  return days.length === 1 ? name(days[0]) : `${name(days[0])}–${name(days[days.length - 1])}`;
}

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;

  return (
    <footer className="bg-charcoal-900 text-cream-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-xl font-bold">{restaurant.name}</p>
          <p className={`${labelClass} mt-4`}>{t("address")}</p>
          <TrackedLink
            href={directionsUrl()}
            event="click_directions"
            params={{ location: "footer" }}
            external
            className={linkClass}
          >
            {restaurant.address.oneLine}
          </TrackedLink>
          <p className={`${labelClass} mt-3`}>{t("phone")}</p>
          <TrackedLink href={telHref()} event="click_call" params={{ location: "footer" }} className={linkClass}>
            {restaurant.phone.display}
          </TrackedLink>
        </div>
        <div>
          <p className={labelClass}>{t("hours")}</p>
          <ul className="text-sm">
            {restaurant.hours.map((h) => (
              <li key={h.days.join()}>
                {dayRange(h.days, locale)}: {formatTime(h.open, locale)} – {formatTime(h.close, locale)}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-sm">{t("breakfast", { time: formatTime(restaurant.breakfastUntil, locale) })}</p>
        </div>
        <div>
          <p className={labelClass}>{t("instagram")}</p>
          <TrackedLink
            href={restaurant.instagram.url}
            event="click_instagram"
            params={{ location: "footer" }}
            external
            className={linkClass}
          >
            {restaurant.instagram.handle}
          </TrackedLink>
        </div>
        <div>
          <p className={labelClass}>{t("delivery")}</p>
          <ul>
            {restaurant.delivery.map((d) => (
              <li key={d.app}>
                <TrackedLink
                  href={d.url}
                  event="click_delivery"
                  params={{ app: d.app, location: "footer" }}
                  external
                  className={linkClass}
                >
                  {d.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <nav aria-label={nav("main")} className="border-t border-cream-50/20">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-6 px-4 py-2 text-sm md:px-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className={linkClass}>
                {nav(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-cream-50/20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-4 py-2 text-sm md:px-8">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <Link href="/privacy" className={linkClass}>
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
