import type { CategoryId, L10n, MenuCategory, MenuItem, MenuOption } from "@/types/content";

// Source: assets-inbox/Menus/Food Menu.pdf and drinks menu.pdf (spec 04). Every price was read from the
// rendered PDF pages. Names and descriptions Claude wrote are listed for the owner in docs/content/menu-review.md.
// `image` is the photo id; it must match the photo's `itemId` in scripts/photo-manifest.ts (a unit test checks it).

const t = (es: string, en: string): L10n => ({ es, en });
const opt = (es: string, en: string, price?: number): MenuOption =>
  price === undefined ? { label: t(es, en) } : { label: t(es, en), price };

export const categories: MenuCategory[] = [
  {
    id: "desayunos",
    name: t("Desayunos", "Breakfast"),
    note: t("Solo hasta la 1:00 p.m.", "Served until 1:00 p.m."),
    order: 1,
  },
  { id: "antojitos", name: t("Antojitos", "Appetizers"), order: 2 },
  {
    id: "ricuras",
    name: t("Ricuras de la casa", "House specials"),
    note: t(
      "Todos vienen con arroz, maduro y ensalada verde o fríjoles",
      "All served with rice, sweet plantain and green salad or beans",
    ),
    order: 3,
  },
  { id: "pollo", name: t("Pollo", "Chicken"), order: 4 },
  { id: "mariscos", name: t("Pescados y mariscos", "Fish & seafood"), order: 5 },
  {
    id: "ensaladas",
    name: t("Ensaladas", "Salads"),
    note: t(
      "Base de lechuga mixta, pepino, cebolla, tomate, mango, aguacate y aderezo de la casa",
      "Mixed lettuce, cucumber, onion, tomato, mango, avocado and house dressing",
    ),
    order: 6,
  },
  {
    id: "especiales",
    name: t("Especiales de la semana", "Weekly specials"),
    note: t("Pregunta por nuestro especial alternativo.", "Ask for our alternative special."),
    order: 7,
  },
  { id: "infantil", name: t("Menú infantil", "Kids' menu"), order: 8 },
  { id: "extras", name: t("Órdenes extra", "Sides & extras"), order: 9 },
  { id: "postres", name: t("Postres", "Desserts"), order: 10 },
  { id: "bebidas", name: t("Bebidas y jugos", "Drinks & juices"), order: 11 },
  {
    id: "cocteles",
    name: t("Cócteles", "Cocktails"),
    note: t(
      "Happy hour: lunes a viernes de 12:00 a 7:00 p.m., sábado y domingo de 5:00 a 8:00 p.m. Todos nuestros cócteles a solo $8.",
      "Happy hour: Monday to Friday 12:00 to 7:00 p.m., Saturday and Sunday 5:00 to 8:00 p.m. All our cocktails just $8.",
    ),
    order: 12,
  },
  { id: "cervezas", name: t("Cervezas, vinos y shots", "Beer, wine & shots"), order: 13 },
];

type Row = Omit<MenuItem, "category">;
const inCategory = (category: CategoryId, rows: Row[]): MenuItem[] =>
  rows.map((r) => ({ ...r, category }));
const sub = (subcategory: L10n, rows: Row[]): Row[] => rows.map((r) => ({ ...r, subcategory }));

// Food Menu.pdf page 2
const desayunos: Row[] = [
  {
    id: "calentado-con-chuleta-y-huevos-al-gusto",
    name: t("Calentado con chuleta y huevos al gusto", "Calentado with pork chop and eggs as you like"),
    description: t(
      "Arroz y fríjoles mezclados, chuleta de cerdo a la parrilla y huevos al gusto.",
      "Mixed rice & beans, grilled pork with bone & eggs as you like.",
    ),
    price: 12.99,
    image: "dishes/calentado-con-chuleta-y-huevos-al-gusto",
    featured: true,
    featuredOrder: 2,
  },
  {
    id: "calentado-con-carne-asada-y-huevos-al-gusto",
    name: t("Calentado con carne asada y huevos al gusto", "Calentado with grilled beef and eggs as you like"),
    description: t(
      "Arroz y fríjoles mezclados, carne asada con huevos al gusto.",
      "Mixed rice & beans, grilled beef with eggs as you like.",
    ),
    price: 12.99,
    image: "dishes/calentado-con-carne-asada-y-huevos-al-gusto",
  },
  {
    // Printed line does not mention chicken (spec 04, Q7): kept as printed for owner review.
    id: "calentado-con-pechuga-y-huevos-al-gusto",
    name: t("Calentado con pechuga y huevos al gusto", "Calentado with chicken breast and eggs as you like"),
    description: t("Arroz y fríjoles mezclados, con huevos al gusto.", "Mixed rice & beans, with eggs as you like"),
    price: 12.99,
    image: "dishes/calentado-con-pechuga-y-huevos-al-gusto",
  },
  {
    // Printed line mentions cheese and grilled beef but the name does not (spec 04, Q7).
    id: "calentado-con-huevos-al-gusto",
    name: t("Calentado con huevos al gusto", "Calentado with eggs as you like"),
    description: t(
      "Arroz y fríjoles mezclados, con queso y carne asada.",
      "Mixed rice & beans, with cheese and grilled beef",
    ),
    price: 10.99,
  },
  {
    id: "arepa-con-queso-y-carne-asada",
    name: t("Arepa con queso y carne asada", "Corn cake with cheese and grilled beef"),
    price: 12.99,
    image: "dishes/arepa-con-queso-y-carne-asada",
  },
  {
    id: "carne-guisada-en-salsa-criolla",
    name: t("Carne guisada en salsa criolla", "Top round steak in homemade sauce"),
    description: t(
      "Carne en salsa criolla, arroz y arepita.",
      "Top round steak in homemade sauce, rice & little corn cake",
    ),
    price: 12.99,
    image: "dishes/carne-guisada-en-salsa-criolla",
  },
  {
    id: "huevos-al-gusto-arroz-y-arepita",
    name: t("Huevos al gusto, arroz y arepita", "Eggs as you like, rice & little corn cake"),
    price: 10.99,
  },
  {
    id: "huevos-al-gusto-con-arepa-con-queso",
    name: t("Huevos al gusto con arepa con queso", "Eggs as you like with corn cake with cheese"),
    price: 10.99,
  },
  {
    id: "arepa-asada-con-queso-y-mantequilla",
    name: t("Arepa asada con queso y mantequilla", "Corn cake with cheese and butter"),
    price: 5.99,
  },
  { id: "arepa-asada", name: t("Arepa asada", "Corn cake"), price: 3 },
  {
    id: "caldo-de-costilla",
    name: t("Caldo de costilla", "Rib soup"),
    description: t("Caldo de costilla, arroz y arepita.", "Rib soup, rice and little corn cake"),
    price: 12,
    image: "dishes/caldo-de-costilla",
  },
  {
    id: "consome-de-menudencias",
    name: t("Consomé de menudencias", "Chicken consommé"),
    description: t("Consomé de menudencias, arroz y arepita.", "Chicken consommé, rice and little corn cake"),
    price: 12,
  },
];

// Food Menu.pdf page 2
const antojitos: Row[] = [
  {
    id: "picada-doble",
    name: t("Picada doble", "Double picada platter"),
    price: 65,
    image: "dishes/picada-doble",
    featured: true,
    featuredOrder: 4,
  },
  { id: "picada-sencilla", name: t("Picada sencilla", "Single picada platter"), price: 38 },
  {
    id: "chicharron-con-arepa-con-queso",
    name: t("Chicharrón con arepa con queso", "Fried pork skin with corn cake with cheese"),
    price: 12.99,
    image: "dishes/chicharron-con-arepa-con-queso",
  },
  {
    id: "chicharron-con-arepita",
    name: t("Chicharrón con arepita", "Fried pork skin with little corn cake"),
    price: 10,
  },
  {
    id: "chorizo-con-arepa-con-queso",
    name: t("Chorizo con arepa con queso", "Sausage with corn cake with cheese"),
    price: 12.99,
  },
  {
    id: "chorizo-con-arepita",
    name: t("Chorizo con arepita", "Sausage with little corn cake"),
    price: 10,
    image: "dishes/chorizo-con-arepita",
  },
  {
    id: "costillas-de-cerdo",
    name: t("Costillas de cerdo", "Pork ribs"),
    description: t("Costillas de cerdo con tostones o arepa.", "Pork ribs with green plantain, or corn cake"),
    price: 19,
  },
  { id: "choricriolla", name: t("Choricriolla", "Creole yellow potatoes with sausage"), price: 17 },
  {
    id: "guacamole-con-tostones",
    name: t("Guacamole con tostones", "Guacamole with green plantain"),
    price: 15,
  },
  {
    id: "guacamole-con-tostones-y-chicharron",
    name: t("Guacamole con tostones y chicharrón", "Guacamole with green plantain and fried pork skin"),
    price: 20,
  },
  { id: "combo-empanaditas", name: t("Combo empanaditas", "Little Colombian empanadas"), price: 7.99 },
  {
    id: "maduro-con-queso",
    name: t("Maduro con queso", "Sweet plantain with cheese"),
    price: 6.5,
    image: "dishes/maduro-con-queso",
  },
];

// Food Menu.pdf page 4
const ricuras: Row[] = [
  {
    id: "bandeja-paisa",
    name: t("Bandeja Paisa", "Bandeja Paisa"),
    description: t("Plato colombiano.", "Colombian dish"),
    price: 23,
    image: "dishes/bandeja-paisa",
    featured: true,
    featuredOrder: 1,
  },
  {
    id: "mini-bandeja-paisa",
    name: t("Mini Bandeja Paisa", "Mini Bandeja Paisa"),
    description: t("Sin aguacate.", "No avocado"),
    price: 17,
  },
  { id: "carne-asada-a-la-parrilla", name: t("Carne asada a la parrilla", "Grilled top round steak"), price: 22 },
  { id: "carne-empanizada", name: t("Carne empanizada", "Breaded top round steak"), price: 23 },
  { id: "bistec-encebollado", name: t("Bistec encebollado", "Top round steak with onions on top"), price: 23 },
  {
    id: "bistec-encebollado-a-caballo",
    name: t("Bistec encebollado a caballo", "Top round steak with eggs over & onions on top"),
    price: 24,
  },
  {
    id: "carne-a-la-champinonera",
    name: t("Carne a la champiñonera", "Grilled top round steak in mushroom sauce"),
    price: 27,
  },
  { id: "carne-en-salsa-criolla", name: t("Carne en salsa criolla", "Top flank steak in homemade sauce"), price: 25 },
  {
    id: "churrasco-a-la-parrilla",
    name: t("Churrasco a la parrilla", "Grilled sirloin steak"),
    price: 32,
    image: "dishes/churrasco-a-la-parrilla",
  },
  { id: "entrana", name: t("Entraña", "Skirt steak"), price: 35 },
  { id: "sobrebarriga-a-la-parrilla", name: t("Sobrebarriga a la parrilla", "Grilled top flank steak"), price: 25 },
  {
    id: "sobrebarriga-en-salsa-criolla",
    name: t("Sobrebarriga en salsa criolla", "Top flank steak in homemade sauce"),
    price: 26,
  },
  { id: "higado-a-la-parrilla", name: t("Hígado a la parrilla", "Grilled calf liver"), price: 18 },
  { id: "higado-encebollado", name: t("Hígado encebollado", "Grilled calf liver with onions on top"), price: 19 },
  {
    id: "higado-en-salsa-criolla",
    name: t("Hígado en salsa criolla", "Grilled calf liver in homemade sauce"),
    price: 20,
  },
  {
    id: "chuleton-a-caballo",
    name: t("Chuletón a caballo", "Grilled pork with eggs over, onions on top"),
    price: 22,
    image: "dishes/chuleton-a-caballo",
  },
  {
    id: "chuleta-de-cerdo-a-la-parrilla-o-empanizada",
    name: t("Chuleta de cerdo a la parrilla o empanizada", "Grilled or breaded pork with bone"),
    price: 20,
    options: [opt("A la parrilla", "Grilled"), opt("Empanizada", "Breaded")],
    image: "dishes/chuleta-de-cerdo-a-la-parrilla-o-empanizada",
  },
  {
    id: "lengua-en-salsa-criolla",
    name: t("Lengua en salsa criolla", "Beef tongue in homemade sauce"),
    price: 27,
  },
  {
    id: "lengua-a-la-parrilla",
    name: t("Lengua a la parrilla", "Grilled beef tongue"),
    price: 25,
    image: "dishes/lengua-a-la-parrilla",
  },
  {
    id: "lomo-de-cerdo-a-la-parrilla-o-empanizado",
    name: t("Lomo de cerdo a la parrilla o empanizado", "Grilled or breaded pork loin"),
    price: 21,
    options: [opt("A la parrilla", "Grilled"), opt("Empanizado", "Breaded")],
  },
];

// Food Menu.pdf page 6
const pollo: Row[] = [
  {
    id: "pechuga-a-la-parrilla",
    name: t("Pechuga a la parrilla", "Grilled chicken breast"),
    description: t(
      "Pechuga a la parrilla, ensalada mixta, maduro, arroz y fríjoles.",
      "Grilled chicken breast, mixed salad, sweet plantain, rice and beans",
    ),
    price: 21,
  },
  {
    id: "pechuga-empanizada",
    name: t("Pechuga empanizada", "Breaded chicken breast"),
    description: t(
      "Pechuga empanizada, ensalada mixta, maduro, arroz y fríjoles.",
      "Breaded chicken breast, mixed salad, sweet plantain, rice and beans",
    ),
    price: 23,
  },
  {
    id: "pechuga-a-la-parrilla-en-salsa-con-champinon",
    name: t("Pechuga a la parrilla en salsa con champiñón", "Grilled chicken breast with mushrooms"),
    description: t(
      "Pechuga a la parrilla con champiñones, arroz y maduro.",
      "Grilled chicken breast with mushrooms, rice and sweet plantain",
    ),
    price: 27,
    image: "dishes/pechuga-a-la-parrilla-en-salsa-con-champinon",
  },
  {
    id: "pechuga-hawaiana",
    name: t("Pechuga hawaiana", "Chicken breast in Hawaiian sauce"),
    description: t(
      "Pechuga en salsa hawaiana, arroz y maduro.",
      "Chicken breast in Hawaiian sauce, rice and sweet plantain",
    ),
    price: 27,
    image: "dishes/pechuga-hawaiana",
  },
  {
    id: "arroz-con-pollo",
    name: t("Arroz con pollo", "Mixed rice with chicken"),
    description: t(
      "Arroz mixto con pollo, ensalada mixta, maduro y huevo.",
      "Mixed rice with chicken, mixed salad, sweet plantain and egg",
    ),
    price: 21,
    image: "dishes/arroz-con-pollo",
  },
  {
    id: "espagueti-en-crema-con-pollo",
    name: t("Espagueti en crema con pollo", "Creamy chicken spaghetti"),
    description: t("Espagueti con pollo, arroz y maduro.", "Spaghetti with chicken, rice & sweet plantain"),
    price: 21,
  },
];

// Food Menu.pdf page 5
const mariscos: Row[] = [
  {
    id: "mojarra-frita",
    name: t("Mojarra frita", "Fried red tilapia"),
    description: t("Mojarra roja, arroz, ensalada y tostones.", "Red tilapia, rice, salad & green plantain"),
    price: 27,
  },
  {
    id: "mojarra-a-la-marinera",
    name: t("Mojarra a la marinera", "Red tilapia with seafood chowder"),
    description: t(
      "Crema de mariscos y ensalada sobre mojarra roja frita.",
      "Seafood chowder, salad on fried red tilapia",
    ),
    price: 32,
  },
  {
    id: "mojarra-en-salsa-criolla",
    name: t("Mojarra en salsa criolla", "Red tilapia in homemade sauce"),
    description: t(
      "Mojarra roja en salsa criolla, arroz, ensalada y tostones.",
      "Cooked red tilapia in homemade sauce, rice, salad & green plantain",
    ),
    price: 30,
  },
  {
    id: "filete-de-pescado-a-la-marinera",
    name: t("Filete de pescado a la marinera", "Tilapia fillet with seafood rice"),
    description: t(
      "Filete de tilapia con arroz con mariscos, ensalada y tostones.",
      "Fillet of tilapia with seafood combination rice, salad & green plantain",
    ),
    price: 30,
  },
  {
    id: "filete-de-pescado-en-salsa-de-champinones",
    name: t("Filete de pescado en salsa de champiñones", "Tilapia fillet in mushroom sauce"),
    description: t(
      "Filete de tilapia con champiñones, arroz, ensalada y tostones.",
      "Fillet of tilapia with mushrooms, rice, salad & green plantain",
    ),
    price: 28,
  },
  {
    id: "filete-de-pescado-a-la-parrilla",
    name: t("Filete de pescado a la parrilla", "Grilled tilapia fillet"),
    description: t(
      "Filete de tilapia a la parrilla, arroz, ensalada y tostones.",
      "Grilled fillet of tilapia, rice, salad & green plantain",
    ),
    price: 22,
  },
  {
    id: "filete-de-pescado-empanizado",
    name: t("Filete de pescado empanizado", "Breaded tilapia fillet"),
    description: t(
      "Filete de tilapia empanizado, arroz, ensalada y tostones.",
      "Breaded fillet of tilapia, rice, salad & green plantain",
    ),
    price: 23,
  },
  {
    id: "arroz-con-camarones",
    name: t("Arroz con camarones", "Rice with shrimp"),
    description: t("Arroz con camarones, ensalada y tostones.", "Rice with shrimp, salad & green plantain"),
    price: 22,
  },
  {
    id: "arroz-a-la-marinera",
    name: t("Arroz a la marinera", "Seafood rice"),
    description: t("Arroz con mariscos, ensalada y tostones.", "Seafood rice, salad & green plantain"),
    price: 28,
    image: "dishes/arroz-a-la-marinera",
    featured: true,
    featuredOrder: 3,
  },
  {
    id: "camarones-en-salsa-criolla",
    name: t("Camarones en salsa criolla", "Shrimp in homemade sauce"),
    description: t(
      "Camarones en salsa criolla, arroz, ensalada y tostones.",
      "Shrimp in homemade sauce, rice, salad & green plantain",
    ),
    price: 22,
    image: "dishes/camarones-en-salsa-criolla",
  },
  {
    id: "camarones-empanizados",
    name: t("Camarones empanizados", "Breaded shrimp"),
    description: t(
      "Camarones empanizados, ensalada con arroz y tostones.",
      "Breaded shrimp, salad with rice & green plantain",
    ),
    price: 22,
  },
  {
    id: "ceviche-de-camarones",
    name: t("Ceviche de camarones", "Shrimp ceviche"),
    description: t("Ceviche de camarones, arroz o tostones.", "Shrimp ceviche, rice or green plantain"),
    price: 20,
    image: "dishes/ceviche-de-camarones",
  },
  {
    id: "cazuela-de-mariscos",
    name: t("Cazuela de mariscos", "Seafood casserole"),
    description: t("Combinación de mariscos, arroz y tostones.", "Seafood combination, rice & green plantain"),
    price: 30,
  },
  {
    id: "sopa-marinera",
    name: t("Sopa marinera", "Seafood soup"),
    description: t("Sopa de mariscos, arroz y tostones.", "Seafood soup, rice & green plantain"),
    price: 30,
    image: "dishes/sopa-marinera",
  },
  {
    id: "espagueti-a-la-marinera",
    name: t("Espagueti a la marinera", "Seafood spaghetti"),
    description: t("Espagueti con mariscos y tostones.", "Seafood spaghetti & green plantain"),
    price: 28,
  },
  {
    id: "pechuga-en-salsa-a-la-marinera",
    name: t("Pechuga en salsa a la marinera", "Chicken breast in seafood chowder"),
    description: t(
      "Pechuga en crema de mariscos, arroz y tostones.",
      "Seafood chowder chicken cutlet, rice & green plantain",
    ),
    price: 30,
    image: "dishes/pechuga-en-salsa-a-la-marinera",
  },
  {
    id: "churrasco-a-la-marinera",
    name: t("Churrasco a la marinera", "Sirloin steak with seafood rice"),
    description: t(
      "Churrasco con arroz con mariscos, ensalada y tostones.",
      "Sirloin steak with seafood rice, salad & green plantain",
    ),
    price: 38,
  },
  {
    id: "entrana-a-la-marinera",
    name: t("Entraña a la marinera", "Skirt steak with seafood rice"),
    description: t(
      "Entraña cubierta con arroz con mariscos, ensalada y tostones.",
      "Skirt steak topped with seafood rice, salad & green plantain",
    ),
    price: 43,
    image: "dishes/entrana-a-la-marinera",
  },
];

// Food Menu.pdf page 3
const ensaladas: Row[] = [
  { id: "ensalada-mixta", name: t("Ensalada mixta", "Mixed salad"), price: 11 },
  {
    id: "ensalada-con-pechuga-de-pollo",
    name: t("Ensalada con pechuga de pollo", "Chicken salad"),
    price: 18,
    image: "dishes/ensalada-con-pechuga-de-pollo",
  },
  { id: "ensalada-de-atun", name: t("Ensalada de atún", "Tuna salad"), price: 18 },
  {
    id: "ensalada-con-camarones",
    name: t("Ensalada con camarones", "Shrimp salad"),
    price: 19,
    image: "dishes/ensalada-con-camarones",
  },
];

// Food Menu.pdf page 3. The daily specials themselves are in src/data/specials.ts.
const especiales: Row[] = [
  { id: "sopa-grande-adicional", name: t("Sopa grande adicional", "Additional large soup"), price: 6 },
];

// Food Menu.pdf page 3
const infantil: Row[] = [
  {
    id: "tiritas-de-pollo",
    name: t("Tiritas de pollo", "Chicken strips"),
    description: t("Tiritas de pollo con papas fritas.", "Chicken strips & french fries"),
    price: 13,
  },
  {
    id: "salchipapas",
    name: t("Salchipapas", "Salchipapas"),
    description: t("Papas fritas, salchicha frita y huevo duro.", "French fries, fried sausage & hard-boiled egg"),
    price: 13,
  },
];

// Food Menu.pdf page 6
const extras: Row[] = [
  { id: "tostones", name: t("Tostones", "Fried plantain"), price: 6 },
  { id: "papa-criolla", name: t("Papa criolla", "Creole yellow potatoes"), price: 7 },
  { id: "maduros-fritos", name: t("Maduros fritos", "Fried sweet plantain"), price: 6 },
  { id: "aguacate", name: t("Aguacate", "Avocado"), price: 6 },
  { id: "arepitas", name: t("Arepitas", "Little corn cakes"), price: 5 },
  { id: "frijoles", name: t("Fríjoles", "Beans"), price: 7 },
  { id: "arroz", name: t("Arroz", "Rice"), price: 5 },
  { id: "queso", name: t("Queso", "Cheese"), price: 3 },
  { id: "papitas-fritas", name: t("Papitas fritas", "French fries"), price: 7 },
  {
    id: "cualquier-carne-de-los-especiales",
    name: t("Cualquier carne de los especiales", "Any meat from the special"),
    price: 7,
  },
];

// Food Menu.pdf page 7
const postres: Row[] = [
  {
    id: "mazamorra-con-panela",
    name: t("Mazamorra con panela", "Colombian corn pudding"),
    price: 8,
    options: [opt("Con bocadillo", "With guava paste", 8.5)],
  },
  { id: "ensalada-de-fruta", name: t("Ensalada de fruta", "Fruit salad"), price: 13 },
  {
    id: "arroz-con-leche",
    name: t("Arroz con leche", "Rice pudding"),
    price: 7,
    image: "dishes/arroz-con-leche",
  },
  {
    id: "brevas-con-arequipe-y-queso",
    name: t("Brevas con arequipe y queso", "Figs with arequipe & cheese"),
    price: 10,
  },
  { id: "brownie-con-helado", name: t("Brownie con helado", "Brownie with ice cream"), price: 10 },
  { id: "flan-con-caramelo", name: t("Flan con caramelo", "Flan with caramel"), price: 7 },
];

// Food Menu.pdf page 7
const hotCold = t("Bebidas calientes y frías", "Hot & cold drinks");
const juices = t("Jugos naturales", "Fresh juices");
const bebidas: Row[] = [
  ...sub(hotCold, [
    {
      id: "chocolate-con-queso",
      name: t("Chocolate con queso", "Chocolate with cheese"),
      price: 8,
      image: "drinks/chocolate-con-queso",
    },
    { id: "milo-y-queso", name: t("Milo y queso", "Milo & cheese"), price: 7 },
    { id: "aguapanela-con-queso", name: t("Aguapanela con queso", "Aguapanela with cheese"), price: 7 },
    { id: "te", name: t("Té", "Tea"), price: 2 },
    { id: "milo", name: t("Milo", "Milo"), price: 6, image: "drinks/milo" },
    { id: "chocolate", name: t("Chocolate", "Chocolate"), price: 7 },
    { id: "cafe", name: t("Café", "Coffee"), price: 2, image: "drinks/cafe" },
    { id: "soda", name: t("Soda", "Soda"), price: 2.5 },
    { id: "soda-postobon", name: t("Soda Postobón", "Postobón soda"), price: 3.5 },
    { id: "pony-malta", name: t("Pony Malta", "Pony Malta"), price: 3.5 },
    { id: "botella-de-agua", name: t("Botella de agua", "Water bottle"), price: 2 },
    { id: "aguapanela-con-limon", name: t("Aguapanela con limón", "Aguapanela with lemon"), price: 5 },
    { id: "limonada-natural", name: t("Limonada natural", "Natural lemonade"), price: 5 },
  ]),
  ...sub(juices, [
    {
      // Unpriced options are flavors; priced options are the milk/water choice.
      id: "jugos-naturales",
      name: t("Jugos naturales", "Fresh juices"),
      options: [
        opt("Papaya-guanábana", "Papaya-soursop"),
        opt("Mango-guayaba", "Mango-guava"),
        opt("Banano-lulo", "Banana-lulo"),
        opt("Mora-maracuyá", "Blackberry-passion fruit"),
        opt("Piña-tomate de árbol", "Pineapple-tree tomato"),
        opt("En leche", "In milk", 7),
        opt("En agua", "In water", 6),
      ],
    },
  ]),
];

// drinks menu.pdf page 2
const cocteles: Row[] = [
  {
    id: "margarita",
    name: t("Margarita", "Margarita"),
    price: 13,
    options: [
      opt("Mango", "Mango"),
      opt("Mora", "Blackberry"),
      opt("Coco", "Coconut"),
      opt("Maracuyá", "Passion fruit"),
      opt("Tradicional", "Traditional"),
      opt("Tamarindo", "Tamarind"),
    ],
    image: "drinks/margarita",
  },
  {
    id: "mojito",
    name: t("Mojito", "Mojito"),
    price: 13,
    options: [
      opt("Mango", "Mango"),
      opt("Maracuyá", "Passion fruit"),
      opt("Coco", "Coconut"),
      opt("Tradicional", "Traditional"),
    ],
    image: "drinks/mojito",
  },
  { id: "pina-colada", name: t("Piña colada", "Piña colada"), price: 13, image: "drinks/pina-colada" },
  { id: "pina-colada-virgen", name: t("Piña colada virgen", "Virgin piña colada"), price: 9 },
  {
    id: "expresso-martini",
    name: t("Expresso Martini", "Espresso Martini"),
    price: 13,
    image: "drinks/expresso-martini",
  },
  { id: "alexander", name: t("Alexander", "Alexander"), price: 13, image: "drinks/alexander" },
  { id: "q-delicia", name: t("Q' Delicia", "Q' Delicia"), price: 13, image: "drinks/q-delicia" },
];

// drinks menu.pdf page 2
const beer = t("Cervezas", "Beer");
const wine = t("Vinos", "Wine");
const shots = t("Shots", "Shots");
const cervezas: Row[] = [
  ...sub(beer, [
    { id: "corona", name: t("Corona", "Corona"), price: 5 },
    { id: "modelo-especial", name: t("Modelo Especial", "Modelo Especial"), price: 5 },
    { id: "aguila", name: t("Águila", "Águila"), price: 6 },
    { id: "heineken", name: t("Heineken", "Heineken"), price: 5 },
    { id: "club-colombia", name: t("Club Colombia", "Club Colombia"), price: 6 },
    { id: "cola-y-pola", name: t("Cola y pola", "Cola y pola"), price: 4 },
    { id: "michelada-colombiana", name: t("Michelada colombiana", "Colombian michelada"), price: 7.5 },
    { id: "cerveza-michelada", name: t("Cerveza michelada", "Michelada beer"), price: 6.5 },
    { id: "jarra-de-refajo", name: t("Jarra de refajo", "Pitcher of refajo"), price: 17 },
    {
      id: "jarra-de-refajo-envenenado",
      name: t("Jarra de refajo envenenado", "Pitcher of spiked refajo"),
      price: 23,
      image: "drinks/jarra-de-refajo-envenenado",
    },
  ]),
  ...sub(wine, [
    {
      id: "jarra-de-sangria",
      name: t("Jarra de sangría", "Pitcher of sangria"),
      price: 31,
      image: "drinks/jarra-de-sangria",
    },
    { id: "botella-de-vino-tinto", name: t("Botella de vino tinto", "Bottle of red wine"), price: 26 },
    { id: "copa-de-vino-tinto", name: t("Copa de vino tinto", "Glass of red wine"), price: 6 },
    { id: "copa-de-vino-blanco", name: t("Copa de vino blanco", "Glass of white wine"), price: 6 },
    { id: "copa-de-sangria", name: t("Copa de sangría", "Glass of sangria"), price: 11 },
  ]),
  ...sub(shots, [
    { id: "shot-de-guaro", name: t("Shot de guaro", "Aguardiente (guaro) shot"), price: 5 },
    { id: "shot-de-guaro-amarillo", name: t("Shot de guaro amarillo", "Yellow aguardiente shot"), price: 6 },
    { id: "shot-de-tequila", name: t("Shot de tequila", "Tequila shot"), price: 6 },
    { id: "shot-de-casamigos", name: t("Shot de Casamigos", "Casamigos shot"), price: 7 },
    { id: "shot-de-patron-silver", name: t("Shot de Patrón Silver", "Patrón Silver shot"), price: 7 },
    { id: "shot-don-julio-1942", name: t("Shot Don Julio 1942", "Don Julio 1942 shot"), price: 28 },
    { id: "shot-don-julio-70", name: t("Shot Don Julio 70", "Don Julio 70 shot"), price: 12 },
    { id: "shot-de-patron-cielo", name: t("Shot de Patrón Cielo", "Patrón Cielo shot"), price: 9 },
    {
      id: "shot-de-whiskey-johnnie-walker-black",
      name: t("Shot de whiskey Johnnie Walker Black", "Johnnie Walker Black whiskey shot"),
      price: 9,
    },
    {
      id: "shot-de-whiskey-buchanans-deluxe",
      name: t("Shot de whiskey Buchanan's Deluxe", "Buchanan's Deluxe whiskey shot"),
      price: 9,
    },
    { id: "shot-double-black", name: t("Shot Double Black", "Double Black shot"), price: 13 },
  ]),
];

export const menuItems: MenuItem[] = [
  ...inCategory("desayunos", desayunos),
  ...inCategory("antojitos", antojitos),
  ...inCategory("ricuras", ricuras),
  ...inCategory("pollo", pollo),
  ...inCategory("mariscos", mariscos),
  ...inCategory("ensaladas", ensaladas),
  ...inCategory("especiales", especiales),
  ...inCategory("infantil", infantil),
  ...inCategory("extras", extras),
  ...inCategory("postres", postres),
  ...inCategory("bebidas", bebidas),
  ...inCategory("cocteles", cocteles),
  ...inCategory("cervezas", cervezas),
];
