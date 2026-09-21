# Feature Tasks: Schedule Domain Ownership

<!-- markdownlint-disable MD013 MD060 -->

## Agent Brief

- Purpose: make `src/domain/schedule` the single semantic owner of reusable
  normalized schedule-date, rule, interpretation, calendar/candidate, and
  projection meaning without changing any behavior contract.
- Selected feature evidence: `docs/specs/roadmap.md` names
  `schedule-domain-ownership` as the first selected internal-architecture
  feature; the plan-gate commit contains its reviewed intake and slice plan.
- Complete plan: four ordered implementation slices. Each slice deletes the
  superseded owner in the same change; no compatibility forwarding module is
  authorized.
- Approved implementation scope: all four slices in the reviewed sequential
  order. Active slice: Slice 1 (`Establish schedule date and rule ownership`)
  is the only slice currently eligible for implementation; Slices 2-4 wait
  for their predecessor's completion review and commit.
- Do not: change JP1/AJS schedule behavior, application DTOs, serialized
  schemas, commands, presentation, bootstrap, parser infrastructure, or any
  roadmap feature F2-F8.
- Approval and validation policy: `docs/specs/README.md`.

## Sync Rule

- Update this file in the same commit whenever a slice is completed,
  re-scoped, or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Other
  feature folders inherited from the base branch remain out of scope.
- Update `docs/specs/roadmap.md` only when repository-level future work,
  ordering, entry conditions, or unresolved product concerns change.
- Remove history once it no longer affects approval, dependency, risk,
  validation, or a later slice.

## Plan Revision Record

- Trigger: independent plan review Findings requiring complete contract
  ownership, an exact schedule-owned projection-period boundary, closed
  approval manifests, and per-slice web evidence.
- Revision mode: Replanning only; the feature purpose, four-slice order, and
  all unrelated boundaries are preserved.
- Finding 1 addressed by the contract ownership ledger below. It names every
  retained, moved, renamed, or made-local exported abstraction in each slice,
  including Semantic Diff evaluation/input/decision/matched-unit/run
  contracts, all ScheduleDate contracts, and all ScheduleCalendar contracts.
- Finding 2 addressed in Slice 4 by the exact `ScheduleProjectionPeriod`
  contract, explicit facade mapping, the schedule-to-Semantic-Diff dependency
  prohibition, deferred F2 canonical parsing/validation, and tests.
- Finding 3 addressed by the exact edit/validation manifests in each slice.
  Unlisted paths are excluded from every approval boundary.
- Finding 4 addressed by explicit web validation in every slice, in addition
  to the retained compile/build and desktop evidence.
- Round-2 Finding 1 addressed in Slice 4 by adding
  `semanticDiffScheduleCalendar.test.ts` to the edit manifest, specifying its
  direct `ScheduleCalendar`/`ScheduleInterpretation`/`ScheduleProjection`
  import migration, and requiring the final old-import/export audit.
- Round-2 Finding 2 addressed by recording the exact desktop commands
  `rtk pnpm run test:prepare:desktop` and `rtk pnpm run test:desktop:run`
  separately in every slice's validation evidence.
- Round-2 Finding 3 addressed by extending the Slice 4 Solution Shape ledger
  for retained `SemanticDiffComparisonPeriod`, application-owned
  `SemanticDiffScheduleRunChange`/`SemanticDiffScheduleComparison`, the
  `ScheduleRun` transition inside comparison decisions and side evaluations,
  and private `toScheduleProjectionPeriod` ownership, direction, and tests.
- Round-2 Finding 4 addressed by making the calendar-index visibility,
  allowed-consumer set, lifecycle owner, test evidence, and import audit
  explicit below. The boundary follows the current call graph and does not
  introduce a generic document index.
- Round-2 Finding 5 addressed by closing the Slice 4 validation-only set with
  the Unit List, diagnostics, and schedule-rule helper suites and by adding a
  manifest re-audit rule for every slice.
- Round-3 Finding 1 addressed by the closed cross-slice import contract below.
  Slice 3 changes only the calendar/index/context/operational-month imports in
  `semanticDiffScheduleCalendar.test.ts`; Slice 4 changes only its
  `interpretSchedule` and `projectScheduleRuns` imports. Each completion state
  names the imports that must compile before the next slice starts.
- Round-3 Finding 2 addressed by the reproducible all-`src` old-module,
  old-symbol, export, and import audit below. It has an explicit denylist,
  comparison-only allowlist, forwarding-export checks, and an explicit
  `AjsDocumentIndex` exclusion with phase-specific pass criteria for Slices 2,
  3, 4, and Feature Exit.
- Round-3 Finding 3 addressed by replacing the structural immutable claim for
  the calendar index with a logical read-only-after-construction rule. The
  plan records the no-mutation prohibition, lifecycle, and test evidence; no
  readonly-type or deep-freeze migration is added.
- Round-3 Finding 4 addressed by making focused-test evidence executable using
  only the verified repository runners. Because the repository has no suite
  filter, each slice executes the exact full desktop runner and records the
  named suites' pass results from its output against the closed validation
  manifest.
- Round-3 re-audit completed for similar ambiguity: every slice now states its
  completion imports, full-runner evidence rule, audit phase, and closed
  manifest relationship; no runtime/test/config scope is added.
- Round-4 Finding 1 addressed by making the Slice 3 interim facade contract
  explicit: `interpretSchedule` and `projectScheduleRuns` remain forwarding
  exports, while the comparison-owned `compareScheduleRuns`,
  `SemanticDiffScheduleRunDecision`, and `SemanticDiffScheduleSide` exports
  (plus the exact comparison-view exports already consumed by the facade)
  remain available through the facade until Slice 4. Slice 4 records the
  direct comparison-module imports and the tests that prove which exports are
  finally removed versus retained.
- Round-4 Finding 2 addressed by separating period responsibilities. The
  Semantic Diff facade owns the comparison-level guard and the unchanged
  `invalid-period` decision. `ScheduleProjection` retains only a private
  defensive precondition for direct schedule callers; it never creates the
  comparison `invalid-period` decision and is not a canonical period parser.
  The two contracts and their distinct tests are recorded in Slice 4.
- Round-4 Finding 3 addressed by adding an exact Slice 3 test hunk to the
  closed edit manifest. It creates one explicitly supplied calendar context
  index, resolves the same logical document repeatedly through that value, and
  proves that `byId`, `byPath`, and `duplicatePath` are unchanged. The test
  does not claim to observe index construction count.
- Round-4 Finding 4 addressed by replacing the single-line forwarding-export
  check with a multiline-safe Node inspection and by adding an exact
  path/symbol owner inventory assertion for every all-`src` `SemanticDiffSchedule*`
  match. The assertion has no repository script or configuration dependency.
- Round-4 Finding 5 addressed by defining each slice validation manifest as
  the union of its editable paths and validation-only paths, then mapping every
  named test suite in that union to the full desktop runner output. A final
  phase re-audit below checks the same phase/manifest rule for all four slices.
- Round-4 analogous-contradiction re-audit confirms that Slice 3 alone edits
  the calendar integration test body for the same-index/non-mutation proof, Slice 4 alone
  migrates interpretation/projection/comparison-owner imports, every named
  suite is in its `M_s(test)` union, and the final owner inventory is not
  required before the old owners are intentionally removed.
- Round-5 Finding 1 addressed by making the Slice 4 facade audit reject
  `SemanticDiffScheduleSide` and `SemanticDiffScheduleRunDecision` in every
  multiline or aliased type re-export form, and by separating declaration
  owners from permitted internal references in the final all-`src` inventory.
  The comparison-owner declarations remain allowed only at
  `semanticDiffScheduleComparison.ts`; facade references are permitted only
  as internal implementation references, never as declarations or forwards.
- Round-5 Finding 2 addressed by reclassifying
  `resolveScheduleRuleNumber`, `ScheduleCalendarContextInput` (formerly
  `SemanticDiffScheduleContextInput`), and `createScheduleCalendarContext`
  as local, non-exported helpers in `ScheduleRule.ts` and `ScheduleCalendar.ts`.
  The current repository call graph has no external consumer for any of the
  three; exact new-module export audits and local-only path checks now prove
  that no public boundary is being removed. Slice manifests and traceability
  retain the same four slices and approval paths.
- Round-6 Finding 1 addressed by re-auditing every retained
  `SemanticDiffSchedule*` declaration against the repository. The final owner
  inventory now places `SemanticDiffScheduleImpactUnavailableReason` and
  `SemanticDiffScheduleImpactAvailability` in
  `buildSemanticDiffPresentationArtifacts.ts`, and
  `SemanticDiffScheduleImpactLookup` in
  `semanticDiffExplorerPanelTypes.ts`; no declaration is attributed to a
  reference-only file. A baseline inventory records the current transitional
  owners separately from the post-Slice-4 owner inventory.
- Round-6 Finding 2 addressed by making Slice 2 phase pass criteria retain
  the exact interim facade set: `compareScheduleRuns`,
  `SemanticDiffScheduleSide`, `SemanticDiffScheduleRunDecision`, and the
  comparison-view exports required by current consumers, alongside only the
  two temporary reusable bridges. Slice 4 remains the only phase that removes
  those comparison forwards.
- Round-6 Finding 3 addressed by replacing the old name-only forwarding regex
  with a positive TypeScript-compiler export-surface assertion. It resolves
  aliases and star exports, compares exact phase-specific value/type sets, and
  rejects unauthorized direct, type-only, aliased, indirect, `export *`, and
  `export type *` forwarding without adding a repository script or config.
- Round-6 Finding 4 addressed by adding exact expected export sets for every
  new public module (`ScheduleDate`, `ScheduleRule`,
  `ScheduleInterpretation`, `ScheduleCalendar`, `ScheduleCandidateResolver`,
  `ScheduleProjection`, `semanticDiffScheduleComparison`, and the final
  facade). Substitution helpers are private inside `ScheduleProjection` and
  have no separate module export contract.
  Over-export, alias, and re-export drift is a Finding/NG.
- Round-6 Finding 5 addressed by replacing the vague schedule-impact
  traceability evidence with the closed `M_4(test)` manifest and re-auditing
  analogous vague suite references to exact paths or exact runner commands.
- Round-7 Finding 1 addressed by replacing the facade-only compiler audit with
  a structural export audit over every `phaseModules` entry. Final owner
  modules require direct declaration ownership and reject wildcard, aliased,
  and indirect forwarding; only the exact interim facade bridge map may use
  direct `export ... from` or local-import-plus-export forms. The resolver uses
  `checker.getExportSpecifierLocalTargetSymbol` and verified import ancestry,
  with a checked executable probe against the current facade syntax.
- Round-7 Finding 2 addressed by removing `SemanticDiffScheduleRun` from the
  reusable global denylist. Slice 4 and Feature Exit now use a separate
  path-scoped retirement assertion: no domain declaration or reference may
  remain, while the unchanged application DTO declaration and its four
  allowlisted application reference files remain exact and explicit.
- Round-7 Finding 3 addressed by adding the structural export contract,
  compiler-API probe evidence, phase/final pass criteria, and traceability for
  the namespace-collision and domain-run retirement audits. The four-slice
  ownership and approval boundaries remain unchanged.
- Round-7 validation evidence: the current-tree bridge probe passed for the
  existing local-import-plus-export and direct `export ... from` forms; the
  embedded phase, probe, and retirement scripts all pass `node --check`. The
  pre-migration retirement run reports only the seven expected old domain
  paths, while the exact application DTO owner/reference assertions remain
  satisfied; final retirement is intentionally deferred to Slice 4.
- Round-8 Finding 1 addressed by co-locating substitution analysis,
  adjustment, and projection helpers as private helpers in
  `ScheduleProjection.ts`. The planned empty-export `ScheduleSubstitution.ts`
  path, owner, export contract, phase-module entry, and manifest entry are
  removed because substitution has no independent consumer, lifecycle, or
  public contract that earns a second boundary.
- Round-8 Finding 2 addressed by including
  `semanticDiffScheduleRules.ts` in the Slice 2 and Slice 3 `phaseModules`
  lists. Their exact interim facade export sets and five allowed bridge source
  rules are declared per phase; the compiler/structural audit rejects duplicate
  direct declarations, aliases, wildcard exports, and every unauthorized
  re-export while permitting only those exact bridges.
- Round-8 Finding 3 addressed by correcting the final namespace inventory:
  `buildSemanticDiffPresentationArtifacts.ts` permits its owned availability
  names plus its imported `SemanticDiffScheduleImpact`, and
  `semanticDiffExplorerPanelTypes.ts` permits its owned lookup plus its
  imported `SemanticDiffScheduleImpact`, matching the repository's exact
  symbol scans.
- Round-8 Finding 4 addressed by narrowing the calendar-index claim. The
  repeated-resolution test proves that the same explicitly supplied index is
  passed to both calls and that its `byId`, `byPath`, and `duplicatePath`
  snapshots do not change; it does not claim to observe construction count or
  prove that no other index was created. Lifecycle ownership is therefore
  recorded as caller-supplied index construction and resolver non-mutation.
- Round-8 Finding 5 addressed by adding an exact path-resolved TypeScript
  import/re-export audit for every `src/domain/schedule` module. It resolves
  ordinary, type-only, aliased, `export ... from`, `export *`, and
  `export type *` forms and rejects any dependency on
  `src/domain/services/semantic-diff` or `src/domain/models/semantic-diff`.
  Slice 4 and Feature Exit both run it; all embedded audits and phase-module
  maps are re-audited for actual inclusion and stale paths.
- Round-9 Finding 1 addressed by replacing the global retirement check with
  one phase-explicit audit. `SDD_PHASE` is required and selects only the old
  module paths and reusable symbols retired by that phase; Slice 4 and
  Feature Exit select the full denylists. The same phase argument is required
  by the export, file-set, and local-boundary checks, so a future symbol cannot
  fail an earlier phase and a missing later retirement cannot pass silently.
- Round-9 Finding 2 addressed by adding executable `rtk rg --files` assertions
  for every retired path, explicit absence of every
  `ScheduleSubstitution.*` variant, and an exact unfiltered actual-file-set
  comparison for `src/domain/schedule` at every phase. The expected package
  set is cumulative (`ScheduleDate`/`ScheduleRule`, then
  `ScheduleInterpretation`, then `ScheduleCalendar`/`ScheduleCandidateResolver`,
  then `ScheduleProjection`) and is checked in addition to the hard-coded
  export-module map.
- Round-9 Finding 3 addressed by making every slice's clean-snapshot web
  sequence explicit: after the final build, run only
  `rtk pnpm run test:web`. Its package lifecycle invokes
  `pretest:web -> test:prepare:web`; record that nested preparation output and
  the web-run output as distinct evidence within the one command invocation.
  The existing desktop sequence remains ordered as
  `rtk pnpm run test:prepare:desktop`, then
  `rtk pnpm run test:desktop:run`, with both outputs recorded.
- Round-9 Finding 4 addressed by adding an executable declaration-owner and
  non-export audit for `resolveScheduleRuleNumber` in `ScheduleRule.ts` and
  `ScheduleCalendarContextInput`/`createScheduleCalendarContext` in
  `ScheduleCalendar.ts`, selected by the same required phase argument. The
  audit also re-checks every analogous local-only helper listed in the
  ownership ledger, rejects exports and duplicate declarations, and rejects
  symbol-resolved imports, exports, aliases, or external references to the
  recorded private helper once that helper's retirement phase is reached.
- Round-10 Finding 1 addressed by making the schedule-package inventory use
  unfiltered `rtk rg --files src/domain/schedule` output. Each phase now has an
  exact all-file set, including any nested or non-TypeScript artifact, while
  every `ScheduleSubstitution.*` path and every retired owner stem variant is
  rejected across the source tree.
- Round-10 Finding 2 addressed by replacing the local-only text occurrence
  scan with a TypeScript checker symbol audit. Same-name private declarations
  in unrelated files (for example `ScheduleDiagnosticRules.ts`'s
  `ScheduleByDaysFromStartType`) are allowed when they resolve to a different
  symbol; imports, exports, aliases, or external references resolving to the
  schedule-owned private symbol remain failures. No unrelated name is renamed.
- Round-10 Finding 3 addressed by recording a complete transitional
  declaration-owner table for the pre-migration scan and explicitly keeping
  that table separate from the final `declarationOwners` map and phase
  retirement map. The baseline scan therefore cannot be judged by a
  post-Slice-4 owner map or pass with an omitted transitional declaration.
- Round-10 Finding 4 addressed by making the final owner inventory assert that
  every `declarationOwners` entry has exactly one direct exported declaration
  at its recorded owner, then separately reject every unexpected exported
  declaration and unapproved reference path.
- Round-10 Finding 5 addressed by using only `rtk pnpm run test:web` after the
  final build. Its automatic `pretest:web -> test:prepare:web` preparation is
  recorded as nested output within the web-run evidence; no standalone
  `test:prepare:web` invocation is duplicated.
- Round-11 Finding addressed by re-auditing every embedded Node audit script's
  imports and runtime bindings. The phase retirement/file-set script now
  imports `execFileSync` from `node:child_process` and `readFileSync` from
  `node:fs`, and removes its unused `relative` import. The local-only owner
  script now imports `ts` from `typescript` and `relative` from `node:path`
  and removes unused child-process/filesystem imports. The structural export
  script removes its unused `readFileSync` import. All remaining embedded
  scripts retain only imports that their bodies use; no runtime
  `ReferenceError` or syntax error remains.
- Round-11 validation evidence: all seven embedded script bodies pass
  `node --check --input-type=module`. The phase retirement/file-set audit was
  executed with `SDD_PHASE=slice1`, `slice2`, `slice3`, `slice4`, and
  `feature-exit`; each non-zero result is the expected pre-migration failure
  because retired files still exist and `src/domain/schedule` is absent, not
  a script runtime/import failure. The local-only owner audit was executed in
  all five phases and reaches its expected missing-planned-owner assertions;
  the exact export/forwarding audit was executed for `slice1` through
  `slice4` and reaches its expected missing-new-module assertion. The
  current-tree bridge probe passes. The pre-migration owner-inventory audit
  and `SemanticDiffScheduleRun` retirement audit report only their expected
  transitional-owner/domain-reference failures; the dependency audit is
  vacuously clean because the schedule package does not yet exist. These
  outcomes are recorded as pre-migration expectations; any `ReferenceError`,
  `SyntaxError`, or other script runtime failure in a slice snapshot remains
  a Finding/NG. Final `rtk pnpm run lint:md`, qlty check, qlty smells, and
  whitespace/diff checks passed; the qlty check reported no issues after the
  disposable formatter result was synchronized to the approved traceability
  row. The formatting-capable `rtk pnpm run qlty` aggregate also exited 0 in
  a disposable final snapshot and made no working-tree change.
- Round-12 P2 Finding addressed by removing the unused default `ts` import from
  the phase retirement/file-set audit (script 1). A fresh import-use audit
  confirms that all seven embedded scripts retain only imports referenced by
  their bodies; all seven bodies pass `node --check --input-type=module`.
- Round-12 validation evidence: the phase retirement/file-set audit was
  rerun for `slice1`, `slice2`, `slice3`, `slice4`, and `feature-exit`; the
  local-only owner audit was rerun for the same five phases; and the exact
  export/forwarding audit was rerun for `slice1` through `slice4`. Each
  non-zero result remains an expected pre-migration assertion about missing
  planned owners or present retired files, with no `ReferenceError`,
  `SyntaxError`, missing-import, or other script runtime failure. The current
  tree bridge probe still passes, and the pre-migration owner-inventory,
  `SemanticDiffScheduleRun` retirement, and schedule-package dependency audits
  retain only their expected transitional-tree results. The subsequent
  independent plan review round 13 returned `Ready for approval` with no
  Findings and no replanning required. Post-revision `rtk pnpm run lint:md`,
  qlty check/smells, final `rtk pnpm run qlty`, and `git diff --check` all
  passed; the aggregate qlty run exited 0 without changing the planning
  package. Human Approval is recorded below for the complete reviewed plan and
  sequential implementation of all four slices. Completion Approval remains
  a separate per-slice gate after each independent implementation review
  returns `Ready`; Closure Approval remains pending.

## Plan Status

- Status: Reviewed and approved for sequential implementation of Slices 1-4;
  Slice 1 is active and later slices await predecessor completion gates
- Planning scope: all requirements and acceptance criteria in `SPECS.md`,
  decomposed into four implementation slices
- Review status: `Ready for approval` (independent plan review round 13; no
  Findings; no replanning required)
- Human approval: approved for implementation of Slices 1-4 in order; per-
  slice Completion Approval remains conditional on an independent `Ready`
  implementation review
- Active implementation slice: Slice 1, after the approved plan-gate commit
- Implementation branch: `codex/schedule-domain-ownership`; approved plan-gate
  commit `0a28b73` is present. Runtime/test edits remain limited to the active
  slice and its recorded approval boundary.

## Human Approval

- Status: Approved
- Approved at: approved in the current conversation for all four slices
- Approved scope: the complete reviewed four-slice `schedule-domain-ownership`
  implementation plan and implementation of Slices 1-4 in their recorded
  sequential order. Slice 1 is the current implementation scope. Each later
  slice becomes eligible only after its predecessor is independently reviewed,
  receives the conditional Completion Approval recorded below, and is
  committed. The user's approval does not authorize concurrent or out-of-order
  implementation and does not grant Feature Closure Approval.
- Approved paths:
  - Plan gate commit (already committed as `ad72765`; exact paths were):
    `docs/specs/roadmap.md`,
    `docs/specs/features/schedule-domain-ownership/SPECS.md`,
    `docs/specs/features/schedule-domain-ownership/TASKS.md`, and
    `docs/specs/features/schedule-domain-ownership/TRACEABILITY.md`.
  - Slice 1 implementation: the exact additions, deletions, edits, and
    validation-only paths in Slice 1's `Approval Boundary (closed edit
manifest)` and `Validation-only closed set` below.
  - Slice 2 implementation: the exact additions, deletions, edits, and
    validation-only paths in Slice 2's corresponding closed manifest below;
    usable only after Slice 1's completion commit.
  - Slice 3 implementation: the exact additions, deletions, edits, and
    validation-only paths in Slice 3's corresponding closed manifest below;
    usable only after Slice 2's completion commit.
  - Slice 4 implementation: the exact additions, rename, deletions, edits,
    and validation-only paths in Slice 4's corresponding closed manifest
    below; usable only after Slice 3's completion commit.
  - Validation-only paths in every slice remain read-only. Paths outside these
    closed manifests, including Feature Exit and closure artifacts, are not
    approved.

Implementation may start only with Slice 1 and its recorded paths. This
approval covers the later slice scopes above in sequence, but does not remove
the predecessor, independent implementation-review, Completion Approval, or
completion-commit gates.

Keep this Human Approval as `Approved` while any of Slices 1-4 remains
pre-approved and not yet completed. After each exact slice completion commit,
advance `Active implementation slice` to the next slice and reset only the
per-slice Completion Approval fields for that next slice. Reset this Human
Approval only after Slice 4 is complete and no approved implementation scope
remains; Feature Closure Approval is still a separate gate.

## Completion Approval

- Status: Approved
- Approved at: approved in the current conversation after independent
  implementation review Round 2 returned `Ready` with no Findings
- Approved scope: exact completed Slice 1, `Establish schedule date and rule
  ownership`, with no behavior change and no Slice 2/F2 work
- Approved paths: the exact reviewed Slice 1 completion diff:
  - `docs/specs/features/schedule-domain-ownership/TASKS.md`
  - `docs/specs/features/schedule-domain-ownership/TRACEABILITY.md`
  - `src/domain/schedule/ScheduleDate.ts`
  - `src/domain/schedule/ScheduleRule.ts`
  - `src/domain/models/parameters/scheduleDateInterpreter.ts`
  - `src/domain/models/parameters/scheduleRuleHelpers.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`
  - `src/application/unit-list/unitListScheduleValueHelpers.ts`
  - `src/domain/services/diagnostics/ScheduleDateRules.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarSelectors.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleOperationalMonth.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRelativeDate.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`
  - `src/test/suite/scheduleRuleHelpers.test.ts`
- Implementation review verdict: `Ready` (independent Round 2; no Findings)
- Review evidence: Round 1 remediation was revalidated with the exact
  `SDD_PHASE=slice1` retirement/file-set, local-only, and exact
  export/forwarding audits; the identical-config qlty check/smells comparison
  and final aggregate completed without a new Finding or analyzed-source
  change.
- Commit status: Eligible for one exact completion commit by
  `approval-committer`; not yet committed

This Completion Approval is the external human approval for the exact
reviewed Slice 1 diff above. It does not authorize implementation of Slice 2,
Feature Exit, closure propagation, or any path outside this list. The active
implementation slice remains Slice 1 until the completion commit; only after
that commit may Main advance the plan to Slice 2.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

Closure Approval follows a `Close` Feature Exit verdict and authorizes only
the recorded durable-document propagation, closure evidence, and selected
feature-folder removal.

## Current Call Graph And Ownership Decision

The reusable path is currently:

```text
scheduleDateInterpreter + scheduleRuleHelpers
  -> semanticDiffScheduleInterpreter / RuleInterpreter / RuleEvidence
  -> semanticDiffScheduleCalendar* / Candidate* / Operational*
  -> semanticDiffScheduleProjector / RuleProjection / Substitution*
  -> semanticDiffScheduleRules
  -> semanticDiffScheduleDiffer
  -> application compareScheduleDiff and schedule-impact projection
```

Diagnostics and Unit List already consume the same date/rule helpers directly.
Application Semantic Diff consumes only the comparison evaluation contract from
`semanticDiffScheduleRules.ts`. Presentation and bootstrap consume application
DTOs and do not import this domain implementation.

The ownership split for this feature is:

- `src/domain/schedule`: normalized `sd` and schedule-rule interpretation,
  definition-backed calendar selection/classification, bounded candidate
  resolution, schedule projection, completeness, and run facts.
- `src/domain/services/semantic-diff`: before/after side collection,
  comparison-period request handling, matched-unit canonicalization,
  unsupported/zero-run comparison decisions, run comparison, and evaluation
  output.
- Application: unchanged mapping from comparison decisions into stable DTOs.

The pre-migration reference audit found no external boundary for three small
helpers: `resolveScheduleRuleNumber` is referenced only by parsers in
`scheduleRuleHelpers.ts`, while `SemanticDiffScheduleContextInput` and
`createScheduleCalendarContext` are referenced only by the calendar context
implementation and its operational-month collaborators. They therefore
become local, non-exported helpers in the cohesive `ScheduleRule.ts` and
`ScheduleCalendar.ts` modules. Any new consumer would be a Replanning trigger;
it is not silently added to this feature.

The schedule calendar context index has the smallest boundary supported by the
current call graph: `ScheduleCalendarContextIndex` and
`createScheduleCalendarContextIndex` are exported from the domain-owned
`ScheduleCalendar.ts` because the Semantic Diff facade and the calendar
integration suite explicitly construct and pass that schedule-specific index
to `resolveScheduleCalendarContext`. The allowed consumers are therefore
`ScheduleCalendar.ts`, `semanticDiffScheduleRules.ts`'s side-collection
orchestration, and `semanticDiffScheduleCalendar.test.ts`; no application,
presentation, parser, or generic document-index consumer may import it.
`ScheduleCalendar` owns index construction and traversal semantics; the caller
owns when an index is constructed and which calls receive it. The index is
logically read-only after construction: traversal and classification may read
`byId`, `byPath`, and `duplicatePath`, but no consumer may mutate them; no
structural `Readonly` type, deep freeze, or readonly-model migration is part of
this feature. The repeated-resolution test proves only that the same explicit
index value is supplied to both calls and that those three snapshots are
unchanged; it does not observe construction count or prove that no other index
was created. The hierarchy helper `ancestorsOf` and all index traversal
helpers become local to the schedule package. The final audit must prove that
every index import is in this allowlist and that no `AjsDocumentIndex` or
forwarding export exists.

The following deliberately remains under the Semantic Diff facade for later
features: duplicate period parsing/validation, unit filtering, side collection,
context orchestration, pair evaluation, and output decision mapping. Moving
those responsibilities would implement
`schedule-primitives-and-document-index` or
`semantic-diff-schedule-facade`, not this feature.

## Shared Implementation Rules

- Preserve raw parameter evidence IDs, statuses, reason codes, run order,
  half-open period behavior, rule association, no-runs distinctions, and the
  maximum 31-day substitution lookaround.
- Move behavior; do not redesign algorithms, regexes, fallback rules, or data
  ordering while changing ownership.
- Rename a moved `SemanticDiffSchedule*` symbol to `Schedule*` only when its
  contract is reusable schedule meaning. Comparison-specific symbols retain
  `SemanticDiffSchedule*` names.
- Do not create an `index.ts` barrel, compatibility re-export, port, adapter,
  repository, domain event, class-based use case, or value-object wrapper.
- New-module export contracts are closed. `ScheduleRule.ts` exports only
  `ParsedRuleValue`, `parseParentScheduleRuleValue`, `parseCycleValue`,
  `parseClosedDaySubstitutionValue`, `parseShiftDaysValue`,
  `parseStartTimeValue`, `parseDelayTimeValue`, `parseWaitTimeValue`,
  `parseAnyScheduleTimeValue`, `parseWaitCountValue`,
  `EffectiveStartConditionMonitoringPair`,
  `resolveEffectiveStartConditionMonitoringPair`,
  `ParsedScheduleByDaysFromStartValue`, and
  `parseScheduleByDaysFromStartValue`; `resolveScheduleRuleNumber`,
  `parseRuleValue`, and the `ScheduleByDaysFromStart*` implementation helpers
  are local. `ScheduleCalendar.ts` exports only its `ScheduleCalendar*`
  contracts, `ScheduleOperationalMonth`,
  `createScheduleCalendarContextIndex`, `classifyScheduleCalendarDay`,
  `resolveScheduleCalendarContext`, the operational-month queries, and the
  three relative-date queries recorded in its Slice 3 Solution Shape;
  `ScheduleCalendarContextInput` and `createScheduleCalendarContext` are
  local. `SemanticDiffScheduleContextInput` must not survive the move.
  Exact export audits must compare these sets and reject aliases or
  re-exports that recreate either local boundary.
- `ScheduleProjection.ts` is the sole module for projection and its private
  substitution helpers; no `ScheduleSubstitution.*` module or export surface
  is planned because substitution has no independent consumer or lifecycle.
- Existing `semanticDiffScheduleRules.ts` forwarding exports for
  `interpretSchedule` and `projectScheduleRuns` are temporary cross-slice
  compile bridges only: Slice 2/3 may retain them while the direct test
  imports are migrated, Slice 4 removes both in the same change, and no new
  forwarding module or additional consumer is authorized. Through the end of
  Slice 3 the same facade must also retain the comparison-owned
  `compareScheduleRuns`, `SemanticDiffScheduleRunDecision`, and
  `SemanticDiffScheduleSide` exports, together with the exact comparison-view
  exports already consumed through that facade:
  `SemanticDiffScheduleMatchedUnit`,
  `SemanticDiffScheduleUnsupportedDecision`,
  `SemanticDiffScheduleEvidenceKind`,
  `SemanticDiffScheduleSideEvaluation`,
  `SemanticDiffSchedulePairEvaluation`,
  `SemanticDiffScheduleEvaluation`, and
  `EvaluateSemanticDiffScheduleInput`. Slice 4 decides the final direct owner
  for the comparison exports and updates every consumer/test in its closed
  manifest; Slice 3 may not remove or rename any of them.
- Period ownership is intentionally split by contract. The Semantic Diff
  facade's private comparison-level guard is the sole owner of deciding that a
  requested `SemanticDiffComparisonPeriod` is invalid and returning the
  unchanged `SemanticDiffScheduleEvaluation` `{ kind: "invalid-period" }`.
  `ScheduleProjection` receives only `ScheduleProjectionPeriod` and keeps a
  private defensive precondition/guard for a malformed direct schedule call;
  that guard returns the existing projection-level invalid/empty result and
  never emits `invalid-period`. It is not a canonical parser, public
  validator, or period primitive. F2 remains the owner of canonical period
  parsing/validation, so these are distinct boundary checks rather than two
  reusable validation authorities.
- A changed package/layer owner, contract/dependency direction,
  framework-versus-custom decision, abstraction/responsibility, affected
  surface, risk, validation, or approval path requires Replanning.

## Contract Ownership Ledger

The following is the closed contract ledger for this plan. “Public” means
exported from the named module for a consumer outside the co-located helper
implementation; “local” means the symbol may remain exported only while a
same-module implementation is being migrated and must be unexported before the
slice is complete. Every row records the semantic owner, exact name and
package/layer, responsibility, boundary reason, dependency direction, and
test evidence.

To keep ledger evidence closed rather than categorical, every short phrase
such as "integration", "schedule", or "impact" suite below resolves only to
the exact paths in the slice manifests: `src/test/suite/scheduleRuleHelpers.test.ts`,
`src/test/suite/unitListViewHelpers.test.ts`,
`src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`,
`src/test/suite/semanticDiffScheduleRules.test.ts`,
`src/test/suite/semanticDiffScheduleCalendar.test.ts`,
`src/test/suite/semanticDiffSchedule.test.ts`,
`src/test/suite/semanticDiffScheduleImpact.test.ts`,
`src/test/suite/scheduleImpactCalendarProjection.test.ts`,
`src/test/suite/semanticDiffContracts.test.ts`,
`src/test/suite/compareSemanticDiffWithArtifacts.test.ts`, and
`src/test/suite/architectureDependencyRules.test.ts`. No open-ended suite
category is part of an approval boundary.

For the grouped Slice 3 rows, the current source paths are exact: calendar
context/status/value contracts come from
`semanticDiffScheduleCalendarTypes.ts`; `createScheduleCalendarContextIndex`,
`AncestorResult`, and `ancestorsOf` come from
`semanticDiffScheduleCalendarIndex.ts`; selector/group/source contracts come
from `semanticDiffScheduleCalendarSelectors.ts`; operational-month contracts
come from `semanticDiffScheduleOperationalMonth.ts`; relative-date contracts
come from `semanticDiffScheduleRelativeDate.ts`; and candidate contracts come
from the four candidate modules listed in the Slice 3 manifest. Slice 4 rows
name their current source module wherever a moved module is involved; the
remaining facade contracts are all from `semanticDiffScheduleRules.ts`, except
`SemanticDiffScheduleSide` from `semanticDiffScheduleTypes.ts` and
`SemanticDiffScheduleRunDecision`/`compareScheduleRuns` from
`semanticDiffScheduleDiffer.ts`.

### Slice 1 ledger: ScheduleDate and ScheduleRule

| Current name and owner                                                                                                                                                                                                                                                                                                                                                                                                                                   | Final name and owner                                                | Responsibility / boundary rationale                                                                                                                                                                                | Direction and tests                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScheduleDateWeekday`, `ScheduleDateDay`, `ScheduleDateInterpretation`, `interpretScheduleDateValue` from `domain/models/parameters/scheduleDateInterpreter.ts`                                                                                                                                                                                                                                                                                          | Same names in `src/domain/schedule/ScheduleDate.ts` (domain)        | Normalized JP1/AJS `sd` token grammar and interpretation shared by Unit List, diagnostics, calendar, and projection; one boundary because the meaning changes together.                                            | Domain-only; `src/test/suite/scheduleRuleHelpers.test.ts`, `src/test/suite/unitListViewHelpers.test.ts`, `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`, `src/test/suite/semanticDiffScheduleCalendar.test.ts`, and `src/test/suite/semanticDiffSchedule.test.ts`. |
| `daysInGregorianMonth`, `isInvalidCalendarMonth`, `isInvalidCalendarDay`, `isImpossibleYearDay`, `createScheduleDate`, `toUtcDate`, `formatScheduleDate`, `daysInGregorianMonthOrUndefined` from `semanticDiffScheduleDateMath.ts`                                                                                                                                                                                                                       | Same names as domain-owned implementation in `ScheduleDate.ts`      | Gregorian/UTC date construction and formatting used by calendar/projection; retained as helpers of ScheduleDate, not a period abstraction.                                                                         | Domain-only; `src/test/suite/semanticDiffScheduleCalendar.test.ts`, `src/test/suite/semanticDiffSchedule.test.ts`, `src/test/suite/architectureDependencyRules.test.ts`, and build.                                                                                               |
| `ParsedRuleValue`, `parseParentScheduleRuleValue`, `parseCycleValue`, `parseClosedDaySubstitutionValue`, `parseShiftDaysValue`, `parseStartTimeValue`, `parseDelayTimeValue`, `parseWaitTimeValue`, `parseAnyScheduleTimeValue`, `parseWaitCountValue`, `EffectiveStartConditionMonitoringPair`, `resolveEffectiveStartConditionMonitoringPair`, `ParsedScheduleByDaysFromStartValue`, `parseScheduleByDaysFromStartValue` from `scheduleRuleHelpers.ts` | Same names in `src/domain/schedule/ScheduleRule.ts` (domain)        | Rule-prefixed value parsing, start-condition pair resolution, and existing defaults; one boundary because Unit List, diagnostics, and schedule interpretation consume the same rule meaning.                       | Domain-only; `src/test/suite/scheduleRuleHelpers.test.ts`, `src/test/suite/unitListViewHelpers.test.ts`, `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`, and `src/test/suite/semanticDiffScheduleRules.test.ts`.                                                   |
| `resolveScheduleRuleNumber` from `scheduleRuleHelpers.ts`                                                                                                                                                                                                                                                                                                                                                                                                | Local, non-exported helper in `src/domain/schedule/ScheduleRule.ts` | Default-rule-number resolution has no external consumer or independent lifecycle in the repository call graph; it is an implementation detail of the co-located parsers and must not become a new public boundary. | Local-only; exact ScheduleRule export audit plus parser behavior through `scheduleRuleHelpers.test.ts`.                                                                                                                                                                           |

### Slice 2 ledger: ScheduleInterpretation

| Current name and owner                                                                                                                                                                                                 | Final name and owner                                                                        | Responsibility / boundary rationale                                                                                                       | Direction and tests                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SemanticDiffScheduleStatus` from `semanticDiffScheduleTypes.ts`                                                                                                                                                       | `ScheduleStatus` in `src/domain/schedule/ScheduleInterpretation.ts` (domain)                | Supported/no-runs/invalid/unsupported/missing-context outcome owned by reusable schedule interpretation, not comparison.                  | Schedule meaning only; `src/test/suite/semanticDiffScheduleRules.test.ts`, `src/test/suite/semanticDiffSchedule.test.ts`, `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`, and `src/test/suite/unitListViewHelpers.test.ts`. |
| `SemanticDiffScheduleUnsupportedReason` from `semanticDiffScheduleTypes.ts`                                                                                                                                            | `ScheduleUnsupportedReason` in `ScheduleInterpretation.ts` (domain)                         | Stable JP1/AJS failure/reason vocabulary for interpretation and projection.                                                               | Schedule meaning only; unsupported/invalid evidence assertions in `semanticDiffScheduleRules.test.ts` and `semanticDiffSchedule.test.ts`.                                                                                                  |
| `SemanticDiffScheduleEvidence` from `semanticDiffScheduleTypes.ts`                                                                                                                                                     | `ScheduleEvidence` in `ScheduleInterpretation.ts` (domain)                                  | Raw parameters, evidence ID, and rule association retained as reusable schedule evidence.                                                 | Schedule meaning only; evidence-ID/raw-parameter assertions in `semanticDiffScheduleRules.test.ts`.                                                                                                                                        |
| `SemanticDiffScheduleRuleInterpretation` from `semanticDiffScheduleTypes.ts`                                                                                                                                           | `ScheduleRuleInterpretation` in `ScheduleInterpretation.ts` (domain)                        | One interpreted schedule parameter with status, reason, evidence, date, and start time.                                                   | ScheduleInterpretation owns it; `src/test/suite/semanticDiffScheduleRules.test.ts` and `src/test/suite/semanticDiffSchedule.test.ts`.                                                                                                      |
| `SemanticDiffScheduleInterpretation` from `semanticDiffScheduleTypes.ts`                                                                                                                                               | `ScheduleInterpretation` in `ScheduleInterpretation.ts` (domain)                            | Whole-unit interpretation, rule partitions, and rule-zero state; earns a boundary as the reusable interpretation result.                  | `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`; no period or before/after dependency.                                                                                                                                 |
| `interpretSchedule` from `semanticDiffScheduleInterpreter.ts`                                                                                                                                                          | Same name in `ScheduleInterpretation.ts` (domain)                                           | Public entry point for whole-unit interpretation.                                                                                         | Domain callers depend inward; `src/test/suite/semanticDiffScheduleRules.test.ts` and `src/test/suite/semanticDiffSchedule.test.ts`.                                                                                                        |
| `ScheduleRuleEvidenceInput`, `ScheduleRuleResultInput`, `createScheduleRuleEvidence`, `createScheduleRuleResult`, `calendarIndependentDateEvidence`, `relativeDateEvidence` from `semanticDiffScheduleRuleEvidence.ts` | Made local in `ScheduleInterpretation.ts`                                                   | Evidence construction is a co-located implementation detail with no independent consumer or lifecycle; no processing-step export remains. | Local-only; evidence assertions through `interpretSchedule`.                                                                                                                                                                               |
| `interpretScheduleDateRule`, `interpretStartTimeRule`, `interpretUnsupportedParameter`, `withUnpairedStartTime` from `semanticDiffScheduleRuleInterpreter.ts`                                                          | Made local in `ScheduleInterpretation.ts`                                                   | Rule classification steps have no independent contract; keeping them local prevents over-splitting.                                       | Local-only; status/reason/evidence and malformed-input tests through the public interpreter.                                                                                                                                               |
| `SemanticDiffScheduleSide` from `semanticDiffScheduleTypes.ts`                                                                                                                                                         | Same name remains in `semanticDiffScheduleTypes.ts` (domain Semantic Diff comparison owner) | Before/after is comparison context, not reusable schedule meaning.                                                                        | Semantic Diff facade/comparison depend on it; `src/test/suite/semanticDiffScheduleRules.test.ts`, `src/test/suite/semanticDiffScheduleImpact.test.ts`, and `src/test/suite/semanticDiffContracts.test.ts`.                                 |
| `SemanticDiffScheduleProjection`, `SemanticDiffScheduleProjectionInput` from `semanticDiffScheduleTypes.ts`                                                                                                            | Deferred to Slice 4; no Slice 2 export change                                               | Projection contract moves atomically with `ScheduleProjection` so Slice 2 does not create a half-migrated owner.                          | Slice 4 ledger and projection tests own the change.                                                                                                                                                                                        |

### Slice 3 ledger: ScheduleCalendar and ScheduleCandidateResolver

| Current name and owner                                                                                                                                                                                                                                                                                                    | Final name and owner                                                                                                    | Responsibility / boundary rationale                                                                                                                                                                                                                      | Direction and tests                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SemanticDiffScheduleCalendarContextStatus`                                                                                                                                                                                                                                                                               | `ScheduleCalendarContextStatus` in `src/domain/schedule/ScheduleCalendar.ts` (domain)                                   | Calendar context outcome vocabulary.                                                                                                                                                                                                                     | ScheduleCalendar only; `semanticDiffScheduleCalendar.test.ts` and architecture test.                                                                       |
| `SemanticDiffScheduleBaseDay`                                                                                                                                                                                                                                                                                             | `ScheduleCalendarBaseDay` in `ScheduleCalendar.ts` (domain)                                                             | Numeric/weekday base-day meaning for definition-backed calendars.                                                                                                                                                                                        | ScheduleCalendar only; calendar base-day scenarios.                                                                                                        |
| `SemanticDiffScheduleCalendarDayClassification`                                                                                                                                                                                                                                                                           | `ScheduleCalendarDayClassification` in `ScheduleCalendar.ts` (domain)                                                   | Open/closed classification.                                                                                                                                                                                                                              | ScheduleCalendar/CandidateResolver depend inward; calendar and candidate scenarios.                                                                        |
| `SemanticDiffScheduleCalendarSelector`                                                                                                                                                                                                                                                                                    | `ScheduleCalendarSelector` in `ScheduleCalendar.ts` (domain)                                                            | Exact/weekday calendar selector, including normalized key.                                                                                                                                                                                               | ScheduleCalendar only; selector precedence/conflict tests.                                                                                                 |
| `SemanticDiffScheduleCalendarEntry`                                                                                                                                                                                                                                                                                       | `ScheduleCalendarEntry` in `ScheduleCalendar.ts` (domain)                                                               | Parsed calendar parameter entry.                                                                                                                                                                                                                         | ScheduleCalendar only; calendar parsing tests.                                                                                                             |
| `SemanticDiffScheduleCalendarGroup`                                                                                                                                                                                                                                                                                       | `ScheduleCalendarGroup` in `ScheduleCalendar.ts` (domain)                                                               | Ordered group of calendar entries.                                                                                                                                                                                                                       | ScheduleCalendar only; hierarchy/classification tests.                                                                                                     |
| `SemanticDiffScheduleCalendarSelection`                                                                                                                                                                                                                                                                                   | `ScheduleCalendarSelection` in `ScheduleCalendar.ts` (domain)                                                           | Source-selection status and evidence.                                                                                                                                                                                                                    | ScheduleCalendar -> ScheduleProjection/CandidateResolver; selection evidence tests.                                                                        |
| `SemanticDiffScheduleCalendarContext`                                                                                                                                                                                                                                                                                     | `ScheduleCalendarContext` in `ScheduleCalendar.ts` (domain)                                                             | Resolved definition-backed source, base settings, groups, and evidence.                                                                                                                                                                                  | ScheduleCalendar -> CandidateResolver/Projection; context and integration tests.                                                                           |
| `SemanticDiffScheduleCalendarContextIndex`                                                                                                                                                                                                                                                                                | `ScheduleCalendarContextIndex` in `ScheduleCalendar.ts` (domain; exported entrypoint contract)                          | Schedule-specific by-id/by-path traversal index; remains non-generic pending F2. It is visible only to ScheduleCalendar, Semantic Diff side-collection orchestration, and the direct calendar integration suite because those are the current consumers. | ScheduleCalendar owns construction/lifecycle; facade passes one immutable per-document index; duplicate-path/hierarchy tests and allowlisted import audit. |
| `SemanticDiffScheduleCalendarDayResult`                                                                                                                                                                                                                                                                                   | `ScheduleCalendarDayResult` in `ScheduleCalendar.ts` (domain)                                                           | Open/closed or invalid/missing-context day result with evidence.                                                                                                                                                                                         | ScheduleCalendar -> CandidateResolver; classification/failure tests.                                                                                       |
| `SemanticDiffScheduleContextInput`, `createScheduleCalendarContext`                                                                                                                                                                                                                                                       | Local, non-exported `ScheduleCalendarContextInput` and `createScheduleCalendarContext` helpers in `ScheduleCalendar.ts` | Context construction has no external consumer or independent lifecycle in the repository call graph; the cohesive calendar module alone assembles its context value, so neither the input type nor identity constructor earns a public boundary.         | Local-only; exact ScheduleCalendar export audit, calendar context outcomes through `semanticDiffScheduleCalendar.test.ts`.                                 |
| `createScheduleCalendarContextIndex`, `classifyScheduleCalendarDay`, `resolveScheduleCalendarContext`                                                                                                                                                                                                                     | Same names in `ScheduleCalendar.ts`                                                                                     | Public schedule-calendar entry points for indexing, source/context resolution, and exact-date-first classification. The index creator is exposed only for the current facade/test call graph; traversal remains package-local.                           | CandidateResolver/Projection depend on ScheduleCalendar; calendar, schedule, and allowlisted-import evidence.                                              |
| `isWithinOperationalMonth`, `operationalMonthDate`, `operationalMonthLength`, `resolveOperationalMonth` and `SemanticDiffOperationalMonth`                                                                                                                                                                                | Same function names plus `ScheduleOperationalMonth` in `ScheduleCalendar.ts`                                            | Operational-month bounds and date lookup are calendar policy, not a Semantic Diff processing stage.                                                                                                                                                      | ScheduleCalendar -> CandidateResolver; operational-month and large-period tests.                                                                           |
| `isFullyQualifiedRelativeScheduleDate`, `isSyntacticallyInvalidRelativeScheduleDate`, `relativeScheduleDateRequiresContext`                                                                                                                                                                                               | Same names in `ScheduleCalendar.ts`                                                                                     | Calendar-context requirement and relative-date validation used by candidate resolution.                                                                                                                                                                  | ScheduleCalendar -> CandidateResolver; malformed/relative-date tests.                                                                                      |
| `parseCalendarSelector`, `CalendarGroupsResult`, `resolveCalendarGroups`, `classifyCalendarSelector`, `selectionEvidence`, `ScheduleCalendarSourceResolution`, `resolveScheduleCalendarSource`, `parseBaseDay`, `isValidBaseTime`, `resolveScheduleCalendarBaseContext`, `baseDayNumber`, `AncestorResult`, `ancestorsOf` | Made local to `ScheduleCalendar.ts`                                                                                     | Selector/group/source/hierarchy/base parsing steps have no independent consumer; they remain co-located implementation helpers.                                                                                                                          | Local-only; public context/classification outcomes are asserted in `semanticDiffScheduleCalendar.test.ts`.                                                 |
| `ValidSchedulePeriod`, `ScheduleDayClassification`, `emptyScheduleDateCandidates`, `deferredScheduleDateCandidates`, `invalidScheduleDateCandidates`, `singleScheduleDateCandidate`, `classificationFailure`, `classifiedDayCandidates`, `operationalDateCandidates` from candidate modules                               | Made local to `ScheduleCandidateResolver.ts`, except `ScheduleDateCandidateResult` and `resolveScheduleDateCandidates`  | Candidate scanning is one bounded resolver responsibility; helper constructors and day handlers do not earn exported boundaries.                                                                                                                         | ScheduleCalendar -> CandidateResolver -> ScheduleProjection; calendar/schedule integration and large-period tests.                                         |
| `ScheduleDateCandidateResult`, `scheduleDateCandidates`                                                                                                                                                                                                                                                                   | `ScheduleDateCandidateResult`, `resolveScheduleDateCandidates` in `ScheduleCandidateResolver.ts` (domain)               | The bounded date-candidate result and resolver are the only candidate contract needed by projection.                                                                                                                                                     | CandidateResolver depends on ScheduleDate/ScheduleCalendar; candidate and projection tests.                                                                |

### Slice 4 ledger: ScheduleProjection and Semantic Diff comparison

| Current name and owner                                                                                                                                                                                                                                                                  | Final name and owner                                                                                                                                                                                                                                | Responsibility / boundary rationale                                                                                                                                                                                                                                                                                                     | Direction and tests                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SemanticDiffScheduleProjection` from `semanticDiffScheduleTypes.ts`                                                                                                                                                                                                                    | `ScheduleProjection` in `src/domain/schedule/ScheduleProjection.ts` (domain)                                                                                                                                                                        | Reusable status/completeness/runs/rules/evidence result; no before/after decision concept.                                                                                                                                                                                                                                              | ScheduleInterpretation/Calendar/CandidateResolver -> ScheduleProjection; schedule projection and integration tests.                                                                   |
| `SemanticDiffScheduleProjectionInput` from `semanticDiffScheduleTypes.ts`                                                                                                                                                                                                               | `ScheduleProjectionInput` in `ScheduleProjection.ts` (domain)                                                                                                                                                                                       | Exact schedule-owned projection input; see the period contract below.                                                                                                                                                                                                                                                                   | Semantic Diff facade maps into it; projection and period-boundary tests.                                                                                                              |
| New `ScheduleProjectionPeriod`                                                                                                                                                                                                                                                          | `ScheduleProjectionPeriod = Readonly<{ from: string; to: string }>` in `ScheduleProjection.ts` (domain)                                                                                                                                             | Host-neutral, non-canonical projection-period transport contract; it prevents the schedule package from depending on Semantic Diff and deliberately defers canonical parsing/validation to F2. Its private defensive precondition is projection-local only; the Semantic Diff facade owns the comparison-level invalid-period decision. | Semantic Diff facade maps only guard-approved input; facade `invalid-period` and direct projection-precondition tests plus schedule import audit.                                     |
| `SemanticDiffScheduleRun` from `domain/models/semantic-diff/SemanticDiff.ts`                                                                                                                                                                                                            | `ScheduleRun` exported by `ScheduleProjection.ts` (domain)                                                                                                                                                                                          | Calculated reusable run fact (`unitPath`, `unitName`, `rule`, `date`, `time`). It earns ownership in schedule because comparison and application consume facts but do not define them.                                                                                                                                                  | ScheduleProjection -> Semantic Diff comparison; `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`, and explicit application mapper assertions.                      |
| `projectScheduleRuns` from `semanticDiffScheduleProjector.ts`                                                                                                                                                                                                                           | Same name in `ScheduleProjection.ts`                                                                                                                                                                                                                | Public interpreted-unit projection entry point.                                                                                                                                                                                                                                                                                         | ScheduleProjection depends only on schedule contracts; projection/calendar/integration tests.                                                                                         |
| `SubstitutionMode`, `SubstitutionResolution`, `ParsedSubstitutionRule`, `ParsedShiftDaysRule`, `SubstitutionAssociation`, `SubstitutionRuleState`, `SubstitutionAnalysis`, `substitutionState`, `resolveSubstitutionCandidate`, `createSubstitutionAnalysis`, `hasScheduleSubstitution` | Made private helpers in `ScheduleProjection.ts`                                                                                                                                                                                                     | Closed-day substitution analysis/application is a JP1/AJS invariant but has no independent consumer, lifecycle, or public contract; co-location keeps the processing steps private without inventing an empty module boundary.                                                                                                          | `ScheduleProjection.ts` only; substitution/evidence scenarios in schedule calendar/rules tests.                                                                                       |
| `DatePreflight`, `scheduleRuleEvidenceId`, `datePreflight`, `resolveSubstitutedCandidates`, `projectScheduleRules`                                                                                                                                                                      | Made private helpers in `ScheduleProjection.ts`                                                                                                                                                                                                     | Preflight and rule projection are implementation steps, not reusable public contracts.                                                                                                                                                                                                                                                  | Local-only; projection, substitution, and evidence tests.                                                                                                                             |
| `SemanticDiffScheduleRunDecision`, `compareScheduleRuns` from `semanticDiffScheduleDiffer.ts`                                                                                                                                                                                           | Same names in renamed `semanticDiffScheduleComparison.ts` (domain Semantic Diff owner)                                                                                                                                                              | Before/after grouping, canonical-path comparison, and added/removed/changed-time decisions are comparison policy. They remain exported at the direct comparison owner after Slice 4; Slice 3 retains the exact facade compatibility exports so all existing consumers compile.                                                          | Semantic Diff comparison -> ScheduleRun; Slice 3 facade-export compile evidence; Slice 4 direct-owner import in `semanticDiffScheduleRules.test.ts` and application comparison tests. |
| `interpretSchedule` and `projectScheduleRuns` re-exported by `semanticDiffScheduleRules.ts`                                                                                                                                                                                             | Re-exports removed; direct owners are `ScheduleInterpretation.ts` and `ScheduleProjection.ts`. `compareScheduleRuns`, `SemanticDiffScheduleRunDecision`, and `SemanticDiffScheduleSide` are likewise direct comparison-owner exports after Slice 4. | Removes the old facade forwarding surface while retaining comparison contracts at their direct owner; Slice 3 keeps the exact interim facade exports needed by the current call graph.                                                                                                                                                  | Domain facade imports inward; Slice 3/4 import-state tests, schedule integration tests, export/import audit.                                                                          |
| `SemanticDiffScheduleMatchedUnit`                                                                                                                                                                                                                                                       | Same name in `semanticDiffScheduleRules.ts` (domain Semantic Diff facade)                                                                                                                                                                           | Comparison input contract selecting before/after matched units.                                                                                                                                                                                                                                                                         | Facade consumes structural match; schedule rule/integration tests.                                                                                                                    |
| `SemanticDiffScheduleUnsupportedDecision`                                                                                                                                                                                                                                               | Same name in `semanticDiffScheduleRules.ts`                                                                                                                                                                                                         | Comparison-facing unsupported/uncalculated decision with side/unit/parameter and schedule reason.                                                                                                                                                                                                                                       | Facade -> application; unsupported item tests.                                                                                                                                        |
| `SemanticDiffScheduleEvidenceKind`, `SemanticDiffScheduleSideEvaluation`, `SemanticDiffSchedulePairEvaluation`                                                                                                                                                                          | Same names in `semanticDiffScheduleRules.ts`                                                                                                                                                                                                        | Comparison compatibility views for evidence, per-side evaluation, and matched pairs.                                                                                                                                                                                                                                                    | Facade -> application schedule impact; `semanticDiffScheduleImpact.test.ts`.                                                                                                          |
| `SemanticDiffScheduleEvaluation`                                                                                                                                                                                                                                                        | Same name in `semanticDiffScheduleRules.ts`                                                                                                                                                                                                         | Comparison result union: not-requested, invalid-period, or evaluated decisions/evidence/pairs.                                                                                                                                                                                                                                          | Facade -> application; schedule, impact, and artifact tests.                                                                                                                          |
| `EvaluateSemanticDiffScheduleInput`, `evaluateSemanticDiffSchedule`                                                                                                                                                                                                                     | Same names in `semanticDiffScheduleRules.ts`                                                                                                                                                                                                        | Semantic Diff orchestration input/function; retains side collection and comparison-period request handling in this feature.                                                                                                                                                                                                             | Semantic Diff facade depends on ScheduleInterpretation/Calendar/Projection; schedule and application tests.                                                                           |
| `SemanticDiffScheduleSide`                                                                                                                                                                                                                                                              | Same name remains in `semanticDiffScheduleTypes.ts` through Slice 3, then moves to `semanticDiffScheduleComparison.ts` in Slice 4 (domain Semantic Diff owner)                                                                                      | Before/after comparison side, not schedule meaning.                                                                                                                                                                                                                                                                                     | Comparison-only; evaluation/impact tests.                                                                                                                                             |
| Application `SemanticDiffScheduleRun` in `src/application/semantic-diff/semanticDiffDto.ts`                                                                                                                                                                                             | Unchanged exact name and shape                                                                                                                                                                                                                      | Serialized/application DTO remains the public output contract. `compareScheduleDiff.ts` must explicitly map every `ScheduleRun` field through private `toSemanticDiffScheduleRunDto` before constructing `SemanticDiffScheduleRunChange`; no structural assignment or domain type export crosses into DTO ownership.                    | Domain -> application translation; `semanticDiffSchedule.test.ts`, `semanticDiffScheduleImpact.test.ts`, artifact/contract suites.                                                    |

#### Additional Slice 4 contract ledger

- Retained `SemanticDiffComparisonPeriod`: the domain contract in
  `src/domain/models/semantic-diff/SemanticDiff.ts` remains comparison-owned,
  while the application DTO with the same name and shape remains unchanged in
  `src/application/semantic-diff/semanticDiffDto.ts`. The facade owns the
  domain input; comparison-period validation and
  `toScheduleProjectionPeriod` assertions cover the boundary.
- `SemanticDiffScheduleRunDecision` remains in the renamed
  `semanticDiffScheduleComparison.ts`, but every `before`/`after` field uses
  schedule-owned `ScheduleRun`. `SemanticDiffScheduleSideEvaluation.runs` and
  internal `ScheduleUnitCollection.runs` likewise use `ScheduleRun[]`; no
  `SemanticDiffScheduleRun` domain alias survives. Comparison and application
  mapping tests cover this direction.
- Private `parsePeriod`/comparison guard and `toScheduleProjectionPeriod`
  remain owned by `semanticDiffScheduleRules.ts`. The guard alone decides
  whether the comparison result is `{ kind: "invalid-period" }`; only after
  that guard succeeds does `toScheduleProjectionPeriod` explicitly map
  `SemanticDiffComparisonPeriod` to `ScheduleProjectionPeriod`. The mapper is
  not exported and is covered with valid/invalid facade assertions and the
  schedule import audit. `ScheduleProjection` has only its local defensive
  projection precondition for direct callers, which returns a projection-level
  invalid/empty result and is not a second canonical or comparison-level
  validator.
- Application `SemanticDiffScheduleRunChange` and
  `SemanticDiffScheduleComparison` retain their exact names, owner, and
  serialized shapes in `semanticDiffDto.ts`. `compareScheduleDiff.ts` consumes
  comparison decisions and explicitly maps each `ScheduleRun` field before
  constructing them; no domain schedule contract crosses the DTO boundary.

The dependency rule for S4 is explicit: `domain/schedule/*` imports no
`domain/services/semantic-diff/*`, `domain/models/semantic-diff/*`,
application, or outer layer. `semanticDiffScheduleRules.ts` maps
`SemanticDiffComparisonPeriod` to `ScheduleProjectionPeriod` and imports
schedule contracts; the reverse import is forbidden and verified by the
architecture/import audit. `SemanticDiffScheduleRunDecision` and
`SemanticDiffScheduleSideEvaluation.runs` use `ScheduleRun`; application
`SemanticDiffScheduleRunChange`/`SemanticDiffScheduleComparison` remain
application-owned and receive only explicit DTO mappings.

## Cross-Slice Completion Import Contract

`semanticDiffScheduleCalendar.test.ts` is the deliberately shared integration
test whose import state proves that each slice can compile before the next
slice starts. Slice 3 permits exactly its import declaration plus the named
same-index/non-mutation regression hunk; Slice 4 permits exactly its final
direct-owner import declaration. All other test bodies, call sites, and
unrelated imports are outside both manifests.

- After Slice 2, its calendar import remains from the existing
  `semanticDiffScheduleCalendarContext` facade, and its second import remains
  `evaluateSemanticDiffSchedule`, `interpretSchedule`, and
  `projectScheduleRuns` from `semanticDiffScheduleRules`. The facade imports
  the new `ScheduleInterpretation` implementation but temporarily forwards
  `interpretSchedule`; the projector remains the existing implementation and
  is still forwarded. At this boundary the facade also continues to export
  `compareScheduleRuns`, `SemanticDiffScheduleRunDecision`, and
  `SemanticDiffScheduleSide`, plus the comparison-view contracts listed in
  Shared Implementation Rules. These are the Slice 2 completion exports and
  must compile for the existing application consumers.
- After Slice 3, the only changed import is exactly:

  ```ts
  import {
    classifyScheduleCalendarDay,
    createScheduleCalendarContextIndex,
    resolveOperationalMonth,
    resolveScheduleCalendarContext,
  } from "../../domain/schedule/ScheduleCalendar";
  ```

  The import from `semanticDiffScheduleRules` still contains exactly
  `evaluateSemanticDiffSchedule`, `interpretSchedule`, and
  `projectScheduleRuns`. The latter two are the temporary facade forwards
  described in Shared Implementation Rules. Independently, the facade's
  comparison export contract still contains exactly the retained
  `compareScheduleRuns`, `SemanticDiffScheduleRunDecision`,
  `SemanticDiffScheduleSide`, and already-consumed comparison-view exports;
  Slice 3 must not remove or rename any of them. No old
  calendar/index/context/operational-month path may remain in this test, and
  no interpretation or projection import may be migrated in Slice 3.

- After Slice 4, the calendar import above is unchanged, the comparison
  facade import contains only `evaluateSemanticDiffSchedule`, and the two
  direct owner imports are exactly:

  ```ts
  import { interpretSchedule } from "../../domain/schedule/ScheduleInterpretation";
  import { projectScheduleRuns } from "../../domain/schedule/ScheduleProjection";
  ```

  The facade forwards neither function. Slice 4 also moves the direct
  comparison imports for `compareScheduleRuns`,
  `SemanticDiffScheduleRunDecision`, and `SemanticDiffScheduleSide` to
  `semanticDiffScheduleComparison.ts` wherever a consumer still needs them;
  it retains only the comparison evaluation/input/output contracts that are
  owned by `semanticDiffScheduleRules.ts`. The exact removal/retention state
  is tested by `semanticDiffScheduleRules.test.ts` and the application
  comparison mapper in the Slice 4 edit manifest. Other schedule tests in
  the Slice 4 edit manifest must reach the same direct-owner state;
  validation-only tests must compile through the closed final imports without
  any unlisted hunk.

## Reproducible Schedule Ownership Audit

Run the audit against all `src` TypeScript source (`src/**/*.ts` and
`src/**/*.tsx`) after each named slice, and use the unfiltered
`rtk rg --files src/domain/schedule` result for the schedule-package
filesystem assertion so nested and non-TypeScript artifacts are included.
The commands below are inspection-only and require no script or configuration
change. Save their output with the slice evidence and classify every match
against the explicit lists here.

The old-module denylist is:

```text
scheduleDateInterpreter
scheduleRuleHelpers
semanticDiffScheduleDateMath
semanticDiffScheduleInterpreter
semanticDiffScheduleRuleInterpreter
semanticDiffScheduleRuleEvidence
semanticDiffScheduleCalendarTypes
semanticDiffScheduleCalendarContext
semanticDiffScheduleCalendarIndex
semanticDiffScheduleCalendarSelectors
semanticDiffScheduleOperationalMonth
semanticDiffScheduleRelativeDate
semanticDiffScheduleCandidateTypes
semanticDiffScheduleClassifiedDayCandidates
semanticDiffScheduleDateCandidates
semanticDiffScheduleOperationalCandidates
semanticDiffScheduleProjector
semanticDiffScheduleRuleProjection
semanticDiffScheduleSubstitutionAnalysis
semanticDiffScheduleSubstitutionProjection
semanticDiffScheduleTypes
semanticDiffScheduleDiffer
```

The reusable-symbol denylist is:

```text
SemanticDiffScheduleStatus
SemanticDiffScheduleUnsupportedReason
SemanticDiffScheduleEvidence
SemanticDiffScheduleRuleInterpretation
SemanticDiffScheduleInterpretation
SemanticDiffScheduleProjection
SemanticDiffScheduleProjectionInput
SemanticDiffScheduleCalendarContextStatus
SemanticDiffScheduleBaseDay
SemanticDiffScheduleCalendarDayClassification
SemanticDiffScheduleCalendarSelector
SemanticDiffScheduleCalendarEntry
SemanticDiffScheduleCalendarGroup
SemanticDiffScheduleCalendarSelection
SemanticDiffScheduleCalendarContext
SemanticDiffScheduleCalendarContextIndex
SemanticDiffScheduleCalendarDayResult
SemanticDiffScheduleContextInput
SemanticDiffOperationalMonth
```

The final comparison-only allowlist is path-scoped. In the domain Semantic
Diff package it permits only
`SemanticDiffScheduleMatchedUnit`, `SemanticDiffScheduleUnsupportedDecision`,
`SemanticDiffScheduleEvidenceKind`, `SemanticDiffScheduleSideEvaluation`,
`SemanticDiffSchedulePairEvaluation`, `SemanticDiffScheduleEvaluation`,
`EvaluateSemanticDiffScheduleInput`, `evaluateSemanticDiffSchedule`,
`SemanticDiffScheduleSide`, `SemanticDiffScheduleRunDecision`, and
`compareScheduleRuns`. In application comparison DTOs it permits only
`SemanticDiffScheduleRun`, `SemanticDiffScheduleRunChangeKind`,
`SemanticDiffScheduleRunChange`, and `SemanticDiffScheduleComparison` in
`src/application/semantic-diff/semanticDiffDto.ts`. Existing schedule-impact
and panel transport names are unrelated application/presentation contracts and
remain allowed only at their current owners:
`SemanticDiffScheduleImpactUnavailableReason`,
`SemanticDiffScheduleImpactAvailability`,
`SemanticDiffScheduleImpactRootOutcome`,
`SemanticDiffScheduleImpactRunState`,
`SemanticDiffScheduleImpactIssueKind`,
`SemanticDiffScheduleImpactRun`, `SemanticDiffScheduleImpactIssue`,
`SemanticDiffScheduleImpactRootSide`,
`SemanticDiffScheduleImpactRootMatchKind`,
`SemanticDiffScheduleImpactRoot`, `SemanticDiffScheduleImpactCandidate`,
`SemanticDiffScheduleImpactCandidateGroup`,
`SemanticDiffScheduleImpactTimelineItem`, `SemanticDiffScheduleImpact`,
`SemanticDiffScheduleImpactRootStatus`, and
`SemanticDiffScheduleImpactLookup`. No allowlist item authorizes a reusable
schedule contract, a new forwarding export, or a new owner. The declaration
owner for `SemanticDiffScheduleSide` and `SemanticDiffScheduleRunDecision` is
only `semanticDiffScheduleComparison.ts`; their presence in
`semanticDiffScheduleRules.ts` is permitted solely as an internal reference
until the facade no longer needs it, never as a declaration or re-export.

`SemanticDiffScheduleRun` is intentionally not part of this reusable-symbol
denylist. It is an application DTO contract with a separate retirement
assertion below: Slice 4 and Feature Exit must find no declaration or
reference under `src/domain`, while exactly
`src/application/semantic-diff/semanticDiffDto.ts` declares the unchanged DTO
and only the four recorded application consumers reference it. This
path-scoped distinction prevents the application transport name from being
mistaken for a retained domain owner while still proving that the old domain
run contract is gone.

Use one phase-explicit inspection for the retirement/file-set portion of the
audit. `SDD_PHASE` is mandatory and accepts `slice1`, `slice2`, `slice3`,
`slice4`, or `feature-exit`; `feature-exit` intentionally selects the same
full retirement set as `slice4`. The selected phase includes only symbols and
old modules whose retirement is due by that phase. The `rtk rg --files` checks
are executable filesystem assertions, not documentation of expected paths:

```sh
SDD_PHASE=slice1 node --input-type=module -e '
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const phase = process.env.SDD_PHASE;
const phases = ["slice1", "slice2", "slice3", "slice4", "feature-exit"];
if (!phases.includes(phase)) throw new Error("set SDD_PHASE=slice1, slice2, slice3, slice4, or feature-exit");
const full = phase === "slice4" || phase === "feature-exit";
const oldModules = {
  slice1: [
    "src/domain/models/parameters/scheduleDateInterpreter.ts",
    "src/domain/models/parameters/scheduleRuleHelpers.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts",
  ],
  slice2: [
    "src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts",
  ],
  slice3: [
    "src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleCalendarContext.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleCalendarIndex.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleCalendarSelectors.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleOperationalMonth.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRelativeDate.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleCandidateTypes.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts",
  ],
  slice4: [
    "src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts",
  ],
};
const retiredModules = [...oldModules.slice1];
if (phase !== "slice1") retiredModules.push(...oldModules.slice2);
if (phase !== "slice1" && phase !== "slice2") retiredModules.push(...oldModules.slice3);
if (full) retiredModules.push(...oldModules.slice4);
const oldSymbols = {
  slice1: [],
  slice2: [
    "SemanticDiffScheduleStatus", "SemanticDiffScheduleUnsupportedReason",
    "SemanticDiffScheduleEvidence", "SemanticDiffScheduleRuleInterpretation",
    "SemanticDiffScheduleInterpretation",
  ],
  slice3: [
    "SemanticDiffScheduleCalendarContextStatus", "SemanticDiffScheduleBaseDay",
    "SemanticDiffScheduleCalendarDayClassification", "SemanticDiffScheduleCalendarSelector",
    "SemanticDiffScheduleCalendarEntry", "SemanticDiffScheduleCalendarGroup",
    "SemanticDiffScheduleCalendarSelection", "SemanticDiffScheduleCalendarContext",
    "SemanticDiffScheduleCalendarContextIndex", "SemanticDiffScheduleCalendarDayResult",
    "SemanticDiffScheduleContextInput", "SemanticDiffOperationalMonth",
  ],
  slice4: [
    "SemanticDiffScheduleProjection", "SemanticDiffScheduleProjectionInput",
  ],
};
const retiredSymbols = [...oldSymbols.slice1];
if (phase !== "slice1") retiredSymbols.push(...oldSymbols.slice2);
if (phase !== "slice1" && phase !== "slice2") retiredSymbols.push(...oldSymbols.slice3);
if (full) retiredSymbols.push(...oldSymbols.slice4);
const expectedScheduleFiles = {
  slice1: ["src/domain/schedule/ScheduleDate.ts", "src/domain/schedule/ScheduleRule.ts"],
  slice2: ["src/domain/schedule/ScheduleDate.ts", "src/domain/schedule/ScheduleRule.ts", "src/domain/schedule/ScheduleInterpretation.ts"],
  slice3: ["src/domain/schedule/ScheduleDate.ts", "src/domain/schedule/ScheduleRule.ts", "src/domain/schedule/ScheduleInterpretation.ts", "src/domain/schedule/ScheduleCalendar.ts", "src/domain/schedule/ScheduleCandidateResolver.ts"],
  slice4: ["src/domain/schedule/ScheduleDate.ts", "src/domain/schedule/ScheduleRule.ts", "src/domain/schedule/ScheduleInterpretation.ts", "src/domain/schedule/ScheduleCalendar.ts", "src/domain/schedule/ScheduleCandidateResolver.ts", "src/domain/schedule/ScheduleProjection.ts"],
};
const filesFor = (args) => {
  try {
    const out = execFileSync("rtk", args, { encoding: "utf8" }).trim();
    return out ? out.split("\n") : [];
  } catch (error) {
    if (error?.status === 1 || error?.status === 2) return [];
    throw error;
  }
};
const sourceFiles = filesFor(["rg", "--files", "src", "--glob", "*.ts", "--glob", "*.tsx"]);
const allSourceFiles = filesFor(["rg", "--files", "src"]);
const packageFiles = filesFor(["rg", "--files", "src/domain/schedule"]);
const productionSourceFiles = sourceFiles.filter((file) => !file.startsWith("src/test/"));
const sourceText = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const failures = [];
const retiredStems = new Set(retiredModules.map((file) => file.split("/").pop().replace(/\.[^.]+$/, "")));
for (const file of retiredModules) {
  if (sourceFiles.includes(file)) failures.push(file + ": retired file still exists");
  const base = file.split("/").pop().replace(/\.[^.]+$/, "");
  if (new RegExp("\\b" + base + "\\b").test(sourceText)) failures.push(base + ": retired module name still occurs in src");
}
// Retired owner stems are production-module assertions. Test names such as
// scheduleRuleHelpers.test.ts remain valid evidence paths in the closed test
// manifest and must not be rejected as production owners.
for (const file of productionSourceFiles) {
  const base = file.split("/").pop();
  const stem = base.replace(/\.[^.]+$/, "");
  if (retiredStems.has(stem) || [...retiredStems].some((retired) => base.startsWith(retired + "."))) {
    failures.push(file + ": retired owner stem variant still exists");
  }
}
for (const file of allSourceFiles) {
  const base = file.split("/").pop();
  if (/^ScheduleSubstitution(?:\..+)?$/.test(base)) failures.push(file + ": ScheduleSubstitution.* is forbidden");
}
for (const name of retiredSymbols) {
  if (new RegExp("\\b" + name + "\\b").test(sourceText)) failures.push(name + ": retired symbol still occurs in src");
}
const expected = expectedScheduleFiles[full ? "slice4" : phase];
const expectedSet = new Set(expected);
const actualSet = new Set(packageFiles);
for (const file of expectedSet) if (!actualSet.has(file)) failures.push(file + ": expected schedule file is missing");
for (const file of actualSet) if (!expectedSet.has(file)) failures.push(file + ": unexpected schedule file at this phase");
const substitution = "src/domain/schedule/ScheduleSubstitution.ts";
if (actualSet.has(substitution) || allSourceFiles.some((file) => /^ScheduleSubstitution(?:\..+)?$/.test(file.split("/").pop()))) {
  failures.push("ScheduleSubstitution.*: obsolete module family must be absent");
}
const scheduleScope = sourceFiles.filter((file) => file.startsWith("src/domain/schedule/") || file === "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts" || file === "src/test/suite/semanticDiffScheduleCalendar.test.ts");
for (const file of scheduleScope) {
  if (/\bAjsDocumentIndex\b/.test(readFileSync(file, "utf8"))) failures.push(file + ": AjsDocumentIndex is out of scope");
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("phase-specific retirement/file-set audit (" + phase + "): OK");
'

# Repeat the same command with SDD_PHASE=slice2, slice3, slice4, and
# SDD_PHASE=feature-exit in the corresponding clean snapshot. The phase value
# is part of the pass/fail input; an omitted or invented phase fails closed.
```

The old-module and reusable-symbol blocks above are the complete universe;
the executable audit selects their cumulative prefix for the requested phase.
No global denylist result is used as a phase pass criterion. The existing
forwarder, `AjsDocumentIndex`, and comparison-only owner checks below remain
additional assertions with their own phase-specific pass rules.

Run this second executable audit with the same explicit `SDD_PHASE`. It proves
the owner path and non-export status for the four named local boundaries and
re-audits the analogous local-only helpers recorded in the ledger. The audit
resolves each owner's TypeScript symbol, requires exactly one direct
declaration, and rejects imports, exports, aliases, or references that resolve
to that same private symbol outside its owner. A same-name declaration in an
unrelated file is not a reference to the schedule-owned symbol and is allowed;
for example, the private `ScheduleByDaysFromStartType` in
`ScheduleDiagnosticRules.ts` must not be renamed or rejected. `parsePeriod` is
intentionally excluded from the single-name owner map because the plan has two
distinct private guards (the comparison facade and the projection module); its
separate period-boundary tests remain the authority for that deliberately
duplicated local name.

```sh
SDD_PHASE=slice1 node --input-type=module -e '
import ts from "typescript";
import { relative } from "node:path";

const phase = process.env.SDD_PHASE;
const phases = ["slice1", "slice2", "slice3", "slice4", "feature-exit"];
if (!phases.includes(phase)) throw new Error("set SDD_PHASE=slice1, slice2, slice3, slice4, or feature-exit");
const localOwners = {
  "src/domain/schedule/ScheduleRule.ts": [
    "resolveScheduleRuleNumber", "parseRuleValue", "ScheduleByDaysFromStartType",
    "ScheduleByDaysFromStartMatch", "CFTD_TYPES_WITHOUT_SCHEDULE_BY_DAYS",
    "CFTD_TYPES_WITH_MAX_SHIFTABLE_DAYS", "parseScheduleByDaysFromStartMatch",
    "resolveScheduleByDaysFromStart", "resolveMaxShiftableDays",
  ],
  "src/domain/schedule/ScheduleInterpretation.ts": [
    "ScheduleRuleEvidenceInput", "ScheduleRuleResultInput",
    "createScheduleRuleEvidence", "createScheduleRuleResult",
    "calendarIndependentDateEvidence", "relativeDateEvidence",
    "interpretScheduleDateRule", "interpretStartTimeRule",
    "interpretUnsupportedParameter", "withUnpairedStartTime",
  ],
  "src/domain/schedule/ScheduleCalendar.ts": [
    "ScheduleCalendarContextInput", "createScheduleCalendarContext",
    "parseCalendarSelector", "CalendarGroupsResult", "resolveCalendarGroups",
    "classifyCalendarSelector", "selectionEvidence",
    "ScheduleCalendarSourceResolution", "resolveScheduleCalendarSource",
    "parseBaseDay", "isValidBaseTime", "resolveScheduleCalendarBaseContext",
    "baseDayNumber", "AncestorResult", "ancestorsOf",
  ],
  "src/domain/schedule/ScheduleCandidateResolver.ts": [
    "ValidSchedulePeriod", "ScheduleDayClassification",
    "emptyScheduleDateCandidates", "deferredScheduleDateCandidates",
    "invalidScheduleDateCandidates", "singleScheduleDateCandidate",
    "classificationFailure", "classifiedDayCandidates", "operationalDateCandidates",
  ],
  "src/domain/schedule/ScheduleProjection.ts": [
    "SubstitutionMode", "SubstitutionResolution", "ParsedSubstitutionRule",
    "ParsedShiftDaysRule", "SubstitutionAssociation", "SubstitutionRuleState",
    "SubstitutionAnalysis", "substitutionState", "resolveSubstitutionCandidate",
    "createSubstitutionAnalysis", "hasScheduleSubstitution", "DatePreflight",
    "scheduleRuleEvidenceId", "datePreflight", "resolveSubstitutedCandidates",
    "projectScheduleRules",
  ],
};
const due = { slice1: 1, slice2: 2, slice3: 3, slice4: 4, "feature-exit": 4 }[phase];
const phaseForOwner = {
  "src/domain/schedule/ScheduleRule.ts": 1,
  "src/domain/schedule/ScheduleInterpretation.ts": 2,
  "src/domain/schedule/ScheduleCalendar.ts": 3,
  "src/domain/schedule/ScheduleCandidateResolver.ts": 3,
  "src/domain/schedule/ScheduleProjection.ts": 4,
};
const allowedFiles = Object.keys(localOwners).filter((file) => phaseForOwner[file] <= due);
const repo = process.cwd();
const configPath = ts.findConfigFile(repo, ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("tsconfig.json not found");
const parsed = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (diagnostic) => { throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")); } },
);
if (!parsed) throw new Error("unable to parse tsconfig.json");
const program = ts.createProgram(parsed.fileNames, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();
const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
  const path = relative(repo, sourceFile.fileName);
  return path.startsWith("src/") && /\.(?:ts|tsx)$/.test(path) && !path.endsWith(".d.ts");
});
const sourceFileByPath = new Map(sourceFiles.map((sourceFile) => [relative(repo, sourceFile.fileName), sourceFile]));
const failures = [];
const declarationKinds = new Set([
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.VariableDeclaration,
]);
const isExported = (node) => (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
const directDeclarations = (sourceFile, name) => {
  const declarations = [];
  for (const statement of sourceFile.statements) {
    if (declarationKinds.has(statement.kind) && statement.name?.text === name) declarations.push(statement);
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (declaration.name.getText(sourceFile) === name) declarations.push(declaration);
      }
    }
  }
  return declarations;
};
const symbolAt = (node) => {
  let symbol = checker.getSymbolAtLocation(node);
  if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) symbol = checker.getAliasedSymbol(symbol);
  return symbol;
};
const isDeclarationName = (node, declarations) => declarations.some((declaration) => declaration.name === node);
for (const owner of allowedFiles) {
  const ownerFile = sourceFileByPath.get(owner);
  if (!ownerFile) {
    failures.push(owner + ": planned local-helper owner file is missing");
    continue;
  }
  for (const name of localOwners[owner]) {
    const declarations = directDeclarations(ownerFile, name);
    if (declarations.length !== 1) {
      failures.push(name + ": expected exactly one direct declaration in " + owner);
      continue;
    }
    const declaration = declarations[0];
    if (isExported(declaration)) failures.push(name + ": must not be exported from " + owner);
    const targetSymbol = symbolAt(declaration.name);
    if (!targetSymbol) {
      failures.push(name + ": TypeScript symbol is unavailable in " + owner);
      continue;
    }
    for (const sourceFile of sourceFiles) {
      const visit = (node) => {
        if (ts.isIdentifier(node) && node.text === name && !isDeclarationName(node, declarations)) {
          const symbol = symbolAt(node);
          const path = relative(repo, sourceFile.fileName);
          const boundaryAlias = ts.isImportSpecifier(node.parent) || ts.isExportSpecifier(node.parent);
          if (symbol === targetSymbol && (path !== owner || boundaryAlias)) {
            failures.push(name + ": schedule-owned private symbol has an external/import/export reference at " + path);
          }
        }
        ts.forEachChild(node, visit);
      };
      ts.forEachChild(sourceFile, visit);
    }
  }
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("local-only owner/path/export audit (" + phase + "): OK");
'
```

The local-only audit is run at the completion of the slice that introduces
each owner and again at Slice 4 and Feature Exit. The required owner/path
assertions therefore cover `resolveScheduleRuleNumber` at Slice 1,
`ScheduleCalendarContextInput` and `createScheduleCalendarContext` at Slice 3,
and every analogous local helper at its due phase and final clean tip. The
audit is symbol-identity based, not a global text occurrence check, so private
same-name declarations remain valid while imports/exports/aliases and external
references to the recorded schedule-owned symbol fail closed.

Approval evidence uses one exact TypeScript compiler audit for new-module
public surfaces and for the Semantic Diff facade. The audit runs with the
repository's installed TypeScript package and the current tsconfig; it adds no
script, dependency, or configuration. Its expected sets are the complete
union of value and type exports. Substitution helpers are private inside
`ScheduleProjection.ts`, so any substitution export outside that module is a
Finding/NG.

### Exact new-module export contracts

| Phase   | Module                                                              | Exact exported names                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slice 1 | src/domain/schedule/ScheduleDate.ts                                 | ScheduleDateWeekday, ScheduleDateDay, ScheduleDateInterpretation, interpretScheduleDateValue, daysInGregorianMonth, isInvalidCalendarMonth, isInvalidCalendarDay, isImpossibleYearDay, createScheduleDate, toUtcDate, formatScheduleDate, daysInGregorianMonthOrUndefined                                                                                                                                                                                                                                                                                                                                                         |
| Slice 1 | src/domain/schedule/ScheduleRule.ts                                 | ParsedRuleValue, parseParentScheduleRuleValue, parseCycleValue, parseClosedDaySubstitutionValue, parseShiftDaysValue, parseStartTimeValue, parseDelayTimeValue, parseWaitTimeValue, parseAnyScheduleTimeValue, parseWaitCountValue, EffectiveStartConditionMonitoringPair, resolveEffectiveStartConditionMonitoringPair, ParsedScheduleByDaysFromStartValue, parseScheduleByDaysFromStartValue                                                                                                                                                                                                                                    |
| Slice 2 | src/domain/schedule/ScheduleInterpretation.ts                       | ScheduleStatus, ScheduleUnsupportedReason, ScheduleEvidence, ScheduleRuleInterpretation, ScheduleInterpretation, interpretSchedule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Slice 3 | src/domain/schedule/ScheduleCalendar.ts                             | ScheduleCalendarContextStatus, ScheduleCalendarBaseDay, ScheduleCalendarDayClassification, ScheduleCalendarSelector, ScheduleCalendarEntry, ScheduleCalendarGroup, ScheduleCalendarSelection, ScheduleCalendarContext, ScheduleCalendarContextIndex, ScheduleCalendarDayResult, ScheduleOperationalMonth, createScheduleCalendarContextIndex, classifyScheduleCalendarDay, resolveScheduleCalendarContext, isWithinOperationalMonth, operationalMonthDate, operationalMonthLength, resolveOperationalMonth, isFullyQualifiedRelativeScheduleDate, isSyntacticallyInvalidRelativeScheduleDate, relativeScheduleDateRequiresContext |
| Slice 3 | src/domain/schedule/ScheduleCandidateResolver.ts                    | ScheduleDateCandidateResult, resolveScheduleDateCandidates                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Slice 4 | src/domain/schedule/ScheduleProjection.ts                           | ScheduleProjection, ScheduleProjectionInput, ScheduleProjectionPeriod, ScheduleRun, projectScheduleRuns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Slice 4 | src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts | SemanticDiffScheduleSide, SemanticDiffScheduleRunDecision, compareScheduleRuns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Slice 4 | src/domain/services/semantic-diff/semanticDiffScheduleRules.ts      | SemanticDiffScheduleMatchedUnit, SemanticDiffScheduleUnsupportedDecision, SemanticDiffScheduleEvidenceKind, SemanticDiffScheduleSideEvaluation, SemanticDiffSchedulePairEvaluation, SemanticDiffScheduleEvaluation, EvaluateSemanticDiffScheduleInput, evaluateSemanticDiffSchedule                                                                                                                                                                                                                                                                                                                                               |

Run this exact command after the named phase. The checker resolves type
exports, aliases, and star exports before comparing the actual set. The
structural walk covers every module in `phaseModules`: final owner modules
require each exported symbol to resolve to a direct declaration in that same
file and reject wildcard, source-module, aliased, and indirect forwarding;
only the exact temporary facade bridge entries declared for Slice 2 and Slice
3 may use a direct `export ... from` or a local-import-plus-export form. The
resolver uses `checker.getExportSpecifierLocalTargetSymbol`; local-import
bridges then follow the `ImportSpecifier` → `NamedImports` → `ImportClause` →
`ImportDeclaration` ancestry and verify the imported source declaration. Thus
direct, type-only, aliased, indirect, `export *`, and `export type *` forwarding
cannot hide behind a matching public name. Slice 4 has no bridge entries and
the facade is checked as a final owner module.

```sh
node --input-type=module -e '
import ts from "typescript";

const repo = process.cwd();
const configPath = ts.findConfigFile(repo, ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("tsconfig.json not found");
const parsed = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(ts.flattenDiagnosticMessageText(d.messageText, "\n")); } },
);
if (!parsed) throw new Error("unable to parse tsconfig.json");
const program = ts.createProgram(parsed.fileNames, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();
const phase = process.env.SDD_PHASE;
const phaseModules = {
  slice1: [
    "src/domain/schedule/ScheduleDate.ts",
    "src/domain/schedule/ScheduleRule.ts",
  ],
  slice2: [
    "src/domain/schedule/ScheduleDate.ts",
    "src/domain/schedule/ScheduleRule.ts",
    "src/domain/schedule/ScheduleInterpretation.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts",
  ],
  slice3: [
    "src/domain/schedule/ScheduleDate.ts",
    "src/domain/schedule/ScheduleRule.ts",
    "src/domain/schedule/ScheduleInterpretation.ts",
    "src/domain/schedule/ScheduleCalendar.ts",
    "src/domain/schedule/ScheduleCandidateResolver.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts",
  ],
  slice4: [
    "src/domain/schedule/ScheduleDate.ts",
    "src/domain/schedule/ScheduleRule.ts",
    "src/domain/schedule/ScheduleInterpretation.ts",
    "src/domain/schedule/ScheduleCalendar.ts",
    "src/domain/schedule/ScheduleCandidateResolver.ts",
    "src/domain/schedule/ScheduleProjection.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts",
    "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts",
  ],
};
if (!phaseModules[phase]) throw new Error("set SDD_PHASE=slice1, slice2, slice3, or slice4");

const facadePath = "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts";
const expected = new Map(Object.entries({
  "src/domain/schedule/ScheduleDate.ts": [
    "ScheduleDateWeekday", "ScheduleDateDay", "ScheduleDateInterpretation",
    "interpretScheduleDateValue", "daysInGregorianMonth",
    "isInvalidCalendarMonth", "isInvalidCalendarDay", "isImpossibleYearDay",
    "createScheduleDate", "toUtcDate", "formatScheduleDate",
    "daysInGregorianMonthOrUndefined",
  ],
  "src/domain/schedule/ScheduleRule.ts": [
    "ParsedRuleValue", "parseParentScheduleRuleValue", "parseCycleValue",
    "parseClosedDaySubstitutionValue", "parseShiftDaysValue",
    "parseStartTimeValue", "parseDelayTimeValue", "parseWaitTimeValue",
    "parseAnyScheduleTimeValue", "parseWaitCountValue",
    "EffectiveStartConditionMonitoringPair",
    "resolveEffectiveStartConditionMonitoringPair",
    "ParsedScheduleByDaysFromStartValue", "parseScheduleByDaysFromStartValue",
  ],
  "src/domain/schedule/ScheduleInterpretation.ts": [
    "ScheduleStatus", "ScheduleUnsupportedReason", "ScheduleEvidence",
    "ScheduleRuleInterpretation", "ScheduleInterpretation", "interpretSchedule",
  ],
  "src/domain/schedule/ScheduleCalendar.ts": [
    "ScheduleCalendarContextStatus", "ScheduleCalendarBaseDay",
    "ScheduleCalendarDayClassification", "ScheduleCalendarSelector",
    "ScheduleCalendarEntry", "ScheduleCalendarGroup",
    "ScheduleCalendarSelection", "ScheduleCalendarContext",
    "ScheduleCalendarContextIndex", "ScheduleCalendarDayResult",
    "ScheduleOperationalMonth", "createScheduleCalendarContextIndex",
    "classifyScheduleCalendarDay", "resolveScheduleCalendarContext",
    "isWithinOperationalMonth", "operationalMonthDate", "operationalMonthLength",
    "resolveOperationalMonth", "isFullyQualifiedRelativeScheduleDate",
    "isSyntacticallyInvalidRelativeScheduleDate",
    "relativeScheduleDateRequiresContext",
  ],
  "src/domain/schedule/ScheduleCandidateResolver.ts": [
    "ScheduleDateCandidateResult", "resolveScheduleDateCandidates",
  ],
  "src/domain/schedule/ScheduleProjection.ts": [
    "ScheduleProjection", "ScheduleProjectionInput",
    "ScheduleProjectionPeriod", "ScheduleRun", "projectScheduleRuns",
  ],
  "src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts": [
    "SemanticDiffScheduleSide", "SemanticDiffScheduleRunDecision",
    "compareScheduleRuns",
  ],
  "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts": [
    "SemanticDiffScheduleMatchedUnit",
    "SemanticDiffScheduleUnsupportedDecision",
    "SemanticDiffScheduleEvidenceKind",
    "SemanticDiffScheduleSideEvaluation",
    "SemanticDiffSchedulePairEvaluation",
    "SemanticDiffScheduleEvaluation",
    "EvaluateSemanticDiffScheduleInput", "evaluateSemanticDiffSchedule",
  ],
}));
const requiredFacadePhases = new Set(["slice2", "slice3"]);
for (const requiredPhase of requiredFacadePhases) {
  if (!phaseModules[requiredPhase].includes(facadePath)) {
    throw new Error(requiredPhase + ": facade is missing from phaseModules");
  }
}
for (const path of phaseModules[phase]) {
  if (/\/ScheduleSubstitution(?:\.[^/]+)?$/.test(path)) {
    throw new Error(path + ": obsolete empty substitution module is forbidden");
  }
}
const actualExports = (path) => {
  const file = program.getSourceFile(repo + "/" + path);
  if (!file) throw new Error(path + ": source file is missing at this phase");
  const moduleSymbol = checker.getSymbolAtLocation(file);
  if (!moduleSymbol) throw new Error(path + ": module symbol unavailable");
  return new Set(checker.getExportsOfModule(moduleSymbol).map((symbol) => symbol.getName()));
};
const interimFacadeDirectExports = [
  ...expected.get(facadePath),
];
const interimFacadeExportsByPhase = new Map([
  ["slice2", [
    ...interimFacadeDirectExports,
    "interpretSchedule", "projectScheduleRuns", "compareScheduleRuns",
    "SemanticDiffScheduleSide", "SemanticDiffScheduleRunDecision",
  ]],
  ["slice3", [
    ...interimFacadeDirectExports,
    "interpretSchedule", "projectScheduleRuns", "compareScheduleRuns",
    "SemanticDiffScheduleSide", "SemanticDiffScheduleRunDecision",
  ]],
]);
const expectedExports = (path) => {
  if (!expected.has(path)) throw new Error(path + ": missing expected export contract");
  if (path === facadePath && phase !== "slice4") {
    return new Set(interimFacadeExportsByPhase.get(phase));
  }
  return new Set(expected.get(path));
};
const failures = [];
for (const path of phaseModules[phase]) {
  const wanted = expectedExports(path);
  const actual = actualExports(path);
  const missing = [...wanted].filter((name) => !actual.has(name));
  const unexpected = [...actual].filter((name) => !wanted.has(name));
  if (missing.length || unexpected.length) {
    failures.push(path + ": missing=" + missing.join(",") + "; unexpected=" + unexpected.join(","));
  }
}

const sourceFileForModuleSpecifier = (moduleSpecifier) => {
  const moduleSymbol = checker.getSymbolAtLocation(moduleSpecifier);
  return moduleSymbol?.declarations?.find(ts.isSourceFile);
};
const resolveExportSpecifierTarget = (specifier) => {
  const targetSymbol = checker.getExportSpecifierLocalTargetSymbol(specifier);
  const declaration = targetSymbol?.declarations?.[0];
  if (!declaration) return { kind: "unresolved" };
  if (!ts.isImportSpecifier(declaration)) {
    return { kind: "direct", declaration, sourceFile: declaration.getSourceFile() };
  }
  const importDeclaration = declaration.parent.parent.parent;
  if (!ts.isImportDeclaration(importDeclaration)) return { kind: "unresolved" };
  const sourceFile = sourceFileForModuleSpecifier(importDeclaration.moduleSpecifier);
  const importedName = (declaration.propertyName ?? declaration.name).text;
  const sourceSymbol = sourceFile
    ? checker.getExportsOfModule(checker.getSymbolAtLocation(importDeclaration.moduleSpecifier))
        .find((symbol) => symbol.getName() === importedName)
    : undefined;
  const resolvedSymbol = sourceSymbol && (sourceSymbol.flags & ts.SymbolFlags.Alias)
    ? checker.getAliasedSymbol(sourceSymbol)
    : sourceSymbol;
  return {
    kind: "local-import",
    declaration,
    sourceFile,
    moduleSpecifier: importDeclaration.moduleSpecifier,
    importedName,
    localName: declaration.name.text,
    resolvedDeclaration: resolvedSymbol?.declarations?.[0],
  };
};

const facade = program.getSourceFile(repo + "/" + facadePath);
const bridgeRulesByPhase = new Map([
  ["slice2", new Map([
    ["interpretSchedule", { source: "../../schedule/ScheduleInterpretation", kind: "value" }],
    ["projectScheduleRuns", { source: "./semanticDiffScheduleProjector", kind: "value" }],
    ["compareScheduleRuns", { source: "./semanticDiffScheduleDiffer", kind: "value" }],
    ["SemanticDiffScheduleSide", { source: "./semanticDiffScheduleTypes", kind: "type" }],
    ["SemanticDiffScheduleRunDecision", { source: "./semanticDiffScheduleDiffer", kind: "type" }],
  ])],
  ["slice3", new Map([
    ["interpretSchedule", { source: "../../schedule/ScheduleInterpretation", kind: "value" }],
    ["projectScheduleRuns", { source: "./semanticDiffScheduleProjector", kind: "value" }],
    ["compareScheduleRuns", { source: "./semanticDiffScheduleDiffer", kind: "value" }],
    ["SemanticDiffScheduleSide", { source: "./semanticDiffScheduleTypes", kind: "type" }],
    ["SemanticDiffScheduleRunDecision", { source: "./semanticDiffScheduleDiffer", kind: "type" }],
  ])],
  ["slice4", new Map()],
]);
const bridgeRules = bridgeRulesByPhase.get(phase);
const finalOwnerModules = new Set(
  phaseModules[phase].filter((path) => phase === "slice4" || path !== facadePath),
);
const exportedDeclarationNames = (file) => {
  const names = new Set();
  const hasExport = (node) =>
    (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement) && hasExport(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
      continue;
    }
    if (
      (ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement)) &&
      hasExport(statement) &&
      statement.name
    ) {
      names.add(statement.name.text);
    }
  }
  return names;
};
for (const path of phaseModules[phase]) {
  const file = program.getSourceFile(repo + "/" + path);
  const direct = exportedDeclarationNames(file);
  const expectedDirect = path === facadePath && phase !== "slice4"
    ? new Set(interimFacadeDirectExports)
    : finalOwnerModules.has(path)
      ? expectedExports(path)
      : undefined;
  if (!expectedDirect) continue;
  for (const name of expectedDirect) {
    if (!direct.has(name)) failures.push(path + ": missing direct declaration " + name);
  }
  for (const name of direct) {
    if (!expectedDirect.has(name)) failures.push(path + ": unauthorized direct declaration " + name);
  }
  if (path === facadePath && phase !== "slice4") {
    for (const name of bridgeRules.keys()) {
      if (direct.has(name)) failures.push(path + ": bridge has duplicate direct declaration " + name);
    }
  }
}
const failuresForForwarding = [];
for (const path of phaseModules[phase]) {
  const file = program.getSourceFile(repo + "/" + path);
  for (const statement of file.statements) {
    if (!ts.isExportDeclaration(statement)) continue;
    if (!statement.exportClause || ts.isNamespaceExport(statement.exportClause)) {
      failuresForForwarding.push(path + ": wildcard/star export is forbidden");
      continue;
    }
    for (const specifier of statement.exportClause.elements) {
      const exported = specifier.name.text;
      const target = resolveExportSpecifierTarget(specifier);
      if (finalOwnerModules.has(path)) {
        if (statement.moduleSpecifier) {
          failuresForForwarding.push(path + ": indirect export of " + exported);
        }
        if (specifier.propertyName) {
          failuresForForwarding.push(path + ": aliased export of " + exported);
        }
        if (target.kind !== "direct" || target.sourceFile !== file) {
          failuresForForwarding.push(path + ": " + exported + " is not directly declared in its final owner");
        }
        continue;
      }
      const rule = bridgeRules.get(exported);
      if (!rule) {
        failuresForForwarding.push(path + ": unauthorized interim bridge " + exported);
        continue;
      }
      const isType = statement.isTypeOnly || specifier.isTypeOnly;
      if (isType !== (rule.kind === "type")) {
        failuresForForwarding.push(path + ": wrong value/type bridge for " + exported);
      }
      if (specifier.propertyName) {
        failuresForForwarding.push(path + ": aliased interim bridge " + exported);
      }
      const source = statement.moduleSpecifier?.text ?? "";
      const bridgeSource = statement.moduleSpecifier
        ? sourceFileForModuleSpecifier(statement.moduleSpecifier)
        : target.sourceFile;
      if (source && source !== rule.source) {
        failuresForForwarding.push(path + ": wrong bridge source for " + exported + ": " + source);
      }
      if (!source && target.moduleSpecifier?.text !== rule.source) {
        failuresForForwarding.push(path + ": wrong local-import bridge source for " + exported);
      }
      if (!bridgeSource) {
        failuresForForwarding.push(path + ": unresolved bridge source for " + exported);
      }
      if (statement.moduleSpecifier) {
        if (!bridgeSource || target.kind !== "direct" || target.sourceFile?.fileName !== bridgeSource.fileName) {
          failuresForForwarding.push(path + ": indirect bridge for " + exported);
        }
      } else if (
        target.kind !== "local-import" ||
        target.importedName !== exported ||
        target.localName !== exported ||
        target.resolvedDeclaration?.getSourceFile() !== bridgeSource
      ) {
        failuresForForwarding.push(path + ": invalid local-import bridge for " + exported);
      }
    }
  }
}
if (failuresForForwarding.length) {
  failures.push(...failuresForForwarding);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("phase-specific exact export/forwarding audit (" + phase + "): OK");
'
```

### Compiler-API bridge probe on the current tree

The phase audit cannot pass against the pre-migration tree because the new
`src/domain/schedule` modules do not exist yet. Before implementation, run this
smaller executable probe against the current facade to validate the resolver
itself and prevent a false rejection of the two authorized bridge shapes. It
checks the current local-import-plus-export bridges and direct `export ...
from` bridges using the same `getExportSpecifierLocalTargetSymbol` and import
ancestry logic; it intentionally does not assert the future exact export sets.

```sh
node --input-type=module -e '
import ts from "typescript";

const repo = process.cwd();
const configPath = ts.findConfigFile(repo, ts.sys.fileExists, "tsconfig.json");
const parsed = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(ts.flattenDiagnosticMessageText(d.messageText, "\n")); } },
);
const program = ts.createProgram(parsed.fileNames, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();
const facadePath = "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts";
const facade = program.getSourceFile(repo + "/" + facadePath);
const sourceFileForModuleSpecifier = (moduleSpecifier) =>
  checker.getSymbolAtLocation(moduleSpecifier)?.declarations?.find(ts.isSourceFile);
const resolveExportSpecifierTarget = (specifier) => {
  const targetSymbol = checker.getExportSpecifierLocalTargetSymbol(specifier);
  const declaration = targetSymbol?.declarations?.[0];
  if (!declaration) return { kind: "unresolved" };
  if (!ts.isImportSpecifier(declaration)) {
    return { kind: "direct", declaration, sourceFile: declaration.getSourceFile() };
  }
  const importDeclaration = declaration.parent.parent.parent;
  const sourceFile = ts.isImportDeclaration(importDeclaration)
    ? sourceFileForModuleSpecifier(importDeclaration.moduleSpecifier)
    : undefined;
  return {
    kind: "local-import",
    declaration,
    sourceFile,
    moduleSpecifier: ts.isImportDeclaration(importDeclaration)
      ? importDeclaration.moduleSpecifier
      : undefined,
    importedName: (declaration.propertyName ?? declaration.name).text,
    localName: declaration.name.text,
  };
};
const expected = new Map([
  ["interpretSchedule", { source: "./semanticDiffScheduleInterpreter", kind: "value", form: "local-import" }],
  ["projectScheduleRuns", { source: "./semanticDiffScheduleProjector", kind: "value", form: "local-import" }],
  ["compareScheduleRuns", { source: "./semanticDiffScheduleDiffer", kind: "value", form: "local-import" }],
  ["SemanticDiffScheduleSide", { source: "./semanticDiffScheduleTypes", kind: "type", form: "direct" }],
  ["SemanticDiffScheduleRunDecision", { source: "./semanticDiffScheduleDiffer", kind: "type", form: "direct" }],
]);
const seen = new Set();
const failures = [];
for (const statement of facade.statements) {
  if (!ts.isExportDeclaration(statement) || !statement.exportClause || ts.isNamespaceExport(statement.exportClause)) continue;
  for (const specifier of statement.exportClause.elements) {
    const rule = expected.get(specifier.name.text);
    if (!rule) continue;
    seen.add(specifier.name.text);
    const target = resolveExportSpecifierTarget(specifier);
    const form = statement.moduleSpecifier ? "direct" : target.kind;
    const source = statement.moduleSpecifier?.text ?? target.moduleSpecifier?.text;
    if (form !== rule.form || source !== rule.source || specifier.propertyName) {
      failures.push(specifier.name.text + ": unexpected bridge shape");
    }
    if ((statement.isTypeOnly || specifier.isTypeOnly) !== (rule.kind === "type")) {
      failures.push(specifier.name.text + ": wrong value/type bridge");
    }
  }
}
for (const name of expected.keys()) if (!seen.has(name)) failures.push(name + ": bridge not found");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("current facade direct/local bridge probe: OK");
'
```

The bridge rules above are the only interim exception. Slice 2 and Slice 3
must expose the exact comparison-owned set through the facade while retaining
only interpretSchedule and projectScheduleRuns as reusable bridges. They must
also retain compareScheduleRuns, SemanticDiffScheduleSide,
SemanticDiffScheduleRunDecision, SemanticDiffScheduleMatchedUnit,
SemanticDiffScheduleUnsupportedDecision, SemanticDiffScheduleEvidenceKind,
SemanticDiffScheduleSideEvaluation, SemanticDiffSchedulePairEvaluation,
SemanticDiffScheduleEvaluation, EvaluateSemanticDiffScheduleInput, and
evaluateSemanticDiffSchedule. Slice 4 sets the bridge map to empty and the
facade export set to the exact final set in the table. Any direct or type-only
forward not listed in the phase map, any alias or indirect alias, and any
wildcard export is a Finding/NG.

Before the final inventory is used, re-audit the current repository with this
exact declaration scan and reconcile every row against the baseline below:

```sh
rtk rg -n --glob '*.ts' --glob '*.tsx' '^[[:space:]]*export[[:space:]]+(declare[[:space:]]+)?(type|interface|const|function|class)[[:space:]]+SemanticDiffSchedule[A-Za-z0-9_]+' src
```

The scan is a pre-Slice-1 baseline, not a final-owner assertion. Its complete
transitional declaration-owner table is:

| Transitional owner                                                              | Complete exported `SemanticDiffSchedule*` declarations                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`                | `SemanticDiffScheduleStatus`, `SemanticDiffScheduleUnsupportedReason`, `SemanticDiffScheduleSide`, `SemanticDiffScheduleEvidence`, `SemanticDiffScheduleRuleInterpretation`, `SemanticDiffScheduleInterpretation`, `SemanticDiffScheduleProjection`, `SemanticDiffScheduleProjectionInput`                                                                                                                                                                                                                     |
| `src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts`        | `SemanticDiffScheduleCalendarContextStatus`, `SemanticDiffScheduleBaseDay`, `SemanticDiffScheduleCalendarDayClassification`, `SemanticDiffScheduleCalendarSelector`, `SemanticDiffScheduleCalendarEntry`, `SemanticDiffScheduleCalendarGroup`, `SemanticDiffScheduleCalendarSelection`, `SemanticDiffScheduleCalendarContext`, `SemanticDiffScheduleCalendarContextIndex`, `SemanticDiffScheduleCalendarDayResult`, `SemanticDiffScheduleContextInput`                                                         |
| `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`               | `SemanticDiffScheduleRunDecision`                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`                | `SemanticDiffScheduleMatchedUnit`, `SemanticDiffScheduleUnsupportedDecision`, `SemanticDiffScheduleEvidenceKind`, `SemanticDiffScheduleSideEvaluation`, `SemanticDiffSchedulePairEvaluation`, `SemanticDiffScheduleEvaluation`                                                                                                                                                                                                                                                                                 |
| `src/domain/models/semantic-diff/SemanticDiff.ts`                               | `SemanticDiffScheduleRun` (transitional domain owner)                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `src/application/semantic-diff/semanticDiffDto.ts`                              | `SemanticDiffScheduleRun`, `SemanticDiffScheduleRunChangeKind`, `SemanticDiffScheduleRunChange`, `SemanticDiffScheduleComparison`                                                                                                                                                                                                                                                                                                                                                                              |
| `src/application/semantic-diff/semanticDiffScheduleImpact.ts`                   | `SemanticDiffScheduleImpactRootOutcome`, `SemanticDiffScheduleImpactRunState`, `SemanticDiffScheduleImpactIssueKind`, `SemanticDiffScheduleImpactRun`, `SemanticDiffScheduleImpactIssue`, `SemanticDiffScheduleImpactRootSide`, `SemanticDiffScheduleImpactRootMatchKind`, `SemanticDiffScheduleImpactRoot`, `SemanticDiffScheduleImpactCandidate`, `SemanticDiffScheduleImpactCandidateGroup`, `SemanticDiffScheduleImpactTimelineItem`, `SemanticDiffScheduleImpact`, `SemanticDiffScheduleImpactRootStatus` |
| `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`       | `SemanticDiffScheduleImpactUnavailableReason`, `SemanticDiffScheduleImpactAvailability`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts` | `SemanticDiffScheduleImpactLookup`                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

The cumulative phase retirement map above is the only permitted way for a
transitional row to disappear. The final `declarationOwners` map below is
checked only at Slice 4 and Feature Exit, after the due retirement map has
removed the transitional domain owners; it is not compared directly with this
pre-migration table. Any baseline row omitted from this table, any unexpected
baseline declaration, or any final owner entry that fails its final assertion
blocks approval and requires Replanning.

The final all-`src` owner-inventory assertion is a second, exact check; it
does not treat a known symbol name as sufficient when it appears at an
unapproved path. Use the repository's Node runtime and no added script or
configuration:

```sh
node --input-type=module -e '
import ts from "typescript";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const declarationOwners = new Map(Object.entries({
  "src/domain/services/semantic-diff/semanticDiffScheduleRules.ts": [
    "SemanticDiffScheduleMatchedUnit",
    "SemanticDiffScheduleUnsupportedDecision",
    "SemanticDiffScheduleEvidenceKind",
    "SemanticDiffScheduleSideEvaluation",
    "SemanticDiffSchedulePairEvaluation",
    "SemanticDiffScheduleEvaluation",
  ],
  "src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts": [
    "SemanticDiffScheduleSide",
    "SemanticDiffScheduleRunDecision",
  ],
  "src/application/semantic-diff/semanticDiffDto.ts": [
    "SemanticDiffScheduleRun",
    "SemanticDiffScheduleRunChangeKind",
    "SemanticDiffScheduleRunChange",
    "SemanticDiffScheduleComparison",
  ],
  "src/application/semantic-diff/semanticDiffScheduleImpact.ts": [
    "SemanticDiffScheduleImpact",
    "SemanticDiffScheduleImpactCandidate",
    "SemanticDiffScheduleImpactCandidateGroup",
    "SemanticDiffScheduleImpactIssue",
    "SemanticDiffScheduleImpactIssueKind",
    "SemanticDiffScheduleImpactRoot",
    "SemanticDiffScheduleImpactRootMatchKind",
    "SemanticDiffScheduleImpactRootOutcome",
    "SemanticDiffScheduleImpactRootSide",
    "SemanticDiffScheduleImpactRootStatus",
    "SemanticDiffScheduleImpactRun",
    "SemanticDiffScheduleImpactRunState",
    "SemanticDiffScheduleImpactTimelineItem",
  ],
  "src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts": [
    "SemanticDiffScheduleImpactUnavailableReason",
    "SemanticDiffScheduleImpactAvailability",
  ],
  "src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts": [
    "SemanticDiffScheduleImpactLookup",
  ],
}));

const permittedReferences = new Map([
  ["src/domain/services/semantic-diff/semanticDiffScheduleRules.ts", [
    ...declarationOwners.get("src/domain/services/semantic-diff/semanticDiffScheduleRules.ts"),
    "SemanticDiffScheduleSide",
    "SemanticDiffScheduleRunDecision",
  ]],
  ["src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts", [
    ...declarationOwners.get("src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts"),
  ]],
  ["src/application/semantic-diff/semanticDiffDto.ts", [
    ...declarationOwners.get("src/application/semantic-diff/semanticDiffDto.ts"),
  ]],
  ["src/application/semantic-diff/semanticDiffScheduleImpact.ts", [
    "SemanticDiffScheduleImpact",
    "SemanticDiffScheduleImpactCandidate",
    "SemanticDiffScheduleImpactCandidateGroup",
    "SemanticDiffScheduleImpactIssue",
    "SemanticDiffScheduleImpactIssueKind",
    "SemanticDiffScheduleImpactRoot",
    "SemanticDiffScheduleImpactRootMatchKind",
    "SemanticDiffScheduleImpactRootOutcome",
    "SemanticDiffScheduleImpactRootSide",
    "SemanticDiffScheduleImpactRootStatus",
    "SemanticDiffScheduleImpactRun",
    "SemanticDiffScheduleImpactRunState",
    "SemanticDiffScheduleImpactTimelineItem",
    "SemanticDiffScheduleEvaluation",
    "SemanticDiffScheduleRun",
    "SemanticDiffScheduleRunChange",
    "SemanticDiffScheduleUnsupportedDecision",
  ]],
  ["src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts", [
    "SemanticDiffScheduleImpactUnavailableReason",
    "SemanticDiffScheduleImpactAvailability",
    "SemanticDiffScheduleImpact",
  ]],
  ["src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts", [
    "SemanticDiffScheduleImpactLookup",
    "SemanticDiffScheduleImpact",
  ]],
]);

const referencePaths = new Set([
  "src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts",
  "src/application/semantic-diff/compareScheduleDiff.ts",
  "src/application/semantic-diff/compareSemanticDiff.ts",
  "src/application/semantic-diff/semanticDiffExplorerDto.ts",
  "src/application/semantic-diff/semanticDiffExplorerProjectionLeaves.ts",
  "src/application/semantic-diff/semanticDiffExplorerProjectionPaths.ts",
  "src/application/semantic-diff/semanticDiffExplorerProjectionSupport.ts",
  "src/application/semantic-diff/semanticDiffExplorerRecordGuards.ts",
  "src/bootstrap/extension/createScheduleAwareExplorerSession.ts",
  "src/bootstrap/extension/scheduleImpactSidecarRegistry.ts",
  "src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanel.ts",
  "src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarSessionRegistry.ts",
  "src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarTransport.ts",
  "src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts",
  "src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelActions.ts",
  "src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts",
  "src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx",
  "src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarCandidates.tsx",
  "src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx",
  "src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarIssues.tsx",
  "src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarRootSections.tsx",
  "src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimelineHelpers.tsx",
  "src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel.ts",
  "src/test/suite/createScheduleAwareExplorerSession.test.ts",
  "src/test/suite/scheduleImpactCalendarComponents.test.tsx",
  "src/test/suite/scheduleImpactCalendarPanelRuntime.test.ts",
  "src/test/suite/scheduleImpactCalendarProjection.test.ts",
  "src/test/suite/scheduleImpactCalendarSession.test.ts",
  "src/test/suite/scheduleImpactCalendarThemeContext.test.tsx",
  "src/test/suite/scheduleImpactCalendarView.test.tsx",
  "src/test/suite/scheduleImpactSidecarRegistry.test.ts",
  "src/test/suite/semanticDiffContracts.test.ts",
  "src/test/suite/semanticDiffExplorerPanel.test.ts",
  "src/test/suite/semanticDiffExplorerScheduleImpact.test.ts",
  "src/test/suite/semanticDiffScheduleCalendar.test.ts",
  "src/test/suite/semanticDiffScheduleImpact.test.ts",
  "src/test/suite/semanticDiffScheduleRules.test.ts",
]);

const allowed = new Set([...declarationOwners.values()].flat());
const failures = [];
const files = execFileSync(
  "rtk",
  ["rg", "-l", "\\bSemanticDiffSchedule[A-Za-z0-9_]*", "src", "--glob", "*.ts", "--glob", "*.tsx"],
  { encoding: "utf8" },
).trim().split("\n").filter(Boolean);
const directExportedNames = (file) => {
  const sourceFile = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const names = [];
  const isExported = (node) => (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
  for (const statement of sourceFile.statements) {
    if (!isExported(statement)) continue;
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text);
      }
      continue;
    }
    if (
      (ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.push(statement.name.text);
    }
  }
  return names;
};

for (const [owner, names] of declarationOwners) {
  if (!files.includes(owner)) {
    failures.push(`${owner}: recorded declaration owner is missing from the final source scan`);
    continue;
  }
  const direct = directExportedNames(owner);
  for (const name of names) {
    const count = direct.filter((declaredName) => declaredName === name).length;
    if (count !== 1) {
      failures.push(`${owner}: ${name} must have exactly one direct exported declaration (found ${count})`);
    }
  }
}

for (const file of files) {
  const permitted = permittedReferences.get(file) ?? (referencePaths.has(file) ? [...allowed] : undefined);
  if (!permitted) {
    failures.push(`${file}: path is not in owner/reference allowlist`);
  }
  const names = [...readFileSync(file, "utf8").matchAll(/\bSemanticDiffSchedule[A-Za-z0-9_]*/g)]
    .map(([name]) => name);
  for (const name of new Set(names)) {
    if (!allowed.has(name)) failures.push(`${file}: ${name} is not an allowlisted symbol`);
    if (permitted && !permitted.includes(name)) {
      failures.push(`${file}: ${name} is not an owner/reference symbol for this path`);
    }
  }
  const declarations = directExportedNames(file).filter((name) => /^SemanticDiffSchedule[A-Za-z0-9_]*$/.test(name));
  const ownerDeclarations = declarationOwners.get(file) ?? [];
  for (const name of new Set(declarations)) {
    if (!ownerDeclarations.includes(name)) {
      failures.push(`${file}: ${name} is declared here but has no declaration ownership`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("all-src SemanticDiffSchedule owner inventory: OK");
'
```

`declarationOwners` records the sole declaration owner for each retained
comparison/application contract. Before reference-path checks, the executable
asserts that every map entry has exactly one direct exported declaration at its
recorded owner; it also rejects every unexpected direct exported declaration.
`permittedReferences` separately records
symbols that an owner may reference internally; in particular,
`semanticDiffScheduleRules.ts` may reference `SemanticDiffScheduleSide` and
`SemanticDiffScheduleRunDecision` while it may not declare or re-export them.
Before accepting this inventory, verify the two namespace-sensitive entries
with `rtk rg -o '\bSemanticDiffSchedule[A-Za-z0-9_]+'` against
`src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts` and
`src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts`:
the first must contain exactly `SemanticDiffScheduleImpactUnavailableReason`,
`SemanticDiffScheduleImpactAvailability`, and imported
`SemanticDiffScheduleImpact`; the second must contain exactly
`SemanticDiffScheduleImpactLookup` and imported `SemanticDiffScheduleImpact`.
Reference-only paths may use only the globally allowlisted names, and an
unexpected path or symbol is a Finding/NG. The exact declaration/reference
inventory runs at Slice 4 and Feature Exit against the final maps above;
Slice 2/3 use their closed phase denylist and explicit temporary-forwarder
criteria because their old owners are intentionally still present. This makes
the final all-`src` match inventory reproducible and path-scoped without
silently broadening an interim allowlist.

### Path-resolved schedule-package dependency audit

At Slice 4 and Feature Exit, run this exact inspection over every TypeScript
module under `src/domain/schedule`. It resolves the target file rather than
matching the import text, so relative aliases and renamed bindings cannot hide
a dependency. `ImportDeclaration` covers type-only imports; `ExportDeclaration`
covers direct, aliased, `export ... from`, `export *`, and `export type *`
forms. `ImportEqualsDeclaration` is included for completeness. An unresolved
specifier is a failure because the audit cannot establish that its target is
outside the forbidden Semantic Diff packages.

```sh
node --input-type=module -e '
import ts from "typescript";
import { resolve, sep } from "node:path";

const repo = process.cwd();
const configPath = ts.findConfigFile(repo, ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("tsconfig.json not found");
const parsed = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(ts.flattenDiagnosticMessageText(d.messageText, "\n")); } },
);
if (!parsed) throw new Error("unable to parse tsconfig.json");
const program = ts.createProgram(parsed.fileNames, { ...parsed.options, noEmit: true });
const scheduleRoot = resolve(repo, "src/domain/schedule");
const forbiddenRoots = [
  resolve(repo, "src/domain/services/semantic-diff"),
  resolve(repo, "src/domain/models/semantic-diff"),
];
const inside = (file, root) => file === root || file.startsWith(root + sep);
const targetFor = (specifier, containingFile) =>
  ts.resolveModuleName(specifier, containingFile, parsed.options, ts.sys)
    .resolvedModule?.resolvedFileName;
const failures = [];
const scheduleFiles = program.getSourceFiles().filter((file) =>
  inside(resolve(file.fileName), scheduleRoot) && !file.isDeclarationFile,
);
for (const file of scheduleFiles) {
  for (const statement of file.statements) {
    let specifier;
    let kind;
    if (ts.isImportDeclaration(statement)) {
      specifier = statement.moduleSpecifier.text;
      kind = statement.importClause?.isTypeOnly ? "type import" : "import";
    } else if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
      specifier = statement.moduleSpecifier.text;
      kind = statement.isTypeOnly ? "type export" : "export";
    } else if (
      ts.isImportEqualsDeclaration(statement) &&
      ts.isExternalModuleReference(statement.moduleReference) &&
      ts.isStringLiteral(statement.moduleReference.expression)
    ) {
      specifier = statement.moduleReference.expression.text;
      kind = "import-equals";
    }
    if (!specifier) continue;
    const resolved = targetFor(specifier, file.fileName);
    if (!resolved) {
      failures.push(`${file.fileName}: unresolved ${kind} ${specifier}`);
      continue;
    }
    const target = resolve(resolved);
    for (const forbiddenRoot of forbiddenRoots) {
      if (inside(target, forbiddenRoot)) {
        failures.push(`${file.fileName}: ${kind} ${specifier} resolves to ${target}`);
      }
    }
  }
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("path-resolved schedule-package dependency audit: OK");
'
```

The phase export audit, current-tree bridge probe, final owner inventory,
`SemanticDiffScheduleRun` retirement audit, and this dependency audit are the
complete embedded-script set. Re-audit each script's `phaseModules`, expected
export map, bridge map, owner map, and path list together; extract each
`node --input-type=module -e` body and run `node --check` before accepting the
Slice 4 or Feature Exit evidence. A missing facade phase entry, stale
`ScheduleSubstitution.*` entry, missing permitted reference, or path omitted
from the final audit is a Finding/NG, not an advisory omission.

### Path-scoped retirement audit for `SemanticDiffScheduleRun`

Because the application DTO name is intentionally absent from the reusable
denylist, Slice 4 and Feature Exit run this separate exact assertion. It is
not satisfied by the global namespace inventory alone: no
`SemanticDiffScheduleRun` declaration or reference may remain under
`src/domain`; the application matches must be exactly the DTO owner plus the
four current consumers, and the DTO owner must contain exactly one direct
exported declaration.

```sh
node --input-type=module -e '
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const filesFor = (root) => {
  let output = "";
  try {
    output = execFileSync(
      "rtk",
      ["rg", "-l", "\\bSemanticDiffScheduleRun\\b", root, "--glob", "*.ts", "--glob", "*.tsx"],
      { encoding: "utf8" },
    ).trim();
  } catch (error) {
    if (error?.status !== 1) throw error;
  }
  return new Set(output ? output.split("\n") : []);
};
const domainFiles = filesFor("src/domain");
const applicationFiles = filesFor("src/application");
const dtoOwner = "src/application/semantic-diff/semanticDiffDto.ts";
const expectedApplicationFiles = new Set([
  dtoOwner,
  "src/application/semantic-diff/compareScheduleDiff.ts",
  "src/application/semantic-diff/semanticDiffExplorerRecordGuards.ts",
  "src/application/semantic-diff/semanticDiffScheduleImpact.ts",
]);
const failures = [];
for (const file of domainFiles) failures.push(file + ": old domain run contract remains");
for (const file of applicationFiles) {
  if (!expectedApplicationFiles.has(file)) failures.push(file + ": unexpected application run reference path");
}
for (const file of expectedApplicationFiles) {
  if (!applicationFiles.has(file)) failures.push(file + ": expected application run path is missing");
}
const declarationCount = [...readFileSync(dtoOwner, "utf8").matchAll(
  /^export[ \t]+type[ \t]+SemanticDiffScheduleRun\b/gm,
)].length;
if (declarationCount !== 1) failures.push(dtoOwner + ": expected exactly one direct DTO declaration");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("SemanticDiffScheduleRun domain-retirement/application-owner audit: OK");
'
```

This audit is deliberately path-scoped rather than a new global exception. It
also re-audits the similar `SemanticDiffScheduleImpact*` and panel transport
names through the owner inventory above, so a same-name contract retained in
application or presentation cannot silently become a domain owner.

Phase pass criteria are closed and cumulative:

- Slice 1: the three old date/rule paths are absent, all moved date/rule
  consumers use `domain/schedule`, `resolveScheduleRuleNumber` occurs only
  locally in `ScheduleRule.ts`, and the exact ScheduleRule export/local-boundary
  audit passes before Slice 2 begins.
  The required `SDD_PHASE=slice1` retirement/file-set audit also proves all
  three due filesystem paths are absent, the actual schedule package contains
  exactly `ScheduleDate.ts` and `ScheduleRule.ts`, and
  every `ScheduleSubstitution.*` variant is absent.
- Slice 2: the Slice 1 denylist paths are absent; the three interpretation
  paths and reusable interpretation symbols are absent; `phaseModules` includes
  `semanticDiffScheduleRules.ts`, whose exact interim facade set is the eight
  direct declarations `SemanticDiffScheduleMatchedUnit`,
  `SemanticDiffScheduleUnsupportedDecision`,
  `SemanticDiffScheduleEvidenceKind`,
  `SemanticDiffScheduleSideEvaluation`,
  `SemanticDiffSchedulePairEvaluation`, `SemanticDiffScheduleEvaluation`,
  `EvaluateSemanticDiffScheduleInput`, and `evaluateSemanticDiffSchedule`,
  plus exactly five bridges: local-import/value bridges for
  `interpretSchedule`, `projectScheduleRuns`, and `compareScheduleRuns`, and
  direct export-from/type bridges for `SemanticDiffScheduleSide` and
  `SemanticDiffScheduleRunDecision`, with the exact sources in the phase map.
  No bridge may also be a direct declaration; no other direct, aliased,
  wildcard, type-only, indirect, or re-exported symbol is permitted. No new
  schedule `AjsDocumentIndex` match is present; the positive phase-specific
  export/forwarding audit covers every Slice 2 module and the Slice 2
  completion import state compiles.
  The required `SDD_PHASE=slice2` retirement/file-set audit selects only the
  Slice 1 plus interpretation retirement sets, checks every due old path with
  unfiltered `rtk rg --files`, and checks the exact three-file all-file schedule
  package set; the
  local-only audit covers every Slice 1 and Slice 2 helper.
- Slice 3: Slice 2 passes; all calendar/index/selector/operational-month/
  relative-date/candidate paths and calendar symbols are absent; `phaseModules`
  includes `semanticDiffScheduleRules.ts` with the same exact interim direct
  declaration set and five phase-mapped bridges as Slice 2; no bridge may also
  be a direct declaration, and aliases, wildcard exports, type-only or
  indirect unauthorized forwards are rejected. The calendar test matches the
  exact Slice 3 import block and its same-index/non-mutation test hunk passes;
  no `AjsDocumentIndex` occurs in the schedule/facade/test scope; the
  multiline-safe forwarder check, exact ScheduleCalendar export/local-boundary
  audit, all-module structural export audit with only the exact interim bridge
  map, and phase-specific denylist criteria pass;
  and
  the Slice 3 completion state compiles.
  The required `SDD_PHASE=slice3` retirement/file-set audit selects only the
  Slice 1-3 retirement sets and the exact five-file all-file schedule package
  set;
  the local-only audit proves the ScheduleCalendar context input and factory
  remain non-exported in `ScheduleCalendar.ts` and rechecks all prior locals.
- Slice 4: the entire denylist is absent from all `src`, both forwarding
  exports and all old-module imports are absent, reusable Semantic Diff types
  are absent outside the explicit comparison/application allowlist, every
  allowlist symbol remains at its recorded declaration owner, the final
  multiline/alias-safe value/type facade check and declaration/reference
  owner inventory pass, and the path-resolved schedule-package dependency
  audit proves that `domain/schedule` has no dependency on either Semantic
  Diff package for ordinary, type-only, aliased, `export ... from`, `export *`,
  or `export type *` forms. `AjsDocumentIndex` remains absent from the
  schedule/facade/test scope. The
  separate `SemanticDiffScheduleRun` retirement audit also passes: no domain
  declaration/reference remains, exactly the unchanged application DTO owner
  and four application reference paths remain, and the DTO declaration is
  direct and unique. Every phase module is covered by structural export
  analysis; final owner modules have no wildcard, alias, or indirect export,
  and the facade has no bridge entries. The Slice 4 completion imports and
  period guard/projection-precondition tests compile.
  The required `SDD_PHASE=slice4` audit selects the full old-module and
  reusable-symbol denylists, exact six-file all-file schedule package set, and
  every `ScheduleSubstitution.*` variant is absent; the local-only owner audit and all
  declaration/export/path audits pass before completion approval.
- Feature Exit: repeat the all-`src` audit from a clean feature-tip snapshot;
  all denylist checks are empty, only the explicit comparison/application
  allowlist matches remain at their owners, no facade forwarder or old path
  exists, and no `AjsDocumentIndex` was introduced. Repeat the path-scoped
  `SemanticDiffScheduleRun` retirement audit and the all-module structural
  export audit and the path-resolved schedule-package dependency audit from
  the clean tip. Any unexpected match is a Finding/NG or a Replanning trigger,
  not an advisory cleanup.
  The clean-tip rerun uses `SDD_PHASE=feature-exit`, which selects the same
  full denylists and exact six-file schedule package set, and repeats the
  local-only owner/path/export audit.

## Implementation Slices

<!-- markdownlint-disable MD024 -->

### Slice 1: Establish schedule date and rule ownership

- Status: Implemented; independent implementation review Round 2 `Ready` with
  no Findings; Slice 1 Completion Approval `Approved`; pending exact
  completion commit
- Scope: create `src/domain/schedule/ScheduleDate.ts` and
  `src/domain/schedule/ScheduleRule.ts`; move the existing normalized schedule
  date token interpretation, Gregorian date helpers, and rule-prefixed value
  parsing without semantic change; update exactly the consumers in the closed
  Slice 1 edit manifest; delete
  `src/domain/models/parameters/scheduleDateInterpreter.ts`,
  `src/domain/models/parameters/scheduleRuleHelpers.ts`, and
  `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`.
- User / Domain Value: diagnostics, Unit List, and schedule evaluation name and
  consume the same domain-owned schedule date/rule meaning before the larger
  pipeline moves.
- Cohesive Change Group: the three old source files, two new source files,
  the exact import consumers listed in the closed edit manifest below, and
  the one direct helper test listed there. No other consumer or test path is
  in this slice.
- Acceptance:
  - current date token, parsed rule, start-condition monitoring, Gregorian,
    UTC conversion, formatting, and default-rule behavior is preserved;
  - diagnostics and Unit List import the schedule package directly;
  - `resolveScheduleRuleNumber` remains only as an unexported helper inside
    `ScheduleRule.ts`; no consumer or alias creates a new rule-number API;
  - no production import references the three deleted module paths;
  - canonical date/period deduplication is not attempted; the Semantic Diff
    facade copy remains for F2/F3.
- Validation: run the schedule-rule/date, diagnostics, Unit List, Semantic Diff
  schedule, and architecture suites through the compiled desktop tests. The
  repository exposes no suite-filter command, so execute the exact full
  desktop runner `rtk pnpm run test:prepare:desktop` followed by
  `rtk pnpm run test:desktop:run`, and record the named suites' pass results
  from that runner output against `M_1(test)`, the editable-plus-validation
  union defined in the shared protocol. Also run
  `rtk pnpm run test:compile`, then the final `rtk pnpm run build`; after that
  run only `rtk pnpm run test:web`. Its automatic
  `pretest:web -> test:prepare:web` output is recorded as nested preparation
  evidence, separately from the web-run output. Then run the phase-1
  import plus exact ScheduleDate and ScheduleRule export/local-boundary audit,
  the required `SDD_PHASE=slice1` retirement/file-set audit, the same-phase
  local-only owner/path/export audit, and the shared qlty protocol. Web validation is
  required because the moved host-neutral domain code is bundled for the web
  target, even though no webview source is edited.
- Production Readiness: preserve regexes, defaults, raw-value fallback,
  Gregorian/leap-year behavior, browser-safe `Date` use, and large Unit List
  behavior; add no host time, locale, I/O, or Node built-in.
- Approval Boundary (closed edit manifest): additions:
  `src/domain/schedule/ScheduleDate.ts`,
  `src/domain/schedule/ScheduleRule.ts`; deletions:
  `src/domain/models/parameters/scheduleDateInterpreter.ts`,
  `src/domain/models/parameters/scheduleRuleHelpers.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`; edits:
  `src/application/unit-list/unitListScheduleValueHelpers.ts`,
  `src/domain/services/diagnostics/ScheduleDateRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCalendarSelectors.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleOperationalMonth.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRelativeDate.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`, and
  `src/test/suite/scheduleRuleHelpers.test.ts`. Before edits, verify that this
  is exactly the union returned by
  `rg -l 'scheduleDateInterpreter|scheduleRuleHelpers|semanticDiffScheduleDateMath' src --glob '*.ts' --glob '*.tsx'`, after removing the three deleted paths and adding the two new paths. Parser, DTO, presentation, bootstrap, package/configuration, README, and CHANGELOG are excluded; validation-only paths are listed next and are not editable. The pre-edit local-boundary audit must also confirm that `resolveScheduleRuleNumber` has no consumer outside the old helper and will be unexported in `ScheduleRule.ts`.
- Validation-only closed set: `src/application/unit-list/unitListViewHelpers.ts`,
  `src/test/suite/unitListViewHelpers.test.ts`,
  `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Dependencies: approved/committed plan and dedicated feature branch.
- Risks: a missed import or regex/default change can alter diagnostics, Unit
  List fields, or later schedule evaluation.
- Out of Scope: canonical date/period parsing, `SchedulePeriod`, validation
  changes, or document-index deduplication.

#### Solution Shape Evidence

- `ScheduleDate` (`src/domain/schedule/ScheduleDate.ts`, domain): semantic
  owner of normalized JP1/AJS `sd` token shapes and existing schedule
  Gregorian helpers. Public contract: `ScheduleDateWeekday`,
  `ScheduleDateDay`, `ScheduleDateInterpretation`,
  `interpretScheduleDateValue`, and currently consumed Gregorian/UTC helpers.
  It earns one boundary because diagnostics, Unit List, calendar resolution,
  and projection share the meaning. It is not a canonical period abstraction.
- `ScheduleRule` (`src/domain/schedule/ScheduleRule.ts`, domain): semantic
  owner of rule-prefixed schedule parameter parsing and the existing effective
  start-condition monitoring pair. Its exact public contract is the parsed
  value types/functions listed in the Shared Implementation Rules; the
  default-rule-number resolver is local because the repository has no external
  consumer. It earns a boundary because Unit List and schedule interpretation
  consume the same rules.
- Dependency direction: application Unit List and domain diagnostics/Semantic
  Diff depend inward on `domain/schedule`; these modules depend on no outer
  layer, framework, or host API.
- Tests: `scheduleRuleHelpers.test.ts`,
  `evaluateScheduleDiagnosticViolations.test.ts`,
  `unitListViewHelpers.test.ts`, `semanticDiffScheduleRules.test.ts`, and
  `semanticDiffScheduleCalendar.test.ts`.
- Framework/custom decision: plain TypeScript and built-in `Date` remain
  sufficient. No port, adapter, factory, custom framework, or lifecycle owner.

#### Slice 1 Implementation Evidence

- Implementation status: complete within the approved Slice 1 manifest; no
  commit was created. The exact changed paths are the two additions, three
  deletions, the listed production import consumers, and
  `src/test/suite/scheduleRuleHelpers.test.ts`.
- Ownership result: `ScheduleDate.ts` owns the existing date-token
  interpretation and Gregorian/UTC helpers; `ScheduleRule.ts` owns the
  existing rule-prefixed parsers and monitoring-pair helper. The only new
  local boundary is the non-exported `resolveScheduleRuleNumber`; no
  forwarding module, barrel, period primitive, or F2 date/index work was
  added.
- Acceptance evidence: old-module/import scan returned no
  `scheduleDateInterpreter`, `scheduleRuleHelpers`, or
  `semanticDiffScheduleDateMath` occurrence under `src`; the phase-1
  retirement/file-set audit found exactly `ScheduleDate.ts` and
  `ScheduleRule.ts`; exact compiler export audit passed; the local-only
  `resolveScheduleRuleNumber` path/export audit passed; the schedule package
  host/Node import audit passed; the retired owner-stem check is scoped to
  production source so the allowed `scheduleRuleHelpers.test.ts` validation
  path is not treated as a production owner; `git diff --check` passed.
- Desktop validation: `rtk pnpm run test:prepare:desktop` passed (desktop
  webpack plus test compilation), followed by `rtk pnpm run
test:desktop:run`, exit 0. The full runner emits no per-suite summary; its
  successful exit covers the Slice 1 `M_1(test)` suites:
  `scheduleRuleHelpers.test.ts`, `unitListViewHelpers.test.ts`,
  `evaluateScheduleDiagnosticViolations.test.ts`,
  `semanticDiffScheduleRules.test.ts`,
  `semanticDiffScheduleCalendar.test.ts`,
  `semanticDiffSchedule.test.ts`, and
  `architectureDependencyRules.test.ts`.
- Build/web validation: `rtk pnpm run build` passed with only the existing
  webpack asset-size recommendations. After that final build, the only web
  command was `rtk pnpm run test:web`; its nested `pretest:web ->
test:prepare:web` preparation (web webpack, test compilation, web-test
  bundle) passed and the escalated web runner exited 0 with WEB-7 through
  WEB-10 passed. The runner emitted non-fatal EPIPE/premature-stream-close
  cleanup messages after the assertions; the sandboxed attempts before the
  escalated run were not used as pass evidence.
- qlty evidence: identical verified `.qlty/qlty.toml`, toolchain, and
  all-source scope were used in disposable snapshots
  `sdd-slice1-qlty-baseline-r1.k30I69` (plan-gate `0a28b73`) and
  `sdd-slice1-qlty-final-r1c` (post-formatting Slice 1). Severity
  ordering is `fmt` gate > `high` > `medium` > `low` > `note`; higher
  severity is worse. For metric findings, higher measured values are worse.
  The non-mutating `rtk pnpm exec qlty check -a --no-fix
--no-upgrade-check` comparator was:
  `MD041@.github/ISSUE_TEMPLATE/pull_request_template.md:1:0`, medium to
  medium, measured finding count 1 to 1, unchanged existing/out-of-scope;
  `@typescript-eslint/no-unused-vars@src/application/unit-list/buildUnitListRemainingGroups.ts:6:6`,
  medium to medium, count 1 to 1, unchanged existing/out-of-scope; and
  `eslint@src/test/suite/index.ts:1:1`, low to low, count 1 to 1,
  unchanged existing/out-of-scope. The final check had no new fmt finding.
  The non-mutating `rtk pnpm exec qlty smells -a --no-snippets
--no-upgrade-check` comparator has no severity field, so its unchanged
  severity is recorded as `smell`; each metric direction is higher-worse:
  `formatScheduleDateDayValue` returns 4/4 and complexity 8/8,
  `scheduleDateType` returns 7/7, `scheduleDateYearMonth` complexity 5/5,
  and `parseSd` complexity 6/6; the moved
  `interpretScheduleDateDay` returns 9/9 and complexity 24/24, and
  `interpretScheduleDateValue` complexity 10/10. The latter two identities
  map from retired `scheduleDateInterpreter.ts` to `ScheduleDate.ts`; this is
  a path relocation, not an adverse movement. Unchanged unrelated findings
  remain out of scope. The final-snapshot-only `rtk pnpm run qlty` passed
  with no analyzed-content change after the approved documentation formatting
  was synchronized; qlty caches/results/logs remained snapshot-local.
- Compatibility and documentation: no `engines.vscode`, DTO/schema,
  command, parser, presentation, bootstrap, README, user documentation, or
  CHANGELOG change. The moved domain modules contain no Node, VS Code, host,
  locale, I/O, or telemetry dependency; desktop/web behavior remains
  covered by the validation above.
- Implementation feedback: the closed manifest was sufficient for an atomic
  ownership move. Keeping date interpretation and date math together in
  `ScheduleDate.ts` avoided a temporary compatibility owner while preserving
  the existing Semantic Diff period copy for F2. No new dependency or scope
  decision was discovered.
- Unresolved risks: no Slice 1-specific validation risk remains. Independent
  implementation review Round 2 returned `Ready` with no Findings after the
  production-only retirement-stem audit and final disposable-snapshot qlty
  evidence were remediated. Slice 2 and Feature Closure remain separately
  gated.
- Recommended route: `Main -> approval-committer` for the exact Slice 1
  completion commit. Keep Slice 2 inactive until that commit is created.

### Slice 2: Move normalized schedule interpretation

- Status: Human-approved; pending Slice 1 completion, review, and commit
- Scope: create `src/domain/schedule/ScheduleInterpretation.ts`; consolidate
  interpretation contracts, evidence construction, date/start-time rule
  classification, unsupported rule association, and unit interpretation from
  `semanticDiffScheduleInterpreter.ts`,
  `semanticDiffScheduleRuleInterpreter.ts`, and
  `semanticDiffScheduleRuleEvidence.ts`; delete exactly those three files in
  the same slice, with all other edits closed by the Slice 2 manifest.
- User / Domain Value: normalized interpretation and evidence become reusable
  schedule meaning rather than a Semantic Diff processing stage.
- Cohesive Change Group: one public interpretation module with private
  co-located rule/evidence helpers, the exact import/type edits listed in the
  closed manifest below, and the named interpretation regression tests. No
  other consumer or test path is in this slice.
- Acceptance:
  - `ScheduleStatus`, `ScheduleUnsupportedReason`, `ScheduleEvidence`,
    `ScheduleRuleInterpretation`, `ScheduleInterpretation`, and
    `interpretSchedule` are owned only by `domain/schedule`;
  - rule-zero `ud`, invalid/unpaired start time, unsupported parameters,
    evidence IDs, and raw parameter arrays are unchanged;
  - Semantic Diff does not re-export reusable interpretation types; the
    existing `interpretSchedule` function forwarder remains only as the
    temporary Slice 2/3 compile bridge and is removed in Slice 4;
  - until Slice 4, the facade retains exactly the comparison compatibility
    exports `compareScheduleRuns`, `SemanticDiffScheduleSide`,
    `SemanticDiffScheduleRunDecision`, `SemanticDiffScheduleMatchedUnit`,
    `SemanticDiffScheduleUnsupportedDecision`, `SemanticDiffScheduleEvidenceKind`,
    `SemanticDiffScheduleSideEvaluation`, `SemanticDiffSchedulePairEvaluation`,
    `SemanticDiffScheduleEvaluation`, `EvaluateSemanticDiffScheduleInput`, and
    `evaluateSemanticDiffSchedule`; these are not new Slice 2 owners;
  - old interpretation files/imports are absent.
- Validation: run schedule interpretation, Semantic Diff schedule,
  diagnostics, Unit List, and `src/test/suite/architectureDependencyRules.test.ts`.
  The repository exposes no
  suite-filter command, so execute the exact full desktop runner
  `rtk pnpm run test:prepare:desktop` followed by
  `rtk pnpm run test:desktop:run`, and record the named suites' pass results
  from that runner output against `M_2(test)`, the editable-plus-validation
  union defined in the shared protocol. Also run
  `rtk pnpm run test:compile`, then the final `rtk pnpm run build`; after that
  run only `rtk pnpm run test:web`. Its automatic
  `pretest:web -> test:prepare:web` output is recorded as nested preparation
  evidence, separately from the web-run output. Then run the phase-2
  import/export and positive phase-specific facade export audit, the required
  `SDD_PHASE=slice2` retirement/file-set audit, and the same-phase local-only
  owner/path/export audit. Run the shared qlty protocol. The audit
  must prove the exact interim facade set above and reject
  direct/type-only/aliased/indirect/wildcard forwards outside its two named
  reusable bridges. Web validation remains required because the schedule
  interpretation module is
  shared by both desktop and web bundles.
- Production Readiness: no additional unit scan or parameter parse; malformed
  and unsupported inputs remain explicit and non-throwing; desktop/web
  neutrality and JP1/AJS3 v13 outcomes are unchanged.
- Approval Boundary (closed edit manifest): addition:
  `src/domain/schedule/ScheduleInterpretation.ts`; deletions:
  `src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts`;
  edits:
  `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`, and
  `src/test/suite/semanticDiffSchedule.test.ts`. Before edits, verify that
  the listed edit set is exactly the old interpretation-file import/reference
  closure from `rg -l 'semanticDiffScheduleInterpreter|semanticDiffScheduleRuleInterpreter|semanticDiffScheduleRuleEvidence' src/domain src/test --glob '*.ts' --glob '*.tsx'`, plus the explicitly listed types/consumers whose names change. Validation-only paths are not editable.
- Validation-only closed set: `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/scheduleRuleHelpers.test.ts`,
  `src/test/suite/unitListViewHelpers.test.ts`,
  `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Dependencies: Slice 1 completion commit.
- Risks: helper order or type renaming can alter fallback classification or
  evidence selection.
- Out of Scope: calendar, candidates, projection, comparison policy, or new
  supported schedule forms.

#### Solution Shape Evidence

- `ScheduleInterpretation`
  (`src/domain/schedule/ScheduleInterpretation.ts`, domain): sole owner of
  status/reason/evidence, per-rule interpretation, whole-unit interpretation,
  and `interpretSchedule`. The old rule interpreter and evidence builder
  become ordinary co-located helpers because they have no independent consumer
  or lifecycle; no three-step exported pipeline remains.
- Public dependency: consumes `AjsUnit`/`AjsParameter`, `ScheduleDate`, and
  `ScheduleRule`; projection and Semantic Diff consume its result. It has no
  period or before/after concept.
- Tests: direct assertions in `semanticDiffScheduleRules.test.ts` and
  integration scenarios in `semanticDiffSchedule.test.ts` preserve statuses,
  reasons, IDs, evidence, and rule association.
- Framework/custom decision: pure TypeScript classification is sufficient. No
  interpreter interface, strategy registry, port, adapter, or factory.

### Slice 3: Move calendar context and candidate resolution

- Status: Human-approved; pending Slice 2 completion, review, and commit
- Scope: create `src/domain/schedule/ScheduleCalendar.ts` and
  `src/domain/schedule/ScheduleCandidateResolver.ts`; consolidate current
  calendar context/types/index/selectors/operational-month/relative-date files
  into the calendar concept and candidate types/classified-day/date/operational
  candidate files into candidate resolution; update projection, facade, and
  tests; delete all ten superseded `semanticDiffScheduleCalendar*`,
  `semanticDiffScheduleOperational*`, `semanticDiffScheduleRelativeDate.ts`,
  `semanticDiffScheduleCandidateTypes.ts`,
  `semanticDiffScheduleClassifiedDayCandidates.ts`, and
  `semanticDiffScheduleDateCandidates.ts` files.
- User / Domain Value: definition-backed calendar meaning and bounded candidate
  resolution become reusable schedule-domain capabilities.
- Cohesive Change Group: source selection/classification, schedule-specific
  hierarchy lookup, operational-month rules, relative-date context, and
  candidate generation share calendar evidence and failure distinctions.
  Lower-level processing-step exports become local helpers. The exact edit
  closure, including the same-index/non-mutation regression hunk, is listed
  below; no open-ended consumer/test set is implied.
- Acceptance:
  - public contracts use `Schedule*` names and preserve supported, invalid,
    and missing-context evidence;
  - exact-date precedence, duplicate idempotence, conflict handling,
    operational-month boundaries, omitted context, and bounded candidates are
    unchanged;
  - the schedule context index remains an implementation detail; no general
    `AjsDocumentIndex` is introduced;
  - the explicitly supplied context index is logically read-only after
    construction: repeated resolution through that same value leaves its
    `byId`, `byPath`, and `duplicatePath` state unchanged. This test does not
    observe construction count or claim that no other index was created;
  - `ScheduleCalendarContextInput` and `createScheduleCalendarContext` remain
    local, non-exported construction helpers; the retired
    `SemanticDiffScheduleContextInput` name is absent and no alias recreates
    either public boundary;
  - no deleted path remains imported or re-exported.
- Validation: run `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/scheduleImpactCalendarProjection.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`. The repository
  exposes no suite-filter command, so execute the exact full desktop runner
  `rtk pnpm run test:prepare:desktop` followed by
  `rtk pnpm run test:desktop:run`, and record the named suites' pass results
  from that runner output against `M_3(test)`, the editable-plus-validation
  union defined in the shared protocol. Also run
  `rtk pnpm run test:compile`, then the final `rtk pnpm run build`; after that
  run only `rtk pnpm run test:web`. Its automatic
  `pretest:web -> test:prepare:web` output is recorded as nested preparation
  evidence, separately from the web-run output. Then run the phase-3
  import/export plus exact ScheduleCalendar and ScheduleCandidateResolver
  export/local-boundary audit, the required `SDD_PHASE=slice3` retirement/file-set
  audit, the same-phase local-only owner/path/export audit, and the phase-specific
  facade export/forwarding and
  phase-specific denylist assertions, and the shared qlty protocol. Web
  validation is required because calendar and candidate resolution are shared
  host-neutral code used by the web bundle.
- Production Readiness: preserve caller-controlled context-index lifecycle,
  non-mutating traversal, cycle/duplicate detection, bounded iteration,
  evidence, and no external calendar, clock, or locale. Compare large-period
  candidate counts/order to baseline; do not claim an unobservable index
  construction count.
- Approval Boundary (closed edit manifest): additions:
  `src/domain/schedule/ScheduleCalendar.ts`,
  `src/domain/schedule/ScheduleCandidateResolver.ts`; deletions:
  `src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCalendarContext.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCalendarIndex.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCalendarSelectors.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleOperationalMonth.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRelativeDate.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCandidateTypes.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts`;
  edits:
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`, and
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`. In that test, the
  allowed hunks are exactly its import declaration plus one new test named
  `reuses one explicitly supplied context index across repeated resolution`.
  The import hunk must migrate exactly
  `classifyScheduleCalendarDay`, `createScheduleCalendarContextIndex`,
  `resolveOperationalMonth`, and `resolveScheduleCalendarContext` to
  `../../domain/schedule/ScheduleCalendar`; keep the
  `evaluateSemanticDiffSchedule`, `interpretSchedule`, and
  `projectScheduleRuns` import from `semanticDiffScheduleRules` unchanged
  until Slice 4. The new test hunk must create one `document` and one
  `createScheduleCalendarContextIndex(document)` value, snapshot normalized
  `[key, unit.absolutePath]` entries from both `byId` and `byPath` plus
  `duplicatePath`, call `resolveScheduleCalendarContext` twice for the same
  logical unit with that same index, and assert deep equality of all three
  snapshots after both calls. It must also assert that both resolutions return
  the expected status, proving same-value reuse and non-mutation in that call
  sequence without adding an index counter or a new test helper/module. No
  other test body, call site, or import
  may change in Slice 3. Before edits, verify the import/reference closure with
  `rg -l 'semanticDiffScheduleCalendarTypes|semanticDiffScheduleCalendarContext|semanticDiffScheduleCalendarIndex|semanticDiffScheduleCalendarSelectors|semanticDiffScheduleOperationalMonth|semanticDiffScheduleRelativeDate|semanticDiffScheduleCandidateTypes|semanticDiffScheduleClassifiedDayCandidates|semanticDiffScheduleDateCandidates|semanticDiffScheduleOperationalCandidates' src/domain/services/semantic-diff src/test --glob '*.ts' --glob '*.tsx'`; only the listed paths may be edited, deleted, or added. The pre-edit local-boundary audit must also confirm that `SemanticDiffScheduleContextInput` and `createScheduleCalendarContext` have no consumer outside the calendar implementation and that their replacements are local in `ScheduleCalendar.ts`. No application DTO or presentation edit.
- Validation-only closed set: `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/scheduleImpactCalendarProjection.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Dependencies: Slice 2 completion commit.
- Risks: selector precedence, scan count, hierarchy ambiguity, and the
  distinction between no candidate and missing/invalid context.
- Out of Scope: generic document index, canonical date/period implementation,
  Application projection, or Calendar webview.

#### Solution Shape Evidence

- `ScheduleCalendar` (`src/domain/schedule/ScheduleCalendar.ts`, domain):
  owns definition-backed source selection, entry classification, operational
  month/base context, relative-date requirements, and schedule-specific
  hierarchy lookup. Its exact public names are
  `ScheduleCalendarContextStatus`, `ScheduleCalendarBaseDay`,
  `ScheduleCalendarDayClassification`, `ScheduleCalendarSelector`,
  `ScheduleCalendarEntry`, `ScheduleCalendarGroup`,
  `ScheduleCalendarSelection`, `ScheduleCalendarContext`,
  `ScheduleCalendarContextIndex`, `ScheduleCalendarDayResult`,
  `ScheduleOperationalMonth`, `createScheduleCalendarContextIndex`,
  `classifyScheduleCalendarDay`, `resolveScheduleCalendarContext`,
  `isWithinOperationalMonth`, `operationalMonthDate`,
  `operationalMonthLength`, `resolveOperationalMonth`,
  `isFullyQualifiedRelativeScheduleDate`,
  `isSyntacticallyInvalidRelativeScheduleDate`, and
  `relativeScheduleDateRequiresContext`. `ScheduleCalendarContextInput` and
  `createScheduleCalendarContext` are local construction helpers, not public
  contracts. These names form one JP1/AJS calendar policy characterized
  independently by calendar tests.
- `ScheduleCandidateResolver`
  (`src/domain/schedule/ScheduleCandidateResolver.ts`, domain): owns bounded
  conversion of interpreted dates plus calendar context into candidate dates
  and explicit failures. Its public-within-package contract is
  `ScheduleDateCandidateResult` and `resolveScheduleDateCandidates`; the
  validated Date-range helper, classified/operational helpers, and candidate
  constructors become local. It earns separation because calendar evidence
  exists independently of a requested projection period, while candidates are
  period-bounded.
- The context index retains exactly the current schedule shape/traversal until
  F2 decides a generic index contract; it is exported only as the narrow
  `ScheduleCalendarContextIndex`/`createScheduleCalendarContextIndex` entrypoint
  required by the current Semantic Diff side-collection call and the direct
  calendar suite. `ScheduleCalendar` owns construction and traversal;
  callers decide when to construct an index and which resolutions receive the
  same value. The index is logically read-only after construction: no consumer
  may mutate its maps, arrays, or duplicate flag, but no structural readonly
  type or deep-freeze migration is planned. The repeated-traversal test proves
  only same-value reuse in the test call sequence plus non-mutation; it does
  not observe construction count or exclude other index creation. No other
  consumer may import it. `ancestorsOf` and all traversal helpers remain local
  to `ScheduleCalendar.ts`.
- Dependency direction: these modules consume normalized domain models and
  Slice 1/2 schedule contracts; projection depends on them; Semantic Diff may
  call only the exported calendar entry points. The final import audit must
  match exactly the allowlist in the Current Call Graph section.
- Tests: `semanticDiffScheduleCalendar.test.ts` characterizes index/context,
  operational month, classifications, relative dates, conflicts, substitution
  calendar inputs, and large-period bounds. Its exact Slice 3 edit hunk also
  creates one explicitly supplied index, snapshots
  `byId`/`byPath`/`duplicatePath`, performs two resolutions through that same
  value, and asserts unchanged snapshots plus both expected statuses; this is
  same-value/non-mutation evidence, not construction-count evidence or a
  structural `Readonly` claim.
- Framework/custom decision: maps, sets, arrays, and built-in UTC dates remain
  sufficient. No external calendar, cache, port, adapter, or index framework.

### Slice 4: Move projection and seal the comparison boundary

- Status: Human-approved; pending Slice 3 completion, review, and commit
- Scope: create `src/domain/schedule/ScheduleProjection.ts`; consolidate
  projection, rule projection, substitution analysis/application, projection
  contracts, completeness, and run facts into that module's public contracts
  and private helpers; delete
  `semanticDiffScheduleProjector.ts`,
  `semanticDiffScheduleRuleProjection.ts`,
  `semanticDiffScheduleSubstitutionAnalysis.ts`,
  `semanticDiffScheduleSubstitutionProjection.ts`, and
  `semanticDiffScheduleTypes.ts`; rename
  `semanticDiffScheduleDiffer.ts` to
  `semanticDiffScheduleComparison.ts`; update
  `semanticDiffScheduleRules.ts` to import schedule contracts directly and
  export only comparison contracts/functions; remove the domain-model
  `SemanticDiffScheduleRun` after every domain reference in the Slice 4 edit
  manifest uses `ScheduleRun`. Update
  `src/test/suite/semanticDiffScheduleCalendar.test.ts` in this same slice:
  its only allowed hunk is the import declaration that changes exactly
  `interpretSchedule` to
  `../../domain/schedule/ScheduleInterpretation` and
  `projectScheduleRuns` to `../../domain/schedule/ScheduleProjection`; keep
  the already-migrated `ScheduleCalendar` import and
  `evaluateSemanticDiffSchedule` import from the comparison facade unchanged.
  `semanticDiffScheduleRules.test.ts` has one additional import/reference hunk
  that moves its existing `compareScheduleRuns` import to
  `../../domain/services/semantic-diff/semanticDiffScheduleComparison`, moves
  `interpretSchedule` and `projectScheduleRuns` to their direct schedule
  owners, and replaces its `SemanticDiffScheduleRun` type import/reference
  with `ScheduleRun` from `../../domain/schedule/ScheduleProjection`; its
  existing comparison assertions are the direct-owner test. The facade import
  for evaluation contracts remains intact. `compareScheduleDiff.ts`
  has the corresponding type-import hunk for
  `SemanticDiffScheduleRunDecision`. The facade's `SemanticDiffScheduleSide`
  re-export is removed when no consumer remains, as proven by the
  owner-inventory assertion; the facade may still import that type internally.
  It also permits one named period-boundary test hunk,
  `keeps comparison invalid periods separate from projection preconditions`,
  containing the facade `invalid-period` assertion and the direct malformed
  projection-precondition assertion. `semanticDiffSchedule.test.ts` permits
  one named `ScheduleRun`-to-DTO field-mapping assertion hunk. No other test
  body, call site, or import may change in Slice 4. The final
  audit must prove that this test and every other test have no old
  `semanticDiffScheduleCalendarContext`/interpreter/projector import or
  reusable Semantic Diff re-export.
  Keep canonical period parsing/validation deferred to F2: the Semantic Diff
  facade retains the current comparison-level date-shape/order guard and is
  the only owner that returns `SemanticDiffScheduleEvaluation` with
  `kind: "invalid-period"`. The schedule package must not introduce
  `SchedulePeriod` or import any Semantic Diff period type. Its private
  projection precondition only defensively rejects malformed direct
  `ScheduleProjectionPeriod` input with the existing projection-level
  invalid/empty result; it does not duplicate the facade decision, expose a
  validator, or claim canonical period ownership.
- User / Domain Value: the reusable interpretation-to-run pipeline has one
  schedule owner; remaining Semantic Diff code describes before/after policy.
- Cohesive Change Group: projection input/output, bounded substitution,
  completeness/status aggregation, run facts, facade imports, and comparison
  typing migrate atomically so no duplicate run contract or forwarding layer
  remains. The calendar integration test is part of this migration because its
  imports must follow the final schedule-owned Calendar/Interpretation/
  Projection owners; it is not validation-only in Slice 4.
- Acceptance:
  - `ScheduleProjection`, `ScheduleProjectionInput`, `ScheduleRun`, and
    `projectScheduleRuns` are schedule-owned and contain no before/after
    decision concept;
  - substitution analysis/application helpers are private in
    `ScheduleProjection.ts`; no `ScheduleSubstitution.ts` module, export, or
    approval path is introduced;
  - private substitution helpers preserve rule association, `be`/`af`/
    `ca`/`no`, default/maximum `shd`, and 31-day lookaround;
  - `semanticDiffScheduleRules.ts` retains facade orchestration but has no
    reusable schedule re-export;
  - `semanticDiffScheduleComparison.ts` owns only run comparison decisions;
  - `compareScheduleRuns` and `SemanticDiffScheduleRunDecision` are retained
    as comparison-module exports and no longer forwarded by the facade;
    `SemanticDiffScheduleSide` is likewise comparison-owned and retained only
    at its direct owner, with any current consumer moved to that owner in the
    same manifest;
  - the facade contains no direct or aliased type re-export of
    `SemanticDiffScheduleSide` or `SemanticDiffScheduleRunDecision`, and the
    final audit distinguishes their comparison-owner declarations from facade
    internal references;
  - old reusable modules and forwarding files are absent; DTO/schema is
    unchanged.
- Exact schedule-owned projection-period contract:
  `export type ScheduleProjectionPeriod = Readonly<{ from: string; to: string }>`
  in `ScheduleProjection.ts`, and
  the following exact input contract in the same module:

  ```ts
  export type ScheduleProjectionInput = Readonly<{
    interpretation: ScheduleInterpretation;
    period: ScheduleProjectionPeriod;
    calendarContext?: ScheduleCalendarContext;
  }>;
  ```

  `projectScheduleRuns` accepts exactly this input and no compatibility
  overload; it does not accept `SemanticDiffComparisonPeriod`.
  `semanticDiffScheduleRules.ts` owns the explicit mapping
  `toScheduleProjectionPeriod(period: SemanticDiffComparisonPeriod): ScheduleProjectionPeriod`
  before calling the schedule package. This is a translation, not a type
  alias, and the schedule package has no import path to
  `domain/models/semantic-diff` or `domain/services/semantic-diff`.
  The facade's comparison-level `from < to`/UTC date-shape guard remains the
  source of the `invalid-period` evaluation decision. `ScheduleProjection.ts`
  retains only a local defensive check of the mapped contract for direct
  callers; it returns the existing projection-level invalid/empty result and
  is not a canonical parser or reusable period validator. Canonical
  parsing/period validation and a reusable period primitive remain F2.

- Application translation contract: `compareScheduleDiff.ts` adds a private
  `toSemanticDiffScheduleRunDto(run: ScheduleRun): SemanticDiffScheduleRun`
  that copies `unitPath`, `unitName`, `rule`, `date`, and `time` explicitly.
  `toChangedTimeRunChange` and `toSingleRunChange` must use this mapper for
  every `before`/`after` DTO value. The application-owned
  `SemanticDiffScheduleRun` in `semanticDiffDto.ts` is unchanged; the domain
  `ScheduleRun` is not re-exported through the facade or DTO. Evaluation may
  retain domain `ScheduleRun` facts for the internal schedule-impact adapter,
  but no serialized/application DTO receives a structural domain assignment.
- Validation: run all schedule, schedule-impact, Unit List, diagnostics, and
  architecture suites. The repository exposes no suite-filter command, so
  execute the exact full desktop runner `rtk pnpm run test:prepare:desktop`
  followed by `rtk pnpm run test:desktop:run`, and record the named suites'
  pass results from that runner output against `M_4(test)`, the
  editable-plus-validation union defined in the shared protocol.
  Also run `rtk pnpm run test:compile`, then the final `rtk pnpm run build`;
  after that run only `rtk pnpm run test:web`. Its automatic
  `pretest:web -> test:prepare:web` output is recorded as nested preparation
  evidence, separately from the web-run output. Then run the
  required `SDD_PHASE=slice4` retirement/file-set audit, the same-phase
  local-only owner/path/export audit, and the phase-4 exact export-set audit for
  ScheduleProjection, semanticDiffScheduleComparison, and the final facade,
  including the declaration/reference owner assertion
  and Node-built-in import audit; run the shared qlty protocol; confirm
  serialized Semantic Diff/schedule-impact expectations are unchanged. Add
  direct assertions in
  `semanticDiffScheduleRules.test.ts` for facade period mapping, the preserved
  `invalid-period` decision, and direct comparison-owner import/removal; add a
  direct projection-precondition assertion for malformed
  `ScheduleProjectionPeriod` without treating it as a comparison decision.
  Add the schedule-package import audit there, and in
  `semanticDiffSchedule.test.ts` assert the explicit ScheduleRun-to-DTO output
  mapping.
  `semanticDiffScheduleCalendar.test.ts` must exercise the direct
  ScheduleCalendar/ScheduleInterpretation/ScheduleProjection imports after
  migration. `semanticDiffScheduleRules.test.ts` must assert both sides of
  the period boundary: an invalid `SemanticDiffComparisonPeriod` produces
  the unchanged facade `{ kind: "invalid-period", period }` result, while a
  direct malformed `ScheduleProjectionPeriod` produces only the projection's
  invalid/empty result and never a comparison decision. The path-resolved
  schedule-package dependency audit must pass for all ordinary, type-only,
  aliased, `export ... from`, `export *`, and `export type *` forms. Web validation is
  required because projection and comparison
  facts feed both desktop and web outputs.
- Production Readiness: compare run count/order, zero-runs, completeness/status
  distinctions, decisions, evidence, substitution bounds, and large-period
  behavior. Verify desktop/web bundles. Observable drift requires Replanning,
  not README/CHANGELOG edits inside this slice.
- Approval Boundary (closed edit manifest): additions:
  `src/domain/schedule/ScheduleProjection.ts`; rename:
  `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts` to
  `src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts`;
  deletions:
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`; edits:
  `src/domain/models/semantic-diff/SemanticDiff.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/application/semantic-diff/compareScheduleDiff.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`, and
  `src/test/suite/semanticDiffSchedule.test.ts`, and
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`. The application DTO file
  `src/application/semantic-diff/semanticDiffDto.ts` is validation-only and
  must remain unchanged. Before edits, verify that the old-module reference
  closure is exactly the listed domain/facade/test paths with
  `rg -l 'semanticDiffScheduleProjector|semanticDiffScheduleRuleProjection|semanticDiffScheduleSubstitutionAnalysis|semanticDiffScheduleSubstitutionProjection|semanticDiffScheduleTypes|semanticDiffScheduleDiffer' src/domain src/test/suite --glob '*.ts' --glob '*.tsx'`, plus the explicitly listed `SemanticDiff.ts`, `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and application mapper. Separate pre-edit checks must report every `SemanticDiffScheduleRun` domain reference and every comparison type re-export; DTO-name matches under application paths are validation-only and do not authorize edits. Paths not listed above are excluded from edits.
- Validation-only closed set: `src/application/semantic-diff/semanticDiffDto.ts`,
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`,
  `src/test/suite/unitListViewHelpers.test.ts`,
  `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`,
  `src/test/suite/scheduleRuleHelpers.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffContracts.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`,
  `src/test/suite/scheduleImpactCalendarProjection.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Dependencies: Slice 3 completion commit.
- Risks: completeness, ordering, evidence, substitution, structural type
  compatibility, decision pairing, or accidental duplication of period
  ownership can drift.
- Out of Scope: simplifying the facade, moving `collectScheduleUnit`,
  `collectScheduleSide`, canonical period validation, pair evaluation, or
  user-facing decision/limitation policy; those remain F3 after F2. The
  required `ScheduleRun`-to-DTO field mapper is in scope only to preserve the
  unchanged application DTO boundary.

#### Solution Shape Evidence

- `ScheduleProjection` (`src/domain/schedule/ScheduleProjection.ts`, domain):
  owns projection input, reusable run facts, completeness/status aggregation,
  and `projectScheduleRuns`. Its exact public period input is
  `ScheduleProjectionPeriod = Readonly<{ from: string; to: string }>` and its
  exact input contract is:

  ```ts
  export type ScheduleProjectionInput = Readonly<{
    interpretation: ScheduleInterpretation;
    period: ScheduleProjectionPeriod;
    calendarContext?: ScheduleCalendarContext;
  }>;
  ```

  The Semantic Diff facade remains the comparison-level owner of the private
  UTC-shape/order guard and the `invalid-period` evaluation decision. It maps
  only a guard-approved `SemanticDiffComparisonPeriod` explicitly before
  invocation. `ScheduleProjection` keeps a separate private defensive
  precondition for malformed direct `ScheduleProjectionPeriod` callers; it
  returns the existing projection-level invalid/empty result, is not exported,
  and is not a canonical parser or reusable validator. F2 owns canonical
  parsing/validation and any reusable period primitive. `ScheduleProjection`
  depends on schedule interpretation, calendar, candidates, and substitution,
  never application DTOs or comparison policy.

- Substitution analysis/application remains private inside
  `ScheduleProjection.ts`: it owns rule association, `sh`/`shd` outcomes,
  calendar-backed adjustment, and bounded lookaround. The invariant is
  material, but the repository has no independent consumer, lifecycle, or
  public contract for a substitution stage; a separate module would be an
  empty boundary rather than a useful abstraction.
- `ScheduleRun` (exported by `ScheduleProjection`): reusable calculated run
  fact. Semantic Diff consumes it; `compareScheduleDiff.ts` explicitly maps
  every field through `toSemanticDiffScheduleRunDto` into the unchanged
  application `SemanticDiffScheduleRun` DTO. No domain model or forwarding
  export remains.
- `SemanticDiffScheduleComparison`
  (`src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts`,
  domain): retained comparison-only owner of before/after pairing,
  canonical-path comparison, and added/removed/changed-time decisions.
- Retained `SemanticDiffComparisonPeriod` remains the domain Semantic Diff
  request contract in `src/domain/models/semantic-diff/SemanticDiff.ts`; the
  application DTO with the same name and shape remains application-owned and
  unchanged. Private `toScheduleProjectionPeriod` in
  `semanticDiffScheduleRules.ts` owns the one-way translation from the domain
  comparison period to `ScheduleProjectionPeriod`, is not exported, and is
  covered by direct period/invalid-period assertions and the import audit.
- `SemanticDiffScheduleRunDecision` remains comparison-owned but changes its
  `before`/`after` fields to `ScheduleRun`; retained
  `SemanticDiffScheduleSideEvaluation.runs` and the internal side-collection
  run arrays likewise use `ScheduleRun[]`. The application-owned
  `SemanticDiffScheduleRunChange` and `SemanticDiffScheduleComparison` remain
  unchanged DTO contracts; `compareScheduleDiff.ts` explicitly maps each
  `ScheduleRun` field before constructing them. These are separate ownership
  and translation contracts, not a domain DTO alias.
- `evaluateSemanticDiffSchedule` and its comparison evaluation types remain
  in `semanticDiffScheduleRules.ts`. F3 owns later facade simplification; this
  slice changes only ownership imports/types/re-exports.
- Dependency direction: Semantic Diff depends inward on `domain/schedule`;
  schedule does not import Semantic Diff models/services or outer layers.
- Tests: `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/scheduleImpactCalendarProjection.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Framework/custom decision: pure functions, collections, and UTC date
  operations remain sufficient. No projection interface, strategy, adapter,
  port, factory, or custom framework.

<!-- markdownlint-enable MD024 -->

## Shared Validation Protocol For Every Code Slice

Before implementation of each slice, re-audit the closed edit and
validation-only manifests against the current call graph: the manifest must
contain the complete old-path import/reference closure, every focused test
claimed by that slice must be either an allowed edit or an explicitly listed
validation-only path, and no path may be silently added. In particular,
Slice 2 validates `scheduleRuleHelpers.test.ts` after the Slice 1 owner move,
and Slice 4 validates `unitListViewHelpers.test.ts`,
`evaluateScheduleDiagnosticViolations.test.ts`, and
`scheduleRuleHelpers.test.ts` in addition to its schedule and impact suites.
The Slice 4 audit must also verify the calendar-test direct-import migration
and the calendar-index allowlist described above.

The package scripts expose no focused desktop suite selector. Therefore the
named focused suites in each slice's validation bullet are evidence labels,
not commands: execute the verified full desktop sequence
`rtk pnpm run test:prepare:desktop` and then
`rtk pnpm run test:desktop:run`. Record the pass result for every named suite
as it appears in the full runner output and map each result to the slice's
`M_s(test)` union defined below. Do not add a test script, filter, config, or
test-only workaround. After the final `rtk pnpm run build` in each clean
snapshot, run only `rtk pnpm run test:web`; pnpm automatically invokes
`pretest:web -> test:prepare:web`. Record that nested preparation output and
the web-run output separately within the single web command evidence. The desktop
preparation and runner remain ordered exactly as above and their outputs are
recorded separately.

For approval and evidence, define each slice's closed validation manifest as a
union, not as two competing lists:

```text
E_s = editable test paths in that slice's Approval Boundary
V_s = validation-only paths in that slice's Approval Boundary section
M_s = E_s ∪ V_s
M_s(test) = { path in M_s | path is a test suite }
```

The exact test-path unions are:

| Slice | `E_s` test paths                                                                                            | `V_s` test paths                                                                                                                                                                                                                                                                                                   | `M_s(test)` and runner mapping                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `scheduleRuleHelpers.test.ts`                                                                               | `unitListViewHelpers.test.ts`, `evaluateScheduleDiagnosticViolations.test.ts`, `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleCalendar.test.ts`, `semanticDiffSchedule.test.ts`, `architectureDependencyRules.test.ts`                                                                                  | Full desktop runner output must contain a pass result mapped to all seven paths.                                                    |
| 2     | `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`                                         | `semanticDiffScheduleCalendar.test.ts`, `semanticDiffScheduleImpact.test.ts`, `scheduleRuleHelpers.test.ts`, `unitListViewHelpers.test.ts`, `evaluateScheduleDiagnosticViolations.test.ts`, `architectureDependencyRules.test.ts`                                                                                  | Full desktop runner output must contain a pass result mapped to all eight paths.                                                    |
| 3     | `semanticDiffScheduleCalendar.test.ts`                                                                      | `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`, `semanticDiffScheduleImpact.test.ts`, `scheduleImpactCalendarProjection.test.ts`, `architectureDependencyRules.test.ts`                                                                                                                       | Full desktop runner output must contain a pass result mapped to all six paths, including the editable same-index/non-mutation hunk. |
| 4     | `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`, `semanticDiffScheduleCalendar.test.ts` | `unitListViewHelpers.test.ts`, `evaluateScheduleDiagnosticViolations.test.ts`, `scheduleRuleHelpers.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffContracts.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`, `scheduleImpactCalendarProjection.test.ts`, `architectureDependencyRules.test.ts` | Full desktop runner output must contain a pass result mapped to all eleven paths.                                                   |

Non-test validation-only paths such as `semanticDiffDto.ts` remain members of
`M_s` but are mapped by compile/build/import evidence, not invented suite
names. Before each slice, re-audit that every suite named in its Validation
bullet is in `M_s(test)`, every `E_s` test hunk is named in the edit manifest,
and no path is both editable and validation-only. A mismatch blocks approval
and is a Replanning trigger. This union rule applies identically to all four
slices and closes the phase/manifest contradiction found during review.

1. Build exact disposable baseline/final snapshots from the approved slice base
   and proposed slice, excluding unapproved working-tree paths.
2. Verify identical repository qlty configuration, pnpm/Node toolchain, and
   analyzed source/test scope.
3. In both snapshots run non-mutating `rtk pnpm exec qlty check` and
   `rtk pnpm exec qlty smells --no-snippets`.
4. Record each comparable finding by stable identity, explicit severity
   ordering, baseline/final severity and measured value, and whether higher or
   lower is worse. New or reliably mapped adverse movement is Finding/NG;
   unmappable identity/direction is advisory; unchanged unrelated findings are
   out of scope.
5. Only in the final snapshot run formatting-capable `rtk pnpm run qlty`. If
   it changes approved analyzed content, sync only approved paths, rebuild the
   final snapshot, and repeat the comparable pair plus aggregate until stable.
6. Keep qlty caches/results/logs, generated output, and test artifacts
   snapshot-local.
7. Architecture tests automatically evidence cataloged dependency rules;
   review still judges ownership, abstraction value, framework sufficiency,
   custom-gap credibility, and qlty disposition.

## Feature-Level Production Readiness

- Failure modes: moved imports, missing exports, classifier precedence,
  hierarchy ambiguity, candidate expansion, evidence loss, and structural DTO
  drift must fail validation; no fallback may mask them.
- JP1/AJS: version 13 normalized meanings and explicit unsupported/
  uncalculated evidence remain normative. No new form or external source.
- Malformed/large input: preserve non-throwing explicit outcomes, the
  caller-controlled calendar-index lifecycle and non-mutating traversal,
  bounded candidate/substitution scans, deterministic order, and large-period
  expectations.
- Desktop/web: shared code remains host-neutral and Node-free, preserves
  `engines.vscode` `^1.75.0`, and receives final desktop/web evidence.
- Documentation: module paths/history fail the Durable Documentation Gate. No
  README, user-doc, architecture, or CHANGELOG update is planned.
- Compatibility: DTOs, JSON/report facts, commands, panels, diagnostics, Unit
  List fields, schedule-impact IDs/order/counts, and parser contracts remain
  unchanged.

## Traceability

- `TRACEABILITY.md` maps every feature requirement and acceptance criterion to
  slices and concrete evidence.
- A slice cannot be approved while a traceability row says `Planning required`
  or its validation cannot detect the primary regression.

## Feature Exit

- Definition of Done status: planned; starts only after all four slices are
  independently reviewed, Completion Approved, and committed.
- Required evidence: no old reusable `semanticDiffSchedule*` modules/imports
  or forwarding exports; schedule owns reusable contracts; Semantic Diff
  retains comparison policy; tests, desktop/web, architecture, and qlty pass.
- Durable docs: none expected. A missing reusable architecture rule requires
  Replanning before durable-document edits.
- Open risks: semantic drift, import gaps, qlty worsening from consolidation,
  and accidental F2/F3 implementation.

## Replanning Triggers And Out-Of-Scope Work

Stop and return to Main for:

- canonical date/period parsing or a reusable AJS document index (F2);
- moving facade period parsing, side collection, or decision mapping (F3);
- application projection, VS Code dependency/wiring, Calendar webview,
  readonly-model, or architecture-test restructuring (F4-F8);
- changed semantics, evidence, DTO/schema, presentation behavior,
  framework/custom mechanism, material abstraction, risk, validation, paths,
  or approval boundary;
- a slice that cannot be independently validated.

## Notes

- `SPECS.md` remains the requirement and boundary owner.
- This plan was reviewed, human-approved, and committed through the plan gate;
  implementation evidence above records the uncommitted Slice 1 result.

<!-- markdownlint-enable MD013 MD060 -->
