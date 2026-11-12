import { getTranslations, setRequestLocale } from "next-intl/server";

// Placeholder: a later task fills this page.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <h1>{t("gallery")}</h1>;
}
