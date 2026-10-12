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
- **R7 Compatibility and readiness:** preserve the historical approved Node
  `>=22` execution boundary until a complete renewed replan is approved. The
  pending development/CI Node24 proposal below retains pnpm `10.33.0`, VS Code
  `^1.75.0`, desktop/web/parser/CSV/list/flow/WebAPI/diff/telemetry contracts,
  existing build permissions and patch behavior. Relevant builds, boundary
  tests, architecture, packaging, qlty and security checks must pass or expose
  an explicit blocker before dependency completion.

## Decisions and non-goals

The feature includes an independently valuable development Node24 correction
slice, followed by the atomic dependency-remediation slice and final published
verification. Node correction requires no new/adverse audit findings against its
exact baseline; retained baseline vulnerabilities remain explicit blockers for
remediation and the unchanged feature no High/moderate gate. Exact
package/version bounds and edit paths are in
`TASKS.md`; incompatible upgrades, product adapters or new edit paths require
Replanning and renewed approval. Existing production packages are not upgraded
speculatively. Necessary security exceptions may remain; zero overrides is not
an acceptance shortcut that permits a vulnerable or incompatible graph.

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
The user permits Node24 as a planning option. Main proposes development/CI
Node `>=24.18.0` with standard Prism CLI `5.16.0`, permitting supported sibling
resolution and conditional removal of three Prism pins. This proposal changes
only development prerequisites/CI, preserving VS Code `^1.75.0` and browser
contracts. Exact paths, validation and renewed approval gates are in `TASKS.md`.
Neither Node24 nor this CLI upgrade resolves the unpatched braces route. The
separate Node correction slice preserves this finding; dependency-remediation
readiness and feature exit require its resolution. No security exception is
inferred. Exact replan review, approval and commit gates precede execution.

## Evidence limits

Historical 17-alert identities are recoverable from Git history. Planning's
live open-alert observation establishes concrete security floors, not final
publication/closure. Registry metadata establishes candidate support constraints,
not proof that installation, generated resolution or regression checks succeed.
