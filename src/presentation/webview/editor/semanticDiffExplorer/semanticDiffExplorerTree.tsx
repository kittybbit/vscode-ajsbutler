import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffExplorerLeaf } from "../../../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffTarget,
  SemanticDiffUnitTarget,
} from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import {
  allExpandableNodeIds,
  flattenSemanticDiffExplorerTree,
  type ExplorerRow,
} from "./semanticDiffExplorerTreeData";
import { viewerFocusSx, viewerSelectionSx } from "../../shared/viewerTheme";
import ResultComparison from "../shared/result/ResultComparison";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import ResultStatusChip from "../shared/result/ResultStatusChip";
import { focusExplorerRowAfterVirtualizedScroll } from "./semanticDiffExplorerFocus";
import { buildExplorerLeafDetails } from "./semanticDiffExplorerDetails";

export type { ExplorerRow } from "./semanticDiffExplorerTreeData";

type TargetFormatter<K extends SemanticDiffTarget["kind"]> = (
  target: Extract<SemanticDiffTarget, { kind: K }>,
  labels: SemanticDiffExplorerLabels,
) => string;

const targetFormatters = {
  "job-group": ((target, labels) =>
    target.path ?? labels.value("job-group")) as TargetFormatter<"job-group">,
  unit: ((target: SemanticDiffUnitTarget) =>
    target.unit.absolutePath || target.unit.name) as TargetFormatter<"unit">,
  jobnet: ((target: SemanticDiffUnitTarget) =>
    target.unit.absolutePath || target.unit.name) as TargetFormatter<"jobnet">,
  attribute: ((target) =>
    `${target.unit.absolutePath || target.unit.name} (${target.parameterKey})`) as TargetFormatter<"attribute">,
  relation: ((target) =>
    `${target.relation.sourceUnitId} → ${target.relation.targetUnitId}`) as TargetFormatter<"relation">,
};

const targetLabel = ({
  target,
  labels,
}: Readonly<{
  target: SemanticDiffTarget | null;
  labels: SemanticDiffExplorerLabels;
}>): string =>
  target
    ? (targetFormatters[target.kind] as TargetFormatter<typeof target.kind>)(
        target as never,
        labels,
      )
    : "";

type LeafFacts = Readonly<{
  changeKind: string | null;
  state: string;
  unsupportedKind: string | null;
  reason: string | null;
}>;

type LeafKind = SemanticDiffExplorerLeaf["kind"];
type LeafOf<K extends LeafKind> = Extract<
  SemanticDiffExplorerLeaf,
  { kind: K }
>;
type LeafFactBuilder<K extends LeafKind> = (
  leaf: LeafOf<K>,
  labels: SemanticDiffExplorerLabels,
) => LeafFacts;

const buildChangeFacts: LeafFactBuilder<"change"> = (leaf, labels) => ({
  changeKind: labels.state(leaf.changeKind),
  state: labels.state(leaf.confirmationLevel),
  unsupportedKind: null,
  reason: null,
});
const buildConfirmationFacts: LeafFactBuilder<"confirmation"> = (
  leaf,
  labels,
) => ({
  changeKind: null,
  state: labels.state("confirmation-required"),
  unsupportedKind: null,
  reason: labels.reason(leaf.reasonCode),
});
const buildUnsupportedFacts: LeafFactBuilder<"unsupported"> = (
  leaf,
  labels,
) => {
  const value = labels.state(leaf.unsupportedKind);
  return {
    changeKind: null,
    state: labels.state("unsupported"),
    unsupportedKind: value === labels.state("unsupported") ? null : value,
    reason: labels.reason(leaf.reasonCode),
  };
};
const buildLimitationFacts: LeafFactBuilder<"limitation"> = (leaf, labels) => {
  const value = labels.state(leaf.limitationKind);
  return {
    changeKind: null,
    state: labels.state("limitation"),
    unsupportedKind: value === labels.state("limitation") ? null : value,
    reason: labels.state(leaf.code),
  };
};
const buildScheduleFacts: LeafFactBuilder<"schedule"> = (leaf, labels) => ({
  changeKind: null,
  state: labels.state(leaf.change.kind),
  unsupportedKind: null,
  reason: null,
});

const leafFactBuilders = {
  change: buildChangeFacts,
  confirmation: buildConfirmationFacts,
  unsupported: buildUnsupportedFacts,
  limitation: buildLimitationFacts,
  schedule: buildScheduleFacts,
};

const leafFacts = ({
  leaf,
  labels,
}: Readonly<{
  leaf: SemanticDiffExplorerLeaf;
  labels: SemanticDiffExplorerLabels;
}>): LeafFacts =>
  (leafFactBuilders[leaf.kind] as LeafFactBuilder<LeafKind>)(
    leaf as never,
    labels,
  );

const leafTarget = (
  leaf: SemanticDiffExplorerLeaf,
): SemanticDiffTarget | null =>
  leaf.kind === "limitation" || leaf.kind === "schedule"
    ? null
    : leaf.target.value;

const leafLabel = ({
  leaf,
  labels,
}: Readonly<{
  leaf: SemanticDiffExplorerLeaf;
  labels: SemanticDiffExplorerLabels;
}>): string => {
  const target = targetLabel({ target: leafTarget(leaf), labels });
  const facts = leafFacts({ leaf, labels });
  return [
    facts.changeKind,
    facts.state,
    facts.unsupportedKind,
    facts.reason,
    target,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" — ");
};

const rowLabel = ({
  row,
  labels,
}: Readonly<{
  row: ExplorerRow;
  labels: SemanticDiffExplorerLabels;
}>): string =>
  row.kind === "group"
    ? labels.group(row.node?.label ?? "")
    : leafLabel({ leaf: row.leaf!, labels });

const unavailableActionLabel = (
  action: SemanticDiffExplorerLeaf["actions"]["source"],
  labels: SemanticDiffExplorerLabels,
): string =>
  action.unavailableReason
    ? labels.reason(action.unavailableReason)
    : labels.unavailable;

const actionAriaLabel = (
  label: string,
  unavailable: string,
  actionId: string | null,
): string => (actionId === null ? `${label}: ${unavailable}` : label);
const handleActionClick = ({
  event,
  actionId,
  onAction,
}: Readonly<{
  event: React.MouseEvent<HTMLButtonElement>;
  actionId: string | null;
  onAction?: (id: string, element?: HTMLElement) => void;
}>): void => {
  event.stopPropagation();
  if (actionId !== null) onAction?.(actionId, event.currentTarget);
};

const ActionButton = ({
  actionId,
  label,
  unavailable,
  icon,
  onAction,
}: Readonly<{
  actionId: string | null;
  label: string;
  unavailable: string;
  icon: React.ReactElement;
  onAction?: (id: string, element?: HTMLElement) => void;
}>): React.ReactElement => {
  return (
    <Button
      type="button"
      size="small"
      variant="outlined"
      startIcon={icon}
      disabled={actionId === null}
      aria-label={actionAriaLabel(label, unavailable, actionId)}
      sx={{
        flex: "1 1 10rem",
        minWidth: 44,
        minHeight: 44,
        justifyContent: "flex-start",
        textAlign: "left",
        overflowWrap: "anywhere",
        ...viewerFocusSx,
      }}
      onClick={(event) => handleActionClick({ event, actionId, onAction })}
    >
      {label}
    </Button>
  );
};

const ExplorerGroupRow = ({
  row,
  selected,
  labels,
  onToggle,
  rowRef,
}: Readonly<{
  row: ExplorerRow;
  selected: boolean;
  labels: SemanticDiffExplorerLabels;
  onToggle: () => void;
  rowRef: (element: HTMLElement | null) => void;
}>): React.ReactElement => (
  <Box
    component="div"
    ref={rowRef}
    role="treeitem"
    id={row.id}
    aria-level={row.level}
    aria-posinset={row.position}
    aria-setsize={row.size}
    aria-expanded={row.expanded}
    aria-selected={selected}
    data-row-id={row.id}
    data-row-kind="group"
    sx={rowSx(selected)}
    onClick={onToggle}
  >
    <Typography component="span" aria-hidden="true" sx={{ width: 24 }}>
      {expandGlyph(row.expanded)}
    </Typography>
    <Typography component="span" sx={{ overflowWrap: "anywhere" }}>
      {labels.group(row.node?.label ?? "")}
    </Typography>
  </Box>
);

const rowSx = (selected: boolean) => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
  minHeight: 44,
  px: 1,
  py: 0.5,
  cursor: "pointer",
  border: "1px solid transparent",
  borderRadius: 1,
  backgroundColor: selected ? "action.selected" : "transparent",
  color: "text.primary",
  ...viewerFocusSx,
  ...viewerSelectionSx(selected),
});
const expandGlyph = (expanded: boolean): string => (expanded ? "▾" : "▸");

const ExplorerRowView = ({
  row,
  selected,
  labels,
  language,
  onSelect,
  onToggle,
  onAction,
  rowRef,
}: Readonly<{
  row: ExplorerRow;
  selected: boolean;
  labels: SemanticDiffExplorerLabels;
  language: string;
  onSelect: () => void;
  onToggle: () => void;
  onAction?: (id: string, element?: HTMLElement) => void;
  rowRef: (element: HTMLElement | null) => void;
}>): React.ReactElement => {
  if (row.kind === "group" && row.node) {
    return (
      <ExplorerGroupRow
        row={row}
        selected={selected}
        labels={labels}
        onToggle={onToggle}
        rowRef={rowRef}
      />
    );
  }
  return (
    <ExplorerLeafRow
      row={row}
      selected={selected}
      labels={labels}
      language={language}
      onSelect={onSelect}
      onAction={onAction}
      rowRef={rowRef}
    />
  );
};

const ExplorerLeafRow = ({
  row,
  selected,
  labels,
  language,
  onSelect,
  onAction,
  rowRef,
}: Readonly<{
  row: ExplorerRow;
  selected: boolean;
  labels: SemanticDiffExplorerLabels;
  language: string;
  onSelect: () => void;
  onAction?: (id: string, element?: HTMLElement) => void;
  rowRef: (element: HTMLElement | null) => void;
}>): React.ReactElement => {
  const leaf = row.leaf!;
  const facts = leafFacts({ leaf, labels });
  return (
    <Box
      component="div"
      ref={rowRef}
      role="treeitem"
      id={row.id}
      aria-level={row.level}
      aria-posinset={row.position}
      aria-setsize={row.size}
      aria-selected={selected}
      data-row-id={row.id}
      data-record-kind={leaf.kind}
      data-record-id={leaf.recordId}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1,
        minHeight: 48,
        px: { xs: 1, sm: 1.5 },
        py: 1,
        border: "1px solid transparent",
        borderRadius: 1,
        backgroundColor: selected ? "action.selected" : "transparent",
        color: "text.primary",
        ...viewerFocusSx,
        ...viewerSelectionSx(selected),
      }}
      onClick={onSelect}
    >
      <ExplorerLeafFacts
        facts={facts}
        labels={labels}
        leaf={leaf}
        language={language}
        rowId={row.id}
      />
      <ExplorerLeafActions leaf={leaf} labels={labels} onAction={onAction} />
    </Box>
  );
};

const ExplorerLeafFacts = ({
  facts,
  labels,
  leaf,
  language,
  rowId,
}: Readonly<{
  facts: LeafFacts;
  labels: SemanticDiffExplorerLabels;
  leaf: SemanticDiffExplorerLeaf;
  language: string;
  rowId: string;
}>): React.ReactElement => {
  const details = buildExplorerLeafDetails({ leaf, labels, language });
  const target = targetLabel({ target: leafTarget(leaf), labels });
  return (
    <>
      <FactChip value={facts.changeKind} fact="change-kind" />
      <ResultStatusChip
        label={facts.state}
        ariaLabel={`${labels.stateLabel}: ${facts.state}`}
        dataFact="state"
      />
      <FactChip value={facts.unsupportedKind} fact="unsupported-kind" />
      <FactText value={facts.reason} fact="reason" />
      <FactText value={target} fact="target" />
      {details.rows.length > 0 ? (
        <Box sx={{ flex: "1 1 100%", minWidth: 0 }}>
          <ResultKeyValueList items={details.rows} />
        </Box>
      ) : null}
      {details.comparison ? (
        <Box sx={{ flex: "1 1 100%", minWidth: 0 }}>
          <ResultComparison
            beforeLabel={labels.detailField("before")}
            afterLabel={labels.detailField("after")}
            before={details.comparison.before}
            after={details.comparison.after}
            ariaLabel={`${rowId}: ${labels.detailField("before")} / ${labels.detailField("after")}`}
          />
        </Box>
      ) : null}
    </>
  );
};

const FactChip = ({
  value,
  fact,
}: Readonly<{
  value: string | null;
  fact: string;
}>): React.ReactElement | null =>
  value ? (
    <Chip
      component="span"
      size="small"
      variant="outlined"
      data-fact={fact}
      className="sde-state"
      label={value}
    />
  ) : null;

const FactText = ({
  value,
  fact,
}: Readonly<{
  value: string | null;
  fact: string;
}>): React.ReactElement | null =>
  value ? (
    <Typography
      component="span"
      data-fact={fact}
      sx={{ overflowWrap: "anywhere" }}
    >
      {value}
    </Typography>
  ) : null;

const ExplorerLeafActions = ({
  leaf,
  labels,
  onAction,
}: Readonly<{
  leaf: SemanticDiffExplorerLeaf;
  labels: SemanticDiffExplorerLabels;
  onAction?: (id: string, element?: HTMLElement) => void;
}>): React.ReactElement => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={1}
    role="group"
    aria-label={labels.availableActions}
    sx={{ flex: "1 1 100%", minWidth: 0 }}
  >
    <ActionButton
      actionId={leaf.actions.source.actionId}
      label={labels.source}
      unavailable={unavailableActionLabel(leaf.actions.source, labels)}
      icon={<OpenInNewIcon aria-hidden="true" fontSize="small" />}
      onAction={onAction}
    />
    <ActionButton
      actionId={leaf.actions.flow.actionId}
      label={labels.flow}
      unavailable={unavailableActionLabel(leaf.actions.flow, labels)}
      icon={<AccountTreeIcon aria-hidden="true" fontSize="small" />}
      onAction={onAction}
    />
  </Stack>
);

export const renderExplorerRowLabel = rowLabel;
export { allExpandableNodeIds, flattenSemanticDiffExplorerTree };
export { focusExplorerRowAfterVirtualizedScroll };
export { ExplorerRowView };
