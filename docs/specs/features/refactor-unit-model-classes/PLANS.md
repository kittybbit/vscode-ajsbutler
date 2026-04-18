# PLANS: refactor-unit-model-classes

## Objective

Reduce duplicate wrapper boilerplate in the normalized unit model while
preserving unit-local JP1/AJS semantics and existing behavior.

## Scope

- Review `src/domain/models/units/*` wrapper classes for repeated parameter
  getter patterns.
- Identify shared extraction points for common parameters and helper logic.
- Keep per-wrapper local semantics such as group planning, connector control
  defaults, schedule ownership, and root-jobnet behavior on the owning class.
- Add tests that validate both shared helper behavior and wrapper-specific
  edge cases.

## Milestones

1. Review current unit wrapper class patterns and capability interfaces.
2. Define extraction approach for common wrapper getters and shared
   semantics.
3. Implement refactor in small vertical slices.
4. Add regression coverage for extracted behavior and unit-local rules.
5. Validate with repository-wide checks.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`, `pnpm run build`
- docs-only changes: `pnpm run lint:md`
