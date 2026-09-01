# Feature Tasks: Semantic Diff Identity Confidence

## Agent Brief

- Purpose: make Semantic Diff identity matching unit-type-specific,
  deterministic, and explainable without weakening conservative safeguards.
- Approved or active slice: Slice 1, Build Reference-Backed Identity Strategies
  And Correspondence. The current conversation authorizes implementation of
  this slice within its recorded approval boundary.
- Do not edit runtime code, tests, generated artifacts, or configuration outside
  the active approved Slice 1 boundary; only the focused completion commit is
  authorized for this scope.
- Do not add manual matching, similarity scoring, output modes, JSON export,
  new commands, or UI.
- Read first: `SPECS.md`, this file,
  `docs/requirements/use-cases/uc-build-semantic-diff.md`, and
  `TRACEABILITY.md`.
- Reference basis: JP1/AJS3 version 13 Command Reference sections 5.2.6,
  5.2.7, 5.2.9, and 5.2.10, plus the repository shared parameter rules.
- Approval policy and document roles: `docs/specs/README.md`.
- Next route: Main delegates the exact completed Slice 1 scope to
  `approval-committer` for the focused completion commit.

## Sync Rule

- Update this file in the same commit whenever work is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan/status owner for this feature. Other feature
  folders inherited from the base branch remain outside this scope.
- Do not update `docs/specs/roadmap.md`; no repository-level ordering or entry
  condition changes were found during Planning.
- Remove work-log history when it no longer affects approval, risk, or
  traceability.

## Plan Status

- Status: Approved plan; Slice 1 implementation reviewed and Completion
  Approval granted, pending the focused completion commit.
- Planning scope: all identity strategy, correspondence evidence, application
  DTO, existing Markdown rationale, regression, and compatibility work needed
  by `SPECS.md` R1-R10.
- Review status: plan Ready (`plan-reviewer`) and Slice 1 implementation Ready
  (`implementation-reviewer`).
- Human approval: Approved.
- Active implementation slice: Slice 1.
- Implementation review verdict: Ready
- Slice order: Slice 1, Slice 2, then Slice 3. Each slice requires its own
  implementation review, Completion Approval, and focused completion commit
  before the next slice begins.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 domain identity strategy/correspondence source,
  approved structural/comparison tests, and Slice 1 implementation evidence.
- Approved paths: `src/domain/models/semantic-diff/SemanticDiff.ts`,
  `src/domain/services/semantic-diff/semanticDiffIdentity.ts`,
  `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`,
  `src/test/suite/semanticDiffStructuralRules.test.ts`,
  `src/test/suite/compareSemanticDiff.test.ts`, and this feature's
  `TASKS.md`/`TRACEABILITY.md` evidence updates.

Implementation was authorized for Slice 1 by the current conversation. The
implementation review is Ready and Completion Approval is recorded below; the
focused completion commit remains pending.

## Completion Approval

- Status: Approved
- Approved at: immediately preceding user message, after the
  `implementation-reviewer` Ready verdict
- Approved scope: completed Slice 1 implementation, including the domain
  identity strategy/correspondence source, approved structural/comparison
  tests, and lifecycle evidence updates
- Approved paths:
  `docs/specs/features/semantic-diff-identity-confidence/TASKS.md`,
  `docs/specs/features/semantic-diff-identity-confidence/TRACEABILITY.md`,
  `src/domain/models/semantic-diff/SemanticDiff.ts`,
  `src/domain/services/semantic-diff/semanticDiffIdentity.ts`,
  `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`,
  `src/test/suite/semanticDiffStructuralRules.test.ts`,
  `src/test/suite/compareSemanticDiff.test.ts`
- Implementation review verdict: Ready
- Commit status: Eligible; pending focused completion commit

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Strategy And Evidence Decisions

These decisions are part of the approval boundary. Changing a supported unit
family, canonical field, effective-value rule, fallback, or DTO ownership
requires Replanning.

### Canonical strategy table

<!-- markdownlint-disable MD013 MD060 -->

| Strategy ID                | Eligible unit types and valid form                                                                              | Canonical fields                                                                                                     | Effective-value and eligibility rules                                                                                                                                                                                                                                                                                                           | Identity change condition                                                                                                                   | Normative or existing basis                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `command-text-v1`          | `j` or `rj` with exactly one `te`, and neither `sc` nor `prm`                                                   | `te`                                                                                                                 | Preserve the normalized `te` value exactly. This row is the command-text form only; a `j`/`rj` script-file form is handled by `executable-file-v1`. Duplicate `te`, missing `te`, or any mixed/invalid form uses fallback.                                                                                                                      | Only a changed `te` value changes this fingerprint. `sc`/`prm` are form discriminators here, not command-text fields.                       | JP1/AJS3 v13 Command Reference 5.2.6 (UNIX command text and script file)                                             |
| `executable-file-v1`       | `j`, `rj`, `pj`, `rp`, `qj`, or `rq` with exactly one `sc`, no `te`, and optional `prm`                         | `sc`, `prm`                                                                                                          | Preserve normalized `sc`. `prm` is optional; absence is distinct from an explicit value. Duplicate `sc` or `prm`, missing `sc`, or any mixed/invalid form uses fallback. PC (`pj`/`rp`) and QUEUE (`qj`/`rq`) `sc` values are executable-file names; UNIX (`j`/`rj`) `sc` values are script-file names.                                         | Only `sc` or `prm` changes this fingerprint, including absent-versus-explicit `prm`. `te` is a form discriminator, not an executable field. | JP1/AJS3 v13 Command Reference 5.2.6 (UNIX/PC) and 5.2.7 (QUEUE)                                                     |
| `event-reception-v1`       | `evwj` or `revwj`                                                                                               | `evwid`, `evusr`, `evgrp`, `evhst`, `evipa`, `evwms`, `evdet`, `evwsv`, `evwfr`, `evuid`, `evgid`, `evpid`           | Preserve normalized explicit event-selector values; sort repeated `evwfr` without removing duplicates. Omitted selectors remain explicitly absent. A duplicate non-repeatable selector or invalid event-filter form uses fallback. Exclude end judgment, passing information, timeout, agent/user, prior-event search, and wait-control fields. | A changed included selector, including presence or canonical value, changes this fingerprint; excluded fields do not.                       | JP1/AJS3 v13 Command Reference 5.2.9 and repository `JP1-PARAM-EVENT-RECEIVE-*` rules                                |
| `file-monitor-v1`          | `flwj` or `rflwj` with exactly one valid `flwf`                                                                 | `flwf`, `flwc`                                                                                                       | Preserve `flwf`; canonicalize omitted `flwc` to its v13 effective default `c`. Duplicate `flwf` or `flwc`, missing `flwf`, or invalid/mutually exclusive `flwc` uses fallback. Exclude polling interval, start option, timeout, agent/user, passing information, and wait-control fields.                                                       | A changed `flwf` or effective `flwc` changes this fingerprint; omitted `flwc` and explicit `flwc=c` are equal.                              | JP1/AJS3 v13 Command Reference 5.2.10 and repository `JP1-PARAM-FILE-MONITOR-*` rules                                |
| `legacy-all-parameters-v1` | Every other `AjsUnitType`, plus any listed type with an unsupported, missing, duplicate, mixed, or invalid form | `unitType`, `groupType`, `permission`, `jp1Username`, `jp1ResourceGroup`, and every parameter except `unit` and `el` | Reproduce the current `semanticDiffUnitFingerprint` exactly: sort `key=value`, preserve duplicates and normalized values, and apply no defaults. It must not create an automatic match the pre-feature helper would not create.                                                                                                                 | No new field-specific identity interpretation is asserted; the complete legacy fingerprint remains the only fallback identity evidence.     | Existing `semanticDiffUnitFingerprint` and its regression tests; no JP1 semantic claim is made for unsupported forms |

<!-- markdownlint-enable MD013 MD060 -->

Normative references for the table are the [JP1/AJS3 v13 Command Reference
5.2.6 (UNIX and PC job definition)](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM),
[5.2.7 (QUEUE job definition)](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM),
[5.2.9 (JP1 event reception monitoring)](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM),
and [5.2.10 (file monitoring)](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM).
Shared effective-value ownership remains
`docs/requirements/domain-rules/interpret-jp1-parameters.md`; event and file
constraints use the corresponding `JP1-PARAM-*` rules in
`docs/requirements/domain-rules/jp1-diagnostic-parameter-rules.md`. These
sources establish the supported forms and defaults; the legacy row makes no
additional JP1 semantic claim.

All strategies retain exact normalized `unitType` as separate evidence.
Ordinary and recovery counterparts select the same semantic strategy but cannot
match one another because their types differ. Fields have the table order;
repeated values use ordinal lexical order and preserve duplicates. Do not trim,
case-fold, parse, unquote, resolve macros, or infer an undocumented default.

The command rows intentionally separate the `te` identity condition from the
`sc`/`prm` identity condition. A `j`/`rj` unit with valid `te` is compared as
command text; a valid `sc` form (including a UNIX script file, PC executable,
or QUEUE executable) is compared as an executable file. A change to `te` is
therefore tested only against another command-text fingerprint, while a change
to `sc` or `prm` is tested only against another executable-file fingerprint.
Changing the form discriminator is not treated as a cross-strategy match.

### Fallback coverage boundary

- The four semantic strategies apply only to the valid forms in the table.
- Every remaining `AjsUnitType`, including jobnets, custom jobs, flexible or
  action jobs, event/file families not listed, and all other recovery types,
  uses `legacy-all-parameters-v1`.
- A listed type uses the legacy strategy when a required field is missing, a
  non-repeatable field is duplicated, `te` and `sc` are mixed, a strategy form
  is ambiguous, or a normalized value/form is invalid. This includes missing
  `te`, missing `sc`, missing `flwf`, duplicate `te`/`sc`/`prm`/`flwf`/`flwc`,
  and invalid event filters. The only permitted repeated semantic field is
  `evwfr`, whose values are sorted with duplicates preserved.
- An unknown or missing unit type at an untyped input boundary also uses the
  legacy representation and cannot gain an automatic match from this feature.
- Fallback tests enumerate every repository `AjsUnitType` and separately cover
  valid forms, invalid values, missing fields, duplicate fields, mixed forms,
  and malformed input. Unsupported cases are asserted against the current
  helper rather than against a JP1 semantic interpretation.

### Decision and DTO contract

- `SemanticDiffIdentityStrategyId` is this closed union; the strategy table is
  the only source of strategy eligibility and no ad-hoc strategy string is
  accepted:

  ```ts
  type SemanticDiffIdentityStrategyId =
    | "command-text-v1"
    | "executable-file-v1"
    | "event-reception-v1"
    | "file-monitor-v1"
    | "legacy-all-parameters-v1";
  ```

- Decision rules and statuses are closed unions:

  ```ts
  type SemanticDiffIdentityDecisionRule =
    | "exact-key"
    | "one-to-one-fingerprint"
    | "ambiguous-fingerprint"
    | "unmatched-before"
    | "unmatched-after";
  type SemanticDiffIdentityDecisionStatus =
    | "exact"
    | "fingerprint-confirmed"
    | "candidate"
    | "removed"
    | "added";
  ```

- Exact matching remains stage one. Jobnets use job-group-relative path and
  unit type; other units use parent-jobnet path, name, and unit type.
- Fingerprint matching runs only on exact-unmatched units. Confirmation
  requires exactly one unit on each side with identical unit type, strategy ID,
  ordered field identifiers, presence markers, and canonical values.
- `SemanticDiffChangeSet.identityDecisions` is a required plain array, present
  as `[]` when there are no units. It contains every exact, fingerprint-
  confirmed, candidate, added, and removed outcome, including unchanged exact
  correspondences. Domain decisions are projected here once; presentation does
  not rerun matching.
- The internal `SemanticDiffChangeSetParts.identityDecisions` input may be
  omitted while assembling a set, but `createSemanticDiffChangeSet` always
  emits the required top-level array; no consumer may treat its absence as an
  alternate wire shape.
- `SemanticDiffIdentityDecision` is a discriminated union with these complete
  variants:
  - `status: "exact"`, `rule: "exact-key"`: exactly one `before` and one
    `after` reference, with required `evidence: { kind: "exact-key", key }`.
  - `status: "fingerprint-confirmed"`, `rule: "one-to-one-fingerprint"`:
    exactly one `before` and one `after` reference, with required fingerprint
    evidence.
  - `status: "candidate"`, `rule: "ambiguous-fingerprint"`: one or more
    `before` and one or more `after` references, with required fingerprint
    evidence. No reference is selected as the candidate's `after` target.
  - `status: "removed"`, `rule: "unmatched-before"`: exactly one `before`
    reference, an empty `after` array, and required fingerprint evidence for
    the unmatched before unit.
  - `status: "added"`, `rule: "unmatched-after"`: an empty `before` array,
    exactly one `after` reference, and required fingerprint evidence for the
    unmatched after unit.
- Every variant has required `id`, `status`, `rule`, `before`, `after`, and
  `evidence` fields. `before` and `after` are never `undefined`; an empty array
  is the only representation of a non-applicable side. Unit references contain
  only `id`, `name`, `absolutePath`, and `unitType`.
- `SemanticDiffIdentityExactKey` is this union. Its evidence has required
  `kind: "exact-key"` and `key`; it has no strategy or field values:

  ```ts
  type SemanticDiffIdentityExactKey =
    | { kind: "jobnet"; jobGroupRelativePath: string; unitType: string }
    | {
        kind: "unit";
        parentJobnetPath: string;
        unitName: string;
        unitType: string;
      };
  type SemanticDiffIdentityExactKeyEvidence = {
    kind: "exact-key";
    key: SemanticDiffIdentityExactKey;
  };
  ```

- `SemanticDiffIdentityFingerprintEvidence` has required
  `kind: "fingerprint"`, `strategyId`, `unitType`, and `fields`. `fields`
  contains one entry for every canonical field in strategy-table order:
  `{ key: string; presence: "absent" | "present"; values: string[] }`.
  Absent optional fields use `presence: "absent", values: []`; present scalar
  fields use one value; repeated fields are ordinal-sorted and retain duplicate
  values. Legacy fallback fields use the exact current-helper field set and
  ordering. Field values are evidence only and are never used to form the ID.
- `SemanticDiffIdentityEvidence` is the closed union of
  `SemanticDiffIdentityExactKeyEvidence` and
  `SemanticDiffIdentityFingerprintEvidence`; exact decisions cannot carry
  fingerprint evidence, and all other decisions cannot carry exact-key
  evidence. `strategyId` is required on fingerprint evidence, including the
  legacy fallback.
- Decision arrays use deterministic sorting: unit references and each candidate
  side sort by `(absolutePath, unitType, name, id)` using ordinal comparison;
  decisions sort by status order `exact`, `fingerprint-confirmed`, `candidate`,
  `removed`, `added`, then strategy/rule and the complete sorted reference
  tuples. This makes candidate groups stable without selecting a target.
- `SemanticDiffIdentityDecisionId` is an opaque string with the format
  `identity:v1:` followed by a length-prefixed canonical encoding of rule,
  status, evidence discriminator/strategy (or exact-key kind), and the complete
  sorted before/after reference tuples. Length-prefixing every component and
  array count makes the encoding collision-free without a hash; raw field
  values are deliberately excluded so equivalent decisions keep stable IDs.
- Add required `identityDecisionId` to every unit/jobnet structural or
  attribute `SemanticDiffChange` (including rename, move, candidate, added,
  removed, and matched attribute changes). Relation changes, job-group-only
  changes, confirmation-required items, unsupported items, limitations, and
  schedule run changes do not carry it. Candidate changes retain their before
  context, omit the legacy first-after target, and resolve all candidates via
  the referenced decision; other existing targets and change kinds remain
  available.
- An added decision means one after unit has no confirmed/candidate before
  correspondence; a removed decision means one before unit has no confirmed/
  candidate after correspondence. Neither asserts that the unit is newly
  created or deleted in the external JP1/AJS environment, and neither is a
  candidate. Their evidence is the unit's valid strategy fingerprint or the
  conservative legacy fallback fingerprint.
- Domain owns strategy selection and decisions; application owns plain DTO
  projection; presentation resolves typed decisions and localizes labels. It
  must not inspect rationale strings or reconstruct matching rules.
- Evidence contains scalar strings, arrays, and unit references only: no
  `AjsUnit`, parser values, `Map`, VS Code values, functions, or Node types. It
  is not added to telemetry or logging.

## Implementation Slices

### Slice 1: Build Reference-Backed Identity Strategies And Correspondence

- Status: Implemented; implementation review Ready and Completion Approval
  granted, completion gate pending.
- Scope: replace the monolithic fingerprint helper with a pure domain strategy
  factory implementing the approved table; enrich correspondence with
  exact/fingerprint/candidate/add/remove decisions and canonical evidence;
  preserve exact-first, one-to-one, ambiguity, add/remove, and relation rules.
- User / Domain Value: supported command, event-reception, and file-monitor
  units match by stable JP1/AJS meaning rather than unrelated operational
  parameters; unsupported forms remain no more permissive than today.
- Cohesive Change Group: domain identity strategy types/factory,
  `semanticDiffStructuralRules.ts`, and structural/comparison tests. A focused
  pure-function module under `src/domain/services/semantic-diff/` is allowed;
  do not add a class or port without need.
- Acceptance:
  - selection and evidence exactly implement the strategy table;
  - valid command-text strategy selection is limited to `j`/`rj` with `te`,
    while valid `sc` forms for UNIX, PC (`pj`/`rp`), and QUEUE (`qj`/`rq`)
    select `executable-file-v1`; command text never matches an executable
    form;
  - changing `te` breaks only a proposed command-text fingerprint match;
    changing `sc` or `prm` breaks only a proposed executable-file fingerprint
    match, including absent-versus-explicit `prm`; a form change or mixed
    `te`/`sc` uses fallback rather than cross-strategy matching;
  - changing an excluded command attribute such as execution user preserves
    correspondence and is still reported as an attribute change;
  - ordinary/recovery event and file types share strategy semantics but retain
    distinct type evidence;
  - changing an event selector, `flwf`, or effective `flwc` breaks a proposed
    match; excluded timeout, agent, polling, and action fields do not;
  - explicit `flwc=c` equals omission; parameter and repeated-`evwfr` ordering
    do not affect evidence or decisions;
  - exact identity wins, one-to-one fingerprints confirm, ambiguous groups
    preserve all candidates, and other units become additions/removals;
  - fallback fingerprints/outcomes are byte-for-byte compatible with the
    current helper for every repository `AjsUnitType` and for representative
    missing, invalid, duplicate, mixed, and malformed forms; unsupported
    forms gain no JP1-semantic match claim;
- Validation:
  - table-driven `semanticDiffStructuralRules.test.ts` fixtures enumerate every
    strategy and recovery type, separately exercise `te` versus `sc`/`prm`
    identity changes, and cover every effective default, ordering rule, changed
    included/excluded field, duplicate/mixed/missing/invalid fallback,
    precedence, ambiguity, and add/remove outcome;
  - `compareSemanticDiff.test.ts` proves attribute and relation comparison
    continues from the selected correspondence;
  - a large repeated-candidate fixture proves deterministic grouping and guards
    against an accidental pairwise algorithm;
  - run the nearest compiled desktop suite and `rtk pnpm run qlty`.
- Production Readiness: perform one strategy selection/canonicalization per
  scoped unit and deterministic grouping. Preserve duplicates. Malformed forms
  fall back rather than throwing or broadening matches.
- Approval Boundary: domain semantic-diff strategy/correspondence source and
  the two test files above. No DTO, presentation, parser, telemetry, schedule,
  command, or configuration change.
- Dependencies: none after the approved plan commit.
- Risks: a wrong field over/under-matches; normalization can equate distinct
  macros/case; a delimiter key can collide. Assert structured fields and use
  unambiguous canonical serialization.
- Out of Scope: normalized-model changes, manual/similarity matching, general
  parameter interpretation, and unit families absent from the table.

### Slice 2: Project Complete Identity Decisions Into The Application DTO

- Status: Proposed; blocked by Slice 1 completion commit and renewed approval.
- Scope: add `identityDecisions` and `identityDecisionId`; project every domain
  outcome in stable order; update direct DTO fixtures/consumers required by the
  additive contract without changing presentation output.
- User / Domain Value: every result, including unchanged exact matches and all
  ambiguous candidates, is reviewable and serializable without rerunning rules.
- Cohesive Change Group: Semantic Diff DTO/comparison mapping and contract,
  comparison, report-data, command, and Flow fixtures directly affected by the
  required collection.
- Acceptance:
  - `SemanticDiffIdentityDecision` implements the complete discriminated union
    and required/empty side fields defined above for exact,
    fingerprint-confirmed, candidate, removed, and added outcomes;
  - every outcome has a typed rule, deterministic collision-free ID, and
    collection order; candidate references are sorted and contain all before /
    after references, not only the legacy first after target;
  - unit structural/attribute changes reference their decision; relation and
    schedule behavior remains unchanged;
  - serialized output includes strategy, field presence/values, rule, status,
    sorted references, and complete candidate sets, but no domain/parser/VS
    Code object, `Map`, or function;
  - existing fields remain available, preserving report data, command handoff,
    and Flow highlights; candidate changes do not expose a falsely selected
    after target;
  - no telemetry event, property, log, or adapter receives evidence.
- Validation:
  - extend `semanticDiffContracts.test.ts` for exact JSON shape,
    serializability, union discriminants, required/empty fields, stable
    collision-free IDs, sorting, unchanged exact outcomes, and prohibited
    values;
  - extend `compareSemanticDiff.test.ts` for all outcome mappings, sorted
    references, candidate sets, separate `te` versus `sc`/`prm` changes, and
    fingerprint-changing add/remove;
  - keep `buildSemanticDiffReportData.test.ts`,
    `semanticDiffFlowHighlights.test.ts`, and `semanticDiffCommand.test.ts`
    compatible, asserting only the additive contract where relevant;
  - run the compiled desktop suite, `rtk pnpm run test:web`,
    `rtk pnpm run qlty`, and a production build because a shared exported DTO
    crosses both extension hosts.
- Production Readiness: evidence is deterministic, bounded to scoped units and
  fields, and mapped without repeating domain matching. Verify the same plain
  JSON union, IDs, sorting, and candidate references through desktop and web;
  preserve browser-safe transport and VS Code `^1.75.0`.
- Approval Boundary: `semanticDiffDto.ts`, `compareSemanticDiff.ts`, and direct
  DTO/consumer tests. Flow implementation, Markdown, commands, telemetry,
  parser, package metadata, and configuration are excluded.
- Dependencies: Slice 1 strategy and domain-decision contract.
- Risks: required collection touches hand-built fixtures; unstable IDs/order
  create noise; embedded domain values break architecture/serialization.
- Out of Scope: public JSON export/schema, report modes, risk types, UI, and
  Flow highlight rule changes.

### Slice 3: Render Typed Identity Evidence And Verify Host Compatibility

- Status: Proposed; blocked by Slice 2 completion commit and renewed approval.
- Scope: make existing English/Japanese Markdown resolve typed identity
  decisions; render rule, strategy, fields, and full candidate set; remove
  rationale localization based on string substrings; finish cross-host and
  release-note evaluation.
- User / Domain Value: reviewers can see why a rename, move, candidate,
  addition, removal, or matched attribute change received its outcome in the
  existing report, with equal English/Japanese meaning.
- Cohesive Change Group: existing Markdown renderer/localization/text
  resources, direct tests, minimal report lookup wiring, and `CHANGELOG.md`
  because matching/rationale are externally observable. README remains
  unchanged unless implementation proves the workflow changed.
- Acceptance:
  - labels derive from typed rule/strategy IDs; raw paths, keys, commands, file
    names, and event filters remain unchanged and Markdown-escaped;
  - confirmed results show strategy/fields; candidates show every target and
    ambiguity; additions/removals show unmatched rule and available evidence;
  - exact-matched attributes show exact-key evidence without reconstructed
    rules;
  - missing/non-applicable references retain the change and omit unavailable
    evidence rather than crashing;
  - no-change output stays no-change despite unchanged exact decisions; Flow
    highlight output stays unchanged;
  - desktop/web share evidence and report meaning; no Node built-in or newer VS
    Code API is introduced.
- Validation:
  - extend `renderSemanticDiffMarkdown.test.ts` for English/Japanese exact,
    confirmed, candidate, added, removed, ordering, raw value, escaping, and
    missing-reference cases;
  - update localization/text tests and replace substring rationale assertions
    in sample coverage with typed evidence assertions;
  - run all Semantic Diff structural, comparison, evidence, schedule, contract,
    report-data, report, command, and Flow suites;
  - run `rtk pnpm run test:full`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`.
- Production Readiness: never log/send evidence; escape raw values; render
  repeated values/candidates deterministically; never recompute fingerprints
  in presentation. Work remains linear in scoped candidates/fields.
- Approval Boundary: existing Semantic Diff Markdown presentation/localization
  source/resources, direct tests, and `CHANGELOG.md`. No new view, command,
  JSON output, telemetry, parser, package, or configuration. README or a new
  workflow requires Replanning.
- Dependencies: Slice 2 DTO and decision references.
- Risks: evidence can be verbose or sensitive. Expose only identity fields for
  local review; do not copy implicitly, log, or send via telemetry.
- Out of Scope: report modes, JSON/CI output, Explorer UI, implicit clipboard
  mutation, and Flow interaction changes.

## Cross-Slice Readiness

- Before each slice, confirm the prior completion commit and record exact
  approved paths. Every slice runs nearest tests and qlty; Slice 3 supplies
  final `test:full` and build evidence. Slice 2 must run the web suite because
  the shared DTO is transported to both hosts.
- Preserve `engines.vscode` `^1.75.0`, browser-safe shared code, architecture
  rules, and parser acceptance.
- Definition, parameter, candidate, and repeated-value order must not affect
  outcomes. Candidate/reference sorting and ID generation use ordinal,
  host-independent ordering. Large groups retain grouped near-linear matching.
- Parser errors and normalization warnings remain limitations. Parser-adjacent
  data or a new normalized field triggers Replanning.
- Schedule, risk, relation, report command, clipboard, and Flow behavior are
  regression scope only.
- CHANGELOG is required in Slice 3. README is not planned because no command or
  workflow changes.
- At Feature Exit, update `uc-build-semantic-diff.md` with durable strategy,
  fallback, and evidence rules. Update `uc-present-semantic-diff-report.md`
  only if its observable contract needs greater precision. No architecture,
  context-map, glossary, or vision update is expected.

## Replanning Triggers

- A strategy needs parser data, normalized-model expansion, or a new shared
  effective-value rule.
- A unit family, canonical field, fallback, public contract, or approval path
  changes.
- Work needs manual/similarity matching, UI/commands, JSON/report modes,
  telemetry, schedule/risk changes, or newer VS Code compatibility.
- A slice cannot remain independently testable/committable, or the additive
  DTO migration requires a breaking removal.

## Feature Exit

- Definition of Done status: not started; all three slices must be completed,
  reviewed, approved, and committed.
- Closure evidence includes the final strategy table, regression and host
  results, compatibility assessment, CHANGELOG decision, durable use-case
  propagation, and confirmation that telemetry received no evidence fields.

## Validation Checklist

- [ ] Independent plan review returns `Ready`.
- [ ] Human Approval records the exact next-slice scope and paths.
- [ ] Every strategy, recovery type, fallback, safeguard, and default has tests.
- [ ] Every identity outcome has DTO and report evidence tests.
- [ ] Existing Semantic Diff behavior remains compatible outside approved
      identity scenarios.
- [ ] Desktop/web test and build evidence passes after the shared DTO change.
- [ ] `rtk pnpm run qlty` passes for every slice.
- [ ] README and CHANGELOG decisions are confirmed before Feature Exit.
