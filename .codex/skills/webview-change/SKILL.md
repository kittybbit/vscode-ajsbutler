> **Coordination Note**: See `AGENTS.md` § "AI Agent Routing Guide" for multi-agent task assignment.
> This skill is one part of a coordinated system that also includes Copilot CLI automation.
>
# webview-change

## Purpose

Change webview/UI code without polluting domain/application layers.

## Checklist

- consume DTOs/view models, not parser internals
- keep UI-library-specific types in presentation
- confirm desktop and browser assumptions
- avoid mixing CSV/parse/business logic into component code
