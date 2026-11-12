import { Img } from "@/components/ui/Img";
import { formatPrice } from "@/lib/format";
import { getPhoto } from "@/lib/photo";
import type { Locale, MenuItem } from "@/types/content";
import { FavoriteTag, ItemOptions, type ItemHeading, type MenuLabels } from "./MenuItemRow";

/** Photo card: horizontal with a 104x92 thumbnail on mobile, vertical on md and up. */
export function MenuItemCard({ item, locale, labels, heading: H = "h3" }: { item: MenuItem; locale: Locale; labels: MenuLabels; heading?: ItemHeading }) {
  const photo = getPhoto(item.image!);
  return (
    <li
      data-item="card"
      data-featured={item.featured ? "" : undefined}
      className="flex overflow-hidden rounded-card bg-white md:flex-col"
    >
      <Img
        photo={photo}
        locale={locale}
        sizes="(min-width: 768px) 33vw, 104px"
        className="h-[92px] w-[104px] shrink-0 object-cover md:h-36 md:w-full"
      />
      <div className="min-w-0 flex-1 py-2 pr-2.5 pl-3 text-sm md:p-3">
        <div className="flex items-baseline justify-between gap-2">
          <H className="font-display text-[0.9375rem] font-bold md:text-base">
            {item.name[locale]}
            {item.featured && <FavoriteTag label={labels.favorite} />}
          </H>
          {item.price !== undefined && <span className="shrink-0 font-bold text-terra-700">{formatPrice(item.price)}</span>}
        </div>
        {item.description && <p className="mt-0.5 text-muted-600">{item.description[locale]}</p>}
        <ItemOptions item={item} locale={locale} />
      </div>
    </li>
  );
}
