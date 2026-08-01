# Traceability: Refactoring Quality Baseline

<!-- markdownlint-disable MD013 -->

| Source                                   | Requirement       | Spec section                         | Slice | Validation |
| ---------------------------------------- | ----------------- | ------------------------------------ | ----- | ---------- |
| Refactoring goal                         | R1-R3, R5, R6, R8 | Requirements; Measurement Decisions  | 1     | V1, V3, V5 |
| Refactoring goal                         | R3-R8             | Requirements; Acceptance Criteria    | 2     | V2-V5      |
| Roadmap sequencing                       | R4-R8             | Acceptance Criteria; Non-Goals       | 3     | V3-V6      |
| Architecture baseline                    | R5, R8            | Architecture; Compatibility          | 1-3   | V3, V5     |
| Exact cited use-case file or branch goal | R4, R7, R8        | Measurement Decisions; Compatibility | 2-3   | V4-V6      |

<!-- markdownlint-enable MD013 -->

## Validation Plans

- V1: At the recorded commit, verify the exact production-root list, Qlty
  version, `git hash-object .qlty/qlty.toml` result, and recorded Qlty metrics
  and smells commands; compare structural evidence and explicitly unavailable
  measures.
- V2: Re-run the fixed non-merge first-parent history query, verify its endpoint,
  exact 100-commit cap, merge exclusion, sample file-touch counts, quintile
  formula, top items, cutoff ties, and stable path ordering.
- V3: Run the existing architecture dependency-rule suite and compare every
  layer classification with `docs/specs/architecture.md`; do not introduce an
  allowlist or alternate rule catalog.
- V4: Verify each business-criticality value uses the 1-5 rubric, cites an exact
  durable use-case file, product constraint, or architecture responsibility, and
  provides a reviewable rationale; permit an explicit branch-goal source only
  when no behavior contract is changed.
- V5: Confirm the feature includes no tracked production, test, generated,
  configuration, package, CI, compatibility, or user-visible behavior change;
  treat `out/` as validation-only; run `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- V6: Trace every follow-on responsibility group to ranked evidence, verify it
  passes the `sdd-create-feature` intake and single-purpose gates without
  guessing, and apply the Durable Documentation Gate to roadmap changes.

## Slice 1 Result

- Evidence: `BASELINE.md`, captured at commit
  `14d94fa3602fc4f6f467eccac35bc588ee44b9bb` with Qlty `0.500.0` and the
  recorded configuration hash.
- V1: Qlty version, configuration hash, production roots, exclusions, and all
  three exact measurement commands are recorded; file-level output was also
  captured for the file-grain acceptance requirement.
- V2: Not applicable to Slice 1; Git change-frequency ranking belongs to Slice 2.
- V3: Architecture validation is incomplete at 8 passing / 5 failing because
  the existing test helper scans absent `src/shared`; no zero-exception pass is
  claimed and Slice 2 is blocked until this condition is resolved or accepted.
- V5: No tracked production, test, generated, configuration, package, or CI
  change is included; `out/` is validation-only. Qlty measurements and test
  compilation passed.
- Completion approval: approved.

## Slice Coverage

- Slice 1 proves the evidence identity and structural input contract before
  ranking begins.
- Slice 2 proves the change-frequency, criticality, scoring, classification,
  and deterministic ranking decisions without approving a refactor target.
- Slice 3 proves that selected ranked evidence becomes bounded roadmap intake
  rather than an umbrella implementation plan or raw-metric archive.
