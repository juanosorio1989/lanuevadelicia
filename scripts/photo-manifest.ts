import type { L10n, Photo, PhotoId } from "../src/types/content";

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

/** A dish or drink that is one menu item: id and itemId come from the Spanish name. */
function item(group: "dishes" | "drinks", source: string, es: string, en: string): ManifestEntry {
  const s = slug(es);
  return {
    source,
    id: `${group}/${s}`,
    group,
    itemId: s,
    alt: { es: `${es} en La Nueva Delicia`, en: `${en} at La Nueva Delicia` },
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
  item("dishes", "ANTOJITOS/Chicharron con arepa con queso.jpg", "Chicharrón con arepa con queso", "Fried pork skin with cheese corn cake"),
  item("dishes", "ANTOJITOS/Chorizo con arepita.jpg", "Chorizo con arepita", "Sausage with little corn cake"),
  item("dishes", "ANTOJITOS/Maduro con queso.jpg", "Maduro con queso", "Sweet plantain with cheese"),
  item("dishes", "ANTOJITOS/Picada Doble.jpg", "Picada doble", "Double picada platter"),
  // BEBIDAS
  item("drinks", "BEBIDAS/cafe.jpg", "Café", "Coffee"),
  item("drinks", "BEBIDAS/Chocolate con queso.jpg", "Chocolate con queso", "Chocolate with cheese"),
  item("drinks", "BEBIDAS/MILO.jpg", "Milo", "Milo"),
  // Cocteles y cervezas
  item("drinks", "Cocteles y cervezas/Alexander.jpg", "Alexander", "Alexander"),
  bar("Cocteles y cervezas/Cervezas1.jpg", "cervezas", "Cervezas", "Beers"),
  item("drinks", "Cocteles y cervezas/Expresso Martini.jpg", "Expresso Martini", "Espresso Martini"),
  item("drinks", "Cocteles y cervezas/Jarra de refajo Envenenado.jpg", "Jarra de refajo envenenado", "Pitcher of poisoned refajo"),
  item("drinks", "Cocteles y cervezas/Jarra de sangria.jpg", "Jarra de sangría", "Pitcher of sangria"),
  item("drinks", "Cocteles y cervezas/Margarita.jpg", "Margarita", "Margarita"),
  bar("Cocteles y cervezas/Margaritas.jpg", "margaritas", "Margaritas", "Margaritas"),
  item("drinks", "Cocteles y cervezas/Mojito.jpg", "Mojito", "Mojito"),
  item("drinks", "Cocteles y cervezas/Pina Colada.jpg", "Piña colada", "Piña colada"),
  item("drinks", "Cocteles y cervezas/Q delicia.jpg", "Q' Delicia", "Q' Delicia"),
  // Desayunos
  item("dishes", "Desayunos/Arepacon queso y Carne Asada.JPG", "Arepa con queso y carne asada", "Corn cake with cheese and grilled beef"),
  item("dishes", "Desayunos/Caldo de Costilla.JPG", "Caldo de costilla", "Rib soup"),
  item("dishes", "Desayunos/Calentado con carne asada y huevos al gusto.jpg", "Calentado con carne asada y huevos al gusto", "Calentado with grilled beef and eggs as you like"),
  item("dishes", "Desayunos/Calentado con chuleta y huevos al gusto.jpg", "Calentado con chuleta y huevos al gusto", "Calentado with pork chop and eggs as you like"),
  item("dishes", "Desayunos/Calentado con pechuga y huevos al gusto.jpg", "Calentado pechuga con huevos al gusto", "Calentado with chicken breast and eggs as you like"),
  item("dishes", "Desayunos/Carne Guisada en salsa criolla.JPG", "Carne guisada en salsa criolla", "Beef stew in creole sauce"),
  // Ensaladas
  item("dishes", "Ensaladas/ensalada con Camrones.JPG", "Ensalada con camarones", "Shrimp salad"),
  item("dishes", "Ensaladas/Ensalada con pechuga de Pollo.JPG", "Ensalada con pechuga de pollo", "Chicken salad"),
  // PESCADOS Y MARISCOS
  item("dishes", "PESCADOS Y MARISCOS/Arroz a la Marinera.JPG", "Arroz a la marinera", "Seafood rice"),
  item("dishes", "PESCADOS Y MARISCOS/camarones en salsa Criolla.JPG", "Camarones en salsa criolla", "Shrimp in creole sauce"),
  item("dishes", "PESCADOS Y MARISCOS/Ceviche de Camarones.jpg", "Ceviche de camarones", "Shrimp ceviche"),
  item("dishes", "PESCADOS Y MARISCOS/Entrana a la Marinera.jpg", "Entraña a la marinera", "Skirt steak with seafood sauce"),
  item("dishes", "PESCADOS Y MARISCOS/pechuga en salsa Marinera.jpg", "Pechuga en salsa a la marinera", "Chicken breast in seafood sauce"),
  item("dishes", "PESCADOS Y MARISCOS/Sopa Marinera.jpg", "Sopa marinera", "Seafood soup"),
  // POLLO
  item("dishes", "POLLO/Arroz con pollo.jpg", "Arroz con pollo", "Rice with chicken"),
  item("dishes", "POLLO/Pechuga en Champinones.JPG", "Pechuga a la parrilla en salsa con champiñón", "Grilled chicken breast with mushroom sauce"),
  item("dishes", "POLLO/Pechuga Hawaiana.jpg", "Pechuga hawaiana", "Hawaiian chicken breast"),
  // POSTRES
  item("dishes", "POSTRES/Arroz con leche.jpg", "Arroz con leche", "Rice pudding"),
  // Ricuras de la casa
  item("dishes", "Ricuras de la casa/Bandeja Paisa.jpg", "Bandeja Paisa", "Bandeja Paisa"),
  item("dishes", "Ricuras de la casa/Chuleta de cerdo a la parrilla.JPG", "Chuleta de cerdo a la parrilla", "Grilled pork chop"),
  item("dishes", "Ricuras de la casa/Chuleton a Caballo.jpg", "Chuletón a caballo", "Pork chop topped with eggs"),
  item("dishes", "Ricuras de la casa/Churrasco a la Parrilla.jpg", "Churrasco a la parrilla", "Grilled sirloin steak"),
  item("dishes", "Ricuras de la casa/Lengua a la Parrilla.jpg", "Lengua a la parrilla", "Grilled beef tongue"),
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
