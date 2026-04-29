# TASKS: build-test-performance

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Current implementation gate: Slice-5 type-check responsibility.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Prior approval:

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
- [ ] Human approval recorded for Slice-5 implementation.
- [ ] Slice-5 implementation scope matches approved scope.
- [ ] Slice-5 webpack checker ownership changes completed.
- [ ] Slice-5 temporary type-error checks completed.
- [ ] Slice-5 normal validation completed.
- [ ] Slice-5 timings recorded.
- [ ] Draft slices 3, 6, 7, and 8 promoted to detailed specs only when their
      implementation slice becomes active.

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

## Notes

- Slice-1 is implemented after approval.
- Slice-2 is implemented after approval.
- Slice-4 is implemented after approval.
- `pnpm run qlty` initially failed in the sandbox because qlty could not create
  its log file; the same command passed outside the sandbox.
- `pnpm run build` completed with existing webpack asset-size warnings.
