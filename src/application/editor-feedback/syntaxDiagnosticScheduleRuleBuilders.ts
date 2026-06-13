import type { Unit } from "../../domain/values/Unit";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
  type UnitParameterDiagnosticRule,
} from "./syntaxDiagnosticCore";
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
} from "./syntaxDiagnosticScheduleRules";
import { findParameters, findUnitsByTypes } from "./syntaxDiagnosticUnitLookup";
import { scheduleRuleDiagnosticTargetTypes } from "./syntaxDiagnosticTargetTypes";

const scheduleRuleParameterDiagnosticRules = (
  rootUnits: Unit[],
): readonly UnitParameterDiagnosticRule[] => [
  {
    key: "ln",
    message:
      "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
    isInvalid: (parameter, currentUnit) =>
      !isValidExplicitParentScheduleRule(parameter, currentUnit, rootUnits),
  },
  {
    key: "st",
    message:
      "Start time (st) must use schedule rule numbers 1..144 and times between 00:00 and 47:59.",
    isInvalid: (parameter) => !isValidExplicitStartTime(parameter),
  },
  {
    key: "cy",
    message:
      "Cycle value (cy) must use schedule rule numbers 1..144 and cycle ranges y=1..10, m=1..12, w=1..5, or d=1..31.",
    isInvalid: (parameter) => !isValidExplicitCycle(parameter),
  },
  {
    key: "shd",
    message:
      "Maximum shift days (shd) must use schedule rule numbers 1..144 and values between 1 and 31.",
    isInvalid: (parameter) => !isValidExplicitShiftDays(parameter),
  },
  {
    key: "cftd",
    message:
      "Days-from-start rule (cftd) must use schedule rule numbers 1..144 with valid no/be/af/db/da ranges.",
    isInvalid: (parameter) =>
      !isValidExplicitScheduleByDaysFromStart(parameter),
  },
  {
    key: "sy",
    message:
      "Start delay time (sy) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
    isInvalid: (parameter) => !isValidExplicitDelayTime(parameter),
  },
  {
    key: "ey",
    message:
      "End delay time (ey) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
    isInvalid: (parameter) => !isValidExplicitDelayTime(parameter),
  },
  {
    key: "wc",
    message:
      "Start-condition count (wc) must use schedule rule numbers 1..144 and values no, un, or 1..999.",
    isInvalid: (parameter) => !isValidExplicitWaitCount(parameter),
  },
  {
    key: "wt",
    message:
      "Monitoring end time (wt) must use schedule rule numbers 1..144 and values no, un, 00:00-47:59, or 1..2879 minutes.",
    isInvalid: (parameter) => !isValidExplicitWaitTime(parameter),
  },
];

const buildScheduleDateDiagnostics = (
  unit: Unit,
  options: BuildSyntaxDiagnosticsOptions,
): SyntaxDiagnosticDto[] =>
  findParameters(unit, "sd").flatMap((parameter) =>
    isValidExplicitScheduleDate(
      parameter,
      normalizeScheduleLimitYear(options.scheduleLimitYear) ??
        DEFAULT_SCHEDULE_LIMIT_YEAR,
    )
      ? []
      : [
          buildDiagnostic(
            parameter,
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
          ),
        ],
  );

const buildWeeklyCycleCompatibilityDiagnostics = (
  unit: Unit,
): SyntaxDiagnosticDto[] =>
  findParameters(unit, "cy").flatMap((parameter) =>
    hasInvalidExplicitWeeklyCycleScheduleCompatibility(parameter, unit)
      ? [
          buildDiagnostic(
            parameter,
            "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
          ),
        ]
      : [],
  );

export const buildScheduleRuleDiagnostics = (
  rootUnits: Unit[],
  options: BuildSyntaxDiagnosticsOptions,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, scheduleRuleDiagnosticTargetTypes).flatMap(
    (unit) => [
      ...buildScheduleDateDiagnostics(unit, options),
      ...collectRuleDiagnostics(
        unit,
        scheduleRuleParameterDiagnosticRules(rootUnits),
      ),
      ...buildWeeklyCycleCompatibilityDiagnostics(unit),
    ],
  );
