# Feature Tasks: Expanded Flow Graph Golden Alignment

## Agent Brief

- Purpose: verify and reconcile the representative node-order golden while
  preserving the existing graph-order contract.
- Active or approved slice: none; discovery found no implementation work.
- Read first: `SPECS.md`, this file, and the linked intake and exit evidence.
- Validate: reuse matching focused discovery; validate changed documentation
  and closure surfaces under the SDD policy.
- Constraints / next decision: Main obtains current-head Qlty Cloud pass
  evidence, then routes Feature Exit again.

## Current state

- Lifecycle state: FEATURE_EXIT_READY.
- Next decision / blocker: current-head Qlty Cloud success evidence is missing;
  Main owns obtaining or verifying it.
- Exit entry: Main accepted the intake handoff and matching discovery evidence.
  There are zero implementation slices, no runtime/test/configuration diff,
  and no pending scope/design decision. The user's conditional-close request
  authorizes this zero-slice exit route; no planning or implementation gate is
  invented.
- Gate evidence: intake discovery only; no review, approval, or commit inferred.
- Branch: `codex/expanded-flow-graph-golden-alignment`.
- Base: `origin/main`, `c5422361fe3df763e8a13237f28746542b5471b0`.

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none; implementation is unnecessary.
- Approved paths: none.

The user's conditional-close request supplies routing intent, not Closure
Approval for a reviewed removal patch. Apply
[Human Approval](../../README.md#human-approval).

## Implementation Slices

None. Current source agrees with the existing golden. No implementation or
test-maintenance slice is justified for R1–R3. No TRACEABILITY.md is required
for this zero-slice intake; acceptance maps directly to discovery below.

## Intake discovery and validation

- Discovery identity: current product source at
  `c5422361fe3df763e8a13237f28746542b5471b0`; loaded-module SHA-256 manifest is
  retained with the evidence.
- Result: nine use-case tests pass, including representative node IDs
  `sibling, child, scope, nested-job, grand, leaf`.
- Coverage: R1 is the exact node-order assertion; R2 is existing deterministic
  request-order, relation, containment, subtree, highlight, recovery/condition,
  malformed, unavailable, deep and bounded-large cases; R3 is the no-change
  decision based on those results.
- [Evidence artifact](/tmp/ajsbutler-expanded-flow-intake/evidence.md): raw
  output and input/config/dependency identities. Focused discovery runs current
  TS source in memory; it is not desktop/web-host or type-check evidence.
- Documentation validation: retained in
  `/tmp/ajsbutler-expanded-flow-intake/documentation-validation.txt` and
  `documentation-inputs.json`; Markdown lint, local links/structure, and diff
  whitespace/scope checks cover SPECS.md and TASKS.md.
- Evidence exceptions or missing discovery facts: none.

Apply the [Evidence Contract](../../evidence.md#evidence-contract).

## Risks and ownership

- The roadmap's mismatch statement was stale for the inspected product
  revision; the exit patch removes that completed follow-up.
- No product surface is changed, so runtime compatibility and telemetry risk
  are unchanged. No additional implementation validation tier is introduced.
- No overlapping active feature owns this item. The inherited
  `import-definition-via-webapi` feature and other roadmap items are excluded.
- Durable use-case, README, and CHANGELOG impact: none; preserve the existing
  Build Flow Graph contract and user behavior.
- Main owns obtaining or verifying current-head Qlty Cloud success before
  routing Feature Exit again; do not infer success from absent status.

## Feature Exit review

- Review identity: current HEAD and `origin/main` are both
  `c5422361fe3df763e8a13237f28746542b5471b0`; the reviewed working-tree patch
  contains this feature's `SPECS.md` and `TASKS.md`, plus
  `docs/specs/roadmap.md`. No product files changed.
- Acceptance and traceability: R1–R3 are covered by the intake discovery above;
  all nine focused use-case tests pass, including the representative node-order
  assertion. The existing Build Flow Graph use case owns the reusable graph
  ordering contract; this feature adds no durable behavior specification.
- Integration, compatibility, and readiness: there are no implementation
  slices or product changes to integrate. Desktop/web, `engines.vscode`,
  parser, telemetry, and user-visible behavior remain unchanged. README and
  CHANGELOG updates are not warranted.
- Durable propagation: remove the stale
  `Expanded Flow Graph Golden Alignment` follow-up from
  `docs/specs/roadmap.md`; no other durable document needs an update. The
  selected feature folder is proposed for removal only in the later closure
  commit after Closure Approval.
- Risks and owners: the required current-head Qlty Cloud pass is unverified.
  Main owns obtaining read-only Qlty Cloud success evidence for this exact
  revision. GitHub's commit check-runs list only two successful CodeQL jobs;
  no Qlty Cloud result is present. The public Qlty project route resolves to a
  login page, so its result was unavailable to this review.
- [Feature Exit evidence](/tmp/ajsbutler-expanded-flow-intake/exit-evidence.md)
  records gate lookup and this review's patch identities and documentation
  validation.
- Recommendation: **Do not close** until the required current-head Qlty Cloud
  pass is evidenced and Feature Exit is rerun.
