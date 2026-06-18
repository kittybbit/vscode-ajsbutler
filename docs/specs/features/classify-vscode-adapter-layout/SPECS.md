# Feature Specification: Classify VS Code Adapter Layout

## Purpose

Eliminate the legacy `src/extension` bucket by relocating its modules to the
target presentation, infrastructure, or outer bootstrap boundary according to
responsibility.

## Origin

- Feature kind: roadmap feature
- Source: target structure in `AGENTS.md` and `docs/specs/architecture.md`
- Related plan: `docs/specs/plans.md`
- Dependency: `features/establish-extension-composition-root/`

## Requirements

- VS Code commands, diagnostics, language providers, and webview orchestration
  move under a clearly named presentation boundary.
- VS Code-backed telemetry and credential implementations move under
  infrastructure while continuing to implement application-owned ports.
- Activation, lifecycle, dependency construction, and subscription assembly
  move to an outer bootstrap boundary that may compose presentation,
  application, and infrastructure without becoming an inner-layer dependency.
- The root desktop/web extension entry point remains compatible with webpack
  entry configuration and VS Code activation.
- All imports, test paths, TypeScript includes/aliases, and bundle references
  affected by relocation are updated together.
- File relocation must not be combined with logic redesign or behavior change.

## Architecture

- Domain and application: unchanged.
- Presentation: owns VS Code interaction, commands, editor providers, viewer
  orchestration, and adapter dependency types.
- Infrastructure: owns SDK-backed telemetry, credential storage, and other
  technical adapter implementations.
- Composition: the root extension entry and bootstrap own activation,
  construction, subscription assembly, and disposal across outer layers.

## Impact Analysis

### Dependency Impact

- Affected production scope: current `src/extension/**`, `src/extension.ts`,
  imports from bootstrap and tests, webpack entries, and TypeScript test
  includes.
- Affected tests: extension lifecycle/runtime/subscriptions, commands,
  diagnostics-facing wiring, telemetry, credential storage, webview mediator,
  store, factory, routing, and viewer wiring tests.
- Propagation decision: relocate only after composition ownership is explicit;
  update every reference atomically while preserving module APIs where useful.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: no public, command, contribution, or webview
  contract change.
- VS Code/web extension compatibility: both webpack extension entry points and
  browser-safe import chains must remain valid.
- Changed scenarios: none.

### Alternative Considerations

- Rename `src/extension` wholesale to presentation: rejected because telemetry
  and credential implementations have infrastructure responsibility.
- Keep the legacy folder indefinitely: rejected because it obscures the target
  dependency boundaries after responsibilities are explicit.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`.
- Re-approval is required for logic changes, public module/DTO changes, command
  changes, dependency changes, or a partial relocation that leaves ambiguous
  ownership.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve browser entry, fallbacks, and
  host-guarded technical adapters.
- Desktop extension compatibility: preserve activation, commands, diagnostics,
  hover, viewers, telemetry, and WebAPI beta behavior.

## Acceptance Criteria

- No production module remains under the `src/extension/` directory after the
  approved relocation; the webpack entry file `src/extension.ts` remains the
  stable extension entry unless planning proves a path change is necessary.
- Each relocated module has an explicit presentation, infrastructure, or outer
  bootstrap owner.
- Desktop and web bundles retain the existing entry points and contribution
  behavior.
- Tests verify activation, command registration, diagnostics, hover, viewers,
  telemetry selection, and WebAPI host guards after path relocation.
- All affected tests and import-resolution checks pass.
- Quality checks, desktop tests, web tests, and production build pass.

## Non-Goals

- Refactoring module logic, changing use cases, or redesigning bootstrap
  behavior.
- Moving React webview code from `src/ui-component`.
- Changing webpack behavior beyond paths required by relocation.
- Renaming domain, application, shared, generated, or test directories.

## Open Questions

- Planning must classify each current extension module before any move and
  split implementation commits if reviewability requires it.
