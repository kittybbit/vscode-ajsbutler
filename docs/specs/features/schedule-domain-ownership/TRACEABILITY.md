# Requirements Traceability: Schedule Domain Ownership

<!-- markdownlint-disable MD013 MD060 -->

| Requirement / acceptance                                                                                                                    | Slice                   | Test or validation                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain schedule retains date/rule ownership and all date-token, default-rule, malformed-value behavior                                      | Original Slice 1; R1    | `scheduleRuleHelpers.test.ts`; `unitListViewHelpers.test.ts`; `evaluateScheduleDiagnosticViolations.test.ts`; official Qlty SARIF for `interpretScheduleDateValue` complexity 10 and `interpretScheduleDateDay` complexity 24/returns 9                                                                                                                                                                   |
| Calendar context, hierarchy, selector precedence, evidence, index reuse/non-mutation, and operational month retain meaning                  | Original Slice 3; R1    | `semanticDiffScheduleCalendar.test.ts`; `scheduleImpactCalendarProjection.test.ts`; official Qlty SARIF for `ScheduleCalendar.ts` file complexity 136                                                                                                                                                                                                                                                     |
| Absolute/operational candidates retain order, bounds, deferred/invalid/context distinctions                                                 | Original Slices 2–4; R1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffScheduleCalendar.test.ts`; official Qlty SARIF for `ScheduleCandidateResolver.ts` file complexity 86                                                                                                                                                                                                                                                    |
| Projection retains half-open periods, substitutions, runs, status, evidence, and no-runs distinctions; Semantic Diff owns comparison policy | Original Slice 4; R1    | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; `semanticDiffScheduleImpact.test.ts`; `semanticDiffContracts.test.ts`; `compareSemanticDiffWithArtifacts.test.ts`; official Qlty SARIF for `ScheduleProjection.ts` file complexity 156                                                                                                                                               |
| Application DTOs, user behavior, JP1/AJS3 v13, VS Code `^1.75.0`, desktop/web, architecture, and quality configuration remain compatible    | Original Slices 1–4; R1 | `architectureDependencyRules.test.ts`; full desktop suites; `tsc --noEmit -p tsconfig.json`, `build`, `test:web`; unchanged `package.json` and `.qlty/qlty.toml`; all-`src` import audit                                                                                                                                                                                                                  |
| All six PR blockers resolved and closure evidence reflects current head                                                                     | R1 and Feature Exit     | Baseline/final official qlty check/smells SARIF using the same `--all` selection and configuration, recorded analyzed-path inventories (including the four original and eight final schedule files), passing final aggregate, no new reliably mapped finding of any severity or mapped adverse movement, passing current-head Qlty Cloud `qlty check`, independent implementation review and Feature Exit |
| Reusable SDD Qlty procedure analyzes a nonzero full-repository scope in clean baseline and final snapshots                                  | R1                      | Exact `docs/specs/README.md` Qlty Evidence Format correction; `lint:md` plus `npx markdownlint-cli2 docs/specs/README.md`; recorded command/scope/configuration/path inventories                                                                                                                                                                                                                          |

<!-- markdownlint-enable MD013 MD060 -->

## R1 Local Implementation Evidence

The first two independent implementation reviews returned Findings. This revision
normalizes an absent numeric-day prefix to the existing calendar-day token,
returns a fresh object for each `en` and `ud` keyword interpretation, and
preserves the pre-R1 parser contract by interpreting `+su:6` as weekday
occurrence 6. Calendar/candidate validation remains responsible for semantic
validity; lexical malformed suffix `+su:x` remains rejected. The keyword
mutation-isolation regression, `+su:6` contract case, and lexical malformed
case are covered by the focused schedule-rule suite. The evidence record also
includes saved command logs, exit codes, path inventories, and named
desktop-suite coverage. Independent re-review, Completion Approval, and
Feature Exit remain pending.

### Qlty snapshot evidence

Baseline and final snapshots are both based on commit
`97702d9e5c41adf8221e769b131fd844d76400db`. They use qlty `0.645.0`, the same
`.qlty/qlty.toml` SHA-256
`f551fa47da3ac111a3e29857ff0f431abb0e0a20c17a8c794660c255f4dfb4c2`, and the
same `--all` selections:

- `rtk pnpm exec qlty check --all --sarif --no-fix`
- `rtk pnpm exec qlty smells --all --sarif --no-snippets`

Each snapshot has separate official SARIF, raw command output, exit status,
and analyzed-path inventories. The path lists are linked below; Qlty check
inventories are the union of Qlty's per-plugin `targetPaths` invocation
manifests. Qlty smells SARIF and progress output do not expose all analyzed
paths. The saved smells inventory is reproducibly reconstructed from the
official full check inventory using source suffixes `.ts`, `.tsx`, `.js`, and
`.mjs`, excluding `/test/`, `.test`, and `.spec` TypeScript paths because
`--include-tests` was not selected. Its count matches both Qlty progress
phases. This is a documented inventory limitation: Qlty did not emit a native
per-file smells list, so path membership is derived from its check inventory
and default source/test selection. The derivation script and exact commands
are linked below. The baseline inventories contain 716 Qlty-check paths and
423 Qlty-smells paths. The final inventories contain 724 and 431 paths
respectively, including the four original schedule files and eight new
modules: `ScheduleCalendarEntries.ts`, `ScheduleCalendarIndex.ts`,
`ScheduleOperationalCalendar.ts`, `ScheduleOperationalCandidates.ts`,
`ScheduleProjectionOutcomes.ts`, `ScheduleProjectionRules.ts`,
`ScheduleSubstitutionAnalysis.ts`, and `ScheduleSubstitutionResolution.ts`.

<!-- markdownlint-disable MD013 -->

- Baseline check: [SARIF](/private/tmp/sdd-schedule-r1-baseline-977/.git/sdd-evidence/baseline/check.sarif.json), [raw output](/private/tmp/sdd-schedule-r1-baseline-977/.git/sdd-evidence/baseline/check.log), [exit status](/private/tmp/sdd-schedule-r1-baseline-977/.git/sdd-evidence/baseline/check.exit), [716-path inventory](/private/tmp/sdd-schedule-r1-revision-20260929/baseline/check-paths.txt), [invocation summary](/private/tmp/sdd-schedule-r1-revision-20260929/baseline/check-manifests.txt), and [raw invocation manifests](/private/tmp/sdd-schedule-r1-revision-20260929/baseline/check-manifests/).
- Baseline smells: [SARIF](/private/tmp/sdd-schedule-r1-baseline-977/.git/sdd-evidence/baseline/smells.sarif.json), [raw output](/private/tmp/sdd-schedule-r1-baseline-977/.git/sdd-evidence/baseline/smells.log), [exit status](/private/tmp/sdd-schedule-r1-baseline-977/.git/sdd-evidence/baseline/smells.exit), [423-path inventory](/private/tmp/sdd-schedule-r1-revision-20260929/baseline/smells-paths.txt), and [reconstruction method and limitation](/private/tmp/sdd-schedule-r1-revision-20260929/baseline/smells-inventory-method.txt) with [regeneration script](/private/tmp/sdd-schedule-r1-revision-20260929/baseline/reconstruct-smells-inventory.py).
- Final check: [SARIF](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/check.sarif.json), [raw output](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/check.stderr.log), [exit status](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/check.exit), [724-path inventory](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/check-paths.txt), [invocation summary](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/check-manifests.txt), and [raw invocation manifests](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/check-manifests/).
- Final smells: [SARIF](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/smells.sarif.json), [raw output](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/smells.stderr.log), [exit status](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/smells.exit), [431-path inventory](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/smells-paths.txt), and [reconstruction method](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/smells-inventory-method.txt) with [regeneration script](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/reconstruct-smells-inventory.py).
<!-- markdownlint-enable MD013 -->

Baseline check completed with 7 findings and exit 1; the raw stderr states the
scan found 7 issues and 2 unformatted files. Its SARIF is valid 2.1.0, so the
exit is finding-triggered rather than an execution failure. Baseline smells
completed with exit 0 and 157 findings. Definitive final check completed with
3 findings and exit 1; all three are identical to baseline records. Final
smells completed with exit 0 and 151 findings. Exact complete-record comparison
found zero new check records, four removed check records, zero new smell
records, and six removed smell records. The six removed smell records are the
original PR blockers: `ScheduleCalendar.ts` complexity 136,
`ScheduleCandidateResolver.ts` complexity 86, `ScheduleProjection.ts`
complexity 156, `interpretScheduleDateValue` complexity 10,
`interpretScheduleDateDay` complexity 24, and its return count 9. No final
smell record remains on those four original schedule files or the eight new
modules. The unrelated `qlty:similar-code` pair that varied in the earlier
snapshot is record-identical to baseline in this definitive final snapshot.
The baseline-to-final analyzed path delta consists exactly of the eight
approved new schedule modules, with no removed path. The [complete SARIF
comparison](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/sarif-comparison.txt),
[new smell records](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/smells-new.records.jsonl),
and [removed smell records](/private/tmp/sdd-schedule-r1-revision-20260929/final-r3/smells-removed.records.jsonl)
are saved. The final aggregate `rtk pnpm run qlty` passed with exit 0. The
full-repository SARIF check's exit 1 reflects the three unchanged findings
outside R1's approved paths; it does not indicate an execution failure.

### Behavior and required checks

`decodeNumericDay` now maps a missing optional prefix to the existing empty
prefix entry (`calendar`). The compiled public interpreter directly returns
`day.kind === "calendar"` for both `2,2026/04/27` and `0,15`; the existing
`scheduleRuleHelpers.test.ts` expectations cover those full interpretations.
Keyword decoding creates a fresh object for each result, so mutation of one
`en` or `ud` parse cannot affect a later parse. The date decoder retains
numeric weekday occurrences such as 6 for downstream semantic validation.
The focused Schedule rule helpers suite passes all eight tests, including the
mutation-isolation, `+su:6` contract, and `+su:x` lexical-malformed cases; its
final raw output and exit status are saved at
[r3-date-suite.log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-date-suite.log)
and [r3-date-suite.exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-date-suite.exit).
The direct assertion output and exit status are saved at
`/private/tmp/sdd-schedule-r1-revision-20260929/date-regression.log` and
`date-regression.exit`.

The full desktop runner loads all compiled `src/test/suite/**/*.test.js` files
and exited 0 after the keyword-isolation and weekday-range fixes. The editable
suites passed: Schedule rule helpers, Semantic Diff
Schedule Calendar Context, Semantic Diff Schedule Rules, and Schedule impact
calendar projection. The validation-only suites passed: Semantic Diff
Schedule, Semantic Diff schedule impact, Semantic Diff Structured Contracts,
Semantic Diff comparison artifacts, Unit List View helpers, Evaluate schedule
diagnostic violations, and Architecture dependency rules. They are also listed
in [desktop suite evidence](/private/tmp/sdd-schedule-r1-revision-20260929/desktop-suites.txt);
the raw runner output and exit status are
[r3-desktop-full.log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-desktop-full.log)
and [r3-desktop-full.exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-desktop-full.exit).
The elevated Web test run passed WEB-7 through WEB-10; its raw output and exit
status are
[r3-web-full-elevated.log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-web-full-elevated.log)
and [r3-web-full-elevated.exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-web-full-elevated.exit).
The first sandboxed Web launch could not start Chromium due to macOS Mach-port
permissions; that attempt and status are retained in [web.log](/private/tmp/sdd-schedule-r1-revision-20260929/web.log)
and [web.exit](/private/tmp/sdd-schedule-r1-revision-20260929/web.exit).

Other required validations and raw command results:

<!-- markdownlint-disable MD013 -->

- Production TypeScript: [log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-tsc-production.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-tsc-production.exit).
- Test TypeScript: [log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-tsc-test.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-tsc-test.exit).
- Production webpack build: [log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-build.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-build.exit).
- Desktop webpack and test compilation preparation: [log](/private/tmp/sdd-schedule-r1-revision-20260929/r3-test-prepare-desktop.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/r3-test-prepare-desktop.exit).
- Feature-document Markdown validation: [log](/private/tmp/sdd-schedule-r1-revision-20260929/markdownlint.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/markdownlint.exit).
- Standalone `docs/specs/README.md` Markdown validation: [log](/private/tmp/sdd-schedule-r1-revision-20260929/markdownlint-readme.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/markdownlint-readme.exit).
- `git diff --check`: [log](/private/tmp/sdd-schedule-r1-revision-20260929/diff-check.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/diff-check.exit).
- All-`src` import audit: [script](/private/tmp/sdd-schedule-r1-revision-20260929/import-audit.cjs), [log](/private/tmp/sdd-schedule-r1-revision-20260929/import-audit.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/import-audit.exit).
- Existing schedule public-export comparison: [script](/private/tmp/sdd-schedule-r1-revision-20260929/public-exports.cjs), [log](/private/tmp/sdd-schedule-r1-revision-20260929/public-exports.log), [exit](/private/tmp/sdd-schedule-r1-revision-20260929/public-exports.exit).
- Final Qlty aggregate: [log](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/aggregate.log), [exit](/private/tmp/sdd-schedule-r1-final-r3/.git/sdd-evidence/final-r3/aggregate.exit).

<!-- markdownlint-enable MD013 -->

The build emitted only webpack asset-size recommendations. No application
contract, schedule output, engine requirement, VS Code API, Qlty rule,
telemetry, or user-facing behavior changed. Shared schedule modules remain
browser-safe. The architecture dependency test passed as a named suite in the
full desktop run. Current-head Qlty Cloud remains unverified because this
local result has not been published to the PR; local checks alone do not close
the feature.
