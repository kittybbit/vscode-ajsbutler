import type { AjsParameter } from "../../models/ajs/AjsDocument";
import { interpretScheduleDateValue } from "../../models/parameters/scheduleDateInterpreter";
import type { ScheduleDateDay } from "../../models/parameters/scheduleDateInterpreter";
import type { ParsedRuleValue } from "../../models/parameters/scheduleRuleHelpers";
import type {
  SemanticDiffScheduleEvidence,
  SemanticDiffScheduleRuleInterpretation,
  SemanticDiffScheduleStatus,
  SemanticDiffScheduleUnsupportedReason,
} from "./semanticDiffScheduleTypes";

type ParsedScheduleDate = NonNullable<
  ReturnType<typeof interpretScheduleDateValue>
>;

export type ScheduleRuleEvidenceInput = {
  parameter: AjsParameter;
  id: string;
  rule?: number;
  rawParameters?: AjsParameter[];
};

export type ScheduleRuleResultInput = {
  parameter: AjsParameter;
  status: SemanticDiffScheduleStatus;
  id: string;
  rule?: number;
  reason?: SemanticDiffScheduleUnsupportedReason;
  date?: ParsedScheduleDate;
  startTime?: ParsedRuleValue;
  rawParameters?: AjsParameter[];
};

const withRule = (rule: number | undefined): { rule?: number } =>
  rule === undefined ? {} : { rule };

const withReason = (
  reason: SemanticDiffScheduleUnsupportedReason | undefined,
): { reason?: SemanticDiffScheduleUnsupportedReason } =>
  reason === undefined ? {} : { reason };

const withDate = (
  date: ParsedScheduleDate | undefined,
): { date?: ParsedScheduleDate } => (date === undefined ? {} : { date });

const withStartTime = (
  startTime: ParsedRuleValue | undefined,
): { startTime?: ParsedRuleValue } =>
  startTime === undefined ? {} : { startTime };

export const createScheduleRuleEvidence = (
  input: ScheduleRuleEvidenceInput,
): SemanticDiffScheduleEvidence => ({
  id: input.id,
  rawParameters: [...(input.rawParameters ?? [input.parameter])],
  ...withRule(input.rule),
});

export const createScheduleRuleResult = (
  input: ScheduleRuleResultInput,
): SemanticDiffScheduleRuleInterpretation => ({
  parameter: input.parameter,
  ...withRule(input.rule),
  status: input.status,
  ...withReason(input.reason),
  evidence: createScheduleRuleEvidence({
    parameter: input.parameter,
    id: input.id,
    rule: input.rule,
    rawParameters: input.rawParameters,
  }),
  ...withDate(input.date),
  ...withStartTime(input.startTime),
});

const hasAbsoluteMonth = (
  date: ParsedScheduleDate | undefined,
): date is ParsedScheduleDate => {
  if (!date) {
    return false;
  }
  return date.year !== undefined && date.month !== undefined;
};

const calendarIndependentEvidenceRules: ReadonlyArray<{
  matches: (day: ScheduleDateDay) => boolean;
  id: string;
}> = [
  {
    matches: (day) => day.kind === "backward" && day.prefix === undefined,
    id: "JP1-PARAM-SCHEDULE-MONTH-END-001",
  },
  {
    matches: (day) => day.kind === "weekday" && day.prefix === "",
    id: "JP1-PARAM-SCHEDULE-WEEKDAY-001",
  },
];

export const calendarIndependentDateEvidence = (
  date: ReturnType<typeof interpretScheduleDateValue>,
): string | undefined => {
  if (!hasAbsoluteMonth(date)) {
    return undefined;
  }
  return calendarIndependentEvidenceRules.find((rule) => rule.matches(date.day))
    ?.id;
};

const openClosedDayKinds = new Set<ScheduleDateDay["kind"]>(["open", "closed"]);
const openClosedBackwardPrefixes = new Set(["*", "@"]);

const isOpenOrClosedDay = (day: ScheduleDateDay): boolean =>
  openClosedDayKinds.has(day.kind) ||
  (day.kind === "backward" && openClosedBackwardPrefixes.has(day.prefix ?? ""));

const isRelativeDay = (day: ScheduleDateDay): boolean =>
  day.kind === "relative" ||
  (day.kind === "backward" && day.prefix === "+") ||
  (day.kind === "weekday" && day.prefix === "+");

const relativeEvidenceRules: ReadonlyArray<{
  matches: (day: ScheduleDateDay) => boolean;
  id: string;
}> = [
  {
    matches: isOpenOrClosedDay,
    id: "JP1-PARAM-SCHEDULE-OPEN-CLOSED-001",
  },
  { matches: isRelativeDay, id: "JP1-PARAM-SCHEDULE-RELATIVE-001" },
];

export const relativeDateEvidence = (
  date: ReturnType<typeof interpretScheduleDateValue>,
): string | undefined => {
  if (!hasAbsoluteMonth(date)) {
    return undefined;
  }
  return relativeEvidenceRules.find((rule) => rule.matches(date.day))?.id;
};
