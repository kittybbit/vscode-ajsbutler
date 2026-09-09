import { AjsUnitType } from "../../domain/models/ajs/AjsDocument";

export type FlowGraphNodeType = "job" | "jobnet" | "jobgroup" | "condition";
export type FlowGraphEdgeType = "seq" | "con";
export type FlowGraphSemanticDiffHighlightKind =
  | "added"
  | "removed"
  | "changed"
  | "confirmation-required";

export type FlowGraphSemanticDiffHighlight = {
  kind: FlowGraphSemanticDiffHighlightKind;
  changeIds: string[];
  confirmationIds: string[];
};

export type FlowGraphSemanticDiffHighlights = {
  nodes: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>;
  edges: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>;
  /** Optional side-specific sets used by semantic-diff host integrations. */
  before?: FlowGraphSemanticDiffHighlightSet;
  after?: FlowGraphSemanticDiffHighlightSet;
};

export type FlowGraphSemanticDiffHighlightSet = {
  nodes: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>;
  edges: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>;
};

export type FlowGraphSemanticDiffOverlayEntry = {
  id: string;
  kind: FlowGraphSemanticDiffHighlightKind;
  changeIds: string[];
  confirmationIds: string[];
};

export type FlowGraphSemanticDiffOverlay = {
  nodes: FlowGraphSemanticDiffOverlayEntry[];
  relations: FlowGraphSemanticDiffOverlayEntry[];
};

export const flowGraphSemanticDiffHighlightsFromOverlay = (
  overlay: FlowGraphSemanticDiffOverlay | null | undefined,
): FlowGraphSemanticDiffHighlightSet => ({
  nodes: new Map(
    (overlay?.nodes ?? []).map((entry) => [
      entry.id,
      {
        kind: entry.kind,
        changeIds: [...entry.changeIds],
        confirmationIds: [...entry.confirmationIds],
      },
    ]),
  ),
  edges: new Map(
    (overlay?.relations ?? []).map((entry) => [
      entry.id,
      {
        kind: entry.kind,
        changeIds: [...entry.changeIds],
        confirmationIds: [...entry.confirmationIds],
      },
    ]),
  ),
});

export type FlowGraphNodeLayout =
  | {
      kind: "grid";
      h: number;
      v: number;
    }
  | {
      kind: "ancestor";
      depth: number;
    };

export type FlowGraphNodeMetadata = {
  absolutePath: string;
  ty: AjsUnitType;
  gty?: "n" | "p";
  comment?: string;
  isAncestor: boolean;
  isCurrent: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  semanticDiffHighlight?: FlowGraphSemanticDiffHighlight;
  layout: FlowGraphNodeLayout;
};

export type FlowGraphNodeDto = {
  id: string;
  label: string;
  type: FlowGraphNodeType;
  metadata: FlowGraphNodeMetadata;
};

export type FlowGraphEdgeDto = {
  /** Stable ID for one concrete relation occurrence in its owning scope. */
  id: string;
  source: string;
  target: string;
  type: FlowGraphEdgeType;
  semanticDiffHighlight?: FlowGraphSemanticDiffHighlight;
};

export type FlowGraphDto = {
  nodes: FlowGraphNodeDto[];
  edges: FlowGraphEdgeDto[];
};

export type FlowGraphInputNode = {
  id: string;
  label: string;
  absolutePath: string;
  ty: AjsUnitType;
  gty?: "n" | "p";
  comment?: string;
  depth: number;
  h: number;
  v: number;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
};

export type FlowGraphInput = {
  currentNode: FlowGraphInputNode;
  ancestorNodes: FlowGraphInputNode[];
  childNodes: FlowGraphInputNode[];
  conditionNode?: FlowGraphInputNode;
  edges: Array<FlowGraphEdgeDto | Omit<FlowGraphEdgeDto, "id">>;
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
};

const tyTypeMap: Partial<Record<AjsUnitType, FlowGraphNodeType>> = {
  g: "jobgroup",
  n: "jobnet",
  rn: "jobnet",
  rm: "jobnet",
  rr: "jobnet",
  rc: "condition",
};

const toNodeType = (ty: AjsUnitType): FlowGraphNodeType =>
  tyTypeMap[ty] ?? "job";

const encodeUtf16Part = (value: string): string => `${value.length}:${value}`;

/**
 * Build a collision-free ID for an ordered relation occurrence.  JS string
 * length is deliberately used here: it counts UTF-16 code units, matching
 * VS Code/React Flow string identity and the semantic-diff contract.
 */
export const flowGraphEdgeId = (
  edge: Pick<FlowGraphEdgeDto, "source" | "target" | "type">,
  occurrenceOrdinal = 0,
): string => {
  if (!Number.isSafeInteger(occurrenceOrdinal) || occurrenceOrdinal < 0) {
    throw new RangeError(
      "A Flow edge occurrence ordinal must be non-negative.",
    );
  }
  return `flow-edge:${encodeUtf16Part(edge.source)}${encodeUtf16Part(
    edge.target,
  )}${encodeUtf16Part(edge.type)}${encodeUtf16Part(String(occurrenceOrdinal))}`;
};

/** The semantic-diff key is the graph's formal ID, never a display string. */
export const flowGraphEdgeSemanticDiffKey = (
  edge: Pick<FlowGraphEdgeDto, "source" | "target" | "type"> &
    Partial<Pick<FlowGraphEdgeDto, "id">>,
  occurrenceOrdinal = 0,
): string => edge.id ?? flowGraphEdgeId(edge, occurrenceOrdinal);

const ensureEdgeIds = (
  edges: Array<FlowGraphEdgeDto | Omit<FlowGraphEdgeDto, "id">>,
): FlowGraphEdgeDto[] => {
  const ordinals = new Map<string, number>();
  return edges.map((edge) => {
    const key = `${edge.source}\u0000${edge.target}\u0000${edge.type}`;
    const occurrenceOrdinal = ordinals.get(key) ?? 0;
    ordinals.set(key, occurrenceOrdinal + 1);
    return {
      ...edge,
      id:
        ("id" in edge ? edge.id : undefined) ??
        flowGraphEdgeId(edge, occurrenceOrdinal),
    };
  });
};

const toGridNode = (
  node: FlowGraphInputNode,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphNodeDto => ({
  id: node.id,
  label: node.label,
  type: toNodeType(node.ty),
  metadata: {
    absolutePath: node.absolutePath,
    ty: node.ty,
    gty: node.gty,
    comment: node.comment,
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: node.isRootJobnet,
    hasSchedule: node.hasSchedule,
    hasWaitedFor: node.hasWaitedFor,
    semanticDiffHighlight: semanticDiffHighlights?.nodes.get(node.id),
    layout: {
      kind: "grid",
      h: node.h,
      v: node.v,
    },
  },
});

const toAncestorNode = (
  node: FlowGraphInputNode,
  isCurrent: boolean,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphNodeDto => ({
  id: node.id,
  label: node.label,
  type: toNodeType(node.ty),
  metadata: {
    absolutePath: node.absolutePath,
    ty: node.ty,
    gty: node.gty,
    comment: node.comment,
    isAncestor: true,
    isCurrent,
    isRootJobnet: node.isRootJobnet,
    hasSchedule: node.hasSchedule,
    hasWaitedFor: node.hasWaitedFor,
    semanticDiffHighlight: semanticDiffHighlights?.nodes.get(node.id),
    layout: {
      kind: "ancestor",
      depth: node.depth,
    },
  },
});

export const buildFlowGraphFromInput = (
  input: FlowGraphInput,
): FlowGraphDto => {
  const nodes: FlowGraphNodeDto[] = input.childNodes.map((node) =>
    toGridNode(node, input.semanticDiffHighlights),
  );
  nodes.push(
    ...input.ancestorNodes.map((node) =>
      toAncestorNode(node, false, input.semanticDiffHighlights),
    ),
  );
  nodes.push(
    toAncestorNode(input.currentNode, true, input.semanticDiffHighlights),
  );
  if (input.conditionNode) {
    nodes.push(
      toAncestorNode(input.conditionNode, false, input.semanticDiffHighlights),
    );
  }

  return {
    nodes,
    edges: ensureEdgeIds(input.edges).map((edge) => ({
      ...edge,
      semanticDiffHighlight: input.semanticDiffHighlights?.edges.get(
        flowGraphEdgeSemanticDiffKey(edge),
      ),
    })),
  };
};
