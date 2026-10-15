# Feature Specification: Semantic Diff comparison cohesion

## Purpose

Evaluate structural-comparison ownership and improve only the demonstrated
boundary: Domain owns the rename/move classification of confirmed fingerprint
correspondence; Application projects that decision into the existing result.
File length and file count are not acceptance measures.

## Source

- User-provided architecture improvement instruction, dated 2026-10-15,
  candidate `semantic-diff-comparison-cohesion`, evaluated against
  `cbad1042ab9d5f44487ea6a2c6b9d272d16eb9b9` (`origin/main`).
- [Build Semantic Diff use case](../../../requirements/use-cases/uc-build-semantic-diff.md)
  owns the current comparison behavior and JP1/AJS3 version 13 basis.
- [Present Semantic Diff Report use case](../../../requirements/use-cases/uc-present-semantic-diff-report.md)
  owns report compatibility; [architecture](../../architecture.md) owns layers.
- Kind: transient branch, internal refactoring; no new product capability or
  independent roadmap deliverable is proposed.

## Requirements and acceptance

- R1: Confirmed fingerprint rename/move decisions have one Domain owner.
  Preserve the current predicates: name inequality means rename; inequality
  of the nearest ancestor Jobnet's absolute path means move. Both may hold;
  neither may hold. An absent ancestor retains the current empty-path value.
- R2: Application consumes that classification and retains ownership of DTO
  targets, element kinds, confirmation levels, identity-decision references,
  change IDs, aggregation, and final ordering. Domain imports no DTO or outer
  layer. No forwarding facade or speculative extension point earns a boundary.
- R3: Preserve exact precedence, fingerprint strategy and field selection,
  conservative candidates, duplicate handling, unmatched add/remove behavior,
  attribute and relation decisions, confirmation conditions, evidence,
  constraints, unsupported items, limitations, IDs, and ordering.
- R4: Preserve the Application result and its JSON schema version 2,
  Markdown, Explorer, source-capture, and Flow consumers. No consumer migration
  or comparison rerun is introduced.
- R5: Show the improvement through semantic ownership and focused contract
  tests. Reuse existing coverage; add missing rename-only, move-only, combined,
  and neither-classified cases before relocating the current predicates.
  Ambiguous or fingerprint-changing matches must not gain confirmed changes.
- R6: Preserve zero-exception architecture rules, host-neutral production code,
  desktop/web behavior, and `engines.vscode` `^1.75.0`.

## Decisions and impact

### Responsibility evaluation

Source references below identify symbols at the supplied base. Discovery scope,
consumer and validation references are retained in [TASKS](TASKS.md#discovery).

<!-- markdownlint-disable MD013 MD060 -->

| Candidate                 | Meaning, independent change reason and existing contract                                                                                                                                                                                                                                                          | Decision and separation cost                                                                                                                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Identity / Correspondence | Domain `semanticDiffStructuralRules.ts`: exact keys (150–231), exact match (234–273), fingerprint grouping/candidates (276–396), evidence/decision IDs (405–624), correspondence (627–722). Unit identity forms already belong to `semanticDiffIdentity.ts`. Identity policy changes independently of DTO layout. | Keep the existing correspondence boundary. Application does not repeat matching. Do not create an additional identity package or forwarding module.                                                                                                                      |
| Attribute Comparison      | Domain parameter equality, scalar changes and categories (725–797); `compareSemanticDiffAttributes` returns key/category. Evidence rules reuse parameter helpers. Parameter semantics change independently of correspondence.                                                                                     | Existing function contract is sufficient. A file split would add imports for helpers shared with evidence rules without a demonstrated independent consumer need.                                                                                                        |
| Relation Comparison       | Domain pair maps and type comparison (799–923). `semanticDiffEvidenceRules.ts` reuses `buildSemanticDiffRelationPairMaps` for conditional-path evidence; Application projects endpoint references and canonical pairs (379–515).                                                                                  | Retain these contracts. Domain correspondence remapping versus Application output endpoints have different purposes; they are not duplicated relation-change decisions. Extra orchestration or pair-map cache is not justified here.                                     |
| Result Projection         | Application `toIdentityDecision` (101–138), change builders (216–515), normalization and result construction (764–834). DTO shape and output compatibility change independently of matching semantics.                                                                                                            | Keep projection in Application. Candidate/add/remove builders consume Domain outcomes; they do not repeat correspondence rules. There is one production comparison caller, so separate projection modules would mostly expose current local helpers.                     |
| Confirmation / Evidence   | Domain `evaluateSemanticDiffEvidence` owns applicability and change conditions; Application (517–762) maps typed decisions to target/detail/constraint records. Constraint-code and detail construction serve the Application output contract.                                                                    | Retain the existing semantic boundary. No repeated confirmation decision was found. Splitting Application confirmation helpers would need shared target/relation/detail helpers and additional exports without independent value established by discovery.               |
| Comparison Orchestration  | Application `compareSemanticDiff` (836–923) scopes input, invokes Domain contracts, aggregates and sorts the result. Application `fingerprintMatchChangeKinds` (253–271) separately compares names and ancestor paths.                                                                                            | Narrow improvement: move those rename/move predicates into the Domain correspondence responsibility; Application projects the outcome. Keep sequencing and sorting in Application. This changes an internal Domain/Application contract, without requiring new packages. |

<!-- markdownlint-enable MD013 MD060 -->

### Value and boundaries

The demonstrated problem is split ownership of correspondence meaning, rather
than two identical implementations of matching. Domain confirms a fingerprint
pair but Application decides which semantic rename/move facts it means. The
classification depends on Domain names and Jobnet ancestry, not report shape,
host behavior, or localization. A matching-policy change currently requires
understanding predicates in two layers, and Domain tests cannot assert the
complete rename/move decision through correspondence alone.

The selected internal contract extends only the fingerprint-specific output of
`buildSemanticDiffUnitCorrespondence`. Define
`SemanticDiffFingerprintChangeKind = "renamed" | "moved"` and
`SemanticDiffFingerprintMatch = SemanticDiffUnitMatch & { kind: "fingerprint";
changeKinds: SemanticDiffFingerprintChangeKind[] }` in the existing Domain
structural-rules module. `SemanticDiffUnitCorrespondence.fingerprintMatches`
returns this specialized array. Its entries retain the before/after objects
and carry `changeKinds` in rename-then-move order, including an empty array.

Compute that array inside correspondence construction after fingerprint matching,
using the supplied before/after scoped ID maps and the existing
`semanticDiffParentJobnetPath`. Keep the generic `SemanticDiffUnitMatch`,
`matches`, candidate groups, and evidence-rule input unchanged. The specialized
records need not share object identity with entries in `matches`; before/after
unit references and match ordering remain identical. No runtime validation,
DTO dependency, separate exported classifier, new module, or additional map
pass over unrelated units is needed.

Application consumes each specialized match's `changeKinds` and uses its
existing change builder and identity-decision index. Remove its
`fingerprintMatchChangeKinds`, redundant local kind alias and map-bearing
unit-change context if unused; do not inspect names or ancestry when projecting
fingerprint changes. Application retains change IDs, confirmed level, targets,
element kinds, identity references, aggregation and final sorting. This makes
correspondence classification directly assertable without migrating generic
match constructors in evidence/relations tests. The known structural test that
deep-compares `fingerprintMatches` must include the new field; the parallel
`matches` assertion must retain the old shape.
No broader split is supported by this investigation. Repeated sorting, unit
references and parameter-value lookup are small projections or existing shared
functions, not demonstrated duplicated business judgments. Repeated parameter
map construction may cost work, but no measured performance issue justifies a
cache or new abstraction in this feature.

### Existing work and durable impact

This feature refines implementation ownership within the existing Build Semantic
Diff use case. It adds no observable scenario, JP1/AJS rule, report capability,
or new normative interpretation. Existing use-case documents and architecture
already express the intended ownership and remain sufficient. README and
CHANGELOG updates are not indicated for a behavior-neutral internal change.

The roadmap currently owns only WebAPI beta-exit and fixture-reproducibility
follow-ups; the inherited `import-definition-via-webapi` feature is unrelated.
No dependency on, replacement of, or edit to that feature is needed. Roadmap
editing is not needed for this transient branch. The six evaluation candidates
are not six independent features; the first and only intake outcome selected
here is correspondence classification ownership. No dependent follow-on feature
or placeholder intake is proposed.

## Compatibility

The existing behavior is the compatibility baseline, including unusual cases:
rename/move classification runs only for fingerprint-confirmed pairs, and
compares nearest Jobnet absolute paths, not parent IDs or scope-relative paths.
Jobnet or Job Group path movement must not be reinterpreted using a new notion
of ancestry. An ambiguous current contract requires characterization and a
return to Main before any new meaning is chosen.

Keep the Domain identity-decision shape and IDs, Application public exports,
DTOs, JSON bytes, ordered result records and raw values stable. Shared code
stays free of Node built-ins and host/UI APIs. No minimum VS Code version,
parser, normalized model, telemetry, source lifecycle, or bootstrap change is
part of this intake. Existing schedule-definition attribute comparisons remain;
Schedule Impact Projection, Calendar and simulation remain removed.

## Non-goals

- Broad file decomposition, module-size targets or speculative abstractions.
- Explorer DTO/message validation overhaul, document traversal redesign,
  bootstrap reorganization, Unit List reintegration or Domain-wide value objects.
- Schedule simulation, runtime-risk inference, new identity strategies,
  manual matching, performance caching or changed JP1/AJS interpretation.
- Repository pattern, Domain events, DI container, unnecessary classes,
  forwarding wrappers, new architecture exceptions or public output fields.
- Runtime implementation, slice planning, approval or commits during intake.

## Open questions

No material scope or compatibility decision is missing for intake. Exact
internal Domain result shape, approved paths and slice boundaries belong to
planning and independent review; they are not implementation authorization.
