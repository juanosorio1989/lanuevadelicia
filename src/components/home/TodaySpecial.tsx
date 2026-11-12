import { getTranslations } from "next-intl/server";
import { specials } from "@/data/specials";
import { formatPrice, weekdayName } from "@/lib/format";
import { getPhoto } from "@/lib/photo";
import type { Locale } from "@/types/content";
import { TodaySpecialLive, type SpecialDisplay } from "./TodaySpecialLive";

/** Server wrapper: formats the 7 specials for one locale and hands only display strings to the client part. */
export async function TodaySpecial({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.today" });
  const days: SpecialDisplay[] = specials.map((s) => {
    const photo = getPhoto(s.flyer);
    return {
      day: s.day,
      dayName: weekdayName(s.day, locale),
      main: s.main[locale],
      hasAlternative: Boolean(s.alternative),
      price: formatPrice(s.price),
      flyer: { src: photo.src, width: photo.width, height: photo.height, alt: photo.alt[locale] },
    };
  });
  return <TodaySpecialLive locale={locale} days={days}
      labels={{ eyebrowNeutral: t("eyebrowNeutral"), eyebrow: t.raw("eyebrow") as string, teaser: t("teaser"), alternative: t("alternative"), all: t("all") }} />;
}
