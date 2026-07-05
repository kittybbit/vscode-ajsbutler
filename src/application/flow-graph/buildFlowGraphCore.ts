import { AjsUnitType } from "../../domain/models/ajs/AjsDocument";

export type FlowGraphNodeType = "job" | "jobnet" | "jobgroup" | "condition";
export type FlowGraphEdgeType = "seq" | "con";
export type FlowGraphSemanticDiffHighlightKind =
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
};

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
  edges: FlowGraphEdgeDto[];
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

export const flowGraphEdgeSemanticDiffKey = (
  edge: Pick<FlowGraphEdgeDto, "source" | "target" | "type">,
): string => `${edge.source}->${edge.target}:${edge.type}`;

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
    edges: input.edges.map((edge) => ({
      ...edge,
      semanticDiffHighlight: input.semanticDiffHighlights?.edges.get(
        flowGraphEdgeSemanticDiffKey(edge),
      ),
    })),
  };
};
