# Traceability: Tighten SDD Solution Quality Contract

<!-- markdownlint-disable MD013 -->

| Source | Requirement | `SPECS.md` section | Implementation slice | Test or validation plan |
| --- | --- | --- | --- | --- |
| PR #319 review finding 1 | R1: Strict Comparable-Finding Disposition | Requirements / R1 | Slice 1 | For each comparable finding, record identity, explicit severity ordering, baseline/final severity, measured values, and higher-is-worse or lower-is-worse metric direction. Adverse movement under that comparator is Finding/NG; only identity or direction that cannot be mapped reliably is advisory; unchanged unrelated findings stay out of scope. |
| PR #319 review finding 2 | R2: Non-Mutating Comparable Observation | Requirements / R2 | Slice 1 | Around each separate `rtk pnpm exec qlty check` and `rtk pnpm exec qlty smells --no-snippets` observation, capture `git status --short --untracked-files=all` plus the deterministic content-hash manifest (`git ls-files --cached --others --exclude-standard -z` piped to `xargs -0 -n1 shasum -a 256`, then `LC_ALL=C sort`) before and after. Apply the same pair around aggregate qlty; if any reviewed path mutates, rerun both observations and compare only the repeated result. A new or mutated path outside the eight durable/two evidence-path allowlist blocks and requires Replanning. |
| PR #319 review finding 3 | R3: Per-Slice Solution Shape Evidence | Requirements / R3 | Slice 1 | Inspect the template for a complete block inside each `### Slice N`; two-slice WebAPI/VS Code dry run proves all four skills use only the selected slice and cannot mix ownership, abstraction, qlty, or approval evidence. |
| Existing durable contract | R4: Contract-Preserving Correction | Requirements / R4 | Slice 1 | Cross-surface semantic diff preserves ownership, port/adapter/factory, framework-first, outer-layer, architecture-test, unrelated-baseline, and Replanning rules plus every lifecycle and approval gate. |
| Repository validation classification | Non-doc full Verify requirement | Impact Analysis; Compatibility | Slice 1 | Focused exact-scope Markdown lint; repository Markdown lint, build, test compile, desktop tests, web tests; focused architecture suite; final qlty; repeated status/hash/path cleanliness checks. |
| Compatibility contracts | No product or configuration change | Compatibility; Non-Goals | Slice 1 | Allowlist only eight durable and two evidence paths; compare content hashes for every approved/evidence path and every initially dirty/untracked path; verify no runtime, test, generated, package, `.qlty`, threshold, `engines.vscode`, desktop/web, or JP1/AJS change. |

<!-- markdownlint-enable MD013 -->

## Slice 1 Result

- Status: Pending implementation, independent review, and approval.
- Record initial and final path sets, before/after status plus deterministic
  content-hash manifests for every non-mutating observation and the aggregate
  qlty run, non-mutating baseline/final observations, and the repeated pair if
  aggregate qlty mutates any reviewed path. Record each comparable finding's
  identity, explicit severity ordering, baseline/final severity, measured
  values, and higher-is-worse or lower-is-worse direction; classify only
  unmappable identity/direction as advisory. Record any outside-allowlist
  mutation as a blocker/Replanning trigger, plus focused/full validation, the
  two-slice dry run, compatibility result, and actionable feedback here before
  completion review. Do not retain a chronological command log.
