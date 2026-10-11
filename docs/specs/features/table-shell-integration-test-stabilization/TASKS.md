# Feature Tasks: Table Shell Integration Test Stabilization

## Agent Brief

- Purpose: establish current shell stability and resolve the historical issue
  disposition while preserving existing behavior.
- Active slice: approved verification-only V1; SLICE_APPROVED.
- Read: `SPECS.md`, this plan, `TRACEABILITY.md`, linked discovery, and SDD
  validation/evidence policies. No source repair is authorized by this plan.
- Next gate: focused completion commit; Completion Approval recorded.

## Current state and gate

- Lifecycle state: SLICE_APPROVED.
- Selected feature: `table-shell-integration-test-stabilization`.
- Branch: `docs/table-shell-integration-test-stabilization`.
- Fixed base: `8989609a325f5047b44294b66452790e228ef5a8`.
- Main decision: verification-only completion because current unchanged shell
  cases and full Desktop suite pass. Minimal repair is required only for a
  confirmed failure after an evidence-backed revised plan.
- Review: Ready for approval; no Findings. Human Approval recorded; planning
commit succeeded; V1 validation and independent Ready review recorded.
- Planning commit: `d17cd969fa23c824da5392f9125caf3b6c481e2f`;
  staged diff check passed, exact three approved paths, returned by
  `table_shell_plan_commit` in the current conversation.
- Reviewed substantive identity:
  `e6f1b1b2520dce23366855373d0c8bcbf454d134f8d2f97d72c044cca628ad79`.
- Independent reviewer: `table_shell_plan_review`; review returned to Main in
  the current conversation. Gate metadata validation:
  `/private/tmp/ajsbutler-table-shell-plan-20261011/main-review-gate.json`.
- Blocking decisions: none for this verification plan.

## Human Approval

- Status: Approved.
- Approved at: approved in current conversation on 2026-10-11.
- Approved scope: reviewed verification-only V1 below and its prerequisite
  focused planning commit. No product, test, configuration or dependency edits.
- Approved paths:
  - `docs/specs/features/table-shell-integration-test-stabilization/SPECS.md`
  - `docs/specs/features/table-shell-integration-test-stabilization/TASKS.md`
  - `docs/specs/features/table-shell-integration-test-stabilization/TRACEABILITY.md`
- Approval metadata evidence:
  `/private/tmp/ajsbutler-table-shell-plan-20261011/main-approval-gate.json`.

Apply [Lifecycle gates](../../README.md#lifecycle-and-approval-gates),
[Human Approval](../../README.md#human-approval), and the
[commit policy](../../README.md#approval-gated-commit-policy).

## Discovery and evidence

- Intake discovery:
  `/private/tmp/ajsbutler-table-shell-intake-20261011/evidence.json`;
  content identity `7b4b6f9709a608c30a35879bfd900aac5a970054a8c1367e46f282555d31cb10`.
  No duplicate feature; prior Desktop infrastructure work integrated at #334.
- Current discovery and seven-case ledger:
  `/private/tmp/ajsbutler-table-shell-plan-20261011/evidence.json`.
  Source/generated manifests, dependency metadata, exact commands, raw logs
  and host identity are retained alongside it.
- Fresh disposable compile and Desktop preparation passed. All seven unchanged
  shell cases passed in a focused Node run (7 passing) and the unchanged full
  Desktop suite (1200 passing, 19 seconds, host exit 0) on VS Code 1.141.0.
- No update-depth loop occurred. React act warnings remain visible; this plan
  does not remediate them. Historical failing logs are unavailable. Historical
  causes are unconfirmed; no causal attribution to #334 is claimed.
- The focused driver retains Desktop initialization and narrows only discovery
  in disposable compiled output. Full host discovery uses the unchanged suite
  entry and cached executable matching resolved stable 1.141.0. Download
  interruption, sandbox launch failure, and successful automatically reviewed
  escalation are recorded. These discovery drivers are evidence artifacts,
  not proposed repository harness changes.
- Architecture dependency gate passed as part of the full Desktop suite;
  semantic ownership and abstraction judgments require independent review.
- V1 now supplies repeated Desktop, Web, production build and minimum host
  evidence below. Matching preparation and first-launch evidence were reused.

## Solution Shape and impact

- One verification slice earns independent value: replace historical uncertainty
  with identified current stability evidence and reviewed residual disposition.
  There is no product change, new abstraction, framework or custom mechanism.
- Existing owners stay fixed: application owns list DTO meaning; presentation
  owns React state, search, selection, focus and rendering; the Desktop runner
  owns host setup, globals, aliases and cleanup. No layer or contract changes.
- Direct edits are selected feature records. Tests, runner, generated parser,
  bundles and dependencies are read-only validation inputs. Builds produce
  outputs only in exact disposable snapshots, never approved source edits.
- Transitive checks cover existing list/navigation/search/focus/detail/CSV
  boundaries through full Desktop execution, existing Web smoke and browser
  bundle/build paths, and minimum VS Code host smoke. No behavior is added,
  changed or removed; no privacy, JP1/AJS or telemetry payload change occurs.
- Established React, Testing Library, JSDOM, Virtuoso mock and VS Code test
  harness remain in use. No custom production lifecycle wrapper is justified.

## V1 — Confirm stable current behavior and reviewed disposition

- Slice lifecycle state: SLICE_APPROVED; order: first and only approved slice.
- Value: complete all R1–R7 with a reproducible seven-case ledger, bounded
  stability checks and Desktop/Web/minimum compatibility evidence.
- Dependencies: reviewed and approved plan, focused planning commit. Reuse
  current discovery when its inspected inputs, tools and coverage still match.
- Exact editable paths:
  - `docs/specs/features/table-shell-integration-test-stabilization/SPECS.md`
  - `docs/specs/features/table-shell-integration-test-stabilization/TASKS.md`
  - `docs/specs/features/table-shell-integration-test-stabilization/TRACEABILITY.md`
- Exclusions: all runtime/test/config/generated source, dependencies,
  `package.json`, lockfile, runner, fixtures, README, CHANGELOG, roadmap,
  inherited feature folders and unrelated repairs. No unrestricted wildcards.
- Acceptance: all seven retained cases pass in three independently launched
  full Desktop runs at one identified final input/dependency/host set. The
  current full run may count as launch one if identity matches; record order,
  names, warnings and statuses for every launch. All runs must pass; this is
  bounded repeat coverage, not retry-until-green. No skips, assertion weakening,
  warning suppression, timeouts or unrelated test repairs.
- Each case records contract-backed expectation, actual result/error, conditions
  and evidence; mark historical cause unconfirmed with unavailable-log reason.
  Investigate loop lifetime/order evidence; record non-reproduction and exact
  bounded coverage without treating absence as historical causal proof.
- Full Desktop, Web tests/build and minimum host checks must succeed. A residual
  unrelated failure requires exact baseline/classification, owner and explicit
  independently reviewed disposition through Main before readiness; it must
  not silently count as a pass. A newly failing shell case or loop stops this
  zero-code slice for evidence-backed Replanning, review and approval.
- Readiness: retain meaningful original coverage and unresolved risks; independent
  implementation review then Completion Approval and focused completion commit.
  No dependent slice starts before that gate; no Feature Exit performed here.

## V1 validation and evidence inputs

Use exact disposable source snapshots and the established package scripts.
Record full input manifests including source, configuration, lock/install
metadata and ignored generated inputs, tool/host versions, commands, exits,
raw logs and immutable final identity under the [Evidence Contract](../../evidence.md#evidence-contract).

1. `rtk pnpm run test:prepare:desktop` then
   `rtk pnpm run test:desktop:run` for three independent full-host launches.
   Reuse matching preparation/full-run evidence. Record actual default glob
   execution order and suite-owned DOM mount/cleanup conditions for loop checks.
2. `rtk pnpm run test:prepare:web` then `rtk pnpm run test:web:run`.
3. `rtk pnpm run build` for production Desktop/Web/editor bundles.
4. `rtk pnpm run test:desktop:min` for the established VS Code 1.75.0 smoke.
   This is host/API smoke, not seven shell cases in the minimum host; pair it
   with shared production builds and stable full-suite shell coverage.
5. Targeted Markdown lint for all three editable paths, local links/structure
   and `rtk git diff --check`, including untracked-file whitespace inspection.

Record existing list, navigation, search/controller, focus/accessibility,
column/detail/export and architecture suites covered by the Desktop run.
Maintain `engines.vscode: ^1.75.0`. Inspect unchanged browser-safe production
contracts and no new Node imports; source manifests establish no production
change. Architecture automation remains distinct from semantic review.

The changed surface is SDD coordination records only, so full-repository qlty
baseline/final scans and formatting aggregate are not required. If a repair
requires code, the revised plan must enumerate exact code/test paths and qlty
Quality Contract coverage before approval. Host/shared/config changes also
require the policy's additional independent review. No change to validation
coverage is silently inferred from an execution failure.

## V1 result and review handoff

- Result: IMPLEMENTED, verification-only; independent review pending. No runtime,
  test, configuration, dependency or durable documentation changes.
- Evidence: `/private/tmp/ajsbutler-table-shell-v1-20261011/evidence.json`;
  exact final patch/content identity is recorded there after documentation checks.
- Acceptance R1–R3: all seven named cases passed in three independent full
  VS Code 1.141.0 launches, each 1200 passing / zero failures / exit 0
  (19s, 17s, 16s). First launch and Desktop preparation reused after source,
  generated and installed dependency identity checks. No case deleted or skipped.
- R4/R6: full suite retained list/search/selection/navigation/focus/accessibility,
  detail/export and architecture boundaries; no residual assertion failures.
- R5: update-depth loop absent in all three default-order runs. Ledger records
  actual reporter order and suite-owned JSDOM setup, per-test cleanup and global
  restoration; component effect/callback lifetime facts are retained in evidence.
  Historical cause remains unconfirmed because original failure logs are absent.
- R7: Web preparation and Chromium Web smoke passed; production Desktop/Web/editor
  bundles built; established minimum VS Code 1.75.0 smoke passed (host exit 0).
  Minimum host/Web smoke are narrower than full Desktop shell interaction coverage.
- Existing React act warnings remained visible (28/28/29 in Desktop logs).
  Web exit 0 follows successful scenario markers and includes shutdown connection
  reset/premature-close diagnostics. Build performance warnings remain visible.
  No warning suppression or speculative remediation occurred.
- Execution exceptions: cached exact stable host driver avoided known sandbox
  startup crash; all GUI/browser runs used automatically reviewed escalation.
  Initial disposable Web copy omitted nested report sources; manifest-based
  restoration corrected the snapshot and final preparation passed. Raw failed
  output retained; no repository edit or coverage change. Details in evidence.
- Compatibility/readiness: `engines.vscode: ^1.75.0` unchanged; immutable production
  sources prove no new Node imports, contracts, telemetry or layer changes.
  Architecture automated gate passed separately from semantic review judgments.
  Existing framework/owners remain; no new abstraction or custom mechanism.
- Traceability updated with recorded results. Coordination-doc tier requires no
  qlty scans. No README/CHANGELOG update: observable behavior is unchanged.
- Next gate: independent implementation review of complete patch and evidence;
  Completion Approval and completion commit remain pending. No closure performed.

## Risks, durable impact and exit boundary

- One passing current environment does not prove historical cause or stability;
  three independent host launches provide bounded current confidence only.
- DOM/import timing, React transitions, callback lifetime and suite order remain
  possible historical influences, not diagnosed defects. No randomized-order
  redesign or warning-only remediation is authorized.
- Mock virtualization and Web smoke have limited interaction coverage; preserve
  existing browser accessibility/focus checks in the full suite and builds.
- Minimum smoke has narrower coverage than stable Desktop; report that limit.
- No behavior or public compatibility change: README/use cases/CHANGELOG need
  no update. Feature-closer owns eventual durable roadmap disposition at exact
  path `docs/specs/roadmap.md`, after Definition of Done and Closure Approval.
  Report current evidence without claiming the historical cause was resolved.
- Planning and V1 remain docs-only. Any approved code repair requires a dedicated
  `codex/...` branch rename before source work; current docs branch cannot cross
  the Verify allowlist.
- Exit readiness requires committed V1, R1–R7 acceptance and independently
  reviewed disposition, current-head global gates as applicable, and explicit
  closure path approval. Preserve the separate WebAPI feature and all unrelated
  roadmap concerns.

## V1 completion gate

- Independent review: Ready, no actionable Findings;
  `table_shell_verify_review`, returned in current conversation.
- Reviewed patch SHA-256:
  `6ce5f66275ae4ed6d356cefb186e1db7f46c2268888c56806ba92220480bbaf8`.
- Reviewed content identity:
  `1a3bf37eab69e4b6275e320df687998d5ecafab7cb140eaa1e16da37e818f3a1`.
- Completion Approval: Approved; approved at: approved in current conversation
  on 2026-10-11; commit: pending.
- Approved completion scope: verified V1 records and gate metadata only.
- Approved completion paths:
  - `docs/specs/features/table-shell-integration-test-stabilization/TASKS.md`
  - `docs/specs/features/table-shell-integration-test-stabilization/TRACEABILITY.md`
- No product or configuration edits are approved.
- Completion-approval metadata evidence:
  `/private/tmp/ajsbutler-table-shell-v1-20261011/main-completion-approval.json`.
- Review-gate metadata evidence:
  `/private/tmp/ajsbutler-table-shell-v1-20261011/main-review-gate.json`.
