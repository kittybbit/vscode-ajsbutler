# Requirements Traceability: Dependabot Security Updates

<!-- markdownlint-disable MD013 -->

| Use case / requirement | SPECS.md section | Implementation slice | Test or validation |
| --- | --- | --- | --- |
| Branch goal and Dependabot alerts 156-176 | Origin; Requirements R1-R3 | Slice 1 | Baseline evidence: 17 open Dependabot alerts (11 high/6 moderate). After the local resolution, `pnpm audit` reported 0 and `pnpm audit --audit-level moderate` succeeded. Dependabot closure remains a post-publication/Feature Exit check after the completed lockfile reaches GitHub. |
| Current package-audit coverage, including nanoid and newer brace-expansion advisories | Origin; Requirements R1-R3 | Slice 1 | Pre-resolution evidence: the reconciled 23-row inventory below from the baseline `pnpm audit` JSON; post-resolution audit: 0. All ten mapped floors were met: `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`, `undici@7.29.0`, `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `shell-quote@1.9.0`, `linkify-it@5.0.2`, `morgan@1.11.0`, and `nanoid@3.3.17`. |
| Minimum compatible dependency change | Requirements R4 and R6; Dependency Impact | Slice 1 | Changed files are only `pnpm-workspace.yaml` and `pnpm-lock.yaml`. Existing override targets and targeted transitive resolutions are reflected in the lockfile; `package.json`, direct/production declarations, runtime source, tests, and generated artifacts remain unchanged. |
| Build, lint, package, mock, and test tooling preservation | Requirements R5; Compatibility | Slice 1 | `qlty`, build, test compilation, and desktop tests succeeded. `pnpm run lint:md` succeeded for 35 files with 0 errors. `pnpm run test:web` exited 0 with existing `ECONNRESET`/`Premature close` logs. VSIX packaging used `vsce package --no-dependencies` in a temporary directory because normal `vsce ls`/package dependency detection failed on missing nested dev dependencies in the pnpm layout; unzip test/list, manifest/content validation, and cleanup succeeded. |
| VS Code, Node, desktop/web, and JP1/AJS compatibility | Compatibility; Acceptance Criteria | Slice 1 | Node `20.20.2` and pnpm `10.33.0` frozen install succeeded and all floors were met. The Playwright installer stopped without output while attempting environment-dependent OS dependency installation, but Playwright `1.59.1` and Chromium/headless-shell were cached and the same environment completed `pnpm run test:web` (including pretest web build/test compilation) with exit 0. Main accepts the real web test as validation-equivalent; installer handoff is an environment follow-up. No manifest, runtime, source, test, or product behavior change was made. |
| VSIX archive/package-content objective | Requirements R5; Compatibility | Slice 1 | Normal `vsce ls`/package dependency detection misidentified the pnpm layout and reported missing nested dev dependencies. Because the extension uses webpack-bundled assets and does not need `node_modules` in the VSIX, Main approved the temporary `vsce package --no-dependencies` path as validation-equivalent after successful archive, unzip, manifest, content, and cleanup checks. |
| Approved implementation files and review handoff | TASKS.md Approval Boundary | Slice 1 | Implementation evidence is limited to `pnpm-workspace.yaml` and `pnpm-lock.yaml`; this document synchronization is limited to `TASKS.md` and `TRACEABILITY.md`. Slice status is Implemented; implementation review pending, with `implementation-reviewer` as the next route and Completion Approval still Pending. |
| OpenAPI baseline validation failure | Requirements R5; Production Readiness | Slice 1 | `openapi:check` failed only because `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is stale. Owner: Main hands it to a separate task or the existing WebAPI maintainer. Route: separate work before Feature Exit, excluded from Slice 1. Done condition: `pnpm run openapi:check` exits 0 and the generated fixture matches generator output. |
| No durable product-contract change | Durable Document Impact; Non-Goals | Feature Exit | Feature Exit must review requirements use cases, roadmap, README, CHANGELOG, and architecture impact; no update is required for this implementation because no observable product contract changed. |
| Plan-gate package and implementation boundary | TASKS.md Approval Boundary | Plan gate / Slice 1 | The plan gate contains the three feature documents; implementation targets are separately limited to `pnpm-workspace.yaml` and `pnpm-lock.yaml`. |
| Explained lockfile resolution only | Requirements R1-R4; Acceptance Criteria | Slice 1 | The changed lockfile entries are attributable to the approved ten-floor resolution and required peer/integrity consequences; no unrelated implementation files were changed. |

## Immutable GitHub Dependabot open-alert snapshot (17 rows)

This table is the immutable evidence snapshot re-obtained through the GitHub
API. It records the 17 open alerts exactly as re-queried; each row is retained
independently even when the GHSA and dependency path repeat. The repository
URLs are stable alert references. Remote closure is not claimed until the
completed implementation reaches GitHub and Feature Exit rechecks the API.

| Number | Package/path | GHSA | Severity | Vulnerable range | First patched | Selected floor/response | Stable URL |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 176 | `js-yaml` / `Prism path` | [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | high | `>=4.0.0,<4.3.1` | `4.3.1` | `floor js-yaml@4.3.1` | [Dependabot 176](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/176) |
| 175 | `postcss` / `css-loader>postcss` | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | medium | `<=8.5.22` | `8.5.23` | `postcss@8.5.23` | [Dependabot 175](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/175) |
| 173 | `fast-uri` / `Prism>ajv>fast-uri` | [GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7) | high | `>=3.0.0,<3.1.5` | `3.1.5` | `fast-uri@3.1.5` | [Dependabot 173](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/173) |
| 172 | `undici` / `VSCE>cheerio>undici` | [GHSA-m8rv-5g2x-5cg5](https://github.com/advisories/GHSA-m8rv-5g2x-5cg5) | medium | `>=7.0.0,<7.29.0` | `7.29.0` | `undici@7.29.0` | [Dependabot 172](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/172) |
| 171 | `undici` / `VSCE>cheerio>undici` | [GHSA-jr45-8vmc-qm54](https://github.com/advisories/GHSA-jr45-8vmc-qm54) | medium | `same (>=7.0.0,<7.29.0)` | `7.29.0` | `undici@7.29.0` | [Dependabot 171](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/171) |
| 170 | `undici` / `VSCE>cheerio>undici` | [GHSA-v3r7-h72x-cjcm](https://github.com/advisories/GHSA-v3r7-h72x-cjcm) | medium | `same (>=7.0.0,<7.29.0)` | `7.29.0` | `undici@7.29.0` | [Dependabot 170](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/170) |
| 169 | `undici` / `VSCE>cheerio>undici` | [GHSA-4cwx-7wf7-3272](https://github.com/advisories/GHSA-4cwx-7wf7-3272) | high | `same (>=7.0.0,<7.29.0)` | `7.29.0` | `undici@7.29.0` | [Dependabot 169](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/169) |
| 168 | `undici` / `VSCE>cheerio>undici` | [GHSA-8xcm-r25x-g524](https://github.com/advisories/GHSA-8xcm-r25x-g524) | medium | `same (>=7.0.0,<7.29.0)` | `7.29.0` | `undici@7.29.0` | [Dependabot 168](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/168) |
| 164 | `postcss` / `css-loader>postcss` | [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | high | `<=8.5.17` | `8.5.18` | `postcss@8.5.23` | [Dependabot 164](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/164) |
| 163 | `brace-expansion` / `ESLint>minimatch>brace-expansion` | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | high | `<1.1.16` | `1.1.16` | `brace-expansion@1.1.18` | [Dependabot 163](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/163) |
| 162 | `js-yaml` / `Prism>json-schema-ref-parser>js-yaml` | [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | high | `>=4.0.0,<4.3.0` | `4.3.0` | `js-yaml@4.3.1` | [Dependabot 162](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/162) |
| 161 | `shell-quote` / `npm-run-all>shell-quote` | [GHSA-395f-4hp3-45gv](https://github.com/advisories/GHSA-395f-4hp3-45gv) | high | `<=1.8.4` | `1.9.0` | `shell-quote@1.9.0` | [Dependabot 161](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/161) |
| 160 | `fast-uri` / `Prism>ajv>fast-uri` | [GHSA-v2hh-gcrm-f6hx](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx) | high | `>=3.0.0,<=3.1.3` | `3.1.4` | `fast-uri@3.1.5` | [Dependabot 160](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/160) |
| 159 | `fast-uri` / `Prism>ajv>fast-uri` | [GHSA-4c8g-83qw-93j6](https://github.com/advisories/GHSA-4c8g-83qw-93j6) | high | `>=3.0.0,<3.1.3` | `3.1.3` | `fast-uri@3.1.5` | [Dependabot 159](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/159) |
| 158 | `linkify-it` / `VSCE>markdown-it>linkify-it` | [GHSA-v245-v573-v5vm](https://github.com/advisories/GHSA-v245-v573-v5vm) | high | `<=5.0.1` | `5.0.2` | `linkify-it@5.0.2` | [Dependabot 158](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/158) |
| 157 | `brace-expansion` / `VSCE>minimatch>brace-expansion` | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | high | `>=3.0.0,<5.0.7` | `5.0.7` | `brace-expansion@5.0.9` | [Dependabot 157](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/157) |
| 156 | `morgan` / `test-web>koa-morgan>morgan` | [GHSA-4vj7-5mj6-jm8m](https://github.com/advisories/GHSA-4vj7-5mj6-jm8m) | medium | `>=1.2.0,<=1.10.1` | `1.11.0` | `morgan@1.11.0` | [Dependabot 156](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/156) |

## Pre-resolution advisory inventory (23 rows)

This inventory was generated from the baseline `pnpm audit` JSON obtained via
`git archive 59d508e9^`; row count and advisory IDs were reconciled with that
source. Each row preserves its package path, severity, vulnerable range, first
patched version, and selected response floor. The linked public GHSA pages are
stable references for the advisory IDs.

| # | Advisory | Package/path | Severity | Vulnerable range | First patched | Selected response floor |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | [GHSA-4vj7-5mj6-jm8m](https://github.com/advisories/GHSA-4vj7-5mj6-jm8m) | `morgan`; `.>@vscode/test-web>koa-morgan>morgan` | moderate | `>=1.2.0 <=1.10.1` | `>=1.11.0` | `morgan@1.11.0` |
| 2 | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | `brace-expansion`; `.>eslint>@eslint/eslintrc>minimatch>brace-expansion` | high | `<1.1.16` | `>=1.1.16` | `brace-expansion@1.1.18` |
| 3 | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | `brace-expansion`; `.>@vscode/vsce>minimatch>brace-expansion` | high | `>=3.0.0 <5.0.7` | `>=5.0.7` | `brace-expansion@5.0.9` |
| 4 | [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | `js-yaml`; `.>@stoplight/prism-cli>@stoplight/prism-http>json-schema-faker>json-schema-ref-parser>js-yaml` | high | `>=4.0.0 <4.3.0` | `>=4.3.0` | `js-yaml@4.3.1` |
| 5 | [GHSA-395f-4hp3-45gv](https://github.com/advisories/GHSA-395f-4hp3-45gv) | `shell-quote`; `.>npm-run-all>shell-quote` | high | `<=1.8.4` | `>=1.9.0` | `shell-quote@1.9.0` |
| 6 | [GHSA-v245-v573-v5vm](https://github.com/advisories/GHSA-v245-v573-v5vm) | `linkify-it`; `.>@vscode/vsce>markdown-it>linkify-it` | high | `<=5.0.1` | `>=5.0.2` | `linkify-it@5.0.2` |
| 7 | [GHSA-v2hh-gcrm-f6hx](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri` | high | `>=3.0.0 <=3.1.3` | `>=3.1.4` | `fast-uri@3.1.5` |
| 8 | [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | `postcss`; `.>css-loader>postcss` | high | `<=8.5.17` | `>=8.5.18` | `postcss@8.5.23` |
| 9 | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | `brace-expansion`; `.>eslint>@eslint/eslintrc>minimatch>brace-expansion` | high | `<1.1.17` | `>=1.1.17` | `brace-expansion@1.1.18` |
| 10 | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | `brace-expansion`; `.>@vscode/vsce>minimatch>brace-expansion` | high | `>=4.0.0 <5.0.8` | `>=5.0.8` | `brace-expansion@5.0.9` |
| 11 | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | `postcss`; `.>css-loader>postcss` | moderate | `<=8.5.22` | `>=8.5.23` | `postcss@8.5.23` |
| 12 | [GHSA-8xcm-r25x-g524](https://github.com/advisories/GHSA-8xcm-r25x-g524) | `undici`; `.>@vscode/vsce>cheerio>undici` | moderate | `>=7.0.0 <7.29.0` | `>=7.29.0` | `undici@7.29.0` |
| 13 | [GHSA-4cwx-7wf7-3272](https://github.com/advisories/GHSA-4cwx-7wf7-3272) | `undici`; `.>@vscode/vsce>cheerio>undici` | high | `>=7.0.0 <7.29.0` | `>=7.29.0` | `undici@7.29.0` |
| 14 | [GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri` | high | `>=3.0.0 <3.1.5` | `>=3.1.5` | `fast-uri@3.1.5` |
| 15 | [GHSA-m8rv-5g2x-5cg5](https://github.com/advisories/GHSA-m8rv-5g2x-5cg5) | `undici`; `.>@vscode/vsce>cheerio>undici` | moderate | `>=7.0.0 <7.29.0` | `>=7.29.0` | `undici@7.29.0` |
| 16 | [GHSA-jr45-8vmc-qm54](https://github.com/advisories/GHSA-jr45-8vmc-qm54) | `undici`; `.>@vscode/vsce>cheerio>undici` | moderate | `>=7.0.0 <7.29.0` | `>=7.29.0` | `undici@7.29.0` |
| 17 | [GHSA-v3r7-h72x-cjcm](https://github.com/advisories/GHSA-v3r7-h72x-cjcm) | `undici`; `.>@vscode/vsce>cheerio>undici` | moderate | `>=7.0.0 <7.29.0` | `>=7.29.0` | `undici@7.29.0` |
| 18 | [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | `brace-expansion`; `.>@vscode/vsce>minimatch>brace-expansion` | high | `>=4.0.0 <5.0.9` | `>=5.0.9` | `brace-expansion@5.0.9` |
| 19 | [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | `brace-expansion`; `.>eslint>@eslint/eslintrc>minimatch>brace-expansion` | high | `<1.1.18` | `>=1.1.18` | `brace-expansion@1.1.18` |
| 20 | [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | `js-yaml`; `.>@stoplight/prism-cli>@stoplight/prism-http>json-schema-faker>json-schema-ref-parser>js-yaml` | high | `>=4.0.0 <4.3.1` | `>=4.3.1` | `js-yaml@4.3.1` |
| 21 | [GHSA-4c8g-83qw-93j6](https://github.com/advisories/GHSA-4c8g-83qw-93j6) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri` | high | `>=3.0.0 <3.1.3` | `>=3.1.3` | `fast-uri@3.1.5` |
| 22 | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | `nanoid`; `.>css-loader>postcss>nanoid` | high | `<3.3.16` | `>=3.3.16` | `nanoid@3.3.17` |
| 23 | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | `nanoid`; `.>css-loader>postcss>nanoid` | high | `<3.3.17` | `>=3.3.17` | `nanoid@3.3.17` |

<!-- markdownlint-enable MD013 -->
