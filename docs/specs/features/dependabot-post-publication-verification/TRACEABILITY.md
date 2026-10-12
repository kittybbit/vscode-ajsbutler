# Requirements Traceability: Dependabot Post-Publication Verification

<!-- markdownlint-disable MD013 -->

| Requirement/source                                | Slice        | Test or validation                                                                                                                                                                                                                                                   |
| ------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 publication/graph identity                     | 1, 3         | Remote SHA/dependency hashes, full exported npm nodes and edges reconciled; separately pinned proof for three exact alias tuples only; honest GitHub omissions, publication ancestry and drift interval                                                              |
| R2 complete historical/current/new alert coverage | 1, 3         | Known 17 IDs, planning 15 IDs and complete all-state/all-page union; individual missing-ID GETs                                                                                                                                                                      |
| R3 dispositions                                   | 1, 3         | Every union member has observed state/fix fields, evidence, explicit disposition; no absence-based closure                                                                                                                                                           |
| R4 unresolved ownership                           | 3            | Named security/tooling owner, concrete Main decision handoff, missing-evidence blocker                                                                                                                                                                               |
| R5 direct upgrades first                          | 2            | Bounded direct-owner keys/versions, parent/registry/lock reconciliation and audit floors                                                                                                                                                                             |
| R6 minimal overrides                              | 1 → 2        | All-existing-override inventory; actual safe redundancy reduction, justified owned exceptions, pnpm-generated lockfile                                                                                                                                               |
| R7 behavior/support compatibility                 | N → 2        | Standalone Node>=24.18/Prism5.16/CI24.x with baseline audit no-regression; Node24/pnpm10.33/VSCode1.75 full build, architectureDependencyRules/packageManifest, desktop/minimum/web, Prism/OpenAPI and VSIX boundary evidence, qlty SARIF comparison/final aggregate |
| Automation user-owned; no runtime redesign        | All          | Exact historical path/version scope; approved Node24 CI-only delta; unchanged remediation automation/permissions/patch/source boundaries                                                                                                                             |
| Roadmap complete published result                 | Feature Exit | All four committed slices, R1-R7 coverage and explicitly preserved unresolved owner routing                                                                                                                                                                          |

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

## Slice 2 candidate evidence

Evidence: `/tmp/ajsbutler-dependabot-slice2-evidence/record.json`.
R5: five approved direct tooling candidates and compatible transitive refresh
meet the eight-family floors or eliminate vulnerable paths. R6: 39 overrides
reduced to nine; all removals/retentions have final graph and owner records.
R7: desktop 1,200 cases, minimum VSCode 1.75 and web nine checks each, build,
OpenAPI, Prism and qlty evidence pass, but normal VSIX creation and declared
Prism Node22 support remain blocked. Overall Slice 2 security acceptance also
fails due to pre-existing braces with no patched release. Main owns Replanning
and security/tooling decisions; Slice 2 remains IMPLEMENTING and Slice 3 gated.

## Standalone Node24 and pending remediation

Slice N addresses R7 independently: exact Prism5.16.0, Node>=24.18.0, CI24.x,
CONTRIBUTING prerequisites and conditional three sibling-pin removal. Fresh clean
Slice1-based baseline/final graph/install/engine/peer and audit no-regression,
full build/hosts/Prism/CI/qlty prove its compatibility outcome. Existing failed
moderate audit and matching normal collection failure remain honest blockers
for security/package readiness in Slice2; they do not become passes for N.
Root combined candidate is retained, excluded from N completion and later
integrated/regenerated by Main with renewed final checks.

R5/R6 and final R7 remain Slice2 gates: eight-family floors, five original direct
upgrade bounds, all39 override dispositions, no High/moderate and actual VSIX.
Unpatched braces requires an official upstream solution or separately approved
standard-tool replacement before further Slice2 implementation. Bundled VSCE
validation remains unapproved. No customs, waiver or speculative fix. Historical
Node24 direction approval and all completed Slice1/original/alias gates preserved;
new split scope awaits independent review/exact approval/commit. Slice3 and Feature
Exit remain dependent on complete remediated publication, not N completion alone.

## Slice N observed implementation

Evidence: `/tmp/ajsbutler-dependabot-sliceN-evidence/record.json`.
R7 compatibility is measured independently on fresh Node24.21.0 baseline/final
inputs rooted at completed Slice1: exact CLI/siblings5.16.0, Node>=24.18.0,
CI24.x and existing CONTRIBUTING setup owner. R6 removes only three proven
redundant Prism sibling pins; all other36 remain unchanged for later Slice2.
Fresh engine/peer, build/compile/bundles, desktop1,200, minimum/web WEB-7–15,
OpenAPI and standard Prism auth/validation/CORS/watch/options/cleanup observations
pass. All25 audit finding/path records remain identical with failing moderate
statuses; matching normal VSCE collection failure remains uncertified. Neither
security/package readiness nor root candidate integration follows from this slice.
Full Qlty comparison/aggregate and targeted documentation identity are retained
for two independent implementation reviews and later explicit Completion Approval.

### Slice N final gate metadata

Slice N is SLICE_APPROVED with immutable substantive identity
`e9aa2130303a91b00d7e69c33039f7746e5c6b4d4c2f4d9dca11f01bd722e288`.
Official full Qlty730/437 inventories match, with zero new/adverse SARIF findings
and final aggregate0; targeted contributor/feature docs and scope checks pass.
Both independent reviews return Ready without actionable Findings. Retained
handoffs: `/tmp/ajsbutler-dependabot-sliceN-review1.json` and
`/tmp/ajsbutler-dependabot-sliceN-review2.json`. Explicit Completion Approval
is Approved for its focused seven-path commit; retained Main approval record:
`/tmp/ajsbutler-sliceN-completion-approval/record.json`. These separately validated
gate annotations
do not alter R5/R6/security/actual-VSIX/publication gates in later slices.
