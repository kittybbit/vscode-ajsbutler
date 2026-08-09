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

- Status: Additional correction replan prepared; pending independent re-review
  and post-correction Completion Approval
- Planning scope: limited revalidation of the existing Slice 1 `keywords`
  field and the current `README.md` wording correction; the feature purpose,
  two-slice structure, and completed implementation commits remain unchanged
- Review status: Pending independent re-review of the additional correction
- Human approval: Pending for the Additional Correction Replan Gate. After the
  independent plan review records `Ready`, Main applies the user's instruction
  that a normally completed target task may proceed as approved and records
  `Human Approval: Approved` for the exact scope below; this plan revision does
  not itself grant or bypass that gate
- Active implementation slice: Additional correction gate covering the
  existing Slice 1 metadata output and the existing Slice 2 README output

## Replanning Record

- Finding 1 (High): the link plan did not account for `docs/`, `.agents/`, and
  `AGENTS.md` being excluded by `.vscodeignore`. The revised Slice 2 separates
  package-valid Marketplace/VSIX links from developer-only links and compares
  both generated `extension/README.md` and `extension/README.en.md` destinations
  and image URLs with the actual VSIX entries. No ignored internal document is
  added to the VSIX, and `.vscodeignore` remains out of scope.
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
- Previous plan-review Finding 1 (Medium): the prior plan treated
  `CONTRIBUTING.md` as included in the VSIX while its developer-document links
  could otherwise be interpreted as package-relative links to ignored files.
  That prior gate is retained below; the current replan removes the VSIX
  inclusion premise, keeps stable canonical repository URLs for `AGENTS.md`,
  `docs/**`, and `.agents/**` links in `CONTRIBUTING.md`, and requires the two
  product pages to use the canonical contributor URL.
- Current plan-review Finding 2 (Medium): the visual gate was explicit for
  `README.md` but not independently for `README.en.md`. Slice 2 now requires
  separate Marketplace-equivalent visual checks for both product pages,
  including first-view placement, 720 CSS-pixel width, alt fallback,
  legibility, and visible links.
- Current plan-review Finding 3 (Medium): unconditional full `qlty` could
  rewrite the feature plan documents and obscure the known Slice 1 baseline.
  Slice 2 now records that baseline, uses a non-mutating qlty check scoped to
  the three approved implementation files, and rejects completion if a
  formatter changes either plan document or any out-of-scope file.
- Current plan-review Finding 4 (Low): VSCE commands were split across lines
  without copy-safe continuation. Slice 2 now records each VSCE command as a
  single copyable shell command.
- Remaining plan-review Finding (Medium): `docs/specs/README.md` requires
  `rtk pnpm run qlty` for docs-only changes, but the Slice 2 plan described the
  full check as optional and did not identify evidence for the new
  `README.en.md` and `CONTRIBUTING.md`. Slice 2 now requires a post-
  implementation full qlty run in a disposable checkout, records the known
  feature-document formatter baseline separately from new findings, and keeps
  the non-mutating three-file implementation-worktree check and its
  formatter-side-effect completion boundary.
- Additional remaining plan-review Finding: VSCE 3.9.2
  `vsce package` invokes `vscode:prepublish`, whose `pnpm run build` invokes
  `prebuild` and removes/recreates `out/report`. Running it in the
  implementation worktree could violate the generated-output non-change
  boundary. The revised Slice 2 plan therefore runs every VSCE/package
  operation and the related local visual verification only in a disposable
  checkout/copy containing the current repository baseline plus the three
  uncommitted implementation files, `README.md`, `README.en.md`, and
  `CONTRIBUTING.md`. It captures the implementation-worktree `git status` and
  `git diff` before and after that validation and requires exact invariance;
  no package or VSCE command is run in the implementation worktree. Only the
  disposable checkout/copy and its temporary VSIX are removed afterward.
- New replan trigger after Slice 2 implementation (current): VSCE 3.9.2
  inspection confirmed that `README.en.md` is included in the VSIX and
  `CONTRIBUTING.md` is excluded by VSCE's default exclusions, in addition to
  the explicit `.vscodeignore` exclusions for `docs/`, `.agents/`, and
  `AGENTS.md`. The current plan cannot continue unchanged because it requires
  `CONTRIBUTING.md` to be included in the VSIX and treats its inclusion as a
  link-validation prerequisite. The revised plan accepts the `README.en.md`
  inclusion and keeps `CONTRIBUTING.md` as the repository-only developer
  document; README.md and README.en.md must use the canonical HTTPS contributor
  URL
  `https://github.com/kittybbit/vscode-ajsbutler/blob/main/CONTRIBUTING.md`
  instead of a relative `CONTRIBUTING.md` link. Relative links from
  `CONTRIBUTING.md` to repository README files remain allowed, while links to
  ignored internal documents continue to use canonical HTTPS repository URLs.
  The implementation paths remain exactly `README.md`, `README.en.md`, and
  `CONTRIBUTING.md`; `.vscodeignore` and package settings remain unchanged and
  out of scope.

- Implementation-review Finding P1 (High): the Slice 1 approval record
  retained the prior broad exact keyword set, but the current user request
  narrows the existing `package.json` `keywords` field to the exact six-item set
  `JP1`, `AJS`, `AJS3`, `JP1/AJS`, `JP1/AJS3`, and `ajsprint`. This is a value
  correction within the already approved Slice 1 field; it adds no path,
  feature, integration, or runtime scope.
- Historical P1 evidence: the superseded 15-item set is recorded in the
  pre-correction Slice 1 approval commit `ed4a283a`,
  `package.json:25-40`, and was also carried by the prior Slice 1 plan record:
  `JP1`, `AJS`, `AJS3`, `JP1/AJS`, `JP1/AJS3`, `jobnet`, `job scheduler`,
  `ajsprint`, `ジョブネット`, `ジョブ管理`, `運用管理`, `定義ファイル`,
  `visualization`, `viewer`, and `CSV`. The current correction intentionally
  narrows that evidence to the exact six-item target above.
- Implementation-review Finding P2 (Medium): the current uncommitted
  `README.md` and `package.json` changes post-date the two committed slices and
  the retained Feature Exit record. The prior Feature Exit evidence remains
  preserved below, but closure is suspended until this correction is
  independently re-reviewed, completion-approved, committed, and the prior
  evidence is re-confirmed.

## Additional Correction Replan Gate

- Status: Approved; awaiting focused plan commit, implementation review,
  Completion Approval, and one focused correction commit
- Plan review verdict: Ready (independent `plan-reviewer` re-review completed)
- Human Approval: Approved under the user's stated proceed rule for a normally
  completed target task
- Approved at: 2026-08-09 (current user request)
- Trigger: Findings P1 and P2 from implementation review, limited to the
  existing Slice 1 `package.json` keyword field and the current uncommitted
  `README.md` wording correction
- Scope: apply only the current specified wording correction in `README.md`
  and replace the previously recorded Slice 1 keyword set in `package.json`
  with the exact six-item set `JP1`, `AJS`, `AJS3`, `JP1/AJS`, `JP1/AJS3`,
  `ajsprint`; do not alter `displayName`, `description`, or any other manifest
  field. `README.en.md` and `CONTRIBUTING.md` are unchanged and outside this
  correction.
- Target implementation paths: `README.md` and `package.json` only;
  `package.json` is limited to `keywords`
- Planning/evidence paths: this `TASKS.md` and sibling `TRACEABILITY.md` only
- Preserved slices: Slice 1 remains the Marketplace metadata slice and Slice 2
  remains the Japanese-first product-page slice; their existing completion
  commits, approval records, and unrelated validation evidence are retained
- Approval boundary: after independent plan review, the exact implementation
  approval scope is `README.md` limited to the current specified wording
  correction and `package.json` limited to the `keywords` field with the exact
  six-item set. `README.en.md` and `CONTRIBUTING.md` remain unchanged; no new
  slice, manifest field, runtime/UI behavior, host claim, compatibility claim,
  or path is added.
- Approval sequence completed for this gate: `Plan review verdict: Ready` ->
  Main recorded `Human Approval: Approved` using the user's stated proceed
  rule for this normally completed target task. `approval-committer` must now
  commit only this `TASKS.md`/`TRACEABILITY.md` planning package before
  implementation proceeds for the exact two-path correction.
- Completion gate: after the correction is applied, obtain implementation
  review `Ready`, explicit Completion Approval, and one focused commit for the
  exact `README.md` plus `package.json` diff. Reconfirm the retained Feature
  Exit evidence before closure can be reconsidered.
- Required validation: rerun the existing local VSCE `readManifest` check for
  the six keywords and unchanged non-keyword fields; run disposable
  `vsce ls`/`vsce package` and inspect the packaged manifest; run
  `markdownlint-cli2` and the repository Markdown lint; run the scoped
  non-mutating qlty check plus full `pnpm run qlty` in a disposable checkout,
  isolating formatter side effects; run `git diff --check`; and re-review the
  existing Feature Exit acceptance, traceability, production readiness, and
  compatibility evidence against the post-correction diff
- Dependencies: no change to Slice 1/Slice 2 order or runtime dependency
  graph; the additional correction gate must complete before Closure Approval
  or feature-folder removal
- Unresolved risk: Marketplace ranking, external link availability, and
  post-publication rendering remain the same bounded release/operations risks;
  the only new workflow risk is stale completion evidence, addressed by the
  required re-review and evidence reconfirmation

## Prior Plan Approval (Feature Plan And Slice 1)

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

This record is retained as the previous plan gate. It does not authorize the
revised Slice 2 plan after the current replan trigger or the current
Additional Correction Replan Gate.

## Slice 1 Completion Approval

- Status: Approved
- Approved at: 2026-08-09 (current user request)
- Approved scope: Completed Slice 1, Marketplace Discovery Metadata, plus its
  lifecycle evidence
- Approved paths: `package.json`, limited to `displayName`, `description`, and
  `keywords`, and this `TASKS.md` completion record only
- Implementation review verdict: Ready; no open Findings
- Commit status: Committed as `ed4a283a`

Slice 1 status: Completed and focused completion commit recorded. Validation
evidence includes manifest and VSIX package checks, production build,
package-scoped qlty, and `git diff --check`. The full qlty check remains a
known baseline issue limited to formatter findings in these feature documents;
those out-of-scope files were not changed for Slice 1. This retained approval
and commit cover the prior keyword values; the exact six-item correction is
pending the Additional Correction Completion Approval.

## Previous Slice 2 Plan Approval

- Status: Approved
- Approved at: 2026-08-09 (current user request)
- Review verdict: Ready; no open Findings
- Approved scope: Slice 2 `Japanese-First Product Pages And Contributor
  Separation`
- Planning-package approval paths: this `TASKS.md` and sibling
  `TRACEABILITY.md` only
- Implementation approval paths: repository-root `README.md`, new
  `README.en.md`, and new `CONTRIBUTING.md` only
- Commit status: Eligible for plan approval gate

Human Approval names Slice 2 and the exact three implementation paths. The
implementation paths remain blocked until this planning package is committed
through `approval-committer`.
After approval, Main must delegate `approval-committer` to commit only the two
planning documents before any product-page implementation begins. Existing
images remain read-only inputs and are not approval paths.

Each slice requires an independent implementation review, explicit Completion
Approval, and its focused completion commit before the next slice starts.

This section is retained as the pre-trigger Slice 2 plan-approval gate. The
current replan requires a new independent plan review and new Human Approval;
the prior approval is not the approval state for the revised links or VSIX
validation.

## Current Slice 2 Replan Gate

- Status: Approved
- Plan review: Ready; no open Findings
- Human approval: Approved
- Approved at: 2026-08-09 (current user request)
- Revised scope: change only the product-page contributor links and the VSIX
  validation expectation; keep the three implementation paths unchanged
- Planning-package paths: this `TASKS.md` and sibling `TRACEABILITY.md` only
- Implementation paths: repository-root `README.md`, `README.en.md`, and
  `CONTRIBUTING.md` only
- `.vscodeignore` and package configuration: unchanged and out of scope
- Commit status: Committed as `88b4ffc58d6225049df7b1e4a54e41f99abb0559`

This is the retained Slice 2 replan gate and does not authorize the current
Additional Correction Replan Gate.

## Slice 2 Completion Approval

- Status: Approved
- Approved at: 2026-08-09 (current user request)
- Implementation review verdict: Ready; no open Findings
- Approved scope: Completed Slice 2 `Japanese-First Product Pages And
  Contributor Separation`, including final canonical-link and natural
  Japanese wording corrections, plus completion evidence
- Approved paths:
  - `README.md`
  - `README.en.md`
  - `CONTRIBUTING.md`
  - this `TASKS.md` completion and validation record only
  - sibling `TRACEABILITY.md` completion and validation record only
- Commit status: Committed as `0df2df22ee00950748e6f38482621f63ca1fac7f`

Slice 2 validation evidence includes Markdown lint, repository lint, scoped
qlty, disposable full qlty, link and image structure checks, disposable VSCE
package and listing checks, generated README URL checks, static visual checks
for both product pages, and implementation-worktree status/diff invariance.
The browser file/data URL preview was unavailable under the environment
policy; the planned local static preview and image checks passed.

This is the retained pre-correction Slice 2 completion record. The current
`README.md` correction is covered only by the Additional Correction Replan
Gate and requires its own implementation review and Completion Approval.

## Additional Correction Completion Approval

- Status: Approved; eligible for one focused correction commit
- Approved at: 2026-08-09 (current user request)
- Implementation review verdict: Ready; no open Findings
- Approved scope: the current additional `README.md` wording correction and
  the `package.json` `keywords` correction to the exact six-item set only
- Approved paths: `README.md`, `package.json` (the `keywords` field only), and
  the completion evidence sections of this `TASKS.md` and sibling
  `TRACEABILITY.md`
- Excluded paths: `README.en.md` and `CONTRIBUTING.md` remain unchanged and are
  not part of this correction approval
- Validation: Markdown lint, repository Markdown lint, scoped qlty,
  disposable full qlty, `git diff --check`, `readManifest`, disposable VSCE
  listing/package inspection, packaged-manifest checks, production build, and
  implementation-worktree status/diff invariance passed. The existing
  webpack asset-size warning remains non-blocking. Desktop/Web execution tests
  remain out of scope because runtime and host entry points are unchanged.
- Commit status: Eligible for focused correction commit

## Closure Approval

- Status: Pending; suspended until the Additional Correction Replan Gate is
  reviewed, completion-approved, committed, and its evidence is reconfirmed
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Retained prior review superseded for current closure;
  pending post-correction reconfirmation
- Commit status: Not eligible

## Investigation Evidence And Decisions

### Selection And Current State

- The selected branch is `codex/marketplace-improvement`; the selected feature
  folder is present and no other feature owns this branch goal.
  - The approved Slice 2 implementation paths `README.md`, `README.en.md`, and
  `CONTRIBUTING.md` are implemented and committed in `0df2df22`. No other
  implementation files are in scope.
- Slice 1 committed the product name
  `JP1/AJS Butler - ジョブネット可視化`, the description
  `JP1/AJS3の定義ファイルを一覧・検索・フロー図で可視化するVS Code拡張機能`,
  and the approved keyword set in `package.json`. Slice 2 must use the same
  product name and factual list/search/flow value without editing the manifest.
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
  requested analysis; CSV is written only after the user chooses a save
  destination; Semantic Diff opens as a virtual Markdown report and is copied
  to the clipboard only after an explicit user action. The extension must not
  be described as automatically persisting Semantic Diff output. Telemetry and
  desktop WebAPI import are the documented network boundaries.
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
- `CONTRIBUTING.md` becomes the concise repository-only contributor entry point
  and links to, rather than duplicates, `AGENTS.md`, `docs/specs/README.md`,
  durable requirements, and existing scripts. Its links to ignored developer
  documents use stable canonical repository URLs such as
  `https://github.com/kittybbit/vscode-ajsbutler/blob/main/AGENTS.md` rather
  than package-relative paths. Relative links to repository README files remain
  allowed. VSCE 3.9.2 includes `README.en.md` in the VSIX but excludes
  `CONTRIBUTING.md`; the product pages therefore use the canonical contributor
  URL and no separate development document is needed.
- No use case, architecture, glossary, roadmap, or telemetry requirement
  changes are planned because those documents are evidence, not change
  targets.
- `CHANGELOG.md` is not updated: this feature changes Marketplace presentation
  and documentation, not extension behavior, compatibility, commands,
  diagnostics, configuration behavior, or user workflow semantics.

## Implementation Slices

### Slice 1: Marketplace Discovery Metadata

- Status: Completed and committed as `ed4a283a`; additional keyword correction
  is pending the Additional Correction Replan Gate
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
  - replace the prior keyword set with this exact six-item product and
    product-specific-command set: `JP1`, `AJS`, `AJS3`, `JP1/AJS`,
    `JP1/AJS3`, and `ajsprint`;
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

- Status: Completed and committed as `0df2df22`; prior Feature Exit evidence is
  retained and awaits reconfirmation after the Additional Correction Replan
  Gate
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
  - preserve these manifest-backed command labels where named:
    `View: Open JP1/AJS table viewer`,
    `View: Open JP1/AJS flow viewer`,
    `JP1/AJS: Compare JP1/AJS Semantic Diff`, and
    `JP1/AJS: Import JP1/AJS Definition via WebAPI (Beta)`; do not present a
    command ID, inferred translation, or screenshot icon as the command name;
  - use this four-step quick-start contract in both languages: install the
    extension; open a JP1/AJS definition in the active editor; set language
    mode to `JP1/AJS` (`jp1ajs`) when needed; run
    `View: Open JP1/AJS table viewer` from the Command Palette;
  - reference `images/unit-list.png` and `images/unit-flow.png` in the opening
    visual block, before the first problem/features section, with explicit
    bounded HTML display width of no more than 720 CSS pixels per image and
    meaningful Japanese/English alt text describing the list and flow views;
  - apply that visual contract independently to `README.md` and
    `README.en.md`: each source page must pass its own opening placement,
    first-view hierarchy, 720 CSS-pixel bound, meaningful alt-text fallback,
    list/flow legibility, and visible-link readability check;
  - keep two link tiers: product-page links in `README.md` and `README.en.md`
    may target the other product page, `LICENSE`, packaged images, and the
    repository `bugs.url`; the contribution link in both product pages must be
    the stable canonical HTTPS URL
    `https://github.com/kittybbit/vscode-ajsbutler/blob/main/CONTRIBUTING.md`,
    never a relative `CONTRIBUTING.md` target. The telemetry disclosure
    remains inline and product pages do not directly link to ignored repository
    documents. Developer links to `AGENTS.md`, `docs/**`, and `.agents/**`
    belong only in `CONTRIBUTING.md` and use stable canonical repository URLs,
    not Marketplace/VSIX-relative links;
  - keep `CONTRIBUTING.md` as a repository-only developer document. Relative
    links from it to repository README files are allowed; links to ignored
    internal documents remain canonical HTTPS repository URLs. Its inclusion
    in the VSIX is not a requirement and must not be forced through
    `.vscodeignore` or package settings;
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
    first problem/features section of both product pages, each renders at no
    more than 720 CSS pixels wide, has meaningful language-appropriate alt text
    and fallback, and remains legible at the Marketplace-like preview width:
    list headers/search affordances and representative flow nodes must be
    distinguishable without opening the source image, and the reuse adds no
    new asset payload;
  - contributor detail leaves both product narratives but remains discoverable
    in `CONTRIBUTING.md` and the owning SSOT documents;
  - no broad JP1/AJS version, OS, unsupported-syntax, encoding, or file-size
    guarantee is added; no no-network/no-write statement is added;
  - file/network wording distinguishes local-definition reads, explicit CSV
    save writes, explicit Semantic Diff clipboard copy, telemetry adapter
    communication, and user-selected desktop WebAPI endpoint communication;
    it does not claim automatic Semantic Diff persistence or live `ajsprint`
    execution;
  - product-page contribution links use the exact canonical HTTPS URL above;
    no relative `CONTRIBUTING.md` link remains in either product page.
    `CONTRIBUTING.md` is validated as a repository document, with its allowed
    README-relative links preserved and its ignored internal-document links
    canonicalized. It is not treated as a VSIX asset;
  - disposable-checkout-only VSIX condition: in a disposable checkout/copy
    containing the current repository baseline plus exactly the three
    uncommitted implementation files, run `vsce ls` and `vsce package` with
    the installed VSCE 3.9.2. Confirm that `README.md`, `README.en.md`,
    `LICENSE`, `images/unit-list.png`, and `images/unit-flow.png` are included,
    while `CONTRIBUTING.md`, `docs/`, `.agents/`, and `AGENTS.md` are excluded.
    The generated `extension/README.md` and `extension/README.en.md` are each
    checked for the absence of a broken relative `CONTRIBUTING.md` target and
    for the presence of the exact canonical HTTPS contributor URL. Each
    emitted image destination either resolves to the packaged
    `images/unit-list.png` or `images/unit-flow.png`, or is a GitHub/raw
    external URL whose normalized repository, ref, and path correspond exactly
    to the respective source image path. No direct `docs/`, `.agents/`, or
    `AGENTS.md` target remains in either Marketplace-facing README. The
    implementation worktree must not run `vsce ls`, `vsce package`, or another
    VSCE/package command; its pre-validation and post-validation `git status`
    and `git diff` snapshots must be byte-for-byte identical.
  - independent visual condition: the copied source `README.md` and
    `README.en.md` in that same disposable checkout/copy, or the extracted
    generated pages with source-image substitution there, must each pass an
    independent VS Code Markdown preview or an explicit local Markdown
    preview. Each preview must pass the 720 CSS-pixel bound, first-view
    placement, meaningful alt-text fallback, list/flow legibility, and
    visible-link readability checks. A passing URL/path structure check cannot
    substitute for either visual condition. The final product name,
    description, and both README terminologies must agree.
- Validation:

  - compare every capability/disclosure against the use cases, telemetry
    requirement, manifest, and targeted implementation evidence listed in
    `TRACEABILITY.md`; explicitly search for forbidden `ajsprint` execution,
    automatic Semantic Diff persistence, general-availability WebAPI,
    no-network/no-write, and broad compatibility wording;
  - run the Markdown checks:

    ```sh
    rtk pnpm exec markdownlint-cli2 README.md README.en.md \
      CONTRIBUTING.md docs/specs/features/marketplace-improvement-phase-one/*.md
    rtk pnpm run lint:md
    ```

  - run two explicit link/asset passes: verify the canonical contributor URL
    in both product pages and resolve their image targets against the
    repository and planned VSIX file set. Validate `CONTRIBUTING.md` as a
    repository-only document: its README-relative links are allowed, while
    links to ignored `docs/`, `.agents/`, or `AGENTS.md` targets must use stable
    canonical HTTPS repository URLs. Reject any relative `CONTRIBUTING.md`
    target in either product page and manually inspect external URL syntax;
  - before any VSCE/package operation, capture the original implementation
    worktree's complete `git status` and `git diff` output as immutable
    snapshots. Create a disposable checkout/copy from the same repository
    baseline and overlay exactly the current uncommitted `README.md`,
    `README.en.md`, and `CONTRIBUTING.md`; verify that no other implementation,
    configuration, image, runtime, test, or generated-output change is staged
    into that environment. Run all following VSCE commands from the disposable
    checkout/copy only:

    ```sh
    rtk pnpm exec vsce ls --no-dependencies --readme-path README.md
    rtk pnpm exec vsce package --no-dependencies --readme-path README.md --out /tmp/vscode-ajsbutler-marketplace-preview.vsix
    ```

    `vsce package` is expected to invoke `vscode:prepublish` and the build's
    `prebuild`; any `out/report` deletion or regeneration must therefore stay
    inside the disposable checkout/copy. Confirm `README.md`, `README.en.md`,
    `LICENSE`, `images/unit-list.png`, and `images/unit-flow.png` are included,
    and record that `CONTRIBUTING.md`, `docs/`, `.agents/`, and `AGENTS.md` are
    excluded. Inspect the VSIX manifest and generated
    `extension/README.md` and `extension/README.en.md`, extract the actual
    Markdown link destinations and image URLs/paths from both generated files,
    and run the structural URL condition: prove that neither has a broken
    relative `CONTRIBUTING.md` target and that both contain the exact canonical
    HTTPS URL; normalize any GitHub/raw external image URL and prove that it
    maps to `images/unit-list.png` or `images/unit-flow.png`. Do not run
    `vsce`, `vsce ls`, or `vsce package` from the implementation worktree;
    remove only the explicit temporary VSIX and the disposable checkout/copy
    after validation; do not publish;

  - from that same disposable checkout/copy, separately render both copied
    source product pages, `README.md` and `README.en.md`, in VS Code's built-in
    Markdown preview, or use an explicit local Markdown preview that
    substitutes the source images for external destinations, at a
    Marketplace-like content width. Visually inspect each page's first-view
    hierarchy, image placement, 720-pixel display bound, language text,
    list/flow legibility, meaningful alt-text fallback, and product-page link
    display. These local visual gates are independent of the generated
    external URL structure and are not claimed to reproduce Marketplace CSS or
    search ranking exactly. After all disposable checks, compare the original
    implementation-worktree snapshots and require its complete `git status`
    and `git diff` to be byte-for-byte unchanged;
  - after Slice 2 implementation, **must** run the full-repository
    `rtk pnpm run qlty` in a disposable checkout, as required for docs-only
    changes by `docs/specs/README.md`; retain the complete result and classify
    the known Slice 1 formatter baseline in
    `docs/specs/features/marketplace-improvement-phase-one/TASKS.md` and
    `TRACEABILITY.md` separately from new findings in `README.md`, the new
    `README.en.md`, `CONTRIBUTING.md`, or any other path. This full run is
    mandatory, not an optional recheck. Because it includes `qlty fmt`, do not
    accept formatter writes in the implementation worktree;
  - run the non-mutating, scope-limited check:

    ```sh
    rtk pnpm exec qlty check README.md README.en.md CONTRIBUTING.md
    ```

    in the implementation worktree. Retain evidence that exactly the three
    approved implementation files have no new qlty findings; this scoped
    check remains required in addition to the disposable full run;

  - compare the implementation diff and file status before and after quality
    checks. If a formatter changes `TASKS.md`, `TRACEABILITY.md`, or any
    out-of-scope file, do not mark Slice 2 complete and do not expand the
    approval boundary silently; stop for Main/replanning. Finish with
    `rtk git diff --check` and an exact scoped diff review. No runtime tests are
    required because runtime behavior is unchanged.

- Production Readiness:
  - failure modes: broken relative links, omitted package assets, oversized
    first view, stale English claims, or misleading privacy/support wording;
    resolve through package listing, disposable VSIX inspection, visual
    preview, and evidence review;
  - package-validation boundary: VSCE 3.9.2 packaging invokes
    `vscode:prepublish` and the build's `prebuild`, which can delete and
    recreate `out/report`; keep `vsce ls`, `vsce package`, and related local
    visual verification in the disposable checkout/copy only, and require the
    implementation-worktree status/diff to remain byte-for-byte unchanged;
  - desktop/web: describe shared list/flow behavior and explicitly isolate the
    desktop-only WebAPI beta; do not change host behavior;
  - JP1/AJS and malformed/large inputs: no behavior change and no new guarantee;
    retain conservative limitations and an Issue path;
  - privacy: reuse inspected fixture-style images and verify telemetry, save,
    and network text against durable/current boundaries;
  - quality: the docs-only SSOT requires the full `rtk pnpm run qlty` after
    Slice 2 implementation in a disposable checkout, with the known
    `TASKS.md`/`TRACEABILITY.md` formatter baseline recorded separately from
    new findings in `README.md`, `README.en.md`, `CONTRIBUTING.md`, or other
    paths. The implementation-worktree check remains the non-mutating qlty
    check limited to those three approved files; it is not waived by the full
    run. Formatter side effects in either plan document or any out-of-scope
    file invalidate completion and require Main/replanning review;
  - docs/CHANGELOG: these are the durable product/contributor surfaces; no
    CHANGELOG, architecture, use-case, glossary, or roadmap edit.
- Approval Boundary: `README.md`, new `README.en.md`, and new
  `CONTRIBUTING.md` only. Existing image files are read-only inputs. Any image
  creation/modification, website, Marketplace publication, `.vscodeignore`
  edit, adding ignored internal documents to the VSIX, runtime/config/test
  edit, or additional durable-document owner requires Replanning Mode.
- Dependencies: Slice 1 must be reviewed, completion-approved, and committed so
  public naming and value language are stable before integrated rendering. The
  previous Slice 2 plan approval is retained as a prior gate, but the current
  replan must receive independent review, new Human Approval, and a focused
  planning-package commit before any remaining link correction or completion
  review advances. No dependency on `.vscodeignore` or package changes is
  introduced. Integrated VSCE validation depends on a disposable
  checkout/copy that overlays exactly the three implementation files; it must
  not execute from the implementation worktree.
- Risks: the local VS Code Markdown preview and VSIX inspection cannot prove
  Marketplace service CSS, external URL availability, indexing, or ranking;
  structural URL normalization can still prove the generated external image
  destination maps to the selected source path, while the separate local
  visual gates prove image placement and legibility for both product pages.
  VSCE 3.9.2 inclusion of `README.en.md` and exclusion of `CONTRIBUTING.md` are
  expected; the VSIX gate covers both product pages and images, the absence of
  broken relative contributor targets, and the canonical URL without requiring
  contributor-document inclusion. Stable repository URLs in the product pages
  and `CONTRIBUTING.md` still depend on the repository's public default branch
  and availability. VSCE 3.9.2 may delete and recreate `out/report` through
  `vscode:prepublish`/`prebuild`, so the disposable package/visual environment
  is mandatory, the implementation-worktree status/diff must be unchanged,
  and only the temporary VSIX and disposable checkout/copy may be removed.
  The disposable full qlty run is mandatory evidence and must separate the
  known baseline from new findings;
  it does not replace the non-mutating three-file check, which remains the
  Slice 2 implementation-worktree quality gate. Final publication should
  retain a post-publish visual smoke check as release/operations work outside
  this feature.
- Out of Scope: GIF/composite creation, screenshots changes, runtime UI,
  runtime code, tests, generated parser/package artifacts committed to the
  repository, `ajsprint` execution, live WebAPI calls, network checks,
  external promotion, Marketplace publication, and any VSCE/package command
  in the implementation worktree.

## Feature-Level Validation And Production Readiness

- [x] Every MP requirement and acceptance criterion is assigned to a slice.
- [x] Each slice has value, cohesive paths, dependencies, validation, risks,
      approval boundaries, and out-of-scope work.
- [x] Existing visuals were compared with GIF/composite alternatives and a
      privacy-safe, size-bounded reuse strategy was selected.
- [x] Marketplace-equivalent offline validation uses actual installed VSCE and
      Markdown commands and states its limits.
- [x] Slice 1 manifest, build, VSCE package-level validation, scoped diff, and
      focused completion commit are recorded for the retained completion
      state; the additional exact-six-keyword correction remains pending.
- [x] Slice 2 Markdown, canonical contributor-link, asset, generated
      `extension/README.md` and `extension/README.en.md` link/image structure
      comparison, expected VSCE inclusion/exclusion check, independent local
      visual previews for both product pages, visual pass-criteria checks,
      disposable-checkout-only VSCE/package execution with implementation-
      worktree status/diff invariance, implementation-worktree scoped qlty,
      and the mandatory disposable-checkout full qlty run pass after
      implementation; the known feature-document formatter baseline is
      distinguished from new findings, with no formatter changes to plan or
      out-of-scope files.
- [x] Japanese/English factual consistency and forbidden-claim review pass.
- [x] Runtime behavior remains unchanged and no out-of-scope files are changed.
- [ ] Additional correction exact diff is limited to `README.md` and
      `package.json` `keywords`, with no runtime, host, compatibility, or
      unrelated manifest expansion.
- [ ] Additional correction manifest/readManifest, disposable VSCE package,
      Markdown/qlty, `git diff --check`, and retained Feature Exit evidence
      reconfirmation pass; implementation review is `Ready`, Completion
      Approval is recorded, and the focused correction commit succeeds.

Feature Exit can resume only after both slices retain their independent
implementation review verdicts of `Ready`, Completion Approval, and focused
completion commits, and the Additional Correction Replan Gate has its own
implementation review, Completion Approval, focused correction commit, and
evidence reconfirmation. Feature Exit must then confirm the final diff,
validation evidence, documentation ownership, compatibility wording, and
absence of temporary package artifacts before recommending closure.

## Feature Exit Review

- Review status: Complete for the pre-correction state represented by the two
  recorded commits; retained as evidence but superseded for current closure by
  Findings P1/P2.
- Completed slices: Slice 1, Marketplace Discovery Metadata, committed as
  `ed4a283a`; Slice 2, Japanese-First Product Pages And Contributor
  Separation, committed as `0df2df22`.
- Acceptance: All MP-01 through MP-08 criteria and the first-stage DoD were
  satisfied at the retained Feature Exit point. README.md is Japanese-first
  with opening value, list/flow
  visuals, user problems, verified user-facing capabilities, a four-step
  quick start, privacy/security, unofficial status, scope/constraints,
  feedback, contribution, license, and English navigation. README.en.md
  retains equivalent factual product information. package.json contains the
  retained displayName, description, and prior keyword values at that point.
  The exact six-item keyword correction is outside this retained verdict.
- Validation: Recorded implementation-review `Ready` evidence had no open
  Findings at the retained Feature Exit point. Markdown lint, repository
  Markdown lint, scoped qlty, disposable full qlty with the known
  feature-document formatter baseline separated, `git diff --check`,
  disposable VSCE listing/package inspection, generated README link/image
  checks, and static visual checks passed. The browser file/data URL preview
  was unavailable under environment policy; bounded static previews, image
  dimensions, first-view placement, alt text, and legibility passed, and the
  independent reviewer classified this as non-blocking. These results must be
  reconfirmed against the current `README.md` and `package.json` correction.
- Traceability: `TRACEABILITY.md` maps every MP requirement, supporting use
  case, telemetry/privacy boundary, compatibility boundary, slice, and final
  validation. No requirement or acceptance criterion is unassigned.
- Production readiness: No runtime, test, generated-artifact, parser, UI,
  host, compatibility, telemetry, WebAPI, or `.vscodeignore` behavior changed.
  Desktop/Web wording remains bounded, `ajsprint` remains command-text-only,
  and the CHANGELOG impact was evaluated as not required.
- Durable documentation: README.md, README.en.md, and CONTRIBUTING.md pass
  the Durable Documentation Gate and are already committed. No additional
  architecture, use-case, telemetry, glossary, AGENTS.md, or repository
  policy propagation is required.
- Roadmap propagation: Not required. The separate WebAPI beta-exit decision
  remains owned by its existing roadmap/feature boundary and was not changed.
- Remaining risks: the retained Marketplace service CSS, external URL
  availability, indexing/ranking, and post-publication visual smoke check
  remain release or operations concerns. In addition, the current correction
  makes the retained completion and Feature Exit evidence stale until the
  required re-review, Completion Approval, focused commit, and reconfirmation
  complete.
- Closure propagation remains prepared but suspended: after the additional
  correction is complete and explicit Closure Approval is obtained, remove
  only `docs/specs/features/marketplace-improvement-phase-one/`. Do not remove
  inherited feature folders, modify durable documents, or retain temporary
  VSIX/disposable-checkout artifacts.
- Historical closure recommendation at the retained review point: Close
- Current closure recommendation: Do not close pending the Additional
  Correction Replan Gate and post-correction Feature Exit reconfirmation.

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
