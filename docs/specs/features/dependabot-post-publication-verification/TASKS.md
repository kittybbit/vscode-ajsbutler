# Feature Tasks: Dependabot Post-Publication Verification

## Agent Brief

- Purpose: remediate vulnerable dependencies through suitable direct upgrades,
  reduce exceptional overrides, then verify the complete published GitHub result.
- Active/approved slice: Slice 1 implemented under the approved alias supplement;
  independent review is Ready and completion approved; commit is the next gate.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, evidence/validation policy.
- Constraints: exact paths/versions below; automation belongs to the user.
- Next decision: Slice 1 focused completion commit, then Slice 2 execution.

## Current state and gates

- Lifecycle state: SLICE_APPROVED.
- Selected feature/base: `dependabot-post-publication-verification`,
  `origin/main` at `27d2c1f5a1029cd73a1f0504bd4aa00419b0aef2`;
  this is the fixed comparison base.
- Branch: `codex/dependabot-post-publication-verification`.
- Trigger: Slice 1 found three genuine GitHub alias-edge omissions. Existing
  acceptance allows reporting limitations, but does not authorize accepting
  missing required coverage through another source. A narrowly supplementary
  published-lock strategy changes validation coverage and requires Replanning.
- Preserved gates: original Human Approval and planning commit remain evidence
  for their exact original scope. Slice 2 package/version/path constraints and
  all security/compatibility/quality checks are unchanged. No completed slices
  or Completion Approvals/commits exist; inherited WebAPI ownership is intact.
- Affected gates: the previous review/approval do not cover the new Slice 1/3
  alias-coverage strategy. Renew independent plan review and exact approval
  for this delta; do not rewrite the historical Human Approval below.
- Evidence: Slice 1 raw published inputs, graph/alert facts and identities are
  reused where matching. Old changed-document validation and the graph-coverage
  acceptance judgment are superseded; no raw graph omission becomes a pass.
- Next decision/blocker: Slice 1 completion commit; review is Ready with no
  actionable Findings or evidence blocker.
  Slice 2/3 execution remains dependency-gated.
- Planning commit: `cdb09c24ecf859fb0209dc23de658a6dd1c34cdc`;
  exact three planning paths and staged whitespace check passed.
- Plan review: `/tmp/ajsbutler-dependabot-plan-review.json`; reviewed identity
  `65fc1d07024b2a0035d63ceb47a2227d9cd65b59c26ccbd8cbbfcce1c56d159c`.

## Slice 1 Completion Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-10-12.
- Approved completed scope: the published baseline, all-state alert inventory,
  exact approved alias supplement and all 39 override inventories for Slice 1.
- Exact completion paths:
  `docs/specs/features/dependabot-post-publication-verification/TASKS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TRACEABILITY.md`.
- Independent implementation review: Ready, no actionable Findings;
  `/tmp/ajsbutler-dependabot-slice1-review.json`.
- Reviewed content identity:
  `826e5987fbb2e3b656f209d932d96bb58833ecbd55f7ec97b81cd9c8578e4004`.
- Reviewed patch SHA256:
  `5ec06b650658700e98307096b32cffc2b3844dafeea38a2a71cbaceda9804081`.
- Ready metadata validation:
  `/tmp/ajsbutler-dependabot-slice1-ready-metadata/record.json`.
- Completion approval metadata:
  `/tmp/ajsbutler-dependabot-slice1-completion-approval/record.json`.
- Commit: pending; this gate does not approve Slice 2 completion or publication.

## Alias-coverage Replan Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-10-12.
- Approved scope: only the published-lock supplement for the three exact alias
  edges and its Slice 1/3 coverage/freshness conditions below; no dependency,
  runtime, automation, compatibility, path or unrelated check change.
- Approved replan paths:
  `docs/specs/features/dependabot-post-publication-verification/SPECS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TASKS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TRACEABILITY.md`.
- Execution paths remain the historical approved Slice 1/3 paths below.
- Approval metadata: `/tmp/ajsbutler-dependabot-alias-approval/record.json`.
- Independent replan review: Ready for approval, no actionable Findings;
  `/tmp/ajsbutler-dependabot-alias-plan-review.json`.
- Reviewed plan identity:
  `65a0da3d866b4b41cae836a81055fab569f3672276ac5d9ebffc7abe2b9ca0f2`.
- Ready metadata validation:
  `/tmp/ajsbutler-dependabot-alias-ready-metadata/record.json`.
- Commit: `ea44dca2ef34dbf3f568d73a829ceeb1e3aea22c`;
  exact three paths and staged check passed; original plan commit is preserved.

## Human Approval

The following record is preserved historical approval for the exact original
plan committed at `cdb09c24ecf859fb0209dc23de658a6dd1c34cdc`.
It does not approve the alias-coverage changes proposed in this replan.

- Status: Approved
- Approved at: approved in current conversation on 2026-10-11.
- Approved scope: the independently reviewed three-slice plan below, including
  exact direct dependency candidate versions, override constraints, validation,
  exclusions and each slice's dependency/approval gates. Completion, closure
  and merge/publication approvals are not included.
- Approved planning paths:
  `docs/specs/features/dependabot-post-publication-verification/SPECS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TASKS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TRACEABILITY.md`.
- Approved Slice 1/3 execution paths:
  `docs/specs/features/dependabot-post-publication-verification/TASKS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TRACEABILITY.md`.
- Approved Slice 2 execution paths: `package.json`, `pnpm-workspace.yaml`,
  `pnpm-lock.yaml`,
  `docs/specs/features/dependabot-post-publication-verification/TASKS.md`,
  `docs/specs/features/dependabot-post-publication-verification/TRACEABILITY.md`.
- Approval metadata evidence: `/tmp/ajsbutler-dependabot-plan-approval/record.json`.

Apply [Lifecycle and approval gates](../../README.md#lifecycle-and-approval-gates).
Each slice needs independent implementation review, explicit Completion Approval
and a focused commit before a dependent slice begins. Merge/publication is a
separate Main/human action; no slice authorizes it.

## Solution Shape and impact

- Security/tooling maintainers own graph hygiene and exceptions; Main owns
  decision routing and gates. pnpm owns dependency resolution; GitHub owns its
  observed alert state. No custom resolver, collector, comparator or abstraction.
- Direct dependency edits affect development/build/mock/test/package tooling.
  Transitive graph effects can reach bundled production packages through override
  removal, so browser safety, architecture, parser/viewers, telemetry and both
  hosts require regression evidence. No layer ownership or dependency-direction
  change is intended; material abstractions and runtime/test edits are excluded.
- Existing tooling capabilities suffice. VSCE 4 is a proposed packaging-tool
  major upgrade, justified by dropping the vulnerable markdown-it/cheerio graph,
  not by general freshness. It requires Node 22 and changes keyring dependencies:
  test packaging without authenticating, publishing or changing build permissions.
- Architecture dependency tests provide mechanical catalog evidence only;
  semantic ownership, capability sufficiency and exception justification remain
  independent-review judgments.
- No product use-case change or user-facing changelog is expected. Durable edits
  and closure propagation remain outside this replan operation.

## Discovery and target bounds

Planning API observation on 2026-10-11 returned HTTP 200, 15 open alerts, no next
page. All affect `pnpm-lock.yaml`; this is a baseline discovery observation, not
an all-state final verification. Record source identities/times in the artifact.

<!-- markdownlint-disable MD013 -->

| Family | Alert numbers | Minimum security floor | Current direct-owner paths |
| --- | --- | --- | --- |
| fast-uri | 194, 196 | 3.1.7 | Prism/VSCE/webpack/Ajv |
| morgan | 197 | 1.12.1 | test-web → koa-morgan |
| markdown-it | 198 | 14.3.1 or eliminate vulnerable path | VSCE |
| undici | 200-203, 206-207 | 7.29.1 or eliminate vulnerable path | VSCE → cheerio |
| brace-expansion | 212, 213 | 5.0.12; 1.1.21 | ESLint/typescript-eslint/glob/Mocha/npm-run-all/minimatch |
| postcss-selector-parser | 216 | 7.1.6 | css-loader → postcss modules |
| source-map-js | 217 | 1.2.2 | css-loader → PostCSS |
| shell-quote | 218 | 1.11.0 | npm-run-all |

| Approved proposal candidate | Existing declaration | Proposed declaration/version boundary | Reason/support constraint |
| --- | --- | --- | --- |
| @vscode/vsce | ^3.9.2 | ^4.0.0, resolve 4.0.0 | Removes markdown-it/cheerio chain; Node >=22; CLI/package/keyring regression gate |
| css-loader | ^7.1.4 | ^7.1.5, resolve 7.1.5 | Supported Node22 same-major CSS graph upgrade |
| typescript-eslint | ^8.47.0 | ^8.71.1, resolve 8.71.1 | Current minimatch/lint graph; retains ESLint9 and TypeScript5.9 support |
| webpack | ^5.106.2 | ^5.111.1, resolve 5.111.1 | Supported same-major schema-utils/build graph upgrade |
| terser-webpack-plugin | ^5.4.0 | ^5.6.1, resolve 5.6.1 | Coupled supported same-major build/minifier graph |

<!-- markdownlint-enable MD013 -->

These are the only direct dependency keys proposed for edits; implementation
must justify each candidate by the actual generated path/security or redundant
exception benefit. Do not change unrelated packages or adopt later versions
silently. A candidate with no demonstrated benefit can remain unchanged with
recorded evidence. No direct production declarations, engines, packageManager,
scripts, extension metadata or contributed behavior may change.

Keep Prism 5.15.10: 5.16.0 requires Node >=24.18.0. Keep test-web 0.0.80 and
Playwright 1.59.1: test-web 0.0.81 introduces Playwright >=1.61 and would broaden
harness/cache decisions. npm-run-all remains 4.1.5; compatible shell-quote and
morgan resolution is preferred to a replacement script runner or unused direct
dependency. Existing parent semver permits transitive refresh when proven by
registry and lockfile; newer incompatible advisories return to Main.

All existing `pnpm-workspace.yaml` override entries are eligible for documented
redundancy removal/narrowing, without changing their purpose or introducing new
major coercion. Existing broad/cross-major entries (faker 5→10, uuid 8→11,
js-yaml, koa, serialize-javascript, undici) require special parent/API scrutiny;
removal must not restore vulnerable versions or silently change tested behavior.
Keep necessary exceptions with explicit rationale. Floor updates are bounded to
the eight affected families above within compatible parent major lines; no new
blanket overrides. Preserve `allowBuilds`, `ignoredBuiltDependencies`, workspace
membership, `patchedDependencies` and the existing postman patch file. If the
patch/permissions or additional paths need alteration, stop for Replanning.

## Published graph coverage: three exact alias-edge supplement

Apply this narrow rule to Slice 1 and Slice 3. It is a proposed validation
strategy, not a claim that GitHub publishes or evaluates the omitted edges.

- Require full npm package/version node coverage and all-state/all-page alert
  completeness as before. Reconcile every unique dependency/optional edge after
  alias-name and raw SPDX/purl normalization; retain the actual GitHub missing
  edge list, supported edges and source identities separately.
- The only eligible missing edges are `@isaacs/cliui@8.0.2` to
  `string-width@4.2.3`, `strip-ansi@6.0.1` and `wrap-ansi@7.0.0`, represented
  by `string-width-cjs`, `strip-ansi-cjs`, `wrap-ansi-cjs` in the pinned published
  lockfile. Eligibility is the exact parent/target/version/alias tuple, not a
  general exception for aliases, CJS packages, or any three missing edges.
- For each eligible edge still present in the target lockfile, retain the
  default-branch commit-pinned lockfile body/hash and exact parent snapshot,
  alias mapping, resolved target and target package/version. Confirm those
  parent/target nodes occur in the same GitHub export and bind both sources
  to the bracketing remote revision/dependency-input identity and interval.
  Local installed dependencies or an unmerged lockfile are not substitutes.
- Separate GitHub-observed edge coverage from published-lock supplementary
  coverage and its provenance. Completion uses their explicitly identified
  union for these exact tuples only. Never label supplemented edges as GitHub
  observed, claim exact ingestion SHA, or infer that Dependabot analyzed them.
- Record the remaining GitHub relationship/ingestion uncertainty, with
  security/tooling maintainer ownership and a Main handoff for any follow-up.
  Complete alert retrieval means complete observed API results, not a guarantee
  of detection for every lockfile relationship. No security-clean conclusion
  follows from the supplement or an empty result alone.
- After remediation, reconcile anew against the actual published target. If
  these tuples disappear or GitHub includes them, use normal coverage with no
  supplement. If the exact tuples still require it, refresh pinned proof for
  that target identity. Additional missing edges, changed tuples, missing
  nodes, unresolved targets or identity ambiguity block completion and return
  to Main; do not carry the baseline exception to other omissions.

Solution Shape is unchanged: existing GitHub observations and Git/pnpm lock
facts have separate owners and provenance; no new production mechanism or
abstraction. The material risk is partial GitHub edge visibility; the bounded
supplement exposes that risk rather than establishing complete GitHub ingestion.

## Slice 1: Establish published baseline and complete alert/override inventory

- Lifecycle state: SLICE_APPROVED.
- Value: a complete identity-backed baseline and path inventory for remediation
  and later comparison; no dependency edits.
- Edit paths: only this feature's `TASKS.md`, `TRACEABILITY.md`.
- Dependencies: approved/committed replan.
- Acceptance: retain remote default-branch SHA, hashes of package/workspace/lock
  and postman patch, GitHub graph export coverage and limitations; inspect current
  graph against all relevant manifest and transitive/override dependencies.
  A successful export alone does not establish the complete graph. Bracket
  observations with remote/dependency identities, refresh drift and record the
  observation interval; APIs do not guarantee an exact commit ingestion SHA.
  Apply the three-exact-alias supplement above only when its conditions hold.
- Obtain authenticated all-state/all-page Dependabot data and reconcile known
  historical 17 IDs (156-164,168-173,175-176), additional historical/current IDs,
  and the 15 planning IDs. Source of the 17-row snapshot is Git
  `97652aa1cf62a466e8255a4aee8ad369b0787db9` at the retired feature's
  `TRACEABILITY.md`; inspect PR/merge 317 for later sources. Include all historical
  results conservatively; missing known identities or incomplete history blocks
  complete coverage. Preserve each observed disposition without endorsing it.
- Inventory every existing override with parent path/range, resolved version,
  security/compatibility purpose, candidate upstream resolution, retention/removal
  condition and owner. Planning's installed `pnpm why` is a discovery hint; verify
  against pinned lockfile/registry before making removal claims.
- Validation: document checks below plus page/count/ID/provenance and complete
  override-inventory reconciliation. Missing required evidence returns a blocker
  to Main, not an assumed empty baseline.
- Readiness: independently reviewable baseline package; does not certify fixes.

## Slice 2: Upgrade direct tooling and minimize exceptional resolutions atomically

- Lifecycle state: PLANNED.
- Value: supported security-clean relevant dependency graph with fewer forced
  resolutions and clear necessary exceptions.
- Edit paths exactly: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`,
  this feature's `TASKS.md`, `TRACEABILITY.md`. Runtime/tests/generated files,
  workflow/configuration beyond these paths and patch contents are excluded.
- Dependencies: Slice 1 review Ready, Completion Approval and commit.
- Scope: candidate direct keys/versions and all-existing-override assessment above;
  regenerate lockfile with pnpm 10.33.0, retaining only attributable resolution,
  peer/integrity and patch consequences. One atomic graph slice avoids knowingly
  leaving a coupled security/compatibility acceptance gate broken.
- Acceptance: selected eight-family floors hold or their vulnerable paths are
  eliminated; `pnpm audit --json` reconciles every finding and
  `pnpm audit --audit-level moderate` passes with no high/moderate findings.
  Preserve all-severity records and prove no new lower-severity regression.
  New incompatible or out-of-boundary fixes return to Main before edits.
- Each retained override has a concrete parent/advisory/compatibility reason,
  owner and removal condition. Each removal is proven safe against regenerated
  paths, security checks and regression coverage. Demonstrate an actual reduction
  of redundant overrides; if no safe reduction/direct upgrade is possible, return
  that outcome as a decision blocker rather than silently abandoning R5/R6.
- Preserve current desktop/browser/package behavior and Node22/VSCode1.75;
  no browser Node-built-in additions, layer exceptions, parser regeneration,
  fixture acceptance, engine increase, telemetry change or unapproved adapters.
- Required validation: Node22 (record exact patch/platform), pnpm10.33.0,
  frozen installation, affected `pnpm why`/registry/lock reconciliation and audit;
  full build, test compilation, browser accessibility/shared smoke bundles,
  desktop suite, minimum desktop smoke and web suite, OpenAPI reproducibility
  and existing Prism sample-backed response/startup/cleanup test; normal VSCE
  list/package and temporary VSIX integrity/content/manifest checks with cleanup.
  Do not substitute packaging flags that bypass a failed required check without
  a new Main decision. Do not authenticate/publish or mutate keychain state.
- Execute `rtk pnpm install --frozen-lockfile`, `rtk pnpm audit --json`,
  `rtk pnpm audit --audit-level moderate`, `rtk pnpm run build`,
  `rtk pnpm run test:compile`, `rtk pnpm run test:prepare:browser:bundle`,
  `rtk pnpm run test:prepare:web:bundle`, `rtk pnpm run test:desktop:run`,
  `rtk pnpm run test:desktop:min:run`, `rtk pnpm run test:web:run`,
  `rtk pnpm run openapi:check`, `rtk pnpm exec vsce ls` and
  `rtk pnpm exec vsce package --out <temporary-VSIX>`; inspect archive/cleanup.
  Prepare Playwright as required by existing CI without changing its version.
  Existing suites include architectureDependencyRules, packageManifest and
  webapiOpenApiGeneratedArtifacts tests. Reuse those meaningful boundary tests;
  no mirror-of-manifest new tests or test repairs are implicitly authorized.
- Qlty: exact disposable baseline/final snapshots under the Evidence Contract;
  qlty >=0.645.0, full-repository selection, official complete SARIF2.1.0 for
  `rtk pnpm exec qlty check --all --sarif --no-fix` and
  `rtk pnpm exec qlty smells --all --sarif --no-snippets` in both snapshots;
  inventories, tool/config identities, raw statuses, new/adverse findings
  comparison, and final-only `rtk pnpm run qlty` pass. New/mapped adverse findings
  are NG; review semantic quality separately. No planning implementation scans.
- Readiness: no acceptance bypass for pre-existing/environment failures. Preserve
  failed evidence and classify using matching baseline; missing checks or new
  repair paths return to Main. A second independent implementation review is
  required for this configuration/shared dependency surface, reusing evidence.

## Slice 3: Verify the remediated graph after publication and route residuals

- Lifecycle state: PLANNED.
- Value: complete published result and explicit security/tooling ownership.
- Edit paths: only this feature's `TASKS.md`, `TRACEABILITY.md`.
- Dependencies: Slice 2 review Ready, Completion Approval, commit and publication
  to `main` by a separately authorized Main/human action. The implementation
  commit reaching a PR branch alone does not satisfy publication. Waiting for
  publication is an external prerequisite, not approval to merge.
- Acceptance: prove the completed dependency-input identity reached default
  branch and graph coverage reconciles under the exact alias rule above;
  retain GitHub omissions and supplementary published-lock facts separately.
  Query all states/pages again and
  reconcile the union of baseline, known, historical, current and additional
  alerts. Individually GET known IDs absent from listing; unknown/access failure
  blocks a complete-result claim. Distinguish successful empty/denied/partial.
- Repeat complete reads and compare IDs/state/update fields to detect changes;
  bracket dependency/graph identities, refresh affected facts until stable or
  return a drift blocker. Record interval, not atomic snapshot guarantees.
- Every row records number/URL, package/ecosystem/manifest, advisory, severity,
  affected range/fix information, state/timestamps, classification basis,
  raw evidence, disposition and unresolved owner/decision. Proven new since
  publication requires retained publication time and created_at; otherwise use
  additional/first-observed classification and include it anyway.
- Fixed means GitHub reports fixed, without unproven causality; dismissed and
  auto-dismissed retain observed reason/time and unresolved risk routing without
  endorsement. Open/unknown findings return evidence and concrete decisions to
  Main/security maintainers. No alert mutation, assignment or external message.
- Verification can finish with explicitly owned unresolved vulnerabilities when
  the complete result/dispositions/routing are present; incomplete required graph,
  history or query evidence cannot complete the feature.
- Validation: document checks plus complete graph/query/identity/count/ID,
  every-row dispositions and concrete risk-handoff reconciliation.

## Evidence commands, retention and documentation checks

For Slices 1/3, use read-only `rtk gh api` repository/commits/contents pinned to
observed SHA, `rtk git show` and `rtk gh pr view 317`. Use current documented
async GET graph export generation/fetch; save export ID, times, status, SPDX JSON
and digest. It creates an export job, not a dependency submission. Retain bounded
processing/access failures. The retiring synchronous export is not a dependency.

Use authenticated `rtk proxy gh api --include` for unabridged status/headers/body,
`dependabot/alerts?state=open,fixed,dismissed,auto_dismissed&per_page=100&sort=created&direction=asc`
without narrowing filters; follow every next link and retain terminal proof.
Pin documented API headers/version; record auth capability without credentials.
Never use alert PATCH/POST. Retain all mechanical output outside inspected inputs,
with hashes/manifests/versions/commands/exits and exact identity per
[Evidence Contract](../../evidence.md#evidence-contract); preserve through closure.

For all changed feature documents, run `rtk pnpm run lint:md`,
`rtk git diff --check` and inspect local links/anchors, document structure,
untracked whitespace/scope, R1-R7 traceability and gate provenance. Replan and
Slices 1/3 use the coordination-document tier; Slice 2 uses full configuration
checks and qlty above. Never collect implementation baseline scans just to plan.

## Risks, invalidation and exit

- Permissions/processing/drift/unsupported SBOM coverage beyond the exact
  approved alias supplement block complete evidence;
  no-success assumption from 403/404, partial pages or selected package matches.
- Override removal may restore vulnerabilities or cross legacy API behavior;
  do not require zero overrides or solve failed checks by broad coercion.
- VSCE4 packaging/native-keyring changes may reveal platform/tooling incompatibility;
  preserve build permissions and stop for a supported alternative/new decision.
- Node24-only Prism and Playwright/harness upgrades are excluded. Minimum VSCode,
  bundled Node safety, patched postman behavior and existing tests are contracts.
- Scope/design/target version/path/validation-strategy changes return to Main for
  Replanning, independent review and renewed Human Approval. Ordinary uniquely
  determined corrections remain within approved exact paths only.
- Feature Exit requires all committed slices, current-head CI/Cloud gates where
  required and R1-R7 evidence. Closure propagation/removal has separate gates;
  preserve inherited WebAPI and explicitly owned residuals.

## Discovery and validation index

- Historical/intake selection facts:
  `/tmp/ajsbutler-dependabot-intake-evidence/record.json` and historical sources
  retained under `/tmp/ajsbutler-dependabot-plan-evidence/` remain reusable.
- Superseded plan identity:
  `aad13268b111bc3e33245b8b7b96ef33737f7eaea8ef21321cadd55519011ce7`.
- Replan discovery/document validation:
  `/tmp/ajsbutler-dependabot-replan-evidence/record.json`, with raw live-alert,
  installed-path and registry evidence and exact changed-document identity.
- Primary API sources inspected 2026-10-11:
  [GitHub SBOM API](https://docs.github.com/en/rest/dependency-graph/sboms),
  [Dependabot alerts API](https://docs.github.com/en/rest/dependabot/alerts);
  primary npm registry metadata URLs are indexed in the artifact.
- Original review/approval/planning commit are preserved for their original scope.
  Alias-coverage review is Ready; approval is Approved; replan commit succeeded.
  No dependency,
  runtime/test/configuration edit has been performed during Replanning.
- Narrow replan discovery and changed-document validation:
  `/tmp/ajsbutler-dependabot-alias-replan-evidence/record.json`.

## Slice 1 implementation result

- Lifecycle state: IMPLEMENTED; independent review and Completion Approval pending.
- Evidence: `/tmp/ajsbutler-dependabot-slice1-final-evidence/record.json`.
  Original raw observations are retained under
  `/tmp/ajsbutler-dependabot-slice1-evidence/` with linked digests.
- Published `main` remained at
  `27d2c1f5a1029cd73a1f0504bd4aa00419b0aef2` across original reads and resume.
  Four dependency/patch hashes match; reuse is bound to those pinned inputs.
  Observation dates/intervals and HTTP provenance remain in retained responses;
  generation preceded the initial bracket. No exact ingestion SHA is asserted.
- Complete observed API result: 195 rows on two terminal pages; 170 fixed,
  15 open, 10 auto-dismissed, zero dismissed. All known 17 historical IDs and
  all 15 planning IDs are present. Historical source and PR 317 are retained;
  each row has advisory/range/fix/state/time/disposition and ownership records.
  Fixed/auto-dismissed observations do not establish causality or accepted risk.
- GitHub npm nodes cover 1,046/1,046 lock packages, and 58/58 direct manifest
  dependency/devDependency edges. GitHub npm edges cover 2,001/2,004 unique
  dependency/optional edges after purl/alias normalization. Five Actions and
  the repository are separately observed; peer contexts collapse to versions.
- `alias-supplement.json` records the exact approved three absent alias edges,
  published-lock SHA256, parent snapshots/alias mappings/target entries and
  same-export parent/target nodes. GitHub-observed 2,001 edges and the separate
  three published-lock proofs form the approved 2,004-edge union. No additional
  missing edge, changed tuple, unresolved target or missing node exists.
- GitHub relationship/ingestion and detection uncertainty remains owned by
  security/tooling maintainers via Main. The supplement does not show GitHub
  observed or Dependabot evaluated these edges. Slice 3 must reconcile the
  actual published target anew; changed tuples or additional omissions block.
- `override-inventory.json` covers all 39 workspace entries, 156 same-package
  parent contexts, lock-root paths, registry declared/peer ranges, resolved
  versions, observed advisory history, API risks, candidate upstream strategy,
  owner and conditional retention/removal decisions. 136 commit-version or
  bounded candidate npm registry records returned HTTP 200 and are retained.
  Parent contexts are not proof every selector caused every listed resolution.
- Candidate reduction: elliptic has no published package/path; VSCE 4 removes
  declared markdown-it/cheerio/form-data/tmp routes. Ordinary compatible ranges
  permit conditional refresh for several pins. All removals remain conditional
  on Slice 2 regenerated graph, audits and required regression checks.
- Special risks: patched postman requires faker 10 despite legacy 5 declaration;
  uuid, diff, serialize-javascript, legacy js-yaml, exact postman lodash and
  analyzer ws contexts resolve outside parent ranges. Installed source API
  observations are retained as discovery hints; no compatibility pass is claimed.
  Prism sibling pins guard Node22 against Node24-only upgrades. No new dependency
  version/path/patch permission or acceptance decision is made here.
- Implementation Solution Shape: security/tooling own exceptions; GitHub owns
  observed alerts/edges and pnpm/Git own pinned resolution facts. Existing tools
  suffice; temporary evidence scripts add no production mechanism or abstraction.
- Checks: Markdown lint, links/anchors/structure, exact-path scope, R1-R7/gate
  provenance and diff whitespace passed. Dependencies/runtime/tests/workflows
  and build permissions are unchanged; Node22/VSCode1.75 contracts are preserved.
  No build, host, architecture-test or qlty result is claimed for this document
  slice; no user-visible change or durable documentation/changelog edit.
