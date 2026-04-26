# TASKS: import-definition-via-webapi

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Record read-only JP1/AJS WebAPI import as a planned feature slice
- [x] Identify the first user-visible import trigger
- [x] Document desktop and web host constraints for WebAPI access
- [x] Decide whether imported data feeds the existing parser directly or
      requires a separate normalization seam
- [x] Define authentication and error-reporting expectations
- [x] Record the JP1/AJS3 version 13 API reference as the normative source for
      implementation
- [x] Record OpenAPI-generated mocks and stubs as the stability strategy for
      the first import implementation
- [x] Define the repository-local OpenAPI source placement
- [x] Record beta availability until real JP1/AJS3 environment verification is
      sufficient
- [x] Audit the JP1/AJS3 version 13 API reference sections needed by the first
      import endpoint and record traceability before implementation
- [x] Define the first supported read-only import endpoint in a repository-local
      OpenAPI contract under
      `docs/specs/features/import-definition-via-webapi/openapi/`
- [x] Generate a mock server and infrastructure/test stubs from the OpenAPI
      contract
- [x] Add reproducibility checks for generated OpenAPI artifacts
- [x] Define request, result, normalized-content, and error DTOs for the first
      desktop read-only import slice

## Follow-up

- [ ] Implement the extension command and desktop infrastructure adapter behind
      the application import port
- [ ] Add compatibility tests that keep shared domain/application paths free of
      WebAPI transport, Node-only, and webview dependencies
- [ ] Add beta labeling to the command, release notes, or user-facing docs when
      the first implementation ships
- [ ] Record real JP1/AJS3 environment smoke verification before exiting beta

## Notes

- 2026-04-18: scope is intentionally limited to loading server-side
  definitions; update and save scenarios are deferred.
- 2026-04-26: the first user-visible trigger is a VS Code command that starts a
  read-only import input flow. Desktop is the first supported host. Web-hosted
  execution must use an explicitly tested browser adapter or return a
  structured unsupported-host result. Raw WebAPI responses should map through a
  dedicated normalization seam unless the API returns local-file-equivalent AJS
  definition text.
- 2026-04-26: API implementation should follow the JP1 Version 13
  JP1/Automatic Job Management System 3 Command Reference, manual
  3021-3-L49-20(E), Part 3 API.
- 2026-04-26: OpenAPI should be used as a repository-local, manual-derived
  contract for supported endpoints so mock servers and infrastructure/test
  stubs can be generated reproducibly.
- 2026-04-26: OpenAPI source contracts live under
  `docs/specs/features/import-definition-via-webapi/openapi/`; generated
  artifacts should live outside domain/application code and must be
  reproducible from the checked-in contracts.
- 2026-04-26: read-only WebAPI import should be offered as beta until real
  JP1/AJS3 environment smoke verification is recorded. Generated mocks/stubs
  stabilize automated tests but do not count as beta-exit evidence by
  themselves.
- 2026-04-26: first-endpoint traceability is recorded in `TRACEABILITY.md`.
  The first OpenAPI endpoint should model the unit list acquisition API
  (`GET /ajs/api/v1/objects/statuses`) with definition-only import as the
  initial application behavior. Unit information acquisition is deferred as
  adjacent detail-retrieval scope.
- 2026-04-26: the first OpenAPI source contract is recorded in
  `openapi/jp1-ajs3-webapi.v13.openapi.yaml`. It covers the unit list
  acquisition API request, success response, documented HTTP error responses,
  and permissive status/release objects for definition-only beta import.
- 2026-04-26: `pnpm run openapi:generate` now generates infrastructure
  WebAPI types, Prism test helpers, and a Prism OpenAPI fixture whose examples
  are derived from `sample/`. `pnpm run openapi:check` verifies that the
  checked-in generated artifacts are reproducible.
- 2026-04-26: application-owned import DTOs and the first import port live in
  `src/application/webapi-import/`. They define desktop definition-only unit
  list requests, normalized imported definition content, and recoverable
  structured errors without depending on generated OpenAPI artifacts,
  VS Code APIs, Node transport, Prism, or webview code.
