import { Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Img } from "@/components/ui/Img";
import { photos } from "@/data/photos";
import { restaurant } from "@/data/restaurant";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { directionsUrl, telHref } from "@/lib/links";
import { HeaderShell } from "./HeaderShell";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { TrackedLink } from "./TrackedLink";

const logo = photos.find((p) => p.id === "brand/logo")!;

export async function Header() {
  const t = await getTranslations("nav");
  const cta = await getTranslations("cta");
  const locale = (await getLocale()) as Locale;

  return (
    <HeaderShell>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 md:gap-6 md:px-8">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
        >
          <Img
            photo={logo}
            locale={locale}
            sizes="56px"
            priority
            className="h-12 w-auto transition-[height] duration-200 group-data-[scrolled]:h-10 md:h-14"
          />
        </Link>
        <NavLinks />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <LanguageSwitch />
          <MobileNav />
        </div>
        <TrackedLink
          href={telHref()}
          event="click_call"
          params={{ location: "header" }}
          className="hidden min-h-11 items-center gap-2 text-sm font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50 md:inline-flex"
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
          className="hidden px-5! py-2! text-sm focus-visible:outline-cream-50! md:inline-flex"
        >
          {cta("directions")}
        </TrackedLink>
      </div>
    </HeaderShell>
  );
}
