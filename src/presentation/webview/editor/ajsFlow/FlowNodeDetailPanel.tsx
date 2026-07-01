import React, { FC, memo, useMemo } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import TableChartIcon from "@mui/icons-material/TableChart";
import { unitTypeLabel } from "../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import type { FlowNodeDetail } from "./flowNodeDetail";
import SharedUnitDetailPane, {
  type SharedUnitDetailPaneAction,
  type SharedUnitDetailPaneChip,
  type SharedUnitDetailPaneRow,
} from "../shared/SharedUnitDetailPane";

type FlowNodeDetailPanelProps = {
  detail: FlowNodeDetail;
  onClose: VoidFunction;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
  onOpenUnitList: VoidFunction;
  focusModeEnabled: boolean;
  onToggleFocusMode: VoidFunction;
};

type FlowNodeDetailActionOptions = {
  canOpenAsScope: boolean;
  focusModeEnabled: boolean;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
  onOpenUnitList: VoidFunction;
  onToggleFocusMode: VoidFunction;
};

const missingValueLabel = "—";

const flowNodeDetailRow = (
  label: string,
  value: SharedUnitDetailPaneRow["value"],
): SharedUnitDetailPaneRow => ({ label, value });

const formatParentUnit = ({
  parentName,
  parentPath,
}: FlowNodeDetail): string => {
  if (!parentName) {
    return missingValueLabel;
  }
  return parentPath ? `${parentName} (${parentPath})` : parentName;
};

export const buildFlowNodeDetailRows = (
  detail: FlowNodeDetail,
): SharedUnitDetailPaneRow[] => [
  flowNodeDetailRow("Comment", detail.comment || missingValueLabel),
  flowNodeDetailRow("Absolute path", detail.absolutePath),
  flowNodeDetailRow("Parent unit", formatParentUnit(detail)),
];

export const buildFlowNodeRelationshipRows = (
  detail: FlowNodeDetail,
): SharedUnitDetailPaneRow[] => [
  { label: "Predecessors", value: detail.predecessorCount },
  { label: "Successors", value: detail.successorCount },
  { label: "Upstream", value: detail.upstreamCount },
  { label: "Downstream", value: detail.downstreamCount },
];

export const buildFlowNodeDetailChips = (
  detail: FlowNodeDetail,
  focusModeEnabled: boolean,
): SharedUnitDetailPaneChip[] => [
  { active: detail.hasSchedule, label: "Schedule" },
  { active: detail.hasWaitedFor, label: "Waited for" },
  { active: detail.canExpandNested, label: "Nested expandable" },
  { active: detail.isSearchMatch, label: "Search match" },
  { active: detail.isCurrentSearchResult, label: "Current search result" },
  { active: focusModeEnabled, label: "Relationship focus" },
];

const buildRelationshipFocusAction = ({
  focusModeEnabled,
  onToggleFocusMode,
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction => ({
  label: focusModeEnabled ? "Exit relationship focus" : "Focus relationships",
  icon: <CenterFocusStrongIcon />,
  onClick: onToggleFocusMode,
  variant: focusModeEnabled ? "contained" : "outlined",
});

const buildOpenDefinitionAction = ({
  onOpenDefinition,
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction => ({
  label: "Open definition details",
  icon: <DescriptionIcon />,
  onClick: onOpenDefinition,
});

const buildOpenUnitListAction = ({
  onOpenUnitList,
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction => ({
  label: "Open in unit list",
  icon: <TableChartIcon />,
  onClick: onOpenUnitList,
});

const buildOpenScopeActions = ({
  canOpenAsScope,
  onOpenScope,
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction[] =>
  canOpenAsScope
    ? [
        {
          label: "Open as graph scope",
          icon: <FolderOpenIcon />,
          onClick: onOpenScope,
          variant: "contained",
        },
      ]
    : [];

export const buildFlowNodeDetailActions = (
  options: FlowNodeDetailActionOptions,
): SharedUnitDetailPaneAction[] => [
  buildRelationshipFocusAction(options),
  buildOpenDefinitionAction(options),
  buildOpenUnitListAction(options),
  ...buildOpenScopeActions(options),
];

const buildFlowNodeDetailActionOptions = ({
  detail,
  focusModeEnabled,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  onToggleFocusMode,
}: Omit<FlowNodeDetailPanelProps, "onClose">): FlowNodeDetailActionOptions => ({
  canOpenAsScope: detail.canOpenAsScope,
  focusModeEnabled,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  onToggleFocusMode,
});

const FlowNodeDetailPanel: FC<FlowNodeDetailPanelProps> = ({
  detail,
  onClose,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  focusModeEnabled,
  onToggleFocusMode,
}) => {
  const { lang = "en" } = useMyAppContext();
  const rows = useMemo(() => buildFlowNodeDetailRows(detail), [detail]);
  const relationshipRows = useMemo(
    () => buildFlowNodeRelationshipRows(detail),
    [detail],
  );
  const chips = useMemo(
    () => buildFlowNodeDetailChips(detail, focusModeEnabled),
    [detail, focusModeEnabled],
  );
  const actions = useMemo(
    () =>
      buildFlowNodeDetailActions(
        buildFlowNodeDetailActionOptions({
          detail,
          onOpenDefinition,
          onOpenScope,
          onOpenUnitList,
          focusModeEnabled,
          onToggleFocusMode,
        }),
      ),
    [
      detail.canOpenAsScope,
      focusModeEnabled,
      onOpenDefinition,
      onOpenScope,
      onOpenUnitList,
      onToggleFocusMode,
    ],
  );

  return (
    <SharedUnitDetailPane
      title={detail.name}
      subtitle={unitTypeLabel(detail.unitType, lang, detail.groupType)}
      ariaLabel="Selected flow node details"
      collapsedAriaLabel="Collapsed selected flow node details"
      closeAriaLabel="Close node details"
      collapseTooltip="Collapse node details"
      expandTooltip="Expand node details"
      closeTooltip="Close node details"
      onClose={onClose}
      rows={rows}
      relationshipRows={relationshipRows}
      chips={chips}
      actions={actions}
    />
  );
};

export default memo(FlowNodeDetailPanel);
