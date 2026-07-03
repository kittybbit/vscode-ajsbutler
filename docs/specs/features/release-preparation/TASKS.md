# Release Preparation Tasks

## Plan Status

- Status: Complete
- Planning scope:
  replan Slice 4 so Marketplace publishing uses the package command form proven
  by Slice 3, and release publication also considers creating and pushing the
  release tag after publish succeeds.
- Review status:
  Reviewed.
- Human approval:
  Pending for Feature Exit Mode.
- Active implementation slice:
  none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Keep this section Approved while approved slices remain. Reset this section
back to Pending when the approved slice is complete and no active
implementation approval remains.

## Implementation Slices

### Slice 1: Establish release readiness scope

- Status: Complete
- Scope:
  inspect current release-facing inputs, compare the previous released tag with
  the release candidate, and record the release version target, package/publish
  authority, required metadata or documentation updates, validation command
  set, and release-blocking risks. This slice may update only SDD
  release-preparation documents unless separately approved.
- User / Domain Value:
  release work gains a reviewed checklist before any package metadata,
  generated artifact, or publishing-related change is made.
- Smallest Useful Slice:
  this slice resolves the release scope uncertainty that all later slices
  depend on, without mixing investigation with package or documentation edits.
- Cohesive Change Group:
  `docs/specs/features/release-preparation/TASKS.md`,
  `docs/specs/features/release-preparation/SPECS.md` if feature-level open
  questions are resolved, and `docs/specs/plans.md` only if the active feature
  state changes.
- Acceptance:
  - previous released tag is identified, expected initial baseline `v1.15.1`
  - `git log v1.15.1..HEAD` and `git diff v1.15.1..HEAD` findings are recorded,
    or a different approved previous-release tag is named with the reason
  - CHANGELOG contents are decided from the previous-release diff and
    `docs/specs/README.md` CHANGELOG Update Criteria
  - release version or version-decision owner is recorded
  - `pnpm version` command form for the chosen version bump is recorded
  - `pnpm exec vsce package` and `pnpm exec vsce publish` command authority is
    recorded, including required human approval before publish
  - CHANGELOG, README, package metadata, `.vscodeignore`, and packaging-output
    decisions are recorded
  - required validation commands are listed, including desktop and web coverage
  - release blockers are recorded as follow-up or separate SDD work
- Validation:
  run the tag listing, previous-release log, previous-release diff, and docs
  quality check through `rtk`. Add markdown lint if markdown structure or links
  change materially. If `v1.15.1` is not the approved previous release, replace
  it with the recorded tag.
- Traceability:
  supports the SPECS requirements for explicit release validation,
  release-facing update decisions, compatibility risk recording, and no hidden
  release blockers. Validation is the docs-only quality check for this feature
  planning slice.
- Production Readiness:
  - Failure mode:
    release-blocking issues are surfaced as follow-up or separate SDD work
    before release mechanics begin.
  - JP1/AJS compatibility:
    no command, parameter, parser, or definition-file interpretation change is
    in scope.
  - Large or malformed input risk:
    no runtime input path changes are in scope.
  - Desktop/web impact:
    desktop and web validation expectations are selected but not run as release
    evidence in this slice.
  - README/docs impact:
    SDD docs may change; README or user docs are decision targets only.
  - CHANGELOG impact:
    evaluate from the previous-release diff using `docs/specs/README.md`; do
    not update CHANGELOG in this slice unless the review and approval scope
    explicitly allow it.
- Approval Boundary:
  SDD investigation and plan updates only. Package metadata, generated
  artifacts, configuration, runtime code, tests, dependency updates, README,
  CHANGELOG, publishing, or packaging output changes require later approval.
- Dependencies:
  none.
- Risks:
  release version, previous-release tag, Marketplace token availability,
  publish command, and package artifact expectations may be repository- or
  maintainer-owned and may require human confirmation.
- Out of Scope:
  version bumping, package artifact generation, publish execution, runtime
  fixes, dependency modernization, and WebAPI beta exit.

## Slice 1 Release Readiness Record

- Previous released tag:
  `v1.15.1` is present locally and is the baseline for the current release
  candidate comparison.
- Previous-release diff:
  `v1.15.1..HEAD` contains user-visible telemetry expansion, viewer UX
  improvements, dependency/security and build metadata cleanup, SDD workflow
  documentation updates, and architecture/presentation boundary refactors.
  The diff is large and includes runtime, docs, tests, package metadata,
  workspace configuration, and webview presentation moves.
- CHANGELOG decision:
  `CHANGELOG.md` currently records only the privacy-conscious telemetry
  expansion under `Unreleased`. Slice 2 should turn `Unreleased` into the
  target release section and add any externally observable viewer UX,
  compatibility, dependency/security, or documented behavior entries justified
  by `v1.15.1..HEAD` and the CHANGELOG Update Criteria.
- Release version decision:
  propose `1.16.0` because the candidate includes externally observable
  feature and workflow changes since `1.15.1`. Slice 2 should use
  `pnpm version minor --no-git-tag-version` unless the human approves a
  different explicit version command before implementation.
- Package and publish command authority:
  approved command form for package verification is `pnpm exec vsce package`;
  approved command form for Marketplace publish is `pnpm exec vsce publish`.
  Publish still requires explicit human approval in Slice 4.
- Release-facing file decisions:
  - `CHANGELOG.md`: update in Slice 2 from previous-release diff.
  - `package.json`: update version in Slice 2 through the approved
    `pnpm version` command; keep `engines.vscode` at `^1.75.0`.
  - `README.md`: no new Slice 2 update is required unless release-note review
    finds stale release-facing wording; current `HEAD` already expands
    telemetry and SDD/development guidance.
  - `.vscodeignore`: no Slice 2 change is currently required; Slice 3 package
    contents inspection must verify the published file set.
  - `package.json` `private: true`: retain for Slice 2; Slice 3 must verify
    whether `vsce package` accepts it or records a package metadata blocker.
- Required validation commands:
  Slice 2 docs/metadata updates require `rtk pnpm run qlty` and markdown lint
  when CHANGELOG or README changes materially. Slice 3 release-candidate
  validation should run quality, markdown lint, production build, desktop tests,
  web tests, and approved `vsce package` verification.
- Release-blocking risks:
  Marketplace credentials and duplicate-version behavior remain unknown until
  Slice 4. Package acceptance of current metadata, including `private: true`,
  remains unknown until Slice 3 `vsce package` verification. No JP1/AJS
  definition compatibility blocker was identified in Slice 1 because no
  runtime code was changed by this slice.

### Slice 2: Apply approved release-facing updates

- Status: Complete
- Scope:
  apply only the release-facing updates approved after Slice 1, such as
  package version via `pnpm version`, CHANGELOG release section, README or
  marketplace-facing text, `.vscodeignore`, or package metadata. Do not change
  extension behavior, dependencies, tests, generated parser artifacts, or
  compatibility contracts.
- User / Domain Value:
  the release candidate carries accurate release metadata and documentation
  without bundling unrelated runtime changes.
- Smallest Useful Slice:
  release-facing updates must be reviewed together because they describe the
  same candidate release and must stay consistent across package metadata and
  user-facing release notes.
- Cohesive Change Group:
  expected candidates include `package.json`, `CHANGELOG.md`, `README.md`,
  `.vscodeignore`, package metadata fields, lockfile updates produced by the
  approved `pnpm version` command if any, and the release-preparation SDD docs.
  The exact file list must be narrowed by Slice 1 before approval.
- Acceptance:
  - approved release-facing files are updated consistently
  - package version is updated with the approved `pnpm version` command and
    `--no-git-tag-version` unless Slice 1 records a different human-approved
    command
  - `package.json` `engines.vscode` remains `^1.75.0` unless separately
    approved
  - WebAPI import remains beta unless a separate approved feature exits beta
  - no runtime behavior or dependency modernization is included
  - CHANGELOG reflects externally observable changes only when required by the
    CHANGELOG Update Criteria
  - CHANGELOG release section is cross-checked against the recorded
    previous-release diff before completion
- Validation:
  run the approved `pnpm version` command for version updates, inspect the
  resulting diff, run the fastest relevant local check for changed files, then
  the quality baseline. Add markdown lint when README, CHANGELOG, or feature
  docs are changed in a way that benefits from markdown validation.
- Traceability:
  supports the SPECS requirements for release-facing update decisions, VS Code
  compatibility preservation, web support preservation, and no behavior change.
  Validation is file-scope inspection plus relevant markdown/quality checks.
- Production Readiness:
  - Failure mode:
    incorrect release notes or package metadata can mislead users; review the
    updated files together before release validation.
  - JP1/AJS compatibility:
    no JP1/AJS behavior change is allowed in this slice.
  - Large or malformed input risk:
    no runtime input path changes are allowed.
  - Desktop/web impact:
    package metadata and documentation must not claim unsupported desktop or web
    behavior.
  - README/docs impact:
    update only the smallest release-facing surface required for this release.
  - CHANGELOG impact:
    required only for externally observable behavior, compatibility, commands,
    configuration, diagnostics, user workflow, or documented extension behavior,
    and contents must trace to the previous-release diff.
- Approval Boundary:
  only the exact release-facing file updates and `pnpm version` command
  approved after Slice 1. New generated artifacts, runtime edits, tests,
  dependency changes, compatibility contract changes, or publish commands
  require replanning or separate approval.
- Dependencies:
  Slice 1 complete and reviewed; human approval for the exact file list and
  release target.
- Risks:
  if release version or publishing target changes, the slice must be re-scoped
  before editing metadata.
- Out of Scope:
  publishing, packaging execution, runtime fixes, dependency updates, new
  features, beta exit, and changes to `engines.vscode`.

## Slice 2 Release-Facing Update Record

- CHANGELOG:
  converted `Unreleased` into `[1.16.0]` and selected only externally
  observable entries from `v1.15.1..HEAD`: privacy-conscious telemetry
  expansion, active-pane viewer opening, flow viewer investigation and node
  action refinements, unit-list usability improvements, and dependency/security
  maintenance items. Internal SDD workflow, architecture relocation, qlty, and
  refactor-only changes were excluded under the CHANGELOG Update Criteria.
- Package version:
  updated `package.json` from `1.15.1` to `1.16.0` with
  `pnpm version minor --no-git-tag-version` after the release notes were
  prepared.
- Compatibility:
  retained `engines.vscode` at `^1.75.0`, retained WebAPI import beta wording,
  and made no runtime, dependency, generated artifact, `.vscodeignore`,
  README, packaging, or publish changes.
- Validation:
  inspected the release-facing diff, ran `CI=true rtk pnpm run qlty` after qlty
  needed sandbox permission for log creation, and ran
  `CI=true rtk pnpm run lint:md` after the non-CI markdown lint attempt stopped
  on pnpm's non-TTY dependency purge prompt. Slice 3 remains responsible for
  build, desktop test, web test, and `vsce package` verification on the final
  release candidate.
- Implementation feedback:
  `pnpm version minor --no-git-tag-version` requires a clean working tree, so
  release-note and SDD approval updates may need to be committed before the
  version command can run without weakening the approved command form.

### Slice 3: Validate release candidate and prepare feature exit

- Status: Complete
- Scope:
  run and record the release-candidate validation approved for the release,
  including quality, markdown lint where useful, production build, compiled
  tests, desktop extension tests, web extension tests, and `vsce` package
  verification if approved. Update release-preparation SDD docs with concise
  validation evidence and remaining risks.
- User / Domain Value:
  the maintainer can decide whether the candidate is ready to package or
  publish with desktop, web, and compatibility evidence visible.
- Smallest Useful Slice:
  final validation is independently reviewable and should happen after the
  release-facing files settle so the evidence corresponds to the candidate that
  will be released.
- Cohesive Change Group:
  validation commands, `.vsix` package output only if explicitly approved and
  intentionally retained, and `docs/specs/features/release-preparation/TASKS.md`
  validation readiness notes.
- Acceptance:
  - required checks are run or an approved reason is recorded for each skipped
    check
  - desktop and web validation status is recorded
  - VS Code compatibility risk is checked against `package.json`
    `engines.vscode`
  - package contents or dry-run result is inspected if packaging verification
    is approved
  - `vsce package` result is recorded before publish approval is requested
  - remaining risks are resolved, accepted, or recorded as follow-up before the
    publish slice starts
- Validation:
  expected release-candidate baseline includes quality, markdown lint,
  production build, desktop extension tests, and web extension tests.
  Add `pnpm exec vsce package` or the approved equivalent only after the package
  command authority is approved.
- Traceability:
  supports all release-preparation SPECS acceptance criteria. Validation is the
  recorded command evidence and package-content inspection when approved.
- Production Readiness:
  - Failure mode:
    failing or skipped checks must be explained before release readiness can be
    accepted.
  - JP1/AJS compatibility:
    parser, list, flow, CSV, diagnostics, hover, WebAPI beta, and telemetry
    behavior must remain unchanged unless separate approved work changed them.
  - Large or malformed input risk:
    covered only by existing test suites; new runtime coverage is out of scope
    unless a release blocker opens separate SDD work.
  - Desktop/web impact:
    both desktop and web extension tests are part of the expected baseline.
  - README/docs impact:
    any validation-driven doc correction requires explicit scope confirmation
    if not already approved by Slice 2.
  - CHANGELOG impact:
    final check confirms whether the release notes match approved observable
    changes.
- Approval Boundary:
  run approved validation, run approved `vsce package`, inspect package
  contents, and update SDD validation evidence only. Publishing, package upload,
  runtime fixes, dependency changes, and unplanned metadata edits are outside
  this slice.
- Dependencies:
  Slice 2 complete when release-facing updates are needed; package dry-run
  depends on approved package command authority.
- Risks:
  environment-dependent web or packaging checks may fail for tooling reasons;
  record reproducible failure details and stop for decision rather than
  changing runtime scope.
- Out of Scope:
  publish execution, release blocker fixes, dependency modernization, generated
  parser changes, and feature closure before the publish result is known.

## Slice 3 Release-Candidate Validation Record

- Quality and docs:
  `CI=true rtk pnpm run qlty` passed, and
  `CI=true rtk pnpm run lint:md` passed.
- Build:
  `rtk pnpm run build` passed. Webpack reported existing bundle-size
  performance warnings for `tableViewer.js`, `flowViewer.js`, and `web.js`;
  no compilation failure occurred.
- Desktop validation:
  `rtk pnpm test` passed against VS Code `1.127.0`. Electron logged a macOS
  `task_name_for_pid` message, but the test runner exited with code 0.
- Web validation:
  `rtk pnpm run test:web` passed. The web test server logged the expected
  development-extension `package.nls.json` 404 and extension startup logs.
- Package verification:
  `rtk pnpm exec vsce package --out /private/tmp/vscode-ajsbutler-1.16.0.vsix`
  built successfully but failed during `vsce` dependency detection because
  `npm list --production --parseable --depth=99999 --loglevel=error` reported
  many missing or invalid dependencies under the pnpm `node_modules` layout.
  `rtk pnpm exec vsce package --no-dependencies --out <tmp-vsix>` succeeded
  and produced `/private/tmp/vscode-ajsbutler-1.16.0.vsix`.
- Package contents:
  the successful VSIX contains `extension/package.json` version `1.16.0`,
  `engines.vscode` `^1.75.0`, `main` `./out/extension.js`, `browser`
  `./out/web.js`, README, CHANGELOG, LICENSE, language and syntax files, image
  assets, production `out/` bundles, `pnpm-workspace.yaml`, and
  `scripts/generate-webapi-openapi-artifacts.mjs`. `src/`, `docs/`,
  `.vscode/`, `.github/`, `node_modules/`, `.codex/`, `.vscodeignore`, and
  lockfiles are excluded by `.vscodeignore`.
- Publish readiness:
  release-candidate validation passed except for default `vsce` dependency
  detection under pnpm. Slice 4 must not assume plain
  `pnpm exec vsce publish` will succeed until the human either approves a
  `--no-dependencies` publish command form or separately fixes the dependency
  detection/package metadata issue.

### Slice 4: Publish approved release and push release tag

- Status: Complete
- Scope:
  after Slice 3 validation passes and the revised plan is reviewed and approved,
  publish the release through the `vsce` command form that matches the validated
  package flow, then create and push the approved release tag only after
  Marketplace publish succeeds. Record publish, tag, push, and exit-readiness
  evidence in release-preparation SDD docs.
- User / Domain Value:
  the reviewed and validated release candidate is published through the VS Code
  Marketplace toolchain and the repository remote receives an explicit release
  marker for the same version.
- Smallest Useful Slice:
  Marketplace publishing, release tagging, and tag push are distinct but belong
  to one release-publication decision because the tag should not be created or
  pushed unless the corresponding Marketplace release succeeds.
- Cohesive Change Group:
  `pnpm exec vsce publish --no-dependencies` or another reviewed `vsce` publish
  command, publish command output, Marketplace result URL or version evidence
  when available, release tag creation, remote branch/tag push evidence, and
  `docs/specs/features/release-preparation/TASKS.md` publish/exit readiness
  notes.
- Acceptance:
  - Slice 3 validation evidence is recorded and has no unresolved release
    blockers except the reviewed `--no-dependencies` publish decision and any
    explicitly accepted package-contents risk
  - human approval for publish, tag creation, and push is recorded in
    `Human Approval` before any publish, tag, or push command runs
  - publish command uses `pnpm exec vsce publish --no-dependencies` unless the
    reviewed plan records a different approved `vsce` command
  - publish result, published version, and any Marketplace URL or confirmation
    evidence are recorded
  - `HEAD` is checked before publish and before tagging so the release tag
    points at the approved release commit that contains `package.json` version
    `1.16.0`, `CHANGELOG.md` section `[1.16.0]`, and the reviewed Slice 4
    approval evidence
  - release tag uses `v1.16.0` unless the human approves a different explicit
    tag name before implementation
  - tag creation uses `git tag -a v1.16.0 -m "v1.16.0"` unless the human
    approves a different tagging convention before implementation
  - branch push and tag push use explicit remote targets, expected forms
    `git push origin HEAD:main` and `git push origin v1.16.0`
  - publish, tag, or push failure stops the feature for a decision without
    runtime, dependency, version, or unplanned metadata edits
- Validation:
  inspect published version/result evidence, inspect local and remote tag/push
  evidence when available, and run `CI=true rtk pnpm run qlty` plus
  `CI=true rtk pnpm run lint:md` after SDD publish evidence is recorded. Do not
  rerun the full release-candidate baseline unless publish/tag/push changes
  files or the human requests it.
- Traceability:
  supports the SPECS requirement that approved publishing uses `vsce` and the
  acceptance criterion for publishing only after approval, plus the SPECS
  requirement that tag and push authority is explicit before execution.
  Validation is the recorded `vsce publish` result, `git rev-parse HEAD` tag
  target evidence, remote branch/tag push evidence, and SDD evidence update.
- Production Readiness:
  - Failure mode:
    authentication, authorization, duplicate version, package validation, or
    Marketplace service failures are recorded and escalated for decision. Tag
    conflicts, protected branch push rejection, remote authentication failure,
    or partial publish-without-tag states are recorded and escalated without
    retrying under a different version.
  - JP1/AJS compatibility:
    no runtime behavior or definition interpretation change is allowed.
  - Large or malformed input risk:
    no runtime input path change is allowed.
  - Desktop/web impact:
    publish uses the candidate already validated for both desktop and web.
  - README/docs impact:
    no README or CHANGELOG correction is allowed unless separately approved.
  - CHANGELOG impact:
    final publish evidence must match the version and release notes validated
    in earlier slices.
- Approval Boundary:
  only the approved `vsce publish --no-dependencies` execution, release tag
  creation at the checked approved release commit, explicit
  `git push origin HEAD:main`, explicit `git push origin v1.16.0`, and SDD
  evidence recording. Any version change, package rebuild after file changes,
  runtime fix, dependency change, retry with a different version, GitHub
  release, or Marketplace metadata correction requires replanning or separate
  approval.
- Dependencies:
  Slice 1 command authority, Slice 2 release-facing updates, Slice 3
  validation/package evidence, reviewed `--no-dependencies` publish decision,
  clean working tree, no existing conflicting `v1.16.0` tag, and explicit human
  approval for publish/tag/push.
- Risks:
  publish may be irreversible for a version, may require unavailable
  credentials, and may fail because the version already exists. The approved
  `--no-dependencies` publish command bypasses `vsce` dependency detection, so
  package-content acceptance relies on Slice 3 package inspection. Git tag or
  push may fail because the tag already exists, the remote rejects direct
  pushes, or credentials are unavailable.
- Out of Scope:
  GitHub release creation, retrying with a different version, runtime fixes,
  dependency updates, package metadata correction, and feature folder removal
  before Feature Exit Mode.

## Slice 4 Publish / Tag / Push Evidence

- Baseline:
  started from a clean working tree on `main` at
  `2ade92a309e1f44875d047ac532bda297afcfc1e`, with no existing local or remote
  `v1.16.0` tag.
- Publish:
  the first `rtk pnpm exec vsce publish --no-dependencies` attempt stopped
  before `vsce` execution because pnpm requested non-TTY module purge
  confirmation. `CI=true rtk pnpm exec vsce publish --no-dependencies`
  completed successfully and published `kittybbit.vscode-ajsbutler v1.16.0`.
  VSCE reported Marketplace URL
  `https://marketplace.visualstudio.com/items?itemName=kittybbit.vscode-ajsbutler`
  and Hub URL
  `https://marketplace.visualstudio.com/manage/publishers/kittybbit/extensions/vscode-ajsbutler/hub`.
- Publish warnings:
  `vsce` warned that it could not open the credential store and fell back to
  storing secrets clear-text in `/Users/jconee/.vsce`. Webpack repeated the
  existing bundle-size performance warnings during prepublish build.
- Tag:
  created annotated tag `v1.16.0` with message `v1.16.0`.
- Push:
  `rtk git push origin HEAD:main` succeeded and advanced `origin/main` from
  `009842e2` to `2ade92a3`. GitHub reported bypassed branch rule violations
  for direct `main` push and pending CodeQL results.
  `rtk git push origin v1.16.0` succeeded and created the remote tag. GitHub
  reported bypassed tag creation restrictions.
- Remote evidence:
  `rtk git ls-remote origin <main-and-v1.16.0-refs>` reported
  `refs/heads/main` and peeled `refs/tags/v1.16.0^{}` at
  `2ade92a309e1f44875d047ac532bda297afcfc1e`; annotated tag object
  `refs/tags/v1.16.0` is `c3cb817efe7ec5ebe4b7870b6f73b773cf7c4db3`.
- Implementation feedback:
  release publication succeeded, but future planning should account for pnpm's
  non-TTY dependency confirmation in publish commands and for GitHub branch/tag
  rule bypass messages when pushing release evidence directly to `main`.

## Traceability

- TRACEABILITY.md required: no
- Reason:
  this temporary branch feature does not change user-visible behavior, JP1/AJS
  definition-file interpretation, durable use-case contracts, or repository
  sequencing. The slice-to-requirement mapping is recorded inline above and is
  expected to be removed with the feature after approved Feature Exit.

## Cross-Slice Dependencies

- Slice 1 must complete before Slice 2 because it identifies the exact release
  target, file list, and approval boundary.
- Slice 2 must complete before Slice 3 when release-facing files change so the
  final validation evidence matches the release candidate.
- Slice 3 must complete before Feature Exit Mode can recommend closure.
- Revised Slice 4 must be reviewed and approved before publish, tag, or push
  can run. It must complete or be explicitly dropped by human decision before
  Feature Exit Mode can recommend closure for a publish-ready release.

## Feature-Level Risks

- The release version is `1.16.0`; target date is not yet recorded.
- Package command authority is recorded in the Slice 1 release readiness record.
  Revised publish, tag, and push command authority requires review and approval.
- The previous-release diff baseline is confirmed as `v1.15.1..HEAD`.
- `.vscodeignore` affects published contents and must be handled carefully if
  packaging verification finds an issue.
- Web extension support must remain explicit because the package has both
  `main` and `browser` entry points.
- `CHANGELOG.md` has been prepared as `[1.16.0]` from the previous-release diff.
- Marketplace publishing and git push may require credentials that are
  unavailable to the implementation agent; if unavailable, Slice 4 must stop
  with the exact missing prerequisite.
- Default `vsce package` dependency detection fails under the current pnpm
  install layout; `vsce package --no-dependencies` succeeds. Publish requires a
  human decision before running an equivalent `vsce publish` command.

## Use-Case Back-Propagation

- No durable use-case update is expected because release preparation is
  temporary operational work and does not change extension behavior.
- If validation discovers a reusable release policy, apply the Durable
  Documentation Gate before moving it to README, `docs/specs/README.md`,
  `docs/specs/plans.md`, or `docs/specs/roadmap.md`.

## Feature Exit

- Definition of Done status:
  pending Feature Exit Mode.
- Durable documentation updates:
  none expected unless release work reveals reusable policy or repository-level
  sequencing that passes the Durable Documentation Gate.
- Open risks:
  feature closure and durable documentation propagation remain pending Feature
  Exit Mode. Publication completed with recorded warnings for pnpm non-TTY
  confirmation, VSCE credential-store fallback, and GitHub branch/tag rule
  bypass messages.
