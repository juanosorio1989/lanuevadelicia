import { getTranslations } from "next-intl/server";
import type { Locale } from "@/types/content";
import { MapEmbedLive } from "./MapEmbedLive";

/** Server wrapper: hands the client map card its strings as props. */
export async function MapEmbed({ locale, location = "home" }: { locale: Locale; location?: string }) {
  const t = await getTranslations({ locale, namespace: "map" });
  return <MapEmbedLive labels={{ view: t("view"), title: t("title"), hint: t("hint") }} location={location} />;
}
