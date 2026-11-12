import { MapPin, Phone, UtensilsCrossed } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { directionsUrl, telHref } from "@/lib/links";
import { TrackedLink } from "./TrackedLink";

const cell =
  "flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs font-bold leading-tight focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-solid focus-visible:outline-green-900";

/** Fixed bottom bar below lg: Menu, Directions (primary, wider), Call. */
export async function MobileActionBar() {
  const t = await getTranslations("cta");
  const locale = await getLocale();
  return (
    <nav
      data-testid="bottom-bar"
      aria-label={`${t("menu")} / ${t("directions")} / ${t("call")}`}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_1.3fr_1fr] border-t border-sand-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <a href={`/${locale}/menu/`} data-testid="bottom-bar-menu" className={`${cell} text-green-900`}>
        <UtensilsCrossed aria-hidden="true" size={20} />
        <span className="max-w-full truncate">{t("menu")}</span>
      </a>
      <TrackedLink
        href={directionsUrl()}
        event="click_directions"
        params={{ location: "bottom_bar" }}
        external
        data-testid="bottom-bar-directions"
        className={`${cell} bg-terra-700 text-white focus-visible:outline-white`}
      >
        <MapPin aria-hidden="true" size={20} />
        <span className="max-w-full truncate">{t("directions")}</span>
      </TrackedLink>
      <TrackedLink
        href={telHref()}
        event="click_call"
        params={{ location: "bottom_bar" }}
        data-testid="bottom-bar-call"
        className={`${cell} text-green-900`}
      >
        <Phone aria-hidden="true" size={20} />
        <span className="max-w-full truncate">{t("call")}</span>
      </TrackedLink>
    </nav>
  );
}
