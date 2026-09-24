---
name: sdd-evidence
description: Capture reproducible mechanical evidence for one selected vscode-ajsbutler SDD slice before planning, implementation review, or Feature Exit. Use existing CLI output and tests; leave design and approval judgments to their owners.
---

# SDD Evidence

Prepare an evidence record for one selected feature and slice. This skill
coordinates existing commands; it does not implement a repository collector,
parse qlty findings, decide Solution Shape, or grant approval. Follow
`docs/specs/README.md` for the snapshot, validation, review, and approval
rules. Keep raw outputs outside the repository in the corresponding disposable
snapshot.

## Inputs

Resolve the selected feature, approved slice, comparison-base commit, final
working tree or commit, approved path list, and required checks before
collecting. If any is unclear, record `unknown` and return to Main. Do not
silently choose a base or treat a feature document's approval field as proof of
the human decision.

## Collection

1. Record the exact base and final revisions with Git. Capture Git's
   `diff --name-status --find-renames -z` output against the base, plus
   `ls-files --others --exclude-standard -z` for untracked paths. Check every
   added, modified, deleted, and renamed path against the approved list;
   evaluate both old and new paths for a rename. An unsupported path pattern,
   unclear rename, or path outside scope is an explicit concern, not a pass.
2. Follow `docs/specs/README.md` for qlty. Record the verified version,
   identical configuration hash and analyzed paths, exact commands and exit
   states, and paths to all four official baseline/final `check` and `smells`
   SARIF files. Preserve the raw files. Do not create a textual-output parser
   or a project-specific finding comparator.
3. Record each required validation command and its observed exit status.
   Mark an unrun, missing, interrupted, or unreadable check `unknown`; mark a
   nonzero exit `failed`. Link the existing architecture dependency test result
   separately. Its cataloged rule result is automatic evidence; semantic
   ownership and abstraction value still need review.
4. Compare `package.json` `engines.vscode` at base and final. Search changed
   production files for Node built-in imports and list files touching desktop,
   web, bootstrap, generated parser, or configuration boundaries. These are
   risk signals, not compatibility verdicts. If a static search cannot resolve
   a dynamic import or multiline declaration, record that ambiguity.
5. From changed files and diffs, list affected layers, added exports,
   dependency imports, and names that may represent ports, adapters,
   factories, or lifecycle owners. The reviewer decides each semantic owner,
   responsibility, contract, dependency direction, and abstraction value.
6. Check whether selected `TRACEABILITY.md` exists and whether `TASKS.md`
   contains the required approval sections and fields. Record only presence
   and stated values. Human messages and gate verdicts remain the authority
   for approval.

## Evidence Record

Use this compact format in the slice's `TASKS.md` or a snapshot-local evidence
file linked from it. Keep command logs and raw artifacts snapshot-local.

```text
Evidence version: 1
Selected feature / slice:
Base SHA / final revision or working-tree identity:
Approved path list / changed paths / out-of-scope or ambiguous paths:
qlty version / config hash / analyzed paths / four SARIF paths / exits:
Architecture test command / exit / raw output path:
Other required checks: command / exit / raw output path / passed|failed|unknown
engines.vscode before / after / changed|unchanged|unknown:
Node imports / host-relevant paths / unresolved static scans:
Changed layers / exports / imports / abstraction candidates:
Traceability presence / recorded approval fields / missing fields:
Unavailable or ambiguous evidence:
```

Do not label a whole record `Ready` or `Approved`. Stop collection once the
required facts are captured and hand the record to the role that owns the
semantic decision.
