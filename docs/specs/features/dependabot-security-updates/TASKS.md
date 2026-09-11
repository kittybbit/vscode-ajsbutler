# Feature Tasks: Dependabot Security Updates

## Agent Brief

- Purpose: remove known high/moderate vulnerabilities from transitive
  development dependencies without changing extension behavior.
- Approved or active slice: Slice 1 is complete and merged; Replanned Slice 2
  has independent plan review Ready with no Findings and Human Approval
  recorded. Its focused replan commit is pending through `approval-committer`.
  Feature Exit remains blocked by advisory drift and the stale OpenAPI fixture
  follow-up.
- Do not: edit dependencies, lockfiles, runtime code, tests, generated
  artifacts, or configuration before an approved plan is committed.
- Do not: broaden the work into general dependency modernization.
- Read first: `SPECS.md`, this file, `pnpm-workspace.yaml`, `package.json`, and
  the affected portions of `pnpm-lock.yaml`.
- Read `TRACEABILITY.md` when checking advisory and validation coverage.
- Validate planning documents: `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: route this approved Replanning package to
  `approval-committer` for the focused replan commit, then begin Slice 2
  implementation. Keep the stale OpenAPI fixture as a separate WebAPI
  follow-up.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs or validation diaries once they stop being actionable.

## Plan Status

- Status: Slice 1 complete; Slice 2 replanned; Feature Exit blocked
- Planning scope: Slice 1 remains complete. Replanned Slice 2 covers the
  current compatible transitive development-dependency resolution, lockfile
  audit closure, affected-tooling validation, and production-readiness
  evidence.
- Review status: Slice 1 plan and implementation reviews are Ready;
  Replanned Slice 2 plan review is Ready with no Findings.
- Human approval: Approved for Slice 1 and Replanned Slice 2.
- Active implementation slice: None
- Implementation review verdict: Slice 1 Ready; Slice 2 not started

## Human Approval

- Status: Approved for Slice 1 and Replanned Slice 2
- Slice 1 approved at: 2026-08-10 (explicit user approval in Codex)
- Approved scope: Slice 1 — resolve and validate the security-clean development
  graph within the documented dependency and compatibility boundaries; and
  Replanned Slice 2 — resolve the revalidated compatible transitive
  development-dependency floors within the existing override section and
  `pnpm-lock.yaml`, with no direct/production dependency, runtime/test/
  generated-artifact, other-configuration, or VS Code floor changes.
- Approved paths: the three plan-gate documents listed below for the Replanned
  Slice 2 package.
- Plan-gate approved paths are exactly the planning package:
  `docs/specs/features/dependabot-security-updates/SPECS.md`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
- These plan-gate paths are separate from the implementation target paths;
  this approval authorizes only the focused replan commit, not implementation.

This approval was the prerequisite for implementation; Slice 1 completed
independent implementation review and the approved completion gate.

- Replanned Slice 2 plan review: Ready; no Findings.
- Replanned Slice 2 approval: Approved at 2026-09-12 under the existing
  automatic-approval policy for a reviewed slice with no Findings.
- Replanned Slice 2 approved implementation paths are exactly
  `pnpm-workspace.yaml` (existing `overrides` section only) and
  `pnpm-lock.yaml`.
- Replanned Slice 2 focused replan commit: Eligible after this approval;
  `approval-committer` handoff is pending. No implementation has started.

## Completion Approval

- Status: Approved
- Approved at: 2026-08-11 (explicit user completion-approval instruction in
  Codex, conditional on normal task completion)
- Approved scope: Completed Slice 1 implementation, validation evidence, and
  the documented OpenAPI baseline follow-up.
- Approved paths: `pnpm-workspace.yaml`, `pnpm-lock.yaml`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
- Implementation review verdict: Ready
- Commit status: Complete; focused completion-gate branch commit
  `4edda55d`; integrated squash commit `6e94136d` is an ancestor of the
  current branch.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Do not close (2026-09-12 review)
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Resolve and validate the security-clean development graph

- Status: Complete; focused completion-gate branch commit `4edda55d`,
  integrated as `6e94136d`
- Scope:
  - Immediately before resolution, re-query open Dependabot alerts and
    `pnpm audit --json`; use any newer compatible high/moderate advisory floor
    within this feature purpose.
  - In `pnpm-workspace.yaml`, change only the existing affected override
    targets to `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`,
    `undici@7.29.0`, `brace-expansion@1.1.18` and `5.0.9`, and
    `shell-quote@1.9.0`.
  - Regenerate only the necessary `pnpm-lock.yaml` resolution so linkify-it,
    morgan, and nanoid resolve to 5.0.2, 1.11.0, and 3.3.17 respectively under
    their current parent ranges; do not add overrides for those packages.
- User / Domain Value: repository contributors and release workflows use a
  development graph with no currently known high/moderate advisory while the
  extension's product behavior and compatibility contracts remain unchanged.
- Cohesive Change Group: the seven existing security override target updates,
  three targeted transitive lock resolutions, and their unavoidable pnpm peer
  snapshot/integrity consequences form one atomic security-clean resolution.
  Splitting the package families would knowingly leave the shared audit gate
  failing and would not provide an independently complete acceptance result.
- Acceptance:
  - The lockfile resolves all ten package families at or above the revalidated
    security floors and contains no affected retained version.
  - `pnpm audit --audit-level moderate` exits successfully with zero high or
    moderate findings; an unavoidable or newly incompatible advisory is a
    blocker returned to Main.
  - Every changed lockfile entry is attributable to an approved override,
    targeted transitive resolution, or required peer/integrity consequence.
  - Any additional resolution for an affected package family beyond the ten
    selected floors is either explicitly attributable to the approved change
    or is a Replanning blocker.
  - `package.json`, all production dependencies, `engines`, runtime source,
    tests, generated artifacts, README, CHANGELOG, and product behavior remain
    unchanged.
  - After the committed lockfile reaches GitHub and Dependabot reevaluates it,
    alerts 156-176 that are currently open are closed; any remaining/new alert
    is a Feature Exit blocker rather than a dismissal candidate.
- Validation:
  - Record the implementation-time open-alert tuple (number, package, GHSA,
    severity, vulnerable range, first patched version) and audit advisory
    summary before selecting final versions. The same pre-resolution evidence
    must contain an auditable 23-row inventory from that `pnpm audit --json`,
    with one row per advisory and these fields: advisory ID (GHSA, CVE, or
    registry advisory ID), package name, every resolved dependency path,
    severity, vulnerable range, first patched version, mapped security family
    and floor, and the response for that family (selected floor/resolution or
    an explicit Replanning blocker). Reconcile the row count and IDs with the
    raw audit output and retain the raw JSON or a stable evidence reference;
    do not replace this inventory with an aggregate count or the post-
    resolution zero-finding result. The ten family/floor mappings are
    `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`, `undici@7.29.0`,
    `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `shell-quote@1.9.0`,
    `linkify-it@5.0.2`, `morgan@1.11.0`, and `nanoid@3.3.17`; every advisory
    row must map to one of these ten families or be returned to Main for
    Replanning.
  - Reproduce the install prerequisite in `.github/workflows/verify.yml`:
    use pnpm 10.33.0 with the workflow's `actions/setup-node@v4`
    `node-version: 20`, run `pnpm install --frozen-lockfile`, then run
    `pnpm exec playwright install --with-deps chromium-headless-shell` before
    the web test. Record the exact `node --version` patch used (20.x.y),
    `pnpm --version`, platform, and successful Playwright install, and use
    that same Node 20 patch for the remaining validation commands.
  - Run `pnpm install --frozen-lockfile`, inspect the resolved dependency paths
    and parent ranges, assert the ten floors, and review
    `git diff -- pnpm-workspace.yaml pnpm-lock.yaml package.json` for unrelated
    churn and unchanged direct/production declarations.
  - Run `pnpm audit --json` and `pnpm audit --audit-level moderate`; require
    zero high/moderate findings.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
    `rtk pnpm run openapi:check`.
  - Run `rtk pnpm run test:compile` followed by
    `rtk pnpm run test:desktop:run` and explicitly retain the
    `src/test/suite/webapiOpenApiGeneratedArtifacts.test.ts` case
    `serves sample-backed responses through Prism` as the Prism smoke
    evidence. That existing test starts the generated fixture's Prism server,
    waits for `GET /__health` with its 10-second startup deadline, calls
    `GET /ajs/api/v1/objects/statuses` with the sample `Prefer` header, asserts
    HTTP 200 and the expected sample marker, and attempts to stop the server
    in `finally`. Record the cleanup attempt and record an exit/termination
    observation only when the existing helper/test exposes one. With the
    current `stopProcess`, which resolves after its one-second fallback without
    necessarily observing kill failure or process exit, cleanup failure,
    kill failure, or non-termination is not an independently assertable
    validation failure. A health timeout, API assertion failure, or non-zero
    test result still fails validation. Changing `stopProcess`, adding a
    PID-exit assertion, or changing the helper/test to expose termination state
    is a Replanning trigger; no such helper or test change is in this slice.
  - Run `rtk pnpm run build`, `rtk pnpm run test:compile`,
    `rtk pnpm run test:web:run`, matching the Node 20 Verify workflow's
    desktop/web path and its Playwright install prerequisite.
  - Run `pnpm exec vsce ls`, then create a temporary directory with
    `mktemp -d` and an EXIT trap that removes it. Inside that directory run
    `pnpm exec vsce package --out <temporary-dir>/vscode-ajsbutler.vsix` and
    verify the archive with `unzip -t` and its file list with `unzip -Z1`.
    Extract and parse `extension/package.json` as the VSIX manifest, confirm
    its name/version, `engines.vscode`, `main`, and `browser` match the
    repository package, and confirm the packaged file list includes the
    expected bundled entry points and language/syntax assets observed in the
    `vsce ls` output. The temporary-directory EXIT cleanup must be installed
    and exercised on success and failure, and no VSIX or extracted manifest may
    remain in the repository; this shell cleanup is separate from the Prism
    `stopProcess` observation above.
  - After publication of the branch commit to GitHub, re-query Dependabot as
    Feature Exit evidence; this external check cannot be claimed from the
    local implementation diff alone.
- Production Readiness:
  - Status: Ready for implementation review with the documented OpenAPI and
    validation-environment residuals.
  - Failure modes: fail closed on audit findings, resolver failure, unexpected
    lockfile churn, peer mismatch, build/test/tool startup failure, or a
    remaining GitHub alert; do not suppress or dismiss findings.
  - Compatibility: keep VS Code `^1.75.0`, Node `>=20`, pnpm 10.33.0, direct
    parent versions, production dependency declarations, and desktop/web
    entry points unchanged. Record the exact Node 20 patch used by validation;
    undici 7.29.0 retains the current 7.x `>=20.18.1` package engine floor and
    brace-expansion 5.0.9 supports Node 20 or >=22.
  - JP1/AJS and malformed/large input: no parser or runtime path changes are
    permitted; the full desktop/web test path and unchanged source diff are
    regression evidence for existing JP1/AJS behavior.
  - Documentation/release: no README, durable use-case, architecture,
    roadmap, or CHANGELOG update is expected because no observable contract
    changes; re-evaluate at Feature Exit.

### Slice 2: Resolve the revalidated advisory set

- Status: Planned; plan review Ready, Human Approved; focused replan commit
  pending
- Scope:
  - Immediately before resolution, re-query GitHub Dependabot and
    `pnpm audit --json`; preserve the exact 10 current GitHub alert rows and
    all 15 current audit advisory IDs / 16 findings in traceability. The
    current GitHub alert set is 180, 181, 182, 183, 184, 186, 187, 188, 191,
    and 192.
  - In the existing `pnpm-workspace.yaml` `overrides` section, update the
    affected existing targets to `js-yaml@4.3.2`, `fast-uri@3.1.6`, and
    `qs@6.16.0`. Add only scoped remaps for
    `@faker-js/faker@10.4.0` and `@faker-js/faker@5.5.3` to `10.5.0`;
    the latter is an exact `postman-collection` edge and cannot be resolved
    by lockfile selection alone.
  - Regenerate only the necessary `pnpm-lock.yaml` resolution for
    `postcss-selector-parser@7.1.3`, `browserslist@4.28.7`,
    `baseline-browser-mapping@2.11.0`, `@humanfs/node@0.16.8`,
    `morgan@1.12.0`, and `nanoid@3.3.18`, while retaining every completed
    Slice 1 floor. Include only unavoidable package, snapshot, peer, and
    integrity consequences of those approved resolutions.
  - Do not edit `package.json`, direct or production dependencies, runtime,
    tests, generated artifacts, any configuration outside the existing
    override section, or VS Code/Node compatibility declarations.
- User / Domain Value: contributors and release workflows receive a current
  audit-clean development graph, and the newer Dependabot alerts can close
  after publication without changing extension behavior or compatibility.
- Cohesive Change Group: the current advisory families share the same
  transitive lockfile and override boundary; resolving only a subset would
  leave the moderate audit gate failing. The scoped Faker remaps and targeted
  lockfile refresh form one atomic, independently reviewable security slice.
- Acceptance:
  - The resolved graph meets all retained Slice 1 floors and the ten current
    floors in `SPECS.md`, with no affected vulnerable version remaining.
  - `pnpm audit --audit-level moderate` exits successfully with zero high or
    moderate findings, and the low `postcss-selector-parser` finding is also
    absent through the selected `7.1.3` floor. Any advisory outside the mapped
    inventory is a blocker returned to Main.
  - The two scoped Faker remaps remain usable by Prism HTTP and
    `postman-collection`; affected tooling smoke tests pass. A compatibility
    failure is a blocker, not permission to update a direct parent.
  - The current GitHub alerts 180, 181, 182, 183, 184, 186, 187, 188, 191,
    and 192 are eligible for closure only after this committed resolution is
    published and Dependabot is re-queried. Local audit success must not claim
    remote alert closure; a newer post-publication alert is a Feature Exit
    blocker.
  - The implementation diff is limited to `pnpm-workspace.yaml`'s existing
    override section and `pnpm-lock.yaml`; no direct/production declaration,
    runtime/test/generated artifact, other configuration, or compatibility
    contract changes are present.
- Validation:
  - Record the implementation-time GitHub alert tuple and the full
    implementation-time audit mapping: 15 advisory IDs, 16 findings, 10 high,
    5 moderate, 1 low, with package, version, every resolved path, severity,
    vulnerable range, patched floor, and mapped response.
  - Use Node 20 and pnpm 10.33.0, run `pnpm install --frozen-lockfile`,
    assert every floor and parent-range decision, and inspect
    `git diff -- pnpm-workspace.yaml pnpm-lock.yaml package.json` for
    unrelated churn and unchanged direct/production declarations.
  - Reproduce the Verify workflow's web prerequisite after the frozen install:
    with `actions/setup-node@v4`'s `node-version: 20` contract, run exactly
    `pnpm exec playwright install --with-deps chromium-headless-shell`.
    Record the exact `node --version` patch (`20.x.y`), `pnpm --version`,
    platform/architecture, Playwright version, and whether the Chromium and
    headless-shell assets were cached before and after the installer.
    Record a zero exit as installer success; record a non-zero exit, hang,
    timeout, or manual interruption as an environment residual and never as
    successful installation evidence.
  - Run `pnpm audit --json` and
    `pnpm audit --audit-level moderate`; require zero findings at or above
    moderate and no remaining finding from the mapped current set.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, build, test compilation,
    desktop tests, web tests, affected Prism/WebAPI smoke coverage, and the
    existing VSIX archive/content validation. Re-run the relevant paths to
    prove the Faker, Browserslist, CSS, URL, and test-web tooling changes are
    behaviorally compatible.
  - Run the web test after the prerequisite/build steps and record its exit
    status and test output separately from the Playwright installer result.
    A successful `pnpm run test:web:run` (or the Verify-equivalent web test)
    is web-test evidence even when the installer was an environment residual;
    it does not retroactively claim installer success. A failed or incomplete
    web test remains a Slice 2 validation failure.
  - Run `rtk pnpm run openapi:check` as a non-regression observation. The
    known stale `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`
    remains an independent WebAPI follow-up; do not change it in this slice.
    The security slice may complete with that exact residual unchanged, but
    Feature Exit cannot close until the separate follow-up is resolved (or
    Main records the SSOT-approved residual decision).
  - After the implementation commit is published, re-query GitHub Dependabot
    for Feature Exit evidence; this external check is outside local
    completion evidence.
- Production Readiness:
  - Status: Ready for implementation after the focused replan commit through
    `approval-committer`.
  - Failure modes: fail closed on a remaining mapped advisory, new advisory,
    resolver failure, unexplained lockfile churn, peer mismatch, Faker API
    incompatibility, build/test/tool startup failure, or new GitHub alert.
    Do not suppress, dismiss, or ignore findings.
  - Compatibility: preserve `engines.vscode: ^1.75.0`, repository Node
    declaration `>=20`, pnpm 10.33.0, direct parent versions, production
    dependencies, and desktop/web entry points. Faker 10.5.0's Node 20.19
    floor is already present on the current 10.4.0 path; record the exact
    Node 20 patch used.
  - JP1/AJS and malformed/large input: no parser or runtime path changes are
    permitted. Existing desktop/web, Prism, and unchanged-source evidence
    protects product behavior; the stale OpenAPI fixture is not mixed into
    this security slice.
  - Documentation/release: no README, durable use-case, architecture,
    roadmap, or CHANGELOG update is expected because no observable contract
    changes; re-evaluate at Feature Exit.
- Approval Boundary:
  - Replanned Slice 2 implementation paths are exactly
    `pnpm-workspace.yaml` (existing `overrides` section only) and
    `pnpm-lock.yaml`.
  - The three feature documents are the separate plan-gate paths. Slice 1
    completion and approvals are preserved and are not reopened.
  - Stop and return to Main for Replanning if a direct-parent or
    package/runtime/test/generated/configuration change is required, if the
    scoped Faker remap is incompatible, if any lockfile churn is unexplained,
    or if advisory remediation requires dismissal or an approval-boundary
    change.
- Dependencies: Slice 1 completion, prior completion commit, Feature Exit
  findings, independent Slice 2 plan review, and Slice 2 Human Approval are
  preserved. The focused replan commit is pending through
  `approval-committer`; implementation may start only after that commit.
  Slice 2 then requires implementation review, Completion Approval, and a
  focused completion commit before Feature Exit is retried.
- Risks:
  - Scoped Faker remapping moves the exact `postman-collection` edge from
    major 5 to 10; this is the only intentional transitive major-line change
    and must be covered by Prism/package-tool smoke validation.
  - Browserlist's required baseline mapping update and CSS transitive
    updates may produce lockfile churn; every changed package must be
    explained.
  - Existing global js-yaml/qs overrides affect multiple tooling paths; Prism,
    WebAPI, and package validation must detect incompatibility.
  - Dependabot and registry advisories may drift again between planning,
    implementation, publication, and Feature Exit.
- Out of Scope: direct parent upgrades, `package.json` changes, production
  dependencies, runtime/tests/generated artifacts, configuration outside the
  existing override section, Node/VS Code floor changes, general freshness,
  advisory suppression, stale OpenAPI fixture repair, and Feature Exit
  propagation/removal.

## Implementation Evidence

- Changed files are limited to the approved implementation paths:
  `pnpm-workspace.yaml` and `pnpm-lock.yaml`. `package.json`, production
  dependencies, runtime source, tests, generated artifacts, and user-facing
  documentation were not changed. Existing pnpm changes remain in the
  worktree and were not reverted.
- Security baseline and result: 17 open Dependabot alerts (11 high and
  6 moderate); before-resolution `pnpm audit` reported 23 advisories
  (17 high and 6 moderate); after resolution the audit reported 0, and
  `pnpm audit --audit-level moderate` succeeded.
- GitHub API re-query evidence is fixed in `TRACEABILITY.md` as an
  immutable 17-row open-alert table containing each alert number, package/path,
  GHSA, severity, vulnerable range, first patched version, selected floor or
  response, and stable repository URL. The 2026-09-12 Feature Exit requery
  found 10 newer open alerts; the current findings are recorded in the Feature
  Exit Revalidation section below and require Replanning.
- All ten selected security floors are met:
  `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`, `undici@7.29.0`,
  `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `shell-quote@1.9.0`,
  `linkify-it@5.0.2`, `morgan@1.11.0`, and `nanoid@3.3.17`.
- Environment and validation: Node `20.20.2` with pnpm `10.33.0`; frozen
  install succeeded and all compatibility floors were met. `qlty`, build,
  test compilation, and desktop tests succeeded. `pnpm run test:web` exited
  0; existing `ECONNRESET`/`Premature close` logs were observed without a
  failing exit status.
- Playwright `1.59.1` and the Chromium/headless-shell assets were already
  cached. `playwright install --with-deps` was attempted, produced no output,
  hung, and was manually interrupted; this is recorded as a validation
  environment residual, not as a successful install result.
- VSIX evidence: the normal `vsce ls`/package dependency detection path
  failed because npm reported missing nested development dependencies in the
  pnpm layout. The approved package check therefore used
  `vsce package --no-dependencies` in a temporary directory; archive test,
  file-list inspection, manifest validation, and temporary cleanup succeeded.
- `pnpm run lint:md` succeeded for 35 files with 0 errors.
- `openapi:check` failed only because
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is
  a stale baseline. The generated artifact and generator were not changed.
  This remains a separate follow-up owned by Main/the existing WebAPI
  maintainer, or a Feature Exit follow-up; it is not part of this Slice 1
  document-only synchronization.

## Main Validation-Equivalence Decisions

- Web compatibility objective: `playwright install --with-deps` attempted
  environment-dependent OS dependency installation but stopped with no output.
  Playwright `1.59.1` and the Chromium/headless-shell assets were already in
  the cache, and the same Node `20.20.2`/pnpm `10.33.0` environment completed
  `pnpm run test:web` with exit 0, including its `pretest:web` build and test
  compilation. Main therefore accepts the web compatibility objective as
  validated by the real web test; the installer handoff is an environment
  follow-up.
- Archive/package-content objective: normal `vsce ls`/package dependency
  detection misidentified the pnpm layout and reported missing nested dev
  dependencies. The extension uses webpack-bundled assets and does not need
  `node_modules` in the VSIX. Main therefore approves the temporary
  `vsce package --no-dependencies` archive as validation-equivalent after
  successful unzip, manifest, content, and cleanup checks.

## OpenAPI Follow-up

- Owner: Main will hand off the stale generated fixture to a separate task or
  the existing WebAPI maintainer.
- Route: handle it as separate work before Feature Exit; exclude it from Slice
  1 and do not modify the generated artifact in this slice.
- Done condition: `pnpm run openapi:check` exits 0 and
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`
  matches the generator output.

## Implementation Feedback

- The pnpm layout can make normal VSCE dependency detection report missing
  nested dev dependencies even when the approved temporary no-dependencies
  package path succeeds. Future packaging validation should retain both the
  failure context and the explicit fallback path.
- A cached Playwright browser does not guarantee that
  `playwright install --with-deps` will complete in the validation
  environment; the command may hang without output and requires an explicit
  residual record when interrupted.
- `lint:md` is a useful low-cost document gate for this feature: the recorded
  result is 35 files with 0 errors.

## Remaining Items And Handoff

- Implementation review verdict: Ready; Completion Approval and the focused
  completion-gate branch commit are complete. The integrated squash commit is
  `6e94136d`.
- GitHub Dependabot closure was rechecked on 2026-09-12 and found 10 newer open
  alerts. A fresh local audit re-query found 15 advisory IDs and 16 findings,
  so the advisory drift is a Replanning blocker rather than a closure
  candidate. Replanned Slice 2 is independently reviewed Ready with no
  Findings and Human Approved; the next route is its focused replan commit
  through `approval-committer`.
- The stale OpenAPI fixture baseline is unresolved and must be handled by
  Main/the existing WebAPI maintainer as a separate task or Feature Exit
  follow-up. No generated artifact change is included here.

- Approval Boundary:
  - The exact plan-gate approved paths are the three feature
    documents: `docs/specs/features/dependabot-security-updates/SPECS.md`,
    `docs/specs/features/dependabot-security-updates/TASKS.md`, and
    `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
    The Replanned Slice 2 package has independent review `Ready`, no Findings,
    and Human Approval recorded; it is eligible for the focused replan commit
    and remains uncommitted pending `approval-committer`.
  - The separate Slice 1 implementation target paths are only
    `pnpm-workspace.yaml` and `pnpm-lock.yaml`. `package.json`, direct parent
    declarations, production/runtime/test code, generated artifacts, and
    all other paths remain outside the implementation slice.
  - Human Approval applies independently to Replanned Slice 2 after its
    independent review returns `Ready`; the approved planning package must be
    committed before implementation.
  - Stop for Replanning, do not stage or commit, and return the exact diff and
    explanation to Main if resolution requires a new direct-parent,
    `package.json`, production dependency/runtime/test/generated artifact,
    other configuration, compatibility-floor, or approval-boundary change, or
    advisory dismissal. The same stop condition applies when any `package`,
    `snapshot`, `integrity`, or `peer` lockfile diff is not explained by the
    approved override, targeted resolution, or unavoidable peer/integrity
    consequence, or when an additional resolution remains for an affected
    family beyond the planned floors.
- Dependencies: Slice 1 Feature Intake, plan review, Human Approval,
  implementation review, Completion Approval, and completion commit are
  complete and preserved. Replanned Slice 2 has independent plan review Ready
  with no Findings and Human Approval recorded; it now requires the plan-gate
  commit, implementation review, Completion Approval, and completion commit.
  Feature Exit remains blocked until Slice 2 and the separate OpenAPI
  follow-up are resolved.
- Risks:
  - A global js-yaml override continues to place 4.x on two legacy 3.x parent
    ranges; this is existing branch behavior, not a new major-line change, but
    Prism/textlint/OpenAPI validation must detect incompatibility.
  - PostCSS/nanoid and peer snapshots can cause wider lockfile churn; every
    changed package must be explained or removed from the diff.
  - Build, VSCE, Prism, and test-web paths execute the affected development
    packages differently, so audit success alone is insufficient.
  - Registry or advisory drift can raise a floor after planning; compatible
    drift remains in scope, while an incompatible fix triggers Replanning.
- Out of Scope: broad dependency freshness, direct-parent updates, new
  persistent overrides for linkify-it, morgan, or nanoid, direct dependency
  declarations, production/runtime/test/generated-source edits, behavior
  changes, engine changes, configuration outside the existing override
  section, alert dismissal, README/CHANGELOG changes, stale OpenAPI repair,
  and Feature Exit work.

## Planning Inputs

- Planning re-query on 2026-08-10 found 17 open Dependabot alerts: 11 high and
  6 moderate across js-yaml, postcss, fast-uri, undici, brace-expansion,
  shell-quote, linkify-it, and morgan.
- `pnpm audit --json` found 23 advisories: 17 high and 6 moderate. In addition
  to the open-alert set it includes two newer brace-expansion floors and two
  nanoid findings, establishing the ten selected floors in `SPECS.md` R2.
- Immediate-parent ranges admit every selected patch. Existing 4.x js-yaml
  parents use `^4.1.0`/`^4.1.1`; fast-uri uses `^3.0.1`; PostCSS uses
  `^8.4.40`; undici uses `^7.12.0`; brace-expansion uses `^1.1.7`/`^5.0.2`;
  shell-quote uses `^1.6.1`; linkify-it uses `^5.0.1`; morgan uses `^1.6.1`;
  and PostCSS 8.5.23 uses `nanoid@^3.3.16`.
- Direct-parent updates are wider and do not solve the complete graph:
  `@stoplight/prism-cli` 5.16.0 raises its declared Node engine to
  `>=24.18.0`, while `@vscode/test-web` 0.0.81 retains
  `koa-morgan@^1.0.1`. The selected minimum is existing-override target updates
  plus targeted lockfile resolution, with no `package.json` change or new
  override.
- Replanning re-query (2026-09-12) found 15 audit advisory IDs and 16
  findings: 10 high, 5 moderate, and 1 low. The current mapped floors are
  `@faker-js/faker@10.5.0`, `@humanfs/node@0.16.8`,
  `baseline-browser-mapping@2.11.0`, `browserslist@4.28.7`,
  `fast-uri@3.1.6`, `js-yaml@4.3.2`, `morgan@1.12.0`, `nanoid@3.3.18`,
  `postcss-selector-parser@7.1.3`, and `qs@6.16.0`; the low family is
  included only because it is current GitHub alert 180 and is resolved by the
  same CSS-toolchain update. The 10 GitHub alerts are mapped in
  `TRACEABILITY.md`.

## Impact And Risks

- Build risk: PostCSS and nanoid are under CSS Loader and can affect desktop
  and web bundling.
- Tooling risk: js-yaml and fast-uri are under Prism/VSCE-related tooling;
  undici, linkify-it, and brace-expansion are under VSCE packaging paths.
- Test risk: morgan is under `@vscode/test-web`; shell-quote and
  brace-expansion participate in test/lint script orchestration.
- Replan test risk: Faker 10.5.0 is applied to both the Prism HTTP `^10.4.0`
  edge and the exact `postman-collection` 5.5.3 edge. Prism/package-tool
  smoke coverage must detect an incompatible API or behavior change.
- Resolution risk: lockfile updates can change additional compatible
  transitive versions. The plan must distinguish required consequences from
  unrelated churn.
- Advisory drift risk: `pnpm audit` already reports newer findings than the 17
  GitHub alerts. Validation must use the current advisory set, not only the
  intake snapshot.
- Compatibility risk: undici 7.29.0 retains the current undici 7.x
  `>=20.18.1` engine floor; brace-expansion 5.0.9 supports Node 20 or >=22.
  Faker 10.5.0 requires Node 20.19 or newer, which is already required by the
  current 10.4.0 path. Existing Node 20 CI must be exercised with its exact
  patch recorded.

## Traceability

- TRACEABILITY.md required: yes
- Reason: multiple advisory families and several independent tooling paths
  require explicit correspondence between security requirements, the future
  plan, and audit/build/desktop/web validation.

## Feature Exit

- Definition of Done status: not satisfied. Slice 1 implementation,
  independent review, Completion Approval, and the focused completion-gate
  branch commit are complete, but the current graph has new high/moderate
  advisories and `openapi:check` still reports a stale generated fixture.
- Durable documentation updates: none expected beyond temporary feature
  artifacts; re-evaluate README and CHANGELOG impact at exit.
- Roadmap propagation: not required; this remains transient dependency
  remediation and no repository-level product ordering or future work changed.
- Open risks: current advisory drift requires Replanning; the stale OpenAPI
  fixture remains a separate follow-up owned by Main/the WebAPI maintainer.
- Feature Exit review date: 2026-09-12
- Feature Exit recommendation: Do not close

## Validation

- [x] Security evidence recorded: 17 open Dependabot alerts (11 high/6
      moderate), 23 pre-resolution audit advisories (17 high/6 moderate), and
      0 post-resolution audit findings; moderate audit succeeded.
- [x] Node `20.20.2`/pnpm `10.33.0` frozen install succeeded and all ten
      security floors were met.
- [x] `qlty`, build, test compilation, desktop tests, and web tests completed;
      `pnpm run test:web` exited 0 with only existing connection/close logs.
- [x] `pnpm run lint:md` completed for 35 files with 0 errors.
- [x] VSIX temporary `--no-dependencies` package archive, list, manifest,
      content validation, and cleanup succeeded after normal pnpm-layout
      dependency detection failed.
- [x] Confirm no production source, generated artifact, user documentation, or
      behavior-contract update is required.
- [x] `openapi:check` executed; its only failure is the stale generated WebAPI
      fixture baseline recorded above and assigned as follow-up.
- [x] Feature Exit validation and durable-document evaluation completed;
      closure is blocked by the current audit/Dependabot findings and stale
      OpenAPI fixture.
- [ ] Replanned Slice 2 audit, floor assertions, lockfile-diff explanation,
      and affected-tooling validation complete.
- [ ] Replanned Slice 2 independently reviewed, Human Approved, implemented,
      reviewed, Completion Approved, and committed.

## Feature Exit Revalidation (2026-09-12)

- GitHub currently reports 10 open Dependabot alerts: 180, 181, 182, 183,
  184, 186, 187, 188, 191, and 192. The original alerts 156-176 are no
  longer open, but these newer alerts supersede the implementation-time
  security floors under R3 and require Replanning within this feature purpose.
- Current `pnpm audit --json` re-query reports 15 advisory IDs affecting 16
  resolved vulnerability findings: 10 high, 5 moderate, and 1 low. The
  high/moderate
  findings are `nanoid` 3.3.17 (GHSA-2v37-7h3g-55p8), `browserslist` 4.28.2
  (GHSA-c83g-rgw3-j3cx and GHSA-73wf-gq98-2v4g), `@humanfs/node` 0.16.6
  (GHSA-p498-v437-472g), `@faker-js/faker` 5.5.3/10.4.0
  (GHSA-qxc2-j82w-r537), `qs` 6.15.2 (GHSA-x5fp-wj9c-mxmx and
  GHSA-4mjr-xmp4-gh2g), `fast-uri` 3.1.5 (GHSA-5jgf-p345-68v8,
  GHSA-f65p-4m7j-42xc, GHSA-fph4-wmhf-6fwf, GHSA-jqff-g426-hqxp),
  `baseline-browser-mapping` 2.10.20 (GHSA-w5vr-8v7q-w6rv), `js-yaml`
  4.3.1 (GHSA-2883-xcg3-v3hh), and `morgan` 1.11.0
  (GHSA-jxfw-x594-9x9m). The low finding is `postcss-selector-parser` 7.1.0
  (GHSA-w9m9-85wc-3x92). The 15 IDs are mapped to Slice 2 in
  `TRACEABILITY.md`. `pnpm audit --audit-level moderate` exits 1 with 16
  vulnerabilities.
- `pnpm run openapi:check` remains failing because
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is
  stale. No generated artifact was changed in this Feature Exit review.
- No runtime, test, configuration, README, CHANGELOG, roadmap, or durable
  product-contract changes are required by this review. The selected feature
  folder must remain until the advisory Replanning work and the independent
  OpenAPI follow-up are resolved.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
