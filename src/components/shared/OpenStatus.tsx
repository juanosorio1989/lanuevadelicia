import { getTranslations } from "next-intl/server";
import type { Locale } from "@/types/content";
import { OpenStatusLive } from "./OpenStatusLive";

/** Server wrapper: hands the client badge its strings as props (no intl provider on the client). */
export async function OpenStatus({ locale, className }: { locale: Locale; className?: string }) {
  const t = await getTranslations({ locale, namespace: "status" });
  const labels = {
    open: t.raw("open") as string,
    closingSoon: t.raw("closingSoon") as string,
    closedToday: t.raw("closedToday") as string,
    closedTomorrow: t.raw("closedTomorrow") as string,
    closedDay: t.raw("closedDay") as string,
  };
  return <OpenStatusLive locale={locale} labels={labels} className={className} />;
}
