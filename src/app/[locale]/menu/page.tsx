import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryChips } from "@/components/menu/CategoryChips";
import { MenuCategorySection } from "@/components/menu/MenuCategorySection";
import { categories, menuItems } from "@/data/menu";
import type { Locale } from "@/types/content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "menu" });
  const ordered = [...categories].sort((a, b) => a.order - b.order);
  const labels = { favorite: t("favorite"), flavors: (list: string) => t("flavors", { list }) };

  return (
    // --menu-header-h: the shrunken sticky header (measured: 48px, 60px on very narrow phones where it wraps);
    // --menu-sticky-offset: header + 61px chip bar + a little air (scroll-margin for sections).
    <div className="[--menu-header-h:48px] [--menu-sticky-offset:112px] max-[359px]:[--menu-header-h:60px] max-[359px]:[--menu-sticky-offset:124px]">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-3 md:px-8 md:pt-8">
        <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
        <p className="mt-1.5 text-muted-600">{t("priceNote")}</p>
      </div>
      <CategoryChips chips={ordered.map((c) => ({ id: c.id, label: c.name[locale] }))} label={t("chipsLabel")} />
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {ordered.map((c) => (
          <MenuCategorySection
            key={c.id}
            category={c}
            items={menuItems.filter((i) => i.category === c.id && i.available !== false)}
            locale={locale}
            labels={labels}
            specialsLink={c.id === "especiales" ? { href: `/${locale}/specials/`, label: t("specialsLink") } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
