# Feature Specification: Optimize CI verification

## Purpose

Simplify pull request verification and the associated package scripts. Run
the existing JP1/AJS Butler build and host checks once where needed, and
restore the Linux browser setup needed to run them.

## Source

- The maintainer requested a joint review of GitHub Actions checks and
  `package.json` tasks after seeing redundant checks.
- [Verify on Flow PR #351](https://github.com/kittybbit/vscode-ajsbutler/actions/runs/45719321375/job/139573444293)
  failed at the Playwright 1.59.1 browser installation step on Ubuntu 26.04.
- [Contributor commands](../../../../CONTRIBUTING.md#common-scripts) describe
  the public local commands and their supported test suites.

## Requirements and acceptance

- Present one repository-owned Verify result per pull request. Preserve the
  repository's docs-only path allowlist and product coverage for mixed and
  product changes. Keep the product setup, build, and host suites off the
  docs-only path. Surface classification errors instead of silently omitting
  product verification.
- Share package orchestration between Verify and contributor scripts where
  the preparation steps are identical. On the product CI path, build
  production bundles, compile test TypeScript, and prepare each distinct test
  bundle once. Run stable Desktop, minimum Desktop, and Web tests on those
  artifacts. Propagate build, lint, and test failures to Verify.
- Preserve the existing contributor commands and their development or
  production semantics. A targeted command prepares the artifacts used by its
  intended suite. The CI entry point keeps the Markdown lint and existing
  product checks, including the accessibility fixture used by stable Desktop.
- Use a Linux GitHub-hosted runner image supported by the locked Playwright
  version. Confirm the product CI path can install Chromium headless shell and
  proceed through all three host suites on the exact PR head.

## Decisions and impact

- `.github/workflows/verify.yml` owns pull request classification and hosting
  setup. `package.json` owns reusable build and test commands. The existing
  `changes` and `decide` jobs only classify and invert a Boolean, respectively.
- Minimum Desktop and Web share the host smoke bundle. Stable Desktop uses a
  separate accessibility fixture. Coverage stays distinct even where the
  build and test preparation are shared.
- Assess docs-only, mixed, and product paths, including pagination, renames
  across the allowlist, and classification failure. Validate task composition,
  the installed dependency's runner support, and the resulting exact-head CI
  outcomes. Record any necessary contributor command documentation update.
- Keep CI setup scoped to this repository's workflow. CodeQL and Qlty Cloud
  are managed separately and their current branch rules remain applicable.

## Compatibility

Preserve the supported VS Code engine contract, stable Desktop, minimum
Desktop 1.75.0, and Web extension host coverage. Constrain the Linux runner
selection to CI. Keep production and development extension commands usable on
their existing hosts.

## Non-goals

- Product behavior, dependency modernization, changing VS Code support, and
  changing managed CodeQL, Qlty Cloud, or branch protection.
- Edits to the Flow implementation in PR #351. This CI change can enable that
  PR to run Verify when its branch includes the fix.
