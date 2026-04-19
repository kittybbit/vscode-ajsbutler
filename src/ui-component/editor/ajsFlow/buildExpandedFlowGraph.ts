import {
  AjsDocument,
  AjsUnit,
  findAjsUnitById,
  flattenAjsUnits,
} from "../../../domain/models/ajs/AjsDocument";
import { buildFlowGraph } from "../../../application/flow-graph/buildFlowGraph";
import {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
  FlowGraphNodeType,
} from "../../../application/flow-graph/buildFlowGraphCore";
import {
  calculateFlowGraphNodePosition,
  calculateNestedChildPosition,
  calculateNestedConditionPosition,
  createFlowGraphMetrics,
  FlowGraphPosition,
} from "./flowGraphPosition";

export type ExpandedNodeDecoration = {
  panelOffsetXPx: number;
  panelOffsetYPx: number;
  panelWidthPx: number;
  panelHeightPx: number;
};

type ExpandedFlowGraphResult = {
  graph?: FlowGraphDto;
  positionOverrides: ReadonlyMap<string, FlowGraphPosition>;
  nodeDecorations: ReadonlyMap<string, ExpandedNodeDecoration>;
};

type FlowGraphBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const toNodeType = (unit: AjsUnit): FlowGraphNodeType => {
  switch (unit.unitType) {
    case "g":
      return "jobgroup";
    case "n":
    case "rn":
    case "rm":
    case "rr":
      return "jobnet";
    case "rc":
      return "condition";
    default:
      return "job";
  }
};

const toGridNode = (unit: AjsUnit): FlowGraphNodeDto => ({
  id: unit.id,
  label: unit.name,
  type: toNodeType(unit),
  metadata: {
    absolutePath: unit.absolutePath,
    ty: unit.unitType,
    gty: unit.groupType,
    comment: unit.comment,
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout: {
      kind: "grid",
      h: unit.layout.h,
      v: unit.layout.v,
    },
  },
});

const toConditionNode = (unit: AjsUnit): FlowGraphNodeDto => ({
  id: unit.id,
  label: unit.name,
  type: "condition",
  metadata: {
    absolutePath: unit.absolutePath,
    ty: unit.unitType,
    gty: unit.groupType,
    comment: unit.comment,
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout: {
      kind: "ancestor",
      depth: unit.depth,
    },
  },
});

const toEdgeDtos = (unit: AjsUnit): FlowGraphEdgeDto[] =>
  unit.relations.map((relation) => ({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  }));

const isDescendantOf = (
  unit: AjsUnit,
  ancestorId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean => {
  let current = unit.parentId ? unitById.get(unit.parentId) : undefined;
  while (current) {
    if (current.id === ancestorId) {
      return true;
    }
    current = current.parentId ? unitById.get(current.parentId) : undefined;
  }
  return false;
};

const includeNodeBounds = (
  bounds: FlowGraphBounds,
  position: FlowGraphPosition,
  width: number,
  height: number,
) => {
  bounds.minX = Math.min(bounds.minX, position.x);
  bounds.maxX = Math.max(bounds.maxX, position.x + width);
  bounds.minY = Math.min(bounds.minY, position.y);
  bounds.maxY = Math.max(bounds.maxY, position.y + height);
};

const includeDecorationBounds = (
  bounds: FlowGraphBounds,
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration,
) => {
  bounds.minX = Math.min(bounds.minX, position.x + decoration.panelOffsetXPx);
  bounds.maxX = Math.max(
    bounds.maxX,
    position.x + decoration.panelOffsetXPx + decoration.panelWidthPx,
  );
  bounds.minY = Math.min(bounds.minY, position.y + decoration.panelOffsetYPx);
  bounds.maxY = Math.max(
    bounds.maxY,
    position.y + decoration.panelOffsetYPx + decoration.panelHeightPx,
  );
};

const intersectsBounds = (
  position: FlowGraphPosition,
  width: number,
  height: number,
  bounds: FlowGraphBounds,
): boolean =>
  position.x < bounds.maxX &&
  position.x + width > bounds.minX &&
  position.y < bounds.maxY &&
  position.y + height > bounds.minY;

export const buildExpandedFlowGraph = (
  document: AjsDocument,
  currentUnitId: string,
  expandedUnitIds: ReadonlySet<string>,
  basePx: number,
): ExpandedFlowGraphResult => {
  const baseGraph = buildFlowGraph(document, currentUnitId);
  if (!baseGraph) {
    return {
      graph: undefined,
      positionOverrides: new Map<string, FlowGraphPosition>(),
      nodeDecorations: new Map<string, ExpandedNodeDecoration>(),
    };
  }

  const metrics = createFlowGraphMetrics(basePx);
  const nodes = [...baseGraph.nodes];
  const edges = [...baseGraph.edges];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeIds = new Set(edges.map((edge) => `${edge.source}-${edge.target}`));
  const positionOverrides = new Map<string, FlowGraphPosition>();
  const nodeDecorations = new Map<string, ExpandedNodeDecoration>();

  for (const node of baseGraph.nodes) {
    positionOverrides.set(
      node.id,
      calculateFlowGraphNodePosition(node, basePx),
    );
  }

  const allUnits = flattenAjsUnits(document.rootUnits);
  const unitById = new Map(allUnits.map((unit) => [unit.id, unit]));
  const currentUnit = findAjsUnitById(document, currentUnitId);
  if (!currentUnit) {
    return { graph: baseGraph, positionOverrides, nodeDecorations };
  }

  const visibleUnitIds = new Set(nodes.map((node) => node.id));
  const incomingSourcesByTarget = new Map<string, string[]>();
  for (const edge of edges) {
    const sources = incomingSourcesByTarget.get(edge.target) ?? [];
    sources.push(edge.source);
    incomingSourcesByTarget.set(edge.target, sources);
  }

  const shiftVisibleNodes = (
    targetUnit: AjsUnit,
    targetMinX: number,
    excludes: ReadonlySet<string>,
  ) => {
    let minSiblingX = Number.POSITIVE_INFINITY;
    for (const unitId of visibleUnitIds) {
      if (excludes.has(unitId)) {
        continue;
      }
      const unit = unitById.get(unitId);
      const position = positionOverrides.get(unitId);
      if (!unit || !position) {
        continue;
      }
      if (unit.parentId !== targetUnit.parentId) {
        continue;
      }
      if (position.x <= (positionOverrides.get(targetUnit.id)?.x ?? 0)) {
        continue;
      }
      minSiblingX = Math.min(minSiblingX, position.x);
    }

    const dx = Number.isFinite(minSiblingX)
      ? Math.max(0, targetMinX - minSiblingX)
      : 0;
    if (dx <= 0) {
      return;
    }

    for (const unitId of visibleUnitIds) {
      if (excludes.has(unitId)) {
        continue;
      }
      const unit = unitById.get(unitId);
      const position = positionOverrides.get(unitId);
      if (!unit || !position) {
        continue;
      }
      if (unit.parentId !== targetUnit.parentId) {
        continue;
      }
      if (position.x <= (positionOverrides.get(targetUnit.id)?.x ?? 0)) {
        continue;
      }
      positionOverrides.set(unitId, { x: position.x + dx, y: position.y });
    }
  };

  const shiftNodeByDelta = (unitId: string, dy: number) => {
    const position = positionOverrides.get(unitId);
    if (!position || dy <= 0) {
      return;
    }
    positionOverrides.set(unitId, {
      x: position.x,
      y: position.y + dy,
    });
  };

  const cascadeShiftToIncomingSources = (
    unitId: string,
    dy: number,
    subtreeUnitIds: ReadonlySet<string>,
    panelBounds: FlowGraphBounds,
    visited: Set<string>,
  ) => {
    if (visited.has(unitId)) {
      return;
    }
    visited.add(unitId);
    const incomingSources = incomingSourcesByTarget.get(unitId) ?? [];
    for (const sourceUnitId of incomingSources) {
      if (subtreeUnitIds.has(sourceUnitId)) {
        continue;
      }
      const sourcePosition = positionOverrides.get(sourceUnitId);
      const targetPosition = positionOverrides.get(unitId);
      if (!sourcePosition || !targetPosition) {
        continue;
      }
      if (sourcePosition.x >= targetPosition.x) {
        continue;
      }
      if (sourcePosition.y + metrics.height < panelBounds.minY) {
        continue;
      }
      shiftNodeByDelta(sourceUnitId, dy);
      cascadeShiftToIncomingSources(
        sourceUnitId,
        dy,
        subtreeUnitIds,
        panelBounds,
        visited,
      );
    }
  };

  const sortedExpandedUnits = [...expandedUnitIds]
    .map((unitId) => unitById.get(unitId))
    .filter(
      (unit): unit is AjsUnit =>
        !!unit &&
        unit.id !== currentUnitId &&
        unit.unitType === "n" &&
        isDescendantOf(unit, currentUnitId, unitById),
    )
    .sort((left, right) => right.depth - left.depth);

  for (const expandedUnit of sortedExpandedUnits) {
    const parentPosition = positionOverrides.get(expandedUnit.id);
    if (!parentPosition) {
      continue;
    }
    const subtreeUnitIds = new Set<string>([expandedUnit.id]);
    const bounds: FlowGraphBounds = {
      minX: parentPosition.x,
      maxX: parentPosition.x + metrics.width,
      minY: parentPosition.y,
      maxY: parentPosition.y + metrics.height,
    };

    for (const child of expandedUnit.children.filter(
      (unit) => unit.unitType !== "rc",
    )) {
      subtreeUnitIds.add(child.id);
      let childPosition = positionOverrides.get(child.id);
      if (!nodeIds.has(child.id)) {
        nodes.push(toGridNode(child));
        nodeIds.add(child.id);
        visibleUnitIds.add(child.id);
        childPosition = calculateNestedChildPosition(
          parentPosition,
          child.layout.h,
          child.layout.v,
          basePx,
        );
        positionOverrides.set(child.id, childPosition);
      }
      if (!childPosition) {
        continue;
      }
      includeNodeBounds(bounds, childPosition, metrics.width, metrics.height);
      const childDecoration = nodeDecorations.get(child.id);
      if (childDecoration) {
        includeDecorationBounds(bounds, childPosition, childDecoration);
      }
    }

    const conditionUnit = expandedUnit.children.find(
      (child) => child.unitType === "rc",
    );
    if (conditionUnit) {
      subtreeUnitIds.add(conditionUnit.id);
      let conditionPosition = positionOverrides.get(conditionUnit.id);
      if (!nodeIds.has(conditionUnit.id)) {
        nodes.push(toConditionNode(conditionUnit));
        nodeIds.add(conditionUnit.id);
        visibleUnitIds.add(conditionUnit.id);
        conditionPosition = calculateNestedConditionPosition(
          parentPosition,
          basePx,
        );
        positionOverrides.set(conditionUnit.id, conditionPosition);
      }
      if (conditionPosition) {
        includeNodeBounds(
          bounds,
          conditionPosition,
          metrics.width,
          metrics.height,
        );
      }
    }

    for (const edge of toEdgeDtos(expandedUnit)) {
      const edgeId = `${edge.source}-${edge.target}`;
      if (edgeIds.has(edgeId)) {
        continue;
      }
      edges.push(edge);
      edgeIds.add(edgeId);
    }

    const panelPaddingX = metrics.width * 0.3;
    const panelPaddingTop = metrics.height * 0.2;
    const panelPaddingBottom = metrics.height * 0.35;
    const panelMinX = bounds.minX - panelPaddingX;
    const panelMaxX = bounds.maxX + panelPaddingX;
    const panelBounds: FlowGraphBounds = {
      minX: panelMinX,
      maxX: panelMaxX,
      minY: bounds.minY - panelPaddingTop,
      maxY: bounds.maxY + panelPaddingBottom,
    };
    shiftVisibleNodes(
      expandedUnit,
      panelMaxX + metrics.marginX,
      subtreeUnitIds,
    );

    const collidingSiblingIds = [...visibleUnitIds]
      .filter((unitId) => !subtreeUnitIds.has(unitId))
      .filter((unitId) => {
        const position = positionOverrides.get(unitId);
        return (
          !!position &&
          intersectsBounds(position, metrics.width, metrics.height, panelBounds)
        );
      })
      .sort(
        (left, right) =>
          (positionOverrides.get(left)?.y ?? 0) -
          (positionOverrides.get(right)?.y ?? 0),
      );

    let nextAvailableY = panelBounds.maxY + metrics.marginY;
    for (const siblingId of collidingSiblingIds) {
      const siblingPosition = positionOverrides.get(siblingId);
      if (!siblingPosition) {
        continue;
      }
      const dy = Math.max(0, nextAvailableY - siblingPosition.y);
      if (dy <= 0) {
        nextAvailableY = siblingPosition.y + metrics.height + metrics.marginY;
        continue;
      }
      shiftNodeByDelta(siblingId, dy);
      cascadeShiftToIncomingSources(
        siblingId,
        dy,
        subtreeUnitIds,
        panelBounds,
        new Set<string>(),
      );
      nextAvailableY =
        (positionOverrides.get(siblingId)?.y ?? siblingPosition.y) +
        metrics.height +
        metrics.marginY;
    }

    nodeDecorations.set(expandedUnit.id, {
      panelOffsetXPx: panelMinX - parentPosition.x,
      panelOffsetYPx: -panelPaddingTop,
      panelWidthPx: panelMaxX - panelMinX,
      panelHeightPx:
        bounds.maxY - parentPosition.y + panelPaddingTop + panelPaddingBottom,
    });
  }

  return {
    graph: {
      nodes,
      edges,
    },
    positionOverrides,
    nodeDecorations,
  };
};
