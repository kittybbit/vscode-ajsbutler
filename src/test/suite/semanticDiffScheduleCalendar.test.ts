import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";
import {
  classifyScheduleCalendarDay,
  createScheduleCalendarContextIndex,
  resolveOperationalMonth,
  resolveScheduleCalendarContext,
} from "../../domain/services/semantic-diff/semanticDiffScheduleCalendarContext";
import {
  evaluateSemanticDiffSchedule,
  interpretSchedule,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";

const params = (values: Record<string, string | string[]>): AjsParameter[] =>
  Object.entries(values).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map((item) => ({ key, value: item }))
      : [{ key, value }],
  );

const unit = (overrides: Partial<AjsUnit>): AjsUnit => ({
  id: overrides.absolutePath ?? "/root/jobnet",
  name: "jobnet",
  unitAttribute: "jobnet,,jp1admin,",
  unitType: "n",
  absolutePath: "/root/jobnet",
  depth: 1,
  parentId: "/root",
  isRoot: false,
  isRootJobnet: true,
  hasSchedule: true,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: params({ ty: "n" }),
  relations: [] as AjsRelation[],
  children: [],
  ...overrides,
});

const group = (
  absolutePath: string,
  children: AjsUnit[],
  parameterValues: Record<string, string | string[]> = {},
  parentId?: string,
): AjsUnit => ({
  ...unit({}),
  id: absolutePath,
  name: absolutePath.split("/").at(-1) ?? "group",
  unitAttribute: "group,,jp1admin,",
  unitType: "g",
  absolutePath,
  depth: absolutePath.split("/").filter(Boolean).length - 1,
  parentId: absolutePath === "/root" ? undefined : (parentId ?? "/root"),
  isRoot: absolutePath === "/root",
  isRootJobnet: false,
  hasSchedule: false,
  parameters: params({ ty: "g", ...parameterValues }),
  children,
});

const jobnet = (
  absolutePath: string,
  parameterValues: Record<string, string | string[]>,
  parentId = "/root",
): AjsUnit =>
  unit({
    id: absolutePath,
    name: absolutePath.split("/").at(-1) ?? "jobnet",
    absolutePath,
    depth: absolutePath.split("/").filter(Boolean).length - 1,
    parentId,
    isRootJobnet: parentId === "/root",
    parameters: params({ ty: "n", ...parameterValues }),
  });

const document = (rootUnits: AjsUnit[]): AjsDocument => ({
  rootUnits,
  warnings: [],
});

const period = { from: "2026-04-01", to: "2026-06-01" };

const assertCalendarUnsupportedItems = (
  result: ReturnType<typeof compareSemanticDiff>,
  unit: AjsUnit,
  expected: Array<{
    key: string;
    value: string;
    reason: string;
    rule?: number;
  }>,
): void => {
  const items = result.unsupportedItems
    .filter((item) => item.detail.unitPath === unit.absolutePath)
    .sort((left, right) => left.id.localeCompare(right.id));
  assert.strictEqual(items.length, expected.length);
  assert.deepStrictEqual(
    items.map((item) => ({
      id: item.id,
      reason: item.reasonCode,
      parameterKey: item.detail.parameterKey,
      scheduleRule: item.detail.scheduleRule,
      rawValues: item.detail.rawValues,
      fallbackText: item.warning?.fallbackText,
    })),
    expected
      .map((item) => ({
        id: `uncalculated:schedule:after:${unit.id}:${item.key}:${item.value}`,
        reason: item.reason,
        parameterKey: item.key,
        scheduleRule: item.rule ?? null,
        rawValues: [item.value],
        fallbackText: `${unit.absolutePath} ${item.key}=${item.value}: calendar selection is not calculated in this slice`,
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
  );
  items.forEach((item) => {
    assert.strictEqual(item.warning?.code, item.reasonCode);
    assert.deepStrictEqual(item.warning?.detail, item.detail);
  });
};

suite("Semantic Diff Schedule Calendar Context", () => {
  test("resolves containing-group defaults and projects relative dates", () => {
    const main = jobnet("/root/main", {
      sd: ["1,2026/04/+01", "2,2026/04/+b", "3,2026/04/+mo:2"],
      st: ["1,09:00", "2,09:00", "3,09:00"],
    });
    const root = group("/root", [main], {
      sdd: "15",
      md: "th",
      stt: "00:00",
    });
    const parsed = resolveScheduleCalendarContext(document([root]), main);
    assert.strictEqual(parsed.status, "supported");
    assert.strictEqual(parsed.sourceGroup?.absolutePath, "/root");
    assert.deepStrictEqual(parsed.baseDay, { kind: "numeric", value: 15 });
    assert.deepStrictEqual(
      interpretSchedule(main).scheduleDateRules.map((rule) => rule.evidence.id),
      [
        "JP1-PARAM-SCHEDULE-RELATIVE-001",
        "JP1-PARAM-SCHEDULE-RELATIVE-001",
        "JP1-PARAM-SCHEDULE-RELATIVE-001",
      ],
    );
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [main],
      matches: [],
      period,
      afterDocument: document([root]),
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") return;
    assert.deepStrictEqual(result.pairEvaluations, []);
    assert.deepStrictEqual(result.zeroRunCandidates, []);
    assert.deepStrictEqual(result.unsupportedDecisions, []);
    assert.deepStrictEqual(
      result.runDecisions.map((decision) => [decision.kind, decision.date]),
      [
        ["added", "2026-04-15"],
        ["added", "2026-04-27"],
        ["added", "2026-05-14"],
      ],
    );
  });

  test("resolves md=ne and weekday base days without clamping", () => {
    const main = jobnet("/root/main", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const root = group("/root", [main], {
      sdd: "mo:2",
      md: "ne",
    });
    const context = resolveScheduleCalendarContext(document([root]), main);
    assert.strictEqual(context.status, "supported");
    assert.deepStrictEqual(context.baseDay, {
      kind: "weekday",
      weekday: "mo",
      occurrence: 2,
    });
    const month = resolveOperationalMonth(context, 2026, 4);
    assert.strictEqual(month?.start.toISOString().slice(0, 10), "2026-03-09");
    assert.strictEqual(
      month?.endExclusive.toISOString().slice(0, 10),
      "2026-04-13",
    );
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [main],
      matches: [],
      period: { from: "2026-03-01", to: "2026-05-01" },
      afterDocument: document([root]),
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") return;
    assert.deepStrictEqual(
      result.runDecisions.map((decision) => decision.date),
      ["2026-03-09"],
    );
  });

  test("uses the closest group values and documented defaults", () => {
    const nestedMain = jobnet(
      "/root/outer/inner/main",
      { sd: "2026/04/+01", st: "09:00" },
      "/root/outer/inner",
    );
    const inner = group(
      "/root/outer/inner",
      [nestedMain],
      { sdd: "20" },
      "/root/outer",
    );
    const outer = group("/root/outer", [inner], { sdd: "09", md: "ne" });
    const root = group("/root", [outer], { sdd: "05", stt: "00:00" });
    const context = resolveScheduleCalendarContext(
      document([root]),
      nestedMain,
    );
    assert.strictEqual(context.status, "supported");
    assert.deepStrictEqual(context.baseDay, { kind: "numeric", value: 20 });
    assert.strictEqual(context.baseMonth, "ne");
    assert.strictEqual(context.baseTime, "00:00");

    const defaultsMain = jobnet("/root/defaults", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const defaultsRoot = group("/root", [defaultsMain]);
    const defaults = resolveScheduleCalendarContext(
      document([defaultsRoot]),
      defaultsMain,
    );
    assert.strictEqual(defaults.status, "supported");
    assert.deepStrictEqual(defaults.baseDay, { kind: "numeric", value: 1 });
    assert.strictEqual(defaults.baseMonth, "th");
    assert.strictEqual(defaults.baseTime, "00:00");
  });

  test("uses jc context outside the comparison scope without adding its units", () => {
    const calendarJobnet = jobnet(
      "/root/calendar/calendar-job",
      {
        sd: "2026/04/10",
        st: "08:00",
      },
      "/root/calendar",
    );
    const calendar = group("/root/calendar", [calendarJobnet], { sdd: "20" });
    const main = jobnet(
      "/root/main",
      { jc: "/root/calendar", sd: "2026/04/+01", st: "09:00" },
      "/root/owner",
    );
    const owner = group("/root/owner", [main]);
    const root = group("/root", [calendar, owner]);
    const result = compareSemanticDiff({
      before: document([root]),
      after: document([root]),
      options: {
        jobGroupPath: "/root/owner",
        scheduleComparisonPeriod: period,
      },
    });
    assert.deepStrictEqual(result.scheduleComparison?.runChanges, []);
    assert.ok(
      !result.scheduleComparison?.runChanges.some((change) =>
        change.unitPath.startsWith("/root/calendar"),
      ),
    );
  });

  test("keeps before and after calendar contexts independent", () => {
    const beforeMain = jobnet(
      "/root/main",
      { sd: "2026/04/+01", st: "09:00" },
      "/root",
    );
    const afterMain = jobnet(
      "/root/main",
      { sd: "2026/04/+01", st: "09:00" },
      "/root",
    );
    const beforeRoot = group("/root", [beforeMain], { sdd: "01" });
    const afterRoot = group("/root", [afterMain], { sdd: "15" });
    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([afterRoot]),
      options: { scheduleComparisonPeriod: period },
    });
    assert.deepStrictEqual(
      result.scheduleComparison?.runChanges.map((change) => [
        change.kind,
        change.date,
      ]),
      [
        ["added", "2026-04-15"],
        ["removed", "2026-04-01"],
      ],
    );
  });

  test("keeps before and after explicit open-day calendars independent", () => {
    const beforeMain = jobnet(
      "/root/main",
      { sd: "2026/04/*01", st: "09:00" },
      "/root",
    );
    const afterMain = jobnet(
      "/root/main",
      { sd: "2026/04/*01", st: "09:00" },
      "/root",
    );
    const beforeRoot = group("/root", [beforeMain], {
      op: ["mo", "tu", "we", "th"],
      cl: ["fr", "sa", "su", "2026/04/01"],
    });
    const afterRoot = group("/root", [afterMain], {
      op: ["mo", "tu", "we", "th", "fr", "sa", "su"],
    });
    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([afterRoot]),
      options: { scheduleComparisonPeriod: period },
    });
    assert.deepStrictEqual(
      result.scheduleComparison?.runChanges.map((change) => [
        change.kind,
        change.date,
      ]),
      [
        ["added", "2026-04-01"],
        ["removed", "2026-04-02"],
      ],
    );
  });

  test("reports invalid or missing calendar context without guessing", () => {
    const missing = jobnet("/root/main", {
      jc: "/root/missing",
      sd: "2026/04/+01",
      st: "09:00",
    });
    const root = group("/root", [missing]);
    const missingResult = compareSemanticDiff({
      before: document([]),
      after: document([root]),
      options: { scheduleComparisonPeriod: period },
    });
    assert.deepStrictEqual(
      missingResult.unsupportedItems.map((item) => item.reasonCode),
      ["calendar-selection", "calendar-selection"],
    );
    assert.deepStrictEqual(missingResult.scheduleComparison?.runChanges, []);

    const duplicate = jobnet("/root/main", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const duplicateRoot = group("/root", [duplicate], { sdd: ["01", "02"] });
    const duplicateContext = resolveScheduleCalendarContext(
      document([duplicateRoot]),
      duplicate,
    );
    assert.strictEqual(duplicateContext.status, "invalid");
    assert.strictEqual(
      duplicateContext.evidenceId,
      "schedule:calendar:invalid-base-or-conflict:sdd",
    );
    assert.deepStrictEqual(
      duplicateContext.rawParameters
        .filter((parameter) => parameter.key === "sdd")
        .map((parameter) => parameter.value),
      ["01", "02"],
    );

    const nonGroupSelector = jobnet("/root/non-group", {
      jc: "/root/main",
      sd: "2026/04/+01",
      st: "09:00",
    });
    const nonGroupContext = resolveScheduleCalendarContext(
      document([root, nonGroupSelector]),
      nonGroupSelector,
    );
    assert.strictEqual(nonGroupContext.status, "missing-context");
    assert.strictEqual(
      nonGroupContext.selection.evidenceId,
      "schedule:jc:missing-context:/root/main",
    );

    const duplicateSelector = jobnet("/root/duplicate-selector", {
      jc: ["/root", "/root"],
      sd: "2026/04/+01",
      st: "09:00",
    });
    const duplicateSelectorContext = resolveScheduleCalendarContext(
      document([root, duplicateSelector]),
      duplicateSelector,
    );
    assert.strictEqual(duplicateSelectorContext.status, "invalid");
    assert.strictEqual(
      duplicateSelectorContext.evidenceId,
      "schedule:calendar:invalid-base-or-conflict:jc",
    );

    const nonAbsoluteSelector = jobnet("/root/non-absolute", {
      jc: "calendar",
      sd: "2026/04/+01",
      st: "09:00",
    });
    const nonAbsoluteContext = resolveScheduleCalendarContext(
      document([root, nonAbsoluteSelector]),
      nonAbsoluteSelector,
    );
    assert.strictEqual(nonAbsoluteContext.status, "invalid");
    assert.strictEqual(
      nonAbsoluteContext.selection.evidenceId,
      "schedule:jc:invalid:calendar",
    );

    const nonZero = jobnet("/root/nonzero", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const nonZeroBaseTimeRoot = group("/root", [nonZero], { stt: "01:00" });
    const nonZeroContext = resolveScheduleCalendarContext(
      document([nonZeroBaseTimeRoot]),
      nonZero,
    );
    assert.strictEqual(nonZeroContext.status, "missing-context");
    const nonZeroResult = compareSemanticDiff({
      before: document([]),
      after: document([nonZeroBaseTimeRoot]),
      options: { scheduleComparisonPeriod: period },
    });
    assert.deepStrictEqual(
      nonZeroResult.unsupportedItems.map((item) => item.reasonCode),
      ["calendar-selection"],
    );

    const duplicateMonthRoot = group("/root", [duplicate], {
      md: ["th", "ne"],
    });
    const duplicateMonthContext = resolveScheduleCalendarContext(
      document([duplicateMonthRoot]),
      duplicate,
    );
    assert.strictEqual(
      duplicateMonthContext.evidenceId,
      "schedule:calendar:invalid-base-or-conflict:md",
    );
    assert.deepStrictEqual(
      duplicateMonthContext.rawParameters
        .filter((parameter) => parameter.key === "md")
        .map((parameter) => parameter.value),
      ["th", "ne"],
    );
    const duplicateTimeRoot = group("/root", [duplicate], {
      stt: ["00:00", "01:00"],
    });
    const duplicateTimeContext = resolveScheduleCalendarContext(
      document([duplicateTimeRoot]),
      duplicate,
    );
    assert.strictEqual(
      duplicateTimeContext.evidenceId,
      "schedule:calendar:invalid-base-or-conflict:stt",
    );
    assert.deepStrictEqual(
      duplicateTimeContext.rawParameters
        .filter((parameter) => parameter.key === "stt")
        .map((parameter) => parameter.value),
      ["00:00", "01:00"],
    );
  });

  test("keeps invalid relative dates and valid no-run occurrences distinct", () => {
    const noRun = jobnet("/root/no-run", {
      sd: "2026/04/+mo:5",
      st: "09:00",
    });
    const invalid = jobnet("/root/invalid", {
      sd: "2026/13/+01",
      st: "09:00",
    });
    const root = group("/root", [noRun, invalid], { sdd: "15" });
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [noRun, invalid],
      matches: [],
      period,
      afterDocument: document([root]),
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") return;
    assert.deepStrictEqual(
      result.zeroRunCandidates.map((candidate) => candidate.id),
      [noRun.id],
    );
    assert.deepStrictEqual(
      result.unsupportedDecisions.map((decision) => [
        decision.unit.id,
        decision.reason,
      ]),
      [[invalid.id, "invalid-calendar-day"]],
    );

    const impossibleBoundary = jobnet("/root/impossible-boundary", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const impossibleRoot = group("/root", [impossibleBoundary], {
      sdd: "31",
      md: "th",
    });
    const impossibleContext = resolveScheduleCalendarContext(
      document([impossibleRoot]),
      impossibleBoundary,
    );
    assert.strictEqual(impossibleContext.status, "supported");
    assert.strictEqual(
      resolveOperationalMonth(impossibleContext, 2026, 4),
      undefined,
    );
    const impossibleResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [impossibleBoundary],
      matches: [],
      period,
      afterDocument: document([impossibleRoot]),
    });
    assert.strictEqual(impossibleResult.kind, "evaluated");
    if (impossibleResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      impossibleResult.unsupportedDecisions.map((decision) => decision.reason),
      ["calendar-selection"],
    );
  });

  test("does not let missing context mask omitted or invalid relative dates", () => {
    const omitted = jobnet("/root/omitted", {
      sd: "04/+mo:2",
      st: "09:00",
    });
    const omittedResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [omitted],
      matches: [],
      period,
      afterDocument: document([group("/root", [omitted])]),
    });
    assert.strictEqual(omittedResult.kind, "evaluated");
    if (omittedResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      omittedResult.unsupportedDecisions.map((decision) => decision.reason),
      ["unsupported-schedule-date"],
    );

    const invalidOccurrence = jobnet("/root/invalid-occurrence", {
      sd: "2026/04/+mo:6",
      st: "+27:03",
    });
    const invalidResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [invalidOccurrence],
      matches: [],
      period,
      afterDocument: document([group("/root", [invalidOccurrence])]),
    });
    assert.strictEqual(invalidResult.kind, "evaluated");
    if (invalidResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      invalidResult.unsupportedDecisions
        .map((decision) => [decision.parameter.key, decision.reason])
        .sort(),
      [
        ["sd", "invalid-calendar-day"],
        ["st", "invalid-start-time"],
      ],
    );

    const combined = jobnet("/root/combined", {
      jc: "/root/missing-group",
      sd: ["1,2026/04/+01", "2,2026/04/+mo:6"],
      st: ["1,09:00", "2,09:00"],
    });
    const combinedResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [combined],
      matches: [],
      period,
      afterDocument: document([group("/root", [combined])]),
    });
    assert.strictEqual(combinedResult.kind, "evaluated");
    if (combinedResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      combinedResult.unsupportedDecisions
        .map((decision) => [
          decision.parameter.value,
          decision.reason,
          decision.scheduleRule,
        ])
        .sort(),
      [
        ["/root/missing-group", "calendar-selection", undefined],
        ["1,2026/04/+01", "calendar-selection", 1],
        ["2,2026/04/+mo:6", "invalid-calendar-day", 2],
      ].sort(),
    );
  });

  test("maps calendar context failures through the existing application contract", () => {
    const cases: Array<{
      name: string;
      unit: AjsUnit;
      root: AjsUnit;
      expected: Array<{
        key: string;
        value: string;
        reason: string;
        rule?: number;
      }>;
    }> = [];
    const addCase = (
      name: string,
      unit: AjsUnit,
      root: AjsUnit,
      expected: Array<{
        key: string;
        value: string;
        reason: string;
        rule?: number;
      }>,
    ): void => {
      cases.push({ name, unit, root, expected });
    };

    const missing = jobnet("/root/missing-context", {
      jc: "/root/no-such-group",
      sd: "2026/04/+01",
      st: "09:00",
    });
    addCase("missing jc", missing, group("/root", [missing]), [
      {
        key: "jc",
        value: "/root/no-such-group",
        reason: "calendar-selection",
      },
      {
        key: "sd",
        value: "2026/04/+01",
        reason: "calendar-selection",
        rule: 1,
      },
    ]);

    const nonGroup = jobnet("/root/non-group", {
      jc: "/root/non-group",
      sd: "2026/04/+01",
      st: "09:00",
    });
    addCase("non-group jc", nonGroup, group("/root", [nonGroup]), [
      { key: "jc", value: "/root/non-group", reason: "calendar-selection" },
      {
        key: "sd",
        value: "2026/04/+01",
        reason: "calendar-selection",
        rule: 1,
      },
    ]);

    const nonAbsolute = jobnet("/root/non-absolute", {
      jc: "calendar",
      sd: "2026/04/+01",
      st: "09:00",
    });
    addCase("non-absolute jc", nonAbsolute, group("/root", [nonAbsolute]), [
      { key: "jc", value: "calendar", reason: "calendar-selection" },
      {
        key: "sd",
        value: "2026/04/+01",
        reason: "calendar-selection",
        rule: 1,
      },
    ]);

    const duplicateBase = jobnet("/root/duplicate-base", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    addCase(
      "duplicate base",
      duplicateBase,
      group("/root", [duplicateBase], { sdd: ["01", "02"] }),
      [
        {
          key: "sd",
          value: "2026/04/+01",
          reason: "calendar-selection",
          rule: 1,
        },
      ],
    );

    const cyclic = jobnet("/root/cyclic", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    cyclic.parentId = cyclic.id;
    addCase("hierarchy cycle", cyclic, group("/root", [cyclic]), [
      {
        key: "sd",
        value: "2026/04/+01",
        reason: "calendar-selection",
        rule: 1,
      },
    ]);

    const impossible = jobnet("/root/impossible", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    addCase(
      "impossible boundary",
      impossible,
      group("/root", [impossible], { sdd: "31", md: "th" }),
      [
        {
          key: "sd",
          value: "2026/04/+01",
          reason: "calendar-selection",
          rule: 1,
        },
      ],
    );

    const nonZero = jobnet("/root/non-zero-base-time", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    addCase(
      "non-zero base time",
      nonZero,
      group("/root", [nonZero], { stt: "01:00" }),
      [
        {
          key: "sd",
          value: "2026/04/+01",
          reason: "calendar-selection",
          rule: 1,
        },
      ],
    );

    const incomplete = jobnet("/root/incomplete", {
      sd: "2026/04/*01",
      st: "09:00",
    });
    addCase(
      "incomplete calendar",
      incomplete,
      group("/root", [incomplete], { op: "mo" }),
      [
        {
          key: "sd",
          value: "2026/04/*01",
          reason: "calendar-selection",
          rule: 1,
        },
      ],
    );

    const conflict = jobnet("/root/conflict", {
      sd: "2026/04/*01",
      st: "09:00",
    });
    addCase(
      "conflicting calendar",
      conflict,
      group("/root", [conflict], { op: "mo", cl: "mo" }),
      [
        {
          key: "sd",
          value: "2026/04/*01",
          reason: "calendar-selection",
          rule: 1,
        },
      ],
    );

    cases.forEach(({ name, unit, root, expected }) => {
      const result = compareSemanticDiff({
        before: document([]),
        after: document([root]),
        options: { jobGroupPath: "/root", scheduleComparisonPeriod: period },
      });
      assertCalendarUnsupportedItems(result, unit, expected);
      assert.deepStrictEqual(result.scheduleComparison?.runChanges, []);
      assert.strictEqual(
        result.unsupportedItems
          .filter((item) => item.detail.unitPath === unit.absolutePath)
          .every((item) =>
            item.warning?.fallbackText?.includes("calendar selection"),
          ),
        true,
        name,
      );
    });
  });

  test("reuses bounded context indexing for a long schedule and unrelated document", () => {
    const scheduleDates = Array.from({ length: 144 }, (_, index) => {
      const year = 2026 + (Math.floor(index / 12) % 10);
      const month = String((index % 12) + 1).padStart(2, "0");
      return `${index + 1},${year}/${month}/+01`;
    });
    const scheduleTimes = Array.from(
      { length: 144 },
      (_, index) => `${index + 1},09:00`,
    );
    const target = jobnet("/root/target", {
      sd: scheduleDates,
      st: scheduleTimes,
    });
    const unrelated = Array.from({ length: 512 }, (_, index) =>
      group(`/root/unrelated/${index}`, []),
    );
    const root = group("/root", [target, ...unrelated], { sdd: "1" });
    const fullDocument = document([root]);
    const index = createScheduleCalendarContextIndex(fullDocument);
    assert.strictEqual(
      resolveScheduleCalendarContext(fullDocument, target, index).status,
      "supported",
    );
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [target],
      matches: [],
      period: { from: "2026-01-01", to: "2036-01-01" },
      afterDocument: fullDocument,
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") return;
    assert.strictEqual(result.runDecisions.length, 144);
    assert.ok(
      result.runDecisions.every(
        (decision) =>
          decision.kind === "added" &&
          decision.unitPath === target.absolutePath,
      ),
    );
    assert.deepStrictEqual(result.unsupportedDecisions, []);
  });

  test("rejects hierarchy cycles and duplicate normalized paths recoverably", () => {
    const cyclic = jobnet("/root/main", { sd: "2026/04/+01" });
    cyclic.parentId = cyclic.id;
    const cycleContext = resolveScheduleCalendarContext(
      document([cyclic]),
      cyclic,
    );
    assert.strictEqual(cycleContext.status, "invalid");

    const first = group("/root", []);
    const second = group("/root", []);
    const duplicatePathContext = resolveScheduleCalendarContext(
      document([first, second]),
      jobnet("/root/main", { sd: "2026/04/+01" }),
    );
    assert.strictEqual(duplicatePathContext.status, "invalid");
  });

  test("projects first, nth, and last open and closed days", () => {
    const main = jobnet("/root/main", {
      sd: [
        "1,2026/04/*01",
        "2,2026/04/*02",
        "3,2026/04/*b",
        "4,2026/04/*b-01",
        "5,2026/04/@01",
        "6,2026/04/@02",
        "7,2026/04/@b",
        "8,2026/04/@b-01",
      ],
      st: [
        "1,09:00",
        "2,09:00",
        "3,09:00",
        "4,09:00",
        "5,09:00",
        "6,09:00",
        "7,09:00",
        "8,09:00",
      ],
    });
    const root = group("/root", [main], {
      op: ["mo", "tu", "we", "th"],
      cl: ["fr", "sa", "su", "2026/04/01"],
    });
    const context = resolveScheduleCalendarContext(document([root]), main);
    assert.strictEqual(context.status, "supported");
    assert.deepStrictEqual(
      classifyScheduleCalendarDay(context, new Date("2026-04-01T00:00:00Z")),
      { status: "closed" },
    );
    assert.deepStrictEqual(
      classifyScheduleCalendarDay(context, new Date("2026-04-02T00:00:00Z")),
      { status: "open" },
    );

    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [main],
      matches: [],
      period,
      afterDocument: document([root]),
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") return;
    assert.deepStrictEqual(
      result.runDecisions.map((decision) => [
        decision.date,
        decision.kind === "added" ? decision.after.rule : undefined,
      ]),
      [
        ["2026-04-01", 5],
        ["2026-04-02", 1],
        ["2026-04-03", 6],
        ["2026-04-06", 2],
        ["2026-04-25", 8],
        ["2026-04-26", 7],
        ["2026-04-29", 4],
        ["2026-04-30", 3],
      ],
    );
    assert.deepStrictEqual(result.unsupportedDecisions, []);
  });

  test("supports 31 and 34 backward open and closed offsets in a 35-day month", () => {
    const operationalMonth = {
      sdd: "mo:1",
      md: "th",
    };
    const open = jobnet("/root/open-boundary", {
      sd: ["1,2026/06/*b-31", "2,2026/06/*b-34", "3,2026/06/*b-35"],
      st: ["1,09:00", "2,09:00", "3,09:00"],
    });
    const openRoot = group("/root", [open], {
      ...operationalMonth,
      op: ["su", "mo", "tu", "we", "th", "fr", "sa"],
    });
    const openContext = resolveScheduleCalendarContext(
      document([openRoot]),
      open,
    );
    assert.strictEqual(openContext.status, "supported");
    const openMonth = resolveOperationalMonth(openContext, 2026, 6);
    assert.strictEqual(
      openMonth?.start.toISOString().slice(0, 10),
      "2026-06-01",
    );
    assert.strictEqual(
      openMonth?.endExclusive.toISOString().slice(0, 10),
      "2026-07-06",
    );
    const openResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [open],
      matches: [],
      period: { from: "2026-06-01", to: "2026-07-06" },
      afterDocument: document([openRoot]),
    });
    assert.strictEqual(openResult.kind, "evaluated");
    if (openResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      openResult.runDecisions.map((decision) => [
        decision.date,
        decision.kind === "added" ? decision.after.rule : undefined,
      ]),
      [
        ["2026-06-01", 2],
        ["2026-06-04", 1],
      ],
    );
    assert.deepStrictEqual(
      openResult.unsupportedDecisions.map((decision) => [
        decision.parameter.value,
        decision.reason,
      ]),
      [["3,2026/06/*b-35", "invalid-calendar-day"]],
    );

    const closed = jobnet("/root/closed-boundary", {
      sd: ["1,2026/06/@b-31", "2,2026/06/@b-34", "3,2026/06/@b-35"],
      st: ["1,09:00", "2,09:00", "3,09:00"],
    });
    const closedRoot = group("/root", [closed], {
      ...operationalMonth,
      cl: ["su", "mo", "tu", "we", "th", "fr", "sa"],
    });
    const closedResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [closed],
      matches: [],
      period: { from: "2026-06-01", to: "2026-07-06" },
      afterDocument: document([closedRoot]),
    });
    assert.strictEqual(closedResult.kind, "evaluated");
    if (closedResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      closedResult.runDecisions.map((decision) => [
        decision.date,
        decision.kind === "added" ? decision.after.rule : undefined,
      ]),
      [
        ["2026-06-01", 2],
        ["2026-06-04", 1],
      ],
    );
    assert.deepStrictEqual(
      closedResult.unsupportedDecisions.map((decision) => [
        decision.parameter.value,
        decision.reason,
      ]),
      [["3,2026/06/@b-35", "invalid-calendar-day"]],
    );
  });

  test("uses Gregorian leap-day boundaries for open and closed projection", () => {
    const main = jobnet("/root/leap", {
      sd: ["1,2028/02/*b", "2,2028/02/@b"],
      st: ["1,09:00", "2,09:00"],
    });
    const root = group("/root", [main], {
      op: ["su", "mo", "tu", "we", "th", "fr", "sa"],
      cl: "2028/02/29",
    });
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [main],
      matches: [],
      period: { from: "2028-02-01", to: "2028-03-01" },
      afterDocument: document([root]),
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") return;
    assert.deepStrictEqual(
      result.runDecisions.map((decision) => [
        decision.date,
        decision.kind === "added" ? decision.after.rule : undefined,
      ]),
      [
        ["2028-02-28", 1],
        ["2028-02-29", 2],
      ],
    );
    assert.deepStrictEqual(result.zeroRunCandidates, []);
    assert.deepStrictEqual(result.unsupportedDecisions, []);
  });

  test("uses the closest exact calendar selector and preserves duplicate semantics", () => {
    const main = jobnet(
      "/root/outer/main",
      {
        sd: ["1,2026/04/*01", "2,2026/04/@01"],
        st: ["1,09:00", "2,09:00"],
      },
      "/root/outer",
    );
    const outer = group("/root/outer", [main], {
      op: ["mo", "mo", "2026/04/01"],
    });
    const root = group("/root", [outer], {
      cl: "we",
    });
    const context = resolveScheduleCalendarContext(document([root]), main);
    assert.strictEqual(context.status, "supported");
    assert.deepStrictEqual(
      classifyScheduleCalendarDay(context, new Date("2026-04-01T00:00:00Z")),
      { status: "open" },
    );
    assert.deepStrictEqual(
      classifyScheduleCalendarDay(context, new Date("2026-04-08T00:00:00Z")),
      { status: "closed" },
    );

    const duplicate = jobnet("/root/duplicate", {
      sd: "2026/04/*01",
      st: "09:00",
    });
    const duplicateContext = resolveScheduleCalendarContext(
      document([group("/root", [duplicate], { op: ["mo", "mo"] })]),
      duplicate,
    );
    assert.strictEqual(duplicateContext.status, "supported");

    const conflict = jobnet("/root/conflict", {
      sd: "2026/04/*01",
      st: "09:00",
    });
    const conflictContext = resolveScheduleCalendarContext(
      document([group("/root", [conflict], { op: "we", cl: "we" })]),
      conflict,
    );
    assert.strictEqual(conflictContext.status, "invalid");
    assert.strictEqual(
      conflictContext.evidenceId,
      "schedule:calendar:invalid-base-or-conflict:cl",
    );
  });

  test("requires complete classification and keeps operational-month boundaries", () => {
    const incomplete = jobnet("/root/incomplete", {
      sd: "2026/04/*01",
      st: "09:00",
    });
    const incompleteRoot = group("/root", [incomplete], { op: "mo" });
    const incompleteResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [incomplete],
      matches: [],
      period,
      afterDocument: document([incompleteRoot]),
    });
    assert.strictEqual(incompleteResult.kind, "evaluated");
    if (incompleteResult.kind !== "evaluated") return;
    assert.deepStrictEqual(incompleteResult.runDecisions, []);
    assert.deepStrictEqual(
      incompleteResult.unsupportedDecisions.map((decision) => [
        decision.parameter.key,
        decision.reason,
      ]),
      [["sd", "calendar-selection"]],
    );

    const boundary = jobnet("/root/boundary", {
      sd: ["1,2026/04/*01", "2,2026/04/*b"],
      st: ["1,09:00", "2,09:00"],
    });
    const boundaryRoot = group("/root", [boundary], {
      sdd: "1",
      md: "ne",
      op: ["mo", "tu", "we", "th", "fr", "sa", "su"],
    });
    const boundaryResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [boundary],
      matches: [],
      period: { from: "2026-02-01", to: "2026-04-02" },
      afterDocument: document([boundaryRoot]),
    });
    assert.strictEqual(boundaryResult.kind, "evaluated");
    if (boundaryResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      boundaryResult.runDecisions.map((decision) => decision.date),
      ["2026-03-01", "2026-03-31"],
    );

    const noOpen = jobnet("/root/no-open", {
      sd: "2026/04/*01",
      st: "09:00",
    });
    const noOpenRoot = group("/root", [noOpen], {
      cl: ["mo", "tu", "we", "th", "fr", "sa", "su"],
    });
    const noOpenResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [noOpen],
      matches: [],
      period,
      afterDocument: document([noOpenRoot]),
    });
    assert.strictEqual(noOpenResult.kind, "evaluated");
    if (noOpenResult.kind !== "evaluated") return;
    assert.deepStrictEqual(noOpenResult.runDecisions, []);
    assert.deepStrictEqual(
      noOpenResult.zeroRunCandidates.map((candidate) => candidate.id),
      [noOpen.id],
    );
  });

  test("maps invalid open-day syntax and missing jc with existing evidence", () => {
    const invalid = jobnet("/root/invalid", {
      sd: "2026/04/*36",
      st: "09:00",
    });
    const invalidResult = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [invalid],
      matches: [],
      period,
      afterDocument: document([group("/root", [invalid])]),
    });
    assert.strictEqual(invalidResult.kind, "evaluated");
    if (invalidResult.kind !== "evaluated") return;
    assert.deepStrictEqual(
      invalidResult.unsupportedDecisions.map((decision) => [
        decision.parameter.value,
        decision.reason,
      ]),
      [["2026/04/*36", "invalid-calendar-day"]],
    );

    const missing = jobnet("/root/missing", {
      jc: "/root/no-calendar",
      sd: "2026/04/*01",
      st: "09:00",
    });
    const missingResult = compareSemanticDiff({
      before: document([]),
      after: document([group("/root", [missing])]),
      options: { scheduleComparisonPeriod: period },
    });
    assertCalendarUnsupportedItems(missingResult, missing, [
      {
        key: "jc",
        value: "/root/no-calendar",
        reason: "calendar-selection",
      },
      {
        key: "sd",
        value: "2026/04/*01",
        reason: "calendar-selection",
        rule: 1,
      },
    ]);
  });
});
