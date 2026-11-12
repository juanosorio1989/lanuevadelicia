import { describe, it, expect } from "vitest";
import { schemas, validateContent } from "@/data/schemas";

const l10n = { es: "Hola", en: "Hello" };
const photo = {
  id: "p1",
  src: "/img/p1.jpg",
  width: 800,
  height: 600,
  alt: l10n,
  group: "dishes",
};
const item = { id: "item-1", category: "pollo", name: l10n, price: 10 };
const empty = { categories: [], menuItems: [], specials: [], photos: [] };

describe("content", () => {
  it("content validates", () => {
    expect(() => validateContent()).not.toThrow();
  });
});

describe("schemas reject bad samples", () => {
  it("rejects zero and negative prices", () => {
    expect(schemas.menuItem.safeParse({ ...item, price: 0 }).success).toBe(false);
    expect(schemas.menuItem.safeParse({ ...item, price: -3 }).success).toBe(false);
    expect(schemas.menuItem.safeParse(item).success).toBe(true);
  });
  it("rejects an empty en name", () => {
    expect(
      schemas.menuItem.safeParse({ ...item, name: { es: "Hola", en: "" } }).success,
    ).toBe(false);
  });
  it("rejects hours open not in HH:MM", () => {
    expect(
      schemas.hoursRule.safeParse({ days: [1], open: "9:00", close: "21:00" }).success,
    ).toBe(false);
    expect(
      schemas.hoursRule.safeParse({ days: [1], open: "09:00", close: "21:00" }).success,
    ).toBe(true);
  });
  it("rejects a special day of 0", () => {
    expect(
      schemas.specialDay.safeParse({ day: 0, main: l10n, price: 10, flyer: "p1" }).success,
    ).toBe(false);
  });
});

describe("validateContent cross checks", () => {
  it("rejects duplicate item ids", () => {
    expect(() =>
      validateContent({ ...empty, menuItems: [item, item] }),
    ).toThrow(/duplicate/i);
  });
  it("rejects an image id missing from photos", () => {
    expect(() =>
      validateContent({ ...empty, menuItems: [{ ...item, image: "nope" }] }),
    ).toThrow(/nope/);
  });
  it("accepts an image id present in photos", () => {
    expect(() =>
      validateContent({ ...empty, photos: [photo], menuItems: [{ ...item, image: "p1" }] }),
    ).not.toThrow();
  });
  it("rejects a featured item without an image", () => {
    expect(() =>
      validateContent({ ...empty, menuItems: [{ ...item, featured: true }] }),
    ).toThrow(/featured/i);
  });
  it("rejects a special flyer missing from photos", () => {
    expect(() =>
      validateContent({
        ...empty,
        specials: [{ day: 1, main: l10n, price: 10, flyer: "nope" }],
      }),
    ).toThrow(/nope/);
  });
  it("lists every problem", () => {
    expect(() =>
      validateContent({
        ...empty,
        menuItems: [{ ...item, price: 0 }, { ...item, featured: true }],
      }),
    ).toThrow(/price[\s\S]*duplicate/i);
  });
});
