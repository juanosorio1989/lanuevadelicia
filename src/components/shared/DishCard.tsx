import { Img } from "@/components/ui/Img";
import { formatPrice } from "@/lib/format";
import type { Locale, MenuItem, Photo } from "@/types/content";

/** Vertical dish card: photo, name, short line and price. `note` overrides the item's description. */
export function DishCard({ item, photo, locale, note, sizes, openLabel }: { item: MenuItem; photo: Photo; locale: Locale; note?: string; sizes: string; openLabel: string }) {
  const line = note ?? item.description?.[locale];
  return (
    <article className="relative h-full overflow-hidden rounded-card bg-white transition-shadow hover:shadow-md">
      <Img photo={photo} locale={locale} sizes={sizes} className="h-36 w-full object-cover" />
      <div className="p-3 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-base font-bold"><a href={photo.src} data-dish={item.id} aria-label={openLabel.replace("{name}", item.name[locale])} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-green-900 focus-visible:after:rounded-card focus-visible:after:-outline-offset-2">
              {item.name[locale]}
            </a>
          </h3>
          {item.price !== undefined && <span className="shrink-0 font-bold text-terra-700">{formatPrice(item.price)}</span>}
        </div>
        {line && <p className="mt-1 text-muted-600">{line}</p>}
      </div>
    </article>
  );
}
