# Feature Tasks: Complete WebAPI Infrastructure Boundaries

## Agent Brief

- Purpose: finish WebAPI port/adapter/bootstrap ownership without changing beta
  behavior or endpoint scope.
- Approved or active slice: none; Slice 1 is complete.
- Do not change endpoints, beta labeling, credentials, host availability, or
  response/error semantics.
- Keep real-environment evidence in `import-definition-via-webapi`.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the import use case.
- Inspect the existing import feature only for preserved behavior and manual
  ownership.
- Validate the slice with focused WebAPI tests, desktop/web checks, OpenAPI
  reproducibility, build, and qlty.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: run `sdd-plan-task` in Feature Exit Mode.

## Plan Status

- Status: Complete
- Planning scope: one cohesive boundary slice covering the application import
  use case and contracts, infrastructure request/response/authentication
  mapping, bootstrap host selection, presentation delegation, and boundary
  validation.
- Review status: revised plan reviewed as ready for approval.
- Human approval: approved in current conversation for Slice 1.
- Active implementation slice: none; Slice 1 completion was approved in the
  current conversation.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1, Establish the host-neutral WebAPI import boundary,
  within its recorded approval boundary and out-of-scope constraints.

Implementation must not start while Status is Pending. After plan review, clear
human approval must name Slice 1 before runtime code, tests, generated
artifacts, or configuration are edited.

## Replanning Context

- Mode: Replanning Mode after the initial `sdd-review-plan` review.
- Affected slice: Slice 1 only; no completed or approved slice exists.
- Discovered gaps:
  - credential-reference creation and persistence orchestration had no explicit
    final owner
  - bootstrap dependency-shape impact omitted `extensionSubscriptions.ts` and
    its focused tests
  - traceability did not directly map the use case and its three behavioral
    scenarios
  - Slice 1 did not explicitly preserve `engines.vscode: ^1.75.0`
- Revision boundary: clarify those four decisions without changing slice count,
  endpoint/authentication behavior, beta/host scope, or observable results.

## Planning Gate

- Active feature folder:
  `docs/specs/features/complete-webapi-infrastructure-boundaries/`.
- Covered requirements and acceptance criteria: application-owned import
  coordination, repository-owned ports/DTOs/errors, infrastructure-owned HTTP
  and authentication details, bootstrap-owned desktop/web adapter choice,
  presentation isolation from transport responses and adapter construction,
  and preservation of existing contract/mock/privacy/host behavior.
- Implementation slice list and order: Slice 1 only.
- Dependency: completed architecture guardrails, parser isolation, and
  normalized-domain-model work; the active beta evidence feature remains a
  parallel owner only for real-environment evidence and beta-exit decisions.
- Smallest useful slice decision: the application contract, infrastructure
  mapping, bootstrap selection, and presentation dependency must change
  together. Splitting by layer would leave either transport semantics in the
  application contract or two competing command paths and would not establish
  a separately useful boundary.
- Approval boundary: the exact existing read-only SC-009 workflow may be
  rearranged across repository layers, but endpoint scope, authentication
  behavior, host availability, beta labeling, telemetry schema, generated
  OpenAPI artifacts, minimum VS Code compatibility, and user-visible
  response/error meaning may not change. The opaque credential reference may
  move behind infrastructure/bootstrap, but its format and persistence policy
  remain unchanged.
- Unresolved assumption: current automated tests are the source of truth for
  preserved desktop, unsupported-web, warning, error, and privacy behavior;
  real-environment completeness remains unresolved in the related beta
  feature and is not evidence for this architecture slice. A credential-store
  write rejection currently propagates rather than becoming an import result;
  this slice characterizes and preserves that behavior instead of silently
  introducing a new user-visible error semantic.
- Branch prerequisite: implementation must use a dedicated non-doc feature
  branch rather than the current `codex/migrate-diagnostics-hover-boundaries`
  branch.

## Implementation Slices

### Slice 1: Establish the host-neutral WebAPI import boundary

- Status: Complete
- Scope:
  - Refactor `src/application/webapi-import/` so the application owns an
    explicit import use case, host-neutral input/result DTOs, its port, and
    repository-owned errors without exposing HTTP methods, API paths, query
    constants, generated response types, or host adapter selection.
  - Keep SC-009 request construction, definition-only query mapping, credential
    resolution and authorization-header encoding, HTTP status mapping,
    generated response validation, warnings, and server-response conversion in
    `src/infrastructure/webapi/`.
  - Make the infrastructure credential adapter derive and persist the existing
    stable credential reference from connection/scope identity, returning that
    reference as an opaque value. Application DTOs may carry the opaque
    reference but never credential values, reference construction rules, or
    VS Code secret-storage details.
  - Make `src/bootstrap/extension/extensionDependencies.ts`,
    `extensionSubscriptions.ts`, and `webapiImportWiring.ts` compose one
    injected import capability. On desktop it persists collected credentials
    through infrastructure and then invokes the application use case with the
    opaque reference; on web it exposes the existing unsupported-host
    capability before presentation prompts. Bootstrap, not presentation,
    selects the host implementation.
  - Reduce
    `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`
    to collecting connection/scope/credential input, consulting and invoking
    the injected import capability, presenting repository-owned results, and
    preserving telemetry. It must not construct HTTP-shaped port requests,
    derive credential references, call credential storage directly, choose a
    concrete or host-specific adapter, or interpret raw server responses.
  - Update focused application, infrastructure, presentation, bootstrap, and
    architecture tests together. Generated OpenAPI artifacts and their source
    contract are validation inputs, not planned edits.
- User / Domain Value: preserves the existing beta import while making its
  architecture boundary explicit, so future downstream consumers cannot
  accidentally depend on JP1/AJS WebAPI transport or generated server shapes.
- Cohesive Change Group:
  - `src/application/webapi-import/importAjsDefinitionViaWebApi.ts`
  - `src/infrastructure/webapi/Jp1Ajs3WebApiImportAdapter.ts`
  - `src/infrastructure/webapi/VscodeWebApiCredentialStore.ts`
  - `src/bootstrap/extension/extensionDependencies.ts`
  - `src/bootstrap/extension/extensionSubscriptions.ts`
  - `src/bootstrap/extension/webapiImportWiring.ts`
  - `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`
  - `src/test/suite/importAjsDefinitionViaWebApi.test.ts`
  - `src/test/suite/Jp1Ajs3WebApiImportAdapter.test.ts`
  - `src/test/suite/VscodeWebApiCredentialStore.test.ts`
  - `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`
  - `src/test/suite/webapiImportWiring.test.ts`
  - `src/test/suite/extensionDependencies.test.ts`
  - `src/test/suite/extensionSubscriptions.test.ts`
  - focused boundary, architecture, manifest, telemetry, and OpenAPI
    reproducibility tests when their asserted contract changes
- Acceptance:
  - The application-facing port request describes the requested definition
    import and connection/scope context without `GET`,
    `/ajs/api/v1/objects/statuses`, `DEFINITION`, or generated WebAPI types.
  - An application-owned use case invokes that port and returns only
    repository-owned success, warning, and error DTOs. Its request may contain
    an opaque credential reference but not username/password values or
    reference-construction/storage rules.
  - Infrastructure alone translates the request into the generated SC-009
    contract, derives/persists/resolves the stable credential reference, builds
    transport headers, validates raw responses, maps HTTP/transport failures,
    and converts successful resources to application DTOs.
  - Bootstrap alone constructs concrete credential/WebAPI adapters, coordinates
    desktop credential persistence before invoking the application use case,
    and selects desktop support versus the unchanged unsupported-web capability.
  - Presentation retains the same prompts, beta messages, cancellation flow,
    safe error display, telemetry event names/properties/order, and
    unsupported-web result before prompting while depending on one injected
    import capability rather than credential storage or a transport-shaped
    port.
  - Existing SC-009 contract, read-only scope, desktop support, unsupported-web
    result, credential privacy, partial/empty/missing-definition warnings, and
    recoverable error categories remain unchanged.
  - `package.json` retains `engines.vscode: ^1.75.0`; the refactor introduces no
    VS Code API unavailable at that minimum and no Node-only dependency in a
    shared web path.
- Validation:
  - Update `importAjsDefinitionViaWebApi.test.ts` to prove the host-neutral use
    case/port contract and repository-owned results without transport fields.
  - Update `Jp1Ajs3WebApiImportAdapter.test.ts` and
    `VscodeWebApiCredentialStore.test.ts` to prove SC-009 URL/query/header
    construction, credential isolation, response conversion, warnings,
    malformed data, timeout/network handling, and safe HTTP error mapping.
  - Update `importAjsDefinitionViaWebApiCommand.test.ts` and
    `webapiImportWiring.test.ts` to prove unchanged command behavior and
    bootstrap-selected desktop/web execution without presentation-side adapter
    choice, credential-reference derivation, or credential-store calls. Cover
    the unsupported-web result before prompts and preserve host telemetry.
  - Update `extensionDependencies.test.ts` and
    `extensionSubscriptions.test.ts` to prove the revised import capability is
    composed and propagated without exposing concrete infrastructure types.
  - Add a characterization assertion for the current credential-store write
    rejection so the refactor does not silently turn it into a new structured
    result or change command timing.
  - Strengthen `webapiImportBoundary.test.ts` and, only where a concrete rule
    needs coverage, `architectureDependencyRules.test.ts` so transport and
    generated WebAPI semantics cannot return to application or presentation.
  - Run the focused WebAPI suites for application, adapter, credential,
    command, wiring, extension dependencies/subscriptions, boundary, generated
    artifacts, manifest, and telemetry. `packageManifest.test.ts` must continue
    to verify `engines.vscode: ^1.75.0`.
  - Run `rtk pnpm run openapi:check`, desktop and web test preparation/runs,
    `rtk pnpm run build`, and `rtk pnpm run qlty` because the slice changes
    shared contracts, bootstrap composition, and extension-host behavior.
  - Review new Qlty smells. Record metric movement only if it identifies a
    concrete responsibility or compatibility risk.
- Production Readiness:
  - Failure mode: preserve cancellation, unsupported host, unavailable or
    invalid credentials, authentication/authorization, invalid request,
    missing resource, conflict, unavailable Web Console, server error,
    unexpected status, timeout/network, and malformed-response categories;
    error text and telemetry must not expose secrets or imported content.
    Preserve the current credential-store write rejection behavior; changing it
    to a structured failure requires re-planning because that would alter
    observable error semantics.
  - JP1/AJS compatibility: preserve JP1/AJS3 version 13 SC-009, manual section
    7.1.1, the current definition-only unit-list query, response mapping, and
    read-only scope. No command/config reference or OpenAPI source change is
    planned.
  - Large or malformed input risk: preserve the `all: false` partial-result
    warning, empty and missing-definition warnings, response-shape rejection,
    and current linear resource mapping. Do not add unbounded retries, parsing,
    or response copies.
  - Desktop/web impact: desktop retains VS Code secret storage and fetch-based
    import; web remains explicitly unsupported before prompting. Shared
    application code must remain browser-safe and free of Node-only or VS Code
    imports. Preserve `engines.vscode: ^1.75.0` and use no newer VS Code API.
  - README/docs impact: no README or use-case behavior update is expected
    because the slice preserves externally documented behavior. Update durable
    docs only if implementation disproves a current boundary statement.
  - CHANGELOG impact: none expected under the repository criteria because this
    is behavior-preserving internal architecture work. Re-evaluate and stop for
    re-planning if any externally observable behavior must change.
- Approval Boundary: approve one behavior-preserving architecture slice across
  the named application, infrastructure, bootstrap, presentation, and test
  surfaces. Credential-reference derivation and secret persistence move from
  presentation behind the infrastructure/bootstrap capability, while the
  reference format, persistence policy, stored credential shape, and write
  rejection behavior remain unchanged. Any new endpoint, authentication
  behavior, beta/command label, browser support, telemetry schema, generated
  artifact, minimum VS Code version, or response/error semantic requires
  re-planning and separate approval.
- Dependencies:
  - Completed architecture guardrails, isolated parser boundary, and normalized
    domain model.
  - Existing generated OpenAPI SC-009 contract and mock fixtures.
  - No dependency on real-environment smoke evidence or beta exit.
- Risks:
  - The current application request encodes HTTP method/path/query constants,
    while presentation also owns host rejection, credential-reference
    construction, and direct port orchestration; incomplete migration could
    leave duplicate ownership.
  - Moving command dependencies can accidentally alter cancellation timing,
    credential persistence, unsupported-web behavior, or telemetry stage
    ordering even when the import result is unchanged.
  - Host selection must move out of presentation without losing the host value
    used by existing telemetry; tests must distinguish capability selection
    from telemetry metadata.
  - The current generic architecture guardrails detect dependency direction
    but not semantic leakage such as HTTP fields inside application DTOs; the
    focused boundary test must carry that invariant.
- Out of Scope:
  - new endpoints, unit-information follow-up calls, write/update operations,
    browser-safe WebAPI transport, beta exit, or real-environment evidence
  - changes to OpenAPI source/generated artifacts, command IDs/labels, prompts,
    telemetry schema, credential format, or persistence policy
  - downstream list, flow, CSV, diagnostics, hover, unit-definition, semantic
    diff/report, or telemetry architecture migrations

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: the non-trivial architecture change overlaps a manual-backed active
  beta feature and needs explicit ownership from requirements through tests.
- Status: initial requirement-to-slice validation map created; implementation
  evidence recorded; human completion approval remains pending.

## Implementation Feedback

- The single-slice boundary was appropriate: the application contract,
  infrastructure translation/credential seam, bootstrap capability, and
  presentation delegation changed together without requiring replanning.
- The repository baseline and final `rtk pnpm run openapi:check` both report the
  checked-in generated Prism YAML as stale. This slice did not edit generated
  artifacts because they are explicitly out of scope; the failed check is a
  pre-existing validation caveat rather than a regression from this slice.
- No new JP1/AJS knowledge, VS Code host constraint, or reusable architecture
  policy was discovered. Durable documentation back-propagation is unnecessary.

## Cross-Slice Dependencies

- There is one implementation slice. It must complete as a cohesive boundary;
  no later slice is planned.
- Real-environment verification and user feedback remain independent work in
  `import-definition-via-webapi` and do not block this internal architecture
  slice or become closure evidence for it.

## Feature-Level Risks

- The guardrail baseline reports no import-direction violation for WebAPI, so
  success depends on proving semantic ownership rather than merely reducing an
  allowlist.
- An apparently mechanical DTO change can alter extension command timing and
  host behavior; focused bootstrap and command tests are required before full
  desktop/web validation.
- If a clean boundary cannot preserve current authentication, endpoint, or
  error behavior, stop and use Replanning Mode rather than broadening Slice 1.
- Completion approval must account for the pre-existing stale Prism generated
  artifact reported by `openapi:check`; correcting that artifact requires a
  separate owner decision because generated artifacts are outside Slice 1.

## Use-Case Back-Propagation

- No durable use-case change is planned because
  `uc-import-ajs-definition-via-webapi.md` already requires infrastructure-owned
  transport/authentication and repository-owned application structures.
- During Feature Exit, update the use case only if implementation establishes
  a reusable behavioral rule not already recorded. Do not propagate internal
  file layout or migration history.

## Feature Exit

- Definition of Done status: not started; Slice 1 requires review, approval,
  implementation, validation, traceability evidence, and completion approval.
- Durable documentation updates: none expected unless implementation disproves
  an existing architecture or use-case statement.
- Open risks: semantic boundary leakage, command-flow regression, and branch
  ownership must be resolved before closure.
