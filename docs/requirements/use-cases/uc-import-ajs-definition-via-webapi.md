# UC: Import AJS Definition Via WebAPI

## Goal

Load JP1/AJS definition information from a server through the JP1/AJS WebAPI so
the extension is not limited to local definition files.

## Trigger

- the user requests server-side JP1/AJS definition data
- the application needs to load a definition source exposed by the JP1/AJS
  WebAPI

## Inputs

- target server or connection context
- API request parameters needed to identify the definition scope to load
- authentication context required by the JP1/AJS WebAPI

## Outputs

- read-only definition data that downstream parsing, normalization, list, or
  flow features can consume

## Rules

- initial scope is read-only import only
- WebAPI transport, authentication, and endpoint details must remain behind an
  infrastructure boundary
- imported definition data should be converted to stable application-facing
  structures before presentation-specific handling

## Acceptance Notes

- a user can request server-side definition loading without relying on a local
  exported file as the primary source
- downstream features can consume imported data through explicit application
  contracts instead of direct WebAPI response objects
- desktop and web compatibility implications are documented explicitly for the
  chosen transport approach

## Risks Or Edge Cases

- authentication and network constraints can differ sharply between desktop and
  web hosts
- API response formats may not match the parser's existing local-file input
  shape directly
- read-only import scope can still require careful error handling, timeouts,
  and partial-data reporting
