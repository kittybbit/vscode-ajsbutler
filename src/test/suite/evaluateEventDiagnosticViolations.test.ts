import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { eventReceiveFilterViolationReasons } from "../../domain/services/diagnostics/DiagnosticViolation";
import { diagnosticRuleIds } from "../../domain/services/diagnostics/DiagnosticRuleId";
import {
  evaluateEventReceivingDiagnosticViolationGroups,
  evaluateEventSendingDiagnosticViolations,
  eventDiagnosticViolationReasons,
  type EventDiagnosticViolation,
} from "../../domain/services/diagnostics/evaluateEventDiagnosticViolations";

const createUnit = (
  parameters: AjsParameter[],
  overrides: Partial<AjsUnit> = {},
): AjsUnit => ({
  id: overrides.id ?? "/root/event",
  name: overrides.name ?? "event",
  unitAttribute: overrides.unitAttribute ?? "",
  unitType: overrides.unitType ?? "evwj",
  absolutePath: overrides.absolutePath ?? "/root/event",
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

const createStartConditionDocument = (eventUnit: AjsUnit): AjsDocument => {
  const parentId = "/root";
  const startCondition = createUnit([{ key: "ty", value: "rc" }], {
    id: "/root/.CONDITION",
    name: ".CONDITION",
    unitType: "rc",
    parentId,
  });
  const event = { ...eventUnit, parentId };
  const root = createUnit([{ key: "ty", value: "g" }], {
    id: parentId,
    name: "root",
    unitType: "g",
    depth: 0,
    isRoot: true,
    children: [startCondition, event],
  });
  return createDocument(root);
};

const summarize = (
  violations: readonly EventDiagnosticViolation[],
): Array<{ ruleId: string; reason: string; key: string }> =>
  violations.map(({ ruleId, reason, evidence }) => ({
    ruleId,
    reason,
    key: evidence.key,
  }));

suite("Evaluate JP1 event diagnostic violations", () => {
  test("emits event-sending violations in existing rule and unit order", () => {
    const invalidValues = createUnit(
      [
        { key: "ty", value: "evsj" },
        { key: "evhst", value: "a".repeat(256) },
        { key: "evsid", value: "2000" },
        { key: "evspl", value: "2" },
        { key: "evsrc", value: "1000" },
      ],
      { id: "/event1", unitType: "evsj" },
    );
    const missingHost = createUnit(
      [
        { key: "ty", value: "revsj" },
        { key: "evsrt", value: "y", line: 12, column: 4, length: 5 },
      ],
      { id: "/event2", unitType: "revsj" },
    );

    const violations = evaluateEventSendingDiagnosticViolations(
      createDocument(invalidValues, missingHost),
    );

    assert.deepStrictEqual(summarize(violations), [
      {
        ruleId: diagnosticRuleIds.eventHostLength,
        reason: eventDiagnosticViolationReasons.invalidHostLength,
        key: "evhst",
      },
      {
        ruleId: diagnosticRuleIds.eventSendIdRange,
        reason: eventDiagnosticViolationReasons.invalidSendingId,
        key: "evsid",
      },
      {
        ruleId: diagnosticRuleIds.eventArrivalRange,
        reason: eventDiagnosticViolationReasons.invalidArrivalCheckInterval,
        key: "evspl",
      },
      {
        ruleId: diagnosticRuleIds.eventArrivalRange,
        reason: eventDiagnosticViolationReasons.invalidArrivalCheckCount,
        key: "evsrc",
      },
      {
        ruleId: diagnosticRuleIds.eventArrivalHost,
        reason: eventDiagnosticViolationReasons.arrivalCheckRequiresHost,
        key: "evsrt",
      },
    ]);
    assert.strictEqual(violations[4]?.evidence.line, 12);
  });

  test("emits event-receiving violations in existing parameter-rule order", () => {
    const unit = createUnit([
      { key: "ty", value: "evwj" },
      { key: "etm", value: "0" },
      { key: "ha", value: "maybe" },
      { key: "ets", value: "stop" },
      { key: "evuid", value: "-2" },
      { key: "evgid", value: "invalid" },
      { key: "evpid", value: "10000000000" },
      { key: "evusr", value: "plain" },
      { key: "evgrp", value: `"${"a".repeat(21)}"` },
      { key: "evhst", value: "あ".repeat(86) },
      { key: "evwid", value: "123456789:1" },
      { key: "evipa", value: "256.0.0.1" },
      { key: "evwms", value: "bare" },
      { key: "evdet", value: "bare" },
      { key: "evwfr", value: "attribute:value" },
      { key: "evtmc", value: 'd:""' },
      { key: "evesc", value: "0" },
    ]);

    const [group] = evaluateEventReceivingDiagnosticViolationGroups(
      createDocument(unit),
    );
    assert.ok(group);

    assert.deepStrictEqual(
      group.violations.map(({ ruleId, reason, evidence }) => [
        ruleId,
        reason,
        evidence.key,
      ]),
      [
        [
          diagnosticRuleIds.eventReceiveTimeout,
          eventDiagnosticViolationReasons.invalidTimeoutPeriod,
          "etm",
        ],
        [
          diagnosticRuleIds.eventReceiveTimeout,
          eventDiagnosticViolationReasons.invalidHoldAttribute,
          "ha",
        ],
        [
          diagnosticRuleIds.eventReceiveTimeout,
          eventDiagnosticViolationReasons.invalidTimeoutAction,
          "ets",
        ],
        [
          diagnosticRuleIds.eventReceiveNumericId,
          eventDiagnosticViolationReasons.invalidIssueSourceUserId,
          "evuid",
        ],
        [
          diagnosticRuleIds.eventReceiveNumericId,
          eventDiagnosticViolationReasons.invalidIssueSourceGroupId,
          "evgid",
        ],
        [
          diagnosticRuleIds.eventReceiveNumericId,
          eventDiagnosticViolationReasons.invalidIssueSourceProcessId,
          "evpid",
        ],
        [
          diagnosticRuleIds.eventReceiveFilter,
          eventDiagnosticViolationReasons.invalidIssueSourceUserName,
          "evusr",
        ],
        [
          diagnosticRuleIds.eventReceiveFilter,
          eventDiagnosticViolationReasons.invalidIssueSourceGroupName,
          "evgrp",
        ],
        [
          diagnosticRuleIds.eventHostLength,
          eventDiagnosticViolationReasons.invalidHostLength,
          "evhst",
        ],
        [
          diagnosticRuleIds.eventReceiveFormat,
          eventDiagnosticViolationReasons.invalidReceivingId,
          "evwid",
        ],
        [
          diagnosticRuleIds.eventReceiveFormat,
          eventDiagnosticViolationReasons.invalidSourceIpAddress,
          "evipa",
        ],
        [
          diagnosticRuleIds.eventReceiveFilter,
          eventDiagnosticViolationReasons.invalidMessageFilter,
          "evwms",
        ],
        [
          diagnosticRuleIds.eventReceiveFilter,
          eventDiagnosticViolationReasons.invalidDetailedInformationFilter,
          "evdet",
        ],
        [
          diagnosticRuleIds.eventReceiveFilter,
          eventReceiveFilterViolationReasons.invalidShape,
          "evwfr",
        ],
        [
          diagnosticRuleIds.eventReceiveFilter,
          eventDiagnosticViolationReasons.invalidEndJudgmentCondition,
          "evtmc",
        ],
        [
          diagnosticRuleIds.eventReceiveScope,
          eventDiagnosticViolationReasons.invalidSearchCondition,
          "evesc",
        ],
      ],
    );
    assert.deepStrictEqual(group.startConditionViolations, []);
  });

  test("keeps evwfr shape and first aggregate crossing as separate reasons", () => {
    const unit = createUnit([
      { key: "ty", value: "revwj" },
      { key: "evwfr", value: `${"a".repeat(2042)}` },
      { key: "evwfr", value: 'later:"value"' },
    ]);

    const [group] = evaluateEventReceivingDiagnosticViolationGroups(
      createDocument(unit),
    );
    assert.ok(group);

    assert.deepStrictEqual(summarize(group.violations), [
      {
        ruleId: diagnosticRuleIds.eventReceiveFilter,
        reason: eventReceiveFilterViolationReasons.invalidShape,
        key: "evwfr",
      },
      {
        ruleId: diagnosticRuleIds.eventReceiveFilter,
        reason: eventReceiveFilterViolationReasons.aggregateByteLimitExceeded,
        key: "evwfr",
      },
    ]);
    assert.strictEqual(group.violations[1]?.evidence, unit.parameters[1]);
  });

  test("preserves timeout start-condition first-hit ordering", () => {
    const eventUnit = createUnit([
      { key: "ty", value: "evwj" },
      { key: "etm", value: "10" },
      { key: "etm", value: "20" },
      { key: "ha", value: "y" },
      { key: "ets", value: "wr" },
    ]);
    const [group] = evaluateEventReceivingDiagnosticViolationGroups(
      createStartConditionDocument(eventUnit),
    );
    assert.ok(group);

    assert.deepStrictEqual(summarize(group.startConditionViolations), [
      {
        ruleId: diagnosticRuleIds.eventReceiveTimeout,
        reason: eventDiagnosticViolationReasons.timeoutPeriodInStartCondition,
        key: "etm",
      },
      {
        ruleId: diagnosticRuleIds.eventReceiveTimeout,
        reason: eventDiagnosticViolationReasons.holdAttributeInStartCondition,
        key: "ha",
      },
      {
        ruleId: diagnosticRuleIds.eventReceiveTimeout,
        reason: eventDiagnosticViolationReasons.timeoutActionInStartCondition,
        key: "ets",
      },
    ]);
    assert.strictEqual(
      group.startConditionViolations[0]?.evidence,
      group.unit.parameters[1],
    );
  });

  test("accepts defaults and event regular-expression allowances", () => {
    const unit = createUnit([
      { key: "ty", value: "evwj" },
      { key: "evusr", value: '"ops.*"' },
      { key: "evgrp", value: '"admins"' },
      { key: "evhst", value: "*" },
      { key: "evwms", value: '"message.*"' },
      { key: "evdet", value: '"detail.*"' },
      { key: "evwfr", value: '?AJS2.EVENT?:"value"' },
    ]);
    const [group] = evaluateEventReceivingDiagnosticViolationGroups(
      createDocument(unit),
    );

    assert.ok(group);
    assert.deepStrictEqual(group.violations, []);
    assert.deepStrictEqual(group.startConditionViolations, []);
  });

  test("ignores unsupported and implicit target types", () => {
    const unsupported = createUnit([
      { key: "ty", value: "j" },
      { key: "evsid", value: "invalid" },
    ]);
    const implicit = createUnit([{ key: "evwid", value: "invalid" }]);

    assert.deepStrictEqual(
      evaluateEventSendingDiagnosticViolations(createDocument(unsupported)),
      [],
    );
    assert.deepStrictEqual(
      evaluateEventReceivingDiagnosticViolationGroups(createDocument(implicit)),
      [],
    );
  });
});
