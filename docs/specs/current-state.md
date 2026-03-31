# Current State

## Repository Shape

The repository currently mixes legacy and target-oriented structure.

- `src/domain` exists for emerging domain concepts and services
- `src/extension` contains VS Code-facing behavior and bootstrap concerns
- `src/ui-component` contains React/webview-oriented presentation code
- `src/generate/parser` contains generated parser artifacts
- `src/test` contains extension test entry points
- `sample` contains representative JP1/AJS definition files that can be reused
  as stable parser and use-case fixtures

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

## Fixture Baseline

The repository already contains reusable AJS definitions in `sample/`.

- `sample/sample1_utf8`
  Representative UTF-8 fixture with nested job groups, jobnets, relations,
  schedule parameters, queue jobs, event jobs, and multiline command text
- `sample/sample1_sjis`
  Representative Shift_JIS fixture for encoding-sensitive parsing and legacy
  compatibility checks
- `sample/sample1_utf8_large`
  Large UTF-8 fixture for performance-oriented parser, list, and flow tests

When new parser, normalization, unit-list, or flow-graph tests are added,
prefer these shared fixtures over ad hoc inline definitions unless the test is
specifically about a narrow edge case.
