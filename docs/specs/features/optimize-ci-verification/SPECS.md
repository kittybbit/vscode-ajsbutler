# Feature Specification: Optimize CI verification

## Purpose

Simplify pull request verification and the package scripts contributors use.
Run the existing JP1/AJS Butler build and host checks once where needed,
and restore the Linux browser setup needed to run them.

## Source

- The maintainer requested a joint review of GitHub Actions checks and
  `package.json` tasks after seeing redundant checks.
- The maintainer then requested a review of the whole package script
  catalog and specified that the Desktop and Web hosts ship together and
  should be built and tested together.
- The maintainer asked to simplify Verify to environment setup, a small
  changed-path check, and calls to the package scripts.
- [Verify on Flow PR #351](https://github.com/kittybbit/vscode-ajsbutler/actions/runs/45719321375/job/139573444293)
  failed at the Playwright 1.59.1 browser installation step on Ubuntu 26.04.
- [Contributor commands](../../../../CONTRIBUTING.md#common-scripts) describe
  the public local commands and their supported test suites.

## Requirements and acceptance

- Present one repository-owned Verify result per pull request. Check out
  the merge revision that Verify will test. Preserve the docs-only
  allowlist and skip product setup and checks only when the nonempty tree
  diff from that merge's base parent is wholly allowlisted. Run product
  verification when classification is inconclusive.
- Use one `pnpm test` recipe for contributor and product CI verification.
  Build both production outputs, compile test TypeScript, and prepare both
  fixture bundles once. Run stable Desktop, minimum-version Desktop, and
  Web on those artifacts. A failure stops subsequent stages and fails
  the command. Keep Markdown lint in Verify.
- Provide combined `build`, `development` and `watch` commands for the
  package. Remove the separate host build, test and preparation entry
  points and update contributor guidance in the same slice. Preserve
  the stable Desktop accessibility fixture and the shared minimum
  Desktop and Web smoke fixture.
- Make production clean and local test preparation explicit in the recipes
  that need them. Preserve the VSIX hook and the order and failure behavior of
  the ANTLR and Qlty aggregates. Remove private aliases with no remaining
  callers and the unused script orchestrator, preserving retained dependency
  versions and the frozen install.
- Use a Linux GitHub-hosted runner image supported by the locked Playwright
  version. Confirm the product CI path can install Chromium headless shell and
  proceed through all three host suites on the exact PR head.

## Decisions and impact

- Verify owns checkout, changed-path classification, and Linux setup. A
  native Git comparison classifies the effect on the tested merge tree.
  The result may differ from a PR file list when a branch change has no
  net effect on that tree. `package.json` owns reusable build and test
  recipes and command ordering.
- Minimum Desktop and Web share the host smoke bundle. Stable Desktop uses a
  separate accessibility fixture. Coverage stays distinct even where the
  build and test preparation are shared.
- Verify runs Markdown lint and the one `pnpm test` step under Xvfb.
  Existing runner logs identify each host suite. pnpm setup reads the
  package manager from the manifest. Verify caches the pnpm dependency
  store and installs the locked Playwright browser on the product path.
- Assess docs-only, mixed, and product paths, including large diffs,
  renames across the allowlist, incomplete history, and merge identity
  mismatches. Validate task composition, the Linux browser setup, and
  exact-head hosted results.
- Keep CI setup scoped to this repository's workflow. CodeQL and Qlty Cloud
  are managed separately and their current branch rules remain applicable.

## Compatibility

Preserve the supported VS Code engine contract, stable Desktop, minimum
Desktop 1.75.0, and Web extension host coverage. Constrain the Linux runner
selection to CI. Keep production and development extension commands usable on
their existing hosts.

## Non-goals

- Product behavior, dependency replacement or upgrades, changing VS Code
  support, and changing managed CodeQL, Qlty Cloud, or branch protection.
- Edits to the Flow implementation in PR #351. This CI change can enable that
  PR to run Verify when its branch includes the fix.
