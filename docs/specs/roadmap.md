# Roadmap

This roadmap contains only unfinished repository-level future work and the
entry conditions that make planning each item useful.

## Planned Features

### Accessible List And Flow Graph Exploration

- Feature:
  [`accessible-list-and-flow-graph-exploration`](./features/accessible-list-and-flow-graph-exploration/SPECS.md)
- Purpose: make unit search, selection, relationship traversal, and detail
  inspection practical in the unit-list and flow-graph viewers through
  keyboard, assistive-technology, and high-contrast paths.
- Entry condition: the feature's complete presentation-layer implementation
  slice plan resolves the interaction model, focus fallback, semantic state,
  notification, and desktop/web validation decisions; the reviewed plan then
  receives Human Approval.
- Keep extension-wide WCAG certification, JP1/AJS interpretation changes, and
  Domain, Application, parser, or host changes outside this feature.

## Product Decisions

### WebAPI Import Beta Exit

- Entry condition: usable smoke-verification evidence from a real JP1/AJS3
  WebAPI environment and enough user feedback are available.
- Decide whether the delivered read-only import can exit beta after the owning
  feature records product and version context, tested scenarios, observed
  results, host constraints, and the sufficiency of
  `searchTarget=DEFINITION`.
- Keep broader WebAPI behavior outside this decision.

### Telemetry Product Learning

- Entry condition: analytics usage, product reporting, or an approved feature
  creates a concrete product question that existing evidence cannot answer.
- Decide dashboard compatibility, exact performance and size buckets,
  diagnostic rule identifiers, and observable abandonment semantics only when
  a concrete consumer requires them.
- Add runtime telemetry only with the corresponding approved feature behavior,
  using `docs/requirements/cross-cutting/telemetry.md` as the durable privacy
  and operational contract.

## Deferred Candidates

### Build And Test Output Ownership

- Entry condition: packaging, caching, or stale-output behavior becomes a
  concrete blocker.
- Candidate: assign clearer ownership to build and test output directories.

### Shared Search Use Case

- Entry condition: at least two non-table consumers require equivalent
  matching or result-navigation semantics.
- Candidate: define a shared search contract while leaving renderer-specific
  camera and ranking behavior with its presentation owners.

### Broader WebAPI Support

- Entry condition: the read-only import boundary, authentication model, and
  beta feedback are stable enough to define one concrete extension safely.
- Candidate: plan one focused WebAPI capability beyond read-only import.

### Viewer Bundle-Size Reduction

- Entry condition: a concrete compatibility, startup-time, or payload-size
  target makes viewer bundle size a product or operational constraint.
- Candidate: plan viewer-specific bundle reduction against that target.

### Translation-Resource Consolidation

- Entry condition: translation-resource maintenance becomes a concrete
  blocker.
- Candidate: consolidate only the affected i18n resources.

### JP1/AJS View Interaction Parity

- Entry condition: a concrete missing interaction is identified against the
  supported JP1/AJS View behavior.
- Candidate: define and implement that interaction as a focused feature.

### Expanded-Flow Layout Fixtures

- Entry condition: real-world nested layouts expose an additional collision or
  refit gap.
- Candidate: add focused regression fixtures for the observed layout case.
