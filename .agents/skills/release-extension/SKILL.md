---
name: release-extension
description: Prepare and publish a vscode-ajsbutler VS Code extension release with protected-branch, tag, package, and Marketplace safety checks.
---

# Release Extension

Prepare and publish `vscode-ajsbutler` releases. Release work is outside the
SDD lifecycle.

## Safety

- Never disable, edit, bypass, or delete GitHub rulesets; rewrite `main`;
  force-push `main`; push to `origin/main`; amend commits already
  merged to `origin/main`; or move a published release tag.
- Use `vsce` only after the exact version, tag, package contents, and command
  pass the required approval gate.
- Stop when the previous tag is ambiguous or an existing tag or version
  requires a decision.

## Release Procedure

1. Review `package.json`, `CHANGELOG.md`, `README.md`, and active release
   feature docs. Fetch remote tags and confirm the base is clean and current.
2. Identify the previous published semver tag. Compare it with the intended
   head and classify runtime, parser, UI, packaging, dependency, README,
   web-extension, and VS Code compatibility impact.
3. Choose the highest applicable bump: major for breaking changes, minor for
   compatible user-facing capability, or patch for fixes, documentation,
   packaging-only, or internal changes. Create `codex/release-v<X.Y.Z>` from
   `origin/main` after deciding the target version.
4. Update `CHANGELOG.md`, validate the documentation, and commit that change
   separately. Run `pnpm version <bump-or-version>` without suppressing its Git
   tag; verify the version commit and `v<X.Y.Z>` tag point to the expected
   commit.
5. Run quality, Markdown, build, desktop, web, and VSIX packaging checks.
   Inspect the VSIX for its version, engine, README, CHANGELOG, bundles, and
   accidental source, documentation, or local coordination files.
6. Push only the release branch and tag; stop on rejection. Confirm the PR
   merge strategy preserves the tagged version commit in `main`; stop if a
   squash or rebase would make it unreachable. After the publication gate, run
   the approved `vsce` command for the validated version.
7. Open or update the release PR with tag, validation, package, Marketplace,
   and no-ruleset-change evidence. After merge, verify the tag is reachable
   from `origin/main` without retagging or rewriting refs.

## Report

Include the previous tag; target version and reason; branch and PR; CHANGELOG
summary; version command and tag; validation and package results; Marketplace
result; tag reachability; no-ruleset-change confirmation; and follow-up risks.
