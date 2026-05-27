# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local details live under
`docs/specs/features/<feature>/`; repository-level behavior contracts live
under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- JP1/AJS3 version 13 is the current normative target for new parameter and
  command semantics. The repository-supported parameter-alignment scope is now
  represented in use cases, so future manual-alignment work should start as a
  new focused feature only when it adds a supported parameter family, consumer,
  or product-version target.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Qlty-driven architecture refactoring has completed the flow-viewer
  component/layout and application orchestration phases and is starting
  domain-helper simplification one approved target at a time.
- Completed feature folders should be removed once their durable requirements
  are represented in `docs/requirements/use-cases/`, `docs/specs/roadmap.md`,
  or `docs/specs/architecture.md`.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
2. Complete Slice-3-D `PlainString.ts` `Ni.priority` cleanup after approval.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Active Feature Specs

- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.
- `docs/specs/features/qlty-driven-architecture-refactoring/`:
  active maintainability-driven architectural refactoring based on Qlty
  complexity, duplication, and code-smell findings. Slice-1A completed the
  presentation-local flow-viewer controller split; Slice-1B-A completed a
  presentation-local `AjsNode` styling extraction; Slice-1B-B completed a
  presentation-local `Header` extraction; Slice-1B-C completed a
  presentation-local `FlowSelector` extraction; Slice-1B-D completed a focused
  `applyGrowthOffsets` extraction; Slice-1B-E completed a focused
  `resolveSiblingSubtreeCollisions` extraction; Slice-1B-F completed a focused
  `resolveLowerExpandedPanelIntrusions` extraction; Slice-1B-G completed a
  focused `buildExpandedPanelBounds` extraction; Slice-1B-H completed a focused
  `getUpperExpandedPanelMaxRight` extraction; Slice-1B-I completed a focused
  `relayoutExpandedScope` extraction; Slice-1B-J completed a focused
  `isDescendantOf` extraction; Slice-1B-K completed a focused
  `syncAnchoredDescendantOverrides` extraction; Slice-1B-L completed a focused
  `appendExpandedUnitEdges` extraction; Slice-1B-M completed a focused
  `revealVisibleNestedUnit` extraction; Slice-1B-N completed a focused
  `getDisplayPositions` extraction; Slice-1B-O completed a focused
  `includeNodeBounds` extraction; Slice-1B-P completed a focused
  `addVisibleNode` extraction; Slice-1B-Q completed a focused
  `ensureVisibleNestedNode` extraction; Slice-1B-R completed a focused
  `applyGrowthOffsets` extraction; Slice-1B-S completed a focused
  `buildExpandedPanelBounds` extraction. Slice-1B-T scope revision is recorded
  because it did not lower Qlty total complexity. Slice-1B-U investigation is
  complete and the sibling-collision iteration helper extraction is complete.
  Slice-1B is complete. Slice-2-A completed the
  `buildUnitListLinkedUnits` linked-unit projection helper extraction.
  Slice-2-B completed the `getPriorityForUnitTypes` priority resolution helper
  extraction. Slice-2-C completed the `buildUnitListRemainingGroups` group
  projection helper extraction. Slice-2-D completed the
  `buildUnitListRemainingGroups` default-aware helper cleanup. Slice-2-E
  completed the `parseHashEscapedQuotedStringLiteralContent` string literal
  parser helper extraction. Slice-2-F completed the
  `isValidExplicitEventReceivingTimeoutCondition` timeout-condition helper
  extraction. Slice-2-G completed the
  `isValidExplicitEventReceivingFilterReference` filter-reference helper
  extraction. Slice-2-H completed the `isValidExplicitIpv4Address` IPv4
  validator helper extraction. Slice-2-I investigation is complete for the
  `hasInvalidWildcardWithShortMonitoringInterval` file monitoring helper
  extraction and implementation is complete. Slice-2-J investigation is
  complete for the `parseExplicitHexadecimalInRange` hexadecimal scalar helper
  extraction and implementation is complete. Slice-2-K investigation is
  complete for the `parseExplicitDecimalInRange` decimal scalar helper
  extraction and implementation is complete. Slice-2-L investigation is
  complete for the `argumentValue` command-builder helper extraction and
  implementation is complete. Slice-2-M investigation is complete for the
  `buildCommandLine` token-builder extraction and implementation is complete.
  Slice-2-N investigation is complete for command-builder unit-type choice
  extraction and implementation is complete. Slice-2-O investigation is
  complete for `toNiPriority` nice-value conversion extraction and
  implementation is complete. Slice-2-P investigation is complete for
  `buildCalendarWeekView` week-state extraction and implementation is
  complete. Slice-2-Q investigation is complete for `parseCftd`
  schedule-by-days projection helper extraction and implementation is
  complete. Slice-2-R investigation is complete for `parseSd` schedule-date
  projection helper extraction and implementation is complete. Slice-2-S
  investigation is complete for `buildUnitListGroup7View` supported-field
  projection helper extraction and implementation is complete. Slice-2-T
  investigation is complete for `getPriorityForUnitTypes` input grouping and
  implementation is complete. Slice-2-U investigation is complete for
  `buildExplicitByteLengthRule` input grouping and implementation is
  complete. Slice-2-V investigation is complete for
  `buildExplicitDecimalRangeRule` input grouping and implementation is
  complete. Slice-2-W investigation is complete for
  `isValidScheduleDateDayToken` day-token helper extraction and implementation
  is complete. Slice-2-X investigation is complete for
  `isValidExplicitScheduleDate` helper extraction and implementation is
  complete. Slice-2-Y investigation is complete for the remaining
  `syntaxDiagnosticScheduleRules.ts` smell/metric cluster and implementation
  is complete. Slice-2-Z is complete for the
  `syntaxDiagnosticScheduleRules.ts` residual smell/metric cluster. The next
  Slice-2-AA implementation is complete for the
  `syntaxDiagnosticRuleBuilders.ts` same-file high-complexity cluster. The
  final Slice-2-AB implementation is complete for
  `syntaxDiagnosticScalarValidators.ts` `parseExplicitDecimalInRange` input
  shaping. Slice-2 application orchestration work is closed. Slice-3-A
  completed `unitPriorityHelpers.ts` priority-resolution cleanup. Slice-3-B
  completed `unitGroupStateHelpers.ts` week-state cleanup. Slice-3-C completed
  `unitEdgeHelpers.ts` unit-edge parser cleanup. Slice-3-D investigation is
  complete for `PlainString.ts` `Ni.priority` cleanup and implementation is
  waiting for approval.

Completed feature-local folders were removed after their durable behavior
contracts were compressed into `docs/requirements/use-cases/`.

## Branch Validation

- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  markdown structure or links need focused validation
- code changes: follow `docs/specs/README.md`
