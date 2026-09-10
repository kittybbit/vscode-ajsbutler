import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "./buildSemanticDiffOutputContext";
import {
  buildSemanticDiffScheduleImpact,
  type ScheduleProjectionFacts,
  type SemanticDiffScheduleImpact,
} from "./semanticDiffScheduleImpact";
import type {
  SemanticDiffParserError,
  SemanticDiffResult,
} from "./semanticDiffDto";
import type { AjsParserPort } from "../parsing/AjsParserPort";
import type {
  BuildSemanticDiffReportDataInput,
  BuildSemanticDiffReportDataResult,
} from "./buildSemanticDiffReportData";
import {
  compareSemanticDiffWithArtifacts,
  type CompareSemanticDiffWithArtifacts,
} from "./compareSemanticDiffWithArtifacts";
import type { CompareSemanticDiffOptions } from "./compareSemanticDiff";

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

/** The additive source-text input used by the command-facing adapter. */
export type BuildSemanticDiffPresentationArtifactsInput =
  BuildSemanticDiffReportDataInput & {
    options?: Pick<CompareSemanticDiffOptions, "scheduleComparisonPeriod">;
  };

export type BuildSemanticDiffPresentationArtifactsResult =
  | SemanticDiffPresentationArtifacts
  | Extract<BuildSemanticDiffReportDataResult, { ok: false }>;

export type BuildSemanticDiffPresentationArtifacts = (
  input: BuildSemanticDiffPresentationArtifactsInput,
  scopedParser?: AjsParserPort,
) => BuildSemanticDiffPresentationArtifactsResult;

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

const parserErrors = (
  result: ReturnType<AjsParserPort["parse"]>,
): SemanticDiffParserError[] => {
  if (result.ok === true) return [];
  return result.errors.map(({ line, column, message }) => ({
    line,
    column,
    message,
  }));
};

/**
 * Creates the source-text boundary for presentation artifacts.  Parsing,
 * comparison, and projection are intentionally kept in this single call so
 * the source capture can observe one parse of each side and no presentation
 * layer needs to recalculate schedule facts.
 */
export const createBuildSemanticDiffPresentationArtifacts =
  (
    parser: AjsParserPort,
    compareWithArtifacts: CompareSemanticDiffWithArtifacts = compareSemanticDiffWithArtifacts,
    builder: (
      input: BuildSemanticDiffPresentationArtifactsFromComparisonInput,
    ) => SemanticDiffPresentationArtifacts = buildSemanticDiffPresentationArtifactsFromComparison,
  ): BuildSemanticDiffPresentationArtifacts =>
  (input, scopedParser) => {
    const activeParser = scopedParser ?? parser;
    const before = activeParser.parse(input.beforeContent);
    const after = activeParser.parse(input.afterContent);
    if (before.ok === false || after.ok === false) {
      return {
        ok: false,
        errors: {
          before: parserErrors(before),
          after: parserErrors(after),
        },
      };
    }

    const comparisonInput =
      input.options?.scheduleComparisonPeriod === undefined
        ? { before: before.document, after: after.document }
        : {
            before: before.document,
            after: after.document,
            options: {
              scheduleComparisonPeriod: input.options.scheduleComparisonPeriod,
            },
          };
    const comparison = compareWithArtifacts(comparisonInput);
    return builder(comparison);
  };
