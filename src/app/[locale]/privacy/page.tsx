import { getTranslations, setRequestLocale } from "next-intl/server";
import { restaurant } from "@/data/restaurant";
import type { Locale } from "@/types/content";

// COPY-REVIEW: the whole privacy text is Claude's draft; the owner should confirm it.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const sections = [
    ["analyticsTitle", "analytics"],
    ["whyTitle", "why"],
    ["adsTitle", "ads"],
  ] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-10 md:px-8 md:pt-8">
      <h1 className="text-[1.75rem] md:text-4xl">{t("title")}</h1>
      <p className="mt-1.5 text-muted-600">{t("lead")}</p>
      {sections.map(([title, body]) => (
        <section key={title} className="mt-6">
          <h2 className="text-xl">{t(title)}</h2>
          <p className="mt-1">{t(body)}</p>
        </section>
      ))}
      <section className="mt-6">
        <h2 className="text-xl">{t("contactTitle")}</h2>
        <p className="mt-1">
          {t.rich("contact", {
            email: () => (
              <a href={`mailto:${restaurant.email}`} className="font-bold text-green-900 underline underline-offset-4">
                {restaurant.email}
              </a>
            ),
          })}
        </p>
      </section>
    </div>
  );
}
