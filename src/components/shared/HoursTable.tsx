import { Martini } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { restaurant } from "@/data/restaurant";
import { capitalize, dayRange, formatPrice } from "@/lib/format";
import { formatTime } from "@/lib/hours";
import type { IsoWeekday, Locale } from "@/types/content";

/** Opening hours from data. Server-rendered, no status badge (see OpenStatus). */
export async function HoursTable({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = await getTranslations({ locale, namespace: "hours" });
  const label = (days: IsoWeekday[]) => capitalize(dayRange(days, locale));
  const cell = "py-1 pr-5 text-left align-top";

  return (
    <div className={className || undefined}>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-600">{t("title")}</p>
      <table className="text-sm">
        <tbody>
          {restaurant.hours.map((h) => (
            <tr key={h.days.join()}>
              <th scope="row" className={`${cell} font-normal`}>
                {label(h.days)}
              </th>
              <td className={`${cell} font-bold`}>
                {formatTime(h.open, locale)} – {formatTime(h.close, locale)}
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={`${cell} font-normal`}>
              {t("breakfast")}
            </th>
            <td className={cell}>{t("breakfastUntil", { time: formatTime(restaurant.breakfastUntil, locale) })}</td>
          </tr>
        </tbody>
      </table>
      <div data-testid="happy-hour" className="mt-3 rounded-lg bg-terra-700 px-3.5 py-3 text-sm text-cream-50">
        <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
          <span className="inline-flex items-center gap-1.5">
            <Martini aria-hidden="true" size={18} />
            {t("happyHour")}
          </span>
          <span className="rounded-full bg-cream-50 px-2.5 py-0.5 text-[0.8125rem] text-terra-700">
            {t("happyHourValue", { price: formatPrice(restaurant.happyHourCocktailPrice) })}
          </span>
        </div>
        <ul className="mt-1.5">
          {restaurant.happyHour.map((hh) => (
            <li key={hh.days.join()}>
              {t("happyHourWindow", {
                days: label(hh.days),
                from: formatTime(hh.from, locale),
                to: formatTime(hh.to, locale),
              })}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
