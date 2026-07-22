import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  evaluateScheduleDiagnosticViolations,
  scheduleRangeViolationReasons,
  scheduleStartDateViolationReasons,
  scheduleWeeklyDayViolationReasons,
  type ScheduleDiagnosticViolationReason,
} from "../../domain/services/diagnostics/evaluateScheduleDiagnosticViolations";
import { createMapDiagnosticViolation } from "./mapDiagnosticViolation";
import type {
  BuildSyntaxDiagnosticsOptions,
  SyntaxDiagnosticDto,
} from "./syntaxDiagnosticTypes";
import { syntaxDiagnosticCategories } from "./syntaxDiagnosticTypes";

const scheduleRuleCategory = syntaxDiagnosticCategories.scheduleRule;

const mapScheduleDiagnosticViolation =
  createMapDiagnosticViolation<ScheduleDiagnosticViolationReason>({
    [scheduleRangeViolationReasons.invalidParentScheduleRule]: {
      message:
        "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidStartTime]: {
      message:
        "Start time (st) must use schedule rule numbers 1..144 and times between 00:00 and 47:59.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidCycle]: {
      message:
        "Cycle value (cy) must use schedule rule numbers 1..144 and cycle ranges y=1..9, m=1..12, w=1..5, or d=1..31.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidShiftDays]: {
      message:
        "Maximum shift days (shd) must use schedule rule numbers 1..144 and values between 1 and 31.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidDaysFromStart]: {
      message:
        "Days-from-start rule (cftd) must use schedule rule numbers 1..144 with valid no/be/af/db/da ranges.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidStartDelayTime]: {
      message:
        "Start delay time (sy) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidEndDelayTime]: {
      message:
        "End delay time (ey) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidStartConditionCount]: {
      message:
        "Start-condition count (wc) must use schedule rule numbers 1..144 and values no, un, or 1..999.",
      category: scheduleRuleCategory,
    },
    [scheduleRangeViolationReasons.invalidMonitoringEndTime]: {
      message:
        "Monitoring end time (wt) must use schedule rule numbers 1..144 and values no, un, 00:00-47:59, or 1..2879 minutes.",
      category: scheduleRuleCategory,
    },
    [scheduleStartDateViolationReasons.invalidStartDate]: {
      message:
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      category: scheduleRuleCategory,
    },
    [scheduleWeeklyDayViolationReasons.openOrClosedDayConflict]: {
      message:
        "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
      category: scheduleRuleCategory,
    },
  });

export const buildScheduleRuleDiagnostics = (
  document: AjsDocument,
  options: BuildSyntaxDiagnosticsOptions,
): SyntaxDiagnosticDto[] =>
  evaluateScheduleDiagnosticViolations(document, options).map(
    mapScheduleDiagnosticViolation,
  );
