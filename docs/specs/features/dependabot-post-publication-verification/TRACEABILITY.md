# Requirements Traceability: Dependabot Post-Publication Verification

<!-- markdownlint-disable MD013 -->

| Requirement/source | Slice | Test or validation |
| --- | --- | --- |
| R1 publication/graph identity | 1, 3 | Remote SHA/dependency hashes, exported graph coverage, publication ancestry and drift interval |
| R2 complete historical/current/new alert coverage | 1, 3 | Known 17 IDs, planning 15 IDs and complete all-state/all-page union; individual missing-ID GETs |
| R3 dispositions | 1, 3 | Every union member has observed state/fix fields, evidence, explicit disposition; no absence-based closure |
| R4 unresolved ownership | 3 | Named security/tooling owner, concrete Main decision handoff, missing-evidence blocker |
| R5 direct upgrades first | 2 | Bounded direct-owner keys/versions, parent/registry/lock reconciliation and audit floors |
| R6 minimal overrides | 1 → 2 | All-existing-override inventory; actual safe redundancy reduction, justified owned exceptions, pnpm-generated lockfile |
| R7 behavior/support compatibility | 2 | Node22/pnpm10.33/VSCode1.75, full build, architectureDependencyRules/packageManifest, desktop/minimum/web, Prism/OpenAPI and VSIX boundary evidence, qlty SARIF comparison/final aggregate |
| Automation user-owned; no runtime redesign | All | Exact path/version scope and unchanged workflow/permissions/patch/source boundaries |
| Roadmap complete published result | Feature Exit | All committed slices, R1-R7 coverage and explicitly preserved unresolved owner routing |

<!-- markdownlint-enable MD013 -->
