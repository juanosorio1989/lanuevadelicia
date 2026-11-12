import { formatPrice } from "@/lib/format";
import type { Locale, MenuItem } from "@/types/content";

export type MenuLabels = { favorite: string; flavors: (list: string) => string };

/** Priced options as lines ("En leche $7"), unpriced options as one flavor list. */
export function ItemOptions({ item, locale, labels }: { item: MenuItem; locale: Locale; labels: MenuLabels }) {
  const priced = item.options?.filter((o) => o.price !== undefined) ?? [];
  const plain = item.options?.filter((o) => o.price === undefined) ?? [];
  if (priced.length === 0 && plain.length === 0) return null;
  return (
    <div className="mt-1 text-muted-600">
      {plain.length > 0 && <p>{labels.flavors(plain.map((o) => o.label[locale]).join(", "))}</p>}
      {priced.length > 0 && (
        <ul>
          {priced.map((o) => (
            <li key={o.label.es} className="flex justify-between gap-3">
              <span>{o.label[locale]}</span>
              <span className="font-bold text-terra-700">{formatPrice(o.price!)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FavoriteTag({ label }: { label: string }) {
  return <span className="ml-1.5 inline-block rounded-md bg-sand-100 px-1.5 text-[0.6875rem] font-bold text-green-900">{label}</span>;
}

/** Text-list row: name, short description, price on the right, dotted separator. */
export function MenuItemRow({ item, locale, labels }: { item: MenuItem; locale: Locale; labels: MenuLabels }) {
  return (
    <li
      data-item="row"
      data-featured={item.featured ? "" : undefined}
      className="flex justify-between gap-3 border-b border-dotted border-muted-600/40 py-2.5 text-sm"
    >
      <div className="min-w-0">
        <h3 className="font-sans text-sm font-bold">
          {item.name[locale]}
          {item.featured && <FavoriteTag label={labels.favorite} />}
        </h3>
        {item.description && <p className="text-muted-600">{item.description[locale]}</p>}
        <ItemOptions item={item} locale={locale} labels={labels} />
      </div>
      {item.price !== undefined && <span className="shrink-0 font-bold text-terra-700">{formatPrice(item.price)}</span>}
    </li>
  );
}
