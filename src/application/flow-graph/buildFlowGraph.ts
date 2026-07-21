import {
  buildFlowGraphFromInput,
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
  type FlowGraphDocumentValidationResult,
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
  let parentId = unit.parentId;
  while (parentId) {
    const parent = index.unitById.get(parentId);
    if (!parent) break;
    ancestors.push(toInputNode(parent));
    parentId = parent.parentId;
  }
  return ancestors;
};

const toEdgeDtos = (unit: FlowGraphUnitDto): FlowGraphEdgeDto[] =>
  unit.relations.map((relation) => ({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  }));

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

export const buildFlowGraphFromValidatedDocument = (
  validation: ValidatedFlowGraphDocument,
  currentUnitId: string,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphBuildResult => {
  const unit = validation.index.unitById.get(currentUnitId);
  if (!unit) {
    return {
      status: "unavailable",
      issues: [
        ...validation.issues,
        {
          code: "scope_not_found",
          message: `Flow graph scope was not found: ${currentUnitId}`,
        },
      ],
    };
  }
  if (unit.unitType !== "n" && unit.unitType !== "rc") {
    return {
      status: "unavailable",
      issues: [
        ...validation.issues,
        {
          code: "invalid_scope",
          message: `Unit is not a flow graph scope: ${currentUnitId}`,
        },
      ],
    };
  }

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

const compatibilityValidationByDocument = new WeakMap<
  object,
  ValidatedFlowGraphDocument
>();

const validateCompatibilityDocument = (
  document: unknown,
): FlowGraphDocumentValidationResult => {
  if (typeof document !== "object" || document === null) {
    return validateFlowGraphDocument(document);
  }
  const cached = compatibilityValidationByDocument.get(document);
  if (cached) return cached;
  const validation = validateFlowGraphDocument(document);
  if (validation.status === "available") {
    compatibilityValidationByDocument.set(document, validation);
  }
  return validation;
};

/**
 * Temporary compatibility adapter for presentation consumers migrated in
 * Slice 2. Rebuilding for one document should validate once and call
 * buildFlowGraphFromValidatedDocument with the retained application contract.
 */
export const buildFlowGraph = (
  document: unknown,
  currentUnitId: string,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphDto | undefined => {
  // Existing presentation replaces the normalized document instead of
  // mutating it. Cache only this compatibility path until Slice 2 retains the
  // validated application contract directly.
  const validation = validateCompatibilityDocument(document);
  if (validation.status === "unavailable") return undefined;
  const result = buildFlowGraphFromValidatedDocument(
    validation,
    currentUnitId,
    semanticDiffHighlights,
  );
  return result.status === "available" ? result.graph : undefined;
};
