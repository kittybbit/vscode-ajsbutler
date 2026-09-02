import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChangeKind,
  SemanticDiffElementKind,
  SemanticDiffUnsupportedKind,
} from "../../application/semantic-diff/semanticDiffDto";
import { semanticDiffReportText } from "./semanticDiffReportText";
import {
  bulletLine,
  escapeMarkdown,
  label,
  localizedKind,
  optionalText,
} from "./semanticDiffMarkdownLocalization";
import type { SemanticDiffMarkdownRenderer } from "./semanticDiffMarkdownTypes";

const summaryText = (key: string, language?: string): string =>
  semanticDiffReportText(`summary.${key}`, language);

const countLines = <T extends string>(
  counts: Readonly<Record<T, number>>,
  formatKey: (key: T, language?: string) => string,
  language?: string,
): string[] =>
  Object.entries(counts).map(([key, count]) =>
    bulletLine(`${formatKey(key as T, language)}: ${count}`),
  );

const formatChangeKind = (
  kind: SemanticDiffChangeKind,
  language?: string,
): string => localizedKind(kind, language);

const formatElementKind = (
  kind: SemanticDiffElementKind,
  language?: string,
): string => localizedKind(kind, language);

const formatAttributeCategory = (
  category: SemanticDiffAttributeCategory,
  language?: string,
): string => semanticDiffReportText(`category.${category}`, language);

const formatUnsupportedKind = (
  kind: SemanticDiffUnsupportedKind,
  language?: string,
): string => localizedKind(kind, language);

const statusText = (present: boolean, language?: string): string =>
  summaryText(present ? "present" : "absent", language);

/**
 * Render the compact Summary projection without re-counting the result.
 * Scope and period are context facts; all counts and predicates come from
 * the already-built summary.
 */
export const renderSemanticDiffSummaryMarkdown: SemanticDiffMarkdownRenderer = (
  context,
  language,
): string => {
  const { result, summary } = context;
  const lines = [
    `# ${summaryText("title", language)}`,
    "",
    `## ${label("Summary", language)}`,
    "",
    bulletLine(
      `${label("Before scope", language)}: ${escapeMarkdown(optionalText(result.inputs.before.jobGroupPath))}`,
    ),
    bulletLine(
      `${label("After scope", language)}: ${escapeMarkdown(optionalText(result.inputs.after.jobGroupPath))}`,
    ),
  ];

  if (result.scheduleComparison) {
    lines.push(
      bulletLine(
        semanticDiffReportText("generated.period", language, {
          from: escapeMarkdown(result.scheduleComparison.period.from),
          to: escapeMarkdown(result.scheduleComparison.period.to),
        }),
      ),
    );
  }

  lines.push(
    bulletLine(
      `${summaryText("confirmationCount", language)}: ${summary.confirmationRequiredCount}`,
    ),
    bulletLine(
      `${summaryText("limitationCount", language)}: ${summary.limitationCount}`,
    ),
    bulletLine(
      `${summaryText("uncalculated", language)}: ${statusText(summary.hasUncalculated, language)}`,
    ),
    bulletLine(
      `${summaryText("findings", language)}: ${statusText(summary.hasFindings, language)}`,
    ),
    "",
    `## ${summaryText("changeKinds", language)}`,
    "",
    ...countLines(summary.changeCountsByKind, formatChangeKind, language),
    "",
    `## ${summaryText("elementKinds", language)}`,
    "",
    ...countLines(
      summary.changeCountsByElementKind,
      formatElementKind,
      language,
    ),
    "",
    `## ${summaryText("attributeCategories", language)}`,
    "",
    ...countLines(
      summary.changeCountsByAttributeCategory,
      formatAttributeCategory,
      language,
    ),
    "",
    `## ${summaryText("unsupportedKinds", language)}`,
    "",
    ...countLines(
      summary.unsupportedCountsByKind,
      formatUnsupportedKind,
      language,
    ),
  );

  if (result.scheduleComparison) {
    lines.push(
      "",
      `## ${summaryText("scheduleRunChangeCount", language)}`,
      "",
      bulletLine(String(summary.scheduleRunChangeCount)),
    );
  }

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
};
