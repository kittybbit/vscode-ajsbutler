import type {
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerViewModel,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffDetail } from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";

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
}: Readonly<{
  detail: SemanticDiffDetail;
  labels: SemanticDiffExplorerLabels;
}>): ExplorerDetailPresentation => {
  const rows = [
    optionalDetail("unit", detail.unitPath, labels),
    optionalDetail("parameter", detail.parameterKey, labels),
    listDetail("raw", detail.rawValues, labels),
    listDetail("removed", detail.removedSources, labels),
  ].filter((item): item is ExplorerDetailItem => item !== null);
  return { rows, comparison: detailComparison(detail) };
};

const constraintDetails = (
  leaf: SemanticDiffExplorerLeaf,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailItem[] =>
  "constraints" in leaf
    ? leaf.constraints.map((constraint) => ({
        label: labels.details,
        value: labels.detailField(constraint.code),
      }))
    : [];

const warningDetails = (
  leaf: SemanticDiffExplorerLeaf,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailItem[] =>
  "warning" in leaf && leaf.warning
    ? [{ label: labels.warning, value: labels.reason(leaf.warning.code) }]
    : [];

const standardDetails = (
  leaf: SemanticDiffExplorerLeaf,
  labels: SemanticDiffExplorerLabels,
): ExplorerDetailPresentation => {
  const details = leaf.detail
    ? detailItems({ detail: leaf.detail, labels })
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
}: Readonly<{
  leaf: SemanticDiffExplorerLeaf;
  labels: SemanticDiffExplorerLabels;
}>): ExplorerDetailPresentation => standardDetails(leaf, labels);
