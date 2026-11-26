# Contributing to vscode-ajsbutler

<!-- markdownlint-disable MD013 -->

This document is the contributor entry point for [JP1/AJS Butler](README.md). Product usage and privacy information belongs in [README.md](README.md) and [README.en.md](README.en.md). The repository rules and lifecycle documents linked below remain the owners of their policies; this file only points to them and records the commands contributors need most often.

## Before you start

- Use Node.js 24.18.0 or later. The extension declares `node >=24.18.0` to meet the Prism CLI requirement.
- Use pnpm 10.33.0, as declared by the repository `packageManager` field.
- Install dependencies with `pnpm install`.
- Run the relevant check before opening a pull request, and inspect the working tree after commands that format files.

The repository supports desktop and web extension hosts. Keep shared code browser-safe and preserve the VS Code engine range in `package.json`.

## Common scripts

The scripts in `package.json` are run with pnpm. Build, development, watch, and test commands cover both Desktop and Web hosts.

| Command                | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `pnpm run build`       | Clean and create production Desktop and Web bundles.                    |
| `pnpm run development` | Build development bundles for both hosts.                               |
| `pnpm run watch`       | Rebuild both hosts while source files change.                           |
| `pnpm test`            | Build and run stable Desktop, minimum Desktop, and Web suites in order. |
| `pnpm run lint:md`     | Lint the repository's SDD and requirements Markdown.                    |
| `pnpm run qlty`        | Format and check the repository with qlty.                              |

`pnpm run qlty` includes formatting. Review `git status` and `git diff` after it runs so that unrelated documents are not included accidentally.

## Desktop, web, and browser checks

The desktop accessibility boundary and web test runner use headless Chromium. Install its browser dependency when a clean environment needs it:

```sh
pnpm exec playwright install chromium-headless-shell
```

`pnpm test` builds both production extension bundles, compiles the test runners, builds both browser fixtures in one Webpack invocation, then runs the stable Desktop suite, the VS Code 1.75.0 Desktop smoke suite, and the Web smoke suite. Each stage runs once, and a failure stops the remaining stages. For manual browser-side debugging, use the `Launch Extension(web)` configuration in the [repository launch configuration](https://github.com/kittybbit/vscode-ajsbutler/blob/main/.vscode/launch.json).

The Desktop SDK downloads and launches stable VS Code without a manual executable, alias, or define wrapper. Desktop tests need a graphical session; on Linux, run the full recipe under Xvfb with `xvfb-run -a pnpm test`. First-time host and browser downloads need network access.

Desktop output marks host launch, suite-runner loading, initialization, test-file loading, case execution, and completion. Loading errors retain their original cause; failed cases and host failures return a nonzero exit. The full suite initializes compiled TypeScript aliases and development defines before loading test files.

The shared test Webpack configuration builds the Desktop accessibility fixture and Web smoke fixture together. The smoke source exports the host entry directly.

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
