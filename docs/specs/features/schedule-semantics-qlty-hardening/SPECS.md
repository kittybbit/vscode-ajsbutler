# Feature Specification: Schedule Semantics Qlty Hardening

## Purpose

Resolve all 65 blocking Qlty Cloud findings reported on PR #315 while
preserving the schedule semantics and observable behavior delivered at closure
commit `23112667`.

## Minimal Context

- Current decision: refactor the reported quality hotspots without expanding
  or changing schedule interpretation.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Feature kind: transient branch feature for pre-merge remediation.
- Branch goal: make PR #315 pass its blocking Qlty Cloud review.
- Source review: [PR #315](https://github.com/kittybbit/vscode-ajsbutler/pull/315)
  and its [Qlty Cloud issue list](https://qlty.sh/gh/kittybbit/projects/vscode-ajsbutler/pull/315/issues).
- Baseline: the completed schedule-semantics feature was closed by commit
  `23112667`; this feature does not reopen its removed feature folder or
  rewrite its commits.
- Source use case: `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- JP1/AJS reference basis: no new product interpretation is introduced. The
  normative JP1/AJS3 version 13 basis and supported semantics remain those
  already recorded by the source use case and
  `docs/requirements/domain-rules/interpret-jp1-parameters.md`.
- Implementation-slice plan: `TASKS.md` after Planning Mode completes.

## Requirements

- QH-1: resolve every one of the 65 blocking Qlty Cloud issues currently
  reported for PR #315, including the five Markdown line-length findings.
- QH-2: reduce the reported file/function complexity, return-count,
  nested-flow, boolean-expression, many-parameter, and identical-code findings
  without suppressing, excluding, or weakening the applicable quality rules.
- QH-3: preserve all calculated, unsupported, uncalculated, zero-run,
  schedule-change, and confirmation-required outcomes delivered by the closed
  schedule-semantics feature.
- QH-4: preserve architecture dependency direction, public and neutral DTO
  shapes, application mappings, deterministic evidence, and browser-safe
  production code.
- QH-5: keep the same result for the same supported definition and comparison
  period on desktop and web hosts.
- QH-6: validate both the local repository quality gate and the PR differential
  Qlty Cloud gate; the local result alone is insufficient because it currently
  reports no issues while the PR review reports 65 blockers.

## Architecture

- Domain: refactor only internal schedule semantic-diff implementation details
  needed to satisfy the reported quality rules; preserve domain outputs and
  rules.
- Application: unchanged unless planning establishes a Qlty-reported hotspot
  that requires behavior-preserving internal restructuring within the existing
  application boundary.
- Presentation: none.
- Infrastructure: none.
- Boundary rule: no architecture exception, cross-layer dependency, Node
  built-in, host service, or UI-framework dependency may be introduced.

## Impact Analysis

### Dependency Impact

- Known quality hotspots are
  `semanticDiffScheduleCalendarContext.ts`,
  `semanticDiffScheduleInterpreter.ts`,
  `semanticDiffScheduleProjector.ts`, and the identical-code relationship
  involving `semanticDiffScheduleDiffer.ts`.
- Markdown impact is limited to the five PR-reported line-length findings;
  wording and durable meaning must remain unchanged.
- Affected callers, tests, and exact path ownership must be established by
  Planning Mode before implementation approval.
- Propagation decision: change internal structure and formatting together with
  the nearest regression tests and SDD evidence. Keep commands, presentation,
  DTOs, persisted schemas, docs meaning, and schedule results unchanged.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: no changes permitted.
- VS Code/web extension compatibility: no changes permitted.
- Changed scenarios: none; existing schedule scenarios are regression
  constraints.

### Alternative Considerations

- Reopen the closed `schedule-semantics-expansion` feature: rejected because
  its approved semantics are complete and closure commit `23112667` removed
  its temporary artifacts. PR quality remediation has a distinct purpose and
  approval boundary.
- Suppress or configure away Qlty findings: rejected because the request is to
  resolve every blocking issue and configuration weakening would not harden
  the implementation.
- Rely only on local `pnpm run qlty`: rejected because it currently reports no
  issues and does not demonstrate that the PR differential blockers are gone.
- Rewrite or squash the completed commits: rejected; remediation is additive
  on the existing PR branch unless a later explicit repository decision says
  otherwise.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: any product-semantic change, new public
  type or reason code, changed message or output shape, Qlty configuration or
  suppression, architecture-boundary change, new dependency, or edit outside
  the reviewed implementation plan.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve browser-safe code and current semantic
  results; no filesystem, process, host-clock, locale, timezone, network, or
  external-calendar dependency may be added.
- Desktop extension compatibility: preserve the same contracts, results, and
  failure handling as the closure baseline.
- JP1/AJS compatibility: preserve all version 13 interpretation and explicit
  unsupported or uncalculated boundaries already delivered.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Qlty Cloud reports no blocking issue from the 65-item PR #315 finding set.
- Local `pnpm run qlty` and Markdown lint pass without new suppressions or
  quality-rule weakening.
- Focused and integration schedule-semantic tests pass without changed
  expectations that broaden or narrow supported semantics.
- Architecture validation, compilation, and production builds pass.
- Desktop tests pass; web compatibility is verified using the repository's
  applicable web test/build evidence, with any unchanged host limitation
  recorded rather than hidden.
- No public DTO, report schema, reason code, user-visible behavior, README
  meaning, or CHANGELOG behavior claim changes.

## Non-Goals

- Add or defer any new schedule form or JP1/AJS interpretation.
- Change Wave 3, Wave 4, or Deferred Schedule Semantics ordering.
- Redesign semantic diff, schedule comparison, reports, or presentation.
- Change Qlty rules, thresholds, exclusions, configuration, or baselines.
- Reopen the closed schedule-semantics feature or rewrite its existing commits.
- Perform unrelated cleanup outside the reviewed Qlty remediation scope.

## Overlap And Durable-Document Impact

- Selected feature: `schedule-semantics-qlty-hardening` only.
- The completed schedule-semantics feature supplies the behavior baseline but
  is not selected, reopened, or restored.
- Existing schedule-impact-calendar, semantic-diff Explorer, comparison
  workflow, WebAPI, and security feature folders remain inherited and outside
  this feature.
- Roadmap impact: none; no unfinished product work, ordering, or entry
  condition changes.
- Use-case impact: none; the existing semantic-diff use case remains the
  regression contract and requires no behavior edit.
- README and CHANGELOG impact: none expected because this feature is internal
  quality hardening with no externally observable change.

## Open Questions

- None for intake. Planning must obtain the current authoritative Qlty Cloud
  finding inventory and map every issue to a cohesive, independently
  reviewable remediation before requesting approval.
