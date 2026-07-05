import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffInputPair,
  SemanticDiffJobGroupInput,
  SemanticDiffLimitation,
  SemanticDiffReportSection,
  SemanticDiffSide,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";

export type CompareSemanticDiffOptions = {
  jobGroupPath?: string;
};

export type CompareSemanticDiffInput = {
  before: AjsDocument;
  after: AjsDocument;
  options?: CompareSemanticDiffOptions;
};

export type CompareSemanticDiff = (
  input: CompareSemanticDiffInput,
) => SemanticDiffChangeSet;

export type SemanticDiffChangeSetParts = {
  changes?: SemanticDiffChange[];
  confirmationRequired?: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems?: SemanticDiffUnsupportedItem[];
  limitations?: SemanticDiffLimitation[];
  reportSections?: SemanticDiffReportSection[];
};

const toJobGroupInput = (
  side: SemanticDiffSide,
  document: AjsDocument,
  options?: CompareSemanticDiffOptions,
): SemanticDiffJobGroupInput => ({
  side,
  document,
  jobGroupPath: options?.jobGroupPath,
});

const toInputPair = (
  input: CompareSemanticDiffInput,
): SemanticDiffInputPair => ({
  before: toJobGroupInput("before", input.before, input.options),
  after: toJobGroupInput("after", input.after, input.options),
});

const toNormalizationLimitations = (
  side: SemanticDiffSide,
  document: AjsDocument,
): SemanticDiffLimitation[] =>
  document.warnings.map((warning) => ({
    code: warning.code,
    kind: "normalization",
    side,
    message: warning.message,
    unitPath: warning.unitPath,
    warning,
  }));

export const createSemanticDiffChangeSet = (
  input: CompareSemanticDiffInput,
  parts: SemanticDiffChangeSetParts = {},
): SemanticDiffChangeSet => ({
  inputs: toInputPair(input),
  changes: parts.changes ?? [],
  confirmationRequired: parts.confirmationRequired ?? [],
  unsupportedItems: parts.unsupportedItems ?? [],
  limitations: [
    ...toNormalizationLimitations("before", input.before),
    ...toNormalizationLimitations("after", input.after),
    ...(parts.limitations ?? []),
  ],
  reportSections: parts.reportSections ?? [],
});
