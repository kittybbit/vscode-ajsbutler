# Feature Specification: Semantic Diff Schedule Simulation Removal

## Purpose

Retire execution-date simulation and focus Semantic Diff on reviewing changes
to JP1/AJS definitions. The user considers JP1 simulation fidelity too costly
to maintain for the accuracy achieved. Remove the retired behavior and its
exclusive implementation and tests, and actively simplify the resulting
component responsibilities.

## Source

- Feature kind: transient branch work; not a new roadmap capability.
- Slug: `semantic-diff-schedule-simulation-removal`.
- Origin: user's feature proposal in the current conversation, 2026-10-12.
- Explicit clarification: `scheduleImpactCalendar.js` and all related
  functionality are unnecessary and must be removed.
- Explicit clarification: delete all related roadmap items and use cases;
  retain independent definition-review requirements in mixed documents.
- Selected branch: `codex/semantic-diff-schedule-simulation-removal`;
  comparison base: `origin/main`.
- Existing contracts: [compare definitions](../../../requirements/use-cases/uc-compare-ajs-definitions.md),
  [build semantic diff](../../../requirements/use-cases/uc-build-semantic-diff.md),
  [present semantic diff report](../../../requirements/use-cases/uc-present-semantic-diff-report.md).
- JP1/AJS basis: existing JP1/AJS3 v13 definition semantics and
  [parameter interpretation rules](../../../requirements/domain-rules/interpret-jp1-parameters.md).
  This feature withdraws prediction capability; it introduces no replacement
  operational semantics or new JP1 fidelity claim.

## Requirements and acceptance

- R1: Definition comparison no longer asks for an execution-date comparison
  period or evaluates executions for any period. File and Git HEAD comparison
  continue to open the read-only Explorer with captured source navigation.
- R2: Delete the execution-date interpreter/projector/calendar computation
  pipeline and run comparison wherever exclusively used by simulation.
  Remove simulation-derived run additions/removals, zero-run or lost-run
  confirmation items, and unsupported/uncalculated simulation explanations.
  Normalization and definition-review limitations remain meaningful.
- R3: Remove the Schedule impact action, child calendar/timeline panels,
  sidecar/session lifecycle, message contracts, exclusive localization,
  rendering assets, and build/test entries that exist for simulation.
  The webpack `scheduleImpactCalendar` entry and its emitted
  `scheduleImpactCalendar.js` asset must cease to exist; remove all supporting
  functionality that exclusively serves that asset.
- R4: Explorer, Summary, Full, Audit, and JSON outputs expose only retained
  definition-review facts. Remove execution-period, calculated-run,
  simulation-status and run-count fields/sections and their exclusive
  formatting/localization paths; do not leave empty compatibility shells.
- R5: Preserve comparison of schedule definition attributes, including the
  current `sd`, `st`, `cy`, `sh`, `shd`, `jc`, `ln`, and `cftd` category.
  A changed schedule definition remains reviewable without predicting an
  execution date or requiring a period. Preserve structural changes,
  identity/candidate evidence, relations, execution conditions, waits,
  definition-based confirmation items, Flow, and report/source actions.
- R6: Preserve parsing and schedule definition values needed by unit-list,
  CSV, unit definition, diagnostics, hover and navigation. In particular,
  reusable `ScheduleDate` and `ScheduleRule` interpretation must not be
  deleted merely because they are located next to simulation code.
- R7: Physically delete simulation-exclusive tests, fixtures and helpers;
  remove simulation cases from mixed suites while retaining useful valid,
  error, edge, privacy and compatibility coverage of surviving contracts.
  Add or update boundary coverage for definition-review behavior and the
  simplified command, outputs and host integration.
- R8: Refactor consequences of removal to give retained components clear
  domain, application, presentation and bootstrap responsibilities. Remove
  obsolete orchestration, wrappers, DTO fields and dependencies rather than
  merely disabling simulation. Each material responsibility or abstraction
  must be justified in the planned Solution Shape.
- R9: Update durable behavior contracts and user documentation to describe
  the retained capability. Delete simulation-only use cases and roadmap items,
  including the schedule impact use case and Deferred Schedule Semantics;
  remove simulation clauses from mixed contracts and their index links,
  and document this observable removal in CHANGELOG under repository policy.

## Decisions and impact

- The removal boundary is execution prediction and its derived UI/evidence,
  not schedule attributes in a definition. Existing attribute comparison is
  independently implemented in `semanticDiffStructuralRules.ts`.
- Shared date/rule interpretation is used by unit-list and diagnostics.
  Consumer analysis, not a `Schedule` filename match, determines deletion.
- Affected surfaces span domain computation, application contracts and
  projections, VS Code command/panel lifecycle, webview rendering, bootstrap,
  resources, tests, bundling and durable documentation.
- This is one outcome. Responsibility cleanup is included only where caused
  by removal; unrelated architecture modernization is outside this feature.
- The surviving WebAPI import feature is inherited and remains independent.

## Compatibility

- `engines.vscode` remains `^1.75.0`. Desktop and web must retain the supported
  comparison workflow and build without new Node dependencies or host APIs.
- Removal intentionally changes command prompts, Explorer actions and
  report/JSON contracts for simulation. JSON emits schemaVersion 2 with
  simulation members removed, following the existing versioning contract;
  schema ID/media type and deterministic retained facts remain. Consumers
  of schemaVersion 1 must migrate; no empty compatibility fields remain.
- Retained JP1/AJS definition parsing/normalization and parameter
  interpretation remain compatible; no grammar or generated-parser change
  is implied. Preserve telemetry privacy and existing retained event meaning.
- No operational calendars, runtime/history verification, fallback
  simulation, replacement prediction service or additional telemetry.

## Non-goals

- Improving simulation accuracy or implementing deferred JP1 schedule forms.
- Removing schedule definition review, schedule diagnostics or list fields.
- Reworking identity matching, condition review, WebAPI import or unrelated
  components to pursue independent improvements.
- Introducing new framework, service container or architecture exceptions.
