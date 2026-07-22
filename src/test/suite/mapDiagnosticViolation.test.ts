import * as assert from "assert";
import { createMapDiagnosticViolation } from "../../application/editor-feedback/mapDiagnosticViolation";
import { syntaxDiagnosticCategories } from "../../application/editor-feedback/syntaxDiagnosticTypes";
import {
  eventReceiveFilterViolationReasons,
  retryAbrDependencyViolationReasons,
  type DiagnosticViolation,
  type EventReceiveFilterViolationReason,
  type RetryAbrDependencyViolationReason,
} from "../../domain/services/diagnostics/DiagnosticViolation";
import {
  diagnosticRuleIds,
  type DiagnosticRuleId,
} from "../../domain/services/diagnostics/DiagnosticRuleId";

suite("Map diagnostic violation", () => {
  test("keeps diagnostic rule IDs stable and unique", () => {
    const ruleIds: DiagnosticRuleId[] = Object.values(diagnosticRuleIds);

    assert.strictEqual(ruleIds.length, 25);
    assert.strictEqual(new Set(ruleIds).size, ruleIds.length);
  });

  test("maps distinct evwfr reasons for the same rule and evidence", () => {
    const evidence = {
      key: "evwfr",
      value: 'attribute:"value"',
      line: 7,
      column: 4,
      length: 5,
    };
    const violations: DiagnosticViolation<EventReceiveFilterViolationReason>[] =
      [
        {
          ruleId: diagnosticRuleIds.eventReceiveFilter,
          reason: eventReceiveFilterViolationReasons.invalidShape,
          evidence,
        },
        {
          ruleId: diagnosticRuleIds.eventReceiveFilter,
          reason: eventReceiveFilterViolationReasons.aggregateByteLimitExceeded,
          evidence,
        },
      ];
    const mapViolation = createMapDiagnosticViolation({
      [eventReceiveFilterViolationReasons.invalidShape]: {
        message: "shape failure",
        category: syntaxDiagnosticCategories.eventReceiving,
      },
      [eventReceiveFilterViolationReasons.aggregateByteLimitExceeded]: {
        message: "aggregate failure",
        category: syntaxDiagnosticCategories.eventReceiving,
      },
    });

    assert.deepStrictEqual(violations.map(mapViolation), [
      {
        line: 7,
        column: 4,
        length: 5,
        message: "shape failure",
        severity: "error",
        category: syntaxDiagnosticCategories.eventReceiving,
        ruleId: diagnosticRuleIds.eventReceiveFilter,
      },
      {
        line: 7,
        column: 4,
        length: 5,
        message: "aggregate failure",
        severity: "error",
        category: syntaxDiagnosticCategories.eventReceiving,
        ruleId: diagnosticRuleIds.eventReceiveFilter,
      },
    ]);
  });

  test("maps separate retry dependency reasons without domain predicates", () => {
    const evidence = { key: "arfd", value: "5" };
    const violations: DiagnosticViolation<RetryAbrDependencyViolationReason>[] =
      Object.values(retryAbrDependencyViolationReasons).map((reason) => ({
        ruleId: diagnosticRuleIds.retryAbrDependency,
        reason,
        evidence,
      }));
    const mapViolation = createMapDiagnosticViolation({
      [retryAbrDependencyViolationReasons.automaticRetryRequiresCodeEndJudgment]:
        {
          message: "automatic retry dependency",
          category: syntaxDiagnosticCategories.jobEndJudgment,
        },
      [retryAbrDependencyViolationReasons.retryParameterRequiresCodeEndJudgment]:
        {
          message: "retry parameter end-judgment dependency",
          category: syntaxDiagnosticCategories.jobEndJudgment,
        },
      [retryAbrDependencyViolationReasons.retryParameterRequiresAutomaticRetry]:
        {
          message: "retry parameter automatic-retry dependency",
          category: syntaxDiagnosticCategories.jobEndJudgment,
        },
    });

    assert.deepStrictEqual(
      violations.map(mapViolation).map(({ line, column, length, message }) => ({
        line,
        column,
        length,
        message,
      })),
      [
        {
          line: 1,
          column: 0,
          length: 4,
          message: "automatic retry dependency",
        },
        {
          line: 1,
          column: 0,
          length: 4,
          message: "retry parameter end-judgment dependency",
        },
        {
          line: 1,
          column: 0,
          length: 4,
          message: "retry parameter automatic-retry dependency",
        },
      ],
    );
  });
});
