# SPECS: modernize-runtime-boundaries

## Purpose

Modernize repository runtime boundaries and maintenance workflow while
preserving extension behavior.

## Origin

This is a behavior-preserving modernization slice spanning dependency tooling,
serialization boundaries, hashing internals, and bundle-size follow-up work.

## Acceptance Criteria

- Package management uses pinned `pnpm` metadata and validation parity.
- Viewer payload contracts are DTO-based and do not require `flatted`.
- Table and flow webview bundles are split by viewer entry point.
- Bundle-size work resumes only when a clearer reduction seam or stronger
  product need appears.
- `UnitEntity` hashing can change only after persistence and selection risks
  are rechecked.

## Implementation Notes

- Keep modernization slices behavior-preserving and reviewable.
- Use production byte counts and analyzer output as evidence, not as a
  substitute for a real shrinking refactor.
- Do not combine runtime modernization with unrelated end-user features.

## Non-Goals

- raising `engines.vscode`
- changing domain semantics beyond the documented internal modernization scope
- broad UI redesign unrelated to transport or bundle constraints
