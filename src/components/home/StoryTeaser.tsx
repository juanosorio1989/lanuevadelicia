import { Leaf } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Img } from "@/components/ui/Img";
import { getPhoto } from "@/lib/photo";
import type { Locale } from "@/types/content";

export async function StoryTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.story" });
  // A dish photo stands in until restaurant photos exist (spec 06); then swap this id for an interior/exterior shot.
  const photo = getPhoto("dishes/picada-doble");

  return (
    <section aria-labelledby="story-title" className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-[22px] md:grid-cols-2 md:gap-9 md:px-8 md:py-11">
      <div>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 id="story-title" className="mt-1 text-[1.375rem] md:text-[1.875rem]">
          {t("title")}
        </h2>
        <p className="mt-3">{t("body")}</p>
        <p className="mt-4 flex items-center gap-2 text-sm text-green-900">
          <Leaf aria-hidden="true" size={18} />
          {t("roots")}
        </p>
      </div>
      <Img photo={photo} locale={locale} sizes="(min-width: 768px) 50vw, 100vw" className="h-60 w-full rounded-card object-cover md:h-72" />
    </section>
  );
}
