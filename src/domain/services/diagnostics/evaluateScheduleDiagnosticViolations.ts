import {
  findAjsUnitParameter,
  findAjsUnitParameters,
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import type { DiagnosticViolation } from "./DiagnosticViolation";
import { diagnosticRuleIds } from "./DiagnosticRuleId";
import {
  DEFAULT_SCHEDULE_LIMIT_YEAR,
  hasInvalidExplicitWeeklyCycleScheduleCompatibility,
  isValidExplicitCycle,
  isValidExplicitDelayTime,
  isValidExplicitParentScheduleRule,
  isValidExplicitScheduleByDaysFromStart,
  isValidExplicitScheduleDate,
  isValidExplicitShiftDays,
  isValidExplicitStartTime,
  isValidExplicitWaitCount,
  isValidExplicitWaitTime,
  normalizeScheduleLimitYear,
} from "./ScheduleDiagnosticRules";

export const scheduleRangeViolationReasons = {
  invalidParentScheduleRule: "invalid-parent-schedule-rule",
  invalidStartTime: "invalid-start-time",
  invalidCycle: "invalid-cycle",
  invalidShiftDays: "invalid-shift-days",
  invalidDaysFromStart: "invalid-days-from-start",
  invalidStartDelayTime: "invalid-start-delay-time",
  invalidEndDelayTime: "invalid-end-delay-time",
  invalidStartConditionCount: "invalid-start-condition-count",
  invalidMonitoringEndTime: "invalid-monitoring-end-time",
} as const;

export type ScheduleRangeViolationReason =
  (typeof scheduleRangeViolationReasons)[keyof typeof scheduleRangeViolationReasons];

export const scheduleStartDateViolationReasons = {
  invalidStartDate: "invalid-start-date",
} as const;

export type ScheduleStartDateViolationReason =
  (typeof scheduleStartDateViolationReasons)[keyof typeof scheduleStartDateViolationReasons];

export const scheduleWeeklyDayViolationReasons = {
  openOrClosedDayConflict: "open-or-closed-day-conflict",
} as const;

export type ScheduleWeeklyDayViolationReason =
  (typeof scheduleWeeklyDayViolationReasons)[keyof typeof scheduleWeeklyDayViolationReasons];

export type ScheduleDiagnosticViolationReason =
  | ScheduleRangeViolationReason
  | ScheduleStartDateViolationReason
  | ScheduleWeeklyDayViolationReason;

export type ScheduleDiagnosticViolation =
  DiagnosticViolation<ScheduleDiagnosticViolationReason>;

export type EvaluateScheduleDiagnosticViolationsOptions = Readonly<{
  scheduleLimitYear?: number;
}>;

type ScheduleParameterRule = Readonly<{
  key: string;
  reason: ScheduleRangeViolationReason;
  isInvalid: (parameter: AjsParameter, unit: AjsUnit) => boolean;
}>;

const scheduleDiagnosticTargetTypes = new Set(["g", "n"]);

const scheduleParameterRules: readonly ScheduleParameterRule[] = [
  {
    key: "ln",
    reason: scheduleRangeViolationReasons.invalidParentScheduleRule,
    isInvalid: (parameter, unit) =>
      !isValidExplicitParentScheduleRule(parameter, unit),
  },
  {
    key: "st",
    reason: scheduleRangeViolationReasons.invalidStartTime,
    isInvalid: (parameter) => !isValidExplicitStartTime(parameter),
  },
  {
    key: "cy",
    reason: scheduleRangeViolationReasons.invalidCycle,
    isInvalid: (parameter) => !isValidExplicitCycle(parameter),
  },
  {
    key: "shd",
    reason: scheduleRangeViolationReasons.invalidShiftDays,
    isInvalid: (parameter) => !isValidExplicitShiftDays(parameter),
  },
  {
    key: "cftd",
    reason: scheduleRangeViolationReasons.invalidDaysFromStart,
    isInvalid: (parameter) =>
      !isValidExplicitScheduleByDaysFromStart(parameter),
  },
  {
    key: "sy",
    reason: scheduleRangeViolationReasons.invalidStartDelayTime,
    isInvalid: (parameter) => !isValidExplicitDelayTime(parameter),
  },
  {
    key: "ey",
    reason: scheduleRangeViolationReasons.invalidEndDelayTime,
    isInvalid: (parameter) => !isValidExplicitDelayTime(parameter),
  },
  {
    key: "wc",
    reason: scheduleRangeViolationReasons.invalidStartConditionCount,
    isInvalid: (parameter) => !isValidExplicitWaitCount(parameter),
  },
  {
    key: "wt",
    reason: scheduleRangeViolationReasons.invalidMonitoringEndTime,
    isInvalid: (parameter) => !isValidExplicitWaitTime(parameter),
  },
];

const buildScheduleViolation = (
  ruleId: ScheduleDiagnosticViolation["ruleId"],
  reason: ScheduleDiagnosticViolationReason,
  evidence: AjsParameter,
): ScheduleDiagnosticViolation => ({ ruleId, reason, evidence });

const evaluateScheduleDateViolations = (
  unit: AjsUnit,
  scheduleLimitYear: number,
): ScheduleDiagnosticViolation[] =>
  findAjsUnitParameters(unit, "sd").flatMap((parameter) =>
    isValidExplicitScheduleDate(parameter, scheduleLimitYear)
      ? []
      : [
          buildScheduleViolation(
            diagnosticRuleIds.scheduleStartDate,
            scheduleStartDateViolationReasons.invalidStartDate,
            parameter,
          ),
        ],
  );

const evaluateScheduleRangeViolations = (
  unit: AjsUnit,
): ScheduleDiagnosticViolation[] =>
  scheduleParameterRules.flatMap((rule) =>
    findAjsUnitParameters(unit, rule.key).flatMap((parameter) =>
      rule.isInvalid(parameter, unit)
        ? [
            buildScheduleViolation(
              diagnosticRuleIds.scheduleRange,
              rule.reason,
              parameter,
            ),
          ]
        : [],
    ),
  );

const evaluateWeeklyCycleCompatibilityViolations = (
  unit: AjsUnit,
): ScheduleDiagnosticViolation[] =>
  findAjsUnitParameters(unit, "cy").flatMap((parameter) =>
    hasInvalidExplicitWeeklyCycleScheduleCompatibility(parameter, unit)
      ? [
          buildScheduleViolation(
            diagnosticRuleIds.scheduleWeeklyDay,
            scheduleWeeklyDayViolationReasons.openOrClosedDayConflict,
            parameter,
          ),
        ]
      : [],
  );

const isScheduleDiagnosticTarget = (unit: AjsUnit): boolean => {
  const explicitUnitType = findAjsUnitParameter(unit, "ty")?.value;
  return explicitUnitType
    ? scheduleDiagnosticTargetTypes.has(explicitUnitType)
    : false;
};

export const evaluateScheduleDiagnosticViolations = (
  document: AjsDocument,
  options: EvaluateScheduleDiagnosticViolationsOptions = {},
): ScheduleDiagnosticViolation[] => {
  const scheduleLimitYear =
    normalizeScheduleLimitYear(options.scheduleLimitYear) ??
    DEFAULT_SCHEDULE_LIMIT_YEAR;

  return flattenAjsUnits(document.rootUnits)
    .filter(isScheduleDiagnosticTarget)
    .flatMap((unit) => [
      ...evaluateScheduleDateViolations(unit, scheduleLimitYear),
      ...evaluateScheduleRangeViolations(unit),
      ...evaluateWeeklyCycleCompatibilityViolations(unit),
    ]);
};
