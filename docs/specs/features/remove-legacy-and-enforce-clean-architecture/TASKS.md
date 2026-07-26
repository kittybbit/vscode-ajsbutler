# Feature Tasks: Remove Legacy And Enforce Clean Architecture

## Agent Brief

- Purpose: finish the migration with zero retired wrapper paths and permanent
  zero-exception architecture enforcement.
- Approved slices: all four; Slices 1 through 4 are complete.
- Implement one approved slice at a time in the dependency order below.
- Do not remove parser-internal raw types or compatibility-preserving telemetry
  event names.
- Treat a failed behavior or compatibility check as a migration gap requiring
  replanning, not as authority for an incidental fix.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, the architecture rule
  catalog, and the affected use cases for the active slice.
- Validate every code slice with its focused checks and
  `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: run `sdd-plan-task` in Feature Exit Mode without deleting the
  feature folder before human closure approval.

## Plan Status

- Status: In Progress
- Planning scope: remove confirmed superseded production names and unused raw
  helpers, retire migration-only guardrail machinery, certify all predecessor,
  use-case, and host boundaries, then rewrite durable architecture policy from
  verified evidence.
- Review status: Reviewed; final verdict was ready for approval.
- Human approval: Approved.
- Active implementation slice: none; Feature Exit review is required.

## Human Approval

- Status: Approved
- Approved at: 2026-07-26
- Approved scope: full four-slice plan and every recorded approval boundary;
  implementation remains limited to one slice at a time in dependency order.

## Replanning Record

- Trigger: initial `sdd-review-plan` found incomplete requirement coverage and
  stale or inaccurate planning references before human approval.
- Affected slices: Slice 1 raw/artifact scope, Slice 2 feature/CI sync, Slice 3
  predecessor traceability and Markdown validation, and Slice 4 plans timing.
- Reason the prior plan could not continue: it omitted the confirmed unused
  `AjsRawUnit.createFromJSON` helper, delayed branch activation, would leave a
  deleted allowlist path in Minimal Context, and did not map every predecessor
  requirement or the exact implementation symbols.
- Preserved decisions: four-slice order, behavior-preserving scope,
  zero-exception target, both-host gate, telemetry compatibility retention, and
  Feature Exit boundary.
- Latest review adjustment: Slice 1 now requires the web-host smoke suite for
  shared webview changes. Slice 4 distinguishes the repository `lint:md`
  script's feature/use-case scope from targeted durable-document review; no
  slice scope, dependency, traceability, or approval boundary changed.

## Planning Gate

- Active feature folder:
  `docs/specs/features/remove-legacy-and-enforce-clean-architecture/`.
- Covered requirements and acceptance criteria: zero retired wrapper production
  surface, zero unused raw helpers and superseded compatibility adapters, zero
  temporary architecture exceptions, full rule enforcement with intentional-
  violation fixtures, preservation of predecessor requirements, all eleven use
  cases, desktop/web behavior, and evidence-based durable policy updates.
- Implementation order: Slice 1 -> Slice 2 -> Slice 3 -> Slice 4.
- Smallest useful slices: each slice owns one independently reviewable,
  testable, committable, and approvable architecture responsibility: confirmed
  superseded artifact removal, permanent enforcement, migration certification,
  or durable policy.
- Baseline evidence:
  - `src/domain/models/units/**` no longer exists and production imports of the
    retired wrapper graph are zero.
  - the full architecture catalog reports zero production violations in its
    repository test; Slice 2 makes that direct result the only dependency gate.
  - remaining `UnitEntity` production names are presentation-local names for
    DTO-based code, not wrapper instances.
  - `AjsRawUnit.createFromJSON` and its private recursive helper have no caller
    outside their own definitions and are confirmed unused raw-helper
    candidates.
  - parser raw types remain confined to `src/infrastructure/parser/**`;
    test-only raw access still supports normalization tests.
  - targeted `legacy`, `compat`, wrapper, and adapter inspection found no
    superseded production compatibility adapter; existing `legacy*` telemetry
    names are the only compatibility-named production surface requiring an
    explicit retention decision.
  - `legacy*` telemetry event names preserve existing emitted event meaning and
    are not migration debt.
- Repository sequencing assumption: roadmap migration features 1 through 5 and
  10.4 are complete. The still-active
  `import-definition-via-webapi` beta feature owns live-environment evidence
  and generated-artifact reproducibility, not the already-completed WebAPI
  architecture boundary.
- Branch assumption: after human approval, implementation must start on a
  dedicated non-`docs/` feature branch. Slice 1 must update
  `docs/specs/plans.md` from roadmap-queued to active before runtime edits on
  that branch; this replanning run does not activate the feature on the current
  predecessor branch.
- Qlty evidence rule: new smell findings are resolved or recorded as an
  approved actionable follow-up. Metrics-only movement is recorded only when
  tied to a concrete responsibility or production risk.

## Implementation Slices

### Slice 1: Remove Confirmed Superseded Artifacts

- Status: Complete
- Scope:
  - on the approved dedicated feature branch, update `docs/specs/plans.md` to
    mark this feature active before editing runtime code;
  - rename `src/presentation/webview/editor/UnitEntityDialog.tsx` and its
    component/props/imports to describe the unit-definition DTO it now renders;
  - rename `prevUnitEntityId` flow-view state and parameter names to stable unit
    identity terminology;
  - remove the unreferenced `AjsRawUnit.createFromJSON` public helper and its
    private recursive implementation without changing the raw parser model used
    by `AntlrRawAjsParser`, normalization, or tests;
  - remove stale test-support wording that describes normalization tests as
    legacy-wrapper tests;
  - record the scan-backed non-applicability decision that no superseded
    production compatibility adapter remains to delete;
  - preserve the actual DTO shapes, component behavior, flow state transitions,
    and test-only raw parser seam.
- User / Domain Value: the repository has no confirmed zero-consumer wrapper-
  era or raw-helper artifact that can imply a supported legacy path or be
  reintroduced by future viewer/parser work.
- Cohesive Change Group:
  - `docs/specs/plans.md` branch activation sync;
  - `src/presentation/webview/editor/UnitEntityDialog.tsx`;
  - `src/presentation/webview/editor/ajsTable/TableContents.tsx`;
  - `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`;
  - `src/presentation/webview/editor/ajsFlow/useFlowViewerController.ts`;
  - `src/presentation/webview/editor/ajsFlow/useFlowGraphState.ts`;
  - `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`;
  - `src/infrastructure/parser/raw/AjsRawUnit.ts`;
  - `src/test/support/parseAjs.ts`;
  - affected imports and focused tests such as
    `src/test/suite/unitInformationLocalization.test.ts` and parser/
    normalization suites.
- Acceptance:
  - branch plans identify this feature as active before runtime implementation;
  - no production component, prop, ref, or filename claims to contain a
    `UnitEntity`;
  - `AjsRawUnit.createFromJSON` and its private recursive helper are absent,
    while `AjsRawUnit`, `AntlrRawAjsParser`, and normalization behavior remain;
  - the dialog still consumes application-provided unit-definition data;
  - flow rebuild and previous-selection behavior are unchanged;
  - raw parser access remains test-only and limited to the approved
    normalization suites;
  - the compatibility-adapter inventory records no deletion target and retains
    compatibility-preserving telemetry identifiers explicitly.
- Validation:
  - targeted reference scans for `UnitEntity`, `prevUnitEntityId`,
    `createFromJSON`, retired wrapper import paths, raw parser access, and
    compatibility/legacy adapter terms;
  - `rtk pnpm test`;
  - `rtk pnpm run test:web`;
  - `rtk pnpm run build`;
  - `rtk pnpm run qlty`, including review of any new smell findings.
- Implementation Evidence:
  - on 2026-07-26, targeted scans found no production `UnitEntityDialog`,
    `prevUnitEntityId`, `AjsRawUnit.createFromJSON`, private recursive raw
    helper, or stale legacy-wrapper test wording;
  - the compatibility inventory found no superseded production adapter;
    compatibility-preserving `legacy*` telemetry identifiers remain;
  - desktop tests, web smoke, production build, and qlty passed. The build
    retained its bundle-size threshold warnings without adding a dependency or
    runtime responsibility.
- Production Readiness:
  - Failure mode: a missed import or ref rename fails type checking/build; a
    state-wiring mistake could change flow reveal behavior; over-removing a raw
    helper could break parser normalization. Focused viewer and normalization
    tests must catch both.
  - JP1/AJS compatibility: no parsing, parameter, command, or definition
    semantics change.
  - Large or malformed input risk: unchanged because the removed raw helper has
    no caller and parser/normalization algorithms are not changed.
  - Desktop/web impact: shared webview bundle paths change names, so both bundle
    compilation and viewer tests are required.
  - README/docs impact: none; these are internal names.
  - CHANGELOG impact: none under the repository CHANGELOG criteria because
    observable behavior is unchanged.
- Approval Boundary: branch activation sync, confirmed wrapper-era identifier/
  file renames, removal of only `AjsRawUnit.createFromJSON` and its private
  helper, the compatibility-adapter non-applicability record, and imports,
  types, and tests required to prove preservation. Do not remove the raw parser
  model, rename compatibility telemetry identifiers, or redesign the dialog/
  flow state.
- Dependencies: roadmap predecessor features must remain complete; no
  dependency on another slice in this feature.
- Risks: lexical `UnitEntity` and legacy-path matches in architecture violation
  fixtures are intentional and must not be mistaken for production
  dependencies; the raw-helper scan must distinguish the self-recursive private
  implementation from a real external consumer. No unresolved Slice 1 risk was
  found during implementation.
- Out of Scope: UI redesign, state refactor, parser raw-model removal, telemetry
  event renaming, and identity algorithm changes.

### Slice 2: Make The Full Architecture Catalog A Permanent Zero-Exception Gate

- Status: Complete
- Scope:
  - remove the empty migration allowlist fixture and the allowance ownership,
    removal-condition, stale-entry, and wildcard machinery that exists only to
    support temporary exceptions;
  - remove the transitional `findCurrentRuleViolations` subset and make the
    complete rule catalog the only production dependency gate;
  - retain and clarify the retired-wrapper rule as a permanent
    reintroduction guard;
  - keep explicit composition-root construction checks;
  - retain representative in-memory violation fixtures for every rule family
    and assert zero repository violations directly;
  - update the feature `SPECS.md` Minimal Context and feature plan evidence so
    they no longer point to the deleted allowlist fixture.
- User / Domain Value: every established layer, parser/raw, wrapper, host,
  framework, Node/browser, SDK, and composition boundary becomes mandatory
  rather than selectively or temporarily enforced.
- Cohesive Change Group:
  - `src/test/support/architectureDependencyRules.ts`;
  - `src/test/suite/architectureDependencyRules.test.ts`;
  - delete
    `src/test/fixtures/architecture/dependencyAllowlist.ts`;
  - `docs/specs/features/remove-legacy-and-enforce-clean-architecture/SPECS.md`;
  - this feature's `TASKS.md` and `TRACEABILITY.md` evidence sync;
  - test-index or validation wiring only if needed to keep the architecture
    suite in the standard desktop test run.
- Acceptance:
  - the repository has no allowlist API, fixture, entry, or owner-feature
    catalog;
  - all twelve dependency rule families and composition-root construction
    rules reject representative intentional violations;
  - all production sources pass the full catalog with zero exceptions;
  - scans still include `src/extension.ts`, all production roots, dynamic
    imports, `require`, import-equals, and repository aliases;
  - the feature Minimal Context points only to files that still exist;
  - the standard Verify workflow compiles and runs the architecture suite
    through its desktop extension test step.
- Validation:
  - `rtk pnpm test`;
  - zero-reference scans for removed allowance and transitional APIs;
  - inspect `.github/workflows/verify.yml` and the test index to confirm the
    architecture suite remains in the standard CI path;
  - `rtk pnpm run lint:md`;
  - `rtk pnpm run qlty`, including review of any new smell findings.
- Implementation Evidence:
  - on 2026-07-26, zero-reference scans confirmed removal of the allowlist
    fixture, allowance ownership and validation APIs, and the transitional
    three-rule subset;
  - the permanent repository assertion evaluates all twelve dependency rule
    families directly with zero violations, while representative violation
    fixtures and composition-root pass/fail checks remain; the retired-wrapper
    rule explicitly reports reintroduction as forbidden;
  - the source collector still covers `src/extension.ts`, every production
    root, supported TypeScript dependency syntax, and repository aliases;
  - the test index glob and Verify workflow continue to compile and execute the
    architecture suite through the standard desktop test step;
  - desktop tests, Markdown lint, and qlty passed.
- Production Readiness:
  - Failure mode: a rule false positive can block valid development; a missed
    syntax/root can permit a forbidden dependency. Collector coverage and
    intentional-violation fixtures must remain explicit.
  - JP1/AJS compatibility: no definition interpretation changes; the gate
    protects the parser and normalized-model boundaries that preserve it.
  - Large or malformed input risk: no runtime path changes; repository scan
    determinism and reasonable test duration must be preserved.
  - Desktop/web impact: the Node/browser and host-framework rules remain active
    and zero-exception.
  - README/docs impact: only feature-local Minimal Context/evidence is updated
    here; durable architecture wording is deferred to Slice 4.
  - CHANGELOG impact: none; test infrastructure and internal enforcement only.
- Approval Boundary: architecture collector/rule test support, removal of its
  temporary fixture, and feature-local references/evidence made stale by that
  removal. A newly exposed production violation stops the slice and requires
  replanning or return to the owning predecessor boundary.
- Dependencies: Slice 1, because every confirmed superseded artifact must be
  removed before the repository is certified under its permanent final gate;
  the dependency is sequencing evidence, not an import-rule requirement.
- Risks: removing migration machinery must not accidentally remove the
  permanent rule that prevents wrapper reintroduction or narrow scanned source
  roots. No unresolved Slice 2 risk was found during implementation.
- Out of Scope: adding new architecture layers, changing permitted dependency
  direction, runtime refactors, CI redesign, or permanent exceptions.

### Slice 3: Certify Migrated Use Cases And Host Compatibility

- Status: Complete
- Scope:
  - verify every completed migration predecessor boundary recorded in roadmap
    item 10 against current rules, ports, DTOs, composition, and regression
    evidence;
  - verify all eleven durable use cases against their existing application,
    normalized/domain, port, presentation, and regression-test boundaries;
  - run the integrated desktop/web, build, qlty, and diff validation set;
  - record actual pass evidence or an explicit non-applicability decision in
    `TRACEABILITY.md`;
  - verify parser, list, flow, CSV, definition, diagnostics, hover, navigation,
    WebAPI import boundary, semantic diff/report, telemetry privacy, and minimum
    VS Code compatibility preservation.
- User / Domain Value: users retain the complete JP1/AJS workflow set while the
  architecture migration is certified as complete on both supported hosts.
- Cohesive Change Group:
  - `docs/specs/features/remove-legacy-and-enforce-clean-architecture/TRACEABILITY.md`;
  - existing regression suites named in that matrix;
  - no runtime, test-expectation, generated-artifact, or configuration edits.
- Acceptance:
  - every predecessor migration row has current validation evidence or a
    requirement-backed non-applicability decision;
  - every use-case row names its entry point/boundary and has passing test or
    validation evidence;
  - `engines.vscode` remains `^1.75.0`;
  - desktop and web tests/build pass;
  - failures, undocumented behavior, or missing coverage are not marked
    non-applicable merely to close the migration.
- Validation:
  - `rtk pnpm run test:full`;
  - `rtk pnpm run build`;
  - `rtk pnpm run qlty`, including review of any new smell findings;
  - `rtk pnpm run lint:md`;
  - `rtk git diff --check`;
  - targeted zero-reference scans from Slices 1 and 2.
- Implementation Evidence:
  - on 2026-07-26, all 40 named regression test files and the planned
    application, domain, port, adapter, and presentation entry points were
    present;
  - P1 through P10, U1 through U11, and C1 through C4 passed their recorded
    repository validation. C4 live-environment evidence was explicitly not
    applicable to this slice and remains owned by the active WebAPI beta
    feature;
  - `test:full` passed for desktop and web, and the production build passed
    with only the existing bundle-size threshold warnings;
  - qlty, Markdown lint, diff checks, and the Slice 1 and 2 zero-reference scans
    passed;
  - no runtime, test-expectation, generated-artifact, or configuration change
    was needed, and `engines.vscode` remains `^1.75.0`.
- Production Readiness:
  - Failure mode: any failed workflow, host, privacy, or compatibility check
    makes this slice `Replan Required`; the failure is assigned to its actual
    boundary owner before implementation continues.
  - JP1/AJS compatibility: existing version 13 contracts and representative
    parser/normalization tests are the normative evidence; no new command or
    parameter semantics are introduced.
  - Large or malformed input risk: rely on existing parser, list, CSV, graph,
    diagnostics, and semantic-diff edge/large fixture coverage; record a gap
    rather than inventing an unapproved fix.
  - Desktop/web impact: both hosts are an explicit acceptance gate.
  - README/docs impact: no user workflow change is expected; a discovered
    mismatch requires replanning before durable docs change.
  - CHANGELOG impact: none if all behavior remains unchanged; any observable
    correction requires a new approval decision and CHANGELOG reevaluation.
- Approval Boundary: validation and feature traceability evidence only. This
  slice authorizes no behavior fix, new test expectation, generated artifact,
  configuration change, or compatibility exception.
- Dependencies: Slices 1 and 2.
- Risks: the active WebAPI beta feature's unavailable live-environment evidence
  is not falsely claimed here; this slice certifies its repository-owned
  architecture, structured failure, and desktop/web capability boundaries only.
  No unresolved Slice 3 risk was found during implementation.
- Out of Scope: real JP1/AJS3 WebAPI smoke verification, beta exit, stale
  generated Prism artifact correction, and new regression coverage unless a
  separately reviewed replan authorizes it.

### Slice 4: Rewrite Durable Architecture Policy From Verified Invariants

- Status: Complete
- Scope:
  - rewrite `docs/specs/architecture.md` to describe the verified current
    structure, dependency direction, composition ownership, parser/raw,
    serialization, host/framework, SDK, and desktop/web invariants without
    transitional wrapper or extraction language;
  - align `AGENTS.md` with the same verified invariants without duplicating
    feature history;
  - update `docs/specs/plans.md` from the active Slice 1 state only when the
    branch's next action or feature-exit readiness changes;
  - update `docs/specs/roadmap.md` only to remove completed migration sequencing
    and retain durable remaining direction after certification;
  - update use cases only if Slice 3 proves their durable contracts are
    inaccurate, in which case the affected change requires replanning first.
- User / Domain Value: future work starts from enforceable current boundaries
  rather than obsolete migration instructions, reducing architectural drift.
- Cohesive Change Group:
  - `docs/specs/architecture.md`;
  - `AGENTS.md`;
  - `docs/specs/plans.md` and `docs/specs/roadmap.md` only according to their
    SSOT roles;
  - this feature's `TASKS.md` and `TRACEABILITY.md` status/evidence sync.
- Acceptance:
  - durable documents state only invariants proven by Slices 1 through 3;
  - no remaining text treats removed wrappers, temporary allowlists, or
    completed vertical migrations as active work;
  - active WebAPI beta evidence and other genuine future work remain assigned
    to their owning plans/roadmap entries;
  - the feature folder is retained until a separate Feature Exit review passes
    and the human approves closure.
- Validation:
  - `rtk pnpm run qlty` across all changed documents;
  - `rtk pnpm run lint:md` for the feature and use-case Markdown paths covered
    by the repository script;
  - `rtk git diff --check`;
  - targeted heading, link, document-role, and invariant wording review for
    changed durable documents outside the `lint:md` script scope, including
    `AGENTS.md`, `docs/specs/architecture.md`, `docs/specs/plans.md`, and
    `docs/specs/roadmap.md`;
  - lightweight Agent Brief and no-`CONTEXT.md` structure checks from
    `docs/specs/README.md`;
  - cross-check every durable invariant against Slice 2/3 evidence.
- Implementation Evidence:
  - on 2026-07-26, `architecture.md` was rewritten from the Slice 2 zero-
    exception catalog and Slice 3 compatibility evidence; `AGENTS.md` now
    states the same enforced layer, parser/raw, host/framework, Node/browser,
    telemetry SDK, composition, DTO, and desktop/web rules;
  - `roadmap.md` now retains the verified architecture baseline and active
    WebAPI beta ownership without the completed migration sequence;
    `plans.md` identifies completion approval and Feature Exit review as the
    next actions;
  - no use-case update was needed because Slice 3 confirmed every durable
    contract without finding an inaccurate behavior requirement;
  - qlty, repository-scoped Markdown lint, diff checks, heading review, added-
    line length review, Agent Brief structure, no-`CONTEXT.md`, and invariant
    cross-checks passed;
  - direct Markdown lint outside the repository script still reports 20
    pre-existing `AGENTS.md` line-length findings; no changed line adds one;
  - no runtime, test, generated-artifact, configuration, README, CHANGELOG, or
    user-workflow change was made.
- Production Readiness:
  - Failure mode: overstated policy can block valid work or conceal remaining
    debt; every statement must be backed by enforcement or validation.
  - JP1/AJS compatibility: documents retain version 13 and behavior-preservation
    contracts without adding semantics.
  - Large or malformed input risk: no runtime effect; existing risk ownership
    remains in use cases.
  - Desktop/web impact: both-host invariants are documented only after Slice 3
    passes.
  - README/docs impact: `architecture.md`, `AGENTS.md`, plans, and roadmap are
    the smallest durable surface; README changes are not expected.
  - CHANGELOG impact: none because this is internal architecture policy and
    maintenance documentation with no documented user behavior change.
- Approval Boundary: durable policy and SDD synchronization only. Do not close
  or delete the feature folder without a later Feature Exit review and explicit
  human closure approval.
- Dependencies: Slices 1, 2, and 3.
- Risks: removing migration history must not remove an unresolved risk, active
  beta constraint, or reusable compatibility rule. The scoped `lint:md` result
  must not be represented as coverage of durable documents outside that
  script. No unresolved Slice 4 risk was found during implementation.
- Out of Scope: new architecture abstractions, user documentation rewrites,
  feature closure, unrelated roadmap reprioritization, and cleanup of
  pre-existing direct-Markdownlint findings outside the repository script
  scope.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: this non-trivial multi-slice feature closes a repository-wide
  migration and must map every predecessor boundary, all eleven durable use
  cases, and final architecture requirements to validation evidence.

## Cross-Slice Dependencies

- Slice 1 removes misleading wrapper-era production names without changing
  behavior, removes the confirmed unused raw helper, records compatibility-
  adapter non-applicability, and activates branch plans.
- Slice 2 then removes temporary enforcement machinery and proves the complete
  zero-exception invariant.
- Slice 3 certifies that the cleaned and enforced repository still preserves
  every workflow and both extension hosts.
- Slice 4 may describe the architecture as final only after the enforcement and
  compatibility evidence passes.
- Any missing migration, behavior correction, or new compatibility exception
  stops this sequence and requires Replanning Mode; it is not absorbed into a
  later slice.

## Feature-Level Risks

- A broad lexical deletion could remove telemetry event names whose legacy
  spelling is part of preserved analytics compatibility.
- A raw-type deletion could break the intentional parser-infrastructure seam or
  normalization test coverage.
- A validation-only slice could conceal a real gap if failures are called
  non-applicable without requirement evidence.
- Architecture documentation can become aspirational again if written before
  the full rule and host validation gates pass.
- Implementation remains limited to the active approved slice on the dedicated
  feature branch; later approved slices retain their dependency order.

## Out Of Scope

- New user-visible behavior, UI redesign, dependency modernization, performance
  rewrites, parser/grammar changes, and JP1/AJS semantic changes.
- Raising `engines.vscode` above `^1.75.0`.
- Real-environment WebAPI verification, beta exit, or correction of the
  separately owned stale generated Prism artifact.
- Renaming compatibility-preserving telemetry event identifiers or changing
  telemetry payload meaning.
- Feature Exit or feature-folder deletion during this Replanning Mode run.

## Use-Case Back-Propagation

- No durable use-case change is expected because this feature is
  behavior-preserving.
- Slice 3 records validation evidence in `TRACEABILITY.md`.
- If implementation reveals that a use-case contract is inaccurate, stop and
  replan the affected boundary before changing that durable contract.
