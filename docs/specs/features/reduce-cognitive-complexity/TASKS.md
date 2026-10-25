# Feature Tasks: Reduce Cognitive Complexity

## Active CI correction: S2 table integration timing

- Lifecycle state: SLICE_APPROVED; additive corrective commit is next.
- Trigger: the unchanged table-shell multi-action integration case exceeded
  Mocha's default 2,000 ms in PR #346 and #348. Failed-job reruns reproduced
  the same timeout. Logs and same-head passing runs remain in the ignored
  integration evidence directory; no blind retries remain.
- Authority: the original human-approved P1 S2 test boundary and its
  deterministic Correction Loop. The requested CI repair adds no scope,
  product behavior, dependency, or validation-strategy change.
- Base / PR: `cef970312b72575ad05bb610485248f2d9cad9e9`, #345 in native
  stack #349. The original S2 implementation and later source layers retain
  their independent reviews and completion approvals.
- Exact corrective paths: `src/test/suite/tableShellIntegration.test.ts`,
  `docs/specs/features/reduce-cognitive-complexity/TASKS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md`.
- Acceptance and correction: keep all observable-state waits and every
  search/detail/reveal/focus/navigation assertion. This case now has a local
  10,000 ms Mocha ceiling because its four sequential `waitFor` calls can
  outlast the default 2,000 ms test ceiling. No assertion or wait predicate
  changed.
- Solution Shape: validation-only test timing adjustment; product ownership,
  architecture, runtime behavior, compatibility and privacy contracts are
  unchanged.
- Validation: the final captured local `pnpm run test:full` attempt failed at
  web-test setup with `ETIMEDOUT` to `150.171.110.129:443`; the web assertions
  did not run in that attempt. Its desktop stage passed 1,021 tests with zero
  failures, including this case in 1,031 ms. Reuse the passing web step from
  current S2 CI run `40421191854`: its web runtime, harness, fixtures and
  bundle inputs are unchanged by this desktop-only test edit. Preserve the
  local wrapper failure separately from the reused web pass.
- Quality evidence: Qlty 0.645.0 check SARIF scanned the same 635 paths on
  baseline and final; both completed with the same two existing findings and
  no added result. Smells SARIF scanned the same 374 paths and returned 118
  records on each snapshot. One mapped `similar-code` actual value differed
  on the unchanged `nls.ts` / `unitInformationLocalization.ts` pair; a repeat
  of the identical baseline command changed the same value, establishing
  unchanged-input measurement instability. Preserve all three records for
  independent review. Full metrics remain 4,161 cognitive / 4,385 cyclomatic;
  the final-snapshot `pnpm run qlty` aggregate passed.
- Readiness: implementation complete; independent implementation review and
  explicit corrective Completion Approval remain pending. Main owns commit
  and native restack gates. Merge is not approved.
- Evidence index: `/Users/jconee/git/vscode-ajsbutler/node_modules/.cache/reduce-cognitive-complexity-evidence/s2-ci/index.md`.
- Material risks: the captured local web setup failure and Qlty unchanged-input
  measurement instability are retained for reviewer judgment.

## S2 CI correction Completion Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-27.
- Approved scope: the reviewed three-path S2 correction and focused additive
  commit. Exact paths: `src/test/suite/tableShellIntegration.test.ts`,
  `docs/specs/features/reduce-cognitive-complexity/TASKS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md`.
- Review: implementation-reviewer Ready; no actionable Findings. All four
  waits and every assertion remain unchanged. One integration case has a
  bounded 10,000 ms Mocha ceiling; product timing contracts are unchanged.
- Reviewed base: `cef970312b72575ad05bb610485248f2d9cad9e9`; patch SHA-256:
  `ca972d3ffc971efd096a4b87371375437a208a18f26673e5f4e8bd44b8e49973`.
- Evidence: `index.md` under
  `/Users/jconee/git/vscode-ajsbutler/node_modules/.cache/reduce-cognitive-complexity-evidence/s2-ci`,
  SHA-256 `7e28b19255623e576596b41289688fd3fc51ff002a03087ed8b361272a51c04f`.
- Validation: accepted desktop stage passed 1,021 tests; the local full wrapper
  failed only at web setup with ETIMEDOUT. Exact-input web, production build
  and minimum-host CI reuse was independently verified. The retained initial
  Qlty measurement variation has an unchanged-input controlled repeat; its
  direction is unreliable. Aggregate and metadata checks pass.
- Commit: pending focused additive commit by Main. Main verified
  reviewed patch/evidence and empty index. Gate metadata is separately checked.
- Integration: Main will follow the user's native restack instruction, verify
  all layer contents and current-head CI/Cloud results. Merge is excluded.

## Active Cloud correction: S1

- Lifecycle state: SLICE_APPROVED; additive correction commit is next.
- Trigger: PR #344 Qlty Cloud reports prettier formatting on TRACEABILITY.
- Approved boundary: original P1 S1 approval and the Correction Loop authorize
  this deterministic format repair. Changed paths are only `TASKS.md` and
  `TRACEABILITY.md`; no product, test, configuration, or acceptance change.
- Acceptance: normalize the reported TRACEABILITY formatting; preserve S1
  behavior and all R1-R9 requirement mappings/results.
- Validation: qlty formatting and changed-surface documentation checks Pass.
  Reuse original S1 code, test, type, build, full SARIF, and metric evidence
  because product and analyzed-code inputs are unchanged. See corrective
  evidence at `/private/tmp/vscode-ajsbutler-s1-cloud-evidence/s1-cloud.md`.
- Identity: correction base is original committed S1 head
  `8b293446b5fe5d5f0b7676cf4406a43744c47766`; full patch and file identities
  are recorded in the corrective evidence.
- Branch / PR: `codex/reduce-cognitive-complexity`,
  `https://github.com/kittybbit/vscode-ajsbutler/pull/344`.
- Readiness: independent implementation-reviewer Ready, no Findings.
  Correction Completion Approval is explicit; additive commit remains pending.
- Risk: no product compatibility or privacy impact; current-head Cloud status
  must be observed after the correction is committed.
- Publication: five prepared stack branches and draft PRs were explicitly
  approved in the current conversation, 2026-10-25. Merge is not approved.

- Correction Completion Approval: Approved.
- Approved at: approved in current conversation, 2026-10-25.
- Approved scope: the reviewed two-file corrective patch and focused additive
  S1 commit. Reviewed patch SHA-256:
  `d3bd40db5e550fb71cff083c019b7bf6059aa8f1b7d6ef9332e2a869ef9f5de7`.
  Evidence SHA-256:
  `3aea9c931d65910d98f6c6c54205c0cfdfefedf459dbc5402db489e4cd263f01`.
  Exact paths: `docs/specs/features/reduce-cognitive-complexity/TASKS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md`.
- Commit: pending. Main verified reviewed patch/evidence and empty index;
  Ready/approval metadata is separately validated.

## Agent Brief

- Purpose: satisfy [R1-R9](SPECS.md#requirements-and-acceptance) through actual
  decision/state simplification with existing viewer behavior preserved.
- Active or approved slice: S3 Completion Approval is recorded; commit is next.
- Read: [specification](SPECS.md), [discovery](#discovery), Solution Shape and
  the selected slice below, [traceability](TRACEABILITY.md), validation/evidence
  policy. D1/V1 remain valid for their unchanged intake facts and inputs.
- Next: S3 focused commit, then approved S4 implementation.
- Prohibit cosmetic splitting, behavior/API changes, metric configuration or
  selection changes, architecture exceptions and inherited-feature edits.

## Current state

- Lifecycle state: SLICE_APPROVED
- Plan identity: P1, Planning Mode, 2026-10-24; SHA-256 content identities of
  all three feature documents are supplied in the planner handoff.
- Feature kind: transient branch feature; selected: `reduce-cognitive-complexity`.
- Branch: `codex/reduce-cognitive-complexity-tree`; feature base: `main` at
  `6894f9ddfee566b5d2f3207a821ca5168e94022f`.
- Next decision: commit approved S3, then S4; no design blocker.
- Gate evidence: independent plan-reviewer returned Ready for approval with no
  Findings. Human Approval of P1 S1-S5 and the planning commit was explicit in
  the current conversation. Planning commit is complete. S1 and S2 are
  implemented and committed. S3 is independently reviewed Ready after its
  coverage correction; S4-S5 remain PLANNED. See
  [review record](#independent-plan-review).

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Human Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-24.
- Approved scope: reviewed P1, S1-S5 and common validation below, plus focused
  planning commit. Each slice still requires its independent completion gate
  before any dependent slice begins.
- Approved paths: exact product/test/support paths enumerated in S1-S5 below;
  the three selected feature documents for planning and the explicitly listed
  TASKS/TRACEABILITY metadata paths during implementation. No other paths.
- Plan review / plan commit: Ready for approval (P1) /
  `924d46ed1270e2206f93c7fb85114aacb8ddc87f` by Main; S1 implementation
  record follows the selected slice.
- Staged check: Pass (`git diff --cached --check`, exit 0); exact three-file
  planning scope inspected, Markdown lint Pass, unrelated index entries absent.
- Completion Approval: S1 and S2 approved and committed; S3 approved after Ready.
- Closure Approval: not requested; Feature Exit has not occurred.

Apply [Human Approval](../../README.md#human-approval) and the
[commit policy](../../README.md#approval-gated-commit-policy).

## S3 Completion Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-25.
- Approved scope: reviewed seven-path S3 patch and focused commit; no other slice
  or path. Completion paths:
  `src/presentation/webview/editor/shared/useUnitTreeSelectorFocus.ts`,
  `src/presentation/webview/editor/shared/useUnitTreeSelectorKeyboard.ts`,
  `src/presentation/webview/editor/shared/unitTreeFocusModel.ts`,
  `src/test/suite/unitTreeSelector.test.ts`,
  `src/test/suite/accessibilityDom.test.tsx`,
  `docs/specs/features/reduce-cognitive-complexity/TASKS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md`.
- Review: independent implementation-reviewer Ready, no remaining Findings.
  The P2 coverage correction is resolved by collapsed-request, delayed DOM
  registration and consumed-revision replay tests. Production is unchanged
  from the prior semantic review; valid product checks were reused.
- Reviewed complete patch against `143eaf2e8ae05de22bb5f161df664e17b6533aea`:
  `/private/tmp/vscode-ajsbutler-s3-evidence/s3-corrected-complete.patch`, SHA-256
  `4bac1d7a2ba34fdd24dc00066cb7dd929f388af5c705b99bb22a619898bc348d`.
  Product/test patch SHA-256:
  `f3d086621b5d0da52bc4ed74c6bc09a2cee0ae2187dcfcdb6d57936bdb7c4bda`.
- Evidence: `/private/tmp/vscode-ajsbutler-s3-evidence/s3.md` and
  `s3-corrected-file-hashes.txt` in the same directory. The reviewer verified
  current seven-file hashes and the corrected evidence; no product check was
  rerun during review.
- Commit: pending. Main verified reviewed content plus Ready metadata,
  retained evidence access and empty index before recording this approval.
  No acceptance, scope or product/test content changed.

## S2 Completion Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-25.
- Approved scope: reviewed eight-path S2 patch and focused commit; no other slice
  or path. Completion paths:
  `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`,
  `src/presentation/webview/editor/ajsTable/useTableGridFocus.ts`,
  `src/presentation/webview/editor/ajsTable/useTableGridKeyboard.ts`,
  `src/test/fixtures/accessibilityDeepTreeBrowser.tsx`,
  `src/test/suite/accessibilityDom.test.tsx`,
  `src/test/suite/tableShellIntegration.test.ts`,
  `docs/specs/features/reduce-cognitive-complexity/TASKS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md`.
- Review: independent implementation-reviewer Ready, no remaining Findings.
  F1 is resolved: the header handoff retains its originating cell, and the
  integration test checks actual focus and the sole Tab stop after H/Escape.
- Reviewed complete patch against `8b293446b5fe5d5f0b7676cf4406a43744c47766`:
  `/private/tmp/vscode-ajsbutler-s2-evidence/s2.complete.patch`, SHA-256
  `7492485dbafc0fc308503281f9b78819a0fd6a2e9959ab7b1d7de60899759ff3`.
  Product/test patch SHA-256:
  `8826901a9d4cd2658036c5e4ea36034dad94ca18c595e4dc813e2229b00bd523`.
- Evidence: `/private/tmp/vscode-ajsbutler-s2-evidence/s2.md`, approved-path
  hashes and `review-f1.final.snapshot.identity.txt` in the same directory.
  Evidence index SHA-256:
  `db634ffb189b159f80d913aefac7bd83ad512eab9b53af3f8fbd65be0c64c987`.
  The reviewer reused valid checks and reviewed the complete corrected layer;
  no product check was rerun during review.
- Commit: `143eaf2e8ae05de22bb5f161df664e17b6533aea` by Main; staged
  `git diff --cached --check` Pass, exact eight-path scope inspected, metadata
  qlty format and Markdown lint Pass, unrelated index entries absent. Reviewed
  content and retained evidence matched; no product check rerun.

## S1 Completion Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-25.
- Approved scope: exact reviewed S1 product, test and two feature-record
  paths listed below; no other slice or path.
- Review: independent implementation-reviewer Ready, no remaining Findings.
  Reviewed diff against `924d46ed1270e2206f93c7fb85114aacb8ddc87f` has SHA-256
  `47100be38797ec1a190490e88496cad5683b9adde1638c79c413b01e607ee241`.
- Evidence: `/private/tmp/vscode-ajsbutler-s1-evidence.d9FjJV/s1.md`, SHA-256
  `872e5891a6e6878b9763aabddbc2d31bbd0ed0dbfdbaa3b3e1dba51532c2eaa5`.
  Prior semantic, Solution Shape, compatibility and validation results reused;
  re-review confirmed inventories/statuses and corrected baseline count.
- Commit: `8b293446b5fe5d5f0b7676cf4406a43744c47766` by Main; staged
  `git diff --cached --check` Pass, exact four-path scope inspected, metadata
  Markdown lint Pass, unrelated index entries absent. Reviewed content and
  retained evidence matched before approval metadata; no product check rerun.

## Native Stack References

All PR URLs and head SHAs are pending actual creation; never treat planned
branch names as published references. Planning commit belongs to bottom S1.

<!-- markdownlint-disable MD013 MD060 -->

| Layer | Branch                                      | PR / head                                                     | Base                                                 |
| ----- | ------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| S1    | `codex/reduce-cognitive-complexity`         | absent / committed `8b293446b5fe5d5f0b7676cf4406a43744c47766` | `main` at `6894f9ddfee566b5d2f3207a821ca5168e94022f` |
| S2    | `codex/reduce-cognitive-complexity-focus`   | absent / committed `143eaf2e8ae05de22bb5f161df664e17b6533aea` | S1 `8b293446b5fe5d5f0b7676cf4406a43744c47766`        |
| S3    | `codex/reduce-cognitive-complexity-tree`    | absent / pending                                              | S2 `143eaf2e8ae05de22bb5f161df664e17b6533aea`        |
| S4    | `codex/reduce-cognitive-complexity-routing` | absent / pending                                              | committed S3 head                                    |
| S5    | `codex/reduce-cognitive-complexity-scope`   | absent / pending final head                                   | committed S4 head                                    |

<!-- markdownlint-enable MD013 MD060 -->

Main records actual predecessor base/head, reviewed layer diff, PR, commit and
CI references at each gate. S1-S5 are sequential; start each dependent slice
only after predecessor review, Completion Approval and commit. Keep planning
and closure within these PRs; no integration branch or integration-only PR.
Closure belongs to S5's final head. Merge requires separate exact-identity
Human Merge Approval and observed merge/check results for every feature PR.
Apply [native stacks](../../README.md#github-standard-stacked-pull-requests).

## Solution Shape and impact

- Semantic owners stay in their existing layers. Navigation rules own logical
  coordinates; grid hooks own UI focus lifecycle and keyboard interpretation;
  rendering consumes their handlers. Shared tree presentation owns tree focus
  policy. VS Code registration owns panel activity; application navigation owns
  JP1/AJS scope priority. No new ports, factories or cross-layer abstractions.
- S2 adds `useTableGridFocus` as one lifecycle owner for focus/selection intent,
  revision observation, pending DOM focus and roving Tab state. It earns its
  boundary by maintaining these invariants together. `useTableGridKeyboard`
  interprets owned keyboard actions and handoffs, rather than duplicating
  target narrowing and commit logic across event branches.
- React hooks, existing TanStack row/header data, TableVirtuoso scroll/ref
  facilities and current focus utilities remain sufficient. Custom code is
  limited to existing JP1/AJS viewer focus-versus-selection and handoff rules;
  no generic event/state framework or replacement virtualization is introduced.
- Roster lookup and target priority form a pure tree-focus policy, separated
  from React effects/DOM application; a local guarded-operation utility earns
  value only by removing repeated activity decisions, not forwarding requests.
- Direct impact: seven over-target functions in D1. Transitive impact: table
  sorting/filtering/visibility, details/tree return, shared list/flow tree,
  navigation, resource/save/export callbacks, errors and cataloged telemetry.
  Parser, CSV generation, imports and semantic diff remain regression surfaces.
- Public signatures, DTOs, messages, `engines.vscode` `^1.75.0`, telemetry
  privacy and layer direction stay unchanged. New hook interfaces are internal
  presentation types with explicit exported types; no consumers outside owner.
- Tests must demonstrate unchanged valid/error/boundary scenarios before the
  corresponding refactor. No behavior added/removed, test coverage reduced,
  dependency/configuration/generated output changed or exception introduced.
- Each slice records eliminated decisions/state duplication and official full
  file aggregate deltas. Extraction alone is insufficient even if per-function
  numbers improve. If metric acceptance is infeasible inside approved ownership
  or paths, return to Main for Replanning; do not waive it or ship a broken slice.

## Implementation Slices

Each subsection is one approved Human Approval boundary. Only the listed
product/test paths plus `docs/specs/features/reduce-cognitive-complexity/TASKS.md`
and `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md` may change
in that slice. No unrestricted test-support allowance: fixtures, harness,
configuration, snapshots and generated outputs are excluded unless named.
All slices apply [common validation](#common-validation-and-evidence).
Independent review and Completion Approval/commit are required for each.

### S1: Unify table movement rules

- Lifecycle state: SLICE_COMMITTED. Dependency: approved/committed P1.
- Value: one coordinate movement policy removes repeated axis calculations and
  bounds decisions for visible columns and logical rows.
- Product: `src/presentation/webview/editor/ajsTable/tableNavigationModel.ts`.
- Tests: `src/test/suite/tableNavigation.test.ts`.
- Design: encode directional row/column offsets and Home/End endpoints as
  movement rules; clamp each changed axis once. Keep header/cell transitions
  explicit, including Ctrl+Home/End priority. Share calculations, not redundant
  wrapper branches; preserve original-focus identity on unchanged movement.
- Acceptance: changed functions <=14; full cognitive aggregate decreases and
  cyclomatic aggregate does not increase from committed predecessor.
  All existing pure exports and navigation decisions retain semantics.
- Validation: before refactor, fill missing table cases for every key family,
  Ctrl+Home/End, zero rows/columns, no sortable header, invalid current identity,
  first/last row/column, page size <=0 and same-focus identity. In particular
  header Ctrl+Home currently matches Home's first-header branch; preserve it.
  ArrowUp from first data row enters its column header; PageUp stays data.
- Risk: normalizing key rules can accidentally reorder special cases. No UI,
  DOM, renderer, controller or interaction-policy changes in this slice.

#### S1 implementation record

- Solution Shape: per-origin movement tables select axis operations, while
  shared axis resolvers apply clamping once. Explicit transition resolvers
  preserve ArrowUp-to-header and Ctrl+Home priority; target resolvers apply the
  selected cell or header result once. This replaces repeated key-specific
  coordinate branches rather than moving them into wrappers.
- Result: all functions in `tableNavigationModel.ts` are cognitive complexity
  <=12. The full qlty selection decreased from cognitive 4,260 to 4,217 and
  cyclomatic 4,406 to 4,385. The model file decreased from cognitive 115 to 72
  and cyclomatic 82 to 61. `tableNavigation.test.ts` now characterizes key
  families, Ctrl precedence, endpoints, empty axes, invalid focus, page-size
  clamping, and unchanged-focus identity. Existing navigation behavior is
  retained by those boundary assertions and the full regression suite.
- Validation: full desktop/web tests, zero-exception architecture test, type
  check, desktop/web/editor build and VS Code 1.75 smoke all passed. See the
  evidence record at `/private/tmp/vscode-ajsbutler-s1-evidence.d9FjJV/s1.md`.
  The canonical refreshed baseline/final qlty `--all` check SARIF has five and
  two findings respectively. Three baseline findings are absent in final: qlty
  prettier-format findings on TASKS and TRACEABILITY, and a markdownlint-format
  finding on TASKS. The other two are
  unchanged findings in `.github/ISSUE_TEMPLATE/pull_request_template.md` and
  `src/test/suite/index.ts`. No adverse result remains in changed paths. The
  baseline and final `check --all --sarif --no-fix --no-cache` observations
  each exit 1. An earlier cached baseline artifact reported four and is
  superseded by the canonical refreshed SARIF.
  Their isolated official invocation inventories include `targetPaths` and
  `targetsCount`. Baseline and final `smells --all --sarif --no-snippets`
  observations each exit 0 and trace two 372-file passes. Exact statuses,
  path inventories, SARIF, logs and identities are indexed in the evidence
  record. The required aggregate command passed.
- Readiness: independent implementation review Ready, no remaining Findings.
  Completion Approval and the S1 commit are recorded. Evidence is bound
  to the immutable
  substantive snapshot; this implementation record is a separate metadata
  annotation.

### S2: Consolidate virtualized table focus lifecycle

- Lifecycle state: SLICE_COMMITTED. Dependency: S1 committed.
- Value: one lifecycle and one keyboard interpretation remove duplicated reset,
  mounted/pending focus, target narrowing and selection-commit decisions.
- Product paths:
  `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`,
  `src/presentation/webview/editor/ajsTable/useTableGridFocus.ts` (new),
  `src/presentation/webview/editor/ajsTable/useTableGridKeyboard.ts` (new),
  `src/presentation/webview/editor/ajsTable/tableNavigationModel.ts`.
- Test/support paths: `src/test/suite/tableVirtualizationFocus.test.ts`,
  `src/test/suite/tableShellIntegration.test.ts`,
  `src/test/suite/tableNavigation.test.ts`,
  `src/test/suite/accessibilityDom.test.tsx`,
  `src/test/fixtures/accessibilityDeepTreeBrowser.tsx`.
- Design: focus hook owns current/return/pending target, DOM roster and intent
  refs; common reset operation clears the matching state for document change,
  external selection and unmount while preserving their distinct return-focus
  and revision semantics. Common DOM application handles mounted and newly
  registered pending targets; unmounted cells retain existing scroll behavior.
- Keyboard hook resolves a typed action with its valid cell/header target once;
  a shared commit path handles H/L/D/Enter handoffs. Preserve child-event
  ownership, Enter activation/default suppression, header Escape return,
  unmodified shortcuts and provisional navigation without committing selection.
  `VirtualizedTable` keeps data derivation, rendering and Virtuoso integration.
- Acceptance: `VirtualizedTable` and all new/changed functions <=14; total metric
  gate passes including new files. One Tab entry, stable identity restoration,
  grid focus notifications, sticky-column reveal and scroll scheduling persist.
- Validation: targeted suites above before/after; DOM cases cover keyboard vs
  pointer selection, child actions, deferred mount, document revision reset,
  external selection reset, sorting/filtering/hidden columns, header return,
  details/tree handoff and unmount. Extend the existing real Chromium fixture
  for an unmounted grid target when mocked virtualization cannot demonstrate it.
- Risk: callback/effect ordering can cause stale selection or duplicate commits.
  Keep render-time revision reconciliation behavior; do not introduce asynchronous
  state dispatch or a new state library. Renderer/header contracts are excluded.

#### S2 implementation record

- Solution Shape: `useTableGridFocus` owns the grid's focus lifecycle, revision
  resets, pending DOM target and scroll/reveal behavior; `useTableGridKeyboard`
  resolves typed operations and performs the applicable handoff or selection
  commit. `VirtualizedTable` retains data derivation, rendering and Virtuoso
  integration. The hooks own distinct table responsibilities rather than
  forwarding work through generic wrappers.
- Result: the unified focus lifecycle removed repeated reset and mounted versus
  pending DOM-application decisions. Typed keyboard operations resolve their
  target and commit choice once, removing repeated target narrowing and commit
  branches while preserving child-event ownership, Enter activation, unmodified
  shortcuts, header Escape return intent and provisional navigation. The original
  scroll-left equality guard remains to avoid interrupting an active smooth
  scroll. A duplicate optional-target guard was removed where the focus operation
  already handles an absent target as a no-op. A regression test covers clearing
  saved header-return state when no restoration target can be resolved. The
  review correction carries the originating cell separately from the header
  navigation target and saves it before moving focus to the header.
- Header-return regression: the official pre-fix suite failed only the new
  assertion after pressing H from a non-first-row cell and Escape on the actual
  active header. The corrected test confirms focus and the sole grid tab stop
  both return to that exact originating cell.
- Metrics: qlty 0.645.0 on the unchanged full selection reduced cognitive
  complexity from 4,217 to 4,161 and kept cyclomatic complexity at 4,385.
  `VirtualizedTable` and both new hooks together decreased from 129/61 to 73/61
  cognitive/cyclomatic file complexity; all changed and new functions are <=14.
  The final full check SARIF has zero added and two removed results; neither
  remaining result is in S2 product or test paths. Final smells SARIF has zero
  added and four removed results.
- Validation: after the review correction, `pnpm run test:full` passed
  (1,021 desktop tests, zero-exception
  architecture checks and WEB suites); `pnpm exec tsc --noEmit`,
  `pnpm run build`, `pnpm run test:desktop:min` (VS Code 1.75), and the required
  `pnpm run qlty` aggregate passed. The full qlty check scanned 635 paths and
  exited 1 on two existing findings (zero added, two removed); the full smells
  scan traced 374 paths in two passes, with 118 results (zero added, four
  removed). The
  baseline smells repeat matched the original baseline; a prior adverse smells
  observation on a superseded pre-correction snapshot is retained, unaccepted,
  and was not waived. See `/private/tmp/vscode-ajsbutler-s2-evidence/s2.md` for
  snapshot identities, complete patch hash, statuses, inventories and SARIF.
- Readiness: independent implementation-reviewer Ready, no remaining Findings.
  S2 Completion Approval and commit are recorded. S3-S5 have not started.

### S3: Deduplicate shared tree interaction

- Lifecycle state: SLICE_APPROVED. Dependency: S2 committed at
  `143eaf2e8ae05de22bb5f161df664e17b6533aea`; the independent implementation
  review is Ready after resolving the missing collapsed-request and delayed
  DOM-row coverage. S3 completion approval is recorded; commit is pending.
- Value: one Escape path and one visible-row focus policy remove repeated
  modifier tests, scans and fallback/request decisions in both viewers.
- Product paths:
  `src/presentation/webview/editor/shared/useUnitTreeSelectorFocus.ts`,
  `src/presentation/webview/editor/shared/useUnitTreeSelectorKeyboard.ts`,
  `src/presentation/webview/editor/shared/unitTreeFocusModel.ts` (new).
- Test/support paths: `src/test/suite/unitTreeSelector.test.ts`,
  `src/test/suite/accessibilityDom.test.tsx`,
  `src/test/fixtures/accessibilityDeepTreeBrowser.tsx`.
- Design: build one visible-ID roster per visible row set, apply current then
  selected then first priority via a shared candidate policy; request targets
  wait until visible rather than falling back prematurely. Keep pending DOM
  application and request revision consumption explicit. Consolidate unmodified
  Escape into selector capture; remove the duplicate row interpretation while
  preserving capture from child controls and excluding targets outside treeitems.
  Interpret remaining actions once, with expand/collapse as one state operation.
- Implementation result: `unitTreeFocusModel.ts` owns the visible candidate,
  explicit request-target and fallback-restoration decisions. The focus hook
  remains the only lifecycle owner for roving rows, pending DOM focus and request
  revisions. Keyboard handling keeps row ownership, selector Escape capture and
  action execution as separate operations; action callbacks are selected once by
  navigation action, and handled default suppression still occurs when no action
  is available. No markup, expansion/scroll owner or navigation action changed.
  The correction changes tests only and keeps this Solution Shape unchanged.
- Metrics: qlty 0.645.0, unchanged configuration and full selection. The exact
  S2 predecessor-to-S3 snapshot reduced aggregate cognitive complexity from
  4,161 to 4,133 and cyclomatic complexity from 4,385 to 4,374. Focus and
  keyboard file totals fell from 37/25 to 20/16 and from 30/25 to 14/12
  cognitive/cyclomatic; the new policy file is 5/11. The named hooks are
  cognitive 13 and 0, and every changed/new measured function is <=14; new
  operation helpers are <=4. The check SARIF retained the same two existing
  results (zero added); smells fell from 118 to 114 with no new model, helper or
  test-path result. See the S3 evidence index for exact inventories and hashes.
- Acceptance: both named hooks and new/changed functions <=14; total metric gate
  passes. Preserve single roving row, focus without selection, Enter vs Space,
  expansion waiting, revision ordering and current/selected/first fallback.
- Validation: after correction, `pnpm run test:full` passed 1,027 desktop tests,
  the zero-exception architecture checks, Chromium DOM tests and WEB-12/14/15/7/8
  smoke checks. It refreshed test compilation and both browser test bundles.
  Existing `pnpm exec tsc --noEmit`, `pnpm run build` and
  `pnpm run test:desktop:min` (VS Code 1.75.0) results are reused because the
  correction changes only tests and the approved metadata; product, host,
  configuration and dependency inputs are unchanged. The focused DOM assertions
  cover empty and late-visible rosters, collapsed requests remaining pending
  through expansion, requests whose target row is not yet in the DOM map, request
  revision consumption, focus retention and nested child controls. The delayed
  row test re-evaluates the row set after the DOM node is registered; it adds no
  observer or polling. Existing real-browser deep-tree focus coverage passed.
  Fresh corrected-snapshot Qlty scans retain two unchanged CHECK results and 114
  smell results with no finding on the corrected test paths. Corrected totals
  remain 4,133 cognitive / 4,374 cyclomatic; the final aggregate passed. Exact
  commands, statuses, inventories and identities are in the S3 evidence index.
- Risk: visible roster identity and effect ordering can consume requests early.
  Navigation action meanings, expansion state/scroll owner, selector markup and
  DTOs are excluded from edits; use their existing contracts.
- Readiness: independent implementation-reviewer Ready, no remaining Findings.
  Explicit S3 completion approval is recorded; commit is pending. S4 and S5 remain
  unstarted.

### S4: Unify registered viewer activity guards

- Lifecycle state: PLANNED. Dependency: S3 committed.
- Value: repeated panel-active checks become one registration-local guarded
  execution policy without suppressing existing routing errors.
- Product: `src/presentation/vscode/webview/viewerMessageRouting.ts`.
- Tests: `src/test/suite/viewerMessageRouting.test.ts`.
- Design: use a typed local guarded-operation helper for registration callbacks,
  preserving callback arguments, return values and `this` behavior. SAVE guard
  remains inside the deferred callback, returns false when inactive, and keeps
  onSave absent when unsupported. Do not guard the entire message dispatcher:
  direct `createViewerMessageHandler` behavior, malformed-SAVE and missing-save
  notifications must remain unchanged. Preserve optional callback lookup timing.
- Acceptance: registerViewerPanel and changed/new functions <=14; total metric
  gate passes; errors, resource/ready/navigation safety, disposal and telemetry
  retain current activity timing and privacy behavior.
- Validation: before/after routing tests for active/inactive callbacks,
  invalid SAVE, unsupported save, deactivation between receipt and execution,
  sync/async callback and notification failures, disposal and telemetry failure.
  Include direct handler calls to distinguish registration-only guards.
- Risk: a broad early return could silence errors; a captured optional callback
  could alter invocation timing. Store/lifecycle ownership and bootstrap edits
  are excluded. Host-boundary tests and desktop/web checks remain required.

### S5: Simplify application flow-scope resolution

- Lifecycle state: PLANNED. Dependency: S4 committed.
- Value: candidate selection and one result conversion replace repeated
  available/unavailable branches while making existing scope priorities clear.
- Product: `src/application/navigation/resolveNavigationTarget.ts`.
- Tests: `src/test/suite/revealUnit.test.ts`,
  `src/test/suite/flowScopeState.test.ts`.
- Design: select the job-group descendant candidate separately; otherwise keep
  direct condition-parent priority, then nearest jobnet ancestor, then eligible
  self fallback. Convert a chosen candidate to a result once, after preserving
  cycle failures. Retain iterative traversal, document cache and ordering;
  do not unify different ancestor traversals or alter the initial cycle check.
- Acceptance: all functions in the existing full qlty selection <=14, including
  moved/new functions; per-slice and original-base full aggregates meet R2.
  Navigation DTOs, expansion order, failure codes/messages remain identical.
- Validation: direct resolver tests for document-order root-jobnet descendants,
  no descendant, direct condition parent, nested nearest ancestor, self fallback,
  missing parent/target, and cycles taking precedence over possible scopes;
  flow-state tests confirm revealed unit and expanded ancestors.
- Risk: candidate simplification can hide cycle precedence. Domain/parser,
  graph construction, caches and public result types are excluded from edits.

## Common validation and evidence

- Before each behavior-sensitive change, execute relevant existing coverage and
  add missing boundary tests within that slice. Then run `rtk pnpm run
test:full` (desktop regression suite, zero-exception architecture dependency
  tests, real Chromium DOM fixture, web smoke), `rtk pnpm exec tsc --noEmit`,
  `rtk pnpm run build` (desktop/web/editor production bundles), and
  `rtk pnpm run test:desktop:min` (VS Code 1.75.0 smoke). These existing runners
  provide required coverage without editing their harness/configuration.
- Every slice uses comparable full-repository qlty 0.645.0 baseline/final
  disposable snapshots and unchanged configuration/selection/exclusions.
  Run `rtk proxy qlty metrics --all --functions --no-upgrade-check` and
  `rtk proxy qlty metrics --all --no-upgrade-check`; retain complete native
  tables, exact commands and official file aggregates. Match all added/moved/deleted
  paths and include tests/fixtures and new functions in the selected inputs.
  Do not use function sums as the file aggregate or hide moved complexity.
- Strict slice gate: official full file cognitive aggregate decreases,
  cyclomatic aggregate does not increase; changed/new functions <=14. S5 adds
  all-functions <=14 and original-base vs final aggregate acceptance (D1 is
  discovery; full evidence must substantiate baseline comparability).
- Follow [qlty procedure](../../validation.md#execution-procedure): complete
  baseline/final `rtk pnpm exec qlty check --all --sarif --no-fix` and
  `rtk pnpm exec qlty smells --all --sarif --no-snippets`, all four SARIFs,
  inventories/counts, statuses and matching identities. No new or reliably mapped
  adverse finding; final `rtk pnpm run qlty` aggregate Pass. If formatting changes
  content, sync only approved paths and rebuild/reobserve until stable.
- Evidence artifacts/logs/cache stay outside analyzed inputs and are readable
  through review/approval/closure. Bind base/head/content manifests, dependency
  and configuration hashes, raw commands/statuses and approved/changed paths
  under [evidence policy](../../evidence.md#identity-and-required-facts).
  Reuse matching evidence; changed coverage/base/content invalidates only affected
  checks. The full feature baseline remains the original base, not the last slice.
- Record architecture test separately from semantic Solution Shape review.
  Confirm no Node built-ins in shared production, unchanged minimum VS Code,
  APIs/messages/telemetry and dependency directions. Required failed/unavailable
  checks block Ready; no silent waivers or unrelated repairs.
- Each implementation review assesses actual removed duplication and ownership,
  behavior and metric evidence on exact predecessor/head layer diff. Correction
  within boundary follows policy; new scope/design/validation decisions return
  to Main for Replanning. No automatic test deletion to improve metrics.
- Every changed feature Markdown file: Markdown lint, local links/anchors,
  structure/traceability, state/approval provenance, scope and diff whitespace.

## Closure propagation and removal plan

- Feature Exit only after S1-S5 commits; reuse valid slice evidence and inspect
  aggregate acceptance, production readiness, current-head required CI and Qlty
  Cloud. Preserve the inherited WebAPI feature and its pending roadmap items.
- Durable Documentation Gate assessment: observable behavior and architecture
  rules stay unchanged; no reusable new contract requires propagation, and no
  CHANGELOG/README/roadmap/use-case edit is planned. If implementation exposes
  durable knowledge requiring an edit, Main must approve affected replanning
  before it enters the closure boundary.
- Planned removal paths only:
  `docs/specs/features/reduce-cognitive-complexity/SPECS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TASKS.md`,
  `docs/specs/features/reduce-cognitive-complexity/TRACEABILITY.md`.
- Feature-closer prepares retained evidence in existing feature PR records or an
  external closure artifact, including exact projected final snapshot, deletion
  identities, acceptance and gates. Do not retain the removed documents as history.
- A changed top-layer closure patch requires independent review Ready; only
  explicit Closure Approval permits Main's focused closure/removal commit on S5.
  Closure does not authorize merge. Main retains final PR order/heads, closure
  commit, separate Human Merge Approval, GitHub gates and all actual merge results
  outside removed files; state becomes CLOSED only after every PR is merged.

## Discovery

- Identity: D1, feature-author intake, 2026-10-24, base revision above; only the
  three selected feature Markdown files are added. Main supplied qlty discovery
  at the same unchanged base; product/configuration inputs have not changed.
- qlty 0.645.0 full-selection official file aggregates supplied by Main:
  cognitive 4,260; cyclomatic 4,406. These are discovery facts, not substitute
  baseline/final SARIF evidence for implementation.
- Above-target functions: `VirtualizedTable` 122, `moveCellFocus` 42,
  `useUnitTreeSelectorFocus` 37, `useUnitTreeSelectorKeyboard` 30,
  `moveHeaderFocus` 25, `registerViewerPanel` 18,
  `resolveFlowScopeUnit` 16.
- Owning production paths and official file aggregates (cognitive/cyclomatic):
  `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx` 129/61;
  `src/presentation/webview/editor/ajsTable/tableNavigationModel.ts` 115/82;
  `src/presentation/webview/editor/shared/useUnitTreeSelectorFocus.ts` 37/25;
  `src/presentation/webview/editor/shared/useUnitTreeSelectorKeyboard.ts` 30/25;
  `src/presentation/vscode/webview/viewerMessageRouting.ts` 40/21;
  `src/application/navigation/resolveNavigationTarget.ts` 82/41.
- Relevant discovered test surfaces: `tableNavigation.test.ts`,
  `tableVirtualizationFocus.test.ts`, `tableShellIntegration.test.ts`,
  `unitTreeSelector.test.ts`, `viewerMessageRouting.test.ts`,
  `flowScopeState.test.ts`, and `accessibilityDom.test.tsx` under
  `src/test/suite/`; the latter exercises tree/table DOM and a Chromium fixture.
  These are discovery inputs, not an approved exhaustive test-path boundary.
- Repository inspection confirms `engines.vscode` is `^1.75.0`; existing scripts
  expose desktop/web tests and build, qlty aggregate and Markdown lint.
- Overlap inspection: only the inherited `import-definition-via-webapi` feature
  is present. Its beta and reproducibility roadmap work remains outside scope.
  Existing unit-list, flow-exploration and cross-view use cases own behavior;
  no durable behavior-contract update is needed for this refactor.
- Discovery references: supplied Main metric observations; repository base
  identity; `package.json`; [roadmap](../../roadmap.md);
  [use-case index](../../../requirements/use-cases/README.md);
  [inherited feature](../import-definition-via-webapi/SPECS.md).

## Risks, assumptions and validation needs

- Focus behavior is asynchronous and virtualization can unmount the target.
  Preserve stable identity, focus/selection separation, revision guards,
  expansion waiting and pending DOM application; cover observable handoffs.
- Registered message guards and direct handler calls differ. A general early
  return could suppress existing invalid-SAVE/unavailable-handler notifications;
  deferred SAVE must still check current activity at execution time.
- Flow scope priorities and cycle results can drift under simplified control
  flow; retain branch-order-sensitive success and failure cases.
- File aggregates and function sums differ. Use official file aggregates and
  include destinations/new files to prevent complexity being moved out of view.
- Assumption: all areas serve one measured quality goal; no independent product
  outcome or feature split is needed. No existing behavior change is permitted.
- Future code validation must cover the specification's boundary cases,
  appropriate regression tests before implementation, type/architecture gates,
  desktop/web tests and builds, full comparable qlty observations, and final
  aggregate. Exact commands/paths and production readiness belong to planning.

## Intake Documentation Validation

- Record: V1; producer: feature-author; base: D1; coverage: only `SPECS.md`,
  `TASKS.md`, `TRACEABILITY.md` in this feature.
- Required checks: Markdown lint on all three paths, relative links/anchors,
  template structure, traceability, state/approval provenance, scope inspection
  and `rtk git diff --check`.
- Result: Pass. `rtk pnpm exec markdownlint-cli2
'docs/specs/features/reduce-cognitive-complexity/*.md'` reports zero errors
  for three files (markdownlint-cli2 0.22.0, markdownlint 0.40.0).
- Relative links/anchors and absence of unresolved template tokens: Pass using
  Python 3 `pathlib`/`re` validation of each local Markdown destination against
  file existence and heading-derived anchors. Scope/state/approval/traceability:
  Pass by inspection; only the selected intake is added, requirements map to
  validation needs, no slice or approval is asserted.
- `rtk git diff --check`: Pass, exit 0. New-file content is also included in the
  lint and local-link checks. Final SHA-256 identities accompany the handoff;
  this validation-result annotation is metadata, not a scope change.
- Product tests/builds/full qlty SARIF/aggregate: Not Applicable for intake-only
  documentation, per [changed-surface policy](../../validation.md#validation-by-changed-surface).
- Review / approval / commit: none; this intake grants no later gate.

## Planning Documentation Validation

- Record: V2; producer: planner, Planning Mode, plan P1; comparison base and
  unchanged discovery D1/V1 above. Scope: three selected-feature Markdown files.
- Checks: all-path Markdown lint, local links/anchors and required structure,
  exact path existence/new-path declarations, requirement/slice mapping,
  state/approval provenance, scope inspection and `rtk git diff --check`.
- Result: Pass. Markdownlint-cli2 0.22.0 / markdownlint 0.40.0 reports zero
  errors across all three files; local link/anchor/structure/path and
  scope/state/approval/traceability inspection Pass; diff whitespace Pass.
  Final SHA-256 identities accompany the handoff. This result annotation is
  metadata. No production/test/configuration mutation or commit.
- Product validation: Not Applicable to planning-document edits under
  [changed-surface policy](../../validation.md#validation-by-changed-surface).
- Execution exception: an unnecessary `qlty metrics --help` probe could not
  initialize its global log under sandbox permissions; no scan started or
  discovery was invalidated. Main's existing tool/metric observations are reused.

## Independent Plan Review

- Producer: independent `plan-reviewer`, 2026-10-24; result: Ready for approval,
  no Findings or blocking decisions. Transition: PLANNED to PLAN_READY.
- Reviewed substantive identity P1 at the comparison base above:
  SPECS SHA-256 `2a4fc4d3c04b41709f9e5c87582af8408e47e3060479f9e2af1231cbefdedc54`;
  TASKS SHA-256 `edef3b2ba2830e3e029c99a286b76d1cf01a036fc410fa1e1fd5fbf07b9e1841`;
  TRACEABILITY SHA-256 `794ae054dc3a96a27e62cc2d9a5b4c78fc6f4009ebb15ebf032682e272dc9021`.
- Evidence: D1, V1 and V2 reused; reviewer verified all three SHA-256 values
  and confirmed only this feature folder was untracked. Full specification,
  slices, Solution Shape, validation, traceability and stack/closure boundaries
  reviewed. No product checks, approval or commit asserted.
- Main recorded review/state metadata only after the review. This annotation
  does not change the reviewed substantive scope; Human Approval stays Pending.
