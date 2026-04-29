# TASKS: build-test-performance

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.

## Human Approval

- Status: Approved
- Approved at: 2026-04-29
- Approved scope: User replied "はい" to the Slice-1 implementation approval
  request. Approved changes are limited to separating test execution from
  shared build preparation, adding prepare-once package scripts, updating CI to
  use the prepare-once command, updating related README/SDD tracking, and
  running validation. Parser grammar, runtime behavior, generated artifact
  semantics, dependency versions, and `engines.vscode` are out of scope.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

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
- [ ] Draft slices 2 through 8 promoted to detailed specs only when their
      implementation slice becomes active.

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
