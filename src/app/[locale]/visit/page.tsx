import { MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { DeliveryLinks } from "@/components/shared/DeliveryLinks";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { OpenStatus } from "@/components/shared/OpenStatus";
import { restaurant } from "@/data/restaurant";
import { capitalize, weekdayName } from "@/lib/format";
import { formatTime } from "@/lib/hours";
import { directionsUrl, telHref } from "@/lib/links";
import type { IsoWeekday, Locale } from "@/types/content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "visit" });
  const h = await getTranslations({ locale, namespace: "hours" });
  const home = await getTranslations({ locale, namespace: "home.visit" });
  const cta = await getTranslations({ locale, namespace: "cta" });

  const dayRange = (days: IsoWeekday[]) =>
    days.length === 1
      ? weekdayName(days[0], locale)
      : h("range", { from: weekdayName(days[0], locale), to: weekdayName(days[days.length - 1], locale) });

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-6 pb-10 md:grid-cols-[1fr_1.3fr] md:px-8 md:pt-8">
      <div>
        <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-lg font-bold">{restaurant.address.oneLine}</p>
        <OpenStatus locale={locale} className="mt-2 text-green-900" />
        <h2 className="mt-5 text-xl">{t("hoursTitle")}</h2>
        <HoursTable locale={locale} className="my-2" />
        <ul className="text-sm">
          {restaurant.happyHour.map((hh) => (
            <li key={hh.days.join()}>
              {t("happyHourLine", {
                days: capitalize(dayRange(hh.days)),
                from: formatTime(hh.from, locale),
                to: formatTime(hh.to, locale),
              })}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <TrackedLink href={directionsUrl()} event="click_directions" params={{ location: "visit_page" }} external variant="primary">
            <MapPin aria-hidden="true" size={18} />
            {cta("directions")}
          </TrackedLink>
          <TrackedLink href={telHref()} event="click_call" params={{ location: "visit_page" }} variant="outline">
            <Phone aria-hidden="true" size={18} />
            {cta("call")}
          </TrackedLink>
        </div>
        <DeliveryLinks locale={locale} location="visit_page" className="mt-4" />
        <p className="mt-1 text-sm text-muted-600">{restaurant.deliveryNote[locale]}</p>
        <p className="mt-3 text-sm">{home("events")}</p>
        <p className="mt-3">
          <a
            href={restaurant.instagram.url}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2 font-bold text-green-900 underline underline-offset-4 hover:text-terra-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900"
          >
            {t("instagram")} {restaurant.instagram.handle}
          </a>
        </p>
      </div>
      <MapEmbed locale={locale} location="visit" />
    </div>
  );
}
