# Current State

## Repository Shape

The repository currently mixes legacy and target-oriented structure.

- `src/domain` exists for emerging domain concepts and services
- `src/extension` contains VS Code-facing behavior and bootstrap concerns
- `src/ui-component` contains React/webview-oriented presentation code
- `src/generate/parser` contains generated parser artifacts
- `src/test` contains extension test entry points

## Current Architectural Tensions

- activation and composition remain concentrated
- parser-adjacent logic can still leak toward UI-oriented code
- DTO and use-case boundaries are still being clarified
- old folder names coexist with the target clean-architecture layout

## Constraints To Preserve During Migration

- `engines.vscode` is a compatibility contract
- desktop extension and web extension must both continue to work
- domain code must stay free of direct `vscode` imports
- parser, list, flow, CSV, diagnostics, hover, and telemetry behavior should remain stable

## Immediate Documentation Need

Each meaningful change should identify:

- the use case being improved
- the current boundary problem
- the intended extraction path
- the checks needed to prove behavior is preserved
