# Requirements Traceability: Telemetry Improvement

## Purpose

Map telemetry improvement requirements to feature requirements, implementation
slices, and validation plans.

## Mapping

### Narrow Telemetry Contract

- Use Case Or Source: `uc-record-telemetry.md`
- Requirement:
  record telemetry through a narrow contract without SDK leakage.
- SPECS Section:
  Architecture.
- Implementation Slice:
  Slice 1: Telemetry Schema And Privacy Guardrails.
- Test File Or Validation Plan:
  telemetry builder tests, adapter compatibility tests, `createTelemetry`
  tests, lifecycle tests, `rtk pnpm test`, and `rtk pnpm run qlty`.
- Validation Result:
  `telemetryEvent.test.ts`, `telemetryBuckets.test.ts`,
  `createTelemetry.test.ts`, and `extensionLifecycle.test.ts` pass through
  `rtk pnpm test`; `rtk pnpm run qlty`, `rtk pnpm run test:web`, and
  `rtk pnpm run build` pass.

### Anonymous Operational Metadata

- Use Case Or Source: `uc-record-telemetry.md`
- Requirement:
  collect only anonymous operational metadata.
- SPECS Section:
  Requirements, Acceptance Criteria.
- Implementation Slice:
  Slice 1: Telemetry Schema And Privacy Guardrails.
- Test File Or Validation Plan:
  allowlist tests, bucket helper tests, forbidden content tests, README review,
  `rtk pnpm test`, and `rtk pnpm run qlty`.
- Validation Result:
  allowlist, forbidden-property omission, duration bucket, count bucket, and
  HTTP status category tests pass through `rtk pnpm test`; README does not
  change in Slice 1 because runtime telemetry collection is not broadened yet.

### Lifecycle And Viewer Readiness

- Use Case Or Source:
  product request and `uc-record-telemetry.md`.
- Requirement:
  distinguish command invocation from successful viewer readiness and close.
- SPECS Section:
  Viewer Usage, Extension Lifecycle.
- Implementation Slice:
  Slice 2: Lifecycle And Viewer Readiness Telemetry.
- Test File Or Validation Plan:
  lifecycle, open preview command, viewer factory, viewer mediator, and viewer
  wiring tests; `rtk pnpm test`; `rtk pnpm run test:web`; `rtk pnpm run qlty`.
- Validation Result:
  `extensionLifecycle.test.ts`, `openPreviewCommand.test.ts`,
  `viewerFactory.test.ts`, `viewerMessageRouting.test.ts`,
  `viewerWiring.test.ts`, and `viewerTelemetry.test.ts` pass through
  `rtk pnpm test`; `rtk pnpm run test:web`, `rtk pnpm run qlty`, and
  `rtk pnpm run build` pass. Production build reports existing webpack bundle
  size warnings. README telemetry wording and CHANGELOG are updated because
  telemetry policy now covers anonymous lifecycle and viewer metadata.

### WebAPI Import Workflow

- Use Case Or Source:
  product request and `uc-import-ajs-definition-via-webapi.md`.
- Requirement:
  determine where the beta import workflow succeeds, fails, or is cancelled
  without collecting environment or credential details.
- SPECS Section:
  WebAPI Import.
- Implementation Slice:
  Slice 3: WebAPI Import Workflow Telemetry.
- Test File Or Validation Plan:
  WebAPI import command tests, WebAPI import wiring tests, telemetry schema
  tests, `rtk pnpm test`, and `rtk pnpm run qlty`.
- Validation Result:
  `importAjsDefinitionViaWebApiCommand.test.ts`,
  `webapiImportWiring.test.ts`, `webApiImportTelemetry.test.ts`, and telemetry
  schema/bucket tests pass through `rtk pnpm test`; `rtk pnpm run test:web`,
  `rtk pnpm run qlty`, and `rtk pnpm run build` pass. Production build reports
  existing webpack bundle size warnings. README telemetry wording and
  CHANGELOG are updated because telemetry policy now covers anonymous WebAPI
  import workflow metadata.

### Viewer Feature Usage

- Use Case Or Source:
  product request, `uc-export-unit-list-csv.md`,
  `uc-navigate-between-unit-list-and-flow-graph.md`,
  `uc-show-unit-definition.md`, and viewer build use cases.
- Requirement:
  determine which table and flow viewer actions are used or rarely used.
- SPECS Section:
  Viewer Actions.
- Implementation Slice:
  Slice 4: Viewer Action Telemetry.
- Test File Or Validation Plan:
  report webview operation, viewer message routing, viewer factory,
  navigation, table, flow controller, web smoke, and telemetry tests.

### Search Failure

- Use Case Or Source:
  product request and `uc-search-domain-unification.md`.
- Requirement:
  determine which searches fail without collecting query text.
- SPECS Section:
  Search.
- Implementation Slice:
  Slice 5: Search Outcome Telemetry.
- Test File Or Validation Plan:
  table search, flow search, header search, telemetry, desktop, and web tests.

### Diagnostic Frequency

- Use Case Or Source:
  product request and `uc-provide-editor-feedback.md`.
- Requirement:
  determine frequent diagnostics without collecting source text.
- SPECS Section:
  Diagnostics And Editor Feedback.
- Implementation Slice:
  Slice 6: Diagnostics And Hover Telemetry.
- Test File Or Validation Plan:
  syntax diagnostics tests if rule IDs are added, hover provider tests,
  diagnostics adapter tests, telemetry tests, desktop tests, and web tests when
  shared editor feedback wiring changes.

### Slow Operations

- Use Case Or Source:
  product request.
- Requirement:
  determine slow operations with safe duration and size buckets.
- SPECS Section:
  Performance.
- Implementation Slice:
  Slice 7: Performance Telemetry.
- Test File Or Validation Plan:
  bucket helper tests, injected-clock timing tests, viewer/application event
  tests, desktop tests, web tests, and qlty.

### Roadmap Capability Readiness

- Use Case Or Source:
  product request and roadmap.
- Requirement:
  support unified search, semantic comparison, dependency analysis, review
  support, and AI-assisted features.
- SPECS Section:
  Planned Roadmap Capabilities.
- Implementation Slice:
  Slice 8: Roadmap Telemetry Readiness.
- Test File Or Validation Plan:
  docs validation with `rtk pnpm run lint:md` and `rtk pnpm run qlty`; schema
  tests are out of scope unless future runtime schema reservations are approved
  in another slice.

### Forbidden Content

- Use Case Or Source:
  privacy requirements.
- Requirement:
  forbid names, paths, content, commands, credentials, prompts, responses, raw
  errors, and server identifiers.
- SPECS Section:
  Requirements, Non-Goals.
- Implementation Slice:
  Slices 1 through 8.
- Test File Or Validation Plan:
  privacy guardrail tests, per-slice event tests, docs review, and code review
  checklist for every approved slice.

## Coverage

- Covered:
  lifecycle, viewers, CSV export, navigation, search, diagnostics, hover, unit
  definition, WebAPI import, performance, error telemetry, and planned roadmap
  capabilities.
- Gaps:
  existing dashboard compatibility, exact bucket boundaries, diagnostic rule ID
  design, and reliable abandonment detection must be resolved or explicitly
  accepted during slice implementation.

## Notes

- The feature must preserve existing extension behavior and privacy boundaries
  while adding product-improvement telemetry.
- Traceability should be refined when implementation reveals a changed slice
  boundary, new production-readiness risk, or durable use-case rule.
