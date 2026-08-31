# Feature Specification: Semantic Diff Review-Risk Rules

## Purpose

Expand Semantic Diff's evidence-based review recommendations so supported
changes that may remove a start opportunity, eliminate a calculated schedule
run, prolong or redirect a wait, or alter the execution user type or JP1
resource group are brought to human attention without being presented as
verified runtime failures.

## Minimal Context

- Current decision: define which definition-only changes belong in the
  confirmation-required review boundary and which runtime judgments remain
  unsupported.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Feature kind: roadmap feature, Wave 1, `Expand Semantic Diff Review-Risk
Rules`.
- Source proposal: E-2, `Semantic Diff confirmation-required rule expansion`.
- Source use case: `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- JP1/AJS reference basis: JP1/AJS3 version 13 is normative. The [v13
  Definition Assistant Description, Operator's Guide and
  Reference](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF)
  defines `EU` in the applicable Job common attribute rows (`ent|def`, with
  the ordinary documented default `ent`) and `GR`/JP1 resource group in the
  Unit common attributes section (default blank). The [v13 HTTP connection
  job definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4810e/AJSV0308.HTM)
  describes the View default as User who registered (`ent`), while the
  ajsprint-oriented representation and this repository's existing
  `Defaults.HttpConnectionJobEu` use `def` for `htpj`/`rhtpj`. The [v13 Configuration
  Guide](https://itpfdoc.hitachi.co.jp/manuals/3021/30213b1520e/AJSX0018.HTM)
  and [v13 Overview, user management and access
  control](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4210e/AJSF0124.HTM)
  establish that JP1 resource groups and JP1 permission levels form the
  authorization context, while user mapping determines the OS account. The
  feature does not infer those external settings from a definition file.
- The v13 unit-type applicability table is authoritative for `eu`: only units
  for which the Job common attribute is applicable may generate the rule;
  event-job, jobnet, judgment, and other excluded rows are ignored even when
  the parser accepts an `eu` parameter. The implementation must encode a
  closed predicate over the complete `TySymbol` set and fixture every allowed
  and ignored code; parser acceptance alone is not evidence of applicability.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- Preserve the existing confirmation-required baseline for removed
  conditional relations, changed within-job-group wait-release sources,
  removed explicit wait timeouts, supported condition or judgment changes,
  changed file or event wait targets, and supported schedule-defined jobnets
  with no calculated run in the requested period.
- Treat a supported condition or branch change as review-recommended only when
  definition evidence shows that a previously available start opportunity may
  have been removed or tightened. Plain predecessor or successor changes,
  disconnection, and jobnet-start parallelism are not risks by themselves.
- Treat schedule loss as review-recommended when the supported schedule
  comparison can show that a previously calculated execution opportunity is
  absent, including the existing explicit zero-run result for the requested
  period. A zero-run result requires at least one supported schedule-pair
  evaluation; unsupported/uncalculated-only evidence is not zero. Unsupported,
  uninterpretable, or uncalculated schedule semantics remain explicit and must
  not be converted into a no-start conclusion.
- Keep changes to wait-release sources, timeouts, and supported file or event
  wait targets review-recommended, with the relevant definition evidence and
  external-condition constraint attached to each item.
- Treat a changed execution user type (`eu={ent|def}`) or JP1 resource group
  as review-recommended definition evidence. Use the exact non-assertive term
  "execution user type"; do not call `eu` a resolved execution account. State
  that user mapping, host configuration, permissions, account existence,
  resource availability, contention, and execution history are not verified;
  do not claim that execution will fail.
- Produce deterministic review recommendations with a target, change kind,
  rationale, related elements when known, and analysis constraints. The
  preceding `semantic-diff-structured-outputs` feature owns the exact
  nine-member confirmation-reason union, confirmation levels, Full/Audit/JSON
  mappings, and serializer ordering. This feature owns only rule generation
  and consumes that contract without redefining it.
- Keep unsupported evidence explicit instead of silently omitting it or
  upgrading it to a verified risk.

## Reference-Backed Environment Semantics

- `eu` is the JP1/AJS execution user type, not an OS username. On v13
  applicable Job common attribute units, `ent` selects the JP1 user who
  registered the jobnet and `def` selects the JP1 user who owns the job. A
  value outside `{ent|def}` is invalid evidence and does not generate this
  confirmation. The rule uses a closed, unit-type-aware effective-default
  comparison while preserving the raw normalized parameter in detail: an
  omitted value on an ordinary applicable unit has effective `ent`; an
  omitted value on `htpj`/`rhtpj` has effective `def` for this ajsprint-oriented
  input contract, matching `Defaults.HttpConnectionJobEu`. The latter choice
  is deliberately conservative in view of the HTTP dialog's `ent` default;
  this feature does not rewrite either source or claim that the GUI and
  ajsprint representations are interchangeable. An omitted value and an
  explicit value equal to that unit-type default are not an effective change;
  an explicit `ent`/`def` change is evaluated. If source provenance or a
  default cannot be established, the absent side is unresolved and produces no
  confirmation. The rule does not resolve owner/registrant identity, user
  mapping, or an upper-unit execution-user-fixing profile.

### `eu` Applicability And Default Matrix

The predicate is a closed allowlist, not an exclusion heuristic. The exact
v13-derived code table used by Slice 4 is:

<!-- markdownlint-disable MD013 MD060 -->

| Predicate branch                    | Closed `unitType` codes                                                                                                                               | Omitted `eu` policy                                | Rule outcome                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Applicable standard jobs            | `j`, `rj`, `pj`, `rp`, `qj`, `rq`                                                                                                                     | Effective `ent`                                    | Compare effective `eu`; retain raw before/after values |
| Applicable action jobs              | `evsj`, `revsj`, `mlsj`, `rmlsj`, `mqsj`, `rmqsj`, `mssj`, `rmssj`, `cmsj`, `rcmsj`, `pwlj`, `rpwlj`, `pwrj`, `rpwrj`                                 | Effective `ent`                                    | Compare effective `eu`; retain raw before/after values |
| Applicable custom/flexible jobs     | `cj`, `rcj`, `cpj`, `rcpj`, `fxj`, `rfxj`                                                                                                             | Effective `ent`                                    | Compare effective `eu`; retain raw before/after values |
| Applicable HTTP connection jobs     | `htpj`, `rhtpj`                                                                                                                                       | Effective `def` for the ajsprint-oriented contract | Compare effective `eu`; retain raw before/after values |
| Ignored jobnet/group/control rows   | `g`, `mg`, `n`, `rn`, `rm`, `rr`, `rc`, `mn`, `orj`, `rorj`, `nc`                                                                                     | Not applicable                                     | Ignore `eu`; no confirmation                           |
| Ignored judgment and event-job rows | `jdj`, `rjdj`, `evwj`, `revwj`, `flwj`, `rflwj`, `mlwj`, `rmlwj`, `mqwj`, `rmqwj`, `mswj`, `rmswj`, `lfwj`, `rlfwj`, `ntwj`, `rntwj`, `tmwj`, `rtmwj` | Not applicable                                     | Ignore `eu`; no confirmation                           |

<!-- markdownlint-enable MD013 MD060 -->

The table covers every current `TySymbol`; an unknown code is ignored. An
invalid value, an unresolved absent side, or a mixed comparison containing
ignored/invalid units never upgrades those units into confirmation candidates.
Mixed tests must prove that an applicable valid unit can produce one
recommendation while ignored, invalid, and unresolved units remain ordinary or
unsupported evidence.

- `jp1ResourceGroup` is the normalized projection of the `GR` unit-common
  attribute and applies to each v13 unit type for which that common attribute
  is defined. A raw value may be inherited from an upper unit when JP1/AJS3
  unit-attribute inheritance is enabled; that profile and its effective
  inheritance context are not present in the normalized comparison input.
  Therefore this feature deliberately compares the raw per-unit
  `AjsUnit.jp1ResourceGroup` value, without parent traversal or effective-value
  synthesis. An undefined raw field means the attribute was not present; an
  explicit empty string means a blank raw group. Both are retained as distinct
  raw evidence, and neither is rewritten as an inherited group. The v13
  meaning of a blank group (no JP1 resource-group authorization target) is
  stated as context only, not verified authorization.
- The structured-output detail uses `parameterKey: "eu"` for the execution
  user type and `parameterKey: "rg"` for the `jp1ResourceGroup`/`GR` field,
  exactly as its v1 contract requires. Domain selection remains
  `AjsUnit.jp1ResourceGroup`; presentation and JSON do not rename or infer
  the field. The `eu` rule emits only for an effective change on a
  correspondence-matched applicable unit; raw values, including absent sides,
  remain in detail. The resource-group rule continues to emit for a selected
  raw change. Unchanged effective values, unsupported unit applicability,
  unresolved absent sides, and invalid `eu` values do not produce a
  confirmation.
- The resulting recommendation is about a definition change. It never proves
  JP1 authorization, ownership, user mapping, OS-account availability, or
  resource contention. Those facts require JP1/Base/JP1/AJS3 host context and
  remain outside this feature.

## Behavioral Scenarios

```gherkin
Feature: Recommend Semantic Diff changes for human review

Scenario: A supported start opportunity is removed
  Given the before definition contains a supported condition or conditional
    branch that can allow a unit to start
  And the after definition removes or tightens that available opportunity
  When Semantic Diff evaluates review-risk rules
  Then the result recommends human confirmation for the affected target
  And it states that runtime history and external conditions are not verified

Scenario: A supported schedule opportunity disappears
  Given schedule comparison is requested for a period
  And the supported before projection contains an execution opportunity
  And the supported after projection no longer contains that opportunity
  When Semantic Diff evaluates review-risk rules
  Then the result recommends human confirmation with the comparison period

Scenario: An uncalculated schedule is not reported as a no-start failure
  Given part of a compared schedule is unsupported or uncalculated
  When Semantic Diff evaluates review-risk rules
  Then that limitation remains explicit
  And the result does not infer that the jobnet cannot start

Scenario: An external wait target changes
  Given a supported file or event wait target changes
  When Semantic Diff evaluates review-risk rules
  Then the result recommends human confirmation
  And it states that external files, events, hosts, permissions, and runtime
    history are not verified

Scenario: The execution user type changes
  Given a matched v13-applicable unit changes its effective `eu` value between
    `ent` and `def`, including a default-aware absent side
  When Semantic Diff evaluates review-risk rules
  Then the result recommends human confirmation for the execution user type
    definition change
  And it does not assert an account, permission, host, or runtime-user failure

Scenario: An omitted execution user type matches its unit-type default
  Given an applicable non-HTTP unit omits `eu` and the other side explicitly
    uses `ent`
  Or an applicable HTTP unit (`htpj` or `rhtpj`) omits `eu` and the other side
    explicitly uses `def`
  When Semantic Diff evaluates review-risk rules
  Then no execution-user-type confirmation is emitted for that unit
  And the raw absent side remains distinguishable in the structured detail

Scenario: Invalid or inapplicable execution user type is ignored
  Given a unit has an `eu` value outside `{ent|def}` or its type is in the
    closed ignored-unit table
  When Semantic Diff evaluates review-risk rules
  Then no execution-user-type confirmation is emitted
  And the value remains ordinary or unsupported evidence

Scenario: Mixed execution user type applicability is evaluated per unit
  Given one matched applicable unit changes between valid effective `eu` values
  And another matched unit is ignored, invalid, or has an unresolved absent side
  When Semantic Diff evaluates review-risk rules
  Then only the applicable valid unit receives the confirmation
  And ignored, invalid, and unresolved units receive no confirmation

Scenario: A resource group definition changes
  Given a matched unit's raw `jp1ResourceGroup` value changes, including an
    explicit blank or an absent raw field
  When Semantic Diff evaluates review-risk rules
  Then the result recommends human confirmation for the JP1 resource-group
    definition change
  And it states that effective inheritance and JP1 authorization context are
    not verified

Scenario: Unsupported schedule evidence does not become a no-run conclusion
  Given a matched jobnet has no supported schedule pair on either side
  And its schedule evidence is unsupported or uncalculated only
  When Semantic Diff evaluates review-risk rules
  Then unsupported evidence remains explicit
  And no zero-run or calculated-run-removed confirmation is emitted

Scenario: Supported and unsupported schedule evidence are mixed
  Given a matched jobnet has at least one supported schedule pair
  And it also has unsupported or uncalculated schedule evidence
  When Semantic Diff evaluates review-risk rules
  Then confirmations are derived only from the supported pair projection
  And the unsupported evidence remains explicit
```

## Architecture

- Domain: evaluate supported before/after definition evidence and return
  review-risk decisions without presentation wording or runtime probes.
- Application: map domain decisions into the structured Semantic Diff result
  contract owned by `semantic-diff-structured-outputs`, including targets,
  rationale, related targets, and constraints. The imported contract owns the
  nine reason values, Full/Audit/JSON mappings, and final collection ordering;
  this feature only supplies rule decisions.
- Presentation: consume the supplied review recommendations without
  re-evaluating JP1/AJS rules, changing reason codes, sorting by localized
  prose, or strengthening them into failure claims.
- Infrastructure: no new runtime-environment lookup; parser-normalized values
  remain the only evidence source for this feature.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: Semantic
  Diff evidence evaluation, schedule comparison evidence, structured result
  mapping, report rendering/flow-highlight consumers, focused evidence and
  contract tests, and the durable Build Semantic Diff use case at Feature
  Exit if delivered behavior changes its current contract.
- Propagation decision: rule evaluation and structured mapping must change
  together; comparison entry, identity matching, report modes, and viewer
  workflows remain unchanged.
- Feature dependency: planning must use the confirmation levels and neutral
  structured risk-result boundary settled by
  `semantic-diff-structured-outputs`. This feature owns rule inclusion and
  evidence, not that shared DTO schema.

### Breaking Change Analysis

- User-visible behavior: additional definition changes can appear as
  confirmation-required review items; existing confirmed changes,
  unsupported items, and limitations remain available.
- API/DTO/schema compatibility: no independent schema redesign is allowed.
  Additions must follow the preceding structured-output contract and preserve
  existing consumers or be explicitly replanned with that owning feature.
- VS Code/web extension compatibility: the pure comparison result remains
  host-neutral and browser-safe; desktop and web hosts must receive equivalent
  recommendations for the same inputs.
- Changed scenarios: start-opportunity removal, supported schedule loss,
  external wait-target change, and execution-user-type/resource-group change
  are expanded; unsupported schedule evidence remains non-conclusive.

### Alternative Considerations

- Report every topology change as risky: rejected because missing
  predecessors, missing successors, disconnection, and jobnet-start
  parallelism do not establish a start failure.
- Probe hosts, accounts, files, events, or resource groups: rejected because
  Semantic Diff compares definitions and has no authoritative runtime or JP1
  authorization context.
- Add cycle and terminal-reachability analysis: rejected as separate graph
  semantics outside proposal E-2 and the durable use-case boundary.
- Define a new risk DTO in this feature: rejected because the preceding
  structured-output feature owns the neutral result and confirmation taxonomy.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: cycle or terminal-reachability rules,
  new schedule interpretation semantics, effective unit-attribute inheritance
  or profile resolution, runtime/environment/authorization probes, a new
  structured-output schema, identity changes, or changes to comparison entry
  and presentation workflows.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve pure, browser-safe domain and
  application evaluation with no Node built-ins or desktop-only probes.
- Desktop extension compatibility: use the same normalized inputs and result
  contract as web; do not make desktop-only environment checks.
- JP1/AJS compatibility: preserve the cited version 13 `EU`/`GR` basis and
  make unsupported, invalid, inherited-context, or unreferenced semantics
  explicit rather than inferred.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Existing confirmation-required decisions remain covered by regression tests.
- Supported start-opportunity removal and supported schedule loss produce
  deterministic review recommendations backed by definition evidence.
- Supported wait target/release/timeout changes retain runtime and external
  constraints appropriate to the evidence.
- Valid effective `eu` execution-user-type and raw JP1-resource-group changes
  recommend review without asserting runtime failure or effective
  authorization. Unit-type defaults are applied only by the closed matrix;
  absent values with equal defaults do not create a confirmation, while raw
  absent values remain visible in detail.
- Unsupported, uninterpretable, or uncalculated evidence never becomes a
  definitive no-start, wait-failure, permission, authorization, or
  resource-failure claim. Schedule confirmations require supported pair
  evidence; mixed evidence preserves both the supported decision and the
  unsupported records.
- Plain topology changes, cycle-only concerns, and terminal-reachability-only
  concerns do not create review recommendations under this feature.
- Desktop and web comparison results remain equivalent for the same inputs.

## Non-Goals

- Detecting relation cycles, cyclic waits, or terminal-unit reachability.
- Expanding schedule interpretation, projection, calendar, schedule
  inheritance, 48-hour, cycle, shift, or closed-day semantics; resolving
  JP1/AJS unit-attribute inheritance or effective profiles.
- Verifying runtime history, external files or events, hosts, permissions,
  user accounts, user mapping, effective JP1 resource-group authorization, or
  resource contention.
- Owning or redesigning confirmation levels, structured JSON/report schemas,
  report modes, identity matching, the Semantic Diff Explorer, or comparison
  source workflow.
- Converting review recommendations into diagnostics, errors, release gates,
  or automatic pass/fail decisions.

## Open Questions

- None for intake. Planning remains dependent on the settled
  `semantic-diff-structured-outputs` contract.
