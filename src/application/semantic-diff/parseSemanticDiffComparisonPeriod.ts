import type { SemanticDiffComparisonPeriod } from "./semanticDiffDto";
import {
  parseSchedulePeriod,
  type SchedulePeriodInvalidReason,
} from "../../domain/schedule/SchedulePeriod";

export type SemanticDiffComparisonPeriodInvalidReason =
  SchedulePeriodInvalidReason;

export type SemanticDiffComparisonPeriodParseResult =
  | Readonly<{
      kind: "valid";
      period: SemanticDiffComparisonPeriod;
    }>
  | Readonly<{
      kind: "invalid";
      reason: SemanticDiffComparisonPeriodInvalidReason;
    }>;

export const parseSemanticDiffComparisonPeriod = (input: {
  from: string;
  to: string;
}): SemanticDiffComparisonPeriodParseResult => {
  const result = parseSchedulePeriod(input);
  return result.kind === "valid"
    ? { kind: "valid", period: result.period }
    : result;
};
