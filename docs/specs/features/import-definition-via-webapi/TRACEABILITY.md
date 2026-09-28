# TRACEABILITY: import-definition-via-webapi

This record maps the initial read-only endpoint to the JP1/AJS3 version 13
manual sections that constrain its contract.

Normative source: JP1 Version 13 JP1/Automatic Job Management System 3 Command
Reference, manual 3021-3-L49-20(E), Part 3 API
(<https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/INDEX.HTM>).

## First endpoint

- Manual section 7.1.1, Unit list acquisition API; component ID `SC-009`.
- `GET /ajs/api/v1/objects/statuses?{query}` returns job group, jobnet, and job
  information for a specified unit and its descendants. It is read-only and
  can provide definition data for downstream list, flow, CSV, diagnostics,
  hover, and unit-definition features.
- Defer section 7.1.2, Unit information acquisition API,
  `GET /ajs/api/v1/objects/statuses/{unitName}:{execID}?{query}`; it needs an
  execution ID and is suited to detail retrieval after unit-list import.

## Manual-to-contract mapping

<!-- markdownlint-disable MD013 MD060 -->

| Manual section               | Contract constraint                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 6.1 API workflow             | Requests pass through JP1/AJS3 Web Console and Manager; authenticate each request.                                          |
| 6.2 Authentication           | Infrastructure sets `X-AJS-Authorization` from the JP1 user and password; keep credentials out of domain/application logic. |
| 6.3 Data types               | Model booleans, integers, strings, and ISO 8601 date-times as documented.                                                   |
| 6.4 Request format           | Preserve `/ajs/api/v1`, headers, query parameters, and UTF-8 JSON.                                                          |
| 6.5 Response format          | Follow the manual's success and structured error response patterns before repository-specific mapping.                      |
| 6.6.1 API component list     | Map the first endpoint to unit-list acquisition `SC-009`; write/update APIs stay out of scope.                              |
| 6.7 Usage notes              | Account for SSL, permissions, argument-byte limits, invalid-request statuses, and Manager connection restrictions.          |
| 7.1.1 Unit list acquisition  | Cover path, query, statuses, response body, and the `all` limit of 1,000 results.                                           |
| 7.2.1 Status resource        | Treat each result as a container for definition, status, and release information.                                           |
| 7.3.1 Unit definition object | Use the definition object for normalized unit identity and definition attributes.                                           |
| 7.4.2 API constants          | Source `LowerType`, `SearchTargetType`, `MatchMethods`, `UnitType`, `GenerationType`, and status filters from the manual.   |
| Appendix D                   | Include only unit-information members documented as available from this API/resource.                                       |

<!-- markdownlint-enable MD013 MD060 -->

## Initial request and response

- Required query: `mode`, `manager`, `serviceName`, `location`.
- Recommended defaults: `searchLowerUnits=YES` and
  `searchTarget=DEFINITION`; use optional section 7.1.1 parameters only for
  scoped import tests.
- Required header: `X-AJS-Authorization`; optional header: `Accept-Language`.
- Success: `200` with `statuses` and `all`. Request definition-only data by
  default. Status and release fields may stay in the schema, but application
  normalization must not require them.
- Documented errors: `400`, `401`, `403`, `404`, `409`, `412`, `500`.

## Error mapping

| Manual response     | Import error                                       |
| ------------------- | -------------------------------------------------- |
| `401`               | Authentication failure                             |
| `403`               | Authorization failure                              |
| `404`               | Unavailable or inaccessible resource               |
| `412`               | Web Console unavailable                            |
| `400`, `409`, `500` | Recoverable error; keep safe manual status details |

Network failures, timeouts, cancellation, unsupported web-host access, and
malformed responses are repository-owned error categories. User-facing errors
must not expose credentials, authorization headers, server secrets, imported
definition content, or local file paths.

## Compatibility

- Desktop may use VS Code credential retrieval and an infrastructure HTTP
  adapter.
- Shared domain/application DTOs must not import `vscode`, Node transport
  modules, generated OpenAPI clients, or webview code.
- Browser-hosted import stays unsupported until browser-safe transport and
  authentication are implemented and tested.
- Generated mocks and stubs stay outside domain/application code and remain
  reproducible from OpenAPI source.
