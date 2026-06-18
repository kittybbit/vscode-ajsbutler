# Feature Specification: Normalize Semantic Diagnostics Input

## Purpose

Make semantic diagnostic rules consume normalized `AjsDocument` / `AjsUnit`
data instead of parser-adjacent raw `Unit` trees.

## Origin

- Feature kind: roadmap feature
- Source use cases: `uc-provide-editor-feedback.md` and
  `uc-normalize-ajs-document.md`
- Roadmap source: normalized-model convergence
- Related plan: `docs/specs/plans.md`
- Dependency: `features/extract-parser-adapter-boundary/`

## Requirements

- Syntax parsing errors continue to be reported before semantic validation.
- Syntactically valid raw units are normalized once before semantic rules run.
- Normalized parameters retain the source line, column, and length required for
  diagnostics without exposing ANTLR types.
- Semantic rule builders, lookup helpers, and validators consume normalized
  units and parameters.
- All existing JP1/AJS3 version 13 diagnostic messages, positions, severities,
  effective defaults, ancestor lookups, and invalid-combination decisions are
  preserved.
- Do not expand the supported diagnostic rule set in this feature.

## Architecture

- Domain: normalized AJS types retain parser-independent source-location data
  and lookup semantics needed by multiple application consumers.
- Application: semantic diagnostics depend on normalized contracts and produce
  existing diagnostic DTOs.
- Presentation: VS Code mapping remains unchanged.
- Infrastructure: parser adapter supplies raw units to the normalization seam;
  no diagnostic policy moves into infrastructure.

## Impact Analysis

### Dependency Impact

- Affected domain components: normalized parameter types, normalization
  mapping, and normalized lookup/navigation helpers.
- Affected application components: semantic diagnostic core, rule builders,
  rule sets, validators, and unit lookup helpers.
- Affected tests: normalization tests and the full semantic-diagnostics suite.
- Propagation decision: migrate all semantic diagnostic rules in one coherent
  input-model change; leave parser syntax errors and hover behavior unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: diagnostic DTOs remain unchanged; normalized
  parameter DTOs gain optional or required source-location fields as planning
  determines from parser guarantees.
- VS Code/web extension compatibility: shared pure TypeScript behavior remains
  host-neutral.
- Changed scenarios: none; all existing editor-feedback scenarios are
  regression contracts.

### Alternative Considerations

- Migrate rules gradually with dual raw/normalized inputs: rejected because it
  creates duplicate lookup semantics and inconsistent diagnostics.
- Keep diagnostics permanently on raw units: rejected because it preserves the
  remaining application/raw-parser coupling.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`.
- Re-approval is required for new diagnostic rules, changed messages or
  positions, parser behavior, public DTO changes, or normalization semantics
  beyond source-location preservation.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web and desktop compatibility: diagnostic output and host-neutral execution
  remain unchanged in both extension hosts.

## Acceptance Criteria

- Semantic diagnostic production modules no longer import raw `Unit` or
  `UnitParameter`.
- Normalized parameters preserve diagnostic source positions exactly.
- Existing semantic-diagnostic scenarios and messages pass unchanged.
- Focused tests cover nested ancestor lookup, repeated parameters, effective
  defaults, and source-position mapping through normalization.
- Desktop tests, web tests, quality checks, and production build pass.

## Non-Goals

- Adding or removing JP1/AJS diagnostic rules.
- Changing parser syntax errors or hover behavior.
- Replacing unit-list or flow-graph normalized contracts.
- Refactoring presentation adapters or source directories.

## Open Questions

- Planning must verify whether normalized parameter location fields can be
  required for every parsed parameter without inventing fallback positions.
