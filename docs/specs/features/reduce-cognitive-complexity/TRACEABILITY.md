# Requirements Traceability: Reduce Cognitive Complexity

<!-- markdownlint-disable MD013 MD060 -->

| Requirement or source | Slice | Test or validation |
| --- | --- | --- |
| R1: functions <=14 | S1-S5; all-function final gate S5 | Official full-selection function metrics, including new/moved functions |
| R2-R3: real comparable reductions | Every slice and S5 original-base comparison | Official file cognitive sum strictly down, cyclomatic non-increasing; identical qlty version/config/selection; check/smells SARIF; final aggregate |
| R4: meaningful simplification | S1 movement algebra; S2 focus lifecycle; S3 tree policy; S4 activity guards; S5 candidate/result policy | Solution Shape and independent semantic review of removed decisions/duplication |
| R5: unit-list behavior; unit-list and cross-view use cases | S1-S2 | tableNavigation, tableVirtualizationFocus, tableShellIntegration, accessibilityDom; real browser fixture for deferred grid mount |
| R6: tree interaction; unit-list and flow-exploration use cases | S3 | unitTreeSelector, accessibilityDom, real browser deep-tree fixture; revision/expansion/DOM waiting, Escape and modifiers |
| R7: viewer message behavior | S4 | viewerMessageRouting: active/inactive, deferred SAVE, invalid/unavailable save, direct-handler semantics, errors, disposal and telemetry |
| R8: cross-view scope; flow-exploration and navigation use cases | S5 | revealUnit resolver ordering/fallback/cycle tests; flowScopeState integration |
| R9: compatibility and regression | Every slice | test:full including architectureDependencyRules and DOM Chromium; tsc --noEmit; build desktop/web/editor; test:desktop:min; changed-document checks |

<!-- markdownlint-enable MD013 MD060 -->
