# Feature Specification: Retire Current-State Snapshot

## Purpose

Retire the stale `docs/specs/current-state.md` snapshot after relocating only
the information that remains useful for durable guidance or active work.

## Origin

- Source: architecture review finding that `current-state.md` no longer
  matches the implementation, including its description of semantic
  diagnostics as raw-model consumers
- Feature kind: transient branch feature
- Related plan: `docs/specs/plans.md`

## Requirements

- Remove `current-state.md` only after every still-relevant statement has an
  explicit destination or is confirmed redundant with existing documentation.
- Move reusable fixture guidance to `docs/specs/README.md` or an appropriate
  testing document.
- Keep confirmed product direction in `docs/specs/roadmap.md` or
  `docs/specs/architecture.md` only when it is not already represented there.
- Keep unresolved JP1/AJS WebAPI beta verification in the existing
  `import-definition-via-webapi` feature tasks and branch plan.
- Keep actionable architecture migration priorities in
  `docs/specs/architecture.md`.
- Remove `current-state.md` from the recommended reading order and document
  role list when the snapshot is deleted.
- Avoid copying stale implementation inventories into another long-lived
  snapshot.

## Architecture

- Domain: none
- Application: none
- Presentation: none
- Infrastructure: none
- Documentation boundary: durable architecture decisions belong in
  `architecture.md`, repository sequencing in `roadmap.md`, active WebAPI
  evidence in its feature `TASKS.md`, and contributor workflow in `README.md`.

## Impact Analysis

### Dependency Impact

- Affected docs: `docs/specs/current-state.md`, `docs/specs/README.md`,
  `docs/specs/architecture.md`, `docs/specs/roadmap.md`,
  `docs/specs/plans.md`, and potentially the active WebAPI feature tasks.
- Propagation decision: preserve only current, non-duplicated guidance; runtime
  code, tests, generated artifacts, configuration, and use-case contracts stay
  unchanged.

### Breaking Change Analysis

- User-visible behavior: none
- API/DTO/schema compatibility: none
- VS Code/web extension compatibility: none; this is documentation-only
- Changed scenarios: none

### Alternative Considerations

- Refresh `current-state.md`: rejected because a manually maintained
  implementation snapshot will become stale again and duplicates architecture,
  roadmap, plans, and feature-task responsibilities.
- Delete it without relocation review: rejected because fixture guidance and
  unresolved work could be lost.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval: runtime, test, generated-artifact, or
  configuration edits; new product behavior; or unrelated documentation
  restructuring.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: unaffected
- Desktop extension compatibility: unaffected
- Model, Serena, or agent choice does not change this documentation boundary or
  the SDD approval gate.

## Acceptance Criteria

- `current-state.md` is removed only after its current, useful content is
  retained in the responsible durable or active document.
- No stale claim about semantic diagnostics consuming the raw model remains.
- The SDD reading order and document-role guidance no longer reference
  `current-state.md`.
- Existing WebAPI beta verification remains visible in its active feature.
- Documentation validation passes.

## Non-Goals

- Refactoring `UnitListDocumentDto` conversion exports in
  `src/application/unit-list/unitListDocument.ts`
- Changing parser, diagnostics, normalization, WebAPI, bootstrap, telemetry,
  desktop, or web-extension behavior
- Creating a replacement implementation-state snapshot

## Open Questions

- Whether fixture guidance belongs directly in `docs/specs/README.md` or in a
  dedicated existing testing document should be decided during task planning.
