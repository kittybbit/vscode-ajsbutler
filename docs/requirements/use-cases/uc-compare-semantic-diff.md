# UC: Build Semantic Diff

## Goal

Compare two JP1/AJS3 job-group definitions by JP1/AJS meaning so reviewers can
see structural, execution-condition, wait-condition, and schedule-impact
changes without relying on raw text diff.

## Trigger

The user requests semantic comparison between a before definition and an after
definition for the same review scope.

## Inputs

- before JP1/AJS3 job-group definition
- after JP1/AJS3 job-group definition
- comparison options, including comparison period when schedule comparison is
  in scope
- normalized jobnet, unit, relation, parameter, and schedule data available
  from the repository parser/normalization path

## Outputs

- semantic change set for jobnets, units, relations, execution attributes,
  conditions, waits, and schedules
- confirmed and candidate rename or move matches with decision rationale
- confirmation-required items with target, change content, rationale, related
  elements where known, and analysis constraints
- unsupported attributes, uninterpretable conditions, uncalculated schedules,
  and their reasons
- Markdown report suitable for pull requests, change-control records, and
  release approval material

## Rules

- comparison scope is a job group
- definition-file order differences do not produce semantic changes by
  themselves
- JP1/AJS definitions are not assumed to contain stable persistent identifiers
  across compared files
- identity matching is deterministic for the same inputs
- similarity scores alone must not confirm identity
- multiple possible candidates must remain candidates rather than being
  auto-selected
- jobnet exact identity uses job-group-relative full path plus element type
- unit exact identity uses parent jobnet full path, unit name, and unit type
- unit name alone is not enough to confirm identity
- relation comparison is performed after unit correspondence has been
  determined
- execution command, execution file, arguments, host, user, queue, and resource
  group are compared as attributes, not exact-match identity keys
- identity fingerprints include only attributes expected to remain stable for
  rename or move detection
- a rename or move is auto-confirmed only when the fingerprint and unit type
  match one unmatched before unit and one unmatched after unit
- fingerprint-changing rename or move scenarios are initially shown as delete
  and add unless a later approved feature introduces manual correspondence
- confirmation-required items are limited to changes that may prevent an
  expected start, remove or tighten a previously available condition, leave a
  wait unresolved, remove a timeout, or change a previously established branch
  path
- missing predecessors, missing successors, disconnected relations, or
  jobnet-start parallelism are not problems by themselves
- runtime facts outside the compared definitions, such as external files,
  events, host permissions, users, resource groups, resource contention, and
  execution history, are not verified by standard semantic comparison
- unsupported or uncalculated portions must be visible in the comparison result
  and report
- relation cycles, cyclic waits, and terminal reachability-only judgments are
  out of scope unless a separate approved feature changes that boundary

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Build semantic diff

Scenario: Reordered definitions do not create semantic changes
  Given two JP1/AJS3 definitions contain the same jobnets, units, relations,
    and attributes
  And only their definition-file order differs
  When the semantic diff is built
  Then the change set contains no semantic changes

Scenario: Unit exact identity does not use unit name alone
  Given the before definition contains a unit named "LOAD" under one jobnet
  And the after definition contains a unit named "LOAD" under another jobnet
  When the semantic diff is built
  Then the units are not confirmed as the same unit by name alone

Scenario: One-to-one fingerprint match confirms a rename
  Given one unmatched before unit and one unmatched after unit share the same
    unit type and identity fingerprint
  When the semantic diff is built
  Then the result confirms a rename or move
  And the result includes the matching rule, matched attributes, changed
    attributes, and decision status

Scenario: Multiple fingerprint matches remain candidates
  Given unmatched units share the same identity fingerprint
  And more than one candidate exists on either side
  When the semantic diff is built
  Then no single candidate is automatically selected
  And the result explains why the candidates are ambiguous

Scenario: Changed start condition is confirmation-required
  Given a relation condition previously allowed unit B to start after unit A
  And the after definition changes the condition so the previous path is no
    longer available
  When the semantic diff is built
  Then the result includes a confirmation-required item for B
  And the result states the comparison does not verify runtime history or
    external conditions

Scenario: Timeout removal is confirmation-required
  Given a wait unit has a timeout in the before definition
  And the after definition removes that timeout
  When the semantic diff is built
  Then the result includes a confirmation-required item for possible unbounded
    wait

Scenario: Execution environment changes are not asserted as failures
  Given a unit changes execution user or resource group
  When the semantic diff is built
  Then the result displays an execution-environment change
  And the result states that target-host users, permissions, resource group
    existence, and resource contention are not verified

Scenario: Schedule comparison reports no generated runs
  Given schedule comparison is requested for a period
  And a root jobnet no longer has any calculated run schedule in that period
  When the semantic diff is built
  Then the result includes a confirmation-required schedule item
  And the result displays the comparison period
```

## Acceptance Notes

- JP1/AJS3 version 13 is the normative target for new parameter, relation,
  condition, wait, event, and schedule semantics unless a feature slice records
  a narrower source reference.
- Comparison logic should be usable from desktop and web hosts through
  application DTOs and host-specific adapters.
- Markdown report output should preserve enough rationale for review without
  requiring users to inspect parser internals.
- Flow-view highlighting, when added, should consume semantic diff DTOs rather
  than re-implementing comparison rules in presentation code.
- Schedule comparison must display the comparison period and must distinguish
  supported schedule elements from uncalculated or unsupported elements.

## Risks Or Edge Cases

- JP1/AJS schedule semantics are broad and should be introduced through a
  deliberately narrow, reference-backed supported set.
- Unit fingerprint fields can over-match or under-match if manual-dependent
  attributes are chosen without enough JP1/AJS evidence.
- Large job groups may expose performance issues if unmatched-element matching
  is implemented with unnecessary repeated scans.
- External files, events, users, permissions, resource groups, and runtime
  history can change real outcomes, so user-facing language must avoid
  asserting failures from definition comparison alone.
