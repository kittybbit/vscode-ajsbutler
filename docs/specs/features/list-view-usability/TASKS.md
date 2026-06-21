# List View Usability Tasks

## Current Task

- Status: None
- Scope: Select and investigate the next feature task with `sdd-plan-task`.

## Human Approval

- Status: Pending
- Approved at: Not yet approved
- Approved scope: None

Implementation must not start while approval is pending.

## Follow-Up

- Investigate the next ordered slice: discoverable list-to-flow navigation
  actions using stable unit identity and the existing viewer bridge contract.
- Keep shared query semantics outside presentation until a separately approved
  investigation satisfies `uc-search-domain-unification.md`.
- The shared-header search task passed automated desktop and web checks, but
  manual VS Code Web interaction verification remains outstanding because the
  local viewer URL was blocked by the browser security policy. Recheck
  Ctrl/Cmd+F, Enter, Shift+Enter, blur, clear, table mode switching, result
  counts, helper text, and narrow-header layout when a permitted host is
  available.

## Use-Case Back-Propagation

- No durable use-case change resulted from the presentation-only shared search
  extraction.
- Revisit `uc-search-domain-unification.md` only if a future task requires
  shared matching, normalization, result navigation, or validation semantics.
