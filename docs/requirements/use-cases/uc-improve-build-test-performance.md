# UC: Improve Build And Test Performance

## Goal

Reduce local and CI validation time while preserving desktop extension,
web extension, parser, test, and production build correctness.

## Trigger

A maintainer runs local validation or the GitHub Actions verify workflow runs
for a pull request.

## Inputs

- Source files
- ANTLR grammar files
- Generated parser artifacts
- Webpack configuration
- TypeScript configuration
- Package scripts
- GitHub Actions workflow configuration
- Dependency lockfile and external tool versions

## Outputs

- Generated parser artifacts when a maintainer explicitly regenerates them
- Runtime bundles required by the selected validation command
- Compiled tests
- Desktop test results
- Web extension test results
- Production build output
- Timing evidence for cold build, warm build, tests, and CI duration

## Rules

- `engines.vscode` remains unchanged unless a separate compatibility proposal
  is approved.
- Desktop and web extension validation must remain covered.
- Generated parser quality and deterministic generation must not be weakened.
- Normal validation commands consume committed generated parser artifacts.
- Grammar, ANTLR command option, or generator version changes require explicit
  parser regeneration before validation is considered complete.
- Performance improvements must be split into small PR-sized slices.
- Each slice must record a performance hypothesis before implementation and
  timing evidence after implementation.
- Any slice that removes duplicate checking must keep an authoritative
  type-check gate in local validation and CI.
- Clean Architecture boundaries remain unchanged by build tooling work.

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Build and test performance validation

Scenario: Prepare once for complete local tests
  Given a contributor wants to run both desktop and web extension tests
  When the complete test validation command is executed
  Then shared build preparation runs once
  And desktop tests run
  And web tests run

Scenario: Production build remains authoritative
  Given a pull request changes runtime code
  When CI validation runs
  Then the production build is executed
  And production-only bundling failures are not hidden by development builds
  And production type errors are not hidden by faster development preparation

Scenario: Parser generation remains explicit and trustworthy
  Given grammar inputs are changed
  When the maintainer runs the explicit parser generation command
  Then parser artifacts are regenerated
  And parser-dependent tests continue to validate the generated behavior

Scenario: Cache miss remains correct
  Given dependency, browser, or VS Code test caches are unavailable
  When local or CI validation runs
  Then required external artifacts are installed or downloaded normally
  And validation correctness is unchanged
```

## Acceptance Notes

- Slice-1 is the first implementation target and must be detailed before all
  other slices.
- Slices 2 through 8 remain draft-level until Slice-1 has timing evidence.
- Timing evidence should include cold build time, warm build time, desktop test
  time, web test time, complete test time, and CI total duration.
- CI timing evidence should include individual install, browser install, lint,
  build, desktop test, and web test step durations when available.

## Risks Or Edge Cases

- Npm lifecycle hooks may hide preparation and make commands harder to reason
  about.
- Manual ANTLR generation may leave stale parser artifacts if grammar changes
  are not followed by explicit regeneration.
- Development build optimization may hide production-only minification
  failures unless production build remains part of validation.
- Targeted webpack builds may omit bundles loaded indirectly by a test runner.
- Removing duplicated type checks may create a coverage gap between runtime
  and test TypeScript projects.
- CI artifact reuse can hide stale outputs if preparation ownership is not
  explicit.
- External caches can drift when cache keys do not include lockfiles and tool
  versions.
