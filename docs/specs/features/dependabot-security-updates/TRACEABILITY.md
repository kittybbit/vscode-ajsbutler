# Requirements Traceability: Dependabot Security Updates

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                                | SPECS.md section                                       | Implementation slice | Test or validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch goal and Dependabot alerts 156-176                                             | Origin; Requirements R1-R3                             | Slice 1              | Baseline evidence: 17 open Dependabot alerts (11 high/6 moderate). After the local resolution, `pnpm audit` reported 0 and `pnpm audit --audit-level moderate` succeeded. Dependabot closure remains a post-publication/Feature Exit check after the completed lockfile reaches GitHub.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Current package-audit coverage, including nanoid and newer brace-expansion advisories | Origin; Requirements R1-R3                             | Slice 1              | Pre-resolution evidence: the reconciled 23-row inventory below from the baseline `pnpm audit` JSON; post-resolution audit: 0. All ten mapped floors were met: `js-yaml@4.3.1`, `postcss@8.5.23`, `fast-uri@3.1.5`, `undici@7.29.0`, `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `shell-quote@1.9.0`, `linkify-it@5.0.2`, `morgan@1.11.0`, and `nanoid@3.3.17`.                                                                                                                                                                                                                                                                                                                                                                               |
| Minimum compatible dependency change                                                  | Requirements R4 and R6; Dependency Impact              | Slice 1              | Changed files are only `pnpm-workspace.yaml` and `pnpm-lock.yaml`. Existing override targets and targeted transitive resolutions are reflected in the lockfile; `package.json`, direct/production declarations, runtime source, tests, and generated artifacts remain unchanged.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Build, lint, package, mock, and test tooling preservation                             | Requirements R5; Compatibility                         | Slice 1              | `qlty`, build, test compilation, and desktop tests succeeded. `pnpm run lint:md` succeeded for 35 files with 0 errors. `pnpm run test:web` exited 0 with existing `ECONNRESET`/`Premature close` logs. VSIX packaging used `vsce package --no-dependencies` in a temporary directory because normal `vsce ls`/package dependency detection failed on missing nested dev dependencies in the pnpm layout; unzip test/list, manifest/content validation, and cleanup succeeded.                                                                                                                                                                                                                                                                       |
| VS Code, Node, desktop/web, and JP1/AJS compatibility                                 | Compatibility; Acceptance Criteria                     | Slice 1              | Node `20.20.2` and pnpm `10.33.0` frozen install succeeded and all floors were met. The Playwright installer stopped without output while attempting environment-dependent OS dependency installation, but Playwright `1.59.1` and Chromium/headless-shell were cached and the same environment completed `pnpm run test:web` (including pretest web build/test compilation) with exit 0. Main accepts the real web test as validation-equivalent; installer handoff is an environment follow-up. No manifest, runtime, source, test, or product behavior change was made.                                                                                                                                                                          |
| VSIX archive/package-content objective                                                | Requirements R5; Compatibility                         | Slice 1              | Normal `vsce ls`/package dependency detection misidentified the pnpm layout and reported missing nested dev dependencies. Because the extension uses webpack-bundled assets and does not need `node_modules` in the VSIX, Main approved the temporary `vsce package --no-dependencies` path as validation-equivalent after successful archive, unzip, manifest, content, and cleanup checks.                                                                                                                                                                                                                                                                                                                                                        |
| Approved implementation files and review handoff                                      | TASKS.md Approval Boundary                             | Slice 1 / Slice 2    | Slice 1 completed through `6e94136d`; Slice 2 completed through `57c2a8fa`. Independent implementation reviews are `Ready`, Completion Approvals are recorded, and the exact implementation paths remain in the historical Slice 2 approval row below.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| OpenAPI baseline validation failure                                                   | Requirements R5; Production Readiness                  | Feature Exit         | `openapi:check` fails because `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is stale. Owner: existing WebAPI maintainer. Route: separate focused generated-artifact reproducibility work tracked for Feature Exit. Closure requires the done condition or explicit Human Approval of this owned residual, together with approved durable propagation. Done condition: `pnpm run openapi:check` exits 0 and the fixture matches generator output; no runtime or generator edit is included in this replan.                                                                                                                                                                                                                                                                                                                                                         |
| No durable product-contract change                                                    | Durable Document Impact; Non-Goals                     | Feature Exit         | Feature Exit must review requirements use cases, roadmap, README, CHANGELOG, and architecture impact; no update is required for this implementation because no observable product contract changed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Plan-gate package and implementation boundary                                         | TASKS.md Approval Boundary                             | Plan gate / Slice 1  | The plan gate contains the three feature documents; implementation targets are separately limited to `pnpm-workspace.yaml` and `pnpm-lock.yaml`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Explained lockfile resolution only                                                    | Requirements R1-R4; Acceptance Criteria                | Slice 1              | The changed lockfile entries are attributable to the approved ten-floor resolution and required peer/integrity consequences; no unrelated implementation files were changed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Feature Exit advisory revalidation (2026-09-12)                                       | Requirements R1-R3; Acceptance Criteria                | Feature Exit         | GitHub has 10 newer open alerts: 180, 181, 182, 183, 184, 186, 187, 188, 191, and 192, covering `postcss-selector-parser`, `@faker-js/faker`, `@humanfs/node`, `fast-uri`, `browserslist`, `morgan`, and `baseline-browser-mapping`. A fresh `pnpm audit --json` re-query reports 15 advisory IDs and 16 findings (10 high, 5 moderate, 1 low); the high/moderate set includes `nanoid@3.3.17`, `browserslist@4.28.2`, `@humanfs/node@0.16.6`, `@faker-js/faker@5.5.3/10.4.0`, `qs@6.15.2`, `fast-uri@3.1.5`, `baseline-browser-mapping@2.10.20`, `js-yaml@4.3.1`, and `morgan@1.11.0`. `pnpm audit --audit-level moderate` exits 1. These newer compatible floors supersede the Slice 1 floors and require Replanning; closure is not recommended. |
| Feature Exit OpenAPI revalidation (2026-09-12)                                        | Requirements R5; Production Readiness                  | Feature Exit         | `pnpm run openapi:check` still fails because `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml` is stale. The generated artifact remains outside this review and is a separate follow-up owned by the existing WebAPI maintainer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Replanned current advisory mapping (2026-09-12)                                       | Requirements R1-R3, R7; Slice 2                        | Slice 2              | GitHub alerts and all current audit findings are mapped in the detailed table below. The current floors are retained through the existing override section and targeted lockfile resolution; Faker 10.5.0 additionally requires the exact Postman compatibility patch. No direct dependency or runtime/test/generated artifact change is planned.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Slice 2 implementation compatibility blocker (2026-09-12)                             | Requirements R1, R5, R8; Production Readiness          | Slice 2              | Resolved by the exact `postman-collection@4.5.0` patch committed in `57c2a8fa`; the patched module loads, all 118 generators are covered, and direct Prism smoke passes. Playwright installer interruption, the `Accept-Language: *` residual, and the stale OpenAPI fixture remain separate boundaries.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Postman/Faker compatibility contract                                                  | Requirement R8; Slice 2 Validation                     | Slice 2              | Revised implementation must inventory 118 generators, 111 Faker references, and all 47 Faker 10-incompatible legacy APIs; validate address/location, name/person, random/helpers, datatype/number/string, image, finance, and related mappings, including `this`/arguments, public Substitutor output contracts, seed determinism, and fixed clock/RNG or explicit exceptions. Patched `dynamic-variables.js` must have zero remaining legacy direct references.                                                                                                                                                                                                                                                                                    |
| Patch provenance and license preservation                                             | Requirement R9; Supply-chain Validation                | Slice 2              | Record upstream package URL/version, registry integrity, repository tag/source hash, and exact patch target. Verify only required `dynamic-variables.js` portions change; manifest, install scripts, LICENSE, dependencies, attribution, postman Apache-2.0, and Faker MIT metadata/license remain unchanged and no Faker copy is embedded.                                                                                                                                                                                                                                                                                                                                                                                                         |
| Revised Slice 2 approval and implementation boundary                                  | Requirements R4, R6, R8-R10; Approval Impact Decisions | Slice 2              | The revised plan review and 2026-09-12 Human Approval covered the exact four implementation paths: `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `patches/postman-collection@4.5.0.patch`, and the minimal `.vscodeignore` exclusion. Focused replan commit `1b8a2523` and focused completion commit `57c2a8fa` are complete. Current closure verification is separately plan-approved and authorizes no implementation path.                                                                                                                                                                                                                                                                                                                           |
| VSIX development-artifact exclusion                                                   | Requirement R10; Compatibility/Packaging Validation    | Slice 2              | Add only the exact `.vscodeignore` exclusion for the development-only patch (or `patches/` only if repository convention requires it). VSIX archive must omit the patch while bundle/assets and license/package attribution remain valid; if inclusion is required, record the repository-policy basis and equivalent archive checks.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Replanned validation and OpenAPI residual                                             | Requirements R5, R8; Slice 2 Production Readiness      | Slice 2              | Audit, qlty, markdown lint, build, compilation, desktop/web, VSIX, full Postman dynamic-variable compatibility smoke, and contract-valid direct Prism smoke pass. The existing Node fetch test still sends `Accept-Language: *` and receives Prism HTTP 400; that test/fixture residual is a separate WebAPI follow-up. The Playwright installer result is recorded separately from web-test success. `openapi:check` is re-run only as a non-regression observation; its unchanged stale generated fixture is an independent WebAPI follow-up and remains a Feature Exit residual, not Slice 2 scope. Closure requires its done condition or explicit Human Approval with the recorded owner/done condition.                                                                                                                                                          |
| Slice 2 implementation review and Completion Approval                                 | Requirements R4-R10; Approval Boundary                 | Slice 2              | Independent implementation re-review returned `Ready` with no Findings. Completion Approval was recorded on 2026-09-12 for exactly `.vscodeignore`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, and `patches/postman-collection@4.5.0.patch`; focused completion commit `57c2a8fa` is complete. The `Accept-Language: *` test, stale OpenAPI fixture, Playwright installer interruption, and post-publication Dependabot re-query remain separate residual boundaries.                                                                                                                                                                                                                                                                                 |

| Current closure revalidation (2026-09-13) | Requirements R1-R3; Feature Exit | Feature Exit | PR317 is `OPEN` with `mergedAt: null`. The live Dependabot snapshot has 11 open alerts: `180, 181, 182, 183, 184, 186, 187, 188, 191, 192, 193`; alert 193 is `js-yaml`, `GHSA-2883-xcg3-v3hh` / `CVE-2026-84375`, vulnerable before `4.3.2`. Local `pnpm audit --json` reports zero findings. This is pre-publication evidence only; unresolved/new alerts route to the security owner or Replanning, with no dismissal, waiver, or already-resolved claim. |
| Closure residual approval boundary | Requirements R1-R3; Durable Document Impact | Feature Exit | Publication/re-query evidence is expected when available, but an unavailable or unresolved result is a residual that requires explicit Human Approval. The no-Findings automatic-approval policy used for implementation does not apply to residual acceptance or Closure Approval. |
| WebAPI fixture reproducibility ownership | Requirements R5; Production Readiness | Feature Exit | Existing WebAPI maintainer owns focused reproducibility work for `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`; done condition is `pnpm run openapi:check` exit 0 with the fixture matching generator output. No runtime/generator edits are in this replan; preserve `import-definition-via-webapi` and other feature folders. |
| Durable propagation proposal | Durable Document Impact; Feature Exit | Feature Exit | Durable Documentation Gate: Pass for the two unfinished repository-level verification items. A later approved closure package may add exactly two entries under `Verification Follow-ups` in `docs/specs/roadmap.md`: (1) security/tooling maintainers — post-publication Dependabot re-query for the affected/current/new alert set; unresolved or new alerts route to the security owner or Replanning, with no dismissal, waiver, or already-resolved claim; done when the published-graph query records the complete alert result and explicit disposition; and (2) existing WebAPI maintainer — reproducibility of `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`; done when `pnpm run openapi:check` exits 0 and the fixture matches generator output, with no runtime or generator edit. No roadmap edit is made in this replan. |
| Current bounded closure replan Human Approval (2026-09-13 20:21:48 +0900) | Approval Boundary; Feature Exit | Plan gate | Independent `plan-reviewer` returned Ready with no Findings. Explicit user approval `承認します。` approved exactly `docs/specs/features/dependabot-security-updates/SPECS.md`, `docs/specs/features/dependabot-security-updates/TASKS.md`, and `docs/specs/features/dependabot-security-updates/TRACEABILITY.md` for implementation closure of the completed slices, the two owned residual routes, and the exact two future `Verification Follow-ups` entries. No merge, dismissal, waiver, or already-resolved claim is authorized; Closure Approval remains pending. |

## Slice 2 implementation completion and approval evidence (2026-09-12)

The revised Slice 2 implementation is complete, independently reviewed
`Ready` with no Findings, Completion Approved under the no-Findings
automatic-approval policy, and recorded by focused completion commit
`57c2a8fa`. The patch source is the
`postman-collection@4.5.0` v4.5.0 source at peeled commit
`0bc9665661a9f8ca4fdd91128d8312d0608ec637` (annotated tag object
`fbfb40ebf1858b88ad6fb1da8771bf68909cbae6`), from
`https://github.com/postmanlabs/postman-collection`. Its registry integrity is
`sha512-152JSW9pdbaoJihwjc7Q8lc3nPg/PC9lPTHdMk7SHnHhu/GBJB7b2yb9zG7Qua578+3PxkQ/HYBuXpDSvsf7GQ==`.
The source blob hash is `d026487c70597aa6e5f59023da8c5f4293761bf3` and the
patched blob hash is `5422e021d66bf26add0560abc3af090613339b74`.
The resolved Faker `10.5.0` is from `https://github.com/faker-js/faker` with
integrity
`sha512-bsxD8WLS5lIj7aaoCx1YJkktqYj5vlBUE6HWzu2Q51ksrGJ0H737ECCKlFU7Yf8Br45z9t99frBp/J7kzbMPAg==`.
The patch changes only `lib/superstring/dynamic-variables.js`; package
manifest, dependency metadata, install scripts, `LICENSE.md`, and attribution
are unchanged. The postman package remains Apache-2.0, Faker remains MIT, and
the installed graph contains only one Faker copy at `10.5.0`.

The three implementation-review findings are resolved in the patch: legacy
`finance.mask` default/three-argument semantics are preserved; Faker 10
options-object methods use explicit positional adapters retaining reference
dates, currency/precision, and other arguments; and the phone/image adapters
retain the documented 10-digit/no-leading-`1` and 640x480/category contracts.

### Generator inventory (118 rows)

The inventory below is taken from the patched module and was exercised through
the public `Substitutor` path. Generic adapter rows use a small
`fakerGenerator` wrapper that applies the Faker 10 module as `this` and
forwards arguments. Method-specific adapters translate legacy positional
arguments to Faker 10 option objects while retaining the legacy defaults and
contracts. The clock, UUID, and native RNG rows are intentionally
nondeterministic under the original contract; the remaining 111 rows passed
fixed-seed repeatability checks.

|   # | Generator                      | Patched adapter                                                     |
| --: | ------------------------------ | ------------------------------------------------------------------- |
|   1 | `$guid`                        | `uuid.v4()` (native UUID/RNG exception)                             |
|   2 | `$timestamp`                   | `Date.now()` (fixed-clock exception)                                |
|   3 | `$isoTimestamp`                | `new Date()` (fixed-clock exception)                                |
|   4 | `$randomInt`                   | `Math.random()` (native RNG exception)                              |
|   5 | `$randomPhoneNumber`           | legacy `!##-!##-####` formatter (10 digits)                         |
|   6 | `$randomPhoneNumberExt`        | `number.int()` + legacy 10-digit formatter                          |
|   7 | `$randomLocale`                | `helpers.arrayElement()`                                            |
|   8 | `$randomWords`                 | `number.int()` + `word.sample()`                                    |
|   9 | `$randomFilePath`              | directory generator + `system.fileName()`                           |
|  10 | `$randomDirectoryPath`         | `helpers.arrayElement()`                                            |
|  11 | `$randomCity`                  | `location.city`                                                     |
|  12 | `$randomStreetName`            | `location.street`                                                   |
|  13 | `$randomStreetAddress`         | `location.streetAddress`                                            |
|  14 | `$randomCountry`               | `location.country`                                                  |
|  15 | `$randomCountryCode`           | `location.countryCode`                                              |
|  16 | `$randomLatitude`              | positional `max,min,precision` -> `location.latitude`               |
|  17 | `$randomLongitude`             | positional `max,min,precision` -> `location.longitude`              |
|  18 | `$randomColor`                 | `color.human`                                                       |
|  19 | `$randomDepartment`            | `commerce.department`                                               |
|  20 | `$randomProductName`           | `commerce.productName`                                              |
|  21 | `$randomProductAdjective`      | `commerce.productAdjective`                                         |
|  22 | `$randomProductMaterial`       | `commerce.productMaterial`                                          |
|  23 | `$randomProduct`               | `commerce.product`                                                  |
|  24 | `$randomCompanyName`           | `company.name`                                                      |
|  25 | `$randomCompanySuffix`         | seeded `randomCompanySuffix()`                                      |
|  26 | `$randomCatchPhrase`           | `company.catchPhrase`                                               |
|  27 | `$randomBs`                    | `company.buzzPhrase`                                                |
|  28 | `$randomCatchPhraseAdjective`  | `company.catchPhraseAdjective`                                      |
|  29 | `$randomCatchPhraseDescriptor` | `company.catchPhraseDescriptor`                                     |
|  30 | `$randomCatchPhraseNoun`       | `company.catchPhraseNoun`                                           |
|  31 | `$randomBsAdjective`           | `company.buzzAdjective`                                             |
|  32 | `$randomBsBuzz`                | `company.buzzVerb`                                                  |
|  33 | `$randomBsNoun`                | `company.buzzNoun`                                                  |
|  34 | `$randomDatabaseColumn`        | `database.column`                                                   |
|  35 | `$randomDatabaseType`          | `database.type`                                                     |
|  36 | `$randomDatabaseCollation`     | `database.collation`                                                |
|  37 | `$randomDatabaseEngine`        | `database.engine`                                                   |
|  38 | `$randomDatePast`              | positional `years,refDate` -> `date.past` (clock-dependent)         |
|  39 | `$randomDateFuture`            | positional `years,refDate` -> `date.future` (clock-dependent)       |
|  40 | `$randomDateRecent`            | positional `days,refDate` -> `date.recent` (clock-dependent)        |
|  41 | `$randomMonth`                 | `date.month`                                                        |
|  42 | `$randomWeekday`               | `date.weekday`                                                      |
|  43 | `$randomBankAccount`           | `finance.accountNumber`                                             |
|  44 | `$randomBankAccountName`       | `finance.accountName`                                               |
|  45 | `$randomCreditCardMask`        | legacy `length,parens,ellipsis` mask                                |
|  46 | `$randomPrice`                 | positional `min,max,dec,symbol,autoFormat` -> `finance.amount`      |
|  47 | `$randomTransactionType`       | `finance.transactionType`                                           |
|  48 | `$randomCurrencyCode`          | `finance.currencyCode`                                              |
|  49 | `$randomCurrencyName`          | `finance.currencyName`                                              |
|  50 | `$randomCurrencySymbol`        | `finance.currencySymbol`                                            |
|  51 | `$randomBitcoin`               | `finance.bitcoinAddress`                                            |
|  52 | `$randomBankAccountIban`       | positional `formatted,countryCode` -> `finance.iban`                |
|  53 | `$randomBankAccountBic`        | `finance.bic`                                                       |
|  54 | `$randomAbbreviation`          | `hacker.abbreviation`                                               |
|  55 | `$randomAdjective`             | `hacker.adjective`                                                  |
|  56 | `$randomNoun`                  | `hacker.noun`                                                       |
|  57 | `$randomVerb`                  | `hacker.verb`                                                       |
|  58 | `$randomIngverb`               | `hacker.ingverb`                                                    |
|  59 | `$randomPhrase`                | `hacker.phrase`                                                     |
|  60 | `$randomAvatarImage`           | seeded URL adapter                                                  |
|  61 | `$randomImageUrl`              | legacy `width,height,category,randomize,https` URL formatter        |
|  62 | `$randomAbstractImage`         | legacy `width,height,randomize` + `/abstract` path                  |
|  63 | `$randomAnimalsImage`          | legacy `width,height,randomize` + `/animals` path                   |
|  64 | `$randomBusinessImage`         | legacy `width,height,randomize` + `/business` path                  |
|  65 | `$randomCatsImage`             | legacy `width,height,randomize` + `/cats` path                      |
|  66 | `$randomCityImage`             | legacy `width,height,randomize` + `/city` path                      |
|  67 | `$randomFoodImage`             | legacy `width,height,randomize` + `/food` path                      |
|  68 | `$randomNightlifeImage`        | legacy `width,height,randomize` + `/nightlife` path                 |
|  69 | `$randomFashionImage`          | legacy `width,height,randomize` + `/fashion` path                   |
|  70 | `$randomPeopleImage`           | legacy `width,height,randomize` + `/people` path                    |
|  71 | `$randomNatureImage`           | legacy `width,height,randomize` + `/nature` path                    |
|  72 | `$randomSportsImage`           | legacy `width,height,randomize` + `/sports` path                    |
|  73 | `$randomTransportImage`        | legacy `width,height,randomize` + `/transport` path                 |
|  74 | `$randomImageDataUri`          | positional `width,height,color` -> `image.dataUri`                  |
|  75 | `$randomEmail`                 | positional `firstName,lastName,provider` -> `internet.email`        |
|  76 | `$randomExampleEmail`          | positional `firstName,lastName` -> `internet.exampleEmail`          |
|  77 | `$randomUserName`              | positional `firstName,lastName` -> `internet.username`              |
|  78 | `$randomProtocol`              | `internet.protocol`                                                 |
|  79 | `$randomUrl`                   | `internet.url`                                                      |
|  80 | `$randomDomainName`            | `internet.domainName`                                               |
|  81 | `$randomDomainSuffix`          | `internet.domainSuffix`                                             |
|  82 | `$randomDomainWord`            | `internet.domainWord`                                               |
|  83 | `$randomIP`                    | `internet.ipv4` (IPv4 contract)                                     |
|  84 | `$randomIPV6`                  | `internet.ipv6`                                                     |
|  85 | `$randomUserAgent`             | `internet.userAgent`                                                |
|  86 | `$randomHexColor`              | legacy RGB bases -> `color.rgb`-equivalent hex primitive            |
|  87 | `$randomMACAddress`            | `internet.mac`                                                      |
|  88 | `$randomPassword`              | positional `length,memorable,pattern,prefix` -> `internet.password` |
|  89 | `$randomLoremWord`             | `lorem.word`                                                        |
|  90 | `$randomLoremWords`            | `lorem.words`                                                       |
|  91 | `$randomLoremSentence`         | `lorem.sentence`                                                    |
|  92 | `$randomLoremSlug`             | `lorem.slug`                                                        |
|  93 | `$randomLoremSentences`        | `lorem.sentences`                                                   |
|  94 | `$randomLoremParagraph`        | `lorem.paragraph`                                                   |
|  95 | `$randomLoremParagraphs`       | `lorem.paragraphs`                                                  |
|  96 | `$randomLoremText`             | `lorem.text`                                                        |
|  97 | `$randomLoremLines`            | `lorem.lines`                                                       |
|  98 | `$randomFirstName`             | `person.firstName`                                                  |
|  99 | `$randomLastName`              | `person.lastName`                                                   |
| 100 | `$randomFullName`              | positional `firstName,lastName,gender` -> `person.fullName`         |
| 101 | `$randomJobTitle`              | `person.jobTitle`                                                   |
| 102 | `$randomNamePrefix`            | `person.prefix`                                                     |
| 103 | `$randomNameSuffix`            | `person.suffix`                                                     |
| 104 | `$randomJobDescriptor`         | `person.jobDescriptor`                                              |
| 105 | `$randomJobArea`               | `person.jobArea`                                                    |
| 106 | `$randomJobType`               | `person.jobType`                                                    |
| 107 | `$randomUUID`                  | `string.uuid`                                                       |
| 108 | `$randomBoolean`               | `datatype.boolean`                                                  |
| 109 | `$randomWord`                  | `word.sample`                                                       |
| 110 | `$randomAlphaNumeric`          | `string.alphanumeric`                                               |
| 111 | `$randomFileName`              | `system.fileName`                                                   |
| 112 | `$randomCommonFileName`        | `system.commonFileName`                                             |
| 113 | `$randomMimeType`              | `system.mimeType`                                                   |
| 114 | `$randomCommonFileType`        | `system.commonFileType`                                             |
| 115 | `$randomCommonFileExt`         | `system.commonFileExt`                                              |
| 116 | `$randomFileType`              | `system.fileType`                                                   |
| 117 | `$randomFileExt`               | `system.fileExt`                                                    |
| 118 | `$randomSemver`                | `system.semver`                                                     |

### Original Faker-reference inventory (111 unique rows)

The following unique references are the complete pre-patch inventory; repeated
uses account for 120 total references. `faker.internet.ip` is retained in the
inventory but is adapted to `internet.ipv4` in row 83 to preserve the declared
IPv4 output contract; it is not one of the 47 removed Faker 10 APIs.

|   # | Original reference                    |
| --: | ------------------------------------- |
|   1 | `faker.address.city`                  |
|   2 | `faker.address.country`               |
|   3 | `faker.address.countryCode`           |
|   4 | `faker.address.latitude`              |
|   5 | `faker.address.longitude`             |
|   6 | `faker.address.streetAddress`         |
|   7 | `faker.address.streetName`            |
|   8 | `faker.commerce.color`                |
|   9 | `faker.commerce.department`           |
|  10 | `faker.commerce.product`              |
|  11 | `faker.commerce.productAdjective`     |
|  12 | `faker.commerce.productMaterial`      |
|  13 | `faker.commerce.productName`          |
|  14 | `faker.company.bs`                    |
|  15 | `faker.company.bsAdjective`           |
|  16 | `faker.company.bsBuzz`                |
|  17 | `faker.company.bsNoun`                |
|  18 | `faker.company.catchPhrase`           |
|  19 | `faker.company.catchPhraseAdjective`  |
|  20 | `faker.company.catchPhraseDescriptor` |
|  21 | `faker.company.catchPhraseNoun`       |
|  22 | `faker.company.companyName`           |
|  23 | `faker.company.companySuffix`         |
|  24 | `faker.database.collation`            |
|  25 | `faker.database.column`               |
|  26 | `faker.database.engine`               |
|  27 | `faker.database.type`                 |
|  28 | `faker.datatype.boolean`              |
|  29 | `faker.datatype.number`               |
|  30 | `faker.datatype.uuid`                 |
|  31 | `faker.date.future`                   |
|  32 | `faker.date.month`                    |
|  33 | `faker.date.past`                     |
|  34 | `faker.date.recent`                   |
|  35 | `faker.date.weekday`                  |
|  36 | `faker.finance.account`               |
|  37 | `faker.finance.accountName`           |
|  38 | `faker.finance.amount`                |
|  39 | `faker.finance.bic`                   |
|  40 | `faker.finance.bitcoinAddress`        |
|  41 | `faker.finance.currencyCode`          |
|  42 | `faker.finance.currencyName`          |
|  43 | `faker.finance.currencySymbol`        |
|  44 | `faker.finance.iban`                  |
|  45 | `faker.finance.mask`                  |
|  46 | `faker.finance.transactionType`       |
|  47 | `faker.hacker.abbreviation`           |
|  48 | `faker.hacker.adjective`              |
|  49 | `faker.hacker.ingverb`                |
|  50 | `faker.hacker.noun`                   |
|  51 | `faker.hacker.phrase`                 |
|  52 | `faker.hacker.verb`                   |
|  53 | `faker.image.abstract`                |
|  54 | `faker.image.animals`                 |
|  55 | `faker.image.business`                |
|  56 | `faker.image.cats`                    |
|  57 | `faker.image.city`                    |
|  58 | `faker.image.dataUri`                 |
|  59 | `faker.image.fashion`                 |
|  60 | `faker.image.food`                    |
|  61 | `faker.image.imageUrl`                |
|  62 | `faker.image.nature`                  |
|  63 | `faker.image.nightlife`               |
|  64 | `faker.image.people`                  |
|  65 | `faker.image.sports`                  |
|  66 | `faker.image.transport`               |
|  67 | `faker.internet.color`                |
|  68 | `faker.internet.domainName`           |
|  69 | `faker.internet.domainSuffix`         |
|  70 | `faker.internet.domainWord`           |
|  71 | `faker.internet.email`                |
|  72 | `faker.internet.exampleEmail`         |
|  73 | `faker.internet.ip`                   |
|  74 | `faker.internet.ipv6`                 |
|  75 | `faker.internet.mac`                  |
|  76 | `faker.internet.password`             |
|  77 | `faker.internet.protocol`             |
|  78 | `faker.internet.url`                  |
|  79 | `faker.internet.userAgent`            |
|  80 | `faker.internet.userName`             |
|  81 | `faker.lorem.lines`                   |
|  82 | `faker.lorem.paragraph`               |
|  83 | `faker.lorem.paragraphs`              |
|  84 | `faker.lorem.sentence`                |
|  85 | `faker.lorem.sentences`               |
|  86 | `faker.lorem.slug`                    |
|  87 | `faker.lorem.text`                    |
|  88 | `faker.lorem.word`                    |
|  89 | `faker.lorem.words`                   |
|  90 | `faker.name.findName`                 |
|  91 | `faker.name.firstName`                |
|  92 | `faker.name.jobArea`                  |
|  93 | `faker.name.jobDescriptor`            |
|  94 | `faker.name.jobTitle`                 |
|  95 | `faker.name.jobType`                  |
|  96 | `faker.name.lastName`                 |
|  97 | `faker.name.prefix`                   |
|  98 | `faker.name.suffix`                   |
|  99 | `faker.phone.phoneNumber`             |
| 100 | `faker.phone.phoneNumberFormat`       |
| 101 | `faker.random.alphaNumeric`           |
| 102 | `faker.random.arrayElement`           |
| 103 | `faker.random.word`                   |
| 104 | `faker.system.commonFileExt`          |
| 105 | `faker.system.commonFileName`         |
| 106 | `faker.system.commonFileType`         |
| 107 | `faker.system.fileExt`                |
| 108 | `faker.system.fileName`               |
| 109 | `faker.system.fileType`               |
| 110 | `faker.system.mimeType`               |
| 111 | `faker.system.semver`                 |

### Incompatible legacy API mapping (47 rows)

These are the 47 references removed or renamed by Faker 10. The adapters are
explicit in the patch. Generic wrappers preserve module `this` binding and
positional arguments; method-specific adapters translate legacy positional
signatures to Faker 10 option objects or primitives while preserving their
defaults and output contracts. The separate IPv4 correction is described
above.

|   # | Legacy reference                | Faker 10 adapter                                                                                  |
| --: | ------------------------------- | ------------------------------------------------------------------------------------------------- |
|   1 | `faker.address.city`            | `faker.location.city`                                                                             |
|   2 | `faker.address.country`         | `faker.location.country`                                                                          |
|   3 | `faker.address.countryCode`     | `faker.location.countryCode`                                                                      |
|   4 | `faker.address.latitude`        | positional `max,min,precision` -> `legacyLatitude()` -> `faker.location.latitude`                 |
|   5 | `faker.address.longitude`       | positional `max,min,precision` -> `legacyLongitude()` -> `faker.location.longitude`               |
|   6 | `faker.address.streetAddress`   | `faker.location.streetAddress`                                                                    |
|   7 | `faker.address.streetName`      | `faker.location.street`                                                                           |
|   8 | `faker.commerce.color`          | `faker.color.human`                                                                               |
|   9 | `faker.company.bs`              | `faker.company.buzzPhrase`                                                                        |
|  10 | `faker.company.bsAdjective`     | `faker.company.buzzAdjective`                                                                     |
|  11 | `faker.company.bsBuzz`          | `faker.company.buzzVerb`                                                                          |
|  12 | `faker.company.bsNoun`          | `faker.company.buzzNoun`                                                                          |
|  13 | `faker.company.companyName`     | `faker.company.name`                                                                              |
|  14 | `faker.company.companySuffix`   | `randomCompanySuffix()`                                                                           |
|  15 | `faker.datatype.number`         | `faker.number.int`                                                                                |
|  16 | `faker.datatype.uuid`           | `faker.string.uuid`                                                                               |
|  17 | `faker.finance.account`         | `faker.finance.accountNumber`                                                                     |
|  18 | `faker.finance.mask`            | `maskedCreditCard()` preserves default length 4 and positional `length,parens,ellipsis` semantics |
|  19 | `faker.image.abstract`          | `legacyCategoryImage('abstract')` preserves 640x480 default and category path                     |
|  20 | `faker.image.animals`           | `legacyCategoryImage('animals')` preserves 640x480 default and category path                      |
|  21 | `faker.image.business`          | `legacyCategoryImage('business')` preserves 640x480 default and category path                     |
|  22 | `faker.image.cats`              | `legacyCategoryImage('cats')` preserves 640x480 default and category path                         |
|  23 | `faker.image.city`              | `legacyCategoryImage('city')` preserves 640x480 default and category path                         |
|  24 | `faker.image.fashion`           | `legacyCategoryImage('fashion')` preserves 640x480 default and category path                      |
|  25 | `faker.image.food`              | `legacyCategoryImage('food')` preserves 640x480 default and category path                         |
|  26 | `faker.image.imageUrl`          | `legacyImageUrlGenerator()` preserves positional width/height/category/randomize/https            |
|  27 | `faker.image.nature`            | `legacyCategoryImage('nature')` preserves 640x480 default and category path                       |
|  28 | `faker.image.nightlife`         | `legacyCategoryImage('nightlife')` preserves 640x480 default and category path                    |
|  29 | `faker.image.people`            | `legacyCategoryImage('people')` preserves 640x480 default and category path                       |
|  30 | `faker.image.sports`            | `legacyCategoryImage('sports')` preserves 640x480 default and category path                       |
|  31 | `faker.image.transport`         | `legacyCategoryImage('transport')` preserves 640x480 default and category path                    |
|  32 | `faker.internet.color`          | `legacyHexColor()` preserves positional RGB bases                                                 |
|  33 | `faker.internet.userName`       | `faker.internet.username`                                                                         |
|  34 | `faker.name.findName`           | `faker.person.fullName`                                                                           |
|  35 | `faker.name.firstName`          | `faker.person.firstName`                                                                          |
|  36 | `faker.name.jobArea`            | `faker.person.jobArea`                                                                            |
|  37 | `faker.name.jobDescriptor`      | `faker.person.jobDescriptor`                                                                      |
|  38 | `faker.name.jobTitle`           | `faker.person.jobTitle`                                                                           |
|  39 | `faker.name.jobType`            | `faker.person.jobType`                                                                            |
|  40 | `faker.name.lastName`           | `faker.person.lastName`                                                                           |
|  41 | `faker.name.prefix`             | `faker.person.prefix`                                                                             |
|  42 | `faker.name.suffix`             | `faker.person.suffix`                                                                             |
|  43 | `faker.phone.phoneNumber`       | legacy fixed 10-digit formatter with no `1` prefix                                                |
|  44 | `faker.phone.phoneNumberFormat` | legacy format index 0 (`!##-!##-####`) with no `1` prefix                                         |
|  45 | `faker.random.alphaNumeric`     | `faker.string.alphanumeric`                                                                       |
|  46 | `faker.random.arrayElement`     | `faker.helpers.arrayElement`                                                                      |
|  47 | `faker.random.word`             | `faker.word.sample`                                                                               |

### Slice 2 validation and residuals

- `pnpm install --frozen-lockfile` succeeded under Node `20.20.2` and pnpm
  `10.33.0`. The patch hash is
  `95ec02c7ccf2e749ea08812787f5cfec9b0a4ec06296b07836a8b21385f6bd9b`.
  All floors are met: Faker `10.5.0`, `@humanfs/node` `0.16.8`, Browserslist
  `4.28.7` with baseline mapping `2.11.22` (floor `2.11.0`), fast-uri
  `3.1.6`, js-yaml `4.3.2`, morgan `1.12.0`, nanoid `3.3.18`,
  postcss-selector-parser `7.1.3`, and qs `6.16.0`.
- `pnpm audit --json` and `pnpm audit --audit-level moderate` report zero
  findings. The implementation-time GitHub tuple remains the 10 open alerts
  180, 181, 182, 183, 184, 186, 187, 188, 191, and 192; local audit success
  does not claim remote closure.
- The public Substitutor check exercised all 118 generators and alternate
  `this` calls with no exception, undefined result, or unresolved token. The
  full argument matrix covers positional coordinate/date, finance,
  email/username/password/name, mask, image, phone, and color adapters;
  explicit checks cover `amount(5, 10, 0, '$')`, reference dates, default and
  three-argument masks, 10-digit phones without a leading `1`, and 640x480
  category image paths. URL, data URI, UUID, IPv4, IPv6, email, date, path,
  primitive, masked-card, and phone contracts passed. Fixed-seed checks
  passed for 111 non-clock/non-UUID generators. The patched source has no
  direct references to the legacy API set.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, production build, Node 20 test
  compilation, desktop tests, and the escalated Node 20 web test succeeded.
  Prism starts and serves `sample_ref_minimal_utf8` with HTTP 200 when the
  contract-valid `Accept-Language: en` header is provided. The existing Node
  `fetch` test sends `Accept-Language: *`, which Prism rejects with 400; that
  existing test is not claimed as passed. Its test and generated fixture are
  outside this slice, so this remains a separate WebAPI follow-up rather than
  being changed here.
- VSIX packaging via `vsce package --no-dependencies` succeeded; archive
  inspection confirmed the exact patch path is absent while bundles, assets,
  package metadata, and license attribution remain. The exact Playwright
  installer command was attempted with cached assets under Node 20, hung with
  no output, and was interrupted with exit 130. `openapi:check` still reports
  only the known stale generated fixture. Both are separate residuals.

## Replanning advisory mapping (2026-09-12)

The GitHub API re-query returned 10 open development alerts. The local
`pnpm audit --json` re-query returned 15 advisory IDs and 16 findings: 10
high, 5 moderate, and 1 low. The table preserves every advisory ID, resolved
path, vulnerable range, current version, patched floor, and planned response. An em dash in the
GitHub column means the package-audit finding is not currently represented by
one of the 10 open GitHub alerts. GitHub labels its moderate-equivalent alerts
as `medium`; the npm audit output labels those findings `moderate`.

| GitHub alert | Audit advisory                                                           | Package and resolved path(s)                                                                                                                                                              | Severity (GitHub/audit) | Vulnerable range    | Current version(s) | Patched floor | Slice 2 response                                                                                                                                                                                         |
| -----------: | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------- | ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          181 | [GHSA-qxc2-j82w-r537](https://github.com/advisories/GHSA-qxc2-j82w-r537) | `@faker-js/faker`; `.>@stoplight/prism-cli>@stoplight/prism-http>@faker-js/faker`, `.>@stoplight/prism-cli>@stoplight/prism-http>@stoplight/http-spec>postman-collection>@faker-js/faker` | high                    | `<=10.4.0`          | `10.4.0`, `5.5.3`  | `10.5.0`      | Retain scoped 10.5.0 resolution on both paths; apply the exact `postman-collection@4.5.0` compatibility patch/facade for every legacy dynamic-variable reference, then validate Postman and Prism smoke. |
|          182 | [GHSA-p498-v437-472g](https://github.com/advisories/GHSA-p498-v437-472g) | `@humanfs/node`; `.>eslint>@humanfs/node`                                                                                                                                                 | medium / moderate       | `<0.16.8`           | `0.16.6`           | `0.16.8`      | Targeted lockfile resolution; parent `eslint` range admits the floor.                                                                                                                                    |
|          192 | [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) | `baseline-browser-mapping`; `.>webpack>browserslist>baseline-browser-mapping`                                                                                                             | medium / moderate       | `>=2.0.0 <2.11.0`   | `2.10.20`          | `2.11.0`      | Targeted lockfile consequence of the Browserslist update.                                                                                                                                                |
|          188 | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) | `browserslist`; `.>webpack>browserslist`                                                                                                                                                  | high                    | `<=4.28.6`          | `4.28.2`           | `4.28.7`      | Targeted lockfile resolution; parent `webpack` range admits the floor.                                                                                                                                   |
|          188 | [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) | `browserslist`; `.>webpack>browserslist`                                                                                                                                                  | high                    | `<=4.28.6`          | `4.28.2`           | `4.28.7`      | Same Browserslist resolution covers both advisories.                                                                                                                                                     |
|          183 | [GHSA-5jgf-p345-68v8](https://github.com/advisories/GHSA-5jgf-p345-68v8) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                                                                                                   | high                    | `>=3.1.3 <3.1.6`    | `3.1.5`            | `3.1.6`       | Update the existing keyed fast-uri override; validate Prism URL tooling.                                                                                                                                 |
|          186 | [GHSA-f65p-4m7j-42xc](https://github.com/advisories/GHSA-f65p-4m7j-42xc) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                                                                                                   | high                    | `>=3.0.0 <3.1.6`    | `3.1.5`            | `3.1.6`       | Same existing override update covers this advisory.                                                                                                                                                      |
|          184 | [GHSA-fph4-wmhf-6fwf](https://github.com/advisories/GHSA-fph4-wmhf-6fwf) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                                                                                                   | high                    | `>=3.1.2 <3.1.6`    | `3.1.5`            | `3.1.6`       | Same existing override update covers this advisory.                                                                                                                                                      |
|          187 | [GHSA-jqff-g426-hqxp](https://github.com/advisories/GHSA-jqff-g426-hqxp) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                                                                                                   | high                    | `>=3.0.0 <3.1.6`    | `3.1.5`            | `3.1.6`       | Same existing override update covers this advisory.                                                                                                                                                      |
|          193 | [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | `js-yaml`; `.>@stoplight/prism-cli>@stoplight/prism-http>json-schema-faker>json-schema-ref-parser>js-yaml`                                                                                | high                    | `>=4.0.0 <4.3.2`    | `4.3.1`            | `4.3.2`       | Existing global js-yaml override is implemented at 4.3.2; alert 193 remains open in the pre-publication snapshot and must be re-queried after publication.                                               |
|          191 | [GHSA-jxfw-x594-9x9m](https://github.com/advisories/GHSA-jxfw-x594-9x9m) | `morgan`; `.>@vscode/test-web>koa-morgan>morgan`                                                                                                                                          | medium / moderate       | `<1.12.0`           | `1.11.0`           | `1.12.0`      | Targeted lockfile resolution; parent `koa-morgan` range admits the floor.                                                                                                                                |
|            — | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | `nanoid`; `.>css-loader>postcss>nanoid`                                                                                                                                                   | high                    | `<3.3.18`           | `3.3.17`           | `3.3.18`      | Targeted lockfile resolution; PostCSS range admits the floor.                                                                                                                                            |
|          180 | [GHSA-w9m9-85wc-3x92](https://github.com/advisories/GHSA-w9m9-85wc-3x92) | `postcss-selector-parser`; `.>css-loader>postcss-modules-local-by-default>postcss-selector-parser`                                                                                        | low                     | `>=7.1.0 <7.1.3`    | `7.1.0`            | `7.1.3`       | Incidental same-family lockfile resolution to clear current alert 180; no low-only family expansion.                                                                                                     |
|            — | [GHSA-x5fp-wj9c-mxmx](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx) | `qs`; `.>@stoplight/prism-cli>@stoplight/json-schema-ref-parser>url>qs`                                                                                                                   | moderate                | `>=6.14.2 <=6.15.3` | `6.15.2`           | `6.16.0`      | Update the existing global qs override; validate Prism URL tooling.                                                                                                                                      |
|            — | [GHSA-4mjr-xmp4-gh2g](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g) | `qs`; `.>@stoplight/prism-cli>@stoplight/json-schema-ref-parser>url>qs`                                                                                                                   | moderate                | `>=2.2.5 <6.16.0`   | `6.15.2`           | `6.16.0`      | Same existing override update covers this advisory.                                                                                                                                                      |

## Slice 2 implementation blocker (resolved 2026-09-12)

- The security-correct Faker 10.5.0 resolution initially exposed a legacy
  `postman-collection@4.5.0` dynamic-variable API failure at Prism startup.
  The exact compatibility patch resolved the blocker; the implementation is
  recorded in `57c2a8fa` with local audit high/moderate/low = 0 and passing
  Postman/Prism evidence.
- Root cause is the exact Postman package dependency and source contract:
  `postman-collection@4.5.0` declares `@faker-js/faker: 5.5.3`, imports the
  pre-v10 locale shape, and directly references legacy Faker APIs. The scoped
  security override correctly resolves both Faker paths to `10.5.0`, but
  exposes that incompatible API boundary. The complete fix must retain
  10.5.0 and adapt the legacy consumer, including every method used by its
  public `$random*` generator path, not merely the first `address.city`
  failure. The inventory is 118 generators, 111 Faker references, and 47
  Faker 10-incompatible legacy APIs spanning address/location, name/person,
  random/helpers, datatype/number/string, image, finance, and related modules.
- The compatibility facade must preserve `this` binding and arguments, public
  Substitutor behavior, and each generator's URL, UUID, IP, email, date, path,
  primitive, and other output contract. It must preserve seeded determinism;
  time/random-dependent exceptions require a fixed clock/RNG or an explicitly
  recorded contract. A post-patch source scan must prove zero legacy direct
  references in `dynamic-variables.js`.
- Provenance baseline for the planned patch: `postman-collection@4.5.0` is
  from `https://github.com/postmanlabs/postman-collection`, with annotated
  tag object `fbfb40ebf1858b88ad6fb1da8771bf68909cbae6` at
  `refs/tags/v4.5.0`, and peeled source commit
  `0bc9665661a9f8ca4fdd91128d8312d0608ec637` at `refs/tags/v4.5.0^{}`. The
  patch source must use the peeled commit while retaining the annotated-tag
  object as provenance; registry integrity is
  `sha512-152JSW9pdbaoJihwjc7Q8lc3nPg/PC9lPTHdMk7SHnHhu/GBJB7b2yb9zG7Qua578+3PxkQ/HYBuXpDSvsf7GQ==`.
  The resolved `@faker-js/faker@10.5.0` is from
  `https://github.com/faker-js/faker`, with registry integrity
  `sha512-bsxD8WLS5lIj7aaoCx1YJkktqYj5vlBUE6HWzu2Q51ksrGJ0H737ECCKlFU7Yf8Br45z9t99frBp/J7kzbMPAg==`.
  The installed metadata identifies `postman-collection` as Apache-2.0 with
  `LICENSE.md` and Faker as MIT with `LICENSE`; implementation must retain
  both metadata/licenses and record any patch source hash used.

| Candidate                                       | Evidence and decision                                                                                                                                                                                             |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retain Faker 5.5.3 or suppress audit            | Rejected: it leaves GHSA-qxc2-j82w-r537 vulnerable and violates the security purpose.                                                                                                                             |
| Upgrade `postman-collection` to 5.3.1           | Rejected: the latest published line still declares exact Faker 5.5.3, so it does not clear the vulnerable copy or remove the legacy API contract.                                                                 |
| Upgrade Prism/http-spec chain                   | Rejected: `@stoplight/http-spec@7.1.0` still selects the Postman 4.x line; Prism 5.16 retains that chain and raises its Node floor to `>=24.18.0`, outside the repository Node contract.                          |
| Skip or weaken Prism smoke                      | Rejected: audit cleanliness without startup/contract evidence is not production-ready validation.                                                                                                                 |
| Exact pnpm patch for `postman-collection@4.5.0` | Selected: register one `patchedDependencies` entry and patch only the legacy dynamic-variable import/API facade to Faker 10.5.0. This retains the safe graph, direct parents, runtime, and VS Code/web contracts. |

- Revised implementation paths, approved after independent `Ready`/no-Findings
  plan review and Human Approval on 2026-09-12, are exactly
  `pnpm-workspace.yaml` (existing overrides plus the
  exact `patchedDependencies` registration), `pnpm-lock.yaml` (patch hash and
  unavoidable consequences), `patches/postman-collection@4.5.0.patch`, and
  the minimal `.vscodeignore` exclusion for that patch path. `package.json`,
  direct/production dependencies, runtime/tests, generated artifacts, other
  configuration, and compatibility floors remain out of scope.
- The approved planning package paths were exactly
  `docs/specs/features/dependabot-security-updates/SPECS.md`,
  `docs/specs/features/dependabot-security-updates/TASKS.md`, and
  `docs/specs/features/dependabot-security-updates/TRACEABILITY.md`. The
  focused replan commit is `1b8a2523`; implementation completion is recorded
  by `57c2a8fa`.
- The patch validation must load the patched Postman package and exercise all
  118 public dynamic generators (115 `$random*` entries plus the three
  `$guid`/timestamp entries) through the public Substitutor path, asserting
  the expected primitive/URL output type, `this`/argument compatibility, seed
  determinism, and no `TypeError` or undefined value. The Prism CLI must then
  load and the existing Prism smoke must start and serve its fixtures. A
  patch-apply failure or contract mismatch is a blocker; audit suppression and
  test avoidance are prohibited.
- Provenance validation must re-confirm the upstream package URL/version,
  registry integrity, repository tag/source hash, and exact patch target. The
  patch must be limited to required `dynamic-variables.js` portions; manifest,
  install scripts, LICENSE, dependencies, attribution, postman Apache-2.0,
  and Faker MIT metadata/license must remain unchanged, with no embedded Faker
  copy. A package diff must show no other source or metadata changes.
- The development-only patch must be excluded from the VSIX by the minimal
  exact `.vscodeignore` rule. Archive validation must prove patch non-inclusion
  while bundles/assets and license/package attribution remain valid. If
  repository policy requires inclusion, record that basis and equivalent
  archive checks as an explicit Main decision.
- `pnpm exec playwright install --with-deps chromium-headless-shell` exit 130
  / hang is an environment residual and must be recorded separately from
  web-test success. The stale generated OpenAPI fixture is an independent
  WebAPI follow-up and remains outside this security slice. GitHub alert
  closure evidence requires publication followed by a Dependabot re-query when
  available; local audit and smoke evidence cannot claim remote closure. If the
  re-query remains unavailable, any residual handling requires explicit Human
  Approval and an owner/done condition.

## Immutable GitHub Dependabot open-alert snapshot (17 rows)

This table is the immutable evidence snapshot re-obtained through the GitHub
API. It records the 17 open alerts exactly as re-queried; each row is retained
independently even when the GHSA and dependency path repeat. The repository
URLs are stable alert references. Remote closure is not claimed until the
completed implementation reaches GitHub and Feature Exit rechecks the API.

| Number | Package/path                                           | GHSA                                                                     | Severity | Vulnerable range         | First patched | Selected floor/response  | Stable URL                                                                              |
| -----: | ------------------------------------------------------ | ------------------------------------------------------------------------ | -------- | ------------------------ | ------------- | ------------------------ | --------------------------------------------------------------------------------------- |
|    176 | `js-yaml` / `Prism path`                               | [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | high     | `>=4.0.0,<4.3.1`         | `4.3.1`       | `floor js-yaml@4.3.1`    | [Dependabot 176](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/176) |
|    175 | `postcss` / `css-loader>postcss`                       | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | medium   | `<=8.5.22`               | `8.5.23`      | `postcss@8.5.23`         | [Dependabot 175](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/175) |
|    173 | `fast-uri` / `Prism>ajv>fast-uri`                      | [GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7) | high     | `>=3.0.0,<3.1.5`         | `3.1.5`       | `fast-uri@3.1.5`         | [Dependabot 173](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/173) |
|    172 | `undici` / `VSCE>cheerio>undici`                       | [GHSA-m8rv-5g2x-5cg5](https://github.com/advisories/GHSA-m8rv-5g2x-5cg5) | medium   | `>=7.0.0,<7.29.0`        | `7.29.0`      | `undici@7.29.0`          | [Dependabot 172](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/172) |
|    171 | `undici` / `VSCE>cheerio>undici`                       | [GHSA-jr45-8vmc-qm54](https://github.com/advisories/GHSA-jr45-8vmc-qm54) | medium   | `same (>=7.0.0,<7.29.0)` | `7.29.0`      | `undici@7.29.0`          | [Dependabot 171](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/171) |
|    170 | `undici` / `VSCE>cheerio>undici`                       | [GHSA-v3r7-h72x-cjcm](https://github.com/advisories/GHSA-v3r7-h72x-cjcm) | medium   | `same (>=7.0.0,<7.29.0)` | `7.29.0`      | `undici@7.29.0`          | [Dependabot 170](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/170) |
|    169 | `undici` / `VSCE>cheerio>undici`                       | [GHSA-4cwx-7wf7-3272](https://github.com/advisories/GHSA-4cwx-7wf7-3272) | high     | `same (>=7.0.0,<7.29.0)` | `7.29.0`      | `undici@7.29.0`          | [Dependabot 169](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/169) |
|    168 | `undici` / `VSCE>cheerio>undici`                       | [GHSA-8xcm-r25x-g524](https://github.com/advisories/GHSA-8xcm-r25x-g524) | medium   | `same (>=7.0.0,<7.29.0)` | `7.29.0`      | `undici@7.29.0`          | [Dependabot 168](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/168) |
|    164 | `postcss` / `css-loader>postcss`                       | [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | high     | `<=8.5.17`               | `8.5.18`      | `postcss@8.5.23`         | [Dependabot 164](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/164) |
|    163 | `brace-expansion` / `ESLint>minimatch>brace-expansion` | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | high     | `<1.1.16`                | `1.1.16`      | `brace-expansion@1.1.18` | [Dependabot 163](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/163) |
|    162 | `js-yaml` / `Prism>json-schema-ref-parser>js-yaml`     | [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | high     | `>=4.0.0,<4.3.0`         | `4.3.0`       | `js-yaml@4.3.1`          | [Dependabot 162](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/162) |
|    161 | `shell-quote` / `npm-run-all>shell-quote`              | [GHSA-395f-4hp3-45gv](https://github.com/advisories/GHSA-395f-4hp3-45gv) | high     | `<=1.8.4`                | `1.9.0`       | `shell-quote@1.9.0`      | [Dependabot 161](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/161) |
|    160 | `fast-uri` / `Prism>ajv>fast-uri`                      | [GHSA-v2hh-gcrm-f6hx](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx) | high     | `>=3.0.0,<=3.1.3`        | `3.1.4`       | `fast-uri@3.1.5`         | [Dependabot 160](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/160) |
|    159 | `fast-uri` / `Prism>ajv>fast-uri`                      | [GHSA-4c8g-83qw-93j6](https://github.com/advisories/GHSA-4c8g-83qw-93j6) | high     | `>=3.0.0,<3.1.3`         | `3.1.3`       | `fast-uri@3.1.5`         | [Dependabot 159](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/159) |
|    158 | `linkify-it` / `VSCE>markdown-it>linkify-it`           | [GHSA-v245-v573-v5vm](https://github.com/advisories/GHSA-v245-v573-v5vm) | high     | `<=5.0.1`                | `5.0.2`       | `linkify-it@5.0.2`       | [Dependabot 158](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/158) |
|    157 | `brace-expansion` / `VSCE>minimatch>brace-expansion`   | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | high     | `>=3.0.0,<5.0.7`         | `5.0.7`       | `brace-expansion@5.0.9`  | [Dependabot 157](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/157) |
|    156 | `morgan` / `test-web>koa-morgan>morgan`                | [GHSA-4vj7-5mj6-jm8m](https://github.com/advisories/GHSA-4vj7-5mj6-jm8m) | medium   | `>=1.2.0,<=1.10.1`       | `1.11.0`      | `morgan@1.11.0`          | [Dependabot 156](https://github.com/kittybbit/vscode-ajsbutler/security/dependabot/156) |

## Pre-resolution advisory inventory (23 rows)

This inventory was generated from the baseline `pnpm audit` JSON obtained via
`git archive 59d508e9^`; row count and advisory IDs were reconciled with that
source. Each row preserves its package path, severity, vulnerable range, first
patched version, and selected response floor. The linked public GHSA pages are
stable references for the advisory IDs.

|   # | Advisory                                                                 | Package/path                                                                                               | Severity | Vulnerable range   | First patched | Selected response floor  |
| --: | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | -------- | ------------------ | ------------- | ------------------------ |
|   1 | [GHSA-4vj7-5mj6-jm8m](https://github.com/advisories/GHSA-4vj7-5mj6-jm8m) | `morgan`; `.>@vscode/test-web>koa-morgan>morgan`                                                           | moderate | `>=1.2.0 <=1.10.1` | `>=1.11.0`    | `morgan@1.11.0`          |
|   2 | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | `brace-expansion`; `.>eslint>@eslint/eslintrc>minimatch>brace-expansion`                                   | high     | `<1.1.16`          | `>=1.1.16`    | `brace-expansion@1.1.18` |
|   3 | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | `brace-expansion`; `.>@vscode/vsce>minimatch>brace-expansion`                                              | high     | `>=3.0.0 <5.0.7`   | `>=5.0.7`     | `brace-expansion@5.0.9`  |
|   4 | [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | `js-yaml`; `.>@stoplight/prism-cli>@stoplight/prism-http>json-schema-faker>json-schema-ref-parser>js-yaml` | high     | `>=4.0.0 <4.3.0`   | `>=4.3.0`     | `js-yaml@4.3.1`          |
|   5 | [GHSA-395f-4hp3-45gv](https://github.com/advisories/GHSA-395f-4hp3-45gv) | `shell-quote`; `.>npm-run-all>shell-quote`                                                                 | high     | `<=1.8.4`          | `>=1.9.0`     | `shell-quote@1.9.0`      |
|   6 | [GHSA-v245-v573-v5vm](https://github.com/advisories/GHSA-v245-v573-v5vm) | `linkify-it`; `.>@vscode/vsce>markdown-it>linkify-it`                                                      | high     | `<=5.0.1`          | `>=5.0.2`     | `linkify-it@5.0.2`       |
|   7 | [GHSA-v2hh-gcrm-f6hx](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                    | high     | `>=3.0.0 <=3.1.3`  | `>=3.1.4`     | `fast-uri@3.1.5`         |
|   8 | [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | `postcss`; `.>css-loader>postcss`                                                                          | high     | `<=8.5.17`         | `>=8.5.18`    | `postcss@8.5.23`         |
|   9 | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | `brace-expansion`; `.>eslint>@eslint/eslintrc>minimatch>brace-expansion`                                   | high     | `<1.1.17`          | `>=1.1.17`    | `brace-expansion@1.1.18` |
|  10 | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | `brace-expansion`; `.>@vscode/vsce>minimatch>brace-expansion`                                              | high     | `>=4.0.0 <5.0.8`   | `>=5.0.8`     | `brace-expansion@5.0.9`  |
|  11 | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | `postcss`; `.>css-loader>postcss`                                                                          | moderate | `<=8.5.22`         | `>=8.5.23`    | `postcss@8.5.23`         |
|  12 | [GHSA-8xcm-r25x-g524](https://github.com/advisories/GHSA-8xcm-r25x-g524) | `undici`; `.>@vscode/vsce>cheerio>undici`                                                                  | moderate | `>=7.0.0 <7.29.0`  | `>=7.29.0`    | `undici@7.29.0`          |
|  13 | [GHSA-4cwx-7wf7-3272](https://github.com/advisories/GHSA-4cwx-7wf7-3272) | `undici`; `.>@vscode/vsce>cheerio>undici`                                                                  | high     | `>=7.0.0 <7.29.0`  | `>=7.29.0`    | `undici@7.29.0`          |
|  14 | [GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                    | high     | `>=3.0.0 <3.1.5`   | `>=3.1.5`     | `fast-uri@3.1.5`         |
|  15 | [GHSA-m8rv-5g2x-5cg5](https://github.com/advisories/GHSA-m8rv-5g2x-5cg5) | `undici`; `.>@vscode/vsce>cheerio>undici`                                                                  | moderate | `>=7.0.0 <7.29.0`  | `>=7.29.0`    | `undici@7.29.0`          |
|  16 | [GHSA-jr45-8vmc-qm54](https://github.com/advisories/GHSA-jr45-8vmc-qm54) | `undici`; `.>@vscode/vsce>cheerio>undici`                                                                  | moderate | `>=7.0.0 <7.29.0`  | `>=7.29.0`    | `undici@7.29.0`          |
|  17 | [GHSA-v3r7-h72x-cjcm](https://github.com/advisories/GHSA-v3r7-h72x-cjcm) | `undici`; `.>@vscode/vsce>cheerio>undici`                                                                  | moderate | `>=7.0.0 <7.29.0`  | `>=7.29.0`    | `undici@7.29.0`          |
|  18 | [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | `brace-expansion`; `.>@vscode/vsce>minimatch>brace-expansion`                                              | high     | `>=4.0.0 <5.0.9`   | `>=5.0.9`     | `brace-expansion@5.0.9`  |
|  19 | [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | `brace-expansion`; `.>eslint>@eslint/eslintrc>minimatch>brace-expansion`                                   | high     | `<1.1.18`          | `>=1.1.18`    | `brace-expansion@1.1.18` |
|  20 | [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | `js-yaml`; `.>@stoplight/prism-cli>@stoplight/prism-http>json-schema-faker>json-schema-ref-parser>js-yaml` | high     | `>=4.0.0 <4.3.1`   | `>=4.3.1`     | `js-yaml@4.3.1`          |
|  21 | [GHSA-4c8g-83qw-93j6](https://github.com/advisories/GHSA-4c8g-83qw-93j6) | `fast-uri`; `.>@stoplight/prism-cli>@stoplight/prism-http>ajv>fast-uri`                                    | high     | `>=3.0.0 <3.1.3`   | `>=3.1.3`     | `fast-uri@3.1.5`         |
|  22 | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | `nanoid`; `.>css-loader>postcss>nanoid`                                                                    | high     | `<3.3.16`          | `>=3.3.16`    | `nanoid@3.3.17`          |
|  23 | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | `nanoid`; `.>css-loader>postcss>nanoid`                                                                    | high     | `<3.3.17`          | `>=3.3.17`    | `nanoid@3.3.17`          |

<!-- markdownlint-enable MD013 -->
