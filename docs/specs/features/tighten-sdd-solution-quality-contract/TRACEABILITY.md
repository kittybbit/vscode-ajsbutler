# Traceability: Tighten SDD Solution Quality Contract

<!-- markdownlint-disable MD013 -->

| Source | Requirement | `SPECS.md` section | Implementation slice | Test or validation plan |
| --- | --- | --- | --- | --- |
| PR #319 review finding 1 | R1: Strict Comparable-Finding Disposition | Requirements / R1 | Slice 1 | For each comparable finding, record identity, explicit severity ordering, baseline/final severity, measured values, and higher-is-worse or lower-is-worse metric direction. Adverse movement under that comparator is Finding/NG; only identity or direction that cannot be mapped reliably is advisory; unchanged unrelated findings stay out of scope. |
| PR #319 review finding 2 | R2: Non-Mutating Comparable Observation | Requirements / R2 | Slice 1 | Run the identical `qlty check` plus `qlty smells --no-snippets` pair and the entire aggregate `rtk pnpm run qlty` only in exact disposable baseline/final snapshots; never run aggregate qlty on primary. Baseline is the approved plan-commit state; final is the exact reviewed state including approved tracked/untracked edits and deletions. Keep qlty runtime artifacts inside the snapshot and discard them. Capture primary `git status --short --untracked-files=all` plus complete deterministic path-and-hash manifests over all tracked and non-ignored untracked files, including clean tracked paths, additions, deletions, and full untracked expansion, before/after snapshot preparation and each qlty run; perform allowlist analysis separately. If snapshot formatting changes analyzed source/evidence, inspect the diff, synchronize only approved/evidence paths as intentional implementation formatting, rebuild the exact final snapshot, and repeat until aggregate causes no analyzed source/evidence change. Outside-allowlist or unexpected primary mutation blocks and requires Replanning. |
| PR #319 review finding 3 | R3: Per-Slice Solution Shape Evidence | Requirements / R3 | Slice 1 | Inspect the template for a complete block inside each `### Slice N`; two-slice WebAPI/VS Code dry run proves all four skills use only the selected slice and cannot mix ownership, abstraction, qlty, or approval evidence. |
| Existing durable contract | R4: Contract-Preserving Correction | Requirements / R4 | Slice 1 | Cross-surface semantic diff preserves ownership, port/adapter/factory, framework-first, outer-layer, architecture-test, unrelated-baseline, and Replanning rules plus every lifecycle and approval gate. |
| Repository validation classification | Non-doc full Verify requirement | Impact Analysis; Compatibility | Slice 1 | Focused exact-scope Markdown lint; repository Markdown lint, build, test compile, desktop tests, web tests; focused architecture suite; disposable-final-snapshot aggregate qlty; repeated complete status/hash/path cleanliness checks. |
| Compatibility contracts | No product or configuration change | Compatibility; Non-Goals | Slice 1 | Keep the eight durable/two evidence allowlist, but compare complete deterministic path-and-hash manifests over all tracked and non-ignored untracked files, including clean tracked paths, additions, deletions, and full untracked expansion, around snapshot preparation and every qlty run. Analyze the allowlist separately; do not substitute it for the complete manifest. Verify no runtime, test, generated, package, `.qlty`, threshold, `engines.vscode`, desktop/web, or JP1/AJS change. |

<!-- markdownlint-enable MD013 -->

## Slice 1 Result

- Status: Pending implementation, independent review, and approval.
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
