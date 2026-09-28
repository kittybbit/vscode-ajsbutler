# Copilot CLI Instructions

This is the Copilot CLI entry-point adapter. Repository rules and routing are
owned by [AGENTS.md](../AGENTS.md); SDD gates, approvals, validation, and
document roles are owned by [the SDD policy](../docs/specs/README.md).

## Routing

Use Copilot CLI for automation, Git operations, CI/CD, and batch work. Use
Codex for interactive editing, SDD lifecycle work, and parser or webview
changes. Follow the routing owner when scope or capabilities change.

Main handles discussion, investigation, and informal analysis directly. Formal
SDD operations must pass through Main to the designated role; Copilot CLI must
not impersonate a role or execute its lifecycle procedure. A child returns to
Main and does not start another role.

## Repository Context

- Product: a VS Code extension for viewing and analyzing JP1/AJS3 definition
  files on desktop and web.
- Architecture and compatibility: follow the constraints and boundaries in
  `AGENTS.md` and `docs/specs/architecture.md`.
- Feature artifacts: the selected feature's `SPECS.md` records requirements
  and boundaries, `TASKS.md` owns its current plan and state, and
  `TRACEABILITY.md` maps requirements to slices and validation when required.
- Durable behavior: use cases live in `docs/requirements/use-cases/`.

## Commands And Validation

Run repository commands through `rtk` when available. Choose tests and other
checks by changed surface using the SDD validation policy; docs-only validation
includes the disposable-snapshot qlty procedure. Relevant package scripts
include `build`, `test`, `test:web`, `lint:md`, and `qlty`.
