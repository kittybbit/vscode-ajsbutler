# TASKS: modernize-runtime-boundaries

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Document the modernization scope in SDD:
      `pnpm`, `flatted` removal, bundle-size reduction, dependency freshness, and
      `UnitEntity` hash replacement
- [x] Decide the review order between viewer serialization cleanup and
      `pnpm` migration:
      remove stale `flatted` assumptions first so package-manager diffs stay
      tooling-focused
- [x] Document the current `flatted` payload seams before replacement:
      current webview transport uses plain event objects and a
      `UnitListDocumentDto` payload that is rebuilt into normalized state in
      the viewers
- [x] Remove the direct `flatted` dependency from repository manifests and
      align the modernization docs with the current DTO-based transport seam

## Remaining Follow-up

- [ ] Define bundle-size measurement and acceptance thresholds
- [ ] Identify identity and persistence checks needed before changing the hash
      algorithm
- [ ] Update validation commands after package-manager migration lands

## Notes

- 2026-04-18: repository-level policy now states that dependencies should stay
  as current as practical, with explicit documentation when compatibility or
  ecosystem regressions require a hold.
- 2026-04-18: current implementation evidence for the serialization seam is
  `buildUnitList(...) -> UnitListDocumentDto -> panel.webview.postMessage`
  on the extension side, followed by `toAjsDocument(document)` in both table
  and flow viewers.
- 2026-04-18: after `npm uninstall flatted`, the package manifest no longer
  declares `flatted` directly; remaining lockfile entries are currently
  transitive tooling dependencies rather than viewer transport requirements.
