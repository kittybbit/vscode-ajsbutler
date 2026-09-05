# Roadmap

This roadmap contains only unfinished repository-level future work and the
entry conditions that make planning each item useful.

## Product Decisions

### WebAPI Import Beta Exit

- Entry condition: usable smoke-verification evidence from a real JP1/AJS3
  WebAPI environment and enough user feedback are available.
- Decide whether the delivered read-only import can exit beta after the owning
  feature records product and version context, tested scenarios, observed
  results, host constraints, and the sufficiency of
  `searchTarget=DEFINITION`.
- Keep broader WebAPI behavior outside this decision.

## Semantic Diff Roadmap

### Wave 2: Schedule Semantics

#### Expand Schedule Interpretation And Supported Semantics

- Origin: proposals R-3 and E-3.
- Separate interpretation, run projection, and comparison so calendar,
  inheritance, 48-hour, cycle, shift, and closed-day behavior can be added in
  reviewed slices.
- Entry condition: current supported projections and uncalculated reasons are
  captured as a regression baseline.

### Wave 3: Review Exploration And Comparison Entry

#### Add A Semantic Diff Explorer

- Origin: proposals N-1 and E-4.
- Add an interactive change tree, confirmation-required filtering, source
  navigation, and Flow Viewer integration on top of the existing highlight
  foundation.
- Entry condition: Wave 1 contracts are stable and the existing Flow Viewer
  highlight foundation can be reused.

#### Improve The Semantic Diff Comparison Workflow

- Origin: proposal F-1.
- Provide user-facing comparison naming, file and Git HEAD comparison sources,
  comparison-period input, and handoff to the applicable review view or output.
- Entry condition: the Explorer handoff and internal schedule-impact artifact
  and session contracts are available. File, Git HEAD, and comparison-period
  boundaries are stable; public calendar presentation is not a prerequisite.

### Wave 4: Schedule Impact Presentation

#### Add A Schedule Impact Calendar

- Origin: proposal N-3.
- Present added, removed, changed-time, zero-run, and uncalculated schedule
  effects for a selected comparison period.
- Entry condition: schedule interpretation and run-projection contracts are
  stable. Internal artifact and session support precedes the comparison
  workflow; the public calendar action follows the completed period-bearing
  workflow and Explorer handoff.
