# OpenAPI Contract: import-definition-via-webapi

## Purpose

This directory contains repository-local OpenAPI contracts for the supported
subset of the JP1/AJS3 WebAPI used by the read-only import feature.

The OpenAPI files are derived from the JP1 Version 13 JP1/Automatic Job
Management System 3 Command Reference, manual 3021-3-L49-20(E), Part 3 API.
They are testable contracts for this repository, not replacements for the
normative product manual.

## Layout

- `jp1-ajs3-webapi.v13.openapi.yaml`: source contract for supported JP1/AJS3
  version 13 WebAPI endpoints

## Generation Policy

- Hand-edit OpenAPI source files in this directory.
- Do not hand-edit generated mock, client, or stub artifacts.
- Keep generated runtime or infrastructure artifacts outside `domain` and
  `application` modules.
- Prefer generated test artifacts under a test or fixture path, and generated
  infrastructure artifacts under an infrastructure-specific generated path.
- Add or update generation scripts when generated artifacts are introduced so
  the checked-in outputs can be reproduced from the OpenAPI source.

## Traceability

Each supported endpoint should record the JP1/AJS3 manual section used for:

- API workflow and authentication
- request path, method, headers, parameters, and body
- response status, headers, and body
- error response mapping
- API usage notes and host constraints

The first endpoint audit is recorded in
`docs/specs/features/import-definition-via-webapi/TRACEABILITY.md`.
