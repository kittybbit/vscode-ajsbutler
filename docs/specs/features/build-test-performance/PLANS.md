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
2. Slice-2: incremental ANTLR generation.
   - Expected reduction:
     medium for warm local preparation; low for cold CI before caching
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

## Slice-1 Implementation Plan

Slice-1 is the only slice ready for detailed implementation approval.

1. Measure current baseline.
   - `pnpm run build`
   - `pnpm test`
   - `pnpm run test:web`
   - CI verify workflow total and step timings when available
2. Update package scripts.
   - Add `test:prepare`.
   - Add `test:full`.
   - Preserve `test` and `test:web` compatibility.
   - Decide whether lifecycle hooks stay as compatibility shims or are
     replaced by explicit wrappers.
3. Update CI only if the package-script compatibility plan is approved.
   - Use the explicit prepare-once test command where it preserves coverage.
4. Update README developer commands if command usage changes.
5. Validate.
   - `pnpm run qlty`
   - `pnpm run lint:md`
   - `pnpm run test:full`
   - `pnpm run build`
6. Record timings and remaining risks in this plan or `TASKS.md`.

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
  Slice-2 must fail closed and keep clean generation available.
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
- restore unconditional clean ANTLR generation for Slice-2
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
