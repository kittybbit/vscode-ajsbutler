# Traceability: Tighten SDD Solution Quality Contract

<!-- markdownlint-disable MD013 -->

| Source                               | Requirement                               | `SPECS.md` section             | Implementation slice | Test or validation plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ----------------------------------------- | ------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR #319 review finding 1             | R1: Strict Comparable-Finding Disposition | Requirements / R1              | Slice 1              | For each comparable finding, record identity, explicit severity ordering, baseline/final severity, measured values, and higher-is-worse or lower-is-worse metric direction. Adverse movement under that comparator is Finding/NG; only identity or direction that cannot be mapped reliably is advisory; unchanged unrelated findings stay out of scope.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| PR #319 review finding 2             | R2: Non-Mutating Comparable Observation   | Requirements / R2              | Slice 1              | Run the identical `qlty check` plus `qlty smells --no-snippets` pair and the entire aggregate `rtk pnpm run qlty` only in exact disposable baseline/final snapshots; never run aggregate qlty on primary. Baseline is the approved plan-commit state; final is the exact reviewed state including approved tracked/untracked edits and deletions. Keep qlty runtime artifacts inside the snapshot and discard them. Capture primary `git status --short --untracked-files=all` plus complete deterministic path-and-hash manifests over all tracked and non-ignored untracked files, including clean tracked paths, additions, deletions, and full untracked expansion, before/after snapshot preparation and each qlty run; perform allowlist analysis separately. If snapshot formatting changes analyzed source/evidence, inspect the diff, synchronize only approved/evidence paths as intentional implementation formatting, rebuild the exact final snapshot, and repeat until aggregate causes no analyzed source/evidence change. Outside-allowlist or unexpected primary mutation blocks and requires Replanning. |
| PR #319 review finding 3             | R3: Per-Slice Solution Shape Evidence     | Requirements / R3              | Slice 1              | Inspect the template for a complete block inside each `### Slice N`; two-slice WebAPI/VS Code dry run proves all four skills use only the selected slice and cannot mix ownership, abstraction, qlty, or approval evidence.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Existing durable contract            | R4: Contract-Preserving Correction        | Requirements / R4              | Slice 1              | Cross-surface semantic diff preserves ownership, port/adapter/factory, framework-first, outer-layer, architecture-test, unrelated-baseline, and Replanning rules plus every lifecycle and approval gate.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Repository validation classification | Non-doc full Verify requirement           | Impact Analysis; Compatibility | Slice 1              | Focused exact-scope Markdown lint; repository Markdown lint, build, test compile, desktop tests, web tests; focused architecture suite; disposable-final-snapshot aggregate qlty; repeated complete status/hash/path cleanliness checks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Compatibility contracts              | No product or configuration change        | Compatibility; Non-Goals       | Slice 1              | Keep the eight durable/two evidence allowlist, but compare complete deterministic path-and-hash manifests over all tracked and non-ignored untracked files, including clean tracked paths, additions, deletions, and full untracked expansion, around snapshot preparation and every qlty run. Analyze the allowlist separately; do not substitute it for the complete manifest. Verify no runtime, test, generated, package, `.qlty`, threshold, `engines.vscode`, desktop/web, or JP1/AJS change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

<!-- markdownlint-enable MD013 -->

## Slice 1 Result

- Status: Implementation complete; evidence-replan review and commit
  `add59ae31f448429f1477d8c767a0a00fa21ddda` are complete; read-only
  independent implementation review is pending/active, followed by Completion
  Approval.
- Evidence-replan rationale: a final complete-manifest or fidelity digest
  recorded here would include this evidence file and become stale when the file
  changes. Feature docs therefore retain procedure/results and provisional
  evidence only; the read-only implementation-reviewer returns authoritative
  final digests in review output.
- Record the replan reason: the prior baseline procedure created
  `.qlty/plugin_cachedir` and `.qlty/results` in the primary worktree, outside
  the allowlist; implementation made no edits and clean state was restored.
  Record baseline/final snapshot source-state manifests and analyzed
  source/config fidelity manifests with only declared snapshot-local qlty
  runtime exclusions. Around snapshot preparation and every qlty run, record
  primary `git status --short --untracked-files=all` plus complete deterministic
  path-and-hash manifests covering all tracked and
  non-ignored untracked files, including clean tracked paths, additions,
  deletions, and full untracked expansion; analyze the approved/evidence
  allowlist separately. Record any deliberate approved/evidence sync as an
  implementation edit, its snapshot diff, and the rebuilt final snapshot until
  the entire aggregate qlty run causes no analyzed source/evidence change. Run
  check, smells, and aggregate only inside disposable snapshots; discard their
  runtime artifacts without synchronization. Primary state must remain
  identical during preparation and execution; outside-allowlist or
  unexpected primary mutation is a blocker/Replanning trigger. Record each
  comparable finding's identity, explicit severity ordering, baseline/final
  severity, measured values, and higher-is-worse or lower-is-worse direction;
  classify only unmappable identity/direction as advisory. Add focused/full
  validation, the two-slice dry run, compatibility result, and actionable
  feedback here before completion review. Do not retain a chronological
  command log.

### Implementation Evidence

- Durable implementation is limited to the eight approved policy paths; the
  selected `TASKS.md` and this `TRACEABILITY.md` are the only evidence paths.
  `SPECS.md`, runtime, tests, packages, generated files, configuration,
  `.qlty/qlty.toml`, `engines.vscode`, and inherited features remain unchanged.
- The approved baseline snapshot provenance is replan commit
  `e7ba5c20910c2d64ab30d90a67b5db34c5394ea0`. Baseline
  `rtk pnpm exec qlty check` returned `No issues`; baseline
  `rtk pnpm exec qlty smells --no-snippets` reported no findings. The complete
  baseline manifest and fidelity evidence belong to that immutable snapshot;
  this file records the provenance and results without embedding a digest that
  includes either current evidence file.
- The fresh review-fix final snapshot was copied from the exact reviewed
  primary state after the approved plan-format sync. Aggregate
  `rtk pnpm run qlty`, final `rtk pnpm exec qlty check`, and final
  `rtk pnpm exec qlty smells --no-snippets` ran only in that snapshot and
  returned no issues or smell findings. The aggregate made no analyzed source
  or evidence change after the sync; qlty runtime artifacts stayed
  snapshot-local. These are provisional post-edit observations until the
  read-only implementation-reviewer re-materializes the frozen current state.
- For the comparable observations, no finding identities existed in either
  snapshot. Therefore no severity ordering, measured value, or higher/lower-
  is-worse mapping was applicable; there was no new or reliably mapped adverse
  finding, no advisory unmappable finding, and no unchanged unrelated finding
  brought into scope.
- Before/after primary audits for final-snapshot preparation, check, smells,
  aggregate, and post-discard reported unchanged status and complete manifests
  in the provisional evidence. Snapshot-local `node_modules`, `.qlty/results`,
  `.qlty/logs`, `.qlty/out`, and `.qlty/plugin_cachedir` were not synchronized;
  the read-only qlty configuration contract remained unchanged.
  After all implementation and evidence edits are frozen, the read-only
  implementation-reviewer must independently materialize the exact current
  reviewed state, verify primary non-mutation and formatter convergence, and
  return the authoritative final complete-manifest and fidelity digests in
  review output. No such final digest is recorded in this file because that
  would change the hashed reviewed state.
- The two-slice dry run used independent WebAPI/application-port and VS Code
  presentation-command owners. Selecting either slice in each lifecycle skill
  consumed only its own evidence block; neither slice could borrow the other’s
  owner, adapter, qlty, or approval evidence. A same-request/same-response
  wrapper remained rejected, while the translating WebAPI adapter remained
  accepted.
- Focused Markdown lint and repository `lint:md` passed. Build passed with
  existing webpack asset-size warnings; `test:compile` passed; desktop tests
  passed with the installed VS Code fallback (the endpoint lookup and an
  Electron codesign diagnostic were non-fatal); web tests passed after the
  sandbox DNS-blocked first attempt was rerun with network access; and the
  focused architecture suite passed with 25 tests. `git diff --check`, the
  provisional exact path/status/hash audits,
  SPECS/config/package/engine checks, and the two-slice WebAPI/VS Code dry run
  all passed. No actionable implementation
  feedback or unresolved compatibility risk remains; independent review and
  completion approval are still required.
