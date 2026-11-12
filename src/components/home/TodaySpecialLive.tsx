"use client";

import { useSyncExternalStore } from "react";
import ExportedImage from "next-image-export-optimizer";
import { Button } from "@/components/ui/Button";
import { nyNow } from "@/lib/hours";
import type { Locale } from "@/types/content";

export type SpecialDisplay = {
  day: number;
  dayName: string;
  main: string;
  hasAlternative: boolean;
  price: string;
  flyer: { src: string; width: number; height: number; alt: string };
};

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}
const getSnapshot = () => nyNow(new Date()).weekday;
const getServerSnapshot = () => null;

/** Static HTML and the no-JS view show a neutral teaser (no dish, no price); the client swaps in today's special in New York time. */
export type TodayLabels = {
  eyebrowNeutral: string;
  eyebrow: string;
  teaser: string;
  alternative: string;
  all: string;
};

export function TodaySpecialLive({ locale, days, labels }: { locale: Locale; days: SpecialDisplay[]; labels: TodayLabels }) {
  const weekday = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const today = weekday === null ? undefined : days.find((d) => d.day === weekday);

  return (
    <section
      data-testid="today-special"
      aria-labelledby="today-title"
      className="mx-auto my-[22px] max-w-6xl md:my-11 md:px-8"
    >
      <div className="grid items-center gap-5 bg-sand-100 p-5 md:grid-cols-[13.75rem_1fr] md:gap-8 md:rounded-band md:p-6">
        {today && (
          <ExportedImage
            src={today.flyer.src}
            alt={today.flyer.alt}
            width={today.flyer.width}
            height={today.flyer.height}
            sizes="220px"
            className="mx-auto w-44 rounded-[10px] md:w-full"
          />
        )}
        <div className={today ? "" : "md:col-span-2"}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-green-900">
            {today ? labels.eyebrow.replace("{day}", today.dayName) : labels.eyebrowNeutral}
          </p>
          <h2 id="today-title" className="mt-1 text-[1.375rem] md:text-[1.875rem]">
            {today ? today.main : labels.teaser}
          </h2>
          {today && (
            <p className="mt-1 text-sm text-charcoal-900">
              <span className="font-bold">{today.price}</span>
              {today.hasAlternative && <> · {labels.alternative}</>}
            </p>
          )}
          <div className="mt-4">
            <Button href={`/${locale}/specials/`} variant="outline">
              {labels.all}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
