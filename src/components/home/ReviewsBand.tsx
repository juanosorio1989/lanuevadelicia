import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { restaurant } from "@/data/restaurant";
import { reviewsUrl, writeReviewUrl } from "@/lib/links";
import type { Locale } from "@/types/content";

export async function ReviewsBand({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.reviews" });
  const { value, displayCount } = restaurant.rating;
  const filled = Math.round(value);

  return (
    <section data-testid="reviews-band" aria-labelledby="reviews-title" className="bg-green-900 px-4 py-9 text-center text-cream-50 md:px-11">
      <p role="img" aria-label={t("stars", { value })} className="text-[1.75rem] tracking-[0.2em] text-star">
        {"★".repeat(filled)}
        {"☆".repeat(5 - filled)}
      </p>
      <h2 id="reviews-title" className="mt-1 text-[1.375rem] text-cream-50 md:text-[1.875rem]">
        {t("title", { value, count: displayCount })}
      </h2>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <TrackedLink href={reviewsUrl()} event="click_reviews" params={{ action: "read", location: "home" }} external variant="primary">
          {t("read")}
        </TrackedLink>
        <TrackedLink href={writeReviewUrl()} event="click_reviews" params={{ action: "write", location: "home" }} external variant="on-dark">
          {t("write")}
        </TrackedLink>
      </div>
    </section>
  );
}
