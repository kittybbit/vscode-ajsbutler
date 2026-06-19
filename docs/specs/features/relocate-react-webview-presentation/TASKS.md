# Relocate React Webview Presentation Tasks

## Current Task

- Status: Approved
- Scope: move all 74 modules under `src/ui-component/` together to
  `src/presentation/webview/`, preserving the existing `editor/`, `ajsTable/`,
  and `ajsFlow/` subtree and changing only paths required by the relocation.
- Acceptance: update every internal cross-layer relative import, the two
  webpack viewer entries, direct test imports, and documentation paths; remove
  the unused `@ui-component/*` TypeScript alias; leave no production file or
  stale reference under `src/ui-component/`.
- Validation: run `rtk pnpm run qlty`, `rtk pnpm run test:compile`,
  `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
  `rtk pnpm run lint:md`.

## Human Approval

- Status: Approved
- Approved at: 2026-06-19
- Approved scope: relocate the complete `src/ui-component/` subtree and update
  only the paths, references, tests, configuration, and documentation required
  to preserve existing desktop and web viewer behavior.

Implementation must not start while Status is Pending.

## Decision Notes

- The table and flow viewers share bootstrap, context, dialog, and callback
  modules, so splitting their relocation would create a temporary duplicate or
  mixed-ownership tree without reducing behavior risk.
- Fifty-five modules have relative imports into application, domain, shared,
  or resource code that must gain one parent level after the move.
- Direct path references exist in ten presentation-focused test files,
  `webpack.config.js`, `tsconfig.json`, and the WebAPI boundary test allowlist.
- `@ui-component/*` has no source consumer, so adding a replacement alias would
  be unnecessary.
- No command, DTO, event, bundle name, dependency, UI behavior, or VS Code
  `^1.75.0` compatibility change is approved.

## Use-Case Back-Propagation

- No behavioral scenario changes are required. Preserve the existing unit-list,
  flow-graph, CSV export, cross-view navigation, and unit-definition contracts.
- Update the presentation-owner path in `uc-build-flow-graph.md`; update live
  paths in `architecture.md` and `current-state.md` with the relocation.
