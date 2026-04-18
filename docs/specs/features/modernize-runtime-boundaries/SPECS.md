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
- bundle-size reduction is tracked as an explicit outcome, not an implicit
  side effect
- `UnitEntity` hashing can move to a common algorithm without changing stable
  identity behavior relied on by the extension
- desktop and web compatibility risks are named before implementation work

## Implementation Notes

- keep package-manager migration, serialization simplification, hash migration,
  and bundle-size reduction in reviewable slices even if they share one
  feature umbrella
- prioritize serialization-boundary cleanup before bundle-size tuning when the
  same dependencies influence both concerns
- document current-state commands separately from target-state commands while
  the repository is in transition
- do not combine runtime-boundary modernization with unrelated new end-user
  features in the same slice

## Non-Goals

- raising `engines.vscode`
- changing domain semantics beyond the documented internal modernization scope
- broad UI redesign unrelated to transport or bundle constraints
