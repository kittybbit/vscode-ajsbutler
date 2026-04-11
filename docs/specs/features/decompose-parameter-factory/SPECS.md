# SPECS: decompose-parameter-factory

## Purpose

Reduce the structural risk of `src/domain/models/parameters/ParameterFactory.ts`
without changing JP1/AJS parameter behavior.

## Origin

This is a behavior-preserving refactor slice under the existing normalized
parameter and wrapper work, not a new end-user use case.

## Acceptance Criteria

- `ParameterFactory` behavior is unchanged for desktop and web extension paths.
- Public callers can keep importing `ParamFactory` from the current location.
- Parameter construction rules remain aligned with the existing helper layer in
  `src/domain/models/parameters/parameterHelpers.ts`.
- Tests cover each extracted parameter-builder family before or during
  migration.
- The refactor proceeds in small slices; no broad rewrite lands in one change.

## Implementation Notes

- Prefer extracting coherent builder families over splitting by arbitrary line
  count.
- Keep `ParamFactory` as the stable facade while internal builder
  implementations move to focused modules.
- Start with the lowest-risk families that already delegate almost entirely to
  existing helper functions.
- Avoid moving JP1/AJS semantics out of the current helper layer unless the
  same rule is still duplicated after decomposition.
- Do not combine this refactor with new parameter behavior, wrapper semantics,
  or VS Code adapter changes.

## Candidate Builder Families

1. Optional scalar builders with or without `DEFAULTS.*`
2. Optional array builders
3. Inherited scalar and array builders
4. SD-aligned rule builders
5. Root-jobnet-aware builders
6. Transfer-operation `top1` to `top4` builders

## Initial Non-Goals

- Replacing `ParamFactory` with a different public API
- Reworking `parameterHelpers.ts` semantics in the same slice
- Changing wrapper class ownership or parameter naming
- Raising VS Code compatibility requirements
