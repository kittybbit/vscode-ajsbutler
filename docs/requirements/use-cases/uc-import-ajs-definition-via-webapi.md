# UC: Import AJS Definition Via WebAPI

## Goal

Load JP1/AJS definition information from a server through the JP1/AJS WebAPI so
the extension is not limited to local definition files.

## Trigger

- the user runs a read-only import command from VS Code to request server-side
  JP1/AJS definition data
- the application needs to load a definition source exposed by the JP1/AJS
  WebAPI

## Inputs

- target server or connection context
- API request parameters needed to identify the definition scope to load
- authentication reference required by the JP1/AJS WebAPI, resolved by
  infrastructure rather than passed through domain logic

## Outputs

- read-only definition data that downstream parsing, normalization, list, or
  flow features can consume
- structured import errors for cancellation, unsupported host, authentication,
  authorization, network, timeout, unexpected-status, and response-shape
  failures

## Rules

- initial scope is read-only import only
- initial availability is beta until real JP1/AJS3 environment verification and
  enough user feedback are recorded to make beta exit credible
- request construction, authentication, response parsing, and error mapping
  must follow the JP1/AJS3 version 13 API reference unless a documented product
  or host compatibility constraint requires a narrower first slice
- a repository-local OpenAPI contract may define the supported subset for
  generated mocks and stubs, but it must remain traceable to the JP1/AJS3
  version 13 API reference
- WebAPI transport, authentication, and endpoint details must remain behind an
  infrastructure boundary
- imported definition data should be converted to stable application-facing
  structures before presentation-specific handling
- webview modules must not perform WebAPI transport or credential handling
- browser-hosted execution must not rely on Node-only APIs; if a browser-safe
  adapter is not available, the import result must report unsupported host
- server responses must not be exposed directly to list, flow, CSV,
  diagnostics, hover, or unit-definition presentation code

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Import AJS definition via WebAPI

Scenario: Read-only import returns consumable definition data
  Given a supported JP1/AJS WebAPI connection context
  And request parameters for a definition scope
  When read-only import is requested
  Then definition data is returned through application-facing structures

Scenario: Unsupported browser host reports a stable error
  Given browser-hosted execution without a browser-safe WebAPI adapter
  When read-only import is requested
  Then the import result reports unsupported host

Scenario: Authentication or transport failure is structured
  Given a JP1/AJS WebAPI request that fails authentication or transport
  When read-only import is requested
  Then a structured import error is returned without leaking secrets
```

## Acceptance Notes

- a user can request server-side definition loading without relying on a local
  exported file as the primary source
- desktop and web compatibility implications are documented explicitly for the
  chosen transport approach
- generated mocks or stubs can exercise supported success and failure paths
  without requiring a live JP1/AJS3 server for every test run
- beta labeling makes limited real-environment validation and limited field
  feedback visible to users

## Risks Or Edge Cases

- authentication and network constraints can differ sharply between desktop and
  web hosts
- API response formats may not match the parser's existing local-file input
  shape directly
- read-only import scope can still require careful error handling, timeouts,
  and partial-data reporting
- user-facing errors must not leak credentials, raw tokens, file content,
  definition content, or server-provided secrets
- generated mocks can hide server-specific behavior differences, so beta exit
  requires recorded smoke verification against a real JP1/AJS3 environment and
  user feedback from beta usage
