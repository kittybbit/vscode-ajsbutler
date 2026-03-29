# Architecture

## Target layering

- Domain
- Application
- Infrastructure
- Presentation

## Dependency direction

Domain <- Application <- Infrastructure / Presentation

## Transitional note

The repository currently contains mixed responsibilities.
Migration should be incremental and use-case driven.

## Current Structure

- `src/domain`
  Contains unit models, value objects, parser orchestration, CSV export logic, and some adapter-like event helpers.
- `src/extension`
  Contains extension activation, diagnostics, hover provider registration, preview commands, and webview panel orchestration.
- `src/ui-component`
  Contains React-based webview presentation for table and flow views.
- `src/generate/parser`
  Contains generated ANTLR parser artifacts.

## Parser Boundaries

### Stable parser-adjacent boundary

- grammar source lives in `src/antlr`
- generated parser code lives in `src/generate/parser`
- parser orchestration currently lives in `src/domain/services/parser/AjsParser.ts`
- parse-tree evaluation currently lives in `src/domain/services/parser/AjsEvaluator.ts`
- syntax error collection currently lives in `src/domain/services/parser/SyntaxErrorListener.ts`

### Where parser output crosses outward

- `src/domain/services/parser/AjsParser.ts` returns `Unit[]` plus syntax errors, which is a reasonable boundary for domain-facing consumers
- `src/domain/models/converter.ts` turns parsed units into flatted JSON for webview messaging
- `src/extension/diagnostics/Diagnostic.ts` consumes parse errors directly and maps them to VS Code diagnostics
- webview event handlers call `toJsonData(...)`, so parser output currently flows toward presentation through domain-side helpers

### Boundary assessment

- the grammar and generated parser are already isolated
- the evaluator-to-`Unit[]` mapping is the best current seam for a future application use case
- `converter.ts` is not a domain concern because it mixes parser access, serialization format, and VS Code editor lookup

## VS Code API Boundaries

### Correct boundary locations

- `src/extension.ts`
- `src/extension/commands/*`
- `src/extension/diagnostics/*`
- `src/extension/languages/*`
- `src/extension/webview/*`
- `src/test/*`

### Current boundary leaks

- `src/domain/models/converter.ts` imports `vscode`
- `src/domain/services/events/change.ts` imports `vscode`
- `src/domain/services/events/ready.ts` imports `vscode`
- `src/domain/services/events/resource.ts` imports `vscode`
- `src/domain/services/events/save.ts` imports `vscode`
- `src/domain/services/events/operation.ts` imports `vscode`

### Interpretation

- the extension layer is already the natural adapter boundary
- the event helpers under `src/domain/services/events` are presentation or infrastructure adapters and should not remain in domain long term
- `src/domain/models/converter.ts` should become an application or presentation-facing mapper rather than a domain utility

## Web Extension Risks

- `src/extension.ts` is used for both desktop and browser entry points, so any shared import chain can affect both bundles
- `src/extension/MyExtension.ts` depends on `@vscode/extension-telemetry`; this needs continued verification in web extension execution
- `src/domain/services/events/resource.ts` imports `os`; webpack currently provides a browser fallback, but this keeps environment-specific logic in the wrong layer
- `src/domain/services/events/save.ts` relies on `showSaveDialog` and `workspace.fs`; behavior must remain valid in browser-hosted extension contexts
- `src/domain/models/converter.ts` reads from `vscode.window.visibleTextEditors`, which couples shared transformation flow to editor state assumptions
- `src/ui-component` receives flatted JSON payloads, so serialization format changes can break both desktop and web viewers even if parsing remains correct

## First Good Vertical Slice

### Recommended slice

Build Unit List

### Why this slice is first

- it already has a documented use case
- it sits closest to the existing parser-to-domain seam
- it is shared by diagnostics-adjacent parsing and table-view presentation needs
- it can reduce current coupling without forcing an immediate flow-graph redesign

### Slice goal

Extract an application-facing "build unit list" use case that accepts raw AJS text and returns UI-independent rows or DTOs.

### Expected benefits

- moves parser invocation behind a clearer application boundary
- removes `vscode` and serialization concerns from domain-side helpers
- gives the table webview a DTO-oriented input instead of parser-adjacent structures
- creates a repeatable pattern for later slices such as CSV export and flow graph building

## Initial extraction priority

1. ParseAjsDefinition
2. BuildUnitList
3. ExportUnitListCsv
4. BuildFlowGraph
5. ShowUnitDefinition
