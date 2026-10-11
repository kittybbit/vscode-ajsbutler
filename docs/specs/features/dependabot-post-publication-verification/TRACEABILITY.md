# Requirements Traceability: Dependabot Post-Publication Verification

<!-- markdownlint-disable MD013 -->

| Requirement/source | Slice | Test or validation |
| --- | --- | --- |
| R1 publication/graph identity | 1, 3 | Remote SHA/dependency hashes, full exported npm nodes and edges reconciled; separately pinned proof for three exact alias tuples only; honest GitHub omissions, publication ancestry and drift interval |
| R2 complete historical/current/new alert coverage | 1, 3 | Known 17 IDs, planning 15 IDs and complete all-state/all-page union; individual missing-ID GETs |
| R3 dispositions | 1, 3 | Every union member has observed state/fix fields, evidence, explicit disposition; no absence-based closure |
| R4 unresolved ownership | 3 | Named security/tooling owner, concrete Main decision handoff, missing-evidence blocker |
| R5 direct upgrades first | 2 | Bounded direct-owner keys/versions, parent/registry/lock reconciliation and audit floors |
| R6 minimal overrides | 1 → 2 | All-existing-override inventory; actual safe redundancy reduction, justified owned exceptions, pnpm-generated lockfile |
| R7 behavior/support compatibility | 2 | Node22/pnpm10.33/VSCode1.75, full build, architectureDependencyRules/packageManifest, desktop/minimum/web, Prism/OpenAPI and VSIX boundary evidence, qlty SARIF comparison/final aggregate |
| Automation user-owned; no runtime redesign | All | Exact path/version scope and unchanged workflow/permissions/patch/source boundaries |
| Roadmap complete published result | Feature Exit | All committed slices, R1-R7 coverage and explicitly preserved unresolved owner routing |

<!-- markdownlint-enable MD013 -->

## Slice 1 partial execution

Evidence: `/tmp/ajsbutler-dependabot-slice1-evidence/record.json`.
R1 evidence: all 1,046 npm identities match; GitHub covers 2,001 of 2,004
unique lockfile relationships. The three exact alias-edge omissions remain real;
the proposed bounded published-lock supplement awaits review/approval and
separates source coverage. Branch identity remained stable across reads.
R2/R3 collection includes 195 all-state rows over two terminal pages, all known
17 historical and 15 planning IDs, and retained observed dispositions.
R6 all-override inventory remains incomplete after the graph prerequisite
blocker. Affected plan state is PLANNED pending the coverage replan gates;
no completion or remediation is claimed. Main owns the evidence decision;
R4/R5/R7 and dependent slices remain pending.
