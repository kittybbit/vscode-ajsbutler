import React, { FC, memo, useMemo } from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import { unitTypeLabel } from "../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import SharedUnitDetailPane, {
  type SharedUnitDetailPaneAction,
  type SharedUnitDetailPaneChip,
  type SharedUnitDetailPaneRow,
} from "../shared/SharedUnitDetailPane";
import type { UnitListDetail } from "./unitListDetail";

type UnitListDetailPanelProps = {
  detail: UnitListDetail;
  onClose: VoidFunction;
  onOpenDefinition: VoidFunction;
  onOpenFlow: VoidFunction;
};

export const buildUnitListDetailRows = (
  detail: UnitListDetail,
): SharedUnitDetailPaneRow[] => [
  { label: "Comment", value: detail.row.group2.comment || "—" },
  { label: "Absolute path", value: detail.row.absolutePath },
  { label: "Parent unit", value: detail.row.group1.parentAbsolutePath || "/" },
];

export const buildUnitListRelationshipRows = (
  detail: UnitListDetail,
): SharedUnitDetailPaneRow[] => [
  { label: "Predecessors", value: detail.predecessorCount },
  { label: "Successors", value: detail.successorCount },
  { label: "Upstream", value: detail.upstreamCount },
  { label: "Downstream", value: detail.downstreamCount },
];

export const buildUnitListDetailChips = (
  detail: UnitListDetail,
): SharedUnitDetailPaneChip[] => [
  { active: detail.hasSchedule, label: "Schedule" },
  { active: detail.hasWaitedFor, label: "Waited for" },
  { active: detail.canExpandNested, label: "Nested expandable" },
];

export const buildUnitListDetailActions = (
  canOpenDefinition: boolean,
  onOpenDefinition: VoidFunction,
  onOpenFlow: VoidFunction,
): SharedUnitDetailPaneAction[] => [
  {
    label: "Open definition details",
    icon: <DescriptionIcon />,
    onClick: onOpenDefinition,
    disabled: !canOpenDefinition,
  },
  {
    label: "Open in flow graph",
    icon: <AccountTreeIcon />,
    onClick: onOpenFlow,
  },
];

const UnitListDetailPanel: FC<UnitListDetailPanelProps> = ({
  detail,
  onClose,
  onOpenDefinition,
  onOpenFlow,
}) => {
  const { lang = "en" } = useMyAppContext();
  const rows = useMemo(() => buildUnitListDetailRows(detail), [detail]);
  const relationshipRows = useMemo(
    () => buildUnitListRelationshipRows(detail),
    [detail],
  );
  const chips = useMemo(() => buildUnitListDetailChips(detail), [detail]);
  const actions = useMemo(
    () =>
      buildUnitListDetailActions(
        Boolean(detail.definition),
        onOpenDefinition,
        onOpenFlow,
      ),
    [detail.definition, onOpenDefinition, onOpenFlow],
  );
  const subtitle = unitTypeLabel(
    detail.row.group1.unitType,
    lang,
    detail.row.group1.groupType ?? "n",
  );

  return (
    <SharedUnitDetailPane
      title={detail.row.group1.name}
      subtitle={subtitle}
      ariaLabel="Selected list unit details"
      collapsedAriaLabel="Collapsed selected list unit details"
      closeAriaLabel="Close list unit details"
      collapseTooltip="Collapse list unit details"
      expandTooltip="Expand list unit details"
      closeTooltip="Close list unit details"
      onClose={onClose}
      rows={rows}
      relationshipRows={relationshipRows}
      chips={chips}
      actions={actions}
    />
  );
};

export default memo(UnitListDetailPanel);
