# Feature Plan: qlty-driven-architecture-refactoring

## Objective

Reduce architectural complexity, duplication, and maintainability risk by
converting Qlty findings into small, behavior-preserving refactoring slices.

## Scope

- Qlty check, metrics, and smell findings
- UI, application, and domain helper boundaries
- Behavior-preserving refactoring with SDD approval gates

## Out Of Scope

- Product behavior changes
- Parser grammar or generated parser changes
- Dependency upgrades
- Raising `engines.vscode`

## Impact Summary

- Change targets:
  `src/ui-component`, `src/application`, `src/domain`, and SDD documents
- Affected features:
  flow viewer, unit-list projection, command builders, diagnostics, helper
  orchestration
- Validation:
  code changes require `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`

## Approval Scope Summary

- Approval status:
  see TASKS.md `Human Approval`
- Approved scope:
  none while approval is pending
- Scope guard:
  stop and request additional approval before changing anything outside the
  approved scope

## Milestones

1. Slice-0 repository hygiene and baseline cleanup
2. Slice-1A flow-viewer controller responsibility split
3. Slice-1B flow-viewer layout/component complexity reduction
4. Slice-2 application orchestration reduction
5. Slice-3 domain helper simplification

## Completed Summary

- Slice-1A and Slice-1B are complete.
- Slice-2 has completed unit-list projection, parser/helper, command-builder,
  calendar/schedule projection, editor-feedback rule-builder, and
  schedule-date validator reductions through Slice-2-X.
- This plan keeps only completed-scope information that helps future
  sequencing or risk decisions; durable boundaries are kept in SPECS.md and
  current execution state is kept in TASKS.md.

## Current Slice Candidate

No current runtime slice is selected. Slice-2 should next choose between
`syntaxDiagnosticRuleBuilders`, `syntaxDiagnosticScalarValidators`, or closing
application orchestration work and moving to the next slice.

- Recent result:
  Slice-2-Y preserved `ln`, `cftd`, and `wc` diagnostics while extracting
  shared explicit schedule-rule parsing, numeric range validation, and `cftd`
  rule-table validation helpers. Targeted Qlty smell output no longer reports
  `isValidExplicitParentScheduleRule`, `isValidExplicitScheduleByDaysFromStart`,
  or `isValidExplicitWaitCount`.
- Metrics note:
  `syntaxDiagnosticScheduleRules.ts` changed from 35 funcs / cyclo 193 /
  complexity 111 / LOC 389 to 40 funcs / cyclo 183 / complexity 93 / LOC 405.
  The function-count increase is accepted for this slice because it removes
  the targeted branch-heavy smell cluster and lowers cyclomatic and aggregate
  complexity.

## Risks To Control

- Over-extraction may reduce readability
- Complexity reduction may accidentally change runtime behavior
- Qlty optimization may diverge from architectural clarity
