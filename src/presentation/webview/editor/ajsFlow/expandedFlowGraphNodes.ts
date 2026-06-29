import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import type {
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
  FlowGraphNodeType,
} from "../../../../application/flow-graph/buildFlowGraphCore";

const nodeTypeByUnitType: Partial<Record<string, FlowGraphNodeType>> = {
  g: "jobgroup",
  n: "jobnet",
  rn: "jobnet",
  rm: "jobnet",
  rr: "jobnet",
  rc: "condition",
};

export const compareExpandedUnits = (left: AjsUnit, right: AjsUnit): number =>
  left.depth - right.depth ||
  left.layout.v - right.layout.v ||
  left.layout.h - right.layout.h ||
  left.absolutePath.localeCompare(right.absolutePath);

const toNodeType = (unit: AjsUnit): FlowGraphNodeType =>
  nodeTypeByUnitType[unit.unitType] ?? "job";

export const toGridNode = (unit: AjsUnit): FlowGraphNodeDto => ({
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

export const toConditionNode = (unit: AjsUnit): FlowGraphNodeDto => ({
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

export const toEdgeDtos = (unit: AjsUnit): FlowGraphEdgeDto[] =>
  unit.relations.map((relation) => ({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  }));
