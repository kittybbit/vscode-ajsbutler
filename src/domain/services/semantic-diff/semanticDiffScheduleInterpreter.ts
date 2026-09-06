import {
  findAjsUnitParameters,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import {
  interpretScheduleDateRule,
  interpretStartTimeRule,
  interpretUnsupportedParameter,
  withUnpairedStartTime,
} from "./semanticDiffScheduleRuleInterpreter";
import type {
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleRuleInterpretation,
} from "./semanticDiffScheduleTypes";

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
    .map(interpretUnsupportedParameter)
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
