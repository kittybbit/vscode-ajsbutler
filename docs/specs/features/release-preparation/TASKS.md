# Release Preparation Tasks

## Plan Status

- Status: Approved
- Planning scope:
  replan the temporary release-readiness work so CHANGELOG decisions come from
  the previous-release diff, approved version changes use `pnpm version`, and
  approved Marketplace packaging and publishing use `vsce`.
- Review status:
  Reviewed.
- Human approval:
  Approved.
- Active implementation slice:
  Slice 3: Validate release candidate and prepare feature exit.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope:
  all planned release-preparation slices are approved. Implement one slice at a
  time in dependency order. Slice 2 is complete. The active approval boundary
  is Slice 3: run approved release-candidate validation, run
  `pnpm exec vsce package`, inspect package contents, and update SDD validation
  evidence only. Publishing, runtime behavior changes, dependency
  modernization, generated parser artifacts, compatibility contract changes,
  and unplanned metadata edits are outside this active slice.

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

- Status: Approved
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

### Slice 4: Publish approved release with vsce

- Status: Approved
- Scope:
  after Slice 3 validation passes and the human explicitly approves publish,
  publish the release through the approved `vsce` command, record the publish
  result, and prepare the feature for Feature Exit Mode. This slice may update
  release-preparation SDD docs with concise publish evidence only.
- User / Domain Value:
  the reviewed and validated release candidate is actually published through
  the repository's VS Code Marketplace toolchain.
- Smallest Useful Slice:
  Marketplace publishing has distinct credentials, irreversibility, and failure
  modes, so it must be separately approvable from local validation and package
  generation.
- Cohesive Change Group:
  `pnpm exec vsce publish` or the Slice 1 approved equivalent, publish command
  output, Marketplace result URL or version evidence when available, and
  `docs/specs/features/release-preparation/TASKS.md` publish/exit readiness
  notes.
- Acceptance:
  - Slice 3 validation evidence is recorded and has no unresolved release
    blockers
  - human publish approval is recorded in `Human Approval` before the command
    runs
  - publish command uses `pnpm exec vsce publish` unless Slice 1 records a
    different approved `vsce` command
  - publish result, published version, and any Marketplace URL or confirmation
    evidence are recorded
  - failed publish attempts stop the feature for a decision without runtime,
    dependency, or unplanned metadata edits
- Validation:
  inspect the published version/result evidence and run `rtk pnpm run qlty`
  after SDD publish evidence is recorded. Do not rerun the full release
  candidate baseline unless publish changes files or the human requests it.
- Traceability:
  supports the SPECS requirement that approved publishing uses `vsce` and the
  acceptance criterion for publishing only after approval. Validation is the
  recorded `vsce publish` result and SDD evidence update.
- Production Readiness:
  - Failure mode:
    authentication, authorization, duplicate version, package validation, or
    Marketplace service failures are recorded and escalated for decision.
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
  only approved `vsce publish` execution and SDD evidence recording. Any
  version change, package rebuild after file changes, runtime fix, dependency
  change, tag creation, GitHub release, or Marketplace metadata correction
  requires replanning or separate approval.
- Dependencies:
  Slice 1 command authority, Slice 2 release-facing updates when needed, Slice
  3 validation/package evidence, and explicit human publish approval.
- Risks:
  publish may be irreversible for a version, may require unavailable
  credentials, and may fail because the version already exists.
- Out of Scope:
  tag creation, GitHub release creation, retrying with a different version,
  runtime fixes, dependency updates, and feature folder removal before Feature
  Exit Mode.

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
- Slice 4 must complete or be explicitly dropped by human decision before
  Feature Exit Mode can recommend closure for a publish-ready release.

## Feature-Level Risks

- The release version is `1.16.0`; target date is not yet recorded.
- Package and publish command authority is recorded in the Slice 1 release
  readiness record, but Marketplace credentials are not yet verified.
- The previous-release diff baseline is confirmed as `v1.15.1..HEAD`.
- `.vscodeignore` affects published contents and must be handled carefully if
  packaging verification finds an issue.
- Web extension support must remain explicit because the package has both
  `main` and `browser` entry points.
- `CHANGELOG.md` has been prepared as `[1.16.0]` from the previous-release diff.
- Marketplace publishing may require credentials that are unavailable to the
  implementation agent; if unavailable, Slice 4 must stop with the exact
  missing prerequisite.

## Use-Case Back-Propagation

- No durable use-case update is expected because release preparation is
  temporary operational work and does not change extension behavior.
- If validation discovers a reusable release policy, apply the Durable
  Documentation Gate before moving it to README, `docs/specs/README.md`,
  `docs/specs/plans.md`, or `docs/specs/roadmap.md`.

## Feature Exit

- Definition of Done status:
  pending review, human approval, slice implementation, required validation,
  and Feature Exit Mode.
- Durable documentation updates:
  none expected unless release work reveals reusable policy or repository-level
  sequencing that passes the Durable Documentation Gate.
- Open risks:
  target date, Marketplace credential availability, package acceptance of
  current metadata, and final validation environment are unresolved.
