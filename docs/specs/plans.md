# PLANS.md

## Purpose

This is the branch-level SDD work plan. It records the feature folders active
on this branch and branch-wide decisions that apply across those features.
Feature-local slice tasks live in `docs/specs/features/<feature>/TASKS.md`;
repository-level behavior contracts live under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- JP1/AJS3 version 13 is the current normative target for new parameter and
  command semantics.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded.
- Qlty findings remain candidate signals for future behavior-preserving
  refactors, but completed qlty-driven cleanup no longer has an active feature
  folder. A new feature should be opened only when a finding maps to a
  meaningful responsibility or boundary concern.
- Feature `SPECS.md` files carry feature requirements. Feature `TASKS.md`
  files carry only current task state and the minimum record needed to decide
  whether behavior must be reflected back into use cases.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked when a real JP1/AJS3 WebAPI environment or evidence becomes
   available.
2. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Active Feature Specs

- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/extract-parser-adapter-boundary/`:
  approved roadmap documentation awaiting task planning and implementation
  approval for the application parser port and infrastructure ANTLR adapter
  boundary.
- `docs/specs/features/establish-extension-composition-root/`:
  roadmap feature awaiting planning after parser-boundary extraction.
- `docs/specs/features/normalize-semantic-diagnostics-input/`:
  roadmap feature awaiting planning for normalized diagnostic inputs.
- `docs/specs/features/classify-vscode-adapter-layout/`:
  roadmap feature awaiting composition-root completion and relocation planning.
- `docs/specs/features/relocate-react-webview-presentation/`:
  roadmap feature awaiting VS Code adapter layout classification.

Completed feature-local folders should be removed after their durable behavior
contracts, active decisions, and unresolved risks have been moved to the
appropriate use cases, roadmap, or planning index.

## Branch Validation

- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  markdown structure or links need focused validation
- code changes: follow `docs/specs/README.md`
