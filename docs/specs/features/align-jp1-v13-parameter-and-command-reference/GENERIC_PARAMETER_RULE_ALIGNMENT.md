# Generic Parameter Rule Alignment

## Purpose

Record the next JP1/AJS3 version 13 parameter-alignment candidate around
shared validation rules that are no longer best grouped by job type alone.

This investigation groups the remaining deferred work around filename-like
values, byte-length limits, macro-variable-aware string rules, and invalid
combinations whose current or planned owner is the shared
`buildSyntaxDiagnostics.ts` editor-feedback boundary.

This slice must be implemented together with the small refactoring needed to
keep the new rules inside the existing generic-rule structure in
`buildSyntaxDiagnostics.ts`, rather than adding a separate parallel rule path.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.6 UNIX/PC job definition`
  - Command Reference, `5.2.7 QUEUE job definition`
  - Command Reference, `5.2.9 Job definition for monitoring JP1 event reception`
  - Command Reference, `5.2.10 File monitoring job definition`
  - Command Reference, `5.2.17 JP1 event sending job definition`
  - Command Reference, `5.2.24 UNIX/PC custom job definition`
- Source URLs:
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4900e/AJSO0231.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM>

## Slice Boundary

- Application seam:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Existing consumers:
  `src/extension/diagnostics/registerDiagnostics.ts` plus focused unit types
  whose wrappers already preserve raw explicit values:
  `J`, `Cj`, `Qj`, `Rq`, `Flwj`, `Rflwj`, `Evsj`, `Revsj`, `Evwj`, and
  `Revwj`
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Preservation evidence:
  existing unit-list projection tests such as
  `src/test/suite/buildUnitListView.test.ts` and
  `src/test/suite/buildUnitListRemainingGroups.test.ts`
- Out of scope:
  parser grammar changes, domain wrapper normalization changes, unit-list or
  flow projection changes, command generation changes, generated artifacts,
  dependency changes, `engines.vscode`, and category-specific product
  decisions outside the stated generic-rule families

## Investigation Notes

- The remaining deferred gaps in `PARAMETER_COVERAGE_MATRIX.md` now cluster
  more strongly by validation-rule shape than by unit family.
- `buildSyntaxDiagnostics.ts` already owns the delivered grouped diagnostics
  for `flwf`, `flwi`, `flwc`, `flco`, `evhst`, `evsid`, `evspl`, `evsrc`,
  `evwid`, `evipa`, `evesc`, and the schedule-rule/job-end-judgment slices.
- The current file already duplicates the same `1..255` byte-length check in
  `isValidExplicitFileMonitoringFileName` and `isValidExplicitEventHostValue`,
  which is a strong indicator that the next slice should reuse shared helpers
  instead of continuing to add one-off validators per job type.
- The current file structure already has a generic-rule shape:
  shared helpers such as `buildExplicitDecimalRangeRule`,
  `collectRuleDiagnostics`, and per-family rule arrays. The approved
  implementation should refactor within that structure so the new rules and
  the existing generic rules converge instead of diverging into a new layer.
- `collectRuleDiagnostics` is keyed to explicit source-backed parameters, so
  the existing application boundary can add more diagnostics without changing
  parser DTO shape or inventing normalized values.
- Transfer-operation and QUEUE transfer-file rows still defer filename,
  byte-length, macro-variable, and invalid-combination follow-up, but those
  rules are expected to stay as diagnostics rather than parser rejection or
  wrapper mutation if the current editor-feedback policy is preserved.
- Macro-variable allowance is not uniform across parameter families. Event
  sending and event reception already preserve different explicit string forms
  for `evhst`, so any helper extraction must keep allowance rules data-driven
  per family instead of introducing a single generic string validator.

## Planned Alignment

After approval:

- keep ownership in the shared application editor-feedback boundary;
- extract or reshape reusable explicit-value validators or rule builders where
  that reduces duplication in `buildSyntaxDiagnostics.ts` and keeps old and
  new generic rules on the same path;
- group the next implementation around shared byte-length, filename-like,
  macro-variable-aware, and invalid-combination rules that still remain
  deferred in the coverage matrix;
- preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Delivered Behavior

- `buildSyntaxDiagnostics.ts` now keeps the new transfer/QUEUE generic rules
  on the existing helper-and-rule-array path instead of introducing a second
  diagnostics layer.
- Shared explicit byte-length validation is now reused for the existing
  `1..255` event-host / file-monitoring rules and the new `1..511`
  transfer-file rules.
- Editor feedback now reports transfer-operation and QUEUE transfer-file
  diagnostics when explicit `tsN` or `tdN` values fall outside the documented
  `1..511` byte-length range.
- Editor feedback now reports invalid combinations when explicit `tdN` is
  specified without `tsN`, and when explicit transfer-operation `topN` is
  specified without `tsN`.
- Existing macro-variable and regular-expression allowance remains preserved
  because the new generic helper only enforces explicit byte-length and
  dependency rules in this slice.

## Affected Backlog Rows

- Transfer Operation:
  remaining filename, byte-length, macro-variable, and invalid-combination
  validation
- QUEUE Transfer Files:
  remaining byte-length, macro-variable, and invalid-combination validation
- File Monitoring Job:
  delivered validations should become a reuse reference for shared
  filename-like and invalid-combination rule builders rather than a separate
  one-off pattern
- Event Sending and Event Receiving Jobs:
  delivered `evhst` diagnostics should remain the shared macro-variable-aware
  and byte-length reference point rather than diverging by job family

## Alternatives

- Continue selecting one job type at a time:
  viable, but rejected for now because the remaining gaps share validation
  shape and test seam more than wrapper seam.
- Move generic string validation into domain wrappers:
  rejected because the current policy preserves raw explicit invalid values and
  surfaces them through editor feedback.
- Broaden the slice to every remaining deferred parameter:
  rejected because it would mix generic-rule cleanup with unrelated
  category-specific semantics and make approval less reviewable.

## Follow-up

- If approval is given, perform a reference-impact pass on
  `buildSyntaxDiagnostics.ts` and `buildSyntaxDiagnostics.test.ts` before
  editing runtime code.
- If implementation uncovers family-specific macro-variable semantics that do
  not fit the planned generic-rule grouping, stop and request re-approval with
  the broadened scope.
