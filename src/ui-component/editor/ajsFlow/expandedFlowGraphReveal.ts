import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import type { FlowGraphEdgeDto } from "../../../application/flow-graph/buildFlowGraphCore";
import {
  calculateNestedChildPosition,
  calculateNestedConditionPosition,
  FlowGraphPosition,
} from "./flowGraphPosition";
import {
  toConditionNode,
  toEdgeDtos,
  toGridNode,
} from "./expandedFlowGraphNodes";
import { ExpandedFlowGraphBuildContext } from "./expandedFlowGraphTypes";

export type ExpandedFlowGraphRevealDeps = {
  getDisplayPosition: (
    context: ExpandedFlowGraphBuildContext,
    unitId: string,
  ) => FlowGraphPosition | undefined;
  syncDisplayPosition: (
    context: ExpandedFlowGraphBuildContext,
    unitId: string,
  ) => void;
};

const addVisibleNode = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedFlowGraphRevealDeps,
  visibleNode: {
    unit: AjsUnit;
    initialPosition: FlowGraphPosition;
    parentAnchorId?: string;
  },
) => {
  const { unit, initialPosition, parentAnchorId } = visibleNode;
  context.nodes.push(
    unit.unitType === "rc" ? toConditionNode(unit) : toGridNode(unit),
  );
  context.nodeIds.add(unit.id);
  context.visibleUnitIds.add(unit.id);
  context.initialPositions.set(unit.id, initialPosition);
  if (parentAnchorId) {
    context.parentAnchors.set(unit.id, parentAnchorId);
  }
  deps.syncDisplayPosition(context, unit.id);
};

type VisibleNestedNode = {
  unit: AjsUnit;
  parentUnitId: string;
  calculatePosition: () => FlowGraphPosition;
};

type NestedChildRevealTarget = {
  context: ExpandedFlowGraphBuildContext;
  deps: ExpandedFlowGraphRevealDeps;
  child: AjsUnit;
  parentUnitId: string;
};

type ConditionChildRevealTarget = {
  context: ExpandedFlowGraphBuildContext;
  deps: ExpandedFlowGraphRevealDeps;
  conditionUnit: AjsUnit;
  parentUnitId: string;
};

const ensureVisibleNestedNode = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedFlowGraphRevealDeps,
  visibleNode: VisibleNestedNode,
) => {
  const { unit, parentUnitId, calculatePosition } = visibleNode;
  const existingPosition = context.initialPositions.get(unit.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(unit.id)) {
    return undefined;
  }

  const initialPosition = calculatePosition();
  addVisibleNode(context, deps, {
    unit,
    initialPosition,
    parentAnchorId: parentUnitId,
  });
  return initialPosition;
};

const ensureChildNodeVisible = ({
  context,
  deps,
  child,
  parentUnitId,
}: NestedChildRevealTarget): FlowGraphPosition | undefined =>
  ensureVisibleNestedNode(context, deps, {
    unit: child,
    parentUnitId,
    calculatePosition: () =>
      calculateNestedChildPosition(
        { x: 0, y: 0 },
        child.layout.h,
        child.layout.v,
        context.basePx,
      ),
  });

const ensureConditionNodeVisible = ({
  context,
  deps,
  conditionUnit,
  parentUnitId,
}: ConditionChildRevealTarget): FlowGraphPosition | undefined =>
  ensureVisibleNestedNode(context, deps, {
    unit: conditionUnit,
    parentUnitId,
    calculatePosition: () =>
      calculateNestedConditionPosition({ x: 0, y: 0 }, context.basePx),
  });

const toEdgeId = (edge: FlowGraphEdgeDto): string =>
  `${edge.source}-${edge.target}`;

const hasExpandedEdge = (
  context: ExpandedFlowGraphBuildContext,
  edge: FlowGraphEdgeDto,
): boolean => context.edgeIds.has(toEdgeId(edge));

const appendExpandedEdge = (
  context: ExpandedFlowGraphBuildContext,
  edge: FlowGraphEdgeDto,
) => {
  context.edges.push(edge);
  context.edgeIds.add(toEdgeId(edge));
};

const getNewExpandedEdges = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): FlowGraphEdgeDto[] =>
  toEdgeDtos(expandedUnit).filter((edge) => !hasExpandedEdge(context, edge));

const appendExpandedUnitEdges = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  for (const edge of getNewExpandedEdges(context, expandedUnit)) {
    appendExpandedEdge(context, edge);
  }
};

const canRevealNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedFlowGraphRevealDeps,
  expandedUnit: AjsUnit,
): boolean => !!deps.getDisplayPosition(context, expandedUnit.id);

const getVisibleNestedChildren = (expandedUnit: AjsUnit): AjsUnit[] =>
  expandedUnit.children.filter((unit) => unit.unitType !== "rc");

const getConditionChild = (expandedUnit: AjsUnit): AjsUnit | undefined =>
  expandedUnit.children.find((child) => child.unitType === "rc");

const revealNestedChildren = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedFlowGraphRevealDeps,
  expandedUnit: AjsUnit,
) => {
  for (const child of getVisibleNestedChildren(expandedUnit)) {
    ensureChildNodeVisible({
      context,
      deps,
      child,
      parentUnitId: expandedUnit.id,
    });
  }
};

const revealConditionChild = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedFlowGraphRevealDeps,
  expandedUnit: AjsUnit,
) => {
  const conditionUnit = getConditionChild(expandedUnit);
  if (conditionUnit) {
    ensureConditionNodeVisible({
      context,
      deps,
      conditionUnit,
      parentUnitId: expandedUnit.id,
    });
  }
};

export const revealVisibleNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  deps: ExpandedFlowGraphRevealDeps,
  expandedUnit: AjsUnit,
) => {
  if (!canRevealNestedUnit(context, deps, expandedUnit)) {
    return;
  }

  revealNestedChildren(context, deps, expandedUnit);
  revealConditionChild(context, deps, expandedUnit);
  appendExpandedUnitEdges(context, expandedUnit);
};
