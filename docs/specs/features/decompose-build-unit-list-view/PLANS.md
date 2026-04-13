# PLANS: decompose-build-unit-list-view

## Objective

Make `buildUnitListView.ts` reviewable and lower-risk by decomposing its row
projection logic into focused application helpers while preserving behavior.

## Scope

- `src/application/unit-list/buildUnitListView.ts`
- new helper modules under `src/application/unit-list/`
- focused regression tests for extracted projection families
- sync updates to `docs/specs/plans.md` and, if priorities change,
  `docs/specs/roadmap.md`

## Risks To Control

- Silent drift in `UnitListRowView` field values or optionality
- Regressions in inherited priority behavior for jobnet and job rows
- Regressions in schedule-oriented array shaping for `group10`
- Over-extraction that only moves parameter lookups without clarifying
  projection ownership

## Slice Strategy

1. Document the decomposition boundary and slice order
2. Extract one projection family at a time behind the existing
   `buildUnitListView(...)` entry point
3. Add or update focused tests for that family
4. Run the full serial validation baseline for code slices
5. Re-sync feature `TASKS.md`, branch `plans.md`, and `roadmap.md`

## Current Status

- 2026-04-12: `buildUnitListView.ts` is about 617 lines and still combines
  row traversal, linked-unit projection, calendar shaping, priority lookup,
  schedule parsing, and direct group DTO assembly in one function.
- 2026-04-12: existing feature docs for `build-unit-list-view` describe the
  delivered use case, but they do not yet track decomposition slices or
  extraction-specific risks.
- 2026-04-12: existing tests already cover a broad end-to-end row projection,
  which is a stable baseline for behavior-preserving extraction.
- 2026-04-12: the first extraction slice is now `group6`; it is small,
  DTO-shaped, and already anchored in existing helper behavior for calendar
  weekday parsing.

## Proposed Slice Order

1. Calendar projection helper extraction
   Status: completed
   Notes: `group6` now builds through a dedicated helper module while keeping
   the `UnitListRowView` shape unchanged for table and CSV consumers.
2. Priority projection helper extraction
   Status: proposed
   Notes: `group7` and `group11` share the caching and inheritance behavior,
   so one focused helper can narrow the remaining branching in the main file.
3. Schedule projection helper extraction
   Status: proposed
   Notes: `group10` is the densest projection family and should move only
   after the lighter extractions establish the pattern.
4. Shared row context and linked-unit projection extraction
   Status: proposed
   Notes: the `previousUnits`/`nextUnits` logic is self-contained but touches
   relation traversal, so it should follow once the helper layout is settled.
5. Remaining direct group projections
   Status: proposed
   Notes: keep these grouped by DTO concern; avoid one-file-per-group if that
   would create mechanical sprawl without clarifying ownership.

## Validation

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
