# Qlty-Driven Architecture Refactoring Tasks

## Current Task

- Status: Proposed
- Scope:
  decide whether another qlty-driven architecture refactoring slice should be
  proposed.
- Acceptance:
  do not continue Qlty-driven refactoring for shape-only smells. Prefer a
  small behavior-preserving slice only when Qlty findings map to a coherent
  responsibility, boundary, application use case, adapter concern, or
  maintainability risk.
- Validation:
  for the next code slice, run `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  none

Implementation must not start while Status is Pending. Only clear human
approval can change Status from Pending to Approved.

## Decision Notes

- Recheck `rtk qlty metrics --sort complexity` and `rtk qlty smells` before
  selecting any next slice.
- After Slice-6-F, `rtk qlty metrics --sort complexity` reports
  `src/domain/models/parameters/parameterHelpers.ts` at complexity 30 and
  `src/domain/models/parameters/parameterScheduleRuleHelpers.ts` at complexity 11.
- Remaining reported DTO and domain-unit duplication smells should stay
  candidate signals only. Do not extract shared code from them unless a future
  slice identifies a stronger shared JP1/AJS business concept, use-case need,
  adapter boundary, or maintainability risk than shape similarity alone.
- After Slice-4A/4B, `rtk qlty metrics --sort complexity` reports
  `src/application/unit-definition/buildAjsCommands.ts` at complexity 27.
  The command builder file is lower than WebAPI/import, unit-list helper, and
  UI flow files, but it maps cleanly to the existing
  `uc-generate-ajs-commands` application use case and can be sliced without
  crossing active WebAPI beta or flow-view presentation work.
- `rtk qlty smells` still reports shape-only domain-unit duplication and one
  helper parameter-count finding. Those are not selected for the next slice
  because the current stronger boundary candidate is command-generation
  definition data versus command-line token assembly.
- `docs/requirements/use-cases/uc-build-flow-graph.md` already carries the
  durable expanded-flow behavior contract preserved by recent layout slices.
- `docs/requirements/use-cases/uc-interpret-jp1-parameters.md` already carries
  the durable behavior contract for context-sensitive parameter and
  schedule-rule interpretation.
- **Slice-3 parameterHelpers.ts Investigation (2026-06-12)**:
  - Complexity 30 is shape-derived (18 export functions with repeated builder
    patterns: buildOptional, buildRequired, buildInherited, etc.) not
    responsibility-driven.
  - Candidate separation A (Parameter Resolution Logic / builders) would
    require extraction but all callsites depend on combined resolution +
    mapping, reducing benefit.
  - Candidate separation B (builder facades from resolution) adds file
    coupling without domain concept clarity.
  - Per TASKS.md guidance, shape-only extraction is not justified when
    stronger JP1/AJS business concept or maintainability risk is absent.
  - UC-INTERPRET-JP1-PARAMETERS is already documented; no missing behavior
    contract.
  - **Decision**: Skip parameterHelpers.ts as Slice-3 candidate.
- **Slice-3 Status**: Appears complete. unitPriorityHelpers.ts was the
  initial domain-helper simplification target; no remaining domain helper
  extraction has both significant complexity reduction opportunity AND clear
  JP1/AJS business concept boundary justification.
- Slice-4A and Slice-4B are complete as behavior-preserving application-layer
  refactors. Slice-4A split editor-feedback diagnostic builders by rule
  responsibility; Slice-4B split unit-list row projection helpers and
  default-aware parameter projection helpers.
- Slice-4C is proposed because `buildAjsCommands.ts` currently mixes command
  builder definition data, shared option construction helpers, token assembly,
  and default command DTO projection in one application module.
- Slice-4C is complete as a behavior-preserving application-layer refactor.
  It split command builder DTO types, static ajsshow/ajsprint builder
  definitions, and command-line token assembly while preserving public exports
  and command text.

## Use-Case Back-Propagation

- No use-case update is currently pending for Slice-3.
- No use-case update is pending for Slice-4A or Slice-4B because the changes
  preserve existing diagnostic DTOs, diagnostic messages, `UnitListRowView`
  shape, and row projection behavior.
- No use-case update is expected for Slice-4C if it remains
  behavior-preserving. Update `uc-generate-ajs-commands.md` and
  `uc-show-unit-definition.md` before implementation if command text,
  supported options, localization keys, manual links, or dialog behavior
  change.
