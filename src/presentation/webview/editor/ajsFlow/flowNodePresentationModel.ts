import type { FlowGraphSemanticDiffHighlight } from "../../../../application/flow-graph/buildFlowGraphCore";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import type { ExpandedNodeDecoration } from "./expandedFlowGraphTypes";
import type {
  CurrentUnitIdStateType,
  DialogDataStateType,
} from "./flowViewerStateTypes";

export type FlowRelationshipFocusRole =
  | "selected"
  | "upstream"
  | "downstream"
  | "both"
  | "unrelated";

/** The renderer-owned projection of an application flow graph node. */
export type FlowNodePresentationModel = {
  nestedPanel?: ExpandedNodeDecoration;
  unitId: string;
  absolutePath: string;
  unitDefinition?: UnitDefinitionDialogDto;
  label: string;
  comment?: string;
  ty: FlowGraphUnitDto["unitType"];
  gty?: "n" | "p";
  isAncestor: boolean;
  isCurrent: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  semanticDiffHighlight?: FlowGraphSemanticDiffHighlight;
  isHovered?: boolean;
  isSearchMatch?: boolean;
  isCurrentSearchResult?: boolean;
  isSelected?: boolean;
  relationshipFocusRole?: FlowRelationshipFocusRole;
  canExpandNested?: boolean;
  isExpandedNested?: boolean;
};

/** React-facing callbacks and state composed with the renderer model. */
export type FlowNodeInteractionProps = DialogDataStateType &
  CurrentUnitIdStateType & {
    toggleExpandedUnitId?: (unitId: string) => void;
  };

export type FlowNodeData = FlowNodePresentationModel & FlowNodeInteractionProps;
