# Feature Tasks: Dependabot Security Updates

## Agent Brief

- Purpose: remove known high/moderate vulnerabilities from transitive
  development dependencies without changing extension behavior.
- Approved or active slice: Slice 1; implementation review is Ready and the
  completion gate is pending.
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
- Next decision: Main delegates the approved completion gate to
  `approval-committer`.

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

- Status: Implementation review Ready; completion gate pending
- Planning scope: one complete implementation slice covering the compatible
  development dependency resolution, lockfile audit closure, affected-tooling
  validation, and production-readiness evidence.
- Review status: plan Ready (`plan-reviewer`) and implementation Ready
  (`implementation-reviewer` final verdict).
- Human approval: Approved.
- Active implementation slice: Slice 1
- Implementation review verdict: Ready

## Human Approval

- Status: Approved
- Approved at: 2026-08-10 (explicit user approval in Codex)
- Approved scope: Slice 1 — resolve and validate the security-clean development
  graph within the documented dependency and compatibility boundaries.
- Approved paths: the three plan-gate documents listed below.
- Plan-gate approved paths, once the revised plan receives `Ready` and Human
  Approval, are exactly the completed planning package:
  `docs/specs/features/dependabot-security-updates/SPECS.md`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
- These plan-gate paths are separate from the implementation Slice 1 target
  paths below; this approval authorizes only the plan-gate commit.

This approval was the prerequisite for implementation; Slice 1 is now
implemented and awaits independent implementation review.

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
- Commit status: Eligible for the completion gate

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Resolve and validate the security-clean development graph

- Status: Implemented; completion gate pending
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
- GitHub API re-query evidence is now fixed in `TRACEABILITY.md` as an
  immutable 17-row open-alert table containing each alert number, package/path,
  GHSA, severity, vulnerable range, first patched version, selected floor or
  response, and stable repository URL. The local zero-audit result does not
  claim remote alert closure; post-publication reevaluation remains Feature
  Exit evidence.
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

- Implementation review verdict: Ready. Recommended next route:
  `approval-committer` for the completion gate.
- Completion Approval is Approved; the exact four approved paths may be
  staged and committed by `approval-committer` only.
- GitHub Dependabot closure requires the completed implementation to reach
  GitHub and a post-publication reevaluation; it is not claimed by local
  evidence.
- The stale OpenAPI fixture baseline is unresolved and must be handled by
  Main/the existing WebAPI maintainer as a separate task or Feature Exit
  follow-up. No generated artifact change is included here.

- Approval Boundary:
  - The exact plan-gate approved paths are the three completed feature
    documents: `docs/specs/features/dependabot-security-updates/SPECS.md`,
    `docs/specs/features/dependabot-security-updates/TASKS.md`, and
    `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
    They are committed as the planning package only after independent review
    returns `Ready` and Human Approval is recorded.
  - The separate Slice 1 implementation target paths are only
    `pnpm-workspace.yaml` and `pnpm-lock.yaml`. `package.json`, direct parent
    declarations, production/runtime/test code, generated artifacts, and
    all other paths remain outside the implementation slice.
  - Human Approval applies to this one complete slice after independent review
    returns `Ready`; the approved planning package must be committed before
    implementation.
  - Stop for Replanning, do not stage or commit, and return the exact diff and
    explanation to Main if resolution requires a new override, `package.json`
    edit, direct-parent update, production dependency/runtime/test/generated
    artifact change, compatibility-floor change, advisory dismissal, or any
    path outside the approved boundary. The same stop condition applies when
    any `package`, `snapshot`, `integrity`, or `peer` lockfile diff is not
    explained by the approved override, targeted resolution, or unavoidable
    peer/integrity consequence, or when an additional resolution remains for
    an affected family beyond the approved floors.
- Dependencies: Feature Intake, independent plan review Ready, Human Approval,
  implementation review Ready, and the approved implementation boundary are
  complete. Next is the `approval-committer` completion gate; Dependabot
  closure evidence additionally depends on the completed slice reaching GitHub
  and GitHub reevaluation.
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
  persistent overrides for linkify-it/morgan/nanoid, major upgrades,
  production/runtime/test/generated-source edits, behavior changes, engine
  changes, alert dismissal, README/CHANGELOG changes, and Feature Exit work.

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

## Impact And Risks

- Build risk: PostCSS and nanoid are under CSS Loader and can affect desktop
  and web bundling.
- Tooling risk: js-yaml and fast-uri are under Prism/VSCE-related tooling;
  undici, linkify-it, and brace-expansion are under VSCE packaging paths.
- Test risk: morgan is under `@vscode/test-web`; shell-quote and
  brace-expansion participate in test/lint script orchestration.
- Resolution risk: lockfile updates can change additional compatible
  transitive versions. The plan must distinguish required consequences from
  unrelated churn.
- Advisory drift risk: `pnpm audit` already reports newer findings than the 17
  GitHub alerts. Validation must use the current advisory set, not only the
  intake snapshot.
- Compatibility risk: undici 7.29.0 retains the current undici 7.x
  `>=20.18.1` engine floor; brace-expansion 5.0.9 supports Node 20 or >=22.
  Existing Node 20 CI must be exercised.

## Traceability

- TRACEABILITY.md required: yes
- Reason: multiple advisory families and several independent tooling paths
  require explicit correspondence between security requirements, the future
  plan, and audit/build/desktop/web validation.

## Feature Exit

- Definition of Done status: completion gate pending; Slice 1 implementation
  and independent review are complete. The stale OpenAPI baseline follow-up
  and post-publication Dependabot reevaluation remain for Feature Exit review.
- Durable documentation updates: none expected beyond temporary feature
  artifacts; re-evaluate README and CHANGELOG impact at exit.
- Open risks: advisory drift, transitive lockfile churn, Node 20 execution, and
  tooling compatibility require independent plan review and implementation
  evidence.

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
- [ ] Complete Feature Exit validation and durable-document evaluation.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
