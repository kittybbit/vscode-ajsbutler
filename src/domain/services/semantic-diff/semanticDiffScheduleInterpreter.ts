import {
  findAjsUnitParameters,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import { interpretScheduleDateValue } from "../../models/parameters/scheduleDateInterpreter";
import {
  parseCycleValue,
  parseClosedDaySubstitutionValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseShiftDaysValue,
  parseStartTimeValue,
} from "../../models/parameters/scheduleRuleHelpers";
import type {
  SemanticDiffScheduleEvidence,
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleRuleInterpretation,
  SemanticDiffScheduleStatus,
  SemanticDiffScheduleUnsupportedReason,
} from "./semanticDiffScheduleTypes";

const unsupportedParameterReasons: ReadonlyMap<
  string,
  SemanticDiffScheduleUnsupportedReason
> = new Map([
  ["cy", "cycle-schedule"],
  ["sh", "closed-day-substitution"],
  ["shd", "shift-days"],
  ["jc", "calendar-selection"],
  ["ln", "inherited-parent-rule"],
  ["cftd", "days-from-start"],
]);

const unsupportedParameterEvidence = (parameter: AjsParameter): string =>
  `schedule:${parameter.key}:unsupported:${parameter.value}`;

const invalidParameterEvidence = (
  parameter: AjsParameter,
  rule?: number,
): string =>
  `schedule:${parameter.key}:invalid:${rule === undefined ? parameter.value : rule}`;

const calendarIndependentDateEvidence = (
  date: ReturnType<typeof interpretScheduleDateValue>,
): string | undefined => {
  if (!date || date.year === undefined || date.month === undefined) {
    return undefined;
  }
  if (date.day.kind === "backward" && date.day.prefix === undefined) {
    return "JP1-PARAM-SCHEDULE-MONTH-END-001";
  }
  if (date.day.kind === "weekday" && date.day.prefix === "") {
    return "JP1-PARAM-SCHEDULE-WEEKDAY-001";
  }
  return undefined;
};

const evidence = (
  parameter: AjsParameter,
  id: string,
  rule?: number,
  rawParameters: AjsParameter[] = [parameter],
): SemanticDiffScheduleEvidence => ({
  id,
  rawParameters: [...rawParameters],
  ...(rule === undefined ? {} : { rule }),
});

const ruleResult = (input: {
  parameter: AjsParameter;
  status: SemanticDiffScheduleStatus;
  id: string;
  rule?: number;
  reason?: SemanticDiffScheduleUnsupportedReason;
  date?: ReturnType<typeof interpretScheduleDateValue>;
  startTime?: ReturnType<typeof parseStartTimeValue>;
  rawParameters?: AjsParameter[];
}): SemanticDiffScheduleRuleInterpretation => ({
  parameter: input.parameter,
  ...(input.rule === undefined ? {} : { rule: input.rule }),
  status: input.status,
  ...(input.reason === undefined ? {} : { reason: input.reason }),
  evidence: evidence(
    input.parameter,
    input.id,
    input.rule,
    input.rawParameters,
  ),
  ...(input.date === undefined ? {} : { date: input.date }),
  ...(input.startTime === undefined ? {} : { startTime: input.startTime }),
});

const interpretScheduleDateRule = (
  parameter: AjsParameter,
): SemanticDiffScheduleRuleInterpretation => {
  const date = interpretScheduleDateValue(parameter.value);
  if (!date) {
    return ruleResult({
      parameter,
      status: "unsupported",
      id: unsupportedParameterEvidence(parameter),
      reason: "unsupported-schedule-date",
    });
  }
  if (date.day.kind === "ud") {
    if (date.rule !== 0) {
      return ruleResult({
        parameter,
        status: "invalid",
        id: `schedule:sd:ud-nonzero-invalid:${date.rule}`,
        rule: date.rule,
        reason: "unsupported-schedule-date",
        date,
      });
    }
    return ruleResult({
      parameter,
      status: "no-runs",
      id: "JP1-PARAM-SCHEDULE-UD-001",
      rule: date.rule,
      date,
    });
  }
  if (date.day.kind !== "calendar") {
    const calendarIndependentEvidence = calendarIndependentDateEvidence(date);
    if (calendarIndependentEvidence) {
      return ruleResult({
        parameter,
        status: "supported",
        id: calendarIndependentEvidence,
        rule: date.rule,
        date,
      });
    }
    return ruleResult({
      parameter,
      status: "unsupported",
      id: `schedule:sd:unsupported:${date.rule}`,
      rule: date.rule,
      reason: "unsupported-schedule-date",
      date,
    });
  }
  return ruleResult({
    parameter,
    status: "supported",
    id: `schedule:sd:supported:${date.rule}`,
    rule: date.rule,
    date,
  });
};

const interpretStartTimeRule = (
  parameter: AjsParameter,
): SemanticDiffScheduleRuleInterpretation => {
  const parsed = parseStartTimeValue(parameter.value);
  if (!parsed || !/^\d{2}:\d{2}$/.test(parsed.value)) {
    return ruleResult({
      parameter,
      status: "invalid",
      id: invalidParameterEvidence(parameter, parsed?.rule),
      rule: parsed?.rule,
      reason: "invalid-start-time",
      startTime: parsed,
    });
  }
  const [hours, minutes] = parsed.value.split(":").map(Number);
  if (hours >= 24 || minutes >= 60) {
    return ruleResult({
      parameter,
      status: "invalid",
      id: invalidParameterEvidence(parameter, parsed.rule),
      rule: parsed.rule,
      reason: "invalid-start-time",
      startTime: parsed,
    });
  }
  return ruleResult({
    parameter,
    status: "supported",
    id: `schedule:st:supported:${parsed.rule}`,
    rule: parsed.rule,
    startTime: parsed,
  });
};

const interpretedUnsupportedParameter = (
  parameter: AjsParameter,
): SemanticDiffScheduleRuleInterpretation | undefined => {
  const reason = unsupportedParameterReasons.get(parameter.key);
  if (!reason) {
    return undefined;
  }
  const parsed =
    parameter.key === "cy"
      ? parseCycleValue(parameter.value)
      : parameter.key === "sh"
        ? parseClosedDaySubstitutionValue(parameter.value)
        : parameter.key === "shd"
          ? parseShiftDaysValue(parameter.value)
          : parameter.key === "ln"
            ? parseParentScheduleRuleValue(parameter.value)
            : parameter.key === "cftd"
              ? parseScheduleByDaysFromStartValue(parameter.value)
              : undefined;
  const rule = parsed?.rule;
  return ruleResult({
    parameter,
    status: "unsupported",
    id: unsupportedParameterEvidence(parameter),
    rule,
    reason,
  });
};

const withUnpairedStartTime = (
  result: SemanticDiffScheduleRuleInterpretation,
  scheduleRules: Set<number>,
): SemanticDiffScheduleRuleInterpretation => {
  if (
    result.status !== "supported" ||
    result.rule === undefined ||
    scheduleRules.has(result.rule)
  ) {
    return result;
  }
  return ruleResult({
    parameter: result.parameter,
    status: "invalid",
    id: `schedule:st:unpaired:${result.rule}`,
    rule: result.rule,
    reason: "unpaired-start-time",
    startTime: result.startTime,
  });
};

/** Interpret one normalized unit without reading a comparison period. */
export const interpretSchedule = (
  input: AjsUnit | { unit: AjsUnit },
): SemanticDiffScheduleInterpretation => {
  const unit = "unit" in input ? input.unit : input;
  const scheduleDateRules = findAjsUnitParameters(unit, "sd").map(
    interpretScheduleDateRule,
  );
  const dateRuleNumbers = new Set(
    scheduleDateRules
      .map((rule) => rule.rule)
      .filter((rule): rule is number => rule !== undefined),
  );
  const startTimeRules = findAjsUnitParameters(unit, "st").map((parameter) =>
    withUnpairedStartTime(interpretStartTimeRule(parameter), dateRuleNumbers),
  );
  const otherRules = unit.parameters
    .map(interpretedUnsupportedParameter)
    .filter(
      (rule): rule is SemanticDiffScheduleRuleInterpretation =>
        rule !== undefined,
    );
  const rules = [...scheduleDateRules, ...startTimeRules, ...otherRules];
  return {
    unit,
    rules,
    scheduleDateRules,
    startTimeRules,
    hasRuleZeroUndefined: scheduleDateRules.some(
      (rule) => rule.status === "no-runs" && rule.rule === 0,
    ),
  };
};
