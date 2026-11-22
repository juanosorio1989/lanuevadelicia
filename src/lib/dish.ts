import { categories } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { getPhoto } from "@/lib/photo";
import type { Locale, MenuItem } from "@/types/content";

/** Plain strings for the client dish dialog. */
export type DishDisplay = {
  id: string;
  name: string;
  description?: string;
  note?: string;
  price?: string;
  options: { label: string; price?: string }[];
  photo: { src: string; width: number; height: number; alt: string };
};

/** Server-side only (getPhoto pulls the manifest). Throws for an item without an image. */
export function toDishDisplay(item: MenuItem, locale: Locale): DishDisplay {
  if (!item.image) throw new Error(`Menu item ${item.id} has no image`);
  const photo = getPhoto(item.image);
  return {
    id: item.id,
    name: item.name[locale],
    description: item.description?.[locale],
    note: categories.find((c) => c.id === item.category)?.note?.[locale],
    price: item.price === undefined ? undefined : formatPrice(item.price),
    options: (item.options ?? []).map((o) => ({ label: o.label[locale], price: o.price === undefined ? undefined : formatPrice(o.price) })),
    photo: { src: photo.src, width: photo.width, height: photo.height, alt: photo.alt[locale] },
  };
}
