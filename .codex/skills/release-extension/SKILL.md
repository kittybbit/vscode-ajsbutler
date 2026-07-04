---
name: release-extension
description: Use when preparing and publishing a vscode-ajsbutler VS Code extension release, including comparing the previous release tag with the current head, choosing the semantic version bump, creating a release branch, updating CHANGELOG before the version bump, running pnpm version with its git tag, validating and publishing with vsce, pushing the release branch and tag without changing GitHub rulesets, and opening the release PR.
---

# release-extension

## Purpose

Prepare and publish a vscode-ajsbutler extension release without rewriting
`main`, force-pushing protected refs, or changing GitHub rulesets.

This skill does not bypass the repository SDD workflow. When AGENTS.md says SDD
applies, use the SDD skills to create, plan, review, approve, implement, and
close the release-preparation feature.

## Non-Negotiable Safety Rules

- Do not disable, edit, bypass, or delete GitHub rulesets.
- Do not force-push `main` or a protected branch.
- Do not push directly to `origin/main`.
- Do not amend commits that have already been merged to `origin/main`.
- Do not move a published release tag after the release is published.
- Do not publish with `vsce` before explicit human approval for the exact
  version, tag, package contents, and publish command.
- Stop for human decision if a tag already exists, the version already exists
  on Marketplace, PR merge strategy would make the tag target unreachable from
  `main`, or any protected-ref push is rejected.

## Inputs

Read these first:

1. `AGENTS.md`
2. `package.json`
3. `CHANGELOG.md`
4. `README.md`
5. `docs/specs/README.md`
6. active release SDD feature docs when present

Fetch before deciding release scope:

```bash
rtk git fetch origin --tags
rtk git status --short --branch
```

Continue only from a clean worktree and an up-to-date base such as
`origin/main`.

## Workflow

### 1. Identify the Previous Release

Find the previous release tag from remote tags, not memory:

```bash
rtk git tag --list 'v[0-9]*' --sort=-v:refname
rtk git ls-remote origin 'refs/tags/v*'
```

Select the latest valid semver tag that represents the last published
extension release. If the latest tag is ambiguous, ask the human to choose the
previous release tag before continuing.

### 2. Understand Changes Since the Previous Release

Compare the previous tag with the intended release head:

```bash
rtk git log --oneline <previous-tag>..origin/main
rtk git diff --stat <previous-tag>..origin/main
rtk git diff --name-status <previous-tag>..origin/main
```

Inspect affected areas enough to classify user impact:

- runtime extension behavior
- parser, unit list, flow view, CSV, diagnostics, hover, telemetry
- README or Marketplace-facing documentation
- package metadata and extension manifest
- VS Code `engines.vscode` compatibility
- web extension entry points and shared code
- dependencies and generated artifacts

Summarize the changes before proposing the version bump.

### 3. Choose the Semantic Version Bump

Use semver from the previous published version:

- `major`: breaking user-visible behavior, incompatible API/schema/command
  change, removal of supported behavior, or raising `engines.vscode`.
- `minor`: new user-visible feature, new command/view/setting, compatible
  behavior expansion, or significant Marketplace-visible capability.
- `patch`: bug fix, documentation correction, packaging-only fix, internal
  refactor with no intended behavior change, or release-process correction.

If multiple categories apply, choose the highest bump. Record the reason and
ask for human approval of the bump and exact target version.

### 4. Create the Release Branch

Create a dedicated branch from `origin/main` after the target version is known:

```bash
rtk git switch -c codex/release-v<X.Y.Z> origin/main
```

Use another branch name only when the human requests it. Never perform release
edits on local `main`.

### 5. Update CHANGELOG Before Version Bump

Update `CHANGELOG.md` from the diff review before running `pnpm version`.
Keep entries user-facing and grouped consistently with the existing file.

Run docs validation for the CHANGELOG edit:

```bash
CI=true rtk pnpm run qlty
rtk pnpm run lint:md
```

Commit the CHANGELOG update separately so `pnpm version` can run from a clean
tree:

```bash
rtk git add CHANGELOG.md
rtk git commit -m "docs: prepare changelog for v<X.Y.Z>"
```

### 6. Bump Version With pnpm Version and Tag

Run `pnpm version` without `--no-git-tag-version` so the version commit and
annotated git tag are created by the package manager:

```bash
rtk pnpm version major
rtk pnpm version minor
rtk pnpm version patch
rtk pnpm version <X.Y.Z>
```

Use only the approved bump or exact version. After the command, verify:

```bash
rtk git status --short --branch
rtk git show --stat --oneline HEAD
rtk git tag --points-at HEAD
```

The tag must be `v<X.Y.Z>` unless the repository has an explicitly approved
different convention.

### 7. Validate and Package the Release Candidate

Run the release checks before publishing:

```bash
CI=true rtk pnpm run qlty
rtk pnpm run lint:md
rtk pnpm run build
rtk pnpm test
rtk pnpm run test:web
rtk pnpm exec vsce package --no-dependencies --out /private/tmp/vscode-ajsbutler-<X.Y.Z>.vsix
```

Inspect the VSIX contents for `package.json` version, `engines.vscode`, README,
CHANGELOG, `out/` bundles, and accidental inclusion of source, docs, lockfiles,
agent cache, or local-only files.

### 8. Push Branch and Tag Without Ruleset Changes

Push only the release branch and the release tag:

```bash
rtk git push -u origin codex/release-v<X.Y.Z>
rtk git push origin v<X.Y.Z>
```

If either push is rejected, stop. Do not change GitHub rulesets and do not
retry with force unless the human explicitly decides to abandon this release
attempt and create a new version or tag.

### 9. Confirm PR Merge Strategy Before Publish

The tag created by `pnpm version` points at the release branch version commit.
Before publishing, confirm the repository PR merge path will keep that commit
reachable from `main`.

Acceptable path:

- the PR is merged with a merge commit, preserving the release branch commit in
  `main` history

Stop for human decision when:

- the repository requires squash or rebase merge
- the PR has already been merged with a strategy that excludes the tag target
- the tag target cannot be expected to remain reachable from `main`

Do not solve this by retagging after merge or rewriting `main`.

### 10. Publish With vsce

After human approval, publish the exact validated version:

```bash
CI=true rtk pnpm exec vsce publish --no-dependencies
```

Use another `vsce publish` command only when the plan records that exact command
and the human approves it. Record the Marketplace result, published version,
warnings, and any URL or confirmation evidence.

If publish fails because the version already exists, credentials are missing,
or Marketplace validation rejects the package, stop for human decision.

### 11. Open the Release PR

Open the PR from the release branch to `main` after the release branch and tag
exist. If a draft PR was opened earlier for review, update it instead of
creating a second PR.

The PR body must include:

- previous release tag and target version
- semver bump decision and reason
- CHANGELOG summary
- validation commands and results
- VSIX package verification summary
- Marketplace publish result
- tag name and tag target
- explicit note that no GitHub rulesets were changed
- required merge strategy: merge commit, not squash or rebase

After the PR merges, verify without rewriting refs:

```bash
rtk git fetch origin --tags
rtk git branch --contains v<X.Y.Z>
rtk git merge-base --is-ancestor v<X.Y.Z> origin/main
rtk git ls-remote origin refs/heads/main refs/tags/v<X.Y.Z> refs/tags/v<X.Y.Z>^{}
```

If verification fails, record the mismatch and ask for human decision. Do not
retag, force-push, or change rulesets as an automatic fix.

## Final Report

Report:

- previous release tag
- target version and semver reason
- branch and PR URL
- CHANGELOG update summary
- `pnpm version` command used and tag created
- validation and package results
- `vsce publish` result
- tag target and whether it is reachable from `origin/main`
- confirmation that no GitHub rulesets were changed
- remaining risks or follow-up tasks
