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

- Status: Complete
- Scope:
  no active approved implementation task remains after completing the unit type
  label accessor slice and the all-group AJS table column label accessor
  expansion.
- Acceptance:
  future work must start with a fresh impact investigation and approval before
  editing runtime code, tests, generated artifacts, or configuration.
- Validation:
  code changes must continue to follow `docs/specs/README.md`: `rtk pnpm run
qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.

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

## Decision Notes

- Direct `ajsTableColumnHeader[...]` access appeared in all table
  column group definition files under
  `src/ui-component/editor/ajsTable/columnDefs/`; the approved expanded slice
  removes that direct resource access from every group file in one mechanical
  pass.
- Table label accessors remain in the existing shared i18n/resource boundary
  and browser-safe. Moving column metadata into domain remains deferred until a
  later slice proves the metadata expresses JP1/AJS semantics beyond
  presentation labels.
- The completed slices preserve parser, normalized model, CSV, flow,
  diagnostics, hover, telemetry, WebAPI, and VS Code compatibility behavior.
- A pre-existing `group10.tsx` column id typo (`grsoup10.col7`) was observed
  during review but left unchanged because it is outside this metadata-boundary
  slice.

## Validation

- The unit type label helper slice passed `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- The all-group table column label accessor slice passed `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
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
- No use-case update is needed for the expanded column label accessor slice
  while it preserves existing observable labels.
