# PLANS: align-jp1-v13-parameter-and-command-reference

## Objective

Move parameter interpretation and command generation onto explicit JP1/AJS3
version 13 reference-driven contracts.

## Scope

- align parameter parsing with the Definition File Reference
- separate command generation from `buildUnitDefinition.ts`
- expand generated command support incrementally using the Command Reference

## Milestones

1. Identify the current parameter and command seams
2. Define stable reusable contracts for parameter interpretation
3. Extract command generation behind a dedicated application-facing seam
4. Add manual-aligned coverage in small command and parameter slices
5. Update consumers such as show-unit-definition

## Validation

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
