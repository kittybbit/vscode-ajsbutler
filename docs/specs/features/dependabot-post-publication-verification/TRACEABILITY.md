# Requirements Traceability: Dependabot Post-Publication Verification

<!-- markdownlint-disable MD013 -->

| Requirement/source                                | Slice        | Test or validation                                                                                                                                                                                                                                                   |
| ------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 publication/graph identity                     | 1, 3         | Remote SHA/dependency hashes, full exported npm nodes and edges reconciled; separately pinned proof for three exact alias tuples only; honest GitHub omissions, publication ancestry and drift interval                                                              |
| R2 complete historical/current/new alert coverage | 1, 3         | Known 17 IDs, planning 15 IDs and complete all-state/all-page union; individual missing-ID GETs                                                                                                                                                                      |
| R3 dispositions                                   | 1, 3         | Every union member has observed state/fix fields, evidence, explicit disposition; no absence-based closure                                                                                                                                                           |
| R4 unresolved ownership                           | 3            | Named security/tooling owner, concrete Main decision handoff, missing-evidence blocker                                                                                                                                                                               |
| R5 direct upgrades first                          | 2A → 2R      | Bounded direct-owner keys/versions, parent/registry/lock reconciliation and audit floors                                                                                                                                                                             |
| R6 minimal overrides                              | 1 → N → 2A   | All-existing-override inventory; actual safe redundancy reduction, justified owned exceptions, pnpm-generated lockfile                                                                                                                                               |
| R7 behavior/support compatibility                 | N → 2A → 2R  | Standalone Node>=24.18/Prism5.16/CI24.x with baseline audit no-regression; Node24/pnpm10.33/VSCode1.75 full build, architectureDependencyRules/packageManifest, desktop/minimum/web, Prism/OpenAPI and VSIX boundary evidence, qlty SARIF comparison/final aggregate |
| Automation user-owned; no runtime redesign        | All          | Exact historical path/version scope; approved Node24 CI-only delta; unchanged remediation automation/permissions/patch/source boundaries                                                                                                                             |
| Roadmap complete published result                 | Feature Exit | All five committed slices, R1-R7 coverage and explicitly preserved unresolved owner routing                                                                                                                                                                          |

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

## Fixable and residual remediation boundaries

Completed N supports Node24. Pending2A covers R5/R6 eight-family fixes and minimal
remaining36 overrides on fresh N baseline/final; R7 standard bundled archive,
external/dynamic/resource closure and actual isolated stable/minimum/web artifact
smoke plus full repo build/hosts/qlty. Real packaged activation/commands/resources
are distinct from injected internal smoke. Old root25→1 is discovery only.

Known baseline braces alone may remain2A's matched residual; failing audit remains
honest, no new/expanded exposure or lower regression. R5/R7 security-clean outcome
belongs to blocked2R pending supported official fix or separately approved standard
tool replacement. No2R implementation scope/customs/waiver.3 waits for completed
2A/2R and separate publication; feature no High/moderate/full alert coverage intact.
Replan Human Approval Pending; original/alias/completed1/N gates unchanged.

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

## Slice2A baseline closure observation

R7 artifact verification remains unfulfilled: fresh actual webpack statistics
show inherited desktop HTTPS automatic externalization through the unchanged
telemetry SDK, beyond the plan's explicitly listed desktop host external set.
Slice2A remains IMPLEMENTING before dependency edits; Main owns the closure
coverage decision. Raw provenance and entry bytes are in
`/tmp/ajsbutler-dependabot-slice2a-evidence/record.json`. No VSIX/host/security
acceptance or feature completion follows from baseline installation/build.

HTTPS enumeration now follows Main's documented Correction Loop classification
for the unchanged desktop SDK builtin; R7 still requires actual complete closure
and artifact-host proof. No product import, security or compatibility gate changes.

Actual baseline VSIX verification now blocks R7 before dependency edits: the
CRC-valid27-entry archive includes existing webpack.web-test.config.js tooling.
The no-packed-tooling gate needs a focused `.vscodeignore` scope decision through
Main; current five approved paths cannot correct that exclusion. HTTPS coverage
has its separate resolved classification. No packaged-host/closure pass is claimed.

## Pending packaging-ignore delta

R7 retains baseline CRC-valid27entries and one known inherited test-config
inclusion as failed cleanliness. Final must be tooling-clean; proposed .vscodeignore
adds only webpack.web-test.config.js exclusion after renewed review/approval.
Exact removed entry plus attributable bundle updates must explain final diff.
Baseline/final closure/resources/current/minimum/web artifact checks still required;
unexecuted observations unknown. Inherited SDK desktop HTTPS enumeration permits
no other external. R5/R6/security and completed gates unchanged; reuse valid
baseline by identity, renew affected final proof and both implementation reviews.

## Pending Chromium verification-host association delta

R7 uses standard test-web0.0.80 scanner/mount plus pinned browser test-
location host
selection: exactly product artifact and distinct minimal verification Web
extension.
Nested test URI, exact two development IDs/roots, observable testing worker and
product browser-only routing/actual activation/commands/resources establish
separate
proofs; no invented direct production worker token or activation-only
substitution.
Product pre/post archive hashes and complete HTTP payload/resource mapping
required.
Desktop layout, both implementation reviews and all graph/audit/quality/security
gates unchanged. Prior exact-one approval stays historical; its failure remains
failed. Baseline/final Chromium renewed after review/approval; unrelated valid
facts reused by identity. No new product paths or custom development mechanisms.

## Slice2A implementation mapping

- Direct-upgrade/override contracts: five approved declarations and30 redundant
  override removals; six owned inherited exceptions with explicit ranges/API/
  security/removal conditions in retained `override-assessment.json`.
- Eight security families: secure final lock floors or VSCE4 path elimination;
  fresh25→1 audit retains unchanged braces under2R. No security-clean claim.
- Compatibility/behavior: unchanged VSCode^1.75 and production boundaries;
  desktop1200, minimum/Chromium, build/bundles/OpenAPI/standard Prism pass.
- Artifact contract: actual baseline/final standard VSCE archives and full webpack
  externals/resource inventories; final removes exactly approved tooling entry.
  Stable/minimum actual-artifact roots and standard two-extension Chromium prove
  actual loaded URI/entry/resources/activation/real commands/hover/viewers.
  Testing-worker observation and injected smoke remain distinct product evidence.
- Evidence: `/tmp/ajsbutler-dependabot-slice2a-evidence/`; original failures,
  baseline negative tooling and normal collector outcomes preserved. Final quality,
  complete identities and independent reviews remain separate gates.

### Slice2A final result metadata

- SLICE_APPROVED; both independent reviews Ready and Completion Approval recorded.
  Full730/437 Qlty inventories agree; check4→3, smells151 unchanged and aggregate0.
  Exact six-path patch/evidence identities are retained in Slice2A record.json.
- Scope acceptance is dependency risk reduction and verified actual bundled VSIX
  compatibility. Unchanged braces remains blocked2R; overall security/publication
  gates and Slice3 prerequisites remain intact.
