# PLANS: record-telemetry

## Objective

Maintain delivered telemetry-port behavior.

## Scope

- Preserve privacy constraints and noop fallback behavior.
- Keep host-specific telemetry wiring behind the port.
- Update this feature only when telemetry semantics change.

## Milestones

1. Preserve telemetry port behavior.
2. Add tests when event semantics or fallback behavior changes.
3. Keep privacy constraints explicit.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
