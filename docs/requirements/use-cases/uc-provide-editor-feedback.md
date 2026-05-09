# UC: Provide Editor Feedback

## Goal

Provide diagnostics and hover information for JP1/AJS documents without
embedding VS Code object construction inside parser-adjacent business logic.

## Trigger

- a JP1/AJS document is opened or changed
- the user requests hover information over a JP1/AJS token

## Inputs

- raw JP1/AJS document text
- current editor language for localized hover content
- hovered token text

## Outputs

- application-level diagnostic DTOs with positions and messages
- application-level hover DTOs with symbol and syntax information

## Rules

- domain and application layers must not construct `vscode.Diagnostic`,
  `vscode.Hover`, `vscode.Range`, or `vscode.MarkdownString`
- VS Code adapters map DTOs into editor-specific objects
- existing parser syntax diagnostic messages and hover syntax content must
  remain unchanged
- semantic parameter diagnostics must preserve raw parsed data and report
  focused JP1/AJS3 version 13 rule violations without changing parser output

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Provide editor feedback

Scenario: Invalid JP1/AJS text produces diagnostics
  Given a JP1/AJS document containing invalid syntax
  When editor feedback is requested
  Then application-level diagnostic DTOs are returned

Scenario: Parameter hover returns syntax information
  Given a JP1/AJS document with a recognized parameter token
  When hover information is requested for that token
  Then application-level hover DTOs include the same syntax information

Scenario: VS Code objects stay outside application output
  Given JP1/AJS editor feedback output
  When diagnostics and hover data are produced
  Then the application output does not construct VS Code API objects

Scenario: Invalid parameter combinations produce semantic diagnostics
  Given a syntactically valid JP1/AJS document
  And the document contains a parameter combination that violates an explicit
    JP1/AJS3 version 13 rule
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Invalid file monitoring condition combinations produce diagnostics
  Given a syntactically valid JP1/AJS document with a file monitoring job
  And `flwc` specifies both size-change and modification-time monitoring
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: File existing-condition output requires creation monitoring
  Given a syntactically valid JP1/AJS document with a file monitoring job
  And `flco` is specified while the effective `flwc` value does not include
    file-creation monitoring
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Retry parameters require automatic retry
  Given a syntactically valid JP1/AJS document with a UNIX/PC job
  And `rjs`, `rje`, `rec`, or `rei` is specified while effective `abr` is not
    automatic retry enabled
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Job end-judgment numeric values must stay within documented ranges
  Given a syntactically valid JP1/AJS document with a UNIX/PC job
  And explicit `wth` or `tho` is outside the JP1/AJS3 v13 range
    `0..2147483647`
  Or explicit `rjs` or `rje` is outside the JP1/AJS3 v13 range
    `1..4294967295`
  Or explicit `rec` is outside the JP1/AJS3 v13 range `1..12`
  Or explicit `rei` is outside the JP1/AJS3 v13 range `1..10`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Job end-judgment thresholds must preserve warning-to-abnormal order
  Given a syntactically valid JP1/AJS document with a UNIX/PC job
  And effective `jd` is judgment by threshold
  And explicit `wth` and `tho` do not preserve the documented warning-to-
    abnormal threshold ordering
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Schedule-rule values must stay within documented ranges
  Given a syntactically valid JP1/AJS document with a jobnet
  And explicit `ln`, `st`, `cy`, `shd`, `cftd`, `sy`, `ey`, `wc`, or `wt`
    is outside the JP1/AJS3 v13 schedule-rule ranges
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Weekly schedule cycles must not use open-day or closed-day dates
  Given a syntactically valid JP1/AJS document with a jobnet
  And explicit `cy=(n,w)` is specified for a schedule rule
  And the matching `sd` rule for that schedule rule uses open-day or
    closed-day scheduling semantics
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Schedule-rule execution-start dates must stay within documented rule
  and day ranges
  Given a syntactically valid JP1/AJS document with a jobnet
  And explicit `sd` uses a schedule rule number outside `1..144`
  Or explicit `sd` uses a documented day form with a day value outside the
    JP1/AJS3 v13 allowed range
  Or explicit `sd` uses a year outside `1994..SCHEDULELIMIT`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event arrival check requires an event destination host
  Given a syntactically valid JP1/AJS document with a JP1 event sending job
  And effective `evsrt` is event-arrival checking enabled
  And `evhst` is omitted
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event arrival check values must stay within documented ranges
  Given a syntactically valid JP1/AJS document with a JP1 event sending job
  And explicit `evspl` is outside the JP1/AJS3 v13 range `3..600`
  Or explicit `evsrc` is outside the JP1/AJS3 v13 range `0..999`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event sending event IDs must stay within documented hexadecimal ranges
  Given a syntactically valid JP1/AJS document with a JP1 event sending job
  And explicit `evsid` is outside the JP1/AJS3 v13 hexadecimal ranges
    `00000000..00001FFF` and `7FFF8000..7FFFFFFF`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event reception monitoring search scope must stay within documented
  values
  Given a syntactically valid JP1/AJS document with a JP1 event reception
    monitoring job
  And explicit `evesc` is neither `no` nor within the JP1/AJS3 v13 range
    `1..720`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event reception monitoring identifiers must stay within documented
  formats
  Given a syntactically valid JP1/AJS document with a JP1 event reception
    monitoring job
  And explicit `evwid` is outside the JP1/AJS3 v13 hexadecimal event-ID
    format and range `00000000:00000000` to `FFFFFFFF:FFFFFFFF`
  Or explicit `evipa` is outside the JP1/AJS3 v13 IPv4 dotted-decimal range
    `0.0.0.0` to `255.255.255.255`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event reception monitoring numeric identifiers must stay within
  documented ranges
  Given a syntactically valid JP1/AJS document with a JP1 event reception
    monitoring job
  And explicit `evuid`, `evgid`, or `evpid` is outside the JP1/AJS3 v13
    signed-decimal range `-1..9999999999`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event reception monitoring string filters must stay within documented
  explicit forms
  Given a syntactically valid JP1/AJS document with a JP1 event reception
    monitoring job
  And explicit `evusr`, `evgrp`, `evwms`, or `evdet` is outside that
    parameter's JP1/AJS3 v13 byte-length range
  Or explicit `evwfr` is outside the documented
    `optional-extended-attribute-name:"value"` form or total byte-length
    range
  Or explicit `evtmc` is outside the documented allowed forms or file-name
    byte-length range
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event reception monitoring timeout controls must preserve documented
  values and start-condition rules
  Given a syntactically valid JP1/AJS document with a JP1 event reception
    monitoring job
  And explicit `etm` is outside the JP1/AJS3 v13 range `1..1440`
  Or explicit `ha` is outside the JP1/AJS3 v13 value set `{y|n}`
  Or explicit `ets` is outside the JP1/AJS3 v13 value set
    `{kl|nr|wr|an}`
  Or explicit `etm`, `ha`, or `ets` is specified on a job defined in a
    start-condition context
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event host values must stay within documented byte-length rules
  Given a syntactically valid JP1/AJS document with a JP1 event sending job
    or JP1 event reception monitoring job
  And explicit `evhst` is outside the JP1/AJS3 v13 byte-length range
    `1..255`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Event timeout actions must stay within documented values
  Given a syntactically valid JP1/AJS document with a file monitoring job or
    execution-interval control job
  And explicit `ets` is outside the JP1/AJS3 v13 value set
    `{kl|nr|wr|an}`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Execution-interval control job values must stay within documented
  ranges
  Given a syntactically valid JP1/AJS document with an execution-interval
    control job
  And explicit `tmitv` is outside the JP1/AJS3 v13 range `1..1440`
  Or explicit `etn` is outside the JP1/AJS3 v13 value set `{y|n}`
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Execution-interval control end timing must preserve documented
  context rules
  Given a syntactically valid JP1/AJS document with an execution-interval
    control job
  And explicit `etn=y` is specified
  And the surrounding execution-interval context violates the documented
    JP1/AJS3 v13 start-condition restriction
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Shared filename-like rules stay explicit across parameter families
  Given a syntactically valid JP1/AJS document with a parameter family that
    uses documented filename-like or host-like values
  And an explicit value is outside that family's JP1/AJS3 v13 byte-length or
    invalid-combination rule
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Transfer-file parameters must use documented explicit string forms
  Given a syntactically valid JP1/AJS document with a UNIX/PC job,
    UNIX/PC custom job, QUEUE job, or recovery QUEUE job
  And explicit `tsN` or `tdN` uses a bare string that is neither a quoted
    transfer-file value nor an accepted macro-variable form
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Transfer-file parameters must preserve documented shared
  filename/path constraints
  Given a syntactically valid JP1/AJS document with a UNIX/PC job,
    UNIX/PC custom job, QUEUE job, or recovery QUEUE job
  And explicit `tsN` or `tdN` uses a quoted transfer-file value
  And that value violates a JP1/AJS3 v13 filename/path rule that is shared
    across the approved transfer-file family scope
  When editor feedback is requested
  Then application-level diagnostic DTOs include the semantic parameter violation
  And raw parser output remains available to downstream consumers

Scenario: Shared string diagnostics preserve documented macro-variable allowance
  Given a syntactically valid JP1/AJS document with a parameter family that
    explicitly allows macro-variable or regular-expression forms
  When editor feedback is requested
  Then application-level diagnostic DTOs do not reject the value only because
    it uses an allowed explicit string form
  And raw parser output remains available to downstream consumers
```

## Acceptance Notes

- desktop and web extension entry points continue to share the same
  application logic for diagnostics and hover decisions
- compatible-ISAM-specific semantic diagnostics require an explicit host or
  workspace configuration input because the JP1/AJS definition file alone does
  not identify the database mode

## Risks Or Edge Cases

- parser error positions must remain 1-based in application DTOs until
  the VS Code adapter maps them to 0-based positions
- hover behavior still depends on the active UI language passed in from
  the VS Code environment
