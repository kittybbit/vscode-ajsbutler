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

- Status: Proposed
- Scope:
  investigate the i18n and AJS metadata boundary, then propose the first
  behavior-preserving implementation slice.
- Acceptance:
  impact investigation names affected locale resources, table column
  definitions, unit type label consumers, tests, compatibility risks, and
  alternatives before runtime code or tests are edited.
- Validation:
  docs-only feature intake requires `rtk pnpm run qlty`.

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

- [ ] Complete impact investigation for i18n resolver, AJS table column
      metadata, unit type metadata, and affected UI consumers.
- [ ] Decide whether unit type codes and label helpers belong in domain,
      application, or presentation for the first slice.
- [ ] Request human approval for the first implementation slice before editing
      runtime code, tests, generated artifacts, or configuration.
- [ ] Preserve current labels except for explicitly approved data-defect
      corrections such as unintended leading whitespace.
- [ ] Update or add focused tests for fallback resolution, structured column
      metadata access, and unknown unit type fallback behavior after approval.

## Validation

- [ ] Run `rtk pnpm run qlty` for feature intake.
- [ ] For implementation slices, run relevant unit tests and the required
      code-validation sequence from `docs/specs/README.md` unless the approved
      scope narrows validation with documented rationale.

## Use-Case Back-Propagation

- No durable use-case update is needed while the feature only changes internal
  metadata boundaries and preserves observable labels.
- Update `docs/requirements/use-cases/uc-build-unit-list-view.md` or
  `docs/requirements/use-cases/uc-show-unit-definition.md` if a future slice
  changes observable column labels, unit type display behavior, or fallback
  behavior.
