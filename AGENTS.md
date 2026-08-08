# AGENTS.md

## Project Overview

This repository is a Visual Studio Code extension for viewing and analyzing
JP1/AJS3 definition files. It supports desktop and web extension execution.

Primary goals:

1. Keep VS Code compatibility stable.
2. Modernize dependencies without breaking extension behavior.
3. Use Specification-Driven Development (SDD) for non-trivial work.
4. Maintain the verified Domain-Driven Design and Clean Architecture
   boundaries.
5. Preserve parser, list view, flow view, CSV export, unit definition,
   diagnostics, hover, navigation, WebAPI import, semantic diff/report, and
   telemetry behavior.

## Product Constraints

- Minimum VS Code compatibility is defined by `package.json`.
- Do not casually raise the minimum VS Code version or use unavailable APIs.
- Do not break web extension support.
- Do not import Node built-ins from production source; use injected
  capabilities or browser-safe adapters.

## Architecture Rules

Follow these dependency rules strictly:

- `domain` must not import outer layers, `vscode`, or UI frameworks.
- `application` must not import `infrastructure`, `presentation`, or
  `bootstrap`.
- `presentation` must not import `domain`, `infrastructure`, or `bootstrap`.
- `infrastructure` must not import `presentation` or `bootstrap`.
- Concrete infrastructure dependencies may be referenced only by
  `infrastructure` and `bootstrap`.
- Generated parser code and ANTLR may be consumed only under
  `src/infrastructure/parser`; `AjsRawUnit` remains inside parser
  infrastructure.
- Retired unit-wrapper dependencies under `src/domain/models/units` must not
  be reintroduced.
- `vscode` imports are limited to `src/extension.ts`, `bootstrap`,
  `infrastructure`, and `presentation/vscode`.
- UI-framework imports are limited to `presentation/webview`.
- UI components consume DTOs/view models, not parser internals.
- Production source must not import Node built-ins.
- The telemetry SDK remains in its infrastructure adapter.
- Application factory functions may be invoked only by application or
  bootstrap.
- Infrastructure implementations may be constructed only by infrastructure or
  bootstrap.

See `docs/specs/architecture.md` for durable boundary definitions. The
architecture dependency test enforces the complete catalog with zero
exceptions.

Production source structure:

- `src/domain`
- `src/application`
- `src/infrastructure`
- `src/presentation`
- `src/bootstrap`
- `src/resource`

## Refactoring Policy

1. Preserve behavior first.
2. Add or update tests before large structural changes.
3. Prefer vertical slices around one behavior or boundary.
4. Extract one use case at a time.
5. Keep pull requests small and reviewable.

## SDD Workflow

SDD is the only standard process for non-trivial changes. Use
`docs/specs/README.md` as the Single Source of Truth for trivial-change
criteria, document roles, approval, validation, and Feature Exit policy.

Follow this lifecycle:

1. Route trivial changes using the criteria in `docs/specs/README.md`.
2. Start non-trivial feature intake with `feature-author` and
   `$sdd-create-feature`.
3. Create or revise the full slice plan with `plan-author` and
   `$sdd-plan-task` in Planning or Replanning Mode.
4. Review the plan with the read-only `plan-reviewer` and
   `$sdd-review-plan`; Findings go to `plan-reviser`.
5. Obtain clear Human Approval for the reviewed plan and approved slice scope.
6. Commit the approved plan or replan package with `approval-committer` and
   `$sdd-commit-gate` before implementation starts.
7. Implement one approved slice with `implementer` and
   `$sdd-implement-task`.
8. Review the completed slice with the read-only
   `implementation-reviewer` and `$sdd-review-implementation`; Findings go
   back to `implementer`.
9. Obtain explicit Completion Approval and commit the exact completed slice
   with `approval-committer` before starting another slice.
10. Run Feature Exit with `feature-closer` and `$sdd-feature-exit` only after
    every slice is complete and committed, then obtain explicit closure
    approval.
11. Commit the approved Feature Exit propagation and selected feature-folder
    removal with `approval-committer` before closing the feature.
12. Replan when a new slice, scope, design decision, wider impact, or approval
    boundary is discovered.

Before editing runtime code, tests, generated artifacts, or configuration, the
selected feature must have an approved implementation slice recorded in
`TASKS.md`. If scope or design changes, stop and use Replanning Mode.

## Coding and Testing Rules

- Use TypeScript with explicit exported API types.
- Prefer pure functions in domain/application layers.
- Keep functions small and names aligned with JP1/AJS concepts.
- Do not mix UI formatting with parsing/domain logic.
- Run the most relevant checks from `docs/specs/README.md` `Risk-Based
Validation And Review` before finishing.
- When touching parser, list, flow, CSV, or adapter boundaries, add or update
  the relevant tests.
- Production readiness covers failure modes, diagnostics/fallback behavior,
  JP1/AJS compatibility, large/malformed input, desktop/web behavior,
  README/user-doc impact, and CHANGELOG need.

## Durable Documentation Gate

Before updating a long-lived document, verify the content is reusable beyond
one feature, describes durable behavior/specification/design/repository policy,
helps future work, is not duplicated, and is not temporary investigation,
implementation history, review commentary, or a resolved issue.

## VS Code and Web Extension Policy

- Treat `engines.vscode` as a compatibility contract.
- Keep shared code free of Node built-ins and filesystem/process assumptions.
- Verify desktop and web behavior whenever shared contracts, bootstrap, or
  extension entry points change.

## Telemetry Policy

Telemetry remains minimal and privacy-conscious. Do not add file content, file
paths, or personal identifiers. Report only application-catalog events through
`TelemetryPort`; do not expose raw event-name or property-map reporting.

## Output Expectations for Agents

When finishing a task, report:

1. what changed
2. tests/checks run
3. compatibility risks
4. follow-up tasks

## CLI Command Policy

Use `rtk` by default for inspection, search, git/GitHub operations, package
scripts, tests, builds, type checks, and browser tooling. Use a native command
only when `rtk` has no suitable proxy, exact raw output is required, or the
command is interactive.

## Branch Naming

- Use a dedicated branch for each feature.
- Reserve `docs/...` for docs-only changes. The Verify docs-only allowlist is
  `docs/**`, `README.md`, `.codex/**/*.md`, and `.github/**/*.md`.
- If a `docs/...` branch needs a file outside that set, rename it or start a
  non-doc branch before continuing.

## Forbidden Changes

Do not:

- silently raise `engines.vscode`
- mix parser internals directly into UI components
- add direct `vscode` imports into domain
- add an architecture-rule exception or allowlist entry
- rewrite large areas without a migration plan
- remove existing user-visible behavior unless explicitly requested
- skip tests for non-trivial architectural changes

## AI Agent Routing Guide

`AGENTS.md` owns repository routing. Role authority and handoffs live in the
Codex role definitions; reusable procedures live in `.agents/skills`; the
Codex skill directory contains invocation adapters only.

### Agent Entrypoints

- Copilot CLI: `.github/copilot-instructions.md`
- Codex custom-agent definitions: `.codex/agents/*.toml`
- Canonical Codex skills: `.agents/skills/*/SKILL.md`
- Canonical shared procedures: `.agents/skills/*/SKILL.md`
- Approval-gated commit role: `.codex/agents/approval-committer.toml`
- Approval-gated commit procedure: `.agents/skills/sdd-commit-gate/SKILL.md`
- SDD policy/document SSOT: `docs/specs/README.md`

### Deterministic SDD Routing

1. **Trivial change**: use the trivial-change criteria in
   `docs/specs/README.md`; no feature lifecycle is required when the criteria
   permit skipping SDD.
2. **Feature intake**: use `feature-author` with
   `.agents/skills/sdd-create-feature/SKILL.md` and `$sdd-create-feature`.
   Handoff: `plan-author`. Stop for ambiguous purpose, feature kind, overlap,
   or compatibility evidence.
3. **Planning**: use `plan-author` with
   `.agents/skills/sdd-plan-task/SKILL.md` and `$sdd-plan-task` in Planning
   Mode. Handoff: `plan-reviewer`. Stop for missing impact or design evidence.
4. **Plan review**: use read-only `plan-reviewer` with
   `.agents/skills/sdd-review-plan/SKILL.md` and `$sdd-review-plan`.
   `Ready` goes to Human Approval; `Findings` go to `plan-reviser`.
   After explicit Human Approval, hand off to `approval-committer` for the
   plan/replan commit before implementation.
5. **Plan revision**: use `plan-reviser` with the same planning procedure in
   Replanning Mode. Handoff: `plan-reviewer`. Stop when Findings are absent or
   a new scope/design/approval decision is required.
6. **Approved implementation**: use `implementer` with
   `.agents/skills/sdd-implement-task/SKILL.md` and `$sdd-implement-task` for
   exactly one approved slice. Handoff: `implementation-reviewer`. Stop when
   approval, dependencies, or scope is unclear.
7. **Implementation review**: use read-only `implementation-reviewer` with
   `.agents/skills/sdd-review-implementation/SKILL.md` and
   `$sdd-review-implementation`. `Ready` goes to the completion gate;
   `Findings` go back to `implementer`. After explicit Completion Approval,
   hand off to `approval-committer` for the exact slice commit.
8. **Feature Exit**: after all slices are complete, use `feature-closer` with
   `.agents/skills/sdd-feature-exit/SKILL.md` and `$sdd-feature-exit`.
   `Close` goes to explicit human closure approval, then
   `approval-committer` for the approved closure commit; a new design/scope
   issue goes to planning.
9. **Release**: use `$release-extension` only for extension release work. It
   uses `.agents/skills/release-extension/SKILL.md`, remains outside the SDD
   lifecycle roles, and does not participate in SDD lifecycle handoffs.

Role files are the authority for each role's fixed model/effort, allowed input,
forbidden actions, output contract, and stop conditions. Do not duplicate those
contracts in this routing guide.

### General Task Routing Matrix

<!-- markdownlint-disable MD013 MD060 -->

| Category         | Task                                                           | Primary | Fallback | Notes                                                             |
| ---------------- | -------------------------------------------------------------- | ------- | -------- | ----------------------------------------------------------------- |
| **SDD Workflow** | Feature intake, planning, review, implementation, Feature Exit | Codex   | CLI      | Follow the deterministic SDD routing above and shared procedures. |
| **Analysis**     | Repository analysis                                            | Codex   | CLI      | Workspace awareness preferred; CLI for complex search.            |
| **Architecture** | Validate clean architecture                                    | Codex   | CLI      | Interactive guidance preferred; CLI for systematic checks.        |
| **VS Code**      | Safe extension API changes                                     | Codex   | CLI      | Preserve declared engine compatibility.                           |
| **Webview**      | React/webview changes                                          | Codex   | CLI      | Verify desktop and web behavior.                                  |
| **Automation**   | CI/CD or batch operations                                      | CLI     | Codex    | Shell and git coordination preferred.                             |
| **Complex Ops**  | Multi-slice refactor                                           | CLI     | Codex    | Use only after SDD scope and handoffs are clear.                  |

<!-- markdownlint-enable MD013 MD060 -->

Switch to the fallback only for token/session loss, scope expansion, or a
capability the primary lacks. Both agents still follow this file and the SDD
SSOT.

### Coordination Sources

- `AGENTS.md`: repository architecture rules and routing
- `docs/specs/`: SDD policy, feature artifacts, and durable specifications
- `.codex/agents/`: Codex role contracts
- `.agents/skills/`: canonical reusable procedures
- `.agents/skills/`: canonical Codex skills
- `.agent.md` and `.github/copilot-instructions.md`: lightweight entry-point
  adapters, not policy SSOT

Keep assumptions and design decisions in the responsible SDD artifact. Do not
duplicate SDD policy in agent-specific adapters.

## Repository-Specific Guidance

Current important concerns:

- Keep the zero-exception architecture rule catalog synchronized with durable
  policy whenever an approved architecture decision changes a boundary.
- Keep read-only WebAPI import in beta until its owning feature records real
  JP1/AJS3 environment evidence and enough user feedback.
- Preserve normalized domain, application DTO, plain transport, and explicit
  composition boundaries when adding behavior.
- Keep diagnostics, hover, commands, panels, and rendering concerns in
  presentation adapters.
- Validate desktop and web behavior whenever shared contracts, bootstrap, or
  extension entry points change.
