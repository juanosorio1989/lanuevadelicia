# Menu descriptions from Uber Eats (2026-11-17)

## Why

102 of 138 menu items have no description. The owner pointed at the restaurant's Uber Eats store as the source and
asked to fill only the items that have none (existing descriptions stay as they are).

## What the source gives

The Uber Eats store menu (read 2026-11-17 through the browser; raw copy in `assets-inbox/ubereats-menu-2026-11-17.md`,
not committed) has 80 items, English only. For most meats and appetizers the Uber text is the printed English line the
site already uses as the item's **English name** ("Grilled sirloin steak"), so as a description it would repeat the
name. It adds real information only for sides, desserts and a few drinks. Uber Eats prices differ from the printed
menu and are not used. Some Uber lines are wrong (mojarra as "crappie", avocado listed twice in the bandeja paisa);
those items already have descriptions and are untouched.

## Decision

Fill these 12 items with a short description in both languages, written from the Uber text in the style of the
existing ones (sentence, final period). Nothing else in `menu.ts` changes.

| id | es | en |
|----|----|----|
| `tostones` | Rodajas de plátano verde fritas y crocantes. | Crispy fried green plantain slices. |
| `papa-criolla` | Papitas amarillas criollas, un acompañamiento clásico colombiano. | Small yellow potatoes, a classic Colombian side. |
| `maduros-fritos` | Plátano maduro frito, dorado por fuera y suave por dentro. | Ripe plantain, fried golden outside and tender inside. |
| `arepitas` | Arepitas de maíz crocantes. | Crispy little corn cakes. |
| `frijoles` | Fríjoles al estilo tradicional. | Traditional-style beans. |
| `mazamorra-con-panela` | Postre tradicional colombiano de maíz con panela. | Traditional Colombian corn pudding sweetened with panela (cane sugar). |
| `ensalada-de-fruta` | Mezcla de frutas frescas de temporada. | A mix of fresh seasonal fruit. |
| `arroz-con-leche` | Postre cremoso de arroz cocido en leche. | Creamy rice cooked in milk. |
| `flan-con-caramelo` | Flan cremoso bañado en caramelo. | Creamy custard topped with caramel. |
| `aguapanela-con-limon` | Bebida de panela, dulce y refrescante, con limón. | Sweet, refreshing cane-sugar drink with a squeeze of lemon. |
| `chocolate` | Chocolate caliente, espeso y suave. | Rich, smooth hot chocolate. |
| `soda-postobon` | Gaseosa colombiana de sabores dulces y frutales. | Colombian soda with sweet, fruity flavors. |

## Non-goals

- No change to names, prices, options or the 36 existing descriptions (Q7 calentado lines stay as printed; Uber says
  the chicken calentado has grilled chicken cutlet — noted for the owner).
- No invented descriptions for items the source does not cover (cocktails, beers, wines, shots, combo empanaditas,
  maduro con queso, choricriolla, chuletón a caballo, brevas, brownie, drinks with cheese): they go to the owner as a
  question.
- Obvious items stay without description (water, soda, coffee, tea, rice, avocado, cheese, fries).

## Owner review

`docs/content/menu-review.md` gets a section "Descriptions from Uber Eats (2026-11-17)" with the 12 rows, the Q7 note,
and the list of items still without a description that the owner may want to describe.
