# Handoff

Updated 2026-11-12.

## Done

- Brainstorm complete. The spec was **approved by the owner**:
  `docs/superpowers/specs/2026-11-12-website-design/` (README plus 10 pages).
- Implementation plan written: `docs/superpowers/plans/2026-11-12-website/` (README with the routing table, Global
  Constraints and Review Focus, plus 13 task files). It is waiting for owner review.
- Branch `website-design` holds the spec and plan commits. There is no Git remote yet.

## Next

1. The owner reviews the plan (in Spanish, in chat). Show the routing table before the first dispatch (lab rule).
2. Create branch `website-mvp` off `website-design`. Execute with superpowers:subagent-driven-development using the
   routing table (Task 4 → implementer-opus; the rest → implementer-sonnet; every review → reviewer-opus).
3. Ask the owner before creating a GitHub repo or pushing.

## Open questions (owner)

See spec page 10: Q2 Place ID, Q3 reservations, Q4 holidays, Q5 transit, Q6 review highlights, Q7 calentado
descriptions, Q8 photo usage OK, Q9 vector logo. Restaurant interior/exterior photos are expected 2026-11-13 in
`assets-inbox/`.

## Notes

- `assets-inbox/` (~300 MB raw photos and the menu PDFs) and `.superpowers/` (mockups) are gitignored and local only.
- Talk to the user in Spanish (they switch to English sometimes). Code and docs are English.
