import type { AjsUnit } from "../../models/ajs/AjsDocument";
import type {
  ScheduleEvidence,
  ScheduleInterpretation,
  ScheduleRuleInterpretation,
  ScheduleStatus,
} from "../../schedule/ScheduleInterpretation";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffScheduleRun,
} from "../../models/semantic-diff/SemanticDiff";
import type { SemanticDiffScheduleCalendarContext } from "./semanticDiffScheduleCalendarContext";

export type SemanticDiffScheduleSide = "before" | "after";

export type SemanticDiffScheduleProjection = {
  unit: AjsUnit;
  status: ScheduleStatus;
  completeness: "complete" | "partial" | "none";
  runs: SemanticDiffScheduleRun[];
  rules: ScheduleRuleInterpretation[];
  evidence: ScheduleEvidence[];
};

export type SemanticDiffScheduleProjectionInput = {
  interpretation: ScheduleInterpretation;
  period: SemanticDiffComparisonPeriod;
  calendarContext?: SemanticDiffScheduleCalendarContext;
};
