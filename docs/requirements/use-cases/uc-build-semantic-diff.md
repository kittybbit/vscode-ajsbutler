# UC: Build Semantic Diff

## Goal

Compare two JP1/AJS3 job-group definitions by JP1/AJS meaning so consumers can
review structural, execution-condition, wait-condition, and schedule-definition
changes without relying on raw text differences. Return one host-neutral,
structured result that presentation adapters can project without changing the
comparison meaning.

## Trigger

- semantic comparison is requested between a before definition and an after
  definition for the same review scope

## Inputs

- before and after JP1/AJS3 job-group definitions
- normalized jobnet, unit, relation, parameter, and schedule data

## Outputs

- added, removed, and changed jobnets, units, relations, execution attributes,
  conditions, waits, and schedules
- confirmed and candidate rename or move matches with typed, deterministic
  decision evidence and rationale
- confirmation-required items with target, change, typed reason/detail,
  related elements, and analysis constraints
- unsupported attributes, uninterpretable conditions, and their typed
  reasons/details
- one host-neutral result containing the comparison facts, identity evidence,
  and definition changes; localized wording and report sections are not part
  of its meaning

## Rules

- comparison scope is a job group
- definition-file order differences do not produce semantic changes by
  themselves
- compared definitions are not assumed to contain stable persistent identifiers
- identity matching is deterministic for the same inputs
- similarity scores alone do not confirm identity
- multiple possible matches remain candidates rather than being auto-selected
- job-group (`g`/`mg`) exact identity uses the canonical scope-relative path,
  or the normalized full path when outside the selected scope, together with
  the unit type
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
- identity strategy selection is explicit and unit-type/form-specific:
  command-text (`j`/`rj` with `te`), executable-file (`j`/`rj`/`pj`/`rp`/`qj`/`rq`
  with `sc` and optional `prm`), event-reception (`evwj`/`revwj` selectors),
  and file-monitor (`flwj`/`rflwj` file and effective condition) strategies
  are supported; recovery counterparts retain their distinct unit type
- strategy evidence preserves canonical field presence and values in a
  deterministic order, including sorted repeated event filters and the
  effective file-monitor condition default
- unsupported, missing, duplicate, mixed, or malformed forms use the existing
  all-parameter fallback representation and do not broaden automatic matches
  without reference-backed support
- each unit identity outcome exposes either its exact identity key or its
  fingerprint strategy, unit type, and canonical fields; ambiguous decisions
  retain every candidate in deterministic order, while a changed fingerprint
  remains an addition and a removal
- repeated job-group names at distinct canonical paths are matched exactly;
  duplicate canonical path/type keys remain conservative fingerprint
  candidates rather than being paired by definition order
- identity decisions are plain, host-neutral data and are not sent through
  telemetry or logging
- fingerprint-changing rename or move remains delete and add unless a separate
  approved feature introduces manual correspondence
- confirmation-required items are limited to changes that may prevent an
  expected start, remove or tighten a previously available condition, leave a
  wait unresolved, remove a timeout, or change an established branch path
- supported file or event wait-target changes, valid execution-user-type
  changes on applicable units, and raw JP1 resource-group changes are
  definition evidence for human review; they do not establish external
  runtime, account, permission, authorization, or contention failures
- missing predecessors, missing successors, disconnected relations, and
  jobnet-start parallelism are not problems by themselves
- external files, events, host permissions, users, resource groups, resource
  contention, and execution history are not verified
- unsupported portions remain explicit in the result
- parse failure remains distinct from a successful result and cannot be
  presented as an empty comparison
- the successful result is presentation-agnostic and can be projected into
  summary, full, audit, or locale-neutral structured output without rerunning
  comparison, identity matching, or risk evaluation
- relation cycles, cyclic waits, and terminal-reachability-only judgments are
  outside the supported comparison boundary
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

Scenario: External wait target changes require review without a runtime claim
  Given a supported file or event wait target changes
  When semantic diff is built
  Then the result includes a confirmation-required item with the changed
    target evidence
  And external files, events, hosts, permissions, and runtime history are
    stated as unverified

Scenario: Execution-environment changes are not asserted as failures
  Given an execution user type or raw JP1 resource group changes
  When semantic diff is built
  Then the execution-environment change is included
  And account, user mapping, target-host facts, authorization, and resource
    contention are stated as unverified

Scenario: One result supports multiple report projections
  Given a successful semantic comparison has produced structured facts
  When a consumer requests summary, full, audit, or JSON output
  Then every projection represents the same comparison facts and decisions
  And the comparison is not rerun
```

## Acceptance Notes

- comparison results remain usable from desktop and web hosts through stable
  application-facing data
- future flow highlighting consumes semantic-diff results rather than
  reimplementing comparison rules

## Risks Or Edge Cases

- fingerprints can over-match or under-match when their fields lack enough
  JP1/AJS evidence
- large job groups can expose avoidable repeated-scan performance risks
- user-facing consumers must not turn definition-only evidence into assertions
  about runtime failure
