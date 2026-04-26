# PLANS: import-definition-via-webapi

## Objective

Define and deliver the first read-only JP1/AJS WebAPI import slice.

## Scope

- identify the import trigger and application-facing contract
- define infrastructure boundaries for API access
- clarify downstream mapping into existing parsing or normalization flows

## Current Decision

The first user-visible import trigger is a VS Code command contributed by the
extension host. The command collects connection and definition-scope input,
then calls an application use case through an infrastructure-backed WebAPI
adapter. Webview modules remain consumers of imported results only; they do not
own transport, authentication, endpoint selection, or response decoding.

The JP1/AJS3 version 13 Command Reference, manual 3021-3-L49-20(E), Part 3 API
is the normative source for API workflow, authentication, data types, request
format, response format, configuration components, and API usage notes. The
implementation should cite the specific manual section used when DTOs,
transport behavior, authentication behavior, or error mapping are added.

A repository-local OpenAPI contract should be created for the supported subset
of the JP1/AJS3 WebAPI. The contract is derived from the normative manual and
exists to stabilize generated mocks, client/test stubs, and compatibility
tests. It is not an independent source of product truth.

Imported WebAPI data should pass through a dedicated adapter-to-normalized
definition seam before reaching list, flow, definition, diagnostics, hover, or
CSV features. The existing local-file parser may be reused only when the API
returns definition text with the same contract as local AJS definition input.

Desktop support is the first implementation target. Browser-hosted extension
support must either use an explicitly tested browser transport/authentication
adapter or return a structured unsupported-host result without changing shared
domain or application code.

The initial user-facing feature should ship as beta because verification
against real JP1/AJS3 environments is expected to be limited. OpenAPI-generated
mocks and stubs stabilize the boundary, but they do not replace real server
smoke evidence.

## Milestones

1. Confirm WebAPI scope and host constraints
2. Audit the JP1/AJS3 version 13 API reference sections needed by the first
   import endpoint
3. Define the first endpoint in OpenAPI from the recorded traceability
4. Generate mock server and infrastructure/test stubs from the OpenAPI contract
5. Define request, result, normalized-content, and error DTOs
6. Design desktop infrastructure adapters for transport and authentication
7. Add command registration and user input flow outside webview modules
8. Add focused integration and compatibility checks
9. Revisit browser-hosted transport only after the desktop slice is stable
10. Update docs and remaining follow-up tasks

## Traceability Snapshot

The first endpoint audit is recorded in `TRACEABILITY.md`.

The initial OpenAPI operation now models the JP1/AJS3 version 13 unit list
acquisition API in `openapi/jp1-ajs3-webapi.v13.openapi.yaml`:

- manual section: 7.1.1 Unit list acquisition API
- API ID: SC-009
- request:
  `GET /ajs/api/v1/objects/statuses?{query}`
- initial behavior:
  request definition-only import with `searchTarget=DEFINITION`
- response:
  `200` with `statuses` and `all`
- documented error responses:
  `400`, `401`, `403`, `404`, `409`, `412`, `500`

Unit information acquisition remains adjacent follow-up scope because it
requires an execution ID and is better suited to detail retrieval after the
unit-list import identifies units and generations.

## Boundary Sketch

- presentation/extension command: prompts for import inputs and displays
  recoverable errors
- application use case: validates request DTOs, calls the import port, and
  returns normalized definition content or structured errors
- infrastructure adapter: resolves endpoint and credentials, performs WebAPI
  requests, decodes responses, maps transport failures, and never leaks raw
  response objects past the port
- OpenAPI-generated mock/stub layer: supports infrastructure and integration
  tests without becoming an application or domain dependency
- domain/normalization: receives only product concepts that match existing AJS
  document semantics

## OpenAPI Workflow

1. Trace the selected endpoint to JP1/AJS3 version 13 manual sections.
2. Add or update the repository-local OpenAPI source for that endpoint under
   `docs/specs/features/import-definition-via-webapi/openapi/`.
3. Generate mock server and test/infrastructure stubs from the OpenAPI source.
4. Add tests that exercise the application port through generated mocks.
5. Verify generated artifacts are reproducible from the checked-in contract.

## OpenAPI File Placement

- OpenAPI source contracts live under
  `docs/specs/features/import-definition-via-webapi/openapi/`.
- Generated runtime or infrastructure artifacts should live outside `domain`
  and `application`, for example under an infrastructure-specific generated
  path.
- Generated mock, fixture, or test stubs should live under test-oriented paths.
- Generated files must be reproducible from checked-in OpenAPI sources and
  should not be hand-edited.

## Beta Exit Criteria

- supported endpoint behavior is traced to JP1/AJS3 version 13 manual sections
- generated OpenAPI mock/stub artifacts are reproducible
- automated tests cover success, authentication failure, authorization failure,
  timeout, unexpected status, malformed response, and unsupported host behavior
- at least one real JP1/AJS3 environment smoke verification is recorded with
  product version and tested scenario
- release notes or user documentation no longer need to warn that the feature
  has limited real-environment validation

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
