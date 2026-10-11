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

## Slice 1 implementation evidence

Evidence: `/tmp/ajsbutler-dependabot-slice1-final-evidence/record.json`.
R1 is met under the approved exact-alias strategy: 1,046 npm nodes, 58 direct
manifest edges and 2,001 GitHub npm edges, supplemented by three separately
proven published-lock alias edges. GitHub omission/ingestion uncertainty remains
explicitly owned by security/tooling via Main, without a detection guarantee.
R2/R3 retain all 195 observed rows over two terminal pages, all known 17
historical and 15 planning IDs, observed dispositions, advisory/fix/time fields
and raw evidence. R6 inventories all 39 overrides with registry-backed parent
ranges, resolved paths, risk/candidate/owner and conditional removal decisions.
Slice 1 is IMPLEMENTED; independent review and Completion Approval remain pending.
R4 final risk routing, R5 remediation and R7 regression remain dependent work.
No dependency fix, security-clean result or feature completion is claimed.
