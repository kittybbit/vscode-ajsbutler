# Feature Tasks: Dependabot Security Updates

## Agent Brief

- Purpose: remove known high/moderate vulnerabilities from transitive
  development dependencies without changing extension behavior.
- Approved or active slice: Slice 1 is complete and merged. Revised Slice 2
  implementation is complete, independently reviewed Ready with no Findings,
  and Completion Approved on 2026-09-12 under the no-Findings automatic-
  approval policy. Its completion commit is eligible and pending. Feature Exit
  remains blocked by publication/Dependabot re-query evidence and the stale
  OpenAPI fixture follow-up.
- Do not: edit dependencies, lockfiles, runtime code, tests, generated
  artifacts, or configuration before an approved plan is committed.
- Do not: broaden the work into general dependency modernization.
- Read first: `SPECS.md`, this file, `pnpm-workspace.yaml`, `package.json`, and
  the affected portions of `pnpm-lock.yaml`.
- Read `TRACEABILITY.md` when checking advisory and validation coverage.
- Validate planning documents: `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: send the exact completed Slice 2 paths to
  `approval-committer` for the focused completion commit. Keep the
  `Accept-Language: *` test residual, stale OpenAPI fixture, and Playwright
  installer result as separate boundaries; do not claim remote alert closure
  before publication and a Dependabot re-query.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs or validation diaries once they stop being actionable.

## Plan Status

- Status: Slice 1 complete; Slice 2 implementation independently reviewed
  Ready with no Findings and Completion Approved; completion commit pending;
  Feature Exit blocked
- Planning scope: Slice 1 remains complete. Replanned Slice 2 covers the
  current compatible transitive development-dependency resolution, lockfile
  audit closure, affected-tooling validation, and production-readiness
  evidence.
- Review status: Slice 1 plan and implementation reviews are Ready. The prior
  Replanned Slice 2 review was Ready with no Findings, but its approval is
  superseded by the implementation blocker. Revised Slice 2 plan and
  implementation reviews are Ready with no Findings.
- Human approval: Slice 1 approved; revised Slice 2 automatically Approved on
  2026-09-12 under the no-Findings policy.
- Active implementation slice: Slice 2 implementation complete; completion
  commit pending
- Implementation review verdict: Slice 1 Ready; Slice 2 Ready with no Findings

## Human Approval

- Status: Slice 1 approved; revised Slice 2 plan approved on 2026-09-12 after
  Ready/no-Findings review, with its focused replan committed at `1b8a2523`.
  Slice 2 implementation review is Ready with no Findings and its Completion
  Approval is recorded below under the no-Findings automatic-approval policy.
- Slice 1 approved at: 2026-08-10 (explicit user approval in Codex)
- Approved scope: Slice 1 — resolve and validate the security-clean development
  graph within the documented dependency and compatibility boundaries. The
  prior Replanned Slice 2 approval covered only the override and lockfile
  resolution and is retained as historical evidence, but is not authorization
  for the revised compatibility patch.
- Approved paths: the three plan-gate documents listed below for the Replanned
  Slice 2 package.
- Plan-gate approved paths are exactly the planning package:
  `docs/specs/features/dependabot-security-updates/SPECS.md`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
- These plan-gate paths are separate from the implementation target paths;
  this approval authorizes only the focused replan commit, not implementation.

This approval was the prerequisite for implementation; Slice 1 completed
independent implementation review and the approved completion gate.

- Prior Replanned Slice 2 plan review: Ready; no Findings (superseded after
  the implementation-time compatibility failure).
- Prior Replanned Slice 2 approval: Approved at 2026-09-12 under the existing
  automatic-approval policy, limited to the then-recorded override and
  lockfile paths; it does not cover the revised patch path.
- Revised Replanned Slice 2 plan review: Ready; no Findings.
- Revised Replanned Slice 2 Human Approval: Approved at 2026-09-12 under the
  user's no-Findings automatic-approval policy.
- Revised Slice 2 planning package paths are exactly
  `docs/specs/features/dependabot-security-updates/SPECS.md`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
- Revised Slice 2 approved implementation paths are exactly
  `pnpm-workspace.yaml` (existing `overrides` plus one exact
  `patchedDependencies` registration), `pnpm-lock.yaml`,
  `patches/postman-collection@4.5.0.patch`, and the minimal `.vscodeignore`
  exclusion for that patch path.
- Revised Slice 2 focused replan commit: `1b8a2523`, committed after the
  Ready/no-Findings review and 2026-09-12 approval. The implementation diff
  remains uncommitted and is eligible for the focused completion commit.

## Completion Approval

- Status: Approved
- Approved at: 2026-08-11 (explicit user completion-approval instruction in
  Codex, conditional on normal task completion)
- Approved scope: Completed Slice 1 implementation, validation evidence, and
  the documented OpenAPI baseline follow-up.
- Approved paths: `pnpm-workspace.yaml`, `pnpm-lock.yaml`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
- Implementation review verdict: Ready
- Commit status: Complete; focused completion-gate branch commit
  `4edda55d`; integrated squash commit `6e94136d` is an ancestor of the
  current branch.

### Revised Slice 2 Completion Approval

- Status: Approved
- Approved at: 2026-09-12 under the user's no-Findings automatic-approval
  policy, after independent implementation re-review returned Ready with no
  Findings.
- Approved scope: the completed Revised Slice 2 implementation, its
  acceptance evidence, validation evidence, and recorded residual boundaries.
  The three prior implementation Findings were resolved: exact legacy
  masked-card semantics, method-specific Faker 10 positional adapters, and
  the documented phone/image contracts.
- Approved paths: exactly `.vscodeignore`, `pnpm-workspace.yaml`,
  `pnpm-lock.yaml`, and `patches/postman-collection@4.5.0.patch`. No
  `package.json`, direct/production dependency, runtime, test, generated
  artifact, other configuration, or compatibility-floor path is included.
- Acceptance and validation: all 15 advisory IDs / 16 findings resolve to
  zero local audit findings; all planned dependency floors are met; 118 public
  dynamic generators, 111 Faker references, the full argument/`this` matrix,
  seed checks, direct Prism smoke, build, test compilation, desktop/web, qlty,
  markdown lint, and VSIX exclusion checks passed as recorded below.
- Residual boundaries: the existing `Accept-Language: *` Node fetch test
  remains a separate WebAPI follow-up because Prism returns 400; the stale
  OpenAPI fixture is unchanged and separate; the Playwright installer
  interruption is separate from the successful web test; and remote
  Dependabot closure awaits publication and post-publication re-query.
- Implementation review verdict: Ready with no Findings.
- Commit status: Eligible and pending; no completion commit has been made.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Do not close (2026-09-12 review)
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Resolve and validate the security-clean development graph

- Status: Complete; focused completion-gate branch commit `4edda55d`,
  integrated as `6e94136d`
- Scope:
  - Immediately before resolution, re-query open Dependabot alerts and
    `pnpm audit --json`; use any newer compatible high/moderate advisory floor
    within this feature purpose.
  - In `pnpm-workspace.yaml`, change only the existing affected override
    targets to `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`,
    `undici@7.29.0`, `brace-expansion@1.1.18` and `5.0.9`, and
    `shell-quote@1.9.0`.
  - Regenerate only the necessary `pnpm-lock.yaml` resolution so linkify-it,
    morgan, and nanoid resolve to 5.0.2, 1.11.0, and 3.3.17 respectively under
    their current parent ranges; do not add overrides for those packages.
- User / Domain Value: repository contributors and release workflows use a
  development graph with no currently known high/moderate advisory while the
  extension's product behavior and compatibility contracts remain unchanged.
- Cohesive Change Group: the seven existing security override target updates,
  three targeted transitive lock resolutions, and their unavoidable pnpm peer
  snapshot/integrity consequences form one atomic security-clean resolution.
  Splitting the package families would knowingly leave the shared audit gate
  failing and would not provide an independently complete acceptance result.
- Acceptance:
  - The lockfile resolves all ten package families at or above the revalidated
    security floors and contains no affected retained version.
  - `pnpm audit --audit-level moderate` exits successfully with zero high or
    moderate findings; an unavoidable or newly incompatible advisory is a
    blocker returned to Main.
  - Every changed lockfile entry is attributable to an approved override,
    targeted transitive resolution, or required peer/integrity consequence.
  - Any additional resolution for an affected package family beyond the ten
    selected floors is either explicitly attributable to the approved change
    or is a Replanning blocker.
  - `package.json`, all production dependencies, `engines`, runtime source,
    tests, generated artifacts, README, CHANGELOG, and product behavior remain
    unchanged.
  - After the committed lockfile reaches GitHub and Dependabot reevaluates it,
    alerts 156-176 that are currently open are closed; any remaining/new alert
    is a Feature Exit blocker rather than a dismissal candidate.
- Validation:
  - Record the implementation-time open-alert tuple (number, package, GHSA,
    severity, vulnerable range, first patched version) and audit advisory
    summary before selecting final versions. The same pre-resolution evidence
    must contain an auditable 23-row inventory from that `pnpm audit --json`,
    with one row per advisory and these fields: advisory ID (GHSA, CVE, or
    registry advisory ID), package name, every resolved dependency path,
    severity, vulnerable range, first patched version, mapped security family
    and floor, and the response for that family (selected floor/resolution or
    an explicit Replanning blocker). Reconcile the row count and IDs with the
    raw audit output and retain the raw JSON or a stable evidence reference;
    do not replace this inventory with an aggregate count or the post-
    resolution zero-finding result. The ten family/floor mappings are
    `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`, `undici@7.29.0`,
    `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `shell-quote@1.9.0`,
    `linkify-it@5.0.2`, `morgan@1.11.0`, and `nanoid@3.3.17`; every advisory
    row must map to one of these ten families or be returned to Main for
    Replanning.
  - Reproduce the install prerequisite in `.github/workflows/verify.yml`:
    use pnpm 10.33.0 with the workflow's `actions/setup-node@v4`
    `node-version: 20`, run `pnpm install --frozen-lockfile`, then run
    `pnpm exec playwright install --with-deps chromium-headless-shell` before
    the web test. Record the exact `node --version` patch used (20.x.y),
    `pnpm --version`, platform, and successful Playwright install, and use
    that same Node 20 patch for the remaining validation commands.
  - Run `pnpm install --frozen-lockfile`, inspect the resolved dependency paths
    and parent ranges, assert the ten floors, and review
    `git diff -- pnpm-workspace.yaml pnpm-lock.yaml package.json` for unrelated
    churn and unchanged direct/production declarations.
  - Run `pnpm audit --json` and `pnpm audit --audit-level moderate`; require
    zero high/moderate findings.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
    `rtk pnpm run openapi:check`.
  - Run `rtk pnpm run test:compile` followed by
    `rtk pnpm run test:desktop:run` and explicitly retain the
    `src/test/suite/webapiOpenApiGeneratedArtifacts.test.ts` case
    `serves sample-backed responses through Prism` as the Prism smoke
    evidence. That existing test starts the generated fixture's Prism server,
    waits for `GET /__health` with its 10-second startup deadline, calls
    `GET /ajs/api/v1/objects/statuses` with the sample `Prefer` header, asserts
    HTTP 200 and the expected sample marker, and attempts to stop the server
    in `finally`. Record the cleanup attempt and record an exit/termination
    observation only when the existing helper/test exposes one. With the
    current `stopProcess`, which resolves after its one-second fallback without
    necessarily observing kill failure or process exit, cleanup failure,
    kill failure, or non-termination is not an independently assertable
    validation failure. A health timeout, API assertion failure, or non-zero
    test result still fails validation. Changing `stopProcess`, adding a
    PID-exit assertion, or changing the helper/test to expose termination state
    is a Replanning trigger; no such helper or test change is in this slice.
  - Run `rtk pnpm run build`, `rtk pnpm run test:compile`,
    `rtk pnpm run test:web:run`, matching the Node 20 Verify workflow's
    desktop/web path and its Playwright install prerequisite.
  - Run `pnpm exec vsce ls`, then create a temporary directory with
    `mktemp -d` and an EXIT trap that removes it. Inside that directory run
    `pnpm exec vsce package --out <temporary-dir>/vscode-ajsbutler.vsix` and
    verify the archive with `unzip -t` and its file list with `unzip -Z1`.
    Extract and parse `extension/package.json` as the VSIX manifest, confirm
    its name/version, `engines.vscode`, `main`, and `browser` match the
    repository package, and confirm the packaged file list includes the
    expected bundled entry points and language/syntax assets observed in the
    `vsce ls` output. The temporary-directory EXIT cleanup must be installed
    and exercised on success and failure, and no VSIX or extracted manifest may
    remain in the repository; this shell cleanup is separate from the Prism
    `stopProcess` observation above.
  - After publication of the branch commit to GitHub, re-query Dependabot as
    Feature Exit evidence; this external check cannot be claimed from the
    local implementation diff alone.
- Production Readiness:
  - Status: Ready for implementation review with the documented OpenAPI and
    validation-environment residuals.
  - Failure modes: fail closed on audit findings, resolver failure, unexpected
    lockfile churn, peer mismatch, build/test/tool startup failure, or a
    remaining GitHub alert; do not suppress or dismiss findings.
  - Compatibility: keep VS Code `^1.75.0`, Node `>=20`, pnpm 10.33.0, direct
    parent versions, production dependency declarations, and desktop/web
    entry points unchanged. Record the exact Node 20 patch used by validation;
    undici 7.29.0 retains the current 7.x `>=20.18.1` package engine floor and
    brace-expansion 5.0.9 supports Node 20 or >=22.
  - JP1/AJS and malformed/large input: no parser or runtime path changes are
    permitted; the full desktop/web test path and unchanged source diff are
    regression evidence for existing JP1/AJS behavior.
  - Documentation/release: no README, durable use-case, architecture,
    roadmap, or CHANGELOG update is expected because no observable contract
    changes; re-evaluate at Feature Exit.

### Slice 2: Resolve the revalidated advisory set

- Status: Implemented locally after the Prism/Postman compatibility route;
  independent implementation review is Ready with no Findings and Completion
  Approval is recorded above. The focused revised-plan commit is `1b8a2523`;
  the exact implementation diff remains uncommitted and eligible for the
  focused completion commit.
- Resolved implementation blocker (2026-09-12): the exact patch adapts
  `postman-collection@4.5.0`'s legacy dynamic-variable module to Faker 10.5.0;
  the package now loads and all 118 public generators return defined values.
  The original Prism startup `TypeError` is gone. A direct Prism smoke with
  the contract-valid `Accept-Language: en` header returns the existing sample
  with HTTP 200. The existing Node `fetch` test still sends
  `Accept-Language: *`, which Prism rejects as 400; its generated fixture and
  test are outside this slice and this environment residual is recorded below.
- Scope:
  - Immediately before resolution, re-query GitHub Dependabot and
    `pnpm audit --json`; preserve the exact 10 current GitHub alert rows and
    all 15 current audit advisory IDs / 16 findings in traceability. The
    current GitHub alert set is 180, 181, 182, 183, 184, 186, 187, 188, 191,
    and 192.
  - In the existing `pnpm-workspace.yaml` `overrides` section, retain/update
    affected existing targets to `js-yaml@4.3.2`, `fast-uri@3.1.6`, and
    `qs@6.16.0`. Add only scoped remaps for
    `@faker-js/faker@10.4.0` and `@faker-js/faker@5.5.3` to `10.5.0`;
    the latter remains an exact `postman-collection` edge and requires the
    compatibility patch below.
  - Register one exact
    `patchedDependencies` entry for `postman-collection@4.5.0` pointing to
    `patches/postman-collection@4.5.0.patch`. The patch must adapt the
    legacy dynamic-variable import and every referenced legacy Faker method
    to an explicit Faker 10.5.0 facade, without adding another Faker copy.
    Inventory the 118 generators and 111 Faker references, and map all 47
    Faker 10-incompatible legacy APIs across address/location, name/person,
    random/helpers, datatype/number/string, image, finance, and related
    modules. Preserve `this` binding and argument behavior for each adapter.
  - Keep the patch target limited to the required portions of
    `dynamic-variables.js`. Record upstream package URL/version, registry
    integrity, repository tag or source hash, and the exact target. The
    current provenance baseline is `postman-collection@4.5.0` from
    `https://github.com/postmanlabs/postman-collection`, annotated tag object
    `fbfb40ebf1858b88ad6fb1da8771bf68909cbae6` at `refs/tags/v4.5.0`, and
    peeled source commit `0bc9665661a9f8ca4fdd91128d8312d0608ec637` at
    `refs/tags/v4.5.0^{}`. The patch source must use the peeled commit while
    retaining the annotated-tag object as provenance; registry integrity is
    `sha512-152JSW9pdbaoJihwjc7Q8lc3nPg/PC9lPTHdMk7SHnHhu/GBJB7b2yb9zG7Qua578+3PxkQ/HYBuXpDSvsf7GQ==`;
    the resolved Faker `@faker-js/faker@10.5.0` upstream is
    `https://github.com/faker-js/faker` and its registry integrity is
    `sha512-bsxD8WLS5lIj7aaoCx1YJkktqYj5vlBUE6HWzu2Q51ksrGJ0H737ECCKlFU7Yf8Br45z9t99frBp/J7kzbMPAg==`.
    Preserve
    the package manifest, install scripts, LICENSE, dependency metadata, and
    package attribution; retain `postman-collection` Apache-2.0 and Faker MIT
    metadata/license information. The patch must not embed a second Faker
    copy.
  - Add the smallest `.vscodeignore` exclusion for
    `patches/postman-collection@4.5.0.patch` (or `patches/` only if required
    by repository convention), because this patch is a development-only
    dependency-resolution artifact. No other VSIX ignore rule may change.
  - Preserve the current implementation's safe floors and lockfile
    resolution. Add only the patch registration/hash and unavoidable lockfile
    consequences; do not revert or rewrite the held pnpm diff.
  - Regenerate only the necessary `pnpm-lock.yaml` resolution for
    `postcss-selector-parser@7.1.3`, `browserslist@4.28.7`,
    `baseline-browser-mapping@2.11.0`, `@humanfs/node@0.16.8`,
    `morgan@1.12.0`, and `nanoid@3.3.18`, while retaining every completed
    Slice 1 floor. Include only unavoidable package, snapshot, peer, and
    integrity consequences of those approved resolutions.
  - Do not edit `package.json`, direct or production dependencies, repository
    runtime/tests/generated artifacts, configuration outside the existing
    override plus exact patch registration and the minimal `.vscodeignore`
    exclusion, or VS Code/Node compatibility declarations.
- User / Domain Value: contributors and release workflows receive a current
  audit-clean development graph, and the newer Dependabot alerts can close
  after publication without changing extension behavior or compatibility.
- Cohesive Change Group: the current advisory families share the same
  transitive lockfile and override boundary; resolving only a subset would
  leave the moderate audit gate failing. The scoped Faker remaps, exact
  Postman compatibility patch, and targeted lockfile refresh form one atomic,
  independently reviewable security slice.
- Acceptance:
  - The resolved graph meets all retained Slice 1 floors and the ten current
    floors in `SPECS.md`, with no affected vulnerable version remaining.
  - `pnpm audit --audit-level moderate` exits successfully with zero high or
    moderate findings, and the low `postcss-selector-parser` finding is also
    absent through the selected `7.1.3` floor. Any advisory outside the mapped
    inventory is a blocker returned to Main.
  - Both scoped Faker paths resolve to 10.5.0, and the patched
    `postman-collection@4.5.0` loads through its public dynamic-variable path.
    All 118 generators and 111 Faker references are covered by a recorded
    mapping of the 47 incompatible legacy APIs; every adapter preserves
    `this` binding, arguments, public Substitutor behavior, and the expected
    URL/UUID/IP/email/date/path and other output types without
    `TypeError`/undefined values. Seeded determinism is preserved, while
    time/random-dependent exceptions use a fixed clock/RNG or have an
    explicit documented contract. Prism smoke starts and serves its existing
    fixtures. A failure is a blocker, not permission to update a direct parent
    or skip the test.
  - The patched `dynamic-variables.js` contains no direct references to the
    legacy Faker APIs after adaptation. The patch provenance, registry
    integrity, upstream tag/source hash, unchanged manifest/install scripts/
    LICENSE/dependency metadata, and Apache-2.0/MIT attribution are recorded;
    no vulnerable or duplicate Faker copy is present.
  - The VSIX excludes the exact development-only patch path, contains no patch
    artifact, and retains valid bundles/assets and license/package
    attribution. If repository packaging evidence requires inclusion instead,
    stop and return the justification and equivalent archive checks to Main.
  - The current GitHub alerts 180, 181, 182, 183, 184, 186, 187, 188, 191,
    and 192 are eligible for closure only after this committed resolution is
    published and Dependabot is re-queried. Local audit success must not claim
    remote alert closure; a newer post-publication alert is a Feature Exit
    blocker.
  - The implementation diff is limited to `pnpm-workspace.yaml`'s existing
    override plus exact patch-registration entry, `pnpm-lock.yaml`, and
    `patches/postman-collection@4.5.0.patch`, plus the minimal
    `.vscodeignore` exclusion for that patch path; no direct/production
    declaration, runtime/test/generated artifact, other configuration, or
    compatibility contract changes are present.
- Validation:
  - Record the implementation-time GitHub alert tuple and the full
    implementation-time audit mapping: 15 advisory IDs, 16 findings, 10 high,
    5 moderate, 1 low, with package, version, every resolved path, severity,
    vulnerable range, patched floor, and mapped response.
  - Use Node 20 and pnpm 10.33.0, run `pnpm install --frozen-lockfile`,
    assert every floor and parent-range decision, and inspect
    `git diff -- pnpm-workspace.yaml pnpm-lock.yaml
patches/postman-collection@4.5.0.patch package.json` for unrelated churn
    and unchanged direct/production declarations. Verify that the patch is
    registered for exactly `postman-collection@4.5.0` and that the frozen
    lockfile records its patch hash.
  - Independently inspect the patched package source and record a 118-row
    generator inventory, 111 Faker-reference inventory, and 47-row legacy API
    mapping covering address/location, name/person, random/helpers,
    datatype/number/string, image, finance, and related modules. Exercise all
    generators through the public Substitutor path, including argument and
    `this` binding checks and URL, UUID, IP, email, date, path, primitive, and
    other declared output contracts. Assert no `TypeError`, undefined result,
    or remaining legacy direct reference in `dynamic-variables.js`.
  - Run determinism checks with a fixed seed and fixed clock/RNG for
    time/random-dependent cases; record any intentionally nondeterministic
    exception and its explicit contract rather than treating it as an
    unverified pass. Verify the patched module's manifest, install scripts,
    LICENSE, dependencies, package attribution, upstream URL/version,
    registry integrity, repository tag/source hash, and patch diff are
    unchanged except for the required `dynamic-variables.js` adaptation.
  - Reproduce the Verify workflow's web prerequisite after the frozen install:
    with `actions/setup-node@v4`'s `node-version: 20` contract, run exactly
    `pnpm exec playwright install --with-deps chromium-headless-shell`.
    Record the exact `node --version` patch (`20.x.y`), `pnpm --version`,
    platform/architecture, Playwright version, and whether the Chromium and
    headless-shell assets were cached before and after the installer.
    Record a zero exit as installer success; record a non-zero exit, hang,
    timeout, or manual interruption as an environment residual and never as
    successful installation evidence.
  - Run `pnpm audit --json` and
    `pnpm audit --audit-level moderate`; require zero findings at or above
    moderate and no remaining finding from the mapped current set.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, build, test compilation,
    desktop tests, web tests, affected Prism/WebAPI smoke coverage, and the
    existing VSIX archive/content validation. Assert the VSIX archive omits
    the exact development-only patch path while bundles/assets and
    Apache-2.0/MIT license/package attribution remain valid. Before Prism
    smoke, run a
    focused compatibility check through the public Postman dynamic-variable
    substitution path, enumerating every referenced `$random*` generator and
    asserting its expected primitive/URL output type with no legacy Faker
    `TypeError` or undefined result. Then require the Prism CLI to load and
    the existing Prism smoke to start and serve its fixtures. Re-run the
    relevant paths to prove the Faker, Browserslist, CSS, URL, and test-web
    tooling changes are behaviorally compatible.
  - Run the web test after the prerequisite/build steps and record its exit
    status and test output separately from the Playwright installer result.
    A successful `pnpm run test:web:run` (or the Verify-equivalent web test)
    is web-test evidence even when the installer was an environment residual;
    it does not retroactively claim installer success. A failed or incomplete
    web test remains a Slice 2 validation failure.
  - Run `rtk pnpm run openapi:check` as a non-regression observation. The
    known stale `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`
    remains an independent WebAPI follow-up; do not change it in this slice.
    The security slice may complete with that exact residual unchanged, but
    Feature Exit cannot close until the separate follow-up is resolved (or
    Main records the SSOT-approved residual decision).
  - After the implementation commit is published, re-query GitHub Dependabot
    for Feature Exit evidence; this external check is outside local
    completion evidence.
- Production Readiness:
  - Status: Implementation complete locally; independent implementation
    review is Ready with no Findings and Completion Approval is Approved. The
    focused revised-plan commit is `1b8a2523`; the focused completion commit
    remains eligible and pending.
  - Failure modes: fail closed on a remaining mapped advisory, new advisory,
    resolver failure, unexplained lockfile churn, peer mismatch, patch-
    application failure, incomplete legacy Faker facade, dynamic-variable
    contract mismatch, Prism TypeError/startup failure, build/test/tool
    startup failure, or new GitHub alert.
    Do not suppress, dismiss, or ignore findings.
  - Compatibility: preserve `engines.vscode: ^1.75.0`, repository Node
    declaration `>=20`, pnpm 10.33.0, direct parent versions, production
    dependencies, and desktop/web entry points. Faker 10.5.0's Node 20.19
    floor is already present on the current 10.4.0 path; record the exact
    Node 20 patch used.
  - JP1/AJS and malformed/large input: no parser or runtime path changes are
    permitted. Existing desktop/web, Prism, and unchanged-source evidence
    protects product behavior; the stale OpenAPI fixture is not mixed into
    this security slice.
  - Documentation/release: no README, durable use-case, architecture,
    roadmap, or CHANGELOG update is expected because no observable contract
    changes; re-evaluate at Feature Exit.
- Approval Boundary:
  - Revised Slice 2 implementation paths are exactly
    `pnpm-workspace.yaml` (existing `overrides` plus one exact
    `patchedDependencies` registration), `pnpm-lock.yaml`, and
    `patches/postman-collection@4.5.0.patch`, plus the minimal
    `.vscodeignore` exclusion for that patch path.
  - The three feature documents are the separate plan-gate paths. Slice 1
    completion and approvals are preserved and are not reopened; the prior
    Slice 2 approval is superseded for the revised paths.
  - Stop and return to Main for Replanning if a direct-parent,
    `package.json`, production/runtime/test/generated/configuration change is
    required, if the legacy facade cannot preserve the generator contract, if
    patch provenance/license or package attribution cannot be verified, if the
    VSIX exclusion changes bundle/assets/license behavior, if any lockfile/
    patch churn is unexplained, or if advisory remediation requires dismissal
    or an approval-boundary change.
- Dependencies: Slice 1 completion, prior completion commit, Feature Exit
  findings, and the held current pnpm implementation diff are preserved. The
  revised Slice 2 plan review is Ready with no Findings, Human Approval is
  recorded, and its focused plan commit is `1b8a2523`. Slice 2 now requires
  independent implementation review, Completion Approval, and a focused
  completion commit before Feature Exit is retried.
- Risks:
  - Scoped Faker remapping moves the exact `postman-collection` edge from
    major 5 to 10. The pinned patch must cover all legacy dynamic-variable
    methods and may require maintenance if Postman publishes a compatible
    upstream release.
  - Patch registration and lockfile hash/integrity metadata can fail closed
    if the package source or pnpm version differs from the plan.
  - A partial legacy API facade, lost `this`/argument semantics, changed seed
    determinism, or unbounded time/random behavior can cause subtle Prism
    mock differences even after module startup succeeds.
  - Upstream patch provenance or license/attribution drift, and an overly
    broad VSIX ignore rule, could create supply-chain or packaging regressions;
    validation must fail closed on either.
  - Browserlist's required baseline mapping update and CSS transitive
    updates may produce lockfile churn; every changed package must be
    explained.
  - Existing global js-yaml/qs overrides affect multiple tooling paths; Prism,
    WebAPI, and package validation must detect incompatibility.
  - Dependabot and registry advisories may drift again between planning,
    implementation, publication, and Feature Exit.
- Out of Scope: direct parent upgrades, `package.json` changes, production
  dependencies, runtime/tests/generated artifacts, configuration outside the
  existing override plus exact patch registration and minimal `.vscodeignore`
  exclusion, Node/VS Code floor
  changes, general freshness, advisory suppression, stale OpenAPI fixture
  repair, Playwright installer remediation, and Feature Exit
  propagation/removal.

### Current Slice 2 blocker handoff (2026-09-12)

- Finding addressed: the security-correct Faker 10.5.0 resolution makes the
  legacy `postman-collection@4.5.0` dynamic-variable module fail at startup;
  its `faker.address.city` access proves that changing only the resolver is
  insufficient. The complete root fix is an exact pnpm patch that supplies a
  documented Faker 10.5.0 compatibility facade for every legacy method used
  by the public `$random*` generator path.
- Alternatives rejected: retaining Faker 5.5.3 violates the active advisory;
  Postman Collection 5.3.1 still declares Faker 5.5.3; Prism 5.16 retains the
  http-spec/Postman chain and raises its Node floor; direct-parent refresh,
  audit suppression, and smoke-test removal do not solve the compatibility
  problem within this feature.
- Current implementation evidence is retained but incomplete: the uncommitted
  `pnpm-workspace.yaml` and `pnpm-lock.yaml` changes produce audit
  high/moderate/low = 0 and pass frozen install, build, test compilation,
  desktop/web, qlty, and lint checks, but Prism smoke is blocked by the
  TypeError. Playwright installer exit 130/hang and the stale OpenAPI fixture
  remain separately recorded residuals, not evidence of Prism success.
- Revised route: after the recorded independent Ready/no-Findings review and
  Human Approval, commit the plan package, adapt the held pnpm diff, add
  `patches/postman-collection@4.5.0.patch`, regenerate only its registration
  and lockfile hash consequences, add the exact `.vscodeignore` exclusion,
  and validate audit plus the full Postman dynamic-variable and Prism smoke
  contract. GitHub alert closure is claimed only after publication and a
  post-publication Dependabot re-query.

## Implementation Evidence

- Changed files are limited to the approved implementation paths:
  `pnpm-workspace.yaml` and `pnpm-lock.yaml`. `package.json`, production
  dependencies, runtime source, tests, generated artifacts, and user-facing
  documentation were not changed. Existing pnpm changes remain in the
  worktree and were not reverted.
- Security baseline and result: 17 open Dependabot alerts (11 high and
  6 moderate); before-resolution `pnpm audit` reported 23 advisories
  (17 high and 6 moderate); after resolution the audit reported 0, and
  `pnpm audit --audit-level moderate` succeeded.
- GitHub API re-query evidence is fixed in `TRACEABILITY.md` as an
  immutable 17-row open-alert table containing each alert number, package/path,
  GHSA, severity, vulnerable range, first patched version, selected floor or
  response, and stable repository URL. The 2026-09-12 Feature Exit requery
  found 10 newer open alerts; the current findings are recorded in the Feature
  Exit Revalidation section below and require Replanning.
- All ten selected security floors are met:
  `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`, `undici@7.29.0`,
  `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `shell-quote@1.9.0`,
  `linkify-it@5.0.2`, `morgan@1.11.0`, and `nanoid@3.3.17`.
- Environment and validation: Node `20.20.2` with pnpm `10.33.0`; frozen
  install succeeded and all compatibility floors were met. `qlty`, build,
  test compilation, and desktop tests succeeded. `pnpm run test:web` exited
  0; existing `ECONNRESET`/`Premature close` logs were observed without a
  failing exit status.
- Playwright `1.59.1` and the Chromium/headless-shell assets were already
  cached. `playwright install --with-deps` was attempted, produced no output,
  hung, and was manually interrupted; this is recorded as a validation
  environment residual, not as a successful install result.
- VSIX evidence: the normal `vsce ls`/package dependency detection path
  failed because npm reported missing nested development dependencies in the
  pnpm layout. The approved package check therefore used
  `vsce package --no-dependencies` in a temporary directory; archive test,
  file-list inspection, manifest validation, and temporary cleanup succeeded.
- `pnpm run lint:md` succeeded for 35 files with 0 errors.
- `openapi:check` failed only because
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is
  a stale baseline. The generated artifact and generator were not changed.
  This remains a separate follow-up owned by Main/the existing WebAPI
  maintainer, or a Feature Exit follow-up; it is not part of this Slice 1
  document-only synchronization.

## Slice 2 Implementation Evidence (2026-09-12)

- Changed files are exactly the approved implementation paths:
  `.vscodeignore`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, and
  `patches/postman-collection@4.5.0.patch`. The workspace file retains only
  the existing override section plus one exact `patchedDependencies` entry.
  `package.json`, direct/production dependencies, runtime source, tests,
  generated artifacts, and compatibility declarations are unchanged.
- The 10 implementation-time GitHub alert numbers remain 180, 181, 182, 183,
  184, 186, 187, 188, 191, and 192. The implementation-time audit inventory
  remains 15 advisory IDs / 16 findings (10 high, 5 moderate, 1 low) before
  resolution and zero findings after resolution; the full package/path/range/
  floor mapping is retained in `TRACEABILITY.md`.
- Node `20.20.2` and pnpm `10.33.0` frozen install succeeded. The resolved
  graph meets all floors: Faker `10.5.0`, `@humanfs/node` `0.16.8`,
  Browserslist `4.28.7` with baseline mapping `2.11.22` (floor `2.11.0`),
  fast-uri `3.1.6`, js-yaml `4.3.2`, morgan `1.12.0`, nanoid `3.3.18`,
  postcss-selector-parser `7.1.3`, and qs `6.16.0`. `pnpm audit --json`
  and `pnpm audit --audit-level moderate` both report zero vulnerabilities.
- The patched Postman module inventories 118 public dynamic generators (115
  `$random*` entries plus the three `$guid`/timestamp entries) and the original
  111 unique Faker references. Every public `Substitutor` token and
  direct generator call (including alternate `this`) returned a defined value;
  the full argument matrix covers the legacy positional coordinate/date,
  finance, email/username/password/name, mask, image, phone, and color
  adapters. Explicit checks cover `amount(5, 10, 0, '$')`, reference dates,
  default four-digit and three-argument masks, 10-digit phones without a
  leading `1`, 640x480/category image paths, and primitive/URL/data URI,
  UUID, IPv4/IPv6, email, date, and path contracts. Faker-seeded checks passed
  for 111 non-clock/non-UUID generators. Legacy API mapping and the complete
  inventory are recorded in `TRACEABILITY.md`; the patched source has no
  remaining legacy direct API references.
- The patch adapts only `lib/superstring/dynamic-variables.js`. Postman
  `package.json`/dependencies/install scripts/LICENSE.md compare unchanged;
  Faker resolves to one `10.5.0` package with MIT metadata and no embedded
  copy. The patch hash recorded in the lockfile is
  `95ec02c7ccf2e749ea08812787f5cfec9b0a4ec06296b07836a8b21385f6bd9b`.
  Provenance remains the v4.5.0 annotated tag/source pair and registry
  integrities recorded in `TRACEABILITY.md`.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, production build, Node 20 test
  compilation, desktop tests, and the escalated Node 20 web test succeeded.
  The direct Prism smoke starts and serves `sample_ref_minimal_utf8` with
  HTTP 200 when sending the contract-valid `Accept-Language: en` header.
  The existing Node `fetch` test sends `Accept-Language: *` and receives 400;
  that existing test is not claimed as passed, and changing it or the
  generated fixture is outside this approved slice and remains a separate
  WebAPI follow-up.
- VSIX packaging with `vsce package --no-dependencies` succeeded. The archive
  omits `patches/postman-collection@4.5.0.patch` and retains package/license
  attribution, all bundles, and assets. The exact Playwright command was
  attempted under Node 20 with cached assets but hung without output and was
  interrupted (exit 130); this is an installer environment residual separate
  from the successful web test. `openapi:check` still reports only the known
  stale generated fixture, which remains an independent follow-up.
- Production readiness: implementation evidence is complete within scope;
  independent implementation review is Ready with no Findings and Completion
  Approval is Approved. Only the focused completion commit remains before the
  Slice 2 gate is complete. Remote Dependabot closure is not claimed until
  publication and a post-publication API re-query.

## Main Validation-Equivalence Decisions

- Web compatibility objective: `playwright install --with-deps` attempted
  environment-dependent OS dependency installation but stopped with no output.
  Playwright `1.59.1` and the Chromium/headless-shell assets were already in
  the cache, and the same Node `20.20.2`/pnpm `10.33.0` environment completed
  `pnpm run test:web` with exit 0, including its `pretest:web` build and test
  compilation. Main therefore accepts the web compatibility objective as
  validated by the real web test; the installer handoff is an environment
  follow-up.
- Archive/package-content objective: normal `vsce ls`/package dependency
  detection misidentified the pnpm layout and reported missing nested dev
  dependencies. The extension uses webpack-bundled assets and does not need
  `node_modules` in the VSIX. Main therefore approves the temporary
  `vsce package --no-dependencies` archive as validation-equivalent after
  successful unzip, manifest, content, and cleanup checks.

## OpenAPI Follow-up

- Owner: Main will hand off the stale generated fixture to a separate task or
  the existing WebAPI maintainer.
- Route: handle it as separate work before Feature Exit; exclude it from Slice
  1 and do not modify the generated artifact in this slice.
- Done condition: `pnpm run openapi:check` exits 0 and
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`
  matches the generator output.

## Implementation Feedback

- The pnpm layout can make normal VSCE dependency detection report missing
  nested dev dependencies even when the approved temporary no-dependencies
  package path succeeds. Future packaging validation should retain both the
  failure context and the explicit fallback path.
- A cached Playwright browser does not guarantee that
  `playwright install --with-deps` will complete in the validation
  environment; the command may hang without output and requires an explicit
  residual record when interrupted.
- `lint:md` is a useful low-cost document gate for this feature: the recorded
  latest result is 39 files with 0 errors.

## Remaining Items And Handoff

- Implementation review verdict: Slice 1 Ready; Slice 2 Ready with no Findings.
  Slice 2 Completion Approval is Approved under the no-Findings automatic-
  approval policy; its completion-gate commit remains pending.
- GitHub Dependabot closure was rechecked on 2026-09-12 and found the 10 open
  alerts listed above. A fresh local audit re-query found 15 advisory IDs and
  16 findings before resolution; the held graph now reports zero. Remote alert
  closure remains unclaimed until publication and a post-publication API
  re-query. The revised plan has independent review `Ready` with no Findings,
  Human Approval recorded on 2026-09-12, and focused replan commit `1b8a2523`.
- The stale OpenAPI fixture baseline is unresolved and must be handled by
  Main/the existing WebAPI maintainer as a separate task or Feature Exit
  follow-up. No generated artifact change is included here.

- Approval Boundary:
  - The exact plan-gate approved paths are the three feature
    documents: `docs/specs/features/dependabot-security-updates/SPECS.md`,
    `docs/specs/features/dependabot-security-updates/TASKS.md`, and
    `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`.
    The revised Replanned Slice 2 package has independent review `Ready` with
    no Findings and Human Approval recorded on 2026-09-12; its focused replan
    commit is `1b8a2523`.
  - The revised Slice 2 implementation target paths are exactly
    `pnpm-workspace.yaml` (existing overrides plus one exact
    `patchedDependencies` registration), `pnpm-lock.yaml`,
    `patches/postman-collection@4.5.0.patch`, and the minimal `.vscodeignore`
    exclusion for that patch path. `package.json`, direct parent declarations,
    production/runtime/test code, generated artifacts, all other
    configuration, and all other paths remain outside the implementation
    slice.
  - Human Approval applies to the revised Slice 2 plan after its independent
    review returned `Ready` with no Findings on 2026-09-12; the approved
    planning package was committed at `1b8a2523` before implementation. Its
    implementation re-review also returned `Ready` with no Findings, and
    Completion Approval was automatically recorded on 2026-09-12. The exact
    implementation diff remains uncommitted and eligible for completion commit.
  - Stop for Replanning, do not stage or commit, and return the exact diff and
    explanation to Main if resolution requires a new direct-parent,
    `package.json`, production dependency/runtime/test/generated artifact,
    other configuration, compatibility-floor, or approval-boundary change, or
    advisory dismissal. The same stop condition applies when any `package`,
    `snapshot`, `integrity`, or `peer` lockfile diff is not explained by the
    approved override, targeted resolution, or unavoidable peer/integrity
    consequence, or when an additional resolution remains for an affected
    family beyond the planned floors.
- Dependencies: Slice 1 Feature Intake, plan review, Human Approval,
  implementation review, Completion Approval, and completion commit are
  complete and preserved. The revised Slice 2 plan's independent review,
  Human Approval, focused plan-gate commit `1b8a2523`, implementation review,
  and Completion Approval are complete; its completion commit remains. Feature
  Exit remains blocked until Slice 2 is committed, remote alerts are
  re-queried after publication, and the separate OpenAPI follow-up is resolved.
- Risks:
  - A global js-yaml override continues to place 4.x on two legacy 3.x parent
    ranges; this is existing branch behavior, not a new major-line change, but
    Prism/textlint/OpenAPI validation must detect incompatibility.
  - PostCSS/nanoid and peer snapshots can cause wider lockfile churn; every
    changed package must be explained or removed from the diff.
  - Build, VSCE, Prism, and test-web paths execute the affected development
    packages differently, so audit success alone is insufficient.
  - Registry or advisory drift can raise a floor after planning; compatible
    drift remains in scope, while an incompatible fix triggers Replanning.
- Out of Scope: broad dependency freshness, direct-parent updates, new
  persistent overrides for linkify-it, morgan, or nanoid, direct dependency
  declarations, production/runtime/test/generated-source edits, behavior
  changes, engine changes, configuration outside the existing override plus
  exact patch registration and minimal `.vscodeignore` exclusion, alert
  dismissal, README/CHANGELOG changes, stale OpenAPI repair, Playwright
  installer remediation, and Feature Exit work.

## Planning Inputs

- Planning re-query on 2026-08-10 found 17 open Dependabot alerts: 11 high and
  6 moderate across js-yaml, postcss, fast-uri, undici, brace-expansion,
  shell-quote, linkify-it, and morgan.
- `pnpm audit --json` found 23 advisories: 17 high and 6 moderate. In addition
  to the open-alert set it includes two newer brace-expansion floors and two
  nanoid findings, establishing the ten selected floors in `SPECS.md` R2.
- Immediate-parent ranges admit every selected patch. Existing 4.x js-yaml
  parents use `^4.1.0`/`^4.1.1`; fast-uri uses `^3.0.1`; PostCSS uses
  `^8.4.40`; undici uses `^7.12.0`; brace-expansion uses `^1.1.7`/`^5.0.2`;
  shell-quote uses `^1.6.1`; linkify-it uses `^5.0.1`; morgan uses `^1.6.1`;
  and PostCSS 8.5.23 uses `nanoid@^3.3.16`.
- Direct-parent updates are wider and do not solve the complete graph:
  `@stoplight/prism-cli` 5.16.0 raises its declared Node engine to
  `>=24.18.0`, while `@vscode/test-web` 0.0.81 retains
  `koa-morgan@^1.0.1`. The selected minimum is existing-override target updates
  plus targeted lockfile resolution, with no `package.json` change or new
  override.
- Replanning re-query (2026-09-12) found 15 audit advisory IDs and 16
  findings: 10 high, 5 moderate, and 1 low. The current mapped floors are
  `@faker-js/faker@10.5.0`, `@humanfs/node@0.16.8`,
  `baseline-browser-mapping@2.11.0`, `browserslist@4.28.7`,
  `fast-uri@3.1.6`, `js-yaml@4.3.2`, `morgan@1.12.0`, `nanoid@3.3.18`,
  `postcss-selector-parser@7.1.3`, and `qs@6.16.0`; the low family is
  included only because it is current GitHub alert 180 and is resolved by the
  same CSS-toolchain update. The 10 GitHub alerts are mapped in
  `TRACEABILITY.md`.

## Impact And Risks

- Build risk: PostCSS and nanoid are under CSS Loader and can affect desktop
  and web bundling.
- Tooling risk: js-yaml and fast-uri are under Prism/VSCE-related tooling;
  undici, linkify-it, and brace-expansion are under VSCE packaging paths.
- Test risk: morgan is under `@vscode/test-web`; shell-quote and
  brace-expansion participate in test/lint script orchestration.
- Replan test risk: Faker 10.5.0 is applied to both the Prism HTTP `^10.4.0`
  edge and the exact `postman-collection` 5.5.3 manifest edge. The latter's
  4.5.0 package must use the planned pinned legacy-API facade; full
  Prism/package-tool dynamic-variable smoke coverage must detect any
  incompatible API or behavior change.
- Resolution risk: lockfile updates can change additional compatible
  transitive versions. The plan must distinguish required consequences from
  unrelated churn.
- Advisory drift risk: `pnpm audit` already reports newer findings than the 17
  GitHub alerts. Validation must use the current advisory set, not only the
  intake snapshot.
- Compatibility risk: undici 7.29.0 retains the current undici 7.x
  `>=20.18.1` engine floor; brace-expansion 5.0.9 supports Node 20 or >=22.
  Faker 10.5.0 requires Node 20.19 or newer, which is already required by the
  current 10.4.0 path. Existing Node 20 CI must be exercised with its exact
  patch recorded.

## Traceability

- TRACEABILITY.md required: yes
- Reason: multiple advisory families and several independent tooling paths
  require explicit correspondence between security requirements, the future
  plan, and audit/build/desktop/web validation.

## Feature Exit

- Definition of Done status: not satisfied. Slice 1 implementation,
  independent review, Completion Approval, and the focused completion-gate
  branch commit are complete. Revised Slice 2 implementation review and
  Completion Approval are complete, but its completion commit, post-publication
  Dependabot re-query, and the separate stale OpenAPI fixture follow-up remain.
- Durable documentation updates: none expected beyond temporary feature
  artifacts; re-evaluate README and CHANGELOG impact at exit.
- Roadmap propagation: not required; this remains transient dependency
  remediation and no repository-level product ordering or future work changed.
- Open risks: current advisory drift requires Replanning; the stale OpenAPI
  fixture remains a separate follow-up owned by Main/the WebAPI maintainer.
- Feature Exit review date: 2026-09-12
- Feature Exit recommendation: Do not close

## Validation

- [x] Security evidence recorded: 17 open Dependabot alerts (11 high/6
      moderate), 23 pre-resolution audit advisories (17 high/6 moderate), and
      0 post-resolution audit findings; moderate audit succeeded.
- [x] Node `20.20.2`/pnpm `10.33.0` frozen install succeeded and all ten
      security floors were met.
- [x] `qlty`, build, test compilation, desktop tests, and web tests completed;
      `pnpm run test:web` exited 0 with only existing connection/close logs.
- [x] `pnpm run lint:md` completed for 35 files with 0 errors.
- [x] VSIX temporary `--no-dependencies` package archive, list, manifest,
      content validation, and cleanup succeeded after normal pnpm-layout
      dependency detection failed.
- [x] Confirm no production source, generated artifact, user documentation, or
      behavior-contract update is required.
- [x] `openapi:check` executed; its only failure is the stale generated WebAPI
      fixture baseline recorded above and assigned as follow-up.
- [x] Feature Exit validation and durable-document evaluation completed;
      closure remains blocked by post-publication Dependabot re-query and the
      stale OpenAPI fixture.
- [x] Replanned Slice 2 audit, floor assertions, lockfile-diff explanation,
      patch provenance, dynamic-variable contract, and affected-tooling
      validation complete; the independent reviewer and completion gate remain.
- [x] Replanned Slice 2 independently reviewed, Human Approved, implemented,
      reviewed, and Completion Approved; no Findings remain.
- [ ] Replanned Slice 2 focused completion commit and publication evidence.

## Feature Exit Revalidation (2026-09-12)

- GitHub currently reports 10 open Dependabot alerts: 180, 181, 182, 183,
  184, 186, 187, 188, 191, and 192. The original alerts 156-176 are no
  longer open, but these newer alerts supersede the implementation-time
  security floors under R3 and require Replanning within this feature purpose.
- Current `pnpm audit --json` re-query reports 15 advisory IDs affecting 16
  resolved vulnerability findings: 10 high, 5 moderate, and 1 low. The
  high/moderate
  findings are `nanoid` 3.3.17 (GHSA-2v37-7h3g-55p8), `browserslist` 4.28.2
  (GHSA-c83g-rgw3-j3cx and GHSA-73wf-gq98-2v4g), `@humanfs/node` 0.16.6
  (GHSA-p498-v437-472g), `@faker-js/faker` 5.5.3/10.4.0
  (GHSA-qxc2-j82w-r537), `qs` 6.15.2 (GHSA-x5fp-wj9c-mxmx and
  GHSA-4mjr-xmp4-gh2g), `fast-uri` 3.1.5 (GHSA-5jgf-p345-68v8,
  GHSA-f65p-4m7j-42xc, GHSA-fph4-wmhf-6fwf, GHSA-jqff-g426-hqxp),
  `baseline-browser-mapping` 2.10.20 (GHSA-w5vr-8v7q-w6rv), `js-yaml`
  4.3.1 (GHSA-2883-xcg3-v3hh), and `morgan` 1.11.0
  (GHSA-jxfw-x594-9x9m). The low finding is `postcss-selector-parser` 7.1.0
  (GHSA-w9m9-85wc-3x92). The 15 IDs are mapped to Slice 2 in
  `TRACEABILITY.md`. `pnpm audit --audit-level moderate` exits 1 with 16
  vulnerabilities.
- `pnpm run openapi:check` remains failing because
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is
  stale. No generated artifact was changed in this Feature Exit review.
- No runtime, test, configuration, README, CHANGELOG, roadmap, or durable
  product-contract changes are required by this review. The selected feature
  folder must remain until the advisory Replanning work and the independent
  OpenAPI follow-up are resolved.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
