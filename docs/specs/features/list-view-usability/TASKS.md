# List View Usability Tasks

## Current Task

- Status: Proposed
- Scope: investigate presentation-level search UI sharing as the next slice;
  no runtime scope is currently approved
- Acceptance: define the shared interaction boundary while keeping table
  filtering and flow reveal separate
- Validation: determine focused component, desktop, and web checks during
  impact investigation

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while approval is pending.

## Decision Notes

- Use `sdd-plan-task` before starting the search UI slice.
- A shared application or domain search contract remains outside the next
  presentation slice unless a new investigation satisfies the search-domain
  use-case trigger and receives separate approval.
- Header refresh follow-up: dark-theme and window-scroll visual checks were not
  completed in the automated browser session. Desktop tests, web smoke tests,
  build, and a light-theme narrow-width browser check passed.

## Use-Case Back-Propagation

- The completed Header slice did not change a durable use-case contract.
- Revisit `uc-search-domain-unification.md` only if a later investigation
  proposes shared query semantics outside presentation code.
