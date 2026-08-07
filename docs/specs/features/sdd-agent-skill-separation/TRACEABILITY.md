# TRACEABILITY: sdd-agent-skill-separation

This feature has no JP1/AJS product use case. The traceability target is the
repository operating-policy goal of separating agent authority, reusable
procedure, and SDD policy ownership.

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                       | SPECS.md section                         | Implementation slice | Test or validation                                                                      |
| ------------------------------------------------------------ | ---------------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| R1: classify existing skills and SSOT ownership              | Requirements, Dependency Impact          | Slice 1              | five-skill inventory; old/new path search; Markdown lint                                |
| R2: canonical `.agents/skills` and adapters                  | Requirements, Compatibility              | Slice 1              | adapter reachability; stale-reference search; qlty                                      |
| R3: seven fixed SDD role definitions                         | Requirements, Architecture               | Slices 2–4           | role contract checklist; Markdown lint                                                  |
| R4: fixed model assignments for roles and release adapter    | Requirements, Architecture               | Slices 1–4           | fixed model/effort search; release adapter metadata review                              |
| R5: deterministic `AGENTS.md` routing                        | Requirements, Dependency Impact          | Slice 5              | seven-role routing matrix and entry-point reference review                              |
| R6: independent read-only plan and implementation review     | Requirements, Alternative Considerations | Slices 2–3           | forbidden-action and Findings-handoff review; qlty                                      |
| R7: independent Feature Exit and durable propagation         | Requirements, Feature Exit               | Slice 4              | lifecycle search; Feature Definition of Done and Durable Documentation Gate cross-check |
| R8: preserve SDD, architecture, and host compatibility gates | Requirements, Compatibility              | Slices 2–6           | policy/compatibility review; build; desktop/web tests                                   |
| R9: preserve existing entry-point references                 | Requirements, Dependency Impact          | Slices 1 and 5       | targeted repository search and Markdown/link lint                                       |
| R10: packaging, CI, and docs-only integrity                  | Requirements, Compatibility              | Slice 6              | `.vscodeignore` inspection; Verify workflow review; VSIX contents inspection            |

<!-- markdownlint-enable MD013 MD060 -->

## Validation Evidence

- Slice 1 baseline: existing `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
  `rtk git diff --check` passed before implementation.
- Slice 1 implementation: the five canonical shared skill paths exist, the
  five retained Codex adapters point to their exact canonical paths, and the
  release adapter records `Luna / medium` in its existing
  `interface.default_prompt` invocation metadata.
- Slice 1 focused checks: Markdown lint (10 files, 0 errors), `rtk pnpm run
qlty` (no issues), `rtk git diff --check`, adapter path reachability, and
  release metadata YAML/exact-text check passed. Independent implementation
  review returned `Ready / no actionable findings`; completion was
  auto-approved under the user's instruction.
- Slice 2 focused checks: role-contract structure and fixed model search,
  Markdown lint (14 files, 0 errors), `rtk pnpm run qlty` (no issues), and
  `rtk git diff --check` passed. Independent implementation review returned
  `Ready / no actionable findings`; completion was auto-approved under the
  user's instruction.
- Slice 3 focused checks: role-contract structure and fixed model search,
  canonical/adapter reachability, Markdown lint (18 files, 0 errors),
  `rtk pnpm run qlty` (no issues), and `rtk git diff --check` passed.
  Independent implementation review returned `Ready / no actionable
findings`; completion was auto-approved under the user's instruction.
- Slice 4 focused checks: Feature Exit ownership/stale-claim search, roadmap
  propagation contract, Markdown lint (25 files, 0 errors), `rtk pnpm run
qlty` (no issues), and `rtk git diff --check` passed. Independent
  implementation review returned `Ready / no actionable findings`; completion
  was auto-approved under the user's instruction.
- Slice 5 focused checks: routing/role canonical mapping, stale-authority
  search, Markdown lint (29 files, 0 errors), `rtk pnpm run qlty` (no issues),
  and `rtk git diff --check` passed. Independent implementation review
  returned `Ready / no actionable findings`; completion was auto-approved under
  the user's instruction.
- Slice 6 validation evidence: `rtk pnpm run lint:md` covered 49 files with 0
  errors; `rtk pnpm run qlty` reported no issues; `rtk git diff --check`
  passed; build, desktop tests, and web tests exited 0; VSIX packaging created
  `/private/tmp/vscode-ajsbutler-agent-skill-separation.vsix`; VSIX inspection
  confirmed `.agents/`, `.codex/`, `docs/`, and `src/` are excluded; and the
  Verify workflow's existing `.agents/` full-check classification remains
  unchanged. Build performance warnings and the existing desktop codesign/web
  EPIPE logs did not change the successful exit codes.
- Slice 6 independent implementation review returned `Ready / no actionable
findings`; completion was auto-approved under the user's instruction. All
  six implementation slices are now complete. Feature Exit and explicit
  closure approval remain pending.
