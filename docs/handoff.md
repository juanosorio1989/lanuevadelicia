# Handoff

Updated 2026-11-12.

## Done

- Spec approved by the owner: `docs/superpowers/specs/2026-11-12-website-design/` (README plus 10 pages).
- Plan: `docs/superpowers/plans/2026-11-12-website/` (routing table, 13 task files).
- Branch `website-mvp` (off `website-design`): Tasks 1–13 implemented and reviewed (each task review clean; Task 4
  had two independent reviews). Last task commit `d2d46ec`. Remote: `origin` = GitHub (SSH); the owner authorized
  pushing `website-mvp` after each passing task review.
- Lighthouse (devtools, mobile): /es/ 0.98–0.99, LCP ~2.05 s; /es/menu/ 0.99; /en/ 0.99. `npm run ci` green.

## Next

1. Final branch review of `website-mvp` (reviewer-opus), fix round if needed, then merge into `main` and push.
2. Deploy to Cloudflare Pages (ask the owner before creating the project). Set `NEXT_PUBLIC_GA_ID` (the owner has
   the GA4 measurement id and keeps it; production only, never in `.env.local`, which would break the no-GA e2e
   tests and add test hits to GA) and `NEXT_PUBLIC_SITE_URL`.
3. On the preview deploy: PageSpeed Insights check (spec 10 Q12), owner COPY-REVIEW of English copy.

## Open questions (owner)

See spec page 10: Q2 Place ID, Q3 reservations, Q4 holidays, Q5 transit, Q6 review highlights, Q7 calentado
descriptions, Q8 photo usage OK, Q9 vector logo, Q12 PSI LCP. Restaurant interior/exterior photos are expected
2026-11-13 in `assets-inbox/`.

- Q9: `assets-inbox/logo2.pdf` (2026-11-12) is a T-shirt "Made in Colombia" stamp. Its ring is vector, but the
  central plaque is raster (~980 px), so it does not answer Q9. The owner decided the stamp is for the T-shirt only,
  not the site. Still needed: the designer's original `.ai`/`.svg`/`.eps`.

## Notes

- `assets-inbox/` (~300 MB raw photos and the menu PDFs) and `.superpowers/` (mockups, SDD ledger) are gitignored
  and local only.
- Talk to the user in Spanish (they switch to English sometimes). Code and docs are English.
