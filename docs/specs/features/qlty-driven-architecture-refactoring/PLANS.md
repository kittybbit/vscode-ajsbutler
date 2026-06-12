# Feature Plan: qlty-driven-architecture-refactoring

## Objective

Reduce architectural complexity, duplication, and maintainability risk by
using Qlty findings as candidate signals for behavior-preserving refactors.

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
6. Slice-4 application-layer rule building and list orchestration
7. (deferred) Slice-5+ future domain/application layers only when Qlty findings map to coherent responsibilities and use-case contracts

## Proposed Slice-4 Candidates

Slice-4A and Slice-4B are complete. Before any additional Slice-4
implementation, new human approval is required.

### Candidate A: Editor-Feedback Rule Building Orchestration

**Affected files** (total complexity 108):

- `src/application/editor-feedback/syntaxDiagnosticScheduleDateRules.ts` (31)
- `src/application/editor-feedback/syntaxDiagnosticScheduleRules.ts` (29)
- `src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts` (26)
- `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` (22)

**Responsibility cluster**:
Validation rule definitions and builders for JP1/AJS parameter and event rules;
multiple specialized rule types (schedule, date, event) bundled with orchestration
logic.

**Investigation completed (2026-06-12)**:

_Architecture Analysis_:

- RuleBuilders.ts (417 lines) implements 8 rule-type-specific DTO builder
  functions (buildScheduleRuleDiagnostics, buildJobEndJudgmentDiagnostics, etc.)
- Validation logic is already separated: ScheduleDateRules.ts (204 lines),
  ScheduleRules.ts (336 lines), EventRules.ts (171 lines).
- RuleBuilders complexity arises from: (a) repeated orchestration pattern
  (findUnitsByTypes → validate → return), (b) context-specific validation
  helper functions (collectJobEndJudgmentRetryGateDiagnostics,
  getJobEndJudgmentContext).
- RuleSets.ts aggregates rule definitions by type, imported by RuleBuilders.

_Separation Feasibility_:

- Vertical split (by rule type): Move context-specific validation helpers into
  per-rule-type files (scheduleRuleDiagnostics.ts, jobEndJudgmentDiagnostics.ts,
  etc.). Result: simplifies RuleBuilders.ts but is primarily a file
  organization change, not an architectural clarity improvement.
- Horizontal split (by validation phase): Separate orchestration from
  context-specific validation. Result: increases file coupling,
  complexity reduction marginal.

_Use-Case Assessment_:

- uc-provide-editor-feedback.md documents "semantic JP1/AJS3 rules" and "DTOs"
  contract; does not require rule-type separation.
- Separation does not reflect a new use-case boundary or a JP1/AJS
  business-concept subdivision.

**Decision**: Implemented as Slice-4A. Diagnostic builder orchestration now
delegates schedule, job-end judgment, and remaining rule-type builders to
focused application modules while preserving diagnostic messages and DTO shape.

### Candidate B: Unit-List Row Projection and Group Builder Separation

**Affected files** (total complexity 61):

- `src/application/unit-list/unitListViewHelpers.ts` (34)
- `src/application/unit-list/buildUnitListRemainingGroups.ts` (27)

**Responsibility cluster**:
Stable row projection for the unit list view, including group-specific
field mapping, job-type-aware default projection, and schedule/priority
parsing used by table row consumers and CSV export.

**Investigation outcome**:

- `buildUnitListView.ts` is the application-facing use-case boundary for
  building `UnitListRowView[]`.
- `buildUnitListRemainingGroups.ts` currently consolidates remaining group
  builders for group1/2/3/4/5/8/9/12/13/14/15/16/17/18/19.
- `unitListViewHelpers.ts` provides shared schedule, priority, and calendar
  transformation helpers used by group builders.
- This candidate maps to a coherent responsibility: application-layer row
  projection for the unit-list use case, not a shape-only file organization
  problem.

**Proposed Slice-4B implementation path**:

1. Preserve `buildUnitListView.ts` as the row-view assembly boundary and keep
   the `UnitListRowView` shape stable.
2. Extract `buildUnitListRemainingGroups.ts` group builders into smaller
   focused modules by feature area, for example:
   - structural metadata and path/group fields
   - dependency/link fields and group2
   - default-aware job-type projections for group13/group14/group15
   - HTTP/job-specific fields for group16/group17/group18/group19
3. Extract default-aware parameter resolution helpers into a dedicated
   helper module so the group builders become simpler and the unit-type
   rules are easier to reason about.
4. Retain schedule/priority parsing utilities in `unitListViewHelpers.ts`,
   or split them into a distinct `unitListScheduleHelpers.ts` if reuse and
   clarity demand it.
5. Preserve current tests and add regression coverage around group-view
   projections and the full `buildUnitListView` output.

**Validation focus**:

- preserve row shape and table rendering behavior
- maintain desktop/web parity for unit list view data
- keep presentation-specific formatting out of application projection logic
- keep the refactor behavior-preserving through existing unit-list tests

**Decision**: Implemented as Slice-4B. Unit-list group builders and
default-aware parameter projection helpers now live in focused application
modules while preserving `UnitListRowView` shape.

### Candidate C: Unit-Definition Command Building (lower priority)

**Affected file** (complexity 27):

- `src/application/unit-definition/buildAjsCommands.ts`

**Responsibility**:
JP1/AJS command-line generation from unit definitions.

**Status**:
Single-file candidate; lower priority after Slice-4A and Slice-4B completion.

## Completed Summary

- Slice-1A and Slice-1B are complete.
- Slice-2 is complete. It reduced unit-list projection, parser/helper,
  command-builder, calendar/schedule projection, editor-feedback rule-builder,
  schedule-date validator, rule-builder orchestration, and scalar-validator
  input-shape findings through Slice-2-AB.
- Slice-3 domain-helper simplification is complete. It addressed
  `unitPriorityHelpers.ts` as the domain extraction target; remaining domain
  helpers (e.g., `parameterHelpers.ts`) show shape-only complexity without
  clear JP1/AJS business concept boundaries.
- Slice-4A and Slice-4B are complete. They split editor-feedback diagnostic
  builder responsibilities and unit-list row projection helpers without
  changing observable behavior.
- This plan keeps only completed-scope information that helps future
  sequencing or risk decisions; durable boundaries are kept in SPECS.md and
  current execution state is kept in TASKS.md.

## Risks To Control

- Over-extraction may reduce readability
- Complexity reduction may accidentally change runtime behavior
- Qlty optimization may diverge from architectural clarity
