import { describe, it, expect } from "vitest";
import { categories, menuItems } from "@/data/menu";
import { specials } from "@/data/specials";
import { photos } from "@/data/photos";
import { validateContent } from "@/data/schemas";
import { restaurant } from "@/data/restaurant";
import { formatTime } from "@/lib/hours";
import { entries } from "../../scripts/photo-manifest";

const byId = Object.fromEntries(menuItems.map((i) => [i.id, i]));
const priceOf = (id: string) => {
  expect(byId[id], `missing item ${id}`).toBeDefined();
  return byId[id].price;
};

describe("menu categories", () => {
  it("has the 13 approved categories in order", () => {
    expect(categories.map((c) => c.id)).toEqual([
      "desayunos", "antojitos", "ricuras", "pollo", "mariscos", "ensaladas",
      "especiales", "infantil", "extras", "postres", "bebidas", "cocteles", "cervezas",
    ]);
    expect(categories.map((c) => c.order)).toEqual(categories.map((_, i) => i + 1));
  });
  it("uses the spec 04 labels and notes", () => {
    const c = Object.fromEntries(categories.map((x) => [x.id, x]));
    expect(c.ricuras.name).toEqual({ es: "Ricuras de la casa", en: "House specials" });
    expect(c.desayunos.note).toEqual({
      es: "Solo hasta la 1:00 p.m.",
      en: "Served until 1:00 p.m.",
    });
    expect(c.cervezas.name.en).toBe("Beer, wine & shots");
  });
  it("the happy hour line matches the facts in restaurant.ts", () => {
    const note = categories.find((x) => x.id === "cocteles")!.note!;
    for (const s of [note.es, note.en]) {
      expect(s).toContain(`$${restaurant.happyHourCocktailPrice}.`);
      expect(s).toMatch(/12:00 (a|to) 7:00 p\.m\..*5:00 (a|to) 8:00 p\.m\./);
    }
    expect(restaurant.happyHour).toEqual([
      { days: [1, 2, 3, 4, 5], from: "12:00", to: "19:00" },
      { days: [6, 7], from: "17:00", to: "20:00" },
    ]);
  });
  // The flyer wording shares one p.m. between the two ends ("12:00 a 7:00 p.m."), so the opening time is compared without its suffix.
  const bare = (hhmm: string) => formatTime(hhmm, "es").replace(/ [ap]\.m\.$/, "");
  it.each(["es", "en"] as const)("cocteles note (%s) holds the formatted happy hour times and price", (locale) => {
    const note = categories.find((x) => x.id === "cocteles")!.note![locale];
    for (const hh of restaurant.happyHour) {
      expect(note).toContain(`${bare(hh.from)} ${locale === "es" ? "a" : "to"} ${formatTime(hh.to, "es")}`);
    }
    expect(note).toContain(`$${restaurant.happyHourCocktailPrice}`);
  });
  it.each(["es", "en"] as const)("desayunos note (%s) holds the formatted breakfast cutoff", (locale) => {
    const note = categories.find((x) => x.id === "desayunos")!.note![locale];
    expect(note).toContain(formatTime(restaurant.breakfastUntil, "es"));
  });
  it("every category has at least one item and every item a known category", () => {
    for (const cat of categories)
      expect(menuItems.some((i) => i.category === cat.id), cat.id).toBe(true);
  });
});

describe("menu items (prices read from the printed PDF)", () => {
  it("pins key prices", () => {
    expect(priceOf("bandeja-paisa")).toBe(23);
    expect(priceOf("picada-doble")).toBe(65);
    expect(priceOf("calentado-con-chuleta-y-huevos-al-gusto")).toBe(12.99);
    expect(priceOf("arroz-a-la-marinera")).toBe(28);
    expect(priceOf("entrana-a-la-marinera")).toBe(43);
    expect(priceOf("arepa-asada")).toBe(3);
    // Antojitos two-column prices that the text extract scrambles.
    expect(priceOf("guacamole-con-tostones")).toBe(15);
    expect(priceOf("guacamole-con-tostones-y-chicharron")).toBe(20);
    expect(priceOf("combo-empanaditas")).toBe(7.99);
    expect(priceOf("maduro-con-queso")).toBe(6.5);
    expect(priceOf("shot-don-julio-1942")).toBe(28);
    expect(priceOf("jarra-de-sangria")).toBe(31);
    expect(priceOf("cualquier-carne-de-los-especiales")).toBe(7);
    expect(priceOf("sopa-grande-adicional")).toBe(6);
  });
  it("features exactly the four homepage dishes in order", () => {
    expect(
      menuItems
        .filter((i) => i.featured)
        .sort((a, b) => a.featuredOrder! - b.featuredOrder!)
        .map((i) => i.id),
    ).toEqual([
      "bandeja-paisa",
      "calentado-con-chuleta-y-huevos-al-gusto",
      "arroz-a-la-marinera",
      "picada-doble",
    ]);
  });
  it("has bilingual names and no printed misspellings", () => {
    expect(menuItems.every((i) => i.name.es && i.name.en)).toBe(true);
    expect(JSON.stringify(menuItems)).not.toMatch(
      /tounge|beed|soupe|onios|Ask far|seafoodrice|chower|\bbain\b|\bar breaded|popatoes|Sirlion/i,
    );
  });
  it("every item has a price or priced options", () => {
    for (const i of menuItems)
      expect(
        i.price !== undefined || (i.options ?? []).some((o) => o.price !== undefined),
        i.id,
      ).toBe(true);
  });
  it("models juices as one item with flavors and milk/water prices", () => {
    const j = byId["jugos-naturales"];
    expect(j.price).toBeUndefined();
    expect(j.options?.filter((o) => o.price !== undefined)).toEqual([
      { label: { es: "En leche", en: "In milk" }, price: 7 },
      { label: { es: "En agua", en: "In water" }, price: 6 },
    ]);
    expect(j.options?.filter((o) => o.price === undefined).map((o) => o.label.es)).toEqual([
      "Papaya-guanábana", "Mango-guayaba", "Banano-lulo", "Mora-maracuyá", "Piña-tomate de árbol",
    ]);
  });
  it("models cocktail flavors as options, not items", () => {
    expect(byId["margarita"].price).toBe(13);
    expect(byId["margarita"].options?.map((o) => o.label.es)).toEqual([
      "Mango", "Mora", "Coco", "Maracuyá", "Tradicional", "Tamarindo",
    ]);
    expect(byId["mojito"].options?.map((o) => o.label.es)).toEqual([
      "Mango", "Maracuyá", "Coco", "Tradicional",
    ]);
    expect(menuItems.some((i) => /margarita-de|mojito-de/.test(i.id))).toBe(false);
  });
  it("one price for grilled or breaded pork chop", () => {
    const c = byId["chuleta-de-cerdo-a-la-parrilla-o-empanizada"];
    expect(c.price).toBe(20);
    expect(c.options?.every((o) => o.price === undefined)).toBe(true);
  });
  it("keeps the two calentado descriptions as printed (spec Q7)", () => {
    expect(byId["calentado-con-pechuga-y-huevos-al-gusto"].description?.en).toBe(
      "Mixed rice & beans, with eggs as you like",
    );
    expect(byId["calentado-con-huevos-al-gusto"].description?.en).toMatch(/cheese and grilled beef/);
  });
  it("keeps the breakfast soups under Desayunos", () => {
    expect(byId["caldo-de-costilla"].category).toBe("desayunos");
    expect(byId["consome-de-menudencias"].category).toBe("desayunos");
  });
  it("subsections drinks and bar items", () => {
    const subs = (cat: string) => [
      ...new Set(menuItems.filter((i) => i.category === cat).map((i) => i.subcategory?.es)),
    ];
    expect(subs("bebidas")).toEqual(["Bebidas calientes y frías", "Jugos naturales"]);
    expect(subs("cervezas")).toEqual(["Cervezas", "Vinos", "Shots"]);
  });
});

describe("weekly specials", () => {
  it("has seven days with the printed prices", () => {
    expect(specials.map((s) => [s.day, s.price])).toEqual([
      [1, 13], [2, 13], [3, 13], [4, 13], [5, 15], [6, 15], [7, 15],
    ]);
  });
  it("uses the flyer text from spec 04", () => {
    expect(specials.find((s) => s.day === 4)?.alternative?.es).toBe(
      "Sancocho de pescado con mojarra frita",
    );
    expect(specials.find((s) => s.day === 5)?.alternative?.es).toBe(
      "Sopa de vegetales con filete de pescado",
    );
    expect(specials.find((s) => s.day === 7)?.main.es).toBe(
      "Cazuela de fríjoles con pezuña, acompañada con chicharrón",
    );
    expect(specials.filter((s) => s.alternative).map((s) => s.day)).toEqual([4, 5]);
  });
  it("points each day at its flyer", () => {
    expect(specials.map((s) => s.flyer)).toEqual([
      "specials/lunes", "specials/martes", "specials/miercoles", "specials/jueves",
      "specials/viernes", "specials/sabado", "specials/domingo",
    ]);
  });
});

describe("menu and photos", () => {
  it("all content validates", () => {
    expect(() => validateContent()).not.toThrow();
  });
  it("each manifest dish or drink photo with an itemId is that item's image", () => {
    for (const e of entries.filter((x) => x.itemId)) {
      expect(byId[e.itemId!], e.itemId).toBeDefined();
      expect(byId[e.itemId!].image, e.itemId).toBe(e.id);
    }
  });
  it("every item image comes from a manifest entry for that item", () => {
    for (const i of menuItems.filter((x) => x.image)) {
      const e = entries.find((x) => x.id === i.image);
      expect(e?.itemId, i.id).toBe(i.id);
    }
  });
  it("every item photo alt is derived from the item name", () => {
    const photo = Object.fromEntries(photos.map((p) => [p.id, p]));
    for (const i of menuItems.filter((x) => x.image))
      expect(photo[i.image!].alt, i.id).toEqual({
        es: `${i.name.es} en La Nueva Delicia`,
        en: `${i.name.en} at La Nueva Delicia`,
      });
  });
});
