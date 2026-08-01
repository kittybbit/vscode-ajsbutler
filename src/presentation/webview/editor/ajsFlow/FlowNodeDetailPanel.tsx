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
  onReturnFocus?: VoidFunction;
  focusRequestRevision?: number;
  onFocusRequestHandled?: (revision: number) => void;
  focusModeEnabled: boolean;
  onToggleFocusMode: VoidFunction;
  language?: string;
};

type FlowNodeDetailActionOptions = {
  canOpenAsScope: boolean;
  canOpenDefinition: boolean;
  focusModeEnabled: boolean;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
  onOpenUnitList: VoidFunction;
  onToggleFocusMode: VoidFunction;
  language?: string;
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
  language = "en",
): SharedUnitDetailPaneRow[] => [
  flowNodeDetailRow(
    unitInformationMessage("a11y.detail.comment", language),
    detail.comment || missingValueLabel,
  ),
  flowNodeDetailRow(
    unitInformationMessage("a11y.detail.absolutePath", language),
    detail.absolutePath,
  ),
  flowNodeDetailRow(
    unitInformationMessage("a11y.detail.parentUnit", language),
    formatParentUnit(detail),
  ),
];

export const buildFlowNodeRelationshipRows = (
  detail: FlowNodeDetail,
  language = "en",
): SharedUnitDetailPaneRow[] => [
  {
    label: unitInformationMessage("a11y.detail.predecessors", language),
    value: detail.predecessorCount,
  },
  {
    label: unitInformationMessage("a11y.detail.successors", language),
    value: detail.successorCount,
  },
  {
    label: unitInformationMessage("a11y.detail.upstream", language),
    value: detail.upstreamCount,
  },
  {
    label: unitInformationMessage("a11y.detail.downstream", language),
    value: detail.downstreamCount,
  },
];

export const buildFlowNodeDetailChips = (
  detail: FlowNodeDetail,
  focusModeEnabled: boolean,
  language = "en",
): SharedUnitDetailPaneChip[] => [
  {
    active: detail.hasSchedule,
    label: unitInformationMessage("a11y.detail.schedule", language),
  },
  {
    active: detail.hasWaitedFor,
    label: unitInformationMessage("a11y.detail.waitedFor", language),
  },
  {
    active: detail.canExpandNested,
    label: unitInformationMessage("a11y.detail.nestedExpandable", language),
  },
  {
    active: detail.isSearchMatch,
    label: unitInformationMessage("a11y.detail.searchMatch", language),
  },
  {
    active: detail.isCurrentSearchResult,
    label: unitInformationMessage("a11y.detail.currentSearchResult", language),
  },
  {
    active: focusModeEnabled,
    label: unitInformationMessage("a11y.detail.relationshipFocus", language),
  },
];

const buildRelationshipFocusAction = ({
  focusModeEnabled,
  onToggleFocusMode,
  language = "en",
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction => ({
  label: unitInformationMessage(
    focusModeEnabled
      ? "a11y.detail.exitRelationships"
      : "a11y.detail.focusRelationships",
    language,
  ),
  icon: <CenterFocusStrongIcon />,
  onClick: onToggleFocusMode,
  variant: focusModeEnabled ? "contained" : "outlined",
});

const buildOpenDefinitionActions = ({
  canOpenDefinition,
  onOpenDefinition,
  language = "en",
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction[] =>
  canOpenDefinition
    ? [
        {
          label: unitInformationMessage("a11y.detail.openDefinition", language),
          icon: <DescriptionIcon />,
          onClick: onOpenDefinition,
        },
      ]
    : [];

const buildOpenUnitListAction = ({
  onOpenUnitList,
  language = "en",
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction => ({
  label: unitInformationMessage("a11y.detail.openUnitList", language),
  icon: <TableChartIcon />,
  onClick: onOpenUnitList,
});

const buildOpenScopeActions = ({
  canOpenAsScope,
  onOpenScope,
  language = "en",
}: FlowNodeDetailActionOptions): SharedUnitDetailPaneAction[] =>
  canOpenAsScope
    ? [
        {
          label: unitInformationMessage("a11y.detail.openScope", language),
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
  ...buildOpenDefinitionActions(options),
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
      ),
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
