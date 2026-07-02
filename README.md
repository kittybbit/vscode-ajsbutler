# vscode-ajsbutler

<!-- markdownlint-disable MD013 -->

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
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

This repository uses Specification-Driven Development (SDD) as the standard
process for non-trivial changes.

- SDD workflow and document roles: `docs/specs/README.md`
- Agent-facing repository rules and routing: `AGENTS.md`
- Durable behavior contracts: `docs/requirements/use-cases/`
- Copilot CLI entry point: `.github/copilot-instructions.md`
- Codex workflows: `.codex/skills/`

Keep README as an overview and command reference. Detailed development rules,
approval gates, feature artifact responsibilities, and agent routing live in
the documents above.

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
pnpm run test:full
pnpm test
pnpm run test:web
pnpm run build
```

ANTLR parser generation is explicit. Normal build and test commands consume
the committed parser artifacts in `src/generate/parser`. When changing
`src/antlr/*.g4`, ANTLR command options, or the generator version, run:

```bash
pnpm run antlr4ts
```

Then commit any generated parser artifact changes with the grammar change.

Desktop and web test commands are compatible from a clean checkout:

- `pnpm test` prepares the desktop extension and editor bundles, compiles
  tests, then runs the desktop extension tests.
- `pnpm run test:web` prepares the web extension and editor bundles, compiles
  tests, then runs the web extension smoke tests.
- `pnpm run test:full` prepares all development bundles and compiled tests
  once, then runs both desktop and web test runners.

The `sample/` directory contains reusable JP1/AJS definition files for parser,
normalization, unit-list, and flow-graph regression tests. Prefer those shared
fixtures over ad hoc large inline definitions when adding broader coverage.

For manual browser-side verification during development, use the VS Code
launch configuration `Launch Extension(web)` in `.vscode/launch.json`.

`pnpm run test:web` runs the extension test suite against VS Code for the Web
in headless Chromium.
`pnpm run test:full` prepares development bundles and compiled tests once
before running both desktop and web extension tests.
GitHub Actions also runs `pnpm run lint:md`, `pnpm run build`,
`pnpm run test:compile`, `pnpm run test:desktop:run`, and
`pnpm run test:web:run` on pull requests. The workflow caches Playwright
browser downloads while still running the Playwright install command, so cache
misses remain valid.

## For AI Agents

Agent development rules are centralized in `AGENTS.md` and
`docs/specs/README.md`. README intentionally stays at overview level to avoid
duplicating the SDD workflow.

## Telemetry

This extension collects telemetry data to improve the experience of using this
extension with VS Code. We collect anonymous operational metadata such as
extension lifecycle, command usage, viewer readiness or close events, and
anonymous viewer action outcomes such as CSV export or navigation, and WebAPI
import workflow outcomes. We do not collect names, addresses, paths,
definition contents, search text, commands, server names, credentials, or other
personal identifiers. The extension respects the telemetry.enableTelemetry
setting. You can learn more about that setting in our [FAQ][telemetry-faq].

## License

MIT

<!-- markdownlint-disable MD013 -->

[qlty-project]: https://qlty.sh/gh/kittybbit/projects/vscode-ajsbutler
[qlty-badge]: https://qlty.sh/badges/0cc9e169-14e8-44d7-a0de-5c358687a18e/maintainability.png
[telemetry-faq]: https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting

<!-- markdownlint-enable MD013 -->
