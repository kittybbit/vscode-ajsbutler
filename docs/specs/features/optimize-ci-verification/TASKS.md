# Feature Tasks: Optimize CI verification

## Agent Brief

- Implement one revised slice for the [Verify and package task requirements](SPECS.md#requirements-and-acceptance).
- Keep the reviewed combined test recipe and simplify Verify with a short
  Git path check. Keep all three suites and both fixture outputs.
- Obtain independent re-review and fresh Human Approval. Commit the
  approved replan before editing the preserved implementation.

## Current state

- Lifecycle state: `PLAN_APPROVED`
- Next step: commit the approved simplified Verify plan.
- Independent replan review: `PLAN_READY` in the current conversation for
  [the reviewed manifest](/private/tmp/ajsbutler-ci-replan.jsDhnp6x/manifest.sha256).
- Replanning trigger: the maintainer asked to minimize Verify's inline
  script and leave build and test recipes in the package manifest.
- Evidence: [current replan](/private/tmp/ajsbutler-ci-replan.jsDhnp6x/plan.md)
  and [prior implementation](/private/tmp/ajsbutler-ci-opt.working/revised-handoff.md).

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
- Approved scope: simplified Verify Slice 1 and its independently reviewed
  exact paths. Feature Exit has a separate approval gate.
- Previous approval: combined-host Slice 1 was approved on 2026-11-26 in
  the current conversation and committed as
  `6a02ac6e1ca930522ea492d32b10792f6d18174f`.
  Its independent `PLAN_READY` review covers the
  [approved manifest](/private/tmp/ajsbutler-ci-replan.AHAL699J/manifest.sha256).

Apply the [approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Slice 1: Consolidate Verify and package scripts

### Verify and fixture behavior

- Keep the workflow name `Verify`, pull-request trigger, and single
  `verify` job on `ubuntu-24.04` for Playwright 1.59.1. Keep read
  permission for contents only. On both paths check out the event's
  synthetic merge with existing `actions/checkout@v4` at depth two,
  without persisting credentials. Report checkout failures normally.
- Replace the inline GitHub API classifier with a short shell step. Set
  expected base and head SHAs through the step environment. Verify
  `git show -s --format='%H %P' HEAD` matches the event merge SHA and those
  two ordered parent SHAs before using `HEAD^1` as the diff base.
  Require a nonempty base-to-merge tree diff and no changed paths
  outside the allowlist. For the unfiltered quiet diff, only exit 1
  proves a change. For the filtered quiet diff, only exit 0 proves
  no product change. Treat missing metadata, wrong revisions,
  empty changes, unavailable history and failed Git probes as product
  verification. Only positive docs-only results skip product setup, lint
  and tests.
- Use native `git diff --quiet --no-renames` and quoted exclusions for
  `docs/**`, root `README.md`, `.codex/**/*.md` and `.github/**/*.md`.
  Use the verified patterns `:(exclude)docs/**`,
  `:(exclude,glob)README.m[d]`, `:(exclude).codex/?*.md`, and
  `:(exclude).github/?*.md`. These treat bare `.md` at the two dot-directory
  roots and descendants of a root directory named `README.md` as product
  paths. Disabling rename pairing checks both sides as independent paths.
  Compare the base parent with the merge actually tested. API file
  enumeration, native trigger filters and added classifier dependencies
  are outside the approach.
- Have the fixture Webpack config export the existing two configurations
  as one multi-compiler array. Preserve the browser accessibility and
  Web smoke entries, output paths and cache identities. The fixture config
  still consumes the internal production Webpack target selectors.
- On the product path, read pnpm's pinned version from the manifest via
  existing `pnpm/action-setup@v4`. Retain the Node action's pnpm store
  cache and frozen install. Remove the separate Playwright browser
  binary cache and install the locked browser with system dependencies.
  Cold hosted runs require network access; measure any timing change on
  the hosted runner.
- Keep browser installation, `pnpm run lint:md`, and
  `xvfb-run -a pnpm test` as separate labeled steps after setup.
  The runner logs distinguish stable Desktop, minimum Desktop and Web.
  Managed checks retain their existing contracts.

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
- `docs/specs/features/optimize-ci-verification/TASKS.md`

The selected `TASKS.md` records gate and evidence updates. Preserve the
four other implemented product paths byte-for-byte during the workflow
revision. Keep probes, fixtures and raw logs outside the checkout.
Extension and test source, host runners, production Webpack configuration,
managed workflow settings and inherited features are outside the slice.

### Solution Shape and impact

- Verify owns checkout, a short Git path check, Linux setup and invocation
  of the two package commands.
  `package.json` owns user-facing recipes and the shared test order.
  The existing fixture Webpack config owns the combined fixture outputs.
  Reuse the existing pnpm script shell, Node runners and Webpack
  multi-compiler support. No additional test-task or runner layer is needed.
- Git inspects the actual checked-out revision. This removes API pagination,
  count and revision-race handling. Checking ordered merge parents ties
  the decision to the event. Checkout now runs for docs-only changes so
  the job can inspect their paths before installing product dependencies.
- Direct impact covers Verify jobs, script names and execution order,
  the production clean boundary, and removal of one unused orchestration
  dependency. Transitive impact covers local and CI test artifacts,
  VSIX preparation, parser regeneration, developer quality checks, and
  lockfile install. Engine support, runner inputs, and Qlty/CodeQL branch
  rules remain intact.
- Risks include PR metadata deviating from the tested merge, a shallow
  checkout missing the first parent, and a cache miss or cold browser
  download. Git probe uncertainty runs product checks. Reuse valid
  package and artifact evidence and verify installed versions and the
  uncached browser installation on the hosted runner. Route new paths,
  package version changes or lost coverage through Main.

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
- Extract and run the actual inline Bash against disposable real Git
  merge fixtures. Cover each allowlisted path, docs-only deletions and
  renames, mixed and product changes, both cross-allowlist rename
  directions, a change list exceeding 300 files, an empty net delta,
  missing or mismatched event SHAs, nonmerge or shallow history, and
  Git errors. Exercise successful classification at depth two. Cover
  root versus nested README, bare Markdown names and non-Markdown paths
  under the dot directories. Compare a PR branch's change already in
  the base with the net change actually entering its merge.
- Check the parsed workflow's one job, checkout depth and credentials,
  contents read permission, and dependency, browser, lint and test
  guards. Verify it uses the package manager version from the manifest,
  keeps the Node action's pnpm store cache, omits the browser binary
  cache, and keeps the locked Playwright installation and the two
  package calls. Confirm the Ubuntu runner selection still matches
  the installed Playwright version.
- Run Markdown lint, including `CONTRIBUTING.md`, and the architecture
  dependency suite. Validate exact changed paths, links and
  `git diff --check`. Use the same complete
  Qlty method and tool/configuration on the approved replan baseline and
  final snapshot, with exact inventories, manifests and SARIF retained.
  Run the updated `pnpm run qlty` aggregate. Revalidate changed invocation,
  lock, and workflow facts for this scope. Preserve earlier evidence links
  and reuse unchanged observations only as allowed by the
  [Evidence Contract](../../evidence.md#evidence-contract).
- Verify the exact published product PR head installs the pinned pnpm
  version and Chromium headless shell on Ubuntu 24.04. It must run
  Markdown lint and complete the same `pnpm test` under Xvfb, with
  stable Desktop, minimum Desktop and Web all passing. Check CodeQL
  and Qlty Cloud on that head. Hosted coverage remains a Feature Exit
  gate; report missing or failed evidence explicitly.

### Previous scope evidence

- The original implementation reached independent `SLICE_READY`; it was
  neither staged nor committed. Its complete working patch SHA-256 is
  `b55d8daaefd0f43d7b5bb570eb9bfe9fd5eb7d572df38ba04e065d8e0037c312`.
  The product-only SHA-256 is
  `f083a5fd8086085d6a7f9d2331d64db2507987720b26d1bb51ecfdb0692edac9`.
- The [previous correction evidence](/private/tmp/ajsbutler-ci-opt.working/slice-1-correction-evidence.md)
  remains available for the original gate provenance.
- The [combined-host implementation handoff](/private/tmp/ajsbutler-ci-opt.working/revised-handoff.md)
  records the implemented 12 scripts, ordered test recipe, both fixtures,
  frozen install, CLI quality runs and reviewed path set. Its uncommitted
  full patch SHA-256 is
  `f5bd38b1bbdc1f6039c99295eb2ac492ea4d7811c895563618186a722ac3e6c8`.
  Its product-only patch SHA-256 is
  `8c4dcb9f2ba444ba5c1e9fa652f56d382594d3b46c1c6f18acc0bfff6476281c`.
  Preserve those product bytes until the new workflow plan is approved.
  The API classifier evidence does not validate the new Bash step.
