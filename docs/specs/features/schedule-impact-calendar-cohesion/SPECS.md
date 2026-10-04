# Feature Specification: Schedule Impact Calendar Cohesion

## Purpose

Reduce presentation fragmentation in the schedule-impact calendar while
preserving its read-only review workflow. Keep cohesive rendering and local
helpers with their semantic owner, retaining independent boundaries when they
earn React, interaction, accessibility, state, reuse, test, or complexity value.

## Source

- Kind: roadmap feature; slug: `schedule-impact-calendar-cohesion`.
- [Roadmap](../../roadmap.md#internal-architecture-refactoring-sequence), item 1.
- [Present Schedule Impact](../../../requirements/use-cases/uc-present-schedule-impact.md)
  owns the observable behavior contract.
- [Architecture](../../architecture.md#solution-shape) owns layer and abstraction
  rules. JP1/AJS3 version 13 remains the normative semantics target; this feature
  changes presentation organization only and introduces no schedule semantics.

## Requirements and acceptance

- R1: Co-locate or merge presentation-only wrappers and single-consumer helpers
  that lack an independent boundary value. Review each candidate against the
  roadmap criteria; reducing file count alone is not acceptance. The plan must
  identify removed boundaries and justify retained candidates.
- R2: Preserve section order, period, source facts, IDs, date/run ordering,
  before/after details, root outcomes, valid no-runs, issues, scope transitions,
  identity candidates, and global/visible counts. Independent root, outcome,
  and run-state filters remain conjunctive.
- R3: Preserve accessible names, list semantics, announcements, keyboard and
  focus behavior, bounded rendering, virtualization thresholds, and access to
  large result sets. Preserve theme, high contrast, reduced motion, zoom,
  Japanese labels, and English fallback. Render raw values through React text.
- R4: Keep the presentation owner and existing application/host contracts.
  Require zero-exception architecture validation and behavior regression
  evidence for the selected implementation boundary.

## Decisions and impact

- Candidate surface is
  `src/presentation/webview/editor/scheduleImpactCalendar/` and its nearest
  presentation tests. Exact paths and consolidation choices belong to planning.
- `ScheduleImpactCalendarSections` forwards model/labels into ordered sections;
  `ScheduleImpactCalendarSectionBody` has one production consumer and selects
  an empty state or bounded list. These are discovery candidates, not an
  approved merge design.
- `ScheduleImpactCalendarResultSection` is reused by candidate, issue, and root
  sections. Bounded-list and timeline helpers own hooks, navigation, rendering,
  and virtualization; assess those responsibilities before changing boundaries.
- Shared result components, model projection, focus/accessibility utilities,
  and app/bridge lifecycle remain existing owners. Their behavior and contracts
  are constraints, not additional refactoring outcomes.
- No durable use-case, README, or CHANGELOG change is expected for a behavior-
  preserving internal refactor. Feature Exit must evaluate roadmap completion
  and any necessary reusable architecture knowledge without duplicating policy.

## Compatibility

- Preserve `engines.vscode` `^1.75.0`, desktop and web support, browser-safe
  production imports, existing React/MUI/Virtuoso capabilities, and layering.
- Preserve immutable schedule projection and transport/session contracts.
  Do not calculate schedules, convert source times using the host timezone,
  load calendars, or mutate comparison results.
- All other extension workflows and telemetry remain unchanged.

## Non-goals

- New schedule forms, external calendars, domain/model readonly migration,
  architecture-test restructuring, shared result redesign, UI redesign, new
  abstraction/framework, dependency changes, or performance algorithm changes.
- Refactoring Explorer host, transport, application projection, parser,
  bootstrap, telemetry, or unrelated calendar modules for independent outcomes.

## Open questions

None at intake. Candidate boundaries and exact implementation scope require a
reviewed plan before Human Approval.
