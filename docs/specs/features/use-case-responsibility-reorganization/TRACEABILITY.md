# Traceability: Use-Case Responsibility Reorganization

| Source | SPECS          | Slice | Validation                 |
| ------ | -------------- | ----- | -------------------------- |
| D1     | R1, R2, R4-R6  | 1     | Passed: paths/qlty/lint    |
| U1     | R3-R6          | 2     | Passed: scenarios/rules    |
| E1     | R3-R6          | 3     | Passed: scenarios/rule IDs |
| F1     | R2, R3, R5, R6 | 4     | Passed: scenarios/details  |
| S1     | R3, R5, R6     | 5     | Passed: scenarios/paths    |
| U2     | R4, R7, R8     | 6     | Passed: six IDs/consumers  |
| E2     | R4, R7, R8     | 7     | Passed: IDs/gap inventory  |
| F2     | R2, R5, R9     | 8     | Passed: ownership matrix   |
| V2     | R5, R6, R10    | 9     | Passed: matrix/evidence    |

## Source Mapping

- D1: normalization, parameter interpretation, command generation, telemetry,
  and search-unification requirement documents.
- U1: `uc-build-unit-list.md` and `uc-build-unit-list-view.md`.
- E1: `uc-provide-editor-feedback.md`.
- F1: `uc-build-flow-graph.md` and its navigation references.
- S1: `uc-compare-semantic-diff.md` and all final taxonomy references.

## SPECS Requirement Mapping

- R1: keep only stable user/application behavior in `use-cases/`.
- R2: move other responsibilities to the correct document category.
- R3: consolidate or split files around user/application purposes.
- R4: make parameter interpretation the normative semantic owner.
- R5: preserve documented observable behavior except official-source
  corrections, whose runtime gaps are deferred explicitly.
- R6: keep indexes and repository-local links consistent.
- R7: make every parameter rule deterministic and source-backed.
- R8: enumerate exact consumer rule IDs or an explicit no-dependency boundary.
- R9: distinguish application placement constraints from presentation layout.
- R10: preserve requirement-level migration and reproducible final evidence.

## Replanned Review-Finding Mapping

- RF1-RF7 refer to the numbered findings in
  `Use-Case Responsibility Reorganization レビュー修正指示書`; they are
  distinct from SPECS requirements R1-R10 above.
- U2: review RF1 and RF4 for Unit List rules and the Hover no-ID boundary.
- E2: review RF1, RF3, and RF4 for supported diagnostic rules, official-manual
  precedence, consumer coverage, and independent conformance follow-up.
- F2: review RF2 for Flow application/presentation ownership.
- V2: review RF5, RF6, and RF7 for migration proof, validation, and current
  state.

## Requirement-Level Migration Evidence

### Counting Method

- Baseline: `1fc23fed7b1ba169c28cecb97c4a9cf011d4c9d1`.
- Counted sources: the six old Use Cases represented by `U1`, `E1`, `F1`,
  `S1`, and the old parameter-interpretation Use Case in `D1`.
- One requirement item is one top-level bullet under `Outputs`, `Rules`,
  `Acceptance Notes`, or `Risks Or Edge Cases`, or one complete Gherkin
  scenario. Wrapped lines remain part of the same item.
- Goal, Trigger, and Inputs were reviewed as context but are not counted as
  independent behavioral assertions. Headings and explanatory prose are also
  excluded.
- Item codes use `O` for Outputs, `R` for Rules, `S` for Scenarios, `A` for
  Acceptance Notes, and `K` for Risks Or Edge Cases. Ranges are inclusive.
- Every counted item has exactly one row below. A `Split` row may name two
  owners only when the old item itself contains both responsibilities.

### Current Owner Legend

- Unit List: `docs/requirements/use-cases/uc-view-unit-list.md`
- Diagnose: `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`
- Hover: `docs/requirements/use-cases/uc-show-parameter-hover.md`
- Build Flow: `docs/requirements/use-cases/uc-build-flow-graph.md`
- Explore Flow: `docs/requirements/use-cases/uc-explore-flow-graph.md`
- Build Diff: `docs/requirements/use-cases/uc-build-semantic-diff.md`
- Present Diff:
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`
- Parameter Rules:
  `docs/requirements/domain-rules/interpret-jp1-parameters.md` and its indexed
  family rule files
- Roadmap: `docs/specs/roadmap.md`

### Migration Matrix

<!-- markdownlint-disable MD013 -->

| Baseline source items                       | Count | Disposition                      | Current owner or reason                                                   |
| ------------------------------------------- | ----: | -------------------------------- | ------------------------------------------------------------------------- |
| UBL-O01-O02, S01-S05, A01-A03               |    10 | Consolidated                     | Unit List                                                                 |
| UBL-R01-R02, K01-K02                        |     4 | Reworded without semantic change | Unit List                                                                 |
| UBL-R03                                     |     1 | Moved                            | Parameter Rules                                                           |
| ULV-O01-O02, R04, S01-S07, A01              |    11 | Consolidated                     | Unit List                                                                 |
| ULV-R01                                     |     1 | Reworded without semantic change | Unit List                                                                 |
| ULV-R02-R03, R05, K01-K02                   |     5 | Intentionally removed            | Migration and table-framework implementation details                      |
| EF-O01, R04, S01, S04-S29, A02-A03, K01     |    32 | Moved                            | Diagnose                                                                  |
| EF-O02, S02, K02                            |     3 | Moved                            | Hover                                                                     |
| EF-R01-R03, S03, A01                        |     5 | Split                            | Diagnose and Hover host-neutral boundaries                                |
| FG-O01-O03, R01-R04, R06-R12, R29           |    15 | Reworded without semantic change | Build Flow                                                                |
| FG-S01-S03, S05-S07, S16, A01, A05, K01-K03 |    12 | Reworded without semantic change | Build Flow                                                                |
| FG-O04, R05, R13-R25, S08-S15, K04          |    24 | Moved                            | Explore Flow                                                              |
| FG-S04, A06                                 |     2 | Split                            | Build Flow constraints and Explore Flow viewport behavior                 |
| FG-R26-R28, A02-A04                         |     6 | Intentionally removed            | Viewer chrome, card structure, implementation history, and file ownership |
| FG-K05                                      |     1 | Deferred                         | Roadmap-triggered future job-group flow design                            |
| SD-O01-O04, R01-R18, R24, S01-S08           |    31 | Split                            | Build Diff                                                                |
| SD-A01-A02, A07, K01-K04                    |     7 | Split                            | Build Diff                                                                |
| SD-O05-O07, R19-R23, S09-S10, A03-A05       |    13 | Split                            | Present Diff                                                              |
| SD-A06                                      |     1 | Deferred                         | Future flow-view highlighting integration                                 |
| PI-O01-O02, R01-R03, S01-S04, A02, K03      |    11 | Moved                            | Parameter Rules                                                           |
| PI-A01                                      |     1 | Split                            | Official Parameter Rules and runtime-conformance Roadmap entry            |
| PI-A03                                      |     1 | Deferred                         | Roadmap-triggered future manual-alignment feature                         |
| PI-K01-K02, K04                             |     3 | Reworded without semantic change | Parameter Rules and explicit exclusions                                   |

<!-- markdownlint-enable MD013 -->

`UBL` is old Build Unit List, `ULV` is old Build Unit List View, `EF` is old
Provide Editor Feedback, `FG` is old Build Flow Graph, `SD` is old Compare
Semantic Diff, and `PI` is old Interpret JP1 Parameters.

### Migration Totals

| Result                                         |   Count |
| ---------------------------------------------- | ------: |
| Equivalent                                     |       0 |
| Moved                                          |      71 |
| Consolidated                                   |      21 |
| Split                                          |      59 |
| Reworded without semantic change               |      35 |
| Intentionally removed as implementation detail |      11 |
| Deferred as a future design decision           |       3 |
| Unmapped                                       |       0 |
| **Reviewed total**                             | **200** |

The 186 Moved, Consolidated, Split, or Reworded items have current durable
owners. The remaining 14 items have explicit removal or deferral reasons.
The source totals are UBL 15, ULV 17, EF 40, FG 60, SD 52, and PI 16.

### Official-Contract Corrections

The matrix proves responsibility migration; it does not claim that provisional
implementation values override the official contract. `PI-A01` is split so
that official JP1/AJS3 version 13 meaning remains in Parameter Rules while
runtime differences remain actionable under Roadmap item 8. That entry covers
the confirmed yearly-cycle, repeated `evwfr`, transfer-macro context, custom-PC
transfer, QUEUE retry, and quoted byte-length gaps. No runtime correction is
part of this feature.

## Candidate Validation Evidence

- Validated candidate:
  `04b891e69485366ffbca53524ba97a3b3794dde0`.
- Evidence basis: durable requirement changes through completed Slice 8.
- This Slice 9 diff changes only feature-local evidence and state. It is the
  one permitted evidence-only change after the validated candidate and does
  not alter the candidate's durable documents.

<!-- markdownlint-disable MD013 -->

| Check             | Command                                                     | Result                            |
| ----------------- | ----------------------------------------------------------- | --------------------------------- |
| Quality           | `rtk pnpm run qlty`                                         | Passed: no issues                 |
| Markdown          | `rtk pnpm run lint:md`                                      | Passed: 29 files, 0 errors        |
| Whitespace        | `git diff --check main...04b891e6`                          | Passed                            |
| Docs-only branch  | `git diff --name-only main...04b891e6` plus allowlist check | Passed: 0 non-doc paths           |
| Durable links     | repository-local Markdown link-target check                 | Passed: 0 broken targets          |
| Stale old paths   | durable-document old-path search                            | Passed: 0 stale paths             |
| Rule IDs          | definition/reference set comparison                         | Passed: 31 defined and referenced |
| Rule-ID integrity | duplicate/undefined/unreferenced checks                     | Passed: 0/0/0                     |
| Migration         | baseline item inventory and matrix total                    | Passed: 200 reviewed, 0 unmapped  |

<!-- markdownlint-enable MD013 -->

### Reproduction Commands

```bash
rtk pnpm run qlty
rtk pnpm run lint:md
git diff --check main...04b891e69485366ffbca53524ba97a3b3794dde0
git diff --name-only main...04b891e69485366ffbca53524ba97a3b3794dde0 \
  | awk '!/^(docs\/|README\.md$|\.codex\/|\.github\/)/ {print}'
rg -n \
  -e 'uc-build-unit-list-view\.md' \
  -e 'uc-build-unit-list\.md' \
  -e 'uc-provide-editor-feedback\.md' \
  -e 'uc-compare-semantic-diff\.md' \
  -e 'uc-interpret-jp1-parameters\.md' \
  -e 'uc-normalize-ajs-document\.md' \
  -e 'uc-generate-ajs-commands\.md' \
  -e 'uc-record-telemetry\.md' \
  -e 'uc-search-domain-unification\.md' \
  docs/requirements docs/specs \
  --glob '!docs/specs/features/use-case-responsibility-reorganization/**'
```

The stale-path command succeeds with no output. The following commands perform
the link and rule-ID checks without retaining a feature-specific script.

<!-- markdownlint-disable MD013 -->

```bash
node <<'NODE'
const fs = require("fs");
const path = require("path");
const files = [];

function walk(input) {
  const stat = fs.statSync(input);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(input)) {
      walk(path.join(input, name));
    }
  } else if (input.endsWith(".md")) {
    files.push(input);
  }
}

for (const root of ["docs", "README.md", "AGENTS.md"]) {
  if (fs.existsSync(root)) walk(root);
}

let broken = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const targets = [
    ...[...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]),
    ...[...text.matchAll(/^\[[^\]]+\]:\s*(\S+)/gm)].map((match) => match[1]),
  ];
  for (let target of targets) {
    target = target.trim().replace(/^<|>$/g, "");
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    target = target.split("#")[0].split("?")[0];
    if (!target) continue;
    try {
      target = decodeURIComponent(target);
    } catch {}
    if (!fs.existsSync(path.resolve(path.dirname(file), target))) broken++;
  }
}
console.log(`BROKEN_LINKS ${broken}`);
if (broken) process.exitCode = 1;
NODE
```

```bash
node <<'NODE'
const fs = require("fs");
const path = require("path");

function markdownFiles(root) {
  const result = [];
  function walk(input) {
    for (const name of fs.readdirSync(input)) {
      const item = path.join(input, name);
      if (fs.statSync(item).isDirectory()) walk(item);
      else if (item.endsWith(".md")) result.push(item);
    }
  }
  walk(root);
  return result;
}

const definitions = new Map();
for (const file of markdownFiles("docs/requirements/domain-rules")) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/^### `?(JP1-PARAM-[A-Z0-9-]+)`?/gm)) {
    const owners = definitions.get(match[1]) || [];
    owners.push(file);
    definitions.set(match[1], owners);
  }
}

const references = new Set();
for (const file of markdownFiles("docs/requirements/use-cases")) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/JP1-PARAM-[A-Z0-9-]+/g)) {
    references.add(match[0]);
  }
}

const duplicate = [...definitions].filter((entry) => entry[1].length > 1);
const undefinedIds = [...references].filter((id) => !definitions.has(id));
const unreferenced = [...definitions.keys()].filter(
  (id) => !references.has(id),
);
console.log(`DEFINED ${definitions.size}`);
console.log(`REFERENCED ${references.size}`);
console.log(`DUPLICATE_OWNERS ${duplicate.length}`);
console.log(`UNDEFINED_REFERENCES ${undefinedIds.length}`);
console.log(`UNREFERENCED_DEFINITIONS ${unreferenced.length}`);
if (duplicate.length || undefinedIds.length || unreferenced.length) {
  process.exitCode = 1;
}
NODE
```

<!-- markdownlint-enable MD013 -->

The migration inventory was enumerated from the baseline with the counting
method above and checked by summing every matrix row by disposition. The
recorded source totals, set counts, and zero differences make each result
reproducible.
