# Feature Tasks: Deterministic SDD Evidence

## Agent Brief

- Purpose: supply standard, reproducible evidence for SDD decisions.
- Active slice: Slice 2, repository impact and validation evidence.
- Do not create a custom qlty parser, comparator, or repository collector.
- Do not infer Human Approval or replace independent semantic review.
- Read first: `SPECS.md`, this file, `docs/specs/README.md`.
- Validate: official SARIF in exact snapshots, focused skill checks,
  Markdown lint, and the final qlty aggregate.
- Approval and document roles: `docs/specs/README.md`.
- Next decision: commit the reviewed Slice 2 replan and approved SKILL, then
  start Slice 3.

## Plan Status

- Status: In Progress
- Planning scope: Phase 1 deterministic evidence, replanned after the user's
  direction to upgrade qlty instead of building a custom comparator and to
  express repository evidence collection as a shared SKILL. The qlty
  configuration cleanup removes only entries ignored by both versions.
- Review status: human review of the plan, Slice 1, and Slice 2 replan in the
  current conversation; no existing agents used.
- Human approval: the user approved all slices, directed the qlty replacement,
  and asked to resume. Completion and closure approvals remain separate.
- Active implementation slice: Slice 2; Slice 1 was approved and committed as
  `7727546`.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: all three slices with official qlty SARIF and no custom qlty
  comparator; no product-runtime, parser, model, role, or approval-gate change.
- Approved paths: `.qlty/qlty.toml`, `.agents/skills/sdd-evidence/`,
  `docs/specs/features/sdd-deterministic-evidence/`, `AGENTS.md`,
  `docs/specs/README.md`, and relevant `.agents/skills/sdd-*/SKILL.md` and
  `.codex/agents/*.toml` evidence-input references.

## Completion Approval

- Status: Approved for Slice 1
- Approved at: approved in current conversation
- Approved scope: Slice 1 official qlty SARIF evidence and removal of ignored
  qlty configuration entries.
- Approved paths: `.qlty/qlty.toml`, `docs/specs/README.md`, and this
  `TASKS.md`.
- Implementation review verdict: Ready, human review in current conversation
- Commit status: committed as `7727546`

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Official qlty SARIF evidence

- Status: Complete; reviewed and committed as `7727546`
- Scope: require qlty `0.645.0` or a verified newer compatible version for
  evidence runs. Use official `check --sarif` and `smells --sarif
--no-snippets` in exact disposable baseline/final snapshots. Record version,
  config hash, analyzed paths, commands, exit states, and raw SARIF paths.
  Keep formatting-capable `rtk pnpm run qlty` separate in final only.
- Affected paths: `.qlty/qlty.toml`, `docs/specs/README.md`, this feature's
  `TASKS.md` and `TRACEABILITY.md`. The local qlty binary update is an
  environment change, not a repository artifact.
- Solution Shape: qlty owns finding emission and SARIF serialization.
  `docs/specs/README.md` owns the SDD evidence contract. No custom qlty
  abstraction, parser, comparator, or product-layer dependency is added.
  Reviewers still decide finding identity ambiguity and semantic disposition.
- Acceptance: verified qlty version; valid SARIF 2.1.0 from both commands;
  identical baseline/final version, config, and analyzed scope; errors cannot
  be treated as passing observations. Explain any comparison that standard
  tools cannot map reliably.
- Validation: real `check` and `smells` SARIF smoke test; Markdown lint;
  disposable snapshot check/smells pair and final aggregate after content is
  stable.
- Approval boundary: repository documentation, removal of configuration
  entries already ignored by both old and new qlty, and the verified local
  tool update. Adding a comparator, changing effective qlty configuration,
  or reducing a review gate requires replanning.
- Dependencies: none.
- Production readiness: no JP1/AJS, desktop/web, `engines.vscode`, or user
  behavior change. No README or CHANGELOG update expected.

### Slice 2: Repository impact and validation evidence

- Status: In Progress
- Scope: create one shared SKILL for collecting and recording raw Git change
  output, approved-scope correspondence, architecture-test results, executed
  validation, `engines.vscode` comparison, Node-import search, changed layers,
  exports, dependencies, candidate abstractions, traceability presence, and
  recorded approval fields. Link qlty SARIF without parsing findings. Mark
  missing, ambiguous, or failed evidence explicitly.
- Affected paths: `.agents/skills/sdd-evidence/SKILL.md`, its invocation
  adapter if needed, and this feature's `SPECS.md`, `TASKS.md`, and
  `TRACEABILITY.md`.
- Solution Shape: Git, qlty, and the existing architecture test own their raw
  facts; the shared SKILL owns collection order and record format. Semantic
  owner, abstraction value, compatibility, and approval validity remain human
  or agent judgments. No new runtime abstraction or collector script exists.
- Acceptance: another lifecycle role can follow the SKILL and reproduce raw
  outputs for the same base and scope; added/deleted/renamed paths, missing
  checks, scope mismatch, engine change, Node imports, and ambiguous scans
  have explicit places in the record. No unrun check is reported pass.
- Validation: skill validation, a real read-only dry run on this feature,
  Markdown lint, and consistency with the existing architecture test.
- Approval boundary: the listed shared SKILL and feature documents.
  Architecture rule changes and product-source edits need replanning.
- Dependencies: Slice 1 completion gate.
- Production readiness: no extension behavior change; bound scans to changed
  files where possible and retain raw command output. No README or CHANGELOG
  change expected.

### Slice 3: Shared evidence use in lifecycle procedures

- Status: Approved
- Scope: update existing planning, implementation, and review procedures to
  consume the shared SARIF and repository evidence. Remove duplicated
  mechanical collection wording while preserving Solution Shape judgment,
  reviewer independence, Human Approval, and commit gates.
- Affected paths: `AGENTS.md`, `docs/specs/README.md`, relevant
  `.agents/skills/sdd-*/SKILL.md` and `.codex/agents/*.toml` evidence-input
  references, and feature documents.
- Solution Shape: `docs/specs/README.md` remains policy owner; a single shared
  evidence contract owns command and data references. Existing roles own
  semantic judgment and verdicts. No role or runtime model variant is added.
- Acceptance: all consumers reference the same evidence contract; unknowns
  remain review signals; no approval or review boundary is weakened.
- Validation: Markdown lint, targeted consistency scan, comparable qlty
  observations, and final aggregate in a disposable final snapshot.
- Approval boundary: listed policy and role-procedure references. Role
  consolidation, model changes, and approval automation remain later features.
- Dependencies: Slices 1 and 2 completion gates.
- Production readiness: existing in-flight feature approval evidence remains
  valid. No extension behavior or CHANGELOG impact expected.

## Traceability

- `TRACEABILITY.md` required: yes; seven harness requirements map to the
  three slices.

## Feature Exit

- Definition of Done status: Pending slice completion, reviews, and gate
  commits.
- Durable documentation: SDD evidence contract in `docs/specs/README.md`;
  later harness work remains in `docs/specs/roadmap.md`.
- Open risks: installed tool versions differ across hosts; SARIF identity
  mapping may remain ambiguous; snapshot-local qlty cache isolation needs
  verified setup; independent reviews are unavailable under the user's
  no-agent instruction.

## Validation

- [x] Verified official qlty `0.645.0` release checksum and installed it
      locally after `qlty upgrade --dry-run` failed with HTTP 403.
- [x] Verified `check --sarif` and `smells --sarif --no-snippets` produce valid
      SARIF 2.1.0 in a disposable checkout.
- [x] Removed three ignored qlty configuration entries. The old and new
      effective configurations use the same duplication default; new configuration
      validation has no warnings.
- [x] Comparable baseline/final qlty `check` and `smells` SARIF observations
      over `docs/specs` with identical qlty `0.645.0`, configuration hash, and
      analyzed paths: zero findings in each of the four files.
- [x] Shared evidence SKILL frontmatter and structure validated.
- [x] Read-only dry run on this branch listed three changed feature documents,
      two new SKILL files, unchanged `engines.vscode` (`^1.75.0`), and recorded
      approval fields without treating those fields as proof of approval.
- [x] Markdown lint passed for the shared SKILL and changed feature documents;
  the user reviewed and approved the Slice 2 replan and implementation.
- [x] Final aggregate passed in the disposable final snapshot. Its default
      changed-file selection reported zero files; the explicit-path SARIF runs are
      the substantive qlty evidence for this docs-only slice.
- [x] Markdown lint passed for all five changed SDD documents.
