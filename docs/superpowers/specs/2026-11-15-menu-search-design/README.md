# Menu search, swipe hint, phone orders, hidden gallery

Approved by the owner 2026-11-15. A small change on top of the MVP spec
([2026-11-12-website-design](../2026-11-12-website-design/README.md)); that spec still holds where this page is silent.
The owner saw every visible part on the dev server (branch `site-improvements`, a throwaway spike) and approved the look
before this page was written.

## Intent

Customers mostly browse on phones. The menu has about 150 dishes on one page, so they need to find a dish fast and to
know the category bar scrolls sideways. The delivery rules changed (a hard limit at 1.5 miles), pickup and delivery are
ordered by phone, and the gallery adds little for now.

## Goals

1. **Menu search.** A search box filters the menu while the customer types.
2. **Swipe hint.** Below `lg`, the customer is told the category bar scrolls sideways.
3. **Phone orders and delivery range.** Pickup and own delivery by phone; the delivery rules in three steps.
4. **Hide the gallery** from navigation in both languages, for now.
5. **Reservations and holidays** (owner answers to Q3 and Q4, 2026-11-15): reservations by phone; regular hours on
   holidays; closed every January 1.

Non-goals: typo-tolerant ("fuzzy") search, search outside the menu page, removing the gallery page, a delivery-fee
amount. Anti-goals: a slower menu page (Lighthouse budgets in `lighthouserc.json` must still pass), a search box that
hides the menu when JavaScript is off.

## Approaches (search)

| Approach | Trade-off |
|----------|-----------|
| **Filter the rendered menu in place (chosen)** | No extra payload, no duplicated data; the static HTML stays the full menu |
| Separate results list built from menu JSON | Ships the 150 items twice; heavier on phones |
| Fuzzy-search library | Tolerates typos; adds JS for little gain on short, well-known dish names |

The owner picked the first.

## Design

### 1. Menu search

- Look (approved): a rounded search box at the top of the sticky block on `/menu/`, above the swipe hint and the
  chips; full width; magnifier icon; placeholder "Buscar en el menú…" / "Search the menu…". The block (search, hint,
  chips) stays sticky under the header on every width.
- Matches the item name and description in the page language. Case and accents are ignored ("frijoles" finds
  "Fríjoles"). Every word typed must match (AND), in any order.
- Filters on every keystroke. Items that do not match are hidden; a category with no visible item is hidden, and so is
  its chip. The chip bar keeps working on the visible categories.
- A clear (✕) button empties the box and restores the full menu. Escape does the same.
- No results: "No encontramos ese plato. Llámanos al (718) 672-3456." / "We couldn't find that dish. Call us at …",
  with the phone as a tracked `tel:` link (`click_call`, new location `menu`). Phone from `restaurant.ts`.
- The result count is announced to screen readers (a polite live region), e.g. "12 platos" / "12 dishes".
- No JavaScript: the search box is not rendered (it appears only after hydration) and the full menu shows.
- Analytics: GA4's recommended `search` event with `search_term` (lower-cased, trimmed), sent once per term after the
  customer stops typing for 1 s, only when the term has 2+ characters. Spec 08 and the privacy page wording get the
  new event.
- The category heading of a search hit stays visible above it; the items keep their normal card/row layout.

### 2. Swipe hint (below `lg` only)

- The line "Desliza para ver más categorías →" / "Swipe to see more categories →", styled like the category note
  ("Solo hasta la 1:00 p.m.": bold, 0.8125rem, `terra-700`), sits between the search box and the chips.
- A right-edge fade with a `›` chevron over the chip row only.
- The hint hides once the customer scrolls the chips or the bar does not overflow; the fade hides at the end of the
  row. Without JS both stay visible. Decorative (`aria-hidden`); the chips are already a labelled nav.

### 3. Phone orders and delivery range

- `restaurant.ts`: `deliveryNote` is replaced by `deliveryRange: { freeMiles: 1, maxMiles: 1.5 }`.
- A `PhoneOrder` block on the Visit page (app links as buttons) and the home Visit block (app links as text):
  - **Pide por teléfono / Order by phone**
  - "Llámanos al (718) 672-3456 para recoger o para domicilio." / "Call … for pickup or delivery." (tracked `tel:`)
  - "Domicilio: hasta 1 milla sin recargo; de 1 a 1.5 millas, con recargo. A más de 1.5 millas, pide por:" /
    "Delivery: up to 1 mile at no extra charge; 1 to 1.5 miles, extra charge. Beyond 1.5 miles, order on:"
  - then Uber Eats · DoorDash · Grubhub.
- Miles render as `1.5` in both languages. No fee amount (owner).
- Spec 02 business facts are updated.

### 4. Gallery hidden

- Removed from `NAV_ITEMS` (header, mobile nav, footer) and from the sitemap. The page and its route stay, reachable
  by URL. Spec 03 notes it as hidden.

### 5. Reservations and holidays

- Reservations by phone only, no minimum party size or notice. `PhoneOrder` gets a first line, bold label:
  "**Reservas:** llámanos al (718) 672-3456." / "**Reservations:** call (718) 672-3456." (tracked `tel:` link).
  Restaurant JSON-LD: `acceptsReservations: true`.
- `restaurant.ts` gains `closedDates: [{ month: 1, day: 1 }]` (recurring every year).
- Open status: on a closed date the badge says closed and points at the next real opening (January 1 is skipped when
  counting "abre mañana / el {día}"). Existing status strings are reused.
- Under the hours table (everywhere it shows): "Cerrado el 1 de enero." / "Closed on January 1." The date comes from
  `closedDates`, formatted per locale. No holiday-hours line (owner: holidays are regular, say nothing about them).
  Superseded 2026-11-17: the note is no longer shown; see `../2026-11-17-hours-logo-design/`.
- Restaurant JSON-LD: `specialOpeningHoursSpecification` marks the next two January 1 dates (from the build date) as
  closed (`opens`/`closes` "00:00", `validFrom` = `validThrough` = the date). The site is rebuilt on each deploy.

### Dev server on a phone

`allowedDevOrigins: ["192.168.*.*"]` in `next.config.ts` so `next dev` serves its scripts to a phone on the home
Wi-Fi. Dev only; no effect on the export.

## Left to the builder

Component split, the normalization function, the hit-testing data attributes, and test details, within the rules
above and the project rules (`CLAUDE.md`: facts from `restaurant.ts`, strings as props, `TrackedLink` for CTAs).
