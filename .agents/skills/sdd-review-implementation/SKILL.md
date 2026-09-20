---
name: sdd-review-implementation
description: Review one completed vscode-ajsbutler SDD implementation slice for scope, regressions, architecture, compatibility, validation, and production readiness.
---

# SDD Review Implementation

## Purpose

Review the final diff and evidence for exactly one approved implementation
slice. Report actionable findings or a Ready verdict.

## Minimum Context

Read `AGENTS.md`, `docs/specs/README.md`, the selected feature's `SPECS.md`,
`TASKS.md`, and `TRACEABILITY.md` when present. Inspect the approved slice,
final diff, changed symbols, tests, validation output, and relevant desktop
and web entry points.

Keep the selected feature and slice fixed. Stop when the feature, approved
scope, comparison base, or completion evidence is ambiguous.

## Review Criteria

Check the final change for:

- approved slice scope, acceptance criteria, and diff minimality
- behavior regressions, missing tests, and weak or misleading validation
- desktop and web extension compatibility
- `engines.vscode` drift and unsupported VS Code APIs
- Node-only assumptions in shared or web paths
- parser internals leaking into UI components
- domain/application/presentation/infrastructure boundary violations
- telemetry privacy and application-catalog event constraints
- qlty findings, complexity, performance, dependencies, and readability
- `Solution Shape` preservation: semantic owner/package, responsibility,
  public names, contracts, dependency direction, tests where applicable,
  relevant capability, and the separate port/adapter/factory assessments
- qlty baseline/final comparison using the identical command and
  configuration, with new/worsened findings separated from unchanged
  unrelated baseline findings and metric-only movement treated as a review
  signal
- failure modes, diagnostics/fallback behavior, large or malformed input
- JP1/AJS definition-file compatibility
- README/docs and CHANGELOG impact using the repository SSOT
- `TRACEABILITY.md` validation result and implementation feedback
- durable-document changes against the Durable Documentation Gate

## Solution Shape Review

Compare the final diff with the approved `Solution Shape` for every material
new or retained abstraction. Verify semantic owner and package/layer for each
material decision, invariant, translation, lifecycle, public name, contract,
dependency, and applicable test; concrete responsibility and boundary value;
public names, contracts, dependency direction, and tests where applicable; and
the relevant framework, library, platform, or established repository
capability. Keep the port, adapter, and retained application-factory checks
separate. Accept a port for dependency inversion and/or a host-neutral contract
without requiring adapter duties; require an adapter's applicable isolation,
translation, error normalization, lifecycle, compatibility, or test-boundary
responsibility; and reject a same-request/same-response forwarding wrapper
without port-contract value. A custom-gap justification is needed only for a
proposed custom mechanism, and framework use must remain at the outer boundary.
Confirm automatic architecture-test evidence is not presented as proof of
reviewer-only judgments. Compare qlty baseline and final using the identical
command/configuration and finding identity, listing new or worsened findings
separately from unchanged unrelated baseline findings. If the final diff changes
the owner/package, contract/dependency direction, framework-versus-custom
decision, abstraction/responsibility, affected surface, risk, validation, or
approval boundary, return it for Replanning rather than treating it as an
implementation fix.

## Review Workflow

1. Confirm the selected slice and its required approval evidence in `TASKS.md`.
2. Compare the final diff to the exact approval boundary and acceptance.
3. Inspect direct and transitive references needed to assess architecture,
   desktop/web, parser, telemetry, and compatibility impact.
4. Re-run only the relevant validation when evidence is missing or a finding
   requires it; do not modify files to make a check pass.
5. Classify every concern as an actionable Finding or explain why it is not a
   finding.

## Output Contract

Return one of:

```md
## Implementation Review

- Verdict: Ready | Findings
- Slice:
- Scope:
- Acceptance:
- Validation:
- Compatibility:
- Production Readiness:

## Findings

- [P1/P2/P3] file:line — evidence and concrete fix

## Next Step

- Ready: return completion evidence and the recommended completion-gate route
  to Main.
- Findings: return the exact fixes and validation requirements to Main for
  routing to the implementation procedure.
```

`Ready` means no actionable finding remains. It is not Completion Approval and
does not authorize a commit. Do not conceal an unresolved risk or turn a new
design/scope decision into an implementation fix.

## Completion Approval Handoff

After `Ready`, return the full evidence package to Main. Only after explicit
human approval is recorded for the exact completed slice may Main delegate
`approval-committer` with gate type `completion`. Return Findings to Main for
routing to `implementer`; return a new scope or design decision to Main for
Planning or Replanning. This procedure does not invoke or spawn another
lifecycle role.

## Rules

- keep the review evidence-based
- do not broaden the approved slice or invent a design decision
- preserve `engines.vscode`, desktop/web behavior, architecture boundaries,
  and telemetry privacy
- use `docs/specs/README.md` as the SSOT for validation and documentation gates
