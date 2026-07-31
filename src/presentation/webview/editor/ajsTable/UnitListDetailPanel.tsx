import React, { FC, memo, useMemo } from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  unitInformationMessage,
  unitInformationUnitTypeLabel,
} from "../unitInformationLocalization";
import { useMyAppContext } from "../MyContexts";
import SharedUnitDetailPane, {
  type SharedUnitDetailPaneAction,
  type SharedUnitDetailPaneChip,
  type SharedUnitDetailPaneRow,
} from "../shared/SharedUnitDetailPane";
import type { UnitListDetail } from "./unitListDetail";

type UnitListDetailPanelProps = {
  detail: UnitListDetail;
  focusRequestRevision: number;
  onClose: VoidFunction;
  onFocusRequestHandled: (revision: number) => void;
  onOpenDefinition: VoidFunction;
  onOpenFlow: VoidFunction;
  onReturnFocus: VoidFunction;
};

export const buildUnitListDetailRows = (
  detail: UnitListDetail,
  language = "en",
): SharedUnitDetailPaneRow[] => [
  {
    label: unitInformationMessage("a11y.detail.comment", language),
    value: detail.row.group2.comment || "—",
  },
  {
    label: unitInformationMessage("a11y.detail.absolutePath", language),
    value: detail.row.absolutePath,
  },
  {
    label: unitInformationMessage("a11y.detail.parentUnit", language),
    value: detail.row.group1.parentAbsolutePath || "/",
  },
];

export const buildUnitListRelationshipRows = (
  detail: UnitListDetail,
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

export const buildUnitListDetailChips = (
  detail: UnitListDetail,
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
];

export const buildUnitListDetailActions = (
  canOpenDefinition: boolean,
  onOpenDefinition: VoidFunction,
  onOpenFlow: VoidFunction,
  language = "en",
): SharedUnitDetailPaneAction[] => [
  {
    label: unitInformationMessage("a11y.detail.openDefinition", language),
    icon: <DescriptionIcon />,
    onClick: onOpenDefinition,
    disabled: !canOpenDefinition,
  },
  {
    label: unitInformationMessage("a11y.detail.openFlow", language),
    icon: <AccountTreeIcon />,
    onClick: onOpenFlow,
  },
];

export const getUnitListDetailSubtitle = (
  detail: UnitListDetail,
  language: string,
): string =>
  unitInformationUnitTypeLabel(
    detail.row.group1.unitType,
    language,
    detail.row.group1.groupType ?? "n",
  );

const UnitListDetailPanel: FC<UnitListDetailPanelProps> = ({
  detail,
  focusRequestRevision,
  onClose,
  onFocusRequestHandled,
  onOpenDefinition,
  onOpenFlow,
  onReturnFocus,
}) => {
  const { lang = "en" } = useMyAppContext();
  const rows = useMemo(
    () => buildUnitListDetailRows(detail, lang),
    [detail, lang],
  );
  const relationshipRows = useMemo(
    () => buildUnitListRelationshipRows(detail, lang),
    [detail, lang],
  );
  const chips = useMemo(
    () => buildUnitListDetailChips(detail, lang),
    [detail, lang],
  );
  const actions = useMemo(
    () =>
      buildUnitListDetailActions(
        Boolean(detail.definition),
        onOpenDefinition,
        onOpenFlow,
        lang,
      ),
    [detail.definition, lang, onOpenDefinition, onOpenFlow],
  );
  const subtitle = getUnitListDetailSubtitle(detail, lang);

  return (
    <SharedUnitDetailPane
      title={detail.row.group1.name}
      subtitle={subtitle}
      ariaLabel={unitInformationMessage("a11y.table.detail", lang)}
      collapsedAriaLabel={unitInformationMessage(
        "a11y.table.detail.collapsed",
        lang,
      )}
      closeAriaLabel={unitInformationMessage("a11y.table.detail.close", lang)}
      collapseTooltip={unitInformationMessage(
        "a11y.table.detail.collapse",
        lang,
      )}
      expandTooltip={unitInformationMessage("a11y.table.detail.expand", lang)}
      closeTooltip={unitInformationMessage("a11y.table.detail.close", lang)}
      focusRequestRevision={focusRequestRevision}
      onClose={onClose}
      onFocusRequestHandled={onFocusRequestHandled}
      onReturnFocus={onReturnFocus}
      rows={rows}
      relationshipRows={relationshipRows}
      chips={chips}
      actions={actions}
    />
  );
};

export default memo(UnitListDetailPanel);
