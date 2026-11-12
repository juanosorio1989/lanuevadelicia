# Task 5: Photo import script and photo registry

Spec page: 06 (rules, the exclusion list, processing, alt text, logo).

**Files:**
- Create: `scripts/import-photos.ts` (run with `npx tsx scripts/import-photos.ts`), `scripts/photo-manifest.ts`
- Modify: `src/data/photos.ts` (generated content committed), `src/data/menu.ts` (set `image` ids if Task 4 left them unset)
- Create: `public/images/{dishes,drinks,specials,brand}/…` (generated, committed), `public/favicon.ico`,
  `src/app/icon.png`, `src/app/apple-icon.png`
- Test: `tests/unit/photos.test.ts`
- Modify: `package.json` (`npm i -D sharp tsx`; script `"photos": "tsx scripts/import-photos.ts"`)

**Interfaces:**
- Consumes: `Photo`, `PhotoId`, `L10n` (Task 2); menu item ids (Task 4).
- Produces: `photos: Photo[]` in `src/data/photos.ts`. Ids are `<group>/<slug>` (for example `dishes/bandeja-paisa`,
  `specials/martes`, `drinks/margaritas`, `brand/logo`). `src` is `/images/<group>/<slug>.jpg` (`.png` for the logo).
  The manifest exports `entries: { source: string; id: PhotoId; group: Photo['group']; itemId?: string; alt: L10n }[]`.

- [ ] **Step 1: Write `tests/unit/photos.test.ts`**

- Every `entries[].source` exists under `assets-inbox/` (skip with `it.skipIf(!fs.existsSync('assets-inbox'))`).
- No entry's source is in the excluded list. Copy the 10 paths verbatim from spec 06: the 9 plus `Cocteles y
  cervezas/Cervezas.jpg`.
- Every `photos[].src` file exists in `public/`, its longest side is ≤ 2400, and its width and height match the file
  (read them with sharp).
- Ids are unique and match `/^(dishes|drinks|specials|brand|restaurant)\/[a-z0-9-]+$/`.
- Every `alt.es` and `alt.en` is non-empty. A dish alt is `"<name.es> en La Nueva Delicia"` / `"<name.en> at La Nueva Delicia"`.
- The 4 featured menu items have an `image` that exists in `photos`.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Write the manifest** (one entry per kept file in `assets-inbox/`)

That is 47 dish and drink photos, 7 specials flyers and the logo. Map each file to its menu item id using spec 06
(for example "Pechuga en Champinones" → `pechuga-a-la-parrilla-en-salsa-con-champinon`). The flyer alt text is the
flyer's own text (spec 04 specials table, plus "Especial <día>").

- [ ] **Step 4: Implement `import-photos.ts`**

It uses sharp to `rotate()` (EXIF), resize to fit 2400 on the long side without enlarging, write JPEG quality 82,
mozjpeg, no metadata. It writes the logo as PNG at 1024, and generates `icon.png` 512 and `apple-icon.png` 180 from
the logo on a `#253D30` background. It writes `src/data/photos.ts` with the real dimensions. The script is
idempotent and never touches `assets-inbox/`.

- [ ] **Step 5: Run** `npm run photos && npm test` → PASS. Then check `du -sh public/images` → under 40M.

- [ ] **Step 6: Commit** `feat: import optimized restaurant photos and photo registry`
