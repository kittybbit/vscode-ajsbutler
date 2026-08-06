import React, { FC, memo, useMemo } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import TableChartIcon from "@mui/icons-material/TableChart";
import {
  unitInformationMessage,
  unitInformationUnitTypeLabel,
} from "../unitInformationLocalization";
import { useMyAppContext } from "../MyContexts";
import type { FlowNodeDetail } from "./flowNodeDetail";
import {
  buildFlowNodeDetailActions,
  buildFlowNodeDetailChips,
  buildFlowNodeRelationshipRows,
  buildFlowNodeDetailRows,
  type FlowNodeDetailAction,
  type FlowNodeDetailActionOptions,
} from "./flowNodeDetailPresentation";
import SharedUnitDetailPane, {
  type SharedUnitDetailPaneAction,
} from "../shared/SharedUnitDetailPane";

type FlowNodeDetailPanelProps = {
  detail: FlowNodeDetail;
  onClose: VoidFunction;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
  onOpenUnitList: VoidFunction;
  onReturnFocus?: VoidFunction;
  focusRequestRevision?: number;
  onFocusRequestHandled?: (revision: number) => void;
  focusModeEnabled: boolean;
  onToggleFocusMode: VoidFunction;
  language?: string;
};

const flowNodeDetailActionIcon: Record<
  FlowNodeDetailAction["kind"],
  React.ReactNode
> = {
  focusRelationships: <CenterFocusStrongIcon />,
  openDefinition: <DescriptionIcon />,
  openUnitList: <TableChartIcon />,
  openScope: <FolderOpenIcon />,
};

const toSharedUnitDetailPaneAction = (
  action: FlowNodeDetailAction,
): SharedUnitDetailPaneAction => ({
  label: action.label,
  icon: flowNodeDetailActionIcon[action.kind],
  onClick: action.onClick,
  variant: action.variant,
});

const buildFlowNodeDetailActionOptions = ({
  detail,
  focusModeEnabled,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  onToggleFocusMode,
  language,
}: Omit<FlowNodeDetailPanelProps, "onClose">): FlowNodeDetailActionOptions => ({
  canOpenAsScope: detail.canOpenAsScope,
  canOpenDefinition: detail.canOpenDefinition,
  focusModeEnabled,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  onToggleFocusMode,
  language,
});

const FlowNodeDetailPanel: FC<FlowNodeDetailPanelProps> = ({
  detail,
  onClose,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  onReturnFocus,
  focusRequestRevision,
  onFocusRequestHandled,
  focusModeEnabled,
  onToggleFocusMode,
}) => {
  const { lang = "en" } = useMyAppContext();
  const rows = useMemo(
    () => buildFlowNodeDetailRows(detail, lang),
    [detail, lang],
  );
  const relationshipRows = useMemo(
    () => buildFlowNodeRelationshipRows(detail, lang),
    [detail, lang],
  );
  const chips = useMemo(
    () => buildFlowNodeDetailChips(detail, focusModeEnabled, lang),
    [detail, focusModeEnabled, lang],
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
          language: lang,
        }),
      ).map(toSharedUnitDetailPaneAction),
    [
      detail.canOpenAsScope,
      detail.canOpenDefinition,
      focusModeEnabled,
      onOpenDefinition,
      onOpenScope,
      onOpenUnitList,
      onToggleFocusMode,
      lang,
    ],
  );

  return (
    <SharedUnitDetailPane
      title={detail.name}
      subtitle={unitInformationUnitTypeLabel(
        detail.unitType,
        lang,
        detail.groupType,
      )}
      ariaLabel={unitInformationMessage("a11y.flow.detail", lang)}
      collapsedAriaLabel={unitInformationMessage(
        "a11y.flow.detail.collapsed",
        lang,
      )}
      closeAriaLabel={unitInformationMessage("a11y.flow.detail.close", lang)}
      collapseTooltip={unitInformationMessage(
        "a11y.flow.detail.collapse",
        lang,
      )}
      expandTooltip={unitInformationMessage("a11y.flow.detail.expand", lang)}
      closeTooltip={unitInformationMessage("a11y.flow.detail.close", lang)}
      onClose={onClose}
      onReturnFocus={onReturnFocus}
      focusRequestRevision={focusRequestRevision}
      onFocusRequestHandled={onFocusRequestHandled}
      rows={rows}
      relationshipRows={relationshipRows}
      chips={chips}
      actions={actions}
    />
  );
};

export default memo(FlowNodeDetailPanel);
