# Dish dialog and full-height photos (2026-11-22)

Owner request: tall photos should show their full height, and tapping a dish should do something.

## 1. Gallery: masonry

`/gallery/` (still hidden from navigation and sitemap) shows every photo at its natural aspect ratio in CSS columns
(2 / 3 at `md` / 4 at `lg`, 12px gap), instead of the 4:3 crop. Rounded corners, hover zoom and the `<dialog>` stay.

## 2. Storefront photos at natural height

`restaurant/fachada-noche` (home story teaser, `/our-story/`) and `restaurant/fachada-dia` (`/visit/`) render at their
natural 3:4 ratio (`h-auto w-full`, no `object-cover`, no fixed height). Owner decision.

## 3. Dish dialog

Menu photo cards (`/menu/`) and home Favorites cards open a native modal `<dialog>` on click.

- **Content:** the full photo at its natural ratio (`object-contain`, at most 60vh tall), the dish name (H2), the
  price, the description, the options (same lines as the card), then "Pide a domicilio" with the 3 delivery app buttons
  (secondary style, new tab) and a "Llamar" button (`tel:`).
- **Whole card is clickable:** the dish name is a link stretched over the card (`after:absolute after:inset-0`), one
  link per card. Its accessible name is "Ver {name}" / "View {name}".
- **Without JS:** the link points to the photo file, like the gallery thumbnails.
- **Closing:** X button, Escape, backdrop click. Focus returns to the card link.
- **One dialog per page:** a client host gets display strings for the page's dishes and listens for clicks on
  `a[data-dish]` (event delegation), so the cards stay server components. Ctrl/Cmd/Shift/middle clicks keep the default.
- **Analytics:** delivery buttons send `click_delivery` and the phone button `click_call`, both with `location: "dish"`.
- Cards keep their current size and crop; the full photo is in the dialog.
