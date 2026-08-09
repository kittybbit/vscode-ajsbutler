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
2. Delegate non-trivial feature intake to `feature-author`.
3. Delegate Planning or Replanning to `plan-author` or `plan-reviser`.
4. Delegate plan review to the read-only `plan-reviewer`; Findings are routed
   back through Main to `plan-reviser`.
5. Obtain clear Human Approval for the reviewed plan and approved slice scope.
6. Delegate the approved plan or replan commit to `approval-committer` before
   implementation starts.
7. Delegate exactly one approved slice to `implementer`.
8. Delegate completed-slice review to the read-only
   `implementation-reviewer`; Findings are routed back through Main to
   `implementer`.
9. Obtain explicit Completion Approval and commit the exact completed slice
   through `approval-committer` before starting another slice.
10. Delegate Feature Exit to `feature-closer` only after every slice is
    complete and committed, then obtain explicit closure approval.
11. Delegate the approved Feature Exit propagation and selected
    feature-folder removal to `approval-committer` before closing the feature.
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

### Main-Agent Orchestration Boundary

The main Codex agent is the default chat entrypoint and repository
orchestrator. Main may directly handle ad-hoc discussion, exploration,
read-only investigation, architectural discussion, design comparison,
analysis, explanation, troubleshooting, scope clarification, brainstorming,
informal feedback, summarization, instruction or prompt preparation, and
routing classification. Discussion of an SDD topic alone does not activate a
lifecycle role. Trivial changes may also remain with Main when the SDD policy
permits them.

Formal, role-owned SDD execution is activated by operation intent, not by the
topic. Main MUST delegate formal lifecycle execution to the designated custom
subagent. Main MUST NOT execute the lifecycle skill directly, impersonate,
assume, or internally perform the designated role, or edit the role-owned
artifact in place of that role. Main MAY inspect enough repository state to
classify the request, summarize delegated results, request Human Approval, and
route Findings, approval results, completion results, or closure results. Main
MUST wait for the delegated result before routing the next formal stage. Every
formal handoff is
`Main -> Child -> Main`; the child returns its result, evidence, and a
recommended route, and Main decides whether and when to delegate the next
operation.

Skills are execution procedures used by delegated roles. They are not direct
lifecycle entrypoints for Main.

### Main-Agent Direct Work

Main MAY directly perform repository exploration, read-only investigation,
architecture or design discussion, explanation, troubleshooting analysis,
task classification, scope clarification, summarization, brainstorming,
informal review or feedback, preparation of instructions or migration guidance,
and investigation needed only to choose the next lifecycle role. These
activities do not activate a role merely because their subject is a feature,
plan, implementation, or Feature Exit. Main MUST delegate when the requested
action executes a formal role-owned lifecycle operation or crosses an
approval-gated role boundary.

### Discussion vs Lifecycle Execution

Discussion, analysis, investigation, explanation, brainstorming, and informal
feedback about an SDD stage do not by themselves activate that role. Delegate
only when the user requests execution of the role-owned lifecycle operation or
when continuing an active formal workflow requires that operation.

Routing precedence is: safety and approval gates, role ownership, and active
formal-work constraints take priority over an explicit routing preference. A
user may name a role when the requested operation is formal and the request is
safe; Main-specified investigation remains direct unless it continues an
active formal operation. Release work remains outside the SDD lifecycle and
uses its dedicated release procedure because no release lifecycle role exists.

### Agent Entrypoints

- Copilot CLI: `.github/copilot-instructions.md`
- Codex custom-agent definitions: `.codex/agents/*.toml`
- Role-owned reusable procedures: `.agents/skills/*/SKILL.md`
- Skill invocation adapters: `.agents/skills/*/agents/openai.yaml`
- SDD policy/document SSOT: `docs/specs/README.md`

The role catalog is seven SDD lifecycle roles—`feature-author`, `plan-author`,
`plan-reviewer`, `plan-reviser`, `implementer`,
`implementation-reviewer`, and `feature-closer`—plus the
`approval-committer` gate role. Release is outside this catalog.

### Deterministic SDD Routing

Formal routing is deterministic. Main activates the operation, delegates one
role-owned operation, records or integrates the returned evidence, and stops
or makes the next delegation only after the stated gate is satisfied.

1. **Feature intake**
   - Activation: A concrete non-trivial feature requires SDD artifacts.
   - Delegate: `feature-author`.
   - Main responsibility: Confirm purpose, selection, and intake boundary.
   - Result and return: Valid feature artifacts and traceability
     recommendation return to Main.
   - Stop: Ambiguous purpose, feature kind, overlap, or compatibility evidence.
2. **Planning**
   - Activation: The selected feature needs a complete slice plan.
   - Delegate: `plan-author`.
   - Main responsibility: Confirm feature selection and planning scope.
   - Result and return: Complete plan and validation evidence return to Main.
   - Stop: Missing impact, design evidence, or independently untestable slice.
3. **Plan review**
   - Activation: A complete plan is ready for independent review.
   - Delegate: `plan-reviewer`.
   - Main responsibility: Preserve the read-only review and approval boundary.
   - Result and return: `Ready` or Findings return to Main; Main routes
     Findings to `plan-reviser`.
   - Stop: Ambiguous selection/base or insufficient risk evidence.
4. **Plan revision**
   - Activation: Findings or a replan trigger blocks continuation.
   - Delegate: `plan-reviser`.
   - Main responsibility: Keep the change within the approved feature purpose.
   - Result and return: Revised plan and re-review recommendation return to
     Main.
   - Stop: New design, scope, dependency, or approval decision.
5. **Approved plan commit**
   - Activation: Plan-reviewer `Ready` plus Human Approval.
   - Delegate: `approval-committer`.
   - Main responsibility: Verify the exact gate and approved paths.
   - Result and return: One focused plan/replan commit result returns to Main.
   - Stop: Missing approval, verdict, exact scope, or clean boundary.
6. **Implementation**
   - Activation: One approved slice is committed and ready.
   - Delegate: `implementer`.
   - Main responsibility: Provide approved context and preserve scope.
   - Result and return: Completed slice, diff, and evidence return to Main.
   - Stop: Missing approval/dependency or required out-of-scope change.
7. **Implementation review**
   - Activation: One approved slice has a final diff and evidence.
   - Delegate: `implementation-reviewer`.
   - Main responsibility: Preserve independent read-only review.
   - Result and return: `Ready` or Findings return to Main; Main routes
     Findings to `implementer`.
   - Stop: Ambiguous scope/base or incomplete evidence.
8. **Completion commit**
   - Activation: Implementation-reviewer `Ready` plus Completion Approval.
   - Delegate: `approval-committer`.
   - Main responsibility: Verify the exact completed-slice gate.
   - Result and return: One focused completion commit result returns to Main.
   - Stop: Missing approval, verdict, exact scope, or clean boundary.
9. **Feature Exit**
   - Activation: Every slice is complete and committed.
   - Delegate: `feature-closer`.
   - Main responsibility: Preserve independent exit review and closure
     boundary.
   - Result and return: `Close` or a blocker returns to Main.
   - Stop: Incomplete slice, missing evidence, or unresolved risk.
10. **Closure commit**
    - Activation: Feature-closer `Close` plus Closure Approval.
    - Delegate: `approval-committer`.
    - Main responsibility: Verify approved propagation and folder-removal
      scope.
    - Result and return: One focused closure commit result returns to Main.
    - Stop: Missing approval, verdict, exact scope, or clean boundary.

Release remains an explicit non-SDD exception: use `$release-extension` and its
canonical release procedure only for extension release work; it does not
participate in SDD lifecycle routing.

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
- `.agents/skills/*/SKILL.md`: role-owned reusable procedures
- `.agents/skills/*/agents/openai.yaml`: skill invocation adapters
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
