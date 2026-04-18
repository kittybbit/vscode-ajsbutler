# SPECS: align-jp1-v13-parameter-and-command-reference

## Purpose

Align parameter interpretation and `ajs` command generation to named
JP1/AJS3 version 13 reference documents.

## Origin

- Source use case: docs/requirements/use-cases/uc-interpret-jp1-parameters.md
- Source use case: docs/requirements/use-cases/uc-generate-ajs-commands.md
- Related use case: docs/requirements/use-cases/uc-show-unit-definition.md

## Acceptance Criteria

- JP1/Automatic Job Management System 3 version 13 is named explicitly as the
  target product version
- parameter parsing scope is tied to the Definition File Reference
- command generation scope is tied to the Command Reference
- `buildUnitDefinition.ts` no longer needs to own command-generation logic as
  an inseparable concern
- reference alignment can proceed incrementally without hiding known gaps

## Implementation Notes

- prefer isolating reusable parameter and command semantics in domain or
  application seams rather than viewer-specific helpers
- keep command generation reusable so show-unit-definition is one consumer, not
  the owner of the logic
- when manual coverage is partial, document supported commands and remaining
  gaps explicitly in `TASKS.md`
- avoid bundling these reference-alignment slices with unrelated flow-graph or
  package-manager work

## Reference Documents

- Definition File Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0211.HTM)
- Command Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0067.HTM)

## Non-Goals

- claiming support for every JP1/AJS3 command in one change
- mixing reference-alignment work with unrelated dependency modernization
- hiding version-specific assumptions behind generic "latest JP1" wording
