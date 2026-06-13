# TASKS: modernize-runtime-boundaries

## Sync Rule

- Update this file in the same commit whenever a durable requirement or
  follow-up decision changes.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Task

- Status: Proposed
- Scope:
  decide whether a future `UnitEntity` hash implementation replacement is
  valuable enough to propose as a behavior-preserving implementation slice.
- Acceptance:
  only propose implementation after confirming the replacement preserves
  wrapper identity expectations and does not affect normalized AJS selection,
  navigation, flow/table DTO keys, or user-visible behavior. Do not change the
  hash implementation, dependencies, generated artifacts, runtime code, tests,
  or `engines.vscode` without a new approval gate.
- Validation:
  planning changes require `rtk pnpm run qlty`; any future implementation
  requires the relevant build, unit, web, and package validation checks.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Record delivered runtime-boundary modernization outcomes in durable SDD
      documents.
- [x] Refresh identity and compatibility checks before proposing a hash
      replacement slice.
- [ ] Request new approval before any `UnitEntity` hash implementation change.

## Notes

- Current DTO transport does not require cyclic serialization.
- Bundle-size follow-up remains deferred until a clearer shrinking seam or
  stronger product requirement appears.
- `UnitEntity.id` is derived from `Unit.absolutePath()` through the current
  custom deterministic hash inside the wrapper layer.
- Normalized `AjsUnit.id` and `AjsUnit.parentId` are currently based on
  `absolutePath`, not on the wrapper hash. Current list, flow, table, reveal,
  and graph DTO selection paths reviewed in this investigation use normalized
  absolute-path identity and/or explicit `absolutePath` values.
- Existing list and flow tests use absolute-path-shaped normalized ids; no
  reviewed user-facing selection, navigation, or DTO path depends on the exact
  `UnitEntity.id` encoded hash value.
- Any future hash replacement should still add or confirm targeted
  `UnitEntity.id` determinism tests and prove remaining wrapper-only consumers
  do not rely on the current encoded hash string.
