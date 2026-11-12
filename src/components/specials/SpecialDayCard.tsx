import { Img } from "@/components/ui/Img";
import type { Locale, Photo } from "@/types/content";

export type SpecialCardProps = {
  day: number;
  dayName: string;
  main: string;
  alternative?: string;
  price: string;
  flyer: Photo;
  locale: Locale;
  labels: { today: string; alternative: string; alternativeNote: string };
};

/** One weekday. Server-rendered; TodayHighlighter (client) adds aria-current and unhides the badge in New York time. */
export function SpecialDayCard({
  day,
  dayName,
  main,
  alternative,
  price,
  flyer,
  locale,
  labels,
}: SpecialCardProps) {
  return (
    <section
      id={`day-${day}`}
      aria-labelledby={`day-${day}-title`}
      className="scroll-mt-20 grid items-start gap-4 rounded-[14px] border border-sand-100 bg-cream-50 p-4 aria-[current=date]:border-terra-700 aria-[current=date]:bg-sand-100 md:grid-cols-[13.75rem_1fr] md:gap-6 md:p-5"
    >
      <Img
        photo={flyer}
        locale={locale}
        sizes="(min-width: 768px) 220px, 60vw"
        className="mx-auto w-[60%] max-w-[15rem] rounded-[10px] md:w-full"
      />
      <div>
        <h2
          id={`day-${day}-title`}
          className="text-[1.375rem] md:text-[1.75rem]"
        >
          {dayName}{" "}
          <span
            data-today-badge
            hidden
            className="ml-1 rounded-full bg-terra-700 px-3 py-1 align-middle text-xs font-bold uppercase tracking-[0.08em] text-cream-50"
          >
            {labels.today}
          </span>
        </h2>
        <p className="mt-2 text-lg font-bold text-charcoal-900">{main}</p>
        <p className="mt-1 text-lg font-bold text-terra-700">{price}</p>
        {alternative && (
          <div className="mt-3 border-t border-sand-100 pt-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-green-900">
              {labels.alternative}
            </p>
            <p
              data-testid="alt-dish"
              className="mt-1 text-base text-charcoal-900"
            >
              {alternative}
            </p>
            <p className="mt-1 text-sm text-muted-600">
              {labels.alternativeNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
