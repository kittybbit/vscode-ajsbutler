# Traceability: Refactoring Quality Baseline

<!-- markdownlint-disable MD013 -->

| Source                                   | Requirement       | Spec section                         | Slice      | Validation |
| ---------------------------------------- | ----------------- | ------------------------------------ | ---------- | ---------- |
| Refactoring goal                         | R1-R3, R5, R6, R8 | Requirements; Measurement Decisions  | 1          | V1, V3, V5 |
| Refactoring goal                         | R3-R8             | Requirements; Acceptance Criteria    | 2          | V2-V5      |
| Roadmap sequencing                       | R4-R8             | Acceptance Criteria; Non-Goals       | 3          | V3-V6      |
| Architecture baseline                    | R5, R8            | Architecture; Compatibility          | 1, 1A, 2-3 | V3, V5     |
| Exact cited use-case file or branch goal | R4, R7, R8        | Measurement Decisions; Compatibility | 2-3        | V4-V6      |

<!-- markdownlint-enable MD013 -->

## Validation Plans

- V1: At the recorded commit, verify the exact production-root list, Qlty
  version, `git hash-object .qlty/qlty.toml` result, and recorded Qlty metrics
  and smells commands; compare structural evidence and explicitly unavailable
  measures.
- V2: Re-run the fixed non-merge first-parent history query, verify its endpoint,
  exact 100-commit cap, merge exclusion, sample file-touch counts, quintile
  formula, top items, cutoff ties, and stable path ordering. For the four
  candidates, verify baseline path existence and no current-path touch in the
  precomputed fixed commit set, then record observed count 0 and Tier 1 rather
  than a missing factor. Recalculate the change-frequency population using all
  253 measured baseline paths, verify all 130 candidates are ranked, and keep
  any genuinely unobservable factor explicitly unranked. Prior-path or
  `--follow` inspection is explanatory only and cannot change the score. The
  fixed commit set must be built once from the approved aggregate command;
  path-limited `git log -n 100` must not be used to redefine the window.
- V3: For Slice 1A, synchronize the durable and agent-facing production-root
  catalogs with the helper, run the existing architecture dependency-rule
  suite, and compare every layer classification with
  `docs/specs/architecture.md`; the expected result is 13 passing / 0 failing.
  Do not introduce an allowlist, exception, or alternate rule catalog.
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

## Slice 2 Result

- Evidence: `BASELINE.md` records the exact 100-commit first-parent window,
  253-file structural and change-frequency population, candidate selection,
  criticality basis, architecture-layer classification, raw priority factors,
  function evidence, and all 130 ranked candidates. The four previously
  unresolved candidates are recorded with observed touch count 0 and
  change-frequency Tier 1.
- V2: the recorded Git command, baseline endpoint, 100-commit cap, merge
  exclusion, rename limitation, stable path ordering, and score calculation
  were verified. The fixed set contains 100 commits; 245 of 253 measured paths
  have one or more touches and 8 have observed zero. The four approved paths
  exist at the baseline commit, have no current-path touch in the fixed set,
  and are ranked with Tier 1 rather than treated as unavailable.
- V3: classifications were cross-checked against `docs/specs/architecture.md`;
  after Slice 1A reconciled the production-root catalog, the architecture
  suite completed with 13 passing / 0 failing tests.
- V4: ranked and unranked candidates use cited rubric codes and written
  responsibility rationale; criticality remains human judgment.
- V5: `rtk pnpm run qlty` passed and `rtk pnpm run lint:md` passed with 0
  errors. No tracked production, test, generated, configuration, package, CI,
  compatibility, or user-visible behavior file changed.
- Completion approval: approved in current conversation. The approved
  zero-versus-missing implementation and validation are complete; the
  architecture-suite caveat was resolved by Slice 1A and its 13 passing / 0
  failing result.

## Slice 1A Plan

- Purpose: reconcile the stale `src/shared` production-root entry so the
  architecture evidence scans the actual repository layout.
- Planned files: `docs/specs/architecture.md`, `AGENTS.md`,
  `src/test/support/architectureDependencyRules.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`, plus the feature-local
  evidence/status records after validation.
- Decision: remove the absent root from durable and test catalogs; use the
  existing `src/resource` root for the synthetic cross-layer fixture. Do not
  add a shared layer, relocate contracts, weaken rules, or add an allowlist.
- Acceptance: the exact compiled architecture suite runs with 13 passing / 0
  failing, all five prior `ENOENT` collection failures disappear, and no new
  architecture violation or production behavior change is introduced.
- Approval: reviewed and approved in the current conversation. The prior Slice
  2 approval does not authorize this slice.
- Validation: V3 and V5, including test compilation, the direct compiled suite,
  Qlty, Markdown lint, and diff hygiene.

## Slice 1A Result

- Evidence: `BASELINE.md` now distinguishes the historical 8 passing / 5
  failing baseline result from the corrected architecture evidence.
- V3: the durable and agent-facing production-root catalogs, the helper, and
  the synthetic fixture are synchronized. The compiled architecture suite
  completed with 13 passing / 0 failing tests, and all five prior `ENOENT`
  failures disappeared.
- V5: `pnpm run test:compile`, `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
  `git diff --check` passed. No production source, generated artifact,
  package, configuration, CI, roadmap, or user-visible behavior change was
  included.
- Completion approval: approved in current conversation.

## Slice 2 Replanning Record

- Trigger: the fixed history query produced no observable current-path touch
  record for four candidates, while the original plan only stated that the
  missing factor must block unsupported ranking.
- Revised plan: retain the fixed window and distinguish an observed zero from a
  missing dimension. All four paths exist at the baseline commit and have no
  current-path touch in the fixed set, so they receive observed count 0, Tier 1,
  and a recalculated priority. Only a path or query that cannot be reliably
  observed remains unranked.
- Slice 2 acceptance impact: the history-gap condition can pass only when the
  four observed-zero records and the all-253-file change-frequency population
  are independently verified, all 130 candidates are recalculated, and any
  genuinely missing factor remains explicit. Slice 3 must exclude only the
  genuinely unranked subset.
- Approval impact: this changes the Slice 2 completion boundary, so the plan
  requires `sdd-review-plan` and fresh human approval before implementation
  continues. Slice 1A resolves the separate architecture-suite caveat.

## Slice Coverage

- Slice 1 proves the evidence identity and structural input contract before
  ranking begins.
- Slice 1A proves that the architecture evidence catalog is synchronized with
  the actual production roots before the architecture result is accepted.
- Slice 2 proves the change-frequency, criticality, scoring, classification,
  and deterministic ranking decisions without approving a refactor target.
- Slice 3 proves that selected ranked evidence becomes bounded roadmap intake
  rather than an umbrella implementation plan or raw-metric archive.
