# TRACEABILITY: import-definition-via-webapi

## Purpose

Record the JP1/AJS3 version 13 API manual sections that constrain the first
read-only WebAPI import endpoint.

Normative source:

- JP1 Version 13 JP1/Automatic Job Management System 3 Command Reference,
  manual 3021-3-L49-20(E), Part 3 API
  (<https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/INDEX.HTM>)

## First Endpoint Decision

The first OpenAPI endpoint should model the unit list acquisition API:

- manual section: 7.1.1 Unit list acquisition API
- API ID in component list: SC-009
- method and resource:
  `GET /ajs/api/v1/objects/statuses?{query}`
- product purpose:
  acquire information about job groups, jobnets, and jobs for a specified unit
  or units under it
- read-only fit:
  the endpoint returns status-monitoring resources and does not register,
  change, or delete JP1/AJS3 data

Use this endpoint as the initial import surface because it can load a scoped
server-side unit tree and includes unit definition information that downstream
list, flow, CSV, diagnostics, hover, or unit-definition features can normalize
without first requiring execution-changing operations.

The unit information acquisition API is adjacent follow-up scope:

- manual section: 7.1.2 Unit information acquisition API
- method and resource:
  `GET /ajs/api/v1/objects/statuses/{unitName}:{execID}?{query}`
- reason to defer:
  it requires a specific execution ID and is better suited to detail retrieval
  after a unit-list import has established available units and generations

## Manual Section Matrix

- API workflow:
  section 6.1 Workflow for using an API.
  Requests pass through JP1/AJS3 - Web Console and JP1/AJS3 - Manager;
  authentication occurs on each request.
- Authentication:
  section 6.2 Authentication when using an API.
  Desktop infrastructure must set `X-AJS-Authorization` from a JP1 user and
  password encoded outside domain/application logic.
- Data types:
  section 6.3 Data types usable for an API.
  OpenAPI schemas should model booleans, integers, strings, and ISO 8601
  date-times as documented.
- Request format:
  section 6.4 Request format.
  Generated mocks and adapters must preserve `/ajs/api/v1`, required headers,
  query parameters, and UTF-8 JSON handling.
- Response format:
  section 6.5 Response format.
  Structured success and error DTOs must follow the manual response patterns
  before repository-specific mapping.
- API list:
  section 6.6.1 List of API configuration components.
  The first endpoint maps to Unit list acquisition, SC-009; write/update APIs
  remain out of scope.
- Usage notes:
  section 6.7 Notes on using APIs.
  Transport handling must leave room for SSL, permissions, argument-byte
  limits, invalid request status codes, and manager connection restrictions.
- Unit list endpoint:
  section 7.1.1 Unit list acquisition API.
  First OpenAPI operation should cover request path, query parameters, status
  codes, response body, and the 1,000-result `all` behavior.
- Status resource:
  section 7.2.1 Resource for status monitoring.
  Import normalization should treat each returned resource as a container for
  definition, status, and release information.
- Unit definition object:
  section 7.3.1 Unit definition information object.
  The definition object is the primary source for normalized server-side unit
  identity and definition attributes.
- Constants:
  section 7.4.2 Constants used by the unit list acquisition API.
  Query enums such as `LowerType`, `SearchTargetType`, `MatchMethods`,
  `UnitType`, `GenerationType`, and status filters must come from the manual.
- Unit information appendix:
  Appendix D Unit Information that Can Be Acquired by the API.
  The OpenAPI schema should include only members documented as acquirable for
  the selected API/resource.

## Initial OpenAPI Requirements

The first OpenAPI source should define:

- server-relative path:
  `/ajs/api/v1/objects/statuses`
- method:
  `GET`
- required query parameters:
  `mode`, `manager`, `serviceName`, `location`
- strongly recommended first-slice traversal value:
  `searchLowerUnits=YES`
- strongly recommended first-slice query value:
  `searchTarget=DEFINITION`
- optional query parameters from section 7.1.1 only when needed for scoped
  import tests
- required API request header:
  `X-AJS-Authorization`
- optional request header:
  `Accept-Language`
- success response:
  `200` with `statuses` and `all`
- documented error responses:
  `400`, `401`, `403`, `404`, `409`, `412`, `500`

The first implementation should request definition-only data by default. Status
and release fields may remain in the response schema because the manual returns
status-monitoring resources, but application normalization should not require
status or release data for the initial read-only definition import.

## DTO And Error Mapping Notes

- `401` maps to an authentication failure.
- `403` maps to an authorization failure.
- `404` maps to unavailable resource or inaccessible resource.
- `412` maps to Web Console unavailable.
- `400`, `409`, and `500` map to structured recoverable import errors with
  manual status detail preserved where safe.
- Network failures, timeouts, cancellation, unsupported web-host access, and
  malformed responses are repository-owned error categories layered around the
  manual HTTP responses.
- Error messages must not expose credentials, raw authorization headers, server
  secrets, imported definition content, or local file paths.

## Compatibility Notes

- Desktop support may use VS Code-hosted credential retrieval and an
  infrastructure HTTP adapter.
- Shared domain and application DTOs must not import `vscode`, Node transport
  modules, generated OpenAPI clients, or webview code.
- Browser-hosted execution remains unsupported for this first slice unless a
  browser-safe transport and authentication model is specified and tested.
- Generated mocks and stubs must stay outside domain/application code and be
  reproducible from the OpenAPI source.

## Open Questions

- Confirm with a real JP1/AJS3 environment whether `searchTarget=DEFINITION`
  returns enough definition attributes for the extension's normalized model.
- Confirm whether the returned `parameters` member is sufficient for current
  parser-equivalent parameter interpretation, or whether additional API calls
  are needed for full unit-definition parity.
- Decide whether the first command asks for `searchLowerUnits` explicitly or
  defaults to all units under the selected location for beta.
