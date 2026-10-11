# SDD Evidence Policy

This file owns evidence production, consumption, identity, freshness, and
reuse. Use the [core SDD contract](README.md#lifecycle-and-approval-gates) before
the operation. Load identity and freshness before producing, refreshing, or
accepting evidence; use [validation policy](validation.md) for required checks
and [qlty format](validation.md#qlty-evidence-format) when that tier applies.

## Evidence Contract

Evidence is a reusable artifact with one owner, not a separate operation or
delegation. Keep `TASKS.md` as a decision index: validation identity, result,
coverage, artifact reference, missing facts or invalidation reason, and gate
references. Keep mechanical detail in a retained evidence artifact or sidecar
outside inspected inputs: producer/version, path manifests,
configuration/dependency/ tool identities, command exits, analyzed-path
inventories, SARIF references, raw outputs, and execution observations. Link
that artifact from `TASKS.md`; do not duplicate its manifest in each slice.
Keep outputs/caches outside inspected inputs. Records must be readable by the
next role; missing artifacts are unavailable evidence, never a pass. Preserve
them through review, approval, commit, and Feature Exit. Carry the compact
acceptance, validation, review, approval, and commit references for all
completed slices until closure; remove superseded narrative, not necessary
gate proof. Do not build a collector service, custom SARIF parser, or
comparator.

<!-- markdownlint-disable MD013 MD060 -->

| Record                   | Producer                                          | Consumers / purpose                                                                                        |
| ------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Discovery facts          | Intake/planner for the references actually needed | Planner and plan-reviewer: scope, affected symbols/tests, boundaries and risks                             |
| Documentation validation | Role changing the documentation                   | Reviewer and next role: validate that changed documentation surface                                        |
| Slice validation         | Implementer, one baseline/final set per slice     | Implementation-reviewer: semantic review; feature-closer: aggregate completeness                           |
| Review findings          | Independent reviewer                              | Main and author: verdict, precise Findings, reviewed patch identity, affected revalidation                 |
| Closure evidence         | Feature-closer                                    | Main and committer: cross-slice completeness, durable ownership, risk ownership, current-head global gates |

<!-- markdownlint-enable MD013 MD060 -->

### Identity And Required Facts

Each validation record identifies:

- Record version, feature/slice, producer, base revision and exact final
  revision or working-tree content identity; approved path set; changed paths
  with rename detection, untracked paths, and out-of-scope or ambiguous paths.
- Inputs and coverage for each check, command/arguments, tool versions,
  configuration/dependency hashes, required command set, exit status,
  passed/failed/unknown state, and raw-output reference. Record the architecture
  dependency test separately from semantic architecture judgments.
- When the validation tier requires qlty: version, configuration hash,
  full-repository selection, nonzero analyzed-path inventory/count in both
  snapshots for both commands, all four
  complete SARIF references, command logs/status, and final aggregate result.
- When relevant: `engines.vscode` before/after; touched desktop/web/bootstrap/
  parser/configuration surfaces; Node-import scan and unresolved cases; changed
  layers/exports/imports and abstraction candidates; traceability mapping.
  These are mechanical signals, not Solution Shape or approval verdicts.
- Missing/ambiguous facts and execution exceptions. Human approval provenance
  and review judgments remain separate gate records.

A commit hash alone cannot identify uncommitted validation inputs. For a
working tree, record a reproducible content manifest/hash covering inspected
tracked and untracked inputs, deletions and renames, check configuration and
dependency inputs. For full-repository qlty scans this is the full analyzed
repository surface, not just approved paths. Identify any unrelated changes
included in a snapshot; never silently mix another slice into its baseline or
final evidence. Ignored generated inputs used by a check must also be covered.

Check coverage may differ. Reuse an individual result only when its own inputs,
configuration, tool version and required command still match; a valid targeted
test cannot stand in for a required full-repository or host check. Planning
facts need their reference/base identity and coverage, not a qlty package for
code that has not been implemented.

### Freshness And Invalidation

Evidence is stale for the affected facts only when one of these occurs:

1. Inspected content or a relevant dependency/configuration input changes.
2. The approved path set or required validation commands/coverage change.
3. The comparison base changes.
4. A relevant tool version or qlty configuration/selection changes.
5. A check modifies its inspected snapshot after observations were recorded.

Otherwise matching identity and sufficient facts require reuse. Phase changes,
new reviewers, returning to Main, human approval, and entering a commit gate
do not invalidate evidence. Linking a validated content identity to its new
commit does not require another run. Current-head CI/Cloud gates remain bound
to their exact commit; a prior commit's status is not a current-head pass.

Treat approval/status/evidence/commit annotations as a separate metadata patch.
Record its exact diff and run targeted non-mutating documentation validation
and scope inspection; metadata-only annotations do not start another qlty
baseline/final cycle. Bind existing scans to the immutable substantive snapshot
they actually inspected, never claim they scanned later annotations. Metadata
may be excluded from product-check inputs only when recorded explicitly and
when it cannot affect that check. Any specification, scope, command, risk or
acceptance change is substantive, never a metadata exception, and invalidates
affected facts. Review and human approval cover the exact substantive patch
plus the separately inspected gate metadata.

Missing facts, an identity mismatch, or a specific Finding requiring
reproduction are the only reasons for a consumer to request refresh or run an
affected non-mutating check. Record the reason and coverage; rerun only what
that reason invalidates. Retain a matching baseline; do not recreate it at each
review. Writes and formatting belong to the producer, not read-only reviewers.
An unavailable or failed required check blocks readiness. Committers must not
rerun product validation: changed scope/evidence returns through Main to the
producer and reviewer before committing. Staged diff checks remain mandatory.

### Evidence Reuse Observations

Routine role dispatches, tests/builds, Git inspections, human gates, and commits
do not need execution counters. Record only unexpected reruns, evidence
regenerations, and extra reviews, with the reason, affected identity/coverage,
and result, in the linked evidence artifact. Distinguish a justified refresh
from duplicate work on matching inputs. Use `none` only when observed and
`unknown` when unavailable; do not reconstruct historical counts.

Keep a compact exception reference in `TASKS.md` only when it affects the next
decision. Feature Exit consumes existing observations without a counting or
collection pass. Existing counter records may be retained as evidence without
continuing routine counts. These observations never replace required checks,
independent review, or approval.
