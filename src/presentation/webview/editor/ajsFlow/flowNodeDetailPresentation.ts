import { unitInformationMessage } from "../unitInformationLocalization";
import type { FlowNodeDetail } from "./flowNodeDetail";
import type {
  SharedUnitDetailPaneChip,
  SharedUnitDetailPaneRow,
} from "../shared/SharedUnitDetailPane";

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

export type FlowNodeDetailActionKind =
  | "focusRelationships"
  | "openDefinition"
  | "openUnitList"
  | "openScope";

export type FlowNodeDetailAction = {
  kind: FlowNodeDetailActionKind;
  label: string;
  onClick: VoidFunction;
  variant?: "contained" | "outlined" | "text";
};

export type FlowNodeDetailActionOptions = {
  canOpenAsScope: boolean;
  canOpenDefinition: boolean;
  focusModeEnabled: boolean;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
  onOpenUnitList: VoidFunction;
  onToggleFocusMode: VoidFunction;
  language?: string;
};

export const buildFlowNodeDetailActions = ({
  canOpenAsScope,
  canOpenDefinition,
  focusModeEnabled,
  onOpenDefinition,
  onOpenScope,
  onOpenUnitList,
  onToggleFocusMode,
  language = "en",
}: FlowNodeDetailActionOptions): FlowNodeDetailAction[] => [
  {
    kind: "focusRelationships",
    label: unitInformationMessage(
      focusModeEnabled
        ? "a11y.detail.exitRelationships"
        : "a11y.detail.focusRelationships",
      language,
    ),
    onClick: onToggleFocusMode,
    variant: focusModeEnabled ? "contained" : "outlined",
  },
  ...(canOpenDefinition
    ? [
        {
          kind: "openDefinition" as const,
          label: unitInformationMessage("a11y.detail.openDefinition", language),
          onClick: onOpenDefinition,
        },
      ]
    : []),
  {
    kind: "openUnitList",
    label: unitInformationMessage("a11y.detail.openUnitList", language),
    onClick: onOpenUnitList,
  },
  ...(canOpenAsScope
    ? [
        {
          kind: "openScope" as const,
          label: unitInformationMessage("a11y.detail.openScope", language),
          onClick: onOpenScope,
          variant: "contained" as const,
        },
      ]
    : []),
];
