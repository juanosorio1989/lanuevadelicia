import { Img } from "@/components/ui/Img";
import { formatPrice } from "@/lib/format";
import type { Locale, MenuItem, Photo } from "@/types/content";

/** Vertical dish card: photo, name, short line and price. `note` overrides the item's description. */
export function DishCard({ item, photo, locale, note, sizes }: { item: MenuItem; photo: Photo; locale: Locale; note?: string; sizes: string }) {
  const line = note ?? item.description?.[locale];
  return (
    <article className="h-full overflow-hidden rounded-card bg-white">
      <Img photo={photo} locale={locale} sizes={sizes} className="h-36 w-full object-cover" />
      <div className="p-3 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-base font-bold">{item.name[locale]}</h3>
          {item.price !== undefined && <span className="shrink-0 font-bold text-terra-700">{formatPrice(item.price)}</span>}
        </div>
        {line && <p className="mt-1 text-muted-600">{line}</p>}
      </div>
    </article>
  );
}
