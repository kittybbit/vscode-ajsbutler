# Domain Rules: JP1 Diagnostic Parameters

## Purpose

Define the JP1/AJS3 version 13 parameter rules currently promised by the AJS
definition diagnostic Use Case. Each `JP1-PARAM-*` ID below has exactly one
normative body in this file.

The official Hitachi JP1/AJS3 version 13 Command Reference is authoritative.
An implementation difference does not change these rules and must be handled
by independent runtime-conformance work.

## File Monitoring

### `JP1-PARAM-FILE-MONITOR-CONDITION-001`

- Applies to `flwc` on file-monitoring and recovery file-monitoring jobs
  (`flwj`, `rflwj`).
- The monitoring-condition form is `c[:d[:{s|m}]]`. Size-change monitoring
  (`s`) and modification-time monitoring (`m`) are mutually exclusive.
- Omission uses `flwc=c`; no rule is applied to another unit type.
- Source: [Command Reference 5.2.10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM).

### `JP1-PARAM-FILE-MONITOR-OUTPUT-001`

- Applies to `flco` on `flwj` and `rflwj`.
- `flco` is effective only when the effective `flwc` contains creation
  monitoring (`c`). Omitted `flwc` is `c`, and omitted `flco` is `n`.
- Source: [Command Reference 5.2.10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM).

## Job End Judgment And Retry

These rules apply to UNIX, PC, recovery UNIX, recovery PC, custom, recovery
custom, QUEUE, and recovery QUEUE jobs (`j`, `pj`, `rj`, `rp`, `cj`, `rcj`,
`qj`, `rq`).

### `JP1-PARAM-RETRY-ABR-DEPENDENCY-001`

- The effective end judgment `jd` defaults to `cod`; automatic retry `abr`
  defaults to `n`.
- `abr=y` requires `jd=cod`. Each explicit `rjs`, `rje`, `rec`, or `rei`
  requires both `jd=cod` and `abr=y`.
- Sources:
  - [Command Reference 5.2.6](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM)
  - [Command Reference 5.2.7](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM)

### `JP1-PARAM-JOB-END-RANGE-001`

- Explicit `wth` and `tho` are decimal `0..2147483647`.
- Explicit `rjs` and `rje` are decimal `1..4294967295`; `rec` is `1..12`;
  `rei` is `1..10` minutes.
- Sources:
  - [Command Reference 5.2.6](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM)
  - [Command Reference 5.2.7](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM)

### `JP1-PARAM-JOB-END-THRESHOLD-001`

- Applies only when effective `jd=cod` and both explicit thresholds are valid
  numbers.
- `wth` must be strictly less than `tho`. Omission of either threshold does not
  create an ordering violation.
- Sources:
  - [Command Reference 5.2.6](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM)
  - [Command Reference 5.2.7](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM)

## Schedule Rules

These rules apply to schedule parameters on job groups and jobnets (`g`, `n`).
An omitted schedule-rule number is rule `1`; an explicit rule number is
`1..144` unless an exception is stated.

### `JP1-PARAM-SCHEDULE-RANGE-001`

- `ln`: a nested jobnet value is `1..144`; `ln` on a root unit is ignored.
- `st`: optional `+`, hours `00..47`, and minutes `00..59`.
- `cy=(n,u)`: `y=1..9`, `m=1..12`, `w=1..5`, or `d=1..31`.
- `shd`: `1..31` days.
- `cftd`: `no`; `be[,n[,N]]` or `af[,n[,N]]`; or `db[,n]` or `da[,n]`,
  where each present `n` or `N` is `1..31`.
- `sy` and `ey`: `00:00..47:59` or `M`, `C`, or `U` followed by `1..2879`
  minutes.
- `wc`: `no`, `un`, or `1..999`; `wt`: `no`, `un`, `00:00..47:59`, or
  `1..2879` minutes.
- Source: [Command Reference 5.2.4](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM).

### `JP1-PARAM-SCHEDULE-WEEKLY-DAY-001`

- Applies when `cy=(n,w)` and `sd` have the same schedule-rule number.
- That `sd` must not use open-day (`*`) or closed-day (`@`) semantics.
- Source: [Command Reference 5.2.4](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM).

### `JP1-PARAM-SCHEDULE-START-DATE-001`

- `sd` uses rule `1..144`; only `sd=0,ud` may use rule `0`.
- An explicit year is `1994..SCHEDULELIMIT`; this contract uses the default
  `SCHEDULELIMIT=2036`. An explicit month is `1..12`.
- Calendar days are valid days of the selected month; a day without a month is
  `1..31`. Relative/open/closed days are `1..35`. A backward offset is `0`
  through the last valid preceding day, or `0..34` for relative/open/closed
  forms. Weekday occurrence is `1..5` or `b`.
- `en` and `ud` do not take a month; `ud` requires explicit rule `0`.
- Source: [Command Reference 5.2.4](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM).

## JP1 Event Sending

These rules apply to JP1 event sending and recovery JP1 event sending jobs
(`evsj`, `revsj`).

### `JP1-PARAM-EVENT-ARRIVAL-HOST-001`

- Effective `evsrt` defaults to `n`.
- When `evsrt=y`, explicit destination host `evhst` is required.
- Source: [Command Reference 5.2.17](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0232.HTM).

### `JP1-PARAM-EVENT-ARRIVAL-RANGE-001`

- Explicit `evspl` is decimal `3..600` seconds.
- Explicit `evsrc` is decimal `0..999` attempts.
- Source: [Command Reference 5.2.17](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0232.HTM).

### `JP1-PARAM-EVENT-SEND-ID-RANGE-001`

- Explicit `evsid` contains one to eight hexadecimal digits.
- Its value is `00000000..00001FFF` or `7FFF8000..7FFFFFFF`.
- Source: [Command Reference 5.2.17](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0232.HTM).

## JP1 Event Reception Monitoring

These rules apply to JP1 event reception-monitoring and recovery jobs (`evwj`,
`revwj`).

### `JP1-PARAM-EVENT-RECEIVE-SCOPE-001`

- Explicit `evesc` is `no` or decimal `1..720` minutes.
- Omission is `no`.
- Source: [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM).

### `JP1-PARAM-EVENT-RECEIVE-FORMAT-001`

- Explicit `evwid` is two hexadecimal event-ID values separated by `:`, each
  within `00000000..FFFFFFFF`.
- Explicit `evipa` has four decimal octets, each `0..255`.
- Source: [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM).

### `JP1-PARAM-EVENT-RECEIVE-NUMERIC-ID-001`

- Each explicit `evuid`, `evgid`, and `evpid` is signed decimal
  `-1..9999999999`.
- Source: [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM).

### `JP1-PARAM-EVENT-RECEIVE-FILTER-001`

- Explicit quoted `evusr` and `evgrp` content is `1..20` bytes; explicit quoted
  `evwms` and `evdet` content is `1..1024` bytes.
- `evwfr` is
  `optional-extended-attribute-name:"value"`; each explicit value is non-empty,
  and all repeated definitions total at most `2048` bytes when measured in the
  canonical `evwfr=optional-extended-attribute-name:"value";` format. The
  parameter key, `=`, and terminating `;` are part of that aggregate limit;
  indentation and line endings are not.
- `evtmc` is `n`, `a`, `n:"file-name"`, `a:"file-name"`,
  `d:"file-name"`, or `b:"file-name"`; file-name content is `1..256` bytes.
- Source: [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM).

### `JP1-PARAM-EVENT-RECEIVE-TIMEOUT-001`

- Explicit `etm` is decimal `1..1440` minutes, `ha` is `y` or `n`, and `ets`
  is `kl`, `nr`, `wr`, or `an`.
- Omitted values are `ha=n` and `ets=kl`. `etm`, `ha`, and `ets` are invalid
  for a job within a start condition.
- Source: [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM).

## Shared Event And Wait Values

### `JP1-PARAM-EVENT-HOST-LENGTH-001`

- Explicit `evhst` is `1..255` bytes on `evsj`, `revsj`, `evwj`, and `revwj`.
- Event-reception `evhst` may use a regular expression or macro variable; the
  byte limit still applies to its explicit value.
- Sources:
  - [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM)
  - [Command Reference 5.2.17](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0232.HTM)

### `JP1-PARAM-WAIT-ETS-VALUE-001`

- Explicit `ets` is one of `kl`, `nr`, `wr`, or `an` on file-monitoring and
  execution-interval control jobs (`flwj`, `rflwj`, `tmwj`, `rtmwj`).
- Omission is `kl`.
- Sources:
  - [Command Reference 5.2.10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM)
  - [Command Reference 5.2.16](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0231.HTM)

### `JP1-PARAM-WAIT-FD-CONTEXT-001`

- Explicit `fd` is decimal `1..1440` minutes on `flwj`, `rflwj`, `tmwj`,
  `rtmwj`, `evwj`, and `revwj`.
- `fd` is invalid for a job within a start condition.
- Sources:
  - [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM)
  - [Command Reference 5.2.10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM)
  - [Command Reference 5.2.16](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0231.HTM)

## Execution-Interval Control

These rules apply to execution-interval control and recovery jobs (`tmwj`,
`rtmwj`).

### `JP1-PARAM-INTERVAL-CONTROL-RANGE-001`

- Explicit `tmitv` is decimal `1..1440` minutes.
- Explicit `etn` is `y` or `n`; omission is `n`.
- Source: [Command Reference 5.2.16](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0231.HTM).

### `JP1-PARAM-INTERVAL-CONTROL-END-CONTEXT-001`

- `etn=y` is valid only when the execution-interval control job is defined
  within a start condition.
- Source: [Command Reference 5.2.16](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0231.HTM).

## Shared String And Transfer-File Forms

### `JP1-PARAM-STRING-FAMILY-CONSTRAINT-001`

- On `flwj` and `rflwj`, explicit `flwf` is `1..255` bytes and explicit `flwi`
  is decimal `1..600` seconds.
- A wildcard `*` in `flwf` is invalid when effective `flwi` is `1..9`;
  omitted `flwi` is `60`.
- Source: [Command Reference 5.2.10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM).

### `JP1-PARAM-TRANSFER-FILE-FORM-001`

- Applies to `ts1..ts4` and `td1..td4` on UNIX/PC, recovery UNIX/PC, UNIX
  custom, recovery UNIX custom, QUEUE, and recovery QUEUE jobs.
- Each explicit value is a quoted transfer-file value or a supported explicit
  macro-variable form; an unsupported bare value is invalid.
- A macro-variable form is allowed for QUEUE and recovery QUEUE jobs, for UNIX/
  PC and recovery jobs only when the queuing attribute `jty=q` is effective,
  and for UNIX custom and recovery UNIX custom jobs. Transfer parameters are
  not valid for custom PC jobs.
- Sources:
  - [Command Reference 5.2.6](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM)
  - [Command Reference 5.2.7](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM)
  - [Command Reference 5.2.24](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM)

### `JP1-PARAM-TRANSFER-FILE-PATH-001`

- Each explicit `tsN` and `tdN` is `1..511` bytes.
- A quoted `tsN` is an absolute UNIX path, Windows rooted path, or Windows
  drive-qualified path. Explicit `tdN` requires the matching `tsN`.
- On non-QUEUE target jobs, explicit `topN` also requires matching `tsN`.
- Sources:
  - [Command Reference 5.2.6](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM)
  - [Command Reference 5.2.7](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM)
  - [Command Reference 5.2.24](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM)

### `JP1-PARAM-STRING-MACRO-ALLOWANCE-001`

- A supported explicit macro-variable form in `tsN` or `tdN` is not rejected
  for lacking quotation marks or for lacking a literal absolute path.
- Regular expressions explicitly permitted for event-reception `evusr`,
  `evgrp`, `evhst`, `evwms`, `evdet`, and `evwfr` are not rejected merely for
  using regular-expression syntax; their family-specific forms and byte limits
  still apply.
- Sources:
  - [Command Reference 5.2.9](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM)
  - [Command Reference 5.2.6](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM)
  - [Command Reference 5.2.7](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM)
  - [Command Reference 5.2.24](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM)

## Exclusions

Compatible-ISAM-specific interpretation is outside the supported contract.
The rules above do not imply complete diagnostic coverage of every parameter
in the JP1/AJS3 manual. Absence of a diagnostic for an unlisted rule does not
mean that the definition is valid under that rule.
