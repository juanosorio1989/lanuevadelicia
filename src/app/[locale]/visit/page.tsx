import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, restaurantJsonLd } from "@/lib/seo";
import { MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { DeliveryLinks } from "@/components/shared/DeliveryLinks";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { OpenStatus } from "@/components/shared/OpenStatus";
import { restaurant } from "@/data/restaurant";
import { directionsUrl, telHref } from "@/lib/links";
import type { Locale } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as "es" | "en";
  const t = await getTranslations({ locale, namespace: "meta.visit" });
  return buildMetadata({ locale, path: "visit", title: t("title"), description: t("description", { address: restaurant.address.oneLine }) });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "visit" });
  const home = await getTranslations({ locale, namespace: "home.visit" });
  const cta = await getTranslations({ locale, namespace: "cta" });

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-6 pb-10 md:grid-cols-[1fr_1.3fr] md:px-8 md:pt-8">
      <JsonLd data={restaurantJsonLd(locale)} />
      <div>
        <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-lg font-bold">{restaurant.address.oneLine}</p>
        <OpenStatus locale={locale} className="mt-2 text-green-900" />
        <h2 className="mt-5 text-xl">{t("hoursTitle")}</h2>
        <HoursTable locale={locale} className="my-2" />
        <div className="mt-4 flex flex-wrap gap-3">
          <TrackedLink href={directionsUrl()} event="click_directions" params={{ location: "visit" }} external variant="primary">
            <MapPin aria-hidden="true" size={18} />
            {cta("directions")}
          </TrackedLink>
          <TrackedLink href={telHref()} event="click_call" params={{ location: "visit" }} variant="outline">
            <Phone aria-hidden="true" size={18} />
            {cta("call")}
          </TrackedLink>
        </div>
        <DeliveryLinks locale={locale} location="visit" variant="buttons" className="mt-4 gap-y-2" />
        <p className="mt-1 text-sm text-muted-600">{restaurant.deliveryNote[locale]}</p>
        <p className="mt-3 text-sm">{home("events")}</p>
        <p className="mt-3">
          <TrackedLink
            href={restaurant.instagram.url}
            event="click_instagram"
            params={{ location: "visit" }}
            external
            className="inline-flex min-h-11 items-center gap-2 font-bold text-green-900 underline underline-offset-4 hover:text-terra-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900"
          >
            {t("instagram")} {restaurant.instagram.handle}
          </TrackedLink>
        </p>
      </div>
      <MapEmbed locale={locale} location="visit" />
    </div>
  );
}
