# Traceability: Strengthen SDD Solution Quality Gates

<!-- markdownlint-disable MD013 -->

`TASKS.md` owns the plan and current state. This file owns the
requirement-to-validation evidence. Together they are the canonical evidence
record for the slice and must retain exact commands, configuration, findings,
dry-run outcomes, and compatibility results rather than a chronological work
log.

| Source | Requirement | `SPECS.md` section | Implementation slice | Test or validation plan |
| --- | --- | --- | --- | --- |
| Branch policy goal | R1: Semantic Ownership Evidence | Requirements / R1 | Slice 1 | Cross-surface review confirms every material decision, invariant, translation, lifecycle, public name, contract, dependency, and applicable test has an agreed semantic owner and package/layer. The WebAPI dry run exercises this evidence. |
| Branch policy goal | R2: Meaningful Abstraction Responsibility | Requirements / R2 | Slice 1 | Separate dry-run cases accept the application-owned port for dependency inversion/host-neutral contract value and the infrastructure adapter for applicable isolation, translation, error normalization, lifecycle, or compatibility value. A pass-through wrapper fails. The retained application factory passes separately because defensive connection/scope DTO copies preserve the application boundary before invoking the port, as proven by `src/test/suite/importAjsDefinitionViaWebApi.test.ts`; any later contradiction is an implementation-review finding. |
| Branch policy goal | R3: Framework-First Decisions And Wrapper Limits | Requirements / R3 | Slice 1 | Review considers `globalThis.fetch`, `AbortController`, the generated OpenAPI operation/contract, and the credential provider; records a concrete custom gap only if proposed; keeps HTTP/framework wrappers outer-layer; and rejects generic pass-through wrappers. |
| Branch policy goal | R4: qlty Baseline-To-Final Delta | Requirements / R4 | Slice 1 | `TASKS.md` and `TRACEABILITY.md` record baseline/final output from the identical qlty command and configuration, with rule/path/symbol-location identity where available. New or worsened findings are separated from unchanged unrelated baseline findings; metric-only movement remains a review signal. |
| Existing SDD lifecycle | R5: Lifecycle-Preserving Integration | Requirements / R5 | Slice 1 | Diff review confirms only the seven durable target paths change, with evidence-only updates permitted in this feature's `TASKS.md` and `TRACEABILITY.md`; `SPECS.md` remains read-only unless Replanning. Human/Completion/Closure Approval, approval commits, role ownership, Replanning, and Feature Exit remain unchanged. |
| Architecture policy | Automatic enforcement boundary | Architecture; Acceptance Criteria | Slice 1 | Compile and run `architectureDependencyRules.test.ts`; documentation claims only the existing dependency/construction/parser/telemetry rule catalog is automatic and assigns semantic ownership, abstraction value, framework sufficiency, custom-gap credibility, and qlty disposition to reviewers. |
| Compatibility contracts | Compatibility and non-goals | Compatibility; Non-Goals | Slice 1 | `rtk git diff --check` plus path review confirm no runtime, test, generated, configuration, `.qlty/qlty.toml`, `package.json`, or `engines.vscode` change and no desktop/web/JP1-AJS behavior impact. Because `AGENTS.md` and `.agents/skills/**/*.md` are outside the Verify docs-only allowlist, record build, test compilation, desktop, and web evidence. |
| Repository documentation quality | Compact, mutually consistent durable guidance | Acceptance Criteria | Slice 1 | Run `rtk pnpm run lint:md` plus targeted `rtk pnpm exec markdownlint-cli2 AGENTS.md docs/specs/architecture.md`; review cross-surface terminology and separate WebAPI dry-run outcomes; confirm no unrelated baseline qlty finding became approved cleanup. |

<!-- markdownlint-enable MD013 -->

## Slice 1 Evidence Record

- Status: Pending implementation, independent review, and approval.
- Before implementation, preserve the planned command/configuration identity:
  `rtk pnpm run qlty` with the unchanged repository qlty configuration, plus
  the Markdown, diff, build, test-compile, desktop, web, and architecture-test
  commands listed above.
- Before implementation review, record final changed paths, exact command and
  configuration, qlty baseline/final comparison, finding identity by rule/path
  and symbol/location where available, and separate new/worsened findings from
  unchanged unrelated baseline findings.
- Record the separate WebAPI dry-run outcomes for the port, adapter, and
  proposed pass-through wrapper, and the retained application factory. Record
  the factory's passing defensive DTO-copy evidence from
  `src/test/suite/importAjsDefinitionViaWebApi.test.ts`; if a later
  implementation contradicts it, record an implementation-review finding
  rather than a second dry-run outcome. Also record relevant existing
  capabilities, any concrete custom gap, and outer-layer placement. Record
  desktop/web Verify results and compatibility confirmation here as well. Do
  not turn this section into a chronological work log.
