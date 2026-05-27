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
- Slice-2 is complete. It reduced unit-list projection, parser/helper,
  command-builder, calendar/schedule projection, editor-feedback rule-builder,
  schedule-date validator, rule-builder orchestration, and scalar-validator
  input-shape findings through Slice-2-AB.
- Slice-3 domain-helper simplification has started with
  `unitPriorityHelpers.ts` as the first completed candidate.
- This plan keeps only completed-scope information that helps future
  sequencing or risk decisions; durable boundaries are kept in SPECS.md and
  current execution state is kept in TASKS.md.

## Current Slice Candidate

Slice-3-F implementation is pending human approval.

- Recent result:
  Slice-3-E changed `transferOperationHelpers.ts` to resolve `topN` default
  raw values through a local source/destination presence table.
- Current evidence:
  targeted smell output for `ScheduleRule.ts` reports `Sd.type`
  many-returns/high-complexity findings and same-file duplication in
  schedule-rule parameter classes. Current metrics are 8 classes / 24 funcs /
  cyclo 35 / complexity 16 / LOC 179.
- Current decision:
  wait for approval before refactoring `ScheduleRule.ts`.

## Risks To Control

- Over-extraction may reduce readability
- Complexity reduction may accidentally change runtime behavior
- Qlty optimization may diverge from architectural clarity
