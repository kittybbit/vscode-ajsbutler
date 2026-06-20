# Feature Specification: Clarify Unit-List Document Rehydration

## Purpose

Make the production purpose and allowed boundary of unit-list DTO-to-model
rehydration explicit without changing list or flow-viewer behavior.

## Origin

- Source: architecture review finding that `toRootUnits` and `toAjsDocument`
  are production exports whose intended ownership was unclear
- Feature kind: transient branch feature
- Related plan: `docs/specs/plans.md`

## Requirements

- Verify every production and test reference to `toRootUnits` and
  `toAjsDocument` before changing their visibility or location.
- Retain the production rehydration path required by the table and flow
  viewers, and document why an application-owned DTO is converted back to the
  normalized AJS model at that boundary.
- Keep raw `Unit` reconstruction internal unless a production caller requires
  it directly.
- Move test-only helpers to test support when doing so does not duplicate or
  expose production conversion mechanics.
- Preserve the existing DTO shape and viewer behavior.
- Do not introduce parser, VS Code, React, or webview-library dependencies into
  domain or application model code.

## Architecture

- Domain: continue to own raw `Unit`, normalized `AjsDocument`, and
  normalization behavior without presentation dependencies
- Application: own the unit-list DTO contract and the explicit conversion from
  that DTO into the normalized model when required by application consumers
- Presentation: consume the application conversion instead of reconstructing
  raw parser-adjacent models itself
- Infrastructure: none

## Impact Analysis

### Dependency Impact

- Expected direct edits:
  `src/application/unit-list/unitListDocument.ts` and
  `src/test/suite/buildUnitList.test.ts`.
- Production consumers to preserve and validate:
  `src/presentation/webview/editor/ajsTable/TableContents.tsx` and
  `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`.
- Propagation decision: production `toAjsDocument` behavior remains available;
  complete reference analysis found no production caller for `toRootUnits`, so
  raw `Unit` reconstruction can become an internal implementation detail.

### Breaking Change Analysis

- User-visible behavior: none
- API/DTO/schema compatibility: preserve `UnitListDocumentDto` and its current
  serialized shape
- VS Code/web extension compatibility: preserve both desktop and web viewer
  paths; add no host-specific dependency
- Changed scenarios: none

### Alternative Considerations

- Move both functions directly to test support: rejected because
  `toAjsDocument` has production table and flow-viewer consumers.
- Leave the exports unexplained: rejected because the reverse conversion looks
  accidental and invites unsafe removal or presentation-local reconstruction.
- Rework the viewer transport contract: deferred because it is a broader
  serialization-boundary change and not required to clarify current ownership.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval: DTO schema changes, viewer transport
  redesign, parser or normalization behavior changes, or changes to observable
  list and flow behavior.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve the existing plain-DTO transport and
  host-neutral conversion path
- Desktop extension compatibility: preserve current list and flow behavior
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The production reason for DTO-to-`AjsDocument` rehydration is explicit at the
  owning boundary.
- `toAjsDocument` remains available to its production viewer consumers unless
  an approved replacement is introduced.
- `toRootUnits` is not exported for test convenience alone; its visibility is
  justified by production references or reduced safely.
- Unit-list DTO shape, normalization results, table behavior, and flow-viewer
  behavior remain unchanged.
- Relevant desktop and web checks pass after implementation.

## Non-Goals

- Redesigning webview serialization or viewer message contracts
- Removing `UnitListDocumentDto`
- Changing normalization semantics, parser output, list rows, flow nodes, or
  user-visible behavior
