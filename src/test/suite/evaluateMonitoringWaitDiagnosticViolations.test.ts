import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { diagnosticRuleIds } from "../../domain/services/diagnostics/DiagnosticRuleId";
import {
  evaluateEventReceivingExecutionTimeContextViolations,
  evaluateEventReceivingExecutionTimeRangeViolations,
  evaluateExecutionIntervalControlDiagnosticViolations,
  evaluateFileMonitoringDiagnosticViolations,
  monitoringWaitViolationReasons,
  type MonitoringWaitDiagnosticViolation,
} from "../../domain/services/diagnostics/evaluateMonitoringWaitDiagnosticViolations";

const createUnit = (
  parameters: AjsParameter[],
  overrides: Partial<AjsUnit> = {},
): AjsUnit => ({
  id: overrides.id ?? "/root/unit",
  name: overrides.name ?? "unit",
  unitAttribute: overrides.unitAttribute ?? "",
  unitType: overrides.unitType ?? "flwj",
  absolutePath: overrides.absolutePath ?? "/root/unit",
  depth: overrides.depth ?? 1,
  parentId: overrides.parentId,
  isRoot: overrides.isRoot ?? false,
  isRootJobnet: overrides.isRootJobnet ?? false,
  hasSchedule: overrides.hasSchedule ?? false,
  hasWaitedFor: overrides.hasWaitedFor ?? false,
  layout: overrides.layout ?? { h: 0, v: 0 },
  parameters,
  relations: overrides.relations ?? [],
  children: overrides.children ?? [],
});

const createDocument = (...units: AjsUnit[]): AjsDocument => ({
  rootUnits: units,
  warnings: [],
});

const createStartConditionDocument = (...units: AjsUnit[]): AjsDocument => {
  const parentId = "/root";
  const startCondition = createUnit([{ key: "ty", value: "rc" }], {
    id: "/root/.CONDITION",
    name: ".CONDITION",
    unitType: "rc",
    parentId,
  });
  const children = [
    startCondition,
    ...units.map((unit) => ({ ...unit, parentId })),
  ];
  const root = createUnit([{ key: "ty", value: "g" }], {
    id: parentId,
    name: "root",
    unitType: "g",
    depth: 0,
    isRoot: true,
    children,
  });
  return createDocument(root);
};

const summarize = (
  violations: readonly MonitoringWaitDiagnosticViolation[],
): Array<{ ruleId: string; reason: string; key: string }> =>
  violations.map(({ ruleId, reason, evidence }) => ({
    ruleId,
    reason,
    key: evidence.key,
  }));

suite("Evaluate monitoring and wait diagnostic violations", () => {
  test("preserves file-monitoring rule order, defaults, and first-hit context", () => {
    const fileMonitoring = createUnit([
      { key: "ty", value: "flwj" },
      { key: "flwf", value: '""' },
      { key: "flwf", value: '"logs/*.txt"' },
      { key: "flwi", value: "9" },
      { key: "flwi", value: "601" },
      { key: "flwc", value: "d:s" },
      { key: "flco", value: "y" },
      { key: "fd", value: "0" },
      { key: "ets", value: "xx" },
    ]);

    const violations = evaluateFileMonitoringDiagnosticViolations(
      createStartConditionDocument(fileMonitoring),
    );

    assert.deepStrictEqual(summarize(violations), [
      {
        ruleId: diagnosticRuleIds.stringFamilyConstraint,
        reason: monitoringWaitViolationReasons.invalidFileNameByteLength,
        key: "flwf",
      },
      {
        ruleId: diagnosticRuleIds.stringFamilyConstraint,
        reason: monitoringWaitViolationReasons.invalidMonitoringInterval,
        key: "flwi",
      },
      {
        ruleId: diagnosticRuleIds.stringFamilyConstraint,
        reason:
          monitoringWaitViolationReasons.wildcardWithShortMonitoringInterval,
        key: "flwf",
      },
      {
        ruleId: diagnosticRuleIds.fileMonitorCondition,
        reason: monitoringWaitViolationReasons.invalidMonitoringCondition,
        key: "flwc",
      },
      {
        ruleId: diagnosticRuleIds.fileMonitorOutput,
        reason:
          monitoringWaitViolationReasons.fileCloseRequiresCreationMonitoring,
        key: "flco",
      },
      {
        ruleId: diagnosticRuleIds.waitFdContext,
        reason: monitoringWaitViolationReasons.invalidExecutionTime,
        key: "fd",
      },
      {
        ruleId: diagnosticRuleIds.waitEtsValue,
        reason: monitoringWaitViolationReasons.invalidEventTimeoutAction,
        key: "ets",
      },
      {
        ruleId: diagnosticRuleIds.waitFdContext,
        reason: monitoringWaitViolationReasons.executionTimeInStartCondition,
        key: "fd",
      },
    ]);
  });

  test("accepts file-monitoring and interval-control effective defaults", () => {
    const fileMonitoring = createUnit([
      { key: "ty", value: "rflwj" },
      { key: "flwf", value: '"logs/*.txt"' },
      { key: "flco", value: "y" },
    ]);
    const intervalControl = createUnit([{ key: "ty", value: "rtmwj" }], {
      id: "/root/interval",
      unitType: "rtmwj",
    });

    assert.deepStrictEqual(
      evaluateFileMonitoringDiagnosticViolations(
        createDocument(fileMonitoring),
      ),
      [],
    );
    assert.deepStrictEqual(
      evaluateExecutionIntervalControlDiagnosticViolations(
        createDocument(intervalControl),
      ),
      [],
    );
  });

  test("emits interval-control ranges and end-context violations in existing order", () => {
    const intervalControl = createUnit(
      [
        { key: "ty", value: "tmwj" },
        { key: "tmitv", value: "0" },
        { key: "etn", value: "y" },
        { key: "fd", value: "1441" },
        { key: "ets", value: "invalid" },
      ],
      { unitType: "tmwj" },
    );

    assert.deepStrictEqual(
      summarize(
        evaluateExecutionIntervalControlDiagnosticViolations(
          createDocument(intervalControl),
        ),
      ),
      [
        {
          ruleId: diagnosticRuleIds.intervalControlRange,
          reason: monitoringWaitViolationReasons.invalidExecutionInterval,
          key: "tmitv",
        },
        {
          ruleId: diagnosticRuleIds.waitFdContext,
          reason: monitoringWaitViolationReasons.invalidExecutionTime,
          key: "fd",
        },
        {
          ruleId: diagnosticRuleIds.waitEtsValue,
          reason: monitoringWaitViolationReasons.invalidEventTimeoutAction,
          key: "ets",
        },
        {
          ruleId: diagnosticRuleIds.intervalControlEndContext,
          reason: monitoringWaitViolationReasons.endTimingOutsideStartCondition,
          key: "etn",
        },
      ],
    );
  });

  test("preserves invalid end-timing and start-condition execution-time evidence", () => {
    const intervalControl = createUnit(
      [
        { key: "ty", value: "rtmwj" },
        { key: "etn", value: "maybe" },
        { key: "fd", value: "10", line: 8, column: 4, length: 5 },
      ],
      { unitType: "rtmwj" },
    );

    const violations = evaluateExecutionIntervalControlDiagnosticViolations(
      createStartConditionDocument(intervalControl),
    );

    assert.deepStrictEqual(summarize(violations), [
      {
        ruleId: diagnosticRuleIds.intervalControlRange,
        reason: monitoringWaitViolationReasons.invalidEndTiming,
        key: "etn",
      },
      {
        ruleId: diagnosticRuleIds.waitFdContext,
        reason: monitoringWaitViolationReasons.executionTimeInStartCondition,
        key: "fd",
      },
    ]);
    assert.strictEqual(violations[1]?.evidence.line, 8);
  });

  test("evaluates event-receiving execution time at its existing insertion points", () => {
    const eventReceiving = createUnit(
      [
        { key: "ty", value: "evwj" },
        { key: "fd", value: "0" },
      ],
      { unitType: "evwj" },
    );
    const document = createStartConditionDocument(eventReceiving);
    const eventUnit = document.rootUnits[0]?.children[1];
    assert.ok(eventUnit);

    assert.deepStrictEqual(
      summarize(evaluateEventReceivingExecutionTimeRangeViolations(eventUnit)),
      [
        {
          ruleId: diagnosticRuleIds.waitFdContext,
          reason: monitoringWaitViolationReasons.invalidExecutionTime,
          key: "fd",
        },
      ],
    );
    assert.deepStrictEqual(
      summarize(
        evaluateEventReceivingExecutionTimeContextViolations(
          document,
          eventUnit,
        ),
      ),
      [
        {
          ruleId: diagnosticRuleIds.waitFdContext,
          reason: monitoringWaitViolationReasons.executionTimeInStartCondition,
          key: "fd",
        },
      ],
    );
  });

  test("ignores unsupported and implicit target types", () => {
    const unsupported = createUnit([
      { key: "ty", value: "j" },
      { key: "fd", value: "0" },
      { key: "ets", value: "invalid" },
    ]);
    const implicit = createUnit([{ key: "flwi", value: "0" }]);

    assert.deepStrictEqual(
      evaluateFileMonitoringDiagnosticViolations(createDocument(unsupported)),
      [],
    );
    assert.deepStrictEqual(
      evaluateFileMonitoringDiagnosticViolations(createDocument(implicit)),
      [],
    );
    assert.deepStrictEqual(
      evaluateEventReceivingExecutionTimeRangeViolations(unsupported),
      [],
    );
  });
});
