# Feature Tasks: Optimize CI verification

## Agent Brief

- Implement one slice for the [Verify and package task requirements](SPECS.md#requirements-and-acceptance).
- Keep contributor commands, product artifacts and all three host suites.
  Keep docs-only classification inside Verify and external checks separate.
- Obtain independent plan review and explicit Human Approval of the paths
  below, then commit the plan before editing implementation files.

## Current state

- Lifecycle state: `PLAN_APPROVED`
- Next step: commit the approved plan before implementing Slice 1.
- Independent plan review: `PLAN_READY` in the current conversation for
  [the reviewed manifest](/private/tmp/ajsbutler-ci-plan.yccWpbyD/manifest.sha256).
- Evidence: [intake](/private/tmp/ajsbutler-ci-intake.3RbxZWSu/intake.md) and
  [plan discovery and validation](/private/tmp/ajsbutler-ci-plan.yccWpbyD/plan.md).

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Layer 1 is `codex/optimize-ci-verification` targeting `main` at
  `19b5528ae4ca14583571032a0b52aad18f86e410`. PR and published head are
  pending. This branch is separate from Flow PR #351.
- This layer delivers the complete coupled workflow and task change. Main
  records the exact-head results in its PR. Feature Exit updates the
  CI preparation paragraph in [CONTRIBUTING.md](../../../../CONTRIBUTING.md)
  and applies the existing closure gate to this folder's `SPECS.md` and
  `TASKS.md`. The feature has no extension release-note, README, roadmap
  or JP1/AJS use-case change. The acceptance mapping below covers the slice.
- Flow PR #351 requires the CI fix in its own branch before it can run an
  updated Verify. Any update to that PR is coordinated separately by Main.

Apply the [native stack contract](../../README.md#github-standard-stacked-pull-requests).

## Human Approval

- Status: Approved
- Approved at: approved in the current conversation on 2026-11-26.
- Approved scope: Slice 1 and its independently reviewed exact paths.
  Feature Exit has a separate approval gate.

Apply the [approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Slice 1: Consolidate Verify and package preparation

### Behavior and implementation

- Keep the workflow name `Verify`, pull-request trigger, read permissions
  and job key `verify`. Run the existing docs allowlist check in the first
  step of that single job, using the existing GitHub Script action and
  paginated PR files endpoint. Remove the separate `changes` and `decide`
  jobs. Pin the runner to `ubuntu-24.04`, supported by the existing
  Playwright 1.59.1 dependencies.
- Skip product steps only for a complete, nonempty file list consisting of
  `docs/**`, `README.md`, `.codex/**/*.md` or `.github/**/*.md` paths.
  For renames, both old and new paths must qualify. Include deletion paths.
  Compare the live PR head and base revisions to the event before and after
  fetching files, and compare the list length to the verified changed-file
  count. Unavailable or unstable revisions or counts, empty or capped
  results, unclassifiable file records, and API failures run the full
  product path and log the reason. The GitHub API file cap is 3,000.
  Gate every checkout, dependency, browser, lint, build and test step on
  the classifier output. Only the explicit docs-only value skips those
  steps. A docs-only result finishes the single check
  without checkout or product work, as the former skipped job did.
- Use one shared package task for compiling tests and preparing both
  fixture bundles. Add an explicit all-fixtures target to the existing
  fixture Webpack config so that task launches Webpack once. The existing
  default Web smoke and explicit accessibility targets keep their entry
  points, distinct outputs and cache identities. Keep concurrent compiler
  resource use within the existing runner budget and verify both outputs.
- Use a CI preparation entry point that runs the production build, including
  its clean prehook, before the shared package task. Verify calls it once
  after Markdown lint. Keep the separate stable Desktop, minimum Desktop
  and Web execution steps and existing Xvfb use. The prepared runners do
  not build or overwrite the production artifacts. Browser installation,
  caching, dependency versions and managed checks retain their contracts.
- Reuse shared preparation for the existing all-host development path.
  The local minimum Desktop command prepares the Desktop development
  build, compiled runner and shared Web smoke bundle, omitting the unused
  accessibility bundle. Preserve the stable Desktop and Web local
  commands and their selective preparation. Preserve `test:full` as
  development preparation plus stable Desktop and Web; minimum Desktop
  remains available separately.

### Exact paths proposed for approval

- `.github/workflows/verify.yml`
- `package.json`
- `webpack.web-test.config.js`

The selected `TASKS.md` records gate and evidence updates. Keep validation
fixtures and logs outside the checkout. Extension and test sources,
runner implementations, lockfiles, versions, production Webpack config,
managed workflow settings and inherited features are outside the slice.
The contributor documentation path is reserved for Feature Exit.

### Solution Shape and impact

- Verify owns trigger and changed-file classification, Linux setup and
  host-specific execution. `package.json` owns reusable task ordering.
  The existing fixture Webpack configuration owns target selection and
  outputs. The build system already supports a multi-configuration
  invocation, and GitHub Actions already supports conditional steps.
  No new dependency, standalone classifier, framework wrapper or
  application boundary is needed.
- Direct impact covers one observable Verify check, path classification,
  runner compatibility and package task execution. Transitive impact
  covers production output and test-artifact preparation, local
  contributor commands and GitHub's exact-head review gates. Stable
  Desktop still uses its accessibility bundle, while minimum Desktop
  and Web share the host smoke bundle. Engine support, test selection,
  permissions, product runtime and Qlty/CodeQL branch rules remain intact.
- Risks are accidental product skipping, cached or stale files masking
  missing output, clean ordering, build mode changes, and concurrent
  fixture compiler resource use. Validate these at the workflow script,
  command and artifact boundaries. Escalate any change to runner scope,
  coverage, output contracts or test selection through Main.

### Validation

- Parse the changed workflow and package configuration. Execute the actual
  inline classifier with mocked GitHub responses and captured outputs from
  a temporary harness. Cover each allowlisted path type, ordinary docs
  deletion, docs-to-docs rename, mixed changes, add/modify/delete outside
  the allowlist, a rename across the allowlist in each direction, multiple
  pages, an incomplete or capped listing, missing metadata, changing
  revisions, malformed entries and a failed request. Inspect the single
  job, stable check name and product-step guards for each result. Confirm
  the installed Playwright package supports the selected image.
- Compare the before/after script command graphs. Verify the production
  clean/build precedes test compilation and one all-fixture Webpack
  invocation, the combined development path reuses preparation, and every
  targeted local command emits or consumes only the artifacts needed by
  its runner. Exercise the production preparation through its package
  entry on the working tree and verify both extension outputs, compiled
  entry points and both named test bundles. Exercise all-host fixture
  preparation and selective targets from clean or measured output
  locations so stale files cannot pass a missing-output assertion.
- Run the existing Markdown lint and the architecture dependency suite.
  Use the full Qlty baseline/final observations and final aggregate for
  changed analyzed workflow and build configuration. Capture actual
  analyzed scope, findings and comparable settings; retain external
  SARIF/log artifacts. Lint the changed feature documents, validate local
  links and exact paths and run `rtk git diff --check`.
- On the exact published product PR head, Verify must install the pinned
  Chromium headless shell on Ubuntu 24.04, complete production preparation
  and pass all three host suites. Inspect exact-head CodeQL and Qlty
  Cloud separately. Run host suites only in supported automation.
  The local fixture evidence checks both workflow paths before publication;
  the exact-head Verify run supplies the host execution evidence at
  Feature Exit. Missing or failed checks stay explicit.
- Record old and new visible Verify job counts, bundle compiler invocations
  for the aggregate paths and named artifacts for local minimum Desktop.
  Record validation under the [Evidence Contract](../../evidence.md#evidence-contract).
