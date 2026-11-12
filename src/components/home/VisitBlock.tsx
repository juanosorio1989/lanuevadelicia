import { MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { DeliveryLinks } from "@/components/shared/DeliveryLinks";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { restaurant } from "@/data/restaurant";
import { directionsUrl, telHref } from "@/lib/links";
import type { Locale } from "@/types/content";

export async function VisitBlock({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.visit" });
  const cta = await getTranslations({ locale, namespace: "cta" });

  return (
    <section aria-labelledby="visit-title" className="mx-auto grid max-w-6xl gap-8 px-4 py-[22px] md:grid-cols-[1fr_1.3fr] md:px-8 md:py-11">
      <div>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 id="visit-title" className="mt-1 text-[1.375rem] md:text-[1.875rem]">
          {restaurant.address.oneLine}
        </h2>
        <HoursTable locale={locale} className="my-3" />
        <div className="flex flex-wrap gap-3">
          <TrackedLink href={directionsUrl()} event="click_directions" params={{ location: "visit_block" }} external variant="primary">
            <MapPin aria-hidden="true" size={18} />
            {cta("directions")}
          </TrackedLink>
          <TrackedLink href={telHref()} event="click_call" params={{ location: "visit_block" }} variant="outline">
            <Phone aria-hidden="true" size={18} />
            {cta("call")}
          </TrackedLink>
        </div>
        <DeliveryLinks locale={locale} location="visit_block" className="mt-4" />
        <p className="mt-1 text-sm text-muted-600">{t("events")}</p>
      </div>
      <MapEmbed locale={locale} location="home" />
    </section>
  );
}
