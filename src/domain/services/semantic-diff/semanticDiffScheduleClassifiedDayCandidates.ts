import type { ScheduleDateDay } from "../../models/parameters/scheduleDateInterpreter";
import {
  classifyScheduleCalendarDay,
  operationalMonthDate,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";
import {
  operationalMonthLength,
  type SemanticDiffOperationalMonth,
} from "./semanticDiffScheduleOperationalMonth";
import {
  classificationFailure,
  emptyScheduleDateCandidates,
  singleScheduleDateCandidate,
  type ScheduleDateCandidateResult,
  type ScheduleDayClassification,
} from "./semanticDiffScheduleCandidateTypes";
import { formatScheduleDate } from "./semanticDiffScheduleDateMath";

type ClassifiedDay = Extract<
  ScheduleDateDay,
  { kind: "open" | "closed" | "backward" }
>;

type ClassifiedCandidateInput = {
  day: ClassifiedDay;
  month: SemanticDiffOperationalMonth;
  context: SemanticDiffScheduleCalendarContext;
};

const classifyOffset = (
  context: SemanticDiffScheduleCalendarContext,
  month: SemanticDiffOperationalMonth,
  offset: number,
): ScheduleDayClassification => {
  const result = classifyScheduleCalendarDay(
    context,
    operationalMonthDate(month, offset),
  );
  return "evidenceId" in result
    ? { status: result.status, evidenceId: result.evidenceId }
    : result.status;
};

const formattedDateAt = (
  month: SemanticDiffOperationalMonth,
  offset: number,
): string => {
  const date = operationalMonthDate(month, offset);
  return formatScheduleDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
};

type ClassificationSearchStep = {
  qualifying: number;
  result?: ScheduleDateCandidateResult;
};

const classificationSearchStep = (input: {
  classification: ScheduleDayClassification;
  target: "open" | "closed";
  qualifying: number;
  occurrence: number;
  month: SemanticDiffOperationalMonth;
  offset: number;
}): ClassificationSearchStep => {
  if (typeof input.classification !== "string") {
    return {
      qualifying: input.qualifying,
      result: classificationFailure(input.classification),
    };
  }
  return input.classification === input.target
    ? matchingClassificationStep({
        target: input.target,
        qualifying: input.qualifying,
        occurrence: input.occurrence,
        month: input.month,
        offset: input.offset,
      })
    : { qualifying: input.qualifying };
};

const matchingClassificationStep = (input: {
  target: "open" | "closed";
  qualifying: number;
  occurrence: number;
  month: SemanticDiffOperationalMonth;
  offset: number;
}): ClassificationSearchStep =>
  input.qualifying === input.occurrence
    ? {
        qualifying: input.qualifying,
        result: singleScheduleDateCandidate(
          formattedDateAt(input.month, input.offset),
        ),
      }
    : { qualifying: input.qualifying + 1 };

const findClassifiedCandidate = (input: {
  context: SemanticDiffScheduleCalendarContext;
  month: SemanticDiffOperationalMonth;
  offsets: Iterable<number>;
  target: "open" | "closed";
  occurrence: number;
}): ScheduleDateCandidateResult => {
  const result = Array.from(input.offsets).reduce<ClassificationSearchStep>(
    (state, offset) =>
      state.result
        ? state
        : classificationSearchStep({
            classification: classifyOffset(input.context, input.month, offset),
            target: input.target,
            qualifying: state.qualifying,
            occurrence: input.occurrence,
            month: input.month,
            offset,
          }),
    { qualifying: 0 },
  );
  return result.result ?? emptyScheduleDateCandidates();
};

const isForwardClassifiedDay = (
  day: ClassifiedDay,
): day is Extract<ClassifiedDay, { kind: "open" | "closed" }> =>
  day.kind === "open" || day.kind === "closed";

const isBackwardClassifiedDay = (
  day: ClassifiedDay,
): day is Extract<ClassifiedDay, { kind: "backward" }> =>
  day.kind === "backward" && (day.prefix === "*" || day.prefix === "@");

const forwardClassifiedCandidate = (
  input: ClassifiedCandidateInput & {
    day: Extract<ClassifiedDay, { kind: "open" | "closed" }>;
  },
): ScheduleDateCandidateResult =>
  findClassifiedCandidate({
    context: input.context,
    month: input.month,
    offsets: Array.from(
      { length: operationalMonthLength(input.month) },
      (_, offset) => offset,
    ),
    target: input.day.kind,
    occurrence: input.day.value - 1,
  });

const backwardClassifiedCandidate = (
  input: ClassifiedCandidateInput & {
    day: Extract<ClassifiedDay, { kind: "backward" }>;
  },
): ScheduleDateCandidateResult =>
  findClassifiedCandidate({
    context: input.context,
    month: input.month,
    offsets: Array.from(
      { length: operationalMonthLength(input.month) },
      (_, index) => operationalMonthLength(input.month) - 1 - index,
    ),
    target: input.day.prefix === "*" ? "open" : "closed",
    occurrence: input.day.offset ?? 0,
  });

/** Project definition-classified open/closed schedule days. */
export const classifiedDayCandidates = (
  input: ClassifiedCandidateInput,
): ScheduleDateCandidateResult | undefined => {
  if (isForwardClassifiedDay(input.day)) {
    return forwardClassifiedCandidate({
      context: input.context,
      month: input.month,
      day: input.day,
    });
  }
  if (isBackwardClassifiedDay(input.day)) {
    return backwardClassifiedCandidate({
      context: input.context,
      month: input.month,
      day: input.day,
    });
  }
  return undefined;
};
