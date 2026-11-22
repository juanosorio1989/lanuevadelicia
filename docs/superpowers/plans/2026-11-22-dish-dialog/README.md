# Dish dialog and full-height photos: plan

> **For agentic workers:** use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Spec:** [`../../specs/2026-11-22-dish-dialog-design/README.md`](../../specs/2026-11-22-dish-dialog-design/README.md).
Branch: `dish-dialog`. Acceptance for the branch: `npm run ci`, `CHROME_PATH=/usr/bin/google-chrome npx lhci autorun`.

## Routing

Main session: **Opus 5.5** (orchestrates).

| Task | What | Implementer | Reviewer | Why |
|------|------|-------------|----------|-----|
| 1 | Gallery masonry + storefront photos at natural height | implementer-sonnet | reviewer-opus | Class changes given exactly |
| 2 | Dish dialog (menu + Favorites) | implementer-sonnet | reviewer-opus | Files, props and tests given below |

## Task 1: gallery masonry and storefront photos

Files:
- `src/components/gallery/GalleryGrid.tsx` (already changed in the working tree; keep it): `ul` uses
  `columns-2 gap-3 md:columns-3 lg:columns-4`, each `li` has `mb-3 break-inside-avoid`, the image `h-auto w-full`
  (no `aspect-[4/3]`, no `object-cover`).
- `src/components/home/StoryTeaser.tsx`, `src/app/[locale]/our-story/page.tsx`, `src/app/[locale]/visit/page.tsx`:
  the storefront `Img` className becomes `h-auto w-full rounded-card` (drop `h-*`, `md:h-*`, `object-cover`,
  `object-[50%_15%]`).
- Docs: `docs/superpowers/specs/2026-11-12-website-design/03-site-and-pages.md` Gallery section ("CSS columns
  (masonry), natural aspect ratio, see 2026-11-22-dish-dialog-design"); `06-photos.md` lines about `object-[50%_15%]`
  ("rendered at natural height since 2026-11-22").

Steps:
- [ ] Make the changes. `npm run typecheck && npm run lint && npm test`: pass.
- [ ] `npm run build && npx playwright test tests/e2e/pages.spec.ts`: pass (gallery dialog tests unchanged).
- [ ] Commit `feat: gallery masonry and storefront photos at natural height`.

## Task 2: dish dialog

**Types and helper** — `src/lib/dish.ts` (server-safe, no React):

```ts
export type DishDisplay = {
  id: string; name: string; description?: string; price?: string;
  options: { label: string; price?: string }[];
  photo: { src: string; width: number; height: number; alt: string };
};
export function toDishDisplay(item: MenuItem, locale: Locale): DishDisplay // item.image required; uses getPhoto, formatPrice
```

Unit test `tests/unit/dish.test.ts`: for a menu item with image and price, `name`, `price` (`formatPrice`), `photo.src`
and `photo.alt` (locale) match; options map labels and formatted prices; throws or is never called for items without
image (pick one, test it).

**Analytics** — `src/lib/analytics.ts`: add `"dish"` to `TrackLocation`. Update spec 08 table rows for `click_call`
and `click_delivery` (add `dish`).

**Messages** — `messages/es.json` and `messages/en.json`, new namespace `dish`:
`open` "Ver {name}" / "View {name}", `close` "Cerrar" / "Close", `order` "Pide a domicilio" / "Order delivery",
`call` "Llamar" / "Call". Unit tests that compare es/en keys must still pass.

**Client host** — `src/components/dish/DishDialog.tsx` (`"use client"`):

```ts
props: {
  dishes: DishDisplay[];
  closeLabel: string;
  /** Server-rendered order block, the same for every dish (see DishActions below). */
  actions: ReactNode;
}
```

`actions` renders inside the dish content (hydration safe: dish is null on server and first client render).

**Server order block** — `src/components/dish/DishActions.tsx` (async server component, `{ locale }`): a `p` with
`t("dish.order")`, then `<DeliveryLinks locale={locale} location="dish" variant="buttons" className="mt-2 gap-y-2" />`
(existing component: outline buttons, new tab, `click_delivery`), then
`<TrackedLink href={telHref()} event="click_call" params={{ location: "dish" }} variant="primary">{t("dish.call")}</TrackedLink>`.
Parents pass `<DishActions locale={locale} />` as `actions`. So `labels.order/call/newTab` and a delivery prop are not
needed; drop `newTab` from the messages list.

- `useEffect` adds one `click` listener on `document`: target `closest("a[data-dish]")`; ignore if
  `e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey`; else `preventDefault()`,
  remember the anchor as opener, set current dish by `data-dish` id (ignore unknown ids).
- Native `<dialog>` like `GalleryDialog` (showModal/close in an effect, backdrop click closes, `onClose` clears state
  and focuses the opener). `aria-labelledby` the H2. Width `w-[min(92vw,40rem)]`, `max-h-[92vh] overflow-y-auto`,
  `rounded-card bg-cream-50`.
- Body: `ExportedImage` `mx-auto max-h-[60vh] w-auto max-w-full object-contain` with `sizes="(min-width: 768px) 640px, 92vw"`;
  `h2#dish-dialog-title` font-display; price `font-bold text-terra-700`; description `text-muted-600`; options
  rendered like `ItemOptions` (from strings); then `{actions}` inside a `div.mt-4 border-t border-sand-100 pt-4`.
  Render the `dialog` always (with `actions`), the dish content only when a dish is set.
- Close button: same as GalleryDialog (lucide `X`, `size-11`, `aria-label={closeLabel}`).

**Cards** — clickable via a stretched link on the name:
- `src/components/menu/MenuItemCard.tsx`: `li` gets `relative`; the heading text is wrapped in
  `<a href={photo.src} data-dish={item.id} aria-label={openLabel.replace("{name}", name)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-green-900 focus-visible:after:rounded-card focus-visible:after:-outline-offset-2">`.
  The FavoriteTag stays outside the link. `MenuLabels` gains `open: string`; pass it from `menu/page.tsx` via
  `MenuCategorySection` (only cards use it).
- `src/components/shared/DishCard.tsx`: same pattern (`article` `relative`), new prop `openLabel`.
- `cursor-pointer` comes from the link; add `transition-shadow hover:shadow-md` on the card.

**Hosts:**
- `src/app/[locale]/menu/page.tsx`: render `<DishDialog>` once with `menuItems.filter(i => i.image).map(i => toDishDisplay(i, locale))`.
- `src/components/home/Favorites.tsx`: render `<DishDialog>` once with the featured items.

**E2E** — new `tests/e2e/dish.spec.ts`:
1. `/es/menu/`: click the first `[data-item="card"]` → `dialog[open]` visible; its H2 text equals the card heading
   text; dialog `img` visible with non-empty `alt`; 3 links with the `restaurant.delivery` URLs and `target="_blank"`;
   a `tel:` link. Escape closes; focus is on that card's `a[data-dish]`.
2. Clicking the backdrop (corner of the viewport) closes.
3. `/en/` home Favorites: click the first card → dialog opens with the English name; close button closes.
4. JS off (same pattern as the gallery no-JS test in `pages.spec.ts`): the card link `href` ends with `.jpg` and
   points under `/images/`.
5. Menu search still filters cards (existing tests pass untouched).

Steps:
- [ ] Write `dish.test.ts` and `dish.spec.ts` first; see them fail.
- [ ] Implement. `npm run ci`: pass (paste counts).
- [ ] Docs: spec 03 menu section and Favorites line mention "tap opens the dish dialog (2026-11-22-dish-dialog-design)".
- [ ] Commit `feat: dish dialog with full photo and order buttons`.
