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

- [x] Define bundle-size measurement and acceptance thresholds:
      measure production output with `pnpm run build`, capture analyzer
      evidence with `pnpm run build -- --env analyzer=true`, treat
      `out/index.js` as the primary webview budget, and use the
      2026-04-18 baseline (`9,166,525` raw / `2,362,382` gzip) with
      +5% review and `10,000,000` raw / `2,500,000` gzip escalation limits
- [ ] Profile the largest contributors in `report/index_report.html` and
      choose the first concrete bundle-reduction slice
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
- 2026-04-18: bundle-size measurement now treats `out/index.js` as the
  primary viewer budget because both table and flow viewers load the same
  webview bundle, while `out/web.js` and `out/extension.js` stay secondary
  guards for shared runtime drift.
- 2026-04-18: the post-migration baseline is `out/index.js` =
  `9,166,525` bytes raw and `2,362,382` bytes gzip; routine slices should
  stay within +5% unless the SDD docs record an explicit exception with
  analyzer evidence.
