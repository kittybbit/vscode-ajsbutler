import {
  type FlowGraphDocumentValidationResult,
  type FlowGraphUnitDto,
} from "./flowGraphDocument";
import {
  parseSemanticDiffOverlay,
  validateSemanticDiffOverlayMembership,
} from "./flowGraphDocumentOverlay";
import {
  createValidationState,
  isFlowDocumentRoot,
  type PendingRelation,
  type ValidationState,
} from "./flowGraphDocumentUnitValidation";
import { readRootUnits } from "./flowGraphDocumentTreeReader";

const invalidRootDocument = (): FlowGraphDocumentValidationResult => ({
  status: "unavailable",
  issues: [
    {
      code: "invalid_document",
      message: "A flow document must contain a rootUnits array.",
    },
  ],
});

const childIdsByOwner = (
  owner: FlowGraphUnitDto,
  cache: Map<FlowGraphUnitDto, ReadonlySet<string>>,
): ReadonlySet<string> => {
  const existing = cache.get(owner);
  if (existing) return existing;
  const ids = new Set(owner.children.map((child) => child.id));
  cache.set(owner, ids);
  return ids;
};

const hasKnownRelationUnits = (
  relation: PendingRelation["relation"],
  state: ValidationState,
): boolean =>
  state.unitById.has(relation.sourceUnitId) &&
  state.unitById.has(relation.targetUnitId);

const hasDirectRelationUnits = (
  relation: PendingRelation["relation"],
  directChildIds: ReadonlySet<string>,
): boolean =>
  directChildIds.has(relation.sourceUnitId) &&
  directChildIds.has(relation.targetUnitId);

const isValidRelationScope = (
  pending: PendingRelation,
  state: ValidationState,
  directChildIds: ReadonlySet<string>,
): boolean =>
  hasKnownRelationUnits(pending.relation, state) &&
  hasDirectRelationUnits(pending.relation, directChildIds);

const appendScopedRelations = (state: ValidationState): void => {
  const directChildren = new Map<FlowGraphUnitDto, ReadonlySet<string>>();
  state.pendingRelations.forEach((pending) => {
    const directChildIds = childIdsByOwner(pending.owner, directChildren);
    if (isValidRelationScope(pending, state, directChildIds)) {
      pending.owner.relations.push(pending.relation);
      return;
    }
    state.issues.push({
      code: "invalid_relation",
      message: "A relation outside its owning flow scope was omitted.",
      unitPath: pending.owner.absolutePath,
    });
  });
};

type OverlayValidation = {
  hasOverlay: boolean;
  overlay: ReturnType<typeof parseSemanticDiffOverlay>;
  valid: boolean;
};

const parseDocumentOverlay = (
  value: { semanticDiffOverlay?: unknown },
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
  rootUnits: readonly FlowGraphUnitDto[],
): OverlayValidation => {
  const hasOverlay = Object.prototype.hasOwnProperty.call(
    value,
    "semanticDiffOverlay",
  );
  const overlay = parseSemanticDiffOverlay(value.semanticDiffOverlay);
  const validShape = !hasOverlay || overlay !== undefined;
  const validMembership =
    overlay === null ||
    overlay === undefined ||
    validateSemanticDiffOverlayMembership(overlay, unitById, rootUnits);
  return {
    hasOverlay,
    overlay,
    valid: validShape && validMembership,
  };
};

const addOverlayIssue = (state: ValidationState): void => {
  state.fatal = true;
  state.issues.push({
    code: "invalid_semantic_diff_overlay",
    message:
      "A semantic diff overlay must contain only current graph node and edge IDs.",
  });
};

const unavailableFromState = (
  state: ValidationState,
): FlowGraphDocumentValidationResult => ({
  status: "unavailable",
  issues: state.issues,
});

const availableDocument = (
  rootUnits: FlowGraphUnitDto[],
  state: ValidationState,
  overlay: OverlayValidation,
): FlowGraphDocumentValidationResult => ({
  status: "available",
  document: {
    rootUnits,
    ...(!overlay.hasOverlay ? {} : { semanticDiffOverlay: overlay.overlay }),
  },
  index: {
    unitById: state.unitById,
    unitByAbsolutePath: state.unitByAbsolutePath,
  },
  issues: state.issues,
});

const finalizeDocumentContents = (
  rootUnits: FlowGraphUnitDto[],
  state: ValidationState,
  value: { semanticDiffOverlay?: unknown },
): FlowGraphDocumentValidationResult => {
  const overlay = parseDocumentOverlay(value, state.unitById, rootUnits);
  if (!overlay.valid) addOverlayIssue(state);
  return state.fatal
    ? unavailableFromState(state)
    : availableDocument(rootUnits, state, overlay);
};

const validateDocumentContents = (value: {
  rootUnits: unknown[];
  semanticDiffOverlay?: unknown;
}): FlowGraphDocumentValidationResult => {
  const state = createValidationState();
  const rootUnits = readRootUnits(value.rootUnits, state);
  if (state.fatal) return unavailableFromState(state);
  appendScopedRelations(state);
  return finalizeDocumentContents(rootUnits, state, value);
};

export const validateFlowGraphDocument = (
  value: unknown,
): FlowGraphDocumentValidationResult => {
  if (!isFlowDocumentRoot(value)) return invalidRootDocument();
  return validateDocumentContents(value);
};
