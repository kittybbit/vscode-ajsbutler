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
- 2026-04-22 implementation outcome:
  `buildAjsCommands(...)` now owns the supported `ajsshow` and `ajsprint`
  command DTO generation, and `buildUnitDefinition(...)` consumes that seam
  without changing the existing dialog DTO shape.
- 2026-04-23 builder outcome:
  command generation now also exposes structured builder metadata for the two
  supported commands. The show-unit-definition command tab renders that
  metadata as a small option builder and generates the command line from user
  selections, while keeping the previous `ajsshow -R <path>` and
  `ajsprint -a -R <path>` defaults.
- 2026-04-23 i18n outcome:
  command-builder labels and descriptions now resolve through the existing
  message resources, and each supported command carries English and Japanese
  manual URLs selected from the active UI language.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
