# TASKS: qlty-driven-architecture-refactoring

## Record Rule

Keep only information needed for the next implementation decision or for
deciding whether a change must be reflected back into a use case. Do not keep a
complete work log, per-slice history, or validation transcript after it no
longer affects approval, risk, or use-case back-propagation.

## Current Status

- Active task:
  none.
- Runtime status:
  Slice-4-A WebAPI import command orchestration cleanup is complete.
- Use-case reflection:
  None required. The implementation preserved current beta WebAPI import
  command semantics, prompt text, credential behavior, request DTO shape,
  success/error messages, telemetry events, and desktop/web compatibility.

## Human Approval

- Status: Pending
- Approved at:
  none.
- Approved scope:
  none.

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved.

## Active Tasks

- [x] Complete Slice-4-A WebAPI import command orchestration cleanup.
- [x] Reconfirm that use-case reflection is unnecessary.
- [ ] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.

## Validation Plan

- For the next code slice, run `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

## Deferred Use-Case Backlog

- None.

Completed Slice-1, Slice-2, Slice-3, and Slice-4-A refactors were
behavior-preserving and do not currently require use-case updates. Remaining
domain-unit duplication clusters should only be reopened when they represent a
stronger shared JP1/AJS business concept or use-case need than getter-shape
similarity alone.
