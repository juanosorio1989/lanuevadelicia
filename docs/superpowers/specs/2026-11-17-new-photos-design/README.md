# New photos: storefront and Instagram dish photos (2026-11-17)

## Why

The owner sent new photos on 2026-11-17 (in `assets-inbox/`) and asked to use them: two storefront photos (the
restaurant photos missing since 2026-11-15) and dish photos taken from the restaurant's Instagram.

## Decisions

- **Owner decision:** use the photos as given. Twelve of them are Instagram posts with text baked in (titles, the
  Instagram handle, the delivery phone, in Spanish). They are used as menu card photos as they are; the card's
  `object-cover` crop shows the centre of each post.
- **Owner decision:** the video (`Fachada/videofachada.mp4`) is not used.
- **Owner decision (2026-11-17):** `Ricuras de la casa/Lomo de cerdo empanizado.jpg` is not used until the owner sends
  a real pork loin photo: the file shows the same breaded chicken breast as `POLLO/PechugaEmpanizada.jpg` (with a
  "Comida 100% colombiana" title), not pork loin.
- **Claude's call:** storefront by day goes on `/visit/` (above the map, so people recognize the place); storefront by
  night replaces the dish stand-in on `/our-story/`.
- **Claude's call:** the home story teaser also uses the storefront at night. The storefront photos are cropped toward the
  top (`object-[50%_15%]`) so the sign shows.
- All new photos pass the 1000px rule (spec 06): 1080px to 2000px on the long side.

## Mapping (source in `assets-inbox/` → menu item id)

| Source | Item id |
|---|---|
| `ANTOJITOS/choricriolla.jpg` | `choricriolla` |
| `ANTOJITOS/costillas.jpg` | `costillas-de-cerdo` |
| `ANTOJITOS/EMPANADITAS.jpg` | `combo-empanaditas` |
| `ANTOJITOS/Guacamole con tostones y chicharron.jpg` | `guacamole-con-tostones-y-chicharron` |
| `MENU INFANTIL/DeditosPollo.jpg` | `tiritas-de-pollo` |
| `MENU INFANTIL/Salchipapa.jpg` | `salchipapas` |
| `POLLO/PechugaEmpanizada.jpg` | `pechuga-empanizada` |
| `POSTRES/Brevas.jpg` | `brevas-con-arequipe-y-queso` |
| `POSTRES/Flan.jpg` | `flan-con-caramelo` |
| `POSTRES/FruitSalad.jpg` | `ensalada-de-fruta` |
| `POSTRES/Mazamorra.JPG` | `mazamorra-con-panela` (a clean photo, no text) |
| `Ricuras de la casa/Entrana.jpg` | `entrana` |

Restaurant photos (group `restaurant`):

| Source | Photo id | Alt es / en |
|---|---|---|
| `Fachada/fachadaDia.jpeg` | `restaurant/fachada-dia` | "Fachada de La Nueva Delicia en Jackson Heights, de día" / "La Nueva Delicia storefront in Jackson Heights, by day" |
| `Fachada/fachadaNoche.jpeg` | `restaurant/fachada-noche` | "Fachada de La Nueva Delicia en Jackson Heights, de noche" / "La Nueva Delicia storefront in Jackson Heights, at night" |

## Non-goals

No hero change, no gallery change (still hidden), no new card layout or per-photo crop position.
