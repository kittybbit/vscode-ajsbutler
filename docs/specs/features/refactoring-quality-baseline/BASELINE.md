# Refactoring Quality Baseline

<!-- markdownlint-disable MD013 MD012 -->

## Scope and status

This report is the Slice 1 structural baseline for
`refactoring-quality-baseline`. It captures read-only evidence at one exact
Git commit; it does not rank hotspots or select a refactoring target.

- Baseline commit: `14d94fa3602fc4f6f467eccac35bc588ee44b9bb`
- Captured: 2026-08-01
- Qlty: `0.500.0` on `macos-arm64` (build `5945e00`, 2025-03-18)
- Feature scope: feature-local evidence only
- Runtime behavior: unchanged
- Slice completion: approved complete

## Reproduction identity

| Item                    | Recorded value                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Git commit              | `14d94fa3602fc4f6f467eccac35bc588ee44b9bb`                                                                                     |
| Qlty version command    | `qlty --no-upgrade-check version`                                                                                              |
| Qlty version result     | `qlty 0.500.0 macos-arm64 (5945e00 2025-03-18)`                                                                                |
| Qlty configuration      | `.qlty/qlty.toml`                                                                                                              |
| Qlty configuration hash | `git hash-object .qlty/qlty.toml` = `10270a36e053c2ccf6023ce4f7176ee67d8424d9`                                                 |
| Hash at baseline commit | same value from `git show HEAD:.qlty/qlty.toml \| git hash-object --stdin`                                                     |
| Package version         | `1.16.0`                                                                                                                       |
| Production roots        | `src/domain`, `src/application`, `src/infrastructure`, `src/presentation`, `src/bootstrap`, `src/resource`, `src/extension.ts` |
| Root state at baseline  | all seven roots present                                                                                                        |
| Test exclusion          | `--exclude-tests`; Qlty test patterns are recorded in `.qlty/qlty.toml`                                                        |
| Source state check      | no tracked source, test, generated, configuration, package, or CI change at capture time                                       |

The baseline roots are passed explicitly. The current Qlty configuration excludes
minified files, declaration files, dependency/build/cache/vendor/generated
directories, `pnpm-lock.yaml`, and `webpack.config.js`. Smell thresholds are
the committed configuration values: boolean logic 4, file complexity 55, return
statements 4, nested control flow 4, function parameters 4, function complexity
5, and duplication 20. No new threshold is proposed by this report.

The pre-existing working tree contained changes to `docs/specs/roadmap.md` and
the feature planning documents. Those changes were outside the measured source
roots and were preserved; the baseline identity and configuration match
`HEAD`.

## Exact Qlty commands

The following commands are the Slice 1 commands and must be re-run at the
recorded commit with the same Qlty version and configuration:

```text
qlty --no-upgrade-check metrics --exclude-tests --functions --sort complexity --quiet \
  src/domain src/application src/infrastructure src/presentation \
  src/bootstrap src/resource src/extension.ts
qlty --no-upgrade-check metrics --exclude-tests --dirs --max-depth 4 --sort complexity --quiet \
  src/domain src/application src/infrastructure src/presentation \
  src/bootstrap src/resource src/extension.ts
qlty --no-upgrade-check smells --no-snippets --quiet \
  src/domain src/application src/infrastructure src/presentation \
  src/bootstrap src/resource src/extension.ts
```

For the file-level table below, the equivalent Qlty file report was also
captured with:

```text
qlty --no-upgrade-check metrics --exclude-tests --sort complexity --quiet \
  src/domain src/application src/infrastructure src/presentation \
  src/bootstrap src/resource src/extension.ts
```

This additional command uses the same roots and exclusions; it is recorded
because the default metrics view is the reliable file-level granularity.

Qlty's human-readable function and directory blocks can appear in a different
parallel-discovery order on a re-run. Reproducibility is therefore checked by
canonicalizing each row on its full path, function name, and reported numeric
values; the initial and re-run function and directory rows matched after that
normalization. The smell output matched byte-for-byte.

## Measurement inventory

| Evidence              | Grain                         | Result at baseline                                            |
| --------------------- | ----------------------------- | ------------------------------------------------------------- |
| Cyclomatic complexity | file and function             | available; file and function values below                     |
| Cognitive complexity  | function                      | available; function values below                              |
| Lines and LOC         | file, directory, and function | available                                                     |
| LCOM                  | file and directory            | available; 14 files have non-zero LCOM                        |
| Qlty smells           | file and finding              | available; 223 findings in 67 files                           |
| Duplication           | finding and file pair         | available through Qlty smell output; 14 similar-code findings |
| Technical debt        | repository                    | unavailable; no reproducible repository command exists        |
| Coverage              | repository                    | unavailable; no reproducible repository command exists        |
| Dependency degree     | repository/file               | unavailable; no repository command in scope produces it       |
| Architecture status   | repository test               | incomplete; existing test has 8 passing and 5 failing tests   |

Missing measurements are reported as unavailable, never as zero or an inferred
substitute.

## Slice 1A architecture evidence reconciliation

The baseline commit's architecture result remains recorded as 8 passing and 5
failing because the pre-existing test helper enumerated the absent
`src/shared` directory. Slice 1A reconciled the durable architecture catalog,
the agent-facing catalog, the test helper, and its synthetic fixture without
changing the baseline metrics or dependency rules.

After that reconciliation, `pnpm run test:compile` and the direct compiled
architecture suite completed with 13 passing and 0 failing tests. The corrected
result is current validation evidence for the feature; it does not replace the
historical baseline result captured at the recorded commit.

## Aggregate structural evidence

The default file report contains 253 file rows. Its `TOTAL` row is:

| Classes | Functions | Fields | Cyclo | Complex | LCOM |  Lines |    LOC |
| ------: | --------: | -----: | ----: | ------: | ---: | -----: | -----: |
|      20 |     1,875 |     35 | 3,999 |   2,790 |   16 | 36,121 | 33,198 |

The directory command emits 47 hierarchical rows. The `src` row is the
non-overlapping production aggregate above; the printed `TOTAL` row sums
overlapping nested directories and is not used as a second repository total.

### Directory metrics

| Directory                                 | Classes | Funcs | Fields | Cyclo | Complex | LCOM |  Lines |    LOC |
| ----------------------------------------- | ------: | ----: | -----: | ----: | ------: | ---: | -----: | -----: |
| `src`                                     |      20 |  1875 |     35 |  3999 |    2790 |   16 |  36121 |  33198 |
| `src/presentation`                        |       5 |  1128 |     19 |  2068 |    1712 |    5 |  20061 |  18501 |
| `src/presentation/webview`                |       0 |   995 |      0 |  1797 |    1498 |    0 |  17564 |  16229 |
| `src/presentation/webview/editor`         |       0 |   971 |      0 |  1710 |    1434 |    0 |  17188 |  15895 |
| `src/application`                         |       3 |   305 |      0 |  1118 |     612 |    0 |   7740 |   7136 |
| `src/domain`                              |       0 |   298 |      0 |   647 |     361 |    0 |   4511 |   4058 |
| `src/domain/services`                     |       0 |   242 |      0 |   562 |     319 |    0 |   3583 |   3226 |
| `src/application/flow-graph`              |       0 |    52 |      0 |   283 |     213 |    0 |   1477 |   1367 |
| `src/domain/services/diagnostics`         |       0 |   161 |      0 |   323 |     198 |    0 |   2131 |   1906 |
| `src/domain/services/semantic-diff`       |       0 |    65 |      0 |   228 |     112 |    0 |   1293 |   1182 |
| `src/presentation/vscode`                 |       5 |   100 |     19 |   144 |     110 |    5 |   1892 |   1706 |
| `src/application/unit-list`               |       0 |   113 |      0 |   376 |     106 |    0 |   1944 |   1774 |
| `src/presentation/semantic-diff`          |       0 |    33 |      0 |   127 |     104 |    0 |    605 |    566 |
| `src/application/telemetry`               |       1 |    32 |      0 |   134 |      94 |    0 |   1441 |   1347 |
| `src/application/navigation`              |       0 |    14 |      0 |    59 |      82 |    0 |    281 |    253 |
| `src/infrastructure`                      |      11 |    82 |     14 |   117 |      62 |    9 |   1105 |    948 |
| `src/application/semantic-diff`           |       0 |    37 |      0 |    95 |      59 |    0 |   1057 |    970 |
| `src/presentation/vscode/commands`        |       0 |    31 |      0 |    49 |      53 |    0 |    616 |    557 |
| `src/application/unit-definition`         |       0 |    33 |      0 |   124 |      47 |    0 |    747 |    698 |
| `src/bootstrap/extension`                 |       1 |    58 |      2 |    37 |      43 |    2 |    731 |    673 |
| `src/bootstrap`                           |       1 |    58 |      2 |    37 |      43 |    2 |    731 |    673 |
| `src/domain/models`                       |       0 |    53 |      0 |    78 |      42 |    0 |    632 |    541 |
| `src/presentation/vscode/webview`         |       3 |    43 |     14 |    53 |      36 |    3 |    822 |    741 |
| `src/infrastructure/webapi`               |       3 |    34 |      3 |    59 |      34 |    2 |    444 |    391 |
| `src/domain/models/parameters`            |       0 |    32 |      0 |    42 |      29 |    0 |    380 |    331 |
| `src/infrastructure/parser`               |       5 |    40 |     10 |    49 |      25 |    5 |    572 |    484 |
| `src/infrastructure/parser/normalization` |       0 |    26 |      0 |    27 |      18 |    0 |    338 |    300 |
| `src/domain/models/ajs`                   |       0 |    21 |      0 |    35 |      13 |    0 |    197 |    163 |
| `src/application/editor-feedback`         |       0 |    21 |      0 |    43 |      11 |    0 |    622 |    577 |
| `src/domain/services/i18n`                |       0 |    16 |      0 |    11 |       9 |    0 |    159 |    138 |
| `src/presentation/vscode/diagnostics`     |       0 |    10 |      0 |    14 |       7 |    0 |    188 |    173 |
| `src/presentation/vscode/languages`       |       1 |     6 |      2 |     8 |       6 |    1 |    152 |    139 |
| `src/presentation/vscode/semantic-diff`   |       1 |     6 |      3 |    12 |       6 |    1 |     92 |     78 |
| `src/infrastructure/parser/raw`           |       1 |     7 |      5 |     8 |       4 |    2 |     62 |     43 |
| `src/infrastructure/telemetry`            |       2 |     5 |      1 |     6 |       2 |    1 |     55 |     44 |
| `src/infrastructure/i18n`                 |       1 |     3 |      0 |     3 |       1 |    1 |     34 |     29 |
| `src/presentation/vscode/common`          |       0 |     2 |      0 |     4 |       0 |    0 |     11 |      9 |
| `src/domain/values`                       |       0 |     3 |      0 |     7 |       0 |    0 |    296 |    291 |
| `src/resource/i18n`                       |       0 |     2 |      0 |    11 |       0 |    0 |   1955 |   1867 |
| `src/resource`                            |       0 |     2 |      0 |    11 |       0 |    0 |   1955 |   1867 |
| `src/application/parsing`                 |       1 |     0 |      0 |     1 |       0 |    0 |     21 |     18 |
| `src/domain/models/semantic-diff`         |       0 |     0 |      0 |     1 |       0 |    0 |     55 |     47 |
| `src/application/webapi-import`           |       1 |     3 |      0 |     3 |       0 |    0 |    150 |    132 |
| `TOTAL`                                   |      66 |  7018 |    129 | 14520 |   10295 |   55 | 132011 | 121266 |

### Highest file metrics observed

The file report is sorted by Qlty complexity. This table records the first 40
rows of the measured output; it is an observation, not a repository-wide
acceptance threshold.

| File                                                                        | Classes | Funcs | Fields | Cyclo | Complex | LCOM | Lines |  LOC |
| --------------------------------------------------------------------------- | ------: | ----: | -----: | ----: | ------: | ---: | ----: | ---: |
| `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`                  |       0 |    15 |      0 |   118 |     162 |    0 |  1165 | 1134 |
| `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`               |       0 |    50 |      0 |   139 |     147 |    0 |  1143 | 1077 |
| `src/presentation/webview/editor/ajsTable/navigation.ts`                    |       0 |    20 |      0 |   175 |     122 |    0 |   411 |  380 |
| `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`             |       0 |    19 |      0 |    87 |     109 |    0 |   679 |  648 |
| `src/application/flow-graph/flowGraphDocument.ts`                           |       0 |    16 |      0 |   154 |     101 |    0 |   510 |  475 |
| `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`        |       0 |    20 |      0 |    99 |      90 |    0 |   390 |  368 |
| `src/application/navigation/resolveNavigationTarget.ts`                     |       0 |    14 |      0 |    59 |      82 |    0 |   281 |  253 |
| `src/application/flow-graph/buildExpandedFlowGraph.ts`                      |       0 |    15 |      0 |    78 |      71 |    0 |   447 |  413 |
| `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`            |       0 |    23 |      0 |   103 |      59 |    0 |   556 |  504 |
| `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`           |       0 |    32 |      0 |    40 |      51 |    0 |   534 |  493 |
| `src/presentation/webview/editor/ajsTable/TableContents.tsx`                |       0 |    14 |      0 |    37 |      50 |    0 |   709 |  677 |
| `src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx`           |       0 |    20 |      0 |    45 |      46 |    0 |   473 |  441 |
| `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`          |       0 |    28 |      0 |    88 |      41 |    0 |   483 |  443 |
| `src/presentation/webview/viewerRequestMessages.ts`                         |       0 |    16 |      0 |    52 |      40 |    0 |   230 |  206 |
| `src/presentation/webview/editor/ajsFlow/flowKeyboardNavigation.ts`         |       0 |    19 |      0 |    47 |      38 |    0 |   357 |  320 |
| `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`   |       0 |    25 |      0 |    33 |      33 |    0 |   414 |  376 |
| `src/presentation/webview/editor/ajsFlow/flowKeyboardNavigationActions.ts`  |       0 |    24 |      0 |    56 |      32 |    0 |   323 |  296 |
| `src/domain/services/diagnostics/ScheduleDateRules.ts`                      |       0 |    20 |      0 |    51 |      31 |    0 |   204 |  174 |
| `src/application/telemetry/telemetryBuckets.ts`                             |       0 |     5 |      0 |    37 |      31 |    0 |   123 |  105 |
| `src/application/semantic-diff/compareSemanticDiff.ts`                      |       0 |    27 |      0 |    55 |      31 |    0 |   583 |  548 |
| `src/presentation/webview/editor/ajsTable/TableHeader.tsx`                  |       0 |    11 |      0 |    32 |      31 |    0 |   152 |  139 |
| `src/domain/services/diagnostics/ScheduleDiagnosticRules.ts`                |       0 |    38 |      0 |    62 |      29 |    0 |   335 |  281 |
| `src/presentation/webview/editor/shared/unitTreeNavigation.ts`              |       0 |    29 |      0 |    61 |      29 |    0 |   308 |  278 |
| `src/presentation/webview/editor/ajsFlow/expandedFlowGraphGrowthOffsets.ts` |       0 |    20 |      0 |    35 |      29 |    0 |   358 |  322 |
| `src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts`             |       0 |     9 |      0 |    22 |      29 |    0 |   314 |  293 |
| `src/application/unit-list/unitListDocument.ts`                             |       0 |    19 |      0 |   224 |      28 |    0 |   536 |  509 |
| `src/bootstrap/extension/viewerWiring.ts`                                   |       0 |    17 |      0 |    16 |      27 |    0 |   297 |  277 |
| `src/domain/services/diagnostics/EventDiagnosticRules.ts`                   |       0 |    15 |      0 |    48 |      27 |    0 |   167 |  144 |
| `src/application/unit-definition/buildCommandLine.ts`                       |       0 |    14 |      0 |    29 |      27 |    0 |   141 |  121 |
| `src/infrastructure/webapi/Jp1Ajs3WebApiImportAdapter.ts`                   |       2 |    24 |      2 |    47 |      26 |    1 |   352 |  313 |
| `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`             |       0 |    10 |      0 |    28 |      24 |    0 |   183 |  168 |
| `src/presentation/webview/viewerHostMessages.ts`                            |       0 |     8 |      0 |    35 |      24 |    0 |   146 |  128 |
| `src/domain/services/diagnostics/evaluateJobEndDiagnosticViolations.ts`     |       0 |     8 |      0 |    23 |      23 |    0 |   252 |  231 |
| `src/presentation/webview/editor/ajsTable/unitListDetail.ts`                |       0 |    16 |      0 |    32 |      23 |    0 |   224 |  202 |
| `src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts`        |       0 |    15 |      0 |    24 |      23 |    0 |   227 |  210 |
| `src/presentation/webview/editor/ajsFlow/Header.tsx`                        |       0 |    14 |      0 |    15 |      23 |    0 |   339 |  321 |
| `src/presentation/webview/editor/ajsFlow/flowViewportFocus.ts`              |       0 |    12 |      0 |    26 |      21 |    0 |   190 |  168 |
| `src/application/unit-definition/unitDefinitionDocument.ts`                 |       0 |    11 |      0 |    87 |      20 |    0 |   117 |  106 |
| `src/domain/services/diagnostics/evaluateEventDiagnosticViolations.ts`      |       0 |    29 |      0 |    30 |      19 |    0 |   337 |  319 |
| `src/presentation/webview/editor/shared/HeaderSearchField.tsx`              |       0 |    14 |      0 |    20 |      19 |    0 |   376 |  348 |

## Function evidence

The function command reported 1,875 function rows across 225 files. The table
below records the 40 highest observed rows after sorting by cognitive complexity,
then cyclomatic complexity, lines, path, and function name for stable display.
The exact command above remains the reproducible source for the complete
function-level output. Paths are repeated on every row so ownership is
unambiguous.

| File                                                                 | Function                                 | Fields | Cyclo | Cognitive | Lines | LOC |
| -------------------------------------------------------------------- | ---------------------------------------- | -----: | ----: | --------: | ----: | --: |
| `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`      | `VirtualizedTable`                       |      0 |    66 |        96 |   361 | 349 |
| `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`           | `FlowGraphPanelComponent`                |      0 |    75 |        90 |   377 | 371 |
| `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`        | `UnitTreeSelector`                       |      0 |    68 |        70 |   287 | 276 |
| `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`           | `FlowContents`                           |      0 |    32 |        48 |   411 | 405 |
| `src/presentation/webview/editor/ajsTable/TableContents.tsx`         | `TableContents`                          |      0 |    27 |        43 |   297 | 281 |
| `src/presentation/webview/editor/ajsTable/navigation.ts`             | `moveCellFocus`                          |      0 |    49 |        42 |    71 |  70 |
| `src/application/flow-graph/flowGraphDocument.ts`                    | `readUnit`                               |      0 |    34 |        33 |    94 |  92 |
| `src/application/flow-graph/flowGraphDocument.ts`                    | `readRootUnits`                          |      0 |    15 |        26 |    61 |  58 |
| `src/presentation/webview/editor/ajsTable/navigation.ts`             | `moveHeaderFocus`                        |      0 |    32 |        25 |    45 |  44 |
| `src/presentation/webview/viewerRequestMessages.ts`                  | `parseViewerRequest`                     |      0 |    21 |        25 |    33 |  33 |
| `src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx`    | `SharedUnitDetailPane`                   |      0 |    16 |        20 |    51 |  48 |
| `src/application/flow-graph/buildExpandedFlowGraph.ts`               | `normalizeRequestedExpandedUnitIds`      |      0 |     9 |        19 |    54 |  52 |
| `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`           | `useSyncSelectedFlowNode`                |      0 |     8 |        19 |    31 |  28 |
| `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`     | `explicitDateCandidates`                 |      0 |    17 |        18 |    38 |  35 |
| `src/presentation/webview/editor/ajsTable/TableHeader.tsx`           | `renderHeaderCell`                       |      0 |    15 |        18 |    39 |  39 |
| `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`        | `UnitTreeSelectorUnit`                   |      0 |    12 |        18 |   130 | 129 |
| `src/application/flow-graph/buildExpandedFlowGraph.ts`               | `appendExpandedUnitContent`              |      0 |    12 |        17 |    29 |  28 |
| `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts` | `localizedChangeSummary`                 |      0 |    14 |        16 |    27 |  27 |
| `src/application/navigation/resolveNavigationTarget.ts`              | `resolveFlowScopeUnit`                   |      0 |    10 |        16 |    30 |  28 |
| `src/application/flow-graph/flowGraphDocument.ts`                    | `toFlowGraphUnitWithoutChildren`         |      0 |    17 |        14 |    28 |  28 |
| `src/application/navigation/resolveNavigationTarget.ts`              | `collectRequiredExpandedAncestorUnitIds` |      0 |    10 |        14 |    23 |  23 |
| `src/application/navigation/resolveNavigationTarget.ts`              | `findFirstDescendantRootJobnet`          |      0 |     9 |        14 |    23 |  23 |
| `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`   | `attributeCategory`                      |      0 |     8 |        14 |    24 |  24 |
| `src/application/telemetry/telemetryBuckets.ts`                      | `toCountBucket`                          |      0 |    14 |        13 |    25 |  22 |
| `src/application/telemetry/telemetryBuckets.ts`                      | `toDurationBucket`                       |      0 |    14 |        13 |    25 |  23 |
| `src/presentation/webview/editor/ajsTable/navigation.ts`             | `resolveUnitListGridShortcut`            |      0 |    19 |        12 |    23 |  23 |
| `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts` | `renderConfirmationRequiredItem`         |      0 |    14 |        12 |    44 |  44 |
| `src/application/semantic-diff/buildSemanticDiffReportData.ts`       | `createBuildSemanticDiffReportData`      |      0 |     9 |        12 |    29 |  27 |
| `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts` | `renderScheduleRunChange`                |      0 |     8 |        12 |    35 |  35 |
| `src/application/unit-definition/unitDefinitionDocument.ts`          | `isCommandBuilderField`                  |      0 |    27 |        11 |    27 |  27 |
| `src/presentation/webview/editor/shared/unitTreeNavigation.ts`       | `resolveUnitTreeNavigationKey`           |      0 |    23 |        11 |    38 |  38 |
| `src/presentation/webview/editor/ajsTable/navigation.ts`             | `resolveTableGridFocus`                  |      0 |    19 |        11 |    43 |  42 |
| `src/application/flow-graph/flowGraphDocument.ts`                    | `validateFlowGraphDocument`              |      0 |    11 |        11 |    69 |  67 |
| `src/presentation/webview/viewerHostMessages.ts`                     | `parseViewerHostMessage`                 |      0 |     9 |        11 |    18 |  18 |
| `src/application/telemetry/telemetryEvent.ts`                        | `allowTelemetryProperties`               |      0 |     8 |        11 |    21 |  17 |
| `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`        | `UnitTreeRowFrame`                       |      0 |     7 |        11 |    47 |  47 |
| `src/presentation/vscode/commands/semanticDiffCommand.ts`            | `executeCompareSemanticDiffCommand`      |      0 |     9 |        10 |    46 |  42 |
| `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`    | `resolveNextCurrentUnitId`               |      0 |     7 |        10 |    17 |  17 |
| `src/application/navigation/resolveNavigationTarget.ts`              | `hasParentCycle`                         |      0 |     5 |        10 |    17 |  17 |
| `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`   | `semanticDiffParentJobnetPath`           |      0 |     5 |        10 |    13 |  13 |

## LCOM evidence

The 14 file-level rows with non-zero LCOM are:

| File                                                                  | LCOM |
| --------------------------------------------------------------------- | ---: |
| `src/infrastructure/webapi/Jp1Ajs3WebApiImportAdapter.ts`             |    1 |
| `src/infrastructure/webapi/VscodeWebApiCredentialStore.ts`            |    1 |
| `src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts` |    1 |
| `src/presentation/vscode/languages/registerHoverProvider.ts`          |    1 |
| `src/presentation/vscode/webview/WebviewMediator.ts`                  |    1 |
| `src/infrastructure/parser/raw/AjsRawUnit.ts`                         |    2 |
| `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`              |    1 |
| `src/presentation/vscode/webview/ViewerFactory.ts`                    |    1 |
| `src/infrastructure/i18n/ParameterSyntaxResourceAdapter.ts`           |    1 |
| `src/infrastructure/parser/AntlrAjsParser.ts`                         |    1 |
| `src/infrastructure/parser/AjsEvaluator.ts`                           |    1 |
| `src/presentation/vscode/webview/WebviewStore.ts`                     |    1 |
| `src/bootstrap/extension/MyExtension.ts`                              |    2 |
| `src/infrastructure/parser/SyntaxErrorListener.ts`                    |    1 |

## Smell and duplication evidence

Qlty reported 223 findings in 67 files:

| Finding category              | Count |
| ----------------------------- | ----: |
| Function with high complexity |   115 |
| Function with many returns    |    37 |
| Function with many parameters |    29 |
| High total complexity         |     7 |
| Complex binary expression     |    18 |
| Deeply nested control flow    |     1 |
| Similar-code findings         |    14 |
| Total finding lines           |   223 |

The 14 duplication findings form these seven reciprocal pairs:

| Similar-code lines | Mass | Pair                                                                                                                                   |
| -----------------: | ---: | -------------------------------------------------------------------------------------------------------------------------------------- |
|                 18 |   68 | `src/application/unit-list/buildUnitListView.ts` / `src/application/webapi-import/importAjsDefinitionViaWebApi.ts`                     |
|                 15 |   78 | `src/domain/services/i18n/nls.ts` / `src/presentation/webview/editor/unitInformationLocalization.ts`                                   |
|                 16 |   73 | `src/presentation/webview/editor/ajsFlow/FlowContents.tsx` / `src/presentation/webview/editor/ajsTable/TableContents.tsx`              |
|                 21 |   74 | `src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx` / `src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx` |
|                 16 |   91 | `src/presentation/webview/editor/ajsFlow/Header.tsx` / `src/presentation/webview/editor/ajsTable/Header.tsx`                           |
|                233 |  976 | `src/resource/i18n/ajscolumn_en.ts` / `src/resource/i18n/ajscolumn_ja.ts`                                                              |
|        286 and 281 | 1206 | `src/resource/i18n/message_en.ts` / `src/resource/i18n/message_ja.ts`                                                                  |

Complete smell output, including line locations and function names, is retained
below without snippets:

```text


src/application/editor-feedback/findParameterHover.ts
  14  Function with high complexity (count = 6): createFindParameterHover

src/application/editor-feedback/syntaxDiagnosticTransferRuleBuilders.ts
  14  Function with many returns (count = 8): getTransferDiagnosticMessage

src/application/flow-graph/buildExpandedFlowGraph.ts
   1  High total complexity (count = 71)
  91  Function with high complexity (count = 6): isDescendantOf
 112  Function with high complexity (count = 19): normalizeRequestedExpandedUnitIds
 231  Function with high complexity (count = 17): appendExpandedUnitContent
 278  Function with high complexity (count = 9): buildExpandedStructure
 311  Function with high complexity (count = 9): buildContainment
 347  Function with high complexity (count = 6): buildExpandedUnitConstraints

src/application/flow-graph/buildFlowGraph.ts
  57  Function with high complexity (count = 6): toAncestorNodes
  97  Function with high complexity (count = 5): buildFlowGraphFromValidatedDocument

src/application/flow-graph/buildSemanticDiffFlowHighlights.ts
  40  Function with many parameters (count = 5): addHighlight
  40  Function with high complexity (count = 5): addHighlight
  70  Function with high complexity (count = 5): unitTargetId
 126  Function with high complexity (count = 6): buildSemanticDiffFlowHighlights

src/application/flow-graph/flowGraphDocument.ts
 275  Function with many parameters (count = 4): readUnit
 275  Function with many returns (count = 4): readUnit
 442  Function with many returns (count = 4): validateFlowGraphDocument
 201  Complex binary expression
   1  High total complexity (count = 101)
  83  Function with high complexity (count = 14): toFlowGraphUnitWithoutChildren
 112  Function with high complexity (count = 5): toFlowGraphUnitDto
 237  Function with high complexity (count = 7): readRelations
 275  Function with high complexity (count = 33): readUnit
 380  Function with high complexity (count = 26): readRootUnits
 442  Function with high complexity (count = 11): validateFlowGraphDocument

src/application/navigation/resolveNavigationTarget.ts
 163  Function with many returns (count = 6): resolveFlowScopeUnit
 241  Function with many returns (count = 5): resolveFlowNavigationTarget
   1  High total complexity (count = 82)
  82  Function with high complexity (count = 10): hasParentCycle
 115  Function with high complexity (count = 14): findFirstDescendantRootJobnet
 143  Function with high complexity (count = 9): findNearestJobnetAncestor
 163  Function with high complexity (count = 16): resolveFlowScopeUnit
 198  Function with high complexity (count = 14): collectRequiredExpandedAncestorUnitIds
 222  Function with high complexity (count = 5): unavailableTarget
 241  Function with high complexity (count = 8): resolveFlowNavigationTarget

src/application/semantic-diff/buildSemanticDiffReportData.ts
  38  Function with high complexity (count = 12): createBuildSemanticDiffReportData

src/application/semantic-diff/compareScheduleDiff.ts
  52  Function with many returns (count = 11): unsupportedScheduleMessage
 119  Function with high complexity (count = 8): toScheduleRunChange

src/application/semantic-diff/compareSemanticDiff.ts
 377  Function with many returns (count = 5): createEvidenceConfirmation
 177  Function with high complexity (count = 6): createFingerprintMatchChanges
 313  Function with high complexity (count = 6): createRelationChanges

src/application/telemetry/searchTelemetryData.ts
  37  Complex binary expression
  34  Function with high complexity (count = 8): isSearchTelemetryData

src/application/telemetry/telemetryBuckets.ts
  44  Function with many returns (count = 7): toDurationBucket
  70  Function with many returns (count = 7): toCountBucket
  96  Function with many returns (count = 8): toHttpStatusCategory
  44  Function with high complexity (count = 13): toDurationBucket
  70  Function with high complexity (count = 13): toCountBucket
  96  Function with high complexity (count = 6): toHttpStatusCategory

src/application/telemetry/telemetryEvent.ts
 599  Function with high complexity (count = 11): allowTelemetryProperties

src/application/telemetry/viewerActionTelemetry.ts
  59  Function with high complexity (count = 8): createViewerNavigationActionEvent

src/application/telemetry/viewerPerformanceTelemetryData.ts
  41  Complex binary expression

src/application/telemetry/viewerTelemetry.ts
  41  Function with high complexity (count = 7): createLegacyViewerOpenedEvent

src/application/unit-definition/unitDefinitionDocument.ts
  39  Function with many returns (count = 4): isCommandBuilderField
  27  Complex binary expression
  59  Complex binary expression
  76  Complex binary expression
  93  Complex binary expression
  39  Function with high complexity (count = 11): isCommandBuilderField

src/application/unit-list/buildUnitListView.ts
 177  Found 18 lines of similar code in 2 locations (mass = 68)
        also found at src/application/webapi-import/importAjsDefinitionViaWebApi.ts

src/application/unit-list/unitListDefaultAwareHelpers.ts
  41  Function with many parameters (count = 4): findDefaultAwareParameterValue

src/application/unit-list/unitListDocument.ts
 100  Complex binary expression
 277  Complex binary expression
 391  Complex binary expression
 418  Complex binary expression
 488  Complex binary expression
 517  Complex binary expression
 258  Function with high complexity (count = 7): isUnitListRowRecord
 467  Function with high complexity (count = 7): hasMatchingProjectionIdentity
 513  Function with high complexity (count = 5): toUnitListTableData

src/application/webapi-import/importAjsDefinitionViaWebApi.ts
  50  Found 18 lines of similar code in 2 locations (mass = 68)
        also found at src/application/unit-list/buildUnitListView.ts

src/bootstrap/extension/extensionDependencies.ts
  54  Function with high complexity (count = 6): instrumentParserPerformance

src/bootstrap/extension/viewerWiring.ts
 143  Function with many returns (count = 4): revealCounterpartPanel
 143  Function with high complexity (count = 8): revealCounterpartPanel
 191  Function with high complexity (count = 10): createViewerBundle
 234  Function with high complexity (count = 5): onNavigate

src/domain/services/diagnostics/EventDiagnosticRules.ts
  19  Function with many parameters (count = 4): parseExplicitEventDecimalInRange
  19  Function with high complexity (count = 7): parseExplicitEventDecimalInRange
  34  Function with high complexity (count = 5): parseExplicitHexadecimalInRange
  96  Function with high complexity (count = 5): parseHashEscapedQuotedEventStringContent
 132  Function with high complexity (count = 5): hasValidExplicitEventReceivingTimeoutCondition

src/domain/services/diagnostics/JobEndDiagnosticRules.ts
   7  Function with high complexity (count = 6): parseExplicitJobEndDecimalInRange

src/domain/services/diagnostics/MonitoringWaitDiagnosticRules.ts
   5  Function with high complexity (count = 5): parseExplicitMonitoringWaitDecimalInRange

src/domain/services/diagnostics/TransferDiagnosticRules.ts
  18  Function with many returns (count = 4): hasValidExplicitTransferFileValue
  18  Function with high complexity (count = 7): hasValidExplicitTransferFileValue

src/domain/services/diagnostics/evaluateEventDiagnosticViolations.ts
 253  Function with high complexity (count = 6): evaluateFilterAggregateViolation
 296  Function with high complexity (count = 6): evaluateStartConditionViolations

src/domain/services/diagnostics/evaluateJobEndDiagnosticViolations.ts
 187  Function with many parameters (count = 4): evaluateRetryDependencyViolations
 135  Function with high complexity (count = 7): evaluateThresholdOrderingViolations
 187  Function with high complexity (count = 7): evaluateRetryDependencyViolations

src/domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations.ts
  63  Function with many parameters (count = 5): evaluateAllParameters

src/domain/services/diagnostics/evaluateTransferDiagnosticViolations.ts
  61  Function with many parameters (count = 5): evaluateAll

src/domain/services/i18n/nls.ts
 144  Found 15 lines of similar code in 2 locations (mass = 78)
        also found at src/presentation/webview/editor/unitInformationLocalization.ts

src/domain/services/semantic-diff/semanticDiffScheduleRules.ts
 286  Function with many parameters (count = 4): createRunsForScheduleDate
 320  Function with many parameters (count = 5): unsupportedScheduleDateDecision
 242  Function with many returns (count = 4): explicitDateCandidates
 320  Function with many returns (count = 4): unsupportedScheduleDateDecision
   1  High total complexity (count = 59)
 126  Function with high complexity (count = 5): toUtcDate
 242  Function with high complexity (count = 18): explicitDateCandidates
 286  Function with high complexity (count = 7): createRunsForScheduleDate
 320  Function with high complexity (count = 7): unsupportedScheduleDateDecision

src/domain/services/semantic-diff/semanticDiffStructuralRules.ts
 166  Function with many parameters (count = 5): matchExactUnits
 328  Function with many returns (count = 8): attributeCategory
 100  Function with high complexity (count = 10): semanticDiffParentJobnetPath
 188  Function with high complexity (count = 5): matchFingerprintUnits
 328  Function with high complexity (count = 14): attributeCategory

src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts
  94  Function with many returns (count = 5): describeTarget
 120  Function with many returns (count = 4): localizedUnitChange
 150  Function with many returns (count = 4): localizedChangeSummary
   1  High total complexity (count = 90)
  64  Function with high complexity (count = 5): pluralize
 120  Function with high complexity (count = 6): localizedUnitChange
 150  Function with high complexity (count = 16): localizedChangeSummary
 178  Function with high complexity (count = 8): localizedRationale
 190  Function with high complexity (count = 5): renderChangeDetails
 223  Function with high complexity (count = 5): renderAttributeChanges
 249  Function with high complexity (count = 12): renderConfirmationRequiredItem
 294  Function with high complexity (count = 12): renderScheduleRunChange

src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts
 208  Function with many parameters (count = 4): reportUnavailableImport
 228  Function with many parameters (count = 4): reportCancelledImport
 254  Function with many parameters (count = 4): reportImportResult
 270  Function with many parameters (count = 4): reportImportSuccess
 292  Function with many parameters (count = 4): reportImportFailure
 302  Function with many parameters (count = 4): reportWebApiImportFailure
 345  Function with high complexity (count = 5): collectInputSteps

src/presentation/vscode/commands/openPreviewCommand.ts
  50  Function with many parameters (count = 4): reportViewerOpenStarted

src/presentation/vscode/commands/semanticDiffCommand.ts
  89  Function with many returns (count = 6): executeCompareSemanticDiffCommand
  89  Function with high complexity (count = 10): executeCompareSemanticDiffCommand

src/presentation/vscode/diagnostics/registerDiagnostics.ts
  85  Function with many parameters (count = 4): updateDiagnostics
  36  Function with high complexity (count = 5): reportDiagnosticsTelemetry

src/presentation/vscode/webview/ajsDocument.ts
  27  Function with many parameters (count = 4): postAjsDocument

src/presentation/vscode/webview/viewerMessageRouting.ts
 116  Function with many returns (count = 6): dispatchViewerRequest
 144  Function with high complexity (count = 7): createViewerMessageHandler

src/presentation/webview/editor/ajsFlow/FlowContents.tsx
 159  Function with many returns (count = 20): FlowGraphPanelComponent
 754  Function with many returns (count = 5): FlowContents
   1  High total complexity (count = 162)
 127  Function with high complexity (count = 19): useSyncSelectedFlowNode
 138  Function with high complexity (count = 8): syncSelectedNode
 159  Function with high complexity (count = 90): FlowGraphPanelComponent
 754  Function with high complexity (count = 48): FlowContents
 610  Found 16 lines of similar code in 2 locations (mass = 73)
        also found at src/presentation/webview/editor/ajsTable/TableContents.tsx

src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx
  78  Found 21 lines of similar code in 2 locations (mass = 74)
        also found at src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx

src/presentation/webview/editor/ajsFlow/Header.tsx
 177  Function with high complexity (count = 6): RelationshipFocusButton
  79  Found 16 lines of similar code in 2 locations (mass = 91)
        also found at src/presentation/webview/editor/ajsTable/Header.tsx

src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts
 100  Function with many parameters (count = 4): createExpandedFlowGraphContext
  64  Function with high complexity (count = 8): initializePositions

src/presentation/webview/editor/ajsFlow/expandedFlowGraphGrowthOffsets.ts
 329  Function with high complexity (count = 6): applyExpandedChildrenGrowthOffsets

src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts
 200  Function with high complexity (count = 5): buildExpandedPanelSubtreeBounds

src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx
 251  Function with high complexity (count = 9): NodeStatusIndicators

src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts
 154  Function with high complexity (count = 9): useSearchSubmitHandler
 210  Function with high complexity (count = 6): useRevealUnitHandler
 240  Function with high complexity (count = 6): useFlowSearchState

src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts
 263  Function with many returns (count = 4): runFlowViewerFitViewEffect
 406  Function with many returns (count = 4): resolveNextCurrentUnitId
 263  Function with high complexity (count = 6): runFlowViewerFitViewEffect
 406  Function with high complexity (count = 10): resolveNextCurrentUnitId

src/presentation/webview/editor/ajsTable/Header.tsx
  92  Found 16 lines of similar code in 2 locations (mass = 91)
        also found at src/presentation/webview/editor/ajsFlow/Header.tsx

src/presentation/webview/editor/ajsTable/TableContents.tsx
 412  Function with many returns (count = 5): TableContents
 412  Function with high complexity (count = 43): TableContents
 314  Found 17 lines of similar code in 2 locations (mass = 73)
        also found at src/presentation/webview/editor/ajsFlow/FlowContents.tsx

src/presentation/webview/editor/ajsTable/TableHeader.tsx
  46  Function with high complexity (count = 7): getTableHeaderAriaSort
  54  Function with high complexity (count = 5): renderSortableHeaderContent
  96  Function with high complexity (count = 18): renderHeaderCell

src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx
  84  Function with many parameters (count = 4): buildUnitListDetailActions
  44  Found 21 lines of similar code in 2 locations (mass = 74)
        also found at src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx

src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx
 318  Function with many returns (count = 14): VirtualizedTable
   1  High total complexity (count = 109)
 161  Function with high complexity (count = 7): revealGridFocusElement
 318  Function with high complexity (count = 96): VirtualizedTable

src/presentation/webview/editor/ajsTable/navigation.ts
  96  Function with many parameters (count = 5): resolveTableGridFocus
 140  Function with many parameters (count = 5): resolveTableGridRestorationFocus
 174  Function with many parameters (count = 4): cellFocus
 331  Function with many parameters (count = 4): isTableGridNavigationEventOwnedByCell
  54  Function with many returns (count = 5): resolveUnitListGridShortcut
  96  Function with many returns (count = 6): resolveTableGridFocus
 187  Function with many returns (count = 6): moveHeaderFocus
 233  Function with many returns (count = 9): moveCellFocus
 292  Deeply nested control flow (level = 4)
 321  Complex binary expression
   1  High total complexity (count = 122)
  54  Function with high complexity (count = 12): resolveUnitListGridShortcut
  87  Function with high complexity (count = 5): getTableGridFocusKey
  96  Function with high complexity (count = 11): resolveTableGridFocus
 140  Function with high complexity (count = 6): resolveTableGridRestorationFocus
 187  Function with high complexity (count = 25): moveHeaderFocus
 233  Function with high complexity (count = 42): moveCellFocus

src/presentation/webview/editor/ajsTable/tableSearchController.ts
  39  Function with high complexity (count = 9): useTableSearchController

src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx
 421  Function with many returns (count = 7): SharedUnitDetailPane
  91  Function with high complexity (count = 7): resolveDetailPaneShortcut
 169  Function with high complexity (count = 6): StateChip
 421  Function with high complexity (count = 20): SharedUnitDetailPane
 439  Function with high complexity (count = 6): handleKeyDown

src/presentation/webview/editor/shared/UnitTreeSelector.tsx
 200  Function with many parameters (count = 4): collectRequiredExpandedUnitIds
 235  Function with many parameters (count = 4): useExpandedUnitTreeState
 591  Function with many returns (count = 4): UnitTreeSelectorUnit
 855  Function with many returns (count = 19): UnitTreeSelector
 182  Complex binary expression
1013  Complex binary expression
1086  Complex binary expression
   1  High total complexity (count = 147)
 398  Function with high complexity (count = 5): resolveUnitTreeRowBorderStyle
 543  Function with high complexity (count = 11): UnitTreeRowFrame
 591  Function with high complexity (count = 18): UnitTreeSelectorUnit
 855  Function with high complexity (count = 70): UnitTreeSelector

src/presentation/webview/editor/shared/unitTreeNavigation.ts
  49  Function with many parameters (count = 4): toVisibleUnitTreeRow
 105  Function with many parameters (count = 4): resolveVisibleUnitTreeRows
 271  Function with many returns (count = 4): resolveUnitTreeNavigationKey
 282  Complex binary expression
 295  Complex binary expression
 271  Function with high complexity (count = 11): resolveUnitTreeNavigationKey

src/presentation/webview/editor/unitInformationLocalization.ts
  67  Function with high complexity (count = 6): unitInformationUnitTypeLabel
 143  Found 17 lines of similar code in 2 locations (mass = 78)
        also found at src/domain/services/i18n/nls.ts

src/presentation/webview/viewerHostMessages.ts
 108  Function with many returns (count = 5): parseViewerHostMessage
  83  Complex binary expression
  76  Function with high complexity (count = 5): parseViewerDocumentChangedMessage
 108  Function with high complexity (count = 11): parseViewerHostMessage

src/presentation/webview/viewerRequestMessages.ts
 128  Function with many returns (count = 9): parseViewerRequest
  97  Function with high complexity (count = 5): parseViewerNavigationRequest
 128  Function with high complexity (count = 25): parseViewerRequest

src/resource/i18n/ajscolumn_en.ts
   1  Found 233 lines of similar code in 2 locations (mass = 976)
        also found at src/resource/i18n/ajscolumn_ja.ts

src/resource/i18n/ajscolumn_ja.ts
   1  Found 233 lines of similar code in 2 locations (mass = 976)
        also found at src/resource/i18n/ajscolumn_en.ts

src/resource/i18n/message_en.ts
   1  Found 286 lines of similar code in 2 locations (mass = 1206)
        also found at src/resource/i18n/message_ja.ts

src/resource/i18n/message_ja.ts
   1  Found 281 lines of similar code in 2 locations (mass = 1206)
        also found at src/resource/i18n/message_en.ts
```

## Slice 2: Auditable refactoring priority (in progress)

Slice 2 now records a complete candidate ranking using the fixed-history calculation. Four candidates exist at the baseline commit but have zero current-path touches in the approved 100-commit window; their zero is an observed value and they receive change-frequency Tier 1. The incomplete architecture-suite result from Slice 1 remains an explicit validation caveat; it is not upgraded to a pass.

### Fixed Git history window

The exact approved command is:

```text
git log --first-parent --no-merges --format='%H' --name-only -n 100 \
  14d94fa3602fc4f6f467eccac35bc588ee44b9bb -- src/domain src/application src/infrastructure \
  src/presentation src/bootstrap src/resource src/extension.ts
```

The window contains 100 non-merge first-parent commits ending at baseline
commit `14d94fa3602fc4f6f467eccac35bc588ee44b9bb`. The newest included commit
is `573edfe099500ff61547e2c8d4374d30534b54d6`; the oldest is
`29e212569c671f988f9bcec6bfaf9e5e1a75f366`. The 100-commit cap is reached out
of 129 matching commits. Rename history is not merged into current paths; 23
rename records were observed. Distinct file touches are counted once per file
per commit.

All 253 Qlty-measured files have a reliable current-path touch count in the
fixed window: 245 have one or more touches and 8 have an observed count of
zero. Qlty reported 67 smell files, and the candidate union contains 130
files. A candidate has a structural tier of 5 when it is in the top 51 rows of
at least one available file dimension; the tier formula is
`ceil(5 * (N - rank + 1) / N)` with stable full-path ordering for equal raw
values.

### Structural cutoff evidence

| Dimension | Tier-5 boundary                                                               | Equal-value boundary tie                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cyclo`   | rank 51, raw 23, `src/presentation/webview/editor/ajsFlow/flowSearchState.ts` | 4 rows; stable path order from `src/domain/services/diagnostics/evaluateJobEndDiagnosticViolations.ts` through `src/presentation/webview/editor/ajsFlow/flowSearchState.ts` |
| `complex` | rank 51, raw 15, `src/application/flow-graph/buildFlowGraph.ts`               | 7 rows; stable path order from `src/application/flow-graph/buildFlowGraph.ts` through `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`                           |
| `lines`   | rank 51, raw 221, `src/application/unit-list/buildUnitListRemainingGroups.ts` | 1 row                                                                                                                                                                       |
| `LOC`     | rank 51, raw 192, `src/application/semantic-diff/compareScheduleDiff.ts`      | 3 rows; stable path order through `src/resource/i18n/ajscolumn_ja.ts`                                                                                                       |
| `LCOM`    | rank 51, raw 0, `src/application/unit-definition/buildAjsCommandBuilders.ts`  | 239 rows share zero; all are ordered by full path, including the cutoff, rather than being treated as equivalent rank                                                       |

### Ranking status and observed zero-touch candidates

All 130 candidates have been recalculated using structural tier × change-frequency tier × cited business-criticality. Priority ties use structural tier, then change-frequency tier, then full path. The four candidates below exist at the baseline commit and have zero current-path touches in the fixed 100-commit set. Their zero is an observed value, not a missing factor, so each participates in the ranking with change-frequency Tier 1.

| Candidate                           | Layer / responsibility            | Candidate evidence   | Criticality basis | Fixed-window observation                                                                 |
| ----------------------------------- | --------------------------------- | -------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `src/domain/values/AjsType.ts`      | Domain / JP1/AJS supporting value | structural candidate | 5, `C5-MODEL`     | baseline path exists; 0 current-path touches; change-frequency Tier 1; structural Tier 5 |
| `src/resource/i18n/ajscolumn_en.ts` | Resource / localization resources | smell candidate      | 2, `C2-RESOURCE`  | baseline path exists; 0 current-path touches; change-frequency Tier 1; structural Tier 5 |
| `src/resource/i18n/ajscolumn_ja.ts` | Resource / localization resources | smell candidate      | 2, `C2-RESOURCE`  | baseline path exists; 0 current-path touches; change-frequency Tier 1; structural Tier 5 |
| `src/resource/i18n/parameter_en.ts` | Resource / localization resources | structural candidate | 2, `C2-RESOURCE`  | baseline path exists; 0 current-path touches; change-frequency Tier 1; structural Tier 5 |

Criticality basis citations and rationale are: `C5-MODEL` uses `docs/specs/architecture.md` Domain/Application boundaries and the unit-list, flow-graph, and diagnostics use cases because JP1/AJS model rules feed several core workflows; `C2-RESOURCE` uses the Source Layout section of `docs/specs/architecture.md` because static localization supports workflows but has no direct JP1/AJS rule responsibility. The remaining ranked classification follows the same architecture-layer and use-case mapping: diagnostics (`uc-diagnose-ajs-definition.md`), flow (`uc-build-flow-graph.md`, `uc-explore-flow-graph.md`), list (`uc-view-unit-list.md`, `uc-export-unit-list-csv.md`), navigation, semantic diff, hover, unit definition, WebAPI import, and the architecture-defined composition, transport, telemetry, parser, and host boundaries. Raw Qlty file/function and smell evidence remains in this report; no refactoring target is selected.

### Function-level evidence cross-reference

| File                                                                            | Reported function evidence                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/application/editor-feedback/buildSyntaxDiagnostics.ts`                     | createBuildSyntaxDiagnostics (cyc 4, cog 3); mapParserErrorToSyntaxDiagnostic (cyc 1, cog 0)                                                                                                                                                                                 |
| `src/application/editor-feedback/diagnosticSourceRange.ts`                      | toDiagnosticSourceRange (cyc 4, cog 0)                                                                                                                                                                                                                                       |
| `src/application/editor-feedback/findParameterHover.ts`                         | createFindParameterHover (cyc 3, cog 6)                                                                                                                                                                                                                                      |
| `src/application/editor-feedback/mapDiagnosticViolation.ts`                     | createMapDiagnosticViolation (cyc 1, cog 0)                                                                                                                                                                                                                                  |
| `src/application/editor-feedback/ParameterSyntaxLookupPort.ts`                  | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/editor-feedback/syntaxDiagnosticEventRuleBuilders.ts`          | buildEventReceivingDiagnostics (cyc 6, cog 0); buildEventSendingDiagnostics (cyc 2, cog 0); mapEventDiagnosticViolation (cyc 1, cog 0)                                                                                                                                       |
| `src/application/editor-feedback/syntaxDiagnosticJobEndRuleBuilders.ts`         | buildJobEndJudgmentDiagnostics (cyc 2, cog 0); staticMessage (cyc 1, cog 0)                                                                                                                                                                                                  |
| `src/application/editor-feedback/syntaxDiagnosticMonitoringWaitRuleBuilders.ts` | buildFileMonitoringDiagnostics (cyc 2, cog 0); buildExecutionIntervalControlDiagnostics (cyc 2, cog 0); mapMonitoringWaitDiagnosticViolation (cyc 1, cog 0)                                                                                                                  |
| `src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts`               | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/editor-feedback/syntaxDiagnosticRules.ts`                      | withDiagnosticCategory (cyc 2, cog 0); buildSemanticSyntaxDiagnostics (cyc 1, cog 0)                                                                                                                                                                                         |
| `src/application/editor-feedback/syntaxDiagnosticScheduleRuleBuilders.ts`       | buildScheduleRuleDiagnostics (cyc 2, cog 0)                                                                                                                                                                                                                                  |
| `src/application/editor-feedback/syntaxDiagnosticTransferRuleBuilders.ts`       | getTransferDiagnosticMessage (cyc 9, cog 2); buildTransferOperationDiagnostics (cyc 2, cog 0); buildQueueTransferFileDiagnostics (cyc 2, cog 0); getTransferFileIndex (cyc 2, cog 0); mapTransferDiagnosticViolation (cyc 1, cog 0)                                          |
| `src/application/editor-feedback/syntaxDiagnosticTypes.ts`                      | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/flow-graph/buildExpandedFlowGraph.ts`                          | appendExpandedUnitContent (cyc 12, cog 17); normalizeRequestedExpandedUnitIds (cyc 9, cog 19); buildExpandedUnitConstraints (cyc 20, cog 6); buildContainment (cyc 11, cog 9); buildExpandedStructure (cyc 10, cog 9)                                                        |
| `src/application/flow-graph/buildFlowGraph.ts`                                  | buildFlowGraphFromValidatedDocument (cyc 6, cog 5); toInput (cyc 7, cog 2); toAncestorNodes (cyc 3, cog 6); buildFlowGraphResult (cyc 3, cog 2); toEdgeDtos (cyc 2, cog 0)                                                                                                   |
| `src/application/flow-graph/buildFlowGraphCore.ts`                              | buildFlowGraphFromInput (cyc 5, cog 2); toNodeType (cyc 2, cog 0); toGridNode (cyc 1, cog 0); toAncestorNode (cyc 1, cog 0); flowGraphEdgeSemanticDiffKey (cyc 1, cog 0)                                                                                                     |
| `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`                 | buildSemanticDiffFlowHighlights (cyc 9, cog 6); unitTargetId (cyc 7, cog 5); addHighlight (cyc 5, cog 5); targetExistsInAfterDocument (cyc 3, cog 4); mergeHighlightKind (cyc 3, cog 2)                                                                                      |
| `src/application/flow-graph/flowGraphDocument.ts`                               | readUnit (cyc 34, cog 33); hasValidUnitFields (cyc 44, cog 3); readRootUnits (cyc 15, cog 26); toFlowGraphUnitWithoutChildren (cyc 17, cog 14); validateFlowGraphDocument (cyc 11, cog 11)                                                                                   |
| `src/application/navigation/resolveNavigationTarget.ts`                         | resolveFlowScopeUnit (cyc 10, cog 16); collectRequiredExpandedAncestorUnitIds (cyc 10, cog 14); findFirstDescendantRootJobnet (cyc 9, cog 14); resolveFlowNavigationTarget (cyc 7, cog 8); hasParentCycle (cyc 5, cog 10)                                                    |
| `src/application/parsing/AjsParserPort.ts`                                      | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/semantic-diff/buildSemanticDiffReportData.ts`                  | createBuildSemanticDiffReportData (cyc 9, cog 12); toParserErrors (cyc 2, cog 0)                                                                                                                                                                                             |
| `src/application/semantic-diff/compareScheduleDiff.ts`                          | toScheduleRunChange (cyc 9, cog 8); unsupportedScheduleMessage (cyc 12, cog 2); compareScheduleDiff (cyc 9, cog 4); createPeriodUnsupportedItem (cyc 2, cog 2); createUnsupportedItem (cyc 1, cog 0)                                                                         |
| `src/application/semantic-diff/compareSemanticDiff.ts`                          | createFingerprintMatchChanges (cyc 6, cog 6); createRelationChanges (cyc 6, cog 6); createEvidenceConfirmation (cyc 7, cog 4); createAttributeChanges (cyc 7, cog 4); createUnitChange (cyc 6, cog 4)                                                                        |
| `src/application/semantic-diff/semanticDiffDto.ts`                              | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/telemetry/editorFeedbackTelemetry.ts`                          | createHoverTelemetryEvent (cyc 1, cog 0); createDiagnosticsEvaluatedTelemetryEvent (cyc 1, cog 0); createDiagnosticsReportedTelemetryEvent (cyc 1, cog 0)                                                                                                                    |
| `src/application/telemetry/performanceTelemetry.ts`                             | createPerformanceTelemetryEvent (cyc 1, cog 0)                                                                                                                                                                                                                               |
| `src/application/telemetry/searchTelemetry.ts`                                  | createSearchTelemetryEvent (cyc 1, cog 0)                                                                                                                                                                                                                                    |
| `src/application/telemetry/searchTelemetryData.ts`                              | isSearchTelemetryData (cyc 26, cog 8); isRecord (cyc 4, cog 1); isOptionalCountBucket (cyc 3, cog 1); isOptionalDurationBucket (cyc 3, cog 1)                                                                                                                                |
| `src/application/telemetry/telemetryBuckets.ts`                                 | toDurationBucket (cyc 14, cog 13); toCountBucket (cyc 14, cog 13); toHttpStatusCategory (cyc 11, cog 6); isTelemetryDurationBucket (cyc 1, cog 0); isTelemetryCountBucket (cyc 1, cog 0)                                                                                     |
| `src/application/telemetry/telemetryEvent.ts`                                   | allowTelemetryProperties (cyc 8, cog 11); createTelemetryEvent (cyc 1, cog 0)                                                                                                                                                                                                |
| `src/application/telemetry/TelemetryPort.ts`                                    | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/telemetry/viewerActionTelemetry.ts`                            | createViewerNavigationActionEvent (cyc 10, cog 8); findViewerActionDefinition (cyc 5, cog 4); resolveViewerActionView (cyc 3, cog 4); createViewerActionEvent (cyc 2, cog 2)                                                                                                 |
| `src/application/telemetry/viewerOperation.ts`                                  | — (no function row)                                                                                                                                                                                                                                                          |
| `src/application/telemetry/viewerPerformanceTelemetryData.ts`                   | isViewerPerformanceTelemetryData (cyc 10, cog 3); isRecord (cyc 4, cog 1); isOptionalCountBucket (cyc 3, cog 1); isOptionalDurationBucket (cyc 3, cog 1)                                                                                                                     |
| `src/application/telemetry/viewerTelemetry.ts`                                  | createLegacyViewerOpenedEvent (cyc 6, cog 7); resolveViewerTelemetryKind (cyc 3, cog 4); getViewerEventDefinition (cyc 4, cog 2); createViewerEvent (cyc 2, cog 2); createViewerReadyEvent (cyc 1, cog 0)                                                                    |
| `src/application/telemetry/webApiImportTelemetry.ts`                            | createWebApiImportWorkflowEvent (cyc 5, cog 4)                                                                                                                                                                                                                               |
| `src/application/unit-definition/buildAjsCommandBuilders.ts`                    | buildAjsCommandBuilders (cyc 1, cog 0); commandBuilderChoice (cyc 1, cog 0); commonUnitTypeChoice (cyc 1, cog 0); ajsprintJobGroupChoice (cyc 1, cog 0)                                                                                                                      |
| `src/application/unit-definition/buildCommandLine.ts`                           | selectFieldTokens (cyc 6, cog 4); trimmedTextFieldValue (cyc 4, cog 4); independentTextFieldTokens (cyc 4, cog 4); selectChoiceArgumentTokens (cyc 3, cog 4); commandFieldTokens (cyc 4, cog 2)                                                                              |
| `src/application/unit-definition/unitDefinitionDocument.ts`                     | isCommandBuilderField (cyc 27, cog 11); isCommandBuilder (cyc 22, cog 4); isUnitDefinition (cyc 11, cog 1); isChoice (cyc 9, cog 2); isCommand (cyc 7, cog 1)                                                                                                                |
| `src/application/unit-list/buildUnitListRemainingGroups.ts`                     | buildGroup17View (cyc 3, cog 4); isCustomJob (cyc 4, cog 1); isFlexibleJob (cyc 4, cog 1); buildGroup18View (cyc 2, cog 2); buildGroup13View (cyc 1, cog 0)                                                                                                                  |
| `src/application/unit-list/buildUnitListView.ts`                                | buildUnitListProjection (cyc 5, cog 3); buildUnitListView (cyc 3, cog 0); omitUndefinedFields (cyc 3, cog 0); omitUndefinedGroupFields (cyc 1, cog 0)                                                                                                                        |
| `src/application/unit-list/unitListDefaultAwareHelpers.ts`                      | findDefaultAwareParameterValue (cyc 3, cog 2); isEventSendingJob (cyc 4, cog 1); isFileMonitoringJob (cyc 4, cog 1); isExecutionIntervalControlJob (cyc 4, cog 1); isQueueJob (cyc 4, cog 1)                                                                                 |
| `src/application/unit-list/unitListDocument.ts`                                 | isUnitListRowRecord (cyc 59, cog 7); hasMatchingProjectionIdentity (cyc 49, cog 7); isUnitListRootDto (cyc 44, cog 3); isUnitListUnitMetadata (cyc 17, cog 3); toUnitListTableData (cyc 13, cog 5)                                                                           |
| `src/application/unit-list/unitListPriorityViewHelpers.ts`                      | explicitPrPriority (cyc 6, cog 3); getPriorityForUnitTypes (cyc 4, cog 4); resolveExplicitPriority (cyc 4, cog 3); resolveParentPriority (cyc 3, cog 3); explicitNiPriority (cyc 3, cog 2)                                                                                   |
| `src/application/unit-list/unitListScheduleValueHelpers.ts`                     | buildEffectiveStartConditionMonitoringViews (cyc 6, cog 3); scheduleDateType (cyc 4, cog 2); cftdScheduleByDaysFromStart (cyc 4, cog 2); scheduleDateDay (cyc 3, cog 3); cftdMaxShiftableDays (cyc 3, cog 2)                                                                 |
| `src/application/webapi-import/importAjsDefinitionViaWebApi.ts`                 | createImportedAjsDefinitionContent (cyc 3, cog 0); createImportAjsDefinitionError (cyc 1, cog 0); createImportAjsDefinitionViaWebApi (cyc 1, cog 0)                                                                                                                          |
| `src/bootstrap/extension/extensionDependencies.ts`                              | instrumentParserPerformance (cyc 5, cog 6); parse (cyc 5, cog 4); createExtensionDependencies (cyc 1, cog 0); createDesktopWebApiImportCapability (cyc 1, cog 0); importDefinition (cyc 1, cog 0)                                                                            |
| `src/bootstrap/extension/MyExtension.ts`                                        | constructor (cyc 1, cog 0); init (cyc 1, cog 0); telemetry (cyc 1, cog 0); context (cyc 1, cog 0); dispose (cyc 1, cog 0)                                                                                                                                                    |
| `src/bootstrap/extension/viewerWiring.ts`                                       | revealCounterpartPanel (cyc 7, cog 8); createViewerBundle (cyc 4, cog 10); onNavigate (cyc 3, cog 5); createViewerReadyHandler (cyc 2, cog 3); resolveTargetViewType (cyc 3, cog 2)                                                                                          |
| `src/domain/models/parameters/scheduleRuleHelpers.ts`                           | resolveEffectiveStartConditionMonitoringPair (cyc 11, cog 3); parseRuleValue (cyc 4, cog 4); parseScheduleDateValue (cyc 3, cog 2); resolveScheduleByDaysFromStart (cyc 3, cog 2); resolveMaxShiftableDays (cyc 3, cog 2)                                                    |
| `src/domain/services/diagnostics/evaluateEventDiagnosticViolations.ts`          | evaluateFilterAggregateViolation (cyc 5, cog 6); evaluateStartConditionViolations (cyc 4, cog 6); evaluateParameterRules (cyc 4, cog 4); isInvalid (cyc 4, cog 1); isExplicitTarget (cyc 2, cog 2)                                                                           |
| `src/domain/services/diagnostics/evaluateJobEndDiagnosticViolations.ts`         | evaluateRetryDependencyViolations (cyc 7, cog 7); evaluateThresholdOrderingViolations (cyc 6, cog 7); evaluateJobEndRangeViolations (cyc 5, cog 4); collectRetryParameterViolations (cyc 3, cog 3); isJobEndDiagnosticTarget (cyc 2, cog 2)                                  |
| `src/domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations.ts` | evaluateFileMonitoringViolationsForUnit (cyc 11, cog 3); evaluateExecutionIntervalViolationsForUnit (cyc 5, cog 3); evaluateExecutionTimeContextViolation (cyc 3, cog 3); evaluateAllParameters (cyc 3, cog 3); isExplicitTarget (cyc 2, cog 2)                              |
| `src/domain/services/diagnostics/evaluateTransferDiagnosticViolations.ts`       | evaluateTransferRules (cyc 6, cog 3); evaluateCustomPcViolations (cyc 4, cog 4); evaluateTransferOperationDiagnosticViolations (cyc 4, cog 3); evaluateAll (cyc 3, cog 3); isExplicitTarget (cyc 2, cog 2)                                                                   |
| `src/domain/services/diagnostics/EventDiagnosticRules.ts`                       | parseExplicitEventDecimalInRange (cyc 7, cog 7); hasValidExplicitEventReceivingTimeoutCondition (cyc 8, cog 5); hasValidExplicitEventSourceIpAddress (cyc 8, cog 4); parseExplicitHexadecimalInRange (cyc 6, cog 5); parseHashEscapedQuotedEventStringContent (cyc 4, cog 5) |
| `src/domain/services/diagnostics/JobEndDiagnosticRules.ts`                      | parseExplicitJobEndDecimalInRange (cyc 7, cog 6); hasInvalidExplicitThresholdOrdering (cyc 6, cog 1)                                                                                                                                                                         |
| `src/domain/services/diagnostics/MonitoringWaitDiagnosticRules.ts`              | parseExplicitMonitoringWaitDecimalInRange (cyc 6, cog 5); selectQuotedContentOrRawValue (cyc 5, cog 3); hasValidExplicitFileMonitoringByteLength (cyc 4, cog 1); hasValidExplicitEndTiming (cyc 4, cog 1); hasFileCreationMonitoring (cyc 3, cog 0)                          |
| `src/domain/services/diagnostics/ScheduleDateRules.ts`                          | isValidExplicitScheduleDate (cyc 6, cog 3); isWeekdayScheduleDateDayToken (cyc 4, cog 3); isBackwardScheduleDateDayToken (cyc 3, cog 4); isValidScheduleDateYear (cyc 5, cog 2); isValidExplicitScheduleDateRuleNumber (cyc 5, cog 2)                                        |
| `src/domain/services/diagnostics/ScheduleDiagnosticRules.ts`                    | parseExplicitScheduleRuleValue (cyc 6, cog 4); normalizeScheduleLimitYear (cyc 5, cog 3); parseMatchingExplicitScheduleRuleValue (cyc 4, cog 3); parseValidExplicitScheduleRuleValue (cyc 4, cog 3); isValidExplicitCycle (cyc 4, cog 3)                                     |
| `src/domain/services/diagnostics/TransferDiagnosticRules.ts`                    | hasValidExplicitTransferFileValue (cyc 8, cog 7); hasValidExplicitTransferByteLength (cyc 8, cog 3); hasInvalidExplicitTransferSourcePath (cyc 2, cog 2); isAbsoluteTransferFilePath (cyc 3, cog 1); parseQuotedTransferFileContent (cyc 1, cog 0)                           |
| `src/domain/services/i18n/nls.ts`                                               | groupTypeLabelKey (cyc 5, cog 3); groupUnitTypeLabel (cyc 3, cog 2); knownUnitTypeLabel (cyc 3, cog 2); unitTypeLabel (cyc 2, cog 2); localeString (cyc 2, cog 1)                                                                                                            |
| `src/domain/services/semantic-diff/semanticDiffEvidenceRules.ts`                | conditionalRelationDecisions (cyc 8, cog 0); waitTargetDecisions (cyc 4, cog 3); timeoutKeysForUnit (cyc 3, cog 4); waitTargetKeysForUnit (cyc 3, cog 4); hasUninterpretableFileMonitoringCondition (cyc 6, cog 1)                                                           |
| `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`                | explicitDateCandidates (cyc 17, cog 18); compareScheduleRuns (cyc 16, cog 4); createRunsForScheduleDate (cyc 9, cog 7); toUtcDate (cyc 10, cog 5); unsupportedScheduleDateDecision (cyc 7, cog 7)                                                                            |
| `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`              | attributeCategory (cyc 8, cog 14); matchFingerprintUnits (cyc 11, cog 5); semanticDiffParentJobnetPath (cyc 5, cog 10); buildSemanticDiffUnitCorrespondence (cyc 11, cog 1); scalarAttributeChangeKeys (cyc 12, cog 0)                                                       |
| `src/domain/values/AjsType.ts`                                                  | isTySymbol (cyc 3, cog 0); isParamSymbol (cyc 3, cog 0); isWeekSymbol (cyc 3, cog 0)                                                                                                                                                                                         |
| `src/infrastructure/i18n/ParameterSyntaxResourceAdapter.ts`                     | findSyntax (cyc 3, cog 1); localizedDefinitions (cyc 1, cog 0); isParameterSymbol (cyc 1, cog 0)                                                                                                                                                                             |
| `src/infrastructure/parser/AjsEvaluator.ts`                                     | rootUnits (cyc 5, cog 1); allUnits (cyc 1, cog 0)                                                                                                                                                                                                                            |
| `src/infrastructure/parser/AntlrAjsParser.ts`                                   | parse (cyc 3, cog 1)                                                                                                                                                                                                                                                         |
| `src/infrastructure/parser/raw/AjsRawUnit.ts`                                   | permission (cyc 3, cog 1); jp1Username (cyc 3, cog 1); jp1ResourceGroup (cyc 3, cog 1); absolutePath (cyc 2, cog 1); constructor (cyc 1, cog 0)                                                                                                                              |
| `src/infrastructure/parser/SyntaxErrorListener.ts`                              | toAntlrSyntaxError (cyc 1, cog 0); toAjsParserError (cyc 1, cog 0); syntaxError (cyc 1, cog 0)                                                                                                                                                                               |
| `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`                        | dispose (cyc 3, cog 1); report (cyc 3, cog 1); constructor (cyc 1, cog 0)                                                                                                                                                                                                    |
| `src/infrastructure/webapi/Jp1Ajs3WebApiImportAdapter.ts`                       | toSuccessResult (cyc 10, cog 4); toTransportError (cyc 5, cog 3); isUnitListResponse (cyc 6, cog 1); isWebApiError (cyc 5, cog 2); importDefinitionWithCredential (cyc 4, cog 2)                                                                                             |
| `src/infrastructure/webapi/VscodeWebApiCredentialStore.ts`                      | parseStoredCredential (cyc 4, cog 4); isRecord (cyc 4, cog 1); toCredential (cyc 2, cog 2); isCredentialLike (cyc 3, cog 1); resolveCredential (cyc 2, cog 1)                                                                                                                |
| `src/presentation/semantic-diff/renderSemanticDiffMarkdown.ts`                  | renderStructuralChanges (cyc 8, cog 1); renderUnsupportedItem (cyc 3, cog 4); renderLimitation (cyc 3, cog 4); renderLimitations (cyc 6, cog 0); renderScheduleComparison (cyc 3, cog 2)                                                                                     |
| `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`            | localizedChangeSummary (cyc 14, cog 16); renderConfirmationRequiredItem (cyc 14, cog 12); localizedUnitChange (cyc 15, cog 6); renderScheduleRunChange (cyc 8, cog 12); renderAttributeChanges (cyc 11, cog 5)                                                               |
| `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`       | executeImportAjsDefinitionViaWebApiCommand (cyc 4, cog 4); collectInputSteps (cyc 3, cog 5); collectRequiredInputValues (cyc 4, cog 4); toWebApiLanguage (cyc 5, cog 3); reportImportResult (cyc 3, cog 4)                                                                   |
| `src/presentation/vscode/commands/openPreviewCommand.ts`                        | executeOpenPreviewCommand (cyc 3, cog 4); reportViewerOpenStarted (cyc 2, cog 2)                                                                                                                                                                                             |
| `src/presentation/vscode/commands/semanticDiffCommand.ts`                       | executeCompareSemanticDiffCommand (cyc 9, cog 10); readBeforeDefinition (cyc 4, cog 4); commandError (cyc 1, cog 0); safeShowErrorMessage (cyc 1, cog 0)                                                                                                                     |
| `src/presentation/vscode/diagnostics/registerDiagnostics.ts`                    | reportDiagnosticsTelemetry (cyc 7, cog 5); toVsCodeDiagnostic (cyc 4, cog 0); runForAjsDocument (cyc 2, cog 2); updateDiagnostics (cyc 3, cog 0); isAjsDocument (cyc 2, cog 0)                                                                                               |
| `src/presentation/vscode/languages/registerHoverProvider.ts`                    | findHoverForPosition (cyc 7, cog 4); reportHoverTelemetry (cyc 2, cog 2); provideHover (cyc 1, cog 0); registerHoverProvider (cyc 1, cog 0); constructor (cyc 1, cog 0)                                                                                                      |
| `src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts`           | copyReport (cyc 6, cog 3); resolveReportUri (cyc 5, cog 2); createReportUri (cyc 2, cog 1); provideTextDocumentContent (cyc 2, cog 0); openReport (cyc 1, cog 0)                                                                                                             |
| `src/presentation/vscode/webview/ajsDocument.ts`                                | postAjsDocument (cyc 4, cog 2); createDebouncedAjsDocumentChange (cyc 3, cog 2); reportUnitListBuildPerformance (cyc 2, cog 2); createReadyAjsDocument (cyc 1, cog 0)                                                                                                        |
| `src/presentation/vscode/webview/ViewerFactory.ts`                              | resolveViewerPanelTitle (cyc 5, cog 1); getPanel (cyc 2, cog 1); registerStandardViewerCustomize (cyc 1, cog 0); createAndStorePanel (cyc 1, cog 0); constructor (cyc 1, cog 0)                                                                                              |
| `src/presentation/vscode/webview/viewerMessageRouting.ts`                       | dispatchViewerRequest (cyc 8, cog 2); createViewerMessageHandler (cyc 3, cog 7); handleSaveMessage (cyc 4, cog 3); registerViewerPanelDispose (cyc 2, cog 3); createViewerMessageRoutes (cyc 1, cog 0)                                                                       |
| `src/presentation/vscode/webview/WebviewMediator.ts`                            | onDidChangeTextDocument (cyc 5, cog 2); onDidCloseTextDocument (cyc 5, cog 2); onDidRenameFiles (cyc 4, cog 2); onDidChangeActiveColorTheme (cyc 2, cog 0); constructor (cyc 1, cog 0)                                                                                       |
| `src/presentation/vscode/webview/WebviewStore.ts`                               | removeByUri (cyc 2, cog 1); dispose (cyc 2, cog 0); add (cyc 1, cog 0); panelByUri (cyc 1, cog 0); prettyPrint (cyc 1, cog 0)                                                                                                                                                |
| `src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts`             | initializePositions (cyc 5, cog 8); calculateNestedInitialPosition (cyc 5, cog 4); createExpandedFlowGraphContext (cyc 5, cog 2); buildExpandedFlowGraph (cyc 3, cog 2); createEmptyExpandedFlowGraphResult (cyc 1, cog 0)                                                   |
| `src/presentation/webview/editor/ajsFlow/expandedFlowGraphGeometry.ts`          | includeDecorationBounds (cyc 7, cog 0); buildUnitDecorationBounds (cyc 7, cog 0); buildPaddedBounds (cyc 5, cog 0); toDecorationFromBounds (cyc 5, cog 0); getExpandedPanelPadding (cyc 5, cog 0)                                                                            |
| `src/presentation/webview/editor/ajsFlow/expandedFlowGraphGrowthOffsets.ts`     | applyExpandedChildrenGrowthOffsets (cyc 4, cog 6); applyGrowthOffsets (cyc 5, cog 3); getUpperExpandedPanelMaxRight (cyc 7, cog 0); getUpperExpandedPanelCandidateBounds (cyc 3, cog 3); getExpandedChildGrowthBounds (cyc 3, cog 3)                                         |
| `src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts`            | buildExpandedPanelSubtreeBounds (cyc 3, cog 5); updateExpandedNodeDecoration (cyc 3, cog 3); getPanelBoundsLayoutItem (cyc 3, cog 3); buildExpandedScopeRelayoutContext (cyc 5, cog 0); buildOccupiedLayoutItem (cyc 3, cog 2)                                               |
| `src/presentation/webview/editor/ajsFlow/expandedFlowGraphPanelIntrusion.ts`    | buildExpandedPanelLayoutItem (cyc 3, cog 3); resolveUpperExpandedPanelIntrusions (cyc 3, cog 2); resolveExpandedScopePanelIntrusions (cyc 2, cog 2); getLowerPanelIntrusionOffset (cyc 2, cog 2); buildExpandedPanelIntrusionTarget (cyc 2, cog 2)                           |
| `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`                      | FlowGraphPanelComponent (cyc 75, cog 90); FlowContents (cyc 32, cog 48); useSyncSelectedFlowNode (cyc 8, cog 19); syncSelectedNode (cyc 7, cog 8); FlowViewerBody (cyc 4, cog 1)                                                                                             |
| `src/presentation/webview/editor/ajsFlow/flowGraphPosition.ts`                  | calculateFlowGraphNodePosition (cyc 17, cog 2); calculateNestedChildPosition (cyc 13, cog 0); createFlowGraphMetrics (cyc 7, cog 0); calculateNestedConditionPosition (cyc 5, cog 0)                                                                                         |
| `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`                      | toEdge (cyc 6, cog 3); edgeStrokeColor (cyc 5, cog 4); toNodeData (cyc 7, cog 1); toEdgeStyle (cyc 4, cog 4); toNestedPanelBoundsNode (cyc 4, cog 2)                                                                                                                         |
| `src/presentation/webview/editor/ajsFlow/flowKeyboardNavigation.ts`             | resolveFlowKeyboardNodeGeometry (cyc 7, cog 3); isFlowSpatialNavigationKey (cyc 8, cog 1); resolveFlowKeyboardScopeFocusDecision (cyc 4, cog 4); resolveScopeMismatchDecision (cyc 5, cog 3); isFlowKeyboardNavigationKey (cyc 3, cog 4)                                     |
| `src/presentation/webview/editor/ajsFlow/flowKeyboardNavigationActions.ts`      | toSpatialCandidate (cyc 9, cog 4); resolveScopeEntryAction (cyc 7, cog 3); resolveSpatialTarget (cyc 6, cog 2); appendScopeAncestor (cyc 4, cog 4); resolveScopeReturnTarget (cyc 5, cog 3)                                                                                  |
| `src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx`               | buildRelationshipFocusAction (cyc 3, cog 4); formatParentUnit (cyc 3, cog 4); buildOpenScopeActions (cyc 2, cog 2); buildOpenDefinitionActions (cyc 2, cog 2); buildFlowNodeDetailRows (cyc 2, cog 1)                                                                        |
| `src/presentation/webview/editor/ajsFlow/flowRelationshipFocus.ts`              | applyFlowRelationshipFocus (cyc 8, cog 3); weakenedOpacity (cyc 4, cog 2); decorateEdge (cyc 3, cog 2); decorateNode (cyc 3, cog 2); resolveFlowNodeFocusRole (cyc 3, cog 2)                                                                                                 |
| `src/presentation/webview/editor/ajsFlow/flowSearchState.ts`                    | moveFlowSearchResult (cyc 6, cog 4); getFlowSearchResultPosition (cyc 6, cog 4); wrapResultIndex (cyc 6, cog 2); createSubmittedFlowSearchState (cyc 3, cog 2); isActiveFlowSearchQuery (cyc 4, cog 1)                                                                       |
| `src/presentation/webview/editor/ajsFlow/flowViewportFocus.ts`                  | resolveGraphTargetDecision (cyc 4, cog 4); resolveTargetRequest (cyc 3, cog 4); resolveFlowViewportFocusAction (cyc 4, cog 3); isExpectedScope (cyc 4, cog 2); resolveFlowViewportFocusDecision (cyc 3, cog 2)                                                               |
| `src/presentation/webview/editor/ajsFlow/Header.tsx`                            | RelationshipFocusButton (cyc 4, cog 6); CurrentUnitBadge (cyc 4, cog 4); MiniMapButton (cyc 3, cog 4); getCurrentUnitLabel (cyc 3, cog 4); ExpandAllNestedUnitsButton (cyc 2, cog 2)                                                                                         |
| `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`                     | NodeStatusIndicators (cyc 12, cog 9); getFlowNodeHeaderItemKinds (cyc 3, cog 4); FlowNodeCard (cyc 3, cog 1); NodeNameAndComment (cyc 2, cog 1); ActionIcon (cyc 1, cog 0)                                                                                                   |
| `src/presentation/webview/editor/ajsFlow/nodes/nodeSxProps.ts`                  | resolveNodeBorderStyle (cyc 4, cog 3); buildNodeSxProps (cyc 2, cog 2); nestedPanelSxProps (cyc 2, cog 2); buildNodeHoverDecoration (cyc 2, cog 2); resolveVisualKind (cyc 3, cog 0)                                                                                         |
| `src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts`                 | useSearchSubmitHandler (cyc 8, cog 9); useFlowSearchState (cyc 4, cog 6); useRevealUnitHandler (cyc 4, cog 6); applyFlowSearchSubmission (cyc 5, cog 4); resolveFlowSearchSubmission (cyc 3, cog 4)                                                                          |
| `src/presentation/webview/editor/ajsFlow/useFlowViewerController.ts`            | useOpenSelectedNodeScope (cyc 3, cog 4); useFlowTreeSelectionState (cyc 3, cog 3); useFlowViewerLifecycle (cyc 3, cog 2); mergeExpandedUnitIds (cyc 3, cog 2); useOpenSelectedNodeDefinition (cyc 2, cog 3)                                                                  |
| `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`               | resolveNextCurrentUnitId (cyc 7, cog 10); runFlowViewerFitViewEffect (cyc 4, cog 6); updateHandledViewportFocus (cyc 5, cog 4); resolveFlowDocumentChange (cyc 4, cog 4); useRevealUnitSubscription (cyc 3, cog 4)                                                           |
| `src/presentation/webview/editor/ajsTable/DisplayColumnSelector.tsx`            | ColumnDetail (cyc 3, cog 2); ColumnDetailItem (cyc 2, cog 2); DisplayColumnSelector (cyc 2, cog 0); NestedColumnGroup (cyc 2, cog 0); createColumnVisibilityUpdate (cyc 2, cog 0)                                                                                            |
| `src/presentation/webview/editor/ajsTable/Header.tsx`                           | HeaderCsvActions (cyc 2, cog 0); Header (cyc 1, cog 0); HeaderSearchField (cyc 1, cog 0); getTableHeaderSearchLabels (cyc 1, cog 0); getAjsTableSearchHelperText (cyc 1, cog 0)                                                                                              |
| `src/presentation/webview/editor/ajsTable/navigation.ts`                        | moveCellFocus (cyc 49, cog 42); moveHeaderFocus (cyc 32, cog 25); resolveUnitListGridShortcut (cyc 19, cog 12); resolveTableGridFocus (cyc 19, cog 11); isTableGridNavigationKey (cyc 21, cog 3)                                                                             |
| `src/presentation/webview/editor/ajsTable/TableContents.tsx`                    | TableContents (cyc 27, cog 43); TableViewerShell (cyc 5, cog 1); useChangeDocument (cyc 3, cog 3); useTableViewerTheme (cyc 2, cog 3); isSelectableTableFlowScopeUnit (cyc 3, cog 1)                                                                                         |
| `src/presentation/webview/editor/ajsTable/TableHeader.tsx`                      | renderHeaderCell (cyc 15, cog 18); getTableHeaderAriaSort (cyc 6, cog 7); renderSortableHeaderContent (cyc 7, cog 5); renderHeaderContent (cyc 2, cog 2); canRenderSortableHeader (cyc 3, cog 1)                                                                             |
| `src/presentation/webview/editor/ajsTable/tableSearchController.ts`             | useTableSearchController (cyc 7, cog 9); revealSearchedPath (cyc 2, cog 2)                                                                                                                                                                                                   |
| `src/presentation/webview/editor/ajsTable/tableSearchState.ts`                  | doesTableRowMatchSearch (cyc 6, cog 4); getTableSearchResultPosition (cyc 6, cog 4); moveTableSearchResult (cyc 5, cog 4); wrapResultIndex (cyc 6, cog 2); createSubmittedTableSearchState (cyc 3, cog 2)                                                                    |
| `src/presentation/webview/editor/ajsTable/unitListDetail.ts`                    | cacheResolvedUnitListDetail (cyc 5, cog 3); buildSelectedUnitListDetail (cyc 5, cog 3); takeNextUnvisitedPath (cyc 4, cog 3); hasSchedule (cyc 6, cog 0); directlyRelatedAbsolutePaths (cyc 4, cog 2)                                                                        |
| `src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx`              | buildUnitListDetailRows (cyc 3, cog 1); getUnitListDetailSubtitle (cyc 2, cog 0); UnitListDetailPanel (cyc 1, cog 0); buildUnitListRelationshipRows (cyc 1, cog 0); buildUnitListDetailActions (cyc 1, cog 0)                                                                |
| `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`                 | VirtualizedTable (cyc 66, cog 96); revealGridFocusElement (cyc 8, cog 7); renderVisibleTableCell (cyc 9, cog 3); Table (cyc 3, cog 2); getSearchHitCellSx (cyc 2, cog 2)                                                                                                     |
| `src/presentation/webview/editor/shared/HeaderSearchField.tsx`                  | resolveHeaderSearchHelperText (cyc 4, cog 4); isHeaderSearchShortcut (cyc 4, cog 3); HeaderSearchField (cyc 3, cog 3); HeaderSearchControl (cyc 5, cog 1); useHeaderSearchControlState (cyc 2, cog 3)                                                                        |
| `src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx`               | SharedUnitDetailPane (cyc 16, cog 20); resolveDetailPaneShortcut (cyc 9, cog 7); handleKeyDown (cyc 5, cog 6); StateChip (cyc 4, cog 6); resolveDetailPaneShortcutForTarget (cyc 4, cog 3)                                                                                   |
| `src/presentation/webview/editor/shared/unitTreeNavigation.ts`                  | resolveUnitTreeNavigationKey (cyc 23, cog 11); resolveParentTarget (cyc 6, cog 3); isLinearNavigationKey (cyc 8, cog 1); resolveRightNavigation (cyc 3, cog 4); hasNavigationModifier (cyc 4, cog 1)                                                                         |
| `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`                   | UnitTreeSelector (cyc 68, cog 70); UnitTreeSelectorUnit (cyc 12, cog 18); UnitTreeRowFrame (cyc 7, cog 11); isTreeNavigationKey (cyc 12, cog 1); resolveUnitTreeRowState (cyc 7, cog 1)                                                                                      |
| `src/presentation/webview/editor/UnitDefinitionDialog.tsx`                      | CommandBuilder (cyc 13, cog 2); CommandBuilderField (cyc 5, cog 4); TabPanel (cyc 4, cog 2); useCopyHandler (cyc 2, cog 3); Tab2 (cyc 3, cog 2)                                                                                                                              |
| `src/presentation/webview/editor/unitInformationLocalization.ts`                | unitInformationUnitTypeLabel (cyc 6, cog 6); groupTypeLabelKey (cyc 5, cog 3); messagesForLanguage (cyc 2, cog 2); unitInformationMessage (cyc 2, cog 1); formatUnitInformationMessage (cyc 2, cog 0)                                                                        |
| `src/presentation/webview/viewerHostMessages.ts`                                | parseViewerHostMessage (cyc 9, cog 11); parseViewerDocumentChangedMessage (cyc 10, cog 5); parseViewerResourceState (cyc 10, cog 4); isPlainRecord (cyc 6, cog 3); parseViewerRevealUnitMessage (cyc 3, cog 2)                                                               |
| `src/presentation/webview/viewerRequestMessages.ts`                             | parseViewerRequest (cyc 21, cog 25); parseViewerNavigationRequest (cyc 8, cog 5); parseViewerResourceRequest (cyc 8, cog 4); isPlainRecord (cyc 6, cog 1); parseViewerPerformanceRequest (cyc 3, cog 3)                                                                      |
| `src/resource/i18n/ajscolumn_en.ts`                                             | — (no function row)                                                                                                                                                                                                                                                          |
| `src/resource/i18n/ajscolumn_ja.ts`                                             | — (no function row)                                                                                                                                                                                                                                                          |
| `src/resource/i18n/message_en.ts`                                               | — (no function row)                                                                                                                                                                                                                                                          |
| `src/resource/i18n/message_ja.ts`                                               | — (no function row)                                                                                                                                                                                                                                                          |
| `src/resource/i18n/parameter_en.ts`                                             | — (no function row)                                                                                                                                                                                                                                                          |
| `src/resource/i18n/ty.ts`                                                       | buildUnitTypeDefinitions (cyc 2, cog 0); localizedUnitTypeDefinition (cyc 1, cog 0)                                                                                                                                                                                          |

### Ranked candidates

| Rank | File                                                                            | Layer / responsibility                            | Raw cyclo/complex/lines/LOC/LCOM | Smell | Touches / CF tier | Criticality / basis      | Structural tier | Priority key                                                                                |
| ---- | ------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------- | ----- | ----------------- | ------------------------ | --------------- | ------------------------------------------------------------------------------------------- |
| 1    | `src/application/editor-feedback/buildSyntaxDiagnostics.ts`                     | Application / syntax diagnostics/editor feedback  | `4/3/38/33/0`                    | no    | 31 / 5            | 4 / `C4-DIAGNOSTICS`     | 5               | 100 / `100,5,5,src/application/editor-feedback/buildSyntaxDiagnostics.ts`                   |
| 2    | `src/application/editor-feedback/syntaxDiagnosticJobEndRuleBuilders.ts`         | Application / syntax diagnostics/editor feedback  | `2/0/81/77/0`                    | no    | 3 / 5             | 4 / `C4-DIAGNOSTICS`     | 5               | 100 / `100,5,5,src/application/editor-feedback/syntaxDiagnosticJobEndRuleBuilders.ts`       |
| 3    | `src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts`               | Application / syntax diagnostics/editor feedback  | `1/0/25/24/0`                    | no    | 3 / 5             | 4 / `C4-DIAGNOSTICS`     | 5               | 100 / `100,5,5,src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts`             |
| 4    | `src/application/editor-feedback/syntaxDiagnosticRules.ts`                      | Application / syntax diagnostics/editor feedback  | `2/0/58/56/0`                    | no    | 4 / 5             | 4 / `C4-DIAGNOSTICS`     | 5               | 100 / `100,5,5,src/application/editor-feedback/syntaxDiagnosticRules.ts`                    |
| 5    | `src/application/editor-feedback/syntaxDiagnosticScheduleRuleBuilders.ts`       | Application / syntax diagnostics/editor feedback  | `2/0/83/80/0`                    | no    | 4 / 5             | 4 / `C4-DIAGNOSTICS`     | 5               | 100 / `100,5,5,src/application/editor-feedback/syntaxDiagnosticScheduleRuleBuilders.ts`     |
| 6    | `src/application/editor-feedback/syntaxDiagnosticTypes.ts`                      | Application / syntax diagnostics/editor feedback  | `1/0/35/29/0`                    | no    | 3 / 5             | 4 / `C4-DIAGNOSTICS`     | 5               | 100 / `100,5,5,src/application/editor-feedback/syntaxDiagnosticTypes.ts`                    |
| 7    | `src/application/flow-graph/buildFlowGraph.ts`                                  | Application / flow graph/viewer                   | `17/15/152/143/0`                | yes   | 4 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/application/flow-graph/buildFlowGraph.ts`                                |
| 8    | `src/application/unit-list/buildUnitListRemainingGroups.ts`                     | Application / unit list/table                     | `10/7/221/209/0`                 | no    | 6 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/application/unit-list/buildUnitListRemainingGroups.ts`                   |
| 9    | `src/application/unit-list/unitListDocument.ts`                                 | Application / unit list/table                     | `224/28/536/509/0`               | yes   | 5 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/application/unit-list/unitListDocument.ts`                               |
| 10   | `src/bootstrap/extension/viewerWiring.ts`                                       | Bootstrap / composition                           | `16/27/297/277/0`                | yes   | 6 / 5             | 4 / `C4-COMPOSITION`     | 5               | 100 / `100,5,5,src/bootstrap/extension/viewerWiring.ts`                                     |
| 11   | `src/presentation/vscode/webview/ViewerFactory.ts`                              | Presentation/VS Code / viewer transport           | `6/2/160/135/1`                  | no    | 5 / 5             | 4 / `C4-VIEWER`          | 5               | 100 / `100,5,5,src/presentation/vscode/webview/ViewerFactory.ts`                            |
| 12   | `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`                      | Presentation/webview / flow graph/viewer          | `118/162/1165/1134/0`            | yes   | 8 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/FlowContents.tsx`                    |
| 13   | `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`                      | Presentation/webview / flow graph/viewer          | `30/18/236/218/0`                | no    | 6 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/flowGraphView.ts`                    |
| 14   | `src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx`               | Presentation/webview / flow graph/viewer          | `8/13/297/280/0`                 | yes   | 6 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx`             |
| 15   | `src/presentation/webview/editor/ajsFlow/Header.tsx`                            | Presentation/webview / flow graph/viewer          | `15/23/339/321/0`                | yes   | 6 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/Header.tsx`                          |
| 16   | `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`                     | Presentation/webview / flow graph/viewer          | `17/15/344/331/0`                | yes   | 6 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`                   |
| 17   | `src/presentation/webview/editor/ajsFlow/nodes/nodeSxProps.ts`                  | Presentation/webview / flow graph/viewer          | `13/9/457/412/0`                 | no    | 5 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/nodes/nodeSxProps.ts`                |
| 18   | `src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts`                 | Presentation/webview / flow graph/viewer          | `22/29/314/293/0`                | yes   | 6 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts`               |
| 19   | `src/presentation/webview/editor/ajsFlow/useFlowViewerController.ts`            | Presentation/webview / flow graph/viewer          | `15/17/544/515/0`                | no    | 5 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/useFlowViewerController.ts`          |
| 20   | `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`               | Presentation/webview / flow graph/viewer          | `40/51/534/493/0`                | yes   | 7 / 5             | 4 / `C4-FLOW`            | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`             |
| 21   | `src/presentation/webview/editor/ajsTable/DisplayColumnSelector.tsx`            | Presentation/webview / unit list/table            | `12/4/298/274/0`                 | no    | 5 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsTable/DisplayColumnSelector.tsx`          |
| 22   | `src/presentation/webview/editor/ajsTable/Header.tsx`                           | Presentation/webview / unit list/table            | `2/0/312/290/0`                  | yes   | 6 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsTable/Header.tsx`                         |
| 23   | `src/presentation/webview/editor/ajsTable/navigation.ts`                        | Presentation/webview / list/flow navigation       | `175/122/411/380/0`              | yes   | 5 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsTable/navigation.ts`                      |
| 24   | `src/presentation/webview/editor/ajsTable/TableContents.tsx`                    | Presentation/webview / unit list/table            | `37/50/709/677/0`                | yes   | 7 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsTable/TableContents.tsx`                  |
| 25   | `src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`                 | Presentation/webview / unit list/table            | `87/109/679/648/0`               | yes   | 6 / 5             | 4 / `C4-UNIT-LIST`       | 5               | 100 / `100,5,5,src/presentation/webview/editor/ajsTable/VirtualizedTable.tsx`               |
| 26   | `src/presentation/webview/editor/shared/HeaderSearchField.tsx`                  | Presentation/webview / shared viewer transport    | `20/19/376/348/0`                | no    | 4 / 5             | 4 / `C4-VIEWER`          | 5               | 100 / `100,5,5,src/presentation/webview/editor/shared/HeaderSearchField.tsx`                |
| 27   | `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`                   | Presentation/webview / shared viewer transport    | `139/147/1143/1077/0`            | yes   | 4 / 5             | 4 / `C4-VIEWER`          | 5               | 100 / `100,5,5,src/presentation/webview/editor/shared/UnitTreeSelector.tsx`                 |
| 28   | `src/application/parsing/AjsParserPort.ts`                                      | Application / parser/normalized-document contract | `1/0/21/18/0`                    | no    | 2 / 4             | 5 / `C5-MODEL`           | 5               | 100 / `100,5,4,src/application/parsing/AjsParserPort.ts`                                    |
| 29   | `src/application/telemetry/performanceTelemetry.ts`                             | Application / telemetry contract                  | `1/0/66/63/0`                    | no    | 2 / 4             | 5 / `C5-TELEMETRY`       | 5               | 100 / `100,5,4,src/application/telemetry/performanceTelemetry.ts`                           |
| 30   | `src/application/telemetry/searchTelemetry.ts`                                  | Application / telemetry contract                  | `1/0/54/52/0`                    | no    | 2 / 4             | 5 / `C5-TELEMETRY`       | 5               | 100 / `100,5,4,src/application/telemetry/searchTelemetry.ts`                                |
| 31   | `src/application/telemetry/telemetryBuckets.ts`                                 | Application / telemetry contract                  | `37/31/123/105/0`                | yes   | 2 / 4             | 5 / `C5-TELEMETRY`       | 5               | 100 / `100,5,4,src/application/telemetry/telemetryBuckets.ts`                               |
| 32   | `src/application/telemetry/telemetryEvent.ts`                                   | Application / telemetry contract                  | `8/11/619/603/0`                 | yes   | 2 / 4             | 5 / `C5-TELEMETRY`       | 5               | 100 / `100,5,4,src/application/telemetry/telemetryEvent.ts`                                 |
| 33   | `src/application/telemetry/viewerActionTelemetry.ts`                            | Application / telemetry contract                  | `17/18/112/101/0`                | yes   | 2 / 4             | 5 / `C5-TELEMETRY`       | 5               | 100 / `100,5,4,src/application/telemetry/viewerActionTelemetry.ts`                          |
| 34   | `src/application/telemetry/viewerTelemetry.ts`                                  | Application / telemetry contract                  | `12/15/186/169/0`                | yes   | 2 / 4             | 5 / `C5-TELEMETRY`       | 5               | 100 / `100,5,4,src/application/telemetry/viewerTelemetry.ts`                                |
| 35   | `src/domain/models/parameters/scheduleRuleHelpers.ts`                           | Domain / host/support adapter                     | `26/17/179/152/0`                | no    | 3 / 4             | 5 / `C5-MODEL`           | 5               | 100 / `100,5,4,src/domain/models/parameters/scheduleRuleHelpers.ts`                         |
| 36   | `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`                 | Application / flow graph/viewer                   | `28/24/183/168/0`                | yes   | 2 / 4             | 4 / `C4-FLOW`            | 5               | 80 / `80,5,4,src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`                 |
| 37   | `src/application/semantic-diff/compareScheduleDiff.ts`                          | Application / semantic diff                       | `29/16/209/192/0`                | yes   | 2 / 4             | 4 / `C4-SEMANTIC`        | 5               | 80 / `80,5,4,src/application/semantic-diff/compareScheduleDiff.ts`                          |
| 38   | `src/application/semantic-diff/compareSemanticDiff.ts`                          | Application / semantic diff                       | `55/31/583/548/0`                | yes   | 2 / 4             | 4 / `C4-SEMANTIC`        | 5               | 80 / `80,5,4,src/application/semantic-diff/compareSemanticDiff.ts`                          |
| 39   | `src/application/unit-list/buildUnitListView.ts`                                | Application / unit list/table                     | `9/3/348/318/0`                  | yes   | 2 / 4             | 4 / `C4-UNIT-LIST`       | 5               | 80 / `80,5,4,src/application/unit-list/buildUnitListView.ts`                                |
| 40   | `src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts`             | Presentation/webview / flow graph/viewer          | `15/16/156/145/0`                | yes   | 3 / 4             | 4 / `C4-FLOW`            | 5               | 80 / `80,5,4,src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts`             |
| 41   | `src/presentation/webview/editor/ajsFlow/flowGraphPosition.ts`                  | Presentation/webview / flow graph/viewer          | `39/2/91/83/0`                   | no    | 3 / 4             | 4 / `C4-FLOW`            | 5               | 80 / `80,5,4,src/presentation/webview/editor/ajsFlow/flowGraphPosition.ts`                  |
| 42   | `src/presentation/webview/editor/ajsFlow/flowViewportFocus.ts`                  | Presentation/webview / flow graph/viewer          | `26/21/190/168/0`                | no    | 3 / 4             | 4 / `C4-FLOW`            | 5               | 80 / `80,5,4,src/presentation/webview/editor/ajsFlow/flowViewportFocus.ts`                  |
| 43   | `src/presentation/webview/editor/ajsTable/TableHeader.tsx`                      | Presentation/webview / unit list/table            | `32/31/152/139/0`                | yes   | 3 / 4             | 4 / `C4-UNIT-LIST`       | 5               | 80 / `80,5,4,src/presentation/webview/editor/ajsTable/TableHeader.tsx`                      |
| 44   | `src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx`               | Presentation/webview / shared viewer transport    | `45/46/473/441/0`                | yes   | 3 / 4             | 4 / `C4-VIEWER`          | 5               | 80 / `80,5,4,src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx`               |
| 45   | `src/bootstrap/extension/extensionDependencies.ts`                              | Bootstrap / composition                           | `5/6/125/118/0`                  | yes   | 4 / 5             | 4 / `C4-COMPOSITION`     | 4               | 80 / `80,4,5,src/bootstrap/extension/extensionDependencies.ts`                              |
| 46   | `src/presentation/vscode/webview/viewerMessageRouting.ts`                       | Presentation/VS Code / viewer transport           | `14/15/192/180/0`                | yes   | 4 / 5             | 4 / `C4-VIEWER`          | 4               | 80 / `80,4,5,src/presentation/vscode/webview/viewerMessageRouting.ts`                       |
| 47   | `src/presentation/webview/editor/ajsTable/tableSearchController.ts`             | Presentation/webview / unit list/table            | `8/11/129/120/0`                 | yes   | 4 / 5             | 4 / `C4-UNIT-LIST`       | 4               | 80 / `80,4,5,src/presentation/webview/editor/ajsTable/tableSearchController.ts`             |
| 48   | `src/presentation/vscode/languages/registerHoverProvider.ts`                    | Presentation/VS Code / host/support adapter       | `8/6/152/139/1`                  | no    | 4 / 5             | 3 / `C3-HOVER`           | 5               | 75 / `75,5,5,src/presentation/vscode/languages/registerHoverProvider.ts`                    |
| 49   | `src/infrastructure/parser/AjsEvaluator.ts`                                     | Infrastructure / parser/normalization             | `7/1/70/53/1`                    | no    | 2 / 3             | 5 / `C5-PARSER`          | 5               | 75 / `75,5,3,src/infrastructure/parser/AjsEvaluator.ts`                                     |
| 50   | `src/infrastructure/parser/AntlrAjsParser.ts`                                   | Infrastructure / parser/normalization             | `3/1/21/19/1`                    | no    | 2 / 3             | 5 / `C5-PARSER`          | 5               | 75 / `75,5,3,src/infrastructure/parser/AntlrAjsParser.ts`                                   |
| 51   | `src/infrastructure/parser/SyntaxErrorListener.ts`                              | Infrastructure / parser/normalization             | `1/0/48/39/1`                    | no    | 2 / 3             | 5 / `C5-PARSER`          | 5               | 75 / `75,5,3,src/infrastructure/parser/SyntaxErrorListener.ts`                              |
| 52   | `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`                        | Infrastructure / telemetry contract               | `5/2/45/36/1`                    | no    | 2 / 3             | 5 / `C5-TELEMETRY`       | 5               | 75 / `75,5,3,src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`                        |
| 53   | `src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx`              | Presentation/webview / unit list/table            | `4/1/175/166/0`                  | yes   | 3 / 4             | 4 / `C4-UNIT-LIST`       | 4               | 64 / `64,4,4,src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx`              |
| 54   | `src/application/editor-feedback/findParameterHover.ts`                         | Application / parameter hover                     | `3/6/30/25/0`                    | yes   | 2 / 4             | 3 / `C3-HOVER`           | 5               | 60 / `60,5,4,src/application/editor-feedback/findParameterHover.ts`                         |
| 55   | `src/infrastructure/webapi/Jp1Ajs3WebApiImportAdapter.ts`                       | Infrastructure / WebAPI import                    | `47/26/352/313/1`                | no    | 3 / 4             | 3 / `C3-WEBAPI`          | 5               | 60 / `60,5,4,src/infrastructure/webapi/Jp1Ajs3WebApiImportAdapter.ts`                       |
| 56   | `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`       | Presentation/VS Code / WebAPI import              | `33/33/414/376/0`                | yes   | 3 / 4             | 3 / `C3-WEBAPI`          | 5               | 60 / `60,5,4,src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`       |
| 57   | `src/application/editor-feedback/diagnosticSourceRange.ts`                      | Application / syntax diagnostics/editor feedback  | `4/0/16/14/0`                    | no    | 1 / 3             | 4 / `C4-DIAGNOSTICS`     | 5               | 60 / `60,5,3,src/application/editor-feedback/diagnosticSourceRange.ts`                      |
| 58   | `src/application/editor-feedback/mapDiagnosticViolation.ts`                     | Application / syntax diagnostics/editor feedback  | `1/0/30/27/0`                    | no    | 1 / 3             | 4 / `C4-DIAGNOSTICS`     | 5               | 60 / `60,5,3,src/application/editor-feedback/mapDiagnosticViolation.ts`                     |
| 59   | `src/application/editor-feedback/syntaxDiagnosticEventRuleBuilders.ts`          | Application / syntax diagnostics/editor feedback  | `7/0/102/98/0`                   | no    | 1 / 3             | 4 / `C4-DIAGNOSTICS`     | 5               | 60 / `60,5,3,src/application/editor-feedback/syntaxDiagnosticEventRuleBuilders.ts`          |
| 60   | `src/application/editor-feedback/syntaxDiagnosticMonitoringWaitRuleBuilders.ts` | Application / syntax diagnostics/editor feedback  | `3/0/60/56/0`                    | no    | 1 / 3             | 4 / `C4-DIAGNOSTICS`     | 5               | 60 / `60,5,3,src/application/editor-feedback/syntaxDiagnosticMonitoringWaitRuleBuilders.ts` |
| 61   | `src/application/editor-feedback/syntaxDiagnosticTransferRuleBuilders.ts`       | Application / syntax diagnostics/editor feedback  | `12/2/61/55/0`                   | yes   | 1 / 3             | 4 / `C4-DIAGNOSTICS`     | 5               | 60 / `60,5,3,src/application/editor-feedback/syntaxDiagnosticTransferRuleBuilders.ts`       |
| 62   | `src/application/flow-graph/buildExpandedFlowGraph.ts`                          | Application / flow graph/viewer                   | `78/71/447/413/0`                | yes   | 1 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/application/flow-graph/buildExpandedFlowGraph.ts`                          |
| 63   | `src/application/flow-graph/buildFlowGraphCore.ts`                              | Application / flow graph/viewer                   | `6/2/185/168/0`                  | no    | 1 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/application/flow-graph/buildFlowGraphCore.ts`                              |
| 64   | `src/application/flow-graph/flowGraphDocument.ts`                               | Application / flow graph/viewer                   | `154/101/510/475/0`              | yes   | 1 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/application/flow-graph/flowGraphDocument.ts`                               |
| 65   | `src/presentation/vscode/webview/WebviewMediator.ts`                            | Presentation/VS Code / viewer transport           | `13/6/142/127/1`                 | no    | 2 / 3             | 4 / `C4-VIEWER`          | 5               | 60 / `60,5,3,src/presentation/vscode/webview/WebviewMediator.ts`                            |
| 66   | `src/presentation/webview/editor/ajsFlow/expandedFlowGraphGrowthOffsets.ts`     | Presentation/webview / flow graph/viewer          | `35/29/358/322/0`                | yes   | 2 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/presentation/webview/editor/ajsFlow/expandedFlowGraphGrowthOffsets.ts`     |
| 67   | `src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts`            | Presentation/webview / flow graph/viewer          | `24/23/227/210/0`                | yes   | 2 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts`            |
| 68   | `src/presentation/webview/editor/ajsFlow/expandedFlowGraphPanelIntrusion.ts`    | Presentation/webview / flow graph/viewer          | `19/17/173/151/0`                | no    | 2 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/presentation/webview/editor/ajsFlow/expandedFlowGraphPanelIntrusion.ts`    |
| 69   | `src/presentation/webview/editor/ajsFlow/flowRelationshipFocus.ts`              | Presentation/webview / flow graph/viewer          | `23/12/195/174/0`                | no    | 2 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/presentation/webview/editor/ajsFlow/flowRelationshipFocus.ts`              |
| 70   | `src/presentation/webview/editor/ajsFlow/flowSearchState.ts`                    | Presentation/webview / flow graph/viewer          | `23/15/120/105/0`                | no    | 2 / 3             | 4 / `C4-FLOW`            | 5               | 60 / `60,5,3,src/presentation/webview/editor/ajsFlow/flowSearchState.ts`                    |
| 71   | `src/presentation/webview/editor/ajsTable/unitListDetail.ts`                    | Presentation/webview / unit list/table            | `32/23/224/202/0`                | no    | 2 / 3             | 4 / `C4-UNIT-LIST`       | 5               | 60 / `60,5,3,src/presentation/webview/editor/ajsTable/unitListDetail.ts`                    |
| 72   | `src/resource/i18n/message_en.ts`                                               | Resource / localization resources                 | `1/0/285/285/0`                  | yes   | 4 / 5             | 2 / `C2-RESOURCE`        | 5               | 50 / `50,5,5,src/resource/i18n/message_en.ts`                                               |
| 73   | `src/resource/i18n/message_ja.ts`                                               | Resource / localization resources                 | `1/0/280/280/0`                  | yes   | 4 / 5             | 2 / `C2-RESOURCE`        | 5               | 50 / `50,5,5,src/resource/i18n/message_ja.ts`                                               |
| 74   | `src/application/telemetry/editorFeedbackTelemetry.ts`                          | Application / telemetry contract                  | `1/0/88/83/0`                    | no    | 1 / 2             | 5 / `C5-TELEMETRY`       | 5               | 50 / `50,5,2,src/application/telemetry/editorFeedbackTelemetry.ts`                          |
| 75   | `src/application/telemetry/searchTelemetryData.ts`                              | Application / telemetry contract                  | `33/10/49/43/0`                  | yes   | 1 / 2             | 5 / `C5-TELEMETRY`       | 5               | 50 / `50,5,2,src/application/telemetry/searchTelemetryData.ts`                              |
| 76   | `src/application/telemetry/TelemetryPort.ts`                                    | Application / telemetry contract                  | `1/0/6/5/0`                      | no    | 1 / 2             | 5 / `C5-TELEMETRY`       | 5               | 50 / `50,5,2,src/application/telemetry/TelemetryPort.ts`                                    |
| 77   | `src/application/telemetry/viewerOperation.ts`                                  | Application / telemetry contract                  | `1/0/13/12/0`                    | no    | 1 / 2             | 5 / `C5-TELEMETRY`       | 5               | 50 / `50,5,2,src/application/telemetry/viewerOperation.ts`                                  |
| 78   | `src/application/telemetry/viewerPerformanceTelemetryData.ts`                   | Application / telemetry contract                  | `17/5/49/41/0`                   | yes   | 1 / 2             | 5 / `C5-TELEMETRY`       | 5               | 50 / `50,5,2,src/application/telemetry/viewerPerformanceTelemetryData.ts`                   |
| 79   | `src/application/telemetry/webApiImportTelemetry.ts`                            | Application / telemetry contract                  | `5/4/76/70/0`                    | no    | 1 / 2             | 5 / `C5-TELEMETRY`       | 5               | 50 / `50,5,2,src/application/telemetry/webApiImportTelemetry.ts`                            |
| 80   | `src/application/webapi-import/importAjsDefinitionViaWebApi.ts`                 | Application / WebAPI import                       | `3/0/150/132/0`                  | yes   | 3 / 4             | 3 / `C3-WEBAPI`          | 4               | 48 / `48,4,4,src/application/webapi-import/importAjsDefinitionViaWebApi.ts`                 |
| 81   | `src/presentation/vscode/diagnostics/registerDiagnostics.ts`                    | Presentation/VS Code / JP1/AJS diagnostics        | `14/7/188/173/0`                 | yes   | 3 / 4             | 3 / `C3-DIAGNOSTICS`     | 4               | 48 / `48,4,4,src/presentation/vscode/diagnostics/registerDiagnostics.ts`                    |
| 82   | `src/presentation/webview/editor/unitInformationLocalization.ts`                | Presentation/webview / host/support adapter       | `13/11/160/146/0`                | yes   | 2 / 3             | 4 / `C4-VIEWER`          | 4               | 48 / `48,4,3,src/presentation/webview/editor/unitInformationLocalization.ts`                |
| 83   | `src/presentation/vscode/webview/ajsDocument.ts`                                | Presentation/VS Code / viewer transport           | `7/6/72/67/0`                    | yes   | 3 / 4             | 4 / `C4-VIEWER`          | 3               | 48 / `48,3,4,src/presentation/vscode/webview/ajsDocument.ts`                                |
| 84   | `src/application/editor-feedback/ParameterSyntaxLookupPort.ts`                  | Application / syntax diagnostics/editor feedback  | `1/0/3/3/0`                      | no    | 1 / 3             | 3 / `C3-HOVER`           | 5               | 45 / `45,5,3,src/application/editor-feedback/ParameterSyntaxLookupPort.ts`                  |
| 85   | `src/infrastructure/webapi/VscodeWebApiCredentialStore.ts`                      | Infrastructure / WebAPI import                    | `12/8/92/78/1`                   | no    | 2 / 3             | 3 / `C3-WEBAPI`          | 5               | 45 / `45,5,3,src/infrastructure/webapi/VscodeWebApiCredentialStore.ts`                      |
| 86   | `src/presentation/webview/editor/UnitDefinitionDialog.tsx`                      | Presentation/webview / unit definition            | `30/17/390/351/0`                | no    | 2 / 3             | 3 / `C3-UNIT-DEFINITION` | 5               | 45 / `45,5,3,src/presentation/webview/editor/UnitDefinitionDialog.tsx`                      |
| 87   | `src/application/navigation/resolveNavigationTarget.ts`                         | Application / list/flow navigation                | `59/82/281/253/0`                | yes   | 1 / 2             | 4 / `C4-NAVIGATION`      | 5               | 40 / `40,5,2,src/application/navigation/resolveNavigationTarget.ts`                         |
| 88   | `src/application/semantic-diff/buildSemanticDiffReportData.ts`                  | Application / semantic diff                       | `10/12/66/59/0`                  | yes   | 1 / 2             | 4 / `C4-SEMANTIC`        | 5               | 40 / `40,5,2,src/application/semantic-diff/buildSemanticDiffReportData.ts`                  |
| 89   | `src/application/semantic-diff/semanticDiffDto.ts`                              | Application / semantic diff                       | `1/0/199/171/0`                  | no    | 1 / 2             | 4 / `C4-SEMANTIC`        | 5               | 40 / `40,5,2,src/application/semantic-diff/semanticDiffDto.ts`                              |
| 90   | `src/application/unit-list/unitListPriorityViewHelpers.ts`                      | Application / unit list/table                     | `26/15/121/104/0`                | no    | 1 / 2             | 4 / `C4-UNIT-LIST`       | 5               | 40 / `40,5,2,src/application/unit-list/unitListPriorityViewHelpers.ts`                      |
| 91   | `src/application/unit-list/unitListScheduleValueHelpers.ts`                     | Application / unit list/table                     | `28/13/117/96/0`                 | no    | 1 / 2             | 4 / `C4-UNIT-LIST`       | 5               | 40 / `40,5,2,src/application/unit-list/unitListScheduleValueHelpers.ts`                     |
| 92   | `src/bootstrap/extension/MyExtension.ts`                                        | Bootstrap / composition                           | `1/0/38/29/2`                    | no    | 1 / 2             | 4 / `C4-COMPOSITION`     | 5               | 40 / `40,5,2,src/bootstrap/extension/MyExtension.ts`                                        |
| 93   | `src/domain/services/diagnostics/evaluateEventDiagnosticViolations.ts`          | Domain / JP1/AJS diagnostics                      | `30/19/337/319/0`                | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 5               | 40 / `40,5,2,src/domain/services/diagnostics/evaluateEventDiagnosticViolations.ts`          |
| 94   | `src/domain/services/diagnostics/evaluateJobEndDiagnosticViolations.ts`         | Domain / JP1/AJS diagnostics                      | `23/23/252/231/0`                | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 5               | 40 / `40,5,2,src/domain/services/diagnostics/evaluateJobEndDiagnosticViolations.ts`         |
| 95   | `src/domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations.ts` | Domain / JP1/AJS diagnostics                      | `30/16/251/232/0`                | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 5               | 40 / `40,5,2,src/domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations.ts` |
| 96   | `src/domain/services/diagnostics/EventDiagnosticRules.ts`                       | Domain / JP1/AJS diagnostics                      | `48/27/167/144/0`                | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 5               | 40 / `40,5,2,src/domain/services/diagnostics/EventDiagnosticRules.ts`                       |
| 97   | `src/domain/services/diagnostics/ScheduleDateRules.ts`                          | Domain / JP1/AJS diagnostics                      | `51/31/204/174/0`                | no    | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 5               | 40 / `40,5,2,src/domain/services/diagnostics/ScheduleDateRules.ts`                          |
| 98   | `src/domain/services/diagnostics/ScheduleDiagnosticRules.ts`                    | Domain / JP1/AJS diagnostics                      | `62/29/335/281/0`                | no    | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 5               | 40 / `40,5,2,src/domain/services/diagnostics/ScheduleDiagnosticRules.ts`                    |
| 99   | `src/domain/services/semantic-diff/semanticDiffEvidenceRules.ts`                | Domain / semantic diff                            | `37/12/254/235/0`                | no    | 1 / 2             | 4 / `C4-SEMANTIC`        | 5               | 40 / `40,5,2,src/domain/services/semantic-diff/semanticDiffEvidenceRules.ts`                |
| 100  | `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`                | Domain / semantic diff                            | `103/59/556/504/0`               | yes   | 1 / 2             | 4 / `C4-SEMANTIC`        | 5               | 40 / `40,5,2,src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`                |
| 101  | `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`              | Domain / semantic diff                            | `88/41/483/443/0`                | yes   | 1 / 2             | 4 / `C4-SEMANTIC`        | 5               | 40 / `40,5,2,src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`              |
| 102  | `src/domain/services/i18n/nls.ts`                                               | Domain / host/support adapter                     | `11/9/159/138/0`                 | yes   | 4 / 5             | 2 / `C2-RESOURCE`        | 4               | 40 / `40,4,5,src/domain/services/i18n/nls.ts`                                               |
| 103  | `src/presentation/vscode/commands/semanticDiffCommand.ts`                       | Presentation/VS Code / semantic diff              | `12/14/134/120/0`                | yes   | 2 / 3             | 3 / `C3-SEMANTIC-REPORT` | 4               | 36 / `36,4,3,src/presentation/vscode/commands/semanticDiffCommand.ts`                       |
| 104  | `src/presentation/vscode/commands/openPreviewCommand.ts`                        | Presentation/VS Code / host/support adapter       | `4/6/68/61/0`                    | yes   | 3 / 4             | 3 / `C3-PREVIEW`         | 3               | 36 / `36,3,4,src/presentation/vscode/commands/openPreviewCommand.ts`                        |
| 105  | `src/application/unit-list/unitListDefaultAwareHelpers.ts`                      | Application / unit list/table                     | `16/5/101/89/0`                  | yes   | 1 / 2             | 4 / `C4-UNIT-LIST`       | 4               | 32 / `32,4,2,src/application/unit-list/unitListDefaultAwareHelpers.ts`                      |
| 106  | `src/domain/services/diagnostics/evaluateTransferDiagnosticViolations.ts`       | Domain / JP1/AJS diagnostics                      | `17/15/171/161/0`                | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 4               | 32 / `32,4,2,src/domain/services/diagnostics/evaluateTransferDiagnosticViolations.ts`       |
| 107  | `src/domain/services/diagnostics/JobEndDiagnosticRules.ts`                      | Domain / JP1/AJS diagnostics                      | `12/6/40/36/0`                   | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 4               | 32 / `32,4,2,src/domain/services/diagnostics/JobEndDiagnosticRules.ts`                      |
| 108  | `src/domain/services/diagnostics/MonitoringWaitDiagnosticRules.ts`              | Domain / JP1/AJS diagnostics                      | `18/8/48/38/0`                   | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 4               | 32 / `32,4,2,src/domain/services/diagnostics/MonitoringWaitDiagnosticRules.ts`              |
| 109  | `src/domain/services/diagnostics/TransferDiagnosticRules.ts`                    | Domain / JP1/AJS diagnostics                      | `18/12/65/55/0`                  | yes   | 1 / 2             | 4 / `C4-DIAGNOSTICS`     | 4               | 32 / `32,4,2,src/domain/services/diagnostics/TransferDiagnosticRules.ts`                    |
| 110  | `src/application/unit-definition/buildAjsCommandBuilders.ts`                    | Application / unit definition                     | `1/0/365/359/0`                  | no    | 1 / 2             | 3 / `C3-UNIT-DEFINITION` | 5               | 30 / `30,5,2,src/application/unit-definition/buildAjsCommandBuilders.ts`                    |
| 111  | `src/application/unit-definition/buildCommandLine.ts`                           | Application / unit definition                     | `29/27/141/121/0`                | no    | 1 / 2             | 3 / `C3-UNIT-DEFINITION` | 5               | 30 / `30,5,2,src/application/unit-definition/buildCommandLine.ts`                           |
| 112  | `src/application/unit-definition/unitDefinitionDocument.ts`                     | Application / unit definition                     | `87/20/117/106/0`                | yes   | 1 / 2             | 3 / `C3-UNIT-DEFINITION` | 5               | 30 / `30,5,2,src/application/unit-definition/unitDefinitionDocument.ts`                     |
| 113  | `src/infrastructure/i18n/ParameterSyntaxResourceAdapter.ts`                     | Infrastructure / host/support adapter             | `3/1/34/29/1`                    | no    | 1 / 2             | 3 / `C3-HOVER`           | 5               | 30 / `30,5,2,src/infrastructure/i18n/ParameterSyntaxResourceAdapter.ts`                     |
| 114  | `src/domain/values/AjsType.ts`                                                  | Domain / JP1/AJS supporting value                 | `7/0/296/291/0`                  | no    | 0 / 1             | 5 / `C5-MODEL`           | 5               | 25 / `25,5,1,src/domain/values/AjsType.ts`                                                  |
| 115  | `src/infrastructure/parser/raw/AjsRawUnit.ts`                                   | Infrastructure / parser/normalization             | `8/4/62/43/2`                    | no    | 1 / 1             | 5 / `C5-PARSER`          | 5               | 25 / `25,5,1,src/infrastructure/parser/raw/AjsRawUnit.ts`                                   |
| 116  | `src/presentation/vscode/webview/WebviewStore.ts`                               | Presentation/VS Code / viewer transport           | `3/1/66/56/1`                    | no    | 1 / 1             | 4 / `C4-VIEWER`          | 5               | 20 / `20,5,1,src/presentation/vscode/webview/WebviewStore.ts`                               |
| 117  | `src/presentation/webview/editor/ajsFlow/expandedFlowGraphGeometry.ts`          | Presentation/webview / flow graph/viewer          | `37/3/156/141/0`                 | no    | 1 / 1             | 4 / `C4-FLOW`            | 5               | 20 / `20,5,1,src/presentation/webview/editor/ajsFlow/expandedFlowGraphGeometry.ts`          |
| 118  | `src/presentation/webview/editor/ajsFlow/flowKeyboardNavigation.ts`             | Presentation/webview / flow graph/viewer          | `47/38/357/320/0`                | no    | 1 / 1             | 4 / `C4-FLOW`            | 5               | 20 / `20,5,1,src/presentation/webview/editor/ajsFlow/flowKeyboardNavigation.ts`             |
| 119  | `src/presentation/webview/editor/ajsFlow/flowKeyboardNavigationActions.ts`      | Presentation/webview / flow graph/viewer          | `56/32/323/296/0`                | no    | 1 / 1             | 4 / `C4-FLOW`            | 5               | 20 / `20,5,1,src/presentation/webview/editor/ajsFlow/flowKeyboardNavigationActions.ts`      |
| 120  | `src/presentation/webview/editor/ajsTable/tableSearchState.ts`                  | Presentation/webview / unit list/table            | `28/19/133/119/0`                | no    | 1 / 1             | 4 / `C4-UNIT-LIST`       | 5               | 20 / `20,5,1,src/presentation/webview/editor/ajsTable/tableSearchState.ts`                  |
| 121  | `src/presentation/webview/editor/shared/unitTreeNavigation.ts`                  | Presentation/webview / shared viewer transport    | `61/29/308/278/0`                | yes   | 1 / 1             | 4 / `C4-VIEWER`          | 5               | 20 / `20,5,1,src/presentation/webview/editor/shared/unitTreeNavigation.ts`                  |
| 122  | `src/presentation/webview/viewerHostMessages.ts`                                | Presentation/webview / shared viewer transport    | `35/24/146/128/0`                | yes   | 1 / 1             | 4 / `C4-VIEWER`          | 5               | 20 / `20,5,1,src/presentation/webview/viewerHostMessages.ts`                                |
| 123  | `src/presentation/webview/viewerRequestMessages.ts`                             | Presentation/webview / shared viewer transport    | `52/40/230/206/0`                | yes   | 1 / 1             | 4 / `C4-VIEWER`          | 5               | 20 / `20,5,1,src/presentation/webview/viewerRequestMessages.ts`                             |
| 124  | `src/presentation/semantic-diff/renderSemanticDiffMarkdown.ts`                  | Presentation / semantic diff                      | `23/13/193/179/0`                | no    | 1 / 1             | 3 / `C3-SEMANTIC-REPORT` | 5               | 15 / `15,5,1,src/presentation/semantic-diff/renderSemanticDiffMarkdown.ts`                  |
| 125  | `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`            | Presentation / semantic diff                      | `99/90/390/368/0`                | yes   | 1 / 1             | 3 / `C3-SEMANTIC-REPORT` | 5               | 15 / `15,5,1,src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`            |
| 126  | `src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts`           | Presentation/VS Code / semantic diff              | `12/6/92/78/1`                   | no    | 1 / 1             | 3 / `C3-SEMANTIC-REPORT` | 5               | 15 / `15,5,1,src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts`           |
| 127  | `src/resource/i18n/ajscolumn_en.ts`                                             | Resource / localization resources                 | `1/0/232/192/0`                  | yes   | 0 / 1             | 2 / `C2-RESOURCE`        | 5               | 10 / `10,5,1,src/resource/i18n/ajscolumn_en.ts`                                             |
| 128  | `src/resource/i18n/ajscolumn_ja.ts`                                             | Resource / localization resources                 | `1/0/232/192/0`                  | yes   | 0 / 1             | 2 / `C2-RESOURCE`        | 5               | 10 / `10,5,1,src/resource/i18n/ajscolumn_ja.ts`                                             |
| 129  | `src/resource/i18n/parameter_en.ts`                                             | Resource / localization resources                 | `1/0/679/679/0`                  | no    | 0 / 1             | 2 / `C2-RESOURCE`        | 5               | 10 / `10,5,1,src/resource/i18n/parameter_en.ts`                                             |
| 130  | `src/resource/i18n/ty.ts`                                                       | Resource / localization resources                 | `2/0/217/209/0`                  | no    | 1 / 1             | 2 / `C2-RESOURCE`        | 5               | 10 / `10,5,1,src/resource/i18n/ty.ts`                                                       |
