import { toUtcDate } from "./ScheduleDate";

export type SchedulePeriod = Readonly<{ from: string; to: string }>;

export type SchedulePeriodInvalidReason =
  | "invalid-from"
  | "invalid-to"
  | "non-increasing";

export type SchedulePeriodParseResult =
  | Readonly<{
      kind: "valid";
      period: SchedulePeriod;
      fromDate: Date;
      toDate: Date;
    }>
  | Readonly<{
      kind: "invalid";
      reason: SchedulePeriodInvalidReason;
    }>;

const invalidPeriodReason = (
  fromDate: Date | undefined,
  toDate: Date | undefined,
): SchedulePeriodInvalidReason | undefined => {
  const checks: readonly (readonly [boolean, SchedulePeriodInvalidReason])[] = [
    [fromDate === undefined, "invalid-from"],
    [toDate === undefined, "invalid-to"],
    [
      fromDate !== undefined && toDate !== undefined && fromDate >= toDate,
      "non-increasing",
    ],
  ];
  return checks.find(([invalid]) => invalid)?.[1];
};

export const parseSchedulePeriod = (
  input: SchedulePeriod,
): SchedulePeriodParseResult => {
  const fromDate = toUtcDate(input.from);
  const toDate = fromDate ? toUtcDate(input.to) : undefined;
  const reason = invalidPeriodReason(fromDate, toDate);
  return reason
    ? { kind: "invalid", reason }
    : {
        kind: "valid",
        period: { from: input.from, to: input.to },
        fromDate: fromDate!,
        toDate: toDate!,
      };
};
