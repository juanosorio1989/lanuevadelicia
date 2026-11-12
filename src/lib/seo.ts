import type { Metadata } from "next";
import { categories, menuItems } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { routing } from "@/i18n/routing";
import type { IsoWeekday, Locale } from "@/types/content";

export type PagePath = "" | "menu" | "specials" | "our-story" | "gallery" | "visit" | "privacy";

export const pagePaths: PagePath[] = ["", "menu", "specials", "our-story", "gallery", "visit", "privacy"];

const OG_LOCALE: Record<Locale, string> = { es: "es_US", en: "en_US" };
const DAY_NAMES: Record<IsoWeekday, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const origin = () => restaurant.siteUrl.replace(/\/+$/, "");
export const ogImageUrl = () => `${origin()}/og/home.jpg`;

/** Absolute URL with a trailing slash, e.g. https://lanuevadelicia.com/en/menu/. */
export function pageUrl(locale: Locale, path: PagePath): string {
  return `${origin()}/${locale}/${path ? `${path}/` : ""}`;
}

export function buildMetadata(opts: { locale: Locale; path: PagePath; title: string; description: string }): Metadata {
  const { locale, path, title, description } = opts;
  const url = pageUrl(locale, path);
  const image = { url: ogImageUrl(), width: 1200, height: 630, alt: restaurant.name };
  return {
    title,
    description,
    metadataBase: new URL(origin()),
    alternates: {
      canonical: url,
      languages: {
        es: pageUrl("es", path),
        en: pageUrl("en", path),
        // x-default is the Spanish version of the same page (spec 08).
        "x-default": pageUrl(routing.defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      siteName: restaurant.name,
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export function restaurantJsonLd(locale: Locale): Record<string, unknown> {
  const a = restaurant.address;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    url: pageUrl(locale, ""),
    logo: `${origin()}/images/brand/logo.png`,
    image: ogImageUrl(),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    telephone: restaurant.phone.e164,
    openingHoursSpecification: restaurant.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => DAY_NAMES[d]),
      opens: h.open,
      closes: h.close,
    })),
    servesCuisine: "Colombian",
    priceRange: "$$",
    hasMenu: pageUrl(locale, "menu"),
    acceptsReservations: false,
    sameAs: [restaurant.instagram.url, restaurant.googleMapsUrl, ...restaurant.delivery.map((d) => d.url)],
  };
}

const offer = (price: number, name?: string) => ({
  "@type": "Offer",
  price: price.toFixed(2),
  priceCurrency: "USD",
  ...(name ? { name } : {}),
});

export function menuJsonLd(locale: Locale): Record<string, unknown> {
  const sections = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      "@type": "MenuSection",
      name: c.name[locale],
      hasMenuItem: menuItems
        .filter((i) => i.category === c.id && i.available !== false)
        .map((i) => {
          const priced = (i.options ?? []).filter((o) => o.price !== undefined);
          const offers =
            i.price !== undefined
              ? offer(i.price)
              : priced.length > 0
                ? priced.map((o) => offer(o.price as number, o.label[locale]))
                : undefined;
          return {
            "@type": "MenuItem",
            name: i.name[locale],
            ...(i.description ? { description: i.description[locale] } : {}),
            ...(offers ? { offers } : {}),
          };
        }),
    }));
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: locale === "es" ? "Menú" : "Menu",
    url: pageUrl(locale, "menu"),
    inLanguage: locale,
    hasMenuSection: sections,
  };
}
