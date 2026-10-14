# SDD Evidence Policy

Purpose: retain authentic, traceable evidence once and reuse it while its
inputs and coverage remain valid. This file owns evidence production,
consumption, identity, freshness and reuse. Lifecycle/approval gates belong to the
[core SDD contract](README.md#lifecycle-and-approval-gates); required check
coverage and qlty format belong to [validation policy](validation.md).

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
comparator. Agents receive only identity, verdict, failure reason, affected
paths/diffs, actionable Findings and accessible artifact references. Keep full
SARIF, logs and manifests as artifacts; consumers open only necessary evidence
for a missing fact or concrete concern, without injecting entire artifacts.

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
  Pass/Not Applicable/Missing/Failed state under validation policy, and
  raw-output reference. Record the architecture
  dependency test separately from semantic architecture judgments.
- When the validation tier requires qlty: all identities and artifacts required
  by the [Qlty Quality Contract](validation.md#quality-contract), recorded via
  its [Execution Procedure](validation.md#execution-procedure).
- When relevant: `engines.vscode` before/after; touched desktop/web/bootstrap/
  parser/configuration surfaces; Node-import scan and unresolved cases; changed
  layers/exports/imports and abstraction candidates; traceability mapping.
  These are mechanical signals, not Solution Shape or approval verdicts.
- For native stacks: PR URL/order, trunk, predecessor base/head commit and
  content identities, reviewed layer diff, top integration head, closure commit,
  current-head CI/review/rules references and actual merge result identities.
  Keep these facts in existing gate/evidence records, not a second stack state.
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
3. A check's comparison-base content or revision input changes; only results
   depending on that base are invalidated.
4. A relevant tool version or qlty configuration/selection changes.
5. A check modifies its inspected snapshot after observations were recorded.

Otherwise matching identity and sufficient facts require reuse. Phase changes,
new reviewers, returning to Main, human approval, and entering a commit gate
do not invalidate evidence. Linking a validated content identity to its new
commit does not require another run. Current-head CI/Cloud gates remain bound
to their exact commit; a prior commit's status is not a current-head pass.

Keep Git commit/PR head SHA and GitHub CI status distinct from a local check's
content identity. Lower-layer correction, cascading rebase and predecessor-base
changes require inspecting the layer diff, comparison base, inspected content,
configuration and dependency inputs. Reuse local deterministic results only
when their content identity, tool, configuration, dependency inputs and coverage
match completely. A changed SHA alone does not invalidate such local results;
changed base identity invalidates base-dependent results, including full qlty
baseline/final comparisons. Required GitHub checks must belong to the current
head (and required merge-group revision when queued); old-SHA CI is never a pass
for the new head. Semantic review validity belongs to
[Independent Review](validation.md#independent-review).
Feature Exit reuses valid slice records and preserves current-head global gates;
required integration coverage belongs to validation policy.

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

Purpose: expose unnecessary dispatch, context and validation cost without a
measurement workflow. Existing logs/handoffs may substantiate cost comparisons;
use comparable scope, risk and configuration and distinguish measured effects
from design counts. Unavailable facts are `unknown`, never invented reductions.
No collector or measurement agent is permitted; measurement completion is not
an implementation or validation-tier prerequisite.

Record unexpected reruns, evidence refreshes and extra reviews with the affected
identity/coverage, reason and result in the existing artifact. Main and all
child work count toward any reported cost. Routine operations require no new
counters or collection pass. Feature Exit consumes existing observations;
measurement never replaces checks, independent review or approval.
