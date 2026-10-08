# Feature Tasks: domain-model-readonly

## Agent Brief

- Purpose: publish readonly normalized AJS contracts without behavior changes.
- Active or approved slice: expanded S2 test organization, physical cleanup,
  surviving-test repairs and durable policy PLAN_APPROVED, coupled to held readonly/
  tooling work. S1 is committed; S3 retains approval and dependency.
- Read first: [SPECS](./SPECS.md), [traceability](./TRACEABILITY.md), Solution
  Shape and boundaries below, and the [SDD policy](../../README.md).
- Validate: retain S1 acceptance/gates and matching non-host evidence; its
  desktop full-suite coverage is unestablished: the theme fixture no longer
  loops, but the current host run stalled in Browser accessibility DOM after
  many failures and has no final summary. See current S2 evidence below.
- Prohibitions: no runtime freezing, mutation bypass, DTO/result-wide migration,
  raw/generated parser rewrite, architecture exceptions, or unrelated repairs.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: focused planning commit for the approved all-test
  organization, then implement cleanup and retained-test repair together.
- Selected feature: `docs/specs/features/domain-model-readonly`.
- Branch: `codex/domain-model-readonly`.
- Comparison base: `121583496bbf8653a0950ecf16b929aecfadb380` (fixed).
- Gate evidence: independent plan review Ready, no Findings; Human Approval
  received in the current conversation on 2026-10-07. Planning commit
  `2817260eb3338e82185cf1ec9253fa4f1da91553` succeeded.
- Preserved slices: S1 committed; no inherited approval changed.

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
- Gate: PLAN_APPROVED; direct human instructions authorize the reviewed expanded
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

S1 -> S2 -> S3. Each slice provides a complete compilable contract improvement.
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

- Lifecycle state: PLAN_APPROVED
- Value: publish the recursive readonly contract and establish useful, maintainable
  passing tests organized by use cases, architecture and component contracts.
- Dependency: S1 commit and independently reviewed/authorized focused replan commit.
- Scope/order/acceptance: the exact 210-path catalog and coupled organization
  amendment above replace prior per-fixture S2 editing/assertion constraints.
  Preserve original AjsDocument/AjsUnit readonly fields/collections and helper
  readonly inputs with fresh mutable output arrays; no index publication until S3.
  Physically delete excess first, repair surviving tests second, validate the
  complete integrated slice and proposed reusable SDD rule before completion.
- Exclusions: production edits outside AjsDocument, generated production schemas,
  runtime behavior changes, new frameworks/abstractions, OS-specific launch code,
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
- Review/Completion Approval/commit: pending / none / none.

### S3: Readonly published normalized indexes

- Lifecycle state: PLAN_APPROVED
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
- Review/Completion Approval/commit: pending / none / none.

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
- Product/architecture/qlty checks: matching S1 non-host evidence is retained;
  its wrapper-only desktop/architecture coverage is unestablished pending actual
  repaired shared S2 results. Historical qlty check/aggregate facts remain bound
  to their exact snapshots; no corrected S2 final refresh yet exists.
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
  Alias registration resolves that loading failure. The latest full host run is
  incomplete after 713 success markers and interruption 130, as recorded in
  `/private/tmp/domain-model-readonly-s2-test-alias-evidence/blocked-evidence.json`.
- Test-side alias amendment: PLAN_COMMITTED; documentation evidence
  `/private/tmp/domain-model-readonly-s2-test-alias-replan/evidence.json`.
- Stable-theme fixture amendment: PLAN_COMMITTED; documentation evidence
  `/private/tmp/domain-model-readonly-s2-flow-fixture-replan/revision2/evidence.json`.
- Global test amendment: PLANNED; complete catalog/proposed edit scope and held
  identities are in the organization discovery directory above.
- Blocking decisions: independent plan review and Main authorization recording
  from the direct all-test/policy request, followed by focused planning commit.
  S3 remains dependent on S2 Completion Approval and commit.

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
