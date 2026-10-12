# Feature Specification: Dependabot Post-Publication Verification

## Purpose and source

Resolve vulnerable dependency paths through suitable direct dependency upgrades,
minimize exceptional overrides, and verify the complete GitHub Dependabot result
once the resulting dependency graph reaches the default branch.

- Kind: roadmap feature, expanded by the user's dependency-remediation request.
- Origin: [Dependabot Post-Publication Verification](../../roadmap.md#dependabot-post-publication-verification).
- Selected slug: `dependabot-post-publication-verification`.
- Repository/default branch: `kittybbit/vscode-ajsbutler`, `main`.
- Automation is configured by the user separately and excluded from this feature.
- Operational dependency work; no JP1/AJS3 semantics change.

## Requirements and acceptance

- **R1 Published graph identity:** identify default-branch SHA, dependency-input
  hashes and GitHub graph evidence before baseline and final alert observations.
  Record ingestion/snapshot limitations and refresh drift; local audit alone
  cannot establish GitHub publication or alert resolution. For the three exact
  published-lock alias tuples bounded in `TASKS.md`, allow separately identified
  commit-pinned published-lock coverage alongside honest GitHub edge omissions;
  additional gaps remain blockers. This does not prove GitHub ingestion or
  Dependabot evaluation of omitted relationships.
- **R2 Complete alert coverage:** retain authenticated all-state, all-page
  current/historical results, known prior IDs, additional/new IDs, query
  parameters/times, status and completeness evidence. Successful empty results
  must differ from denied, unavailable or partial results.
- **R3 Explicit dispositions:** map every returned/known alert to observed
  identity, package/manifest, advisory, fix information where supplied, state
  and evidence-backed disposition. Absence or version changes do not prove a
  fixed state; do not attribute causality without evidence.
- **R4 Unresolved ownership:** return remaining/new affected alerts and missing
  verification evidence to Main with security/tooling ownership and concrete
  decisions. Do not dismiss or waive findings. Complete verification may retain
  owned unresolved risks; incomplete required evidence blocks completion.
- **R5 Direct upgrades first:** update the approved direct dependency candidates
  in `package.json` when they provide an appropriate supported dependency graph;
  refresh compatible transitive resolutions with pnpm. Meet the selected alert
  security floors, prevent newly introduced vulnerable paths, and preserve
  extension/tooling behavior. Do not add unused direct transitive packages merely
  to force resolution or perform blanket latest-version upgrades.
- **R6 Minimal justified overrides:** evaluate each existing override against
  actual parent ranges and the regenerated graph, removing redundant entries
  and narrowing necessary exceptions. Retained exceptions need their parent
  path, advisory/compatibility reason, removal condition and security/tooling
  owner. Regenerate `pnpm-lock.yaml` with pnpm; never hand-edit resolutions.
- **R7 Compatibility and readiness:** retain completed Node `>=24.18.0`,
  standard Prism CLI `5.16.0`, CI24.x, pnpm `10.33.0`, VS Code
  `^1.75.0`, desktop/web/parser/CSV/list/flow/WebAPI/diff/telemetry contracts,
  existing build permissions and patch behavior. Relevant builds, boundary
  tests, architecture, packaging, qlty and security checks must pass or expose
  an explicit blocker before dependency completion.

## Decisions and non-goals

Completed baseline and Node24 slices precede independently valuable fixable
remediation2A, blocked residual2R and published verification3. Slice2A meets the
eight-family floors, permitting only exactly matched pre-existing braces among
High/moderate findings; no new/adverse exposure or lower-severity regression.
Its completion proves fixable risk reduction and bundled artifact compatibility,
not security cleanliness or complete feature outcome. Slice2R and feature exit
retain no High/moderate without waiver. Exact package/path/validation bounds are
in TASKS; unsupported fixes require reviewed Replanning. Reduce overrides only
with generated graph/security/compatibility proof; never hand-edit resolutions.

No GitHub Actions/Dependabot remediation automation, auto-merge, alert mutation,
release,
authentication/keychain mutation, generated parser/fixture update, runtime
redesign, VS Code minimum increase or inherited WebAPI feature change.
README/CHANGELOG/use-case/architecture edits are excluded: dependency work
preserves externally observable extension behavior. Feature Exit assesses the
roadmap done condition and durable ownership separately.

## Standard-tool constraint

Custom mechanisms such as development startup scripts, wrappers or native
watchers are prohibited in principle by the user. The unapproved custom Prism
launcher proposal is withdrawn. Investigate existing standard CLI/tool solutions
only; preserve the mock workflow contract and unchanged no High/moderate gate.
Completed Slice N implements the approved development/CI
Node `>=24.18.0` with standard Prism CLI `5.16.0`, with supported sibling
resolution and three proven redundant Prism pins removed. That slice changes
only development prerequisites/CI, preserving VS Code `^1.75.0` and browser
contracts. Exact paths, validation and renewed approval gates are in `TASKS.md`.
Neither Node24 nor this CLI upgrade resolves the unpatched braces route. The
completed Node correction preserves this finding; residual Slice2R readiness
and feature exit require its resolution. Fixable Slice2A uses the bounded
residual rule and actual bundled artifact gates in TASKS. No security exception
is
inferred. Exact replan review, approval and commit gates precede execution.

## Evidence limits

Historical 17-alert identities are recoverable from Git history. Planning's
live open-alert observation establishes concrete security floors, not final
publication/closure. Registry metadata establishes candidate support constraints,
not proof that installation, generated resolution or regression checks succeed.

## Packaging comparison

Unmodified N baseline keeps its observed single inherited test-tooling inclusion
as a negative result; final VSIX must exclude that exact tooling entry and all
developer/source/test dependencies. Both actual baseline/final integrity,
production-resource closure and isolated-host checks remain mandatory. The narrow
one-line ignore/path renewal in TASKS does not relabel baseline failure as pass
or waive any security gate.

## Packaged Chromium evidence boundary

Standard test-web serves exactly two isolated development-extension children:
unchanged actual product VSIX and a distinct minimal verification Web extension
whose nested test URI selects standard browser host routing. Require scanner IDs,
testing-runtime worker observation, product browser routing/actual activation and
behavior, full product pre/post archive hashes and HTTP payload/resource matching.
Desktop remains artifact-only root. No helper/source/npm fallback in product,
production hooks or invented worker identity; injected cases stay distinct.
Baseline/final Chromium need new actual proof; both prior failures remain negative.
