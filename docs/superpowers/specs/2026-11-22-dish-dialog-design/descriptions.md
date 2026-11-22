# Food descriptions (2026-11-22)

Owner request: fill the missing descriptions of food items. Drinks, beers, wines, shots and cocktails wait (the
dessert `baileys-brownie-martini` waits with them). Extras (`aguacate`, `arroz`, `queso`, `papitas-fritas`,
`cualquier-carne-de-los-especiales`) and `sopa-grande-adicional` stay without one.

Sources:
- Picada, empanaditas and choricriolla: the owner, in chat, 2026-11-22.
- Bandeja paisa: the Uber Eats line (duplicated avocado removed), plus chorizo and the mini's difference from the
  owner, 2026-11-22.
- Everything else: short flavor lines written by Claude, at the owner's request ("descripciones cortas de sabores").
  They describe only what the dish name already says, plus taste words. Owner check:
  `docs/content/menu-review.md`.

Style: one sentence, final period, both languages. Existing descriptions stay as they are, except `bandeja-paisa`
and `mini-bandeja-paisa`, which are replaced.

## Category notes in the dish dialog

The dish dialog shows the item's category note (when its category has one) under the description, in
`text-sm text-muted-600`. This gives the ricuras their sides ("Todos vienen con arroz, maduro y ensalada verde o
fríjoles"), the salads their base, and breakfast its hours, without repeating them in every item.

## Texts

| id | es | en |
|----|----|----|
| `bandeja-paisa` | Carne asada o molida, chorizo, chicharrón, huevo, arroz, fríjoles, aguacate, maduro y arepa. | Grilled or ground beef, sausage, fried pork skin, egg, rice, beans, avocado, sweet plantain and corn cake. |
| `mini-bandeja-paisa` | Lo mismo que la bandeja paisa, con porciones de carne más pequeñas y sin aguacate. | Same as the bandeja paisa, with smaller portions of meat and no avocado. |
| `arepa-con-queso-y-carne-asada` | Arepa con queso derretido y carne asada jugosa. | Corn cake with melted cheese and juicy grilled beef. |
| `huevos-al-gusto-arroz-y-arepita` | Huevos a tu gusto con arroz y una arepita crocante. | Eggs your way with rice and a crispy little corn cake. |
| `huevos-al-gusto-con-arepa-con-queso` | Huevos a tu gusto con arepa y queso derretido. | Eggs your way with a corn cake and melted cheese. |
| `arepa-asada-con-queso-y-mantequilla` | Arepa asada y dorada, con mantequilla y queso derretido. | Golden toasted corn cake with butter and melted cheese. |
| `arepa-asada` | Arepa de maíz asada, dorada por fuera y suave por dentro. | Toasted corn cake, golden outside and soft inside. |
| `picada-doble` | Para compartir: carne, chorizo, chicharrón, pechuga apanada, chuleta de cerdo con hueso, morcilla, costillas de cerdo, arepitas, papas y papa criolla. | To share: beef, sausage, fried pork skin, breaded chicken breast, bone-in pork chop, blood sausage, pork ribs, little corn cakes, potatoes and small yellow potatoes. |
| `picada-sencilla` | Carne, chorizo, chicharrón, pechuga apanada, chuleta de cerdo con hueso, morcilla, arepitas y papas. | Beef, sausage, fried pork skin, breaded chicken breast, bone-in pork chop, blood sausage, little corn cakes and potatoes. |
| `chicharron-con-arepa-con-queso` | Chicharrón crocante con arepa y queso derretido. | Crispy fried pork skin with a corn cake and melted cheese. |
| `chicharron-con-arepita` | Chicharrón crocante con una arepita de maíz. | Crispy fried pork skin with a little corn cake. |
| `chorizo-con-arepa-con-queso` | Chorizo jugoso con arepa y queso derretido. | Juicy sausage with a corn cake and melted cheese. |
| `chorizo-con-arepita` | Chorizo jugoso con una arepita crocante. | Juicy sausage with a crispy little corn cake. |
| `choricriolla` | Papas criollas doradas con chorizo. | Golden small yellow potatoes with sausage. |
| `guacamole-con-tostones` | Guacamole fresco con tostones crocantes. | Fresh guacamole with crispy green plantain slices. |
| `guacamole-con-tostones-y-chicharron` | Guacamole fresco con tostones crocantes y chicharrón. | Fresh guacamole with crispy green plantain slices and fried pork skin. |
| `combo-empanaditas` | 5 empanaditas cocteleras, pequeñas y crocantes, mixtas de carne y pollo. | 5 bite-size crispy empanadas, a mix of beef and chicken. |
| `maduro-con-queso` | Plátano maduro dulce con queso derretido. | Sweet ripe plantain with melted cheese. |
| `carne-asada-a-la-parrilla` | Carne de res a la parrilla, jugosa y bien sazonada. | Juicy, well-seasoned grilled beef. |
| `carne-empanizada` | Carne de res apanada, crocante por fuera y tierna por dentro. | Breaded beef, crispy outside and tender inside. |
| `bistec-encebollado` | Bistec de res tierno cubierto de cebolla. | Tender beef steak topped with onions. |
| `bistec-encebollado-a-caballo` | Bistec de res con cebolla y huevos fritos encima. | Beef steak with onions and fried eggs on top. |
| `carne-a-la-champinonera` | Carne de res a la parrilla bañada en salsa de champiñones. | Grilled beef topped with mushroom sauce. |
| `carne-en-salsa-criolla` | Carne de res en salsa criolla de la casa. | Beef in our homemade criolla sauce. |
| `churrasco-a-la-parrilla` | Churrasco de res a la parrilla, jugoso y lleno de sabor. | Juicy, flavorful grilled sirloin. |
| `entrana` | Entraña a la parrilla, tierna y jugosa. | Tender, juicy grilled skirt steak. |
| `sobrebarriga-a-la-parrilla` | Sobrebarriga de res a la parrilla, tierna y sabrosa. | Tender, flavorful grilled flank steak. |
| `sobrebarriga-en-salsa-criolla` | Sobrebarriga de res en salsa criolla de la casa. | Flank steak in our homemade criolla sauce. |
| `higado-a-la-parrilla` | Hígado a la parrilla, suave y bien sazonado. | Tender, well-seasoned grilled liver. |
| `higado-encebollado` | Hígado a la parrilla cubierto de cebolla. | Grilled liver topped with onions. |
| `higado-en-salsa-criolla` | Hígado en salsa criolla de la casa. | Liver in our homemade criolla sauce. |
| `chuleton-a-caballo` | Chuleta de cerdo con cebolla y huevos fritos encima. | Pork chop with onions and fried eggs on top. |
| `chuleta-de-cerdo-a-la-parrilla-o-empanizada` | Chuleta de cerdo con hueso, a la parrilla o apanada y crocante. | Bone-in pork chop, grilled or breaded and crispy. |
| `lengua-en-salsa-criolla` | Lengua de res tierna en salsa criolla de la casa. | Tender beef tongue in our homemade criolla sauce. |
| `lengua-a-la-parrilla` | Lengua de res tierna a la parrilla. | Tender grilled beef tongue. |
| `lomo-de-cerdo-a-la-parrilla-o-empanizado` | Lomo de cerdo a la parrilla, o apanado y crocante. | Pork loin, grilled, or breaded and crispy. |
| `ensalada-mixta` | Ensalada fresca y ligera con la base de la casa. | A light, fresh salad on our house base. |
| `ensalada-con-pechuga-de-pollo` | Ensalada fresca con pechuga de pollo. | Fresh salad topped with chicken breast. |
| `ensalada-de-atun` | Ensalada fresca con atún. | Fresh salad topped with tuna. |
| `ensalada-con-camarones` | Ensalada fresca con camarones. | Fresh salad topped with shrimp. |
| `brevas-con-arequipe-y-queso` | Brevas dulces con arequipe cremoso y queso, un clásico colombiano. | Sweet figs with creamy arequipe (dulce de leche) and cheese, a Colombian classic. |
| `brownie-con-helado` | Brownie de chocolate con helado, para cerrar con algo dulce. | Chocolate brownie with ice cream, a sweet finish. |
