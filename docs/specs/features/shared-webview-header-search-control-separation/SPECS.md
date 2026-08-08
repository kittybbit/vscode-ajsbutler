# Feature Specification: Shared Webview Header Search Control Separation

## Purpose

Separate the shared webview header-search field, local control state, shortcut
handling, result-status presentation, and accessibility contracts into explicit
presentation-local seams while preserving the existing table and flow search
workflows.

## Minimal Context

- Current decision: keep the shared control reusable for both viewers without
  creating a shared search domain or application contract.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Shared evidence: `docs/specs/features/BASELINE.md` intake group 10 identifies
  the shared control and its characterization gaps.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap item: `docs/specs/roadmap.md` 7.4, Shared Webview Header Search
  Control Separation.
- Source use cases:
  - `docs/requirements/use-cases/uc-explore-flow-graph.md`
  - `docs/requirements/use-cases/uc-view-unit-list.md`
- JP1/AJS source reference:
  - Command or definition reference: none; the feature does not change JP1/AJS
    parsing, normalization, or search matching.
  - Undocumented or inferred behavior: existing table and flow search behavior
    is characterized by the source use cases and the shared-control,
    accessibility, table-search, flow-search, and telemetry tests.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: The shared control exposes explicit presentation-local types for search
  direction, result position, helper-text labels, navigation labels, and
  control callbacks.
- R2: Local input state remains owned by the shared presentation control and
  keeps the current submit-on-blur, Enter-next, Shift+Enter-previous, clear,
  refocus, and result-navigation behavior.
- R3: Browser shortcut detection and focus handoff remain explicit and
  browser-safe; the platform shortcut focuses the shared input and prevents
  browser Find only for the supported shortcut.
- R4: Table and flow adapters continue to supply their own placeholder,
  helper-text, result-count, and navigation localization while retaining their
  presentation-local matching and result-ordering semantics.
- R5: Result status and navigation remain semantically available through helper
  text, result-count labels, button names, and disabled states without relying
  only on color, hover, or tooltip content.
- R6: Search query text is not sent to host messages or telemetry as a result
  of this separation; existing privacy-safe search telemetry behavior remains
  unchanged.
- R7: The same shared control behavior is preserved in desktop and browser
  webview hosts, with no new VS Code, Node-only, domain, or application
  dependency.

## Behavioral Scenarios

```gherkin
Feature: Shared webview header search control

Scenario: Platform shortcut focuses the current viewer search field
  Given a table or flow viewer with the shared search field available
  When the user presses the supported platform Find shortcut
  Then the browser Find action is prevented
  And the shared search field receives focus

Scenario: Search result status remains accessible
  Given the current viewer has no matches, matches, or an active result
  When the shared header renders
  Then helper text and result-count semantics describe that state
  And previous and next controls expose localized names and disabled state

Scenario: Table and flow matching semantics remain separate
  Given the table and flow viewers use their current search implementations
  When either viewer submits or navigates a query
  Then its existing matching scope and result order are preserved
  And no shared domain or application search contract is introduced

Scenario: Query text remains private to the presentation boundary
  Given a user enters a search query
  When the control submits, navigates, or clears the query
  Then host messages and telemetry retain their existing privacy-safe shape
  And raw query text is not added by the shared control
```

## Architecture

- Domain: none; JP1/AJS unit meaning and matching rules remain unchanged.
- Application: none; table and flow search state, DTOs, messages, and telemetry
  contracts remain unchanged.
- Presentation: own shared control contracts, local input state, browser
  shortcut focus, helper/result accessibility rendering, and table/flow label
  adapters.
- Infrastructure: none; host adapters, transport, parser, and telemetry SDK
  remain unchanged.

## Impact Analysis

### Dependency Impact

- Affected shared component and functions:
  `src/presentation/webview/editor/shared/HeaderSearchField.tsx`, including
  `resolveHeaderSearchHelperText`, `isHeaderSearchShortcut`, the shared field,
  the shared control, and `useHeaderSearchControlState`.
- Direct consumers include the table and flow headers, their search-label
  presentation helpers, and shared accessibility DOM tests. Related table and
  flow search controllers remain consumers but are intentionally not moved.
- Propagation decision: shared contracts, state/shortcut seams, label adapters,
  and focused tests change together; table/flow matching, result ordering,
  telemetry, transport, application, domain, and host adapters remain
  unchanged.

### Breaking Change Analysis

- User-visible behavior: none; this is a behavior-preserving presentation
  boundary refactoring.
- API/DTO/schema compatibility: no application DTO, viewer message, or
  telemetry schema changes.
- VS Code/web extension compatibility: no new host API or Node-only import;
  desktop and browser webviews continue to use the same control.
- Changed scenarios: none; existing source-use-case scenarios are preserved.

### Alternative Considerations

- Move search state or matching into Application: rejected because query
  input, focus, helper text, and result navigation are viewer presentation
  concerns and table/flow semantics differ.
- Make table and flow share one search-result model: rejected because the
  roadmap explicitly preserves presentation-local matching semantics.
- Keep all state, shortcut, and rendering responsibilities in one component:
  rejected because it obscures the reusable control boundary and makes
  accessibility behavior harder to characterize independently.
- Create a generic cross-view interaction framework: rejected because this
  feature needs only the existing equivalent header control.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: matching semantics, result ordering,
  telemetry or host-message shape, domain/application contracts, new viewer
  shortcuts, or any flow-tree/search feature work.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`).
- Web extension compatibility: preserve browser-safe production imports and
  validate the browser viewer bundle and web test path.
- Desktop extension compatibility: preserve the existing webview search,
  accessibility, telemetry, and shell behavior through desktop tests.
- JP1/AJS definition compatibility: no parser, normalization, encoding,
  matching, or result-ordering changes are allowed.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- AC1: Shared header search contracts, helper-text resolution, shortcut focus,
  local state transitions, and visual field rendering have explicit
  presentation-local seams with no domain/application dependency.
- AC2: Empty and non-empty queries, submit, clear, blur, Enter navigation,
  Shift+Enter navigation, result counts, no-result state, and focus behavior
  retain current behavior in directly targeted tests.
- AC3: Table and flow headers retain their own localized labels and existing
  matching/result semantics without duplicated shared behavior or a shared
  search domain contract.
- AC4: Accessibility DOM assertions continue to cover helper text, result
  count, button labels, shortcut placeholder, and disabled navigation state.
- AC5: Raw query text is absent from shared-control transport and telemetry
  changes, and no new telemetry event or property is introduced.
- AC6: Focused tests, desktop/web validation, quality checks, and production
  build pass without an architecture-rule exception or unsupported API.

## Non-Goals

- Change table or flow matching scope, case handling, result ordering, reveal,
  centering, or zoom behavior.
- Unify table and flow search state into one domain, application, or transport
  contract.
- Add search history, regex search, new shortcuts, or a visual redesign.
- Change telemetry event names, allowed properties, privacy policy, or host
  message schemas.
- Refactor flow-tree selection, table keyboard navigation, parser behavior, or
  JP1/AJS definition projection.
- Raise the minimum supported VS Code version or add Node-only production code.

## Open Questions

- None.
