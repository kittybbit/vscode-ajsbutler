# Traceability: Strengthen SDD Solution Quality Gates

<!-- markdownlint-disable MD013 -->

`TASKS.md` owns the plan and current state. This file owns the
requirement-to-validation evidence. Together they are the canonical evidence
record for the slice and must retain exact commands, configuration, findings,
dry-run outcomes, and compatibility results rather than a chronological work
log.

| Source                           | Requirement                                      | `SPECS.md` section                | Implementation slice | Test or validation plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------ | --------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch policy goal               | R1: Semantic Ownership Evidence                  | Requirements / R1                 | Slice 1              | Cross-surface review confirms every material decision, invariant, translation, lifecycle, public name, contract, dependency, and applicable test has an agreed semantic owner and package/layer. The WebAPI dry run exercises this evidence.                                                                                                                                                                                                                                                                                                                            |
| Branch policy goal               | R2: Meaningful Abstraction Responsibility        | Requirements / R2                 | Slice 1              | Separate dry-run cases accept the application-owned port for dependency inversion/host-neutral contract value and the infrastructure adapter for applicable isolation, translation, error normalization, lifecycle, or compatibility value. A pass-through wrapper fails. The retained application factory passes separately because defensive connection/scope DTO copies preserve the application boundary before invoking the port, as proven by `src/test/suite/importAjsDefinitionViaWebApi.test.ts`; any later contradiction is an implementation-review finding. |
| Branch policy goal               | R3: Framework-First Decisions And Wrapper Limits | Requirements / R3                 | Slice 1              | Review considers `globalThis.fetch`, `AbortController`, the generated OpenAPI operation/contract, and the credential provider; records a concrete custom gap only if proposed; keeps HTTP/framework wrappers outer-layer; and rejects generic pass-through wrappers.                                                                                                                                                                                                                                                                                                    |
| Branch policy goal               | R4: qlty Baseline-To-Final Delta                 | Requirements / R4                 | Slice 1              | `TASKS.md` and `TRACEABILITY.md` record baseline/final output from the identical qlty command and configuration, with rule/path/symbol-location identity where available. New or worsened findings are separated from unchanged unrelated baseline findings; metric-only movement remains a review signal.                                                                                                                                                                                                                                                              |
| Existing SDD lifecycle           | R5: Lifecycle-Preserving Integration             | Requirements / R5                 | Slice 1              | Diff review confirms only the seven durable target paths change, with evidence-only updates permitted in this feature's `TASKS.md` and `TRACEABILITY.md`; `SPECS.md` remains read-only unless Replanning. Human/Completion/Closure Approval, approval commits, role ownership, Replanning, and Feature Exit remain unchanged.                                                                                                                                                                                                                                           |
| Architecture policy              | Automatic enforcement boundary                   | Architecture; Acceptance Criteria | Slice 1              | Compile and run `architectureDependencyRules.test.ts`; documentation claims only the existing dependency/construction/parser/telemetry rule catalog is automatic and assigns semantic ownership, abstraction value, framework sufficiency, custom-gap credibility, and qlty disposition to reviewers.                                                                                                                                                                                                                                                                   |
| Compatibility contracts          | Compatibility and non-goals                      | Compatibility; Non-Goals          | Slice 1              | `rtk git diff --check` plus path review confirm no runtime, test, generated, configuration, `.qlty/qlty.toml`, `package.json`, or `engines.vscode` change and no desktop/web/JP1-AJS behavior impact. Because `AGENTS.md` and `.agents/skills/**/*.md` are outside the Verify docs-only allowlist, record build, test compilation, desktop, and web evidence.                                                                                                                                                                                                           |
| Repository documentation quality | Compact, mutually consistent durable guidance    | Acceptance Criteria               | Slice 1              | Run `rtk pnpm run lint:md` plus targeted `rtk pnpm exec markdownlint-cli2 AGENTS.md docs/specs/architecture.md`; review cross-surface terminology and separate WebAPI dry-run outcomes; confirm no unrelated baseline qlty finding became approved cleanup.                                                                                                                                                                                                                                                                                                             |

<!-- markdownlint-enable MD013 -->

## Slice 1 Evidence Record

- Status: Implementation evidence ready; independent review and Completion
  Approval remain pending.
- Changed-path audit: the seven durable targets are `AGENTS.md`,
  `docs/specs/architecture.md`, `docs/specs/features/_templates/TASKS.template.md`,
  `.agents/skills/sdd-plan-task/SKILL.md`, `.agents/skills/sdd-review-plan/SKILL.md`,
  `.agents/skills/sdd-implement-task/SKILL.md`, and
  `.agents/skills/sdd-review-implementation/SKILL.md`. Evidence-only changes
  are this `TASKS.md` and `TRACEABILITY.md`; `SPECS.md` and all other paths are
  unchanged.
- Exact validation: `rtk pnpm run lint:md` passed for 39 files;
  `rtk pnpm exec markdownlint-cli2 AGENTS.md docs/specs/architecture.md`
  passed for 2 files; `rtk git diff --check` passed; `rtk pnpm run build`,
  `rtk pnpm run test:compile`, `rtk pnpm run test:desktop:run` (VS Code
  1.138.0), and `rtk pnpm run test:web:run` passed; and
  `rtk node ./node_modules/mocha/bin/mocha --ui tdd
out/test/suite/architectureDependencyRules.test.js` passed with 25 tests.
- qlty baseline/final: both use `rtk pnpm run qlty` with unchanged
  `.qlty/qlty.toml` SHA-1 `ac860e9547b795c36ff466164d1a088554609`; `qlty
check` reports no issues and `qlty smells --no-snippets` reports no findings.
  Finding identity is rule/path/symbol-location where available. New/worsened:
  none. Unchanged unrelated baseline: none. Metric-only movement: none
  observed. `qlty fmt` required formatting in these two evidence records; that
  formatting is retained and is not unrelated quality cleanup.
- WebAPI dry run outcomes are separate: (1) `ImportAjsDefinitionViaWebApiPort`
  passes for the application-owned host-neutral dependency-inversion contract,
  without an adapter-duty requirement; (2) `Jp1Ajs3WebApiImportAdapter` passes
  for infrastructure credential/HTTP isolation, generated OpenAPI operation to
  neutral DTO translation, error normalization, and `AbortController` timeout
  lifecycle; (3) a newly proposed application wrapper with identical request
  and response forwarding fails; (4) retained
  `createImportAjsDefinitionViaWebApi` passes separately because defensive
  connection/scope DTO copies preserve the application boundary, proven by
  `src/test/suite/importAjsDefinitionViaWebApi.test.ts` test `copies request DTOs
before invoking the port`.
- Framework/capability boundary: the dry run considered `globalThis.fetch`,
  `AbortController`, generated `jp1Ajs3GetUnitListOperation`, and the existing
  credential provider. No custom mechanism is proposed, so no custom gap is
  claimed; the HTTP/framework wrapper remains in outer infrastructure and
  inner layers remain host-neutral. No unrelated baseline cleanup or scope
  creep is approved.
- Desktop/web and compatibility evidence: build, test compilation, desktop,
  web, and architecture checks passed; no runtime, parser, JP1/AJS, generated,
  configuration, `package.json`, or `engines.vscode` changes are present.
