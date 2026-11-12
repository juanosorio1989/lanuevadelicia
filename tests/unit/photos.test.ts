import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { entries } from "../../scripts/photo-manifest";
import { photos } from "@/data/photos";

const root = path.resolve(__dirname, "../..");
const hasInbox = fs.existsSync(path.join(root, "assets-inbox"));

// Spec 06 exclusion list (long side under 1000px) plus Cervezas.jpg (Claude's call).
const excluded = [
  "BEBIDAS/JUGOS.jpg",
  "PESCADOS Y MARISCOS/Filete de Pescado a la Parrilla.jpg",
  "PESCADOS Y MARISCOS/Spaguetti a la Marinera.jpg",
  "POLLO/Spaguetti en crema de Pollo.jpg",
  "Ricuras de la casa/Lomo Empanizado.jpg",
  "PESCADOS Y MARISCOS/Mojarra Frita.jpg",
  "PESCADOS Y MARISCOS/Mojarra a la Marinera.jpg",
  "Ricuras de la casa/Higado Encebollado.jpg",
  "Ricuras de la casa/lenuga en salsa criolla.jpg",
  "Cocteles y cervezas/Cervezas.jpg",
];

describe("photo manifest", () => {
  it.skipIf(!hasInbox)("every source exists under assets-inbox/", () => {
    for (const e of entries)
      expect(fs.existsSync(path.join(root, "assets-inbox", e.source)), e.source).toBe(true);
  });
  it("no source is in the excluded list", () => {
    for (const e of entries) expect(excluded).not.toContain(e.source);
  });
  it("has 40 dish and drink photos, 7 flyers and the logo", () => {
    const n = (g: string) => entries.filter((e) => e.group === g).length;
    expect(n("dishes") + n("drinks")).toBe(40);
    expect(n("specials")).toBe(7);
    expect(n("brand")).toBe(1);
  });
});

describe("photo registry", () => {
  it("is generated from the manifest", () => {
    expect(photos.map((p) => p.id).sort()).toEqual(entries.map((e) => e.id).sort());
  });
  it("ids are unique and well formed", () => {
    const ids = photos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^(dishes|drinks|specials|brand|restaurant)\/[a-z0-9-]+$/);
  });
  it("every file exists, is at most 2400px and matches its stored size", async () => {
    for (const p of photos) {
      const file = path.join(root, "public", p.src);
      expect(fs.existsSync(file), p.src).toBe(true);
      const meta = await sharp(file).metadata();
      expect(meta.width, p.src).toBe(p.width);
      expect(meta.height, p.src).toBe(p.height);
      expect(Math.max(p.width, p.height)).toBeLessThanOrEqual(2400);
    }
  });
  it("has non-empty bilingual alt text; dish alts follow the rule", () => {
    for (const p of photos) {
      expect(p.alt.es.trim()).not.toBe("");
      expect(p.alt.en.trim()).not.toBe("");
    }
    for (const e of entries.filter((x) => x.group === "dishes" || x.group === "drinks")) {
      expect(e.alt.es).toMatch(/ en La Nueva Delicia$/);
      expect(e.alt.en).toMatch(/ at La Nueva Delicia$/);
    }
  });
  it("contains the four home page favorites", () => {
    const ids = photos.map((p) => p.id);
    for (const id of [
      "dishes/bandeja-paisa",
      "dishes/calentado-con-chuleta-y-huevos-al-gusto",
      "dishes/arroz-a-la-marinera",
      "dishes/picada-doble",
    ])
      expect(ids).toContain(id);
  });
});
