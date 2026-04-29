# TASKS: build-test-performance

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Current implementation gate: Slice-2 manual ANTLR generation.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Prior approval:

- Slice-1 was approved on 2026-04-29 when the user replied "はい" to the
  Slice-1 implementation approval request. Approved changes were limited to
  separating test execution from shared build preparation, adding prepare-once
  package scripts, updating CI to use the prepare-once command, updating
  related README/SDD tracking, and running validation. Parser grammar, runtime
  behavior, generated artifact semantics, dependency versions, and
  `engines.vscode` were out of scope.

## Investigation

- [x] Read repository SDD workflow and implementation gate.
- [x] Read `package.json` build and test scripts.
- [x] Read verify workflow.
- [x] Read webpack configuration.
- [x] Identify affected commands, generated parser boundary, CI workflow, and
      compatibility risks.
- [x] Record Slice-1 as the first detailed implementation target.

## Tasks

- [x] Create feature specification for build/test performance slices.
- [x] Create feature implementation plan and roadmap.
- [x] Create use-case contract for measurable validation performance.
- [x] Human approval recorded for Slice-1 implementation.
- [x] Slice-1 implementation scope matches approved scope.
- [x] Slice-1 package-script changes completed.
- [x] Slice-1 CI or README changes completed only if approved.
- [x] Slice-1 timings recorded.
- [x] Slice-2 selected as the next implementation candidate.
- [x] Slice-2 impact investigation completed.
- [x] Slice-2 SDD plan updated.
- [ ] Human approval recorded for Slice-2 implementation.
- [ ] Slice-2 implementation scope matches approved scope.
- [ ] Slice-2 package-script changes completed.
- [ ] Slice-2 documentation changes completed.
- [ ] Slice-2 generated parser safety checks completed.
- [ ] Slice-2 timings recorded.
- [ ] Draft slices 3 through 8 promoted to detailed specs only when their
      implementation slice becomes active.

## Slice-2 Impact Investigation

- Planned change:
  remove automatic ANTLR generation from ordinary build/test preparation and
  keep parser generation as an explicit maintainer command.
- Affected files:
  `package.json`, `README.md`,
  `docs/specs/features/build-test-performance/*`,
  `docs/requirements/use-cases/uc-improve-build-test-performance.md`, and
  `docs/specs/plans.md`.
- Affected commands:
  `pnpm run antlr4ts`, `pnpm run antlr:clean`, `pnpm run antlr:generate`,
  `pnpm run test:prepare`, `pnpm run test:full`, `pnpm test`,
  `pnpm run test:web`, and `pnpm run build`.
- Affected parser boundary:
  grammar source remains `src/antlr/*.g4`; generated parser files remain under
  `src/generate/parser`; runtime parser imports through `@generate/parser/*`
  must remain unchanged.
- Affected features:
  parser preparation, diagnostics, unit list, flow graph, CSV export, hover,
  desktop tests, and web tests through their shared parser dependency.
- Affected tests:
  parser-dependent unit/integration suites, desktop extension tests, web
  extension tests, and production build.
- Related docs:
  `SPECS.md`, `PLANS.md`, this task file, and the build/test performance use
  case.
- Breaking-change risk:
  medium for stale generated parser artifacts if contributors forget explicit
  generation after grammar or generator changes; low for VS Code compatibility
  because no extension API changes are planned.
- Alternatives:
  keep unconditional clean generation; use hash/stamp-based incremental
  generation; use filesystem timestamps; defer ANTLR work and implement
  development webpack optimization first.

## Timing Evidence

- 2026-04-29 baseline `pnpm test`: passed, 15.44s real time.
- 2026-04-29 baseline `pnpm run test:web`: sandboxed Chromium launch failed
  with macOS Mach port permission denial; rerun outside the sandbox passed,
  16.41s real time.
- 2026-04-29 post-change `pnpm run test:full`: passed outside the sandbox,
  22.03s real time. Logs show `test:prepare` ran once before the desktop and
  web test runners.
- 2026-04-29 post-change compatibility `pnpm test`: passed, 19.39s real time.
- 2026-04-29 post-change compatibility `pnpm run test:web`: passed outside
  the sandbox, 16.69s real time.
- Local observed reduction for running both suites together:
  approximately 31.85s baseline combined time to 22.03s with `test:full`.

## Validation

- [x] Run `pnpm run qlty`.
- [x] Run `pnpm run lint:md`.
- [x] Run `pnpm run test:full`.
- [x] Run `pnpm test`.
- [x] Run `pnpm run test:web`.
- [x] Run `pnpm run build`.

## Notes

- Slice-1 is implemented after approval.
- `pnpm run qlty` initially failed in the sandbox because qlty could not create
  its log file; the same command passed outside the sandbox.
- `pnpm run build` completed with existing webpack asset-size warnings.
