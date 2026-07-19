# UC: Build Semantic Diff

## Goal

Compare two JP1/AJS3 job-group definitions by JP1/AJS meaning so consumers can
review structural, execution-condition, wait-condition, and schedule-impact
changes without relying on raw text differences.

## Trigger

- semantic comparison is requested between a before definition and an after
  definition for the same review scope

## Inputs

- before and after JP1/AJS3 job-group definitions
- normalized jobnet, unit, relation, parameter, and schedule data
- comparison options, including a comparison period when schedule comparison
  is requested

## Outputs

- added, removed, and changed jobnets, units, relations, execution attributes,
  conditions, waits, and schedules
- confirmed and candidate rename or move matches with decision rationale
- confirmation-required items with target, change, rationale, related elements,
  and analysis constraints
- unsupported attributes, uninterpretable conditions, uncalculated schedules,
  and their reasons

## Rules

- comparison scope is a job group
- definition-file order differences do not produce semantic changes by
  themselves
- compared definitions are not assumed to contain stable persistent identifiers
- identity matching is deterministic for the same inputs
- similarity scores alone do not confirm identity
- multiple possible matches remain candidates rather than being auto-selected
- jobnet exact identity uses job-group-relative full path and element type
- unit exact identity uses parent jobnet full path, unit name, and unit type
- unit name alone does not confirm identity
- relation comparison occurs after unit correspondence is determined
- execution command, file, arguments, host, user, queue, and resource group are
  compared attributes rather than exact-match identity keys
- identity fingerprints contain only attributes expected to remain stable for
  rename or move detection
- rename or move is confirmed automatically only when one unmatched unit on
  each side has the same fingerprint and unit type
- fingerprint-changing rename or move remains delete and add unless a separate
  approved feature introduces manual correspondence
- confirmation-required items are limited to changes that may prevent an
  expected start, remove or tighten a previously available condition, leave a
  wait unresolved, remove a timeout, or change an established branch path
- missing predecessors, missing successors, disconnected relations, and
  jobnet-start parallelism are not problems by themselves
- external files, events, host permissions, users, resource groups, resource
  contention, and execution history are not verified
- unsupported and uncalculated portions remain explicit in the result
- relation cycles, cyclic waits, and terminal-reachability-only judgments are
  outside the supported comparison boundary
- schedule comparison displays its period and distinguishes supported,
  unsupported, and uncalculated elements
- JP1/AJS3 version 13 is normative unless an approved feature records a narrower
  reference-backed scope

## Behavioral Scenarios

```gherkin
Feature: Build semantic diff

Scenario: Reordered definitions do not create semantic changes
  Given two definitions contain the same semantic elements and attributes
  And only definition-file order differs
  When semantic diff is built
  Then the change set contains no semantic changes

Scenario: Unit name alone does not establish identity
  Given a before unit and an after unit share a name under different jobnets
  When semantic diff is built
  Then they are not confirmed as the same unit by name alone

Scenario: One-to-one fingerprint match confirms a rename or move
  Given one unmatched unit on each side shares a unit type and fingerprint
  When semantic diff is built
  Then rename or move is confirmed
  And the rule, matched attributes, changes, and decision status are included

Scenario: Multiple fingerprint matches remain candidates
  Given more than one unmatched candidate shares a fingerprint
  When semantic diff is built
  Then no single candidate is automatically selected
  And the ambiguity rationale is included

Scenario: Tightened start condition requires confirmation
  Given a previous relation condition allowed a unit to start
  And the after definition removes that available path
  When semantic diff is built
  Then the result includes a confirmation-required item
  And it states that runtime history and external conditions are not verified

Scenario: Removed timeout requires confirmation
  Given a wait has a timeout in the before definition
  And the after definition removes it
  When semantic diff is built
  Then possible unbounded wait is confirmation-required

Scenario: Execution-environment changes are not asserted as failures
  Given an execution user or resource group changes
  When semantic diff is built
  Then the execution-environment change is included
  And target-host facts and resource contention are stated as unverified

Scenario: Schedule comparison reports no calculated runs
  Given schedule comparison is requested for a period
  And a schedule-defined jobnet has no calculated run in that period
  When semantic diff is built
  Then the result includes a confirmation-required schedule item
  And the comparison period is included
```

## Acceptance Notes

- comparison results remain usable from desktop and web hosts through stable
  application-facing data
- future flow highlighting consumes semantic-diff results rather than
  reimplementing comparison rules

## Risks Or Edge Cases

- fingerprints can over-match or under-match when their fields lack enough
  JP1/AJS evidence
- broad schedule semantics require a deliberately narrow, reference-backed
  supported set
- large job groups can expose avoidable repeated-scan performance risks
- user-facing consumers must not turn definition-only evidence into assertions
  about runtime failure
