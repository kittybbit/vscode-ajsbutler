# TASKS: sdd-instruction-simplification

## Agent Brief

- Purpose: shorten agent instructions and feature records while retaining
  authority, decisions, and required gates.
- Selected feature: this folder. The inherited WebAPI folder is a rewrite
  surface, not this branch's active plan.
- State: revised plan reviewed and approved; Slice 1 awaits the replan commit.
- Next route: focused replan commit, then Slice 1.
- Do not change product behavior, approval order, role authority, WebAPI beta
  status, or document locations.

## Plan Status

- Status: Revised plan approved; original plan committed at `80b51203`;
  replan commit pending.
- Planning scope: instruction text reachable from `AGENTS.md`, including SDD
  and release guidance, roles, adapters, templates, and inherited WebAPI
  records.
- Review status: Ready for approval after independent re-review.
- Human Approval: Approved for the reviewed replan and revised Slice 1 scope.
- Completion Approval: Pending; no completed slice or verdict.
- Closure Approval: Pending; no Feature Exit verdict.
- Active implementation slice: Slice 1 after the replan commit.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation after independent replan review
- Approved scope: the reviewed replan and Slice 1, Repository routing and SDD
  policy; selected-feature evidence documents may record only its state,
  validation, and evidence.
- Approved paths (replan commit):
  `docs/specs/features/sdd-instruction-simplification/TASKS.md`.
- Approved Slice 1 implementation and completion paths: `AGENTS.md`,
  `docs/specs/README.md`, `docs/specs/architecture.md`, `.agent.md`,
  `.github/copilot-instructions.md`,
  `docs/specs/features/sdd-instruction-simplification/TASKS.md`, and
  `docs/specs/features/sdd-instruction-simplification/TRACEABILITY.md`.
- Required review: plan-reviewer Ready for approval after the evidence-path
  mismatch was corrected and independently re-reviewed.

## Replan Trigger And Approval Scope

- Trigger: after plan commit `80b51203`, Slice 1 implementation stopped before
  edits because its approved instruction paths omit this selected feature's
  `TASKS.md` and `TRACEABILITY.md`. The implementation procedure requires
  slice/evidence and validation-result updates in those documents.
- The prior Human Approval covered only the original five paths. The reviewed
  seven-path Slice 1 scope now has new exact-scope Human Approval above and
  requires a focused replan commit of this `TASKS.md` before implementation
  resumes.
  Slices 2–4 remain proposed and require their own later exact-scope approvals.
- Each slice's proposed implementation and completion-commit paths now include
  the two selected-feature evidence documents plus its content paths. The
  selected `SPECS.md` is unchanged by these slices.

## Implementation Slices

### Slice 1: Repository routing and SDD policy

- Status: Approved for the revised seven-path scope; implementation awaits the
  replan commit.
- Value and scope: establish one owner per repository rule and SDD gate by
  rewriting instruction text in `AGENTS.md`, `docs/specs/README.md`,
  `docs/specs/architecture.md`, `.agent.md`, and
  `.github/copilot-instructions.md`. Correct `.agent.md`'s absent `plan-author`
  and inaccurate role count.
- Solution Shape Evidence: `AGENTS.md` owns repository constraints and routing;
  `docs/specs/README.md` owns SDD policy, document roles, approval evidence,
  and validation; `docs/specs/architecture.md` owns durable architecture
  boundaries. Entrypoints point to these owners. Existing Markdown and links
  suffice; no new abstraction, API, port, adapter, factory, custom mechanism,
  or code dependency. Preserve public role/gate names and architecture-test
  automation for cataloged code rules; semantic ownership and normative
  equivalence remain reviewer judgments.
- Acceptance: routing, Planning/Replanning, independent reviews, exact
  plan/completion/closure approvals and commits, Solution Shape, qlty evidence,
  compatibility and stop rules remain enforceable without duplicate policy
  prose.
- Validation: before/after matrix of required, forbidden, recommended,
  exception, and source-priority statements; role catalog and link/heading
  checks; Markdown lint; policy-required disposable-snapshot qlty observations
  and final aggregate.
- Production readiness: no JP1/AJS3, failure-mode, desktop/web, or
  `engines.vscode` behavior change. Assess README/user-doc and CHANGELOG need;
  update neither absent a changed durable usage or user-facing fact.
- Proposed revised approval boundary and exact implementation/completion-commit
  paths: the five instruction files named above, plus
  `docs/specs/features/sdd-instruction-simplification/TASKS.md` and
  `docs/specs/features/sdd-instruction-simplification/TRACEABILITY.md` for
  this slice's state, validation, and evidence. Only instruction text changes
  in `architecture.md`. One implementation review, Completion Approval, and
  focused commit are required before dependent slices.
- Dependency: reviewed, Human Approved, committed revised plan.
- Risk and stop: consolidating a rule may weaken a gate or break a link; replan
  if ownership or approval semantics cannot be preserved.
- Out of scope: changing architecture rules, SDD gate order, product behavior,
  release mechanics.

### Slice 2: SDD role contracts and procedures

- Status: Proposed.
- Value and scope: each role has only its authority, inputs, evidence, verdict,
  output, and stop conditions. Rewrite all seven `.codex/agents/*.toml`, eight
  `.agents/skills/sdd-*/SKILL.md`, and their eight
  `.agents/skills/sdd-*/agents/openai.yaml` adapters; remove repeats owned by
  Slice 1.
- Solution Shape Evidence: role TOML owns authority and handoff; SDD skills own
  role-specific procedure; YAML is an invocation adapter. Preserve names,
  paths, model/effort assignments, `Main -> Child -> Main`, and
  approval-committer-only commit authority. Existing TOML/YAML/Markdown is
  sufficient; no new abstraction or custom mechanism. Mechanical
  architecture/qlty facts stay separate from reviewer judgment.
- Acceptance: every handoff from intake to closure identifies one owner, needed
  evidence, stop condition, and return to Main. No child grants approval or
  another role's verdict; mandatory evidence and qlty comparability remain
  intact.
- Validation: role/skill/adapter contract walkthrough; TOML/YAML parse, names,
  links, stop-condition and approval matrix, Markdown lint, and policy-required
  disposable-snapshot qlty observations plus the separate final aggregate. If
  formatting changes analyzed content, synchronize approved paths, rebuild the
  final snapshot, and repeat the observations and aggregate until stable.
- Production readiness: no runtime, host, or JP1/AJS3 impact; no
  README/user-doc or CHANGELOG update expected.
- Proposed approval boundary and exact implementation/completion-commit paths:
  the seven role files and eight SDD skill/adapter pairs, plus selected-feature
  `TASKS.md` and `TRACEABILITY.md` for this slice's state, validation, and
  evidence. Excludes release, templates, WebAPI, code, configuration, and
  unapproved approval-state changes.
- Dependency: Slice 1 completion commit.
- Risk and stop: unique authority or evidence can be lost during shortening;
  replan for a changed authority owner or gate.
- Out of scope: role/model renaming, new agents, lifecycle redesign, edits to
  external `rewrite-prompts`.

### Slice 3: Feature templates and inherited WebAPI records

- Status: Proposed.
- Value and scope: decision-focused feature records. Rewrite all seven
  `docs/specs/features/_templates/*` Markdown files and
  instruction/status/duplicate-record text in
  `docs/specs/features/import-definition-via-webapi/{SPECS,TASKS,TRACEABILITY}.md`.
  Preserve unique manual, endpoint, DTO, error, host, beta, pending-task, and
  open-question facts.
- Solution Shape Evidence: `SPECS.md` owns purpose, requirements, acceptance,
  boundaries; `TASKS.md` owns current plan/slice, approvals, evidence links,
  risks, validation, and exit readiness; `TRACEABILITY.md` maps requirements to
  slices and validation. Existing Markdown records and names remain the
  contract; no new schema, generator, abstraction, API, or custom mechanism.
  Gate records retain applicable state, review verdict, exact approved
  scope/paths, and human result; remove routine empty entries and repeated
  narratives, not authorization evidence.
- Acceptance: a new representative feature and inherited WebAPI feature expose
  selection, active/blocked slice, dependency, approval boundary, validation,
  and next decision. WebAPI remains read-only beta pending real-environment
  evidence and enough feedback; stale Prism follow-up remains separate and
  unapproved.
- Validation: representative filled example outside the repository and
  role-by-role read; before/after WebAPI manual/beta/open-question comparison;
  traceability, approval fields, links, Markdown lint, and policy-required
  disposable-snapshot qlty observations plus the separate final aggregate. If
  formatting changes analyzed content, synchronize approved paths, rebuild the
  final snapshot, and repeat the observations and aggregate until stable.
- Production readiness: retain malformed-response, authentication/network,
  browser-unsupported, manual, desktop/web, and VS Code constraints. No OpenAPI
  or generated-file edit; no README/user-doc or CHANGELOG update expected.
- Proposed approval boundary and exact implementation/completion-commit paths:
  seven template Markdown files, the three named inherited WebAPI Markdown
  files, plus selected-feature `TASKS.md` and `TRACEABILITY.md` for this
  slice's state, validation, and evidence. Do not grant/reset inherited
  approvals or start its blocked task.
- Dependency: Slice 2 completion commit.
- Risk and stop: unique manual or unresolved facts may look repetitive; replan
  if WebAPI scope, beta decision, or `openapi/README.md` instruction change is
  required.
- Out of scope: WebAPI implementation, smoke verification, beta exit, OpenAPI
  source/generated artifacts, inherited feature closure.

### Slice 4: Release instruction alignment

- Status: Proposed.
- Value and scope: shorten `.agents/skills/release-extension/SKILL.md` and
  `.agents/skills/release-extension/agents/openai.yaml` while preserving
  protected-branch, tag, package, Marketplace, and publish-safety conditions.
- Solution Shape Evidence: existing release skill owns the procedure and YAML
  is its invocation adapter; `AGENTS.md` routes to it. Existing
  platform/repository capabilities suffice; no new owner, abstraction, public
  command, or custom mechanism. Release remains outside SDD roles and gates.
- Acceptance: release entry, checks, irreversible publication boundary, and
  result remain clear and unchanged.
- Validation: before/after obligation comparison, skill/adapter consistency,
  links, YAML/Markdown validity, and policy-required disposable-snapshot qlty
  observations plus the separate final aggregate. If formatting changes
  analyzed content, synchronize approved paths, rebuild the final snapshot,
  and repeat the observations and aggregate until stable.
- Production readiness: no release execution, package, workflow, Marketplace,
  runtime, or host change; no README/user-doc or CHANGELOG update expected.
- Proposed approval boundary and exact implementation/completion-commit paths:
  the two release skill/adapter files plus selected-feature `TASKS.md` and
  `TRACEABILITY.md` for this slice's state, validation, and evidence.
- Dependency: Slice 1 completion commit; independent of Slices 2 and 3
  thereafter.
- Risk and stop: a publish condition may be lost; replan for a new release
  decision or affected path.
- Out of scope: changing or executing release policy, publication, tags,
  workflow, configuration.

## Approval, Traceability, And Exit

- `TRACEABILITY.md` maps all feature requirements to these independently
  approvable slices and their validation.
- Replan review `Ready` and new exact-scope Human Approval are recorded; the
  focused replan commit precedes Slice 1.
  Every slice needs independent implementation review `Ready`, explicit Completion
  Approval, and its focused commit before a dependent slice. Slice 4 can
  proceed after Slice 1 regardless of Slices 2 and 3.
- Feature Exit follows all four completed and committed slices. It checks
  preserved obligations, durable-document consistency, changed paths and
  validation; `Close`, Closure Approval, and closure commit are separate. Only
  this selected feature folder may be removed; the inherited WebAPI folder
  remains.
- No runtime code, tests, generated artifacts, configuration, product API, or
  `engines.vscode` change is approved. Changed semantic owner, contract,
  affected surface, risk, validation, or approval boundary requires Replanning.

## Validation Feasibility

- `rtk pnpm exec qlty --version` currently panics before reporting a version:
  `tracing-appender` cannot create its initial log file (`PermissionDenied`).
  This is a tool/environment blocker, not a passing observation. Investigate
  writable disposable snapshot-local log/cache settings before implementation
  review; if unavailable, return missing qlty evidence to Main at the required
  validation gate.
- Syntax, references, normative comparison, and Markdown lint can be checked
  independently. Missing SARIF, failed commands, and unrun checks cannot be
  recorded as passed.
