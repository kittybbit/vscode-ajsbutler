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

## Current Slice

- 2026-04-20 audit outcome:
  the inventory pass is now recorded in `AUDIT.md`. Shared parameter
  interpretation already lives mainly behind `ParamFactory`,
  `parameterHelpers.ts`, the builder-family modules, and `Defaults.ts`,
  while command generation is still directly embedded in
  `buildUnitDefinition.ts`.
- 2026-04-20 next implementation slice:
  extract the existing `ajsshow` and `ajsprint` command generation into a
  dedicated application-facing seam without changing the dialog DTO contract,
  then use that seam as the first reusable command-generation contract for
  `show-unit-definition`.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
