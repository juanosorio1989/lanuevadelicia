"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Img } from "@/components/ui/Img";
import { photos } from "@/data/photos";
import { restaurant } from "@/data/restaurant";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { directionsUrl, telHref } from "@/lib/links";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";
import { TrackedLink } from "./TrackedLink";

const logo = photos.find((p) => p.id === "brand/logo")!;

/** Sticky green header; padding shrinks after 24px of scroll (the global reduced-motion rule removes the transition). */
export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-green-900 text-cream-50 transition-[padding] duration-200 ${
        scrolled ? "py-0.5" : "py-2"
      }`}
    >
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
            className={`w-auto transition-[height] duration-200 ${scrolled ? "h-10" : "h-12 md:h-14"}`}
          />
        </Link>
        <nav aria-label={t("main")} className="hidden flex-1 items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50 ${
                  active ? "font-bold" : ""
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
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
    </header>
  );
}
