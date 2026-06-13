# limit-flow-selector-to-root-jobnets Tasks

## Current Task

- Status: Proposed
- Scope:
  decide whether the temporary root-jobnet-only flow scope boundary should be
  kept as durable behavior or removed after job-group flow layout is addressed.
- Acceptance:
  the completed implementation keeps job groups visible in the flow selector
  and unit list, but direct selector interaction and unit-list-to-flow reveal
  navigation resolve active flow scopes to root jobnets.
- Validation:
  future changes must keep focused selector and reveal-target coverage, plus
  desktop and web validation when shared webview behavior changes.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Decision Notes

- The approved implementation slice is complete.
- Direct flow selector interaction no longer lets job groups set
  `currentUnitId`.
- Unit-list-to-flow reveal navigation for a job group now resolves to a
  descendant root jobnet flow scope.
- The implemented boundary is still temporary because job-group flow layout
  behavior has not been decided.
- The next decision is whether to preserve this as a durable selector/reveal
  rule or replace it with explicit job-group flow layout support.

## Use-Case Back-Propagation

- No durable use-case update is needed while this remains a transient branch
  feature.
- If the root-jobnet-only selector and reveal boundary becomes permanent,
  update `docs/requirements/use-cases/uc-build-flow-graph.md` or
  `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`
  before removing this feature folder.
