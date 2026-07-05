import {
  AjsDocument,
  AjsUnit,
  findAjsUnitAncestors,
  findAjsUnitById,
} from "../../domain/models/ajs/AjsDocument";
import {
  buildFlowGraphFromInput,
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphInput,
  FlowGraphInputNode,
  FlowGraphSemanticDiffHighlights,
} from "./buildFlowGraphCore";

const toInputNode = (unit: AjsUnit): FlowGraphInputNode => ({
  id: unit.id,
  label: unit.name,
  absolutePath: unit.absolutePath,
  ty: unit.unitType,
  gty: unit.groupType,
  comment: unit.comment,
  depth: unit.depth,
  h: unit.layout.h,
  v: unit.layout.v,
  isRootJobnet: unit.isRootJobnet,
  hasSchedule: unit.hasSchedule,
  hasWaitedFor: unit.hasWaitedFor,
});

const toAncestorNodes = (
  document: AjsDocument,
  unit: AjsUnit,
): FlowGraphInputNode[] =>
  findAjsUnitAncestors(document, unit).map(toInputNode);

const toEdgeDtos = (unit: AjsUnit): FlowGraphEdgeDto[] =>
  unit.relations.map((relation) => ({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  }));

const toInput = (
  document: AjsDocument,
  unit: AjsUnit,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphInput => {
  const conditionUnit = unit.children.find((child) => child.unitType === "rc");
  return {
    currentNode: toInputNode(unit),
    ancestorNodes: toAncestorNodes(document, unit),
    childNodes: unit.children
      .filter((child) => child.unitType !== "rc")
      .map(toInputNode),
    conditionNode: conditionUnit ? toInputNode(conditionUnit) : undefined,
    edges: toEdgeDtos(unit),
    semanticDiffHighlights,
  };
};

export const buildFlowGraph = (
  document: AjsDocument,
  currentUnitId: string,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphDto | undefined => {
  const unit = findAjsUnitById(document, currentUnitId);
  if (!unit) {
    return undefined;
  }
  return buildFlowGraphFromInput(
    toInput(document, unit, semanticDiffHighlights),
  );
};
