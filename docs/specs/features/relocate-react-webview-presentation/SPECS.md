# Feature Specification: Relocate React Webview Presentation

## Purpose

Relocate React webview presentation from `src/ui-component` to
`src/presentation/webview` without changing viewer behavior.

## Origin

- Feature kind: roadmap feature
- Source: target structure in `AGENTS.md` and `docs/specs/architecture.md`
- Related plan: `docs/specs/plans.md`
- Dependency: `features/classify-vscode-adapter-layout/`

## Requirements

- React table, flow, dialog, context, bootstrap, and presentation-local helper
  modules move together under `src/presentation/webview`.
- Webpack viewer entries, TypeScript aliases, imports, and test references are
  updated to the new presentation path.
- Application DTO and shared event dependencies remain unchanged.
- Presentation-local search, table formatting, CSV view adaptation, flow
  layout, and interaction logic are not redesigned during relocation.
- No React, MUI, XyFlow, or webview dependency moves into domain/application.

## Architecture

- Domain, application, and infrastructure: unchanged.
- Presentation: explicitly owns React webview components, controllers, layout,
  view adapters, and browser entry modules.

## Impact Analysis

### Dependency Impact

- Affected production scope: current `src/ui-component/**`, webpack table/flow
  viewer entries, TypeScript alias configuration, and imports from tests.
- Affected tests: table filtering/export, flow graph view/layout/search,
  selection, nested expansion, reveal, and unit-definition interactions.
- Propagation decision: update the complete presentation subtree and all path
  references together; do not alter application or shared contracts.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: unchanged.
- VS Code/web extension compatibility: table and flow viewer bundles must retain
  their current entry behavior in desktop and web hosts.
- Changed scenarios: none.

### Alternative Considerations

- Keep `src/ui-component`: rejected because it hides the established
  presentation-layer ownership.
- Mix relocation with component cleanup: rejected to keep review focused and
  behavior-preserving.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`.
- Re-approval is required for UI behavior, DTO/event contracts, dependencies,
  bundle topology, or component logic changes beyond required import paths.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve table and flow browser bundles and
  standard JSON event boundaries.
- Desktop extension compatibility: preserve viewer rendering, interaction,
  navigation, CSV export, and unit-definition behavior.

## Acceptance Criteria

- No production module remains under `src/ui-component`.
- React/webview production code resides under `src/presentation/webview`.
- Webpack entries and TypeScript aliases resolve the new paths.
- Desktop and web viewer bundles expose the same table/flow entry behavior and
  do not gain Node-only imports.
- Existing table, flow, interaction, and presentation tests pass unchanged
  except for import paths.
- Quality checks, desktop tests, web tests, and production build pass.

## Non-Goals

- Component redesign, styling changes, or viewer behavior changes.
- Moving VS Code extension adapters.
- Changing application DTOs, shared events, dependencies, or bundle contents.
- Refactoring presentation-local algorithms.

## Open Questions

- None.
