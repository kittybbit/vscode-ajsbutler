# AGENTS.md

## Project Overview

This repository is a Visual Studio Code extension for viewing and analyzing JP1/AJS3 definition files.
It supports both desktop extension execution and web extension execution.

Primary goals of this repository:

1. Keep VS Code compatibility stable.
2. Modernize dependencies without breaking extension behavior.
3. Incrementally migrate to Specification-Driven Development (SDD).
4. Refactor toward Domain-Driven Design (DDD) and Clean Architecture.
5. Preserve behavior for parser, list view, flow view, CSV export, diagnostics, hover, and telemetry.

## Product Constraints

- Minimum supported VS Code compatibility is defined by `package.json` engines.vscode.
- Do not casually raise the minimum VS Code version.
- Do not introduce APIs that are unavailable in the declared minimum VS Code version.
- Do not break web extension support.
- Do not introduce Node-only behavior into paths shared with the web extension unless guarded and tested.

## Architecture Rules

Follow these dependency rules strictly:

- `domain` must not import `vscode`.
- `domain` must not depend on React, MUI, XyFlow, or webview code.
- `application` may depend on `domain`.
- `presentation` may depend on `application`.
- `infrastructure` may depend on `application` and `domain`.
- `presentation` must not directly parse raw AJS grammar output when an application use case exists.
- UI components must consume DTOs/view models, not parser internals.
- VS Code API usage must be isolated near extension/presentation/infrastructure boundaries.
- Telemetry must be wrapped behind an interface where practical.

Preferred target structure:

- `src/domain`
- `src/application`
- `src/infrastructure`
- `src/presentation`

## Refactoring Policy

When refactoring:

1. Preserve behavior first.
2. Add or update tests before large structural changes.
3. Prefer vertical slices over broad rewrites.
4. Extract one use case at a time.
5. Keep pull requests small and reviewable.

Good first slices:

- Build unit list
- Filter/search unit list
- Export CSV
- Build flow graph DTO
- Show unit definition

## SDD Workflow

For non-trivial changes, follow this order:

1. Read relevant docs in `docs/specs/`.
2. Update or create the relevant use-case spec.
3. Write or update a short implementation plan in `PLANS.md`.
4. Confirm acceptance criteria.
5. Implement.
6. Run quality checks.
7. Summarize impact and remaining risks.

If the requested change is ambiguous, prefer documenting assumptions explicitly in `PLANS.md` instead of making hidden assumptions.

## Branch Naming

- Use a dedicated git branch for each slice.
- Reserve `docs/...` branch names for docs-only changes.
- Treat "docs-only" the same way as the `Verify` workflow:
  only `docs/**`, `README.md`, `.codex/**/*.md`, and `.github/**/*.md` may
  change.
- If a branch named `docs/...` needs any non-doc change, rename it or start a
  non-doc branch before continuing so verification expectations stay honest.

## Coding Rules

- Use TypeScript.
- Favor explicit types on exported APIs.
- Avoid unnecessary framework coupling.
- Prefer pure functions in domain/application layers.
- Keep functions small.
- Do not mix UI formatting logic with parsing/domain logic.
- Avoid large files when extracting new use cases or adapters is practical.
- Keep naming aligned with JP1/AJS business concepts.

## Testing Policy

Before finishing a task, run the most relevant checks available.

For docs-only changes, markdown lint is sufficient.

Minimum expectation for meaningful code changes:

- build succeeds
- lint/quality checks pass
- relevant unit/integration tests pass

When touching parser, list, flow, CSV, or adapter boundaries, add/update tests.

Recommended test layers:

- parser golden tests
- application use case tests
- DTO/view model mapping tests
- VS Code integration tests for desktop
- web extension smoke tests

## VS Code Compatibility Policy

- Treat `engines.vscode` as a compatibility contract.
- If code requires a newer VS Code API, document it explicitly.
- Any proposal to raise the minimum supported VS Code version must:
  - explain why
  - list affected APIs
  - update docs
  - include a dedicated compatibility note

## Web Extension Policy

This repository has a browser entry point.
When changing shared code:

- verify it does not depend on Node-only modules unless bundled safely
- verify browser build assumptions
- avoid filesystem/process assumptions in shared layers

## Dependency Update Policy

When modernizing packages:

- prefer grouped updates by risk category
- separate build-tool updates from runtime/UI updates
- document breaking changes from major upgrades
- do not combine dependency modernization and architectural refactor in one large PR

Suggested order:

1. tooling/lint/test
2. build pipeline
3. typings
4. runtime libraries
5. UI libraries

## Telemetry Policy

Telemetry must remain minimal and privacy-conscious.
Do not add telemetry containing file content, file paths, or personal identifiers.

## Output Expectations for Agents

When finishing a task, provide:

1. what changed
2. what tests/checks were run
3. compatibility risks
4. follow-up tasks if any

## Forbidden Changes

Do not:

- silently raise `engines.vscode`
- mix parser internals directly into UI components
- add direct `vscode` imports into domain
- rewrite large areas without a migration plan
- remove existing user-visible behavior unless explicitly requested
- skip tests for non-trivial architectural changes

## Repository-Specific Guidance

Current important concerns in this repository:

- activation/bootstrap logic is concentrated and should gradually move toward explicit composition
- parser/application/UI boundaries should be clarified
- flow rendering should depend on graph DTOs, not UI-library-specific data too early
- CSV export should be an application use case, not a UI concern
- diagnostics, hover, and preview/commands should stay close to adapters and presentation boundaries
