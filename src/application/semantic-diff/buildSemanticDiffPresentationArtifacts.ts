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
import type {
  CompareSemanticDiffInput,
  CompareSemanticDiffOptions,
} from "./compareSemanticDiff";

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

type ParseResult = ReturnType<AjsParserPort["parse"]>;
type SuccessfulParseResult = Extract<ParseResult, { ok: true }>;

type ParsedSources = Readonly<{
  before: ParseResult;
  after: ParseResult;
}>;

type ParsedDocuments = Readonly<{
  before: SuccessfulParseResult["document"];
  after: SuccessfulParseResult["document"];
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

const parserErrors = (result: ParseResult): SemanticDiffParserError[] => {
  if (result.ok === true) return [];
  return result.errors.map(({ line, column, message }) => ({
    line,
    column,
    message,
  }));
};

const parseSources = (
  parser: AjsParserPort,
  input: BuildSemanticDiffPresentationArtifactsInput,
): ParsedSources => ({
  before: parser.parse(input.beforeContent),
  after: parser.parse(input.afterContent),
});

const parsedDocuments = (
  sources: ParsedSources,
): ParsedDocuments | undefined =>
  sources.before.ok && sources.after.ok
    ? { before: sources.before.document, after: sources.after.document }
    : undefined;

const parserFailure = (
  sources: ParsedSources,
): Extract<BuildSemanticDiffReportDataResult, { ok: false }> => ({
  ok: false,
  errors: {
    before: parserErrors(sources.before),
    after: parserErrors(sources.after),
  },
});

const comparisonInput = (
  documents: ParsedDocuments,
  period: CompareSemanticDiffOptions["scheduleComparisonPeriod"],
): CompareSemanticDiffInput =>
  period === undefined
    ? { before: documents.before, after: documents.after }
    : {
        before: documents.before,
        after: documents.after,
        options: { scheduleComparisonPeriod: period },
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
    const sources = parseSources(activeParser, input);
    const documents = parsedDocuments(sources);
    if (!documents) return parserFailure(sources);
    const comparison = compareWithArtifacts(
      comparisonInput(documents, input.options?.scheduleComparisonPeriod),
    );
    return builder(comparison);
  };
