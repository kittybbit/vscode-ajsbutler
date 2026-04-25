# TASKS: build-flow-graph

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Review use case: docs/requirements/use-cases/uc-build-flow-graph.md
- [x] Implement `BuildFlowGraph` use case and DTO mapping
- [x] Cover desktop and web viewer command smoke paths

## Follow-up

- [ ] None.

## Notes

- 2026-04-11: desktop integration coverage in
  `src/test/suite/extension.test.ts` now verifies that executing
  `open.ajsbutler.flowViewer` creates the flow viewer webview tab.
- 2026-04-11: browser-hosted smoke coverage in `src/test/suite/webSmoke.ts`
  verifies that the same flow viewer command path executes in the web entry
  flow without failing.
