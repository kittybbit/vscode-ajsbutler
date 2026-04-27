# PLANS: provide-editor-feedback

## Objective

Maintain delivered diagnostics and hover behavior.

## Scope

- Preserve desktop and web feedback behavior.
- Keep activation or registration refactors in runtime-boundary docs unless
  feedback behavior changes.
- Update this feature only when diagnostics or hover semantics change.

## Milestones

1. Preserve diagnostics and hover behavior.
2. Add tests when feedback semantics change.
3. Keep adapter wiring isolated.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
