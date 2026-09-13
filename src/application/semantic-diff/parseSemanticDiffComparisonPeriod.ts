import type { SemanticDiffComparisonPeriod } from "./semanticDiffDto";

export type SemanticDiffComparisonPeriodInvalidReason =
  | "invalid-from"
  | "invalid-to"
  | "non-increasing";

export type SemanticDiffComparisonPeriodParseResult =
  | Readonly<{
      kind: "valid";
      period: SemanticDiffComparisonPeriod;
    }>
  | Readonly<{
      kind: "invalid";
      reason: SemanticDiffComparisonPeriodInvalidReason;
    }>;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAYS_IN_MONTH = [
  0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const;

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const daysInMonth = (year: number, month: number): number => {
  return month === 2 && isLeapYear(year) ? 29 : (DAYS_IN_MONTH[month] ?? 0);
};

const isRealIsoDate = (value: string): boolean => {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return (
    month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month)
  );
};

const invalidPeriodReason = (input: {
  from: string;
  to: string;
}): SemanticDiffComparisonPeriodInvalidReason | undefined =>
  [
    [!isRealIsoDate(input.from), "invalid-from"],
    [!isRealIsoDate(input.to), "invalid-to"],
    [input.from >= input.to, "non-increasing"],
  ].find(([invalid]) => invalid)?.[1] as
    | SemanticDiffComparisonPeriodInvalidReason
    | undefined;

export const parseSemanticDiffComparisonPeriod = (input: {
  from: string;
  to: string;
}): SemanticDiffComparisonPeriodParseResult => {
  const reason = invalidPeriodReason(input);
  return reason === undefined
    ? { kind: "valid", period: { from: input.from, to: input.to } }
    : { kind: "invalid", reason };
};
