# Cross-Cutting Requirement: Telemetry

## Purpose

Collect only aggregate signals about completed extension use. The event catalog
is closed; product callers cannot attach arbitrary properties or measurements.

## Event contract

<!-- markdownlint-disable MD013 MD060 -->

| Event                     | Properties                  | Trigger and frequency                                                 |
| ------------------------- | --------------------------- | --------------------------------------------------------------------- |
| `extension.activated`     | `host`                      | Once after each completed activation                                  |
| `viewer.open_completed`   | `feature`, `host`, `result` | Once per explicit Table/Flow open, including an existing-panel reveal |
| `search.executed`         | `feature`                   | Once per committed nonempty Table/Flow search                         |
| `csv.exported`            | `method`                    | Once after a successful CSV copy or save                              |
| `webapi_import.completed` | `result`                    | Once at the end of an explicit import                                 |
| `semantic_diff.completed` | `result`                    | Once at the end of an explicit comparison                             |
| `semantic_diff.exported`  | `method`                    | Once after a successful Semantic Diff copy or save                    |

| Property  | Allowed values                   |
| --------- | -------------------------------- |
| `host`    | `desktop`, `web`                 |
| `feature` | `table`, `flow`                  |
| `result`  | `success`, `failed`, `cancelled` |
| `method`  | `copy`, `save`                   |

<!-- markdownlint-enable MD013 MD060 -->

Viewer results are `success` or `failed`. Import and comparison results may
also be `cancelled`. Events contain only the properties listed for their row.
No event includes counts, durations, sizes, query text, file details, source
type, report mode, diagnostic data or error details.

## Exclusions and behavior

- Do not collect job or unit names, comments, definition content, paths, search
  text, commands, user or organization identifiers, URLs, server names,
  credentials, prompts, responses, generated content, raw errors or stack traces.
- Do not report editor diagnostics, hover, viewer close, panel restoration,
  background refresh, navigation details, selection, filtering, scope changes,
  expansion, rendering, performance or per-step workflow events.
- Search reports only a committed operation and its `feature`; edits,
  keystrokes, result navigation, clear and reset do not add events.
- CSV and Semantic Diff export events follow a fulfilled clipboard or file
  write. A cancelled dialog, missing output or failed write produces none.
- Import and comparison report one terminal result. Their internal steps and
  output contents are not collected.
- The telemetry SDK remains in its infrastructure adapter. Telemetry uses the
  existing VS Code telemetry setting and Noop fallback. Initialization,
  reporting or disposal failures must not interrupt extension behavior.
- Desktop and web share the same application event contract. No custom
  identifiers, additional data acquisition or telemetry-specific persistence
  are permitted.

## Maintenance

Add an event only with an approved feature and an update to this catalog.
Keep application event construction typed and runtime-validated, keep SDK
types in infrastructure, and preserve failure isolation and functional tests.
