# SPECS: separate-ajs-metadata-from-i18n

## Purpose

Separate AJS definition metadata from i18n string resources so table columns
and unit type labels have typed metadata boundaries instead of ad hoc
translation-table access.

## Origin

- Feature kind: roadmap feature
- Source:
  user architecture review of `nls.ts`, `ajscolumn`, `ty`, and table column
  definitions.
- Source use cases:
  docs/requirements/use-cases/uc-build-unit-list-view.md and
  docs/requirements/use-cases/uc-show-unit-definition.md
- Related plan: docs/specs/plans.md

## Requirements

- Keep i18n resolution focused on selecting locale-specific strings with
  fallback behavior.
- Keep AJS table column metadata separate from flat translation keys such as
  `group1.col3`.
- Keep AJS unit type metadata separate from generic i18n resource tables.
- Provide a typed unit type label access boundary so UI code does not directly
  index raw `ty` resource shapes such as `g.gty.p`.
- Preserve existing English and Japanese user-visible labels except for clear
  data defects such as unintended leading whitespace.
- Preserve current unit list, unit definition, CSV, flow, diagnostics, hover,
  telemetry, desktop, and web extension behavior unless a future approved slice
  explicitly changes them.

## Architecture

- Domain:
  may own stable AJS unit type codes or metadata helpers only if they express
  JP1/AJS concepts independent of presentation.
- Application:
  may expose typed DTOs or label helpers when multiple presentation consumers
  need the same AJS metadata boundary.
- Presentation:
  should consume typed column metadata and label accessors instead of flat
  string keys or raw `ty` object traversal.
- Infrastructure:
  none expected.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  `nls.ts`, locale resources for message, parameter, AJS table column, and
  unit type labels, unit list table column definitions, unit definition display
  code that reads unit type labels, and tests that assert labels or column
  headers.
- Propagation decision:
  keep parser internals, normalized AJS document models, flow graph layout,
  CSV export data semantics, diagnostics, hover content source, telemetry, and
  WebAPI import behavior unchanged unless implementation investigation proves
  direct dependency.

### Breaking Change Analysis

- User-visible behavior:
  no intended behavior change; clear label data defects may be corrected when
  covered by the approved implementation scope.
- API/DTO/schema compatibility:
  no public API or persisted schema change expected; internal DTO changes need
  impact investigation before implementation.
- VS Code/web extension compatibility:
  shared metadata and i18n modules must avoid Node-only and VS Code-only APIs.
- Changed scenarios:
  none for feature intake; use-case updates are required only if a future slice
  changes observable labels or behavior contracts.

### Alternative Considerations

- Only deduplicate `nls.ts` fallback merge logic:
  rejected as the full feature purpose because it leaves AJS metadata mixed
  into generic i18n resources.
- Keep flat `ajscolumn` keys and add constants:
  rejected as the target boundary because it still preserves string-key
  coupling between resources and table column definitions.
- Move all label metadata into domain immediately:
  deferred until impact investigation shows which metadata is a JP1/AJS concept
  versus presentation-only display structure.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval:
  changing user-visible label semantics beyond confirmed data defects, changing
  parser/domain models, changing CSV output semantics, changing flow graph
  behavior, changing diagnostics or hover behavior, adding runtime dependencies,
  or introducing host-specific APIs.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility:
  metadata and i18n resolution must stay browser-safe and free of Node-only
  APIs.
- Desktop extension compatibility:
  desktop labels and table behavior must remain consistent with web behavior.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- i18n fallback resolution is expressed through one shared resolver or
  equivalent shared boundary.
- AJS table column labels are available through typed structured metadata
  rather than direct flat string keys in column definitions.
- AJS unit type labels are available through a typed accessor or equivalent
  boundary that handles unsupported or unknown unit type codes safely.
- UI components do not directly traverse raw unit type metadata shapes for
  display labels.
- Existing English and Japanese labels remain stable except for explicitly
  approved data-defect corrections.
- Relevant tests or focused verification cover fallback resolution, structured
  column label access, unit type label fallback behavior, and desktop/web-safe
  shared module usage.

## Non-Goals

- Redesign the unit list table UI.
- Change parser output or normalized AJS document shape.
- Change CSV export data semantics.
- Add new supported JP1/AJS unit types beyond the existing resource scope.
- Replace the repository i18n approach with an external i18n framework.
- Localize new product copy outside the AJS metadata separation scope.

## Open Questions

- Which parts of unit type metadata belong in domain/application helpers versus
  presentation-only label metadata?
- Should table column group metadata expose only labels, or also stable column
  identities for future view-model mapping?
