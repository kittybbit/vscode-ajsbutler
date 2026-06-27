import React, { FC, memo, useMemo } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
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
  focusModeEnabled: boolean;
  onToggleFocusMode: VoidFunction;
};

export const buildFlowNodeDetailRows = (
  detail: FlowNodeDetail,
): SharedUnitDetailPaneRow[] => {
  const parent = detail.parentName
    ? `${detail.parentName}${detail.parentPath ? ` (${detail.parentPath})` : ""}`
    : "—";
  return [
    { label: "Comment", value: detail.comment || "—" },
    { label: "Absolute path", value: detail.absolutePath },
    { label: "Parent unit", value: parent },
  ];
};

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

export const buildFlowNodeDetailActions = ({
  canOpenAsScope,
  focusModeEnabled,
  onOpenDefinition,
  onOpenScope,
  onToggleFocusMode,
}: {
  canOpenAsScope: boolean;
  focusModeEnabled: boolean;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
  onToggleFocusMode: VoidFunction;
}): SharedUnitDetailPaneAction[] => [
  {
    label: focusModeEnabled ? "Exit relationship focus" : "Focus relationships",
    icon: <CenterFocusStrongIcon />,
    onClick: onToggleFocusMode,
    variant: focusModeEnabled ? "contained" : "outlined",
  },
  {
    label: "Open definition details",
    icon: <DescriptionIcon />,
    onClick: onOpenDefinition,
  },
  ...(canOpenAsScope
    ? [
        {
          label: "Open as graph scope",
          icon: <FolderOpenIcon />,
          onClick: onOpenScope,
          variant: "contained" as const,
        },
      ]
    : []),
];

const FlowNodeDetailPanel: FC<FlowNodeDetailPanelProps> = ({
  detail,
  onClose,
  onOpenDefinition,
  onOpenScope,
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
      buildFlowNodeDetailActions({
        canOpenAsScope: detail.canOpenAsScope,
        focusModeEnabled,
        onOpenDefinition,
        onOpenScope,
        onToggleFocusMode,
      }),
    [
      detail.canOpenAsScope,
      focusModeEnabled,
      onOpenDefinition,
      onOpenScope,
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
