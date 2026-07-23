# Traceability: Complete WebAPI Infrastructure Boundaries

## Purpose

Map the WebAPI import use case, feature requirements, Slice 1, and validation.
Endpoint behavior and real-environment evidence remain owned by
`import-definition-via-webapi`.

| Use Case    | Requirement | `SPECS.md` | Slice | Validation |
| ----------- | ----------- | ---------- | ----- | ---------- |
| UC1         | R1          | SP1        | S1    | V1         |
| UC1 / B1    | R2          | SP1        | S1    | V2         |
| UC1 / B3    | R3          | SP1        | S1    | V3         |
| UC1 / B2    | R4          | SP1        | S1    | V4         |
| UC1         | R5          | SP1        | S1    | V5         |
| UC1 / B1-B3 | R6          | SP2        | S1    | V6         |
| UC1 / B1-B3 | R7          | SP2        | S1    | V7         |

## Use-Case Map

- UC1: `docs/requirements/use-cases/` followed by
  `uc-import-ajs-definition-via-webapi.md`.
- B1: `Behavioral Scenarios`, Read-only import returns consumable definition
  data.
- B2: `Behavioral Scenarios`, Unsupported browser host reports a stable error.
- B3: `Behavioral Scenarios`, Authentication or transport failure is
  structured.

## Requirement Map

- R1: transport, authentication, endpoint details, and raw responses stay
  outside application and presentation.
- R2: application owns import coordination, its port, host-neutral DTOs, and
  structured repository errors; it sees only an opaque credential reference.
- R3: infrastructure owns SC-009 request construction, credential-reference
  derivation/persistence/resolution, response validation, error mapping,
  warnings, and DTO conversion.
- R4: bootstrap composes one import capability and selects supported desktop
  execution or the existing unsupported-web capability before prompts.
- R5: presentation collects input and presents repository-owned results without
  transport requests, credential-reference rules/storage, adapter selection, or
  raw responses.
- R6: preserve read-only beta scope, privacy, host availability,
  response/error semantics, telemetry, and downstream isolation.
- R7: preserve `engines.vscode: ^1.75.0` and keep shared web paths free of new
  Node-only or unavailable VS Code APIs.

## Specification Map

- SP1: `Requirements`, `Architecture`, and `Acceptance Criteria`.
- SP2: `Compatibility`, `Acceptance Criteria`, and `Non-Goals`.

## Slice Map

- S1: Slice 1, Establish the host-neutral WebAPI import boundary.

## Validation Map

- V1: `importAjsDefinitionViaWebApi.test.ts`, `webapiImportBoundary.test.ts`,
  and focused architecture dependency tests.
- V2: application tests, adapter success mapping, command success behavior,
  generated-artifact tests, and TypeScript compilation.
- V3: adapter and credential-store tests, safe error/transport tests, OpenAPI
  generated-artifact tests, and `rtk pnpm run openapi:check`.
- V4: command and wiring tests, extension dependency/subscription tests, and
  desktop/web host runs proving unsupported web behavior before prompts.
- V5: command and boundary tests proving no transport-shaped request,
  credential-reference derivation, credential-store call, concrete adapter, or
  raw response reaches presentation.
- V6: command, adapter, telemetry, privacy, boundary, malformed-response,
  desktop/web, build, and qlty validation, including characterization of the
  existing credential-store write rejection.
- V7: `packageManifest.test.ts`, desktop/web compilation and tests, build, and
  boundary validation for browser-safe imports.

## Ownership Boundary

- This feature owns dependency direction, port/adapter contracts, credential
  seam placement, and bootstrap composition only.
- `import-definition-via-webapi` continues to own the normative manual mapping,
  SC-009 endpoint/beta scope, real-environment smoke evidence, user feedback,
  and beta-exit decision.
- A required change to endpoint scope, authentication behavior, credential
  format/policy, browser availability, generated OpenAPI artifacts, minimum
  VS Code version, or user-visible result semantics invalidates this map and
  requires re-planning.

## Implementation Evidence

- S1 implementation status: implemented and reviewed; human completion
  approval pending.
- V1: application and focused WebAPI boundary tests pass in the desktop suite.
- V2: application use-case, adapter success mapping, command success behavior,
  generated-artifact tests, and TypeScript compilation pass.
- V3: adapter status/transport/malformed-response tests and credential-store
  derivation/persistence/rejection tests pass. `rtk pnpm run openapi:check`
  reports the same pre-existing stale generated Prism YAML before and after
  implementation; no generated artifact was changed in S1.
- V4: command/wiring and extension dependency/subscription tests pass; the web
  host test run passes with unsupported-host capability selection before
  prompts.
- V5: presentation boundary tests pass and prohibit transport request details,
  credential-reference derivation, credential-store calls, and raw response
  handling.
- V6: desktop tests, web tests, production build, telemetry/privacy assertions,
  malformed/partial/empty response tests, and qlty pass. Credential-store write
  rejection remains characterized as a propagated rejection.
- V7: `packageManifest.test.ts`, desktop/web compilation and tests, production
  build, and browser-safe boundary validation pass with
  `engines.vscode: ^1.75.0` unchanged.
