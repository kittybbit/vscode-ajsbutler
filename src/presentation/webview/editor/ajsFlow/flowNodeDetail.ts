import type { Edge, Node } from "@xyflow/react";
import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import type { AjsNode } from "./nodes/AjsNode";

export type FlowNodeRelationshipSummary = {
  predecessorCount: number;
  successorCount: number;
  upstreamCount: number;
  downstreamCount: number;
};

export type FlowNodeDetail = FlowNodeRelationshipSummary & {
  unitId: string;
  name: string;
  unitType: AjsNode["ty"];
  groupType?: AjsNode["gty"];
  comment?: string;
  absolutePath: string;
  parentName?: string;
  parentPath?: string;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  canExpandNested: boolean;
  isSearchMatch: boolean;
  isCurrentSearchResult: boolean;
  canOpenAsScope: boolean;
};

type RelationshipDirection = "upstream" | "downstream";

type FlowRelationshipIndex = {
  upstreamByUnitId: ReadonlyMap<string, ReadonlySet<string>>;
  downstreamByUnitId: ReadonlyMap<string, ReadonlySet<string>>;
};

const addRelatedUnitId = (
  index: Map<string, Set<string>>,
  unitId: string,
  relatedUnitId: string,
) => {
  if (unitId === relatedUnitId) {
    return;
  }
  const relatedUnitIds = index.get(unitId) ?? new Set<string>();
  relatedUnitIds.add(relatedUnitId);
  index.set(unitId, relatedUnitIds);
};

export const buildFlowRelationshipIndex = (
  edges: readonly Edge[],
): FlowRelationshipIndex => {
  const upstreamByUnitId = new Map<string, Set<string>>();
  const downstreamByUnitId = new Map<string, Set<string>>();
  edges.forEach((edge) => {
    addRelatedUnitId(upstreamByUnitId, edge.target, edge.source);
    addRelatedUnitId(downstreamByUnitId, edge.source, edge.target);
  });
  return { downstreamByUnitId, upstreamByUnitId };
};

const directlyRelatedUnitIds = (
  unitId: string,
  index: FlowRelationshipIndex,
  direction: RelationshipDirection,
): ReadonlySet<string> =>
  (direction === "upstream"
    ? index.upstreamByUnitId
    : index.downstreamByUnitId
  ).get(unitId) ?? new Set<string>();

const collectRelatedUnitIdsFromIndex = (
  unitId: string,
  index: FlowRelationshipIndex,
  direction: RelationshipDirection,
): Set<string> => {
  const visited = new Set<string>([unitId]);
  const related = new Set<string>();
  const pending = [...directlyRelatedUnitIds(unitId, index, direction)];

  while (pending.length > 0) {
    const candidate = pending.pop();
    if (!candidate || visited.has(candidate)) {
      continue;
    }
    visited.add(candidate);
    related.add(candidate);
    pending.push(...directlyRelatedUnitIds(candidate, index, direction));
  }

  return related;
};

export const collectRelatedUnitIds = (
  unitId: string,
  edges: readonly Edge[],
  direction: RelationshipDirection,
): Set<string> => {
  return collectRelatedUnitIdsFromIndex(
    unitId,
    buildFlowRelationshipIndex(edges),
    direction,
  );
};

export const summarizeFlowNodeRelationships = (
  unitId: string,
  edges: readonly Edge[],
): FlowNodeRelationshipSummary => {
  const index = buildFlowRelationshipIndex(edges);
  return {
    predecessorCount: directlyRelatedUnitIds(unitId, index, "upstream").size,
    successorCount: directlyRelatedUnitIds(unitId, index, "downstream").size,
    upstreamCount: collectRelatedUnitIdsFromIndex(unitId, index, "upstream")
      .size,
    downstreamCount: collectRelatedUnitIdsFromIndex(unitId, index, "downstream")
      .size,
  };
};

const canOpenNodeAsScope = (node: Node<AjsNode>): boolean =>
  !node.data.isCurrent && (node.type === "jobnet" || node.type === "condition");

export const buildFlowNodeDetail = (
  node: Node<AjsNode> | undefined,
  edges: readonly Edge[],
  unitById: ReadonlyMap<string, AjsUnit>,
): FlowNodeDetail | undefined => {
  if (!node) {
    return undefined;
  }

  const unit = unitById.get(node.id);
  const parent = unit?.parentId ? unitById.get(unit.parentId) : undefined;
  return {
    unitId: node.id,
    name: node.data.label,
    unitType: node.data.ty,
    groupType: node.data.gty,
    comment: node.data.comment,
    absolutePath: node.data.absolutePath,
    parentName: parent?.name,
    parentPath: parent?.absolutePath,
    hasSchedule: node.data.hasSchedule,
    hasWaitedFor: node.data.hasWaitedFor,
    canExpandNested: Boolean(node.data.canExpandNested),
    isSearchMatch: Boolean(node.data.isSearchMatch),
    isCurrentSearchResult: Boolean(node.data.isCurrentSearchResult),
    canOpenAsScope: canOpenNodeAsScope(node),
    ...summarizeFlowNodeRelationships(node.id, edges),
  };
};
