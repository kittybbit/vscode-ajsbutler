# Feature Specification: Establish Extension Composition Root

## Purpose

Make extension bootstrap the single place that constructs concrete application
and infrastructure dependencies and injects them into VS Code-facing adapters.

## Origin

- Feature kind: roadmap feature
- Source: `AGENTS.md` activation/bootstrap concern and target dependency rules
- Related plan: `docs/specs/plans.md`
- Dependency: `features/extract-parser-adapter-boundary/`

## Requirements

- Bootstrap constructs concrete telemetry, parser, WebAPI, and application
  dependencies needed by extension adapters.
- Diagnostics, webview document delivery, commands, and other VS Code-facing
  adapters receive explicit callable or typed dependencies instead of
  constructing infrastructure or importing concrete application functions.
- Existing lifecycle and disposal ownership remains explicit.
- Do not introduce a service locator, dependency-injection framework, global
  mutable registry, or new runtime dependency.
- Preserve synchronous parser consumers and asynchronous WebAPI consumers.

## Architecture

- Domain: unchanged.
- Application: exposes use cases and ports without VS Code types.
- Presentation: receives application capabilities through explicit adapter
  dependencies.
- Infrastructure: concrete adapters are constructed by bootstrap and exposed
  only through application-owned ports where applicable.
- Composition: the outer extension entry/bootstrap may depend on presentation,
  application, and infrastructure; those inner layers do not depend back on
  bootstrap.

## Impact Analysis

### Dependency Impact

- Affected composition modules: extension activation, runtime, subscriptions,
  viewer wiring, WebAPI-import wiring, and lifecycle ownership.
- Affected adapters: diagnostics registration, webview document updates,
  preview/import commands, telemetry, and credential-backed WebAPI import.
- Affected tests: bootstrap/runtime/subscription/viewer wiring, diagnostics,
  webview document delivery, command, telemetry, and WebAPI command tests.
- Propagation decision: change construction and injection together while
  leaving use-case output, commands, contribution points, and UI behavior
  unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: public and webview DTOs remain unchanged;
  internal adapter dependency types may change.
- VS Code/web extension compatibility: both hosts retain the same extension
  entry point and host-specific capability decisions.
- Changed scenarios: none.

### Alternative Considerations

- Keep construction distributed across adapter modules: rejected because
  concrete dependency ownership remains implicit.
- Add a dependency-injection container: rejected as unnecessary complexity for
  the current extension size.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`.
- Re-approval is required for user-visible behavior, lifecycle timing,
  contribution-point, DTO, telemetry-scope, or runtime-dependency changes.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve current unsupported-host decisions and
  keep the web bootstrap import chain free of newly introduced Node-only or
  desktop-only dependencies.
- Desktop extension compatibility: activation, disposal, commands, viewers,
  diagnostics, telemetry, and WebAPI beta behavior remain stable.

## Acceptance Criteria

- Concrete application and infrastructure construction has one explicit
  bootstrap owner.
- VS Code adapter modules can be tested with fake dependencies without loading
  concrete infrastructure.
- Activation and disposal occur once and retain existing observable behavior.
- Tests cover desktop/web host selection, dependency construction, command
  registration, and single disposal without concrete network access.
- Desktop tests, web tests, quality checks, and production build pass.
- No new runtime dependency or minimum VS Code change is introduced.

## Non-Goals

- Changing parser, diagnostics, viewer, WebAPI, telemetry, or command behavior.
- Moving source directories into the target presentation layout.
- Introducing a general-purpose container or plugin system.

## Open Questions

- Planning must choose whether the smallest dependency bundle is a typed object
  or focused factory functions.
