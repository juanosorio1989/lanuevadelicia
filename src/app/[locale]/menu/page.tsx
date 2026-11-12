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
  const labels = { favorite: t("favorite") };

  return (
    // All in rem so they follow the browser font size like the header and chips do.
    // --menu-header-h: the shrunken sticky header (3rem; 3.75rem below 360px where it wraps);
    // --menu-sticky-offset: header + chip bar (3.75rem + 1px border) + 0.25rem of air (scroll-margin for sections).
    <div className="[--menu-header-h:3rem] [--menu-sticky-offset:calc(var(--menu-header-h)+4rem+1px)] max-[22.4375rem]:[--menu-header-h:3.75rem]">
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
