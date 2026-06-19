# Feature Specification: Extract Viewer Event Bridge

## Purpose

Separate browser message routing and callback registration from React viewer
bootstrap while preserving table and flow viewer behavior.

## Origin

- Feature kind: roadmap feature
- Source: roadmap item 5, informed by Qlty complexity findings in the relocated
  webview presentation boundary
- Related plan: `docs/specs/plans.md`

## Requirements

- A presentation-local viewer event bridge owns callback registration,
  removal, message validation, and dispatch.
- `bootstrapViewer` continues to acquire the VS Code API, expose the bridge on
  `window`, install the browser message listener, and mount the supplied React
  application.
- Valid messages dispatch the unchanged event type and data to every callback
  registered for that type.
- Messages without object data or a string event type remain ignored.
- Removing a callback preserves other callbacks registered for the same type.

## Architecture

- Domain: unchanged.
- Application: unchanged.
- Presentation: owns the extracted event bridge and React bootstrap wiring.
- Infrastructure: unchanged.

## Impact Analysis

### Dependency Impact

- Affected production files: `bootstrapViewer.tsx` and one new
  presentation-local viewer bridge module.
- Affected callers: table and flow viewer entries continue to call
  `bootstrapViewer` without API changes.
- Affected tests: add focused unit coverage for registration, removal,
  dispatch, and invalid-message branches.
- Propagation decision: keep global bridge shape, shared webview events,
  consumers, and webpack entries unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: unchanged.
- VS Code/web extension compatibility: browser-only bridge code remains in the
  shared table/flow webview bundle and gains no Node-only dependency.
- Changed scenarios: none; this is a behavior-preserving presentation refactor.

### Alternative Considerations

- Extract only a message parser: rejected because callback ownership and
  dispatch routing would remain coupled to React bootstrap.
- Redesign the global bridge contract: rejected because consumers do not need
  a contract change and it would widen the compatibility surface.
- Refactor declarative UI definitions with higher raw metrics first: rejected
  because their shape does not expose an equivalent responsibility boundary.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`.
- Re-approval is required for changes to event names or payloads, the global
  bridge shape, webpack entries, React mount behavior, or consumer components.

## Compatibility

- VS Code compatibility remains `^1.75.0`.
- Web extension compatibility: preserve the browser message boundary and avoid
  Node-only dependencies.
- Desktop extension compatibility: preserve identical table and flow webview
  bootstrap behavior.

## Acceptance Criteria

- Viewer bridge routing is independently testable without mounting React.
- Valid and invalid message branches retain current behavior.
- Callback removal retains non-matching callbacks.
- Table and flow viewer entries and global bridge consumers require no API
  changes.
- Relevant tests, desktop and web preparation, production build, and Qlty pass.

## Non-Goals

- Changing shared webview event contracts or payload validation rules.
- Changing viewer UI, React lifecycle, styling, or bundle topology.
- Refactoring table or flow consumer hooks and components.
- Addressing unrelated Qlty metrics or duplication findings.

## Open Questions

- None.
