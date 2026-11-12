import { Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Img } from "@/components/ui/Img";
import { photos } from "@/data/photos";
import { restaurant } from "@/data/restaurant";
import type { Locale } from "@/i18n/routing";
import { directionsUrl, telHref } from "@/lib/links";
import { HeaderShell } from "./HeaderShell";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS, type NavLabels } from "./nav-items";
import { NavLinks } from "./NavLinks";
import { TrackedLink } from "./TrackedLink";

const logo = photos.find((p) => p.id === "brand/logo")!;

export async function Header() {
  const t = await getTranslations("nav");
  const cta = await getTranslations("cta");
  const locale = (await getLocale()) as Locale;
  const navKeys = [...NAV_ITEMS.map((i) => i.key), "main", "openMenu", "closeMenu"] as const;
  const navLabels = Object.fromEntries(navKeys.map((k) => [k, t(k)])) as NavLabels;

  return (
    <HeaderShell>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 lg:gap-6 lg:px-8">
        <a
          href={`/${locale}/`}
          aria-label={t("home")}
          className="flex min-h-11 shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
        >
          <Img
            photo={logo}
            locale={locale}
            sizes="56px"
            eager
            className="h-12 w-auto transition-[height] duration-200 group-data-[scrolled]:h-10 shrink-0 object-contain lg:h-14"
          />
        </a>
        <NavLinks locale={locale} labels={navLabels} />
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <LanguageSwitch current={locale} label={t("language")} />
          <MobileNav locale={locale} labels={navLabels} />
        </div>
        <TrackedLink
          href={telHref()}
          event="click_call"
          params={{ location: "header" }}
          className="hidden min-h-11 items-center gap-2 text-sm font-bold whitespace-nowrap hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50 lg:inline-flex"
        >
          <Phone aria-hidden="true" size={16} />
          {restaurant.phone.display}
        </TrackedLink>
        <TrackedLink
          href={directionsUrl()}
          event="click_directions"
          params={{ location: "header" }}
          external
          variant="primary"
          className="px-5! py-2! text-sm whitespace-nowrap focus-visible:outline-cream-50! max-lg:hidden!"
        >
          {cta("directions")}
        </TrackedLink>
      </div>
    </HeaderShell>
  );
}
