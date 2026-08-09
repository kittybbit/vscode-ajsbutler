# Feature Tasks: Marketplace Improvement Phase One

## Agent Brief

- Purpose: make the Marketplace-facing product information accurate,
  Japanese-first, trustworthy, and quickly understandable.
- Selected feature:
  `docs/specs/features/marketplace-improvement-phase-one/` on
  `codex/marketplace-improvement`.
- Complete plan: two ordered, independently reviewable implementation slices.
- Do not edit runtime code, tests, generated artifacts, runtime UI, or files
  outside an approved slice.
- Do not run `ajsprint`, require network access, or claim that the extension
  never writes files or never uses the network.
- Approval policy and document roles: `docs/specs/README.md`.

## Sync Rule

- Update this file in the same commit whenever a slice is completed,
  re-scoped, or intentionally dropped.
- This file is the sole plan and current-state owner for this selected feature.
- The inherited `import-definition-via-webapi` feature and its beta-exit
  roadmap decision remain outside this feature.
- Replan before adding a file, metadata field, generated visual, compatibility
  claim, runtime behavior, or validation boundary not listed below.
- Keep completed evidence only while it affects later approval, risk,
  traceability, production readiness, or Feature Exit.

## Plan Status

- Status: Approved; Slice 1 ready after plan approval commit
- Planning scope: all MP-01 through MP-08 requirements and acceptance criteria
  without runtime behavior changes
- Review status: Ready; no open Findings
- Human approval: Approved from the user's explicit instruction to treat
  normally completed human-approval gates as approved
- Active implementation slice: None

## Replanning Record

- Finding 1 (High): the link plan did not account for `docs/`, `.agents/`, and
  `AGENTS.md` being excluded by `.vscodeignore`. The revised Slice 2 separates
  package-valid Marketplace/VSIX links from repository-only developer links and
  compares the generated `extension/README.md` destinations and image URLs with
  the actual VSIX entries. No ignored internal document is added to the VSIX,
  and `.vscodeignore` remains out of scope.
- Finding 2 (Medium): Slice 1 now includes a production build and a VSCE
  package-level validation. Desktop/web execution tests remain omitted because
  the approved change is limited to three manifest metadata fields and does not
  alter runtime sources, host entry points, contributions, or test behavior;
  the omission is an explicit slice boundary, not an unverified compatibility
  claim.
- Finding 3 (Medium): Slice 2 now has concrete visual pass criteria for bounded
  display width, first-view placement, meaningful alt text, rendered legibility,
  and the image URL/path emitted after VSIX packaging.
- Finding 4 (Medium): VSCE may emit GitHub/raw external image URLs from relative
  README image references. Slice 2 now treats external-URL-to-source-path
  correspondence as a structural gate and local-source visual rendering as a
  separate gate; a structurally valid URL does not prove visual rendering.

## Human Approval

- Status: Approved
- Approved at: 2026-08-09 (current user request)
- Approved scope: Feature-wide implementation plan and Slice 1, Marketplace
  Discovery Metadata
- Approved paths: the selected feature's SPECS.md, TASKS.md, and
  TRACEABILITY.md for the plan approval commit; Slice 1 implementation paths
  are listed in the plan and are not part of this commit

Implementation may start only after the approved planning package is committed
through `approval-committer`; Slice 1 implementation paths remain governed by
the approved plan and its subsequent completion gate.

## Completion Approval

- Status: Approved
- Approved at: 2026-08-09 (current user request)
- Approved scope: Completed Slice 1, Marketplace Discovery Metadata, plus its
  lifecycle evidence
- Approved paths: `package.json`, limited to `displayName`, `description`, and
  `keywords`, and this `TASKS.md` completion record only
- Implementation review verdict: Ready; no open Findings
- Commit status: Eligible for completion gate

Slice 1 status: Completed; awaiting its focused completion commit. Validation
evidence includes manifest and VSIX package checks, production build,
package-scoped qlty, and `git diff --check`. The full qlty check remains a
known baseline issue limited to formatter findings in these feature documents;
those out-of-scope files were not changed for this slice.

Each slice requires an independent implementation review, explicit Completion
Approval, and its focused completion commit before the next slice starts.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Investigation Evidence And Decisions

### Selection And Current State

- The selected branch is `codex/marketplace-improvement`; the selected feature
  folder is present and no other feature owns this branch goal.
- `README.md` is currently an English product/development hybrid.
  `README.en.md` and `CONTRIBUTING.md` do not exist.
- `package.json` currently uses `vscode-ajsbutler`, `Support tool for
JP1/AJS3`, and the single `JP1/AJS` keyword. The only permitted manifest
  targets are `displayName`, `description`, and `keywords`.
- The exact current viewer commands are `View: Open JP1/AJS table viewer` and
  `View: Open JP1/AJS flow viewer` as formed from the manifest category and
  titles. Quick start must tell the user to open a definition in an active
  editor, set language mode to `JP1/AJS` / `jp1ajs` when needed, and use one
  verified viewer command; it must not claim automatic file recognition.

### Publication Claims

- Unit-list, list/flow search, flow visualization, nested-jobnet exploration,
  definition details, CSV copy/save, semantic comparison, diagnostics, hover,
  and desktop/web viewer behavior are supported by the cited durable use cases
  and current manifest/presentation wiring.
- `ajsprint` support is command-text generation in unit-definition content.
  No execution or executable integration may be stated or validated.
- WebAPI import remains read-only, beta, and desktop-only. It communicates
  with the endpoint selected by the user and must not be presented as web-host
  capability parity or general availability.
- Telemetry uses anonymous allowlisted operational metadata and respects VS
  Code telemetry settings through the SDK. Local definitions are read for
  requested analysis; CSV and semantic-diff output can be written only through
  user actions; telemetry and desktop WebAPI import are network boundaries.
- The repository does not prove a comprehensive JP1/AJS version, OS,
  unsupported-syntax, or maximum-file-size matrix. Product pages must state
  only `engines.vscode` minimum compatibility (`^1.75.0`), evidenced host
  distinctions, representative UTF-8/Shift_JIS fixture coverage where useful,
  and the absence of a comprehensive support matrix without inventing one.
- Unofficial wording must be neutral: the project is an unofficial open-source
  tool and is not an official or endorsed Hitachi/JP1 product. Do not assert
  personal-development or legal/trademark conclusions not established here.

### Representative Visual Decision

- Selected strategy: reuse `images/unit-list.png` and
  `images/unit-flow.png` near the opening of both product pages; do not create
  or modify an image asset in this feature.
- Evidence: the list image is 1,796 x 1,496 and 221,647 bytes; the flow image is
  2,096 x 1,478 and 251,693 bytes; combined payload is 473,340 bytes.
- Privacy review: visible values are generic fixture-style names such as
  `test_jg_1`, `nest_jg`, `root_jn`, and generic JP1/AJS unit labels. No person,
  organization, credential, production server, or external application chrome
  was observed.
- Comparison: a GIF would add capture, timing, privacy inspection, and likely
  a larger payload; a composite would add a derived generated asset and could
  reduce text legibility. The existing two images already show both required
  values with no new artifact, so GIF and composite alternatives are rejected
  for Phase One.

### Durable Documentation And CHANGELOG Decisions

- `README.md`, new `README.en.md`, and new `CONTRIBUTING.md` pass the Durable
  Documentation Gate: they own reusable product and contributor guidance and
  remove duplicated workflow detail from the Marketplace page.
- `CONTRIBUTING.md` becomes the concise contributor entry point and links to,
  rather than duplicates, `AGENTS.md`, `docs/specs/README.md`, durable
  requirements, and existing scripts. No separate development document is
  needed.
- No use case, architecture, glossary, roadmap, or telemetry requirement
  changes are planned because those documents are evidence, not change
  targets.
- `CHANGELOG.md` is not updated: this feature changes Marketplace presentation
  and documentation, not extension behavior, compatibility, commands,
  diagnostics, configuration behavior, or user workflow semantics.

## Implementation Slices

### Slice 1: Marketplace Discovery Metadata

- Status: Completed; awaiting focused completion commit
- Scope: update only `package.json` `displayName`, `description`, and
  `keywords` so the existing product is discoverable and its purpose is clear.
- User / Domain Value: a Marketplace visitor can identify the JP1/AJS Butler
  brand and searchable list/flow value from listing metadata before opening
  the product page.
- Cohesive Change Group:
  - set `displayName` to the approved planning candidate
    `JP1/AJS Butler - ジョブネット可視化`;
  - set `description` to
    `JP1/AJS3の定義ファイルを一覧・検索・フロー図で可視化するVS Code拡張機能`;
  - replace the single keyword with this exact concise, case-insensitively
    deduplicated Japanese/English set: `JP1`, `AJS`, `AJS3`, `JP1/AJS`,
    `JP1/AJS3`, `jobnet`, `job scheduler`, `ajsprint`, `ジョブネット`,
    `ジョブ管理`, `運用管理`, `定義ファイル`, `visualization`, `viewer`,
    and `CSV`;
  - inspect the exact manifest diff and reject any other field change.
- Acceptance:
  - brand and purpose are clear without overstating compatibility or behavior;
  - description names the principal list, search, and flow-view value in one
    sentence;
  - keywords are relevant, deduplicated, and accepted by local VSCE manifest
    validation;
  - `publisher`, `name`, `version`, `categories`, contributions, activation,
    scripts, dependencies, and `engines` are byte-for-byte unchanged.
- Validation:
  - `node -e "require('@vscode/vsce/out/package').readManifest(process.cwd())
.then(m=>console.log(JSON.stringify({displayName:m.displayName,
description:m.description,keywords:m.keywords},null,2)))"` for local,
    installed VSCE manifest validation;
  - `rtk git diff -- package.json` and a targeted JSON comparison proving only
    the three approved fields changed;
  - `rtk pnpm run build` to verify that the existing desktop and web package
    entry artifacts remain buildable for the package boundary;
  - `rtk pnpm exec vsce package --no-dependencies
    --out /tmp/vscode-ajsbutler-metadata-preview.vsix`, followed by inspection
    of the packaged manifest and removal of only that explicit temporary file;
    this is package-level validation, not publication;
  - `rtk pnpm run qlty` and `rtk git diff --check`;
  - desktop and web execution tests are intentionally omitted: only
    `displayName`, `description`, and `keywords` change, while runtime source,
    `main`/`browser` entry points, contributions, activation, and test inputs
    remain unchanged. Build and VSCE package checks cover the affected
    manifest/package boundary; no runtime behavior is being revalidated by
    this slice.
- Production Readiness:
  - failure mode: invalid or excessive metadata can fail manifest/package
    validation or weaken search; `readManifest`, production build, VSCE package
    inspection, and exact-field review are the gate;
  - compatibility: preserve `engines.vscode`, extension identity, desktop/web
    entry points, commands, activation, and JP1/AJS behavior;
  - large/malformed input: no impact because no runtime path changes;
  - docs/CHANGELOG: terminology becomes the input to Slice 2; no CHANGELOG.
- Approval Boundary: `package.json` only, limited to `displayName`,
  `description`, and `keywords`. Any other manifest edit, lockfile change, or
  metadata policy decision requires Replanning Mode and new approval.
- Dependencies: none; perform first to settle the public product name and
  concise value language reused by the product pages.
- Risks: Marketplace search ranking is not locally provable; acceptance is
  limited to relevance, manifest validity, and factual consistency rather
  than a ranking promise.
- Out of Scope: publishing, versioning, categories, icon, badges, sponsor,
  pricing, advertising, extension behavior, dependency changes, and lockfile
  changes.

### Slice 2: Japanese-First Product Pages And Contributor Separation

- Status: Planned; blocked on Slice 1 completion commit and exact Slice 2
  approval
- Scope: atomically rewrite `README.md`, create `README.en.md`, and create
  `CONTRIBUTING.md`; reference the existing list/flow images without modifying
  image files; run integrated Marketplace-equivalent package checks.
- User / Domain Value: Japanese users can understand within the first view what
  the extension does, see list and flow value, follow one verified first-use
  path, and assess privacy, host limits, support evidence, and project status;
  English users and contributors retain clear dedicated entry points.
- Cohesive Change Group:
  - make `README.md` Japanese-first with this user-oriented order: title and
    concise value, English link, two representative images, problems solved,
    principal verified features, no-more-than-five-step quick start, feature
    details, support/host scope, security/privacy/connectivity, constraints,
    unofficial status, issues/feedback, contribution link, and license;
  - create `README.en.md` with equivalent factual product scope, visuals,
    quick start, disclosures, constraints, feedback, contribution, license,
    and a link back to Japanese; preserve useful English product information
    without copying contributor-only procedures;
  - create `CONTRIBUTING.md` from the current README development material as a
    stable contributor entry point covering prerequisites, setup, quality,
    desktop/web tests, build, explicit ANTLR generation, sample fixtures, web
    debugging, and links to the SDD/agent SSOT; avoid duplicating lifecycle
    policy or release procedure;
  - use exact current command/UI labels and describe capabilities only at the
    evidence level recorded above, including command-text-only `ajsprint`,
    user-initiated saves, telemetry/network boundaries, and desktop-only
    read-only WebAPI beta;
  - use this four-step quick-start contract in both languages: install the
    extension; open a JP1/AJS definition in the active editor; set language
    mode to `JP1/AJS` (`jp1ajs`) when needed; run
    `View: Open JP1/AJS table viewer` from the Command Palette;
  - reference `images/unit-list.png` and `images/unit-flow.png` in the opening
    visual block, before the first problem/features section, with explicit
    bounded HTML display width of no more than 720 CSS pixels per image and
    meaningful Japanese/English alt text describing the list and flow views;
  - keep two link tiers: product-page links in `README.md` and `README.en.md`
    may target only the other packaged product page, `CONTRIBUTING.md`,
    `LICENSE`, packaged images, the repository `bugs.url`, and the telemetry
    FAQ; developer links to `AGENTS.md`, `docs/**`, and `.agents/**` belong only
    in `CONTRIBUTING.md` and are repository-checkout links, not Marketplace/VSIX
    links;
  - preserve the existing `.vscodeignore` exclusions for `docs/`, `.agents/`,
    and `AGENTS.md`; do not add internal documents to the VSIX or change the
    ignore file.
- Acceptance:
  - all MP-01, MP-02, MP-03, MP-04, MP-06, MP-07, and MP-08 criteria are
    visible and internally consistent in Japanese and English;
  - quick start is at most five steps, starts from an active definition editor,
    uses the verified language mode and table-view command, and does not imply
    automatic recognition;
  - list and flow screenshots appear in the opening visual block before the
    first problem/features section, each renders at no more than 720 CSS pixels
    wide, has meaningful language-appropriate alt text, and remains legible at
    the Marketplace-like preview width: list headers/search affordances and
    representative flow nodes must be distinguishable without opening the
    source image, and the reuse adds no new asset payload;
  - contributor detail leaves both product narratives but remains discoverable
    in `CONTRIBUTING.md` and the owning SSOT documents;
  - no broad JP1/AJS version, OS, unsupported-syntax, encoding, or file-size
    guarantee is added; no no-network/no-write statement is added;
  - product-page links and packaged local images are valid for the target they
    claim: ignored internal documents are not treated as VSIX assets, while
    developer-only links resolve from the repository checkout;
  - structural URL condition: the generated `extension/README.md` is compared
    with the source README; every emitted relative link resolves to an included
    VSIX entry, and each emitted image destination either resolves to the
    packaged `images/unit-list.png` or `images/unit-flow.png`, or is a GitHub
    /raw external URL whose normalized repository, ref, and path correspond
    exactly to the respective source image path. No direct `docs/`, `.agents/`,
    or `AGENTS.md` target remains in the Marketplace-facing README.
  - independent visual condition: the source `README.md`, or an explicit local
    Markdown preview that substitutes the source images for any external image
    destinations, passes the 720 CSS pixel bound, first-view placement,
    meaningful alt-text fallback, and list/flow legibility checks. A passing
    URL/path structure check cannot substitute for this visual condition. The
    final product name, description, and README terminology must agree.
- Validation:
  - compare every capability/disclosure against the use cases, telemetry
    requirement, manifest, and targeted implementation evidence listed in
    `TRACEABILITY.md`; explicitly search for forbidden `ajsprint` execution,
    general-availability WebAPI, no-network/no-write, and broad compatibility
    wording;
  - `rtk pnpm exec markdownlint-cli2 README.md README.en.md CONTRIBUTING.md
docs/specs/features/marketplace-improvement-phase-one/*.md` and
    `rtk pnpm run lint:md`;
  - run two explicit link/asset passes: resolve product-page relative links and
    image targets against the repository and the planned VSIX file set, while
    resolving developer-only links in `CONTRIBUTING.md` against the repository
    checkout only; reject any product-page target under ignored `docs/`,
    `.agents/`, or `AGENTS.md`, and manually inspect external URL syntax;
  - `rtk pnpm exec vsce ls --no-dependencies --readme-path README.md` and
    confirm `README.md`, `README.en.md`, `CONTRIBUTING.md`, `LICENSE`,
    `images/unit-list.png`, and `images/unit-flow.png` are included;
  - create a disposable package with
    `rtk pnpm exec vsce package --no-dependencies --readme-path README.md
    --out /tmp/vscode-ajsbutler-marketplace-preview.vsix`, inspect the VSIX
    manifest and packaged `extension/README.md`, extract the actual Markdown
    link destinations and image URLs/paths from that generated file, and run
    the structural URL condition: normalize any GitHub/raw external image URL
    and prove that it maps to `images/unit-list.png` or `images/unit-flow.png`,
    while relative destinations are checked against the VSIX entry list and
    source README. Remove only that explicit temporary file; do not publish;
  - separately render the source `README.md` in VS Code's built-in Markdown
    preview, or use an explicit local Markdown preview that substitutes the
    source images for external destinations, at a Marketplace-like content
    width. Visually inspect first-view hierarchy, image placement, the 720-pixel
    display bound, Japanese text, list/flow legibility, meaningful alt-text
    fallback, and product-page links. This local visual gate is independent of
    the generated external URL structure and is not claimed to reproduce
    Marketplace CSS or search ranking exactly;
  - `rtk pnpm run qlty`, then `rtk git diff --check` and an exact scoped diff
    review; no runtime tests are required because runtime behavior is unchanged.
- Production Readiness:
  - failure modes: broken relative links, omitted package assets, oversized
    first view, stale English claims, or misleading privacy/support wording;
    resolve through package listing, disposable VSIX inspection, visual
    preview, and evidence review;
  - desktop/web: describe shared list/flow behavior and explicitly isolate the
    desktop-only WebAPI beta; do not change host behavior;
  - JP1/AJS and malformed/large inputs: no behavior change and no new guarantee;
    retain conservative limitations and an Issue path;
  - privacy: reuse inspected fixture-style images and verify telemetry, save,
    and network text against durable/current boundaries;
  - docs/CHANGELOG: these are the durable product/contributor surfaces; no
    CHANGELOG, architecture, use-case, glossary, or roadmap edit.
- Approval Boundary: `README.md`, new `README.en.md`, and new
  `CONTRIBUTING.md` only. Existing image files are read-only inputs. Any image
  creation/modification, website, Marketplace publication, `.vscodeignore`
  edit, adding ignored internal documents to the VSIX, runtime/config/test
  edit, or additional durable-document owner requires Replanning Mode.
- Dependencies: Slice 1 must be reviewed, completion-approved, and committed so
  public naming and value language are stable before integrated rendering.
- Risks: the local VS Code Markdown preview and VSIX inspection cannot prove
  Marketplace service CSS, external URL availability, indexing, or ranking;
  structural URL normalization can still prove the generated external image
  destination maps to the selected source path, while the separate local
  visual gate proves image placement and legibility. Final publication should
  retain a post-publish visual smoke check as release/operations work outside
  this feature.
- Out of Scope: GIF/composite creation, screenshots changes, runtime UI,
  runtime code, tests, generated parser/package artifacts committed to the
  repository, `ajsprint` execution, live WebAPI calls, network checks,
  external promotion, and Marketplace publication.

## Feature-Level Validation And Production Readiness

- [x] Every MP requirement and acceptance criterion is assigned to a slice.
- [x] Each slice has value, cohesive paths, dependencies, validation, risks,
      approval boundaries, and out-of-scope work.
- [x] Existing visuals were compared with GIF/composite alternatives and a
      privacy-safe, size-bounded reuse strategy was selected.
- [x] Marketplace-equivalent offline validation uses actual installed VSCE and
      Markdown commands and states its limits.
- [ ] Slice 1 manifest, build, VSCE package-level validation, and scoped diff
      pass after implementation.
- [ ] Slice 2 Markdown, two-tier link, asset, generated `extension/README.md`
      image-URL structure comparison, VSIX, independent local visual preview,
      and visual pass-criteria checks pass after implementation.
- [ ] Japanese/English factual consistency and forbidden-claim review pass.
- [ ] Runtime behavior remains unchanged and no out-of-scope files are changed.

Feature Exit can begin only after both slices have independent implementation
review verdicts of `Ready`, Completion Approval, and focused completion
commits. Feature Exit must confirm the final diff, validation evidence,
documentation ownership, compatibility wording, and absence of temporary
package artifacts before recommending closure.

## Replanning Triggers

- A new or modified image, GIF, composite, package field, runtime/config/test
  file, durable requirement, or owning document becomes necessary.
- Adding `docs/`, `.agents/`, or `AGENTS.md` to the VSIX, or changing the
  `.vscodeignore` rules that exclude them, becomes necessary.
- Current evidence cannot support a planned feature, privacy, host, save,
  network, unofficial-status, or compatibility statement.
- VSCE rejects the selected metadata or cannot package the referenced product
  documents/assets without changing the approved boundary.
- The quick-start path cannot be stated accurately in five steps or validated
  without runtime behavior changes.
- An independently reviewable slice requires work outside its approved paths,
  or the approval/dependency order must change.

## Traceability

- `TRACEABILITY.md` is required and maps every MP requirement, supporting use
  case, evidence source, slice, and post-implementation validation.
- Runtime use cases and cross-cutting telemetry remain read-only evidence; no
  scenario or behavior contract is changed by this feature.
