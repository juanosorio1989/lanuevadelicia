import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { pagePaths, pageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    pagePaths.map((path) => ({
      url: pageUrl(locale, path),
      alternates: { languages: { es: pageUrl("es", path), en: pageUrl("en", path) } },
    })),
  );
}
