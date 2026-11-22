import { describe, expect, it } from "vitest";
import { menuItems } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { getPhoto } from "@/lib/photo";
import { toDishDisplay } from "@/lib/dish";

const withImage = menuItems.filter((i) => i.image && i.price !== undefined);

describe("toDishDisplay", () => {
  it("maps name, price and photo for each locale", () => {
    const item = withImage[0];
    const photo = getPhoto(item.image!);
    for (const locale of ["es", "en"] as const) {
      const d = toDishDisplay(item, locale);
      expect(d.id).toBe(item.id);
      expect(d.name).toBe(item.name[locale]);
      expect(d.price).toBe(formatPrice(item.price!));
      expect(d.photo).toEqual({ src: photo.src, width: photo.width, height: photo.height, alt: photo.alt[locale] });
    }
  });

  it("maps options with formatted prices", () => {
    const item = menuItems.find((i) => i.image && i.options?.length);
    expect(item).toBeDefined();
    const d = toDishDisplay(item!, "en");
    expect(d.options).toEqual(item!.options!.map((o) => ({ label: o.label.en, price: o.price === undefined ? undefined : formatPrice(o.price) })));
  });

  it("throws for an item without an image", () => {
    const item = menuItems.find((i) => !i.image)!;
    expect(() => toDishDisplay(item, "es")).toThrow();
  });
});
