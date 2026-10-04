# Feature Specification: Semantic Diff VS Code Dependencies

## Purpose

Reduce dependency breadth and responsibility concentration in the Semantic
Diff VS Code command workflow, preserving the existing comparison, Explorer,
report, and flow-source behavior. Bootstrap remains the composition root;
source-freshness behavior belongs to the relevant VS Code presentation owner.

## Source

- Kind: roadmap feature; slug: `semantic-diff-vscode-dependencies`.
- [Roadmap](../../roadmap.md#internal-architecture-refactoring-sequence), item 1.
- [Compare AJS Definitions](../../../requirements/use-cases/uc-compare-ajs-definitions.md).
- [Present Semantic Diff Report](../../../requirements/use-cases/uc-present-semantic-diff-report.md).
- [Architecture](../../architecture.md#composition).
- JP1/AJS basis: existing normalized JP1/AJS3 behavior and the architecture's
  version 13 normative target. This refactor introduces no parameter, schedule,
  parsing, or matching semantics and needs no new external semantic source.

## Requirements and acceptance

- R1: Command collaborators consume only the dependency capabilities their
  responsibilities need. Preserve existing optional capabilities and fallback
  paths; narrower contracts must not make unavailable Git, Explorer, or
  schedule capabilities mandatory.
- R2: Move flow-source snapshot lookup and freshness decisions out of bootstrap
  into cohesive VS Code presentation ownership. Bootstrap constructs and
  injects dependencies, registers commands/providers, and retains explicit
  lifecycle ownership without implementing source-freshness policy.
- R3: Preserve freshness behavior: source identity requires the same handle and
  URI; captured text must match; a non-null captured version must match; a null
  captured version does not impose a version equality requirement. Missing
  capture or matching open document remains unavailable. Stale sources must
  not be used for a fresh flow action.
- R4: Preserve comparison acquisition, cancellation/failure handling, immutable
  session and snapshot ownership, source navigation, schedule context, report
  modes, explicit copy/save, localization, telemetry privacy, and disposal.
- R5: Preserve zero-exception dependency rules, browser-safe shared code, the
  supported VS Code version, and desktop/web extension behavior and bundles.

Acceptance requires reviewable narrowed contracts and a cohesive freshness
owner, relevant command/freshness/lifecycle regression coverage, architecture
validation, and desktop/web validation under the SDD policy. The planner owns
the exact implementation boundaries and required commands.

## Decisions and impact

- This is one roadmap outcome: clarify the command/presentation composition
  boundary. The following calendar, readonly-domain, and architecture-test
  roadmap items retain separate ownership and ordering.
- Direct surfaces are Semantic Diff command collaborators and bootstrap wiring;
  transitive preservation includes Explorer, flow actions, source capture,
  report output, schedule sessions, and extension subscriptions.
- Prefer existing semantic owners and cohesive modules. Narrow dependency
  types must not introduce a service container or same-response wrappers
  without an earned responsibility boundary.
- Existing durable use cases remain authoritative and need no behavior update.
  README and CHANGELOG need no entry for the proposed internal-only outcome;
  reassess if planning discovers an observable change.

## Compatibility

- Keep `package.json` `engines.vscode` at `^1.75.0`; use supported VS Code APIs.
- Keep desktop and browser composition working without production Node imports.
- Keep application/domain contracts host-neutral and parser internals confined
  to parser infrastructure. Preserve existing JP1/AJS definition semantics.
- Keep command IDs, result meaning, reports, source snapshots, telemetry
  catalog/privacy, and optional Git support compatible.

## Non-goals

- Dependency package upgrades or a change to the VS Code minimum version.
- New comparison, schedule, calendar, report, or Git behavior.
- Calendar presentation consolidation, domain readonly migration, or splitting
  the architecture-test implementation.
- Parser/generated-code changes, architecture exceptions, a dependency
  injection framework, or repository-wide command refactoring.

## Open questions

None. The complete implementation boundary, dependency groups, presentation
owner, and validation are recorded in [TASKS.md](TASKS.md).
