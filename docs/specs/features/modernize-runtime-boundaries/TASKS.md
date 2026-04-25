# TASKS: modernize-runtime-boundaries

## Sync Rule

- Update this file in the same commit whenever a durable requirement or
  follow-up decision changes.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Remove stale `flatted` transport assumptions.
- [x] Migrate package management to pinned `pnpm` with validation parity.
- [x] Split table and flow viewer bundles.
- [x] Measure post-split viewer bundle output.
- [x] Re-measure MUI path-import narrowing and record that it did not produce
      meaningful production-size gains.
- [x] Compare table-side and flow-side dependency weight.
- [x] Reject async flow-chrome deferral after it increased complexity without
      useful bundle reduction.
- [x] Identify `UnitEntity.id` persistence checks before changing the hash
      algorithm.

## Follow-up

- [ ] Replace the custom `UnitEntity` hash implementation only after the
      documented identity and compatibility checks are refreshed.

## Notes

- Current DTO transport does not require cyclic serialization.
- Current bundle-size work is deferred until a clearer shrinking seam or
  stronger product requirement appears.
