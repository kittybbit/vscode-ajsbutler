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
- [x] Migrate the repository package manager from `npm` to `pnpm`:
      add `packageManager`, commit `pnpm-lock.yaml`, update CI, and switch
      contributor-facing validation commands to `pnpm`

## Remaining Follow-up

- [x] Re-scope bundle-size follow-up around shrinking refactors rather than
      only guarding growth:
      record the 2026-04-18 baseline for `out/index.js`, keep analyzer output
      as evidence, and identify the current single-entry viewer bundle as the
      first concrete reduction target
- [ ] Split the shared viewer entry so table and flow webviews can ship
      separate bundles instead of always loading both `AjsTableViewerApp` and
      `AjsFlowViewerApp`
- [ ] Profile the largest contributors after entry splitting and choose the
      next concrete shrinking slice
- [ ] Identify identity and persistence checks needed before changing the hash
      algorithm

## Notes

- 2026-04-18: repository-level policy now states that dependencies should stay
  as current as practical, with explicit documentation when compatibility or
  ecosystem regressions require a hold.
- 2026-04-18: current implementation evidence for the serialization seam is
  `buildUnitList(...) -> UnitListDocumentDto -> panel.webview.postMessage`
  on the extension side, followed by `toAjsDocument(document)` in both table
  and flow viewers.
- 2026-04-18: after removing the direct `flatted` dependency, viewer transport
  requirements stayed on DTO-based payloads and event objects rather than any
  lockfile-specific serialization package.
- 2026-04-18: `pnpm` migration pins `packageManager: pnpm@10.33.0`, replaces
  `package-lock.json` with `pnpm-lock.yaml`, and switches local plus CI
  validation commands to `pnpm`.
- 2026-04-18: bundle-size follow-up is now framed as webview-payload
  reduction; measurement exists to prove shrinkage, not to substitute for the
  refactor itself.
- 2026-04-18: the post-migration baseline is `out/index.js` =
  `9,166,525` bytes raw and `2,362,382` bytes gzip, and the strongest current
  hypothesis is that the single viewer entry point keeps both table and flow
  trees in the shipped bundle.
