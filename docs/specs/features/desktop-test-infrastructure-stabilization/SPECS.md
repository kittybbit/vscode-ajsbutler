# Feature Specification: Desktop Test Infrastructure Stabilization

## Purpose

Make the existing Desktop test suite reproducible through the documented
repository command in ordinary development environments, without manual
executable, alias, or development-define wrappers. Preserve test failures as
visible results and distinguish bootstrap failure from test-case failure.
Simplify the related Web test command/configuration path around one canonical
developer-facing `test:web` command while preserving browser-host coverage.

## Source

- Feature ID / slug: `desktop-test-infrastructure-stabilization`.
- Feature kind: roadmap.
- Origin: user Feature Intake request, 2026-10-11.
- Scope decision: the user permitted excluding the memory issue when it did
  not recur; Main excluded memory/OOM repair after the bounded run did not
  reproduce the popup. The prior symptom is not considered resolved.
- Additional source: user request to explain and simplify the separate Web
  test build/entry and `test:web` path; Main selected canonical `test:web`,
  redundant wrapper/preparation removal, and retention of necessary browser
  bundling/runtime entries.
- Roadmap owner and source: Test-harness maintainers,
  [Desktop Test Host Bootstrap](../../roadmap.md#desktop-test-host-bootstrap).
- Existing contributor contract: [Desktop checks](../../../../CONTRIBUTING.md#desktop-web-and-browser-checks).
- JP1/AJS basis: preserve existing JP1/AJS3 behavior; no new parameter or
  command semantics. The architecture's normative JP1/AJS3 version 13 target
  remains unchanged.

## Requirements and acceptance

- AC-1 — Desktop Test Bootstrap: the documented `pnpm test` command prepares
  the existing suite and launches the intended VS Code Extension Host.
- AC-2 — Dependency Resolution: the supported execution path resolves the
  VS Code executable and Electron entry point and loads the existing
  TypeScript aliases and development defines consistently before affected
  test files and cases use them.
- AC-3 — No Temporary Wrapper: contributors do not manually add executable,
  alias, or define wrappers or rely on undocumented environment setup.
- AC-4 — Test Result Integrity: the full existing Desktop suite reports its
  result and returns failure for failed cases or infrastructure failure.
  Bootstrap, test-file loading, and test-case failures are distinguishable.
  Known Table Shell failures may remain visible; they are not acceptance
  evidence for successful bootstrap until the host actually executes cases.
- AC-5 — Compatibility: retain `engines.vscode: ^1.75.0`, support for VS Code
  1.75, browser-safe shared production code, the Web test execution path, and
  the zero-exception architecture dependency catalog.
- AC-6 — Reproducibility: ordinary documented setup and the Desktop command
  permit repeat execution, using a common supported path for local and CI
  execution. Record any host prerequisite and report unavailable execution
  distinctly from pass or fail.
- AC-8 — Canonical Web Test Path: contributors use `pnpm run test:web` as the
  canonical Web test command. Consolidate redundant wrapper entries and
  duplicate preparation where the existing host contract permits, preserving
  every existing Web scenario, failure reporting, CI production coverage,
  Desktop accessibility fixture, and any minimum Desktop smoke reuse selected
  by the reviewed plan. Document necessary internal bundle/runtime boundaries
  and their purpose. Do not remove browser-required bundling merely to reduce
  script or file count; justify retained support through the actual runtime.

## Decisions and impact

In scope are Desktop test startup, VS Code test-host bootstrap, Electron
entry-point resolution, alias and development-define consistency, test
configuration cleanup needed for that outcome, harness verification, and
Desktop contributor instructions.
Limited Web command/configuration simplification is also in scope: canonical
`test:web`, removal of unnecessary wrappers/duplicate preparation, and the
associated contributor/CI invocation path. This shares test-infrastructure
ownership with Desktop compatibility verification; no separate product
outcome or feature split is needed.

The existing browser smoke imports production modules and aliases. Plain
CommonJS TypeScript output is not itself browser-ready. Browser bundling and
the host-facing runtime `run` entry may remain when necessary; removing the
one-line export wrapper does not imply removing the smoke assertions or their
bundle. The shared Web test configuration also owns the Desktop browser
accessibility fixture, whose coverage must remain intact.

Use the existing test infrastructure where sufficient. Keep environment
configuration outside product behavior and prefer a single owner for Desktop
startup. Planning must evaluate the actual runner and its capabilities before
choosing a solution; a new runner or broad migration is not presumed.

The related roadmap items
[Table Shell Host Failures](../../roadmap.md#table-shell-host-failures) and
[Expanded Flow Graph Golden Alignment](../../roadmap.md#expanded-flow-graph-golden-alignment)
are independent outcomes. The inherited WebAPI feature has no overlapping
ownership. Existing product use cases remain behavior contracts, not harness
implementation instructions. No new durable product use case is required.

## Compatibility

Do not raise the minimum VS Code version or leak test-host dependencies into
Domain, Application, Presentation, or shared production code. Keep Desktop
and Web bundles and test paths compatible. Add no architecture exceptions.
If compatibility cannot be retained, stop and route the reason, affected
surface, and alternatives through Main for Replanning and new approval.

Dependency updates are limited to those necessary for this feature. Prefer
stable versions subject to VS Code 1.75 and Desktop/Web compatibility;
Planning must verify versions before selecting updates.

## Non-goals

- Repairing abnormal memory consumption, OOM, or the historical macOS
  application-memory shortage symptom. Non-recurrence does not prove repair.
- Repairing the seven known Table Shell failures or React update-depth loop.
- Repairing the expanded Flow Graph golden mismatch.
- Adding product features or changing Semantic Diff or Parser semantics.
- Deleting or disabling tests, weakening expectations, or hiding failures.
- Changing product code unnecessarily to make the Desktop suite pass.
- A wholesale runner migration or unrelated dependency modernization.
- Removing browser-required bundling or reducing Web/CI/accessibility coverage
  to simplify command names.

## Open questions

No unresolved product decision blocks the Bootstrap plan. Normal permitted
host execution reached the complete existing suite; the sandbox SIGABRT is
an execution-environment limitation, not a confirmed runtime defect.
VS Code 1.75, clean official-command setup and Web/CI coverage remain required
implementation validation. A product compatibility failure requires Main's
Replanning decision before product or dependency changes.
The plan selects canonical Web invocation with a retained internal prepared
path for CI production artifacts, direct smoke bundling without the one-line
export wrapper, and additional minimum Desktop host reuse of that bundle.
Browser bundling and SDK runtime entries remain necessary support boundaries;
The approved S1 boundary and its implementation evidence are recorded in TASKS.md.

Prior OS memory-pressure causality remains unknown and is outside this
feature's acceptance. Non-recurrence is not repair proof. If the symptom
recurs, Main must make a new scope decision before memory repairs are included.
