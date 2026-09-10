import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "./buildSemanticDiffOutputContext";
import {
  buildSemanticDiffScheduleImpact,
  type ScheduleProjectionFacts,
  type SemanticDiffScheduleImpact,
} from "./semanticDiffScheduleImpact";
import type { SemanticDiffResult } from "./semanticDiffDto";

export type SemanticDiffScheduleImpactUnavailableReason =
  | "not-requested"
  | "invalid-period";

export type SemanticDiffScheduleImpactAvailability =
  | Readonly<{
      kind: "unavailable";
      reason: SemanticDiffScheduleImpactUnavailableReason;
    }>
  | Readonly<{
      kind: "available";
      sidecar: SemanticDiffScheduleImpact;
    }>;

export type SemanticDiffPresentationArtifacts = Readonly<{
  context: SemanticDiffOutputContext;
  scheduleImpact: SemanticDiffScheduleImpactAvailability;
}>;

export type BuildSemanticDiffPresentationArtifactsFromComparisonInput =
  Readonly<{
    result: SemanticDiffResult;
    scheduleProjectionFacts: ScheduleProjectionFacts;
  }>;

const unavailableReason = (
  facts: ScheduleProjectionFacts,
): SemanticDiffScheduleImpactUnavailableReason =>
  facts.kind === "invalid" ? "invalid-period" : "not-requested";

/** Build output context and optional calendar sidecar without recalculation. */
export const buildSemanticDiffPresentationArtifactsFromComparison = (
  input: BuildSemanticDiffPresentationArtifactsFromComparisonInput,
): SemanticDiffPresentationArtifacts => {
  const context = buildSemanticDiffOutputContext(input.result);
  const scheduleImpact =
    input.scheduleProjectionFacts.kind === "evaluated"
      ? {
          kind: "available" as const,
          sidecar: buildSemanticDiffScheduleImpact({
            result: input.result,
            facts: input.scheduleProjectionFacts,
          }),
        }
      : {
          kind: "unavailable" as const,
          reason: unavailableReason(input.scheduleProjectionFacts),
        };
  return Object.freeze({ context, scheduleImpact });
};
