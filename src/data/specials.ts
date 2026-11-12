import type { SpecialDay } from "@/types/content";

// Spec 04 "Weekly specials data": dish text from the flyers, prices from the printed menu (Food Menu.pdf page 3).
// Alternatives have no printed price; the page shows them with the note "el precio puede cambiar según la
// elección de la carne". English text is Claude's (owner check: docs/content/menu-review.md).
export const specials: SpecialDay[] = [
  {
    day: 1,
    main: { es: "Sopa de cebada con pollo al horno", en: "Barley soup with oven-baked chicken" },
    price: 13,
    flyer: "specials/lunes",
  },
  {
    day: 2,
    main: { es: "Ajiaco con arroz con pollo", en: "Ajiaco with chicken and rice" },
    price: 13,
    flyer: "specials/martes",
  },
  {
    day: 3,
    main: { es: "Sopa de lentejas con carne molida", en: "Lentil soup with ground beef" },
    price: 13,
    flyer: "specials/miercoles",
  },
  {
    day: 4,
    main: { es: "Mondongo con chuleta de cerdo", en: "Tripe soup with pork chop" },
    alternative: { es: "Sancocho de pescado con mojarra frita", en: "Fish sancocho with fried tilapia" },
    price: 13,
    flyer: "specials/jueves",
  },
  {
    day: 5,
    main: { es: "Cazuela de mariscos con patacones y arroz", en: "Seafood casserole with patacones and rice" },
    alternative: { es: "Sopa de vegetales con filete de pescado", en: "Vegetable soup with fish fillet" },
    price: 15,
    flyer: "specials/viernes",
  },
  {
    day: 6,
    main: { es: "Sancocho de gallina con gallina guisada", en: "Hen sancocho with stewed hen" },
    price: 15,
    flyer: "specials/sabado",
  },
  {
    day: 7,
    main: {
      es: "Cazuela de fríjoles con pezuña, acompañada con chicharrón",
      en: "Bean casserole with pig's foot, served with fried pork skin",
    },
    price: 15,
    flyer: "specials/domingo",
  },
];
