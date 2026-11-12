# Task 6: Design tokens, fonts, Button, Img, track()

Spec pages: 05 (tokens, type, shape, components), 07 (images), 08 (analytics events).

**Files:**
- Modify: `src/app/globals.css` (Tailwind `@theme` tokens), `src/app/[locale]/layout.tsx` (fonts), `next.config.ts`
  (image optimizer), `package.json`
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Img.tsx`, `src/components/ui/Eyebrow.tsx`, `src/lib/analytics.ts`
- Test: `tests/unit/analytics.test.ts`, `tests/unit/tokens.test.ts`

**Interfaces:**
- Produces:
  - Tailwind color tokens `green-900 cream-50 sand-100 terra-500 terra-700 charcoal-900 muted-600 star`, with the
    spec 05 hexes. Font variables `--font-display` (Playfair Display 600/700) and `--font-sans` (DM Sans
    400/500/700), latin and latin-ext, through `next/font/google`.
  - `<Button variant="primary"|"outline"|"on-dark" href={string} external?={boolean} onClick?… />`. It renders an
    `<a>`, has a minimum height of 44px and is pill-shaped. Primary is `bg-terra-700 text-white`, outline is
    `border-green-900 text-green-900`, and on-dark is a cream outline. It has a visible focus ring
    (`outline-2 outline-green-900 outline-offset-2`; cream on dark). `external` adds `target="_blank" rel="noopener"`.
  - `<Img photo={Photo} locale={Locale} sizes={string} priority?={boolean} className?… />` wraps
    `next-image-export-optimizer`'s `ExportedImage`. It takes the alt from `photo.alt[locale]` and the dimensions
    from the photo.
  - `track(event: AnalyticsEvent, params: Record<string,string>): void` in `src/lib/analytics.ts`, with
    `type AnalyticsEvent = 'click_directions'|'click_call'|'click_delivery'|'click_reviews'|'load_map'|'switch_language'|'view_menu_category'|'click_instagram'`.
    It calls `window.gtag('event', …)` only if `gtag` exists, and otherwise does nothing. It never throws.

- [ ] **Step 1: Write the tests**

- `analytics.test.ts`: with no `window.gtag`, `track('click_call',{location:'hero'})` does not throw. With a stub
  `gtag`, it is called with `('event','click_call',{location:'hero'})`.
- `tokens.test.ts`: read `globals.css` and assert that it contains `#A2471F`, `#253D30`, `#F4EBDD`, `#E8DCC8`,
  `#C85E36`, `#252722`, `#555555` and `#E9B44C`. Also compute the WCAG contrast and assert: white on `#A2471F` ≥ 4.5,
  `#A2471F` on `#F4EBDD` ≥ 4.5, `#252722` on `#F4EBDD` ≥ 4.5. Put the contrast function in the test file.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement**

Install `next-image-export-optimizer`. Configure it per its README for `output: 'export'`: a custom loader, the
`nextImageExportOptimizer_*` env with `storePicturesInWEBP: true`, `generateAndUseBlurImages: true`, and widths
`[384,640,828,1200,1920]`. Then set `"build": "next build && next-image-export-optimizer"`. If the library is
incompatible with the installed Next version, stop and report BLOCKED with the error (Opus decides on the sharp
fallback the spec allows).

- [ ] **Step 4: Run** `npm test && npm run build && npm run check:out`. Then check
`ls out/nextImageExportOptimizer | head` → it shows `.WEBP` files.

- [ ] **Step 5: Commit** `feat: add design tokens, fonts, Button, Img and analytics helper`
