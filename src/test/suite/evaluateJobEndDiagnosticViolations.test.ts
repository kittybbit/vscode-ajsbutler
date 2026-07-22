import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { retryAbrDependencyViolationReasons } from "../../domain/services/diagnostics/DiagnosticViolation";
import { diagnosticRuleIds } from "../../domain/services/diagnostics/DiagnosticRuleId";
import {
  evaluateJobEndDiagnosticViolations,
  jobEndRangeViolationReasons,
  jobEndThresholdViolationReasons,
} from "../../domain/services/diagnostics/evaluateJobEndDiagnosticViolations";

const createJobEndUnit = (
  parameters: AjsParameter[],
  overrides: Partial<AjsUnit> = {},
): AjsUnit => ({
  id: overrides.id ?? "/root/job",
  name: overrides.name ?? "job",
  unitAttribute: overrides.unitAttribute ?? "",
  unitType: overrides.unitType ?? "j",
  absolutePath: overrides.absolutePath ?? "/root/job",
  depth: overrides.depth ?? 1,
  isRoot: overrides.isRoot ?? false,
  isRootJobnet: overrides.isRootJobnet ?? false,
  hasSchedule: overrides.hasSchedule ?? false,
  hasWaitedFor: overrides.hasWaitedFor ?? false,
  layout: overrides.layout ?? { h: 0, v: 0 },
  parameters,
  relations: overrides.relations ?? [],
  children: overrides.children ?? [],
});

const createJobEndDocument = (unit: AjsUnit): AjsDocument => ({
  rootUnits: [unit],
  warnings: [],
});

suite("Evaluate job-end diagnostic violations", () => {
  test("emits numeric range reasons in existing diagnostic order", () => {
    const unit = createJobEndUnit([
      { key: "ty", value: "qj" },
      { key: "wth", value: "2147483648" },
      { key: "tho", value: "-1" },
      { key: "rjs", value: "0" },
      { key: "rje", value: "4294967296" },
      { key: "rec", value: "13" },
      { key: "rei", value: "0" },
      { key: "abr", value: "y" },
    ]);

    const violations = evaluateJobEndDiagnosticViolations(
      createJobEndDocument(unit),
    );

    assert.deepStrictEqual(
      violations.map(({ ruleId, reason, evidence }) => ({
        ruleId,
        reason,
        key: evidence.key,
      })),
      [
        {
          ruleId: diagnosticRuleIds.jobEndRange,
          reason: jobEndRangeViolationReasons.invalidWarningThreshold,
          key: "wth",
        },
        {
          ruleId: diagnosticRuleIds.jobEndRange,
          reason: jobEndRangeViolationReasons.invalidAbnormalThreshold,
          key: "tho",
        },
        {
          ruleId: diagnosticRuleIds.jobEndRange,
          reason: jobEndRangeViolationReasons.invalidRetryStartCode,
          key: "rjs",
        },
        {
          ruleId: diagnosticRuleIds.jobEndRange,
          reason: jobEndRangeViolationReasons.invalidRetryEndCode,
          key: "rje",
        },
        {
          ruleId: diagnosticRuleIds.jobEndRange,
          reason: jobEndRangeViolationReasons.invalidRetryCount,
          key: "rec",
        },
        {
          ruleId: diagnosticRuleIds.jobEndRange,
          reason: jobEndRangeViolationReasons.invalidRetryInterval,
          key: "rei",
        },
      ],
    );
  });

  test("emits both focused threshold-ordering violations", () => {
    const unit = createJobEndUnit([
      { key: "ty", value: "j" },
      { key: "jd", value: "cod" },
      { key: "abr", value: "y" },
      { key: "wth", value: "20", line: 6, column: 4, length: 3 },
      { key: "tho", value: "10", line: 7, column: 4, length: 3 },
    ]);

    const violations = evaluateJobEndDiagnosticViolations(
      createJobEndDocument(unit),
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
          ruleId: diagnosticRuleIds.jobEndThreshold,
          reason: jobEndThresholdViolationReasons.warningNotLessThanAbnormal,
          key: "wth",
          line: 6,
        },
        {
          ruleId: diagnosticRuleIds.jobEndThreshold,
          reason: jobEndThresholdViolationReasons.abnormalNotGreaterThanWarning,
          key: "tho",
          line: 7,
        },
      ],
    );
  });

  test("preserves retry dependency ordering and effective defaults", () => {
    const invalidEndJudgment = createJobEndUnit([
      { key: "ty", value: "cj" },
      { key: "jd", value: "ab" },
      { key: "abr", value: "y" },
      { key: "rjs", value: "1" },
      { key: "rec", value: "3" },
    ]);
    const defaultAutomaticRetry = createJobEndUnit([
      { key: "ty", value: "j" },
      { key: "rje", value: "9" },
      { key: "rei", value: "1" },
    ]);

    const invalidEndJudgmentViolations = evaluateJobEndDiagnosticViolations(
      createJobEndDocument(invalidEndJudgment),
    );
    const defaultAutomaticRetryViolations = evaluateJobEndDiagnosticViolations(
      createJobEndDocument(defaultAutomaticRetry),
    );

    const summarizeRetryViolations = (
      violations: readonly {
        ruleId: string;
        reason: string;
        evidence: AjsParameter;
      }[],
    ): Array<{
      ruleId: string;
      reason: string;
      key: string;
    }> =>
      violations.map(({ ruleId, reason, evidence }) => ({
        ruleId,
        reason,
        key: evidence.key,
      }));

    assert.deepStrictEqual(
      summarizeRetryViolations(invalidEndJudgmentViolations),
      [
        {
          ruleId: diagnosticRuleIds.retryAbrDependency,
          reason:
            retryAbrDependencyViolationReasons.automaticRetryRequiresCodeEndJudgment,
          key: "abr",
        },
        {
          ruleId: diagnosticRuleIds.retryAbrDependency,
          reason:
            retryAbrDependencyViolationReasons.retryParameterRequiresCodeEndJudgment,
          key: "rjs",
        },
        {
          ruleId: diagnosticRuleIds.retryAbrDependency,
          reason:
            retryAbrDependencyViolationReasons.retryParameterRequiresCodeEndJudgment,
          key: "rec",
        },
      ],
    );
    assert.deepStrictEqual(
      summarizeRetryViolations(defaultAutomaticRetryViolations),
      [
        {
          ruleId: diagnosticRuleIds.retryAbrDependency,
          reason:
            retryAbrDependencyViolationReasons.retryParameterRequiresAutomaticRetry,
          key: "rje",
        },
        {
          ruleId: diagnosticRuleIds.retryAbrDependency,
          reason:
            retryAbrDependencyViolationReasons.retryParameterRequiresAutomaticRetry,
          key: "rei",
        },
      ],
    );
  });

  test("ignores unsupported or implicit target types", () => {
    const unsupported = createJobEndUnit([
      { key: "ty", value: "cpj" },
      { key: "rec", value: "13" },
    ]);
    const implicit = createJobEndUnit([{ key: "rec", value: "13" }]);

    assert.deepStrictEqual(
      evaluateJobEndDiagnosticViolations(createJobEndDocument(unsupported)),
      [],
    );
    assert.deepStrictEqual(
      evaluateJobEndDiagnosticViolations(createJobEndDocument(implicit)),
      [],
    );
  });
});
