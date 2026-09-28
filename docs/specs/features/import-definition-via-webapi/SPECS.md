# SPECS: import-definition-via-webapi

## Purpose

Provide a read-only JP1/AJS WebAPI import path for server-side definition data.

## Source

- Use case: `docs/requirements/use-cases/uc-import-ajs-definition-via-webapi.md`
- Normative reference: JP1 Version 13 JP1/Automatic Job Management System 3
  Command Reference, manual 3021-3-L49-20(E), Part 3 API
  (<https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/INDEX.HTM>)

## Requirements and acceptance

- The supported path is read-only. Do not add write or update operations.
- Keep command labels, CHANGELOG entries, and user documentation marked beta
  until real JP1/AJS3 environment verification and enough user feedback
  support a beta-exit decision.
- Expose the first import through a VS Code command and an input flow outside
  webview code, then hand off to the application use case
  `ImportAjsDefinitionViaWebApi`.
- Keep request, authentication, transport, timeout, and response decoding in
  infrastructure. Application boundaries use request/result DTOs, normalized
  definitions, and structured errors; downstream consumers do not depend on
  raw transport objects.
- Follow the version 13 manual before adding repository-specific assumptions.
  Add OpenAPI endpoint by endpoint as a derived, testable subset, not as a
  replacement for the manual. Keep its source under
  `docs/specs/features/import-definition-via-webapi/openapi/` and cite manual
  sections.
- Generate reproducible mock servers and client/test stubs from OpenAPI;
  regenerate rather than hand-edit generated artifacts, and keep stubs at
  infrastructure or test boundaries. Mocks cover success,
  authentication/authorization failure, timeout, unexpected status, and
  malformed-response cases. Application use cases consume repository-owned
  ports and DTOs.
- Normalize WebAPI data so it can converge with local-file flows where
  practical. Prefer a WebAPI-to-normalized-definition seam; use the local
  parser only when the API returns text equivalent to local AJS input.
- Report authentication, connectivity, unsupported-host, and malformed
  response failures as recoverable import errors. Do not expose credentials,
  tokens, server secrets, imported definition content, or local file paths in
  errors. Distinguish cancellation, authentication and authorization failures,
  network and timeout failures, unsupported hosts, unexpected status codes,
  and response-shape mismatches.

## Compatibility

- Desktop infrastructure may use VS Code secret storage and desktop-safe HTTP
  transport.
- Shared domain and application code must not import VS Code, Node-only APIs,
  generated clients, webview code, or WebAPI transport types.
- Web execution must not assume Node networking, filesystem, process, proxy,
  certificate, or credential-store APIs. Keep import unsupported until a
  browser-safe transport and authentication model are explicitly implemented
  and tested.

## Beta exit

Keep beta behavior read-only and endpoint-limited. Remove beta labelling only
after manual traceability, reproducible OpenAPI-generated artifacts, automated
success and failure-path coverage, real-environment smoke evidence, and enough
user feedback are recorded. Beta also requires structured errors and explicit
desktop/web behavior.

## Non-goals

- Write or update operations against the JP1/AJS WebAPI.
- Assuming server definitions match local parser input byte for byte.

## Open questions

- Does `searchTarget=DEFINITION` return enough attributes for the normalized
  model in a real JP1/AJS3 environment?
- Is the returned `parameters` member sufficient for current parser-equivalent
  interpretation, or are more API calls needed for unit-definition parity?
- Should the first command ask for `searchLowerUnits`, or default to all units
  under the selected location during beta?
