> **Coordination Note**: See `AGENTS.md` § "AI Agent Routing Guide" for multi-agent task assignment.
> This skill is one part of a coordinated system that also includes Copilot CLI automation.

# vscode-extension-safe-change

## Purpose

Make safe changes in a VS Code extension that supports both desktop and web.

## Checklist

- confirm whether change touches desktop, web, or both
- confirm whether `vscode` API is used directly
- confirm whether browser build may break
- avoid minimum-version drift
- list runtime assumptions explicitly

## Required output

- changed layers
- compatibility note
- desktop/web risk note
