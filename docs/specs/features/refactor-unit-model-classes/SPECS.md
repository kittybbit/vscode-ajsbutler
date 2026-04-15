# SPECS: refactor-unit-model-classes

## Problem

Many unit wrapper classes in `src/domain/models/units/` duplicate the same
`ParamFactory` getter boilerplate and capability wiring. This increases
maintenance cost and makes it harder to keep wrapper behavior selective.

## Requirements

- Extract shared wrapper behavior across similar unit types without changing
  the external unit model surface.
- Preserve per-unit local semantics on the owning wrapper when a rule is
  genuinely unit-local.
- Keep the existing `PrioritizableUnit` and `WaitableUnit` contracts intact.
- Avoid adding new public runtime dependencies outside the domain layer.
- Ensure `tyFactory` still returns the same wrapper classes and normalized
  model behavior remains unchanged.
- Add or update tests to cover both extracted shared behavior and unit-local
  edge cases.

## Acceptance Criteria

- Wrapper class duplication is reduced by extracting shared parameter
  behaviors into base helpers or common abstractions.
- No existing public wrapper behavior changes.
- Existing regression tests continue to pass.
- New tests verify the refactor does not affect root-jobnet defaults,
  group-specific planning semantics, or wait/priority resolution.
- Documentation and branch planning reflect the active slice.
