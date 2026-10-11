# Feature Specification: Expanded Flow Graph Golden Alignment

## Purpose

Reconcile the representative expanded-flow-graph node-order golden with the
existing verified graph-order contract. Preserve deterministic graph ordering
and Semantic Diff Explorer behavior. If current source and golden already
agree, close the roadmap follow-up without manufacturing implementation work.

## Source

- Kind: roadmap feature; slug: `expanded-flow-graph-golden-alignment`.
- User selected this feature and requested slices, with Feature Exit when
  implementation is unnecessary.
- [Roadmap](../../roadmap.md).
- [Build Flow Graph use case](../../../requirements/use-cases/uc-build-flow-graph.md).

## Requirements and acceptance

- R1: The representative node-order golden agrees with current deterministic
  expanded graph construction; compare source and expected sequence explicitly.
- R2: Retain equality across expansion request orders, stable JP1/AJS unit and
  relation identity, containment ordering, affected subtree constraints, and
  Semantic Diff highlights.
- R3: When focused discovery confirms no mismatch, recommend Feature Exit with
  zero implementation slices and evidence for removing the completed roadmap
  item. Do not introduce unrelated maintenance.

## Decisions and impact

- Current source and the representative golden agree. The existing use-case
  suite passes all nine cases, including the exact node-order assertion.
- Graph node-array insertion order and placement containment order have
  distinct responsibilities. Preserve both existing contracts.
- No runtime, test, fixture, generated output, or configuration edit is needed.
- Closure should remove the finished roadmap item. No new durable use-case,
  README, or CHANGELOG content is warranted because behavior is unchanged.

## Compatibility

JP1/AJS normalized identity, hierarchy, relations, recovery/condition behavior,
and graph highlighting remain unchanged. Desktop/web behavior and
`engines.vscode` (`^1.75.0`) remain unchanged.

## Non-goals

- Change graph ordering, placement geometry, parser behavior, or Semantic Diff
  Explorer behavior.
- Weaken or remove assertions, regenerate goldens automatically, or broaden
  verification maintenance to unrelated failures.
- Modify inherited WebAPI import work or other roadmap follow-ups.
