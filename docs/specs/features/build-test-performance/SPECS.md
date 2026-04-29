# SPECS: build-test-performance

<!-- markdownlint-disable MD024 -->

## Purpose

Define staged build and test performance improvements for `vscode-ajsbutler`
without changing extension behavior.

This specification is planning-only. It records performance hypotheses,
compatibility constraints, and acceptance criteria before implementation.

## Origin

- Source use case:
  `docs/requirements/use-cases/uc-improve-build-test-performance.md`
- Related plans:
  `PLANS.md`, `docs/specs/plans.md`,
  `docs/specs/features/build-test-performance/PLANS.md`

## Context

The current package scripts make every desktop and web test run prepare the
same build state:

- `pretest` runs `antlr4ts`, `development`, and `test:compile`.
- `pretest:web` runs the same preparation again before web tests.
- `development` invokes webpack without target selection and currently emits
  editor, desktop extension, and web extension bundles together.
- `build` runs `prebuild`, which cleans `out` and `report`, then performs a
  clean ANTLR generation before production webpack.
- `.github/workflows/verify.yml` runs `pnpm run build`, `pnpm test`, and
  `pnpm run test:web` serially, so generated parser files and development
  bundles can be rebuilt after the production build has already prepared them.

The performance problem is not a parser, domain, application, presentation, or
extension behavior change. It is duplicated build preparation around those
layers.

## Cross-Cutting Constraints

- Do not raise `package.json` `engines.vscode`; keep VS Code `^1.75.0`
  compatibility.
- Do not introduce VS Code APIs unavailable in VS Code 1.75.
- Do not break desktop or web extension activation, tests, or bundle entry
  points.
- Do not reduce generated parser quality or hide generation failures.
- Do not introduce Node-only behavior into shared extension or web paths.
- Keep clean-architecture boundaries intact; CI scripts and build tooling must
  not leak parser internals into UI code or domain code.
- Keep each implementation slice reviewable as a small pull request.

## Roadmap

### Phase 1: High ROI

1. Slice-1: separate test execution from build preparation.
2. Slice-2: avoid clean ANTLR generation when grammar inputs are unchanged.
3. Slice-4: optimize development webpack builds by disabling minimization.

### Phase 2

1. Slice-5: remove duplicated TypeScript checking.
2. Slice-7: reduce CI rebuilds by preparing once and reusing outputs.

### Phase 3

1. Slice-3: split webpack targets by test need.
2. Slice-6: separate runtime and test output directories.
3. Slice-8: optimize external dependency caches.

## Slice-1: Separate Test Execution From Build Preparation

### Context

Current scripts couple test execution to preparation:

- `test` is the desktop test runner, but `pretest` always runs before it.
- `pretest` regenerates ANTLR artifacts, runs all development webpack targets,
  and compiles tests.
- `test:web` is the web test runner, but `pretest:web` repeats the same
  preparation.
- There is no explicit shared preparation command for running both desktop and
  web tests after a single build preparation.

### Problem Statement

This is a performance problem because one validation session can do the same
heavy work multiple times. A common local and CI sequence is:

1. prepare for desktop tests
2. run desktop tests
3. prepare again for web tests
4. run web tests

The repeated work includes parser generation, webpack bundling, and TypeScript
test compilation. These steps do not depend on whether the next test runner is
desktop or web when the source tree is unchanged.

### Goals

- Make test execution commands run tests only.
- Introduce one explicit preparation command that builds the artifacts required
  by both desktop and web tests.
- Preserve backwards-compatible commands for contributors and CI.
- Make `test:full` the single command for prepare once, then run desktop and
  web tests.
- Keep existing desktop and web test behavior unchanged.

### Non-Goals

- Do not change webpack target selection in Slice-1.
- Do not change ANTLR generation strategy in Slice-1.
- Do not change TypeScript compiler options in Slice-1.
- Do not change GitHub Actions caching or job topology in Slice-1.
- Do not change parser, application, UI, telemetry, or extension behavior.

### Proposed Specification

Command responsibilities:

- `test`
  Runs only the desktop extension test entry point
  `node ./out/test/runTest.js`.
- `test:web`
  Runs only the web extension test entry point
  `node ./out/test/runWebTest.js`.
- `test:prepare`
  Creates all generated and compiled artifacts required by both `test` and
  `test:web`.
  Initial Slice-1 responsibility remains equivalent to the current shared
  preparation: ANTLR generation, development webpack, and `test:compile`.
- `test:full`
  Runs `test:prepare`, then `test`, then `test:web`.
- `pretest`
  Remains available for backwards compatibility but must not be the primary
  documented path for running both desktop and web tests together.
- `pretest:web`
  Remains available for backwards compatibility but must not be the primary
  documented path for running both desktop and web tests together.

Backwards compatibility:

- `pnpm test` must continue to work from a clean checkout by either preserving
  compatible pretest behavior or replacing it with an equivalent documented
  wrapper.
- `pnpm run test:web` must continue to work from a clean checkout by either
  preserving compatible pretest behavior or replacing it with an equivalent
  documented wrapper.
- Contributors can opt into faster repeated runs by using `pnpm run
test:prepare` once and then invoking `pnpm test --ignore-scripts` or the raw
  runner only if a later slice documents that workflow. Slice-1 does not need
  to expose raw runner commands unless it keeps compatibility clear.
- CI can switch to `pnpm run test:full` only after the command proves equivalent
  to the previous desktop and web validation behavior.

Success conditions:

- One command exists for prepare-once test validation.
- Existing test entry points still execute the same test suites.
- No generated parser output is changed except by the existing generator.
- No VS Code compatibility metadata changes.

### Acceptance Criteria

```gherkin
Feature: Prepare-once test validation

Scenario: Full test validation prepares once
  Given a clean checkout with dependencies installed
  When `pnpm run test:full` is executed
  Then ANTLR generation, development webpack, and test compilation run once
  And the desktop extension tests run
  And the web extension tests run

Scenario: Desktop test command remains compatible
  Given a clean checkout with dependencies installed
  When `pnpm test` is executed
  Then the desktop extension tests run successfully
  And the command remains valid for existing contributor workflows

Scenario: Web test command remains compatible
  Given a clean checkout with dependencies installed
  When `pnpm run test:web` is executed
  Then the web extension tests run successfully
  And the command remains valid for existing contributor workflows

Scenario: CI can use the explicit full-test command
  Given CI has already installed dependencies and Playwright browsers
  When the verify workflow uses `pnpm run test:full`
  Then desktop and web test suites are both covered
  And duplicated preparation is removed from that workflow step sequence
```

### Compatibility / Risk

- VS Code 1.75 compatibility:
  no VS Code API or engine changes are permitted.
- Web extension compatibility:
  web tests must still launch through the existing web test runner.
- Existing test compatibility:
  desktop and web test suites must remain the same unless a later approved
  slice explicitly changes test selection.
- Risk:
  npm lifecycle hooks can surprise contributors. The implementation must avoid
  making `pnpm test` appear fast by requiring hidden manual preparation.

### Validation Plan

Record baseline and post-change timings for:

- cold build time:
  clean checkout or `pnpm run clean`, then `pnpm run build`
- warm build time:
  repeated `pnpm run build` without source changes
- desktop test time:
  `pnpm test`
- web test time:
  `pnpm run test:web`
- full test time:
  `pnpm run test:full`
- CI duration:
  GitHub Actions verify workflow total time and individual step times

Validation commands after implementation:

- `pnpm run qlty`
- `pnpm run lint:md`
- `pnpm run test:full`
- `pnpm run build`

Expected reduction:

- local `pnpm test` plus `pnpm run test:web` sequence:
  approximately one skipped preparation pass when replaced by `test:full`
- CI verify job:
  modest reduction in Phase 1 because production build still exists, with
  larger reduction reserved for Slice-7

### Rollback Strategy

Rollback if either test command no longer works from a clean checkout, if CI
loses desktop or web coverage, or if prepare-once behavior hides stale output.

The rollback is to restore the previous `pretest` and `pretest:web` lifecycle
scripts and remove `test:prepare` / `test:full` workflow usage.

## Slice-2: Incremental ANTLR Generation

### Context

`antlr4ts` currently runs `antlr:clean` and `antlr:generate`, removing
`src/generate/parser` before every generation.

### Problem Statement

ANTLR generation is expensive relative to unchanged grammar inputs. Cleaning
and regenerating on every build or test preparation also creates unnecessary
file churn.

### Goals

- Regenerate parser artifacts only when grammar inputs or generator options
  change.
- Preserve deterministic generated output.
- Keep clean regeneration available for recovery.

### Non-Goals

- Do not change grammar semantics.
- Do not edit generated parser files manually.
- Do not replace ANTLR or `antlr4ts`.

### Proposed Specification

Regeneration triggers:

- any `src/antlr/*.g4` content change
- ANTLR command option change
- `antlr4ts-cli` version change
- missing generated parser directory
- explicit clean generation command

Cache strategy:

- store a small generation stamp or hash file outside manually edited source
  paths, or under the generated parser directory if ignored from manual edits
- hash grammar inputs, generator options, and generator package version
- skip generation when the stamp matches and expected generated files exist

Failure fallback:

- if incremental generation fails or generated file presence checks fail,
  perform a clean generation once
- if clean generation fails, fail the command visibly

### Acceptance Criteria

```gherkin
Feature: Incremental parser generation

Scenario: Unchanged grammar skips generation
  Given generated parser artifacts exist
  And grammar files and generator inputs are unchanged
  When test preparation runs
  Then ANTLR generation is skipped

Scenario: Changed grammar regenerates artifacts
  Given a grammar file changes
  When test preparation runs
  Then generated parser artifacts are regenerated

Scenario: Incremental failure falls back to clean generation
  Given the generation stamp is invalid or generated files are incomplete
  When incremental generation fails validation
  Then clean ANTLR generation is attempted once
```

### Compatibility / Risk

- VS Code 1.75 compatibility:
  unaffected.
- Web extension compatibility:
  generated parser behavior must remain identical for shared parser consumers.
- Existing test compatibility:
  parser, diagnostics, list, flow, and CSV tests remain the safety net.
- Risk:
  stale parser artifacts could mask grammar changes. The stamp must include
  all generator inputs and fail closed.

### Validation Plan

Measure cold and warm `test:prepare`, warm `test:full`, and CI prepare time.
Compare generated parser output after forced clean generation.

### Rollback Strategy

Restore `antlr4ts` to unconditional clean generation if stale output,
non-determinism, or parser regressions appear.

Expected reduction:

- warm local preparation:
  medium, because grammar usually changes rarely
- cold CI:
  low unless cache is added in later slices

## Slice-3: Split Webpack Targets

### Context

`webpack.config.js` returns editor, desktop extension, and web extension
configs together. Every `development` run builds all three targets.

### Problem Statement

Not every validation command needs every target. Desktop-only tests should not
need the web extension bundle if no web runner is invoked, and some future
checks may need only editor bundles or only extension entry points.

### Goals

- Allow explicit target selection for `extension`, `web`, and `editor`.
- Define which targets each test or build command needs.
- Preserve full production build behavior.

### Non-Goals

- Do not remove any production bundle.
- Do not change bundle entry points or output filenames.
- Do not change webview UI behavior.

### Proposed Specification

Target requirements:

- desktop extension tests require the desktop extension bundle and test output
- web extension tests require the web extension bundle, editor bundles, and
  test output
- production build requires extension, web, and editor bundles

Exclusion rules:

- a command may exclude a bundle only when no executed test or runtime entry
  point loads it
- production packaging must continue to emit all contributed entry points
- target filtering must be explicit in script names or webpack environment
  flags

Compatibility:

- output names referenced by `package.json` must remain valid
- web worker target and Node target must preserve current external and fallback
  behavior

### Acceptance Criteria

```gherkin
Feature: Targeted webpack builds

Scenario: Production build emits all bundles
  Given the production build command is executed
  Then extension, web, table viewer, and flow viewer bundles are emitted

Scenario: Desktop test preparation excludes unnecessary web bundles
  Given a desktop-only preparation command is executed
  Then only bundles required by desktop tests are emitted
```

### Compatibility / Risk

Risk centers on omitting a bundle that a test runner loads indirectly.
Implementation must verify desktop and web runners separately.

### Validation Plan

Measure target-specific development builds and compare against full
development build time.

### Rollback Strategy

Return `development` to all-target webpack output if test runners or packaging
observe missing bundles.

Expected reduction:

- medium for focused local test loops
- limited for full CI until Slice-7 is in place

## Slice-4: Optimize Development Builds

### Context

`createOptimization` enables `minimize: true` and `TerserPlugin` for both
production and development modes.

### Problem Statement

Minification is usually unnecessary for development test preparation and adds
time to repeated local and CI validation steps.

### Goals

- Disable minimization for development mode.
- Keep production minimization unchanged.
- Keep source maps useful for development tests.

### Non-Goals

- Do not change production bundle size goals.
- Do not change tree-shaking or module resolution semantics beyond what
  webpack mode already controls.

### Proposed Specification

- Development webpack builds must set `optimization.minimize` to `false`.
- Production webpack builds must continue to use `TerserPlugin`.
- Development builds may keep `innerGraph` and `usedExports` only when they do
  not materially slow test preparation.

### Acceptance Criteria

```gherkin
Feature: Fast development bundling

Scenario: Development build skips minification
  Given webpack runs in development mode
  Then Terser minification is not executed

Scenario: Production build stays minified
  Given webpack runs in production mode
  Then Terser minification is executed
```

### Compatibility / Risk

The main risk is hiding production-only minification failures. This is
mitigated by keeping `pnpm run build` in validation and CI.

### Validation Plan

Measure `pnpm run development`, `pnpm run test:prepare`, and production build
time before and after.

### Rollback Strategy

Re-enable development minimization if tests depend on minified output or if
development and production output divergence causes regressions.

Expected reduction:

- medium to high for development build and test preparation

## Slice-5: Remove Type-Check Duplication

### Context

Webpack uses `ts-loader` with `transpileOnly: true` plus
`ForkTsCheckerWebpackPlugin`. Test preparation also runs `tsc -p
tsconfig.test.json`.

### Problem Statement

The same source graph can be type-checked by both webpack and `tsc` during one
validation sequence.

### Goals

- Define one authoritative type-check path per validation command.
- Preserve type coverage for extension, web, editor, and test sources.
- Keep fast transpilation for bundling.

### Non-Goals

- Do not weaken TypeScript strictness.
- Do not remove type checking from CI.

### Proposed Specification

- Keep `ts-loader` in transpile-only mode for bundling.
- Use `tsc` for explicit validation when tests need compiled test output.
- Disable or conditionally skip `ForkTsCheckerWebpackPlugin` during
  development/test preparation if `tsc` already checks the relevant graph.
- Keep production build type-check responsibility explicit, either through
  webpack checker or a separate `typecheck` command.

### Acceptance Criteria

```gherkin
Feature: Single type-check responsibility

Scenario: Test preparation type-checks once
  Given test preparation runs
  Then TypeScript diagnostics are produced by one configured checker

Scenario: Production validation still catches type errors
  Given a source file has a type error
  When CI validation runs
  Then the type error fails validation
```

### Compatibility / Risk

Risk is a checker coverage gap between `tsconfig.json` and
`tsconfig.test.json`. Implementation must compare included files.

### Validation Plan

Measure type-check time and confirm injected temporary type errors fail the
intended command during local investigation.

### Rollback Strategy

Restore `ForkTsCheckerWebpackPlugin` for all webpack modes if coverage gaps or
missed diagnostics are found.

Expected reduction:

- medium for test preparation

## Slice-6: Organize Output Directories

### Context

Runtime bundles and compiled test output currently share `out`.

### Problem Statement

Shared output can cause accidental deletion, stale file confusion, and
unnecessary rebuild coupling between runtime bundles and tests.

### Goals

- Define output ownership for runtime bundles and test compilation.
- Avoid collisions between production artifacts and test artifacts.
- Make migration explicit.

### Non-Goals

- Do not change package runtime entry points unless required and approved.
- Do not change extension packaging layout in the same slice without evidence.

### Proposed Specification

- `out` remains the runtime bundle directory referenced by `package.json`.
- `out-test` is the candidate directory for compiled tests.
- Test runners must know where compiled tests live before migration.
- Cleaning commands must distinguish runtime cleanup from test cleanup.

### Acceptance Criteria

```gherkin
Feature: Separate build outputs

Scenario: Runtime output remains package-compatible
  Given production build completes
  Then `out/extension.js` and `out/web.js` exist

Scenario: Test output does not overwrite runtime bundles
  Given test compilation completes
  Then compiled test files are isolated from runtime bundle ownership
```

### Compatibility / Risk

Risk is high enough to keep this in Phase 3 because VS Code test launchers may
assume current paths.

### Validation Plan

Run desktop and web tests after changing output paths, then inspect package
entry files.

### Rollback Strategy

Return test compilation to `out` if launchers or packaging assumptions break.

Expected reduction:

- low direct speed reduction
- medium reliability improvement for later cache and target work

## Slice-7: Reduce CI Rebuilds

### Context

The verify workflow runs production build, desktop tests, and web tests as
separate steps. Current lifecycle hooks can prepare multiple times.

### Problem Statement

CI time grows when steps rebuild artifacts that previous steps already
prepared or validated.

### Goals

- Prepare generated and compiled artifacts once per job where possible.
- Reuse build outputs between validation steps without hiding stale artifacts.
- Keep verify workflow coverage equivalent.

### Non-Goals

- Do not split CI into a larger matrix in this slice.
- Do not skip web extension tests.
- Do not skip production build.

### Proposed Specification

- CI should run one explicit preparation phase before test runners when
  production build output cannot be reused safely.
- If production build output is reused, document which artifacts are compatible
  with test runners.
- CI logs must show enough step detail to diagnose whether lint, build,
  desktop tests, or web tests failed.

### Acceptance Criteria

```gherkin
Feature: CI prepare-once verification

Scenario: Verify job avoids repeated preparation
  Given a non-docs pull request
  When the verify workflow runs
  Then generated parser and webpack preparation are not repeated unnecessarily
  And lint, production build, desktop tests, and web tests remain covered
```

### Compatibility / Risk

Risk is stale artifact reuse. CI must start from a clean checkout and should
prefer explicit preparation over ambiguous lifecycle hooks.

### Validation Plan

Compare GitHub Actions total duration and step duration across at least two
runs before and after the change.

### Rollback Strategy

Return CI to separate `pnpm run build`, `pnpm test`, and `pnpm run test:web`
steps with existing lifecycle preparation.

Expected reduction:

- medium to high after Slice-1, Slice-2, and Slice-4 are available

## Slice-8: Optimize External Dependency Caches

### Context

CI already uses pnpm cache through `actions/setup-node`. Playwright browser
installation and VS Code test binaries can still dominate cold validation.

### Problem Statement

External downloads are expensive and unstable relative to source-only changes.

### Goals

- Cache pnpm store, Playwright browsers, and VS Code test binaries where safe.
- Keep cache invalidation tied to lockfiles and tool versions.
- Preserve clean behavior when caches are unavailable.

### Non-Goals

- Do not make validation depend on a warm cache.
- Do not skip dependency integrity checks.

### Proposed Specification

Local:

- document optional local warm-cache expectations for Playwright and VS Code
  test binaries
- keep commands functional after cache deletion

CI:

- cache keys must include OS, package manager lockfile, Playwright version, and
  VS Code test binary version inputs where applicable
- cache misses must fall back to normal install/download behavior

### Acceptance Criteria

```gherkin
Feature: External validation caches

Scenario: CI cache hit reduces setup time
  Given dependency and browser cache keys match
  When verify workflow runs
  Then external setup time is lower than a cache miss run

Scenario: CI cache miss remains correct
  Given caches are empty or invalid
  When verify workflow runs
  Then dependencies, Playwright browser, and VS Code test binaries install
  And validation still completes
```

### Compatibility / Risk

Risk is cache poisoning or version drift. Cache keys must be conservative and
cache misses must remain first-class.

### Validation Plan

Measure CI setup time for cache miss and cache hit runs.

### Rollback Strategy

Remove added cache steps while preserving normal install and browser
installation steps.

Expected reduction:

- high for cold external setup after stable cache keys
- none when cache misses

## Impact Analysis

### Dependency Impact

Affected files and areas during future implementation:

- `package.json` scripts:
  test lifecycle, ANTLR generation, webpack build modes, type-check commands
- `webpack.config.js`:
  target selection, development optimization, checker behavior
- `.github/workflows/verify.yml`:
  validation ordering and cache steps
- `tsconfig.json` and `tsconfig.test.json`:
  only if Slice-5 or Slice-6 require explicit output or include ownership
- `src/antlr/*.g4` and `src/generate/parser`:
  Slice-2 must preserve generated parser contracts
- `src/test` runners:
  only if output directories or command ownership change
- README and SDD docs:
  developer command documentation

Propagation decision:

- Slice-1 is the first implementation target.
- Slices 2 through 8 remain draft until Slice-1 timings and validation results
  are recorded.
- Runtime code is intentionally unchanged by this SDD creation task.

### Breaking Change Analysis

- User-visible extension behavior:
  none intended.
- API/DTO/schema compatibility:
  none intended.
- VS Code/web extension compatibility:
  must remain compatible with VS Code `^1.75.0` and existing browser entry.
- Changed scenarios:
  new validation workflow scenarios only; product behavior scenarios are
  unchanged.

### Alternative Considerations

- Keep lifecycle hooks only:
  rejected as the long-term path because it hides preparation work and makes
  duplication hard to see.
- Split CI into multiple jobs immediately:
  deferred because artifact sharing and cache behavior should be proven after
  Slice-1.
- Replace webpack or ANTLR tooling:
  rejected as out of scope for performance slices.

### Approval Impact Decisions

- Approval evidence owner:
  `docs/specs/features/build-test-performance/TASKS.md` `Human Approval`
- Scope changes requiring re-approval:
  runtime code edits, test behavior changes, generated parser changes,
  configuration edits beyond the approved slice, changing `engines.vscode`,
  removing desktop or web test coverage, or changing production bundle entry
  points.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` and must stay
  at `^1.75.0` unless separately approved.
- Web extension compatibility:
  every slice that changes bundling, CI, test execution, generated parser
  output, or output paths must run web validation.
- Desktop extension compatibility:
  every slice that changes bundling, CI, test execution, generated parser
  output, or output paths must run desktop validation.

## Open Questions

- Should future raw test-runner commands be exposed as public package scripts,
  or should they remain internal to avoid confusing contributors?
- Should Slice-2 store the ANTLR stamp in `src/generate/parser` or in a build
  metadata directory?
- Should Slice-7 reuse production build artifacts for tests, or keep test
  preparation development-mode only for debugging parity?
