# PLANS: build-test-performance

## Objective

Shorten local and CI build/test time by removing duplicated preparation work
in small, independently reviewable slices.

This plan is specification-only. Runtime code, tests, generated artifacts, and
configuration remain unchanged until a slice receives explicit approval.

## Scope

- Package script responsibility for build and test validation
- ANTLR parser generation strategy
- Webpack target selection and development optimization
- Type-check ownership
- Output directory ownership
- GitHub Actions verify workflow ordering and caches

## Non-Goals

- Product behavior changes
- Parser grammar changes
- UI or webview behavior changes
- Dependency modernization unrelated to validation performance
- Raising `engines.vscode`

## Assumptions

- Most local validation runs occur after no grammar changes.
- Development test preparation does not need minified bundles.
- Desktop and web tests currently need the same generated parser artifacts.
- CI correctness is more important than avoiding every possible rebuild.
- All timing estimates must be replaced or confirmed by measured evidence
  during implementation.

## Slice Roadmap

### Phase 1: High ROI

1. Slice-1: separate test execution from build preparation.
   - Expected reduction:
     one avoided preparation pass when running desktop and web tests together
   - First implementation target:
     yes
2. Slice-2: manual ANTLR generation.
   - Expected reduction:
     medium for local preparation and CI because grammar generation is removed
     from ordinary build/test commands
3. Slice-4: development build optimization.
   - Expected reduction:
     medium to high for development webpack and test preparation

### Phase 2

1. Slice-5: remove duplicated type checking.
   - Expected reduction:
     medium for preparation paths that currently run both webpack checker and
     `tsc`
2. Slice-7: reduce CI rebuilds.
   - Expected reduction:
     medium to high after Phase 1 commands exist

### Phase 3

1. Slice-3: split webpack targets.
   - Expected reduction:
     medium for focused local loops
2. Slice-6: organize output directories.
   - Expected reduction:
     low direct speedup; improves cacheability and correctness
3. Slice-8: optimize external dependency caches.
   - Expected reduction:
     high for external setup on cache hits; none on cache misses

## Completed Slice-1 Implementation

Slice-1 separated test execution from shared preparation.

1. Measured current baseline.
   - `pnpm run build`
   - `pnpm test`
   - `pnpm run test:web`
   - CI verify workflow total and step timings when available
2. Updated package scripts.
   - Add `test:prepare`.
   - Add `test:full`.
   - Preserve `test` and `test:web` compatibility.
   - Decide whether lifecycle hooks stay as compatibility shims or are
     replaced by explicit wrappers.
3. Updated CI after approval.
   - Use the explicit prepare-once test command where it preserves coverage.
4. Updated README developer commands.
5. Validated.
   - `pnpm run qlty`
   - `pnpm run lint:md`
   - `pnpm run test:full`
   - `pnpm run build`
6. Recorded timings and remaining risks in `TASKS.md`.

## Completed Slice-2 Implementation

Slice-2 made ANTLR generation explicit for grammar-change workflows.

1. Measured parser-generation baseline.
   - `pnpm run build`
   - `pnpm run test:prepare`
   - `pnpm run test:full`
2. Updated package scripts.
   - Remove automatic `antlr4ts` execution from `prebuild`.
   - Remove automatic `antlr4ts` execution from `test:prepare`.
   - Preserve `antlr:clean` and `antlr:generate` as explicit recovery
     commands.
   - Keep `antlr4ts` as the explicit clean generation command.
3. Updated contributor documentation.
   - Document that grammar changes require explicit `pnpm run antlr4ts`.
   - Document that normal build/test commands consume committed generated
     parser artifacts.
4. Validated parser artifact safety.
   - Ran explicit `pnpm run antlr4ts`.
   - Confirmed no unexpected generated parser diff remains.
   - Ran parser-dependent test suites through desktop and web validation.
5. Recorded timings and remaining stale-output risks in `TASKS.md`.

## Completed Slice-4 Implementation

Slice-4 disabled minification for development-mode webpack builds while
preserving production minification.

1. Measured development webpack baseline.
   - `pnpm run development`
   - `pnpm run test:prepare`
   - `pnpm run test:full`
   - `pnpm run build`
2. Updated webpack optimization.
   - Set development-mode `optimization.minimize` to `false`.
   - Keep production-mode `TerserPlugin` and minification unchanged.
   - Preserve existing entry points, output names, externals, aliases, and
     source-map behavior.
3. Validated development and production behavior.
   - Confirmed development output is emitted without Terser minification.
   - Confirmed production build remains minified and still reports existing
     asset-size warnings only.
   - Ran desktop and web extension tests.
4. Recorded timings and remaining production/development divergence risk in
   `TASKS.md`.

## Completed Slice-5 Implementation

Slice-5 made production build the full source graph type-check gate and kept
test preparation focused on test-output checking.

1. Compared type-check coverage.
   - `tsconfig.json` covers the full source graph for production build
     checking.
   - `tsconfig.test.json` covers tests plus test-dependent
     application/domain/extension boundaries, but not every UI or extension
     source file.
2. Updated webpack checker ownership.
   - Keep `ts-loader` in transpile-only mode.
   - Keep `ForkTsCheckerWebpackPlugin` enabled for production builds.
   - Disable `ForkTsCheckerWebpackPlugin` for development-mode webpack builds.
   - Keep `test:compile` as the single checker during test preparation.
3. Validated coverage boundaries.
   - Confirmed `pnpm run test:prepare` still fails for a temporary type error in
     a file included by `tsconfig.test.json`.
   - Confirmed `pnpm run build` still fails for a temporary type error in a
     source file outside `tsconfig.test.json`.
4. Validated normal commands.
   - `pnpm run development`
   - `pnpm run test:prepare`
   - `pnpm test`
   - `pnpm run test:web`
   - `pnpm run test:full`
   - `pnpm run build`
5. Recorded timings and remaining local-test coverage risk in `TASKS.md`.

## Completed Slice-7 Implementation

Slice-7 changed CI to reuse production build artifacts for raw desktop and web
test runners instead of running `test:full` after production build.

1. Confirm production artifact compatibility for test runners.
   - `pnpm run build`
   - `pnpm run test:compile`
   - `pnpm run test:desktop:run`
   - `pnpm run test:web:run`
2. Update CI workflow steps.
   - Keep the `Production build` step.
   - Add a `Compile tests` step after production build.
   - Run `test:desktop:run` and `test:web:run` directly in separate CI steps.
   - Remove CI use of `test:full` so CI does not rerun development webpack
     after production build.
3. Preserve local commands.
   - Keep `pnpm run test:full` unchanged for local prepare-once validation.
   - Do not add cross-job artifacts or external caches in this slice.
4. Validate.
   - `pnpm run build`
   - `pnpm run test:compile`
   - `pnpm run test:desktop:run`
   - `pnpm run test:web:run`
   - `pnpm run test:full`
5. Recorded local timing evidence and human-reported CI pass confirmation.

## Completed Slice-3 Implementation

Slice-3 added focused webpack target selection for desktop and web validation
while keeping default development and production builds all-target.

1. Confirm bundle ownership for each runner.
   - Desktop runner needs the desktop extension bundle, editor bundles, and
     test output because `extension.test.ts` opens table and flow viewers.
   - Web runner needs the web extension bundle, editor bundles, and test
     output because `webSmoke.ts` opens table and flow viewers.
   - Production build needs all bundles.
2. Add explicit webpack target filtering.
   - Keep default `pnpm run development` as the all-target development build.
   - Add target selection through webpack env flags or similarly explicit
     script names.
   - Preserve existing output names: `extension.js`, `web.js`,
     `tableViewer.js`, and `flowViewer.js`.
3. Add focused preparation scripts.
   - Add a desktop-focused preparation command that emits editor plus desktop
     extension bundles and compiles tests.
   - Add a web-focused preparation command that emits editor plus web extension
     bundles and compiles tests.
   - Keep `test:full` on the all-target preparation path unless a later
     approved slice changes full validation behavior.
4. Preserve compatibility.
   - Keep `pnpm test`, `pnpm run test:web`, and `pnpm run test:full`
     compatible from a clean checkout.
   - Do not change production build, CI production-artifact reuse, bundle entry
     points, output directories, or `engines.vscode`.
5. Validate.
   - `pnpm run development`
   - focused desktop preparation plus `pnpm run test:desktop:run`
   - focused web preparation plus `pnpm run test:web:run`
   - `pnpm run test:full`
   - `pnpm run build`
   - `pnpm run lint:md`
   - `pnpm run qlty`

Implementation notes:

- `development:desktop` emits editor bundles plus `extension.js`.
- `development:web` emits editor bundles plus `web.js`.
- `pretest` and `pretest:web` use focused preparation for compatibility
  commands from a clean checkout.
- `test:full` remains on the all-target `test:prepare` path.
- Webpack filesystem cache names are separated per config so target-specific
  builds do not depend on shared multi-config cache state.
- Web extension bundling explicitly prefers browser package resolution for the
  webworker target.

## Completed Slice-8 Implementation

Slice-8 added a Playwright browser cache to GitHub Actions and was confirmed by
CI cache-miss and cache-hit runs.

1. Keep existing dependency cache ownership.
   - `actions/setup-node` already caches pnpm dependencies.
   - Do not replace `pnpm/action-setup` or dependency installation behavior.
2. Add a Playwright browser cache only.
   - Cache the Playwright browser download directory used by CI.
   - Include runner OS, `pnpm-lock.yaml`, and Playwright version in the cache
     key.
   - Preserve the existing Playwright headless browser install command after
     the cache restore.
3. Defer VS Code test binary caching.
   - Current desktop tests call `downloadAndUnzipVSCode()` without a
     repository-pinned VS Code test binary version.
   - Caching `.vscode-test` is deferred until the version input is explicit.
4. Validate.
   - `pnpm run lint:md`
   - `pnpm run qlty`
   - CI verify workflow cache-miss correctness after push
   - human-reviewed CI cache-hit evidence on rerun

## Deferred Slice-6 Investigation

Slice-6 is deferred from this feature branch after investigation.

1. Current ownership:
   - Runtime bundles are emitted to `out`.
   - `tsconfig.test.json` also emits compiled test runners and test-dependent
     support modules to `out`.
   - Package runtime entry points and webview bundle constants still reference
     `out`.
2. Risk:
   - Moving test compilation to `out-test` requires changing runner script
     paths and validating both desktop and web launchers from the new compiled
     location.
   - The direct speed improvement is low; the benefit is mostly output
     ownership clarity for a future test-runner cleanup.
3. Decision:
   - Do not implement Slice-6 in this build/test performance branch.
   - Keep it as a future cleanup candidate only if output ownership becomes a
     concrete blocker for packaging, caching, or test reliability.

## Measurement Plan

Each implementation slice must record:

- cold build time
- warm build time
- desktop test time
- web test time
- full test time where applicable
- CI total duration
- CI step durations for install, browser install, lint, build, desktop tests,
  and web tests

Timing commands should use the same shell and machine when comparing local
before/after runs.

## Risk Register

- Hidden lifecycle behavior:
  contributors may expect `pnpm test` to prepare everything automatically.
- Stale generated parser:
  Slice-2 makes parser generation explicit, so contributors must remember to
  regenerate artifacts when grammar or generator inputs change.
- Bundle omission:
  Slice-3 must prove test runners do not load omitted targets.
- Type-check coverage gap:
  Slice-5 must compare `tsconfig.json` and `tsconfig.test.json` coverage.
- CI artifact reuse:
  Slice-7 must prefer explicit correctness over ambiguous reuse.
- Cache drift:
  Slice-8 cache keys must include lockfile and tool-version inputs.

## Rollback Plan

Rollback by slice, never by broad workflow reset:

- restore previous package scripts for Slice-1
- restore automatic ANTLR generation in build/test preparation for Slice-2
- restore all-target webpack development builds for Slice-3
- restore development minimization for Slice-4
- restore prior type-check duplication for Slice-5
- restore shared `out` output for Slice-6
- restore previous verify workflow ordering for Slice-7
- remove added cache steps for Slice-8

## Validation

Docs-only SDD creation:

- `pnpm run qlty`
- `pnpm run lint:md`

Future code/config slices:

- `pnpm run qlty`
- `pnpm run lint:md`
- `pnpm run test:full` when introduced
- `pnpm test`
- `pnpm run test:web`
- `pnpm run build`
