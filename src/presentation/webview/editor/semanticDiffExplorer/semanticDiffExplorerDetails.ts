import type {
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerViewModel,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffDetail } from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import { formatLocalizedDateRange } from "../shared/result/formatLocalizedDateRange";

export type ExplorerDetailItem = Readonly<{
  label: string;
  value: string;
}>;

export type ExplorerDetailPresentation = Readonly<{
  rows: readonly ExplorerDetailItem[];
  comparison: Readonly<{ before: string; after: string }> | null;
}>;

export const explorerStatusLabel = (
  status: SemanticDiffExplorerViewModel["status"],
  labels: SemanticDiffExplorerLabels,
): string =>
  ({
    findings: labels.findings,
    empty: labels.empty,
    "filter-empty": labels.filterEmpty,
  })[status];

const emptyDetails = (): ExplorerDetailPresentation => ({
  rows: [],
  comparison: null,
});

const optionalDetail = (
  label: string,
  value: string | undefined,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailItem | null =>
  value ? { label: labels.detailField(label), value } : null;

const listDetail = (
  label: string,
  values: readonly string[],
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailItem | null =>
  values.length > 0
    ? { label: labels.detailField(label), value: values.join(", ") }
    : null;

const detailComparison = (
  detail: SemanticDiffDetail,
): ExplorerDetailPresentation["comparison"] =>
  detail.beforeValues.length > 0 || detail.afterValues.length > 0
    ? {
        before: detail.beforeValues.join(", ") || "—",
        after: detail.afterValues.join(", ") || "—",
      }
    : null;

const detailItems = ({
  detail,
  labels,
  language,
}: Readonly<{
  detail: SemanticDiffDetail;
  labels: SemanticDiffExplorerLabels;
  language: string;
}>): ExplorerDetailPresentation => {
  const rows = [
    optionalDetail("unit", detail.unitPath, labels),
    optionalDetail("parameter", detail.parameterKey, labels),
    listDetail("raw", detail.rawValues, labels),
    listDetail("removed", detail.removedSources, labels),
    detail.period
      ? {
          label: labels.detailField("period"),
          value: formatLocalizedDateRange(
            detail.period.from,
            detail.period.to,
            language,
          ),
        }
      : null,
  ].filter((item): item is ExplorerDetailItem => item !== null);
  return { rows, comparison: detailComparison(detail) };
};

const scheduleTimestamp = (
  value: { date: string; time: string } | null,
): string => (value ? `${value.date} ${value.time}` : "—");

const scheduleComparison = (
  leaf: Extract<SemanticDiffExplorerLeaf, { kind: "schedule" }>,
): ExplorerDetailPresentation["comparison"] =>
  leaf.change.before || leaf.change.after
    ? {
        before: scheduleTimestamp(leaf.change.before),
        after: scheduleTimestamp(leaf.change.after),
      }
    : null;

const scheduleDetails = (
  leaf: Extract<SemanticDiffExplorerLeaf, { kind: "schedule" }>,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailPresentation => ({
  rows: [{ label: labels.detailField("unit"), value: leaf.change.unitPath }],
  comparison: scheduleComparison(leaf),
});

const constraintDetails = (
  leaf: Exclude<SemanticDiffExplorerLeaf, { kind: "schedule" }>,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailItem[] =>
  "constraints" in leaf
    ? leaf.constraints.map((constraint) => ({
        label: labels.details,
        value: labels.detailField(constraint.code),
      }))
    : [];

const warningDetails = (
  leaf: Exclude<SemanticDiffExplorerLeaf, { kind: "schedule" }>,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailItem[] =>
  "warning" in leaf && leaf.warning
    ? [{ label: labels.warning, value: labels.reason(leaf.warning.code) }]
    : [];

const standardDetails = (
  leaf: Exclude<SemanticDiffExplorerLeaf, { kind: "schedule" }>,
  labels: SemanticDiffExplorerLabels,
  language: string,
): ExplorerDetailPresentation => {
  const details = leaf.detail
    ? detailItems({ detail: leaf.detail, labels, language })
    : emptyDetails();
  return {
    rows: [
      ...details.rows,
      ...constraintDetails(leaf, labels),
      ...warningDetails(leaf, labels),
    ],
    comparison: details.comparison,
  };
};

export const buildExplorerLeafDetails = ({
  leaf,
  labels,
  language,
}: Readonly<{
  leaf: SemanticDiffExplorerLeaf;
  labels: SemanticDiffExplorerLabels;
  language: string;
}>): ExplorerDetailPresentation =>
  leaf.kind === "schedule"
    ? scheduleDetails(leaf, labels)
    : standardDetails(leaf, labels, language);
