import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { diagnosticRuleIds } from "../../domain/services/diagnostics/DiagnosticRuleId";
import {
  evaluateScheduleDiagnosticViolations,
  scheduleRangeViolationReasons,
  scheduleStartDateViolationReasons,
  scheduleWeeklyDayViolationReasons,
} from "../../domain/services/diagnostics/evaluateScheduleDiagnosticViolations";

const createScheduleUnit = (
  parameters: AjsParameter[],
  overrides: Partial<AjsUnit> = {},
): AjsUnit => ({
  id: overrides.id ?? "/root",
  name: overrides.name ?? "root",
  unitAttribute: overrides.unitAttribute ?? "",
  unitType: overrides.unitType ?? "g",
  absolutePath: overrides.absolutePath ?? "/root",
  depth: overrides.depth ?? 0,
  isRoot: overrides.isRoot ?? true,
  isRootJobnet: overrides.isRootJobnet ?? true,
  hasSchedule: overrides.hasSchedule ?? true,
  hasWaitedFor: overrides.hasWaitedFor ?? false,
  layout: overrides.layout ?? { h: 0, v: 0 },
  parameters,
  relations: overrides.relations ?? [],
  children: overrides.children ?? [],
});

const createScheduleDocument = (unit: AjsUnit): AjsDocument => ({
  rootUnits: [unit],
  warnings: [],
});

suite("Evaluate schedule diagnostic violations", () => {
  test("emits all schedule range reasons in existing diagnostic order", () => {
    const unit = createScheduleUnit(
      [
        { key: "ty", value: "n" },
        { key: "ln", value: "0,145" },
        { key: "st", value: "145,+48:00" },
        { key: "cy", value: "1,(10,y)" },
        { key: "shd", value: "1,0" },
        { key: "cftd", value: "1,no,2" },
        { key: "sy", value: "1,C2880" },
        { key: "ey", value: "1,48:00" },
        { key: "wc", value: "1,1000" },
        { key: "wt", value: "1,2880" },
      ],
      { isRoot: false, unitType: "n" },
    );

    const violations = evaluateScheduleDiagnosticViolations(
      createScheduleDocument(unit),
    );

    assert.deepStrictEqual(
      violations.map(({ ruleId, reason, evidence }) => ({
        ruleId,
        reason,
        key: evidence.key,
      })),
      [
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidParentScheduleRule,
          key: "ln",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidStartTime,
          key: "st",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidCycle,
          key: "cy",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidShiftDays,
          key: "shd",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidDaysFromStart,
          key: "cftd",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidStartDelayTime,
          key: "sy",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidEndDelayTime,
          key: "ey",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidStartConditionCount,
          key: "wc",
        },
        {
          ruleId: diagnosticRuleIds.scheduleRange,
          reason: scheduleRangeViolationReasons.invalidMonitoringEndTime,
          key: "wt",
        },
      ],
    );
  });

  test("emits start-date and weekly-day rule IDs with focused evidence", () => {
    const unit = createScheduleUnit([
      { key: "ty", value: "g" },
      { key: "sd", value: "1,2037/01/01", line: 4, column: 2, length: 2 },
      { key: "sd", value: "2,*15" },
      { key: "cy", value: "2,(2,w)", line: 7, column: 2, length: 2 },
    ]);

    const violations = evaluateScheduleDiagnosticViolations(
      createScheduleDocument(unit),
    );

    assert.deepStrictEqual(
      violations.map(({ ruleId, reason, evidence }) => ({
        ruleId,
        reason,
        key: evidence.key,
        line: evidence.line,
      })),
      [
        {
          ruleId: diagnosticRuleIds.scheduleStartDate,
          reason: scheduleStartDateViolationReasons.invalidStartDate,
          key: "sd",
          line: 4,
        },
        {
          ruleId: diagnosticRuleIds.scheduleWeeklyDay,
          reason: scheduleWeeklyDayViolationReasons.openOrClosedDayConflict,
          key: "cy",
          line: 7,
        },
      ],
    );
  });

  test("preserves schedule limit override and explicit target-type behavior", () => {
    const explicitTarget = createScheduleUnit([
      { key: "ty", value: "g" },
      { key: "sd", value: "1,2037/01/01" },
    ]);
    const inferredTarget = createScheduleUnit([
      { key: "st", value: "145,+48:00" },
    ]);

    assert.deepStrictEqual(
      evaluateScheduleDiagnosticViolations(
        createScheduleDocument(explicitTarget),
        { scheduleLimitYear: 2099 },
      ),
      [],
    );
    assert.deepStrictEqual(
      evaluateScheduleDiagnosticViolations(
        createScheduleDocument(inferredTarget),
      ),
      [],
    );
  });
});
