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

## Architecture-rule evidence

The required validation sequence was:

```text
pnpm run test:compile
pnpm exec mocha --ui tdd out/test/suite/architectureDependencyRules.test.js
```

- `pnpm run test:compile`: passed.
- Architecture suite: **incomplete**, 8 passing and 5 failing.
- All five failures stop in the existing test helper while scanning
  `src/shared`, which is absent at the baseline commit. The failing tests are
  the production-root collection, application-localization boundary,
  zero-violation rule assertion, raw telemetry scan, and composition-root
  construction tests.
- This is baseline evidence, not a Slice 1 change. No test, architecture
  rule, allowlist, or source directory was added. Therefore this report does
  not claim a zero-exception architecture result, and Slice 2 must remain
  blocked until the missing-path condition is resolved or explicitly accepted
  by the owning plan.

The architecture responsibility reference remains
`docs/specs/architecture.md`. Slice 1 records the existing test result only;
candidate layer classification and responsibility ranking belong to Slice 2.

## Validation and change control

- Qlty's three exact Slice 1 commands completed successfully with the recorded
  version and configuration.
- Execution note: the sandboxed `rtk qlty` wrapper could not create Qlty's
  user log; the installed `qlty` executable ran the exact measurements with
  approved log-write access. The final `rtk pnpm run qlty` check passed with
  the same access requirement.
- The file-level command completed successfully.
- The architecture test compilation completed successfully; the runtime suite
  has the baseline failure described above.
- No production, test, generated, package, configuration, CI, VS Code, web,
  parser, model, or JP1/AJS behavior file was changed for this slice.
- `out/` is validation-only and is not a feature artifact.
- Desktop and web impact: none; no analysis tooling enters either bundle.
- README and user documentation: no update required.
- CHANGELOG: no update required under the repository criteria because there is
  no externally observable extension behavior change.
- Failure handling: unavailable metrics remain explicit; unsupported or
  incomplete architecture evidence is not normalized into a pass.

<!-- markdownlint-enable MD013 MD012 -->
