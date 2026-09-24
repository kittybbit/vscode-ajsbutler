# Feature Specification: Deterministic SDD Evidence

## Purpose

Produce reproducible, structured evidence for SDD decisions so lifecycle
agents can spend their effort on semantic judgment rather than collecting and
comparing mechanical facts.

## Minimal Context

- Current decision: define one evidence contract and a shared SKILL that uses
  existing deterministic CLI output, without changing lifecycle gates.
- Read first: this file, `TASKS.md`, and `docs/specs/README.md`.
- This is a transient branch feature for the user's SDD harness improvement
  request; the source is the attached Japanese improvement brief.

## Origin

- Source: the user's SDD harness improvement brief, especially Phase 1 and the
  five immediate priorities.
- JP1/AJS source basis: not applicable; this feature changes the development
  harness, not JP1/AJS interpretation.
- Implementation-slice plan: [TASKS.md](./TASKS.md).

## Requirements

1. A shared evidence skill defines a versioned record that links raw,
   reproducible CLI output and identifies its comparison base, final state,
   analyzed paths, tool versions/configuration, commands, exit status, and any
   unavailable or ambiguous evidence. A failed check must never be represented
   as a pass.
2. Run a verified qlty version that emits official SARIF for both `check` and
   `smells`. Retain the complete baseline and final SARIF files, command exit
   states, qlty version, analyzed scope, and configuration fingerprint. Use
   these standard records for finding-level review; do not implement a
   repository-specific qlty output parser or comparator.
3. Repository impact evidence uses Git's changed-path output and an explicit
   approved-scope check. Architecture evidence reports the existing dependency
   test's result separately from semantic design judgments.
4. Validation and compatibility evidence record executed checks, outcomes,
   `engines.vscode` changes, production Node imports, and desktop/web-relevant
   paths. These observations do not assert that behavior is compatible.
5. Solution Shape evidence lists mechanically discoverable changed layers,
   exports, dependencies, and candidate abstractions. It must leave semantic
   owner, abstraction value, contracts, framework sufficiency, and risk to
   human or agent review.
6. Traceability and approval evidence report structural presence and recorded
   state only. Approval must come from a human; the harness cannot infer it.
7. Existing SDD roles can consume the record through one shared skill,
   with redundant collection instructions reduced without weakening review,
   approval, snapshot, or validation requirements.

## Architecture

- Product layers: unchanged. The shared skill adds no runtime source.
- Evidence producer: qlty's SARIF output, Git, existing tests, and focused
  read-only CLI commands. `.agents/skills/sdd-evidence/SKILL.md` defines how
  to gather and record them; it grants no approval authority.
- Evidence consumer: existing role procedures; semantic judgments and review
  verdicts remain with their current owners.
- Existing architecture test remains the rule catalog and source of automatic
  boundary evidence. The evidence layer does not duplicate its rules.

## Impact Analysis

### Dependency Impact

- Likely surfaces: `.agents/skills/`,
  `AGENTS.md`, and `docs/specs/README.md`. Exact paths are fixed per slice in
  `TASKS.md` before approval.
- No product source, parser, generated parser, extension entry point, or
  bundled web asset is intended to change.

### Breaking Change Analysis

- User-visible extension behavior: none.
- Extension API/DTO/schema: none. The evidence record is internal.
- VS Code/web extension compatibility: preserve `engines.vscode` and both
  extension hosts; harness commands run only in development tooling.
- Existing approval process: unchanged until a separately approved feature.

### Alternative Considerations

- Add read-only analysis agents: rejected initially because the listed facts
  can be collected with Git, static scans, existing tests, and CLI output.
- Replace the approval-committer now: deferred until evidence contracts and
  authorization verification have been independently reviewed.
- Rewrite all roles together: rejected by the source brief's phased sequence.

### Approval Impact Decisions

- Any evidence schema, analyzed scope, finding identity/direction mapping,
  check selection, approval interpretation, or tool integration outside the
  approved slice requires replanning and renewed approval.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web and desktop extension behavior remains unchanged; validation must catch
  accidental production-source or packaging changes.
- JP1/AJS compatibility remains unchanged by design.

## Acceptance Criteria

- Equivalent inputs and commands produce the same raw evidence after excluding
  explicitly volatile logs. The skill records unavailable or ambiguous facts
  without upgrading them to a pass.
- A missing, failed, or ambiguous source is visible in the package and cannot
  become an automatic Ready or Approved result.
- Both qlty commands emit valid SARIF 2.1.0 from the same verified version in
  exact disposable baseline/final snapshots with identical configuration and
  analyzed scope. The records preserve rule, location, severity, and measured
  values available from qlty.
- Any comparison that SARIF and established tools cannot map reliably remains
  advisory for the independent reviewer; it is never silently passed.
- Existing architecture, traceability, and human approval boundaries remain
  authoritative; reviewers still decide semantic risks and readiness.

## Non-Goals

- Consolidating planner roles or changing role models.
- A custom qlty output parser or finding comparator.
- A custom repository evidence collector when existing CLI output suffices.
- Automating commits or human approval.
- Adding execution profiles or deep agent variants.
- Splitting implementation by source layer.
- Changing product behavior, parser, or extension compatibility.

## Open Questions

- qlty `0.645.0` provides `--sarif` for both commands and was validated in a
  disposable checkout. Its built-in `upgrade` path failed on this host with an
  HTTP 403, so the verified official release binary was installed locally.
  The repository needs a durable minimum-version check before treating SARIF
  evidence as available on other hosts.
- qlty `0.645.0` warned about three unsupported keys. The previous `0.500.0`
  effective configuration already used the same defaults, so Slice 1 removed
  those ignored entries and verified identical baseline/final configuration.
- A standard SARIF comparison capability may be evaluated later. This feature
  does not replace a human's review disposition with a new custom comparator.
