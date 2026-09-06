import type { AjsParameter, AjsUnit } from "../../models/ajs/AjsDocument";
import type { ScheduleDateWeekday } from "../../models/parameters/scheduleDateInterpreter";

export type SemanticDiffScheduleCalendarContextStatus =
  | "supported"
  | "invalid"
  | "missing-context";

export type SemanticDiffScheduleBaseDay =
  | { kind: "numeric"; value: number }
  | { kind: "weekday"; weekday: ScheduleDateWeekday; occurrence: number };

export type SemanticDiffScheduleCalendarDayClassification = "open" | "closed";

export type SemanticDiffScheduleCalendarSelector =
  | {
      kind: "exact";
      year?: number;
      month: number;
      day: number;
      key: string;
    }
  | {
      kind: "weekday";
      weekday: ScheduleDateWeekday;
      key: string;
    };

export type SemanticDiffScheduleCalendarEntry = {
  selector: SemanticDiffScheduleCalendarSelector;
  classification: SemanticDiffScheduleCalendarDayClassification;
  parameter: AjsParameter;
};

export type SemanticDiffScheduleCalendarGroup = {
  entries: SemanticDiffScheduleCalendarEntry[];
};

export type SemanticDiffScheduleCalendarSelection = {
  status: SemanticDiffScheduleCalendarContextStatus;
  evidenceId: string;
  rawParameters: AjsParameter[];
};

export type SemanticDiffScheduleCalendarContext = {
  status: SemanticDiffScheduleCalendarContextStatus;
  selection: SemanticDiffScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: SemanticDiffScheduleBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: SemanticDiffScheduleCalendarGroup[];
};

export type SemanticDiffScheduleCalendarContextIndex = {
  byId: Map<string, AjsUnit[]>;
  byPath: Map<string, AjsUnit[]>;
  duplicatePath: boolean;
};

export type SemanticDiffScheduleCalendarDayResult =
  | {
      status: SemanticDiffScheduleCalendarDayClassification;
    }
  | {
      status: "missing-context" | "invalid";
      evidenceId: string;
    };

export type SemanticDiffScheduleContextInput = {
  status: SemanticDiffScheduleCalendarContextStatus;
  selection: SemanticDiffScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: SemanticDiffScheduleBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: SemanticDiffScheduleCalendarGroup[];
};

export const createScheduleCalendarContext = (
  input: SemanticDiffScheduleContextInput,
): SemanticDiffScheduleCalendarContext => input;
