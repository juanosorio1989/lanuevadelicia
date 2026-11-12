# 03. Site and pages

## Sitemap and routes

Spanish is the default locale. Both locales use the same English path segments (Claude's call, so routing stays
simple in a static export). `trailingSlash: true`.

| Page | Spanish | English | MVP |
|------|---------|---------|-----|
| Home | `/es/` | `/en/` | yes |
| Menu | `/es/menu/` | `/en/menu/` | yes |
| Weekly specials | `/es/specials/` | `/en/specials/` | yes |
| Our story | `/es/our-story/` | `/en/our-story/` | yes |
| Gallery | `/es/gallery/` | `/en/gallery/` | yes |
| Visit us | `/es/visit/` | `/en/visit/` | yes |
| Privacy (GA4 disclosure) | `/es/privacy/` | `/en/privacy/` | yes (short page; Claude's call) |
| Catering | — | — | phase 2 |

`/` redirects to `/es/` (302, via hosting redirect rules; see [07-technical.md](07-technical.md)). A single bilingual
404 page (real 404 status) links to Menu and Visit in both languages.

Nav labels (ES / EN): Menú / Menu · Especiales / Specials · Nuestra historia / Our story · Galería / Gallery ·
Visítanos / Visit us.

## Global elements

- **Header (desktop):** dark green bar. Logo (left) → nav → language switch `ES | EN` (current locale bold) → phone
  number as a `tel:` link → primary button "Cómo llegar". It sticks to the top on scroll and shrinks a little.
- **Header (mobile):** logo, language switch, and a menu button that opens a full-screen nav panel. No phone or
  directions in the header, because the bottom bar has them.
- **Mobile bottom bar (below 768px, every page):** fixed, 3 equal cells: Menú (link to menu) · **Cómo llegar**
  (terracotta, slightly wider, the primary action) · Llamar (`tel:`). Icon above the label. Leave bottom padding so it
  never covers content; respect `env(safe-area-inset-bottom)`.
- **Language switch:** links to the same page in the other locale (not to home).
- **Footer:** name, address, phone, hours, Instagram, the 3 delivery apps, privacy link, © year.

## Home (approved mockup `inicio-v1.html`)

In order:

1. **Hero:** full-width Bandeja Paisa photo with a dark gradient for legibility (left on desktop, bottom on mobile).
   H1 "El sabor de Colombia, cerca de ti." Supporting copy: "Comida casera, fresca y en su punto, con más de 30
   años en Jackson Heights. Ven a sentirte como en casa." Buttons: **Cómo llegar** (primary) and **Ver menú**
   (outline). A status line below: open-now badge ("Abierto ahora · cierra a las 9:00 p.m." / "Cerrado · abre
   mañana a las 9:00 a.m.") and "★ 4.4 en Google (450+ reseñas)". On mobile the buttons are not repeated in the hero
   (the bottom bar covers them), but the status line stays.
2. **Favorites of the house:** eyebrow "Los favoritos de la casa", H2 "Platos que nos piden una y otra vez", and 4
   cards with photo, name, short line and price: Bandeja Paisa ($23), Calentado con chuleta ($12.99, "Desayuno hasta
   la 1 p.m."), Arroz a la marinera ($28), Picada doble ($65, "Para compartir"). The list is driven by the `featured`
   flag in menu data. On mobile the cards scroll horizontally. Link: "Ver el menú completo →".
3. **Today's special:** sand-colored band showing today's weekday flyer, its dish name as real text, the price and
   "Pregunta también por el especial alternativo", plus a link to the specials page. The weekday is computed in
   `America/New_York` on the client. The static HTML (and the no-JS view) shows a neutral teaser with **no dish and no
   price**: "Cada día tiene su especial" plus a link to the specials page. The client swaps in today's flyer, dish
   and price.
4. **Our story (short):** the approved text (below) on one side, a photo on the other (interior or exterior once it
   arrives, see [06-photos.md](06-photos.md)), and a small detail line "Raíces en Caldas · Eje Cafetero" with a coffee
   leaf/bean line icon (the "C" touch).
5. **Reviews:** green band with the star glyphs, "4.4 en Google · más de 450 reseñas", a line "Lo que más destacan:
   el sabor casero y la atención cálida.", and buttons "Leer reseñas en Google" and "Dejar una reseña". **The
   "lo que más destacan" line is the owner's characterization; keep it only if the owner confirms that reviews say
   this (Q6), otherwise drop it.**
6. **Visit us:** address as H2, hours table (Mon–Thu, Fri–Sun, breakfast until 1 p.m., happy hour cocktails $8),
   **Cómo llegar** and **Llamar** buttons, delivery line "¿Prefieres a domicilio? Uber Eats · DoorDash · Grubhub",
   and "¿Evento o grupo grande? Llámanos." Next to it is a click-to-load map (see below).
7. **Footer.**

### Approved story text

ES (approved by the owner):

> **Más de 30 años de sabor colombiano en Jackson Heights.**
> La Nueva Delicia lleva más de tres décadas sirviendo comida colombiana en el corazón de Queens. Nuestras raíces están
> en Caldas, en el Eje Cafetero, y se sienten en cada plato: recetas caseras, ingredientes frescos y todo preparado en
> su punto. Nuestro equipo atiende con cariño, porque lo que más nos importa es que cada persona que entra se sienta
> como en casa.

EN: a faithful translation, written by Claude and reviewed by the owner before launch:

> **30+ years of Colombian flavor in Jackson Heights.**
> La Nueva Delicia has served Colombian food in the heart of Queens for more than three decades. Our roots are in
> Caldas, in Colombia's coffee region, and you can taste them in every dish: home-style recipes, fresh ingredients,
> everything cooked just right. Our team serves with warmth, because what matters most to us is that everyone who
> walks in feels at home.

## Menu (approved mockup `menu-v1.html`)

Rules are in [04-menu.md](04-menu.md). Layout:

- H1 "Nuestro menú" with the price note below.
- **Sticky category bar** under the header: horizontal scrolling chips, one per category. Tapping a chip scrolls to
  the section, and the chip for the section in view is highlighted. It works with JS off (plain anchor links). The
  highlight is progressive enhancement.
- Each category: H2 title, an optional terracotta note line (for example "Todos vienen con arroz, maduro y ensalada
  verde o fríjoles"), then **photo cards** for items that have an approved photo (3 per row on desktop; on mobile a
  horizontal card with a 104×92 thumbnail on the left), then a **text list** of the rest (name, short description,
  price aligned right, dotted separator; 2 columns on desktop, 1 on mobile).
- A "Favorito" tag on featured items.

## Weekly specials

One section per weekday, Monday→Sunday. Today's day is highlighted and the page scrolls to it on load (client
side). Each day shows the flyer image (from `assets-inbox/especiales de la semana/`), the main special as HTML text,
the alternative special when one exists, and the price. The flyers have text baked in, so their `alt` must repeat
that text. Data is in [04-menu.md](04-menu.md). The owner chose to launch with these flyers as they are.

## Our story

The approved text, with a larger layout. Interior/exterior photos once they arrive. Then a short "what to expect"
row of three items (Claude's call, wording reviewed by the owner): Comida casera / Ingredientes frescos / Atención
cálida. CTA band at the end: Cómo llegar + Ver menú.

## Gallery

A CSS grid of approved photos grouped by Comida, Bebidas, and El restaurante (the last only once photos exist). Tap
opens the larger image in a native `<dialog>`. No lightbox library. The images lazy-load.

## Visit us

The address, hours table (with the open-now badge), Cómo llegar, Llamar, a click-to-load map, the 3 delivery app
buttons (secondary style, open in a new tab), the delivery-distance note, the events line, and Instagram. Transit
info is left out until verified.

## Click-to-load map

To protect performance and privacy, no Google iframe loads by default. Show a static, styled card (green/cream, a
pin icon, the address) with a "Ver mapa" button. On click, swap in
`<iframe src="https://www.google.com/maps?q=<encoded name+address>&output=embed" loading="lazy">` (no API key). The
directions button never depends on the map.

## Open-now logic

The hours live in data. The client computes the status in `America/New_York` and shows one of: open (closes at X),
closing soon (under 60 min), or closed (opens at X, today or tomorrow). The server and static HTML render the plain
hours with no badge, to avoid a wrong cached status. Holidays are not modeled in the MVP (Q4).
