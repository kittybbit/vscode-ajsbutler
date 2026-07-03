# UC: Record Telemetry

## Goal

Record privacy-preserving operational telemetry through a narrow contract so
the extension can improve feature quality, workflow completion, performance,
diagnostics, and roadmap prioritization without exposing telemetry SDK types or
user content outside the outer adapter layer.

## Trigger

- extension activation and deactivation
- preview commands and viewer readiness for table and flow views
- webview-originated actions such as CSV export, navigation, search, and unit
  definition opening
- editor feedback such as diagnostics and hover
- WebAPI import workflow stages
- future product capabilities such as unified search, semantic comparison,
  dependency analysis, review support, and AI-assisted features

## Inputs

- approved telemetry event name
- approved string payload properties
- anonymous operational metadata such as host kind, feature area, result,
  error code, diagnostic category, unit type category, count bucket, duration
  bucket, query length bucket, or workflow stage

## Outputs

- telemetry event submission through an adapter implementation
- no SDK-specific types outside the telemetry adapter
- no JP1/AJS definition content, names, paths, commands, raw search text, raw
  error text, credentials, prompts, responses, or personal identifiers in
  telemetry payloads

## Rules

- application-facing callers depend on a small telemetry port only
- telemetry event names must use a stable product namespace such as
  `<area>.<object>.<action>` or `<area>.<workflow>.<stage>`
- telemetry properties must be allowlisted by schema or event builder
- telemetry must collect only anonymous operational metadata
- telemetry must never include job names, unit names, comments, command text,
  definition content, file paths, search text, user names, organization names,
  server names, manager names, service names, URLs, credentials, prompts,
  responses, raw server bodies, raw exception messages, or stack traces
- numeric measurements should use coarse buckets unless the exact number is
  explicitly non-sensitive and product-relevant
- error telemetry must use repository-owned error codes or status categories
  instead of raw error messages
- diagnostic telemetry must use anonymous diagnostic categories or rule IDs and
  aggregate counts instead of source text or parameter values
- search telemetry may report result counts, query length buckets, modes, and
  outcomes but must not report the search query or matched unit identity
- performance telemetry may report duration buckets and size buckets but must
  not inspect or emit definition contents
- roadmap capability telemetry must name future event families and privacy
  constraints in durable docs, but runtime events should be introduced only
  with the corresponding approved feature behavior
- semantic comparison, dependency analysis, review support, and AI-assisted
  telemetry may use only anonymous capability, result, safety, provider,
  duration, count, size, and repository-owned error metadata
- AI-assisted telemetry must never include prompts, responses, definition
  content, generated content, provider account identifiers, raw model errors,
  or stack traces
- telemetry failures must not affect user workflows
- desktop and web extension entry points must share the same telemetry
  contract, with Noop fallback when telemetry cannot initialize

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Record telemetry

Scenario: Lifecycle events are submitted through the telemetry port
  Given the extension activates or deactivates
  When telemetry is recorded through the application-facing contract
  Then the lifecycle event is submitted through the adapter
  And SDK-specific types remain outside application and presentation callers

Scenario: Viewer workflow events distinguish start and successful readiness
  Given a table or flow viewer is opened
  When the viewer becomes ready
  Then telemetry can distinguish command invocation from successful readiness
  And only anonymous host, result, and bucketed size metadata is submitted

Scenario: Search telemetry reports failed searches without query text
  Given a user submits a table, flow, or unified search query
  When telemetry is recorded for the search outcome
  Then the event may include query length bucket, result count bucket, mode,
    surface, duration bucket, and result
  And the event does not include the search text or matched unit identity

Scenario: Diagnostic telemetry reports anonymous categories
  Given editor diagnostics are evaluated for a JP1/AJS document
  When telemetry is recorded for diagnostic frequency
  Then the event may include diagnostic category or rule ID and count bucket
  And the event does not include definition text, parameter values, file path,
    unit name, or diagnostic source excerpt

Scenario: Performance telemetry uses buckets
  Given a parse, list build, flow build, export, or render operation completes
  When telemetry is recorded for operation performance
  Then the event may include duration bucket and approved size buckets
  And the event does not include raw content or exact sensitive identifiers

Scenario: Workflow telemetry records safe cancellation or failure
  Given a user starts a workflow such as WebAPI import, navigation, comparison,
    dependency analysis, review support, or AI assistance
  When the workflow completes, fails, is cancelled, or is observably abandoned
  Then telemetry records the workflow stage and anonymous result metadata
  And raw credentials, server details, prompts, responses, file paths, and
    definition contents are not submitted

Scenario: Roadmap capability telemetry is introduced with feature behavior
  Given a roadmap feature such as semantic comparison, dependency analysis,
    review support, or AI assistance is not implemented yet
  When telemetry guidance is documented for that feature family
  Then runtime event constants and emitted events are not added in advance
  And the future feature remains constrained to anonymous operational metadata

Scenario: Telemetry payload remains privacy-conscious
  Given telemetry event payload properties
  When an event is submitted
  Then file content, file paths, search text, names, commands, credentials,
    prompts, responses, and personal identifiers are not added
```

## Acceptance Notes

- desktop and web entry points share the same telemetry contract
- telemetry should answer product-improvement questions, including feature
  usage, rarely used features, abandoned workflows, failed searches, slow
  operations, roadmap prioritization, and frequent diagnostics
- telemetry should remain optional and continue to respect VS Code telemetry
  settings through the telemetry SDK behavior

## Risks Or Edge Cases

- browser execution still depends on the current telemetry SDK package behavior
- lifecycle cleanup must continue to dispose the telemetry adapter correctly
- overly broad telemetry can create noisy data unless each event answers a
  named product question
- abandonment detection can be unreliable unless the observable workflow state
  is clearly defined
- diagnostic messages might become unsafe identifiers if future rules include
  raw values, so stable rule IDs or categories are preferred
