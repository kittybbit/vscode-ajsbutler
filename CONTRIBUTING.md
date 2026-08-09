# Contributing to vscode-ajsbutler

<!-- markdownlint-disable MD013 -->

This document is the contributor entry point for [JP1/AJS Butler](README.md). Product usage and privacy information belongs in [README.md](README.md) and [README.en.md](README.en.md). The repository rules and lifecycle documents linked below remain the owners of their policies; this file only points to them and records the commands contributors need most often.

## Before you start

- Use Node.js 20 or later. The extension declares `node >=20` and the browser test tool currently requires Node.js 20 or later.
- Use pnpm 10.33.0, as declared by the repository `packageManager` field.
- Install dependencies with `pnpm install`.
- Run the relevant check before opening a pull request, and inspect the working tree after commands that format files.

The repository supports desktop and web extension hosts. Keep shared code browser-safe and preserve the VS Code engine range in `package.json`.

## Common scripts

The scripts in `package.json` are run with pnpm. Some scripts use `npm-run-all` internally to sequence tasks; contributors should invoke the package scripts rather than reproduce those internal commands.

| Command                        | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `pnpm run build`               | Create the production desktop and web bundles.       |
| `pnpm run development`         | Build development bundles.                           |
| `pnpm run development:desktop` | Build the desktop development bundle.                |
| `pnpm run development:web`     | Build the web development bundle.                    |
| `pnpm run watch`               | Rebuild while source files change.                   |
| `pnpm test`                    | Prepare and run the desktop extension tests.         |
| `pnpm run test:web`            | Prepare and run the web extension smoke tests.       |
| `pnpm run test:full`           | Prepare and run both desktop and web test runners.   |
| `pnpm run test:compile`        | Compile the test TypeScript project.                 |
| `pnpm run lint:md`             | Lint the repository's SDD and requirements Markdown. |
| `pnpm run qlty`                | Format and check the repository with qlty.           |

`pnpm run qlty` includes formatting. Review `git status` and `git diff` after it runs so that unrelated documents are not included accidentally.

## Desktop, web, and browser checks

The web test runner uses headless Chromium. Install its browser dependency when a clean environment needs it:

```sh
pnpm exec playwright install chromium-headless-shell
```

Use `pnpm run test:web` for the web extension smoke suite and `pnpm run test:full` when both hosts need coverage. For manual browser-side debugging, use the `Launch Extension(web)` configuration in the [repository launch configuration](https://github.com/kittybbit/vscode-ajsbutler/blob/main/.vscode/launch.json).

Desktop tests use `pnpm test`. If you need only the prepared runners, the lower-level scripts are `pnpm run test:prepare:desktop`, `pnpm run test:desktop:run`, `pnpm run test:prepare:web`, and `pnpm run test:web:run`.

## Parser and ANTLR

Normal builds and tests consume the committed generated parser files under `src/generate/parser`. When changing a grammar under `src/antlr/`, ANTLR options, or the generator version, run:

```sh
pnpm run antlr4ts
```

Review generated parser changes together with the grammar change. Do not regenerate parser artifacts for unrelated documentation work.

The repository contains reusable JP1/AJS definition fixtures under [sample/](https://github.com/kittybbit/vscode-ajsbutler/tree/main/sample). Prefer them over large ad hoc definitions when adding parser, normalization, unit-list, or flow-graph coverage.

## Specification-Driven Development

Non-trivial changes follow the repository's Specification-Driven Development process. Read the [SDD policy and document roles](https://github.com/kittybbit/vscode-ajsbutler/blob/main/docs/specs/README.md) before creating or changing feature documents. Durable behavior contracts live in the [requirements use cases](https://github.com/kittybbit/vscode-ajsbutler/tree/main/docs/requirements/use-cases).

The [repository rules in AGENTS.md](https://github.com/kittybbit/vscode-ajsbutler/blob/main/AGENTS.md) define architecture, VS Code compatibility, web support, telemetry, validation, and routing constraints. Do not duplicate those policies in a feature document or README.

## AI Agent guidance

AI-assisted repository work follows the same rules as human contributions. The [Copilot instructions](https://github.com/kittybbit/vscode-ajsbutler/blob/main/.github/copilot-instructions.md), [Codex agent definitions](https://github.com/kittybbit/vscode-ajsbutler/tree/main/.codex/agents), and [canonical agent skills](https://github.com/kittybbit/vscode-ajsbutler/tree/main/.agents/skills) provide the entry points for agent-specific procedures. Keep approval gates and scope decisions in the SDD documents owned by the repository process.

## Debugging and release

For extension-host debugging, use the `Launch Extension` or `Launch Extension(web)` configurations in the [repository launch configuration](https://github.com/kittybbit/vscode-ajsbutler/blob/main/.vscode/launch.json). The ANTLR debug configuration is also defined there for grammar work.

Release preparation and Marketplace publication follow the [release-extension procedure](https://github.com/kittybbit/vscode-ajsbutler/blob/main/.agents/skills/release-extension/SKILL.md). It covers protected branches, version and tag checks, package inspection, validation, and publication approval. Do not publish a VSIX from an unreviewed working tree.

## Pull requests

Keep a pull request focused on one behavior or documentation boundary. Describe the user-facing effect, the checks you ran, desktop and web impact, compatibility impact, and any remaining risk. Do not commit generated packages, local credentials, or environment-specific data.

<!-- markdownlint-enable MD013 -->
