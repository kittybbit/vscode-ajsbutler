# Requirements Traceability: Clarify Main-Agent SDD Delegation

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                | SPECS.md section                                       | Implementation slice                          | Test or validation                                                                                                                                                                           |
| --------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main entrypoint and allowed direct work                               | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Routing review: scope discussion, informal plan feedback, implementation approach, troubleshooting, and Feature Exit knowledge discussion stay with Main                                     |
| Formal-operation activation boundary                                  | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Routing review: feature creation, formal plan review, approved-slice implementation, completed-slice review, and Feature Exit route to designated roles                                      |
| Eight formal lifecycle stages delegate deterministically              | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Inspect every stage for activation, delegate, Main responsibility, expected result, return route, and stop condition; record expected versus actual route evidence                           |
| No direct lifecycle skill or role impersonation                       | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Cross-search `AGENTS.md`, `.agent.md`, `.github/copilot-instructions.md`, and applicable `docs/specs/README.md`; manually classify role-owned references and parent-return wording           |
| Role-owned canonical procedure                                        | Requirements; Architecture                             | Slice 1: Establish the orchestration contract | Inspect all eight `.codex/agents/*.toml` files for exactly the existing role/procedure mapping; inspect seven SDD sidecars as non-Main-facing adapters (release excluded)                    |
| Parent/child boundary and no child chaining                           | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Inspect all role definitions and the five affected procedures for delegated-only execution, no next-role invocation, and result plus recommended-route return to Main                        |
| User routing precedence and trivial-change handling                   | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Route explicit role requests, Main-specified investigation, safety/approval overrides, and a trivial change; compare each expected route with actual evidence                                |
| Agent Entrypoints remains a location map                              | Requirements; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Review `AGENTS.md`, `.agent.md`, and `.github/copilot-instructions.md` for location-only discovery, absence of formal direct-execution instructions, and accurate seven-role plus gate count |
| Release remains outside the SDD lifecycle                             | Requirements; Non-Goals                                | Slice 1: Establish the orchestration contract | Confirm no dedicated release role exists, `release-extension` is unchanged, and the direct-skill exception is explicit and distinct from SDD lifecycle routing                               |
| Approval gates and lifecycle remain unchanged                         | Non-Goals; Compatibility                               | Slice 1: Establish the orchestration contract | Before/after semantic comparison of `docs/specs/README.md` lifecycle stages, gate prerequisites, approval evidence, commit scope, and Feature Exit rules                                     |
| Runtime, product, VS Code, web, and JP1/AJS behavior remain unchanged | Compatibility; Non-Goals                               | Slice 1: Establish the orchestration contract | Changed-path review: no runtime, test, generated, configuration, product, use-case, README, or CHANGELOG file                                                                                |
| Minimal durable-document propagation                                  | Impact Analysis; Requirements                          | Slice 1: Establish the orchestration contract | Diff review explains each changed routing, role, procedure, adapter, SDD SSOT, and selected-feature evidence file; unrelated skills and durable docs remain unchanged                        |
| Ten-request and final-question behavior                               | Acceptance Criteria                                    | Slice 1: Establish the orchestration contract | Record expected versus actual route for all ten source requests and answer all twelve final-confirmation questions solely from repository text                                               |
| External directive criterion crosswalk                                | Directive §22 criteria 1–20; SPECS acceptance criteria | Slice 1: Establish the orchestration contract | Maintain the complete crosswalk below from directive C1–C20 to SPECS AC1–AC10                                                                                                                |
| Feature specification synchronization                                 | SPECS Origin; Acceptance Criteria                      | Slice 1: Establish the orchestration contract | Confirm feature-author's `SPECS.md` names the revised `TASKS.md` plan, maps C1–C20 to AC1–AC10, and records no remaining Open Questions                                                      |
| Documentation quality and branch compatibility                        | Acceptance Criteria; Compatibility                     | Slice 1: Establish the orchestration contract | Establish a non-`docs/...` branch before non-allowlisted edits; run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `rtk git diff --check`                                                  |

## Approval Evidence

- Independent plan review verdict: `Ready`.
- Human Approval: `Approved`, recorded as `approved in current conversation`.
- Approved scope: Slice 1 — Establish the Main-to-Role Orchestration Contract.
- Approved paths:
  - `AGENTS.md`
  - `.agent.md`
  - `.github/copilot-instructions.md`
  - `.codex/agents/approval-committer.toml`
  - `.codex/agents/feature-author.toml`
  - `.codex/agents/feature-closer.toml`
  - `.codex/agents/implementation-reviewer.toml`
  - `.codex/agents/implementer.toml`
  - `.codex/agents/plan-author.toml`
  - `.codex/agents/plan-reviewer.toml`
  - `.codex/agents/plan-reviser.toml`
  - `.agents/skills/sdd-plan-task/SKILL.md`
  - `.agents/skills/sdd-review-plan/SKILL.md`
  - `.agents/skills/sdd-implement-task/SKILL.md`
  - `.agents/skills/sdd-review-implementation/SKILL.md`
  - `.agents/skills/sdd-feature-exit/SKILL.md`
  - `docs/specs/README.md`
  - selected feature `TASKS.md` and `TRACEABILITY.md`
- Implementation status: Slice 1 complete; independent
  implementation-reviewer verdict `Ready`; Completion Approval is `Approved`
  at `approved in current conversation`; the exact completion commit is
  pending. Closure Approval remains Pending.
- Validation result: routing/contradiction searches, sidecar audit, configured
  Markdown lint, broad Markdown lint over every changed Markdown file, qlty,
  and diff whitespace checks passed. The initial sandbox qlty attempt could
  not create its external rolling log; an approved retry passed with no issues.
- Implementation-review feedback resolved: `docs/specs/README.md` Working
  Agreement and non-trivial workflow no longer present lifecycle skills as
  Main operational instructions; `AGENTS.md` Coordination Sources has no
  duplicate skill entry; and deterministic routing uses MD013-safe lists.

## Completion Approval Evidence

- Approved scope: Slice 1 — Establish the Main-to-Role Orchestration Contract.
- Implementation review verdict: `Ready`.
- Completion Approval: `Approved`, recorded at `approved in current conversation`.
- Exact approved completion paths (19):
  - `AGENTS.md`
  - `.agent.md`
  - `.github/copilot-instructions.md`
  - `.codex/agents/approval-committer.toml`
  - `.codex/agents/feature-author.toml`
  - `.codex/agents/feature-closer.toml`
  - `.codex/agents/implementation-reviewer.toml`
  - `.codex/agents/implementer.toml`
  - `.codex/agents/plan-author.toml`
  - `.codex/agents/plan-reviewer.toml`
  - `.codex/agents/plan-reviser.toml`
  - `.agents/skills/sdd-plan-task/SKILL.md`
  - `.agents/skills/sdd-review-plan/SKILL.md`
  - `.agents/skills/sdd-implement-task/SKILL.md`
  - `.agents/skills/sdd-review-implementation/SKILL.md`
  - `.agents/skills/sdd-feature-exit/SKILL.md`
  - `docs/specs/README.md`
  - `docs/specs/features/clarify-main-agent-sdd-delegation/TASKS.md`
  - `docs/specs/features/clarify-main-agent-sdd-delegation/TRACEABILITY.md`
- Commit status: Eligible for approval-committer; no commit has been created.

## Directive-to-SPECS Crosswalk

The source correction directive numbers twenty acceptance criteria in §22.
The feature specification numbers its ten acceptance criteria AC1–AC10. These
are distinct source sets and the complete mapping below is the plan's
acceptance evidence.

| Directive §22 criterion                                   | SPECS acceptance mapping | Evidence planned in Slice 1                      |
| --------------------------------------------------------- | ------------------------ | ------------------------------------------------ |
| C1 default chat entrypoint                                | AC1                      | Main boundary text and route matrix              |
| C2 direct ad-hoc discussion/investigation                 | AC1                      | Direct-work route cases                          |
| C3 SDD topic alone does not delegate                      | AC2                      | Discussion-versus-execution cases                |
| C4 formal activation boundary                             | AC2, AC3                 | Activation conditions for every stage            |
| C5 formal operation delegates to role                     | AC3                      | Main-to-role route matrix                        |
| C6 no direct lifecycle skill execution                    | AC4, AC5                 | No-direct-Main search and prohibition review     |
| C7 no role impersonation                                  | AC4                      | Main boundary and role-contract review           |
| C8 SDD workflow is role-delegation centered               | AC3, AC5                 | `AGENTS.md` workflow comparison                  |
| C9 deterministic operation-to-role routing                | AC3                      | Eight-stage route evidence                       |
| C10 no `$sdd-*` in Main routing                           | AC5                      | Cross-document search with manual classification |
| C11 role owns canonical procedure                         | AC6                      | Eight role definitions and seven sidecar audit   |
| C12 child does not start next child                       | AC6                      | Role/procedure handoff search                    |
| C13 parent-mediated handoff                               | AC3, AC6                 | Main return-route evidence                       |
| C14 explicit user routing preference                      | AC7                      | Explicit-role request cases                      |
| C15 safety/approval/ownership override preference         | AC7, AC8                 | Main-specified implementation override case      |
| C16 trivial changes remain direct                         | AC8                      | Trivial-change route case against SSOT           |
| C17 Human Approval boundary remains                       | AC8                      | Before/after policy comparison                   |
| C18 `.agents/skills` remains reusable canonical procedure | AC5, AC6                 | Role-owned reference classification              |
| C19 SDD policy SSOT remains consistent                    | AC8                      | `docs/specs/README.md` semantic comparison       |
| C20 no unnecessary routing/role/skill duplication         | AC5, AC6                 | Entrypoint and sidecar duplication review        |

## Routing Evidence Matrix

The implementation evidence must record both columns, not only the expected
route. “Actual route” is the observed route after the documentation changes.

| Request or condition                                    | Expected route                                                            | Actual route                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Ask to discuss feature scope                            | Main directly                                                             | Main directly; no formal activation.                                                            |
| Create formal feature artifacts                         | Main → `feature-author` → Main                                            | Main delegates `feature-author`; intake artifacts and recommendation return to Main.            |
| Ask for informal plan-slice opinion                     | Main directly                                                             | Main directly; informal planning discussion does not activate a role.                           |
| Request formal plan review                              | Main → `plan-reviewer` → Main                                             | Main delegates read-only `plan-reviewer`; verdict and evidence return to Main.                  |
| Ask which implementation approach is best               | Main directly                                                             | Main directly; approach discussion is ad hoc.                                                   |
| Implement an approved slice                             | Main → `implementer` → Main                                               | Main delegates `implementer`; final diff and evidence return to Main.                           |
| Investigate an implementation error                     | Main directly unless continuing an active formal implementation operation | Main investigates directly unless the active operation requires a delegated implementer result. |
| Request completed-slice review                          | Main → `implementation-reviewer` → Main                                   | Main delegates read-only `implementation-reviewer`; verdict returns to Main.                    |
| Ask what knowledge should survive Feature Exit          | Main directly                                                             | Main directly; knowledge discussion does not activate Feature Exit.                             |
| Run formal Feature Exit                                 | Main → `feature-closer` → Main                                            | Main delegates `feature-closer`; Close/blocker recommendation returns to Main.                  |
| User explicitly names `plan-reviewer` for formal review | Main → `plan-reviewer` → Main, subject to safety and approval gates       | Main honors the explicit role request; approval and safety gates remain in force.               |
| User says “Main should implement the approved slice”    | Main routes to `implementer`; role ownership overrides preference         | Main routes to `implementer`; role ownership overrides the preference.                          |
| Trivial change permitted by SDD SSOT                    | Main directly unless another repository rule requires delegation          | Main directly under the SDD trivial-change criteria.                                            |

### Formal Lifecycle Stage Routes

The eight formal stages each return to Main before any subsequent delegation.
Approval-committer is shown for all three existing approval-gate variants.

| Formal stage or gate  | Activation and expected route                                                                                 | Actual route                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Feature intake        | Formal feature-artifact creation → Main → `feature-author` → Main                                             | Confirmed: `feature-author` returns intake artifacts and recommendation to Main; no child chaining.         |
| Planning              | Create the implementation-slice plan → Main → `plan-author` → Main                                            | Confirmed: `plan-author` returns the complete plan and evidence to Main.                                    |
| Plan review           | Formal plan-review gate → Main → `plan-reviewer` → Main                                                       | Confirmed: `plan-reviewer` returns `Ready` or Findings to Main; Main routes any revision.                   |
| Plan revision         | Plan-review Findings require replanning → Main → `plan-reviser` → Main                                        | Confirmed: `plan-reviser` returns the revised plan and recommended review route to Main.                    |
| Approved plan commit  | Human Approval plus plan-reviewer Ready → Main → `approval-committer` (plan gate) → Main                      | Confirmed: Main delegates the plan gate only after both prerequisites; commit result returns to Main.       |
| Implementation        | Approved slice execution → Main → `implementer` → Main                                                        | Confirmed: `implementer` returns the final diff and evidence to Main.                                       |
| Implementation review | Completed approved-slice review → Main → `implementation-reviewer` → Main                                     | Confirmed: `implementation-reviewer` returns `Ready` or Findings to Main; Main routes fixes.                |
| Completion commit     | Completion Approval plus implementation-reviewer Ready → Main → `approval-committer` (completion gate) → Main | Confirmed: Main delegates the completion gate only after both prerequisites; commit result returns to Main. |
| Feature Exit          | All slices complete and committed → Main → `feature-closer` → Main                                            | Confirmed: `feature-closer` returns Close/blocker evidence to Main.                                         |
| Closure commit        | Closure Approval plus feature-closer Close → Main → `approval-committer` (closure gate) → Main                | Confirmed: Main delegates the closure gate only after both prerequisites; commit result returns to Main.    |

### Final Confirmation Answers

| Question                                              | Answer from repository text                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Chat default entrypoint                               | Main agent.                                                              |
| May Main conduct non-formal design discussion?        | Yes. Main Direct Work includes architecture and design discussion.       |
| Does feature discussion alone start `feature-author`? | No. SDD topic discussion does not activate a role.                       |
| Who creates formal feature artifacts?                 | `feature-author`, delegated by Main.                                     |
| May Main directly execute feature-intake skill?       | No. Skills are role-owned procedures, not Main lifecycle entrypoints.    |
| Who handles an informal plan opinion?                 | Main directly.                                                           |
| Who performs formal plan review?                      | `plan-reviewer`, delegated by Main.                                      |
| Does a child start the next child?                    | No. Role contracts prohibit invoking or spawning another lifecycle role. |
| Where does a child return?                            | Main orchestrator, with result, evidence, and recommended route.         |
| Who selects and runs the canonical skill?             | The delegated role, as declared in its `.codex/agents/*.toml` contract.  |
| May a user ask Main to investigate only?              | Yes, unless the action crosses a formal lifecycle or approval boundary.  |
| What is the SDD policy SSOT?                          | `docs/specs/README.md`.                                                  |

The seven SDD skill-adapter files are classified separately from Main routing:
they are invocation adapters owned by their respective skill packages, not
Main-agent lifecycle instructions. A sidecar that directly authorizes Main to
execute a formal role-owned operation must be added as an exact implementation
path; otherwise it remains unchanged and the classification is recorded.

<!-- markdownlint-enable MD013 MD060 -->
