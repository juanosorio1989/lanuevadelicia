# 06. Photos

Source: `assets-inbox/` (the owner sorted the photos into folders named after menu categories and named each file
after its dish). All are professional shots by dafotografia (the restaurant's photographer). They are the
restaurant's own photos, so the usage rights need a one-line owner confirmation (Q8).

## Rules

- **The exclusion rule (owner decision):** photos with a long side under 1000px are not used. Excluded:
  `BEBIDAS/JUGOS.jpg`, `PESCADOS Y MARISCOS/Filete de Pescado a la Parrilla.jpg`, `PESCADOS Y MARISCOS/Spaguetti a la
  Marinera.jpg`, `POLLO/Spaguetti en crema de Pollo.jpg`, `Ricuras de la casa/Lomo Empanizado.jpg`, `PESCADOS Y
  MARISCOS/Mojarra Frita.jpg`, `PESCADOS Y MARISCOS/Mojarra a la Marinera.jpg`, `Ricuras de la casa/Higado
  Encebollado.jpg`, `Ricuras de la casa/lenuga en salsa criolla.jpg`. **Claude's call:** `Cocteles y
  cervezas/Cervezas.jpg` (500×750) is also under the bar and is excluded; `Cervezas1.jpg` covers beers.
- The owner confirmed the four names Claude doubted are correct (Filete a la parrilla, Hígado encebollado, Lomo
  empanizado, Arroz con leche).
- Map each kept photo to a menu item id. File names are close to the menu names but not exact (for example "Pechuga
  en Champinones" → "Pechuga a la parrilla en salsa con champiñón", "Arepacon queso y Carne Asada" → "Arepa con queso y
  carne asada", "Entrana" → "Entraña"). Keep the mapping in `src/data/photos.ts`.
- Bar photos without a single menu item (`Cervezas1.jpg`, `Margaritas.jpg`) are used in the gallery and as category
  images.
- Weekly special flyers (7 JPGs, 6600×8400, text baked in) are used as they are (owner decision). `TodoslosDias.pdf`
  is the same 7 flyers plus a cover, so it is not needed.
- Logo: `assets-inbox/logo.png`, 2000×2000, a white stamp on transparent ("Made in Colombia · La Nueva Delicia
  Restaurant"). Use it on dark backgrounds only. Generate the favicon and app icons from it (white on `green-900`).
  Ask for a vector version (Q9).
- Hero: `Ricuras de la casa/Bandeja Paisa.jpg` (4608×3072).

## Processing

- Do not commit `assets-inbox/`. A script (`scripts/import-photos.ts`, run by hand) reads the approved list in
  `src/data/photos.ts`, auto-orients from EXIF, strips metadata, and writes optimized masters (long side 2400px,
  quality ~82) to `public/images/{dishes,drinks,specials,restaurant}/<slug>.jpg`, with ASCII kebab-case slugs. Those
  masters are committed (estimate under 40 MB).
- Build-time responsive variants: WebP at widths 384/640/828/1200/1920 (AVIF optional). See
  [07-technical.md](07-technical.md).
- Alt text, bilingual: "Bandeja Paisa en La Nueva Delicia" / "Bandeja Paisa at La Nueva Delicia". Flyers: the full
  text shown on the flyer.

## Restaurant photos (arriving 2026-11-13)

Interior, exterior and team photos are coming. During development, `PhotoPlaceholder` renders a clearly marked
striped box ("Foto del salón: pendiente"). **Launch gate:** no placeholder may ship. If the photos are not ready, the
story block uses a dish photo instead and the gallery hides the "El restaurante" group. Team photos need the
people's consent; the owner confirms when sending them.
