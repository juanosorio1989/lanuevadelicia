import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpecialDayCard } from "@/components/specials/SpecialDayCard";
import { Button } from "@/components/ui/Button";
import { TodayHighlighter } from "@/components/specials/TodayHighlighter";
import { menuItems } from "@/data/menu";
import { specials } from "@/data/specials";
import { capitalize, formatPrice, weekdayName } from "@/lib/format";
import { getPhoto } from "@/lib/photo";
import type { Locale } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as "es" | "en";
  const t = await getTranslations({ locale, namespace: "meta.specials" });
  return buildMetadata({ locale, path: "specials", title: t("title"), description: t("description") });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "specials" });
  const soup = menuItems.find((i) => i.id === "sopa-grande-adicional");
  const days = [...specials].sort((a, b) => a.day - b.day);
  const labels = {
    today: t("today"),
    alternative: t("alternative"),
    alternativeNote: t("alternativeNote"),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-10 md:px-8 md:pt-8">
      <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
      <p className="mt-1.5 text-muted-600">{t("lead")}</p>
      <div className="mt-6 flex flex-col gap-5">
        {days.map((s) => (
          <SpecialDayCard
            key={s.day}
            day={s.day}
            dayName={capitalize(weekdayName(s.day, locale))}
            main={s.main[locale]}
            alternative={s.alternative?.[locale]}
            price={formatPrice(s.price)}
            flyer={getPhoto(s.flyer)}
            locale={locale}
            labels={labels}
          />
        ))}
      </div>
      {soup?.price !== undefined && (
        <p data-testid="extra-soup" className="mt-6 text-lg">
          <span className="font-bold">{soup.name[locale]}</span>{" "}
          <span className="font-bold text-terra-700">
            {formatPrice(soup.price)}
          </span>
        </p>
      )}
      <p className="mt-6">
        <Button href={`/${locale}/menu/`} variant="outline">
          {t("seeMenu")}
        </Button>
      </p>
      <TodayHighlighter />
    </div>
  );
}
