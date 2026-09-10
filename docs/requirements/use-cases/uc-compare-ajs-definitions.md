# UC: Compare AJS Definitions

## Goal

Let a reviewer compare the active JP1/AJS3 definition with a selected file or
the immutable `HEAD` snapshot of its Git repository, then inspect one
read-only Semantic Diff Explorer session.

## Trigger

- the reviewer runs `JP1/AJS: Compare Definition` with a JP1/AJS editor active

## Inputs

- the active editor buffer as the after definition, including unsaved changes
- either a selected definition file or the current definition at Git `HEAD`
- an optional half-open schedule comparison period entered as `YYYY-MM-DD`

## Outputs

- one semantic comparison in the read-only Semantic Diff Explorer
- Summary, Full, Audit, and JSON projections through the Explorer Output action
- source navigation to the captured before and after snapshots when available

## Rules

- the active editor is read once before prompts and remains the after side
- file comparison uses VS Code's decoded document and remains available when
  the Git extension is absent or unavailable
- Git comparison uses the built-in VS Code Git API v1 only, captures the
  current `HEAD` commit once, and never substitutes index or working-tree data
- Git resolves the active path first and permits only the documented,
  unambiguous rename fallback; an unavailable path does not assert that a file
  is untracked
- Git `Repository.show` supplies the decoded/textconv before snapshot; binary,
  unsupported, missing, and oversized sources remain explicit failures
- source and period selection are per-run values and are not persisted
- cancellation does not create a comparison, report, Explorer, or partial
  source session
- the Explorer is the successful default; copy and save actions remain
  explicit
- no definition content, path, ref, or provider exception is sent as
  telemetry

## Behavioral Scenarios

```gherkin
Feature: Compare JP1/AJS definitions

Scenario: File comparison opens Explorer
  Given a JP1/AJS definition is active
  When the reviewer selects a definition file and no schedule period
  Then one comparison opens in Semantic Diff Explorer
  And the before and after snapshots remain available for source navigation

Scenario: Git HEAD compares a dirty active definition
  Given the active tracked definition has unsaved or working-tree changes
  When the reviewer selects Git HEAD
  Then the before side is the decoded content at the captured HEAD commit
  And the after side is the current editor buffer
  And index or working-tree content is not substituted

Scenario: Git is unavailable
  Given the built-in Git extension or repository is unavailable
  When the reviewer selects Git HEAD
  Then the command reports a localized unavailable result
  And file comparison remains available on a subsequent run

Scenario: Period is carried to the comparison
  Given the reviewer chooses a schedule period and enters valid dates
  When comparison succeeds
  Then the half-open period is retained in the Explorer context
```

## Acceptance Notes

- Git capability is optional on desktop and web hosts.
- The command preserves VS Code `^1.75.0` compatibility and does not require a
  Git executable, Node built-in, or direct `.git` access.
