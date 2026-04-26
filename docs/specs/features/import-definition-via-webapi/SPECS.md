# SPECS: import-definition-via-webapi

## Purpose

Add a read-only JP1/AJS WebAPI import path for server-side definition data.

## Origin

- Source use case:
  docs/requirements/use-cases/uc-import-ajs-definition-via-webapi.md
- Normative API reference:
  JP1 Version 13 JP1/Automatic Job Management System 3 Command Reference,
  manual 3021-3-L49-20(E), Part 3 API
  (<https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/INDEX.HTM>)

## Acceptance Criteria

- initial scope is explicitly read-only
- initial user-facing availability is beta until real JP1/AJS3 environment
  verification is sufficient
- application and infrastructure responsibilities are named before
  implementation starts
- downstream consumers do not depend directly on raw WebAPI transport objects
- desktop and web compatibility risks are called out explicitly
- the first user-visible trigger is a VS Code command that opens an import
  input flow outside webview presentation code
- authentication failures, connectivity failures, unsupported web-host access,
  and malformed responses are reported as recoverable import errors
- the first implemented endpoint has a repository-local OpenAPI contract that
  traces back to the JP1/AJS3 version 13 API reference
- mock server and client/test stubs are generated from the OpenAPI contract for
  stable integration and compatibility testing

## Implementation Notes

- implement request, authentication, response, and error handling according to
  the JP1/AJS3 version 13 API chapters before adding repository-local
  assumptions
- present the feature as beta in command labels, release notes, or user-facing
  documentation until the beta exit criteria are met
- use OpenAPI as a derived, testable contract for the subset of JP1/AJS3 WebAPI
  endpoints this extension supports; do not treat it as a replacement for the
  normative manual
- keep generated mock/stub code out of domain logic and avoid hand-editing
  generated artifacts
- keep network transport and authentication outside domain logic
- design imported-data normalization so local-file and WebAPI-backed flows can
  converge on stable downstream contracts where practical
- document host-specific constraints early because browser-hosted execution may
  not support the same connection model as desktop
- expose the first import path through an extension command, then hand off to
  an application use case such as `ImportAjsDefinitionViaWebApi`
- keep endpoint construction, credential retrieval, request execution, timeout
  handling, and response decoding in infrastructure adapters
- keep the application boundary focused on request DTOs, read-only import
  results, normalized definition content, and structured errors
- prefer a separate WebAPI response-to-normalized-definition seam over feeding
  raw WebAPI response objects directly into the existing local-file parser; use
  the existing parser only if the API returns definition text that is explicitly
  equivalent to local AJS definition input

## Host Constraints

- desktop extension execution may use VS Code secret storage and desktop-safe
  HTTP transport adapters behind infrastructure
- web extension execution must not assume Node-only networking, filesystem,
  process, proxy, certificate, or credential-store APIs
- web-host import should be disabled or reported as unsupported until a browser
  transport and authentication model are explicitly implemented and tested
- shared domain and application modules must stay free of direct `vscode`,
  Node-only, or WebAPI transport imports

## Error And Authentication Policy

- credentials are configuration or secret-storage concerns, not DTO fields
  passed into domain logic
- error DTOs should distinguish cancellation, authentication failure,
  authorization failure, network or timeout failure, unsupported host,
  unexpected status, and response-shape mismatch
- error messages shown to users must avoid echoing credentials, raw tokens,
  server-provided secrets, or imported definition content

## OpenAPI And Test Stability

- add OpenAPI coverage endpoint by endpoint, starting with the first read-only
  import endpoint rather than attempting the whole JP1/AJS3 API surface
- keep OpenAPI source contracts under
  `docs/specs/features/import-definition-via-webapi/openapi/`
- record manual section references in the OpenAPI description, adjacent
  traceability notes, or both
- generate a mock server from the OpenAPI contract so extension-side tests can
  cover success, authentication failure, authorization failure, timeout,
  unexpected status, and malformed-response paths without a live JP1/AJS3
  server
- generate client or response stubs only at infrastructure/test boundaries;
  application use cases should depend on repository-owned ports and DTOs
- add validation that generated artifacts are reproducible from the checked-in
  OpenAPI source

## Beta Availability

- provide the read-only WebAPI import path as beta while real JP1/AJS3
  environment verification remains limited
- beta scope still requires automated tests through generated mocks/stubs,
  structured error handling, and explicit desktop/web compatibility behavior
- do not advertise update/write scenarios or broad endpoint coverage during
  beta
- exit beta only after the first supported import path has documented manual
  traceability, reproducible OpenAPI-generated artifacts, automated success and
  failure-path coverage, and recorded smoke verification against a real JP1/AJS3
  environment

## Non-Goals

- write or update operations against the JP1/AJS WebAPI
- hidden assumptions that server-side definitions already match local parser
  input byte-for-byte
