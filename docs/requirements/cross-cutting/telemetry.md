# Cross-Cutting Requirement: Telemetry

## Purpose

Keep operational telemetry privacy-preserving and isolated behind a narrow
contract so product quality, workflow completion, performance, diagnostics,
and roadmap prioritization can be evaluated without collecting user content.

## Applies To

- extension lifecycle and viewer readiness
- CSV export, navigation, search, and definition opening
- diagnostics and hover
- WebAPI import workflow stages
- future approved semantic comparison, dependency analysis, review support,
  and AI-assisted capabilities

## Allowed Inputs

- approved telemetry event names
- allowlisted string properties
- anonymous operational metadata such as host kind, feature area, result,
  repository-owned error code, diagnostic category, unit type category,
  workflow stage, and coarse count, duration, size, or query-length buckets

## Required Outcomes

- events are submitted through an adapter implementation
- SDK-specific types remain outside application and presentation callers
- telemetry failure does not affect user workflows
- a Noop fallback is available when telemetry cannot initialize

## Privacy Rules

- telemetry must collect only anonymous operational metadata
- telemetry must never include job or unit names, comments, command text,
  definition content, file paths, search text, user or organization names,
  server, manager, or service names, URLs, credentials, prompts, responses,
  generated content, provider account identifiers, raw server bodies, raw
  errors, raw exception messages, or stack traces
- properties are allowlisted by schema or event builder
- event names use a stable product namespace such as
  `<area>.<object>.<action>` or `<area>.<workflow>.<stage>`
- exact numeric measurements are used only when explicitly non-sensitive and
  product-relevant; otherwise coarse buckets are required
- errors use repository-owned codes or status categories
- diagnostics use anonymous categories or stable rule IDs and aggregate counts
- search may report result counts, query-length buckets, modes, surfaces,
  durations, and outcomes, but never query text or matched identities
- performance may report duration and size buckets without inspecting content
- desktop and web entry points share the same telemetry contract

## Future Capability Rules

- future event families and privacy constraints may be documented before a
  roadmap capability exists
- runtime events are introduced only with the approved feature behavior they
  measure
- semantic comparison, dependency analysis, review support, and AI-assisted
  telemetry are limited to anonymous capability, result, safety, provider,
  duration, count, size, and repository-owned error metadata
- AI-assisted telemetry never includes prompts, responses, definitions,
  generated content, provider account identifiers, raw model errors, or stack
  traces

## Behavioral Scenarios

```gherkin
Feature: Privacy-preserving telemetry

Scenario: Lifecycle events use the telemetry boundary
  Given the extension activates or deactivates
  When lifecycle telemetry is recorded
  Then the event is submitted through the telemetry adapter
  And SDK-specific types remain outside application and presentation callers

Scenario: Viewer telemetry distinguishes invocation and readiness
  Given a table or flow viewer is opened
  When the viewer becomes ready
  Then invocation and successful readiness can be distinguished
  And only anonymous host, result, and bucketed size metadata is submitted

Scenario: Workflow telemetry omits user content
  Given an approved workflow records an operational result
  When the telemetry event is submitted
  Then only allowlisted anonymous metadata is included
  And definition content, paths, names, commands, queries, and credentials are omitted

Scenario: Search telemetry omits query text
  Given a user submits a table, flow, or future unified search query
  When the search outcome is recorded
  Then query-length, result-count, mode, and surface metadata may be used
  And duration and result metadata may be used
  And the query text and matched unit identity are omitted

Scenario: Diagnostics use anonymous identifiers
  Given editor diagnostics are evaluated
  When diagnostic frequency telemetry is recorded
  Then only a diagnostic category or stable rule ID and a count bucket are used
  And source text and parameter values are omitted

Scenario: Performance telemetry uses coarse buckets
  Given a parse, list, flow, export, or render operation completes
  When operation performance is recorded
  Then approved duration and size buckets may be used
  And definition content and sensitive identifiers are omitted

Scenario: Workflow completion records safe outcomes
  Given an approved workflow starts
  When it completes, fails, is cancelled, or is observably abandoned
  Then its stage and anonymous result metadata may be recorded
  And raw credentials, server details, content, and paths are omitted
  And prompts and responses are omitted

Scenario: Telemetry failure does not interrupt a workflow
  Given telemetry is unavailable or cannot initialize
  When the user starts an extension workflow
  Then the workflow continues through a Noop telemetry implementation

Scenario: Future events are not emitted before feature implementation
  Given a roadmap capability is not implemented
  When its telemetry privacy constraints are documented
  Then no runtime event is added until the corresponding feature is approved
```

## Acceptance Notes

- telemetry remains optional and respects VS Code telemetry settings through
  the telemetry SDK behavior
- every event should answer a named product-improvement question
- supported questions include feature usage, rarely used features, abandoned
  workflows, failed searches, slow operations, roadmap prioritization, and
  frequent diagnostic categories
- lifecycle cleanup continues to dispose the telemetry adapter correctly

## Risks Or Edge Cases

- browser execution depends on the telemetry SDK package behavior
- abandonment is unreliable unless the observable workflow state is explicit
- diagnostic messages can become unsafe identifiers if they contain raw values
