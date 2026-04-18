# SPECS: modernize-runtime-boundaries

## Purpose

Modernize repository runtime boundaries and maintenance workflow without
changing end-user extension behavior.

## Origin

This is a behavior-preserving modernization slice spanning dependency tooling,
serialization boundaries, hashing internals, and bundle-size follow-up work.

## Acceptance Criteria

- package-management migration from `npm` to `pnpm` is planned explicitly and
  does not weaken current validation expectations during transition
- viewer payload contracts no longer require `flatted` as the default
  serialization assumption
- bundle-size follow-up names concrete refactoring seams that are expected to
  shrink the shipped webview payload, with measurement serving as evidence
  rather than the primary outcome
- `UnitEntity` hashing can move to a common algorithm without changing stable
  identity behavior relied on by the extension
- desktop and web compatibility risks are named before implementation work

## Implementation Notes

- keep package-manager migration, serialization simplification, hash migration,
  and bundle-size reduction in reviewable slices even if they share one
  feature umbrella
- prioritize serialization-boundary cleanup before bundle-size tuning when the
  same dependencies influence both concerns
- treat the current shared webview viewer bundle `out/index.js` as the main
  reduction target because it eagerly includes both table and flow viewer
  trees behind one entry point
- prefer refactors that remove code from the shipped viewer path, especially
  entry-point splitting, host-specific adapter isolation, and dependency
  narrowing around MUI icon usage and flow-only libraries
- use `webpack-bundle-analyzer` reports and production byte counts as proof
  that a reduction slice actually shrank the delivered payload
- document current-state commands separately from target-state commands while
  the repository is in transition
- do not combine runtime-boundary modernization with unrelated new end-user
  features in the same slice

## Non-Goals

- raising `engines.vscode`
- changing domain semantics beyond the documented internal modernization scope
- broad UI redesign unrelated to transport or bundle constraints
