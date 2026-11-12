import type { L10n, Photo, PhotoId } from "../src/types/content";
import { menuItems } from "../src/data/menu";

/** One approved photo. `source` is relative to `assets-inbox/`. */
export interface ManifestEntry {
  source: string;
  id: PhotoId;
  group: Photo["group"];
  itemId?: string;
  alt: L10n;
}

/** ASCII kebab-case slug: accents stripped, n-tilde becomes n. */
export function slug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A dish or drink photo of one menu item. The photo id is `<group>/<itemId>` and the alt text is derived from the
 * item's name in src/data/menu.ts (spec 06), so the menu is the single source for names. The item's `image` must
 * point back to this id (tests/unit/menu-content.test.ts checks both sides).
 */
function item(group: "dishes" | "drinks", source: string, itemId: string): ManifestEntry {
  const m = menuItems.find((i) => i.id === itemId);
  if (!m) throw new Error(`photo-manifest: no menu item "${itemId}" for ${source}`);
  return {
    source,
    id: `${group}/${itemId}`,
    group,
    itemId,
    alt: { es: `${m.name.es} en La Nueva Delicia`, en: `${m.name.en} at La Nueva Delicia` },
  };
}

/** A bar photo that is not a single menu item. */
function bar(source: string, id: string, es: string, en: string): ManifestEntry {
  return {
    source,
    id: `drinks/${id}`,
    group: "drinks",
    alt: { es: `${es} en La Nueva Delicia`, en: `${en} at La Nueva Delicia` },
  };
}

function flyer(day: string, es: string, en: string, esDay: string, enDay: string, file: string): ManifestEntry {
  return {
    source: `especiales de la semana/${file}`,
    id: `specials/${day}`,
    group: "specials",
    alt: { es: `Especial ${esDay}: ${es}`, en: `${enDay} special: ${en}` },
  };
}

export const entries: ManifestEntry[] = [
  // ANTOJITOS
  item("dishes", "ANTOJITOS/Chicharron con arepa con queso.jpg", "chicharron-con-arepa-con-queso"),
  item("dishes", "ANTOJITOS/Chorizo con arepita.jpg", "chorizo-con-arepita"),
  item("dishes", "ANTOJITOS/Maduro con queso.jpg", "maduro-con-queso"),
  item("dishes", "ANTOJITOS/Picada Doble.jpg", "picada-doble"),
  // BEBIDAS
  item("drinks", "BEBIDAS/cafe.jpg", "cafe"),
  item("drinks", "BEBIDAS/Chocolate con queso.jpg", "chocolate-con-queso"),
  item("drinks", "BEBIDAS/MILO.jpg", "milo"),
  // Cocteles y cervezas
  item("drinks", "Cocteles y cervezas/Alexander.jpg", "alexander"),
  bar("Cocteles y cervezas/Cervezas1.jpg", "cervezas", "Cervezas", "Beers"),
  item("drinks", "Cocteles y cervezas/Expresso Martini.jpg", "expresso-martini"),
  item("drinks", "Cocteles y cervezas/Jarra de refajo Envenenado.jpg", "jarra-de-refajo-envenenado"),
  item("drinks", "Cocteles y cervezas/Jarra de sangria.jpg", "jarra-de-sangria"),
  item("drinks", "Cocteles y cervezas/Margarita.jpg", "margarita"),
  bar("Cocteles y cervezas/Margaritas.jpg", "margaritas", "Margaritas", "Margaritas"),
  item("drinks", "Cocteles y cervezas/Mojito.jpg", "mojito"),
  item("drinks", "Cocteles y cervezas/Pina Colada.jpg", "pina-colada"),
  item("drinks", "Cocteles y cervezas/Q delicia.jpg", "q-delicia"),
  // Desayunos
  item("dishes", "Desayunos/Arepacon queso y Carne Asada.JPG", "arepa-con-queso-y-carne-asada"),
  item("dishes", "Desayunos/Caldo de Costilla.JPG", "caldo-de-costilla"),
  item("dishes", "Desayunos/Calentado con carne asada y huevos al gusto.jpg", "calentado-con-carne-asada-y-huevos-al-gusto"),
  item("dishes", "Desayunos/Calentado con chuleta y huevos al gusto.jpg", "calentado-con-chuleta-y-huevos-al-gusto"),
  item("dishes", "Desayunos/Calentado con pechuga y huevos al gusto.jpg", "calentado-con-pechuga-y-huevos-al-gusto"),
  item("dishes", "Desayunos/Carne Guisada en salsa criolla.JPG", "carne-guisada-en-salsa-criolla"),
  // Ensaladas
  item("dishes", "Ensaladas/ensalada con Camrones.JPG", "ensalada-con-camarones"),
  item("dishes", "Ensaladas/Ensalada con pechuga de Pollo.JPG", "ensalada-con-pechuga-de-pollo"),
  // PESCADOS Y MARISCOS
  item("dishes", "PESCADOS Y MARISCOS/Arroz a la Marinera.JPG", "arroz-a-la-marinera"),
  item("dishes", "PESCADOS Y MARISCOS/camarones en salsa Criolla.JPG", "camarones-en-salsa-criolla"),
  item("dishes", "PESCADOS Y MARISCOS/Ceviche de Camarones.jpg", "ceviche-de-camarones"),
  item("dishes", "PESCADOS Y MARISCOS/Entrana a la Marinera.jpg", "entrana-a-la-marinera"),
  item("dishes", "PESCADOS Y MARISCOS/pechuga en salsa Marinera.jpg", "pechuga-en-salsa-a-la-marinera"),
  item("dishes", "PESCADOS Y MARISCOS/Sopa Marinera.jpg", "sopa-marinera"),
  // POLLO
  item("dishes", "POLLO/Arroz con pollo.jpg", "arroz-con-pollo"),
  item("dishes", "POLLO/Pechuga en Champinones.JPG", "pechuga-a-la-parrilla-en-salsa-con-champinon"),
  item("dishes", "POLLO/Pechuga Hawaiana.jpg", "pechuga-hawaiana"),
  // POSTRES
  item("dishes", "POSTRES/Arroz con leche.jpg", "arroz-con-leche"),
  // Ricuras de la casa
  item("dishes", "Ricuras de la casa/Bandeja Paisa.jpg", "bandeja-paisa"),
  item("dishes", "Ricuras de la casa/Chuleta de cerdo a la parrilla.JPG", "chuleta-de-cerdo-a-la-parrilla-o-empanizada"),
  item("dishes", "Ricuras de la casa/Chuleton a Caballo.jpg", "chuleton-a-caballo"),
  item("dishes", "Ricuras de la casa/Churrasco a la Parrilla.jpg", "churrasco-a-la-parrilla"),
  item("dishes", "Ricuras de la casa/Lengua a la Parrilla.jpg", "lengua-a-la-parrilla"),
  // Weekly specials flyers (text baked in)
  flyer("lunes", "Sopa de cebada con pollo al horno", "Barley soup with oven-baked chicken", "lunes", "Monday", "lunes.jpg"),
  flyer("martes", "Ajiaco con arroz con pollo", "Ajiaco with chicken and rice", "martes", "Tuesday", "Martes.jpg"),
  flyer("miercoles", "Sopa de lentejas con carne molida", "Lentil soup with ground beef", "miércoles", "Wednesday", "Miercoles.jpg"),
  flyer("jueves", "Mondongo con chuleta de cerdo, o sancocho de pescado con mojarra frita", "Tripe soup with pork chop, or fish sancocho with fried tilapia", "jueves", "Thursday", "jueves.jpg"),
  flyer("viernes", "Cazuela de mariscos con patacones y arroz, o sopa de vegetales con filete de pescado", "Seafood casserole with patacones and rice, or vegetable soup with fish fillet", "viernes", "Friday", "Viernes.jpg"),
  flyer("sabado", "Sancocho de gallina con gallina guisada", "Hen sancocho with stewed hen", "sábado", "Saturday", "Sabado.jpg"),
  flyer("domingo", "Cazuela de fríjoles con pezuña, acompañada con chicharrón", "Bean casserole with pig's foot, served with fried pork skin", "domingo", "Sunday", "Domingo.jpg"),
  // Logo (white on transparent: dark backgrounds only)
  {
    source: "logo.png",
    id: "brand/logo",
    group: "brand",
    alt: { es: "Logo de La Nueva Delicia", en: "La Nueva Delicia logo" },
  },
];
