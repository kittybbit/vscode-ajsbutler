# Wait-Job Execution-Time Alignment

## Purpose

Record the next JP1/AJS3 version 13 parameter-alignment candidate for the
shared execution-time parameter `fd=time-required-for-execution` across the
currently modeled wait-like job families.

This keeps the backlog grouped at a user-meaningful size: users configuring
file monitoring jobs, execution-interval control jobs, and JP1 event
reception monitoring jobs all see the same `fd` parameter name and the same
documented range and start-condition-disabled behavior.

## Normative References

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.10 File monitoring job definition`
  - Command Reference, `5.2.16 Execution-interval control job definition`
  - Command Reference, `5.2.9 Job definition for monitoring JP1 event reception`
- Source URLs:
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213b1920e/AJSO0220.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213b1920e/AJSO0226.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM>

## Slice Boundary

- Application seam:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Existing consumers:
  `src/extension/diagnostics/registerDiagnostics.ts` plus the currently
  modeled wait-like unit wrappers `Flwj` / `Rflwj`, `Tmwj` / `Rtmwj`, and
  `Evwj` / `Revwj`
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Preservation evidence:
  existing raw projection coverage in
  `src/test/suite/buildUnitListRemainingGroups.test.ts` and
  `src/test/suite/buildUnitListView.test.ts`
- Out of scope:
  parser grammar changes, domain wrapper normalization changes, unit-list
  projection changes, flow projection changes, command generation,
  generated artifacts, dependency changes, configuration changes,
  compatible-ISAM or host-environment inputs, broader wait-condition
  parameters such as `mm`, `nmg`, `eun`, `ega`, `uem`, and `jpoif`, and
  `engines.vscode`

## Investigation Notes

- The current repository models `fd` on multiple job families, but the three
  wait-like diagnostic paths already active in `buildSyntaxDiagnostics.ts`
  are `flwj` / `rflwj`, `tmwj` / `rtmwj`, and `evwj` / `revwj`.
- The JP1/AJS3 v13 manual text is materially the same across those three job
  definitions:
  - explicit `fd` accepts decimal values in the range `1..1440`;
  - when the job is defined as a start condition, `fd` is disabled when the
    job executes.
- `buildSyntaxDiagnostics.ts` already has the smallest shared seams needed
  for this slice:
  - `buildExplicitDecimalRangeRule(...)` already covers the `1..1440`
    numeric-range shape;
  - `hasStartConditionContext(...)` already detects the sibling
    start-condition context used by the recent execution-interval and
    event-receiving slices;
  - the file-monitoring, execution-interval, and event-receiving rule arrays
    already keep these families isolated without needing parser or domain
    changes.
- This candidate is preferable to jumping straight to compatible-ISAM rules,
  because compatible-ISAM is a legacy migration-only mode that this
  repository will not model explicitly.
- This candidate is preferable to broadening immediately into `mm`, `nmg`,
  `eun`, `ega`, `uem`, or `jpoif`, because `fd` shares one validation shape
  and one start-condition rule across the currently modeled wait-like job
  families.

## Delivered Alignment

- Keep ownership in the shared application editor-feedback boundary.
- Add grouped semantic diagnostics for explicit invalid `fd` values on
  `flwj` / `rflwj`, `tmwj` / `rtmwj`, and `evwj` / `revwj`.
- Add grouped semantic diagnostics for explicit `fd` values when those units
  are defined in a start-condition context, because the manual says the
  parameter is disabled when the job executes.
- Reuse existing shared explicit-value and sibling-context helpers where
  practical, extracting only the smallest helper or rule-array refactor
  needed to keep the checks on the current file-monitoring,
  execution-interval, and event-receiving diagnostics paths.
- Preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Delivered Behavior

- Editor feedback now reports semantic diagnostics when explicit `fd` values
  on `flwj` / `rflwj`, `tmwj` / `rtmwj`, and `evwj` / `revwj` fall outside
  the documented JP1/AJS3 v13 range `1..1440`.
- Editor feedback now reports semantic diagnostics when explicit `fd` is
  specified on those wait-like job families in a start-condition context.
- The implementation reuses the existing decimal-range rule builder and
  sibling start-condition helper, with only the smallest shared helper
  extraction needed to keep the checks on the current file-monitoring,
  execution-interval, and event-receiving diagnostic paths.

## Affected Backlog

- File monitoring jobs:
  shared `fd` execution-time diagnostics outside the already aligned
  `flwf`, `flwc`, `flwi`, `flco`, and `ets` family
- Execution-interval control jobs:
  shared `fd` execution-time diagnostics outside the already aligned
  `tmitv`, `etn`, and `ets` family
- JP1 event reception monitoring jobs:
  shared `fd` execution-time diagnostics outside the already aligned
  search-scope, string-filter, numeric-identifier, and timeout-control
  families

## Alternatives

- Re-open compatible-ISAM restrictions first:
  rejected because compatible-ISAM is a legacy migration-only mode that this
  repository will not support explicitly.
- Broaden immediately to the full wait-condition family:
  rejected for now because `mm`, `nmg`, `eun`, `ega`, `uem`, and `jpoif`
  add additional value-shape, multiplicity, or environment-sensitive rules.
- Keep `fd` raw because the parameter is disabled rather than rejected:
  rejected for now because the same editor-feedback boundary already surfaces
  documented context-sensitive parameter misuse for nearby wait-like job
  families, and the manual-backed disabled behavior is still user-visible.

## Remaining Gap

- The broader shared wait-condition parameter family remains a separate future
  slice. Compatible-ISAM-sensitive restrictions are not planned because that
  mode is limited to legacy migration environments outside this repository's
  support policy.
