# AUDIT: align-jp1-v13-parameter-and-command-reference

## Purpose

Record the current implementation seams that already encode JP1/AJS3 version 13
parameter or command behavior before any alignment refactor changes that
behavior.

## Current Parameter Semantics Inventory

### Stable entry seam

- `src/domain/models/parameters/ParameterFactory.ts` is already the stable
  parameter-construction facade for wrapper callers.
- The facade is organized by builder family rather than by manual chapter:
  optional scalar, optional array, required scalar, schedule-rule, and
  transfer-operation builders.

### Shared semantics already centralized

- `src/domain/models/parameters/parameterHelpers.ts` is the main shared
  interpretation seam today.
- The helpers already centralize these JP1-facing behaviors:
  inherited lookup from ancestor units
  root-jobnet-only defaults for `rg`, `sd`, `ncl`, `ncs`, and `ncex`
  connector-control default application modes
  transfer-operation fallback resolution for `top1` to `top4`
  schedule-rule sorting and `sd`-aligned schedule parameter expansion
  required vs optional parameter resolution
- `src/domain/models/parameters/Defaults.ts` is the single table for raw
  default values that those helpers apply.

### Builder families that already encode semantics

- `optionalScalarParameterBuilders.ts` already separates three existing
  behaviors without viewer coupling:
  plain optional lookup
  inherited optional lookup
  default-aware optional lookup, including root-jobnet-aware defaults
- `optionalArrayParameterBuilders.ts` already centralizes array lookup and the
  inherited array cases that exist today, notably `cl` and `op`.
- `ruleParameterBuilders.ts` already centralizes schedule-rule-bearing
  parameters:
  sorted rule arrays such as `ln`
  root-default-aware `sd`
  `sd`-aligned empty-value families such as `cy`, `ey`, `sh`, and `sy`
  `sd`-aligned default-value families such as `cftd`, `shd`, `st`, `wc`, and
  `wt`

### Current gaps in the parameter audit

- The current code organizes semantics by construction pattern, not by an
  explicit JP1/AJS3 version 13 parameter coverage matrix.
- Unit-type restrictions are still mostly implicit in wrapper ownership and
  builder usage rather than recorded as manual-aligned support statements.
- There is not yet one doc that states which parameter keys are:
  already aligned
  partially aligned
  intentionally deferred
  known mismatches

## Current Command-Generation Inventory

### Current owning seam

- `src/application/unit-definition/buildUnitDefinition.ts` currently owns both
  dialog assembly and command generation.
- The same function builds:
  `rawData` by joining normalized unit parameters as `key=value` lines
  `commands` as presentation-ready DTOs for the unit-definition dialog

### Currently supported auto-generated commands

- The current implementation auto-generates exactly two commands:
  `ajsshow -R <absolutePath>`
  `ajsprint -a -R <absolutePath>`
- The command input is the normalized `AjsUnit.absolutePath`, so the current
  behavior already depends on stable application-facing data rather than
  webview component state.
- `buildUnitDefinitionByPath(...)` precomputes the same dialog DTO per
  `absolutePath`, which means command generation is already reusable in shape
  but not yet extracted as its own contract.

### Current coupling to show-unit-definition

- `UnitDefinitionDialogDto` embeds command DTOs directly, so command support is
  still modeled as a property of the dialog payload instead of a dedicated
  command-generation result.
- `src/test/suite/buildUnitDefinition.test.ts` verifies command strings only
  through the dialog builder, so command behavior cannot yet be tested or
  evolved independently from dialog assembly.
- No separate application service or use case names the supported command set,
  which keeps the current scope implicit.

## Decision For The First Extracted Command Set

- Preserve the current user-visible command set as the first supported
  auto-generated contract:
  `ajsshow`
  `ajsprint`
- This is the safest first extraction because:
  both commands already exist in shipped behavior
  both are read-only and fit the current docs-only audit scope
  the existing normalized `absolutePath` input is already sufficient

## Mismatch Tracking Rule

- Track future manual alignment one small slice at a time inside this feature
  folder instead of hiding gaps in code comments.
- For every parameter or command slice, record:
  the JP1 key or command name
  the source reference section
  current status as `aligned`, `partial`, `mismatch`, or `deferred`
  the owning code seam
  the regression evidence or missing test
- Until a dedicated matrix file is needed, keep that status in
  `TASKS.md` notes and update it in the same commit as the behavior or doc
  change.
