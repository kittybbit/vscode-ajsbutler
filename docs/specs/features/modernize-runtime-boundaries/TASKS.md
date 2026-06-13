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

- Status: Blocked
- Scope:
  no active implementation task remains. Keep remaining modernization
  follow-ups blocked until a concrete compatibility, startup-time, payload, or
  maintenance need makes a new slice valuable enough to pass an approval gate.
- Acceptance:
  do not change runtime code, tests, dependencies, generated artifacts,
  configuration, or `engines.vscode` without a new approval gate.
- Validation:
  planning changes require `rtk pnpm run qlty`; future implementation requires
  the relevant build, unit, web, and package validation checks.

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
- [x] Compare the existing custom hash, the previously used `xxhash-wasm`
      dependency, the already-present `uuid` dependency, and adding another
      library.
- [x] Replace the custom `UnitEntity` hash implementation with deterministic
      `uuid` v5 identity and remove `xxhash-wasm`.
- [ ] Request new approval before any future runtime-boundary implementation
      change.

## Notes

- Current DTO transport does not require cyclic serialization.
- Bundle-size follow-up remains deferred until a clearer shrinking seam or
  stronger product requirement appears.
- `UnitEntity.id` is derived from `Unit.absolutePath()` through deterministic
  `uuid` v5 identity inside the wrapper layer.
- Normalized `AjsUnit.id` and `AjsUnit.parentId` are currently based on
  `absolutePath`, not on the wrapper hash. Current list, flow, table, reveal,
  and graph DTO selection paths reviewed in this investigation use normalized
  absolute-path identity and/or explicit `absolutePath` values.
- Existing list and flow tests use absolute-path-shaped normalized ids; no
  reviewed user-facing selection, navigation, or DTO path depends on the exact
  `UnitEntity.id` encoded hash value.
- The previous custom deterministic hash was dependency-free, synchronous, and
  worked under the CommonJS test compilation path; the approved replacement
  keeps deterministic synchronous behavior while reusing the existing `uuid`
  dependency.
- `uuid` remains in dependencies and is currently used for webview CSP nonces.
  A deterministic `uuid` implementation would need `v5`, not `v4`.
- A `uuid` v5 implementation would be synchronous, browser-capable through the
  package browser export, and would avoid adding a new dependency, but it would
  change `UnitEntity.id` from a 16-character hex string to an RFC UUID string.
- Earlier history used `xxhash-wasm` for `UnitEntity.id`, not `uuid`.
  Restoring it would be closer to the old hash-purpose dependency, but would
  reintroduce WebAssembly and initialization concerns into the wrapper layer.
- Adding a new hash library is not justified because `uuid` already covers the
  approved deterministic replacement path and the identity remains
  wrapper-internal.
- The approved implementation removes `xxhash-wasm` because it is no longer
  used after the `uuid` v5 replacement.
- The approved implementation adds targeted `UnitEntity.id` determinism tests
  and proves remaining reviewed wrapper-only consumers do not rely on the
  previous encoded hash string.
- No active modernization implementation approval remains after the completed
  `uuid` v5 identity slice.
