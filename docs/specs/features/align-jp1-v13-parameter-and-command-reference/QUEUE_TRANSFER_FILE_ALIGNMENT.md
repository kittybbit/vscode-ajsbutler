# QUEUE Transfer File Alignment

## Purpose

Record the JP1/AJS3 version 13 investigation for QUEUE job transfer-file
parameters as the next non-schedule parameter family after the schedule-rule,
transfer-operation, job end-judgment, HTTP Connection job, and JP1 event
sending job slices.

This slice covers only the QUEUE job `ts1` to `ts4` and `td1` to `td4`
parameters.

## Manual References

- JP1/Automatic Job Management System 3 version 13 Command Reference,
  5.2.7 QUEUE job definition:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM>
- Related non-QUEUE comparison: 5.2.6 UNIX/PC job definition and 5.2.24
  UNIX/PC custom job definition define `top1` to `top4` in addition to
  `ts1` to `ts4` and `td1` to `td4`.

## Current Code Seams

- `src/domain/models/units/Qj.ts` exposes `ts1` to `ts4` and `td1` to `td4`
  through `ParamFactory`, but it does not expose `top1` to `top4`.
- `src/domain/models/parameters/ParameterFactory.ts` routes `tsN` and `tdN`
  through optional scalar builders for all wrappers that expose those keys.
- `src/domain/models/parameters/transferOperationHelpers.ts` owns `topN`
  default resolution, but that helper is intentionally limited to wrappers
  whose definitions include `topN`.
- `src/application/unit-list/buildUnitListRemainingGroups.ts` projects group
  15 transfer columns from normalized raw parameters, including `ts1`, `td1`,
  and `top1`.

## Impact Investigation

- QUEUE job definitions include `ts1` to `ts4` and `td1` to `td4`, but not
  `top1` to `top4`.
- Existing `Qj` / `Rq` wrappers already preserve this boundary by exposing
  transfer source and destination parameters without transfer operation
  getters.
- Existing `buildTopParameter` behavior must not be broadened to QUEUE jobs
  because doing so would synthesize `topN` behavior that the QUEUE job
  definition does not define.
- Group 15 projection remains raw normalized data. Explicit `tsN` and `tdN`
  values can appear for QUEUE jobs, while `topN` remains absent unless the raw
  definition contains it.

## Planned Alignment

- Add focused regression evidence that `Qj` / `Rq` expose explicit `tsN` and
  `tdN` values while not exposing or deriving `topN`.
- Keep `topN` default derivation limited to UNIX/PC job and UNIX/PC custom job
  wrappers.
- Do not add QUEUE-specific diagnostics, byte-length validation, macro
  validation, or parser grammar changes in this slice.
- Do not change normalized unit-list projection to synthesize transfer
  operation defaults.

## Alternatives

- Add `topN` getters to `Qj` / `Rq`: rejected because the QUEUE job definition
  does not define `top1` to `top4`.
- Change group 15 projection to hide `tsN` / `tdN` for QUEUE jobs: rejected for
  this slice because current projection is raw and behavior-preserving.
- Defer QUEUE transfer-file coverage until a repository-wide parameter matrix:
  possible, but less useful than adding focused regression evidence for a
  documented follow-up boundary.

## Follow-up

- Add value and byte-length validation only after invalid JP1/AJS parameter
  behavior is specified as diagnostics, warnings, or raw preservation.
- Revisit whether group 15 should become unit-type-aware only as a separate
  unit-list behavior slice.

## Group 15 Projection Candidate

### Current Behavior

- `Qj` / `Rq` wrappers do not expose `top1` to `top4`.
- Unit-list group 15 reads normalized raw `top1` to `top4` values for every
  unit type.
- If a QUEUE job definition contains raw `topN` values, group 15 can display
  those transfer-operation values even though the QUEUE job manual section
  does not define them.

### Proposed Behavior

After human approval:

- keep displaying explicit `ts1` to `ts4` and `td1` to `td4` values for
  `qj` / `rq`;
- hide `top1` to `top4` group 15 transfer-operation values for `qj` / `rq`;
- preserve non-QUEUE group 15 transfer-operation projection;
- preserve raw parser output and normalized key/value storage.

### Impact

- User-visible table output changes only for QUEUE jobs that contain raw
  `top1` to `top4` values.
- The projection behavior becomes aligned with the existing `Qj` / `Rq`
  wrapper boundary and the JP1/AJS3 version 13 QUEUE job definition.
- Parser grammar, generated artifacts, diagnostics, and command generation are
  unchanged.

### Projection Alternatives

- Keep group 15 raw by design and leave the matrix gap visible.
- Add `topN` getters to `Qj` / `Rq`, rejected because the QUEUE job definition
  does not define `top1` to `top4`.
- Add diagnostics for raw `topN` on QUEUE jobs instead of changing projection,
  deferred until editor-feedback behavior explicitly owns invalid JP1/AJS
  parameter handling.
