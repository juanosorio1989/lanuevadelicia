import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, restaurantJsonLd } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Favorites } from "@/components/home/Favorites";
import { Hero } from "@/components/home/Hero";
import { ReviewsBand } from "@/components/home/ReviewsBand";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { TodaySpecial } from "@/components/home/TodaySpecial";
import { VisitBlock } from "@/components/home/VisitBlock";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as "es" | "en";
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildMetadata({ locale, path: "", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={restaurantJsonLd(locale)} />
      <Hero locale={locale} />
      <Favorites locale={locale} />
      <TodaySpecial locale={locale} />
      <StoryTeaser locale={locale} />
      <ReviewsBand locale={locale} />
      <VisitBlock locale={locale} />
    </>
  );
}
