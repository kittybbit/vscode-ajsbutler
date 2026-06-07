# TASKS: qlty-driven-architecture-refactoring

## Record Rule

Keep only information needed for the next implementation decision or for
deciding whether a change must be reflected back into a use case. Do not keep a
complete work log, per-slice history, or validation transcript after it no
longer affects approval, risk, or use-case back-propagation.

Update `docs/specs/plans.md` only when the branch starts, stops, or changes an
active feature. Slice progress stays in this file.

## Current Status

- Active task:
  None.
- Runtime status:
  Slice-5-V table model setup hook cleanup is complete.
- Use-case reflection:
  None required. Slice-5-V preserved the existing table viewer row-model
  contract covered by `uc-build-unit-list-view.md`, including row shape, column
  definitions, global filtering, sorting, definition-dialog actions, jump
  callback usage, and desktop/web shared row consumption.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  none

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

## Active Tasks

- [x] Select Slice-4-G schedule diagnostic helper decomposition as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-G.
- [x] Implement Slice-4-G inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-H viewer message routing dispatch cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-H.
- [x] Implement Slice-4-H inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-I diagnostics registration event cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-I.
- [x] Implement Slice-4-I inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-J viewer counterpart reveal wiring cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-J.
- [x] Implement Slice-4-J inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-K WebAPI import input collection cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-K.
- [x] Implement Slice-4-K inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-L flow viewer controller state composition cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-L.
- [x] Implement Slice-4-L inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-M flow graph state data assembly cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-M.
- [x] Implement Slice-4-M inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-N flow search state action cleanup as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-N.
- [x] Implement Slice-4-N inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-O flow viewer side-effect cleanup as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-O.
- [x] Implement Slice-4-O inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-P flow node visual state style cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-P.
- [x] Implement Slice-4-P inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-Q flow expanded ancestor helper cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-Q.
- [x] Implement Slice-4-Q inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-R flow search result assembly cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-R.
- [x] Implement Slice-4-R inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-S nested expansion descendant collection cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-S.
- [x] Implement Slice-4-S inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-T expanded flow graph orchestration setup cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-T.
- [x] Implement Slice-4-T inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-U expanded child growth offset cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-U.
- [x] Implement Slice-4-U inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-V flow reveal target helper cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-V.
- [x] Implement Slice-4-V inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-W schedule date day token validation cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-W.
- [x] Implement Slice-4-W inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-X expanded panel bounds helper cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-X.
- [x] Implement Slice-4-X inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-Y lower expanded panel intrusion helper cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-Y.
- [x] Implement Slice-4-Y inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-Z bounds overlap predicate cleanup as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-Z.
- [x] Implement Slice-4-Z inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-A explicit schedule rule value helper cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-A.
- [x] Implement Slice-5-A inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-B weekly cycle schedule compatibility helper cleanup as
      the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-B.
- [x] Implement Slice-5-B inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-C days-from-start schedule rule helper cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-C.
- [x] Implement Slice-5-C inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-D delay and wait schedule value validator cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-D.
- [x] Implement Slice-5-D inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-E expanded flow graph build input object cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-E.
- [x] Implement Slice-5-E inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-F expanded layout display position anchoring helper cleanup
      as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-F.
- [x] Implement Slice-5-F inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-G expanded child growth offset application helper cleanup
      as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-G.
- [x] Implement Slice-5-G inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-H expanded panel subtree bounds helper cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-H.
- [x] Implement Slice-5-H inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-I expanded child growth measurement application helper
      cleanup as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-I.
- [x] Implement Slice-5-I inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-J sibling subtree collision target movement helper cleanup
      as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-J.
- [x] Implement Slice-5-J inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-K expanded panel intrusion target movement helper cleanup
      as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-K.
- [x] Implement Slice-5-K inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-L expanded scope relayout phase orchestration cleanup as
      the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-L.
- [x] Implement Slice-5-L inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-M unit-list document assembly orchestration cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-M.
- [x] Implement Slice-5-M inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-N unit-list document view legacy UnitEntity adapter
      cleanup as the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-N.
- [x] Implement Slice-5-N inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-O normalized jobnet state gate helper cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-O.
- [x] Implement Slice-5-O inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-P normalized layout parent fallback helper cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-P.
- [x] Implement Slice-5-P inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-Q schedule date diagnostic helper extraction cleanup as
      the next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-Q.
- [x] Implement Slice-5-Q inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Select Slice-5-R unit-list linked-unit direction helper cleanup as the
      next candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-5-R.
- [x] Implement Slice-5-R inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Record the behavior-preservation and use-case reflection decision for
      Slice-5-S.
- [x] Record human approval for Slice-5-S.
- [x] Implement Slice-5-S inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Record the behavior-preservation and use-case reflection decision for
      Slice-5-T.
- [x] Record human approval for Slice-5-T.
- [x] Implement Slice-5-T inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Record the behavior-preservation and use-case reflection decision for
      Slice-5-U.
- [x] Record human approval for Slice-5-U.
- [x] Implement Slice-5-U inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select the next candidate only if it has meaningful responsibility,
      boundary, or use-case value.
- [x] Record the behavior-preservation and use-case reflection decision for
      Slice-5-V.
- [x] Record human approval for Slice-5-V.
- [x] Implement Slice-5-V inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.

## Validation Plan

- For the next code slice, run `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

## Deferred Use-Case Backlog

- None.

Completed Slice-1, Slice-2, Slice-3, Slice-4-A, Slice-4-B, Slice-4-C,
Slice-4-D, Slice-4-E, Slice-4-F, Slice-4-G, Slice-4-H, Slice-4-I, Slice-4-J,
Slice-4-K, Slice-4-L, Slice-4-M, Slice-4-N, Slice-4-O, Slice-4-P, Slice-4-Q,
Slice-4-R, Slice-4-S, Slice-4-T, Slice-4-U, Slice-4-V, Slice-4-W, Slice-4-X,
Slice-4-Y, Slice-4-Z, Slice-5-A, Slice-5-B, Slice-5-C, Slice-5-D, Slice-5-E,
Slice-5-F, Slice-5-G, Slice-5-H, Slice-5-I, Slice-5-J, Slice-5-K, Slice-5-L,
Slice-5-M, Slice-5-N, Slice-5-O, Slice-5-P, Slice-5-Q, Slice-5-R, Slice-5-S,
Slice-5-T, Slice-5-U, and Slice-5-V refactors were behavior-preserving and do
not currently require use-case updates. The
`buildUnitListView.ts` / WebAPI DTO duplication finding is not a current
candidate because it appears to be DTO copy-shape similarity rather than shared
behavior. Remaining domain-unit duplication clusters should only be reopened
when they represent a stronger shared JP1/AJS business concept or use-case need
than getter-shape similarity alone.
