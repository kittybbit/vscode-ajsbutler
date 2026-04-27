# TASKS: align-jp1-v13-parameter-and-command-reference

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Record JP1/AJS3 version 13 as the target reference for parameter parsing
      and command generation
- [x] Record that command generation should be separated from
      `buildUnitDefinition.ts`

## Delivered Follow-up

- [x] Inventory current parameter semantics that already match the version 13
      definition reference
- [x] Inventory current command-generation behavior and its coupling to
      show-unit-definition
- [x] Decide the first supported set of auto-generated `ajs` commands
- [x] Define how manual mismatches are tracked and closed incrementally
- [x] Extract the current `ajsshow` and `ajsprint` generation logic from
      `buildUnitDefinition.ts` into a dedicated application-facing seam while
      preserving the existing dialog DTO behavior
- [x] Replace fixed command text display with an `ajsshow` / `ajsprint`
      command-builder DTO and show-unit-definition builder UI, preserving the
      existing default command text
- [x] Localize command-builder labels, descriptions, and command reference
      links through the existing `lang` context
- [x] Prepare the next behavior-changing alignment slice around schedule-rule
      parameters (`sd`, `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`,
      `wc`, and `wt`) with manual references, code seams, and regression
      evidence status
- [x] Add behavior-preserving regression tests for thin schedule-rule evidence
      before changing helper semantics
- [x] Implement the first behavior-changing schedule-rule alignment fix:
      ignore `ln` on root jobnets while preserving nested jobnet `ln`
      behavior
- [x] Align omitted schedule-rule numbers to rule `1` across the schedule-rule
      helper boundary for `sd`, `st`, `sy`, `ey`, `ln`, `cy`, `sh`, `shd`,
      `cftd`, `wc`, and `wt`
- [x] Centralize schedule-rule value parsing behind domain helpers and verify
      the official format shape for the schedule-rule family before treating
      the category as aligned
- [x] Record transfer-operation alignment scope, manual references, affected
      seams, and expected `top1` to `top4` default behavior before completing
      the helper-boundary extraction

## Follow-up

- [x] Extract `top1` to `top4` default resolution into a transfer-operation
      helper seam while preserving explicit and derived values
- [ ] Apply the same category-level value parsing audit/refactor workflow to
      another non-schedule parameter family before marking those categories
      aligned
- [ ] Turn the audit notes into an explicit parameter-coverage matrix when
      category-level status needs tracking beyond the current audit summary
- [ ] Continue schedule-rule helper-boundary alignment with the remaining
      grouped semantics, such as `wc` / `wt` pairing or range validation, when
      the behavior contract is explicit enough to test across the family

## Notes

- 2026-04-18: normative parameter and command sources were fixed to the user
  supplied JP1/AJS3 version 13 reference documents.
- 2026-04-20: the initial audit is recorded in `AUDIT.md`. Current parameter
  semantics are already centralized mainly in `parameterHelpers.ts`,
  `Defaults.ts`, and the builder families behind `ParamFactory`, while command
  generation is still embedded in
  `src/application/unit-definition/buildUnitDefinition.ts`.
- 2026-04-20: the first extracted supported command set will preserve the
  current user-visible behavior only: `ajsshow` and `ajsprint`.
- 2026-04-22: `ajsshow` and `ajsprint` generation now lives behind
  `src/application/unit-definition/buildAjsCommands.ts`, while
  `buildUnitDefinition.ts` remains responsible for assembling the dialog DTO.
- 2026-04-23: show-unit-definition now receives structured command-builder
  metadata for the two supported commands with stable label and description
  keys for the presentation layer.
- 2026-04-23: command-builder UI now resolves labels and descriptions through
  the existing message resources and switches `ajsshow` / `ajsprint` manual
  links between English and Japanese URLs from the active `lang` context.
- 2026-04-26: the next parameter-alignment candidate is the schedule-rule
  family because these keys already share helper seams, affect unit-list
  behavior, and can be covered as a focused manual-alignment slice without
  creating a full parameter matrix first.
- 2026-04-27: schedule-rule alignment preparation is recorded in
  `SCHEDULE_RULE_ALIGNMENT.md`, keeping the matrix limited to the focused
  schedule-rule family instead of expanding to all parameters.
- 2026-04-27: behavior-preserving regression tests now cover explicit
  `sd=0,ud` preservation, default expansion for `st`, `shd`, `cftd`, `wc`, and
  `wt`, and relative-minute preservation for `sy` and `ey`.
- 2026-04-27: `ln` now follows the JP1/AJS3 v13 root-jobnet rule: root-jobnet
  `ln` values are ignored, while nested jobnet `ln` values remain sorted and
  visible to the unit-list parent-rule projection.
- 2026-04-27: schedule-rule number omission is now handled as a shared
  schedule-rule boundary concern. The domain parameter classes resolve omitted
  rule numbers to manual default rule `1`, and regression coverage verifies the
  schedule family together instead of one parameter at a time.
- 2026-04-27: schedule-rule value parsing is now centralized in domain helpers
  and reused by unit-list projection. This is the first category-level parser
  alignment pattern; later parameter categories should follow the same audit,
  helper-boundary, and regression-test workflow.
- 2026-04-27: transfer-operation alignment is the next helper-boundary slice.
  It keeps the existing `topN` behavior but moves the paired `tsN` / `tdN`
  default rule out of generic parameter helper code.
- 2026-04-27: `topN` default resolution now lives in
  `transferOperationHelpers.ts`; regression evidence covers explicit `topN`,
  derived `sav`, derived `del`, and the no-default case.
