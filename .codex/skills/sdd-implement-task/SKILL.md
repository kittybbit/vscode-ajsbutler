---
name: sdd-implement-task
description: Use when implementing exactly one approved vscode-ajsbutler SDD implementation slice from docs/specs/features/<feature>/TASKS.md after the feature plan has been created, reviewed, and human-approved, including baseline checks, scoped implementation, staged validation, production readiness gates, non-functional quality gates, readability and diff-minimality checks, TRACEABILITY.md updates, implementation feedback capture, knowledge propagation decisions, three independent self-reviews, applying review fixes, updating slice status after human completion approval, committing the work, and confirming a clean workspace. This skill must not plan new slices or change approval boundaries.
---

# sdd-implement-task

## Purpose

Implement exactly one planned, reviewed, and human-approved implementation
slice from feature `TASKS.md`. Do not plan new slices. Stop and return to
`sdd-plan-task` when the approved plan or approval boundary is no longer
sufficient.

## Preconditions

Read these first:

1. `AGENTS.md`
2. `package.json`
3. `docs/specs/README.md`
4. `docs/specs/plans.md`
5. the relevant feature `SPECS.md`
6. the relevant feature `TASKS.md`
7. the relevant use-case files under `docs/requirements/use-cases/`

Implementation may start only when feature `TASKS.md` records:

```md
## Plan Status

- Status: Approved | In Progress
- Review status: Reviewed
- Human approval: Approved

## Implementation Slices

### Slice <n>: <name>

- Status: Approved
- Approval Boundary: <human-approved slice boundary>
```

If approval is missing, stale, ambiguous, narrower than the required work, or
not tied to a specific slice, stop. Use `sdd-plan-task` for replanning or
`sdd-review-plan` for plan-quality review before implementation resumes.

## Replanning Boundary

Stop implementation and return to `sdd-plan-task` when:

- a new implementation slice is needed
- scope changes
- a new design decision is needed
- the approval boundary changes
- impact is wider than planned
- the approved slice cannot be validated as written
- feature completion must be evaluated

Do not solve these cases by silently editing `TASKS.md` into a new plan.

## Baseline Check

Before editing, record enough baseline context to distinguish new regressions
from existing problems:

- target slice
- approval boundary
- existing tests and nearest fast validation command
- known risks from `TASKS.md`, `SPECS.md`, and related use cases
- current quality issues in the touched area when visible from existing
  diagnostics, qlty output, tests, or code inspection

Do not expand scope to fix baseline issues unless they are required by the
approved slice.

## Implementation Workflow

1. Select exactly one approved slice from `TASKS.md`.
2. Confirm the slice scope, approval boundary, acceptance criteria, validation
   plan, dependencies, unresolved risks, and out-of-scope changes.
3. Perform the baseline check.
4. Enumerate affected references before editing:
   - direct files, symbols, commands, components, adapters, tests, and docs
   - desktop and web entry points
   - parser, application, presentation, infrastructure, and telemetry
     boundaries
   - transitive references when a public type, DTO, command, or use case
     changes
5. Implement only the approved slice in small meaningful blocks.
6. Add or update tests required by the approved slice when touching parser,
   list, flow, CSV, adapter, diagnostics, hover, telemetry, or user-visible
   behavior.
7. Run staged validation according to the validation strategy below.
8. Stop for replanning before editing outside the approved slice or making a
   new specification, compatibility, destructive, or design decision.
9. Run the required final validation through `rtk` before review.

## Validation Execution Strategy

Run validation progressively, balancing confidence and feedback speed:

1. nearest fast validation for the changed code
2. tests related to the approved slice
3. `rtk pnpm run qlty`
4. needed web tests
5. build

Use the full default validation order for meaningful code changes when the
slice risk justifies it:

```bash
rtk pnpm run qlty
rtk pnpm test
rtk pnpm run test:web
rtk pnpm run build
```

For docs-only changes, run `rtk pnpm run qlty`; add `rtk pnpm run lint:md`
when markdown structure or links need focused validation.

Avoid:

- running build after every small edit
- running validations in parallel when they are not independent
- repeating the same validation without a new relevant change
- running broad checks before a nearby fast check would catch obvious issues

Run only the validation needed for final confidence, and explain any skipped
expected check.

## Quality Gates

### Production Readiness

Before completion, verify:

- failure modes are handled intentionally
- user-facing errors, diagnostics, or fallback behavior are understandable
- existing JP1/AJS definition files remain compatible unless the approved
  scope intentionally changes compatibility
- large, malformed, or edge-case inputs do not cause avoidable slowdowns or
  crashes
- desktop and web behavior are both considered
- README or user documentation is updated only when user-facing behavior
  changes
- CHANGELOG update need is evaluated using `docs/specs/README.md`

### Non-Functional Quality

Before completion, verify the slice did not unnecessarily:

- add serious code smells
- worsen qlty metrics
- increase cyclomatic complexity
- add dependencies
- degrade performance
- introduce memory retention or unnecessary recomputation

If non-functional quality worsens, explain why the tradeoff is necessary and
within the approved scope.

### Readability

Prefer readable, maintainable implementation over clever compactness:

- use JP1/AJS and domain terminology in names
- keep control flow clear
- split responsibilities where it improves understanding
- preserve an understandable processing sequence

Do not optimize for line count, DRY-only extraction, generic abstraction, or
short code at the expense of clarity.

### Diff Minimality

Keep the diff necessary for the approved slice:

- no incidental fixes
- no unrelated refactors
- no unnecessary formatting churn
- no speculative future-proof abstraction

Every changed file should support the approved slice, its tests, validation,
or required documentation.

### User Impact

Before completion, state:

- user-visible changes, or that there are none
- compatibility impact, or that there is none
- desktop and web impact
- setting, definition-file, or JP1/AJS compatibility impact

## Implementation Feedback

Before asking for slice completion approval, capture only feedback that can
improve future planning or implementation:

- whether the slice boundary was appropriate
- estimation or complexity mismatch
- dependencies discovered during implementation
- validation improvements
- a better slice boundary discovered in hindsight
- planning investigation that was missing
- JP1/AJS knowledge discovered during implementation
- VS Code API or web/desktop differences discovered during implementation

Do not record ordinary work logs, temporary investigation notes, review
conversation, or resolved issue history as implementation feedback.

## Traceability

When the feature has `TRACEABILITY.md`, update the implemented slice's test or
validation result before completion approval. If no traceability update is
needed, state why.

The slice traceability entry should connect:

- Use Case
- Requirement
- `SPECS.md` section
- Implementation Slice
- Test file or validation result

## Knowledge Propagation

Evaluate implementation feedback for durable reuse. Propagate only knowledge
that passes the Durable Documentation Gate to the smallest appropriate durable
document, such as:

- use cases
- design guides
- development guides
- README
- AGENTS
- other cross-feature repository documentation

Feature-specific or temporary feedback should remain only in feature docs while
it is actionable, then disappear when the feature folder is removed.

## Durable Documentation Gate

Before updating durable docs, verify the knowledge:

- is reusable beyond this feature
- describes durable behavior, specification, design policy, or repository
  operating policy
- helps future planning or implementation
- does not duplicate another durable document
- is not a temporary investigation result
- is not implementation history
- is not review commentary
- is not a record of a resolved issue

Do not update durable docs just because implementation happened. Update them
only when leaving the knowledge out would make future work worse.

## Independent Reviews

After implementation and initial validation, review the work three times.
Each review must be independent:

1. Review pass 1: inspect the final diff against the approved slice scope,
   acceptance criteria, and architecture rules.
2. Review pass 2: start fresh from `TASKS.md`, related specs, and the final
   diff; do not refer to pass 1 results while finding issues.
3. Review pass 3: start fresh again; do not refer to pass 1 or pass 2 results
   while finding issues.

For each pass, look for:

- behavior regressions
- missing tests or weak validation
- desktop or web compatibility risk
- `engines.vscode` drift or unsupported VS Code API usage
- Node-only assumptions in shared or web paths
- parser internals leaking into UI components
- direct `vscode` imports outside extension, presentation, or infrastructure
  boundaries
- telemetry privacy issues
- non-functional quality regressions
- readability regressions
- unnecessary diff or out-of-scope edits
- unexplained user impact or compatibility impact
- production readiness gaps
- missing TRACEABILITY.md update or missing not-required reason
- missing implementation feedback that would improve future planning
- durable documentation updates that fail the Durable Documentation Gate
- out-of-scope changes

After all three passes, merge duplicate findings, apply required fixes, and
rerun the relevant validation.

## Completion Workflow

When implementation, reviews, fixes, and validation are complete:

1. Confirm completion criteria:
   - acceptance criteria are met
   - required tests are added or updated
   - validation is complete
   - non-functional quality is preserved or justified
   - readability is preserved or improved
   - the approved scope is not exceeded
   - unresolved risks are recorded
   - production readiness is confirmed
   - the implemented slice's test or validation result is reflected in
     `TRACEABILITY.md`, or a not-required reason is stated
   - implementation feedback is captured or explicitly unnecessary
   - reusable knowledge is propagated through the Durable Documentation Gate
2. Summarize changed files, validation, non-functional quality, production
   readiness, user impact, compatibility risk, implementation feedback,
   knowledge propagation, and any remaining follow-up:
   - Production readiness:
   - Failure modes:
   - Diagnostics / user-facing errors:
   - JP1/AJS compatibility:
   - Large or malformed input risk:
   - Desktop/web readiness:
   - README/docs impact:
   - CHANGELOG impact:
3. Ask the human to approve slice completion before updating `TASKS.md`.
4. After completion approval, update only the implemented slice status and
   plan state:
   - mark the slice `Status: Complete`
   - preserve remaining approved slices for continued implementation
   - set `Active implementation slice` to the next approved slice when one is
     ready
   - set plan `Status: Replan Required` only when a replanning trigger exists
   - keep follow-up, risk, validation caveat, and use-case back-propagation
     notes needed for later slices
   - remove work-log details that no longer affect future decisions
5. Commit the approved slice with a focused message.
6. Confirm `git status --short --branch` is clean.

## Rules

- Implement exactly one approved slice.
- Do not plan new slices.
- Do not broaden approved scope silently.
- Return to `sdd-plan-task` when replanning is required.
- Preserve non-functional quality unless a justified approved tradeoff is
  necessary.
- Preserve production readiness unless a justified approved tradeoff is
  necessary.
- Evaluate CHANGELOG update need using `docs/specs/README.md` as the Single
  Source of Truth.
- Prefer readability and maintainability over brevity, DRY-only extraction, or
  generic abstraction.
- Keep diffs minimal and tied to the approved slice.
- Capture implementation feedback only when it improves future planning or
  implementation.
- Apply the Durable Documentation Gate before updating long-lived docs.
- Preserve `engines.vscode` unless explicitly approved.
- Preserve desktop and web extension behavior.
- Keep domain independent of `vscode`, React, MUI, XyFlow, and webview code.
- Keep UI components consuming DTOs or view models, not parser internals.
- Keep telemetry minimal and free of file content, file paths, and personal
  identifiers.
- Prefer `rtk` for file inspection, search, git, GitHub, package scripts,
  tests, builds, and type checks.
- Use native commands only when `rtk` has no suitable proxy, exact raw output
  is required, or an `rtk` proxy fails.
