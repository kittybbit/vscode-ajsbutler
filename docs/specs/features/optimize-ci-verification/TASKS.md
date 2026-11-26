# Feature Tasks: Optimize CI verification

## Agent Brief

- Implement one revised slice for the [Verify and package task requirements](SPECS.md#requirements-and-acceptance).
- Build and test both product hosts with one recipe. Keep all three suites
  and both fixture outputs. Preserve the implemented Verify classifier.
- Obtain independent plan review and fresh Human Approval of the paths below.
  Commit the approved replan before editing the preserved implementation.

## Current state

- Lifecycle state: `PLAN_APPROVED`
- Next step: commit the approved combined-host Slice 1 plan.
- Independent replan review: `PLAN_READY` in the current conversation for
  [the reviewed manifest](/private/tmp/ajsbutler-ci-replan.AHAL699J/manifest.sha256).
- Replanning trigger: the maintainer specified that Desktop and Web ship
  together and should pass the build and tests together.
- Evidence: [intake](/private/tmp/ajsbutler-ci-intake.3RbxZWSu/intake.md),
  [original plan](/private/tmp/ajsbutler-ci-plan.yccWpbyD/plan.md), and
  [current replan](/private/tmp/ajsbutler-ci-replan.nji5O90M/plan.md).

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Layer 1 is `codex/optimize-ci-verification` targeting `main` at
  `19b5528ae4ca14583571032a0b52aad18f86e410`. PR and published head are
  pending. This branch is separate from Flow PR #351.
- The one layer delivers the coupled verification, package and contributor
  command changes. Main records the exact-head results in its PR.
  Feature Exit applies the closure gate to this folder's `SPECS.md`
  and `TASKS.md`.
- The feature has no extension release-note, README, roadmap or JP1/AJS
  use-case change. The acceptance mapping below covers the slice.
- Flow PR #351 requires the CI fix in its own branch before it can run an
  updated Verify. Any update to that PR is coordinated separately by Main.

Apply the [native stack contract](../../README.md#github-standard-stacked-pull-requests).

## Human Approval

- Status: Approved
- Approved at: approved in the current conversation on 2026-11-26.
- Approved scope: revised Slice 1 and its independently reviewed exact paths.
  Feature Exit has a separate approval gate.
- Previous approval: the human approved the original independently reviewed
  scope in the current conversation on 2026-11-26. The original plan commit
  is `b5b7481e9c80c5805be7a78106c8797ae719e3fe`, reviewed as `PLAN_READY`
  for the [original manifest](/private/tmp/ajsbutler-ci-plan.yccWpbyD/manifest.sha256).
- Previous replans: the [eight-test-script plan](/private/tmp/ajsbutler-ci-replan.0JuoeKg6/plan.md)
  and [six-test-script plan](/private/tmp/ajsbutler-ci-replan.2uXERSSF/plan.md)
  reached independent `PLAN_READY` and were superseded before Human Approval.

Apply the [approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Slice 1: Consolidate Verify and package scripts

### Verify and fixture behavior

- Keep the workflow name `Verify`, pull-request trigger, read permissions,
  and single `verify` job on `ubuntu-24.04` for Playwright 1.59.1. The
  classifier remains in the job. Only an explicit docs-only result skips
  checkout, dependency and browser setup, lint, build and test steps.
- Preserve the existing docs allowlist `docs/**`, `README.md`,
  `.codex/**/*.md` and `.github/**/*.md`. The implemented classifier verifies
  both rename paths and current file names, live versus event head and base
  revisions, and the list against the verified changed-file count. Mixed,
  empty, capped, duplicate, malformed, unstable and failed classifications
  take the product path. Preserve the corrected classifier's code and
  evidence subject to the final workflow identity check.
- Have the fixture Webpack config export the existing two configurations
  as one multi-compiler array. Preserve the browser accessibility and
  Web smoke entries, output paths and cache identities. The fixture config
  still consumes the internal production Webpack target selectors.
- After existing Node, dependency and browser setup and Markdown lint,
  Verify runs `xvfb-run -a pnpm test` as one labeled step. The runner
  logs distinguish stable Desktop, minimum Desktop and Web. Browser setup,
  caching, permissions and managed checks retain their existing contracts.

### Package recipes

- Keep one test script, `test`. Chain these commands with `&&` in order.
  1. `pnpm run build` for both production hosts.
  2. `tsc -p tsconfig.test.json` for the compiled runners.
  3. `webpack --config webpack.web-test.config.js --mode production` for
     both fixtures in one invocation.
  4. `node ./out/test/runTest.js` for stable Desktop.
  5. `node ./out/test/runTest.js --minimum` for minimum Desktop coverage.
  6. `node ./out/test/runWebTest.js` for headless Web.
- Each stage runs once and the first failure stops the recipe. Use
  existing shell tools and runner entry points. Remove per-host and
  full test aliases, fixture, compile and CI-only preparation aliases,
  and test hooks. The target is one test script and twelve package scripts.
- Make `build` call the existing `clean` script before combined production
  Webpack and remove its `prebuild` hook. Keep `clean`, the combined
  `development` and `watch`, and `vscode:prepublish` callable with their
  existing roles. Remove `development:desktop` and `development:web`.
- Keep `antlr4ts` and `qlty`. Inline their internal stages in their
  existing order and retain commands and flags. ANTLR still cleans the
  parser output before generation. Qlty still formats, checks, and then
  runs smells with `--no-snippets`. Failure prevents later stages from
  running. The removed stage aliases have no tracked callers beyond those
  aggregates. Preserve Markdown lint and the OpenAPI commands.
- Remove the now-unused `npm-run-all` devDependency. Use the existing
  pnpm version to update only its importer entry and exclusively
  unreachable dependency records in `pnpm-lock.yaml`. Keep retained
  versions, resolutions, script tools and all other dependency declarations
  and settings. No replacement dependency is introduced.
- Update [CONTRIBUTING.md](../../../../CONTRIBUTING.md) with the combined
  build/development/watch and test commands. Describe the three suites,
  headless Chromium setup, and Linux Xvfb for Desktop. Replace references
  to removed scripts and keep the existing debugger guidance.

### Exact paths proposed for approval

- `.github/workflows/verify.yml`
- `package.json`
- `webpack.web-test.config.js`
- `pnpm-lock.yaml`
- `CONTRIBUTING.md`

The selected `TASKS.md` records gate and evidence updates. Keep probes,
fixtures and raw logs outside the checkout. Extension and test source,
host runner implementations, production Webpack configuration, managed
workflow settings and inherited features are outside the slice.

### Solution Shape and impact

- Verify owns classification, Linux setup and invocation of `pnpm test`.
  `package.json` owns user-facing recipes and the shared test order.
  The existing fixture Webpack config owns the combined fixture outputs.
  Reuse the existing pnpm script shell, Node runners and Webpack
  multi-compiler support. No additional test-task or runner layer is needed.
- Direct impact covers Verify jobs, script names and execution order,
  the production clean boundary, and removal of one unused orchestration
  dependency. Transitive impact covers local and CI test artifacts,
  VSIX preparation, parser regeneration, developer quality checks, and
  lockfile install. Engine support, runner inputs, and Qlty/CodeQL branch
  rules remain intact.
- The major risks are stale callers of removed commands, incorrect
  artifact mode or failure propagation after removing hooks, and
  retained dependency drift. Check tracked callers including `.vscode`,
  isolate tests from stale output, exercise failure short-circuiting,
  and verify the parsed lock graph. Route new paths, package version
  changes or lost coverage through Main.

### Validation

- Parse the workflow and package manifest and map every previous script
  to a retained command, equivalent recipe or removed private stage.
  Search tracked callers including `.vscode` and confirm uses of removed
  aliases and `npm-run-all` are eliminated from executable configuration
  and contributor commands. Compare old and new counts of Verify jobs,
  test scripts and all package scripts.
- Validate actual task strings with sequential `&&` semantics in the
  pnpm-supported default shell, including successful ordering and a
  deliberate stage failure in a temporary fixture. Use real pnpm to
  observe the unified test recipe in order. Inject build, compile, or host
  failures and check subsequent stages are skipped. Check Windows Cmd
  compatibility for the operators used. Verify Qlty order and early exit.
  Compare the existing ANTLR clean-then-generate sequence with its exact
  invocation and arguments in a disposable fixture.
- Exercise the shared `pnpm test` preparation with a stale sentinel and
  real production build, test compilation and a single fixture Webpack
  invocation. Verify both extension outputs, compiled runner entry
  points, and both fixture bundles. Use an automated fixture for the
  launcher commands if the environment cannot run actual hosts. Confirm
  the development and watch commands still select both product hosts.
- Validate the lockfile delta as a graph comparison: the direct importer
  removal is `npm-run-all`; all removed snapshots are reachable only
  from that dependency; retained importer resolutions, package records
  and snapshots are unchanged. Run `pnpm install --frozen-lockfile` and
  record the pnpm version and install result.
- Reuse the classifier boundary evidence only when the classifier content
  identity matches. Recheck the workflow graph and actual guards, and
  rerun the inline classifier harness on the final workflow. Cover both
  docs-only and full product routing, cross-allowlist renames, duplicate
  files hiding a product path, pagination, count/revision drift and
  request failures. Confirm the runner remains compatible with the
  installed Playwright version.
- Run Markdown lint, including `CONTRIBUTING.md`, and the architecture
  dependency suite. Validate exact changed paths, links and
  `git diff --check`. Use the same complete
  Qlty method and tool/configuration on the approved replan baseline and
  final snapshot, with exact inventories, manifests and SARIF retained.
  Run the updated `pnpm run qlty` aggregate. Revalidate changed invocation,
  lock, and workflow facts for this scope. Preserve earlier evidence links
  and reuse unchanged observations only as allowed by the
  [Evidence Contract](../../evidence.md#evidence-contract).
- Verify the exact published product PR head installs Chromium headless
  shell on Ubuntu 24.04 and completes the same `pnpm test` under Xvfb,
  with stable Desktop, minimum Desktop and Web all passing. Check CodeQL
  and Qlty Cloud on that head. Use supported automation for host
  launches. Exact-head hosted coverage is a Feature Exit gate; report
  missing or failed evidence explicitly.

### Previous scope evidence

- The original implementation reached independent `SLICE_READY`; it was
  neither staged nor committed. Its complete working patch SHA-256 is
  `b55d8daaefd0f43d7b5bb570eb9bfe9fd5eb7d572df38ba04e065d8e0037c312`.
  The product-only SHA-256 is
  `f083a5fd8086085d6a7f9d2331d64db2507987720b26d1bb51ecfdb0692edac9`.
- The [previous correction evidence](/private/tmp/ajsbutler-ci-opt.working/slice-1-correction-evidence.md)
  remains available for prior gate provenance, including exact patch
  records and classifier, artifact, architecture and Qlty results.
  Replanning preserves those product bytes. The previous review and
  approval do not authorize the revised package or lockfile changes.
