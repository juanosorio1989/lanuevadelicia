"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { track } from "@/lib/analytics";

const withSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);

/** ES | EN. Links to the same page in the other locale; the current locale is bold and not a link. */
export function LanguageSwitch() {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div data-testid="lang-switch" role="group" aria-label={t("language")} className="flex items-center text-sm">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="opacity-60">|</span>}
          {locale === current ? (
            <span aria-current="true" className="inline-flex min-h-11 min-w-11 items-center justify-center font-bold">
              {locale.toUpperCase()}
            </span>
          ) : (
            <a
              href={withSlash(getPathname({ href: pathname, locale }))}
              lang={locale}
              hrefLang={locale}
              onClick={() => track("switch_language", { from: current, to: locale })}
              className="inline-flex min-h-11 min-w-11 items-center justify-center opacity-85 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
            >
              {locale.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
