# Copilot Instructions for vscode-ajsbutler

## Overview
This repository is a Visual Studio Code extension for viewing and analyzing JP1/AJS3 definition files. It supports both desktop and web extension execution. The following instructions are designed to help AI agents work effectively within this workspace.

## Key References
- **[AGENTS.md](../AGENTS.md)**: Comprehensive guide to architecture rules, coding/testing policies, and workflows.
- **[docs/sdd](../docs/sdd)**: Specification-Driven Development (SDD) documentation, including use cases and architecture decisions.
- **[README.md](../README.md)**: Build/test commands and project overview.

## Principles
1. **Preserve Behavior**: Follow the refactoring policy in `AGENTS.md`.
2. **Link, Don’t Embed**: Reference existing documentation instead of duplicating content.
3. **Follow Architecture Rules**: Ensure changes align with the dependency rules outlined in `AGENTS.md`.
4. **Testing Policy**: Add/update tests for any changes affecting parser, list, flow, CSV, or adapter boundaries.

## Build and Test Commands
- **Build**: `npm run build`
- **Test**: `npm run test`
- **Quality Checks**: `npm run qlty`

## Common Pitfalls
- **VS Code Compatibility**: Do not raise the minimum supported version without explicit approval.
- **Web Extension Support**: Avoid Node-only behavior in shared code paths.
- **Telemetry**: Ensure privacy-conscious telemetry as per `AGENTS.md`.

## Example Prompts
- "Refactor the `buildUnitList` function to improve readability while preserving behavior."
- "Add a test case for the `buildFlowGraph` use case."
- "Update the `README.md` to include new build instructions."

## Next Steps
- For complex tasks, refer to the relevant use case in `docs/sdd/use-cases`.
- Suggest additional agent customizations if needed, such as hooks or skills for specific workflows.

---

This file is a living document. Update it as the project evolves.