import type { AjsParameter, AjsUnit } from "../../models/ajs/AjsDocument";
import type { ScheduleDateInterpretation } from "../../schedule/ScheduleDate";
import type { ParsedRuleValue } from "../../schedule/ScheduleRule";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffScheduleRun,
} from "../../models/semantic-diff/SemanticDiff";
import type { SemanticDiffScheduleCalendarContext } from "./semanticDiffScheduleCalendarContext";

/** Domain-only schedule interpretation/projection outcome. */
export type SemanticDiffScheduleStatus =
  | "supported"
  | "no-runs"
  | "invalid"
  | "unsupported"
  | "missing-context";

export type SemanticDiffScheduleUnsupportedReason =
  | "cycle-schedule"
  | "closed-day-substitution"
  | "shift-days"
  | "calendar-selection"
  | "inherited-parent-rule"
  | "days-from-start"
  | "invalid-start-time"
  | "unpaired-start-time"
  | "unsupported-schedule-date"
  | "missing-start-time"
  | "invalid-calendar-day";

export type SemanticDiffScheduleSide = "before" | "after";

export type SemanticDiffScheduleEvidence = {
  id: string;
  rawParameters: AjsParameter[];
  rule?: number;
};

export type SemanticDiffScheduleRuleInterpretation = {
  parameter: AjsParameter;
  rule?: number;
  status: SemanticDiffScheduleStatus;
  reason?: SemanticDiffScheduleUnsupportedReason;
  evidence: SemanticDiffScheduleEvidence;
  date?: ScheduleDateInterpretation;
  startTime?: ParsedRuleValue;
};

export type SemanticDiffScheduleInterpretation = {
  unit: AjsUnit;
  rules: SemanticDiffScheduleRuleInterpretation[];
  scheduleDateRules: SemanticDiffScheduleRuleInterpretation[];
  startTimeRules: SemanticDiffScheduleRuleInterpretation[];
  hasRuleZeroUndefined: boolean;
};

export type SemanticDiffScheduleProjection = {
  unit: AjsUnit;
  status: SemanticDiffScheduleStatus;
  completeness: "complete" | "partial" | "none";
  runs: SemanticDiffScheduleRun[];
  rules: SemanticDiffScheduleRuleInterpretation[];
  evidence: SemanticDiffScheduleEvidence[];
};

export type SemanticDiffScheduleProjectionInput = {
  interpretation: SemanticDiffScheduleInterpretation;
  period: SemanticDiffComparisonPeriod;
  calendarContext?: SemanticDiffScheduleCalendarContext;
};
