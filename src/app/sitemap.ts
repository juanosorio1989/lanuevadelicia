import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { pageUrl, sitemapPaths } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    sitemapPaths.map((path) => ({
      url: pageUrl(locale, path),
      alternates: { languages: { es: pageUrl("es", path), en: pageUrl("en", path) } },
    })),
  );
}
