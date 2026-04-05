# TASKS: normalize-ajs-document

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-normalize-ajs-document.md
- [x] Confirm SPECS.md
- [x] Implement normalized AJS document model
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [ ] Move remaining wrapper-derived semantics into the normalized model
      where they are broadly reusable
- [x] Expose normalized helpers for parent, ancestor, and root jobnet lookup
      so application slices stop repeating wrapper-era navigation logic
- [x] Expose normalized helpers for direct parameter lookup, repeated-value
      lookup, and first-ancestor inherited parameter lookup so application
      slices stop repeating wrapper-era parameter traversal logic
- [ ] Document which semantics intentionally remain in application view adapters
