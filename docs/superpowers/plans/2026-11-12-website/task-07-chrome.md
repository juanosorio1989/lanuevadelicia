# Task 7: Site chrome

Spec pages: 03 ("Global elements"), 05 (components, motion, a11y).

**Files:**
- Create: `src/components/layout/{Header.tsx, MobileNav.tsx, MobileActionBar.tsx, LanguageSwitch.tsx, Footer.tsx, SkipLink.tsx, TrackedLink.tsx}`
- Modify: `src/app/[locale]/layout.tsx` (render the chrome around `children`), `messages/{es,en}.json` (nav, CTA
  and footer strings)
- Create: placeholder pages so the nav links resolve: `src/app/[locale]/{menu,specials,our-story,gallery,visit,privacy}/page.tsx`
  (an H1 only; later tasks fill them)
- Test: `tests/e2e/chrome.spec.ts`

**Interfaces:**
- Consumes: `Button`, `track` (Task 6); `restaurant`, `directionsUrl`, `telHref` (Task 2); `Link`, `usePathname`,
  `getPathname` (Task 1).
- Produces:
  - `<TrackedLink href event params external? className children>` (client). An `<a>` that calls `track` on click.
    Every CTA in later tasks uses it, or `Button` with `onClick` → `track`.
  - Message keys used later: `nav.menu`, `nav.specials`, `nav.story`, `nav.gallery`, `nav.visit`,
    `cta.directions` ("Cómo llegar" / "Get Directions"), `cta.call` ("Llamar" / "Call"), `cta.menu` ("Ver menú" /
    "View menu"), and `footer.*`.
  - `data-testid` hooks: `bottom-bar`, `bottom-bar-directions`, `bottom-bar-call`, `bottom-bar-menu`, `lang-switch`.

- [ ] **Step 1: Write `tests/e2e/chrome.spec.ts`**

- On a viewport of 390×844, for each of `/es/`, `/es/menu/`, `/en/visit/`: `bottom-bar` is visible. The directions
  `href` equals `directionsUrl()`, call is `tel:+17186723456`, and menu is `/<locale>/menu/`. The last section is
  not covered: the page's `body` padding-bottom is at least the bar's height.
- On a viewport of 1280×800: `bottom-bar` is hidden, and the header shows the phone link and "Cómo llegar".
- On `/es/menu/`, clicking `lang-switch` "EN" goes to `/en/menu/`. On `/en/gallery/`, "ES" goes to `/es/gallery/`.
- Mobile: the menu button opens the nav `<dialog>`. Escape closes it, and focus returns to the button.
- The footer contains `93-16B 37th Ave`, `(718) 672-3456` and `@lanuevadeliciarestaurante`, and links to all 3
  delivery apps with `target="_blank"`.
- Tab from the page top: the first focusable element is the skip link, and it moves focus to `#main`.

- [ ] **Step 2: Run** `npm run build && npm run e2e -- chrome` → FAIL.

- [ ] **Step 3: Implement** per spec 03 and 05

The header is sticky, uses `green-900`, and shrinks its padding after 24px of scroll (client, honoring
`prefers-reduced-motion`). The bottom bar shows below `md`, has 3 cells with directions in the middle and wider in
`terra-700`, Lucide icons (`UtensilsCrossed`, `MapPin`, `Phone`), and `pb-[env(safe-area-inset-bottom)]`. The
language switch builds the other-locale href with `getPathname({ href: pathname, locale: other })`. The footer reads
every fact from `restaurant`. Tracking: the language switch calls `track('switch_language',{from,to})`,
Instagram links call `click_instagram`, and delivery links call `click_delivery` with `app`. Every directions and
call link calls `click_directions`/`click_call` with its `location` (header, bottom_bar, footer, …).

- [ ] **Step 4: Run** `npm run build && npm run e2e` → PASS.

- [ ] **Step 5: Commit** `feat: add header, mobile nav, bottom action bar, language switch and footer`
