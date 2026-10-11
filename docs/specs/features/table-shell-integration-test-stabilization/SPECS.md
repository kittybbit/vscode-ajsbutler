# Feature Specification: Table Shell Integration Test Stabilization

## Purpose

Identify and resolve the inherited Table Viewer shell integration failures
while preserving existing product behavior. Establish evidence for the
historical React update-depth loop, including a bounded non-reproduction result
when applicable.

## Source

- Feature ID: `table-shell-integration-test-stabilization`.
- Kind: roadmap; category: Quality / Test Infrastructure.
- Priority: P0 selected by the user for this intake.
- [Roadmap: Table Shell Host Failures](../../roadmap.md#table-shell-host-failures).
- [View Unit List](../../../requirements/use-cases/uc-view-unit-list.md).
- [Navigate Between Unit List And Flow Graph](../../../requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md).
- User's development instruction dated 2026-10-11 and subsequent request to
  proceed; Main selected verification-only planning after current reproduction.
- JP1/AJS basis: retain the current normalized definition and unit-list
  meaning; this feature introduces no new JP1/AJS interpretation.

## Requirements and acceptance

- R1 / AC-1: Account for all seven cases in
  `src/test/suite/tableShellIntegration.test.ts`. Record each test name,
  contract-backed expectation, observed behavior/error, execution identity,
  reproduction conditions, suspected cause, and supporting evidence. Distinguish
  historical failures from current observations and unavailable checks.
- R2 / AC-2: Classify each failure using evidence as product, test, environment,
  synchronization, React state/rendering, event handling, contract mismatch, or
  another justified cause. Record why any cause remains unconfirmed.
- R3 / AC-3: All seven retained cases pass against verified existing behavior
  with the smallest contract-preserving repair only if a failure is confirmed.
  A zero-code verification outcome is valid when current failures do not
  reproduce. Demonstrate stability under
  criteria defined and independently reviewed at planning. Do not delete/skip
  cases, weaken assertions, blindly
  change expectations, suppress warnings/errors, or mask failures with
  unrestricted retries or timeout increases.
- R4 / AC-4: Preserve list content/order, search, sorting, selection,
  provisional keyboard focus and commit behavior, tree/grid/detail focus
  handoffs, definition details, CSV export, and counterpart navigation.
- R5 / AC-5: Investigate the historical update-depth loop using available
  history and current evidence. Record execution order, DOM/React setup,
  state/effect dependencies, callback registration and mount/unmount conditions
  relevant to reproduction. If it cannot be reproduced, retain the exact
  conditions and limitations; do not introduce a speculative repair.
- R6 / AC-6: Record a full Desktop suite result after stabilization. Any
  residual unrelated failure requires cause, owner, and a separately reviewed
  disposition before claiming the roadmap done condition.
- R7 / AC-7: Demonstrate no regression in Web Extension tests and builds.
  Preserve minimum-version compatibility with relevant host evidence.

## Decisions and impact

- The initial investigation covers the seven shell cases, Table Viewer
  components/state/events, suite DOM/React setup, and Desktop runner. A local
  product/test/harness repair may be proposed only after evidence establishes
  the responsible boundary and an implementation slice is approved.
- React version, DOM identity, asynchronous synchronization, callback lifetime,
  and component state are hypotheses, not established causes.
- Architecture ownership remains unchanged: application owns DTOs and unit-list
  meaning; webview presentation owns rendering, focus, state and search; host
  infrastructure remains at its existing boundary. No dependency-test exception
  or parser leakage is permitted.
- No durable use-case change is intended. The roadmap item remains unfinished
  until its done condition is verified and closure is separately approved.

## Compatibility

- Preserve `engines.vscode: ^1.75.0`, Desktop and Web extensions, and current
  JP1/AJS3 definition interpretation and viewer DTO/message contracts.
- Preserve parser, list, flow, CSV, unit definition, diagnostics, hover,
  navigation, WebAPI import, semantic diff/report and telemetry behavior.
- Shared production code remains browser-safe with no Node built-in imports;
  telemetry remains cataloged and privacy-conscious.

## Non-goals

- New Table Viewer features or UI redesign.
- Semantic Diff changes or Flow Graph golden alignment.
- React major-version changes or wholesale test-framework migration.
- Broad architecture/test infrastructure rewrites or unrelated test repairs.
- Changes to the VS Code minimum version or JP1/AJS interpretation.
- Remediating unrelated React act warnings without a confirmed failure.

## Open questions

Current focused and full Desktop executions pass all seven cases. Historical
root causes remain unconfirmed because original logs are unavailable. Main
selected verification-only completion: no causal attribution to prior host
work and no speculative product repair. New confirmed failures require an
evidence-backed repair plan before code editing.
