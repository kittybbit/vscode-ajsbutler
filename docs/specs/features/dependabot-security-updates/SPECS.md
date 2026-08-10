# Feature Specification: Dependabot Security Updates

## Purpose

Eliminate known high- and moderate-severity vulnerabilities from the resolved
transitive development dependency graph while preserving extension behavior,
build and test workflows, and supported desktop and web environments.

## Minimal Context

- Current decision: establish a security-clean development dependency
  resolution without broad dependency modernization or product behavior
  changes.
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
- Additional risk evidence: `pnpm audit --json` currently reports 23
  advisories (17 high and 6 moderate), including two `nanoid@3.3.12`
  advisories and newer `brace-expansion` advisories not yet represented in the
  17 open Dependabot alerts.
- JP1/AJS reference basis: not applicable. This feature is based on repository
  supply-chain risk and published package advisories; it does not define or
  infer JP1/AJS product behavior.
- Source use case: none; no observable product use-case contract changes.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- R1: The resolved development dependency graph must no longer contain a
  version affected by any high- or moderate-severity advisory detected for
  this branch at implementation time.
- R2: At minimum, resolution must meet the currently known security floors:
  `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`,
  `undici@7.29.0`, `brace-expansion@1.1.18` and `5.0.9` for the two
  retained major lines, `shell-quote@1.9.0`, `linkify-it@5.0.2`,
  `morgan@1.11.0`, and `nanoid@3.3.17`.
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
- The known patched versions fit the current immediate-parent ranges for
  PostCSS (`^8.4.40`), fast-uri (`^3.0.1`), undici (`^7.12.0`), both
  brace-expansion lines (`^1.1.7` and `^5.0.2`), shell-quote (`^1.6.1`),
  linkify-it (`^5.0.1`), and morgan (`^1.6.1`). PostCSS 8.5.23 declares
  `nanoid@^3.3.16`, which admits 3.3.17. Current `js-yaml` 4.x consumers admit
  4.3.1; two legacy consumers declare 3.x ranges, but the existing global
  override already resolves those paths to 4.2.0, so moving that same override
  to 4.3.1 preserves the branch's established major-version resolution.
- Existing `pnpm-workspace.yaml` overrides already control `js-yaml`,
  `postcss`, `fast-uri`, `undici`, both brace-expansion lines, and
  `shell-quote`. `linkify-it`, `morgan`, and `nanoid` currently have no
  explicit override.
- Propagation decision: update the existing affected override targets and use
  targeted lockfile resolution, without adding overrides, for linkify-it,
  morgan, and nanoid because their current parents already admit the patched
  versions. Keep `package.json` and direct-parent versions unchanged. If pnpm
  cannot produce that resolution without a new override or parent update,
  stop for Replanning rather than widening the implementation silently.

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
  `koa-morgan@^1.0.1` and does not itself select patched morgan. Adding new
  linkify-it, morgan, or nanoid overrides is also unnecessary while targeted
  lockfile resolution satisfies the current parent ranges. The selected
  approach is therefore the existing-override update plus targeted lockfile
  resolution described above.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  and `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: a production dependency change,
  direct-dependency major update, Node or VS Code compatibility change,
  runtime/test/generated-source edit, new behavior, or an advisory that cannot
  be resolved through compatible development dependency resolution.

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
- The 17 Dependabot alerts that originated this feature are closed after the
  updated lockfile reaches GitHub; any newer alert for the same resolved graph
  is also resolved or returned to Main as a blocker.
- Dependency changes remain limited to the approved development-tooling
  resolution and its lockfile consequences.
- The approved risk-based validation passes, including quality checks, build,
  and relevant desktop and web test/tooling paths.
- `engines.vscode`, production source, JP1/AJS behavior, architecture rules,
  README, and user-facing contracts remain unchanged.

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

- None blocking Planning. The exact compatible resolution mechanism is a
  plan-author responsibility and must be supported by a resolved-graph check.
