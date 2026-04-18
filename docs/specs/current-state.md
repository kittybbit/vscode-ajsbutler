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
- package-management and validation workflow still assume `npm`, which makes
  lockfile strategy and dependency hygiene harder to modernize incrementally
- webview payload contracts are now plain DTOs and event objects, but some
  specs and follow-up tasks still need to finish removing stale
  serialization-boundary assumptions from the remaining modernization docs
- webview bundle-size pressure remains visible in roadmap planning, especially
  while shared dependencies continue to grow
- some legacy `UnitEntity` mechanics still rely on custom implementation
  details, such as a bespoke hash algorithm, where broader ecosystem
  conventions would reduce maintenance risk
- JP1/AJS parameter interpretation and command generation are not yet described
  as explicitly reference-aligned to one target manual edition
- server-side definition loading through the JP1/AJS WebAPI is not yet part of
  the documented product boundary

## Constraints To Preserve During Migration

- `engines.vscode` is a compatibility contract
- desktop extension and web extension must both continue to work
- domain code must stay free of direct `vscode` imports
- parser, list, flow, CSV, diagnostics, hover, and telemetry behavior should
  remain stable
- dependency upgrades should be routine, but compatibility exceptions must stay
  documented and reviewable

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

## Newly Confirmed Product Direction

- JP1 reference alignment should target JP1/Automatic Job Management System 3
  version 13 documentation
- parameter parsing should use the Definition File Reference as the normative
  source
- generated `ajs` command support should use the Command Reference as the
  normative source
- JP1/AJS WebAPI support is currently planned as read-only import of server
  definition data
- flow-graph improvements are currently aimed at visual resemblance to
  JP1/AJS View, progressive nested expansion, and explicit navigation between
  list and flow views when both are available
