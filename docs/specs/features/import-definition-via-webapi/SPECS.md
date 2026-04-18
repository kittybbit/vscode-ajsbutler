# SPECS: import-definition-via-webapi

## Purpose

Add a read-only JP1/AJS WebAPI import path for server-side definition data.

## Origin

- Source use case:
  docs/requirements/use-cases/uc-import-ajs-definition-via-webapi.md

## Acceptance Criteria

- initial scope is explicitly read-only
- application and infrastructure responsibilities are named before
  implementation starts
- downstream consumers do not depend directly on raw WebAPI transport objects
- desktop and web compatibility risks are called out explicitly

## Implementation Notes

- keep network transport and authentication outside domain logic
- design imported-data normalization so local-file and WebAPI-backed flows can
  converge on stable downstream contracts where practical
- document host-specific constraints early because browser-hosted execution may
  not support the same connection model as desktop

## Non-Goals

- write or update operations against the JP1/AJS WebAPI
- hidden assumptions that server-side definitions already match local parser
  input byte-for-byte
