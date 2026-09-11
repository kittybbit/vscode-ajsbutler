# Feature Specification: Dependabot Security Updates

## Purpose

Eliminate known high- and moderate-severity vulnerabilities from the resolved
transitive development dependency graph while preserving extension behavior,
build and test workflows, and supported desktop and web environments.

## Minimal Context

- Current decision: extend the completed security resolution with one
  revalidated, compatible transitive-development-dependency resolution for
  the newer advisory set, without broad dependency modernization or product
  behavior changes.
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
  development toolchain.
- R6: Keep production dependency declarations, runtime source, generated
  artifacts, tests, and product behavior unchanged unless Planning discovers
  that a required security fix cannot be achieved within this boundary and
  returns to Main for replanning or a scope decision.
- R7: Resolve the current low-severity `postcss-selector-parser` alert as an
  incidental consequence of the same compatible CSS-toolchain resolution,
  because it is alert 180 in the current GitHub set. Do not expand the feature
  to unrelated low-only advisory families; a future low-only family requires
  a separate Main decision.

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: none in production code.
- Dependency/tooling boundary: only development dependency declarations,
  resolution policy, and the lockfile may change after approval. Existing
  Clean Architecture dependency rules remain unchanged.

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
  `@faker-js/faker@^10.4.0`, while `postman-collection@4.5.0` retains an exact
  `@faker-js/faker@5.5.3` edge; both affected Faker paths therefore require a
  scoped existing-override remap to 10.5.0. The selected Faker release's Node
  20.19 floor is already present on the current 10.4.0 path and must be
  exercised with the repository's Node 20 validation environment.
- Existing `pnpm-workspace.yaml` overrides already control `js-yaml`,
  `fast-uri`, and `qs` (as well as the completed Slice 1 families). Update
  those affected targets to `4.3.2`, `3.1.6`, and `6.16.0`, respectively. The
  replan may add only the two scoped Faker selectors in this existing override
  section; no other configuration may change.
- Propagation decision: use targeted lockfile resolution for
  `postcss-selector-parser@7.1.3`, `browserslist@4.28.7`,
  `baseline-browser-mapping@2.11.0`, `@humanfs/node@0.16.8`, `morgan@1.12.0`,
  and `nanoid@3.3.18`. Keep `package.json` and all direct-parent versions
  unchanged. If pnpm cannot produce that resolution, or the scoped Faker
  remap is incompatible with Prism/package tooling, stop and return the exact
  blocker to Main rather than widening the implementation silently.

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
  `koa-morgan@^1.0.1` and does not itself select patched morgan. Adding broad
  global overrides is rejected when a targeted lockfile resolution satisfies
  the parent range. The two scoped Faker overrides are required because the
  exact `postman-collection` 5.5.3 edge otherwise remains auditable. A global
  audit suppression or `--prod`-only evidence is also rejected.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  and `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: a production dependency change,
  direct-dependency major update, Node or VS Code compatibility change,
  runtime/test/generated-source edit, new behavior, or an advisory that cannot
  be resolved through compatible development dependency resolution.
- Replanning approval boundary: Slice 1 approvals remain valid only for the
  already completed Slice 1. Replanned Slice 2 has independent plan review
  `Ready` with no Findings and recorded Human Approval for the existing
  override section plus `pnpm-lock.yaml`; its focused replan commit remains
  pending. `package.json`, direct/production dependencies, runtime/tests,
  generated artifacts, all other configuration, and VS Code compatibility
  remain outside the boundary.

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
- The 17 Dependabot alerts that originated this feature and the current
  compatible alerts 180, 181, 182, 183, 184, 186, 187, 188, 191, and 192 are
  closed after the updated lockfile reaches GitHub; any newer alert for the
  same resolved graph is also resolved or returned to Main as a blocker. The
  low-severity alert 180 is included only because its package is already an
  affected CSS-toolchain family in this replan.
- Dependency changes remain limited to the approved development-tooling
  resolution, the existing override section, and its lockfile consequences.
- The approved risk-based validation passes, including quality checks, build,
  and relevant desktop and web test/tooling paths.
- `engines.vscode`, production source, JP1/AJS behavior, architecture rules,
  README, and user-facing contracts remain unchanged.
- The stale generated OpenAPI fixture remains unchanged and is reported as an
  independent WebAPI follow-up; it is not silently counted as security-slice
  success or mixed into this implementation.

## Durable Document Impact

- Requirements use cases: no update; observable product behavior does not
  change.
- `docs/specs/roadmap.md`: no update; this is transient branch remediation,
  not unfinished repository-level product work.
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

- The exact lockfile-only command sequence is an implementation detail and
  must be supported by a resolved-graph check. The scoped Faker remap is the
  only intentional transitive major-line change; Prism and package-tool smoke
  validation must prove it is compatible. If it is not, the feature stops for
  a new Main scope decision rather than changing direct dependencies.
