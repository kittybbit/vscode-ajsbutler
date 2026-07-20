# Traceability: Isolate Parser Boundary

## Requirement And Validation Map

| Use Case / Concern        | Req / AC      | SPECS Section | Slice | Evidence |
| ------------------------- | ------------- | ------------- | ----- | -------- |
| Wrapper prerequisite      | R2/R4/AC1     | Req/Arch/AC   | 1     | V1       |
| View Unit List            | R3/R5/AC2     | Req/Compat/AC | 2     | V2       |
| Diagnose AJS Definition   | R3/R5/AC2     | Req/Compat/AC | 2     | V3       |
| Build Semantic Diff       | R3/R5/AC2     | Req/Compat/AC | 2     | V4       |
| Present Semantic Diff     | R3/R5/AC2     | Req/Compat/AC | 2     | V5       |
| Parser telemetry          | R5/AC2        | Compat/AC     | 2     | V6       |
| Infrastructure raw owner  | R1/R2/R4/AC1  | Req/Arch/AC   | 3     | V7       |
| Single normalization      | R3/R5/AC2/AC3 | Req/Compat/AC | 2-3   | V8       |
| Test parser boundary      | R2/R4/AC1     | Arch/AC       | 2-3   | V9       |
| Desktop/web compatibility | R5/AC3        | Compat/AC     | 2-3   | V10      |

Legend: Req = Requirements, Arch = Architecture, Compat = Compatibility,
AC = Acceptance Criteria.

## Evidence Plan

- V1: `groupEntity.test.ts`, `jobnetEntity.test.ts`, parameter factory/lookup
  tests, normalizer tests, and architecture dependency-rule tests. Slice 1
  result: TypeScript compilation, full desktop tests, exact architecture
  validation, and qlty passed; raw-unit allowances decreased from five to two.
- V2: `AntlrAjsParser.test.ts`, `buildUnitList.test.ts`, parser
  golden/malformed fixtures, desktop tests, and web tests.
- V3: `buildSyntaxDiagnostics.test.ts`, parser error/source-position tests,
  `uc-diagnose-ajs-definition.md` scenario review, desktop tests, and web tests.
- V4: `buildSemanticDiffReport.test.ts`, semantic comparison regression tests,
  and before/after parser-error tests for `uc-build-semantic-diff.md`.
- V5: `buildSemanticDiffReport.test.ts`, semantic diff sample/report coverage,
  and report-content compatibility for `uc-present-semantic-diff-report.md`.
- V6: `extensionDependencies.test.ts`, including success/error classification
  and privacy assertions.
- V7: `AntlrAjsParser.test.ts`, architecture dependency-rule tests, and
  production raw/generated/ANTLR scans.
- V8: `normalizeAjsDocument.test.ts`, parser golden tests, and
  relation/parameter/warning/source-position suites.
- V9: classify all 91 `parseAjs` calls across 24 suites; downstream suites use
  the normalized helper, intentionally raw suites use the named raw helper, and
  an exact importer scan rejects unclassified raw-helper use.
- V10: full desktop tests, `rtk pnpm run test:web`, `rtk pnpm run build`, and
  `rtk pnpm run qlty`.

## Slice Coverage

- Slice 1: prerequisite for R2/R4 and AC1; removes three exact raw-unit
  allowances without changing wrapper behavior.
- Slice 2: implements R3 and the application-facing portion of R5/AC2; removes
  the remaining two raw-unit allowances and validates all current parser-port
  consumers.
- Slice 3: completes R1/R2/R4 and AC1/AC3 by relocating and enforcing the
  infrastructure-only raw and normalization seam.

## Exit Evidence Required

- All three slices are `Complete` and their focused/full validation is recorded.
- The feature-owned raw allowlist count is zero and stale-check tests pass.
- The diagnostic use case and durable architecture description match the
  implemented normalized-only boundary.
- Desktop/web behavior, minimum VS Code compatibility, telemetry privacy, and
  JP1/AJS definition-file compatibility have no unresolved regression.
