import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { DeliveryLinks } from "@/components/shared/DeliveryLinks";
import { telHref } from "@/lib/links";
import type { Locale } from "@/types/content";

/** Order block shown inside the dish dialog: delivery apps and the phone button. Same for every dish. */
export async function DishActions({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "dish" });
  return (
    <>
      <p className="font-bold text-green-900">{t("order")}</p>
      <DeliveryLinks locale={locale} location="dish" variant="buttons" className="mt-2 gap-y-2" />
      <div className="mt-2">
        <TrackedLink href={telHref()} event="click_call" params={{ location: "dish" }} variant="primary">
          {t("call")}
        </TrackedLink>
      </div>
    </>
  );
}
