# Requirements Traceability: Reduce Cognitive Complexity

<!-- markdownlint-disable MD013 MD060 -->

| Requirement or source                                           | Slice                                                                                                   | Test or validation                                                                                                                                                                                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1: functions <=14                                              | S1-S5; all-function final gate S5                                                                       | S1 changed functions <=12; S2 `VirtualizedTable` and new functions <=14; S3 named hooks 13/0 cognitive and changed/new measured functions <=14; see evidence                                                                            |
| R2-R3: real comparable reductions                               | Every slice and S5 original-base comparison                                                             | S1 totals 4,260→4,217 / 4,406→4,385; S2 4,217→4,161 / 4,385→4,385; S3 4,161→4,133 / 4,385→4,374 cognitive/cyclomatic with qlty 0.645.0 and unchanged selection                                                                          |
| R4: meaningful simplification                                   | S1 movement algebra; S2 focus lifecycle; S3 tree policy; S4 activity guards; S5 candidate/result policy | S1 shares axis operations; S2 unifies reset/DOM focus; S3 centralizes visible-focus policy and action dispatch while retaining lifecycle and DOM ownership; S4-S5 remain planned                                                        |
| R5: unit-list behavior; unit-list and cross-view use cases      | S1-S2                                                                                                   | S1 tableNavigation boundary tests; S2 verifies H/Escape returns focus and the sole roving tab stop to the originating cell; full suite; see S2 evidence                                                                                 |
| R6: tree interaction; unit-list and flow-exploration use cases  | S3                                                                                                      | unitTreeSelector model tests; accessibilityDom covers collapsed requests through expansion, delayed DOM-row registration, revision consumption, roving focus and nested controls; full suite retains real-browser deep-tree coverage    |
| R7: viewer message behavior                                     | S4                                                                                                      | viewerMessageRouting: active/inactive, deferred SAVE, invalid/unavailable save, direct-handler semantics, errors, disposal and telemetry                                                                                                |
| R8: cross-view scope; flow-exploration and navigation use cases | S5                                                                                                      | revealUnit resolver ordering/fallback/cycle tests; flowScopeState integration                                                                                                                                                           |
| R9: compatibility and regression                                | Every slice                                                                                             | S2 checks remain recorded; corrected S3 full suite/architecture and desktop/web/editor test bundles passed; unchanged product tsc/build and VS Code 1.75 smoke are reused; corrected qlty check has zero added results; see S3 evidence |

The S1 Cloud correction changes table alignment only. It does not change the
R1-R9 acceptance mappings or implementation results; no traceability row
change is required. See the corrective validation record in `TASKS.md`.

The S2 CI correction gives the existing multi-action integration case a
10,000 ms Mocha limit because its four sequential `waitFor` calls can outlast
the default 2,000 ms ceiling. It preserves every wait and assertion, so the
R1-R9 acceptance mappings and implementation results remain unchanged. See
the corrective validation record in `TASKS.md`.

<!-- markdownlint-enable MD013 MD060 -->
