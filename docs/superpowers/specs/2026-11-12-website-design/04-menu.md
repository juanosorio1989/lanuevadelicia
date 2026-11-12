# 04. Menu

The source of truth is `assets-inbox/Menus/Food Menu.pdf` and `assets-inbox/Menus/drinks menu.pdf`. The text
extracts in `reference/` help transcription, but their two-column layout is scrambled in places (for example the
Antojitos prices for the guacamole items). **Check every price against the PDF pages visually.**

## Categories (approved order and chip labels)

| # | id | ES label | EN label | Note line (ES / EN) |
|---|----|----------|----------|---------------------|
| 1 | `desayunos` | Desayunos | Breakfast | Solo hasta la 1:00 p.m. / Served until 1:00 p.m. |
| 2 | `antojitos` | Antojitos | Appetizers | — |
| 3 | `ricuras` | Ricuras de la casa | House specials | Todos vienen con arroz, maduro y ensalada verde o fríjoles / All served with rice, sweet plantain and green salad or beans |
| 4 | `pollo` | Pollo | Chicken | — |
| 5 | `mariscos` | Pescados y mariscos | Fish & seafood | — |
| 6 | `ensaladas` | Ensaladas | Salads | Base de lechuga mixta, pepino, cebolla, tomate, mango, aguacate y aderezo de la casa / Mixed lettuce, cucumber, onion, tomato, mango, avocado and house dressing |
| 7 | `especiales` | Especiales de la semana | Weekly specials | links to the specials page; also lists "Sopa grande adicional $6" |
| 8 | `infantil` | Menú infantil | Kids' menu | — |
| 9 | `extras` | Órdenes extra | Sides & extras | — |
| 10 | `postres` | Postres | Desserts | — |
| 11 | `bebidas` | Bebidas y jugos | Drinks & juices | Subsections: Bebidas calientes y frías, Jugos naturales |
| 12 | `cocteles` | Cócteles | Cocktails | Happy hour line |
| 13 | `cervezas` | Cervezas, vinos y shots | Beer, wine & shots | Subsections: Cervezas, Vinos, Shots |

The breakfast items on the printed menu include "Caldo de costilla" and "Consomé de menudencias" (listed under
Desayunos). Keep them there.

## Item data rules

- `nameEs` is the name as printed (in sentence case, accents fixed: "Calentado con chuleta y huevos al gusto").
  `nameEn` is a short English name. Keep well-known Colombian names untranslated ("Bandeja Paisa", "Ajiaco") and add
  the English description.
- `descriptionEn` comes from the printed English line, **with the spelling fixed** ("tounge" → "tongue", "beed" →
  "beef", "soupe" → "soup", "onios" → "onions", "ar breaded" → "or breaded", "bain" → "beans", "Ask far" → "Ask
  for", "seafoodrice" → "seafood rice", "chower" → "chowder").
- `descriptionEs` is Claude's faithful Spanish rendering of the English line, adding no ingredients. Items with no
  printed description get none.
- **Known inconsistency to preserve or flag, not fix:** "Calentado pechuga con huevos al gusto" says "with eggs as you
  like" without mentioning chicken, and "Calentado con huevos al gusto" says "w/ cheese and grilled beef". Use the
  printed lines (spelling fixed) and list these for owner review (Q7).
- Prices are numbers in USD. Some items have options with their own prices (for example juices: "en leche $7 / en agua
  $6"; Chuleta "a la parrilla o empanizada" has one price). Model both.
- Flavors (margaritas: mango, mora, coco, maracuyá, tradicional, tamarindo; mojitos: mango, maracuyá, coco,
  tradicional; juices: papaya-guanábana, mango-guayaba, banano-lulo, mora-maracuyá, piña-tomate de árbol) are option
  lists, not separate items.
- `featured: true` for exactly: Bandeja Paisa, Calentado con chuleta y huevos al gusto, Arroz a la marinera, Picada
  doble (homepage order).
- `image` points to an approved photo id ([06-photos.md](06-photos.md)) or is empty.
- Allergen and dietary info: none in the MVP (nothing verified). Keep the field optional.
- `available` is a boolean (default true), so an item can be hidden without being deleted.

## Weekly specials data

Prices from the printed menu. The dish text comes from the flyers (they are more detailed than the printed menu).
Alternative specials have no price on any source, so show them without a price, with the printed note "el precio
puede cambiar según la elección de la carne".

| Day | Main (flyer) | Alternative (flyer) | Price |
|-----|--------------|---------------------|-------|
| Lunes | Sopa de cebada con pollo al horno | — | $13 |
| Martes | Ajiaco con arroz con pollo | — | $13 |
| Miércoles | Sopa de lentejas con carne molida | — | $13 |
| Jueves | Mondongo con chuleta de cerdo | Sancocho de pescado con mojarra frita | $13 |
| Viernes | Cazuela de mariscos con patacones y arroz | Sopa de vegetales con filete de pescado | $15 |
| Sábado | Sancocho de gallina con gallina guisada | — | $15 |
| Domingo | Cazuela de fríjoles con pezuña, acompañada con chicharrón | — | $15 |

The printed menu also says: "Pregunta por nuestro especial alternativo", "Sopa grande adicional $6", and "Cualquier
carne de los especiales $7" (in Órdenes extra).
