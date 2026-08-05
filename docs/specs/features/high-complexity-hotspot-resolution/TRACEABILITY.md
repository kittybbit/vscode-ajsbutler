# Traceability: High-Complexity Hotspot Resolution

| Use Case | Req.       | `SPECS.md`          | Slice  | Validation |
| -------- | ---------- | ------------------- | ------ | ---------- |
| UC-LIST  | HR-1       | Requirements        | S1, S2 | V1, V2     |
| UC-LIST  | HR-2       | Requirements        | S2     | V2         |
| UC-LIST  | HR-3       | Requirements        | S1, S2 | V3         |
| UC-LIST  | HR-4       | Architecture        | S1, S2 | V4         |
| UC-LIST  | HR-5       | Acceptance Criteria | S1, S2 | V5         |
| UC-LIST  | HR-6       | Compatibility       | S1, S2 | V6         |
| UC-CSV   | HR-2, HR-3 | Requirements        | S2     | V7         |

## Mapping Key

- UC-LIST: `docs/requirements/use-cases/uc-view-unit-list.md`.
- UC-CSV: `docs/requirements/use-cases/uc-export-unit-list-csv.md`.
- S1: isolate serialized document shape validation.
- S2: isolate projection identity consistency.
- V1: `buildUnitList.test.ts` and `tableViewerData.test.ts` cover valid shape,
  malformed root, row group, linked unit, array, optional field, and metadata
  rejection without partial data.
- V2: `buildUnitList.test.ts` and `tableViewerData.test.ts` cover count, order,
  duplicate identity, parentage, root/row/metadata correspondence,
  parent-path rejection, and the empty viewer safe state after rejection.
- V3: exported-signature review plus `buildUnitList.test.ts`,
  `tableViewerData.test.ts`, `viewerHostMessages.test.ts`, flow-navigation
  coverage in `flowViewerController.test.ts` and `viewerMessageRouting.test.ts`,
  `exportUnitListCsv.test.ts`, and `exportCsvView.test.ts`.
- V4: architecture dependency test, production import review, desktop and web
  compilation, and no Node, VS Code, parser, presentation, host, or telemetry
  dependency in extracted application helpers; pure domain value imports remain
  allowed.
- V5: exact baseline Qlty function, file, directory, and smell commands with
  the recorded version/configuration; function-level `Cyclo` is the primary
  gate over the baseline hotspot functions and all extracted responsibility
  functions, with lower final maximum, lower final residual-file `Cyclo`, no
  mapped equal-or-higher replacement, and no new smell. Cognitive, file
  `Complex`, LOC, and directory metrics are secondary review signals.
- V6: desktop `unitListEncoding.test.ts` verifies UTF-8/Shift_JIS file
  decoding; shared application unit-list/table-viewer tests cover the
  500-child, 128 mixed-unit, serialized-projection, and malformed-input cases;
  the desktop test run plus web build and `webSmoke.ts` verify host integration
  and browser-safe application loading. Web coverage does not assert byte-level
  encoding equivalence.
- V7: `exportUnitListCsv.test.ts` and `exportCsvView.test.ts` preserve row
  identity, order, fields, metadata, visible-column behavior, and payload
  escaping.

## Slice 1 Implementation Result

- Status: Complete; completion approved.
- Implementation: structural validation now lives in
  `unitListDocumentValidation.ts` and `unitListRowValidation.ts`; the public
  DTOs and identity-checking stage remain in `unitListDocument.ts`.
- Validation: `rtk pnpm test`, `rtk pnpm run qlty`, `rtk pnpm run build`, and
  `rtk pnpm run test:compile` passed. The web build and smoke test passed with
  the cached VS Code Web stable commit; the standard web runner's latest-build
  lookup timed out externally, so the fixed-commit smoke result is the
  reproducible web evidence for this slice.
- Qlty evidence: the target files measure `148` total file `Cyclo` versus
  `224` before the slice; the residual `unitListDocument.ts` measures `58`.
  The structural-validation helper maximum is `12` versus the former row/root
  hotspot maximum of `59`; no new smell is present. The remaining identity
  smell is the approved Slice 2 responsibility.
- Compatibility: no public signature, observable behavior, JP1/AJS input
  semantics, desktop encoding behavior, or desktop/web host contract changed.

## Acceptance Coverage

- S1 proves fail-closed structural validation and the application dependency
  boundary while retaining the existing public conversion contract.
- S2 proves deterministic identity and projection correspondence, shared
  application consumption with desktop/web host compatibility, CSV input
  compatibility, and feature-wide measured complexity reduction.
