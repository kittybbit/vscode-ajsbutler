---
name: sdd-evidence
description: Capture reproducible mechanical evidence for one SDD feature and slice; leave design and approval judgments to their owners.
---

# SDD Evidence

Capture mechanical facts for one selected feature and slice. Do not implement
a collector, interpret qlty findings, judge Solution Shape, or approve work.
Keep raw outputs in the corresponding disposable snapshot.

## Inputs and collection

Resolve the selected feature/slice, comparison base, final revision or working
tree, approved paths, and required checks. If unclear, record unknown and
return to Main; never infer approval from a document field.

Record:

- Exact base/final revisions; Git name-status with rename detection; untracked
  paths; and every path outside or ambiguous against the approved list.
- qlty version, configuration hash, identical analyzed paths and commands,
  exit states, and all four baseline/final check/smells SARIF files.
- Each required check's command, exit, raw-output path, and passed/failed/
  unknown state; architecture dependency-test result separately.
- engines.vscode before/after; Node-import scan and unresolved cases; desktop,
  web, bootstrap, parser, and configuration surfaces touched.
- Changed layers, exports, imports, and possible ports, adapters, factories,
  or lifecycle owners, without deciding their semantic value.
- TRACEABILITY.md presence and TASKS.md approval sections and stated fields.

Follow the disposable-snapshot, SARIF, and final-aggregate contract in
docs/specs/README.md. Preserve complete SARIF 2.1.0 and command logs. Compare
official SARIF records only; do not build a text parser or custom comparator.
Keep cache and outputs local to each snapshot. Missing, malformed, failed, or
mismatched evidence is not a pass.

## Compact evidence record

Record in TASKS.md or a snapshot-local file linked from it:

Evidence version; feature/slice; base/final identity; approved/changed/out-of-scope
paths; qlty version/config/path scope/commands/exits/four SARIF paths; required
check commands/exits/output paths/states and architecture-test command/result;
engines.vscode and host/import signals;
changed layers/exports/imports/abstraction candidates; traceability and stated
approval fields; unavailable or ambiguous evidence.

Do not label the record Ready or Approved. Stop when required facts are
captured and return them to the role that owns the decision.
