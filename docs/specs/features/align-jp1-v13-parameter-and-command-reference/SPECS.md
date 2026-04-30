# SPECS: align-jp1-v13-parameter-and-command-reference

## Purpose

Align parameter interpretation and `ajs` command generation to named
JP1/AJS3 version 13 reference documents.

## Origin

- Source use case: docs/requirements/use-cases/uc-interpret-jp1-parameters.md
- Source use case: docs/requirements/use-cases/uc-generate-ajs-commands.md
- Related use case: docs/requirements/use-cases/uc-show-unit-definition.md

## Acceptance Criteria

- JP1/Automatic Job Management System 3 version 13 is named explicitly as the
  target product version
- parameter parsing scope is tied to the Definition File Reference
- command generation scope is tied to the Command Reference
- `buildUnitDefinition.ts` no longer needs to own command-generation logic as
  an inseparable concern
- reference alignment can proceed incrementally without hiding known gaps

## Implementation Notes

- prefer isolating reusable parameter and command semantics in domain or
  application seams rather than viewer-specific helpers
- keep command generation reusable so show-unit-definition is one consumer, not
  the owner of the logic
- when manual coverage is partial, document supported commands and remaining
  gaps explicitly in `TASKS.md`
- avoid bundling these reference-alignment slices with unrelated flow-graph or
  package-manager work

## Durable Impact Analysis

- Unit-type-specific defaults must not be collapsed into a single global
  default when the JP1/AJS3 version 13 `ajsprint -a` default values table
  distinguishes a unit family.
- HTTP Connection job `eu` is approval-sensitive because the generic
  `DEFAULTS.Eu` value is shared by many job families, while the `ajsprint -a`
  default values table lists HTTP Connection job `Eu` separately as `def`.
- A focused helper seam is preferred over changing `DEFAULTS.Eu` globally so
  non-HTTP job families continue to preserve their existing `ent` default.
- JP1 event sending job `evsrc` is approval-sensitive because the current
  generic default is `0`, while the JP1/AJS3 version 13 event sending job
  definition says omitted `evsrc` is assumed as `10`.
- Normalized unit-list projection currently reads event sending job parameters
  from normalized raw key/value data, so default-aware wrapper changes do not
  automatically change list projection unless that boundary is explicitly in
  scope.
- QUEUE job transfer-file alignment is approval-sensitive because `Qj` / `Rq`
  expose `ts1` to `ts4` and `td1` to `td4`, while the related UNIX/PC job and
  UNIX/PC custom job definitions also define `top1` to `top4`. The QUEUE job
  slice must preserve that distinction and must not broaden `topN` default
  derivation to wrappers whose manual section does not define `topN`.
- Job end-judgment `wth` alignment is approval-sensitive because the current
  factory preserves a legacy lookup from `wth` to the schedule-rule `wt`
  parameter. Correct alignment should read explicit `wth` values without
  synthesizing omitted values and without changing schedule-rule `wt`
  projection.
- `PARAMETER_COVERAGE_MATRIX.md` is the feature-local status index for
  investigated categories. It is intentionally narrower than `ParamFactory`
  and must not be read as repository-wide JP1/AJS3 parameter coverage.
- Schedule-rule `wc` / `wt` pairing is approval-sensitive because the current
  wrappers expose both values independently, while the JP1/AJS3 version 13
  jobnet definition treats `no` in either parameter as invalidating the paired
  start-condition monitoring value. Any implementation must distinguish raw
  parameter preservation from effective-value interpretation.
- Unit-list group 10 `wc` / `wt` projection is a separate approval-sensitive
  boundary from domain interpretation because it is user-visible table output.
  If approved, it should consume the existing paired effective-value semantics
  while preserving parser output, raw domain wrapper values, and normalized raw
  parameter storage.
- JP1 event sending job unit-list group 14 projection is a separate
  approval-sensitive boundary from domain defaults because it is user-visible
  table output. If approved, it should consume the existing wrapper/default
  semantics for `evssv`, `evsrt`, `evspl`, and `evsrc` while preserving parser
  output and normalized raw parameter storage.

## Reference Documents

- Definition File Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0211.HTM)
- Command Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0067.HTM)

## Non-Goals

- claiming support for every JP1/AJS3 command in one change
- mixing reference-alignment work with unrelated dependency modernization
- hiding version-specific assumptions behind generic "latest JP1" wording
