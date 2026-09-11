# Feature Specification: Semantic Diff Job-Group Identity

## Purpose

Make Semantic Diff reflexive for normalized definitions containing repeated
nested job-group names by giving `g` and `mg` units path-based exact identity,
without weakening conservative ambiguity handling for genuinely duplicate
paths.

## Minimal Context

- Current decision: distinguish nested job groups by canonical hierarchy path
  and unit type before fingerprint fallback.
- Feature kind: transient branch feature for the non-trivial bugfix on
  `codex/semantic-diff-job-group-identity`.
- Selected feature folder:
  `docs/specs/features/semantic-diff-job-group-identity/`.
- Read first: this file, `TASKS.md`, and
  `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- Read `TRACEABILITY.md` only when planning or validating a requirement.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Source: reproduced Semantic Diff reflexivity bug. Parsing and comparing
  `sample/sample1_large_utf8` with itself produces 48 candidate unit changes.
  Its 48 nested `g` units named `nest_jg` collapse to the exact key
  `{ parentJobnetPath: "", unitName: "nest_jg", unitType: "g" }`; the
  uniqueness gate rejects the 48-by-48 group and fingerprint fallback reports
  it as ambiguous.
- Source use case: `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- JP1/AJS reference basis: no new JP1/AJS syntax or runtime meaning is
  introduced. The behavior is a repository product identity rule inferred
  from normalized `AjsUnit.absolutePath`, the selected comparison scope, and
  the existing requirement that definition order alone is not semantic.
  JP1/AJS3 version 13 remains the inherited compatibility basis.
- Existing design basis: `SemanticDiffJobGroupIdentityKey` exists in the
  domain model but is unused; exact-key evidence is a closed `jobnet | unit`
  union, while Markdown and JSON version 1 project those two variants
  explicitly.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- `JGI-REFLEXIVE-001`: comparing identical normalized inputs whose job-group
  path/type keys are unique must produce no semantic changes. In particular,
  repeated nested job-group names must not create candidate, added, removed,
  renamed, moved, modified, or relation changes when their distinct canonical
  paths and facts are identical. Malformed duplicate actual paths remain under
  `JGI-AMBIGUITY-001` rather than being paired speculatively.
- `JGI-EXACT-001`: `g` and `mg` units use a job-group-specific exact identity
  consisting of a canonical path derived from normalized `absolutePath` and
  the exact unit type. The path is relative to the selected job-group scope
  when that scope applies; otherwise it is the normalized full path. A job
  group must not use the general unit key based on nearest parent jobnet and
  unit name.
- `JGI-AMBIGUITY-001`: an exact identity group is paired only when exactly one
  before unit and exactly one after unit have that key. Duplicate actual paths
  on either side remain unmatched by exact identity and continue through the
  existing conservative fingerprint path; array position or encounter order
  must never select a pair.
- `JGI-EVIDENCE-001`: the existing `SemanticDiffJobGroupIdentityKey` becomes
  the job-group key and carries path plus unit type. The closed
  `SemanticDiffIdentityExactKey` evidence union gains a `job-group` variant.
  Existing `jobnet` and `unit` variants, decision rules, statuses, reference
  shapes, and deterministic decision IDs remain unchanged.
- `JGI-MOVE-001`: path changes are not exact identity. Existing one-to-one
  fingerprint evidence may still confirm a job-group rename or move; multiple
  compatible fingerprints remain candidates. Reordering without a path or
  semantic change produces no changes.
- `JGI-OUTPUT-001`: Summary, Full, Audit, Explorer, and JSON consume the same
  corrected comparison result without recomputing identity. Markdown renders
  job-group exact-key evidence, and JSON version 1 projects and orders the new
  `job-group` key deterministically while retaining `schemaVersion: 1` and the
  existing `jobnet` and `unit` payload shapes.
- `JGI-COMPAT-001`: parser normalization, public comparison entry points,
  report selection, schedule behavior, source navigation, Flow integration,
  telemetry, VS Code compatibility, and desktop/web behavior remain
  unchanged.

## Behavioral Scenarios

```gherkin
Feature: Semantic Diff job-group identity

Scenario: A repeated nested job group is reflexive
  Given both normalized inputs are the same sample1_large_utf8 definition
  And many nested g units share the name nest_jg
  When Semantic Diff is built
  Then canonical job-group paths match those units exactly
  And the result contains no semantic changes or candidate identity outcomes

Scenario: Duplicate actual paths stay ambiguous
  Given more than one job group on either side has the same canonical path and type
  When exact identity is evaluated
  Then no pair is selected by array order
  And existing conservative fingerprint ambiguity behavior is preserved

Scenario: A job-group path change is not exact
  Given one job group has a different canonical path after normalization
  When Semantic Diff is built
  Then exact identity does not pair it by name alone
  And only existing one-to-one fingerprint evidence may confirm a rename or move
```

## Architecture

- Domain: select the job-group exact key for `g` and `mg`, preserve the
  one-to-one uniqueness gate, and emit typed deterministic identity evidence.
- Application: keep the host-neutral result contract and copy the extended
  exact-key union without introducing matching or presentation logic.
- Presentation: render and deterministically project/order the new exact-key
  evidence branch in Markdown and JSON version 1. Explorer and Flow consume
  the corrected result without recomputing identity.
- Infrastructure: no responsibility change. Parsing and normalized hierarchy
  construction remain unchanged.

## Impact Analysis

### Dependency Impact

- Directly affected contracts include `SemanticDiffJobGroupIdentityKey`,
  `SemanticDiffIdentityExactKey`, exact-key selection and evidence in
  `semanticDiffStructuralRules.ts`, the application DTO alias/copy boundary,
  Markdown exact-key rendering, and JSON v1 type/projection/ordering.
- Comparison, report, Explorer, Flow, schedule-impact, and source-navigation
  regressions must prove that the corrected correspondence does not alter
  unrelated semantics.
- Propagation decision: change job-group identity and every exhaustive
  projection of its exact evidence together. Do not change parsing, normalized
  paths, fingerprint strategies, decision statuses, report modes, or JSON
  version.

### Overlap Decision

- The durable `Build Semantic Diff` use case already owns identity matching,
  order independence, rename/move evidence, and conservative ambiguity. This
  feature corrects that owner rather than creating a separate comparison mode.
- `semantic-diff-comparison-workflow` owns source selection and Explorer
  handoff; `schedule-impact-calendar` consumes comparison correspondence.
  Neither feature owns exact job-group identity, and neither requires a scope
  change for this fix.
- No feature split is required because model key selection, exact matching,
  and exhaustive evidence projection are one observable correctness fix.

### Breaking Change Analysis

- User-visible behavior: false candidate changes disappear for identical
  nested job groups; genuine duplicate-path ambiguity remains visible.
- API/DTO/schema compatibility: the exact-key evidence union gains one
  additive `job-group` variant. Existing variants and fields remain
  byte-for-byte shaped as before. JSON remains version 1 but can now contain
  the new variant, so exhaustive downstream consumers are a compatibility
  risk that planning and tests must make explicit.
- VS Code/web extension compatibility: no host API or minimum-version change;
  the same pure identity and projection behavior must run on both hosts.
- Changed scenarios: identical repeated nested job groups, duplicate actual
  paths, job-group rename/move, order independence, and exact-key report/JSON
  projection.

### Alternative Considerations

- Return an empty result when input text is equal: rejected because
  reflexivity must hold for identical normalized inputs from different text
  encodings or formatting and because a shortcut would bypass normal evidence
  construction.
- Pair duplicate groups by array position or traversal order: rejected because
  definition order is not semantic and arbitrary pairing could hide real
  changes.
- Keep using parent-jobnet path plus job-group name: rejected because nested
  job groups outside a jobnet collapse to the reproduced empty-parent key.
- Suppress candidate changes only in reports: rejected because it would leave
  the host-neutral comparison result incorrect and projections inconsistent.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` according to the lifecycle gate.
- Scope changes requiring re-approval: changing normalized paths or parser
  output; weakening duplicate-path ambiguity; positional matching; changing
  fingerprint strategies or rename/move rules; changing existing exact-key
  variants, decision IDs, report modes, JSON version, schedule semantics,
  Explorer/Flow behavior, telemetry, or compatibility floors.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; no newer API
  is required.
- Web extension compatibility: identity and projection stay browser-safe and
  must not use Node built-ins, locale-sensitive comparison, or host paths.
- Desktop extension compatibility: behavior is identical to web; no filesystem
  or process dependency is added.
- JP1/AJS compatibility: all existing normalized definitions remain accepted.
  The fix changes only correspondence for `g`/`mg`, not parameter meaning or
  runtime interpretation.
- Output compatibility: existing exact `jobnet`/`unit` evidence, JSON version
  1 fields, report modes, and public result entry points remain supported.

## Acceptance Criteria

- Parsing and comparing `sample/sample1_large_utf8` with itself yields zero
  semantic changes and no candidate identity decision for its 48 repeated
  nested `nest_jg` job groups.
- `g` and `mg` exact decisions expose canonical path plus unit type through
  `job-group` exact-key evidence.
- Different nested paths remain distinct even when job-group name, type, and
  fingerprint are equal.
- Duplicate actual path keys never auto-pair; shuffled input arrays produce the
  same conservative outcomes and deterministic IDs/order.
- Existing one-to-one fingerprint rename/move and ambiguous fingerprint
  behavior remain unchanged after exact matching.
- Markdown and JSON v1 render the job-group exact key without changing existing
  jobnet/unit representations or report/JSON selection behavior.
- Relevant domain, application, Markdown, JSON, sample, schedule, Explorer,
  Flow, architecture, desktop, and web validations pass according to the
  planned risk boundary.

## Durable Documentation Impact

- Update `docs/requirements/use-cases/uc-build-semantic-diff.md` when the fix
  is delivered so job-group exact identity and reflexivity are durable
  behavior. Its existing conservative ambiguity and rename/move rules remain.
- `docs/requirements/use-cases/uc-present-semantic-diff-report.md` already
  requires typed exact-key rendering; update it only if implementation exposes
  a reusable job-group-specific output rule not captured there.
- Evaluate `CHANGELOG.md` because the fix removes user-visible false changes.
  README and architecture updates are not expected unless planning discovers
  a new user workflow or reusable boundary.
- No roadmap update is required: this transient correctness bug does not add or
  reorder unfinished repository-level work.

## Non-Goals

- Text-equality, source-byte, checksum, or parser-bypass shortcuts.
- Pairing repeated units by array index, traversal order, source position, or
  another arbitrary occurrence ordinal.
- Changing normalized `absolutePath`, parser IDs, or job-group hierarchy.
- Broadening fingerprint strategies, manual correspondence, similarity
  scoring, or current rename/move confirmation policy.
- Changing identity for non-`g`/`mg` units, relations, schedule semantics,
  comparison sources, Explorer/Flow interaction, report modes, or JSON schema
  version.

## Open Questions

- None.
