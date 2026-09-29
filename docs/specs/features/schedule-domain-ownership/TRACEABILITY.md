# Requirements Traceability: Schedule Domain Ownership

<!-- markdownlint-disable MD013 MD060 -->

| Requirement / acceptance | Slice | Test or validation |
| --- | --- | --- |
| Domain schedule retains date/rule ownership and all date-token, default-rule, malformed-value behavior | Original Slice 1; R1 | `scheduleRuleHelpers.test.ts`; `unitListViewHelpers.test.ts`; `evaluateScheduleDiagnosticViolations.test.ts`; official Qlty SARIF for `interpretScheduleDateValue` complexity 10 and `interpretScheduleDateDay` complexity 24/returns 9 |
| Calendar context, hierarchy, selector precedence, evidence, index reuse/non-mutation, and operational month retain meaning | Original Slice 3; R1 | `semanticDiffScheduleCalendar.test.ts`; `scheduleImpactCalendarProjection.test.ts`; official Qlty SARIF for `ScheduleCalendar.ts` file complexity 136 |
| Absolute/operational candidates retain order, bounds, deferred/invalid/context distinctions | Original Slices 2–4; R1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffScheduleCalendar.test.ts`; official Qlty SARIF for `ScheduleCandidateResolver.ts` file complexity 86 |
| Projection retains half-open periods, substitutions, runs, status, evidence, and no-runs distinctions; Semantic Diff owns comparison policy | Original Slice 4; R1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; `semanticDiffScheduleImpact.test.ts`; `semanticDiffContracts.test.ts`; `compareSemanticDiffWithArtifacts.test.ts`; official Qlty SARIF for `ScheduleProjection.ts` file complexity 156 |
| Application DTOs, user behavior, JP1/AJS3 v13, VS Code `^1.75.0`, desktop/web, architecture, and quality configuration remain compatible | Original Slices 1–4; R1 | `architectureDependencyRules.test.ts`; full desktop suites; `tsc --noEmit -p tsconfig.json`, `build`, `test:web`; unchanged `package.json` and `.qlty/qlty.toml`; all-`src` import audit |
| All six PR blockers resolved and closure evidence reflects current head | R1 and Feature Exit | Baseline/final official qlty check/smells SARIF using the same `--all` selection and configuration, recorded analyzed-path inventories (including the four original and eight final schedule files), passing final aggregate, no new SARIF finding of any severity or reliably mapped adverse movement, passing current-head Qlty Cloud `qlty check`, independent implementation review and Feature Exit |
| Reusable SDD Qlty procedure analyzes a nonzero full-repository scope in clean baseline and final snapshots | R1 | Exact `docs/specs/README.md` Qlty Evidence Format correction; `lint:md` plus `npx markdownlint-cli2 docs/specs/README.md`; recorded command/scope/configuration/path inventories |

<!-- markdownlint-enable MD013 MD060 -->
