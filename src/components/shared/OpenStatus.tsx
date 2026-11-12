"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { restaurant } from "@/data/restaurant";
import { weekdayName } from "@/lib/format";
import { formatTime, getOpenStatus } from "@/lib/hours";
import type { Locale } from "@/types/content";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}
// A string snapshot keeps getSnapshot referentially stable between ticks.
const getSnapshot = () => JSON.stringify(getOpenStatus(new Date(), restaurant.hours));
const getServerSnapshot = () => null;

const dotColor = { open: "bg-[#6fcf7f]", "closing-soon": "bg-star", closed: "bg-muted-600" } as const;

/** Open/closed badge in New York time. Renders nothing on the server and in the no-JS view (a cached badge could be wrong). */
export function OpenStatus({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = useTranslations("status");
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!snapshot) return null;
  const status = JSON.parse(snapshot) as ReturnType<typeof getOpenStatus>;

  let text: string;
  if (status.state === "open") text = t("open", { time: formatTime(status.closesAt, locale) });
  else if (status.state === "closing-soon") text = t("closingSoon", { time: formatTime(status.closesAt, locale) });
  else {
    const time = formatTime(status.opensAt, locale);
    if (status.opensDay === "today") text = t("closedToday", { time });
    else if (status.opensDay === "tomorrow") text = t("closedTomorrow", { time });
    else text = t("closedDay", { time, day: weekdayName(status.opensDay, locale) });
  }

  return (
    <p data-testid="open-status" className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span aria-hidden="true" className={`inline-block size-2 rounded-full ${dotColor[status.state]}`} />
      {text}
    </p>
  );
}
