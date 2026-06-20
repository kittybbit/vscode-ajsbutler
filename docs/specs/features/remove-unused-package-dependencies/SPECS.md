# Feature Specification: Remove Unused Package Dependencies

## Purpose

Remove direct package dependencies that have no required runtime, build,
test, generation, packaging, or development-tool role in this repository.

## Origin

- Feature kind: transient branch feature
- Source: branch goal to remove unused entries remaining in `package.json`
- Related plan: `docs/specs/plans.md`

## Requirements

- Audit every direct entry in `dependencies` and `devDependencies` before
  proposing removal candidates.
- Check TypeScript and JavaScript imports, package scripts, webpack and
  TypeScript configuration, linting, test runners, generated-artifact tooling,
  VS Code packaging, and browser fallbacks; absence of a source import alone
  is not proof that a package is unused.
- Remove only direct entries whose repository role is disproved by complete
  reference and configuration analysis.
- Update `pnpm-lock.yaml` through the pinned package manager so the manifest
  and lockfile remain consistent and reproducible.
- Preserve runtime behavior, build output assumptions, development commands,
  desktop extension execution, and web extension execution.
- Keep `package.json` `engines.vscode` unchanged.

## Architecture

- Domain: none
- Application: none
- Presentation: none
- Infrastructure: none
- Package/toolchain boundary: dependency declarations and lockfile resolution
  may change; production responsibilities and source boundaries do not.

## Impact Analysis

### Dependency Impact

- Expected changed files: `package.json` and `pnpm-lock.yaml`.
- Files to inspect without incidental edits include source imports, scripts,
  webpack configuration, TypeScript configuration, test setup, generated
  tooling, and VS Code packaging metadata.
- Propagation decision: remove a manifest entry and its now-unneeded lockfile
  resolution together; do not rewrite callers or configuration merely to make
  a package appear unused.

### Breaking Change Analysis

- User-visible behavior: none
- API/DTO/schema compatibility: none
- VS Code/web extension compatibility: both desktop and web builds and tests
  must continue to pass
- Changed scenarios: none

### Alternative Considerations

- Remove packages based only on an automated unused-dependency report:
  rejected because configuration, CLI, loader, generator, and browser-fallback
  usage may not appear as source imports.
- Combine removals with dependency upgrades: rejected because upgrades have a
  different compatibility and review risk.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval: source or configuration rewrites,
  package upgrades, `engines.vscode` changes, pnpm override changes, or removal
  of a dependency whose role remains ambiguous.

## Compatibility

- VS Code compatibility follows the current `package.json` `engines.vscode`.
- Web extension compatibility: preserve browser fallbacks, bundling, and web
  test behavior.
- Desktop extension compatibility: preserve extension bundling, packaging,
  generation, and desktop test behavior.
- Model, Serena, or agent choice does not change this dependency boundary or
  the SDD approval gate.

## Acceptance Criteria

- Every proposed removal has evidence covering source, configuration, scripts,
  tooling, packaging, and desktop/web entry points as applicable.
- Only confirmed-unused direct dependencies are removed.
- `package.json` and `pnpm-lock.yaml` remain consistent under pinned pnpm.
- Quality checks, desktop tests, web tests, and production builds pass.
- No runtime code, tests, generated artifacts, or configuration are changed
  unless a separately approved scope requires it.

## Non-Goals

- Upgrading or replacing dependencies
- Removing or changing `pnpm.overrides` solely because a transitive package
  appears unused by repository source
- Refactoring source code or configuration to eliminate an otherwise used
  package
- Bundle-size optimization or architecture restructuring
- Changing product behavior, commands, DTOs, telemetry, or VS Code support

## Open Questions

- Which direct dependency entries are confirmed unused after the complete
  impact investigation?
