import { getTranslations } from "next-intl/server";
import { DishCard } from "@/components/shared/DishCard";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { menuItems } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { formatTime } from "@/lib/hours";
import { getPhoto } from "@/lib/photo";
import type { Locale } from "@/types/content";

export async function Favorites({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.favorites" });
  const featured = menuItems
    .filter((i) => i.featured && i.image)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

  // Short lines the spec gives for two dishes; the rest use the menu description.
  const notes: Record<string, string> = {
    "calentado-con-chuleta-y-huevos-al-gusto": t("breakfastUntil", { time: formatTime(restaurant.breakfastUntil, locale) }),
    "picada-doble": t("toShare"),
  };

  return (
    <section aria-labelledby="favorites-title" className="mx-auto max-w-6xl px-4 py-[22px] md:px-8 md:py-11">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 id="favorites-title" className="mt-1 text-[1.375rem] md:text-[1.875rem]">
        {t("title")}
      </h2>
      <ul
        id="favorites"
        tabIndex={0}
        aria-label={t("listLabel")}
        className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0"
      >
        {featured.map((item) => (
          <li key={item.id} className="w-44 shrink-0 snap-start md:w-auto">
            <DishCard
              item={item}
              photo={getPhoto(item.image!)}
              locale={locale}
              note={notes[item.id]}
              sizes="(min-width: 768px) 25vw, 176px"
            />
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Button href={`/${locale}/menu/`} variant="outline">
          {t("all")}
        </Button>
      </div>
    </section>
  );
}
