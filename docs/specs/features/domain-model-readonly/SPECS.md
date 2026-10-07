# Feature Specification: domain-model-readonly

## Purpose

Protect the normalized JP1/AJS model from accidental mutation through its
published TypeScript contracts. Migrate incrementally after characterizing
construction, aliases, and consumer mutation, preserving existing behavior.

## Source

- Kind: roadmap feature; slug: `domain-model-readonly`.
- User selection: advance `domain-model-readonly` in the current conversation.
- [Roadmap](../../roadmap.md#internal-architecture-refactoring-sequence), first
  remaining internal architecture refactoring item.
- [Normalize AJS Document](../../../requirements/domain-rules/normalize-ajs-document.md)
  owns normalized identity, structure, raw values, and source evidence.
- [Architecture](../../architecture.md#parser-and-model-boundary) owns the
  parser/domain boundary. JP1/AJS3 version 13 remains normative; this feature
  introduces no new JP1 parameter or command interpretation.

## Requirements and acceptance

- **R1 — Readonly normalized contract:** expose `AjsDocument`, `AjsUnit`,
  parameter, relation, warning, and layout values with readonly properties and
  readonly nested collections. Cover the published normalized index lookup
  collections where they expose the same model. Verify rejected writes at the
  type boundary without replacing them with casts that bypass the contract.
- **R2 — Controlled construction:** characterize mutation and aliases before
  migration. Preserve legitimate parser construction and local work buffers;
  adapt affected producers and consumers to the readonly published boundary.
  Do not confuse copied application DTO construction with domain mutation.
- **R3 — Behavioral equivalence:** preserve normalized identity, hierarchy,
  ordering, repeated parameters, raw values, optional fields, source positions,
  warnings, relations, and parent/ancestor/root-jobnet lookup. Preserve index
  duplicate buckets and the existing unique/occurrence traversal distinction.
- **R4 — Consumer compatibility:** preserve parser, unit list, base/expanded
  flow, CSV, unit definition, diagnostics, hover, navigation, WebAPI import,
  semantic diff/report, schedule interpretation, and telemetry behavior.
  Existing malformed, duplicate, cyclic, deep, large, and encoded-input
  expectations must remain intact where the affected boundary supports them.
- **R5 — Host and architecture compatibility:** retain desktop and web
  support, the VS Code minimum, layer ownership, dependency directions, and
  zero architecture exceptions. Demonstrate compatibility with the affected
  boundary tests, TypeScript checks, and desktop/web builds and tests.

## Decisions and impact

- The normalized model remains owned by domain; infrastructure constructs it
  and application consumes it through parser and use-case contracts.
- Readonly means a TypeScript contract. Runtime freezing, proxies, cloning
  policy, and changed object identity are outside this outcome.
- Necessary signature and fixture adaptations belong to this feature. A
  general readonly conversion of Semantic Diff results, schedule outputs,
  application DTOs, UI state, or every domain type is a separate outcome.
- The inherited WebAPI feature remains independent: this migration preserves
  its read-only beta import contract and does not settle beta-exit questions.
- The roadmap's `architecture-test-cohesion` item remains separate. This
  feature may validate current architecture rules but does not reorganize them.

## Compatibility

- `package.json` declares `engines.vscode: ^1.75.0`; retain it.
- Preserve serialized DTO shapes and values, commands, errors, diagnostics,
  formatting, and telemetry event/privacy contracts.
- A readonly signature intentionally rejects internal TypeScript mutation;
  runtime definitions and supported JP1/AJS inputs remain compatible.
- Shared production code remains browser-safe and host-neutral. Parser raw
  structures and generated types remain confined to parser infrastructure.

## Non-goals

- Runtime immutability enforcement or new immutable-data dependencies.
- New model fields, JP1 semantics, schedule coverage, or product behavior.
- Parser grammar/generated-code changes or a raw-parser model redesign.
- Blanket readonly conversion, architecture refactoring, test-framework work,
  dependency modernization, or resolution of unrelated inherited failures.
  A narrowly approved S2 validation repair may replace existing runtime alias
  imports with equivalent relative paths and correct desktop test executable/
  isolated test-global initialization; it adds no loader or framework. The
  proposed official test SDK upgrade keeps project launching platform-neutral
  and explicitly transitions development/CI from Node 20 to Node >=22; extension
  runtime and the VS Code minimum remain unchanged.
- WebAPI beta exit, write operations, or additional host support.

## Acceptance boundaries

- Every property of the normalized document, recursive unit, parameter,
  relation, warning, and layout is readonly, including optional fields.
  Document/unit arrays and published index Maps and buckets are readonly.
- Helpers accept readonly model collections. Helpers that create new result
  arrays may return mutable arrays: those arrays are owned results, not aliases
  of document/unit arrays or index buckets. Their model elements remain readonly.
  Primitive-value arrays and independently constructed schedule/DTO collections
  retain their existing ownership and mutability.
- Compile-only rejected-write examples cover direct and nested writes, optional
  fields, array mutators/index assignment, index mutation and bucket mutation,
  and writes reached through parser results, helper results, schedule aliases,
  and the existing Flow parameter/relation aliases. Valid producer buffers and
  readonly inputs must still compile. No executable test performs forbidden writes.
- Preserve reference identity and existing construction copies. Readonly does
  not guarantee that an independently held mutable producer alias cannot write.
  Do not introduce mutation bypasses into published-contract consumers.

- Required desktop validation must load and execute the actual full suite,
  report a nonzero test count and actual pass/fail totals, and propagate suite
  loading/test failures as nonzero command exits. Wrapper exit 0 alone is not
  host coverage. This repair does not change bundled product parser/resource
  semantics or telemetry collection.

## Open questions

No unresolved product or design decision. Required implementation failures or
new affected paths return through Main; inherited verification follow-ups are
not accepted failures or permission to repair outside this feature.
