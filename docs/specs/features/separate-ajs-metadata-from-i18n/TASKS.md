# TASKS: separate-ajs-metadata-from-i18n

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Task

- Status: Pending
- Scope:
  no active implementation task is approved.
- Acceptance:
  define a new task and obtain approval before editing runtime code, tests,
  generated artifacts, or configuration.
- Validation:
  future implementation slices must follow the validation guidance in
  `docs/specs/README.md`.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Complete the approved unit type label helper slice.
- [x] Complete impact investigation for AJS table column metadata and affected
      table column definition consumers.
- [x] Request human approval for the next implementation slice before editing
      runtime code, tests, generated artifacts, or configuration.
- [x] Complete the approved all-group AJS table column label accessor expansion.
- [x] Request human approval for removing remaining flat column label key
      literals from table column definition files.
- [x] Complete the approved flat table column label key literal removal.

## Decision Notes

- Direct `ajsTableColumnHeader[...]` access appeared in all table
  column group definition files under
  `src/ui-component/editor/ajsTable/columnDefs/`; the approved expanded slice
  removes that direct resource access from every group file in one mechanical
  pass.
- The final table column label slice replaced flat label key lookups in
  `src/ui-component/editor/ajsTable/columnDefs/group*.ts*` with structured
  accessors such as `labels.column(1)` and
  `labels.subgroup(1).column(2)`.
- Table label accessors remain in the existing shared i18n/resource boundary
  and browser-safe. Moving column metadata into domain remains deferred until a
  later slice proves the metadata expresses JP1/AJS semantics beyond
  presentation labels.
- The completed slices preserve parser, normalized model, CSV, flow,
  diagnostics, hover, telemetry, WebAPI, and VS Code compatibility behavior.
- Affected symbols and components:
  `AjsTableColumnLabelAccessor`, `AjsTableColumnGroupLabels`,
  `ajsTableColumnLabels`, and table column group definition functions.
- Compatibility risk:
  low if the change preserves column ids and label resource values, stays pure
  TypeScript, avoids new dependencies, and does not touch parser, DTO/schema,
  host APIs, or runtime behavior outside table column label lookup.
- Moving all column metadata into domain remains too broad for the current
  evidence because many columns are presentation table structure rather than
  JP1/AJS domain concepts.
- A pre-existing `group10.tsx` column id typo (`grsoup10.col7`) was observed
  during review but left unchanged because it is outside this metadata-boundary
  slice.

## Validation

- The unit type label helper slice passed `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- The all-group table column label accessor slice passed `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- The flat table column label key literal removal slice passed
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`; the build retained pre-existing webpack bundle size
  warnings.
- Future implementation slices must run relevant unit tests and the required
  code-validation sequence from `docs/specs/README.md` unless the approved
  scope narrows validation with documented rationale.

## Use-Case Back-Propagation

- No durable use-case update is needed while the feature only changes internal
  metadata boundaries and preserves observable labels.
- The completed unit type label helper slice preserves observable labels except
  for the explicitly approved English leading-whitespace data defect
  correction, so no use-case update is needed.
- Update `docs/requirements/use-cases/uc-build-unit-list-view.md` if a future
  slice changes observable column labels or fallback behavior.
- No use-case update was needed for the flat-key-literal removal because it
  preserved existing observable column labels and column ids.
