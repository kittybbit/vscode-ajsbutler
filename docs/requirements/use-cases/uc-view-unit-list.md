# UC: View Unit List

## Goal

Show a deterministic, navigable list of JP1/AJS units from a local or imported
definition while keeping parsing and domain interpretation outside the table
presentation.

## Trigger

- the user opens or refreshes the JP1/AJS table viewer

## Inputs

- local or imported JP1/AJS definition content
- current localization context for user-visible labels and formatting

## Outputs

- visible unit rows with stable identity, hierarchy, order, and unit metadata
- parse or normalization errors when the definition cannot be listed safely
- metadata needed for definition display, list-to-flow navigation, and CSV
  export

## Rules

- parsing and normalization stay behind the application boundary
- list output uses stable application-facing data and does not expose parser,
  wrapper, webview, or table-framework types
- the same definition and state produce the same visible units and ordering
- desktop and web viewers consume the same application-facing list shape
- filtering, table-framework integration, and purely visual formatting remain
  presentation responsibilities
- raw parameter evidence remains distinguishable from effective values
- displayed effective parameter values come from
  [Interpret JP1 Parameters](../domain-rules/interpret-jp1-parameters.md)
- row and field meaning used by CSV export remains stable unless a separate
  behavior change is approved

## Behavioral Scenarios

```gherkin
Feature: View unit list

Scenario: Valid input produces deterministic visible units
  Given a valid JP1/AJS definition
  When the unit list is opened
  Then root and nested units are shown in deterministic order

Scenario: Invalid input reports errors without a partial list
  Given an invalid JP1/AJS definition
  When the unit list is opened
  Then parse or normalization errors are returned
  And a partial list is not presented as a complete result

Scenario: Representative encodings remain supported
  Given a representative UTF-8 or Shift_JIS JP1/AJS definition
  When the unit list is opened
  Then the expected unit content is shown

Scenario: List rows support related user actions
  Given a visible unit row
  When definition, flow-navigation, or CSV behavior needs its metadata
  Then stable application-facing metadata is available for that action

Scenario: Desktop and web viewers share list behavior
  Given the same JP1/AJS definition
  When desktop and web viewers open the unit list
  Then both can consume the same application-facing result

Scenario: Effective schedule monitoring values are displayed
  Given interpreted schedule values under JP1-PARAM-SCHEDULE-WC-WT-001
  When the unit list displays start-condition monitoring
  Then it displays the effective count and time returned by that rule

Scenario: Wait timeout-action defaults are displayed
  Given interpreted wait-job values under JP1-PARAM-WAIT-ETS-DEFAULT-001
  When the unit list displays the timeout action
  Then it displays the effective value returned by that rule

Scenario: Unit-family defaults are displayed
  Given interpreted values under the supported event, file-monitoring, or
    interval-control default rule
  When the unit list displays the corresponding fields
  Then omitted values use the effective JP1/AJS3 version 13 defaults
  And explicit values remain visible

Scenario: QUEUE transfer fields use the supported parameter set
  Given interpreted QUEUE values under JP1-PARAM-TRANSFER-QUEUE-OPERATION-001
  When the unit list displays transfer fields
  Then transfer source and destination values are displayed
  And transfer operation values are not displayed for QUEUE jobs
```

## Acceptance Notes

- definition display, list-to-flow navigation, filtering, and CSV export
  continue to work from stable application-facing list metadata
- representative fixtures should cover UTF-8, Shift_JIS, and large definitions

## Risks Or Edge Cases

- normalization or interpretation drift can change visible values even when
  the table presentation is unchanged
- large definitions must remain listable without moving filtering concerns into
  the use case
- missing source or parameter evidence must not be invented for display
