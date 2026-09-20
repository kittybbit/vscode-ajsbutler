# Feature Specification: Schedule Impact Calendar Qlty Cleanup

## Purpose

Remove all qlty blocking issues introduced by PR #318 while preserving the
Schedule Impact Calendar's observable behavior and established boundaries.

## Minimal Context

- Current decision: refactor only the blocking additions identified by qlty;
  do not change product behavior or quality-tool policy.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Feature kind: transient branch feature.
- Branch goal: make PR #318 (`feat: add schedule impact calendar`) pass its
  qlty check after the closed `schedule-impact-calendar` feature delivered the
  behavior in commit `744fed91`.
- Source use case:
  `docs/requirements/use-cases/uc-present-schedule-impact.md`.
- Quality source: the qlty PR comment reporting 36 blocking issues: 23
  high-complexity findings across PR additions, five duplication findings,
  three excessive-return findings, two Markdown line-length findings, and one
  finding each for excessive parameters, high total complexity, and a complex
  binary expression. Named examples include
  `openScheduleImpactCalendarPanel`,
  `ScheduleImpactCalendarBoundedList`, and `buildCalendarShell`.
- JP1/AJS reference basis: the completed schedule-impact projection and
  presentation contracts already recorded by the source use case. This
  cleanup introduces no new JP1/AJS interpretation and must preserve period,
  run, outcome, ordering, filtering, count, and uncalculated evidence.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: qlty reports no blocking issue for the PR additions covered by this
  feature, without suppressions, ignore annotations, threshold changes, or
  qlty configuration changes.
- R2: refactor the calendar panel and runtime so panel reuse, creation,
  disposal, session cleanup, message handling, resource delivery, and error
  behavior remain unchanged while the reported complexity and parameter
  findings are removed.
- R3: refactor the report-listed presentation additions, including Calendar
  app/list/sections/timeline/model and localization, Explorer requests, shared
  unit detail/tree controls, and Table header helpers. Rendering bounds, focus
  and keyboard behavior, accessibility text, filters, ordering, counts, empty
  states, localized output, and before/after content must remain unchanged
  while the reported complexity, return, duplication, and expression findings
  are removed.
- R4: correct the blocking Markdown line lengths in `CHANGELOG.md` without
  changing the release note's meaning.
- R5: retain the existing Clean Architecture dependencies, browser-safe shared
  code, MUI theme flow, DTOs, transport schema, and public exports unless a
  source-compatible internal extraction is required to remove a finding.
- R6: validate the affected panel/runtime, component, model, accessibility,
  desktop, and web paths at a level sufficient to show behavioral parity.

## Architecture

- Domain: none; schedule semantics and domain facts are unchanged.
- Application: no behavior or DTO change is expected.
- Presentation: decompose the existing VS Code calendar host/runtime and
  calendar webview functions within their current responsibilities.
- Infrastructure: none.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: the live
  report covers the calendar panel/runtime/session request path, Calendar app,
  bounded list, sections, timeline, model and localization, the shared unit
  detail/tree controls, Table header helpers, their focused tests, and the
  blocking `CHANGELOG.md` lines. Planning must reconcile every exact live
  location, including Semantic Diff Explorer request handling, before fixing
  the same 36 findings.
- Propagation decision: internal helpers may be extracted beside their current
  owner when that reduces measured complexity or duplication. Commands,
  application projections, transport payloads, localized output, durable use
  cases, and unrelated Semantic Diff behavior remain unchanged.

### Breaking Change Analysis

- User-visible behavior: none expected.
- API/DTO/schema compatibility: no changes permitted.
- VS Code/web extension compatibility: preserve the current
  `engines.vscode`, desktop extension, and web extension behavior.
- Changed scenarios: none; all scenarios in
  `uc-present-schedule-impact.md` remain regression contracts.

### Alternative Considerations

- Suppress or configure away the findings: rejected because the user requested
  their resolution and the feature explicitly prohibits suppression and qlty
  configuration changes.
- Reopen the closed `schedule-impact-calendar` feature: rejected because its
  product scope completed and its temporary artifacts were removed at Feature
  Exit; this PR-only quality correction has a separate purpose and gate.
- Broad calendar redesign: rejected because it would create independent
  product and architecture outcomes outside this cleanup.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: observable UI or accessibility changes,
  schedule-semantic changes, DTO/transport changes, exported API breakage,
  qlty policy changes, unrelated cleanup, or a finding that requires work
  outside the PR's blocking additions.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: retain browser-safe code and the existing
  calendar webview lifecycle, resource, theme, and message behavior.
- Desktop extension compatibility: retain panel/session reuse, disposal,
  reveal, command integration, and error cleanup behavior.
- JP1/AJS compatibility: retain all supplied schedule facts and explicit
  uncalculated evidence without reinterpretation.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The qlty check for PR #318 has no blocking issue attributable to the 36-item
  report that originated this feature.
- No suppression, ignore annotation, threshold adjustment, or qlty
  configuration change is present.
- Focused calendar panel/runtime, model, component, accessibility, and
  transport-adjacent regression tests pass as selected during planning.
- Repository qlty, Markdown lint, compile/build, and relevant desktop/web
  checks pass according to the final affected surface.
- Existing Schedule Impact Calendar use-case scenarios and user-visible output
  remain unchanged.

## Non-Goals

- Add or change schedule interpretation, date calculation, projection, or
  filtering behavior.
- Redesign the Calendar or Semantic Diff Explorer UI.
- Change localization, accessibility contracts, DTOs, transport schemas,
  commands, telemetry, or public documentation beyond behavior-neutral line
  wrapping.
- Clean up non-blocking legacy findings or unrelated files.
- Change qlty, markdownlint, TypeScript, test, or build configuration.

## Open Questions

- None. Planning must reconcile the exact live qlty issue locations with the
  36-item PR summary before defining implementation slices.
