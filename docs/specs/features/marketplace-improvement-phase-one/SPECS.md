# Feature Specification: Marketplace Improvement Phase One

## Purpose

Enable a Japanese JP1/AJS user visiting the VS Code Marketplace page to
understand within about 30 seconds what the existing extension does, how to try
it, and how it handles business data, through an accurate Japanese-first
README, representative visuals, and discoverable Marketplace metadata.

## Minimal Context

- Feature kind: transient branch feature for `codex/marketplace-improvement`.
- Current decision: improve how existing capabilities and constraints are
  presented without changing extension behavior.
- Source: the user-provided "vscode-ajsbutler Marketplace改善 指示書",
  `/Users/jconee/.codex/attachments/c98f7a39-1ed4-485c-a175-1b146f632789/pasted-text.txt`.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Source branch goal: Marketplace improvement phase one.
- Source use cases:
  - `docs/requirements/use-cases/uc-view-unit-list.md`
  - `docs/requirements/use-cases/uc-explore-flow-graph.md`
  - `docs/requirements/use-cases/uc-show-unit-definition.md`
  - `docs/requirements/use-cases/uc-export-unit-list-csv.md`
  - `docs/requirements/use-cases/uc-import-ajs-definition-via-webapi.md`
- Cross-cutting source: `docs/requirements/cross-cutting/telemetry.md`.
- JP1/AJS reference basis: this feature introduces no JP1/AJS semantics.
  Product claims must be limited to behavior established by the repository
  manifest, durable requirements, implementation, and fixtures. Existing
  JP1/AJS3 version 13 references for selected domain and diagnostic rules do
  not establish a general product-version compatibility claim.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

### MP-01 Japanese-First Product Page

- Make `README.md` Japanese-first and orient its opening toward prospective
  users rather than contributors.
- Present, near the top, the product name, a concrete one-sentence value
  statement, a representative visual, user problems, major existing features,
  and one quick-start path of no more than five steps.
- Use exact command and UI labels verified against `package.json` and the
  current extension; do not invent automatic file recognition or workflow
  steps.
- Describe user value before implementation details and avoid unsupported or
  exaggerated claims.

### MP-02 English And Developer Information Separation

- Preserve useful English product information in `README.en.md` and link it
  from the Japanese README.
- Move contributor setup, package commands, test procedures, SDD and agent
  guidance, parser generation, debugging, and release-oriented information out
  of the Marketplace-facing README into `CONTRIBUTING.md` or links to the
  existing owning documents.
- Keep only a concise contribution link in the Japanese and English product
  pages; do not duplicate the SDD SSOT.

### MP-03 Representative Visual

- Place a privacy-safe visual near the README opening that demonstrates both
  the unit-list and flow-view value, using either a compact demo GIF or clear
  representative screenshots.
- Use repository sample or fictional JP1/AJS data only. Do not expose personal,
  organization, server, credential, or production-environment information.
- Keep image dimensions and file size practical for GitHub and Marketplace
  rendering, and retain useful static screenshots when a GIF is selected.

### MP-04 User-Oriented Capability Summary

- Describe only verified existing capabilities, including unit-list viewing,
  list/flow search, flow visualization, nested-jobnet exploration, unit
  definition details, CSV output, semantic comparison, diagnostics and hover,
  and the read-only WebAPI import beta where relevant.
- Describe the existing `ajsprint` support as command-text generation, not as
  execution or integration, unless separate implementation evidence proves an
  executable workflow before approval.
- Distinguish generally available capabilities from beta or host-limited ones.

### MP-05 Marketplace Metadata

- Preserve the `JP1/AJS Butler` brand while revising `displayName` so its
  jobnet-viewing purpose is understandable.
- Replace the generic description with one factual sentence naming JP1/AJS3
  definitions and the principal list, search, and flow-view value.
- Replace the single keyword with a concise, deduplicated set of relevant
  Japanese and English discovery terms accepted by the Marketplace manifest.
- Do not change the extension identifier, publisher, version, categories,
  commands, activation, or `engines.vscode` as part of metadata cleanup.

### MP-06 Security And Privacy Disclosure

- Add a visible section explaining that telemetry is used, the anonymous
  operational categories it may report, the business data it must not report,
  and that VS Code telemetry settings are respected.
- State file and network behavior precisely: local definitions are read for
  user-requested analysis; CSV and semantic-diff output may be written only
  through user-initiated save actions; telemetry may communicate through its
  adapter; and the desktop-only WebAPI import beta communicates with the
  user-selected JP1/AJS endpoint.
- Do not claim that the extension never writes files or never uses the network.
- Keep credentials, definition content, paths, unit/job names, server names,
  search text, and other prohibited content out of telemetry claims in
  accordance with the durable telemetry requirement.

### MP-07 Unofficial Status, Support Scope, And Constraints

- State clearly and neutrally that this is an unofficial open-source tool and
  is not an official or endorsed Hitachi/JP1 product; use wording that avoids
  claiming an unverifiable personal-development status.
- State the minimum VS Code compatibility from `package.json` and distinguish
  desktop and web-host behavior.
- Document only evidenced definition formats, encodings, product-version
  scope, host limits, and known constraints. Where a support matrix is not
  established, say that explicitly instead of inferring coverage.
- Identify the WebAPI import as read-only, beta, and desktop-only, and give an
  Issue/Feedback path through the repository `bugs.url`.

### MP-08 Marketplace Rendering And Link Integrity

- Preserve working links to the license, issue tracker, English README,
  contributor guidance, and any retained detailed documents.
- Verify Markdown and image rendering in a Marketplace-equivalent package or
  preview, including the first-view hierarchy and absence of broken local
  asset links.

## Architecture

- Domain: none; no JP1/AJS interpretation changes.
- Application: none; no use-case or DTO changes.
- Presentation: no runtime UI changes; only user-facing documentation and
  existing screenshots or a documentation asset may change.
- Infrastructure: none; telemetry and WebAPI behavior are described, not
  changed.
- Configuration: only Marketplace presentation fields in `package.json` may
  change; runtime contributions and compatibility fields remain unchanged.

## Impact Analysis

### Dependency Impact

- Expected documentation surfaces: `README.md`, a new `README.en.md`, and a
  contributor document such as `CONTRIBUTING.md`.
- Expected Marketplace surface: `package.json` `displayName`, `description`,
  and `keywords` only.
- Expected visual surface: existing files under `images/` may be reused; a new
  optimized documentation visual may be added if planning selects it.
- Verification sources: `package.json`, current images and samples, relevant
  durable use cases, telemetry requirements, and targeted implementation
  evidence for file/network and command behavior.
- Propagation decision: README, English retention, contributor separation,
  metadata, disclosure, and representative visual must agree. Runtime code,
  tests, generated artifacts, existing use cases, and architecture remain
  unchanged.

### Breaking Change Analysis

- User-visible behavior: Marketplace wording and documentation structure
  change; extension behavior does not.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: no change; `engines.vscode` remains the
  compatibility contract and host-specific limitations must be described.
- Changed scenarios: none in durable runtime behavior.

### Alternative Considerations

- Keep the current English README and append Japanese text: rejected because
  it leaves contributor detail and product guidance mixed and weakens the
  Japanese-first first view.
- Require a new GIF: not required when privacy-safe list and flow screenshots
  communicate the same value more clearly and with lower asset cost.
- Publish a broad JP1/AJS version or OS matrix: rejected until repository
  evidence establishes those claims.
- Describe `ajsprint` as executable integration: rejected because current
  evidence establishes command generation, not command execution.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` lifecycle approval sections.
- Scope changes requiring re-approval: runtime or UI behavior changes, new
  telemetry or network behavior, new commands or integrations, changes outside
  the three metadata fields, broad compatibility claims, external promotion,
  or a website/Marketplace advertising effort.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` and must not be
  raised by this feature.
- Web extension compatibility: existing web support remains unchanged; the
  README must not imply that the desktop-only WebAPI import beta works in web.
- Desktop extension compatibility: existing behavior remains unchanged; any
  ajsprint or WebAPI prerequisites must be described conservatively.
- JP1/AJS compatibility: no parser, semantic, encoding, or product-version
  behavior changes. Claims require existing evidence and must distinguish
  tested examples from guaranteed coverage.

## Acceptance Criteria

- A reader can identify from the README opening that the extension reads
  JP1/AJS3 definitions and offers searchable list and flow views.
- `README.md` is Japanese-first, links to retained English product information,
  and contains the required problem, feature, quick-start, support,
  privacy/security, unofficial-status, limitation, feedback, contribution, and
  license information in a user-oriented order.
- A privacy-safe list/flow visual appears near the opening and renders at a
  useful size without an excessive asset payload.
- Quick start contains no more than five verified steps and uses exact current
  command or UI labels.
- Contributor-only detail is removed from the product narrative and remains
  discoverable through `CONTRIBUTING.md` and existing owning documents.
- `displayName`, `description`, and `keywords` are factual, brand-preserving,
  deduplicated, and valid for Marketplace packaging; no unrelated manifest
  field changes.
- Privacy and connectivity text agrees with the durable telemetry policy and
  current local-file, save, telemetry, and WebAPI boundaries.
- No statement upgrades command generation to command execution, beta behavior
  to general availability, fixture evidence to broad version support, or web
  support to desktop-only capability parity.
- Markdown, links, images, and Marketplace/package rendering checks pass.
- No runtime code, runtime UI, tests, generated artifacts, new feature,
  external promotion, or broad website work is included.

## Non-Goals

- New extension features or behavior changes.
- Major runtime UI redesign or new Marketplace-specific runtime UI.
- Parser, diagnostics, telemetry, WebAPI, CSV, semantic-diff, or ajsprint
  capability changes.
- Raising VS Code, JP1/AJS, operating-system, desktop, or web compatibility.
- Zenn or Qiita articles, social-media promotion, Marketplace advertising,
  paid promotion, or a large website.
- Resolving the separate WebAPI import beta-exit roadmap decision.

## Open Questions

- Planning must select reuse of the existing list/flow screenshots or a new
  compact demo asset after comparing first-view clarity and packaged size.
- The repository does not establish a comprehensive JP1/AJS product-version,
  operating-system, unsupported-syntax, or maximum-file-size matrix. Planning
  must choose conservative wording and must not manufacture such a matrix.
- Exact unofficial/trademark wording should be checked for neutral factual
  accuracy before publication; no legal endorsement claim is inferred here.
