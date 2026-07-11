import type {
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffLimitation,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";
import { semanticDiffReportText } from "../../domain/services/i18n/nls";
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
    .flatMap((change) => renderChangeDetails(change, language));

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
      `[${localizedKind(item.kind, language)}]${item.side ? ` ${localizedKind(item.side, language)}:` : ""} ${escapeMarkdown(item.message)}`,
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
  return `[${limitation.kind}:${limitation.code}] ${side}${path} ${limitation.message}`
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
          `${left.kind}:${left.code}:${left.side ?? ""}:${left.unitPath ?? ""}:${left.message}`,
          `${right.kind}:${right.code}:${right.side ?? ""}:${right.unitPath ?? ""}:${right.message}`,
        ),
      )
      .map((limitation) =>
        bulletLine(escapeMarkdown(renderLimitation(limitation, language))),
      ),
    language,
  );

const renderScheduleComparison = (
  changeSet: SemanticDiffChangeSet,
  language?: string,
): string[] => {
  if (!changeSet.scheduleComparison) {
    return [];
  }

  return [
    `## ${label("Schedule Changes", language)}`,
    "",
    bulletLine(
      semanticDiffReportText("generated.period", language, {
        from: escapeMarkdown(changeSet.scheduleComparison.period.from),
        to: escapeMarkdown(changeSet.scheduleComparison.period.to),
      }),
    ),
    ...sectionOrNone(
      [...changeSet.scheduleComparison.runChanges]
        .sort((left, right) => compareStrings(left.id, right.id))
        .flatMap((change) => renderScheduleRunChange(change, language)),
      language,
    ),
    "",
  ];
};

export const renderSemanticDiffMarkdown = (
  changeSet: SemanticDiffChangeSet,
  language?: string,
): string => {
  const lines = [
    `# ${label("Semantic Diff Report", language)}`,
    "",
    `## ${label("Summary", language)}`,
    "",
    ...renderSummary(changeSet, language),
    "",
    `## ${label("Structural Changes", language)}`,
    "",
    ...sectionOrNone(
      renderStructuralChanges(changeSet.changes, language),
      language,
    ),
    "",
    `## ${label("Attribute Changes", language)}`,
    "",
    ...renderAttributeChanges(changeSet.changes, language),
    ...renderScheduleComparison(changeSet, language),
    `## ${label("Confirmation Required", language)}`,
    "",
    ...renderConfirmationRequired(changeSet.confirmationRequired, language),
    "",
    `## ${label("Unsupported Items", language)}`,
    "",
    ...renderUnsupportedItems(changeSet.unsupportedItems, language),
    "",
    `## ${label("Limitations", language)}`,
    "",
    ...renderLimitations(changeSet.limitations, language),
  ];

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
};
