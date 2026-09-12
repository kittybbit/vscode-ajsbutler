# Feature Specification: Semantic Diff Quality Remediation

## Purpose

Remove the Qlty merge blockers introduced by the Semantic Diff comparison,
schedule-impact foundation, and job-group identity work in PR #317 while
preserving every existing observable and compatibility contract.

## Minimal Context

- Current decision: make the branch pass its legitimate Qlty quality gate by
  simplifying the flagged implementation, without suppression or behavior
  change.
- Feature kind: transient branch feature.
- Selected feature folder:
  `docs/specs/features/semantic-diff-quality-remediation/`.
- Read first: this file and `TASKS.md`.
- Read `TRACEABILITY.md` only when planning or validating a requirement.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Source: PR #317 (`codex/semantic-diff-job-group-identity` to `main`) is
  blocked by the remote Qlty checks: 99 blocking code-smell issues and one
  formatting issue at `CHANGELOG.md:334`.
- Branch basis: `origin/main...HEAD` contains the completed Semantic Diff
  comparison workflow, schedule-impact calendar foundation, and job-group
  identity changes whose new code is being checked.
- Source use cases:
  `docs/requirements/use-cases/uc-build-semantic-diff.md` and
  `docs/requirements/use-cases/uc-compare-ajs-definitions.md`.
- JP1/AJS reference basis: this feature introduces no new JP1/AJS meaning.
  Its behavior basis is the existing JP1/AJS3 version 13 contract, the two
  source use cases above, and the branch's approved tests and durable
  specifications. Refactoring must not infer or widen unsupported semantics.
- Implementation-slice plan: `TASKS.md`; formal slice creation remains owned
  by Planning.

## Requirements

- The PR's remote `qlty check` reports zero blocking issues for the selected
  branch diff.
- The PR's remote `qlty fmt` passes, including the existing Markdown finding
  at `CHANGELOG.md:334`.
- High function and total complexity, excessive returns or parameters,
  complex binary expressions, and reported duplication are resolved through
  cohesive simplification of the flagged code.
- Qlty disablement, ignore rules, inline suppression, baseline manipulation,
  threshold relaxation, and architecture exceptions are prohibited.
- Parser and normalized-model meaning, Semantic Diff matching and ordering,
  schedule interpretation and impact facts, report and JSON projections,
  Explorer and Flow behavior, Git/file comparison, source navigation, error
  handling, and telemetry privacy remain unchanged.
- Refactoring keeps the verified dependency direction and host-neutral
  contracts. Extracted helpers remain in the layer that owns their behavior.
- Public application DTOs, JSON/report schemas, command IDs, transport
  messages, localization outcomes, and user workflow remain compatible.
- Existing large, duplicate, malformed, unsupported, and cancellation cases
  retain their tested outcomes and deterministic ordering.

## Architecture

- Domain: simplify only flagged Semantic Diff structural and schedule rules;
  keep JP1/AJS decisions pure and independent of outer layers.
- Application: decompose flagged comparison, schedule-impact, and projection
  orchestration without changing host-neutral results or introducing outer
  dependencies.
- Presentation: simplify flagged localization, command, calendar panel,
  transport, session, and webview bridge code without moving domain decisions
  outward or changing user-visible behavior.
- Infrastructure: simplify only the flagged VS Code Git source/content
  adapters while preserving explicit capability and failure contracts.
- Bootstrap: simplify only flagged composition/session-lifetime code; no
  concrete dependency may escape its existing construction boundary.

## Impact Analysis

### Dependency Impact

- Affected production surface: the 18 TypeScript files listed in `TASKS.md`
  by the local `qlty smells --no-snippets` inventory, plus the Markdown
  formatting finding in `CHANGELOG.md`.
- Affected tests: existing Semantic Diff, schedule, presentation, command,
  Git adapter, session, transport, Explorer, Flow, desktop, and web suites.
  Planning decides whether characterization tests are required before an
  individual refactor.
- Propagation decision: refactor callers and private helpers together only
  within an approved cohesive slice. Keep durable behavior documents, public
  schemas, and configuration unchanged.

### Overlap Decision

- The completed Semantic Diff comparison workflow and job-group identity work
  provide behavior to preserve; this feature does not reopen or extend their
  product scope.
- Schedule Impact Calendar Slices 1 and 2 provide implementation that may be
  refactored. Planned public Slice 3 is not active and is outside this feature.
- The inherited `dependabot-security-updates` feature and its current
  uncommitted `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md` edits are preserved
  unchanged and are outside this feature.
- No feature split is required: every selected change serves the single PR
  merge-gate remediation outcome. Any behavior change or new product outcome
  is a replan or separate-feature boundary.

### Breaking Change Analysis

- User-visible behavior: none permitted.
- API/DTO/schema compatibility: no externally consumed shape or meaning may
  change.
- VS Code/web extension compatibility: preserve `^1.75.0`, desktop and web
  hosts, optional Git behavior, and the production-source Node built-in ban.
- Changed scenarios: none; all existing scenarios are regression contracts.

### Alternative Considerations

- Qlty suppression, ignores, or baseline adjustment: rejected because they
  hide the merge blocker instead of improving the implementation.
- Removing behavior or validation to reduce complexity: rejected because the
  completed contracts are the compatibility baseline.
- One broad rewrite: rejected because it obscures behavior preservation and
  approval boundaries; Planning should prefer independently verifiable,
  cohesive surfaces.
- Mechanical pairwise extraction without ownership review: rejected where it
  would duplicate policy or move decisions across architecture layers.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` at each lifecycle gate.
- Scope changes requiring re-approval: behavior, public contract, test
  expectation, configuration, dependency, generated artifact, architecture
  boundary, Qlty policy, or any production file outside the inventoried
  remediation surface.

## Compatibility

- VS Code compatibility remains `^1.75.0` from `package.json`.
- Web extension behavior and browser-safe production dependencies remain
  unchanged.
- Desktop extension behavior, including optional built-in Git API use,
  remains unchanged.
- JP1/AJS3 version 13 parsing, identity, schedule, comparison, and
  presentation outcomes remain unchanged.
- Report, JSON, Explorer, Flow, source-navigation, telemetry, and failure
  contracts remain unchanged.
- Refactoring must not add a preventable slowdown or memory regression for
  large definitions or schedule-impact collections.

## Acceptance Criteria

- PR #317 reports successful `qlty check` and `qlty fmt` statuses with no
  disablement, suppression, ignored path, or baseline manipulation.
- Local Qlty validation passes for the completed branch diff.
- Relevant focused tests, the complete desktop suite, the web suite, and the
  production build pass after all approved slices.
- Architecture checks remain at zero exceptions and production source gains
  no Node built-in dependency.
- Existing Semantic Diff and schedule fixtures retain the same facts,
  ordering, classifications, projections, localized outcomes, and failure
  behavior.
- `CHANGELOG.md:334` satisfies formatting without changing its release-note
  meaning.
- The inherited Dependabot documents and planned Calendar Slice 3 remain
  unchanged by this feature.

## Durable Documentation Impact

- Requirements use cases: no update expected because observable behavior does
  not change.
- `docs/specs/roadmap.md`: no update; this transient remediation does not add,
  reorder, or resolve repository-level future product work.
- Architecture, context map, glossary, and vision: no update; no durable
  boundary or terminology decision changes.
- README: no update expected.
- CHANGELOG: only the reported formatting correction is in scope; no new
  release note is expected because behavior does not change.

## Non-Goals

- Implementing Schedule Impact Calendar Slice 3 or any new public calendar
  behavior.
- Changing Semantic Diff, schedule, report, JSON, Explorer, Flow, Git source,
  parser, telemetry, or localization behavior.
- Resolving Dependabot alerts or editing its feature artifacts.
- General modernization, dependency changes, generated-artifact changes, or
  repository-wide cleanup outside the PR's Qlty findings.
- Disabling or weakening Qlty, tests, architecture checks, or compatibility
  requirements.

## Open Questions

- None for intake. Planning must group the 18-file inventory into cohesive,
  independently verifiable slices and may return a replan trigger if a smell
  cannot be removed without changing an existing contract.
