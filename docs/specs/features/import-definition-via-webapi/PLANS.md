# PLANS: import-definition-via-webapi

## Objective

Define and deliver the first read-only JP1/AJS WebAPI import slice.

## Scope

- identify the import trigger and application-facing contract
- define infrastructure boundaries for API access
- clarify downstream mapping into existing parsing or normalization flows

## Milestones

1. Confirm WebAPI scope and host constraints
2. Define import DTOs or equivalent application-facing results
3. Design infrastructure adapters for transport and authentication
4. Add focused integration and compatibility checks
5. Update docs and remaining follow-up tasks

## Validation

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
