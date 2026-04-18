# Copilot CLI Instructions

This file is for **Copilot CLI** (terminal agent).
For multi-agent coordination details, see `.agent.md` and `AGENTS.md`
§ "AI Agent Routing Guide".

## Overview

This repository is a Visual Studio Code extension for viewing and analyzing
JP1/AJS3 definition files.
It supports both desktop and web extension execution.

## Architecture & Principles

**Source of Truth**:
Read these in order before making changes

1. **`AGENTS.md`** - Architecture rules, agent routing, and coding policies

   - § "AI Agent Routing Guide" determines when to use Copilot CLI vs Codex
   - § "Architecture Rules" lists strict dependency rules
     (domain, application, presentation, infrastructure)
   - § "SDD Workflow" outlines the specification-driven process

2. **`docs/specs/`** - Specification-driven development documentation

   - `plans.md` - Branch status and priorities
   - `features/*/SPECS.md` - Feature requirements
   - `features/*/PLANS.md` - Implementation design
   - `features/*/TASKS.md` - Execution checklist

3. **`README.md`** - Build/test commands and quick reference

## When to Use Copilot CLI

Check the routing matrix in `AGENTS.md` § "AI Agent Routing Guide":

✅ **Good for Copilot CLI**:

- Complex automation across multiple files
- Git operations (branches, commits, workflows)
- CI/CD setup and shell scripting
- Batch operations and file generation
- Multi-step refactoring with git coordination

❌ **Prefer Codex for**:

- Live coding and interactive editing
- SDD workflow (creating/updating specs)
- Refactoring with real-time error feedback
- Parser or webview changes (use specialized skills)

## Build and Test Commands

```bash
pnpm run qlty      # Lint and quality checks
pnpm test          # Desktop extension tests
pnpm run test:web  # Web extension tests
pnpm run build     # Production build
```

**Full validation sequence** (use before pushing):

```bash
pnpm run qlty && pnpm test && pnpm run test:web && pnpm run build
```

## Testing Policy

When touching parser, list view, flow view, CSV export, diagnostics, hover,
or adapter boundaries:

- Add or update unit/integration tests
- Run `pnpm run qlty && pnpm test && pnpm run test:web`
- For docs-only changes, `pnpm run lint:md` is sufficient

## Key Constraints

- **Do not raise** `engines.vscode` without explicit approval
- **Keep desktop and web extension** behavior intact
- **Avoid direct** `vscode` imports in domain layer
- **Separate concerns**: domain → application → presentation/infrastructure
- **Preserve parser internals** from direct UI component access

## Example Tasks

### Automation

- "Set up a pre-commit hook for linting"
- "Generate boilerplate for a new use case"
- "Batch-rename files across multiple modules"

### Git Operations

- "Create a branch with feature scaffolding"
- "Automate the cherry-pick of fixes across branches"
- "Set up CI/CD for a new workflow"

### Complex Changes

- "Refactor parser module while preserving behavior"
- "Extract a new use case with tests"
- "Migrate to a new UI library step by step"

## Multi-Agent Coordination

Both Copilot CLI and Codex share a routing guide:

| Agent                      | Best For                               |
| -------------------------- | -------------------------------------- |
| **Codex** (VS Code chat)   | Live coding, refactoring, SDD workflow |
| **Copilot CLI** (terminal) | Automation, git operations, batch work |

**Single source of truth**: `AGENTS.md` § "AI Agent Routing Guide"

If you're uncertain whether CLI or Codex should handle a task, check that
routing matrix first.

## Next Steps

- For complex changes, follow the SDD workflow in `AGENTS.md` § "SDD Workflow"
- Refer to `docs/specs/features/` for use-case examples
- Keep assumptions and design decisions documented in feature `PLANS.md`
- Run full validation (`pnpm run qlty && pnpm test && pnpm run test:web && pnpm run build`) before pushing

---

This file is a living document. Update it when agent coordination patterns change.
