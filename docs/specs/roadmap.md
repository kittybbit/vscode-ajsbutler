# Roadmap

This roadmap contains only unfinished repository-level future work and the
entry conditions that make planning each item useful.

## Product Decisions

### WebAPI Import Beta Exit

- Entry condition: usable smoke-verification evidence from a real JP1/AJS3
  WebAPI environment and enough user feedback are available.
- Decide whether the delivered read-only import can exit beta after the owning
  feature records product and version context, tested scenarios, observed
  results, host constraints, and the sufficiency of
  `searchTarget=DEFINITION`.
- Keep broader WebAPI behavior outside this decision.

## Verification Follow-ups

### WebAPI Generated Fixture Reproducibility

- Owner: Existing WebAPI maintainer.
- Scope: verify reproducibility of
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`.
- Done condition: `pnpm run openapi:check` exits 0 and the exact fixture
  matches generator output. No runtime or generator edit is implied.
