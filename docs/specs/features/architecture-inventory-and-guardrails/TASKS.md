# Feature Tasks: Architecture Inventory And Guardrails

## Agent Brief

- Purpose: establish the complete dependency inventory and enforceable baseline.
- Approved or active slice: all three slices are complete; Feature Exit remains.
- Do not remove, relocate, or rewrite production dependencies.
- Do not weaken existing checks or create broad/permanent exceptions.
- Read first: `SPECS.md`, this file, and `docs/specs/architecture.md`.
- Read `TRACEABILITY.md` for requirement, use-case, and downstream ownership.
- Validate each slice as specified below; qlty is required for code slices.
- Approval policy and document roles: see `docs/specs/README.md`.
- Next decision: run Feature Exit Review with `sdd-plan-task`.

## Sync Rule

- Update this file when a slice completes, changes scope, or changes approval,
  validation, risk, or feature-exit readiness.
- Update `TRACEABILITY.md` with inventory and guardrail evidence in the same
  commit as the affected slice.
- Update `docs/specs/plans.md` only when active feature state changes and
  `docs/specs/roadmap.md` only when repository sequencing changes.

## Plan Status

- Status: In Progress
- Planning scope: the complete import collector, dependency/use-case inventory,
  rule baseline, temporary allowlist, and detection evidence.
- Review status: reviewed and ready for approval; no blocking findings.
- Human approval: approved for the full plan and all three slices.
- Active implementation slice: none; all approved slices are complete.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: the complete three-slice plan, implemented in dependency order;
  each slice remains limited to its recorded approval boundary.

Implementation may proceed one slice at a time in dependency order.

## Implementation Slices

### Slice 1: Deterministic Dependency Collection And Rule Harness

- Status: Complete
- Scope:
  - Replace the test-local regular-expression scanner with a TypeScript-aware,
    reusable dependency collector.
  - Scan production TypeScript under `domain`, `application`, `infrastructure`,
    `presentation`, `bootstrap`, `shared`, and `resource`, plus `extension.ts`.
  - Exclude tests and generated sources as dependency owners while retaining
    imports targeting generated code as collected references.
  - Normalize relative imports, repository aliases, external packages, type-only
    imports, re-exports, side-effect imports, dynamic imports, and CommonJS
    `require` calls that occur in TypeScript sources.
  - Preserve the current high-value domain/application/presentation rules before
    adding the wider rule catalog.
- User / Domain Value: one deterministic architecture evidence source prevents
  later migration features from using inconsistent search methods.
- Cohesive Change Group:
  - `src/test/support/architectureDependencyRules.ts` (new collector/rule support)
  - `src/test/suite/architectureDependencyRules.test.ts` (refactor and collector
    behavior tests)
- Acceptance:
  - Existing high-value dependency assertions still pass.
  - Collector fixtures cover every supported import form and path category.
  - File ordering and violation formatting are deterministic across platforms.
  - No production source, runtime behavior, package, or compiler configuration
    changes.
- Validation:
  - Focused collector/rule tests through `rtk pnpm test`.
  - `rtk pnpm run qlty` and `git diff --check`.
  - Review collector coverage against `tsconfig.json` aliases and all production
    TypeScript roots.
- Production Readiness:
  - Failure mode: a missed syntax form or incorrect path resolution creates a
    false negative; fixtures must fail for each missed category.
  - JP1/AJS compatibility: no command, definition, parser, or domain behavior
    changes.
  - Large or malformed input risk: no user input is parsed; repository scanning
    must remain deterministic and complete at current source-tree size.
  - Desktop/web impact: the filesystem test runs in the desktop test suite but
    must scan both desktop and web/shared production paths.
  - README/docs impact: none beyond feature-local planning/traceability.
  - CHANGELOG impact: none under the repository CHANGELOG criteria.
  - Qlty evidence: qlty must pass; new complexity findings in the collector must
    be resolved rather than hidden.
- Approval Boundary: test support and the existing architecture test only. Any
  production, configuration, dependency, or build-script change requires
  replanning and approval.
- Dependencies: none.
- Risks: TypeScript syntax and alias resolution can create false confidence if
  fixture coverage is narrower than production usage.
- Out of Scope: new layer rules, the actual full inventory, dependency removal,
  runtime refactors, and behavior changes.

### Slice 2: Production Dependency And Use-Case Inventory

- Status: Complete
- Scope:
  - Use the Slice 1 collector plus targeted reference checks to enumerate every
    production import covered by R1.
  - Classify every finding as legitimate ownership or a named violation category.
  - Record exact source/target evidence, downstream owner feature, removal or
    retention decision, and validation target in `TRACEABILITY.md`.
  - Record the current application entry point, input/output boundary, raw or
    wrapper dependency, concrete adapter construction, presentation dependency,
    desktop/web path, and downstream owner for all eleven durable use cases.
  - Reconcile `shared`, resource imports, `extension.ts`, Node built-ins, browser
    packages, and host-specific infrastructure explicitly rather than assuming
    ownership from directory names.
- User / Domain Value: every later migration feature receives a reviewed,
  bounded handoff instead of rediscovering or silently missing dependencies.
- Cohesive Change Group:
  - `docs/specs/features/architecture-inventory-and-guardrails/TRACEABILITY.md`
  - read-only inspection of production sources, use cases, `tsconfig.json`, and
    `docs/specs/architecture.md`
- Acceptance:
  - R1-R3 and AC1 are completely represented in traceability.
  - Every violation has exactly one downstream owner and a removal condition.
  - Every legitimate dependency records why its layer ownership is valid.
  - Inventory counts can be reproduced from the collector and targeted searches.
  - No production/test/configuration files are edited in this slice.
- Validation:
  - Re-run the collector and targeted `rtk rg` checks for raw/wrapper, generated
    parser, host framework, SDK, layer, and composition imports.
  - Cross-check all eleven durable use cases and existing regression test files.
  - `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `git diff --check`.
- Production Readiness:
  - Failure mode: an omitted or misclassified finding leaves downstream scope
    ownerless; reconcile collector totals and use-case rows before completion.
  - JP1/AJS compatibility: version 13 behavior is evidence only; no semantics
    change.
  - Large or malformed input risk: record existing risk coverage per use case;
    do not alter handling.
  - Desktop/web impact: record both host paths and host-specific dependencies for
    every affected use case.
  - README/docs impact: feature-local traceability only; no user docs change.
  - CHANGELOG impact: none because this slice is investigation documentation.
  - Qlty evidence: docs-only qlty must pass.
- Approval Boundary: feature-local traceability only. Discovery of a missing
  roadmap owner or a needed behavior decision stops the slice for replanning.
- Dependencies: Slice 1.
- Risks: semantic responsibility cannot always be inferred from import direction;
  ambiguous cases must remain explicit rather than being guessed.
- Out of Scope: changing use cases, architecture durable docs, runtime code,
  tests, configuration, or roadmap sequencing.

### Slice 3: Full Guardrail Baseline And Owned Temporary Allowlist

- Status: Complete
- Scope:
  - Encode stable rule IDs for domain, application, presentation,
    infrastructure, bootstrap/composition, generated parser, raw model, legacy
    wrapper, host framework, Node/browser package, and telemetry SDK imports.
  - Add an exact-match typed allowlist containing only Slice 2 violations, with
    source, target, rule ID, downstream feature owner, and removal condition.
  - Fail on new violations, missing ownership/removal data, duplicate entries,
    and stale entries whose matching violation no longer exists.
  - Add in-memory representative intentional-violation fixtures proving every
    rule family is detected without adding violations to production sources.
  - Update traceability with rule IDs, allowlist evidence, and the final handoff
    matrix.
- User / Domain Value: architecture drift becomes immediately visible while
  existing migration debt remains explicit and owned instead of hidden.
- Cohesive Change Group:
  - `src/test/support/architectureDependencyRules.ts`
  - `src/test/fixtures/architecture/dependencyAllowlist.ts` (new exact entries)
  - `src/test/suite/architectureDependencyRules.test.ts`
  - feature `TRACEABILITY.md`
- Acceptance:
  - R4-R5 and AC2-AC3 are satisfied.
  - The actual production scan contains no unexplained violation.
  - Every temporary entry matches one current violation and one downstream
    feature; deleted violations make stale entries fail.
  - Representative violations fail each rule family.
  - Existing high-value rules are not weakened and permanent/wildcard exceptions
    are impossible in the allowlist shape.
- Validation:
  - Focused architecture tests through `rtk pnpm test`.
  - `rtk pnpm run test:web` to rebuild/smoke the browser extension after the
    final cross-host source classification is fixed.
  - `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `git diff --check`.
  - Review exact allowlist equality against Slice 2 inventory totals.
- Production Readiness:
  - Failure mode: false positives block unrelated changes; false negatives allow
    drift. Exact fixtures and deterministic diagnostics must make both debuggable.
  - JP1/AJS compatibility: no rule may require a production semantic change in
    this feature; current parser/definition behavior remains untouched.
  - Large or malformed input risk: no runtime path changes; test runtime must be
    reasonable for the current repository size.
  - Desktop/web impact: rules cover both source paths; desktop test execution and
    web build/smoke evidence are both required.
  - README/docs impact: none; durable architecture rewrite belongs to the final
    migration feature.
  - CHANGELOG impact: none because only tests and feature-local docs change.
  - Qlty evidence: qlty must pass with no new smells; metrics matter only if they
    expose rule-engine responsibility or maintainability risk.
- Approval Boundary: architecture test/support/fixture and feature traceability
  only. Removing violations, changing production imports, changing packages or
  configs, or editing durable architecture/use-case docs requires replanning.
- Dependencies: Slices 1 and 2.
- Risks: an oversized allowlist can normalize debt; exact ownership, stale-entry
  failure, and the final zero-allowlist feature are mandatory controls.
- Out of Scope: production fixes, dependency moves, behavior changes, feature
  implementation for downstream owners, and final durable architecture policy.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: three slices map five requirements, three acceptance criteria, eleven
  use cases, rule families, temporary exceptions, and downstream features.

## Cross-Slice Dependencies

- Slice 1 provides the deterministic collector used by Slice 2.
- Slice 2 provides the reviewed findings and ownership used by Slice 3.
- Slice 3 must not invent allowlist entries that are absent from Slice 2.
- Slices are sequential and independently reviewable/committable; none may
  remove a production violation.

## Feature-Level Risks

- Import-based checks cannot prove semantic responsibility; traceability must
  distinguish import evidence from judgment about shared domain meaning.
- TypeScript syntax, aliases, re-exports, dynamic imports, and platform path
  differences can cause scanner gaps.
- An allowlist can become permanent debt unless every entry is exact, owned,
  stale-checked, and scheduled for removal by a named downstream feature.
- The architecture test runs with desktop filesystem access even though it scans
  both desktop and web source paths; web smoke confirms compatibility but does
  not execute the filesystem scanner in-browser.
- No slice may raise `engines.vscode` or alter package/runtime dependencies.

## Use-Case Back-Propagation

- No durable behavior contract change is planned.
- Boundary discrepancies are recorded in traceability and assigned to the
  relevant downstream migration feature.
- If investigation proves an existing use case is factually wrong about user
  behavior, stop and replan rather than editing it in this inventory feature.

## Implementation Feedback

- Slice 1's boundary was appropriate: the existing TypeScript dev dependency
  and `src/test/**/*.ts` compilation scope supported the collector without
  package or configuration changes.
- The desktop filesystem test can deterministically inspect desktop, web, and
  shared source roots; browser execution of the scanner remains unnecessary.
- No feedback from Slice 1 passes the Durable Documentation Gate; the details
  remain feature-local for Slice 2 and Slice 3.
- Slice 2's docs-only boundary was appropriate. The collector reconciled all
  categories without requiring production, test, configuration, or durable
  architecture changes.
- The inventory distinguishes five raw-`Unit` migration findings from six
  legitimate parser/normalizer references. This prevents Slice 3 from
  allowlisting dependencies that the target seam intentionally retains.
- Existing outer-layer direction violations are zero. The owned debt is
  concentrated in wrapper dependencies, presentation-to-domain imports, and
  two explicit Node/browser compatibility risks.
- No Slice 2 feedback passes the Durable Documentation Gate. The inventory and
  handoff conditions remain feature-local inputs to Slice 3 and the downstream
  roadmap features.
- Slice 3's boundary was appropriate. The full rule catalog, literal allowlist,
  fixtures, and reconciliation stayed inside test support without production,
  package, or configuration changes.
- The exact production baseline is 150 entries. Grouping repeated ownership and
  removal text while retaining literal source, target, import kind, and rule ID
  keeps the fixture reviewable without weakening stale detection.
- Restricting `ownerFeature` to the ten named downstream features prevents a
  typo or invented owner from satisfying the typed allowlist contract.
- No Slice 3 feedback passes the Durable Documentation Gate. The guardrail
  mechanics and temporary debt remain feature-local until Feature Exit decides
  what, if anything, belongs in durable architecture documentation.

## Feature Exit

- Definition of Done status: implementation and validation complete; Feature
  Exit Review is required before closure.
- Durable documentation updates: none expected; roadmap and plans already carry
  the active sequence.
- Open risks: the 150 exact entries remain intentional migration debt. Each is
  owned and stale-checked, and final removal remains assigned to
  `remove-legacy-and-enforce-clean-architecture`.

## Validation

- [x] Slice 1 collector and current-rule tests pass.
- [x] Slice 2 inventory and eleven use-case mappings are complete and reproducible.
- [x] Slice 3 full rules, violation fixtures, and exact allowlist tests pass.
- [x] `rtk pnpm test` passes for the final integrated plan.
- [x] `rtk pnpm run test:web` passes for final cross-host confidence.
- [x] `rtk pnpm run qlty`, Markdown lint, and diff check pass.
