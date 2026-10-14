# Copilot CLI Instructions

This adapter supplies the CLI entry point. Repository constraints and routing
are owned by [AGENTS.md](../AGENTS.md); lifecycle, approval and document roles
by [SDD policy](../docs/specs/README.md); role-specific authority and results by
`.codex/agents/*.toml`.

CLI work has the scope and authority assigned by Main, not authority to
impersonate another role. Validation coverage is owned by
[validation policy](../docs/specs/validation.md#validation-by-changed-surface),
and reusable results by [evidence policy](../docs/specs/evidence.md).
