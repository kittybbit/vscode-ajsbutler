import type { ScheduleDateInterpretation } from "../../schedule/ScheduleDate";

const relativeDayKinds = new Set(["relative", "open", "closed"]);

const isRelativeBackwardDay = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "backward" &&
  ["+", "*", "@"].includes(parsed.day.prefix ?? "");

const isRelativeWeekday = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "weekday" && parsed.day.prefix === "+";

type ClassifiedBackwardDay = Extract<
  ScheduleDateInterpretation["day"],
  { kind: "backward" }
>;

const isClassifiedBackwardDay = (
  parsed: ScheduleDateInterpretation,
): parsed is ScheduleDateInterpretation & { day: ClassifiedBackwardDay } =>
  parsed.day.kind === "backward" &&
  (parsed.day.prefix === "*" || parsed.day.prefix === "@");

const hasInvalidClassifiedOffset = (day: ClassifiedBackwardDay): boolean =>
  day.offset !== undefined && (day.offset < 0 || day.offset > 34);

export const relativeScheduleDateRequiresContext = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  relativeDayKinds.has(parsed.day.kind) ||
  isRelativeBackwardDay(parsed) ||
  isRelativeWeekday(parsed);

const hasInvalidMonth = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.month !== undefined && (parsed.month < 1 || parsed.month > 12);

const hasInvalidRelativeDay = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "relative" &&
  (parsed.day.value < 1 || parsed.day.value > 31);

const hasInvalidClassifiedDay = (parsed: ScheduleDateInterpretation): boolean =>
  (parsed.day.kind === "open" || parsed.day.kind === "closed") &&
  (parsed.day.value < 1 || parsed.day.value > 35);

const hasInvalidRelativeBackwardOffset = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "backward" &&
  parsed.day.prefix === "+" &&
  parsed.day.offset !== undefined &&
  (parsed.day.offset < 0 || parsed.day.offset > 30);

const hasInvalidClassifiedBackwardOffset = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  isClassifiedBackwardDay(parsed) && hasInvalidClassifiedOffset(parsed.day);

const hasInvalidRelativeWeekdayOccurrence = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "weekday" &&
  parsed.day.prefix === "+" &&
  typeof parsed.day.occurrence === "number" &&
  (parsed.day.occurrence < 1 || parsed.day.occurrence > 5);

const relativeDateValidators: readonly ((
  parsed: ScheduleDateInterpretation,
) => boolean)[] = [
  hasInvalidMonth,
  hasInvalidRelativeDay,
  hasInvalidClassifiedDay,
  hasInvalidRelativeBackwardOffset,
  hasInvalidClassifiedBackwardOffset,
  hasInvalidRelativeWeekdayOccurrence,
];

export const isSyntacticallyInvalidRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  relativeScheduleDateRequiresContext(parsed) &&
  relativeDateValidators.some((validate) => validate(parsed));

const isFullyQualifiedDate = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.year !== undefined &&
  parsed.month !== undefined &&
  parsed.month >= 1 &&
  parsed.month <= 12;

export const isFullyQualifiedRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  isFullyQualifiedDate(parsed) &&
  relativeScheduleDateRequiresContext(parsed) &&
  !isSyntacticallyInvalidRelativeScheduleDate(parsed);
