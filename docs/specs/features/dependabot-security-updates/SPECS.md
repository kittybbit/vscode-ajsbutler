# Feature Specification: Dependabot Security Updates

## Purpose

Eliminate known high- and moderate-severity vulnerabilities from the resolved
transitive development dependency graph while preserving extension behavior,
build and test workflows, and supported desktop and web environments.

## Minimal Context

- Current decision: distinguish the committed, locally validated security
  implementation from post-publication security verification and separately
  owned OpenAPI reproducibility work, without broad dependency modernization
  or product behavior changes.
- Feature kind: transient branch feature.
- Selected feature folder:
  `docs/specs/features/dependabot-security-updates/`.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when checking
  advisory coverage or validation correspondence.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Source: branch goal on `codex/dependabot-security-updates` to resolve the 17
  open GitHub Dependabot alerts for transitive development dependencies in
  `pnpm-lock.yaml` as observed on 2026-08-10.
- Alert basis: Dependabot alerts 156-176 that remain open, excluding numbers
  not present in the open result. They cover `morgan`, `brace-expansion`,
  `js-yaml`, `shell-quote`, `linkify-it`, `fast-uri`, `postcss`, and `undici`.
- Additional intake risk evidence (2026-08-10): `pnpm audit --json` reported 23
  advisories (17 high and 6 moderate), including two `nanoid@3.3.12`
  advisories and newer `brace-expansion` advisories not yet represented in the
  17 open Dependabot alerts.
- Replanning trigger (2026-09-12): the original alerts 156-176 are closed, but
  GitHub currently reports open alerts 180, 181, 182, 183, 184, 186, 187, 188,
  191, and 192. A fresh local `pnpm audit --json` reports 15 advisory IDs and
  16 findings (10 high, 5 moderate, 1 low), and
  `pnpm audit --audit-level moderate` exits 1. The current advisory inventory
  and exact dependency paths are recorded in `TRACEABILITY.md`; this is a
  targeted Replanning update within the existing security-remediation purpose.
- Replanning blocker (2026-09-12): the approved Faker `10.5.0` resolution
  makes the current `postman-collection@4.5.0` module fail during initialization
  because its dynamic-variable code imports the pre-v10 locale shape and reads
  removed APIs such as `faker.address.city`. Audit high/moderate/low findings
  are 0, but Prism smoke cannot start. The current uncommitted dependency diff
  is retained; this compatibility failure requires a focused dependency-patch
  replan rather than restoring vulnerable Faker or bypassing the smoke test.
- JP1/AJS reference basis: not applicable. This feature is based on repository
  supply-chain risk and published package advisories; it does not define or
  infer JP1/AJS product behavior.
- Source use case: none; no observable product use-case contract changes.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- R1: The resolved development dependency graph must no longer contain a
  version affected by any high- or moderate-severity advisory detected for
  this branch at implementation time.
- R2: The completed Slice 1 floors remain unchanged, and the replan must add
  these current floors: `js-yaml@4.3.2`, `postcss-selector-parser@7.1.3`,
  `fast-uri@3.1.6`, `browserslist@4.28.7`,
  `baseline-browser-mapping@2.11.0`, `@humanfs/node@0.16.8`,
  `@faker-js/faker@10.5.0`, `morgan@1.12.0`, `nanoid@3.3.18`, and
  `qs@6.16.0`. The retained Slice 1 floors are
  `postcss@8.5.23`, `undici@7.29.0`, `brace-expansion@1.1.18` and `5.0.9`,
  `shell-quote@1.9.0`, and `linkify-it@5.0.2`.
- R3: Planning must re-query Dependabot and the package audit immediately
  before selecting versions. A newer advisory or security floor supersedes
  the intake snapshot and requires coverage within this same security-clean
  purpose when it remains a compatible transitive development update.
- R4: Use the smallest compatible dependency-resolution change. Do not include
  unrelated direct dependency upgrades, major-version modernization, or
  formatting churn.
- R5: Preserve build, lint, test orchestration, extension packaging, OpenAPI
  tooling, and desktop/web test behavior exercised through the affected
  development toolchain. Prism/Postman startup and dynamic-variable smoke
  coverage must remain operational after the Faker compatibility fix.
- R6: Keep production dependency declarations, runtime source, generated
  artifacts, tests, and product behavior unchanged unless Planning discovers
  that a required security fix cannot be achieved within this boundary and
  returns to Main for replanning or a scope decision.
- R7: Resolve the current low-severity `postcss-selector-parser` alert as an
  incidental consequence of the same compatible CSS-toolchain resolution,
  because it is alert 180 in the current GitHub set. Do not expand the feature
  to unrelated low-only advisory families; a future low-only family requires
  a separate Main decision.
- R8: Retain `@faker-js/faker@10.5.0` on every resolved path. Make the
  `postman-collection@4.5.0` legacy dynamic-variable consumer compatible through
  one exact transitive package patch (or a verified published equivalent) that
  provides the referenced legacy API facade. The plan must inventory all 118
  dynamic-variable generators and 111 Faker references, including the 47
  Faker 10-incompatible legacy APIs across address/location, name/person,
  random/helpers, datatype/number/string, image, finance, and related modules.
  The facade must preserve `this` binding, arguments, public Substitutor
  behavior, URL/UUID/IP/email/date/path and other output contracts, seeded
  determinism, and explicitly define fixed-clock/RNG handling for
  time/random-dependent exceptions. Validation must prove zero legacy direct
  references after patching and exercise every generator. The patch must
  contain no vulnerable Faker copy and must not alter production/runtime
  behavior. Restoring Faker 5.5.3, suppressing the advisory, or skipping Prism
  smoke is not an allowed resolution.
- R9: Preserve third-party patch provenance and license metadata. Record the
  upstream package URL/version, registry integrity, repository tag or source
  hash, and patch target. The patch may modify only the required portions of
  `dynamic-variables.js`; manifest, install scripts, LICENSE, dependency
  declarations, and package attribution must remain unchanged. Preserve
  `postman-collection` Apache-2.0 and Faker MIT metadata/license information.
- Provenance anchor for `postman-collection@4.5.0`: upstream
  `https://github.com/postmanlabs/postman-collection`, annotated tag object
  `fbfb40ebf1858b88ad6fb1da8771bf68909cbae6` at `refs/tags/v4.5.0`, and its
  peeled source commit `0bc9665661a9f8ca4fdd91128d8312d0608ec637` at
  `refs/tags/v4.5.0^{}`. The patch source and validation must use the peeled
  source commit while retaining the annotated-tag object as provenance. The
  registry integrity is
  `sha512-152JSW9pdbaoJihwjc7Q8lc3nPg/PC9lPTHdMk7SHnHhu/GBJB7b2yb9zG7Qua578+3PxkQ/HYBuXpDSvsf7GQ==`.
- R10: Keep the development-only patch out of the VSIX. Add the smallest
  `.vscodeignore` exclusion for the exact patch path (or `patches/` only when
  repository conventions require it), then verify the archive contains no
  patch while bundles/assets and license/package attribution remain correct.

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: none in production code.
- Dependency/tooling boundary: only development dependency declarations,
  resolution policy, the exact approved third-party patch file, the minimal
  VSIX exclusion, and the lockfile may change after approval. Existing Clean
  Architecture dependency rules remain unchanged.

## Impact Analysis

### Dependency Impact

- Current affected paths include ESLint/minimatch, CSS Loader/PostCSS,
  Prism/AJV, VSCE/Cheerio/Markdown-It/minimatch, npm-run-all, and
  `@vscode/test-web`/koa-morgan. The resolved graph also contains non-alerting
  `js-yaml` consumers under textlint, Cosmiconfig, Mocha, and
  rc-config-loader that share the existing global override.
- The revalidated patched versions fit the current immediate-parent ranges for
  `postcss-selector-parser` (`^7.0.0`), Browserslist (`^4.28.1`),
  `@humanfs/node` (`^0.16.6`), morgan (`^1.6.1`), nanoid (`^3.3.16`), and
  qs (`^6.12.3`). Browserslist 4.28.7 brings the compatible
  `baseline-browser-mapping@2.11.0` floor. The Prism HTTP path admits
  `@faker-js/faker@^10.4.0`, while the selected `postman-collection@4.5.0`
  package manifest declares an exact `@faker-js/faker@5.5.3` dependency and
  its dynamic-variable module uses pre-v10 APIs. The scoped override to 10.5.0
  is security-correct but requires a compatibility patch for that legacy
  consumer. The selected Faker release's Node 20.19 floor is already present
  on the current 10.4.0 path and must be exercised with the repository's Node
  20 validation environment.
- Existing `pnpm-workspace.yaml` overrides already control `js-yaml`,
  `fast-uri`, and `qs` (as well as the completed Slice 1 families). Update
  those affected targets to `4.3.2`, `3.1.6`, and `6.16.0`, respectively. The
  replan may keep only the two scoped Faker selectors at 10.5.0 and register
  one exact `postman-collection@4.5.0` patch in `pnpm-workspace.yaml`; the only
  configuration exception is one minimal `.vscodeignore` patch exclusion, and
  all other configuration must remain unchanged.
- Propagation decision: use targeted lockfile resolution for
  `postcss-selector-parser@7.1.3`, `browserslist@4.28.7`,
  `baseline-browser-mapping@2.11.0`, `@humanfs/node@0.16.8`, `morgan@1.12.0`,
  and `nanoid@3.3.18`. Keep `package.json` and all direct-parent versions
  unchanged. The patch must adapt only the legacy dynamic-variable import and
  every referenced old Faker method to the 10.5.0 API. Its provenance,
  integrity, source hash/tag, licenses, package manifest, install scripts, and
  dependency metadata must be recorded and preserved. If it cannot preserve
  the complete generator contract or license/package attribution, stop and
  return the exact blocker to Main rather than widening the implementation
  silently.

### Breaking Change Analysis

- User-visible behavior: none expected.
- API/DTO/schema compatibility: no changes permitted.
- VS Code/web extension compatibility: no runtime API change; development
  builds and both host test paths must continue to work.
- Changed scenarios: none.

### Alternative Considerations

- Broad direct-dependency refresh: rejected because it mixes security
  remediation with unrelated modernization and increases regression scope.
- Dismissing alerts because dependencies are development-only: rejected;
  affected packages participate in build, test, package, lint, and mock-server
  workflows.
- Pin only the versions from the original 17-alert snapshot: rejected because
  the current package audit already identifies additional vulnerable
  resolution and higher brace-expansion security floors.
- Compatible parent updates versus narrow overrides: both remain available to
  Planning. A direct `@stoplight/prism-cli` update is rejected because 5.16.0
  widens the graph and declares Node `>=24.18.0`; updating
  `@vscode/test-web` to 0.0.81 is rejected because it retains
  `koa-morgan@^1.0.1` and does not itself select patched morgan. Updating
  Prism/http-spec/Postman is also rejected as a root fix: the current
  `@stoplight/http-spec@7.1.0` still selects the 4.x Postman line, the latest
  published Postman Collection 5.3.1 still declares Faker 5.5.3, and Prism
  5.16 retains the http-spec path while raising its Node floor. Adding broad
  global overrides is rejected when a targeted lockfile resolution satisfies
  the parent range. The selected exact Postman patch keeps the safe Faker
  10.5.0 graph while adapting only the legacy dynamic-variable facade. A
  global audit suppression or `--prod`-only evidence is also rejected.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  and `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: a production dependency change,
  direct-dependency major update, Node or VS Code compatibility change,
  runtime/test/generated-source edit, new behavior, or an advisory that cannot
  be resolved through compatible development dependency resolution.
- Replanning approval boundary: Slice 1 approvals remain valid only for the
  already completed Slice 1. The prior Replanned Slice 2 approval covered only
  the override and lockfile resolution and is superseded by the implementation
  compatibility blocker; it did not include the patch or `.vscodeignore`. The
  revised Slice 2 plan review is `Ready` with no Findings and Human Approval
  was automatically recorded on 2026-09-12. The approved planning package is
  exactly `docs/specs/features/dependabot-security-updates/SPECS.md`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`. The
  approval covers exactly four implementation paths: `pnpm-workspace.yaml`
  (the existing overrides plus one `patchedDependencies` registration),
  `pnpm-lock.yaml`, `patches/postman-collection@4.5.0.patch`, and one minimal
  `.vscodeignore` exclusion for that patch. The prior approval did not include
  either the patch file or `.vscodeignore`; `package.json`, direct/production
  dependencies, repository runtime/tests, generated artifacts, all other
  configuration, and VS Code compatibility remain outside the boundary. The
  focused replan commit is eligible and pending through `approval-committer`.

## Compatibility

- VS Code compatibility remains `^1.75.0` from `package.json`.
- Node compatibility remains the repository contract `>=20`; the current and
  patched undici 7.x releases both require Node `>=20.18.1`, while
  brace-expansion 5.0.9 supports Node 20 or >=22. Planning and validation must
  ensure the existing Node 20 CI environment still resolves and runs.
- Web extension compatibility: shared runtime bundles and web tests must remain
  behaviorally unchanged; no Node built-in may enter production source.
- Desktop extension compatibility: extension build, desktop tests, and package
  tooling must continue to work without a runtime contract change.
- JP1/AJS compatibility: all existing definition parsing, views, export,
  diagnostics, navigation, WebAPI import, semantic diff/report, and telemetry
  behavior must remain unchanged.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The selected lockfile resolves no version below the revalidated security
  floor for every affected package family.
- `pnpm audit --audit-level moderate` reports no high- or moderate-severity
  vulnerability in the resolved dependency graph, or any unavoidable result
  is returned to Main as an explicit blocker rather than dismissed silently.
- Security verification is complete only after the updated lockfile reaches
  the default branch and a GitHub Dependabot re-query confirms that the
  originating alerts and affected compatible alerts 180, 181, 182, 183, 184,
  186, 187, 188, 191, 192, and 193 as inventoried in `TRACEABILITY.md` are
  closed with no affected remaining or
  newly opened alert for the published graph. Any unresolved/new alert is
  returned to Main for the security owner or Replanning and keeps security
  verification incomplete; it must not be dismissed, waived, or claimed as
  already resolved from local audit evidence. The low-severity alert 180 is
  included only because its package is already an affected CSS-toolchain
  family in this replan.
- Dependency changes remain limited to the approved development-tooling
  resolution, the existing override section, the exact
  `postman-collection@4.5.0` patch registration and patch file, the minimal
  `.vscodeignore` exclusion, and their lockfile consequences.
- With Faker resolved to `10.5.0`, `postman-collection@4.5.0` loads without a
  legacy API `TypeError`; all 118 public `$random*` dynamic-variable
  generators cover the 111 Faker references and 47 legacy API mappings,
  preserve argument/`this`/output contracts and seeded determinism, and the
  Prism smoke starts and serves the existing fixtures. The patched package has
  zero remaining direct references to the legacy Faker APIs.
- The patch provenance, upstream source hash/tag, registry integrity,
  unchanged manifest/install scripts/dependency metadata, and Apache-2.0/MIT
  license attribution are recorded. The VSIX contains no development-only
  patch, while its bundles, assets, and license/package attribution remain
  valid.
- The approved risk-based validation passes, including quality checks, build,
  and relevant desktop and web test/tooling paths.
- `engines.vscode`, production source, JP1/AJS behavior, architecture rules,
  README, and user-facing contracts remain unchanged.
- The stale generated OpenAPI fixture remains unchanged and is reported as an
  independent reproducibility follow-up owned by the existing WebAPI
  maintainer. Its done condition is that the exact fixture matches generator
  output and `pnpm run openapi:check` exits 0. Once explicitly accepted and
  durably assigned, it is not an implementation security blocker; it is not
  silently counted as validation success or mixed into this implementation.

### Implementation Closure Boundary

- Complete, independently reviewed, Completion Approved, and committed
  Slices 1 and 2, with the required local audit-clean and compatibility
  evidence, can satisfy implementation Definition of Done without claiming
  that post-publication security verification is complete.
- Implementation Feature Exit is permissible only after explicit Human
  Approval accepts the pending publication/re-query and separate OpenAPI
  residuals, and durable follow-up records preserve their owners and done
  conditions before this folder is removed. The security owner retains the
  publication/re-query obligation and routing of unresolved/new alerts; the
  existing WebAPI maintainer retains fixture reproducibility ownership. This
  acceptance is not advisory dismissal or waiver. Independent Feature Exit,
  explicit Closure Approval, and the focused closure commit remain required
  under `docs/specs/README.md`; approval state belongs only in `TASKS.md`.

## Durable Document Impact

- Requirements use cases: no update; observable product behavior does not
  change.
- `docs/specs/roadmap.md`: implementation closure with accepted residuals
  requires the smallest durable follow-up propagation passing the Durable
  Documentation Gate, preserving publication/security-verification and
  OpenAPI reproducibility owners and done conditions. No product roadmap or
  use-case behavior change is introduced.
- Architecture, context map, glossary, and vision: no update; no durable
  boundary or terminology decision changes.
- README and CHANGELOG: no update expected because no externally observable
  extension behavior changes.
- Temporary feature artifacts are required for approval, traceability, and
  Feature Exit and must be removed only through approved Feature Exit.

## Non-Goals

- General dependency freshness or upgrading all outdated packages.
- Direct dependency major-version upgrades.
- Changing runtime functionality, JP1/AJS semantics, extension commands,
  diagnostics, UI, telemetry, or WebAPI behavior.
- Raising Node, VS Code, desktop, or web compatibility requirements.
- Dismissing, suppressing, or accepting known advisories without an explicit
  Main/human decision.

## Open Questions

- The exact lockfile and patch-registration command sequence is an
  implementation detail and must be supported by a resolved-graph check. The
  scoped Faker remap plus the exact Postman compatibility patch is the only
  intentional transitive major/source adaptation. Prism and package-tool smoke
  validation must prove the complete legacy dynamic-variable contract. If no
  patch can do so without a direct-parent or runtime change, the feature stops
  for a new Main scope decision rather than changing direct dependencies
  silently.
