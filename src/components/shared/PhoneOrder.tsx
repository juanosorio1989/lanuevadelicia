import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { DeliveryLinks } from "@/components/shared/DeliveryLinks";
import { restaurant } from "@/data/restaurant";
import type { TrackLocation } from "@/lib/analytics";
import { telHref } from "@/lib/links";
import type { Locale } from "@/types/content";

/** Pickup and own delivery by phone, the delivery range, and the apps beyond it. */
export async function PhoneOrder({
  locale,
  location,
  variant = "links",
  className = "",
}: {
  locale: Locale;
  location: TrackLocation;
  variant?: "links" | "buttons";
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "delivery" });
  const { freeMiles, maxMiles } = restaurant.deliveryRange;
  // Miles as plain strings: ICU would print "1,5" in Spanish; US Spanish writes 1.5.
  const range = { free: String(freeMiles), max: String(maxMiles) };
  const phone = (
    <TrackedLink
      href={telHref()}
      event="click_call"
      params={{ location }}
      className="font-bold whitespace-nowrap text-green-900 underline underline-offset-4 hover:text-terra-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900"
    >
      <Phone aria-hidden="true" size={14} className="mr-1 inline align-[-2px]" />
      {restaurant.phone.display}
    </TrackedLink>
  );

  return (
    <div data-testid="phone-order" className={`text-sm ${className}`.trim()}>
      <p>{t.rich("reservations", { b: (chunks) => <strong>{chunks}</strong>, phone: () => phone })}</p>
      <p className="mt-3 font-bold">{t("phoneTitle")}</p>
      <p className="mt-1">{t.rich("phoneBody", { phone: () => phone })}</p>
      <p className="mt-1 text-muted-600">{t("range", range)}</p>
      <DeliveryLinks locale={locale} location={location} variant={variant} showPrompt={false} className="mt-1 gap-y-2" />
    </div>
  );
}
