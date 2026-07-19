# Traceability: JP1/AJS3 v13 Runtime Diagnostic Conformance

This feature maps the durable diagnosis use case and normative version 13
parameter rules to the revised six-slice plan and validation.

<!-- markdownlint-disable MD013 -->

| Use Case             | Requirement             | SPECS.md section            | Slice        | Validation     |
| -------------------- | ----------------------- | --------------------------- | ------------ | -------------- |
| `UC-DIAG`            | `CONF-ALL`              | Requirements; Acceptance    | S1-S6        | `VAL-ALL`      |
| `RULE-SCHEDULE`      | `CONF-CY`               | Requirements; Scenarios     | S1           | `VAL-CY`       |
| `RULE-FILE-MONITOR`  | `CONF-FLWC`             | Requirements; Scenarios     | S2           | `VAL-FLWC`     |
| `RULE-BYTES`         | `CONF-CONTENT-BYTES`    | Requirements; Scenarios     | S3           | `VAL-BYTES`    |
| `RULE-JOB-END`       | `CONF-QUEUE`            | Requirements; Acceptance    | S4           | `VAL-QUEUE`    |
| `RULE-TRANSFER-FORM` | `CONF-TRANSFER-CONTEXT` | Requirements; Scenarios     | S5           | `VAL-TRANSFER` |
| `RULE-EVENT`         | `CONF-EVWFR`            | Requirements; Scenarios     | S6           | `VAL-EVWFR`    |
| `UC-DIAG`            | `COMPAT-HOST`           | Architecture; Compatibility | S1-S6; final | `VAL-HOST`     |

<!-- markdownlint-enable MD013 -->

## Use Case And Rule IDs

- `UC-DIAG`: `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`.
- `RULE-SCHEDULE`: `JP1-PARAM-SCHEDULE-RANGE-001`.
- `RULE-FILE-MONITOR`: `JP1-PARAM-FILE-MONITOR-CONDITION-001`.
- `RULE-BYTES`: `JP1-PARAM-STRING-FAMILY-CONSTRAINT-001` and
  `JP1-PARAM-TRANSFER-FILE-PATH-001`.
- `RULE-JOB-END`: `JP1-PARAM-RETRY-ABR-DEPENDENCY-001`,
  `JP1-PARAM-JOB-END-RANGE-001`, and
  `JP1-PARAM-JOB-END-THRESHOLD-001`.
- `RULE-TRANSFER-FORM`: `JP1-PARAM-TRANSFER-FILE-FORM-001` and
  `JP1-PARAM-STRING-MACRO-ALLOWANCE-001`.
- `RULE-EVENT`: `JP1-PARAM-EVENT-RECEIVE-FILTER-001`.

## Requirement IDs

- `CONF-ALL`: all currently promised diagnostic rule IDs follow their normative
  bodies.
- `CONF-CY`: `cy=(n,y)` accepts only `1..9` and reports that range.
- `CONF-FLWC`: `flwc` accepts only `c[:d[:{s|m}]]` forms.
- `CONF-CONTENT-BYTES`: governed quoted lengths exclude serialization quotes.
- `CONF-QUEUE`: job-end and retry diagnostics include `qj` and `rq`.
- `CONF-TRANSFER-CONTEXT`: transfer validity uses unit class and effective
  `jty`, including custom PC prohibition.
- `CONF-EVWFR`: canonical repeated `evwfr=<raw-value>;` forms total at most
  2,048 bytes, including key and delimiters.
- `COMPAT-HOST`: raw evidence, positions, DTO shape, and desktop/web parity stay
  stable.

## Validation IDs

- `VAL-ALL`: supported-rule audit plus focused diagnostic suite.
- `VAL-CY`: yearly boundary and message cases.
- `VAL-FLWC`: every valid form and malformed segment/order cases.
- `VAL-BYTES`: quoted exact/over-limit and UTF-8 multibyte cases for `flwf`,
  `tsN`, and `tdN`.
- `VAL-QUEUE`: `qj` and `rq` end/retry matrix.
- `VAL-TRANSFER`: supported class, recovery, `jty`, prohibited custom PC, and
  parameter-index matrix.
- `VAL-EVWFR`: canonical prefix/value/terminator contributions, repeated exact
  and over-limit boundaries, multibyte, malformed, and first-crossing location.
- `VAL-HOST`: desktop tests for each slice; final web tests and production build.

## Slice IDs

- S1: Conform yearly schedule cycle diagnostics.
- S2: Conform file-monitoring condition forms.
- S3: Measure governed quoted-string content bytes.
- S4: Include QUEUE jobs in end-judgment and retry diagnostics.
- S5: Conform transfer-file job context.
- S6: Enforce canonical repeated `evwfr` aggregate bytes.

The official source basis is the JP1/AJS3 version 13 Command Reference sections
linked from the normative parameter-rule document. No undocumented or inferred
JP1/AJS behavior is part of this revised plan.

## Implementation Evidence

- S1 / `VAL-CY` (2026-07-20): `rtk pnpm test` passed with yearly cycle 9
  accepted, cycle 10 diagnosed, and the message constrained to `y=1..9`;
  `rtk pnpm run qlty` passed with no issues.
- S2 / `VAL-FLWC` (2026-07-20): `rtk pnpm test` passed with all four supported
  `flwc` forms accepted and missing, reordered, empty, extra, and conflicting
  segments diagnosed; `rtk pnpm run qlty` passed with no issues.
- S3 / `VAL-BYTES` (2026-07-20): `rtk pnpm test` passed with quoted `flwf`,
  `tsN`, and `tdN` content accepted at exact limits, ASCII and UTF-8 multibyte
  overages diagnosed, and outer quotes excluded; `rtk pnpm run qlty` passed
  with no issues.
- S4 / `VAL-QUEUE` (2026-07-20): `rtk pnpm test` passed with `qj` and `rq`
  receiving numeric range, `jd`/`abr`, retry dependency, and threshold-ordering
  diagnostics; `rtk pnpm run qlty` passed with no issues.
- S5 / `VAL-TRANSFER` (2026-07-20): `rtk pnpm test` passed across normal and
  recovery UNIX/PC, custom UNIX, QUEUE, and custom PC contexts; effective
  `jty=q` defaults, explicit `jty=n`, all four transfer indexes, custom PC
  prohibition, and QUEUE dependency differences are covered; qlty passed.
- S6 / `VAL-EVWFR` (2026-07-20): `rtk pnpm test` passed with canonical exact
  2,048-byte and 2,049-byte boundaries, UTF-8 multibyte contributions,
  malformed shape separation, and first-crossing source location covered.
- S1-S6 / `VAL-ALL` and `VAL-HOST` (2026-07-20): desktop tests and
  `rtk pnpm run qlty` passed for every slice; final `rtk pnpm run test:web` and
  `rtk pnpm run build` passed. Production build reported webpack asset-size
  warnings but no compilation or host-compatibility failure.
