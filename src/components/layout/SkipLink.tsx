import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("nav");
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:min-h-11 focus:rounded-full focus:bg-cream-50 focus:px-6 focus:py-2 focus:font-bold focus:text-green-900 focus:outline-2 focus:outline-offset-2 focus:outline-solid focus:outline-cream-50"
    >
      {t("skip")}
    </a>
  );
}
