# AGENTS.md

## Project Overview

This repository is a Visual Studio Code extension for viewing and analyzing JP1/AJS3 definition files.
It supports both desktop extension execution and web extension execution.

Primary goals of this repository:

1. Keep VS Code compatibility stable.
2. Modernize dependencies without breaking extension behavior.
3. Use Specification-Driven Development (SDD) as the standard development
   process for non-trivial work.
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

SDD is the only standard process for non-trivial changes. Do not use an
alternate implementation flow when SDD applies.

Follow this lifecycle:

1. Start feature intake with `sdd-create-feature`.
2. Create or revise the feature implementation-slice plan with
   `sdd-plan-task`.
3. Review the plan with `sdd-review-plan`.
4. Obtain clear Human Approval for the reviewed plan and approved slice scope.
5. Implement only approved slices with `sdd-implement-task`.
6. Replan with `sdd-plan-task` only when scope, design decisions, impact, or
   approval boundaries change.
7. Close the feature only through Feature Exit Mode after the Feature
   Definition of Done passes.

Before editing runtime code, tests, generated artifacts, or configuration,
the active feature must have an approved implementation slice recorded in
`TASKS.md`. If the requested change is ambiguous, document assumptions in the
right SDD artifact and stop for clarification or approval instead of making
hidden assumptions.

Document roles are defined only in `docs/specs/README.md`. Use that file as
the Single Source of Truth for SDD artifact responsibilities, including
`SPECS.md`, `TASKS.md`, `TRACEABILITY.md`, `docs/specs/plans.md`, and
`docs/specs/roadmap.md`.

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
- Prefer readability and maintainability over brevity, DRY-only extraction, or
  generic abstraction.
- Do not mix UI formatting logic with parsing/domain logic.
- Avoid large files when extracting new use cases or adapters is practical.
- Keep naming aligned with JP1/AJS business concepts.
- Keep implementation diffs limited to the approved slice scope.
- Do not plan new work during implementation; return to `sdd-plan-task` when
  replanning is required.

## Testing Policy

Before finishing a task, run the most relevant checks available.

For docs-only changes, run `rtk pnpm run qlty`; add
`rtk pnpm run lint:md` when markdown structure or links need focused
validation.

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

Production readiness checks must cover failure modes, understandable
diagnostics or fallback behavior, JP1/AJS definition-file compatibility, large
or malformed input risk, desktop/web behavior, README or user-doc impact, and
CHANGELOG update need when user-visible behavior, compatibility, or workflow
changes.

## Durable Documentation Gate

Before updating long-lived docs such as use cases, README, AGENTS,
`plans.md`, `roadmap.md`, or design/development guides, verify the content:

- is reusable beyond one feature
- describes durable behavior, specification, design policy, or repository
  operating policy
- helps future planning or implementation
- does not duplicate another durable document
- is not a temporary investigation result
- is not implementation history
- is not review commentary
- is not a record of a resolved issue

Update the smallest necessary durable document surface.

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

## CLI Command Policy

AI agents should run CLI commands through `rtk` by default when `rtk` provides
an appropriate proxy. Prefer `rtk` for command output that can otherwise flood
agent context, including file inspection, search, git/GitHub operations,
package scripts, tests, builds, type checks, and browser test tooling.

Examples:

- `rtk ls`
- `rtk read AGENTS.md`
- `rtk grep "pattern" src`
- `rtk git status --short --branch`
- `rtk gh pr view`
- `rtk pnpm run qlty`
- `rtk pnpm test`
- `rtk pnpm run test:web`
- `rtk pnpm run build`

Use the native command directly only when:

- `rtk` has no suitable proxy for the command
- exact, unfiltered output is required for diagnosis or user reporting
- the command is interactive or relies on shell behavior that `rtk` should not
  wrap
- an `rtk` proxy fails and the native command is needed to confirm the issue

When falling back to a native command, mention the reason in the task summary if
it affects validation or reproducibility.

## Forbidden Changes

Do not:

- silently raise `engines.vscode`
- mix parser internals directly into UI components
- add direct `vscode` imports into domain
- rewrite large areas without a migration plan
- remove existing user-visible behavior unless explicitly requested
- skip tests for non-trivial architectural changes

## AI Agent Routing Guide

This repository is designed to work seamlessly with multiple AI agents, each with distinct strengths.

### Agents

#### Copilot CLI

- **Invocation**: `copilot ...` command in terminal
- **Session Model**: Stateless, request-based
- **Strengths**:
  - Complex multi-step automation
  - Git operations and branch management
  - CI/CD setup and scripting
  - Batch operations across files
- **Capabilities**: Full bash/git/tool access through `rtk` by default,
  parallel execution
- **Configuration**: `.github/copilot-instructions.md`

#### Codex (VS Code Copilot)

- **Invocation**: Chat panel in VS Code editor
- **Session Model**: Workspace-persistent, context-aware
- **Strengths**:
  - Live coding and refactoring
  - Interactive debugging
  - Editor-integrated analysis
  - Contextual suggestions
- **Capabilities**: Workspace awareness, real-time error feedback, file-level changes
- **Configuration**: `.codex/skills/` directory with specialized skills

### Task Routing Matrix

| Category         | Task                        | Primary                                    | Fallback | Notes                                                            |
| ---------------- | --------------------------- | ------------------------------------------ | -------- | ---------------------------------------------------------------- |
| **SDD Workflow** | Create/update SDD specs     | Codex                                      | CLI      | Editor context preferred; CLI for batch doc updates              |
|                  | Implement feature from SDD  | Codex                                      | CLI      | Live coding preferred; CLI for multi-file refactor               |
|                  | Update branch docs          | Codex                                      | CLI      | Either works; Codex for interactive flow                         |
| **Analysis**     | Repository analysis         | Codex (repo-analyse skill)                 | CLI      | Workspace awareness preferred; CLI for complex grep              |
|                  | Search codebase             | CLI                                        | Codex    | Batch speed preferred; Codex for contextual search               |
| **Architecture** | Validate clean architecture | Codex (clean-architecture-refactor skill)  | CLI      | Interactive guidance preferred; CLI for systematic checks        |
|                  | Refactor parser code        | Codex (parser-change skill)                | CLI      | Test-driven feedback preferred; CLI for large restructure        |
| **VS Code**      | Safe extension API changes  | Codex (vscode-extension-safe-change skill) | CLI      | Compatibility built-in; CLI for API automation                   |
| **Webview**      | React/webview changes       | Codex (webview-change skill)               | CLI      | Component awareness preferred; CLI for multi-module edits        |
| **Automation**   | Set up CI/CD step           | CLI                                        | Codex    | Script execution required; Codex if workflow guidance needed     |
|                  | Batch file edits            | CLI                                        | Codex    | Parallel ops preferred; Codex for interactive refinement         |
|                  | Generate boilerplate        | CLI                                        | Codex    | Template expansion required; Codex for quick scaffolding         |
| **Complex Ops**  | Multi-slice refactor        | CLI                                        | Codex    | Git coordination required; Codex if per-step iteration preferred |

**Column Definitions**:

- **Primary**: Recommended agent for this task (optimal capabilities/context match)
- **Fallback**: Alternative if Primary reaches token limit, session loss, or scope expansion
- **Notes**: Why each assignment and when fallback becomes the better choice

**When to Switch to Fallback**:

- ✅ Token limit reached on Primary
- ✅ Session timeout or connection lost
- ✅ Task scope expanded significantly beyond original scope
- ✅ Need different perspective or approach
- ❌ Just personal preference (stick with Primary for consistency)

### Configuration Sources

**Source of Truth** (all agents reference, never duplicate):

- `AGENTS.md` - Architecture rules and agent routing (you are here)
- `docs/specs/` and `docs/requirements/use-cases/` - SDD workflow,
  feature artifacts, and durable behavior contracts
- `README.md` - Build/test commands and quick reference

**Agent-Specific Configuration** (agent instructions, not rules):

- `.github/copilot-instructions.md` - Copilot CLI entry point
- `.codex/skills/*/SKILL.md` - Codex specialized workflows
- `.agent.md` - VS Code Copilot extension metadata

### How Agents Find Information

1. **Copilot CLI** reads:

   - `.github/copilot-instructions.md` → points to this section
   - `AGENTS.md` (this routing guide) → determines task type
   - `docs/specs/` and `docs/requirements/use-cases/` → gets SDD context
   - `README.md` → gets build/test commands

2. **Codex** reads:
   - `.codex/skills/*/SKILL.md` → references `AGENTS.md` routing
   - `AGENTS.md` (this routing guide) → determines task type
   - `docs/specs/` and `docs/requirements/use-cases/` → gets SDD context
   - Editor context → live analysis

### Best Practices for Multi-Agent Work

1. **Use the right agent for the task** - Check the routing matrix above
2. **Keep agents coordinated** - Both reference AGENTS.md, not separate configs
3. **Document assumptions in specs** - Prefer `docs/specs/` over agent-specific notes
4. **Avoid duplicating rules** - Update AGENTS.md once, both agents follow
5. **Record manual verification** - Update feature docs when smoke testing completes

## Repository-Specific Guidance

Current important concerns in this repository:

- activation/bootstrap logic is concentrated and should gradually move toward explicit composition
- parser/application/UI boundaries should be clarified
- flow rendering should depend on graph DTOs, not UI-library-specific data too early
- CSV export should be an application use case, not a UI concern
- diagnostics, hover, and preview/commands should stay close to adapters and presentation boundaries
