import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { buildMetadata, menuJsonLd } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MenuToolbar } from "@/components/menu/MenuToolbar";
import { MenuCategorySection } from "@/components/menu/MenuCategorySection";
import { categories, menuItems } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { telHref } from "@/lib/links";
import type { Locale } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as "es" | "en";
  const t = await getTranslations({ locale, namespace: "meta.menu" });
  return buildMetadata({ locale, path: "menu", title: t("title"), description: t("description") });
}

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
    // --menu-sticky-offset: no-JS fallback = header + toolbar without the search box (hint line + chip row + border:
    // 5.5rem at 390px, 3.8125rem from lg where the hint is hidden) + 0.25rem of air. With JS, MenuToolbar overrides it
    // with its measured height.
    <div className="[--menu-header-h:3rem] [--menu-sticky-offset:calc(var(--menu-header-h)+5.75rem)] max-[22.4375rem]:[--menu-header-h:3.75rem] lg:[--menu-sticky-offset:calc(var(--menu-header-h)+4.0625rem)]">
      <JsonLd data={menuJsonLd(locale)} />
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-3 md:px-8 md:pt-8">
        <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
        <p className="mt-1.5 text-muted-600">{t("priceNote")}</p>
      </div>
      <MenuToolbar
        chips={ordered.map((c) => ({ id: c.id, label: c.name[locale] }))}
        labels={{ chips: t("chipsLabel"), swipeHint: t("swipeHint"), search: t("searchLabel"),
          clear: t("searchClear"),
          noResults: t("noResults"),
          noResultsCall: t("noResultsCall"),
          resultsOne: t("resultsOne"),
          resultsOther: t("resultsOther"),
        }}
        phone={{ display: restaurant.phone.display, href: telHref() }}
      />
      <div data-menu-list className="mx-auto max-w-6xl px-4 md:px-8">
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
