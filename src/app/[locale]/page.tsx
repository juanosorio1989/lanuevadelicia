import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Favorites } from "@/components/home/Favorites";
import { Hero } from "@/components/home/Hero";
import { ReviewsBand } from "@/components/home/ReviewsBand";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { TodaySpecial } from "@/components/home/TodaySpecial";
import { VisitBlock } from "@/components/home/VisitBlock";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Hero locale={locale} />
      <Favorites locale={locale} />
      <TodaySpecial locale={locale} />
      <StoryTeaser locale={locale} />
      <ReviewsBand locale={locale} />
      <VisitBlock locale={locale} />
    </>
  );
}
