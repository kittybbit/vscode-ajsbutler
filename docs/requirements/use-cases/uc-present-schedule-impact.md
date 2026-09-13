# UC: Present Schedule Impact

## Goal

Present the supported schedule effects from one completed Semantic Diff
comparison as a read-only, date-grouped timeline for the selected half-open
period.

## Trigger

- a completed comparison has an evaluated schedule period
- the reviewer selects `Schedule impact` in Semantic Diff Explorer

## Inputs

- the immutable comparison context and its host-private schedule-impact
  projection
- the inherited display language (`ja` or an English fallback)
- optional root, root-outcome, and run-state filters

## Outputs

- the exact comparison period, supported runs, and unchanged/added/removed or
  changed-time effects grouped by date
- root outcomes, valid no-runs, partial or uncalculated schedule portions,
  scope-transition labels, and identity candidate groups
- visible and global counts, with keyboard and screen-reader accessible names

## Responsibility Boundary

- Schedule impact projection owns schedule facts, stable IDs, source
  references, and ordering.
- Explorer host owns context identity, action membership, child session, and
  lifecycle.
- Schedule impact view owns localization, filtering, focus, announcements, and
  bounded rendering.

The view does not recalculate schedules, infer an outcome from an empty run
list, load external calendars, or mutate comparison results.

## Rules

- the action is available only when the comparison workflow supplied a valid
  evaluated period
- an omitted period leaves the ordinary Explorer available and does not create
  a calendar action or child panel
- root selection, root outcome, and run-state filters remain separate and are
  applied conjunctively
- scope transitions remain visible as metadata and are not run states
- dates and times retain their source representation; the view does not apply
  host timezone conversion
- English is the fallback for unknown display languages, while facts, IDs,
  order, and counts are unchanged by localization
- large result sets use bounded rendering while retaining exact counts and
  keyboard access to the visible viewport

## Behavioral Scenarios

```gherkin
Feature: Present schedule impact

Scenario: Valid period opens the schedule timeline
  Given a completed comparison with an evaluated half-open period
  When the reviewer selects Schedule impact
  Then one child schedule-impact session opens or is revealed
  And the timeline retains the projection's period, IDs, order, and facts

Scenario: No period keeps the calendar unavailable
  Given a comparison without a selected period
  When the comparison completes
  Then the ordinary Explorer opens
  And no schedule-impact action or child panel is created

Scenario: Independent filters are conjunctive
  Given roots with different outcomes and run states
  When the reviewer selects one root, one outcome, and one run state
  Then only entries matching all three selections are visible
  And global and visible totals remain distinct

Scenario: Unknown schedule portions remain explicit
  Given a partial or uncalculated root
  When the timeline is displayed
  Then supported runs remain visible
  And the issue section preserves the reason and side/root evidence

Scenario: Localization does not change facts
  Given the same projection and Japanese display language
  When the timeline is displayed
  Then labels and announcements are Japanese
  And IDs, dates, order, and counts match the English display
```

## Acceptance Notes

- the timeline is usable on desktop and web VS Code hosts
- high contrast, reduced motion, zoom, and keyboard focus preserve the same
  textual state information
- raw values are rendered through React text nodes and are not interpreted as
  markup
