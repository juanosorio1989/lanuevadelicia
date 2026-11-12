import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Leaf, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Img } from "@/components/ui/Img";
import { directionsUrl } from "@/lib/links";
import { getPhoto } from "@/lib/photo";
import type { Locale } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as "es" | "en";
  const t = await getTranslations({ locale, namespace: "meta.story" });
  return buildMetadata({ locale, path: "our-story", title: t("title"), description: t("description") });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "story" });
  const s = await getTranslations({ locale, namespace: "home.story" });
  const cta = await getTranslations({ locale, namespace: "cta" });
  // A dish photo stands in until restaurant photos exist (spec 06).
  const photo = getPhoto("dishes/picada-doble");
  const expect = [0, 1, 2].map((i) => ({ title: t(`expect.${i}.title`), body: t(`expect.${i}.body`) }));

  return (
    <>
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-6 pb-10 md:grid-cols-2 md:gap-10 md:px-8 md:pt-10">
        <div>
          <Eyebrow>{t("title")}</Eyebrow>
          <h1 className="mt-1 text-[1.75rem] md:text-4xl">{s("title")}</h1>
          <p className="mt-3 text-lg">{s("body")}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-green-900">
            <Leaf aria-hidden="true" size={18} />
            {s("roots")}
          </p>
        </div>
        <Img photo={photo} locale={locale} sizes="(min-width: 768px) 50vw, 100vw" className="h-64 w-full rounded-card object-cover md:h-96" />
      </div>

      <section aria-labelledby="expect-title" className="bg-sand-100">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <h2 id="expect-title" className="text-[1.375rem] md:text-[1.875rem]">
            {t("expectTitle")}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {expect.map((item) => (
              <li key={item.title} className="rounded-card bg-cream-50 p-5">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-1 text-muted-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="story-cta" className="bg-green-900 text-cream-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center md:px-8">
          <h2 id="story-cta" className="text-[1.375rem] text-cream-50 md:text-[1.875rem]">
            {t("ctaTitle")}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <TrackedLink href={directionsUrl()} event="click_directions" params={{ location: "story_cta" }} external variant="primary">
              <MapPin aria-hidden="true" size={18} />
              {cta("directions")}
            </TrackedLink>
            <Button href={`/${locale}/menu/`} variant="on-dark">
              {cta("menu")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
