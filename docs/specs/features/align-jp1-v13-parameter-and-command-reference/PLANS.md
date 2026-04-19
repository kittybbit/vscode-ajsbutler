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

- 2026-04-19 next slice decision:
  start with an audit pass before behavior changes. Inventory the current
  parameter semantics that already match the JP1/AJS3 version 13 Definition
  File Reference, inventory the current command-generation behavior and its
  coupling to `buildUnitDefinition.ts`, and use that evidence to choose the
  first reusable extraction or supported-command slice without hiding known
  mismatches.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
