# JP1/AJS Butler

<!-- markdownlint-disable MD013 -->

JP1/AJS3 definition viewer

JP1/AJS Butler reads JP1/AJS3 definition files in VS Code and presents units as searchable lists and jobnet flow diagrams. You can inspect a definition, find a unit, and follow its structure without leaving the editor.

[日本語の製品ページ](README.md)

<!-- markdownlint-disable MD033 -->
<p>
  <img src="images/unit-list.png" alt="JP1/AJS unit list showing the search field, unit names, parent paths, and unit types." width="720">
</p>
<p>
  <img src="images/unit-flow.png" alt="JP1/AJS jobnet flow showing unit relationships and the nested hierarchy tree." width="720">
</p>
<!-- markdownlint-enable MD033 -->

## Problems this helps with

- Reading a JP1/AJS definition as plain text takes too much time.
- Large jobnet hierarchies and dependencies are hard to follow.
- Finding one job or definition item means scanning the file again.
- Incident investigation and change review require repeated definition checks.

## Features

### Unit list

View units such as jobs and jobnets from a JP1/AJS definition in one list. The list keeps hierarchy and unit information together.

### Search and filtering

Search the list or the flow view for the unit you need. Flow search covers names, comments, and paths in the current scope and moves to matching results.

### Flow diagrams and nesting

Inspect jobnet structure and unit relationships as a flow diagram. Expand nested jobnets in the same viewer and enter an internal flow scope when you need more detail.

### Unit details

Open definition details from the list or flow view. Where supported, the details also show generated `ajsshow` and `ajsprint` command text. The extension does not execute these commands or integrate with their execution environment.

### CSV output

Copy the visible unit list as CSV. When you choose to save it, VS Code asks you to select the destination before writing the file.

### Semantic Diff

Run `JP1/AJS: Compare JP1/AJS Semantic Diff` to compare the active definition with a selected before definition by semantic meaning. After comparison, choose Summary, Full, Audit, or JSON. Full is the default human-readable report, Summary is a compact overview, Audit includes decision evidence, and JSON is locale-neutral for automation. Copy Markdown with `JP1/AJS: Copy Semantic Diff Markdown`, or save Markdown/JSON with `JP1/AJS: Save Semantic Diff Output`; copying and saving are always explicit actions.

### Diagnostics and hover

Inspect definition diagnostics in the editor. Hover over supported parameters to see additional information.

### WebAPI import beta

Run `JP1/AJS: Import JP1/AJS Definition via WebAPI (Beta)` to read definition information from a JP1/AJS WebAPI endpoint selected by you. This feature is read-only, beta, and available only in the Desktop VS Code extension host. It does not modify or write back a definition.

## Quick start

1. [Install JP1/AJS Butler from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kittybbit.vscode-ajsbutler).
2. Open a JP1/AJS definition file in the active VS Code editor.
3. If needed, set the language mode to `JP1/AJS` with the identifier `jp1ajs`. Automatic file recognition is not assumed.
4. Open the Command Palette and run `View: Open JP1/AJS table viewer`.

Once the list is open, search for a unit and open its details. To try the flow first, run `View: Open JP1/AJS flow viewer` in step 4 instead.

## Screens and actions

The list view lets you inspect hierarchy, search, choose visible columns, open details, and export CSV. The flow view lets you search within the current scope, select related units, and expand nested jobnets.

Semantic Diff starts with `JP1/AJS: Compare JP1/AJS Semantic Diff`. The selected output is shown before any copy or save action, so the extension does not change the clipboard or write a file implicitly.

## Compatibility and scope

- The extension targets JP1/AJS3 definitions and provides list, search, flow, detail, and diagnostic views.
- List and flow views are available in Desktop and Web VS Code hosts. Shared viewers still have host-specific constraints.
- VS Code compatibility follows the `^1.75.0` value in `package.json` under `engines.vscode`.
- The repository includes representative UTF-8 and Shift_JIS definition coverage. This is not a complete compatibility matrix for every product version or definition form.
- WebAPI import beta is available only in the Desktop host. The Web host does not provide the same network feature.

## Security and privacy

The extension reads local definitions that you open and performs the analysis you request, including list, flow, diagnostic, and comparison operations. It does not automatically rewrite the source definition file.

Telemetry may send anonymous operational metadata such as host kind, feature area, result, diagnostic category, and coarse count or duration buckets to help improve the extension. It does not send definition content, file paths, job or unit names, server names, search strings, credentials, or command text. Telemetry respects VS Code's `telemetry.enableTelemetry` setting.

Telemetry communication goes through the telemetry adapter. CSV output occurs only after you choose copy or save and, for a file, select a destination. Semantic Diff opens a virtual Markdown report in VS Code; copying happens only after you explicitly request it. Saving the report is also a user action.

The WebAPI import beta communicates read-only with the JP1/AJS WebAPI endpoint you select. Normal inspection of a local definition does not require a WebAPI connection.

## Limitations and known issues

- The repository does not establish a complete matrix for JP1/AJS product versions, operating systems, unsupported syntax, or maximum file size. Check the definitions you use and report problems through Issues.
- Invalid definitions or unsupported values may produce diagnostics or errors. The extension cannot promise complete interpretation of every definition.
- `ajsprint` is used to generate command text shown in unit details. The extension does not execute it.
- WebAPI import is currently read-only, beta, and Desktop-only, and its usable scope depends on the JP1/AJS environment and connection conditions.

## Issues and feedback

Report bugs, definition compatibility concerns, and display problems in [GitHub Issues](https://github.com/kittybbit/vscode-ajsbutler/issues). Do not include business data such as definition contents, file paths, server names, or credentials in an issue.

## Contributing

See [CONTRIBUTING.md](https://github.com/kittybbit/vscode-ajsbutler/blob/main/CONTRIBUTING.md) for development setup, tests, web checks, ANTLR, SDD, AI Agent guidance, debugging, and release procedures.

## License

[MIT License](LICENSE)

This is an unofficial open-source tool. It is not an official or endorsed tool from Hitachi, Ltd. or the JP1 product team.

VS Code and JP1/AJS are trademarks of their respective owners.

<!-- markdownlint-enable MD013 -->
