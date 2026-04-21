# vscode-ajsbutler

<!-- markdownlint-disable MD013 -->

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Visual Studio Marketplace Version][marketplace-version-badge]][marketplace]
[![Marketplace Downloads][marketplace-downloads-badge]][marketplace]
[![Visual Studio Marketplace Rating][marketplace-rating-badge]][marketplace]
[![Qlty Maintainability][qlty-badge]][qlty-project]

<!-- markdownlint-enable MD013 -->

The vscode-ajsbutler extension offers a convenient way to display definition
information for JP1/AJS3 from Hitachi in a human-readable format.

## Features

- Displays JP1/AJS3 definition information in an easily readable format.
- Set the editor’s language mode to ‘jp1ajs’ to view the formatted
  definition items.
- Switch the editor to enable a list-style display of the information.
  ![unit-list](images/unit-list.png)
- Select which items to display in the unit list.
  ![column-selector](images/column-selector.png)
- View unit definitions.
  ![unit-dialog](images/unit-dialog.png)
- Save data in CSV format.
- Switch the editor to enable a flow-style display of the information.
  ![unit-list](images/unit-flow.png)
- Highlights the current node, ancestor path, and root jobnet more clearly in
  the flow viewer.
- Supports web extensions.

## Recent Updates

- Flow viewer now supports inline nested jobnet expansion, current-scope flow
  search, and list/flow bridge navigation.
- Flow viewer visuals and layout behavior are more stable in both desktop and
  web hosts.

## Extension Settings

This extension does not require any specific configuration settings.

## Usage

To use this extension:

1. Install the extension.
2. Set the editor’s language mode to ‘jp1ajs’ to view the formatted
   definitions.
3. Switch the editor to enable either a list-style or flow-style display.

## Development

This repository is incrementally adopting Specification-Driven Development
(SDD) and cleaner application boundaries.

- SDD guidance starts in `docs/specs/README.md`.
- Repository-level use-case contracts live in
  `docs/requirements/use-cases/`.
- Branch-level planning is tracked in `docs/specs/plans.md`.
- `PLANS.md` is the root index that points to the active SDD documents.
- Codex-specific repository guidance lives in `AGENTS.md`.
- Docs-only work should use a `docs/...` branch name and stay within the
  docs-only file set used by `.github/workflows/verify.yml`:
  `docs/**`, `README.md`, `.codex/**/*.md`, and `.github/**/*.md`.

Recent refactoring work introduced:

- a normalized AJS model for application-facing use cases
- application use cases for unit list, flow graph, CSV export, and unit
  definition building
- a table row/view adapter so the table UI consumes application view data
  instead of `UnitEntity` wrapper accessors
- repeatable web-extension verification via `pnpm run test:web`

Browser-based extension testing uses `@vscode/test-web`, which currently
requires Node.js 20 or later.
If you manage Node with nodebrew, switch to a Node 20 release before running
browser tooling:

```bash
nodebrew install-binary v20.19.0
nodebrew use v20.19.0
hash -r
corepack enable
pnpm install
pnpm exec playwright install chromium-headless-shell
```

After switching, you can run:

```bash
pnpm run qlty
pnpm test
pnpm run test:web
pnpm run build
```

The `sample/` directory contains reusable JP1/AJS definition files for parser,
normalization, unit-list, and flow-graph regression tests. Prefer those shared
fixtures over ad hoc large inline definitions when adding broader coverage.

For manual browser-side verification during development, use the VS Code
launch configuration `Launch Extension(web)` in `.vscode/launch.json`.

`pnpm run test:web` runs the extension test suite against VS Code for the Web
in headless Chromium.
GitHub Actions also runs `pnpm run lint:md`, `pnpm run build`, `pnpm test`, and
`pnpm run test:web` on pushes and pull requests.

## For AI Agents

This repository supports both **Copilot CLI** and **Codex** (VS Code Copilot).
Agents should coordinate using a shared routing guide rather than separate
configurations.

### Quick Reference

| Agent           | Primary Strength                       | Fallback Available | Configuration                     |
| --------------- | -------------------------------------- | ------------------ | --------------------------------- |
| **Codex**       | Live coding, SDD workflow, interactive | Yes (Copilot CLI)  | `.codex/skills/`                  |
| **Copilot CLI** | Automation, git ops, batch work        | Yes (Codex)        | `.github/copilot-instructions.md` |

**Note**: If a Primary agent reaches token limit or session loss, use the Fallback agent.
Both agents stay coordinated through a single routing guide (see below).

### Routing Guide (Single Source of Truth)

For detailed task-to-agent assignment with Primary/Fallback options:

- **See** `AGENTS.md` § "AI Agent Routing Guide"
- **See** `.agent.md` for lightweight coordination index
- All rules reference **AGENTS.md**, never duplicate

### Key Files

- `AGENTS.md` - Architecture rules and agent routing (authoritative)
- `.agent.md` - Multi-agent coordination index
- `docs/specs/` - Specification-driven development documentation
- `.github/copilot-instructions.md` - Copilot CLI entry point
- `.codex/skills/` - Codex-specific workflows

## Telemetry

This extension collects telemetry data to improve the experience of using this
extension with VS Code. We only collect data on which commands are executed.
We do not collect any information about names, addresses, paths, etc. The
extension respects the telemetry.enableTelemetry setting. You can learn more
about that setting in our [FAQ][telemetry-faq].

## License

MIT

<!-- markdownlint-disable MD013 -->

[marketplace]: https://marketplace.visualstudio.com/items?itemName=kittybbit.vscode-ajsbutler
[marketplace-version-badge]: https://img.shields.io/visual-studio-marketplace/v/kittybbit.vscode-ajsbutler
[marketplace-downloads-badge]: https://img.shields.io/visual-studio-marketplace/d/kittybbit.vscode-ajsbutler
[marketplace-rating-badge]: https://img.shields.io/visual-studio-marketplace/stars/kittybbit.vscode-ajsbutler
[qlty-project]: https://qlty.sh/gh/kittybbit/projects/vscode-ajsbutler
[qlty-badge]: https://qlty.sh/badges/0cc9e169-14e8-44d7-a0de-5c358687a18e/maintainability.png
[telemetry-faq]: https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting

<!-- markdownlint-enable MD013 -->
