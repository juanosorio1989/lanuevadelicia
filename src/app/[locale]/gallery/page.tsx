import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GalleryGrid, type GalleryGroup } from "@/components/gallery/GalleryGrid";
import { photos } from "@/data/photos";
import type { Locale, Photo } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as "es" | "en";
  const t = await getTranslations({ locale, namespace: "meta.gallery" });
  return buildMetadata({ locale, path: "gallery", title: t("title"), description: t("description") });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "gallery" });

  // Only {src,width,height,alt} cross into the client component. Specials flyers and the logo are not gallery photos.
  const pick = (group: Photo["group"]) =>
    photos
      .filter((p) => p.group === group)
      .map((p) => ({ src: p.src, width: p.width, height: p.height, alt: p.alt[locale] }));
  const groups: GalleryGroup[] = [
    { id: "food", label: t("food"), photos: pick("dishes") },
    { id: "drinks", label: t("drinks"), photos: pick("drinks") },
    // "El restaurante" appears only once restaurant photos exist (spec 06).
    { id: "restaurant", label: t("restaurant"), photos: pick("restaurant") },
  ].filter((g) => g.photos.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 md:px-8 md:pt-8">
      <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
      <p className="mt-1.5 text-muted-600">{t("lead")}</p>
      <GalleryGrid groups={groups} closeLabel={t("close")} openLabel={t.raw("open") as string} />
    </div>
  );
}
