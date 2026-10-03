# Feature Tasks: semantic-diff-application-projection

## Agent Brief

- Purpose: separate schedule-impact application responsibilities while retaining
  one cohesive capability and observable behavior.
- Active or approved slice: S1 implemented and independently reviewed Ready.
- Read: `SPECS.md`, `TRACEABILITY.md`, Solution Shape below, source contracts,
  and linked discovery/evidence. Selection and base remain fixed.
- Validate planning docs with Markdown, links/structure and diff checks. S1 has
  the required code and host checks below.
- Next gate: focused S1 completion commit, then Feature Exit. Do not edit
  durable docs or include later roadmap features.

## Current state

- Lifecycle state: SLICE_APPROVED
- Next decision / blocker: focused S1 completion commit; both independent
  implementation reviews are Ready and explicit Completion Approval was
  received in current conversation. Feature Exit remains pending.
- Gate evidence: independent plan review Ready and explicit Human Approval in
  current conversation; focused plan commit succeeded. Reviewed substantive identity:
  `c9b2b08098835d4897291b2b182dc6b29b6ba41bb5c36504610aa04757781207`.
- Selected feature kind: roadmap.
- Branch: `codex/semantic-diff-application-projection`.
- Base: `c144d089e6c6acf7470d3c044cc60d0292c064ea`.
- Preserved slices: none completed; inherited WebAPI feature and roadmap work
  remain unchanged.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: reviewed complete plan and S1 exact implementation boundary,
  acceptance, Solution Shape and validation, including inherited host-check
  disposition; excludes Completion Approval and Closure Approval.
- Approved substantive identity:
  `c9b2b08098835d4897291b2b182dc6b29b6ba41bb5c36504610aa04757781207`.
- Approved implementation paths:
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpactDto.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpactIdentity.ts`
  - `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpactTimeline.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
- Approved planning and decision paths:
  - `docs/specs/features/semantic-diff-application-projection/SPECS.md`
  - `docs/specs/features/semantic-diff-application-projection/TASKS.md`
  - `docs/specs/features/semantic-diff-application-projection/TRACEABILITY.md`
- Approval metadata: [Main human gate record](/private/tmp/ajsbutler-semantic-diff-application-projection-plan/main-human-approval.md).

## Completion Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: reviewed S1 completion and focused commit of the exact eight
  paths below, including separately validated metadata; Closure Approval is
  excluded.
- Reviewed S1: both independent implementation reviewers returned Ready.
- Reviewed substantive content manifest SHA-256:
  `9904aaaed82e3f53cae1bf5271874890a9ee763530c8a8b995d6b524c4f9735a`.
- Review record: [Main S1 readiness and reviews](/private/tmp/ajsbutler-semantic-diff-application-projection-s1/main-slice-ready.md).
- Approved completion commit paths:
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpactDto.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpactIdentity.ts`
  - `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpactTimeline.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `docs/specs/features/semantic-diff-application-projection/TASKS.md`
  - `docs/specs/features/semantic-diff-application-projection/TRACEABILITY.md`

- Completion approval metadata: [Main approval record](/private/tmp/ajsbutler-semantic-diff-application-projection-s1/main-completion-approved.md).

## Solution Shape

All owners remain host-neutral application modules under
`src/application/semantic-diff/`. There are five cohesive modules, not a generic
projection framework. Existing normalized-model indexing, retained schedule
facade/evaluation, plain DTOs and deterministic TypeScript transformations are
sufficient. No library replacement or custom framework gap is proposed.

- `semanticDiffScheduleImpactDto.ts`: owns the existing output DTOs and
  `ScheduleProjectionFacts` discriminated union with unchanged exported names,
  optional candidate groups and field meaning. Imports only application DTO
  types. Its boundary exposes stable, domain-free data to presentation.
  `BuildSemanticDiffScheduleImpactInput` belongs with facts because it contains
  domain documents/evaluation, and remains re-exported at the legacy entry.
- `semanticDiffScheduleImpactIdentity.ts`: owns UTF-8 length-prefixed IDs,
  numeric component rejection, side-local identity-decision indexes, confirmed
  source-key resolution and candidate-group projection. Exports the existing
  `encodeSemanticDiffScheduleImpactId` and `encodeScheduleImpactId`, plus the
  existing `createSourceKeyForRun`, `identityDecisionsByUnit`, `identityMatchKind`
  and `candidateGroups` helpers and the existing confirmed-status set as needed
  internally. `SourceKeyForRun` is the
  existing typed function contract, not an injected capability or new port.
  Identity consumes comparison decisions; it never recomputes correspondence.
  Candidate root filtering may use a local predicate without adding a module.
- `semanticDiffScheduleProjectionFacts.ts`: owns normalized document indexes,
  root correspondence/scope assembly, issue attribution, retained evaluated
  run ordinals, supported/no-run/partial/uncalculated outcomes and immutable
  not-requested/invalid/evaluated snapshots. Exports unchanged
  `buildScheduleProjectionFacts` and `BuildSemanticDiffScheduleImpactInput`.
  It uses domain model/index types and the schedule facade's evaluation type;
  does not invoke schedule evaluation. Root and issue logic stay together
  because issue IDs/statuses depend on resolved roots. It consumes identity.
- `semanticDiffScheduleImpactTimeline.ts`: owns deterministic run pairing,
  changed-time duplicate ordinals, exact upstream source-change references,
  source ownership and fail-closed validation. Exports the existing
  `attachSourceChangeReferences` and `validateSourceChangeReferences` with
  explicit input/output types; consumes DTOs, comparison DTOs and identity.
  It receives projected roots, not documents or schedule evaluators.
- `semanticDiffScheduleImpact.ts`: retained public entry and orchestration
  owner; preserves all existing exported names using direct type/value
  re-exports. It owns cloning the retained projection, composing timeline
  attachment/validation, freezing output and the unchanged
  `buildSemanticDiffScheduleImpact` / `buildScheduleImpact` alias. This is the
  actual immutable sidecar use-case assembly, not an extra forwarding wrapper.
  `cloneDetail`, `compareIssues` and `deepFreeze` may be shared from the facts
  module as ordinary existing helpers; they earn no separate utility module.

Dependency direction: entry -> facts/timeline/identity/DTO; facts -> identity/DTO
and domain; timeline -> identity/DTO; identity -> DTO and normalized model type;
DTO -> semanticDiffDto only. No reverse imports into the entry, no cycles, and
no outer-layer imports. Existing consumers, including comparison and
presentation-artifact builders, keep importing the entry. Compatibility
re-exports contain no forwarding functions, duplicate implementation or state.

Ports/adapters: none added or changed. The existing parser adapter and
`AjsParserPort` are unaffected. Retained
`createBuildSemanticDiffPresentationArtifacts` factory still owns source-text
parse/comparison composition and remains unchanged; no new application factory
is needed. Identity's source-key closure only captures an index for projection.

Architecture test facts cover cataloged layer/import/construction rules with
zero exceptions. Cohesion, semantic ownership, alias value and correctness
remain independent reviewer judgments. The tests named below cover each owner
through its observable application and consumer boundaries.

## S1: cohesive schedule-impact application projection

- Lifecycle state: SLICE_APPROVED
- Value: independently reviewable, behavior-preserving application capability
  with explicit DTO, identity, facts, timeline and orchestration ownership.
- Order / dependencies: sole slice; requires the merged schedule facade at the
  fixed base. Plan review, Human Approval and plan commit precede implementation.
  S1 review, Completion Approval and commit precede Feature Exit.
- Why one slice: extracting DTO/identity alone would leave the responsibility
  concentration outcome incomplete. Facts/timeline identity and source-reference
  ownership are coupled; move them together without an intermediate broken
  contract or separate approvals for incomplete product value.

### Exact implementation boundary

Runtime paths (all under `src/application/semantic-diff/`):

- Modify `semanticDiffScheduleImpact.ts`.
- Add `semanticDiffScheduleImpactDto.ts`.
- Add `semanticDiffScheduleImpactIdentity.ts`.
- Add `semanticDiffScheduleProjectionFacts.ts`.
- Add `semanticDiffScheduleImpactTimeline.ts`.

Test path:

- Modify `src/test/suite/semanticDiffScheduleImpact.test.ts` to characterize
  existing legacy exports/alias identity and immutable snapshots before
  extraction. Once the new modules exist, characterize canonical-module
  export/type/function identity compatibility as mandatory final validation.
  Use meaningful full DTO/reference assertions;
  do not mirror private implementation or create a test per moved helper.

Decision/evidence paths: selected `SPECS.md`, `TASKS.md`, `TRACEABILITY.md` only;
retained mechanical evidence lives outside inspected repository inputs.
No other runtime, tests, config, generated artifacts or durable docs are in S1.
In particular, all existing import consumers stay unchanged. Their exact set is
recorded in the planning discovery artifact; compile and boundary tests cover
those unchanged application/presentation/bootstrap dependencies.

### Acceptance and test coverage

- Existing public type names, three builder names and both ID encoder names
  remain available at the old path; aliases retain function identity. DTO
  serialized shape, snapshots and thrown validation failures remain compatible.
- Facts build once from the retained evaluation. No new comparison/evaluation
  calls; no-request, invalid period and evaluated empty period stay distinct.
- Existing schedule-impact tests retain side-local last-hit indexes, UTF-8
  collision safety/numeric rejection, immutable periods/issues/candidates,
  ambiguous/nested identities, root scope transitions, global issue ordering,
  duplicate/count-mismatch one-to-one pairing and exact source-reference failure.
- Comparison-artifact and presentation-artifact suites preserve one-pass facts,
  availability, supported zero-runs versus unresolved evidence, reports and
  ordinary Explorer. Calendar projection, transport/session/registry and
  Explorer schedule-impact boundary suites retain consumer meaning.
- Architecture rules pass without exceptions; source dates/timezones, JP1/AJS
  semantics and `engines.vscode` `^1.75.0` stay unchanged. Desktop and browser
  compile/build and explicit host checks demonstrate integration.

### Required validation and evidence

Producer: implementer; one reusable S1 baseline/final artifact. Record exact
baseline/final revision/content manifests, rename/untracked/deletion inventory,
approved paths, tool/dependency/config hashes, commands/statuses/raw outputs,
all relevant ignored generated inputs, imports/exports and Node-import scan.
Use identical inputs/tools/selection for paired observations. Record architecture
facts separately from semantic review. No implementation checks were run while
planning; the intake results are not S1 validation.

1. Before restructuring, characterize existing legacy exports/aliases and
   immutable snapshots, then run the nearest schedule-impact tests; retain the
   passed pre-extraction result. After the new modules exist, add canonical-module
   export/type/function identity compatibility assertions and require them to
   pass in final validation. No new-module imports are required before extraction.
2. `rtk pnpm run test:compile` and `rtk pnpm exec tsc --noEmit`.
3. Run compiled host-neutral suites with `rtk pnpm exec mocha --ui tdd`:
   `out/test/suite/semanticDiffScheduleImpact.test.js`,
   `compareSemanticDiffWithArtifacts.test.js`,
   `semanticDiffPresentationArtifacts.test.js`,
   `semanticDiffContracts.test.js`, `semanticDiffJson.test.js`,
   `semanticDiffMarkdownProjections.test.js`,
   `scheduleImpactCalendarProjection.test.js`,
   `scheduleImpactCalendarTransport.test.js`,
   `scheduleImpactCalendarBridge.test.js`,
   `scheduleImpactCalendarSession.test.js`,
   `scheduleImpactSidecarRegistry.test.js`, and
   `architectureDependencyRules.test.js`, all in that same compiled suite
   directory. Run in a snapshot containing the production source for static
   architecture inspection. If an imported suite requires a host or alias,
   route that suite to the matched desktop runner below; do not mock away its
   boundary or silently omit it.
4. `rtk pnpm run test:prepare:desktop` and
   `rtk pnpm run test:desktop:run`; explicit desktop coverage includes the
   above relevant suites plus `semanticDiffExplorerScheduleImpact.test.js`,
   `semanticDiffCommandScheduleImpact.test.js`,
   `createScheduleAwareExplorerSession.test.js`,
   `scheduleImpactCalendarPanelRuntime.test.js` and
   `semanticDiffExplorerPanel.test.js`.
5. `rtk pnpm run test:prepare:web` and `rtk pnpm run test:web:run` for the
   existing web smoke, including comparison artifacts, schedule calendar bridge,
   session/sidecar wiring. `rtk pnpm run build` builds both production targets.
6. SDD qlty 0.645.0 or newer: in exact disposable baseline/final snapshots run
   `rtk pnpm exec qlty check --all --sarif --no-fix` and
   `rtk pnpm exec qlty smells --all --sarif --no-snippets`. Retain complete four
   SARIF files, nonzero analyzed inventories/counts, configuration identity,
   raw exits and mapped severity/metric direction comparison. New findings or
   reliably mapped adverse movement are NG. Run `rtk pnpm run qlty` only in
   final; require pass and stabilize approved formatting changes if any.
7. Targeted Markdown/local links/structure and `rtk git diff --check`; verify
   README/CHANGELOG evaluation and R1-R6 mapping after implementation.

### Inherited host-check disposition

The roadmap owns desktop executable/alias/define bootstrap, seven paired Table
shell failures and one expanded-flow golden mismatch. This slice does not repair
or silently waive them. Attempt and retain the supported commands. For an
inherited launcher failure, the implementer may use an evidence-local desktop
runner (outside repository inputs) with the actual Electron executable, existing
TypeScript aliases and development define loaded, running the same relevant
compiled suites in both baseline and final. Record exact launcher/preload source,
tool versions, resolved executable, selection and invocation in the evidence;
never describe the supported command as passed when the fallback ran.

Required relevant desktop suites and web smoke must pass. Any inherited full
suite failure may be dispositioned only with matching baseline/final test
identity and unchanged failure, explicit exclusion from this slice's dependency
impact, and passing relevant host coverage. This is an inherited diagnostic
result, not a pass for the full suite; ownership remains with roadmap maintainers.
New/changed failures, failure in a relevant suite, inability to obtain actual
host coverage, or unmapped failures block readiness and return to Main. A
repository harness repair or broader test change requires separate scope and
Replanning. Plan review and Human Approval cover this concrete disposition.

## Risks, alternatives and production readiness

- Risk: extraction changes iteration order, last-hit side-local indexes or
  duplicate ordinal ownership. Preserve algorithm/order exactly; characterize
  via existing rich observable tests and paired results.
- Risk: DTO module leaks domain types to presentation or cycles through entry.
  Keep domain-bearing input in facts, legacy type re-exports at entry, and
  enforce acyclic internal imports by review/compile plus architecture tests.
- Risk: clone/freeze helper relocation aliases mutable source arrays or loses
  deep immutability. Preserve clone boundaries and frozen snapshots with tests.
- Risk: mismatched source rows turn unknown evidence into a run effect. Preserve
  exact reference matching and deliberate fail-closed errors with boundary tests.
- Large/malformed/partial inputs preserve existing algorithms and failure modes;
  no performance claim, timezone conversion, new schedule rule, telemetry or
  external environment lookup is introduced.
- Alternative considered: migrate every consumer to canonical DTO modules.
  Rejected for this slice because direct compatibility re-exports give explicit
  ownership while avoiding unrelated presentation/bootstrap edits.
- Alternative considered: many files for individual root/issue/clone helpers or
  new ports/factories. Rejected because these helpers have no independent
  contract/lifecycle value; cohesive facts and timeline owners suffice.
- Readiness requires all acceptance, required relevant checks, qlty and independent
  implementation review. Shared-contract risk warrants a second independent
  implementation review using the same evidence under SDD policy.

## Validation index

- Discovery: [intake evidence](/private/tmp/ajsbutler-semantic-diff-application-projection-intake/evidence.md),
  base identity and intake manifest retained; not code validation.
- Planning identity / result: `projection-plan-v2`; passed documentation
  checks; retained mechanical detail is in the artifact below.
- Artifact: [planning discovery and validation](/private/tmp/ajsbutler-semantic-diff-application-projection-plan/evidence.md).
- Coverage: all selected-feature Markdown, local links, structure, scope,
  traceability, lifecycle and absent approval provenance.
- Review: independent plan-reviewer returned Ready; F1 test sequencing corrected
  and re-reviewed at the substantive identity above. No actionable Findings.
- Gate metadata: [Main state and review record](/private/tmp/ajsbutler-semantic-diff-application-projection-plan/main-plan-ready.md).
- Human Approval: Approved for exact reviewed plan and S1.
- Plan commit: `f34560b4c8cfb01aa74cf58cc301b837132d3216`.
- Commit metadata: [Main plan-commit record](/private/tmp/ajsbutler-semantic-diff-application-projection-plan/main-plan-committed.md).
  Completion/Closure Approval remain pending.
- S1 implementation: the public entry remains the orchestration and immutable
  output owner; DTO, identity, projection facts and timeline are now separate
  cohesive application modules. Compatibility names are direct re-exports, and
  the existing builder aliases retain function identity. No ports, adapters,
  factories, dependencies, telemetry or durable product documentation changed.
- Acceptance: legacy and canonical API identity/type assertions, evaluated
  snapshot immutability, the full 17-suite desktop selection, relevant
  host-neutral suites, web smoke, architecture rules and production builds are
  recorded in the implementation artifact. Desktop actual-host coverage used
  an evidence-local runner because the supported launcher returned exit 0
  without running Mocha; the paired Electron selection passed 137/137 at
  baseline and 139/139 after the two approved assertions, with the active light
  theme and `en` locale verified via the VS Code API. The final supported
  launcher also returned exit 0 without executing Mocha; the matched host
  fallback is the test result. Final host-neutral coverage passed 102/102,
  nearest schedule-impact tests passed 15/15 final (13/13 in the unmodified
  baseline snapshot); the exact-base, test-only pre-extraction characterization
  refresh passed 14/14, including legacy aliases and evaluated snapshot
  immutability. Web smoke passed 7/7, and TypeScript checks plus both production
  builds passed. The historical 14-test raw output was unavailable; the
  evidence artifact labels the reproducible refresh and its exact source identity.
- Quality evidence: the final aggregate passed. Cold full-repository qlty
  inventory checked 2,790 files (baseline 2,776); final check SARIF has the
  same three non-TRACEABILITY baseline findings and no new results. Smells
  retained 151 warning records; 149 are unchanged, and the only mapped change
  improves an existing similar-code metric from 17 to 15. Exact inventories,
  records, SARIF and raw outputs are linked in the implementation artifact.
- Compatibility and risk: `engines.vscode` remains `^1.75.0`; shared code adds
  no Node/VS Code/UI imports and JP1/AJS schedule semantics and source dates
  remain unchanged. Both independent implementation reviews returned Ready;
  Completion Approval was received; completion commit and Feature Exit remain
  pending.
- Implementation artifact: [S1 baseline/final evidence](/private/tmp/ajsbutler-semantic-diff-application-projection-s1/evidence.md),
  including exact inputs, runner/preload, host outputs, qlty observations and
  validation exceptions.
- Refresh only affected input coverage; no runtime baseline scans required here.

## Documentation and exit readiness

No durable behavior contract, README or CHANGELOG change is needed for the
behavior-preserving internal structure. No durable edits are authorized in this
plan. If implementation changes observable behavior, compatibility or needs a
new durable design decision, stop for Replanning rather than widening S1.

Feature Exit is pending S1 completion/reviews/approval/commit. Main then routes
closure to the feature-closer, including current-head Qlty Cloud and cross-slice
coverage checks. The closer identifies any minimum reusable architecture and
roadmap propagation under the Durable Documentation Gate for separate Closure
Approval; selected-feature removal is never part of S1. Later roadmap items and
the inherited WebAPI feature are preserved.
