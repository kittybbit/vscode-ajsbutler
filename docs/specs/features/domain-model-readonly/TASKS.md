# Feature Tasks: domain-model-readonly

## Agent Brief

- Purpose: publish readonly normalized AJS contracts without behavior changes.
- Active slice: S4 Ubuntu CI desktop display provisioning. S1, S2 and S3 are
  committed; their implementation approvals, reviews and matching evidence remain
  valid. S4 requires independent plan review and recorded gate authorization.
- Read first: [SPECS](./SPECS.md), [traceability](./TRACEABILITY.md), Solution
  Shape and boundaries below, and the [SDD policy](../../README.md).
- Validate: S4 exact workflow delta, YAML and configuration-quality evidence;
  actual Ubuntu Verify desktop and web steps after the authorized push. Reuse
  unchanged product validation instead of repeating local host/build checks.
- Prohibitions: no runtime freezing, mutation bypass, DTO/result-wide migration,
  raw/generated parser rewrite, architecture exceptions, or unrelated repairs.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: focused S4 planning commit, then exact approved CI repair.
  PR #329 is published; Verify run 38004546623 fails before desktop tests because
  Ubuntu has no X display. Feature Exit must be renewed after S4 commit and
  current-head Verify and Qlty Cloud pass. Closure Approval remains separate.
- Selected feature: `docs/specs/features/domain-model-readonly`.
- Branch: `codex/domain-model-readonly`.
- Comparison base: `121583496bbf8653a0950ecf16b929aecfadb380` (fixed).
- Gate evidence: independent plan review Ready, no Findings; Human Approval
  received in the current conversation on 2026-10-07. Planning commit
  `2817260eb3338e82185cf1ec9253fa4f1da91553` succeeded.
- Preserved slices: S1 committed; no inherited approval changed.

## Feature Exit review

- Previous recommendation: Do not close. S1-S3 are committed with independent
  Ready reviews and explicit Completion Approvals. Their cross-slice acceptance
  and matching local evidence remain valid. The new S4 CI correction invalidates
  aggregate exit readiness until its gates and actual Ubuntu validation complete.
- Aggregate record: `/private/tmp/domain-model-readonly-exit/evidence.json`.
  Its pre-publication missing-Cloud observation is historical. PR #329 now
  exists; Verify run 38004546623 reports `Missing X server or $DISPLAY` and
  VS Code exits SIGTRAP before tests. Main owns current-head remote Verify and
  Cloud disposition after the authorized corrective push; no Closure Approval
  is inferred.
- Durable propagation: architecture records the readonly published TypeScript
  contract; roadmap removes the completed feature. The S2 testing rule is
  already durable in `docs/specs/README.md`. README needs no change; the S2
  CHANGELOG entry already covers the source-position correction.
- After Cloud passes, Closure Approval must cover exactly
  `docs/specs/architecture.md`, `docs/specs/roadmap.md`, and removal of the
  complete `docs/specs/features/domain-model-readonly/` folder.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-10-07
- Approved scope: exact reviewed S1, S2 and S3 boundaries in this plan, substantive
  identity `54ce103a0f293709125f3c268c10f90d55bac3c0dc99479177d67e15e338a011`.
  This authorizes the focused planning commit and dependent implementation
  sequence; Completion and Closure Approvals remain separate.
- Approved planning paths:
  - `docs/specs/features/domain-model-readonly/SPECS.md`
  - `docs/specs/features/domain-model-readonly/TASKS.md`
  - `docs/specs/features/domain-model-readonly/TRACEABILITY.md`
- Approved implementation paths: exact per-slice runtime/test paths below,
  plus the three selected feature documents for evidence/gate annotations only.
  Exclusions and dependency gates remain in force.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-approval-12158349/evidence.json`.

## S2 narrow replan and renewed Human Approval

- Trigger: partial S2 TypeScript checks each exit 2 with 59 diagnostics. The
  only newly revealed diagnostic outside the approved S2 test paths is
  `src/test/suite/unitListViewHelpers.test.ts:83`, TS2540 on
  `root.children = [child, qjob]`. The remaining 58 diagnostics are in already
  approved S2 paths and remain implementation work, not this replan's scope.
- Main's selected proposal: add only that test file's normalized fixture
  preparation to S2. This is an AjsUnit fixture, not an application DTO.
  Its root/child/QUEUE job feed priority precedence and parent inheritance;
  preserve all three objects, `[child, qjob]` order, parameter values and
  assertions (root/child priority 4, QUEUE priority 3).
- Construction decision: retain an owned local `AjsUnit[]` children buffer,
  supply it through the existing `createUnit` overrides when building root,
  then append the existing child and qjob before constructing/publishing the
  document. No reassignment through `root.children`, mutation cast, changed
  helper algorithm, new fixture abstraction or unrelated test edit.
- Solution Shape: unchanged normalized model/domain owner, constructor/helper
  boundaries and dependency directions. Existing TypeScript and local producer
  arrays suffice. No material abstraction, port, adapter, retained factory,
  public name or runtime contract changes beyond approved S2 readonly work.
- Dependencies: S1 stays SLICE_COMMITTED at
  `80533f721838592b771e51b94ef3cc543bcc6fb2`; both Ready reviews, explicit
  Completion Approval and all matching S1 validation remain valid. S3 scope,
  approval and S2-completion dependency remain unchanged.
- Review/approval renewal: original plan review/approval still proves its
  original identity and original boundaries. It does not authorize the added
  path; the amended S2 boundary returns to PLANNED for a new independent plan
  review and renewed Human Approval before a replan commit/resumption.
  No S2 completion review, approval or final validation exists to preserve.
- Independent replan review: Ready for approval, no Findings; reviewed document
  identity `30f9eb1bc2f36102e4677bbcb113392e3470a95da1ebc7626b93f25ae5a35739`.
  Record: `/private/tmp/domain-model-readonly-s2-replan/review.json`, SHA-256
  `1d8937c5bf5c512415af4ade3c34b3a6ed7d4c6b79561eb9c0e8d470ccabb0c7`.
  Main state/review metadata validation:
  `/private/tmp/domain-model-readonly-s2-replan-ready/evidence.json`.
- Renewed Status: Approved
- Renewed Approved at: approved in current conversation on 2026-10-07
- Renewed Approved scope: exact amended S2 plan reviewed at identity
  `30f9eb1bc2f36102e4677bbcb113392e3470a95da1ebc7626b93f25ae5a35739`,
  adding only `src/test/suite/unitListViewHelpers.test.ts` normalized priority
  fixture construction. All prior S2 exclusions, validations and gates remain;
  original S1/S3 approval and S1 completion remain preserved.
- Renewed approval metadata evidence:
  `/private/tmp/domain-model-readonly-s2-replan-approval/evidence.json`.
- Replan commit: `a169215dd755c274001d1871acbecf87a832a075`; only the two
  approved planning documents committed, staged checks and hashes PASS.
  Held partial product files remained unchanged and unstaged.
- Main replan-commit metadata validation:
  `/private/tmp/domain-model-readonly-s2-replan-committed/evidence.json`.
- Exact approved replan commit paths:
  `docs/specs/features/domain-model-readonly/TASKS.md` and
  `docs/specs/features/domain-model-readonly/TRACEABILITY.md` only, including
  subsequent review/approval metadata separately validated under policy.
  `SPECS.md` requirements and acceptance need no edit.
- Held partial implementation: `src/domain/models/ajs/AjsDocument.ts` and
  `src/test/suite/AjsReadonlyContracts.test.ts` remain byte-for-byte unchanged
  by Replanning and explicitly excluded from the replan commit. The producer's
  S2 IMPLEMENTING annotation and Main's S1 commit metadata are retained in the
  entry documentation snapshot; the amended state records this hold, not
  completed implementation. No product file may be staged with the replan.
- Trigger evidence:
  `/private/tmp/domain-model-readonly-s2-evidence/evidence.json`, SHA-256
  `99e012620815fcd80d70973d594aae71e1c1073c4573cc17880e120130e3d150`;
  partial patch `/private/tmp/domain-model-readonly-s2-evidence/partial-scope-blocked.patch`,
  SHA-256 `99189dd666c16497cc910f62eb6c74737a5c9da15f5af7ebccc0a301c5f15ca5`.
- Validation renewal: preserve S1 evidence and the retained partial S2 failure
  outputs as discovery facts. The added approval path invalidates S2 scope/final
  readiness evidence; resumed implementation must produce required S2 final
  validation after all fixture adaptations, including this priority suite.
  Keep the valid S2 predecessor baseline; this replan changes no required
  command, qlty selection/configuration, host coverage or failure disposition.
- Replan documentation evidence:
  `/private/tmp/domain-model-readonly-s2-replan/evidence.json`.
  Documentation validation only; no product/qlty scan or test rerun in Replanning.

## S2 desktop-validation replan and Human Approval

- Trigger: the P2 relation-fixture correction passes both TypeScript checks,
  one directly selected Mocha test and documented desktop preparation. Actual
  VS Code host logs show full-suite discovery fails on
  `@generate/parser/AjsLexer`; the existing CLI-path launcher returns 0 despite
  that failure. Prior S2 final evidence remains immutable, not full-host PASS.
- Trigger record:
  `/private/tmp/domain-model-readonly-s2-evidence/revision2/revision2-record.json`,
  SHA-256 `7deb7f537182f148e101ec6011fdc138d24e3beec62842d75a58ca74fdcdf56d`.
  Its approved P2 correction patch is
  `/private/tmp/domain-model-readonly-s2-evidence/revision2/fixture-correction.patch`,
  SHA-256 `a40d4994dd43390a1b1950d9f3e089222fd2cc1c17b99a2842cbed15810238af`.
- Main's final candidate adds five exact paths to existing S2, with symbols and
  restrictions listed in S2 below. Runtime alias imports resolve to the same
  generated/resource modules; the actual executable and isolated test globals
  permit the existing CommonJS suite to run and propagate failures.
- Exact discovery: parser lexer/parser imports remain runtime requires after
  CommonJS emit. NLS is loaded by `nls.test.ts`; the syntax resource adapter is
  loaded by that suite and `extensionDependencies.test.ts`. Their resource
  aliases are runtime requires too. `AjsEvaluator` listener/context imports
  and `group10` parameter import are used only as types and erase from emitted
  JavaScript; those two paths are excluded, with no unsolicited normalization.
- `AntlrRawAjsParser` and existing telemetry tests require `DEVELOPMENT` at
  runtime; CommonJS emit supplies no webpack define. Set test-only true to
  match development desktop preparation. `extensionDependencies` tests call
  uninjected `createTelemetry()`; test-only `CONNECTION_STRING = ""` selects
  the existing NoopTelemetryAdapter before SDK construction. No credential,
  telemetry collection change, production fallback or network setup is added.
- Solution Shape: existing parser infrastructure still owns generated/ANTLR
  consumption and raw translation; existing NLS/resource owners keep identical
  imports resolved to neutral resources. No semantic owner, public contract,
  dependency direction, port, adapter, application factory or abstraction
  changes. The desktop launcher/suite own host process failure propagation and
  isolated test constants; shared production never imports Node test tooling.
- Alternatives: retaining aliases plus a custom loader, new dependency or
  webpack test bundling adds configuration/ownership and is excluded. Retaining
  CLI execution or accepting wrapper exit 0 fails the evidence contract.
  Relative runtime imports and the installed test-electron executable API cover
  the concrete gap with existing capabilities. Type-only alias edits add no
  validation value and are excluded.
- Independent replan review: Ready, no Findings; reviewed document identity
  `322cda2f02689e8411c16d9880a9a0148ff8275310603ab2c6022df0ba26b3fb`.
  Review record: `/private/tmp/domain-model-readonly-s2-host-replan-ready/review.json`.
  Main gate metadata validation:
  `/private/tmp/domain-model-readonly-s2-host-replan-ready/evidence.json`.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-08
- Approved scope: exact amended S2 plan reviewed at identity
  `322cda2f02689e8411c16d9880a9a0148ff8275310603ab2c6022df0ba26b3fb`,
  including the five validation repair paths below and the focused planning
  commit of `SPECS.md`, `TASKS.md` and `TRACEABILITY.md`. Completion Approval
  remains separate.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-s2-host-replan-approval/evidence.json`.
- Original S1/S2/S3 approval and committed priority-fixture replan approval above
  remain historical proof of their exact identities; neither authorizes this
  added scope. Independent plan review Ready and explicit Human Approval cover
  this
  added scope; the focused replan commit below permits implementation.
- Proposed replan commit paths: selected `SPECS.md`, `TASKS.md` and
  `TRACEABILITY.md` only. All partial S2 product/test changes, including the
  corrected P2 fixture and untracked `AjsDocumentModel.test.ts`, stay unchanged
  and unstaged by Replanning and are excluded from the replan commit.
- Evidence invalidation: original S1 commit/reviews/Completion Approval stay
  recorded; its wrapper-only full-desktop/architecture-runtime claims are
  unestablished. The repaired full S2 suite must cover S1 and S2 acceptance
  together; this will be current shared coverage, not retroactive S1 PASS.
  S1 TypeScript/web/build/qlty results remain reusable only for matching inputs.
  S3 approval/scope/dependencies stay unchanged. Prior S2 full-host PASS is
  invalid, and changed fixture/parser/resource/runner inputs invalidate affected
  final checks; no S2 final qlty refresh has yet covered the P2 correction.
- Evidence reuse: retain the exact S1-commit S2 baseline, its full inventory,
  configuration/tool identities and matching qlty baseline observations.
  Refresh S2 final full-repository qlty observations/aggregate and affected
  TypeScript, desktop/web preparations/tests, parser/resource/architecture
  coverage and production builds after repair. Do not recreate the baseline or
  refresh unrelated checks merely because this review/approval gate changes.
- Production readiness: required full-suite PASS is mandatory. If the real
  host reveals remaining Table/golden/fixture failures or another loading issue,
  retain actual counts/errors and nonzero status and return to Main; this replan
  authorizes no unrelated repair or failure waiver. Roadmap follow-ups remain
  unchanged pending their separate durable decisions.
- Replan discovery/documentation evidence:
  `/private/tmp/domain-model-readonly-s2-host-replan/evidence.json`.
  Planning performs documentation checks and reuses retained raw trigger facts;
  it does not run a product baseline, full host test or qlty scan.

- Replan commit: `91408b3d2b0f3ba2b902a1075ab7ac0c0250f090`; exact three approved
  planning paths, staged hashes and diff checks PASS. Held product paths stayed
  unchanged and unstaged. Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-s2-host-replan-committed/evidence.json`.

## S2 platform-neutral SDK prerequisite and renewed Human Approval

- Decision: project test launching must remain platform-neutral, following the
  human instruction in the current conversation. The unapproved project-specific
  executable-resolution proposal is withdrawn; it has no review verdict or
  approval. No OS branch, native bundle inspection, plist parsing, guessed path
  or manual executable override is proposed in repository code.
- Trigger: approved five-path repair commit
  `91408b3d2b0f3ba2b902a1075ab7ac0c0250f090` retains its scope. Held changes pass
  both TypeScript checks and desktop preparation, but installed test-electron
  2.5.2 cannot launch current stable: its returned executable is absent. No host,
  architecture or full-suite PASS exists. Trigger artifact:
  `/private/tmp/domain-model-readonly-s2-host-repair-evidence/blocked-evidence.json`,
  SHA-256 `43587ab676301486d36ffce1527193ff8f6c1c1c9ef8bf4b2312aee6514ddb25`.
- Supplied SDK discovery:
  `/private/tmp/domain-model-readonly-test-electron-3.1.0/evidence.json` retains
  the published 3.1.0 package identity, declarations and official resolver;
  `/private/tmp/domain-model-readonly-s2-macos-launch-discovery/evidence.json`
  retains registry engine facts and upstream compatibility references.
  [Upstream issue 349](https://github.com/microsoft/vscode-test/issues/349)
  describes the compatibility gap. The official SDK owns platform differences;
  repository code continues to use its common public download/run APIs.
- Proposed additional implementation paths (one coupled S2 prerequisite):
  - `package.json`: change only development dependency `@vscode/test-electron`
    from `^2.5.2` to exact `3.1.0`, and `engines.node` from `>=20` to `>=22`.
    Exact version matches the reviewed published artifact and repository practice
    for selected test tooling. Keep `engines.vscode: ^1.75.0`, pnpm and scripts.
  - `pnpm-lock.yaml`: generate the SDK importer and necessary dependency closure
    through normal pnpm installation; no manual lock editing, unrelated upgrades
    or changes to the qlty tool/configuration. Inspect resolved changes and stop
    to Main if the required closure exposes another scope/compatibility decision.
  - `.github/workflows/verify.yml`: change only the existing setup-node
    `node-version: 20` to `22`. Keep workflow jobs, selection, package manager,
    frozen installation and existing desktop/web/build commands unchanged.
  - `CONTRIBUTING.md`: update only the current development Node minimum to 22
    and its SDK requirement explanation. Durable Documentation Gate: this is
    reusable contributor setup information owned by this existing entry point,
    not feature history or duplicated lifecycle policy; explicit input scope
    is this minimum/tooling sentence, with unchanged remaining instructions.
- Compatibility boundary: SDK 3.1.0 requires Node >=22, so Node 20 development
  and CI support ends under the approved implementation boundary. VS Code
  minimum and extension desktop/web runtime support remain fixed; no production
  Node-22 API, SDK import or platform-specific code
  may be introduced. The only existing SDK import is the test launcher.
  If investigation shows the tooling engine transition changes extension runtime
  eligibility, stop to Main before implementation rather than raise VS Code.
- Public API mapping: published 3.1.0 declarations retain zero-argument
  `downloadAndUnzipVSCode(): Promise<string>` and `runTests(TestOptions)` with
  `vscodeExecutablePath`, `extensionDevelopmentPath`, `extensionTestsPath`.
  Keep the approved simple launcher using those calls, default current stable
  and catch-to-exit-1. No further `runTest.ts` design change is proposed.
- Solution Shape: official test SDK owns executable discovery and OS adaptation.
  The existing test launcher owns suite launch/failure lifecycle using its
  common API; dependency manifest/lock, Verify CI and contributor setup jointly
  own the Node-22 development prerequisite. Existing SDK capability closes the
  concrete old-helper gap; no custom resolver, new abstraction, port, adapter,
  exported helper, application factory or production dependency direction changes.
  Architecture catalog facts remain separate from semantic review judgments.
- Alternatives: retaining the installed helper cannot launch the observed
  current bundle. Project-specific resolution conflicts with the human's
  platform-neutral constraint; old VS Code pins, CLI/wrapper exit-0 acceptance
  and manual executable configuration would weaken coverage or contributor
  behavior. This proposal chooses the official compatible SDK and coherent
  development/CI minimum rather than hide its Node requirement.
- Acceptance: the four paths agree on SDK 3.1.0 and Node >=22; normal generated
  lock closure and Node-22 frozen installation succeed. Launcher stays free of
  platform branches/bundle inspection and uses unchanged public calls. The
  unchanged actual full desktop command on current stable executes a nonzero
  test inventory and reports actual pass/fail/pending counts; loading/assertion
  failures propagate nonzero exit. Existing isolated global restoration and
  controlled suite-load failure probes remain required. No earlier wrapper-only
  desktop claim is restored, no unrelated fixture failure is waived.
- Validation renewal: record Node 22 runtime, pnpm, SDK/lock closure, package
  engine/API mapping, installed resolved package identities and frozen-install
  outputs. Generate the lock with `rtk pnpm install --lockfile-only`, then
  validate `rtk pnpm install --frozen-lockfile` on Node 22 in the exact final
  snapshot. Run both TypeScript checks, desktop preparation/actual full suite,
  existing failure-propagation/global-restoration probes, web preparation/smoke,
  production desktop/web build and Node-import/architecture checks on the final
  intended inputs. Add targeted workflow YAML validation and Markdown/link
  validation covering CONTRIBUTING plus changed selected docs. Parse Verify YAML
  with the existing `yaml` dependency and inspect that only setup-node changed;
  record the exact successful command and file identity. No OS-specific
  resolver or plist/name/containment probes remain part of acceptance.
- qlty comparability: keep S2 baseline exactly at S1 commit `80533f7`, with its
  original package/lock and actual dependency inputs. Final includes the intended
  approved upgrade and changed docs/workflow; label both manifests truthfully.
  Use identical qlty version, configuration and full-repository selection in
  baseline/final, retaining SARIF, complete inventories and mapped findings.
  Reuse baseline observations only when tool/configuration/inspected inputs and
  coverage match; the owning producer refreshes affected baseline facts if
  required, without relabeling a final dependency installation as old baseline.
  Record intentional SDK/Node/input differences explicitly; if they prevent
  reliable comparison, stop to Main instead of claiming PASS. Refresh final
  observations and aggregate after stable formatting. No qlty dependency change.
- Preservation and approval: original/narrow/five-path approvals remain exact
  historical proof, S1 completion and S3 scope/dependency remain unchanged.
  All 18 held product paths and the P2 fixture correction stayed unchanged during
  Replanning. Prior five-path plan review/approval does not authorize these four
  added paths or the Node-22 minimum. The platform-neutral plan has independent
  review Ready, explicit Human Approval and focused commit
  `20bb4c7c462c3ac3de8f6ed8ca5f16c671521b38`; implementation is now authorized.
  No S2 final completion review/approval exists; final evidence must cover the
  whole S2 diff.
- Independent replan review: Ready, no Findings; reviewed document identity
  `7abce7dd572497335282bc92862e0f3ccdac5d290ec87c458bc6be1c0f282f99`.
  Review: `/private/tmp/domain-model-readonly-s2-sdk-replan-ready/review.json`.
  Main review/state metadata validation:
  `/private/tmp/domain-model-readonly-s2-sdk-replan-ready/evidence.json`.
- Local environment fact: the human confirmed Node 22.22.0 on 2026-10-08.
  No local Node update is needed; SDK, CI and declared development support are
  covered by the approved replan.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-08
- Approved scope: reviewed platform-neutral SDK/Node-22 S2 prerequisite at
  identity `7abce7dd572497335282bc92862e0f3ccdac5d290ec87c458bc6be1c0f282f99`.
  Adds `package.json`, `pnpm-lock.yaml`, `.github/workflows/verify.yml` and
  `CONTRIBUTING.md` only as described below, including Node >=22 development
  and CI support and SDK 3.1.0. The focused planning commit contains only the
  three selected feature documents. No OS-specific project launch code is
  approved. Completion and Closure Approvals remain separate.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-s2-sdk-replan-approval/evidence.json`.
- Exact proposed replan commit paths: selected `SPECS.md`, `TASKS.md` and
  `TRACEABILITY.md` only, with separately validated review/approval metadata.
  Every held product path stays unstaged; none of the four proposed implementation
  paths is edited by this planning operation.
- Documentation validation artifact:
  `/private/tmp/domain-model-readonly-s2-sdk-replan/evidence.json`.
  Planning performs no installation, host download, product test or qlty scan.

- Replan commit: `20bb4c7c462c3ac3de8f6ed8ca5f16c671521b38`; exact three approved
  planning paths, staged hashes and diff checks PASS. All held product paths
  remained unchanged and unstaged. CLI fallback delegated the same role because
  the primary collaboration tool could not start a committer at its thread limit.
  Handoff: `/private/tmp/domain-model-readonly-s2-sdk-cli-commit/handoff.md`.
  Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-s2-sdk-replan-committed/evidence.json`.

## S2 test-side alias resolution and restoration

- Lifecycle state: IMPLEMENTING
- Human direction: resolve aliases in test tooling and restore every relative
  import rewrite made by this work. The unapproved single report-relative-import
  proposal is withdrawn; its Ready review is not approval for implementation.
  `semanticDiffReportText.ts` already uses its original alias and stays unchanged.
- Discovery: `/private/tmp/domain-model-readonly-s2-alias-discovery/evidence.json`
  identifies all seven rewritten imports and the standard tsconfig-paths 4.2.0
  API. The SDK host discovery blocker remains retained at
  `/private/tmp/domain-model-readonly-s2-sdk-evidence/blocked-evidence.json`;
  it proves the missing runtime alias capability, not permission to change
  report behavior. No new product investigation or baseline scan was run here.
- Exact implementation scope:
  - `package.json`: add exact development dependency `tsconfig-paths: 4.2.0`;
    preserve approved SDK 3.1.0, Node >=22 and every other declaration.
  - `pnpm-lock.yaml`: generate only the necessary added dependency closure using
    normal pnpm installation; no handwritten lock changes or unrelated upgrades.
  - `src/test/suite/index.ts`: register standard runtime alias resolution before
    Mocha loads files. Use `register` with compiled root
    `path.resolve(__dirname, "../..")`, mappings `@resource/*` to `resource/*`
    and `@generate/*` to `generate/*`, and `addMatchAll: false`. These map the
    existing TypeScript/webpack source aliases onto their compiled out layout.
    Ordinary packages retain normal resolution. Retain existing Mocha selection,
    assertions, nonzero rejection, test-global initialization and restoration.
    Call returned cleanup on success, loading/assertion failure and initialization
    failure alongside descriptor restoration. Registration failure must reject;
    attempt every applicable cleanup even if another restoration fails, retaining
    meaningful failure information. No exported helper or generic config parser.
  - New `src/test/suite/testAliasResolution.test.ts`: small boundary assertions
    use `require.resolve` to compare both resource and generated-parser aliases
    with expected compiled module paths via ordinary `path.resolve`. Assert
    identical resolved locations without parsing definitions or adding production
    behavior; no new fixture framework or generic helper.
  - `src/infrastructure/parser/AntlrRawAjsParser.ts`: restore the original two
    `@generate/parser/AjsLexer` and `@generate/parser/AjsParser` imports.
  - `src/domain/services/i18n/nls.ts`: restore the four original
    `@resource/i18n/message`, `ty`, `parameter`, `ajscolumn` imports.
  - `src/infrastructure/i18n/ParameterSyntaxResourceAdapter.ts`: restore original
    `@resource/i18n/parameter` import. These three sources return to their exact
    HEAD bytes; only this work's seven rewrites are undone. Do not convert other
    existing relative imports. Restored paths may leave the final product diff
    but remain part of scope/identity inspection.
- Solution Shape: the desktop suite bootstrap owns temporary test-process alias
  registration and cleanup through the established library; application/domain/
  parser/resource ownership and production public contracts stay unchanged.
  TypeScript and webpack retain their existing alias configuration; no production
  loader or dependency is added. The library isolates Node test resolution at
  the test boundary. This concrete CommonJS alias gap earns registration lifecycle
  responsibility, not a new repository abstraction, port, adapter, application
  factory or homemade loader. Platform differences stay with the official SDK;
  no OS branch/native executable fallback is proposed.
- Acceptance: both compiled alias prefixes resolve to the identical generated
  and resource modules, normal packages resolve normally, and all seven source
  imports are restored. Parser, localization/report fallback, telemetry and all
  existing assertions remain unchanged. Resolver/global descriptors return to
  pre-run state on success and every failure path; failed registration/init/load/
  assertions/cleanup never silently pass. Architecture strings and compiled
  fixture content remain untouched. SDK/Node/CI/contributor approvals remain fixed.
- Validation: normal lock generation and Node-22 frozen install, both TypeScript
  checks, desktop preparation and actual full suite including the new alias
  boundary, parser/NLS/resource/report/wiring and architecture suites. Retain
  actual nonzero inventory/counts/results. Existing disposable suite-load failure
  and global-restoration probes additionally check resolver cleanup on success,
  loading/assertion/init/registration failure and ordinary package resolution;
  identify probe-only inputs and restore untouched final suite before PASS and
  qlty scans. No new checked-in probe framework/export is permitted.
  Run existing web preparation/smoke and both builds; web continues using webpack
  aliases and does not bundle desktop registration. Verify production Node/SDK/
  tsconfig-paths imports remain absent. Alias inventories classify expected real
  requires resolved by registered mappings, erased types and fixture strings;
  absence of alias text is no longer acceptance. Full qlty baseline/final and
  stable final aggregate remain required under existing comparison policy;
  original S1-commit baseline stays fixed with truthful original dependencies.
- Preservation/invalidation: all prior actual approval/commit evidence remains
  historical proof; S1 completion and S3 scope/dependency stay unchanged. All
  22 held product paths remain unchanged during planning. The withdrawn report
  proposal's review/readiness no longer authorizes a next gate. Changed dependency,
  bootstrap, boundary-test and restored-import inputs require affected final
  validation and two independent implementation reviews. Matching baseline or
  SDK facts may be reused; prior wrapper-only S1 host coverage stays unestablished.
  Future outside paths, new abstractions or unrelated failures return to Main.
- Independent plan review: Ready for approval, no Findings; reviewed identity
  `77a2930dab9f959001d9cacf1534c9bd3fba084af0c59c6b302cc196ea6c5916`.
  Review record:
  `/private/tmp/domain-model-readonly-s2-test-alias-replan-approval/review.json`.
- Gate: PLAN_COMMITTED; current direct human instruction authorizes this exact
  reviewed boundary and its prerequisite focused planning commit.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-08
- Approved scope: exact seven-path test-side alias resolution/restoration plan
  at the reviewed identity above; only the three selected feature documents
  may enter its planning commit. Completion Approval remains separate.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-s2-test-alias-replan-approval/evidence.json`.
- Exact proposed planning commit paths: selected `SPECS.md`, `TASKS.md` and
  `TRACEABILITY.md` only, including separately validated Main gate metadata.
  All runtime/test/dependency/contributor/workflow paths remain unstaged here.
- Documentation evidence:
  `/private/tmp/domain-model-readonly-s2-test-alias-replan/evidence.json`.

- Implementation evidence (blocked handoff):
  `/private/tmp/domain-model-readonly-s2-test-alias-evidence/blocked-evidence.json`.
  Both TypeScript checks, desktop preparation, the alias-resolution assertion
  observed in the actual host run, and eight external bootstrap lifecycle probes
  pass. The full VS Code suite reached `Flow Viewer Controller`, then emitted
  repeated React “Maximum update depth exceeded” warnings and became
  unresponsive. The run was interrupted after 713 visible success markers and
  no visible failure marker; it produced no final summary or architecture-suite
  result, so desktop coverage is unknown rather than PASS. The failing fixture
  is outside this approved boundary and remains unchanged. Web, production
  build, final qlty observations and aggregate remain pending until Main routes
  this blocker; no S2 completion or readiness claim is made.

- Planning commit: `8fdcbb7ec2df1e51fd60c869dd40e252fbdb7d10`; exact three
  approved planning paths, staged checks and hashes PASS. All 22 held product
  paths remained unchanged and unstaged. Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-s2-test-alias-replan-committed/evidence.json`.

## S2 stable-theme fixture amendment

- Trigger: alias plan commit `8fdcbb7ec2df1e51fd60c869dd40e252fbdb7d10` is
  approved. Actual alias boundary and eight bootstrap lifecycle probes pass;
  both TypeScript checks, desktop preparation and frozen install pass. The
  actual full desktop run shows 713 success markers, then stalls at Flow Viewer
  Controller and is interrupted with exit 130, without a final summary.
  Success markers are partial discovery facts, not full-suite PASS.
- Trigger artifact:
  `/private/tmp/domain-model-readonly-s2-test-alias-evidence/blocked-evidence.json`,
  SHA-256 `5cd3bb2a18159c41ee1ac0c2ac93ee94b05847738de56fe8f2637e568d3c1fc7`.
  Main discovery/source identities:
  `/private/tmp/domain-model-readonly-s2-flow-fixture-discovery/evidence.json`.
- Source facts: unchanged `ControllerFixture` creates a new theme on every
  render. `useFlowGraphState` callback depends on theme; its effect depends on
  that callback and publishes fresh node/edge arrays. This supports an unstable
  fixture identity hypothesis; it is not isolated runtime causal proof.
- Exact proposed implementation path: `src/test/suite/flowViewerController.test.ts`
  only. Create one test-owned theme outside `ControllerFixture`, and pass that
  same instance to `useFlowViewerController` on every render. Preserve every
  fixture definition, nested graph, controller key, event bridge and assertion.
  No production source, hook algorithm, exported contract, golden expectation,
  test selection/skipping, framework or dependency changes are authorized.
- Solution Shape: the existing test fixture owns its stable theme input lifetime.
  Existing `createTheme` and local ownership supply the needed capability; no
  new abstraction/export/port/adapter/factory or layer direction is needed.
  Production controller/theme ownership remains unchanged. Platform-neutral
  launcher, restored aliases, SDK 3.1.0 and Node >=22 approvals remain fixed.
- Acceptance: existing Flow Viewer Controller tests complete with unchanged
  assertions, including the nested-selection/event/graph cases. Record actual
  targeted execution and the completed unchanged full desktop command with
  nonzero inventory and pass/fail/pending summary. The candidate must demonstrate
  resolution of the observed stall; source inspection alone cannot establish
  readiness. A continued stall or another failure returns to Main, not a waiver.
- Validation/evidence renewal: refresh affected test TypeScript/desktop preparation,
  targeted Flow Viewer Controller coverage, actual full desktop suite and final
  qlty observations/aggregate on stable final bytes. Existing S2 required web
  preparation/smoke, both builds, architecture zero exceptions, all S1/S2
  acceptance and resolver/global cleanup/nonzero-failure probes remain required.
  Reuse recorded alias/bootstrap/installation/baseline facts only when their
  actual inputs/coverage/tools/configuration match. Original S1-commit baseline
  stays fixed; no scans are required merely for this planning gate.
- Preservation: all historical approvals and commits, S1 completion and S3 scope/
  dependency stay unchanged. Held current product bytes and all three restored
  original alias sources remain unchanged during planning. The existing alias
  review/approval does not authorize this additional fixture path; a new
  independent plan review, explicit Human Approval and focused planning commit
  precede edits. S2 completion reviews/approval remain pending whole-slice evidence.
- Independent plan review: Ready for approval, no Findings; reviewed identity
  `20466f71487c77b96bdebb69509a4a6a5bee88113f3bb8de9fc174d7bb8de707`.
  Prior stale-current-evidence P2 resolved. Review and gate metadata:
  `/private/tmp/domain-model-readonly-s2-flow-fixture-replan-ready/review.json`
  and `/private/tmp/domain-model-readonly-s2-flow-fixture-replan-ready/evidence.json`.
- Gate: PLAN_COMMITTED; explicit Human Approval received for the added fixture.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-08
- Approved scope: exact reviewed stable-theme fixture amendment at identity
  `20466f71487c77b96bdebb69509a4a6a5bee88113f3bb8de9fc174d7bb8de707`;
  add only `src/test/suite/flowViewerController.test.ts` theme lifetime changes,
  preserving assertions and production code, plus the focused planning commit
  of `TASKS.md` and `TRACEABILITY.md`. Completion Approval remains separate.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-s2-flow-fixture-replan-approval/evidence.json`.
- Exact proposed planning commit paths: selected `TASKS.md` and `TRACEABILITY.md`
  only, with separately validated review/approval metadata. SPECS requirements
  are unchanged. Product/test/dependency/workflow/contributor paths stay unstaged.
- Documentation artifact:
  `/private/tmp/domain-model-readonly-s2-flow-fixture-replan/revision2/evidence.json`.

- Planning commit: `354faf2cea4504c22fc90087aa4d74a9ba267e0a`; exact two
  approved planning paths, staged checks and hashes PASS. All 23 held product
  paths remained unchanged and unstaged. Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-s2-flow-fixture-replan-committed/evidence.json`.

- Implementation attempt: only `src/test/suite/flowViewerController.test.ts` was
  changed. A single test-owned theme instance now remains stable across
  `ControllerFixture` renders; its fixture, event bridge, contract and assertions
  are unchanged. The focused test through the approved suite bootstrap stops
  the prior update-depth loop but fails the existing selected-node assertion at
  `out/test/suite/flowViewerController.test.js:253` (`[]`, expected the nested
  leaf). A separate narrowed diagnostic also exposes an existing
  `out/test/suite/normalizeAjsDocument.test.js:99` relation assertion
  (`[]`, expected `seq` and `con`). Neither test or production behavior was
  edited to address these failures.
- Full desktop attempt: the unchanged full command printed 1,064 success and 69
  failure markers, including the Flow controller assertion and failures across
  unrelated UI, parser/model, telemetry and diagnostics suites. It reached
  Browser accessibility DOM, where the extension host became unresponsive; it
  was interrupted with tool status 130 before a final Mocha summary. The
  architecture dependency suite completed 29 cases with no visible failures.
  These partial markers are not final suite counts or a PASS. Complete raw logs,
  all observed failure names/source mappings, targeted stack traces and
  interruption facts are retained at
  `/private/tmp/domain-model-readonly-s2-flow-fixture-evidence/blocked-evidence.json`.
  Full desktop readiness and final web/build/qlty validation remain pending Main's
  scope decision; no out-of-boundary repair or waiver is made.

## S2 all-test organization amendment

- Input scope/direction: Main record
  /private/tmp/domain-model-readonly-global-test-direction/evidence.json.
  The direct request covers all tests, physical deletion of excess, subsequent
  retained-test repair, necessary-only desktop/web separation and reusable SDD
  testing rules. No new feature/branch or product behavior is proposed.
- Trigger: actual full host showed 69 failure markers and 1,064 success markers,
  then stalled in Browser accessibility DOM and was interrupted with exit 130,
  without final summary. All 29 architecture cases completed within that
  incomplete run. This is discovery, not full-suite PASS or a deletion criterion.
  Immutable producer artifact:
  /private/tmp/domain-model-readonly-s2-flow-fixture-evidence/blocked-evidence.json,
  SHA-256 e14889fd15f5c28aedce23c7ccd87361e976682ca01c7d05614ccfdda780cc3a.
- Complete inspected catalog: 203 src/test files, 192 literal suite groups and
  1,189 test declarations; shared supports/generated fixtures/runners included.
  38 related config/script/sample/requirement inputs are cataloged separately.
  Full cases, line ranges, body/import observations, purpose/oracle/semantic owner,
  KEEP/SIMPLIFY/PHYSICAL_DELETE decisions and common/host-boundary flags:
  /private/tmp/domain-model-readonly-test-reorganization-discovery/catalog.json
  and related-inputs.json in the same directory. MERGE has no selected cases:
  no distinct public behavior is silently folded away merely to reduce counts.
- Exact proposed excess: physically delete
  src/test/suite/webapiImportBoundary.test.ts (both source-substring checks).
  The full architecture catalog remains; real WebAPI use-case/adapter/credential
  behavior remains in the import, command and adapter suites. Remove individual
  cases listed in the ledger: viewerBundle's private Explorer-constant absence
  and navigator.platform bundle-text scan; packageManifest's incidental codicon
  alignment; webapiOpenApiGeneratedArtifacts' Prism server startup/sample
  preferences, generated path suffix, and self-constructed request-key checks.
  There are eight deleted test declarations in total, without a deletion quota.
  Do not skip/comment/exclude these cases; physically remove their bodies and
  newly unused imports/local setup. No other deletion is authorized by this
  ledger; a newly identified distinct deletion decision returns to Main.
- Dead dedicated support: remove Prism server interface/start/port/poll/stop
  helpers, their child_process/net/path imports and unused Prism path export
  from generated jp1Ajs3WebApiMock.generated.ts and only the corresponding
  renderMockFixture output template in scripts/generate-webapi-openapi-artifacts.mjs.
  Keep operation/response fixture data. Keep openapi:mock, its Prism dependency,
  YAML fixture and all developer commands. Generator production API/schema
  output must remain byte-identical; only test mock output changes. Regenerate
  test assets normally and require openapi:check; no handwritten generated code.
- Selected simplifications: normalizeUnitBuilder's whole-object mirror becomes
  semantic field/child/relation/parameter-content assertions, retaining explicit
  source-location coverage in normalization suites. extensionSubscriptions
  removes incidental fixed subscription-count assertion while retaining required
  registration, uniqueness, ownership and disposal behavior. Remaining 1,179
  cases are KEEP for their named use-case/component/architecture contracts.
  Large/deep/cycle/duplicate inputs are retained where they protect documented
  large-input or traversal/identity/error boundaries; no stress removal by size
  alone. Existing DOM shell keyboard/search/focus behavior is retained because
  the use cases explicitly require it; fixtures may be repaired, not discarded.
- Physical organization: keep the existing discoverable test layout and catalog
  each case by behavioral/use-case, architecture, or general component owner.
  Do not create a new test framework or move paths purely for taxonomy. Necessary
  host boundary tests carry an explicit reason in the catalog; common component
  and application tests are not duplicated for desktop/web.
- Exact coupled implementation path set:
  /private/tmp/domain-model-readonly-test-reorganization-discovery/implementation-scope.json.
  It lists all 203 inspected src/test paths plus the existing AjsDocument readonly
  model, package/lock, Verify workflow and CONTRIBUTING approved changes,
  test-only generator template and docs/specs/README.md (210 paths total).
  KEEP files are readable scope for retained-case fixture/observer/expectation
  repairs; no unconstrained new test path, exported harness or production change.
  Unchanged samples/config/requirement docs stay outside edit scope. Restored
  parser/NLS/resource production aliases remain unchanged and inspected.
- Repair order in S2: apply physical deletions/simplifications first; then run
  retained suites and diagnose/fix remaining tests using unchanged use-case,
  domain-rule, privacy and public-component contracts. Correct fixture grammar,
  normalization-owner access, source-metadata expectations, stable React inputs,
  DOM lifecycle/order and event observers only when supported by those contracts.
  The 69 retained failure records are repair inputs, not preset new expected
  values. In particular, relation assertions must use their normalized parent
  owner instead of collecting unrelated child relations; selection assertions
  must observe the defined committed/effect transition instead of an initial
  empty render. Confirm these contrasts against the unchanged contracts; they
  are diagnosis guidance, not permission to erase relation/selection checks.
  Retain useful errors/edge/privacy/host/parser/CSV/list/flow/adapter/type
  boundaries. A real production contract mismatch stops to Main for design;
  never rewrite a use case or weaken a meaningful assertion to fit actual output.
- One completion boundary: cleanup and surviving-test repair cannot be committed
  separately while held readonly tests depend on uncommitted AjsDocument types.
  This expanded S2 includes all already approved partial readonly/tooling/alias/
  fixture work plus organization/repairs/policy. There is no failing interim
  cleanup Completion gate. S2 commits only after complete validation/two reviews.
- Solution Shape: test owners remain their existing use-case/component/architecture
  boundaries; standard Mocha, Testing Library/JSDOM and test alias library supply
  existing capabilities. Test cleanup removes implementation mirrors and unused
  vendor-server lifecycle code, not production capabilities. No new port/adapter/
  application factory, homemade loader, framework or production layer direction.
  The SDD README owns reusable testing rules; semantic judgments and architecture
  catalog execution are separate evidence.
- Durable Documentation Gate: explicitly requested reusable testing policy is
  owned by docs/specs/README.md; edit only a concise Testing Policy subsection
  under Risk-Based Validation And Review. Proposed text:
  - Organize tests around use-case-defined observable behavior, the complete
    architecture rule catalog, and general component/public contract units.
  - Keep distinct valid/error/edge/privacy/compatibility coverage. Remove redundant
    identical assertions, incidental implementation-text mirrors and unjustified
    synthetic permutations/stress; retain purposeful architecture and declared
    configuration checks. Remove excess tests and dead dedicated test support
    physically, with a retained-coverage ledger, rather than skipping them.
  - Test common behavior once. Split desktop/web tests only for a genuine host
    capability, different behavior or adapter boundary; keep required host smokes,
    shared-contract/build compatibility and the zero-exception architecture gate.
  - After cleanup, repair retained tests against their contracts; failures are
    not deletion evidence and production mismatches require scope/design review.
    No duplicate rule update in AGENTS, agent files, use cases or architecture.
    No durable file is edited during planning.
- Validation: original S1 commit 80533f7 is the exact S2 baseline with original
  dependencies; current held-tree manifest is discovery, never a replacement
  committed baseline. Full qlty version/config/selection comparability rules
  remain. Capture all deletions/untracked/changed inputs, before/after case
  inventory, retained-coverage/dead-support/import ledger and cleanup-before-fix
  identities. After cleanup/repairs and before final preparation, use the existing
  platform-neutral clean capability in the disposable final snapshot, or create
  a fresh exact disposable snapshot with no generated test output. Then run the
  unchanged supported preparation/full-run commands. Do not reuse a stale
  out/test tree: deleted source tests must not survive as executable JavaScript.
  Retain the actual compiled discovery inventory and ignored generated-input
  hashes; reconcile discovered tests/cases with surviving source tests and prove
  removed files/cases are absent from executable selection. No skiplist, loader
  or configuration change substitutes for fresh output. Run both TypeScript
  checks, normal/frozen installation as applicable, both preparations,
  completed actual retained full desktop suite with nonzero
  inventory and actual summary, all 29 architecture cases/zero exceptions, alias/
  global cleanup and nonzero-failure probes, web capability smoke and both builds.
  Add openapi:check for changed generator/test output; inspect unchanged production
  generated bytes and retained mock CLI inputs. Selected/doc-policy/CONTRIBUTING
  lint/links/structure and YAML checks accompany full official baseline/final
  qlty observations/inventories and stable final aggregate. Full-suite pass cannot
  be replaced by focused runs or partial markers. Current-head Cloud at Exit stays.
- Preservation/renewal: S1 completion/commit and S3 readonly-index approval/
  dependency remain. Historical S2 approvals retain their exact identities but
  their assertion-preservation constraints are superseded only for this reviewed
  direct-request ledger. The changed entire S2 test/policy boundary needs another
  independent plan review and Main authorization recording from the direct user
  request before plan commit; do not ask again merely because scope is broad.
  Affected previous S2 validation/reviews need renewal; matching baseline,
  install/SDK/alias facts remain reusable only with exact inputs/coverage.
- Independent plan review: Ready for approval, no Findings; reviewed identity
  `2641d1150d5ddeb0f6ab1b4bc81b0266ca824d406d58d6826d7b9c4ec31b0c4e`.
  Review record:
  `/private/tmp/domain-model-readonly-test-reorganization-approval/review.json`.
- Gate: PLAN_COMMITTED; direct human instructions authorize the reviewed expanded
  test/policy scope and its prerequisite focused planning commit.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-08
- Approved scope: exact reviewed coupled S2 organization/physical deletion,
  surviving-test repair and common SDD policy at the identity above, bounded by
  the 210-path implementation manifest, eight deletions and two simplifications
  in the reviewed catalog. Existing readonly/tooling work remains included.
  Planning commit: selected SPECS, TASKS and TRACEABILITY only. Completion and
  Closure Approval remain separate.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-test-reorganization-approval/evidence.json`.
- Proposed planning commit paths: selected SPECS.md, TASKS.md, TRACEABILITY.md
  only; held product and proposed durable-policy bytes remain unchanged here.
- Documentation evidence:
  /private/tmp/domain-model-readonly-test-reorganization-replan/revision2/evidence.json.

- Planning commit: `2d15b09df97583a73fce36abe8a55d1455372963`; exact three
  approved planning paths, staged checks and hashes PASS. All 213 held input
  paths remained unchanged and unstaged. Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-test-reorganization-committed/evidence.json`.

## S2 DOM bootstrap and hash-decoder refinement

- Trigger/discovery: the producer's formal BLOCKED handoff is sealed at
  /private/tmp/domain-model-readonly-test-reorganization-evidence/viewer-handshake-and-input-capability-blocker.json,
  SHA-256 5b8b9d4dea94f477a8d161d17eefa917d6c74f1ee46c53c4414070e901e7dce9.
  Focused search input fails even in an isolated HeaderSearchControl: ReactDOM
  initializes input capability before per-suite JSDOM setup, yielding an empty
  first Enter query and fallback attachEvent/detachEvent errors. Combined suite
  cascade failures are not independent product defects. The diagnostic run
  omitting accessibility (1,122 passes/43 failures) is not canonical full coverage;
  the canonical accessibility run was interrupted at 130 without final summary.
- Main design decision:
  /private/tmp/domain-model-readonly-test-reorganization-main-decisions/decoder-and-dom-replan.json,
  SHA-256 9c6da734579987f539802220063564ba16b78ba550c489032d119393da412680.
  The current implementation remains held at planning HEAD
  2d15b09df97583a73fce36abe8a55d1455372963. Discovery identities are not a new
  committed baseline; fixed S1 validation predecessor 80533f7 remains unchanged.
- Exact scope: the prior 210-path implementation manifest and all catalog
  decisions remain intact. Add only
  src/domain/services/diagnostics/EventDiagnosticRules.ts, making 211 paths:
  /private/tmp/domain-model-readonly-dom-decoder-replan/implementation-scope.json.
  Existing src/test/suite/index.ts owns DOM bootstrap; existing
  src/test/suite/syntaxDiagnosticStringValidators.test.ts owns decoder regression
  cases. No additional dependency, export, helper path, loader or framework.
- Test-bootstrap Solution Shape: the existing test runner owns minimal JSDOM
  initialization before Mocha loads any test modules, so ReactDOM detects normal
  DOM input capability once. Use existing JSDOM and standard descriptor APIs.
  Preserve standard alias registration, normal package resolution, DEVELOPMENT/
  CONNECTION_STRING isolation and ordinary Mocha discovery/loading/failure exits.
  Capture every overwritten DOM global descriptor before changing it; restore
  exact prior descriptors or absence, and close the owned DOM on success, failed
  assertion/module loading, partial initialization and cleanup failure. Attempt
  each applicable alias/global/DOM cleanup even if another cleanup throws; reject
  initialization or cleanup errors rather than hiding them. Existing per-suite
  DOM lifecycles must restore to this runner-owned environment without leakage.
  Node capabilities stay in test tooling; no OS branch or production dependency.
- Decoder Solution Shape: domain diagnostics remains the semantic owner of
  parseHashEscapedQuotedEventStringContent and its unchanged string-or-undefined
  API. The concrete gap is two sequential replacements reinterpreting a decoded
  terminal hash: `"hash##"` produces `hash"` instead of `hash#`.
  After existing quote/regex validation, decode original content in one pass:
  consume each hash-plus-quote/hash pair once; a lone original trailing hash
  retains the existing quote convention. Never interpret an emitted character
  again. Preserve the accepted regex, malformed-value rejection and all other
  content. Standard string iteration suffices; no new abstraction, port, adapter,
  application factory or layer dependency. This is local contract evidence,
  not an independently verified new JP1 source-language interpretation.
- Caller impact/compatibility: evaluateEventDiagnosticViolations consumes helper
  validity and byte length for evusr/evgrp/evwms/evdet/evwfr/evtmc; semanticDiffIdentity
  uses validity/length/nonempty eligibility for te/sc/prm and evwfr. Its fingerprint
  continues to use original parameter.value. Prove accepted/invalid eligibility,
  byte-length boundaries, diagnostics and raw semantic fingerprints remain
  unchanged while decoded pair/repeated-pair content is corrected. Shared domain
  remains browser-safe, VS Code minimum ^1.75.0 and approved Node-22/SDK/alias
  tooling remain unchanged. No diagnostic or semantic-diff change is presumed.
- Preserved behavior: resource/READY observer repairs must follow the actual
  viewer resource handshake and document subscription ordering. The depth-128
  accessibility case still requires 129 rows, one active/tabbable row and deepest
  aria-level 129. Its stall cause is unresolved. Diagnose retained observers
  against these contracts; no deletion, stress reduction, increased threshold,
  assertion weakening or diagnostic exclusion is authorized by this refinement.
- Focused validation before canonical validation: existing quoted-string tests
  cover paired/repeated terminal hashes, mixed escaped quotes, original lone
  trailing hash, malformed/undefined values and meaningful byte-length edges.
  Run relevant diagnostics and semantic-diff eligibility/fingerprint tests.
  Verify early ReactDOM input initialization with isolated input plus retained
  table/flow search/Enter/clear/focus and READY-handshake cases; confirm depth-128
  contract. Extend existing disposable bootstrap lifecycle/failure probes for DOM
  creation/global initialization/module loading/assertion/cleanup failures and
  successful cleanup, exact descriptors/absence, DOM close and alias restoration.
  Do not add a generic probe framework or persist custom runtime resolution.
- Final validation retains the organization amendment's fresh-output requirement,
  compiled discovery/ignored-input hashes and deleted-case reconciliation.
  Require a completed unchanged canonical desktop selection with actual nonzero
  count/final summary and zero retained failures, all 29 architecture cases with
  zero exceptions, both TypeScript checks/preparations/builds, web smoke,
  openapi:check, docs checks and full official baseline/final qlty plus final
  aggregate. Focused/omitted/interrupted diagnostic runs cannot substitute.
  Reuse matching evidence only for unchanged exact inputs and coverage; final
  affected DOM/decoder/full-suite findings require new evidence, no exclusions.
- Documentation evaluation: no new user feature, command, workflow or externally
  observable diagnostic/fingerprint change is intended, so no README/CHANGELOG
  change beyond the already approved reusable SDD testing policy is proposed.
  If retained tests demonstrate an observable production contract change or
  additional path/design need, stop to Main for that decision rather than
  silently broadening this internal decoder correction.
- Preservation/renewal: the committed all-test plan and all previous approvals
  prove their historical identities; they do not approve this additional decoder
  path or changed bootstrap design. Affected S2 plan review/approval and final
  evidence require renewal. S1 completion/commit, S3 approval/dependency, all
  eight physical deletion/two simplification decisions, full architecture catalog,
  common-test/necessary-host split policy and one coupled completion gate remain.
- Lifecycle state: PLAN_COMMITTED. Independent review: Ready for approval;
  reviewed identity b709092210fb13ee13e29345283c3c97448431576456645ef6b6c111019bbba2.
  Review and Main metadata: /private/tmp/domain-model-readonly-dom-decoder-ready/evidence.json.
  Human Approval: Approved at approved in current conversation; exact reviewed
  211-path refinement scope, early DOM bootstrap and single-pass decoder repair.
  Approval evidence: /private/tmp/domain-model-readonly-dom-decoder-approved/evidence.json.
  Focused planning commit: 257d2f82a9a917359c276c35779b2b1eb547c763.
  Main commit-state metadata: /private/tmp/domain-model-readonly-dom-decoder-committed/evidence.json.
  Completion/Closure gates remain separate.
- Planning paths: selected SPECS.md, TASKS.md and TRACEABILITY.md only.
  Held-input and documentation evidence:
  /private/tmp/domain-model-readonly-dom-decoder-replan/evidence.json.

## S2 retained depth-browser and traversal refinement

- Trigger: formal BLOCKED handoff
  /private/tmp/domain-model-readonly-dom-decoder-evidence/revision3/blocked-evidence-final.json,
  SHA-256 a4901100052491ec1f9852fe38e2f94fa7f84671803c386dcc897f358c2dc3d7.
  Reuse its fresh 190-source/190-compiled reconciliation, canonical runner,
  input hashes and raw checks. The diagnostic excluding exactly the two depth
  cases completed 1,182 passes/zero failures, including 29 architecture cases;
  this is matching bounded evidence, not canonical full-suite PASS.
- Main scope/design decision:
  /private/tmp/domain-model-readonly-depth-replan-main/evidence.json,
  SHA-256 44cb66c5d3c2a3703f53add418d15706c982c6c8a87ae156b7a5108a4cdcc60a.
  HEAD 257d2f82a9a917359c276c35779b2b1eb547c763 and feature comparison base
  121583496bbf8653a0950ecf16b929aecfadb380 stay fixed. The trigger's scope
  reference names the historical 210-path catalog; current approved scope is
  the DOM/decoder 211-path manifest. Preserve both identities. S1 commit
  80533f721838592b771e51b94ef3cc543bcc6fb2 remains the validation predecessor.
- Exact proposed scope: existing 211 paths plus webpack.web-test.config.js and
  src/test/fixtures/accessibilityDeepTreeBrowser.tsx (213 total):
  /private/tmp/domain-model-readonly-depth-replan/implementation-scope.json.
  Already scoped accessibilityDom.test.tsx keeps its canonical case/title and
  depth fixture; AjsDocument.ts changes only flattenAjsUnits implementation;
  AjsDocumentModel.test.ts supplies meaningful traversal regressions.
  Existing package.json scripts, Verify workflow and CONTRIBUTING carry only
  necessary browser-bundle preparation/developer instructions. No new dependency,
  lockfile change for this refinement, production caller edit or generic support.
- Browser evidence/owner: the exact depth-128 component/fixture fails in React/
  JSDOM passive-mount stack recursion but succeeds in Chromium 147 with 129
  treeitems, deepest aria-level 129, one selected row and one tab stop, no page/
  console errors. Existing direct Playwright 1.59.1 and webpack/ts-loader/CSS
  loaders are sufficient. @vscode/test-web's existing smoke remains unchanged;
  it launches VS Code web, whereas this canonical Mocha case needs the actual
  browser DOM for a webview component used by both extension hosts. Do not
  duplicate this component contract by extension host.
- Browser Solution Shape: one typed, specialized fixture entry mounts actual
  UnitTreeSelector with ThemeProvider and the existing DTO/options contract.
  The canonical test constructs its existing root/deepest fixture and passes
  serialized units/selected id to the bundle, avoiding a second depth fixture.
  Its test-only exports are mount(rootUnits: FlowGraphUnitDto[], selectedUnitId:
  string): void and dispose(): void, exposed as window.accessibilityDeepTreeFixture.
  Construct the id/parent lookup as in renderTree; keep autoScrollSelectedUnit=false.
  It supplies no fake component, CSS.escape implementation or production export.
  Canonical Mocha launches ordinary headless Chromium through Playwright, loads
  the local fixture bundle, waits for actual rendered treeitems, and asserts 129
  rows, deepest aria-level 129, one selected row and one tab stop. Capture page/
  console errors as failures. Dispose/unmount and close page/context/browser on
  success and assertion/load/launch failure; cleanup errors propagate. No OS
  branch, executable path override, stack tuning, skip or selection filter.
- Browser preparation: extend existing webpack.web-test.config.js with a named
  accessibility target derived from existing editor webpack capability (TSX,
  CSS and resource aliases), preserving its default web-smoke configuration.
  Emit only out/test/fixtures/accessibilityDeepTree.bundle.js as a window library,
  outside \*.test.js discovery. Add package script test:prepare:browser:bundle:
  webpack --config webpack.web-test.config.js --env target=accessibility
  --mode production. Include it after compile in test:prepare and
  test:prepare:desktop; add the same preparation before desktop tests in Verify.
  Existing official pnpm exec playwright install chromium-headless-shell and
  CI --with-deps installation/cache already cover this browser. CONTRIBUTING
  explains that canonical desktop tests now include this browser DOM boundary
  and use that portable install command. No additional browser framework/server,
  esbuild dependency, homemade resolver or product bundle configuration change.
- Browser timeout boundary: change this formerly synchronous depth case to async
  with a finite 30-second Mocha timeout for browser process launch, bundle load
  and cleanup. Depth and all semantic assertions stay unchanged. This distinct
  host startup boundary justifies the execution allowance; it is not a larger
  rendering-depth/stress threshold or permission to accept page errors.
- Traversal discovery: toUnitListDocumentDto calls buildUnitDefinitions and
  buildUnitListProjection. The latter flattens for rows/metadata; every linked
  row resolves findParentAjsUnit -> findAjsUnitById -> flattenAjsUnits, and priority
  helpers also use parent lookup. Thus recursive output copying can recur across
  list conversion. Measured projection 0.818ms/validation 5.461ms versus list
  message 12,966ms is stage evidence, not an exclusive flatten profile. Caller
  lookup/priority behavior stays unchanged; do not presume linear whole-list cost.
- Traversal Solution Shape: existing normalized-model domain owner and
  flattenAjsUnits(readonly AjsUnit[]): AjsUnit[] API remain. Use a local iterative
  preorder traversal with array/index frames and one caller-owned output array.
  Append original unit references once per occurrence, retaining root/sibling
  order and duplicates/shared subtrees on separate ancestry branches. Track only
  current ancestor references, remove them on branch exit, and throw RangeError
  on an ancestor cycle; no global deduplication or tolerant cycle output.
  Preserve reduce's sparse-array behavior by skipping absent indices, not explicit
  undefined/null entries. Empty arrays return a fresh mutable empty array;
  malformed entries/children still fail rather than silently being accepted.
  Do not mutate input/children, add memoized document state, change find helpers/
  callers, publish S3 indexes, or add imports/exports/ports/adapters/factories.
- Focused acceptance: existing AjsDocumentModel/readonly helper contracts plus
  meaningful empty/sparse roots and children, multi-root/sibling preorder,
  duplicate/shared occurrence reference identity, input isolation, ancestor cycle
  RangeError and malformed input failures. Retain the original depth-1500
  flow/list/plain-JSON test, all 1,501 index/row and deepest path/depth assertions,
  and its 10-second timeout. Run that actual test to prove the local traversal
  candidate resolves the failure; a microbenchmark or bounded diagnostic is not
  acceptance. If it still fails or needs caller changes, stop to Main.
- Validation/evidence: focused real-browser canonical case, browser failure/
  lifecycle checks, traversal and existing list/priority/definition/diagnostics/
  semantic-diff boundaries precede the full final checks. Fresh generated output
  and supported preparations must include the browser bundle; hash its source/
  config/bundle and browser version/executable, reconcile all source/compiled
  tests/deletions, and retain canonical unfiltered full desktop counts/summary
  including both formerly blocked cases. All 29 architecture cases/zero exceptions,
  both TypeScript checks, web preparation/Chromium smoke, both builds,
  openapi:check, docs/CONTRIBUTING lint/links/YAML and official full baseline/final
  qlty with stable final aggregate remain required. No exclusions, reduced-depth
  PASS, stale diagnostic totals or alternative runner replace canonical coverage.
- Compatibility/documentation: shared domain remains browser-safe with unchanged
  identities/order, DTOs, diagnostic/fingerprint outcomes and extension engine
  ^1.75.0. Node-22/SDK/alias behavior stays approved. CONTRIBUTING update satisfies
  the Durable Documentation Gate as reusable current browser preparation, not
  branch history. Product README/use cases/SDD testing rule need no new content.
  This internal traversal optimization preserves observable results and exposes
  no new extension behavior, so no CHANGELOG entry is proposed; an actual
  externally observable contract change or uncertain release-note impact returns
  to Main for a human decision before completion.
- Preservation/renewal: S1 completion and S3 approval/dependency, all historical
  approvals, catalog/eight deletions/two simplifications, architecture catalog,
  common-test/necessary-host split policy and one coupled S2 completion remain.
  Prior approval does not authorize the added fixture/config or traversal design.
  Renew affected S2 plan review/Human Approval and final evidence; reuse only
  unchanged input/coverage facts. No failing intermediate completion commit.
- Lifecycle: IMPLEMENTING. Independent review: Ready for approval;
  reviewed identity 2251861847d1e4a79cd56147536e85f90dbf2c2e747aaf155c019df2ab48a7fa.
  Review/Main metadata: /private/tmp/domain-model-readonly-depth-ready/evidence.json.
  Human Approval: Approved at approved in current conversation; exact reviewed
  213-path depth-browser/traversal scope and its preparation/timeout boundaries.
  Approval evidence: /private/tmp/domain-model-readonly-depth-approved/evidence.json.
  Focused planning commit: f889078e7d64e43e44206ecfa58cc882b4f47457.
  Main commit-state metadata: /private/tmp/domain-model-readonly-depth-committed/evidence.json.
  Completion/Closure gates remain separate.
- Planning commit paths: selected SPECS.md, TASKS.md and TRACEABILITY.md only.
  Document/held-input checks: /private/tmp/domain-model-readonly-depth-replan/evidence.json.

## S2 successful-parser UTF-16 position refinement

- Trigger/Main decision:
  /private/tmp/domain-model-readonly-utf16-main/evidence.json,
  SHA-256 fda7adfbc0de3d303b159bfc6348bcc7fc8b8de0698928122119610f3305d183.
  Two independent implementation reviews returned Findings. The primary Finding
  rejects weakening AntlrAjsParser's original header end 23 to observed 22:
  CodePointCharStream token columns were mixed with UTF-16 token/name lengths.
  The consumer creates vscode.Position directly, so the mixed coordinates can
  select wrong source and highlight the wrong semantic-diagnostic parameter.
- Preserve revision7 as historical pre-Finding evidence, not current acceptance:
  /private/tmp/domain-model-readonly-depth-implementation-evidence/revision7/handoff.json
  and evidence.json. The secondary actual-array Finding was repaired within
  approved model/test scope and frozen with four model cases/TypeScript checks:
  /private/tmp/domain-model-readonly-array-finding/freeze-handoff.json,
  SHA-256 81af3ef2b02ff2fd41f6a0abae3856754199ad5db09c9feb623eb700f68ed881.
  Reuse matching mechanical facts; neither artifact proves the future integrated
  parser/array final snapshot. No Completion Approval or completion commit exists.
- Exact proposed scope: approved 213 paths plus
  src/infrastructure/parser/AjsEvaluator.ts,
  src/infrastructure/parser/AntlrRawAjsParser.ts and CHANGELOG.md (216 total):
  /private/tmp/domain-model-readonly-utf16-replan/implementation-scope.json.
  All affected test owners already belong to the prior scope. No normalization,
  adapter/consumer, application/presentation production, grammar/generated,
  dependency/lock, model index or new helper-module path is added.
- Solution Shape/owner: infrastructure parser Ajs3v12Evaluator owns successful
  raw source-coordinate production. Its sole construction site is AntlrRawAjsParser;
  pass original content there as a required evaluator constructor argument.
  Public parser ports/results, normalized models, raw source fields and source
  index schemas retain their names/shapes. Original content never crosses this
  internal parser boundary. No new export, port, adapter, factory or dependency.
- Concrete conversion: retain CharStreams.fromString/CodePointCharStream and
  lexer token acceptance/text. Scan original content once per evaluator/parse
  using browser-safe string iteration, recording only supplementary-character
  code-point columns per affected line. Installed LexerATNSimulator increments
  line/resets column on LF; CR consumes a column before LF. Mirror that counting,
  so both LF and CRLF retain existing lines and UTF-16 offsets. A private
  conversion adds the count of recorded supplementary positions strictly before
  each token's code-point start column (binary search in the sorted line list).
  ASCII/BMP-only lines need no supplementary entry or per-character offset table.
  State remains parse-local and is released with the evaluator after the walk;
  no cross-parse cache, public index or S3 publication.
- Apply start conversion before forming ends: header key/value starts and
  semicolon's start convert first; header end adds existing semicolon.text.length.
  Name end adds existing UTF-16 nameLength to the converted value start.
  Parameter key.column converts its start; key.length remains UTF-16 length.
  Keep raw lines 1-based, columns 0-based and exclusive ends; existing adapter
  only changes line origin. Do not blindly reconvert already mixed end columns
  in toRange or presentation, change token/name/key text, or move raw parser data
  into outer layers. Preserve undefined-source safeguards/parse acceptance.
- Explicit observable impact: header/name/parameter selections and normalized
  semantic-diagnostic columns after supplementary characters become correct
  UTF-16 positions. normalize/unitBuilder preserves that evidence and
  registerDiagnostics uses it unchanged. Diagnostic decisions/rule IDs/messages/
  lengths/severity and raw parameter values remain; ASCII/BMP coordinates and
  source identities/repeated occurrences stay stable. Technical raw syntax-error
  message/shape/charPositionInLine and existing mapped syntax-error position
  behavior are outside this successful-source correction and remain unchanged.
- Meaningful acceptance in existing owners: restore original exact header end
  23 for unit=😀root,,jp1admin,;. AntlrAjsParser.test.ts covers header/name/key
  starts/ends before/after multiple supplementary characters on the same line,
  including a following nested-unit header and following parameter key. Use
  independent source UTF-16 offsets/substrings as the expected-position oracle.
  Cover LF/CRLF and unchanged ASCII/BMP positions as representative contracts,
  not a Unicode permutation catalog. Keep parser malformed/failure tests and
  no-partial-source-index behavior; preserve bounded-large parsing/ASCII input
  and existing deep/wide/duplicate/source-index cases.
- Consumer acceptance: buildSyntaxDiagnostics.test.ts checks a real successful
  parsed semantic violation whose key follows supplementary text, unchanged
  message/rule/length and corrected column. registerDiagnostics.test.ts checks
  its actual vscode.Range key span. semanticDiffExplorerSourceAction.test.ts uses
  the real enriched parser through the existing capture/action harness and checks
  returned/revealed vscode.Range and selected substring for unit-name/parameter
  navigation. No consumer production edit, fake conversion oracle, expected-value
  weakening or generic test framework; existing privacy/stale-source/failure
  contracts remain. Add only these distinct observable regressions.
- Compatibility/performance risks: both shared-host parsers use the same
  browser-safe conversion; no Node built-in, OS branch or VS Code API change.
  Engine ^1.75.0 and approved Node-22/official SDK/alias/Chromium tooling stay.
  Single original-text scan plus sparse supplementary lists avoids repeated
  prefix slicing or full code-point offset arrays per token. Verify typical
  ASCII and affected Unicode bounded-large parsing still pass existing limits;
  do not loosen thresholds. Full quality review must find no new/adverse smell.
- Durable/user-change record: observable source/semantic-diagnostic correction
  requires one minimal CHANGELOG.md Unreleased entry:
  "Corrected UTF-16 source ranges and semantic diagnostic highlights for AJS
  definitions containing supplementary Unicode characters."
  This is a current user-facing correction, not feature history or new JP1
  semantics. README/use-case/architecture/SDD/agent-policy files need no duplicate
  rule or changed behavior contract. The authorized implementation model exception
  changes no role file, approval or validation gate.
- Validation/evidence: after approved implementation, run the focused parser/
  source-index/navigation/diagnostic boundaries and array rejection cases, both
  TypeScript checks and fresh supported preparations. Then canonical unfiltered
  desktop suite including all 29 architecture cases/zero exceptions, retained
  depth/browser/decoder contracts, web preparation/full smoke, both builds,
  openapi:check and scoped docs/CHANGELOG checks. Bind final source/compiled/bundle/
  ignored-input identities and actual suite counts/summary. Reuse exact fixed
  S1 80533f721838592b771e51b94ef3cc543bcc6fb2 baseline only under unchanged
  official qlty version/config/full selection; produce affected final observations
  with all four complete baseline/final SARIF references, native nonzero path
  inventories, same-identity dispositions and stable final aggregate. Revision7
  PASS is discovery for its earlier snapshot, not final parser/array acceptance.
  Require two renewed independent implementation reviews before Completion gate.
- Preservation/renewal: fixed feature base 121583496bbf8653a0950ecf16b929aecfadb380,
  HEAD f889078e7d64e43e44206ecfa58cc882b4f47457, S1 completion and S3 approval/
  dependency remain. All historical approvals, eight physical deletions/two
  simplifications, complete architecture catalog, common-policy/necessary-host
  split, model/decoder/depth/tooling contracts stay intact. Prior approval does
  not authorize the two parser files/CHANGELOG or this changed source-position
  design. Renew affected S2 plan review/Human Approval and final evidence.
- Lifecycle: PLAN_COMMITTED. Independent plan review: Ready, no Findings. Human
  Approval: Approved in current conversation for this exact refinement. Main
  resumes implementation after the focused plan commit.
  Planning commit: `14b0cb233746706b8bda1230d8d0542848b1e858`; exact selected
  three-document paths, staged check PASS, held 762 inputs unchanged.
  Review record: /private/tmp/domain-model-readonly-utf16-ready/review.json;
  reviewed document identity
  `490d5d826612a610b9da6f74c364ba555426416309830f5cd3ebbf4e6234aa64`. A further
  runtime path, helper boundary or contract need returns to Main.
- Renewed Human Approval: Status: Approved; Approved at: approved in current
  conversation. Approved scope: reviewed UTF-16 refinement at document identity
  `490d5d826612a610b9da6f74c364ba555426416309830f5cd3ebbf4e6234aa64`,
  exact 216-path manifest in the planning record, with AjsEvaluator.ts,
  AntlrRawAjsParser.ts and CHANGELOG.md added to the prior 213 paths. Completion
  and Closure Approval are not granted by this plan approval.
- Planning commit paths: selected SPECS.md, TASKS.md and TRACEABILITY.md only.
  Scope supplement, coverage-purpose delta and held-input/document checks:
  /private/tmp/domain-model-readonly-utf16-replan/evidence.json.

## Discovery and impact

- Intake evidence remains at
  `/private/tmp/domain-model-readonly-intake-12158349/evidence.json`.
  Its immutable intake document identity is
  `e57e9d47887d606a1602ce1ebe5a0a57f0ec45ab49544e85ed3ad8e0f6bbf176`.
- Planning discovery and reference hashes are retained in
  `/private/tmp/domain-model-readonly-plan-12158349/evidence.json`.
  Inspection covers normalized exports, direct typed references and collection
  signatures, mutations, parser construction, schedule/calendar aliases,
  Semantic Diff correspondence/projection, DTO copying, relevant test fixtures,
  use cases, architecture, roadmap, package scripts, and check configuration.
- `AjsDocument.ts` owns all normalized leaf and recursive types. Its helpers
  allocate new traversal/filter/value/ancestor arrays; no returned helper array
  is the document's root/child/parameter array. Keep those fresh result arrays
  mutable and their elements readonly; change collection inputs to readonly.
- `normalizeAjsDocument`, `normalizeUnitTree`, `buildNormalizedUnit`, and relation
  normalization build objects and arrays before publication. Warning arrays
  append immutable warning values; generated/raw parser values are separate.
  No producer redesign or deep mutable production model is needed.
- `AjsDocumentIndex.ts` has owned pending/visited/output buffers and mutable
  Map/bucket construction. Its published `byId`, `byPath`, and `indexAjsUnits`
  results expose those buckets; S3 changes only their TypeScript view.
- Schedule interpretation retains the unit and parameter elements; calendar
  selection/evidence uses fresh filtered arrays, substitution copies evidence,
  and ancestor traversal builds its own array. These containers need no blanket
  conversion: model elements become readonly through their existing types.
  `ScheduleCalendarContextIndex` inherits `AjsDocumentIndex`; its unique-group
  predicate currently requires a mutable bucket and must accept readonly.
- Semantic Diff retains normalized references in correspondence/evaluation.
  Its grouping and sorting operate on owned arrays. Schedule projection's
  `lastUnitByKey` already accepts `ReadonlyMap<string, readonly AjsUnit[]>`;
  no new projection adapter or result-contract conversion is needed.
- Flow projection copies leaf values, layout and children into DTOs; Flow
  validation appends DTO relations. Flow parameter/relation types alias the
  normalized leaf types and inherit their readonly fields in S1; DTO arrays,
  hierarchy, layout and UI state retain current mutability. List warnings copy
  normalized warnings. Preserve JSON fields/ordering and current copy behavior.
- Production mutation inspection found owned normalizer warning buffers and
  copied DTO mutation, with no normalized consumer write requiring redesign.
  Fixture writes in S2 are normalized AJS values, chiefly Semantic Diff and
  cyclic/deep index/calendar construction. The newly identified
  `unitListViewHelpers` priority fixture is also normalized and belongs to S2.
  Flow/List DTO, Explorer transport, and webview fixture mutations remain
  separate scenarios and stay unchanged.
- Transitive behavior coverage includes list/CSV/definition, flow/expansion,
  diagnostics/hover/navigation, schedule/semantic comparison/report, WebAPI
  import and telemetry. Ports/host wiring keep their names and shapes; readonly
  domain types propagate through parser-port results without adapter changes.
- `engines.vscode` remains `^1.75.0`. JP1/AJS3 v13 semantics, error/fallback
  handling, source positions, input encodings, ordering and privacy stay fixed.
- README, README.en, CHANGELOG, use cases and domain rules need no planned
  edit: the readonly contract changes no user workflow or runtime compatibility.
  CONTRIBUTING now has the explicitly proposed Node-22 development prerequisite
  above; no other contributor instruction changes. Feature Exit may propagate
  verified reusable
  readonly ownership to architecture and remove the roadmap item through its
  separate closure gate; no other durable edit is proposed.

## Solution Shape

<!-- markdownlint-disable MD013 MD060 -->

| Owner / package / layer                                                    | Public contract and responsibility                                                                                                                                                                                                          | Boundary value and dependency direction                                                                                                                    | Applicable validation                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Normalized AJS model / `src/domain/models/ajs` / domain                    | Existing `AjsDocument`, `AjsUnit`, `AjsParameter`, `AjsRelation`, `AjsNormalizationWarning`, `AjsUnitLayout` and navigation helpers; readonly published values, accepting readonly collections; fresh helper result arrays retain ownership | Stable JP1 identity, structure and raw evidence; no host/parser mechanics. Domain remains independent; parser infrastructure and application depend inward | Compile-only contract examples, normalizer/parser and behavior boundary suites           |
| Normalized lookup / same domain package                                    | Existing `AjsDocumentIndex`, `createAjsDocumentIndex`, `indexAjsUnits`; readonly Map properties, Maps and buckets; local mutable construction                                                                                               | Duplicate-preserving shared lookup, reference/order preservation; no new wrapper/service or changed traversal algorithm                                    | Contract checks; index deep/wide/duplicate/shared/cycle cases; schedule/projection tests |
| Normalization / `src/infrastructure/parser/normalization` / infrastructure | Existing builders return domain types; retain owned warning/children/relation construction buffers                                                                                                                                          | Translation from parser-only `AjsRawUnit` to normalized domain values; imports point inward                                                                | Existing normalized tree/relation/warning/source evidence and parser tests               |
| Parser ports / `src/application/parsing` / application                     | Existing `AjsParserPort`, `AjsParserWithSourceIndexPort` publish the same result containing readonly domain values                                                                                                                          | Existing host-neutral parser contract earns inversion boundary; no port added or signature shape/failure changed                                           | Parser boundary, list/flow/editor/WebAPI use-case tests and type checks                  |
| Consumer projections / application and domain owners                       | Schedule and Semantic Diff keep existing derived-output ownership; Flow/List copy normalized values into their existing DTOs                                                                                                                | Model reference types propagate readonly; no DTO migration, new capability, or layer crossing                                                              | Schedule/semantic suites, DTO serialization and list/flow/CSV/definition boundary tests  |

<!-- markdownlint-enable MD013 MD060 -->

Use TypeScript readonly properties, readonly arrays and `ReadonlyMap`; existing
TypeScript 5.9 and collection capabilities cover the outcome. No custom deep
readonly framework, immutable library, runtime freezer, port, or adapter is
proposed. Existing parser/WebAPI/telemetry adapters keep translation, errors,
compatibility and lifecycle responsibilities; no adapter is added or removed.
Retained application factories keep their existing use-case/composition
responsibilities and invocation sites; no factory is introduced or relocated.
The architecture dependency test checks its import/construction/parser/
telemetry/layer catalog only. Ownership and boundary value above remain
independent reviewer judgments, not claims established by that test.

## Slice order and gates

S1 -> S2 -> S3 -> S4. S1-S3 provide complete compilable contract improvements;
S4 makes the existing desktop validation executable on the selected Ubuntu CI.
Its dependent slice starts only after independent implementation review,
explicit Completion Approval, and the preceding focused completion commit.
Human Approval covers each exact path/symbol boundary below; it authorizes no
implementation until the reviewed plan is committed. Each shared-contract
slice requires two independent implementation reviews using the same evidence.
Every slice may update these three selected feature documents only for its
acceptance, validation and gate index. New scope, dependency, design, affected
paths or failed-check disposition returns through Main for Replanning.

### S1: Readonly normalized leaf values

- Lifecycle state: SLICE_COMMITTED
- Value: prevent edits to parameter evidence, relations, warnings and layout
  through normalized values and existing aliases, independently of hierarchy.
- Dependency: focused approved planning commit.
- Exact runtime path: `src/domain/models/ajs/AjsDocument.ts`, only properties
  of `AjsParameter`, `AjsRelation`, `AjsNormalizationWarning`, `AjsUnitLayout`.
- Exact test path: new `src/test/suite/AjsReadonlyContracts.test.ts`; compile-only
  negative examples in uncalled functions and positive producer assignments.
- Exclusions: document/unit readonly fields/arrays, helper signatures, index,
  parser builders, consumer/DTO fields, fixtures and any configuration.
- Acceptance: every required and optional leaf property rejects assignment;
  nested unit leaf writes and Flow parameter/relation alias field writes reject;
  literal construction, mapping/copies, warning buffer appends and reads compile.
  All 14 properties in the four approved leaf types are covered. Parser/
  normalization, DTO serialization and behavior remain identical. PASS.
- Solution Shape result: existing normalized leaf contracts remain owned by
  the domain model; only TypeScript property modifiers changed. Producers keep
  local mutable construction and Flow aliases inherit the published readonly
  fields. No port, adapter, wrapper, new capability or dependency direction
  changed. The compile-only test checks consumer assignments and producer use.
- Validation: S1's retained artifact originally reported all required commands
  PASS, but its desktop wrapper supplies no actual suite coverage. Full desktop
  and architecture runtime coverage is now unestablished; repaired S2 shared
  validation must cover S1 too without retroactively relabeling its snapshot.
  Matching production/test TypeScript, web preparation/Chromium smoke,
  desktop/web build and qlty evidence remains retained. Final qlty aggregate
  in that historical snapshot PASS; full
  qlty findings map only to unchanged baseline issues after the selected task
  document was formatted. Detailed outputs, host retry and input identities:
  `/private/tmp/domain-model-readonly-s1-evidence/evidence.json`.
- Traceability: existing S1 mapping already names the compile-only contract
  test and required checks; no mapping or result row changed.
- Risks/readiness: TypeScript permits some structural assignment aliases;
  readonly is a published consumer view, never a runtime guarantee. Existing
  Flow leaf aliases intentionally inherit readonly properties; their copied
  containers remain mutable. `engines.vscode` remains `^1.75.0`; no shared host,
  parser, generated code, user documentation or changelog changed. Two
  independent reviews are Ready; Completion Approval received and committed.
- Review/Completion Approval/commit: two independent Ready verdicts / Approved /
  `80533f721838592b771e51b94ef3cc543bcc6fb2`.

### S2: Readonly model, purposeful tests and surviving-test repairs

- Lifecycle state: SLICE_COMMITTED
- Value: publish the recursive readonly contract and establish useful, maintainable
  passing tests organized by use cases, architecture and component contracts.
- Dependency: S1 commit and independently reviewed/authorized focused replan commit.
- Scope/order/acceptance: the exact original catalog, approved 213-path depth
  scope and approved 216-path UTF-16 refinement manifest above define coupled S2.
  Earlier per-fixture assertion constraints remain superseded only by the ledger.
  Preserve original AjsDocument/AjsUnit readonly fields/collections and helper
  readonly inputs with fresh mutable output arrays; no index publication until S3.
  Physically delete excess first, repair surviving tests second, validate the
  complete integrated slice and proposed reusable SDD rule before completion.
- Exclusions: production edits outside AjsDocument, the exact EventDiagnosticRules
  decoder correction and the two successful-position parser owners above;
  generated production schemas, unrelated runtime behavior changes,
  new frameworks/abstractions, OS-specific launch code,
  use-case rewrites, architecture exceptions, skipped/excluded assertions,
  roadmap/README/user workflow changes beyond approved tooling and SDD policy.
- Acceptance: original R1-R5 and revised R6-R8, all meaningful compile-only writes,
  identity/order/navigation/parameter/consumer behavior and coverage ledger.
  Required tests complete with actual final summary, zero retained failures and
  all architecture rules intact; web/build/privacy behavior remains compatible.
- Risks: misleading deletion-based PASS, stale expected values, masked product
  regressions, global React/DOM coupling and dead generated helper recreation.
  The explicit ledger, unchanged oracles, lifecycle probes and two reviews guard
  these risks; a contract/design gap returns to Main instead of being waived.
- Review/Completion Approval/commit: two independent Ready verdicts / Approved /
  `7db1513ba5f5bb8e0fa0d2c8bea25fc27b0356ea`.
- Historical pre-Finding handoff: producer reported IMPLEMENTED/local acceptance;
  subsequent reviews returned Findings as recorded above. Its canonical run had
  1,187 passing and no retained failures, including all 29 architecture cases.
  Both TypeScript checks, preparations, Chromium web smoke and production builds
  PASS. Final qlty has no new/adverse finding; aggregate PASS. Exact substantive
  identity, scope, raw outputs and immutable baseline/final records:
  `/private/tmp/domain-model-readonly-depth-implementation-evidence/revision7/evidence.json`.
  Earlier bounded/blocked host runs remain discovery only, never canonical PASS.

- Current implementation handoff: IMPLEMENTED, integrated local acceptance
  complete after both Findings. Canonical desktop 1,192 PASS including all 29
  architecture cases, both depths and real parser source/diagnostic boundaries;
  both TypeScript checks, preparations, web nine markers and all builds PASS.
  Full official qlty comparison has no new/adverse finding; stable aggregate
  exit 0. Independent review/Completion gates remain pending. One package:
  `/private/tmp/domain-model-readonly-utf16-implementation/final/evidence.json`.

- Final S2 review gate: SLICE_COMMITTED, both reviews Ready, no Findings.
  Completion commit: `7db1513ba5f5bb8e0fa0d2c8bea25fc27b0356ea`; all 80
  approved paths/hashes matched, staged check PASS, post-commit worktree clean.
  Current reviewed evidence:
  /private/tmp/domain-model-readonly-message-fix/revision1/evidence.json.
  Exact tracked patch
  `2c1a4ab4d4d7e2b17455b26e8a254c95496426f4b5d53c65741240c5948fb662`;
  substantive manifest
  `6c7759dfb7ca1c11be86f8e9e13c3eed9f375a8ada9b2c534691737885a63ff3`.
  Review record: /private/tmp/domain-model-readonly-s2-final-ready/reviews.json.
  Completion Approval: Approved; Approved at: approved in current conversation
  for the exact reviewed S2 completion. Substantive identity above plus separate
  ready/approval metadata; no S3 or Closure completion is approved here.
  Approved completion paths: exact changed-path manifest at
  /private/tmp/domain-model-readonly-s2-completion-approved/approved-completion-paths.json.
  The manifest contains 80 paths, with SHA-256
  `ee1cc1c2a4eee90a5e9d42d37a587a31d676b1c65d54e7140beaa5dd823880f6`.

### S3: Readonly published normalized indexes

- Lifecycle state: SLICE_COMMITTED
- Value: close Map/bucket mutation through normalized lookup exposure while
  retaining duplicate matches and efficient local construction.
- Dependency: S2 committed.
- Exact runtime paths: `src/domain/models/ajs/AjsDocumentIndex.ts` and
  `src/domain/schedule/ScheduleCalendarIndex.ts`.
- Exact runtime symbols: `AjsDocumentIndex.byId/byPath` readonly properties
  with `ReadonlyMap<string, readonly AjsUnit[]>`; `indexAjsUnits` publishes that
  Map view; `isUniqueCalendarGroup` accepts readonly arrays and narrows to a
  readonly singleton tuple. Local Map/bucket appends and pending/visited/output
  arrays remain mutable. No traversal implementation change.
- Exact test paths: `src/test/suite/AjsReadonlyContracts.test.ts`,
  `src/test/suite/AjsDocumentIndex.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`.
- Exclusions: `ScheduleCalendarContextIndex.duplicatePath` and schedule outputs,
  semantic projection implementation (its lookup input is already readonly),
  all other paths, runtime freezing/copying and new index abstraction.
- Acceptance: index-property replacement, Map set/delete/clear, bucket index
  assignment/mutators and nested unit writes reject through both model and
  schedule indexes and the `indexUnits` re-export. Mutable builder Maps still
  compile; encounter/key order, duplicate bucket contents and reference identity
  match existing tests. Calendar conflict/cycle/missing-parent resolution and
  semantic schedule occurrence/last-key projection behavior remain unchanged.
- Validation: common commands; desktop run must include index, calendar,
  schedule-impact and presentation-artifact suites with duplicate/ambiguous,
  shared-reference, deep/wide and source-occurrence coverage; web smoke/build
  compatibility. Record complete feature acceptance against S1/S2/S3 evidence.
- Risks/readiness: mutable Map values under `ReadonlyMap` alone would leave a
  hole, so buckets must be readonly too. A readonly Map is the existing Map
  object and retains identity/cost. No user documentation or changelog change.
- Review/Completion Approval/commit: two independent Ready verdicts / Approved /
  `372ad29ef0c0c095080d295179d21471c02eaa2e`. Approved at: approved in current
  conversation for exact reviewed S3
  completion; no Closure Approval is inferred. Exact six approved paths:
  `/private/tmp/domain-model-readonly-s3-completion-approved/approved-paths.json`.
  Review record:
  `/private/tmp/domain-model-readonly-s3-final-ready/reviews.json`.
  Reviewed patch SHA-256:
  `a60e72f023b45936d2c61145e3f347cd7ded2ac708e35815f0b343b3cb00624b`.

- Validation identity: `domain-model-readonly-s3-final-v1`;
  `/private/tmp/domain-model-readonly-s3-implementation/revision1/evidence.json`.
  Exact slice baseline is S2 commit `7db1513`; original S3 Human Approval and
  the S2 completion-commit linkage are retained in the package.
- Acceptance result: individual exposed types reject property/Map/bucket/nested
  writes; mutable builders compile. Existing duplicate-reference/key/encounter
  order, calendar conflict/cycle/missing-parent and schedule occurrence/last-key
  contracts PASS. No runtime traversal, freeze, copying or abstraction change.
- Mechanical result: both TypeScript checks; fresh canonical 1,192 tests and
  all 29 architecture cases; original depth and parser boundaries; nine web
  smoke markers and both production targets PASS. Complete official baseline/
  final quality records agree: three existing check findings and 151 smells,
  152 native invocations/720 analyzed paths, 435 paths in each smells phase.
  Stable final aggregate PASS with no inspected content movement.
- Solution Shape: existing domain model/index/calendar owners and standard
  TypeScript readonly contracts suffice; local mutable construction is retained.
  Semantic ownership/coverage judgments remain for independent reviewers.
- Traceability: existing S3 mappings already cover the changed compile/index/
  calendar tests; no mapping change. No user-facing documentation/CHANGELOG
  change is required. Compatibility and S1/S2 acceptance remain preserved.
- Result metadata is validated separately from immutable substantive scans.
  Human-authorized GPT-6.1-Sol/medium changes no gate. Reviews and explicit S3
  Completion Approval/commit remain pending; Feature Exit follows all commits.

## S4 corrective CI plan

- Lifecycle state: PLAN_APPROVED
- Value and trigger: PR #329 Verify run 38004546623 fails before suite loading
  with `Missing X server or $DISPLAY`; Electron exits SIGTRAP. Ubuntu Actions
  requires a virtual X display to execute the existing real desktop suite.
- Main-selected exact correction: in `.github/workflows/verify.yml`, change only
  the `Desktop extension tests` step from `pnpm run test:desktop:run` to
  `xvfb-run -a pnpm run test:desktop:run`. The existing `ubuntu-latest` job owns
  its display provisioning. The official VS Code
  [Linux CI guidance](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)
  prescribes Xvfb; no custom launcher or platform detection is introduced.
- Dependencies and baseline: S1-S3 retain all committed gates; S3 completion
  `372ad29ef0c0c095080d295179d21471c02eaa2e` is the exact S4 code/configuration
  baseline. The feature comparison base remains `121583496bbf8653a0950ecf16b929aecfadb380`.
- Exact implementation path: `.github/workflows/verify.yml` only, plus selected
  `TASKS.md` and `TRACEABILITY.md` for S4 evidence/gates. No SPECS change: R5/R7
  already require actual desktop/web host validation and portable shared code.
- Exclusions: production/test code, package scripts, dependencies, generated
  artifacts, OS-specific shared launch code, test skipping, architecture rules,
  roadmap/durable propagation and closure. Held durable Feature Exit edits in
  `architecture.md` and `roadmap.md`, and removal of the feature folder, remain
  outside S4 commits. Preserve their exact bytes separately while committing
  S4. Separately validated S3 completion and Feature Exit gate annotations in
  TASKS are allowed in the focused full-TASKS planning commit; they grant no
  durable-propagation or Closure Approval.
- Solution Shape: workflow configuration owns Ubuntu display preparation at the
  outer CI boundary. Existing Xvfb and official VS Code SDK capabilities suffice.
  No public name/contract, semantic layer, dependency direction, material
  abstraction, port, adapter or application factory changes. Architecture tests
  prove their catalog only; reviewers assess this environment-boundary judgment.
- Acceptance: only the exact desktop run line changes; suite discovery, totals,
  failure propagation and Web step remain enabled. On the new pushed SHA,
  Verify must launch VS Code, execute the nonzero full desktop suite and pass
  desktop and web steps. A different remote failure remains a Finding, never
  justification to weaken/skip tests or silently expand this scope.
- Validation: inspect the exact one-line workflow patch; parse workflow YAML
  with the existing `yaml` dependency and assert the selected Ubuntu job,
  desktop command and unchanged Web step; run scoped Markdown/local-link/
  structure checks and `rtk git diff --check`. For implementation configuration,
  record full-repository official baseline/final `qlty check --all --sarif
  --no-fix` and `qlty smells --all --sarif --no-snippets`, using rtk/pnpm exec,
  exact disposable snapshots, nonzero native inventories and complete SARIF;
  compare findings per SDD. Run `rtk pnpm run qlty` only in disposable final.
  Reuse S1-S3 unchanged product checks by matching inputs. Actual Linux display
  acceptance requires the remote Verify run after user-authorized push; macOS
  local launch cannot prove it. Current-head Qlty Cloud remains an exit gate.
- Documentation impact: no README/CHANGELOG update; this fixes CI provisioning
  without altering extension behavior, compatibility or user commands. No new
  test is needed for this one-line declared environment repair.
- Risk: Xvfb must be available in the selected Ubuntu runner. Capture the remote
  command result; any missing tool/new path requires Main disposition and
  Replanning. Shared test entry points and VS Code minimum remain unchanged.
- Review/approval boundary: independent plan review must cover S4 before Main
  records the user's explicit exact correction/commit/push authorization from
  the current conversation. This planner grants no approval. Original S1-S3
  approvals and evidence remain intact; they do not authorize S4 by themselves.
  Two independent implementation reviews and recorded Completion Approval for
  the same exact correction precede focused commit/push; Main assesses the
  user's existing authorization without requesting it redundantly. Pending
  remote host evidence is explicit, not a claimed local PASS. Feature Exit
  review must be renewed after actual remote checks; Closure remains unapproved.
- Replan documentation evidence:
  `/private/tmp/domain-model-readonly-ci-xvfb-replan/evidence.json`.

## Required implementation validation and evidence

The implementer owns one exact disposable baseline/final evidence set per slice.
Planning performs no product baseline. Baseline uses the committed predecessor
(planning commit for S1, previous slice commit for S2/S3); final includes only
that slice's changes and explicitly identified metadata. Record inspected
tracked/untracked/deleted/renamed and relevant ignored generated inputs,
configuration/dependency/tool hashes, approved/actual paths, commands, exits,
raw outputs and exact content identities outside inspected inputs. Reuse matching
results; a failure or missing result cannot establish readiness.

Required commands for each slice, in the applicable exact snapshot:

```sh
rtk pnpm exec tsc -p tsconfig.json --noEmit
rtk pnpm exec tsc -p tsconfig.test.json --noEmit
rtk pnpm run test:prepare:desktop
rtk pnpm run test:desktop:run
rtk pnpm run test:prepare:web
rtk pnpm run test:web:run
rtk pnpm run build
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
rtk pnpm run qlty
rtk pnpm exec markdownlint-cli2 \
  docs/specs/features/domain-model-readonly/SPECS.md \
  docs/specs/features/domain-model-readonly/TASKS.md \
  docs/specs/features/domain-model-readonly/TRACEABILITY.md
rtk git diff --check
```

- TypeScript checks include the compile-only rejected writes, positive producer
  inputs and all transitive consumers. Use `@ts-expect-error` per meaningful
  invalid operation, never `@ts-ignore` or casts erasing the type under test.
- Desktop suite is the existing full Mocha selection and includes
  `architectureDependencyRules.test.ts`. Record its catalog result separately
  from semantic Solution Shape judgments. Web command runs existing Chromium
  extension-host smoke; preparation and production build cover both targets.
- qlty observations run in both exact disposable baseline and final snapshots
  with >=0.645.0, same configuration and full repository selection, all four
  official SARIF 2.1.0 files and nonzero analyzed-path inventories/counts. Run
  the formatting aggregate only in final; it must pass. Apply policy identity,
  severity and metric-direction comparison: new or mapped adverse findings
  are NG; unmatchable signals advisory; unchanged unrelated findings out of
  scope. Do not build a custom parser/comparator. If formatting changes approved
  paths, stabilize/sync and repeat affected observations as policy requires.
- Record `engines.vscode` before/after, touched shared/parser/host surfaces,
  imports/exports/layers, Node-import scan and unresolved cases. Run the scan
  below and classify matches (a no-match search exit is expected). The architecture
  suite retains its full zero-exception catalog.

```sh
rtk rg -n 'node:|from ["\x27](fs|path|os|crypto|buffer|stream|util)["\x27]' \
  src/domain src/application src/infrastructure src/bootstrap src/presentation
```

- Documentation link/structure/scope/traceability and approval-provenance checks
  accompany changed feature docs. Retain evidence through all subsequent gates.
- Inherited roadmap failures are verification risks, not waivers: desktop host
  bootstrap, Table shell, expanded-flow golden, WebAPI fixture reproducibility.
  Before editing each slice, its implementer establishes the relevant current
  baseline and reports any required-check execution failure to Main. Do not use
  a temporary wrapper as supported-command PASS. Only the specifically reviewed
  S2 executable/test-global/runtime-import repair and proposed SDK prerequisite
  are covered here; other harness,
  golden and generated-fixture repairs remain excluded. If commands fail or
  cannot launch,
  readiness is blocked until Main resolves a separately reviewed prerequisite
  or routes a replan with explicit disposition. No failure is pre-approved.
  `openapi:check` is not required here because no WebAPI generated input changes.
- Current-head Qlty Cloud PASS is required before Feature Exit; earlier commit
  CI cannot stand in for that gate. Exit consumes committed slice evidence and
  refreshes only specifically missing/stale integration coverage.

## Validation index

- Intake: `domain-model-readonly-intake-v1`, documentation PASS; artifact above
  retains its inspected identity and corrected search-command exception.
- Plan: `domain-model-readonly-plan-v1`, selected documentation PASS; coverage is
  all three selected feature files, local links/structure, scope, lifecycle,
  traceability and pending approval provenance. Artifact:
  `/private/tmp/domain-model-readonly-plan-12158349/evidence.json`.
- Review: `plan-reviewer` returned Ready for approval with no Findings, reviewing
  substantive document identity
  `54ce103a0f293709125f3c268c10f90d55bac3c0dc99479177d67e15e338a011`.
  Review and separately validated Main gate metadata are retained in
  `/private/tmp/domain-model-readonly-plan-gate-12158349/review.md` and
  `/private/tmp/domain-model-readonly-plan-gate-12158349/evidence.json`.
  Planning validation remains bound to its original substantive identity;
  gate metadata grants no approval and changes no scope or validation command.
- Planning commit: `2817260eb3338e82185cf1ec9253fa4f1da91553`; only the three
  approved planning paths committed; staged checks PASS, worktree clean at
  commit. Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-plan-committed/evidence.json`.
- Implementation: S1 SLICE_COMMITTED; exact S1 paths, acceptance, compatibility,
  Solution Shape result, traceability disposition and review gate are recorded
  above. Reusable validation artifact:
  `/private/tmp/domain-model-readonly-s1-evidence/evidence.json`.
- Product/architecture/qlty checks: completed S2 canonical shared coverage now
  covers S1/S2 acceptance. Historical S1 wrapper-only host claims remain
  unestablished; its original snapshot is not relabeled. Final S2 qlty records
  use the fixed S1 predecessor baseline and stable final substantive snapshot.
- S2 narrow replan: complete reviewable amendment; documentation evidence at
  `/private/tmp/domain-model-readonly-s2-replan/evidence.json`. Held partial
  TypeScript failures remain discovery, never final PASS. S1 gates/evidence
  remain valid; revised S2 requires renewed review, approval and replan commit.
- Desktop-validation replan: complete exact five-path amendment, documentation
  artifact `/private/tmp/domain-model-readonly-s2-host-replan/evidence.json`;
  retains P2 correction and gate history while requiring truthful full coverage.
- SDK prerequisite: reviewed, Human Approved and committed at `20bb4c7`;
  historical SDK-stage install/host-launch and report-alias failure recorded in
  `/private/tmp/domain-model-readonly-s2-sdk-evidence/blocked-evidence.json`.
  Alias registration resolves that loading failure. Its historical stage run
  was incomplete after 713 success markers and interruption 130, recorded in
  `/private/tmp/domain-model-readonly-s2-test-alias-evidence/blocked-evidence.json`.
- Test-side alias amendment: PLAN_COMMITTED; documentation evidence
  `/private/tmp/domain-model-readonly-s2-test-alias-replan/evidence.json`.
- Stable-theme fixture amendment: PLAN_COMMITTED; documentation evidence
  `/private/tmp/domain-model-readonly-s2-flow-fixture-replan/revision2/evidence.json`.
- Global test amendment: PLAN_COMMITTED at 2d15b09; complete catalog and exact
  approved organization scope remain in the discovery directory above.
- DOM bootstrap/hash-decoder refinement: PLAN_COMMITTED at 257d2f82; new scope/
  discovery and held identities are in the refinement section above.
- Retained depth-browser/traversal refinement: PLAN_COMMITTED at f889078e; new
  exact scope and discovery/validation boundaries are in its section above.
- Successful-parser UTF-16 refinement: planning gate PLAN_COMMITTED at `14b0cb2`;
  exact scope/design and renewed approval above, current implementation below.
- Blocking decisions: none for implementation; two renewed independent reviews
  are next. S3 remains dependent on S2 Completion Approval and commit.

## S2 implementation validation and readiness

- Current validation identity: `domain-model-readonly-s2-message-final`;
  `/private/tmp/domain-model-readonly-message-fix/revision1/evidence.json`.
  This delta package links the prior UTF-16 final package and refreshes only
  the exact parser-error message assertion, test types/preparation/canonical
  and full final quality observations. Production/web/OpenAPI checks retain
  matching source, configuration and tool inputs. Fixed-baseline actual message
  `mismatched input '}' expecting ';'` is preserved exactly at line 5/column 0.
  This one package links the fixed S1 `80533f7` baseline, exact final substantive
  manifest/patches, approved 216-path scope, command/tool/config identities,
  raw outputs, all four complete official SARIF files and native inventories.
- Historical revision7 facts remain at its linked artifact above; they predate
  both implementation Findings and do not prove this final candidate. The prior
  array rejection freeze and renewed UTF-16 planning/review/approval/commit
  evidence remain in the refinement section. No historical gate is relabeled.
- Acceptance: required S2 R1-R8 behavior complete; original 203-file catalog,
  eight physical deletions/two simplifications, six model/resolver additions
  and common-policy/necessary-host split preserved. Five distinct UTF-16 cases
  use original source offsets/substrings and real parser consumer boundaries.
  Arraylike root/children rejection extends the existing malformed case.
- Mechanical facts: canonical unfiltered desktop 1,192 PASS; all 29 architecture
  catalog cases PASS, zero exceptions. Both TypeScript checks, desktop/web
  preparations, nine web smoke markers, all production targets, OpenAPI check
  and scoped documentation checks PASS. Original depth-1500/10-second contract
  and actual Chromium depth-128 129-row/aria-129/one-selected/tab-stop contract
  PASS. Canonical 190 source/190 compiled tests and 1,283 ignored output hashes
  are retained for this fresh clean desktop preparation; earlier production
  build/web facts retain their immutable generated-input manifests.
- Quality facts: complete full check baseline four/final three existing findings;
  smells retain 151 mapped identities. The exact official record comparison
  retains only decoder line movement;
  all smell severities and recorded metrics are unchanged. No new or
  adverse finding; finding-triggered check exit 1 retained, aggregate exit 0.
  Native check inventories cover baseline 718/final 720 paths and 152 invocations;
  each smells phase covers 435 paths. Final aggregate changes no inspected bytes.
- Solution Shape result: same domain owns readonly/occurrence/array rejection;
  parser evaluator owns successful UTF-16 source evidence, composed solely by
  the raw parser. Private helpers separate string scanning, supplementary
  evidence, line/column progression and binary search within that owner.
  One browser-safe parse-local scan stores only affected supplementary columns;
  converted starts precede existing token/name/key lengths. No new module,
  exported boundary, port, adapter, factory, S3 index or cross-parse cache.
  Existing framework/library capabilities suffice. These ownership judgments
  require independent review; architecture tests prove their dependency catalog.
- Compatibility/readiness: VS Code `^1.75.0`, Node 22, official SDK 3.1.0,
  platform-neutral launch and restored production aliases remain. Both hosts
  pass; no production Node import, grammar/ANTLR acceptance, parameter value,
  parser-error shape, DTO, telemetry/privacy or runtime-freezing change.
  Successful source/semantic diagnostic columns now fulfill UTF-16 contracts.
  The approved minimal CHANGELOG correction is present; no duplicate README or
  use-case rule is needed. Build size advisories and SDK web shutdown messages
  after passing markers/exit 0 are recorded limitations, not failed assertions.
- Traceability: current mappings cover restored header end 23, LF/CRLF,
  same-line later name/key, bounded Unicode source and actual parser-to-action/
  diagnostic ranges. S3 publication is committed. The linked package retains
  original test-purpose ledger and compact five-case coverage delta.
- Gate metadata: final result/state/evidence annotations are separate from the
  immutable substantive snapshot. Targeted non-mutating Markdown/link/structure/
  scope/diff checks cover the exact metadata patch; annotations require no
  product or qlty rerun. Human-authorized GPT-6.1-Sol/medium changes no SDD gate.
- Next gate: Feature Exit; S3 completion commit
  `372ad29ef0c0c095080d295179d21471c02eaa2e` is recorded. Both
  independent reviewers returned Ready after the message-assertion correction.
  Review record: /private/tmp/domain-model-readonly-s2-final-ready/reviews.json.
  S2 Completion Approval and commit are recorded; S3 dependency is satisfied.
  Current-head Qlty
  Cloud remains the Feature Exit gate. No blocking scope/design decision.

## S1 review and Completion Approval

- Review: two independent `implementation-reviewer` Ready verdicts, no
  actionable Findings; exact substantive patch and validation identities are
  retained in `/private/tmp/domain-model-readonly-s1-review-gate/reviews.json`.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-07
- Approved scope: exact reviewed S1 completion and evidence; substantive tracked
  patch `adabea52232bfa6e4c3f4eca529fd41b0e4f3552e8bffb741c81a52959a95029`
  plus separately validated review and approval gate metadata.
- Approved completion paths: `src/domain/models/ajs/AjsDocument.ts`,
  `src/test/suite/AjsReadonlyContracts.test.ts`, and
  `docs/specs/features/domain-model-readonly/TASKS.md` (S1 evidence and gates).
- Gate metadata validation:
  `/private/tmp/domain-model-readonly-s1-review-gate/evidence.json`.
- This state/review/approval metadata is separate from the immutable substantive
  snapshot reviewed and validated by the implementation roles. It changes no
  scope, specification, acceptance, risk, command or product input.
- Completion Approval metadata evidence:
  `/private/tmp/domain-model-readonly-s1-completion-approval/evidence.json`.
- S1 completion commit: `80533f721838592b771e51b94ef3cc543bcc6fb2`; exact
  approved paths/hash and staged checks PASS; clean worktree at commit.
- Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-s1-committed/evidence.json`.

## S4 exact correction authorization

- Plan review: Ready, both narrow findings resolved; no actionable Findings.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-10.
- Approved scope: the exact Xvfb desktop execution line in
  `.github/workflows/verify.yml`, required S4 planning/evidence metadata,
  focused commits and push to the existing PR. Explicit user instruction
  covers this precise repair; no repeated permission is needed for unchanged
  scope. Completion is recorded after independent reviews. No Closure Approval.
- Plan review identity: `1a48f65524f9b77b6f7cb39a7b5722d49e9a7a1715554e8f959fbb00ebf80196`.
- Approved planning paths: this TASKS and `TRACEABILITY.md` only.
- Gate evidence: `/private/tmp/domain-model-readonly-ci-xvfb-plan-approved/evidence.json`.
