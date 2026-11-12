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
    <table className={`text-sm ${className}`.trim()}>
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
        <tr>
          <th scope="row" className={`${cell} font-normal`}>
            {t("happyHour")}
          </th>
          <td className={cell}>
            {t("happyHourValue", { price: formatPrice(restaurant.happyHourCocktailPrice) })}
            <ul className="mt-0.5 font-normal text-muted-600">
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
          </td>
        </tr>
      </tbody>
    </table>
  );
}
