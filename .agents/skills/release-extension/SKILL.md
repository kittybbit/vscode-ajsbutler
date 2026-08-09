---
name: release-extension
description: Prepare and publish a vscode-ajsbutler VS Code extension release with protected-branch, tag, package, and Marketplace safety checks.
---

# Release Extension

## Purpose

Prepare and publish a `vscode-ajsbutler` extension release without rewriting
`main`, force-pushing protected refs, or changing GitHub rulesets. When SDD
applies, use the repository's feature lifecycle before release work.

## Safety Rules

- never disable, edit, bypass, or delete GitHub rulesets
- never force-push `main` or push directly to `origin/main`
- never amend commits already merged to `origin/main`
- never move a published release tag
- do not publish with `vsce` before the exact version, tag, package contents,
  and command have passed the required approval gate
- stop when an existing tag/version, protected-ref rejection, or merge-path
  ambiguity requires a decision

## Inputs and Baseline

Read `AGENTS.md`, `package.json`, `CHANGELOG.md`, `README.md`,
`docs/specs/README.md`, and any active release feature docs. Fetch tags and
confirm a clean, up-to-date base:

```bash
rtk git fetch origin --tags
rtk git status --short --branch
```

## Release Workflow

1. Identify the previous published release from remote semver tags; do not use
   memory. Stop when the tag is ambiguous.
2. Compare the previous tag with the intended head and classify runtime,
   parser, UI, packaging, dependency, README, web-extension, and VS Code
   compatibility impact.
3. Choose the highest applicable semver bump: major for breaking changes,
   minor for compatible user-visible capability, and patch for fixes,
   documentation, packaging-only, or internal changes.
4. Create `codex/release-v<X.Y.Z>` from `origin/main` after the target version
   is decided.
5. Update `CHANGELOG.md`, run docs validation, and commit it separately.
6. Run `rtk pnpm version <bump-or-version>` without suppressing its git tag.
   Verify the version commit and `v<X.Y.Z>` tag point to the expected commit.
7. Run quality, Markdown, build, desktop test, web test, and VSIX packaging
   checks. Inspect the VSIX for version, engine, README, CHANGELOG, bundles,
   and accidental source/docs/local coordination files.
8. Push only the release branch and tag. Stop on rejection; do not change
   rulesets or force-push.
9. Confirm the PR merge strategy preserves the tagged version commit in
   `main`; stop for a decision when squash or rebase would make it unreachable.
10. Publish the exact validated version with the approved `vsce` command.
11. Open or update the release PR with the tag, validation, package,
    Marketplace, and no-ruleset-change evidence.
12. After merge, verify tag reachability from `origin/main` without retagging
    or rewriting refs.

## Required Evidence

Report the previous tag, target version and reason, branch and PR, CHANGELOG
summary, version command and tag, validation/package result, Marketplace
result, tag reachability, no-ruleset-change confirmation, and follow-up risks.

## Rules

- use repository tools and `rtk` for inspection, git, package scripts, and
  validation
- preserve VS Code engine and desktop/web compatibility
- keep release decisions explicit and stop at an unresolved safety gate
