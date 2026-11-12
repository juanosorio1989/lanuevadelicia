import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { OpenStatus } from "@/components/shared/OpenStatus";
import { restaurant } from "@/data/restaurant";
import { getPhoto } from "@/lib/photo";
import { directionsUrl } from "@/lib/links";
import type { Locale } from "@/types/content";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const cta = await getTranslations({ locale, namespace: "cta" });
  const photo = getPhoto("dishes/bandeja-paisa");

  return (
    <section className="relative isolate flex min-h-[26rem] items-end overflow-hidden md:min-h-[27.5rem] md:items-center">
      <Img
        photo={photo}
        locale={locale}
        sizes="100vw"
        priority
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[30%_center] md:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-charcoal-900/90 via-charcoal-900/35 to-transparent md:bg-linear-to-r md:from-charcoal-900/85 md:via-charcoal-900/45 md:to-transparent md:to-75%"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-cream-50 md:px-8 md:py-16">
        <div className="max-w-[29rem]">
          <h1 className="text-[1.75rem] leading-[1.12] text-cream-50 md:text-[2.75rem]">{t("title")}</h1>
          <p className="mt-3 md:mt-4">{t("lead")}</p>
          <div className="mt-5 hidden flex-wrap gap-3 lg:flex">
            <TrackedLink href={directionsUrl()} event="click_directions" params={{ location: "hero" }} external variant="primary">
              {cta("directions")}
            </TrackedLink>
            <Button href={`/${locale}/menu/`} variant="on-dark">
              {cta("menu")}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm md:mt-5">
            <OpenStatus locale={locale} />
            <p>{t("rating", { value: restaurant.rating.value, count: restaurant.rating.displayCount })}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
