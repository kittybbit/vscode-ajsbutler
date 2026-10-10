# Feature Specification: Architecture Test Cohesion

## Purpose

Reduce responsibility concentration in the existing architecture-test
implementation so maintainers can change one established rule family or
collection responsibility without navigating unrelated checks. Preserve the
complete architecture gate and its zero-exception policy.

## Source

- Kind: roadmap feature; slug: `architecture-test-cohesion`.
- User-selected feature in the current conversation.
- [Roadmap](../../roadmap.md#internal-architecture-refactoring-sequence), item 1.
- [Architecture](../../architecture.md) and [SDD policy](../../README.md).
- Entry-condition evidence: at base `cafc9c219dacdc3924c2ca992dedb9038911448d`,
  `src/test/support/architectureDependencyRules.ts` combines source discovery,
  AST extraction, import/re-export resolution, construction analysis, rule
  evaluation, and violation formatting. The suite combines collector fixtures,
  repository rule gates, and Semantic Diff package/host ownership checks.
  Calendar and Explorer changes (`7a01db86`, `97652aa1`) touch these files.
  Their size and distinct existing responsibilities justify considering a
  bounded split, rather than inventing future analysis capabilities.

## Requirements and acceptance

- R1: Separate existing cohesive test responsibilities where demonstrated size
  or change pressure warrants it. Each resulting module must have an identifiable
  existing responsibility; a move alone must not add a new abstraction contract.
- R2: Preserve every existing rule family and repository-specific gate, including
  layer direction, concrete infrastructure, parser/raw-unit and retired-wrapper
  restrictions, host/UI and Node boundaries, telemetry boundaries, factory and
  allocator construction, package ownership, browser globals, cycles, and raw
  parser test access. Add no exceptions or relaxed allowlists.
- R3: Preserve supported dependency syntax, relative/alias resolution,
  re-export and cyclic-resolution behavior, factory recognition, production
  source selection, deterministic ordering, violation identifiers, and messages.
- R4: Retain distinct valid, violation, edge, and compatibility assertions.
  Every moved suite must still be discovered and executed; demonstrate retained
  catalog coverage rather than accepting a smaller passing test set.
- R5: Keep the work confined to architecture-test code/support and feature
  records, plus the user-requested implementation-agent settings in R6.
  Preserve production behavior, dependencies, product/tool configuration,
  desktop/web test infrastructure, and public product contracts.
- R6: Manage the two existing implementation-agent configuration edits with
  this feature: model `gpt-6-luna` to `gpt-6.1-sol` and reasoning effort
  `xhigh` to `medium`. Preserve all other parsed fields and procedure text.

## Decisions and impact

- Semantic owner: repository architecture verification under `src/test`.
  The production layer catalog and dependency policy remain owned by durable
  architecture documentation; this feature does not redesign them.
- Direct candidates: `src/test/support/architectureDependencyRules.ts` and
  `src/test/suite/architectureDependencyRules.test.ts`, plus only the cohesive
  test modules justified by planning. Exact paths and Solution Shape belong
  in the reviewed plan, not this intake.
- Transitive impact: test imports, compiled suite discovery, and existing
  repository gates. No extension command, DTO, parser, adapter, or UI changes.
- Existing TypeScript AST and Mocha capabilities are the relevant mechanisms.
  Do not add a general analysis engine, plugin registry, or collector service.

## Compatibility

This is verification maintenance, with no new JP1/AJS semantics. Preserve the
JP1/AJS3 version 13 normative basis and all existing definition workflows.
`engines.vscode` remains `^1.75.0`. Desktop and web production inputs and
contracts remain unchanged. Node APIs already used by filesystem-based test
support remain test-only; do not introduce them into shared production code.

## Non-goals

- Changing architecture rules, production layout, or architecture exceptions.
- Generalizing static analysis, adding dependencies, or replacing the runner.
- Cleaning up unrelated tests, repairing desktop host bootstrap or Table shell
  failures, aligning flow golden files, or changing WebAPI beta status.
- New product behavior, use cases, user documentation, or changelog entries.

## Open questions

None for intake. Planning must establish the smallest justified module
boundaries, exact path set, coverage inventory, and executable check route.
