# Content

Site content lives in typed data files (`src/data/`), validated by `validateContent()` at build time. These pages
are for checking that content with the owner.

- [Menu review](menu-review.md): every menu item and weekly special with its price and PDF page, plus the list of
  names, descriptions and corrections that need an owner check.
- [Copy review](copy-review.md): UI, SEO and privacy copy Claude wrote that the owner has not reviewed, with the
  proposed fix for the privacy wording.

To change a price or name: edit `src/data/menu.ts` or `src/data/specials.ts`, run `npm test`, and update the menu
review table. If the item has a photo, run `npm run photos` so the photo alt text follows the new name.
