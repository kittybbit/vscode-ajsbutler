# Feature Tasks: Semantic Diff Job-Group Identity

## Agent Brief

- Purpose: make identical normalized definitions with repeated nested job
  groups produce no false Semantic Diff changes.
- Approved or active slice: Slice 1, `Make Job-Group Identity Path-Exact And
Reflexive`; implementation is complete, the implementation review is `Ready`
  with no Findings, and Completion Approval is auto-approved; the focused
  completion commit remains eligible and pending.
- Do not implement runtime code, tests, generated artifacts, or configuration
  outside the approved Slice 1 boundary.
- Do not add a text-equality shortcut or pair duplicate keys by array order.
- Preserve duplicate-path ambiguity, rename/move rules, JSON version 1,
  report modes, and desktop/web compatibility.
- Read first: `SPECS.md`, this file, and
  `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- Read `TRACEABILITY.md` when creating the complete implementation plan.
- Validate intake docs with `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: delegate the eligible focused completion commit to
  `approval-committer`.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this selected feature.
  Inherited feature folders remain outside its scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level work or
  ordering changes; no such change is identified during intake.
- Keep implementation sequencing, approval, validation, risk, production
  readiness, and Feature Exit readiness here; keep requirements in `SPECS.md`.

## Plan Status

- Status: Reviewed, approved, and implemented; completion commit pending
- Planning scope: one cohesive vertical slice corrects `g`/`mg` exact
  identity, transports its typed evidence through the existing application
  boundary, updates every exhaustive Markdown/JSON v1 projection, and records
  the durable behavior and user-visible fix.
- Review status: `Ready` (`plan-reviewer`); Findings none
- Implementation review status: `Ready`; Findings none
- Human approval: Approved
- Active implementation slice: Slice 1, implementation complete; independent
  implementation review `Ready`, Findings none, Completion Approval approved
  under the automatic no-findings instruction

## Human Approval

- Status: Approved
- Approved at: 2026-09-11; approved in the current conversation
- Result: Approved
- Basis: independent `plan-reviewer` verdict `Ready` with no Findings and the
  user's automatic no-findings slice approval instruction.
- Approved scope: Slice 1, `Make Job-Group Identity Path-Exact And Reflexive`,
  exactly as planned below: correct `g`/`mg` canonical path/type exact
  identity; preserve uniqueness, ambiguity, fingerprint, rename/move, order,
  result, host, and compatibility boundaries; add exhaustive Markdown/JSON v1
  evidence and focused/sample regressions; update the durable use case and
  CHANGELOG.
- Approved implementation paths:
  - `src/domain/models/semantic-diff/SemanticDiff.ts`
  - `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  - `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`
  - `src/presentation/semantic-diff/semanticDiffJson.ts`
  - `src/presentation/semantic-diff/semanticDiffJsonProjection.ts`
  - `src/presentation/semantic-diff/semanticDiffJsonOrdering.ts`
  - `src/test/suite/semanticDiffStructuralRules.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
  - `src/test/suite/semanticDiffSampleCoverage.test.ts`
  - `src/test/suite/renderSemanticDiffMarkdown.test.ts`
  - `src/test/suite/semanticDiffMarkdownProjections.test.ts`
  - `src/test/suite/semanticDiffJson.test.ts`
  - `docs/requirements/use-cases/uc-build-semantic-diff.md`
  - `CHANGELOG.md`
- Approved read-only verification paths: application transport aliases/copies
  in `src/application/semantic-diff/semanticDiffDto.ts` and
  `src/application/semantic-diff/compareSemanticDiff.ts`, plus the regression
  suites named in Slice 1 Validation that are not approved implementation
  paths.
- Approved planning package paths for the focused plan commit:
  - `docs/specs/features/semantic-diff-job-group-identity/SPECS.md`
  - `docs/specs/features/semantic-diff-job-group-identity/TASKS.md`
  - `docs/specs/features/semantic-diff-job-group-identity/TRACEABILITY.md`
- Focused plan commit status: Committed as `929009ab` by `approval-committer`.

Implementation started only after the focused approved-plan commit succeeded.

## Completion Approval

- Status: Approved
- Approved at: 2026-09-11; approved in the current conversation under the
  user's automatic no-findings slice approval instruction
- Result: Approved
- Basis: independent `implementation-reviewer` verdict `Ready` with no
  Findings after the addressed duplicate-path and JSON ordering regressions;
  the user's existing instruction treats a no-Findings review as automatic
  Completion Approval.
- Approved scope: the completed Slice 1 implementation exactly as planned:
  path/type exact identity for `g`/`mg`; conservative duplicate-path
  ambiguity; unchanged fingerprint, rename/move, order, result, host, and
  compatibility behavior; exhaustive Markdown/JSON v1 evidence; focused and
  real-sample regressions; durable use-case and CHANGELOG updates.
- Approved implementation paths:
  - `src/domain/models/semantic-diff/SemanticDiff.ts`
  - `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  - `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`
  - `src/presentation/semantic-diff/semanticDiffJson.ts`
  - `src/presentation/semantic-diff/semanticDiffJsonProjection.ts`
  - `src/presentation/semantic-diff/semanticDiffJsonOrdering.ts`
  - `src/test/suite/semanticDiffStructuralRules.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
  - `src/test/suite/semanticDiffSampleCoverage.test.ts`
  - `src/test/suite/renderSemanticDiffMarkdown.test.ts`
  - `src/test/suite/semanticDiffMarkdownProjections.test.ts`
  - `src/test/suite/semanticDiffJson.test.ts`
  - `docs/requirements/use-cases/uc-build-semantic-diff.md`
  - `CHANGELOG.md`
- Evidence record paths updated with this approval state:
  `docs/specs/features/semantic-diff-job-group-identity/TASKS.md` and
  `docs/specs/features/semantic-diff-job-group-identity/TRACEABILITY.md`.
- Implementation review verdict: `Ready`; Findings none; all prior Findings
  are recorded as addressed in the implementation evidence.
- Commit status: Eligible; pending `approval-committer`; no completion commit
  has been created.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Intake Impact Record

- Reproduced behavior: comparing parsed `sample/sample1_large_utf8` with itself
  yields 48 candidate unit changes for repeated nested `g` units named
  `nest_jg`.
- Cause: general unit exact identity collapses those units to
  `{ parentJobnetPath: "", unitName: "nest_jg", unitType: "g" }`; the
  one-to-one exact gate rejects the group and fingerprint fallback preserves it
  as ambiguous.
- Existing boundary: `SemanticDiffJobGroupIdentityKey` is unused, while
  `SemanticDiffIdentityExactKey`, Markdown rendering, and JSON v1
  type/projection/ordering exhaustively handle only `jobnet` and `unit`.
- Expected change boundary: select a job-group-specific canonical path/type key
  for `g`/`mg`, add its exact evidence branch, and update every exhaustive
  application/presentation projection together.
- Affected behavior: exact unit correspondence, identity decisions, resulting
  changes and summaries, Markdown/Audit evidence, JSON v1 evidence, and
  downstream consumers of the corrected immutable result.
- Regression boundary: generic unit and jobnet identity, genuine ambiguity,
  one-to-one rename/move, ordering, relation matching, schedule impact,
  Explorer, Flow, source navigation, parser behavior, and desktop/web hosts.
- Durable docs: update `uc-build-semantic-diff.md` when implemented; evaluate
  `uc-present-semantic-diff-report.md` and `CHANGELOG.md`. No roadmap, README,
  or architecture update is currently expected.
- Breaking-change risk: the new exact-key discriminant is additive but widens
  a closed public result/JSON union. Existing branches and JSON version must
  remain unchanged, and exhaustive projection/consumer tests are required.
- Performance risk: large repeated groups must retain bounded grouping and
  deterministic sorting; no quadratic 48-by-48 pairing or positional fallback
  is accepted.
- Alternatives rejected: text equality or parser bypass, array-order pairing,
  report-only suppression, and name-only identity.

## Implementation Slices

### Slice 1: Make Job-Group Identity Path-Exact And Reflexive

- Status: Implemented; implementation review `Ready` with no Findings;
  Completion Approval approved; focused completion commit is eligible and
  pending `approval-committer`.
- Scope: add `unitType` to `SemanticDiffJobGroupIdentityKey`; add its
  `job-group` branch to `SemanticDiffIdentityExactKey`; select that key for
  `g` and `mg` before the general-unit key; derive `jobGroupPath` with the
  existing normalized, selected-scope-relative path rule and normalized
  full-path fallback; retain the one-before/one-after uniqueness gate; emit
  the same key in exact-decision evidence; preserve the application DTO alias
  and defensive copy; render the new key in Markdown; project and compare it
  explicitly in JSON v1; add focused and real-sample regressions; update the
  durable use case and CHANGELOG.
- User / Domain Value: comparing identical definitions with repeated nested
  job-group names produces no false findings, while reviewers and automation
  can inspect the exact canonical path/type evidence used for each match.
- Cohesive Change Group: this is one slice because the domain union, exact
  matcher, application evidence copy, and exhaustive Markdown/JSON consumers
  form one closed contract. Splitting them would either fail compilation or
  expose a result that a report mode cannot safely consume; the sample
  reflexivity outcome is independently testable only when the whole vertical
  path is complete.
- Expected changed paths:
  - `src/domain/models/semantic-diff/SemanticDiff.ts`
  - `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`,
    including a typed `semanticDiffJobGroupIdentityKey` selector shared by
    exact grouping and exact evidence
  - `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`
  - `src/presentation/semantic-diff/semanticDiffJson.ts`
  - `src/presentation/semantic-diff/semanticDiffJsonProjection.ts`
  - `src/presentation/semantic-diff/semanticDiffJsonOrdering.ts`
  - `src/test/suite/semanticDiffStructuralRules.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
  - `src/test/suite/semanticDiffSampleCoverage.test.ts`
  - `src/test/suite/renderSemanticDiffMarkdown.test.ts`
  - `src/test/suite/semanticDiffMarkdownProjections.test.ts`
  - `src/test/suite/semanticDiffJson.test.ts`
  - `docs/requirements/use-cases/uc-build-semantic-diff.md`
  - `CHANGELOG.md`
- Verified exhaustive application path, normally requiring tests rather than
  a source edit: `src/application/semantic-diff/semanticDiffDto.ts` aliases the
  domain exact-key union, and
  `src/application/semantic-diff/compareSemanticDiff.ts` defensively copies
  the selected exact key with an exhaustive-independent object spread. If
  implementation discovers that either source must change beyond preserving
  this transport behavior, return to Main for Replanning before editing it.
- Acceptance:
  - `g` and `mg` exact keys are `{ kind: "job-group", jobGroupPath,
unitType }`; the path is relative to the selected job-group scope when the
    normalized unit is that scope or its descendant, otherwise it is the
    normalized full path with only the leading separator removed. Jobnets and
    all other units retain their existing keys byte-for-byte.
  - Exact matching still accepts only one before and one after record for a
    key. Duplicate actual canonical paths on either side fall through to the
    existing fingerprint logic and are never paired by position, traversal,
    or array order.
  - Parsing `sample/sample1_large_utf8` twice and comparing the two normalized
    documents yields zero changes and no candidate identity decisions; its 48
    repeated nested `nest_jg` units have distinct exact job-group path/type
    evidence.
  - A path change is not exact. Existing one-to-one fingerprint confirmation,
    rename/move change classification, changed-fingerprint add/remove behavior,
    multiple-candidate ambiguity, and deterministic decision IDs/order remain
    unchanged; shuffled inputs produce the same result.
  - Summary, Full, Audit, Explorer, Flow, schedule-impact, and source
    navigation continue to consume the corrected immutable result without
    recomputing identity. Audit Markdown renders raw `jobGroupPath` and
    `unitType`; existing `jobnet` and `unit` text remains unchanged.
  - JSON continues to emit `schemaVersion: 1`; `job-group` exact evidence has
    stable field order `kind`, `jobGroupPath`, `unitType` and locale-neutral
    ordering by key kind, path, then type. Existing v1 `jobnet`/`unit` payload
    shapes, empty/populated baseline bytes unrelated to the new evidence, null
    policy, media type, and selection behavior remain unchanged.
- JSON v1 compatibility decision: a version bump is not required. The v1
  contract requires a new version when a member is removed or renamed, or its
  meaning, type, or nullability changes. This slice does none of those: it adds
  one discriminated exact-key payload for a domain case that v1 currently
  reports incorrectly, preserves all existing discriminator payloads, and
  keeps the document structure and media type. The exported TypeScript union
  and strict external switch statements can observe the new discriminator,
  so this is an additive compatibility risk, not an invisible change. It is
  accepted for v1 only with explicit projection, ordering, nested-wire-shape,
  existing-variant, deterministic-byte, report-selection, and CHANGELOG
  coverage. Discovery that a published external schema promises a closed
  `jobnet | unit` enum, or that an existing payload must change, is a stop and
  new approval boundary for versioning.
- Validation:
  - Domain/focused application: extend
    `semanticDiffStructuralRules.test.ts` and `compareSemanticDiff.test.ts` for
    both `g` and `mg`, equal names at distinct nested paths, selected-scope
    relative and full-path fallback, duplicate-key groups on either/both
    sides, shuffled arrays, exact-key precedence, one-to-one fingerprint
    rename/move behavior, multiple compatible fingerprints, changed
    fingerprints, unchanged non-job-group identity, deterministic decision
    IDs/order, and relation correspondence after matching.
  - End to end: extend `semanticDiffSampleCoverage.test.ts` to parse
    `sample/sample1_large_utf8` independently for before and after, assert 868
    normalized units, zero changes, no candidate decision, and 48 distinct
    exact `job-group` decisions for the repeated `nest_jg` units. This uses the
    real parser only as regression input; parser output is not changed.
  - Output: extend `renderSemanticDiffMarkdown.test.ts` and
    `semanticDiffMarkdownProjections.test.ts` for English/Japanese Audit
    evidence and unchanged Full/Summary behavior; extend
    `semanticDiffJson.test.ts` for the new nested wire shape, path/type
    projection, key-kind/path/type ordering, shuffled-input byte stability,
    `schemaVersion: 1`, existing variant shapes, and unchanged baseline
    snapshots where the fixture contains no job-group exact evidence.
  - Regression: run focused compiled suites for structural rules, comparison,
    sample coverage, Markdown projections/rendering, JSON, contracts,
    schedule impact, Explorer projection/Flow, and architecture dependency
    rules. Then run `rtk pnpm run test:compile`, `rtk pnpm run build`,
    `rtk pnpm run test:desktop:run`, `rtk pnpm run test:web:run`, and
    `rtk pnpm run qlty`; run `rtk pnpm run lint:md` for durable and feature
    Markdown. Record any environment-blocked host run instead of replacing it
    with a weaker claim.
- Production Readiness: matching remains pure, host-neutral, linear grouping
  plus deterministic sorting; no 48-by-48 or positional pairing is introduced.
  Large input uses existing maps and uniqueness checks. Malformed duplicate
  paths fail conservatively into fingerprint ambiguity. No parser, source
  bytes, host path, filesystem/process API, locale comparator, telemetry,
  schedule evaluation, UI state, or VS Code API is added. Desktop and web use
  the same domain/application/presentation code and retain `engines.vscode`
  `^1.75.0`. JP1/AJS3 v13 parsing and parameter semantics are unchanged.
- Approval Boundary: approve exactly the expected changed paths and the one
  verified application transport boundary above. A parser/normalization or
  `absolutePath` change; a JSON version/media-type or existing-payload change;
  a duplicate-key fallback or fingerprint/rename/move policy change; a public
  comparison entry-point, result, report-mode, Explorer/Flow, schedule,
  source-navigation, telemetry, VS Code floor, or architecture-boundary change
  requires Replanning and new approval.
- Dependencies: intake artifacts on
  `codex/semantic-diff-job-group-identity`; existing normalized
  `AjsUnit.absolutePath`, comparison `jobGroupPath`, one-to-one exact and
  fingerprint gates, immutable result/application copy, and Markdown/JSON v1
  projection contracts. No unfinished comparison-workflow or calendar slice
  is modified or required.
- Risks: a prefix-only scope check could relativize a sibling path; the
  selected-scope equality-or-descendant condition must remain explicit.
  Duplicate actual paths could be accidentally auto-paired; shuffled duplicate
  tests are mandatory. Adding a closed-union discriminator can break
  exhaustive consumers; repository search, compile, explicit projection, and
  both host tests are mandatory. Locale-sensitive ordering, evidence/decision
  mismatch, or changing decision IDs for existing variants would break
  reproducibility; ordinal ordering and existing-variant regressions guard
  them. The large sample guards performance and the reproduced false-positive
  count.
- Out of Scope: text/source equality shortcuts; parser, normalized ID/path, or
  hierarchy changes; occurrence ordinals or positional pairing; new
  fingerprint/similarity/manual-correspondence strategies; changed identity
  for jobnets or non-`g`/`mg` units; relation/schedule semantics; comparison
  source selection; Explorer/Flow behavior; new report modes; JSON v2; README,
  roadmap, architecture, configuration, generated artifacts, telemetry, or
  compatibility-floor changes.

## Planning Requirements

- Inspect and account for `SemanticDiffJobGroupIdentityKey`,
  `SemanticDiffIdentityExactKey`, `semanticDiffStructuralRules.ts`, the
  application DTO/copy boundary, Markdown exact-key rendering, and JSON v1
  type/projection/ordering.
- Prove `g` and `mg`, selected-scope-relative and full-path fallback, duplicate
  actual paths, shuffled arrays, rename/move, unchanged non-job-group identity,
  and deterministic decision IDs/order.
- Include an end-to-end regression that parses and self-compares
  `sample/sample1_large_utf8` and asserts zero changes plus no candidate
  decision for the 48 repeated nested job groups.
- Identify the exact compatibility treatment for the additive closed-union
  branch and keep `schemaVersion: 1` unless a new approval boundary is raised.
- Select risk-based compile, focused tests, qlty, Markdown, architecture,
  desktop, and web validation without implementing during planning.

## Traceability

- `TRACEABILITY.md` required: yes
- Reason: the fix crosses domain identity, application result, Markdown, JSON
  v1, sample regression, and durable use-case boundaries.

## Feature Exit

- Definition of Done status: Slice 1 implementation, validation, independent
  implementation review, and Completion Approval are complete; focused
  completion commit and Feature Exit remain pending.
- Durable documentation updates: Slice 1 updates
  `uc-build-semantic-diff.md` because job-group exact identity and reflexivity
  are reusable domain behavior. `uc-present-semantic-diff-report.md` already
  requires typed exact-key rendering and needs no job-group-specific wording.
  `CHANGELOG.md` is required because user-visible false comparison findings are
  removed. README, roadmap, and architecture do not meet the update gate.
- Open risks: closed-union consumer compatibility, accidental weakening of
  ambiguity, rename/move drift, nondeterministic ordering, and large-group
  performance.

## Validation

- [x] Intake purpose, origin, compatibility, overlap, and non-goals recorded
- [x] Reproduced sample and current key collision recorded
- [x] Traceability and planning requirements recorded
- [x] Complete implementation-slice plan
- [x] Independent plan review: `Ready`; Findings none
- [x] Human Approval recorded under automatic no-findings instruction
- [x] Focused plan commit: `929009ab`
- [x] Implementation and risk-based validation
- [x] Independent implementation review: `Ready`; Findings none
- [x] Completion Approval: Approved under the automatic no-findings
      instruction on 2026-09-11
- [ ] Focused completion commit: eligible; pending `approval-committer`

## Implementation Evidence

- Changed runtime contracts and selectors: `SemanticDiffJobGroupIdentityKey`
  now carries `unitType`; `g`/`mg` use one shared canonical path/type exact-key
  selector for grouping and exact evidence; scope-relative paths require exact
  scope equality or a separator-bounded descendant, with full-path fallback.
- Changed projections: Markdown and JSON v1 render/project/order the additive
  `job-group` exact-key branch with stable `kind`, `jobGroupPath`, `unitType`
  field order. Existing `jobnet`/`unit` branches remain unchanged. The
  application DTO alias and defensive copy were verified without an
  application source edit.
- Regression evidence: focused domain/application, Markdown, JSON, and sample
  tests cover `g`/`mg`, relative/full-path selection, duplicate-path
  ambiguity, shuffled inputs, fingerprint rename/move, deterministic evidence,
  and the real parser self-comparison of `sample/sample1_large_utf8` (868
  units, zero changes, no candidate decisions, 48 distinct `nest_jg` exact
  decisions).
- Implementation review Findings addressed and independently reviewed `Ready`
  with no Findings: one-sided duplicate canonical path regressions now cover
  reversed inputs, and multiple job-group exact evidence records directly
  verify path/type ordering and byte stability. Completion Approval is
  auto-approved under the user's existing no-findings instruction.
- Checks passed: `rtk pnpm run test:compile`, `rtk pnpm run development`,
  `rtk node ./out/test/runTest.js`, `rtk pnpm run test:web:run`, targeted
  `rtk qlty check` for all changed production/test files, `rtk git diff --check`,
  and `rtk pnpm run lint:md`.
- The full qlty smell scan reports only pre-existing complexity/duplication
  findings in the repository; the changed production files add no actionable
  new finding. The repository-wide qlty formatter also identifies an
  unrelated pre-existing formatting discrepancy in the inherited
  comparison-workflow TASKS document, which remains outside this slice.
- Compatibility and production readiness: no parser, normalization,
  infrastructure, Node API, telemetry, report mode, schedule, Explorer, Flow,
  VS Code floor, or host-specific behavior changed. Matching remains map-based
  with the existing one-before/one-after gate; duplicate actual paths remain
  conservative candidates and no positional pairing was introduced.
- Implementation feedback: sharing the typed selector between exact grouping
  and evidence prevents result/evidence drift; separator-bounded scope checks
  make the fallback safe for sibling paths sharing a prefix.
- Unresolved risks: the additive `job-group` discriminator remains a documented
  compatibility consideration for strict external consumers of the JSON v1
  TypeScript union; no published closed two-variant schema was found. This is
  accepted within Slice 1; the focused completion commit is eligible and
  pending, while Feature Exit remains pending.

## Notes

- Slice 1 implementation changes remain limited to the approved runtime,
  projection, test, durable use-case, and CHANGELOG paths. No generated
  artifacts, configuration, roadmap, README, architecture, or telemetry files
  were changed.
- Keep feature requirements and boundary decisions in `SPECS.md`; keep future
  slice planning and approval evidence in this file.
