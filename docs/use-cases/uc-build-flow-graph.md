# UC: Build Flow Graph

## Goal

Transform normalized AJS relationships into a UI-independent graph DTO.

## Trigger

The user opens or refreshes a flow-oriented view of a parsed AJS definition.

## Inputs

- normalized AJS model

## Outputs

- graph DTO with nodes and edges
- no XyFlow-specific types in use case output

## Rules

- graph construction logic must be testable without webview runtime
- layout library concerns stay outside the use case when possible

## Acceptance Notes

- the same normalized model produces deterministic graph DTO content
- desktop and web presentation layers can consume the output without parser-specific coupling

## Risks Or Edge Cases

- cyclic or malformed relationships must not force UI-library-specific workarounds into the use case
