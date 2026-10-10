# Feature Tasks: Schedule Projection Facts Cohesion

## Agent Brief

- Purpose: isolate Run and Issue projection decisions without changing public
  schedule facts or schedule-impact behavior.
- Active or approved slice: S3 is human-approved; S1 and S2 are committed.
  Formatting remediation waits for the focused approved replan commit.
- Read [SPECS](SPECS.md), this plan, [traceability](TRACEABILITY.md),
  [SDD policy](../../README.md), and [Solution Shape](../../architecture.md#solution-shape).
- Constraints: P1 only; no schedule semantics, forwarding wrappers, host fixes,
  DTO/identity/timeline redesign or architecture exceptions.
- Next decision / blocker: focused approved S3 replan commit, then S3.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: focused approved S3 replan commit. PR #332
  at `bbcbe5b3486c97420ddf32ce15a1442e55f6a05d` has `qlty fmt` Failure;
  Verify, CodeQL and `qlty check` succeeded. Closure remains blocked.
- Gate evidence: intake and planning documentation records below; independent
  plan review returned Ready for approval and Human Approval was received.
  Planning commit: `85d3942adc092a41d26ad6e38a74ff15cf36991e`.
  S1 diff, validation, Ready reviews and actual Completion Approval are
  recorded below; completion commit is
  `f33d354377af1e69467db2e7ccab1cb4b7c8e7e4`.
- Selected base: `7713435dc0d4aece4604f88722dbb51d30315104`.
- Branch: `codex/semantic-diff-schedule-projection-facts-cohesion`.
- Main renamed the docs branch after the approved planning commit, before
  runtime edits, to satisfy the implementation branch boundary.
- Completed/preserved slices: S1 and S2 committed with two Ready reviews and
  actual Completion Approval each. Original plan review/Human Approval and
  commit remain preserved. Existing WebAPI feature and every roadmap item
  retain their scope, ownership, approvals and evidence.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: reviewed S1 and S2 boundaries, order, exclusions and validation
  in planning identity
  `0eb979fe9c25e366d353ed2bdc48f8d2d937d48b85062d37f68897d7206a8e6c`.
- Approved planning paths: this feature's `SPECS.md`, `TASKS.md` and
  `TRACEABILITY.md` only.
- Approved implementation paths: exactly the runtime, test and coordination
  paths enumerated under S1 and S2; each dependent slice retains its commit gate.

## Design and alternatives

The approved S1/S2 design uses two implementation slices, each leaving a working
public facts builder. S3 below adds only formatting remediation.
S1 separates run collection and stable run projection. S2 separates issue
classification, evidence and ownership/rekeying. Root correspondence remains
in `semanticDiffScheduleProjectionFacts.ts`: selection, confirmed/unmatched
root assembly, root outcomes, scope transitions, ID maps, final issue links,
statuses, period states and deep freezing must remain ordered together.

- Retain the public `buildScheduleProjectionFacts` and
  `BuildSemanticDiffScheduleImpactInput` in their current module. Preserve
  direct aliases/re-exports from `semanticDiffScheduleImpact.ts`.
- Initial issues are built before root correspondence. Root outcomes use those
  issues; final root IDs then rekey issues, and final root issue IDs/statuses
  are published. Do not combine initial null root IDs with final identities or
  assign occurrence ordinals again during rekeying.
- Preserve last-hit document ID/path lookup, occurrence traversal, longest-path
  issue ownership, candidate exclusions, supported/no-runs evidence, existing
  ID encodings and sort keys. Inputs are never re-evaluated or mutated.
- `deepFreeze` remains in the facts entry. `cloneDetail` and `compareIssues`
  move to the Issue owner and are directly re-exported by the facts module;
  existing consumers retain the same callable references, not wrappers.
- Reject mechanical Run/Issue/Root modules: Root assembly and remapping are
  coupled, and a separate Root facade would only forward the same contract.
- Retaining everything in one module preserves behavior but leaves distinct
  run-index and issue-classification change reasons coupled. Two owners are
  justified by existing observable contracts, not size or frequency claims.
- Reject a generic projection utility/context package, new ports or callback
  adapters. Existing DTO, identity/source-key and normalized document-index
  capabilities suffice; no dependency, framework or custom infrastructure gap.

## Solution Shape

All owners below are host-neutral Application code in
`src/application/semantic-diff`. Dependencies remain Application to Application
and Domain. No owner imports the facts entry in reverse.

### Run Projection owner (S1)

New `semanticDiffScheduleRunProjection.ts` owns evaluated run collection,
paired-path suppression of unpaired decisions, side-local unit fallback,
explicit zero-run candidates, stable source keys and occurrence/run IDs.

- `collectScheduleRunFacts`: evaluated schedule plus existing readonly
  side-local unit lookup -> side runs and explicit no-run ID sets. Preserve
  pair-evaluation ordering and added/removed unpaired decision behavior.
- `projectScheduleImpactRuns`: existing root identity/source-key context,
  selected side runs, readonly unit lookup and root unit -> projected run DTOs
  with current IDs/ordinals and null initial `sourceChangeRef`.
- Export explicit readonly input/result types for these contracts; retain local
  mutable construction. Indexed-run helpers remain private. The root owner
  supplies identity context and the existing `SourceKeyForRun` capability;
  the run owner does not infer root correspondence or timeline pairing.
- Facts entry computes the root outcome from runs/issues/no-runs and calls the
  projector. Run owner does not own outcome or final freezing.
- Value: source-local collection and identity-aware run projection can change
  independently of issue reason policy. Tests remain on observable facts and
  impact contracts; no tests merely mirror helper text or file layout.

### Issue Projection owner (S2)

New `semanticDiffScheduleIssueProjection.ts` owns unsupported reason/status
classification, evidence matching/fallback/cloning, stable issue ordering,
occurrence IDs, longest-path root ownership and candidate suppression.

- `buildScheduleIssues`: result/evaluated schedule, selected roots by side,
  initial root ID maps and candidate unit/path exclusions -> side issue DTOs.
- `findScheduleIssueRoot`: selected roots plus target path -> longest containing
  root with the existing ordinal tie-break. Facts uses it for root issue maps;
  selection of roots stays in facts. Path containment helpers stay local.
- `remapScheduleIssues`: initial side issues, selected roots and completed
  root ID maps -> ordered final side issues. It preserves detail references
  and occurrence ordinals while replacing only root ID and encoded issue ID.
- `buildInvalidScheduleIssues`: result -> existing invalid-period issue DTOs;
  facts owns the invalid period state and period clone.
- `cloneDetail` and `compareIssues` retain their signatures and receive direct
  re-exports at the original facts path. No public facts/impact DTO changes.
- Export explicit readonly boundary types. Value: unsupported evidence and
  issue identity have one owner across evaluated and invalid facts, with final
  correspondence supplied by the Root owner; no circular dependency.

### Retained Root and composition owners

The facts module keeps `createRootsContext`, `createRoots`, root matching and
scope transitions, `outcomeFor`, final root issue links/statuses, state dispatch
and `deepFreeze`. Existing document indexes, identity DTOs and source-key
functions remain their owners; no extra utility or Domain API is introduced.

`compareSemanticDiffWithArtifacts` still performs one internal comparison and
passes that exact schedule evaluation to the facts builder. It is a retained
Application use-case boundary, not a newly added factory. No port, adapter,
application factory or lifecycle owner is added or changed. Existing bootstrap
factories, telemetry and parser adapters are unaffected.

The architecture dependency/ownership tests mechanically check their existing
catalog; they do not prove these boundaries have semantic value. Independent
review must assess the ownership and retained coupling separately.

## Impact and discovery references

- Reuse [intake evidence](/private/tmp/ajsbutler-projection-facts-intake-20261010/record.json)
  (identity `8cc1ca2eec9879b31bf78bfa4506dfc15a0c07344f8eeda6b23cdc16d016c34a`).
  Sparse three-commit history cannot establish independent change frequency.
- Facts functions inspected: run collection/indexing, issue classification and
  sorting, `createRootsContext`, root transitions, `createRoots`, remapping,
  invalid/evaluated state dispatch and freezing. Planning discovery is linked
  in the validation record; no runtime baseline scans were run.
- Direct production consumers: `semanticDiffScheduleImpact.ts` imports
  cloning/freezing and re-exports the facts builder/input type;
  `compareSemanticDiffWithArtifacts.ts` consumes those exports.
- Transitive consumer: `buildSemanticDiffPresentationArtifacts.ts` consumes
  facts and builds the impact sidecar; output-context/Explorer/calendar/report
  consumers receive unchanged DTOs. Existing identity and timeline modules
  consume projected roots/runs and exact source-change composites unchanged.
- Existing boundary suites: schedule-impact aliases, last-hit indexes,
  candidates, UTF-8 IDs, duplicate/nested source pairing, shuffled issue IDs;
  comparison artifacts cover all facts states, scope transitions, missing-row
  failure, valid-no-runs, nested ownership and duplicate structured details.
- Existing browser `webSmoke.ts` WEB-13 verifies comparison and schedule-impact
  artifact equivalence; reuse it without adding duplicate browser assertions.
- Concrete gap: existing immutability test uses an empty evaluated period.
  Add populated run/issue/detail mutation-isolation checks at the public facts
  boundary, rather than creating a separate internal-helper test suite.
- No scenario is added/removed from product contracts. No parser, generated
  model, calendar, host, bootstrap, report UI or telemetry edit is needed.
- README/use cases/domain rules/architecture/CHANGELOG need no change: this
  preserves behavior and introduces no new user action or reusable policy.
  Durable roadmap remains unchanged; Main owns any candidate addition.

## Slice S1: Run Projection

- Lifecycle state: SLICE_COMMITTED
- Value: isolate run collection and identity-aware occurrence projection while
  retaining an independently usable, immutable facts builder.
- Dependency: reviewed, human-approved and committed plan; no prior slice.
- Exact runtime paths: modify
  `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`; add
  `src/application/semantic-diff/semanticDiffScheduleRunProjection.ts`.
- Exact test path: `src/test/suite/semanticDiffScheduleImpact.test.ts`.
- Coordination paths: this feature's `TASKS.md` and `TRACEABILITY.md` only.
- Change: move `scheduleRunsBySide` family, `noRunsBySide`, `indexedRuns` and
  `runWithId` under the Run contracts above; facts calls them from context
  collection/root-side assembly. Keep root outcome and scope ownership intact.
- Acceptance: R1/R6 Run boundary; R2 stable IDs/ordinals/order/last-hit and
  duplicate pairing; R3 supported/no-runs outcome unchanged; R4 references and
  fail-closed impact unchanged; R5 populated run arrays and their objects are
  deeply frozen without freezing/mutating input evaluation or documents.
- Test work: retain existing source-local nested/duplicate/count-mismatch tests;
  add one populated projection immutability/input-isolation case with a nested
  run. Add assertions to an existing fixture where possible, not mirrored
  run-projector assertions. Contract-preserving tests precede extraction.
- Required validation: V1–V5 below, including documentation annotations.
- Risks: run source-key context leakage, duplicate ordinal drift, changed
  fallback unit ID or no-runs evidence. Resolve within this boundary; any new
  owner/DTO/identity/timeline path requires Replanning through Main.
- Readiness: public facts/impact remain usable with Issue/Root logic untouched;
  all required checks and independent implementation review are prerequisites
  to Completion Approval and focused commit. Host failures block readiness.
- Approval boundary: only the exact paths and responsibilities above; no
  config/harness/architecture-test updates or downstream consumer edits.
- Implementation acceptance: retained run collection ordering, pair-path suppression,
  side-local last-hit fallback, source keys/IDs/ordinals and explicit no-runs
  evidence. Existing duplicate/nested/reference/fail-closed contracts pass.
  Extended the existing last-hit/nested fixture before extraction: populated
  run arrays/objects are frozen, producer documents/evaluation/runs remain
  mutable and unchanged by building, and source edits do not change facts.
- Implemented Solution Shape: Run owns collection and occurrence/ID projection
  in the approved Application module, with explicit readonly input/result types
  and private indexing. Facts retains Root selection/assembly/outcomes, Issue
  classification/remapping and final freezing. Dependencies use existing Domain
  models, Application DTO/identity/source-key capabilities; no reverse facts
  import, wrapper, port, adapter, factory or custom mechanism is introduced.
- Changed paths: the two approved runtime paths, the approved impact test,
  this `TASKS.md` and `TRACEABILITY.md`; no other product/configuration paths.
- Validation: S1-v1; V1 compile and five targeted suites pass (68 tests),
  V2 desktop preparation and runner pass (1193 tests), V3 web passes including
  WEB-13, V4 desktop/web production build passes. VS Code `^1.75.0`, Node
  assumptions and JP1/AJS3 v13 schedule meanings are unchanged. Architecture
  catalog results are mechanical facts, separate from ownership review.
- V5: official full-repository qlty 0.645.0 observations completed; check has
  4 baseline / 3 final inherited findings, smells has 151 / 151 and no new
  finding. Final aggregate passes. Two unchanged related duplication records
  initially showed mapped `actual` 15 -> 17 (higher is worse), warning unchanged.
  F1 required evidence beyond unchanged source/message values. Two official
  repeats per exact unchanged snapshot now reproduce both 15 and 17 within
  each snapshot: baseline original/repeats 15/15/17; final 17/15/17. All other
  149 canonical records remain identical. The measured association is therefore
  unstable; retain these two records as advisory with raw evidence for review.
  Both independent reviewers support this narrow advisory disposition.
- Evidence: [S1 validation record](/private/tmp/ajsbutler-projection-facts-s1-20261010/record.json),
  substantive final snapshot identity
  `6419fbb0de1003ac23725d3cee3a41e1bb6550a312cb7ebf4f372e73390bbc7d`.
  Gate annotations are a separately validated metadata patch. Execution
  exceptions include initial sandbox host launch denials, exact escalated
  runner success, accidental working-checkout aggregate and clean-snapshot
  inventory refresh; raw outputs and affected identities are retained there.
- Compatibility/readiness: all required product commands complete; two
  independent implementation reviews returned Ready with no open Findings.
  No durable documentation, README or CHANGELOG update is required for this
  behavior-preserving internal extraction. No new dependencies or telemetry
  data surface; unchanged algorithms retain existing malformed/large-input
  behavior and complexity. No S2 work or completion gate is claimed.
- Independent review: Findings F1 (P2) on the V5 advisory rationale; runtime
  and Solution Shape had no Findings. F1 revision retains originals and reuses
  V1–V4, qlty check and aggregate; only affected official smells observations
  and coordination documentation validation were refreshed. Re-review resolved
  F1 and returned Ready; a second independent review also returned Ready.
- Review: `projection_facts_s1_review` and
  `projection_facts_s1_second_review` returned Ready in the current conversation;
  reviewed working-tree identity
  `cf63e3831c1798e4a46dcfbbdd51e3e51ae23ba3aadd546d95d900938b5a06af`,
  patch SHA256
  `b5faf002738749e97837877bd479de5a54ab22f8f35ef47d4154d63fdc92cf38`.
- Completion Approval: Approved; approved at: approved in current conversation.
- Approved completion scope: reviewed S1 implementation and evidence; no S2
  implementation or closure approval is inferred.
- Approved completion paths:
  - `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleRunProjection.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `docs/specs/features/semantic-diff-schedule-projection-facts-cohesion/TASKS.md`
  - `docs/specs/features/semantic-diff-schedule-projection-facts-cohesion/TRACEABILITY.md`
- Completion commit: `f33d354377af1e69467db2e7ccab1cb4b7c8e7e4`.

## Slice S2: Issue Projection and final correspondence consistency

- Lifecycle state: SLICE_COMMITTED
- Value: one owner for issue classification/evidence/identity while preserving
  Root correspondence's ordered assembly and final consistency.
- Dependency: S1 independently reviewed, completion-approved and committed.
- Exact runtime paths: modify
  `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`; add
  `src/application/semantic-diff/semanticDiffScheduleIssueProjection.ts`.
- Exact test paths: `src/test/suite/semanticDiffScheduleImpact.test.ts` and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`.
- Coordination paths: this feature's `TASKS.md` and `TRACEABILITY.md` only.
- Change: move issue classification/collection, `owningRoot`, detail cloning,
  comparator, `issueId`/rekey/remap and invalid issue construction. Facts uses
  the Issue contracts above and directly re-exports cloning/comparison. Keep
  root selection/outcome/finalization and freezing in facts.
- Acceptance: R1/R6 Issue boundary with retained Root coupling; R2 aliases,
  deterministic issue IDs/order/ordinals; R3 every facts state, reason/status,
  candidate/nested ownership and root outcome; R4 exact source composites and
  missing-row fail-closed behavior; R5 nested cloned issue details are frozen
  and isolated from mutable source details. Each final root issue ID resolves
  to its same-side final issue, and final statuses carry the same issue links.
- Test work: retain existing shuffled/duplicate/candidate/nested tests; extend
  a duplicate structured-detail fixture to assert root/status/issue ID
  consistency and mutation isolation, including relationPair/period and arrays.
  Cover invalid-period detail isolation in its existing state fixture. Use
  facts/impact/artifact outputs, not source-text or wrapper tests.
- Required validation: V1–V5; changed contract tests run before extraction,
  followed by the whole targeted set and existing WEB-13 host smoke.
- Risks: premature rekeying, duplicate counts reordered, deep clone regression,
  circular facts/issue imports, mismatched final links or changed invalid state.
  No swallowed failure or inferred support from empty runs is permitted.
- Readiness: all R1–R6 must be covered; existing exports callable by direct
  reference, no reverse import or forwarding wrappers; required checks and
  independent implementation review precede Completion Approval/commit.
- Approval boundary: exact paths above; S1 module, DTOs, identity/timeline,
  downstream impact builder, architecture rules and durable docs excluded.
- Implementation acceptance: existing reason/status mapping, evidence matching
  and fallback, detail cloning, sort keys, occurrence IDs, longest-root
  ownership and candidate suppression remain unchanged. Final correspondence
  supplies completed IDs once; remapping preserves details and ordinals, and
  facts finalizes root/status links after remapping. Invalid issue IDs/details
  retain their contract while facts owns invalid state and period cloning.
- Implemented Solution Shape: the approved Issue Application owner exports
  `buildScheduleIssues`, `findScheduleIssueRoot`, `remapScheduleIssues` and
  `buildInvalidScheduleIssues`, with explicit readonly boundary types. Facts
  directly re-exports the same `cloneDetail` / `compareIssues` references.
  Root selection/assembly/outcomes/final links/state/freezing remain in facts;
  S1 Run, DTO/identity/timeline and downstream owners are unchanged. Existing
  Domain/application capabilities suffice; no wrapper, port, adapter, factory,
  reverse facts import, framework or custom mechanism is introduced.
- Changed paths: the two approved runtime paths, both approved test paths,
  this `TASKS.md` and `TRACEABILITY.md`; no outside product/configuration paths.
- Test-first evidence: extended existing public fixtures before extraction;
  25 impact/artifact tests pass. Rich duplicated evidence covers nested
  relationPair/period/all-array cloning, frozen output and mutable unchanged
  producers; real duplicate decisions cover final same-side root/status/issue
  links and stable ordinals; invalid-period details remain isolated. Existing
  cycle details retain their null period. Direct callable re-export assertions
  were added to the existing contract test after extraction.
- Validation: S2-v1; final compile and exact isolated V1 pass (68 tests),
  desktop preparation/runner pass (1193 tests), web passes including WEB-13,
  and production desktop/web build passes. Architecture catalog results remain
  separate from independent semantic ownership judgment. VS Code `^1.75.0`,
  Node assumptions and JP1/AJS3 v13 schedule meanings are unchanged.
- V5: official full-repository qlty 0.645.0 check has 4 / 4 identical inherited
  findings: MD041 in the pull-request template, formatting in the unchanged
  S1 Run owner, unused `ParamSymbol` in unit-list code and an unused eslint
  suppression in the test runner. All four are unchanged and outside S2's
  approved implementation scope; preserve them without changing those paths.
  Smells has 151 / 151, no new finding or adverse mapped movement.
  Final aggregate passes. The same reciprocal duplication cluster has
  `actual` 17 -> 15, warning unchanged; matching S1 repeated-snapshot evidence
  establishes its measured instability, so no improvement is claimed. All
  other 149 canonical records match; raw measurements and reuse proof remain
  in the evidence for independent review.
- Evidence: [S2 validation record](/private/tmp/ajsbutler-projection-facts-s2-20261010/record.json),
  baseline S1 commit `f33d354377af1e69467db2e7ccab1cb4b7c8e7e4`, substantive
  final snapshot identity
  `e1463b603c4c469d3f4deb184783eee3c41733315e24ac6ddaf782a59d9c3ed3`.
  Later execution/state/evidence/traceability annotations are a separately
  validated metadata patch. Retained exceptions include corrected test fixture
  assumptions, unavailable direct formatter, final-clone formatting sync and
  architecture timeouts during concurrent validation; the exact isolated V1
  retry passes without configuration or command changes.
- Compatibility/readiness: required product commands complete; two independent
  implementation reviews returned Ready with no open Findings. No new
  dependencies, telemetry data surface or compatibility contract changes;
  algorithms retain existing error/fallback/malformed/large-input behavior.
  No durable documentation, README or CHANGELOG update is needed for this
  behavior-preserving internal extraction. S1 completion evidence is retained;
  S2 completion and feature closure approval/commits are not inferred.
- Independent review: Findings F1 (P2) corrected the inherited check count
  to 4 / 4 with precise unchanged-finding dispositions; F2 (P3) removed a stale
  lifecycle clause from historical plan evidence. Runtime/Solution Shape and
  validation evidence remain unchanged. Only coordination metadata validation
  was refreshed; re-review resolved F1/F2 and returned Ready. A second
  independent implementation review also returned Ready.
- Review: `projection_facts_s2_review` and
  `projection_facts_s2_second_review` returned Ready in the current conversation;
  reviewed working-tree identity
  `c379a45e9b62abc91df3969c97efd60f2898793c840da065be52ca043e55a300`,
  patch SHA256
  `f973076cb87d380ccd3079b58f5dacae3056ac8e551f206321959eab77e3381a`.
- Completion Approval: Approved; approved at: approved in current conversation.
- Approved completion scope: reviewed S2 implementation and evidence only;
  closure approval is not inferred.
- Approved completion paths:
  - `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleIssueProjection.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`
  - `docs/specs/features/semantic-diff-schedule-projection-facts-cohesion/TASKS.md`
  - `docs/specs/features/semantic-diff-schedule-projection-facts-cohesion/TRACEABILITY.md`
- Completion commit: `bbcbe5b3486c97420ddf32ce15a1442e55f6a05d`.

## Slice S3: exact Run formatting remediation

- Lifecycle state: PLANNED
- Trigger F3: [Cloud formatter Finding](https://github.com/kittybbit/vscode-ajsbutler/pull/332#discussion_r4237765413),
  `prettier:fmt` on the Run module at published S2 HEAD
  `bbcbe5b3486c97420ddf32ce15a1442e55f6a05d`. Replanning comparison base is
  this committed S2 head; the original feature selection/base is unchanged.
- Value: make the delivered Run source match the formatter and restore the
  exact-head global gate without altering the completed feature's behavior.
- Dependency: S1 and S2 completed gates preserved; independently reviewed S3
  replan, explicit Human Approval for S3 and focused approved replan commit.
- Exact runtime path: `src/application/semantic-diff/semanticDiffScheduleRunProjection.ts`.
- Exact coordination paths: this feature's `TASKS.md` and `TRACEABILITY.md`.
  No test/config/package/other runtime/durable-document path is authorized.
- Change: wrap the existing `ProjectedScheduleImpactRuns` type alias after
  `=`. Read-only Prettier 3.6.2 and 3.3.3 previews produce the same single
  line-break delta. Apply only this formatter delta after approval; no cleanup,
  API spelling/type, import, algorithm or other whitespace change.
- Acceptance: exact formatter accepts this path; exported readonly signature,
  collection/projector names, source keys, sort/occurrence/ID behavior and
  freezing contracts are unchanged. TypeScript syntax/token structure apart
  from trivia and emitted executable JavaScript remain identical.
- Solution Shape: existing Run owner remains host-neutral Application in
  `src/application/semantic-diff`; no responsibility, contract, dependency
  direction, material abstraction, port, adapter or factory changes. Existing
  Qlty Prettier capability supplies the formatter; no new package/custom tool.
- Formatter identity: repository `.qlty/qlty.toml` enables unpinned Prettier.
  Standalone `pnpm exec prettier` was unavailable during S2; cached Qlty
  installations now provide 3.6.2 and 3.3.3 CLIs. The preview does not prove
  Cloud's resolved version. Implementer must record Qlty's actually resolved
  plugin version/path/hash and config, use explicit-path `qlty fmt` in its
  disposable final snapshot, and bind output to that identity. Missing tool
  identity or inability to format/check is a blocker, not a dependency update.
- Required commands/coverage: S3-A through S3-D below; the previous S1/S2
  V1–V5 set is not automatically repeated for this new formatting-only scope.
- Risks: autoformatter selecting only changes relative to origin; formatted
  snapshot not synchronized to reviewed/committed file; unrelated formatter
  edits; tool-version drift. Inspect exact changes and hashes. Any additional
  substantive delta, missing equivalence or changed contract returns to Main
  for Replanning rather than silently broadening S3.
- Approval boundary: only the three paths and one formatting delta above.
  Original Human Approval for S1/S2 and publication approval do not cover S3.
- S3 Human Approval: Approved; approved at: approved in current conversation.
- S3 approved scope: exact three paths and single type-alias formatting delta
  plus S3-A through S3-D validation from reviewed replan identity
  `a6e39af4c5b6ea1720ace3a2b6ca007dec819c5671b9857c5a0aac929321a36d`.
- Approved replan commit paths: this feature's `TASKS.md` and `TRACEABILITY.md`
  only; runtime changes belong to the subsequent S3 implementation gate.
- S3 plan review: `projection_facts_plan_review` returned Ready for approval
in the current conversation, no Findings; reviewed identity
`a6e39af4c5b6ea1720ace3a2b6ca007dec819c5671b9857c5a0aac929321a36d`.
- S3 replan commit: pending; completion commit / implementation evidence: none

### S3 validation and preservation boundaries

S3-A: use Qlty's resolved Prettier capability to format the explicit Run path
in the disposable final snapshot (`rtk pnpm exec qlty fmt
src/application/semantic-diff/semanticDiffScheduleRunProjection.ts`). Before
execution, retain its CLI/config/tool identity. Planning inspected installed
`qlty fmt --help`: positional `[PATHS]...` is supported. Do not fall back to
a default changed-file selection. Validate the exact result with the resolved
Prettier CLI `--check`
on this same path, recording version/path/hash. Standalone package installation
or configuration edits are excluded. Formatting preview sources/commands are
retained in the [S3 replan evidence](/private/tmp/ajsbutler-projection-facts-replan-s3-20261010/record.json).

S3-B: `rtk pnpm run test:compile`, plus the existing architecture catalog via
`rtk pnpm exec mocha --ui tdd out/test/suite/architectureDependencyRules.test.js
out/test/suite/architectureSemanticDiffOwnership.test.js`. Source-inspecting
architecture inputs changed, so refresh these mechanical checks. Retain a
TypeScript syntax/token equivalence check and emitted JavaScript comparison
using the existing TypeScript compiler, baseline S2 Run source and formatted
Run source under identical compiler settings. A mere whitespace diff is not
sufficient evidence of program equivalence; exports/readonly type contract,
comments/directives, imports and emitted executable content must match.

The public-contract/schedule tests and desktop/web executions from S2 remain
historical passes for the unchanged executable program. Reuse an individual
execution result only when its actual emitted JS/bundle/resources/fixtures and
relevant tool/dependency/configuration inputs exactly match its retained input
manifest after S3 compile/preparation; record the matched coverage. AST
similarity alone does not establish Evidence Contract freshness. If needed
inputs cannot be matched, rerun only the affected V1 tests or V2/V3 host command
from the original command set. Do not claim the old command ran on new source.
A new production build is not required solely for this type-alias line break:
no compiled contract, bundling configuration or executable changes. Retain S2
V4 as historical compatibility coverage, rather than a new-head build pass.
Any failed compile, emitted mismatch, host dependency/config change or new
compatibility concern invalidates this narrow plan and returns through Main.

S3-C: new exact full-repository baseline (committed S2 head plus separately
identified coordination metadata) and final snapshots. Run official
`rtk pnpm exec qlty check --all --sarif --no-fix` and
`rtk pnpm exec qlty smells --all --sarif --no-snippets` in both; run
`rtk pnpm run qlty` only in final. Require the complete four SARIF artifacts,
nonzero inventories, same tools/config/selection, severity/direction comparison
and passing stable aggregate per V5/Evidence Contract. Default aggregate
success alone cannot discharge this explicit-path formatting Finding. Retain
unrelated unchanged findings; reject every new/reliably mapped adverse finding.
The existing two-record measured-instability advisory may be reused only if
its exact identity, unchanged source/config/tool and measured comparability
facts still match; it is no formatting exemption. No repeat scans unless a
specific missing/invalidated fact warrants them.

After formatting, synchronize only approved source bytes; verify SHA-256
matches across authoritative final scan manifest, reviewed working tree,
staged file and committed artifact. Record the metadata patch separately.
If formatting or annotations change inspected inputs, refresh only affected
checks under policy; never bind old scans to different bytes. This binding
specifically repairs F3's prior snapshot-to-delivered-source gap.

S3-D: targeted Markdown lint/local links/structure/state/approval/scope/
traceability/diff checks for both coordination paths. After approved S3
completion commit and authorized push, Main must obtain `qlty check` and
`qlty fmt` Success at the new exact PR head; earlier S2 check success is not
that gate. Existing PR remains draft. No push, merge, closure or approval is
performed/inferred by this plan. Feature Exit resumes only after S3 has its
review, Completion Approval, focused commit and current-head global gates.

### F3 discovery, evidence invalidation and alternatives

- Reuse [Main Cloud record](/private/tmp/ajsbutler-projection-facts-cloud-20261010/record.json)
  and exact-head comment/status. The previous Feature Exit report's Cloud
  unavailability is superseded by publication results, not by a Close verdict.
- S1 authoritative final Run manifest is formatted SHA-256
  `13f6c4ed0b89c19cd89c6274c8dd2ef35c31273200b7ecf05a97ea2374a045df`;
  S1 reviewed/committed Run and S2 baseline/final Run are unformatted SHA-256
  `f2135afd9e7a9bed6f058465636a307f60b8a8daa7ba0fcb9d3cb60137ae8c41`.
  Formatter previews show this difference is precisely the type-alias wrap.
  S1 final check's three results do not establish formatter readiness for its
  delivered Run bytes. Invalidate this quality-to-committed-Run binding only;
  preserve the original raw scans, approvals, reviews and semantic evidence.
- S2 full official check correctly retained four identical records, including
  this Run `prettier:fmt` note as inherited and outside S2's approved paths.
  S2 aggregate used default change-relative selection; log checked two files.
  Its success is valid for its observed selection, not whole-feature Cloud
  formatting. S3 explicit-path check closes this coverage gap.
- Original S1/S2 reviewed scope/Completion Approvals remain historical facts;
  their plan reviews do not cover added S3 scope. New independent plan review
  and Human Approval are required before remediation; S3 implementation
  review must assess equivalence and corrected evidence binding. Closure
  remains Pending, and prior exit readiness requires reevaluation after S3.
- Reject formatting the entire repository or altering Qlty configuration:
  unrelated findings and owners remain outside scope. Reject ignoring the
  note because Cloud check passed: `qlty fmt` is a separate exact-head gate.
- README/CHANGELOG/durable roadmap/architecture/use cases remain unchanged;
  no user-visible or reusable design/policy change is introduced.

## Common exclusions and validation blockers

S1/S2 exclude product tests outside their exact listed paths, package or
check configuration, generated artifacts, Domain changes, parser/VS Code/UI
imports, bootstrap, adapters, factories, telemetry, P2–P4, new schedule support
and all existing roadmap remediation. A newly necessary path/design/command
change returns through Main for Replanning, independent review and approval.

Desktop bootstrap, Table shell failures and expanded-flow golden follow-ups
are inherited risks, not permission to repair or waive them. Run required
checks and retain failures. If a required command cannot complete or fails,
completion is not Ready: return its actual blocker through Main to the owning
follow-up before renewal. A targeted pass or temporary launcher cannot replace
required host coverage. Planning does not claim those failures still occur on
this checkout or that they are fixed.

## Required validation and Evidence Contract

Use one exact baseline/final evidence package per slice owned by implementer,
with the preceding committed slice as S2 baseline. Retain raw outputs outside
inspected snapshots and link record identity/result/coverage here. Matching
results are reused; refresh only changed inputs or specifically affected facts.

- V1: `rtk pnpm run test:compile`; then `rtk pnpm exec mocha --ui tdd`
  with explicit compiled paths for `semanticDiffScheduleImpact.test.js`,
  `compareSemanticDiffWithArtifacts.test.js`, `semanticDiffScheduleRules.test.js`,
  `architectureDependencyRules.test.js` and
  `architectureSemanticDiffOwnership.test.js`, all under `out/test/suite/`.
  These host-neutral suites need no VS Code test-host substitute; keep the
  architecture result separately from semantic ownership judgment.
- V2: `rtk pnpm run test:prepare:desktop` followed by
  `rtk pnpm run test:desktop:run`: desktop execution and integration coverage.
- V3: `rtk pnpm run test:web` (its `pretest:web` prepares the web target):
  browser smoke, including existing WEB-13. Shared
  boundary contracts stay in V1 rather than being duplicated by host.
- V4: `rtk pnpm run build`: production desktop/web bundles. Record unchanged
  `engines.vscode` (`^1.75.0`), touched layer/export/import inventory, and the
  architecture Node-import result. JP1/AJS3 v13 meanings, raw dates/times and
  half-open periods remain protected by the schedule suites.
- V5: qlty >= 0.645.0; exact disposable baseline/final snapshots with identical
  full-repository selection/configuration. Run
  `rtk pnpm exec qlty check --all --sarif --no-fix` and
  `rtk pnpm exec qlty smells --all --sarif --no-snippets` in both snapshots;
  `rtk pnpm run qlty` only in final. Retain four complete SARIF 2.1.0 artifacts,
  analyzed-path inventories/counts, measured severity/direction comparison,
  configuration/tool/dependency identities, logs/status and final aggregate.
  Any new finding or reliably mapped adverse movement is NG; incomplete,
  zero-path or mismatched scans cannot pass. Formatting that changes approved
  inputs requires synchronization and fresh final observations until stable.

Documentation: `rtk pnpm exec markdownlint-cli2` on all changed feature Markdown,
local links/anchors/structure, scope/state/approval/traceability inspection and
`rtk git diff --check`, including whitespace in untracked paths. Full qlty is
not required for this planning-document change.

Record approved/changed/untracked/renamed/deleted/out-of-scope paths, exact
content manifests including generated check inputs, base/final revisions or
working-tree identities, required commands/coverage/exits, tool/config/dependency
hashes, missing facts and execution exceptions. No implementation baseline or
pass is inferred from planning discovery. Current-head Qlty Cloud and aggregate
feature completeness remain Feature Exit gates through Main/feature-closer.

## Roadmap-wide consistency assessment

The user expanded the consistency review to every existing roadmap item.
Disposition below is intake evidence, not a durable roadmap rewrite.

- WebAPI Import Beta Exit and WebAPI Generated Fixture Reproducibility relate
  to the inherited WebAPI feature. Real-environment/user evidence and exact
  generator output are different completion gates; retain both, under the
  existing owner, rather than absorbing them into P1.
- Desktop Test Host Bootstrap enables trustworthy desktop execution; Table
  Shell Host Failures needs component failure resolution. Investigate host
  readiness before relying on full-suite shell conclusions, while retaining
  distinct done conditions and maintainers. Neither is a P1 implementation
  outcome. Explicit dependency wording is a possible Main roadmap clarification.
- Expanded Flow Graph Golden Alignment shares deterministic ordering as a
  preservation contract with P1, but owns a graph golden mismatch. Keep separate.
- Dependabot Post-Publication Verification depends on a published dependency
  graph and security disposition; P1 does not modernize dependencies. Keep separate.
- Deferred Schedule Semantics: parent inheritance/`ln`, 48-hour/day-crossing,
  cycle, `cftd`, omitted-`sh` Cancel and registration-relative forms each require
  source/context or migration evidence. `cftd` explicitly follows stable cycle
  and substitution contracts. Preserve these boundaries and ordering; no
  additional semantic feature intake is authorized by P1.
- Recommendation: one new P1 roadmap candidate, no feature/item consolidation
  and no mandatory rewrite of current items. Shared host verification and
  WebAPI ownership can be clarified without changing their completion gates.
  Main owns any durable roadmap edit after the Durable Documentation Gate.

## Validation index

- Independent plan review: `Ready for approval`, no Findings, in the current
  conversation by `projection_facts_plan_review`; reviewed planning identity
  `0eb979fe9c25e366d353ed2bdc48f8d2d937d48b85062d37f68897d7206a8e6c`.
  Main recorded review and actual Human Approval for the reviewed plan.
  Current slice states and completed gates are recorded in their sections.

- Intake: intake-v1 passed for its own content identity, discovery coverage and
  three Markdown files; unchanged discovery reused, planning documents supersede
  intake documentation validation only where their content changed.
- Planning: planning-v1; all three feature Markdown inputs, local links/anchors,
  document roles/state/approval/traceability/scope and whitespace checks.
- Evidence artifact: [planning evidence](/private/tmp/ajsbutler-projection-facts-plan-20261010/record.json)
  with discovery input manifest and documentation outputs. Retain with intake
  evidence through review, approval, commit and Feature Exit.
- Runtime/build/qlty evidence: S1-v1 and S2-v1 linked above.
- Review: Ready for approval as recorded above; Human Approval: Approved;
  planning commit: `85d3942adc092a41d26ad6e38a74ff15cf36991e`.
- Missing facts: no unresolved product/design choice; required host-check
  failures, if observed, block completion as stated above.

## Prior Feature Exit entry

- Main confirmed both slices have independent Ready reviews, explicit human
  Completion Approval and focused completion commits.
- S1: `f33d354377af1e69467db2e7ccab1cb4b7c8e7e4`.
- S2: `bbcbe5b3486c97420ddf32ce15a1442e55f6a05d`.
- No unresolved scope or design decision; aggregate checks, durable ownership
  and current-head global gates remain for feature-closer.
- Closure Approval: Pending; approved at: none; approved scope: none.

## Prior Feature Exit review

- Original result: Do not close while Cloud evidence was unavailable. This
  report remains evidence for its inspected head; publication and F3 now
  supersede its missing-gate reason and feature state. See S3 for the current
  blocker; it is not a renewed Close recommendation.
- Slices: S1 `f33d354377af1e69467db2e7ccab1cb4b7c8e7e4` and S2
  `bbcbe5b3486c97420ddf32ce15a1442e55f6a05d` have focused completion commits,
  two independent Ready reviews each, and explicit Completion Approval. Their
  retained validation records are S1-v1 and S2-v1.
- Aggregate acceptance: R1/R6 ownership boundaries are implemented and
  independently reviewed; R2 IDs, ordering, aliases, references and duplicate
  identity; R3 facts states, issue ownership and root consistency; R4 single
  schedule evaluation and fail-closed references; R5 immutability and host
  neutrality all remain covered by the existing contract suites. S2-v1's
  combined final manifest matches the current committed runtime/test files.
- Validation: reuse S2-v1 for integrated V1–V5 coverage: 68 targeted tests,
  complete architecture catalog, 1193 desktop tests, web including WEB-13,
  both production bundles, full-repository qlty observations and passing final
  aggregate. Qlty records contain no new or adverse mapped finding; the two
  reciprocal smells measurements retain the reviewed instability advisory.
  The GitHub check-runs request for current HEAD returned HTTP 422, “No commit
  found”; the commit-status request returned no statuses, and `git ls-remote`
  returned no matching branch ref. The repository `Verify` workflow runs only
  on `pull_request`. On prior PR #331, the exact head commit had successful
  Qlty `qlty check` and `qlty fmt` statuses with PR-specific target URLs. This
  history does not establish that a branch push alone produces those Cloud
  statuses. The evidence-backed next step, if authorized, is to push this
  branch at S2 HEAD and open a PR to `main`, then verify the Qlty statuses for
  that exact head. No push or PR was performed.
  The attempted local qlty help command also failed to initialize its log file
  under the sandbox; it is an execution exception, not a Cloud result.
- Traceability: [TRACEABILITY](TRACEABILITY.md) maps R1–R6 and the three use
  cases to the S1/S2 tests and V1–V5 results; no mapping gap was found.
- Compatibility and readiness: VS Code `^1.75.0`, JP1/AJS3 v13, desktop/web,
  output references and behavior are preserved. No feature-specific runtime,
  quality, or production-readiness risk remains. Existing unrelated roadmap
  follow-ups keep their recorded maintainers and entry conditions.
- Durable propagation: no reusable policy, product behavior, or architecture
  contract changed. README and CHANGELOG need no update. No roadmap work,
  ordering, entry condition, or product concern changed; retain all existing
  roadmap items without consolidation. No durable document path needs
  propagation.
- Closure paths if the missing gate later passes: remove the complete selected
  folder `docs/specs/features/semantic-diff-schedule-projection-facts-cohesion/`;
  there are no durable propagation paths. Closure Approval and closure commit
  remain pending. This folder is not authorized for removal by this review.
- Documentation validation: this exit update passes feature Markdown lint,
  local link/anchor and structure checks, lifecycle/traceability inspection,
  and `git diff --check`; exact commands and outputs are retained in the exit
  evidence artifact.
- Evidence: [Feature Exit record](/private/tmp/ajsbutler-projection-facts-exit-20261010/record.json).

## Replanning validation index (S3)

- Replan-S3-v1: changed TASKS/TRACEABILITY scope, dependency and approval
  boundary; two Markdown paths, links/anchors, preserved S1/S2 gates,
  planning-stage approval provenance, traceability and diff checks.
- Evidence: [S3 replan record](/private/tmp/ajsbutler-projection-facts-replan-s3-20261010/record.json).
- S1/S2 plan and completion reviews/approvals/commits are preserved; only
  affected formatting readiness/binding is invalidated as specified under F3.
- S3 review: Ready for approval by `projection_facts_plan_review`; actual
  Human Approval: Approved in the current conversation. Replan commit pending.
- Next route: approval-committer for the approved replan; no scope, design or
  validation change has been made after review.
