# 02. Business facts

Only these facts may appear on the site. Anything else needs owner confirmation first. Store them in one data file
(`src/data/restaurant.ts`, see [07-technical.md](07-technical.md)) so NAP stays identical everywhere.

| Fact | Value | Source |
|------|-------|--------|
| Name | La Nueva Delicia (no "s") | Owner; logo |
| Address | 93-16B 37th Ave, Jackson Heights, NY 11372 | Google Maps listing (owner's link). Printed menu says "9316 37 Ave"; Grubhub says "9316 37th Ave Suite B". Use the Google form everywhere. |
| Phone | +1 718-672-3456 (display: (718) 672-3456) | Printed menu ("Delivery"). See open question Q1. |
| Hours | Mon–Thu 9:00 a.m.–9:00 p.m.; Fri–Sun 9:00 a.m.–10:00 p.m. | Owner, 2026-11-12 |
| Breakfast | Served until 1:00 p.m. | Printed menu |
| Happy hour | Mon–Fri 12:00–7:00 p.m.; Sat–Sun 5:00–8:00 p.m.; all cocktails $8 | Printed drinks menu |
| Delivery note | Delivery beyond one mile has an extra charge | Printed menu |
| Instagram | @lanuevadeliciarestaurante → https://www.instagram.com/lanuevadeliciarestaurante/ | Owner. (The printed menu shows an old handle with a trailing underscore; do not use it.) |
| Google Maps | https://maps.app.goo.gl/4CmW2ZLtRpvPJKb56 | Owner |
| Google rating | 4.4 ★, 452 reviews (as of 2026-11-12) | Owner |
| Uber Eats | https://www.ubereats.com/store/la-nueva-delicias/uPk0HRZTWfGVY-h8iVvtoA | Owner |
| DoorDash | https://www.doordash.com/store/la-nueva-delicia-jackson-heights-704445/13145759 | Owner |
| Grubhub | https://www.grubhub.com/restaurant/la-nueva-delicia-9316-37th-ave-suite-b-jackson-heights/3157876 | Owner |
| Domain | lanuevadelicia.com (registered and DNS at Hostinger) | DNS lookup 2026-11-11 |
| Age | "más de 30 años" / "30+ years" in Jackson Heights | Owner approved the claim |
| Roots | Caldas, Eje Cafetero (Colombia's coffee region) | Owner |

## Rules for using facts

- **Rating:** show it as text ("4.4 ★ · más de 450 reseñas en Google") with a link to the Google listing. Rounding
  the count down to "450+" is Claude's call, so the text stays true as reviews grow. Keep the exact numbers and
  `asOf` date in data. Never put `aggregateRating` in structured data (see [08-seo-analytics.md](08-seo-analytics.md)).
- **Directions link:** `https://www.google.com/maps/dir/?api=1&destination=` + URL-encoded
  `La Nueva Delicia, 93-16B 37th Ave, Jackson Heights, NY 11372`. Add `&destination_place_id=<ChIJ…>` once the Place
  ID is known (Q2).
- **Phone link:** `tel:+17186723456`.
- **Prices:** restaurant prices from the printed menu only, never app prices. Show the note "Precios en el
  restaurante; en las apps de domicilio pueden variar." / "In-restaurant prices; delivery app prices may differ."
- **Transit directions:** do not publish until verified by the owner (Q5).
