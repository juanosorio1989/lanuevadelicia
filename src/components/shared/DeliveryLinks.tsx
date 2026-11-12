import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { restaurant } from "@/data/restaurant";
import type { Locale } from "@/types/content";

const linkClass =
  "inline-flex min-h-11 items-center font-bold text-green-900 underline underline-offset-4 hover:text-terra-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900";

/** "Prefer delivery? Uber Eats · DoorDash · Grubhub", each an external tracked link. */
export async function DeliveryLinks({
  locale,
  location,
  className = "",
  variant = "links",
}: {
  locale: Locale;
  location: string;
  className?: string;
  /** "links" = inline text links (home); "buttons" = secondary (outline) buttons (Visit page, spec 03). */
  variant?: "links" | "buttons";
}) {
  const t = await getTranslations({ locale, namespace: "delivery" });
  return (
    <div className={`flex flex-wrap items-center gap-x-2 text-sm ${className}`.trim()}>
      <span>{t("prompt")}</span>
      {restaurant.delivery.map((d, i) =>
        variant === "buttons" ? (
          <TrackedLink
            key={d.app}
            href={d.url}
            event="click_delivery"
            params={{ app: d.app, location }}
            external
            variant="outline"
            className="px-4! text-sm!"
          >
            {d.label}
          </TrackedLink>
        ) : (
          <span key={d.app} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">·</span>}
            <TrackedLink href={d.url} event="click_delivery" params={{ app: d.app, location }} external className={linkClass}>
              {d.label}
            </TrackedLink>
          </span>
        ),
      )}
    </div>
  );
}
