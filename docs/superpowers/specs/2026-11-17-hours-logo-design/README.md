# Hours, happy hour and logo size (2026-11-17)

Small change requested by the owner after seeing the site locally.

## Why

- The happy hour windows sit inside the opening-hours table with the same "days: time – time" shape, so visitors can
  read them as opening hours.
- The owner does not want the "Closed on January 1" note on the site. The restaurant still closes that day.
- The owner wants the header logo bigger.

## Goals

1. Remove the visible closed-dates note everywhere it shows: `HoursTable` (home Visit block and `/visit/`) and the
   footer.
2. Move happy hour out of the hours table into its own card (mockup option A, picked by the owner).
3. Header logo: 64px on mobile (now 48px), 80px from `lg` (now 56px).

## Non-goals

- January 1 closing logic stays: the open-status badge still says closed that day, and the JSON-LD
  `specialOpeningHoursSpecification` still lists it. `restaurant.closedDates` stays in the data.
- No change to the hours data, the footer hours list (it has no happy hour) or the mobile action bar.

## Design

**Hours block** (`src/components/shared/HoursTable.tsx`):

- A small uppercase label "Horario" / "Opening hours" above the table (new message key). It is the table's
  `<caption>`, hidden on `/visit/` (`showTitle={false}`), which has its own h2.
- Table rows: the opening-hours rows and the breakfast row, as today.
- Below the table, a happy hour card: `bg-terra-700`, `text-cream-50`, rounded, padding about 12px 14px.
  - Title row: Lucide `Martini` icon (`aria-hidden`) + "Happy hour", and on the right a pill (`bg-cream-50`,
    `text-terra-700`) with "cócteles a $8" / "cocktails $8".
  - Then one line per window ("Lunes a viernes: 12:00 p. m. – 7:00 p. m."), from `restaurant.happyHour`.
  - The card is a heading-free group; the title is plain text, not a new heading level.
- cream-50 on terra-700 is about 5.1:1 (passes AA for normal text).
- Remove the `closedNote` paragraph. Remove the `hours.closedNote` message key and `formatClosedDates` if nothing else
  uses them (and their unit tests).

**Footer** (`src/components/layout/Footer.tsx`): remove the closed-dates paragraph only.

**Header logo** (`src/components/layout/Header.tsx`): `h-16` mobile, `lg:h-20`, `sizes="80px"`. The scrolled
(shrunken) size stays `h-10`, so the shrunken header height that `/menu/` relies on (`--menu-header-h: 3rem`) does not
change.

## Approaches

- Happy hour: A (terracotta card), B (sand dashed box) and C (side rule) were shown; the owner picked A because it
  separates most clearly.
- Logo: 48 (current), 56 and 64px were shown; the owner picked 64px. Keeping the scrolled size at 40px (our call)
  avoids touching the tested menu sticky offsets; the mockup had said 48px when scrolled.

## Left to the builder

Exact spacing, and updating any unit or e2e test that asserts the closed note or the happy hour table row. Acceptance:
`npm run ci` green, Lighthouse budgets met, and the spec/docs that mention the closed note updated in the same commit.

## Follow-up (final review)

The header scroll threshold is now 80px in / 8px out (hysteresis), because the shrinking sticky header made Chrome's
scroll anchoring toggle `data-scrolled` endlessly at small scroll positions.

On /visit/ the hours table has no caption; it is named by the page's own `h2` through `aria-labelledby`
(`HoursTable` prop `labelledBy`).
