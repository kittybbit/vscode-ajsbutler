# TASKS: build-test-performance

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.

## Human Approval

- Status: Approved
- Approved at: 2026-04-29
- Approved scope: User replied "OKです。進めてください。" after the Slice-8
  implementation approval request and cache-effect explanation. Approved
  changes are limited to adding a GitHub Actions cache for Playwright browser
  downloads, preserving the existing pnpm dependency cache, preserving the
  Playwright install command, deferring VS Code test binary caching, updating
  SDD tracking, and running validation. Runtime code, package scripts,
  dependency versions, bundle outputs, and `engines.vscode` changes are out of
  scope.

Current implementation gate: Slice-8 Playwright browser cache.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Prior approval:

- Slice-3 was approved on 2026-04-29 when the user replied "OK.Proceed."
  after the Slice-3 implementation approval request. Approved changes were
  limited to adding explicit development webpack target filtering, focused
  desktop and web preparation scripts, preserving default all-target
  `development`, production `build`, CI production-artifact reuse, bundle
  entry points, output names, output directories, dependency versions, and
  `engines.vscode`, updating SDD tracking, and running validation. CI later
  completed successfully per human confirmation.
- Slice-7 was approved on 2026-04-29 when the user replied
  "実装を進めてください。" after the Slice-7 implementation approval request.
  Approved changes were limited to changing the verify workflow to reuse
  production build artifacts for raw desktop and web test runners, preserving
  local `test:full`, updating SDD tracking, and running validation. Package
  scripts, runtime code, test selection, bundle entry points, output names,
  dependency versions, and `engines.vscode` changes were out of scope. CI
  later completed successfully per human confirmation.
- Slice-5 was approved on 2026-04-29 when the user replied "OK. proceed."
  after the Slice-5 implementation approval request. Approved changes were
  limited to disabling `ForkTsCheckerWebpackPlugin` in development-mode webpack
  builds, preserving production build type checking, updating SDD tracking, and
  running validation. TypeScript compiler options, test selection, bundle
  entry points, output names, dependency versions, and `engines.vscode` changes
  were out of scope.
- Slice-4 was approved on 2026-04-29 when the user replied
  "実装を進めてください。" after the Slice-4 implementation approval request.
  Approved changes were limited to disabling webpack minification in
  development mode, preserving production minification, updating SDD tracking,
  and running validation. Bundle entry points, output names, target selection,
  dependency versions, and `engines.vscode` changes were out of scope.
- Slice-2 was approved on 2026-04-29 when the user replied "OK.proceed." after
  approving the manual ANTLR generation direction. Approved changes were
  limited to removing automatic `antlr4ts` execution from ordinary build/test
  preparation, preserving explicit ANTLR generation commands, updating
  contributor documentation and SDD tracking, and running validation. Parser
  grammar changes, generated parser semantic changes, dependency changes, and
  `engines.vscode` changes were out of scope.
- Slice-1 was approved on 2026-04-29 when the user replied "はい" to the
  Slice-1 implementation approval request. Approved changes were limited to
  separating test execution from shared build preparation, adding prepare-once
  package scripts, updating CI to use the prepare-once command, updating
  related README/SDD tracking, and running validation. Parser grammar, runtime
  behavior, generated artifact semantics, dependency versions, and
  `engines.vscode` were out of scope.

## Investigation

- [x] Read repository SDD workflow and implementation gate.
- [x] Read `package.json` build and test scripts.
- [x] Read verify workflow.
- [x] Read webpack configuration.
- [x] Identify affected commands, generated parser boundary, CI workflow, and
      compatibility risks.
- [x] Record Slice-1 as the first detailed implementation target.

## Tasks

- [x] Create feature specification for build/test performance slices.
- [x] Create feature implementation plan and roadmap.
- [x] Create use-case contract for measurable validation performance.
- [x] Human approval recorded for Slice-1 implementation.
- [x] Slice-1 implementation scope matches approved scope.
- [x] Slice-1 package-script changes completed.
- [x] Slice-1 CI or README changes completed only if approved.
- [x] Slice-1 timings recorded.
- [x] Slice-2 selected as the next implementation candidate.
- [x] Slice-2 impact investigation completed.
- [x] Slice-2 SDD plan updated.
- [x] Human approval recorded for Slice-2 implementation.
- [x] Slice-2 implementation scope matches approved scope.
- [x] Slice-2 package-script changes completed.
- [x] Slice-2 documentation changes completed.
- [x] Slice-2 generated parser safety checks completed.
- [x] Slice-2 timings recorded.
- [x] Slice-4 selected as the next implementation candidate.
- [x] Slice-4 impact investigation completed.
- [x] Slice-4 SDD plan updated.
- [x] Human approval recorded for Slice-4 implementation.
- [x] Slice-4 implementation scope matches approved scope.
- [x] Slice-4 webpack optimization changes completed.
- [x] Slice-4 development/production validation completed.
- [x] Slice-4 timings recorded.
- [x] Slice-5 selected as the next implementation candidate.
- [x] Slice-5 impact investigation completed.
- [x] Slice-5 SDD plan updated.
- [x] Human approval recorded for Slice-5 implementation.
- [x] Slice-5 implementation scope matches approved scope.
- [x] Slice-5 webpack checker ownership changes completed.
- [x] Slice-5 temporary type-error checks completed.
- [x] Slice-5 normal validation completed.
- [x] Slice-5 timings recorded.
- [x] Slice-7 selected as the next implementation candidate.
- [x] Slice-7 impact investigation completed.
- [x] Slice-7 SDD plan updated.
- [x] Human approval recorded for Slice-7 implementation.
- [x] Slice-7 implementation scope matches approved scope.
- [x] Slice-7 verify workflow changes completed.
- [x] Slice-7 local production-artifact runner validation completed.
- [x] Slice-7 CI timing evidence recorded.
- [x] Slice-7 CI pass confirmed by human.
- [x] Slice-3 selected as the next implementation candidate.
- [x] Slice-3 impact investigation completed.
- [x] Slice-3 SDD plan updated.
- [x] Human approval recorded for Slice-3 implementation.
- [x] Slice-3 implementation scope matches approved scope.
- [x] Slice-3 webpack target filtering completed.
- [x] Slice-3 focused preparation scripts completed.
- [x] Slice-3 focused desktop/web validation completed.
- [x] Slice-3 timings recorded.
- [x] Slice-3 CI pass confirmed by human.
- [x] Slice-8 selected as the next implementation candidate.
- [x] Slice-8 impact investigation completed.
- [x] Slice-8 SDD plan updated.
- [x] Human approval recorded for Slice-8 implementation.
- [x] Slice-8 implementation scope matches approved scope.
- [x] Slice-8 Playwright browser cache workflow change completed.
- [x] Slice-8 cache-miss validation completed.
- [x] Slice-8 CI timing evidence recorded.
- [x] Slice-6 investigated and deferred from this feature branch.
- [x] Draft slices 3, 6, and 8 resolved as implemented or deferred.

## Slice-6 Deferral Investigation

- Planned change:
  separate compiled test output from runtime bundle output.
- Affected files if implemented:
  `tsconfig.test.json`, `package.json`, `src/test/runTest.ts`,
  `src/test/runWebTest.ts`, `docs/specs/features/build-test-performance/*`,
  and `docs/specs/plans.md`.
- Affected commands if implemented:
  `pnpm run test:compile`, `pnpm test`, `pnpm run test:web`,
  `pnpm run test:full`, CI `pnpm run test:compile`,
  `pnpm run test:desktop:run`, and `pnpm run test:web:run`.
- Affected features:
  desktop test launching, web test launching, production-artifact CI test
  reuse, and extension development path resolution.
- Current ownership finding:
  `package.json` runtime entry points remain `./out/extension.js` and
  `./out/web.js`; webview bundle constants also reference `./out/*.js`.
  `tsconfig.test.json` currently emits compiled test runners and selected
  test-dependent support modules into `out`, and runner scripts are invoked
  from `out/test`.
- Risk:
  medium to high. Moving test output to `out-test` requires changing runner
  script paths and proving both VS Code desktop and web test launchers resolve
  extension development paths and test suites correctly from the new compiled
  location.
- Benefit:
  low direct speedup in this branch. The main value is output ownership clarity
  for a future cleanup if packaging, caching, or stale output issues become a
  concrete blocker.
- Decision:
  defer Slice-6 from this feature branch. The implemented slices already cover
  duplicated preparation, manual parser generation, development webpack speed,
  checker ownership, CI rebuild reduction, focused target preparation, and
  Playwright browser caching.

## Slice-8 Impact Investigation

- Planned change:
  add a conservative GitHub Actions cache for Playwright browser downloads to
  reduce external setup time on cache hits.
- Affected files:
  `.github/workflows/verify.yml`,
  `docs/specs/features/build-test-performance/*`, and `docs/specs/plans.md`.
- Affected commands:
  CI `pnpm exec playwright install --with-deps chromium-headless-shell`,
  `pnpm run test:web:run`, and the verify workflow setup sequence.
- Affected features:
  GitHub Actions verify workflow and web extension test setup.
- Affected tests:
  verify workflow cache-miss run, later cache-hit run, markdown lint, and qlty.
- Version inputs:
  Playwright is pinned to `1.59.1` in `package.json` and `pnpm-lock.yaml`.
  Local dry-run output shows Chromium headless shell build `1217` and FFmpeg
  build `1011` for Playwright `1.59.1`; CI must still run the install command
  after cache restore so misses and system dependency setup remain correct.
- Scope decision:
  pnpm dependency caching is already handled by `actions/setup-node` with
  `cache: pnpm`. VS Code test binary caching is deferred because
  `downloadAndUnzipVSCode()` currently resolves the VS Code version implicitly,
  so the repository does not have a stable VS Code binary cache-key input.
- Breaking-change risk:
  low to medium. Cache misses must behave exactly like the current workflow;
  cache hits must not skip browser dependency installation or validation.
- Implementation decision:
  use `actions/cache@v4` on `~/.cache/ms-playwright` with a key containing
  `${{ runner.os }}`, the pinned Playwright version `1.59.1`, and
  `hashFiles('pnpm-lock.yaml')`. Keep
  `pnpm exec playwright install --with-deps chromium-headless-shell` after the
  cache restore so a miss or partial restore still installs required browser
  files and Linux dependencies.
- Alternatives:
  do nothing; cache `.vscode-test`; cache Playwright plus VS Code binaries in
  one slice; pin the VS Code test binary version before adding `.vscode-test`
  caching.

## Slice-3 Impact Investigation

- Planned change:
  split development webpack targets so focused desktop and web validation can
  build only the bundles each runner needs.
- Affected files:
  `webpack.config.js`, `package.json`,
  `docs/specs/features/build-test-performance/*`, and `docs/specs/plans.md`.
- Affected commands:
  planned focused preparation commands, `pnpm run development`, `pnpm test`,
  `pnpm run test:web`, `pnpm run test:full`, `pnpm run build`, and CI raw
  test-runner commands indirectly through artifact expectations.
- Affected functions/classes/components:
  `editorConfig`, `nodeConfig`, `webConfig`, webpack module export target
  selection, and package script ownership for desktop and web preparation.
- Affected features:
  desktop extension tests, web extension smoke tests, table and flow webview
  bundle loading, and production packaging.
- Affected tests:
  focused desktop preparation plus desktop runner, focused web preparation
  plus web runner, full test validation, production build, markdown lint, and
  qlty.
- Target ownership finding:
  desktop tests open table and flow webview tabs in `extension.test.ts`, so a
  desktop-focused preparation still needs editor bundles plus `extension.js`.
  Web smoke tests open the same viewers in `webSmoke.ts`, so a web-focused
  preparation needs editor bundles plus `web.js`.
- Breaking-change risk:
  medium. Omitting an indirectly loaded bundle can produce runtime failures
  even when TypeScript compilation succeeds. Keeping default `development`
  all-target behavior and validating desktop/web focused paths separately
  mitigates this.
- Implementation finding:
  web-focused builds exposed that the web extension bundle must resolve
  package `browser` entries independently, rather than relying on shared
  multi-config webpack cache state from the node extension build. Slice-3
  therefore separates filesystem cache names by config and makes web resolver
  browser conditions explicit.
- Alternatives:
  keep all-target development builds; split only package scripts without
  webpack target filtering; change `test:full` to compose focused preparation
  steps; defer target splitting and move to cache optimization.

## Slice-7 Impact Investigation

- Planned change:
  reduce CI rebuilds by reusing production build artifacts for desktop and web
  extension test runners instead of running `test:full` after production
  build.
- Affected files:
  `.github/workflows/verify.yml`,
  `docs/specs/features/build-test-performance/*`, and `docs/specs/plans.md`.
- Affected commands:
  CI `pnpm run build`, `pnpm run test:compile`, `pnpm run test:desktop:run`,
  and `pnpm run test:web:run`. Local `pnpm run test:full` remains unchanged.
- Affected features:
  GitHub Actions verify workflow, desktop extension test execution, and web
  extension test execution.
- Affected tests:
  verify workflow, desktop extension tests, web extension tests, production
  build, lint, and qlty.
- Artifact compatibility:
  `pnpm run build` emits runtime bundles under `out`; `pnpm run test:compile`
  adds `out/test` without deleting those bundles; raw desktop and web runners
  successfully executed against production build artifacts during
  investigation.
- Breaking-change risk:
  medium. Tests will execute against production bundles in CI while local
  `test:full` continues to use development bundles. Keeping local `test:full`
  and CI production-build runner validation visible mitigates the divergence.
- Alternatives:
  keep CI `test:full`; add a new `test:ci` package script; upload/download
  artifacts across jobs; defer CI rebuild work and move to external caches.

## Slice-5 Impact Investigation

- Planned change:
  remove duplicate TypeScript checking from development/test webpack
  preparation by disabling `ForkTsCheckerWebpackPlugin` in development mode,
  while keeping production build type checking.
- Affected files:
  `webpack.config.js`, `docs/specs/features/build-test-performance/*`, and
  `docs/specs/plans.md`.
- Affected functions/classes/components:
  `createBasePlugins`, `createConfig`, the shared webpack plugin list,
  `ForkTsCheckerWebpackPlugin`, and configs for editor, desktop extension, and
  web extension bundles.
- Affected commands:
  `pnpm run development`, `pnpm run test:prepare`, `pnpm test`,
  `pnpm run test:web`, `pnpm run test:full`, and `pnpm run build`.
- Affected features:
  development bundle preparation, desktop tests, web tests, and production
  build validation.
- Affected tests:
  desktop extension tests, web extension tests, production build, temporary
  type-error checks, markdown lint, and qlty.
- Related docs:
  `SPECS.md`, `PLANS.md`, this task file, and branch-level `docs/specs/plans.md`.
- Coverage decision:
  `tsconfig.test.json` is narrower than `tsconfig.json`; therefore local test
  preparation remains a focused test-output checker, while `pnpm run build`
  remains the full source graph type-check and production bundling gate.
- Breaking-change risk:
  medium. A local `pnpm test` run may no longer catch unrelated UI-only or
  extension-only type errors until `pnpm run build` runs. CI and required local
  validation mitigate this by keeping `pnpm run build`.
- Alternatives:
  keep `ForkTsCheckerWebpackPlugin` in all modes; add a separate `typecheck`
  command before changing webpack checker behavior; broaden
  `tsconfig.test.json`; defer type-check ownership and move to CI rebuild
  reduction first.

## Slice-4 Impact Investigation

- Planned change:
  disable webpack minimization in development mode while preserving production
  minification.
- Affected files:
  `webpack.config.js`, `docs/specs/features/build-test-performance/*`, and
  `docs/specs/plans.md`.
- Affected functions/classes/components:
  `createOptimization`, `createConfig`, and webpack configs that consume the
  shared optimization object: editor, desktop extension, and web extension.
- Affected commands:
  `pnpm run development`, `pnpm run test:prepare`, `pnpm run test:full`,
  `pnpm test`, `pnpm run test:web`, and `pnpm run build`.
- Affected features:
  development bundles for table/flow webviews, desktop extension bundle, web
  extension bundle, desktop tests, and web tests.
- Affected tests:
  desktop extension tests, web extension tests, production build, and quality
  checks.
- Related docs:
  `SPECS.md`, `PLANS.md`, this task file, and branch-level `docs/specs/plans.md`.
- Breaking-change risk:
  low to medium. Production output remains minified, but development/test
  bundles will differ more from production bundles. Keeping `pnpm run build` in
  validation mitigates production-only minification failures.
- Alternatives:
  keep development minification; add a separate non-minified development
  command; defer minification work and implement target splitting first.

## Slice-2 Impact Investigation

- Planned change:
  remove automatic ANTLR generation from ordinary build/test preparation and
  keep parser generation as an explicit maintainer command.
- Affected files:
  `package.json`, `README.md`,
  `docs/specs/features/build-test-performance/*`,
  `docs/requirements/use-cases/uc-improve-build-test-performance.md`, and
  `docs/specs/plans.md`.
- Affected commands:
  `pnpm run antlr4ts`, `pnpm run antlr:clean`, `pnpm run antlr:generate`,
  `pnpm run test:prepare`, `pnpm run test:full`, `pnpm test`,
  `pnpm run test:web`, and `pnpm run build`.
- Affected parser boundary:
  grammar source remains `src/antlr/*.g4`; generated parser files remain under
  `src/generate/parser`; runtime parser imports through `@generate/parser/*`
  must remain unchanged.
- Affected features:
  parser preparation, diagnostics, unit list, flow graph, CSV export, hover,
  desktop tests, and web tests through their shared parser dependency.
- Affected tests:
  parser-dependent unit/integration suites, desktop extension tests, web
  extension tests, and production build.
- Related docs:
  `SPECS.md`, `PLANS.md`, this task file, and the build/test performance use
  case.
- Breaking-change risk:
  medium for stale generated parser artifacts if contributors forget explicit
  generation after grammar or generator changes; low for VS Code compatibility
  because no extension API changes are planned.
- Alternatives:
  keep unconditional clean generation; use hash/stamp-based incremental
  generation; use filesystem timestamps; defer ANTLR work and implement
  development webpack optimization first.

## Timing Evidence

- 2026-04-29 baseline `pnpm test`: passed, 15.44s real time.
- 2026-04-29 baseline `pnpm run test:web`: sandboxed Chromium launch failed
  with macOS Mach port permission denial; rerun outside the sandbox passed,
  16.41s real time.
- 2026-04-29 post-change `pnpm run test:full`: passed outside the sandbox,
  22.03s real time. Logs show `test:prepare` ran once before the desktop and
  web test runners.
- 2026-04-29 post-change compatibility `pnpm test`: passed, 19.39s real time.
- 2026-04-29 post-change compatibility `pnpm run test:web`: passed outside
  the sandbox, 16.69s real time.
- Local observed reduction for running both suites together:
  approximately 31.85s baseline combined time to 22.03s with `test:full`.
- 2026-04-29 Slice-2 post-change `pnpm run test:prepare`: passed, 14.10s
  real time. Logs show `development` and `test:compile` only; ANTLR generation
  was not invoked.
- 2026-04-29 Slice-2 explicit `pnpm run antlr4ts`: passed and produced no
  `src/generate/parser` diff.
- 2026-04-29 Slice-2 post-change `pnpm run test:full`: passed outside the
  sandbox, 18.60s real time.
- 2026-04-29 Slice-2 post-change `pnpm test`: passed, 24.87s real time.
- 2026-04-29 Slice-2 post-change `pnpm run test:web`: passed outside the
  sandbox, 15.11s real time.
- 2026-04-29 Slice-2 post-change `pnpm run build`: passed, 20.39s real time,
  with existing webpack asset-size warnings.
- 2026-04-29 Slice-4 baseline `pnpm run development`: passed, 8.14s real
  time. Logs showed `[minimized]` development assets.
- 2026-04-29 Slice-4 post-change `pnpm run development`: passed, 8.91s real
  time. Logs showed development assets without `[minimized]`.
- 2026-04-29 Slice-4 post-change `pnpm run test:full`: passed outside the
  sandbox, 18.99s real time.
- 2026-04-29 Slice-4 post-change `pnpm test`: passed, 13.62s real time.
- 2026-04-29 Slice-4 post-change `pnpm run test:web`: passed outside the
  sandbox, 15.12s real time.
- 2026-04-29 Slice-4 post-change `pnpm run build`: passed, 36.31s real time.
  Production assets remained `[minimized]` and reported existing webpack
  asset-size warnings.
- 2026-04-29 Slice-5 post-change `pnpm run development`: passed, 1.58s real
  time on a warm run.
- 2026-04-29 Slice-5 post-change `pnpm run test:prepare`: passed, 6.20s real
  time. Development webpack did not run `ForkTsCheckerWebpackPlugin`;
  `test:compile` remained the test-preparation checker.
- 2026-04-29 Slice-5 temporary type error in an editor-feedback source file:
  `pnpm run test:prepare` failed in `test:compile` as expected.
- 2026-04-29 Slice-5 temporary type error in
  `src/ui-component/editor/ajsTable/Header.tsx`: `pnpm run build` failed in
  production webpack checking as expected.
- 2026-04-29 Slice-5 post-change `pnpm run test:full`: passed outside the
  sandbox, 13.50s real time.
- 2026-04-29 Slice-5 post-change `pnpm test`: passed, 17.03s real time.
- 2026-04-29 Slice-5 post-change `pnpm run test:web`: passed outside the
  sandbox, 9.59s real time.
- 2026-04-29 Slice-5 post-change `pnpm run build`: passed, 15.76s real time,
  with existing webpack asset-size warnings.
- 2026-04-29 Slice-7 production-artifact CI sequence: `pnpm run build`
  passed in 8.08s real time, `pnpm run test:compile` passed in 3.21s,
  `pnpm run test:desktop:run` passed in 2.39s, and
  `pnpm run test:web:run` passed outside the sandbox in 4.17s.
- 2026-04-29 Slice-7 compatibility `pnpm run test:full`: passed outside the
  sandbox, 13.27s real time. This confirms the local prepare-once command
  still runs development bundling before desktop and web test runners.
- 2026-04-29 Slice-3 focused desktop `pnpm run test:prepare:desktop`: passed,
  6.82s real time from a clean `out`. Output contained `extension.js`,
  `tableViewer.js`, and `flowViewer.js`; `web.js` was not emitted.
- 2026-04-29 Slice-3 focused desktop runner `pnpm run test:desktop:run`:
  passed, 3.02s real time.
- 2026-04-29 Slice-3 focused web `pnpm run test:prepare:web`: passed, 9.34s
  real time from a clean `out`. Output contained `web.js`, `tableViewer.js`,
  and `flowViewer.js`; `extension.js` was not emitted.
- 2026-04-29 Slice-3 focused web runner `pnpm run test:web:run`: passed
  outside the sandbox, 4.58s real time.
- 2026-04-29 Slice-3 compatibility `pnpm test`: passed, 7.03s real time from
  a clean `out`, using focused desktop preparation via `pretest`.
- 2026-04-29 Slice-3 compatibility `pnpm run test:web`: passed outside the
  sandbox, 9.40s real time from a clean `out`, using focused web preparation
  via `pretest:web`.
- 2026-04-29 Slice-3 compatibility `pnpm run test:full`: passed outside the
  sandbox, 12.76s real time. The command still used all-target
  `test:prepare`.
- 2026-04-29 Slice-3 web resolver check `pnpm run development:web`: passed,
  6.14s real time after preserving webpack default resolver conditions with
  browser preference.
- 2026-04-29 Slice-3 production `pnpm run build`: passed, 21.22s real time,
  with existing webpack asset-size warnings. Production output still emitted
  `extension.js`, `web.js`, `tableViewer.js`, and `flowViewer.js`.
- 2026-04-29 Slice-3 production-artifact runner sequence:
  `pnpm run test:compile` passed in 3.91s, `pnpm run test:desktop:run`
  passed in 2.46s, and `pnpm run test:web:run` passed outside the sandbox in
  3.46s.
- 2026-04-29 Slice-8 CI cache-miss validation: verify workflow completed
  successfully after adding the Playwright browser cache, per human
  confirmation.
- 2026-04-29 Slice-8 CI cache-hit validation: rerun restored cache key
  `Linux-playwright-1.59.1-046997f001e1eb1345a812d0a09093540082a162168567519eb01ac93c6079df`
  successfully. GitHub Actions reported a cache hit, restored approximately
  101 MB from `~/.cache/ms-playwright`, and completed the workflow
  successfully per human confirmation.
- 2026-04-29 qlty line-length fix validation: verify workflow completed
  successfully after folding the Playwright cache key in `verify.yml`, per
  human confirmation.

## Validation

- [x] Run `pnpm run qlty`.
- [x] Run `pnpm run lint:md`.
- [x] Run `pnpm run test:full`.
- [x] Run `pnpm test`.
- [x] Run `pnpm run test:web`.
- [x] Run `pnpm run build`.
- [x] Slice-2: run `pnpm run test:prepare`.
- [x] Slice-2: run `pnpm run antlr4ts` and verify no generated parser diff.
- [x] Slice-4: run `pnpm run development`.
- [x] Slice-5: run temporary `test:prepare` type-error check.
- [x] Slice-5: run temporary `build` type-error check.
- [x] Slice-7: run production-artifact CI sequence:
      `pnpm run build`, `pnpm run test:compile`,
      `pnpm run test:desktop:run`, and `pnpm run test:web:run`.
- [x] Slice-7: rerun `pnpm run test:full` to verify the local command remains
      unchanged.
- [x] Slice-3: run focused desktop preparation and desktop runner.
- [x] Slice-3: run focused web preparation and web runner.
- [x] Slice-3: run compatibility `pnpm test`.
- [x] Slice-3: run compatibility `pnpm run test:web`.
- [x] Slice-3: run compatibility `pnpm run test:full`.
- [x] Slice-3: run production build and production-artifact runner sequence.
- [x] Slice-8: run CI verify workflow after push and confirm cache-miss
      correctness.
- [x] Slice-8: rerun CI verify workflow and confirm Playwright browser cache
      hit.
- [x] Slice-8: rerun CI verify workflow after qlty line-length fix.

## Notes

- Slice-1 is implemented after approval.
- Slice-2 is implemented after approval.
- Slice-4 is implemented after approval.
- Slice-5 is implemented after approval.
- Slice-7 is implemented after approval.
- Slice-3 is implemented after approval.
- Slice-8 is implemented after approval.
- `pnpm run qlty` initially failed in the sandbox because qlty could not create
  its log file; the same command passed outside the sandbox.
- `pnpm run build` completed with existing webpack asset-size warnings.
- A local `pnpm test` run intentionally remains narrower than full validation;
  `pnpm run build` remains required to catch full source graph type errors.
- CI now runs tests against the production build artifacts, while local
  `pnpm run test:full` intentionally keeps the development-build preparation
  path for contributor compatibility.
- `pnpm test` and `pnpm run test:web` now use focused preparation lifecycle
  hooks, while raw runner commands and `test:full` keep their previous
  responsibilities.
- GitHub Actions confirmed the Playwright browser cache restores on rerun while
  preserving the existing browser install step.
- Slice-6 remains a future cleanup candidate, not part of this feature branch.
