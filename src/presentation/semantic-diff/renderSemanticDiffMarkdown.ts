import type {
  SemanticDiffChange,
  SemanticDiffResult,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffIdentityDecision,
  SemanticDiffLimitation,
  SemanticDiffUnsupportedItem,
} from "../../application/semantic-diff/semanticDiffDto";
import { semanticDiffReportText } from "./semanticDiffReportText";
import {
  bulletLine,
  describeTarget,
  escapeMarkdown,
  indentedLine,
  label,
  localizedKind,
  renderAttributeChanges,
  renderChangeDetails,
  renderConfirmationRequiredItem,
  renderScheduleRunChange,
  renderSummary,
} from "./semanticDiffMarkdownLocalization";

const structuralElementOrder = new Map<string, number>([
  ["job-group", 0],
  ["jobnet", 1],
  ["unit", 2],
  ["relation", 3],
]);

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const compareChanges = (
  left: SemanticDiffChange,
  right: SemanticDiffChange,
): number => compareStrings(left.id, right.id);

const sectionOrNone = (lines: string[], language?: string): string[] =>
  lines.length > 0 ? lines : [bulletLine(label("None", language))];

const renderStructuralChanges = (
  changes: SemanticDiffChange[],
  identityDecisions: ReadonlyMap<string, SemanticDiffIdentityDecision>,
  language?: string,
): string[] =>
  changes
    .filter((change) => change.elementKind !== "attribute")
    .sort((left, right) => {
      const elementComparison =
        (structuralElementOrder.get(left.elementKind) ?? 99) -
        (structuralElementOrder.get(right.elementKind) ?? 99);
      return elementComparison || compareChanges(left, right);
    })
    .flatMap((change) =>
      renderChangeDetails(change, language, identityDecisions),
    );

const renderConfirmationRequired = (
  items: SemanticDiffConfirmationRequiredItem[],
  language?: string,
): string[] =>
  sectionOrNone(
    [...items]
      .sort((left, right) => compareStrings(left.id, right.id))
      .flatMap((item) => renderConfirmationRequiredItem(item, language)),
    language,
  );

const renderUnsupportedItem = (
  item: SemanticDiffUnsupportedItem,
  language?: string,
): string[] => {
  const lines = [
    bulletLine(
      `[${localizedKind(item.kind, language)}]${item.side ? ` ${localizedKind(item.side, language)}:` : ""} ${escapeMarkdown(item.warning?.fallbackText ?? item.reasonCode)}`,
    ),
  ];
  if (item.target) {
    lines.push(
      indentedLine(
        `${label("Target", language)}: ${escapeMarkdown(describeTarget(item.target, language))}`,
      ),
    );
  }
  return lines;
};

const renderUnsupportedItems = (
  items: SemanticDiffUnsupportedItem[],
  language?: string,
): string[] =>
  sectionOrNone(
    [...items]
      .sort((left, right) => compareStrings(left.id, right.id))
      .flatMap((item) => renderUnsupportedItem(item, language)),
    language,
  );

const renderLimitation = (
  limitation: SemanticDiffLimitation,
  language?: string,
): string => {
  const side = limitation.side
    ? `${localizedKind(limitation.side, language)} `
    : "";
  const path = limitation.unitPath ? ` ${limitation.unitPath}` : "";
  return `[${limitation.kind}:${limitation.code}] ${side}${path} ${limitation.warning?.fallbackText ?? limitation.code}`
    .replace(/\s+/g, " ")
    .trim();
};

const renderLimitations = (
  limitations: SemanticDiffLimitation[],
  language?: string,
): string[] =>
  sectionOrNone(
    [...limitations]
      .sort((left, right) =>
        compareStrings(
          `${left.kind}:${left.code}:${left.side ?? ""}:${left.unitPath ?? ""}:${left.warning?.fallbackText ?? ""}`,
          `${right.kind}:${right.code}:${right.side ?? ""}:${right.unitPath ?? ""}:${right.warning?.fallbackText ?? ""}`,
        ),
      )
      .map((limitation) =>
        bulletLine(escapeMarkdown(renderLimitation(limitation, language))),
      ),
    language,
  );

const renderScheduleComparison = (
  result: SemanticDiffResult,
  language?: string,
): string[] => {
  if (!result.scheduleComparison) {
    return [];
  }

  return [
    `## ${label("Schedule Changes", language)}`,
    "",
    bulletLine(
      semanticDiffReportText("generated.period", language, {
        from: escapeMarkdown(result.scheduleComparison.period.from),
        to: escapeMarkdown(result.scheduleComparison.period.to),
      }),
    ),
    ...sectionOrNone(
      [...result.scheduleComparison.runChanges]
        .sort((left, right) => compareStrings(left.id, right.id))
        .flatMap((change) => renderScheduleRunChange(change, language)),
      language,
    ),
    "",
  ];
};

export const renderSemanticDiffMarkdown = (
  result: SemanticDiffResult,
  language?: string,
): string => {
  const identityDecisions = new Map(
    result.identityDecisions.map((decision) => [decision.id, decision]),
  );
  const lines = [
    `# ${label("Semantic Diff Report", language)}`,
    "",
    `## ${label("Summary", language)}`,
    "",
    ...renderSummary(result, language),
    "",
    `## ${label("Structural Changes", language)}`,
    "",
    ...sectionOrNone(
      renderStructuralChanges(result.changes, identityDecisions, language),
      language,
    ),
    "",
    `## ${label("Attribute Changes", language)}`,
    "",
    ...renderAttributeChanges(result.changes, language, identityDecisions),
    "",
    ...renderScheduleComparison(result, language),
    `## ${label("Confirmation Required", language)}`,
    "",
    ...renderConfirmationRequired(result.confirmationRequired, language),
    "",
    `## ${label("Unsupported Items", language)}`,
    "",
    ...renderUnsupportedItems(result.unsupportedItems, language),
    "",
    `## ${label("Limitations", language)}`,
    "",
    ...renderLimitations(result.limitations, language),
  ];

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
};
