# Feature Tasks: Schedule Projection Facts Cohesion

## Agent Brief

- Purpose: isolate Run and Issue projection decisions without changing public
  schedule facts or schedule-impact behavior.
- Active or approved slice: none. Proposed order: S1, then S2.
- Read [SPECS](SPECS.md), this plan, [traceability](TRACEABILITY.md),
  [SDD policy](../../README.md), and [Solution Shape](../../architecture.md#solution-shape).
- Constraints: P1 only; no schedule semantics, forwarding wrappers, host fixes,
  DTO/identity/timeline redesign or architecture exceptions.
- Next gate: focused planning commit through Main, then approved S1.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: focused planning commit for the approved plan.
- Gate evidence: intake and planning documentation records below; independent
  plan review returned Ready for approval and Human Approval was received.
  No implementation or commit is claimed.
- Selected base: `7713435dc0d4aece4604f88722dbb51d30315104`.
- Branch: `docs/semantic-diff-schedule-projection-facts-cohesion`.
- Before runtime edits, Main must rename or recreate this as a dedicated feature
  branch outside `docs/...`; runtime paths exceed the docs-only allowlist.
- Completed/preserved slices: none. Existing WebAPI feature and every roadmap
  item retain their scope, ownership, approvals and evidence.

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

Use two implementation slices, each leaving a working public facts builder.
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

- Lifecycle state: PLANNED
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
- Review / approval / completion commit / evidence: none

## Slice S2: Issue Projection and final correspondence consistency

- Lifecycle state: PLANNED
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
- Review / approval / completion commit / evidence: none

## Common exclusions and validation blockers

Both slices exclude product tests outside their exact listed paths, package or
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
  Main recorded review and actual Human Approval; S1/S2 remain planned.

- Intake: intake-v1 passed for its own content identity, discovery coverage and
  three Markdown files; unchanged discovery reused, planning documents supersede
  intake documentation validation only where their content changed.
- Planning: planning-v1; all three feature Markdown inputs, local links/anchors,
  document roles/state/approval/traceability/scope and whitespace checks.
- Evidence artifact: [planning evidence](/private/tmp/ajsbutler-projection-facts-plan-20261010/record.json)
  with discovery input manifest and documentation outputs. Retain with intake
  evidence through review, approval, commit and Feature Exit.
- Runtime/build/qlty evidence: not applicable to planning; V1–V5 pending for
  each approved implementation slice.
- Review: Ready for approval as recorded above; Human Approval: Approved;
  planning commit: pending.
- Missing facts: no unresolved product/design choice; required host-check
  failures, if observed, block completion as stated above.
