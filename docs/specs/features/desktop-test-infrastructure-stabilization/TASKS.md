# Feature Tasks: Desktop Test Infrastructure Stabilization

## Agent Brief

- Purpose: reproducible Desktop tests with visible infrastructure/case results.
  Simplify Web commands around canonical `test:web` with preserved coverage.
- Active or approved slice: S1, independently reviewed Ready and Human Approved.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and Bootstrap discovery.
- Preserve full stable suite, VS Code 1.75, Web and architecture zero exceptions.
- Do not repair excluded memory, Table Shell, React-loop or Flow-golden issues.
- Next operation: approval-committer creates the focused plan commit.
  Implementation requires that successful commit; later gates remain separate.

## Current state and gates

- Lifecycle state: PLAN_APPROVED.
- Feature kind: roadmap.
- Selected base: `c5998c95b21f7ea04f6aa829d693f681673f420f`.
- Branch: `codex/desktop-test-infrastructure-stabilization`.
- Next decision: focused planning commit for the approved S1 boundary; no blocking
  scope/design decision. No implementation authority is inferred.
- Plan review: Ready, no Findings; see the linked review record. No
  implementation/completion/closure review.
- Workflow commits: none.

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Human Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-11 (Asia/Tokyo).
- Approved scope: the independently reviewed S1 plan, exact implementation
  boundary and validation below; review identity
  `fc14215bb10513d94ebd220cb09c82c0ba5db582fb7a9ae5701b5c95c3b023c9`.
- Approved paths:
  - `src/test/runTest.ts`
  - `src/test/suite/desktopTestEntry.ts`
  - `src/test/suite/index.ts`
  - `src/test/suite/desktopTestEntry.test.ts`
  - `src/test/suite/desktopTestLaunchOptions.test.ts`
  - `src/test/suite/testAliasResolution.test.ts`
  - `package.json`
  - `.github/workflows/verify.yml`
  - `CONTRIBUTING.md`
  - `webpack.web-test.config.js`
  - `src/test/suite/webSmokeWebEntry.ts`
  - `docs/specs/features/desktop-test-infrastructure-stabilization/SPECS.md`
  - `docs/specs/features/desktop-test-infrastructure-stabilization/TASKS.md`
  - `docs/specs/features/desktop-test-infrastructure-stabilization/TRACEABILITY.md`

Main received explicit approval after presenting the independently reviewed
S1 boundary in this conversation. Completion and Closure remain separate
unapproved gates. Apply
[Human Approval](../../README.md#human-approval) and the
[commit gate](../../README.md#approval-gated-commit-policy).

## Evidence and current decisions

- Web scope amendment and current documentation validation:
  [WEB-SCOPE-ADDENDUM.md](/tmp/ajsbutler-desktop-test-intake-20261011/WEB-SCOPE-ADDENDUM.md)
  and [evidence-v4.json](/tmp/ajsbutler-desktop-test-intake-20261011/evidence-v4.json).

- Original intake: [DISCOVERY.md](/tmp/ajsbutler-desktop-test-intake-20261011/DISCOVERY.md)
  and [evidence.json](/tmp/ajsbutler-desktop-test-intake-20261011/evidence.json).
- Scope restoration: [SCOPE-RESTORATION.md](/tmp/ajsbutler-desktop-test-intake-20261011/SCOPE-RESTORATION.md)
  and [evidence-v3.json](/tmp/ajsbutler-desktop-test-intake-20261011/evidence-v3.json).
- Prepared command observation: [planning evidence.json](/tmp/ajsbutler-desktop-test-plan-20261011/evidence.json)
  and [complete output](/tmp/ajsbutler-desktop-test-plan-20261011/bounded-desktop-escalated.log).
- Current design facts: [BOOTSTRAP-PLAN-DISCOVERY.md](/tmp/ajsbutler-desktop-test-plan-20261011/BOOTSTRAP-PLAN-DISCOVERY.md).
- Web design facts: [WEB-PLAN-DISCOVERY.md](/tmp/ajsbutler-desktop-test-plan-20261011/WEB-PLAN-DISCOVERY.md).
- Current documentation identity, checked inputs/links and results:
  [planning evidence-plan-final.json](/tmp/ajsbutler-desktop-test-plan-20261011/evidence-plan-final.json).
- Independent plan review and subsequent gate metadata:
  [PLAN-REVIEW.md](/tmp/ajsbutler-desktop-test-plan-20261011/PLAN-REVIEW.md).

The original `rtk pnpm test` prepared successfully but aborted with SIGABRT
inside the managed environment. Permitted prepared execution then reached
1193 passing and exit 0 with cached VS Code 1.141.0 and existing compiled
artifacts. This establishes the existing bootstrap's working capability in
that environment, not clean official-command, VS Code 1.75 or Web acceptance.
No new host verification is needed just to plan. Preserve distinct command
results and do not characterize the proposal as repairing a proven SDK defect.

### Canonical Web path decision

Contributors use `test:web`; it prepares once through existing `pretest:web`
and delegates to the prepared runner. `test:web:run` becomes a pure internal
node invocation without bundle preparation. Its distinct purpose is CI and
`test:full` orchestration after artifacts are already prepared. Running the
canonical prehook after CI's production build would replace those artifacts
with development output, so the prepared internal path remains justified.
Do not document it as another routine developer-facing test command.

Point `webpack.web-test.config.js` directly at `webSmoke.ts`, which already
exports the required `run`. Delete only `webSmokeWebEntry.ts`, the one-line
re-export. Retain `runWebTest.ts`: it owns the real browser SDK, headless mode,
port, profile and exit propagation, rather than duplicating smoke logic.
Retain browser-required bundling; plain tsc CommonJS output cannot satisfy
browser imports/aliases. Preserve all Web scenarios and the same bundle name.

Retain the small test-only Webpack configuration. It derives browser rules
from production configuration and isolates two test output/cache/library
contracts: smoke bundle and Desktop accessibility fixture. Folding it into
production `webpack.config.js` adds test targets/dispatch to a product build
owner with no removed duplicated transformation logic. Removing one file
would widen impact without an execution benefit. This alternative is rejected.

`test:prepare` adds the existing Web smoke bundle task; `test:full` then runs
both prepared runners without repeating preparation. CI prepares that same
bundle once for both minimum Desktop and real Web execution. The additional
minimum host reuses the artifact after wrapper deletion, retaining stable full
cases, browser checks and production/accessibility output requirements.

## Solution Shape and impact

`src/test/runTest.ts` remains the single Desktop launch/configuration owner,
using the existing SDK for version/executable resolution, Electron arguments,
profile, process and exit management. Add a fixed `--minimum` target; default
remains stable full suite. Use SDK version/entry options, not executable
wrappers, inherited-environment stripping, new launchers or runner replacement.
A small exported pure target-selection helper is testable configuration logic,
not a production port or new framework abstraction. Guard CLI entry so imports
for its configuration tests do not launch a second host.

A new `src/test/suite/desktopTestEntry.ts` owns the SDK full-suite ABI and the
module-loading boundary only. It logs runner loading before dynamically
importing existing index, reports a loading rejection with its original cause,
and delegates execution without relabeling case/init failures as load failures.
Its boundary earns explicit failure attribution and isolated negative tests;
it must not duplicate suite setup, download or Mocha logic. A narrowly exported
loader boundary helper permits success/load-failure/run-failure tests with
stub runners, without launching a nested VS Code or altering the real suite.

`src/test/suite/index.ts` retains aliases, development defines, DOM setup,
all existing file discovery, Mocha and cleanup. Add initialization, file-loading,
execution and completion markers. Explicit `mocha.loadFiles()` separates file
import errors before `mocha.run`; preserve the same files, order semantics,
assertions and nonzero-failure behavior. SDK stdout/stderr plus phase markers
provide attribution; no log parser or result collector is introduced.

Minimum compatibility reuses the existing browser-safe CommonJS smoke bundle
as SDK `extensionTestsPath` on VS Code 1.75.0. It avoids unsupported Node-only
Mocha/JSDOM dependencies in that older host while checking the actual Desktop
extension activation, commands, diagnostics, hover, previews and existing
shared smoke scenarios. Stable full Mocha suite and real Web runner stay
mandatory; minimum smoke is additional coverage, not full-suite replacement.
No new smoke assertion suite, dependency update or product-layer change.

Direct impact: test launcher, load boundary, existing suite diagnostics and
configuration checks, Web bundle entry/configuration, package scripts, CI
and contributor procedure.
Transitive impact: compiled Desktop tests and production-prepared CI execution,
plus existing Web smoke bundle reused in an additional Desktop host.
Product use cases, parser, shared exports, telemetry, dependency directions
and architecture catalog remain unchanged. The architecture test covers its
catalog mechanically; reviewers assess owner/abstraction value and framework
sufficiency separately.

### Alternatives and chosen boundaries

- Rewrite the SDK/runner or update dependencies: rejected; permitted existing
  execution succeeds and SDK already owns required host resolution.
- Force modern unbundled full suite into 1.75: rejected; installed jsdom 26
  requires Node 18 and Mocha 11 requires Node 18.18+, while 1.75 uses Electron 19.
- Duplicate a minimum smoke suite or downgrade libraries: rejected; reuse the
  existing browser-safe smoke bundle and retain modern full stable coverage.
- Use only documentation: insufficient; minimum host execution is currently
  unselectable and module-load versus case failure attribution is incomplete.
- Make CI use development preparation: rejected; keep intentional production
  artifact validation and use the same prepared launcher in both contexts.

## Implementation slices

### S1 — Reproducible Desktop and canonical Web execution

- Lifecycle state: PLAN_APPROVED.
- Value: one supported launcher, interpretable failure stages, additional
  minimum-host coverage, simplified Web entry/preparation and contributor/CI
  procedures.
- Order/dependencies: sole implementation slice; requires approved planning
  commit. Loading, target selection, test support and CI/docs are coupled into
  one reviewable commit so no intermediate public command lacks preparation
  or skips CI coverage. No dependent/unrelated implementation slice is added.
- Acceptance: AC-1 through AC-6 and AC-8 with the coverage below.
- Readiness: independently reviewed Ready and Human Approved; implementation
  prohibited until the focused planning commit succeeds.

#### Exact proposed implementation paths

1. `src/test/runTest.ts`: stable/minimum target selection, SDK options and CLI
   guard; print selected host version and entry before launch. Preserve exit 1
   on every thrown SDK/selection failure and stderr cause.
2. `src/test/suite/desktopTestEntry.ts` (new): lightweight full-suite load
   boundary and testable helper; default SDK-compatible `run(): Promise<void>`.
3. `src/test/suite/index.ts`: phase markers and explicit Mocha file loading;
   retain current alias/define/DOM resource lifecycle and all discovered cases.
4. `src/test/suite/desktopTestEntry.test.ts` (new): success delegates once;
   module-loading rejection is distinguishable and preserved; execution
   rejection remains an execution failure and cannot return success.
5. `src/test/suite/desktopTestLaunchOptions.test.ts` (new): declared default
   stable/full entry, `--minimum` selects 1.75.0/existing smoke bundle, invalid
   arguments fail before SDK launch. These are configuration contract tests.
6. `src/test/suite/testAliasResolution.test.ts`: retain compiled alias and normal
   dependency assertions; add define availability at file load and expected
   DEVELOPMENT true / CONNECTION_STRING empty, an uncovered separate contract.
7. `package.json`: test scripts only; `test` delegates to `test:desktop:run`.
   Add minimum commands and canonical Web/internal prepared script changes
   specified below; prepare each Web bundle once per composed invocation.
   Do not alter versions, dependencies, engines or production contributions.
8. `.github/workflows/verify.yml`: preserve production build/compile and stable
   full Desktop/Web checks; prepare existing smoke bundle and run additional
   1.75 smoke under existing Xvfb. Keep failures failing the job.
9. `CONTRIBUTING.md`: smallest Desktop/check command section update, supported
   prerequisites, stable/full versus minimum smoke, prepared CI route, phase
   reading, canonical Web versus internal CI preparation and browser bundle
   rationale. No historical debugging narrative.
10. `webpack.web-test.config.js`: smoke entry points directly to `webSmoke.ts`;
    preserve derived production rules, CommonJS bundle/runtime output, cache
    separation and the accessibility fixture configuration.
11. `src/test/suite/webSmokeWebEntry.ts`: delete its redundant one-line re-export;
    preserve `webSmoke.ts`, its exported run and every existing assertion.

Selected `SPECS.md`, `TASKS.md`, `TRACEABILITY.md` may record S1 evidence and
required gate metadata; their exact paths are this feature's existing files.
No other path is authorized by this proposal. New required support/product
paths, dependency updates or compatibility changes return to Main first.
Ignored `out`, SDK caches/profiles and temporary validation snapshots are
execution outputs, not approved generated source or commit contents.

#### Proposed commands and script contract

Existing script names below are factual; new names are explicitly proposed:

- Existing `pretest` remains `pnpm run test:prepare:desktop`.
- Existing `test` becomes `pnpm run test:desktop:run`; prepared stable script
  remains `node ./out/test/runTest.js` and runs every existing Desktop case.
- New `test:desktop:min:run`: `node ./out/test/runTest.js --minimum`.
- New `test:desktop:min`: `pnpm run test:prepare:desktop && pnpm run
  test:prepare:web:bundle && pnpm run test:desktop:min:run` on one script line.
- `--minimum` selects SDK version `1.75.0` and compiled
  `out/test/suite/webSmoke.bundle.js`; default selects `stable` and
  `out/test/suite/desktopTestEntry.js`. No manual executable/alias/define input.
- Existing `pretest:web` keeps `pnpm run test:prepare:web`; that task builds
  development Web output, compiles tests and prepares the smoke bundle once.
- Existing `test:web` becomes `pnpm run test:web:run`; internal `test:web:run`
  becomes `node ./out/test/runWebTest.js` with no preparation. No new Web
  argument/environment switch or duplicate runtime entry is introduced.
- Existing `test:prepare` becomes `npm-run-all development test:compile
  test:prepare:browser:bundle test:prepare:web:bundle` on one script line.
  `test:full` remains its existing preparation then prepared Desktop/Web
  sequence; the smoke bundle is no longer built again in the prepared runner.
- CI keeps `pnpm run build`, `pnpm run test:compile` and the accessibility
  fixture task; adds `pnpm run test:prepare:web:bundle` once before prepared
  stable/minimum/Web runs. Stable and minimum run under existing Xvfb;
  internal `pnpm run test:web:run` preserves production-prepared Web output.
  Host checks remain sequential, and every failure fails the job.

#### Required S1 validation and evidence

Producer: implementer. Record exact parent/base and final source manifests,
approved/new/untracked/renamed paths, tool/dependency/configuration identities,
ignored compiled/bundle inputs, downloaded host versions and execution
exceptions under the [Evidence Contract](../../evidence.md#evidence-contract).
Keep output outside inspected inputs. Reuse prior discovery only for matching
historical facts; its prepared artifacts cannot stand in for final S1 checks.

- In a disposable clean checkout/snapshot of approved inputs, use
  `rtk pnpm install --frozen-lockfile`, the documented Chromium install when
  absent, and no local `.env`/manual aliases/executable/define setup. Confirm
  optional environment configuration is unnecessary without exposing secrets.
- `rtk pnpm run test:compile`: test/configuration types and new bootstrap tests.
  `rtk pnpm test`: full development-prepared stable suite, including loader
  failure propagation tests, target contract tests, alias/define checks and
  architecture's complete zero-exception catalog. Require suite inventory and
  complete result; run once from clean setup and once as repeat execution.
- `rtk pnpm run test:desktop:min`: additional documented 1.75 smoke. Record
  actual VS Code, Electron/Node runtime and extension activation/observable
  smoke results; do not label it the full Mocha suite.
- Invalid argument execution: `rtk pnpm run test:desktop:run --unsupported`
  must exit 1 before host download/launch. This expected negative check passes
  by demonstrating failure, not by changing its exit into success.
- Production parity: `rtk pnpm run build`, then `rtk pnpm run test:compile`,
  `rtk pnpm run test:prepare:browser:bundle` and
  `rtk pnpm run test:prepare:web:bundle`, then prepared stable, minimum and Web
  runners. Use Xvfb for Linux; the same scripts on a supported desktop locally.
  The production build supplies production type/build checks. Preserve both
  Desktop and Web output bundles when the full build is required.
- `rtk pnpm run test:web` from clean setup verifies the canonical developer
  Web path, browser results and single preparation. `rtk pnpm run test:full`
  verifies composed Desktop/Web execution and once-per-invocation smoke
  preparation from actual output. Do not assume a script graph is execution
  evidence. Capture required bundles/artifact identities and Web scenario
  inventory; every existing smoke scenario and accessibility case remains.
- Internal `rtk pnpm run test:web:run` after production preparation verifies
  CI parity without a development rebuild. Confirm no repeated smoke build
  occurs. A Desktop run of the smoke bundle cannot replace browser results.
- Retain a current-head Verify execution for Linux/Xvfb compatibility when
  publishing the approved changes; local command inspection is not a CI pass.
- qlty: exact disposable baseline/final snapshots, same full-repository
  selection/version/configuration, qlty >=0.645.0; non-mutating `check --all
  --sarif --no-fix` and `smells --all --sarif --no-snippets`, through rtk pnpm
  exec, complete official SARIF 2.1.0 and nonzero per-command inventories.
  Any new finding or mapped adverse movement is NG. Run final
  `rtk pnpm run qlty` aggregate in final snapshot only, sync only approved
  formatting changes and refresh affected snapshot evidence until stable.
- Markdown lint covers every changed path: existing `rtk pnpm run lint:md`
  plus `rtk pnpm exec markdownlint-cli2 CONTRIBUTING.md`; local links/structure
  and `rtk git diff --check`. Configuration-sensitive durable docs participate
  in S1's broader qlty tier. Do not change qlty configuration or add exceptions.

Use distinct pass/fail/unavailable and infrastructure/load/case classifications.
Do not hide inherited failures or assume the historical seven failures are
present now. New failures are NG. If a case fails outside scope, establish its
matching baseline and route disposition through Main; preserved case failures
can support bootstrap acceptance but cannot be reported as suite pass or
silently waive a required readiness gate. Missing/unavailable required host,
Web, build, qlty or CI evidence blocks the corresponding readiness/exit gate.

#### Risks, completion and approval boundary

Test infrastructure remains outside production layers; no product behavior
or minimum-version change is intended. Existing mode-derived bundle defines
remain distinct from unbundled test globals: CI production DEVELOPMENT false
and test globals true are intentional contexts, not an inconsistency to erase.
The added bundle on 1.75 is a supported-shape proposal requiring actual runtime
validation. If it fails due to product/runtime compatibility or needs an
unapproved path/dependency, stop and return through Main for Replanning.

Run host validation sequentially and with bounded diagnostics on a capable
environment; pressure popup or forced interruption is unavailable/failed
execution, not proof of OOM repair. OOM repair stays excluded. Do not run many
parallel hosts or enlarge heap as a workaround. No permanent memory tooling.

Completion requires AC-1 through AC-6 and AC-8 results and final evidence,
independent implementation review plus a second independent review for
host/configuration risk, Ready, explicit S1 Completion Approval and focused
commit. Feature Exit additionally checks current-head CI/Qlty Cloud, durable
propagation and remaining risk ownership. No next slice starts implicitly.

## Durable documentation and Feature Exit

CONTRIBUTING procedure content is reusable beyond this feature and owns the
contributor command details; update only that section, without duplication in
README, architecture or policy. No new product use case or README change.
CHANGELOG is not required: these internal developer test commands do not
change extension behavior, supported APIs or end-user workflows. If this
assessment changes, route the new externally observable scope through Main.

Only Feature Exit may propose removing the completed Bootstrap roadmap item
in `docs/specs/roadmap.md`, after all acceptance evidence and commits. Preserve
Table Shell, Flow and inherited WebAPI work. Closure propagation/removal paths
require their separate Closure Approval; they are not S1 implementation paths.
Historical OS pressure is an excluded unresolved environment risk. Test-harness
maintainers own reporting recurrence to Main for a new scope decision; the
feature does not claim it repaired memory. Existing
[OS evidence](/tmp/ajsbutler-desktop-test-plan-20261011/OS-MEMORY-DISCOVERY.md)
remains available without another forced reproduction.
