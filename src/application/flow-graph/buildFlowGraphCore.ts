import { TySymbol } from "../../domain/values/AjsType";

export type FlowGraphNodeType = "job" | "jobnet" | "jobgroup" | "condition";
export type FlowGraphEdgeType = "seq" | "con";

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
  ty: TySymbol;
  gty?: "n" | "p";
  comment?: string;
  isAncestor: boolean;
  isCurrent: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
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
};

export type FlowGraphDto = {
  nodes: FlowGraphNodeDto[];
  edges: FlowGraphEdgeDto[];
};

export type FlowGraphInputNode = {
  id: string;
  label: string;
  absolutePath: string;
  ty: TySymbol;
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
};

const tyTypeMap: Partial<Record<TySymbol, FlowGraphNodeType>> = {
  g: "jobgroup",
  n: "jobnet",
  rn: "jobnet",
  rm: "jobnet",
  rr: "jobnet",
  rc: "condition",
};

const toNodeType = (ty: TySymbol): FlowGraphNodeType => tyTypeMap[ty] ?? "job";

const toGridNode = (node: FlowGraphInputNode): FlowGraphNodeDto => ({
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
    layout: {
      kind: "ancestor",
      depth: node.depth,
    },
  },
});

export const buildFlowGraphFromInput = (
  input: FlowGraphInput,
): FlowGraphDto => {
  const nodes: FlowGraphNodeDto[] = input.childNodes.map(toGridNode);
  nodes.push(...input.ancestorNodes.map((node) => toAncestorNode(node, false)));
  nodes.push(toAncestorNode(input.currentNode, true));
  if (input.conditionNode) {
    nodes.push(toAncestorNode(input.conditionNode, false));
  }

  return {
    nodes,
    edges: input.edges,
  };
};
