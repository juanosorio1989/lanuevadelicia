# Menu PDF and the old /menu link

Date: 2026-11-17. Owner-approved in chat.

## Problem

The old Wix site had `lanuevadelicia.com/menu`, where people could view or download the menu as a PDF. Since the
domain cutover (2026-11-17) that URL is a 404. Links on Instagram, Google, saved bookmarks or printed QR codes may
still point to it.

## Decisions

1. **`/menu` and `/menu/` → 301 to `/es/menu/`** (Cloudflare Pages `_redirects`). The old link lands on the web menu,
   which stays the primary menu (spec 08: never only a PDF). Keep these lines permanently.
2. **The PDF is served at `/la-nueva-delicia-menu.pdf`**, copied unchanged from the owner's
   `assets-inbox/menu.pdf` (2 pages, tabloid, InDesign, April 2026, 2.4 MB; already compressed: Ghostscript
   `/ebook` saves nothing). Cache: one day, like images.
3. **A link "Ver o descargar el menú (PDF)" / "View or download the menu (PDF)"** sits under the price note on
   `/es/menu/` and `/en/menu/`. It opens the PDF in a new tab (`target="_blank"`, `rel="noopener"`,
   `type="application/pdf"`), where the browser offers download. The text names the format, so no extra icon or
   "(opens in a new tab)" text is needed beyond the visible "(PDF)"; an `sr-only` "(opens in a new tab)" /
   "(se abre en una pestaña nueva)" suffix is added for screen readers. Same PDF for both locales (it is bilingual).
4. **GA4 event `view_menu_pdf`** with `location: "menu"`, sent through `TrackedLink` (spec 08 table gets a row).
5. **Price check:** the April 2026 PDF was compared with `src/data/menu.ts`; every price matches. The only
   item missing on the site is **Baileys Brownie Martini, $14.00**, listed last under Postres. It is added to
   Postres after "Flan con caramelo" (ES and EN name "Baileys Brownie Martini", no description, no photo).
   `docs/content/menu-review.md` gets the row; the menu now has 139 items, 48 with a description.

## Out of scope

- Generating the PDF from `menu.ts`. When prices change, the owner's designer updates the PDF and it is replaced
  in `public/` (noted in the handoff).
- An English-only PDF.

## Acceptance

- `npm run ci` green (unit, e2e, build, `check:out`).
- On the branch preview: `/menu` and `/menu/` answer 301 → `/es/menu/`; `/la-nueva-delicia-menu.pdf` answers 200
  `application/pdf`; the link shows on both locales and opens the PDF.
