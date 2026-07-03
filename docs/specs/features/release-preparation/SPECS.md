# Feature Specification: Release Preparation

## Purpose

Prepare the current branch for the next extension release by defining a
temporary release-readiness gate that verifies required validation,
release-facing documentation, packaging metadata, and compatibility risk
without changing extension behavior.

## Origin

- Source use case: none; this is a transient branch feature for release
  readiness.
- Branch plan: docs/specs/plans.md
- Implementation-slice plan: TASKS.md

## Requirements

- Confirm whether the release requires version, package metadata, README,
  CHANGELOG, or marketplace-facing documentation updates.
- Decide CHANGELOG contents from the diff between the previous released tag and
  the release candidate.
- Use `pnpm version` for approved package version updates.
- Confirm that required validation for the release candidate is explicit before
  packaging or publishing work starts.
- Use `vsce` for approved package verification and Marketplace publishing.
- Confirm the approved release tag and push sequence before tagging or pushing
  release evidence to the remote repository.
- Preserve existing parser, list view, flow view, CSV export, diagnostics,
  hover, WebAPI beta, and telemetry behavior unless a separate approved feature
  changes them.
- Preserve the declared VS Code compatibility contract in `package.json`
  `engines.vscode`.
- Preserve web extension support and avoid introducing Node-only assumptions
  into shared or web paths.
- Record any release-blocking risk as follow-up instead of hiding it inside
  release mechanics.

## Architecture

- Domain: no behavior changes.
- Application: no behavior changes.
- Presentation: no behavior changes.
- Infrastructure: release packaging, generated artifacts, or adapter changes
  are out of scope unless separately approved.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  release-facing docs, package metadata, validation commands, and packaging
  outputs may be inspected or updated in implementation slices. Runtime
  callers, components, commands, adapters, and domain/application contracts are
  not changed by this feature purpose.
- Propagation decision: release readiness findings may update the smallest
  necessary release-facing document or metadata surface; behavior changes must
  become separate SDD work.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: none intended.
- VS Code/web extension compatibility: must remain compatible with the
  declared support matrix.
- Changed scenarios: none.

### Alternative Considerations

- Treat release prep as ad hoc maintenance: rejected because package metadata,
  validation expectations, and release documentation can affect generated
  artifacts or user-facing release quality.
- Fold release prep into an active product feature: rejected because release
  readiness is branch-local operational work and should not broaden product
  feature scope.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval: runtime behavior changes, test
  expectation changes, generated artifact changes beyond release packaging,
  compatibility contract changes, dependency updates, or broad documentation
  changes outside release readiness.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: must remain unchanged unless a separate approved
  feature changes it.
- Desktop extension compatibility: must remain unchanged unless a separate
  approved feature changes it.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Release readiness checks and required validation are listed in TASKS.md.
- Human Approval remains pending until a concrete release-preparation slice is
  reviewed and approved.
- Any required release-facing documentation or metadata update is scoped before
  implementation.
- CHANGELOG update need is evaluated using docs/specs/README.md.
- CHANGELOG contents are checked against the previous released tag diff.
- Approved version changes use `pnpm version`.
- Approved package verification and publish steps use `vsce`.
- Approved tag creation and push steps are recorded before execution.
- VS Code desktop and web compatibility risks are evaluated before feature
  exit.
- No runtime behavior change is included in this feature.

## Non-Goals

- Fixing release-blocking runtime defects.
- Adding, removing, or changing extension features.
- Modernizing dependencies.
- Raising the minimum supported VS Code version.
- Exiting the WebAPI import beta.
- Publishing the release without a separately approved implementation slice.
- Creating or pushing release tags without the approved release-publish slice.

## Open Questions

- Which release version and target date should this temporary feature prepare?
- Which packaging or publishing command sequence is the release authority for
  this repository?
- Should release publication create and push an annotated `v1.16.0` tag from
  the release commit, or use another repository-owned tagging convention?
