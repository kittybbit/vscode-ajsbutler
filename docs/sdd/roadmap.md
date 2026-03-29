# Roadmap

## Principles

- preserve behavior first
- refactor in small vertical slices
- prefer one use case per extraction
- keep parser internals away from UI-facing components

## Suggested Slice Order

1. Build unit list
2. Filter or search unit list
3. Export unit list CSV
4. Build flow graph DTO
5. Show unit definition
6. Isolate diagnostics and hover adapters
7. Reduce bootstrap concentration in extension activation

## Done Criteria For A Slice

- use case is documented
- affected boundaries are named explicitly
- tests cover the behavior being preserved
- compatibility impact is stated for desktop and web
- remaining debt is listed instead of hidden
