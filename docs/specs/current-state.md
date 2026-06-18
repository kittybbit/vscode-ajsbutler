# Current State

## Repository Shape

The repository currently mixes legacy folder names with increasingly explicit
application and adapter boundaries.

- `src/domain` contains raw parsed units, wrapper/interpreter models, normalized
  AJS models, parameter semantics, and concrete ANTLR parser orchestration
- `src/application` contains unit-list, flow-graph, unit-definition,
  editor-feedback, telemetry-port, and WebAPI-import use cases or DTOs
- `src/infrastructure` contains the concrete JP1/AJS3 WebAPI import adapter and
  generated transport types
- `src/extension` contains VS Code-facing adapters, explicit bootstrap wiring,
  telemetry adapters, WebAPI command wiring, and webview orchestration
- `src/ui-component` contains React/webview presentation code and
  presentation-local flow layout state
- `src/shared` contains host-neutral webview event contracts and shared app
  resources
- `src/generate/parser` contains generated parser artifacts
- `src/test` contains extension test entry points
- `sample` contains representative JP1/AJS definition files that can be reused
  as stable parser and use-case fixtures

## Current Architectural Tensions

- bootstrap is now split into lifecycle, runtime, subscription, viewer, and
  WebAPI-import wiring modules, but all VS Code runtime construction still
  converges in the extension adapter layer
- concrete ANTLR orchestration still lives under `src/domain/services/parser`;
  application use cases for unit-list building and syntax diagnostics import it
  directly instead of depending on an application-facing parser port
- raw `Unit` remains intentionally parser-adjacent, but semantic diagnostics
  still operate directly on that raw model while normalized-model adoption is
  further advanced in unit-list and flow-graph paths
- flow rendering consumes application DTOs, while expanded nested-flow layout
  remains presentation-local and is now split across focused geometry,
  collision, growth, position, and reveal helpers
- old folder names coexist with the target clean-architecture layout
- package-management and validation workflow center on the pinned `pnpm`
  version and repository scripts
- webview payload contracts are now plain DTOs and event objects, reducing
  serialization-boundary coupling across desktop and web hosts
- `UnitEntity` wrapper ids now use deterministic UUID v5 values derived from
  absolute paths, while current application-facing normalized AJS ids continue
  to use absolute paths
- JP1/AJS parameter interpretation and command generation are aligned to the
  version 13 reference for the currently documented slices
- read-only server-side definition loading through the JP1/AJS WebAPI exists as
  a desktop beta behind application and infrastructure boundaries; web-host
  import remains explicitly unsupported and real-environment verification is
  still pending

## Constraints To Preserve During Migration

- `engines.vscode` is a compatibility contract
- desktop extension and web extension must both continue to work
- domain code must stay free of direct `vscode` imports
- parser, list, flow, CSV, diagnostics, hover, and telemetry behavior should
  remain stable
- dependency upgrades should be routine, but compatibility exceptions must stay
  documented and reviewable

## Immediate Migration Need

The next focused architecture slice should:

- define an application-facing parser port for consumers of raw definition text
- move concrete ANTLR construction and tree-walking behind an infrastructure
  adapter
- preserve raw `Unit` and parser-error behavior at the initial seam
- keep desktop and web bundles free of new host-specific dependencies

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

## Confirmed Product Direction

- JP1 reference alignment should target JP1/Automatic Job Management System 3
  version 13 documentation
- parameter parsing should use the Definition File Reference as the normative
  source
- generated `ajs` command support should use the Command Reference as the
  normative source
- JP1/AJS WebAPI support currently provides read-only desktop import as a beta;
  broader endpoint and web-host support remain outside the active boundary
- flow-graph improvements are currently aimed at visual resemblance to
  JP1/AJS View, progressive nested expansion, and explicit navigation between
  list and flow views when both are available
- deterministic nested expansion layout is a current product requirement so
  the same expanded-unit set yields the same non-overlapping viewer layout
