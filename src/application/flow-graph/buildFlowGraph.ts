import {
  buildFlowGraphFromInput,
  flowGraphEdgeId,
  type FlowGraphDto,
  type FlowGraphEdgeDto,
  type FlowGraphInput,
  type FlowGraphInputNode,
  type FlowGraphSemanticDiffHighlights,
} from "./buildFlowGraphCore";
import {
  type FlowGraphDocumentDto,
  type FlowGraphDocumentIndex,
  type FlowGraphDocumentIssue,
  type FlowGraphUnitDto,
  type ValidatedFlowGraphDocument,
  validateFlowGraphDocument,
} from "./flowGraphDocument";

export type FlowGraphBuildIssue =
  | FlowGraphDocumentIssue
  | {
      code: "scope_not_found";
      message: string;
    }
  | {
      code: "invalid_scope";
      message: string;
    };

export type FlowGraphBuildResult =
  | {
      status: "available";
      graph: FlowGraphDto;
      document: FlowGraphDocumentDto;
      index: FlowGraphDocumentIndex;
      issues: FlowGraphBuildIssue[];
    }
  | {
      status: "unavailable";
      issues: FlowGraphBuildIssue[];
    };

const toInputNode = (unit: FlowGraphUnitDto): FlowGraphInputNode => ({
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
  index: FlowGraphDocumentIndex,
  unit: FlowGraphUnitDto,
): FlowGraphInputNode[] => {
  const ancestors: FlowGraphInputNode[] = [];
  const visited = new Set<string>();
  let parentId = nextAncestorId(unit.parentId, visited);
  while (parentId) {
    appendAncestorNode(ancestors, index, parentId);
    const parent = index.unitById.get(parentId);
    parentId = nextAncestorId(parent?.parentId, visited);
  }
  return ancestors;
};

const appendAncestorNode = (
  ancestors: FlowGraphInputNode[],
  index: FlowGraphDocumentIndex,
  parentId: string,
): void => {
  const parent = index.unitById.get(parentId);
  if (parent) ancestors.push(toInputNode(parent));
};

const nextAncestorId = (
  parentId: string | undefined,
  visited: Set<string>,
): string | undefined => {
  if (!parentId || visited.has(parentId)) return undefined;
  visited.add(parentId);
  return parentId;
};

const toEdgeDtos = (unit: FlowGraphUnitDto): FlowGraphEdgeDto[] => {
  const ordinals = new Map<string, number>();
  return unit.relations.map((relation) => {
    const edge = {
      source: relation.sourceUnitId,
      target: relation.targetUnitId,
      type: relation.type,
    } as const;
    const key = `${edge.source}\u0000${edge.target}\u0000${edge.type}`;
    const occurrenceOrdinal = ordinals.get(key) ?? 0;
    ordinals.set(key, occurrenceOrdinal + 1);
    return {
      ...edge,
      id: flowGraphEdgeId(edge, occurrenceOrdinal),
    };
  });
};

const toInput = (
  index: FlowGraphDocumentIndex,
  unit: FlowGraphUnitDto,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphInput => {
  const conditionUnit = unit.children.find((child) => child.unitType === "rc");
  return {
    currentNode: toInputNode(unit),
    ancestorNodes: toAncestorNodes(index, unit),
    childNodes: unit.children
      .filter((child) => child.unitType !== "rc")
      .map(toInputNode),
    conditionNode: conditionUnit ? toInputNode(conditionUnit) : undefined,
    edges: toEdgeDtos(unit),
    semanticDiffHighlights,
  };
};

const unavailableFlowGraph = (
  validation: ValidatedFlowGraphDocument,
  issue: FlowGraphBuildIssue,
): FlowGraphBuildResult => ({
  status: "unavailable",
  issues: [...validation.issues, issue],
});

const missingScopeIssue = (currentUnitId: string): FlowGraphBuildIssue => ({
  code: "scope_not_found",
  message: `Flow graph scope was not found: ${currentUnitId}`,
});

const invalidScopeIssue = (currentUnitId: string): FlowGraphBuildIssue => ({
  code: "invalid_scope",
  message: `Unit is not a flow graph scope: ${currentUnitId}`,
});

const flowGraphScopeIssue = (
  unit: FlowGraphUnitDto | undefined,
  currentUnitId: string,
): FlowGraphBuildIssue | undefined =>
  unit
    ? invalidFlowGraphScopeIssue(unit, currentUnitId)
    : missingScopeIssue(currentUnitId);

const invalidFlowGraphScopeIssue = (
  unit: FlowGraphUnitDto,
  currentUnitId: string,
): FlowGraphBuildIssue | undefined =>
  unit.unitType === "n" || unit.unitType === "rc"
    ? undefined
    : invalidScopeIssue(currentUnitId);

export const buildFlowGraphFromValidatedDocument = (
  validation: ValidatedFlowGraphDocument,
  currentUnitId: string,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphBuildResult => {
  const unit = validation.index.unitById.get(currentUnitId);
  const issue = flowGraphScopeIssue(unit, currentUnitId);
  if (issue) return unavailableFlowGraph(validation, issue);

  return {
    status: "available",
    graph: buildFlowGraphFromInput(
      toInput(validation.index, unit, semanticDiffHighlights),
    ),
    document: validation.document,
    index: validation.index,
    issues: validation.issues,
  };
};

export const buildFlowGraphResult = (
  document: unknown,
  currentUnitId: string,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphBuildResult => {
  const validation = validateFlowGraphDocument(document);
  return validation.status === "available"
    ? buildFlowGraphFromValidatedDocument(
        validation,
        currentUnitId,
        semanticDiffHighlights,
      )
    : validation;
};
