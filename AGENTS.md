# AGENTS.md

## Project

This VS Code extension views and analyzes JP1/AJS3 definition files on desktop
and web. Preserve parser, list, flow, CSV export, unit definition, diagnostics,
hover, navigation, WebAPI import, semantic diff/report, and telemetry behavior.
Modernize dependencies without changing that behavior.

## Compatibility And Architecture

- `package.json` `engines.vscode` is the minimum supported version; do not
  raise it casually or use unavailable APIs.
- Shared production code must support desktop and web and must not import Node
  built-ins. Use injected capabilities or browser-safe adapters.
- Domain imports no outer layer, VS Code, or UI framework. Application imports
  no infrastructure, presentation, or bootstrap. Presentation imports no
  domain, infrastructure, or bootstrap. Infrastructure imports no
  presentation or bootstrap. Concrete infrastructure dependencies are used
  only in infrastructure or bootstrap.
- Generated parser code and ANTLR are consumed only under
  `src/infrastructure/parser`; `AjsRawUnit` stays there. Do not restore retired
  wrappers under `src/domain/models/units`.
- VS Code imports are limited to `src/extension.ts`, bootstrap, infrastructure,
  and `presentation/vscode`. UI frameworks are limited to
  `presentation/webview`; components use DTOs and view models, not parser data.
- The telemetry SDK stays in its infrastructure adapter. Application
  factories are invoked only by application or bootstrap; infrastructure
  implementations are constructed only by infrastructure or bootstrap.
- The architecture dependency test enforces its full import, construction,
  parser, telemetry, and layer catalog with zero exceptions. See
  [architecture](docs/specs/architecture.md) for durable ownership and
  dependency rules.

Production source lives under `src/domain`, `src/application`,
`src/infrastructure`, `src/presentation`, `src/bootstrap`, and `src/resource`.

## SDD Workflow

- Preserve behavior. Prefer small vertical slices, one use case at a time, and
  small, reviewable changes. Add or update tests before large structural work.
- SDD is the only standard for non-trivial changes. `docs/specs/README.md` owns
  trivial-change criteria, SDD gates, document roles, approval, and validation
  policy.
- Before editing runtime code, tests, generated artifacts, or configuration,
  require a Human Approved implementation slice in the selected feature's
  `TASKS.md`. Route any scope, design, impact, or approval-boundary change to
  Main for Replanning.
- Deterministic check corrections within existing approval boundaries follow
  the Correction Loop in `docs/specs/README.md`, without Replanning.
- Record `Solution Shape` at planning, implementation, and review. Its
  definition and stop conditions are in
  [architecture](docs/specs/architecture.md); the validation and evidence
  rules are in the SDD policy.
- Add or update relevant tests for non-trivial changes. Parser, list, flow,
  CSV, and adapter changes require their boundary tests. Select checks by the
  changed surface using the SDD validation policy.
- Treat `engines.vscode` as a compatibility contract. Verify desktop and web
  whenever shared contracts, bootstrap, or extension entry points change.
- Keep telemetry privacy-conscious: report only cataloged application events
  through `TelemetryPort`. Do not expose raw event-name or property-map
  reporting, or send definition content, paths, or personal identifiers.
- Before changing durable documentation, keep only reusable current behavior,
  design, or repository policy that is not duplicated; see the SDD Durable
  Documentation Gate.

## Repository Rules

- Use TypeScript and explicit exported API types. Prefer pure domain and
  application functions, small functions, and JP1/AJS-aligned names.
- Keep parsing/domain logic separate from UI formatting.
- Do not add architecture exceptions, mix parser internals into UI, import
  `vscode` from domain, rewrite large areas without a migration plan, skip
  tests for non-trivial architecture work, or remove user-visible behavior
  unless explicitly requested.
- Update `CHANGELOG.md` only under the criteria in the SDD policy.
- Use `rtk` by default for inspection, search, Git, package scripts, tests,
  builds, type checks, and browser tooling. Use native commands only when no
  suitable proxy exists, exact raw output is required, or the command is
  interactive.
- Use a dedicated feature branch. Reserve `docs/...` for docs-only changes;
  the Verify docs-only allowlist is `docs/**`, `README.md`,
  `.codex/**/*.md`, and `.github/**/*.md`. Rename or recreate a docs branch if
  its scope crosses that allowlist.
- When finishing work, report changes, checks, compatibility risks, and
  follow-up work.

## AI Agent Routing Guide

`AGENTS.md` owns repository constraints and Main routing. SDD policy and
document roles live in [`docs/specs/README.md`](docs/specs/README.md). Role
definitions in `.codex/agents/*.toml` own authority, procedure, allowed input,
forbidden actions, model/effort, output, and stop conditions. SDD lifecycle
operations use explicit role delegation; they have no discoverable Skills or
Skill invocation adapters. `.agent.md` and `.github/copilot-instructions.md`
are entry points.

Main is the default entrypoint. Discussion, investigation, analysis,
architecture/design comparison, explanation, troubleshooting, scope
clarification, brainstorming, informal feedback, summarization, instruction
preparation, and routing classification stay with Main; an SDD topic alone
does not activate a role. Trivial changes may also stay with Main when SDD
criteria permit. Main owns feature selection, coordination, approval evidence, scope/design
decisions, integration, final validation, and user communication. It may
inspect enough state to classify work, request Human Approval, and route
results. Users may name a role for a safe formal operation; safety, approval
gates, and role ownership take precedence. Main must not perform a delegated
lifecycle procedure, impersonate or internally assume a role, or edit its
role-owned artifacts. Each child returns the policy's handoff record to Main
and must not invoke or spawn the next lifecycle role. Main forwards that record
and its evidence references without recollecting unchanged facts. Main checks
the state and human gate, selects the next role, and waits for its result before
delegating again. Delegate when the user requests a formal operation or an
active workflow requires its next stage; an SDD topic alone is not a trigger.

<!-- markdownlint-disable MD013 MD060 -->

| Operation                                                        | Delegate                                                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Feature intake                                                   | `feature-author`                                                           |
| Planning or replanning                                           | `planner` in the corresponding mode                                        |
| Plan review                                                      | Read-only `plan-reviewer`; Main routes Findings to `planner`               |
| Approved plan or replan commit                                   | `approval-committer`                                                       |
| One approved implementation slice                                | `implementer`                                                              |
| Implementation review                                            | Read-only `implementation-reviewer`; Main routes Findings to `implementer` |
| Completion commit after `Ready` and explicit Completion Approval | `approval-committer`                                                       |
| Feature Exit after all slices are committed                      | `feature-closer`                                                           |
| Closure commit after `Close` and explicit Closure Approval       | `approval-committer`                                                       |

<!-- markdownlint-enable MD013 MD060 -->

`docs/specs/README.md` defines each operation's prerequisites, approval
boundary, and commit gate. Release work is outside SDD; use the
`release-extension` procedure only for extension releases.

Entrypoints:

- Copilot CLI: `.github/copilot-instructions.md`
- Codex role contracts and procedures: `.codex/agents/*.toml`
- Release procedure: `.agents/skills/release-extension/SKILL.md`
- SDD policy: `docs/specs/README.md`

<!-- markdownlint-disable MD013 MD060 -->

| Primary | Work                                                                            | Fallback                             |
| ------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| Codex   | SDD, repository analysis, architecture, VS Code, webview                        | CLI for complex or systematic search |
| CLI     | Automation, CI/CD, batch, complex operations after scope and handoffs are clear | Codex                                |

<!-- markdownlint-enable MD013 MD060 -->

Use the fallback only for token/session loss, scope expansion, or a capability
the primary lacks. All agents follow the same repository and SDD rules.

## Repository-Specific Guidance

- Keep the zero-exception architecture test catalog aligned with approved
  architecture decisions.
- Keep read-only WebAPI import in beta until its owning feature records
  real-environment evidence and enough user feedback.
