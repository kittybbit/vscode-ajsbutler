import {
  compareSemanticDiffInternal,
  type CompareSemanticDiffInput,
} from "./compareSemanticDiff";
import {
  buildScheduleProjectionFacts,
  type ScheduleProjectionFacts,
} from "./semanticDiffScheduleImpact";
import type { SemanticDiffResult } from "./semanticDiffDto";

export type SemanticDiffComparisonArtifacts = Readonly<{
  result: SemanticDiffResult;
  scheduleProjectionFacts: ScheduleProjectionFacts;
}>;

export type CompareSemanticDiffWithArtifacts = (
  input: CompareSemanticDiffInput,
) => SemanticDiffComparisonArtifacts;

/**
 * Compare parsed definitions once and retain the schedule facts from that
 * same pass for later presentation projection.
 */
export const compareSemanticDiffWithArtifacts: CompareSemanticDiffWithArtifacts =
  (input) => {
    const comparison = compareSemanticDiffInternal(input);
    return Object.freeze({
      result: comparison.result,
      scheduleProjectionFacts: buildScheduleProjectionFacts({
        result: comparison.result,
        before: input.before,
        after: input.after,
        scheduleEvaluation: comparison.scheduleEvaluation,
      }),
    });
  };
