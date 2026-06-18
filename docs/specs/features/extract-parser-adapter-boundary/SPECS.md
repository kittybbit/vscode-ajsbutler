# Feature Specification: Extract Parser Adapter Boundary

## Purpose

Move concrete ANTLR parser orchestration out of the domain layer behind an
application-facing parser port, without changing parsing or user-visible
behavior.

## Origin

- Feature kind: roadmap feature
- Source use cases:
  `docs/requirements/use-cases/uc-build-unit-list.md` and
  `docs/requirements/use-cases/uc-provide-editor-feedback.md`
- Roadmap source: `docs/specs/roadmap.md`, "Introduce stricter
  parser/infrastructure boundaries"
- Related plan: `docs/specs/plans.md`

## Requirements

- Application consumers of raw JP1/AJS definition text depend on a
  repository-owned parser port rather than concrete ANTLR classes or a parser
  implementation located in domain.
- Concrete lexer creation, token-stream creation, parser invocation,
  syntax-error listener wiring, parse-tree walking, and evaluator invocation
  live in an infrastructure adapter.
- The initial port preserves the existing parse result: raw root `Unit` values
  and repository-owned parser errors with the same line, column, and message
  semantics. ANTLR recognizer, offending-symbol, and exception types do not
  cross into application contracts.
- Existing unit-list and editor-feedback behavior remains unchanged.
- Parser grammar, generated ANTLR artifacts, evaluator semantics, raw `Unit`,
  normalization, and semantic diagnostic rules are not redesigned in this
  feature.
- Dependency injection remains explicit and small; do not introduce a general
  service container.
- Parsing remains synchronous for this slice so current editor diagnostics and
  webview document-update paths do not acquire lifecycle or ordering changes.
- No new runtime dependency is introduced.

## Architecture

- Domain: retains raw `Unit`, normalization, and parser-independent JP1/AJS
  semantics; does not import generated parser or ANTLR runtime types.
- Application: owns the parser port and parse-result/error contracts used by
  application use cases.
- Presentation: continues to consume existing DTOs; no parser dependency is
  introduced.
- Infrastructure: implements the parser port using the generated ANTLR lexer,
  parser, syntax listener, tree walker, and parse-tree-to-`Unit` evaluator.

## Impact Analysis

### Dependency Impact

- Affected production callers: `buildUnitList` and `buildSyntaxDiagnostics`.
- Affected concrete parser components: `AjsParser.ts`, `AjsEvaluator.ts`, and
  `SyntaxErrorListener.ts`; their generated-parser and ANTLR-dependent
  responsibilities move behind the infrastructure adapter.
- Affected composition: parser adapter construction must be wired at the
  nearest existing application/extension composition boundary used by both
  desktop and web hosts.
- Affected tests: application use-case tests need injectable parser coverage;
  parser, normalization, parameter, wrapper, flow, and presentation tests that
  currently import `parseAjs` need a stable test-facing adapter or fixture
  boundary without weakening production dependencies.
- Related docs: `current-state.md`, `architecture.md`, `plans.md`, `roadmap.md`,
  and the two source use cases.
- Propagation decision: update all production imports of the concrete parser
  and all test imports broken by its relocation in the same approved slice;
  leave raw-model consumers and semantic rules otherwise unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: existing unit-list document and diagnostic DTOs
  remain unchanged. The internal `BuildUnitListResult.errors` contract changes
  from ANTLR-owned error objects to repository-owned parser errors containing
  the consumed position and message fields.
- VS Code/web extension compatibility: both bundles must use the same
  host-neutral parser adapter; no Node-only dependency may enter shared paths.
- Changed scenarios: none; existing build-unit-list and editor-feedback
  scenarios are regression contracts.

### Alternative Considerations

- Keep concrete parsing in domain: rejected because application use cases
  remain coupled to ANTLR orchestration and the target dependency boundary is
  not achieved.
- Return only normalized `AjsDocument` from the first port: rejected for this
  slice because semantic diagnostics still require raw `Unit` and combining
  normalization migration would create a second independent purpose.
- Keep the generated-type evaluator or listener in domain: rejected because it
  would leave domain coupled to ANTLR mechanics after orchestration moves.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`.
- Re-approval is required for parser grammar or generated-artifact changes,
  evaluator behavior changes, raw/normalized model redesign, diagnostic-rule
  changes, DTO changes, or a new runtime dependency.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve the existing browser bundle and avoid
  Node-only modules in the port and adapter import chain.
- Desktop extension compatibility: preserve extension activation, parsing,
  diagnostics, list, flow, and CSV behavior.
- The parser port and adapter remain synchronous in both hosts.
- Model, semantic-navigation, or agent choice does not change this behavior
  contract or the SDD approval gate.

## Acceptance Criteria

- No application production module imports the concrete ANTLR parser
  implementation from domain.
- Domain code no longer owns concrete ANTLR runtime orchestration.
- Domain production modules no longer import `antlr4ts` or generated parser
  types.
- Unit-list and syntax-diagnostic outputs remain compatible for valid and
  invalid definitions.
- Parser error line, column, and message semantics remain unchanged.
- Infrastructure adapter tests cover successful nested-unit mapping and syntax
  errors from invalid input.
- Application tests use a fake parser port to prove unit-list and diagnostic
  decisions do not require ANTLR-owned types or the concrete adapter.
- Existing raw-model, normalization, flow, parameter, and wrapper tests retain
  a clear test boundary and pass.
- Desktop tests, web tests, quality checks, and production build pass.
- `engines.vscode` and public contribution points remain unchanged.

## Non-Goals

- Changing JP1/AJS grammar, parse behavior, or generated parser artifacts.
- Migrating semantic diagnostics from raw `Unit` to `AjsDocument`.
- Moving raw `Unit`, normalization, or parser-independent JP1/AJS semantics
  into infrastructure.
- Renaming all legacy source folders or completing the full target directory
  structure.
- Refactoring bootstrap, webview, flow layout, CSV, telemetry, or WebAPI import.

## Open Questions

- The planning phase must choose the smallest port construction and injection
  shape that supports both production use cases without a service container.
- The planning phase must decide whether parser-focused tests import the
  infrastructure adapter directly or use a dedicated test helper.
