# Requirements Traceability: Reduce Cognitive Complexity

<!-- markdownlint-disable MD013 MD060 -->

| Requirement or source                                           | Slice                                                                                                   | Test or validation                                                                                                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1: functions <=14                                              | S1-S5; all-function final gate S5                                                                       | S1 changed model functions <=12; full-selection function metrics include new/moved functions; see `/private/tmp/vscode-ajsbutler-s1-evidence.d9FjJV/s1.md`                     |
| R2-R3: real comparable reductions                               | Every slice and S5 original-base comparison                                                             | S1 full totals: cognitive 4,260→4,217, cyclomatic 4,406→4,385; same qlty 0.645.0/config/selection; check/smells statuses, path inventories, SARIF and aggregate in S1 evidence |
| R4: meaningful simplification                                   | S1 movement algebra; S2 focus lifecycle; S3 tree policy; S4 activity guards; S5 candidate/result policy | S1 uses shared axis operations and explicit origin/transition policies; semantic review found no code issue; evidence-only re-review is pending                                |
| R5: unit-list behavior; unit-list and cross-view use cases      | S1-S2                                                                                                   | S1 tableNavigation boundary tests and full desktop/DOM/web suite passed; S2 adds focus lifecycle coverage                                                                      |
| R6: tree interaction; unit-list and flow-exploration use cases  | S3                                                                                                      | unitTreeSelector, accessibilityDom, real browser deep-tree fixture; revision/expansion/DOM waiting, Escape and modifiers                                                       |
| R7: viewer message behavior                                     | S4                                                                                                      | viewerMessageRouting: active/inactive, deferred SAVE, invalid/unavailable save, direct-handler semantics, errors, disposal and telemetry                                       |
| R8: cross-view scope; flow-exploration and navigation use cases | S5                                                                                                      | revealUnit resolver ordering/fallback/cycle tests; flowScopeState integration                                                                                                  |
| R9: compatibility and regression                                | Every slice                                                                                             | S1 test:full incl. architecture and DOM/web, tsc, desktop/web/editor build, desktop:min and targeted docs checks passed; see S1 evidence                                       |

The S1 Cloud correction changes table alignment only. It does not change the
R1-R9 acceptance mappings or implementation results; no traceability row
change is required. See the corrective validation record in `TASKS.md`.

<!-- markdownlint-enable MD013 MD060 -->
