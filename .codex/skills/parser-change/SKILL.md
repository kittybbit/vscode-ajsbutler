> **Coordination Note**: See `AGENTS.md` § "AI Agent Routing Guide" for multi-agent task assignment.
> This skill is one part of a coordinated system that also includes Copilot CLI automation.

# parser-change

## Purpose

Change parser-adjacent logic safely.

## Checklist

- identify grammar-generated boundaries
- avoid leaking parser internals into UI
- update golden tests
- verify normalization behavior
- document malformed-input behavior
