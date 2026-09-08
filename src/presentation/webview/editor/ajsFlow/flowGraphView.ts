import type { Theme } from "@mui/material/styles";
import type React from "react";
import { Edge, MarkerType, Node } from "@xyflow/react";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
  FlowGraphSemanticDiffHighlight,
} from "../../../../application/flow-graph/buildFlowGraphCore";
import { flowGraphEdgeId } from "../../../../application/flow-graph/buildFlowGraphCore";
import type { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import type {
  CurrentUnitIdStateType,
  DialogDataStateType,
  NestedExpansionStateType,
} from "./flowViewerStateTypes";
import type { ExpandedNodeDecoration } from "./buildExpandedFlowGraph";
import type { FlowNodeData } from "./flowNodePresentationModel";
import { createFlowNodeGeometryPx } from "./nodes/flowNodeGeometry";
import { calculateFlowGraphNodePosition } from "./flowGraphPosition";
import { isExpandableNestedUnit } from "./nestedExpansion";
import {
  getFlowNodeIdFromTarget,
  getOwnedFlowNodeId,
  isFlowInteractiveTarget,
  isFlowSpatialNavigationKey,
  focusRenderedFlowNode,
  resolveFlowKeyboardFocusTarget,
  resolveFlowKeyboardScopeFocusDecision,
  resolveFlowKeyboardNavigationKeyResult,
  resolveFlowKeyboardNodeGeometry,
  type FlowKeyboardNavigationMovement,
  type FlowKeyboardNavigationIndexCache,
  type FlowKeyboardFocusTarget,
} from "./flowKeyboardNavigation";
import { resolveFlowViewerShortcut } from "./flowViewerShortcuts";
export type FlowNavigationNode = {
  id: string;
  parentId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  canExpandNested: boolean;
  isExpandedNested: boolean;
};

export const flowNavigationNodes = (
  nodes: readonly Node<FlowNodeData>[],
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): FlowNavigationNode[] =>
  nodes.flatMap((node) => {
    const unit = unitById.get(node.id);
    const geometry = resolveFlowKeyboardNodeGeometry(node);
    return node.data.unitId === node.id && unit && geometry
      ? [
          {
            id: node.id,
            parentId: unit.parentId,
            ...geometry,
            canExpandNested: Boolean(node.data.canExpandNested),
            isExpandedNested: Boolean(node.data.isExpandedNested),
          },
        ]
      : [];
  });

export const flowScopeUnitById = (
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): ReadonlyMap<
  string,
  { id: string; parentId?: string; unitType: string; childCount: number }
> =>
  new Map(
    [...unitById].map(([id, unit]) => [
      id,
      {
        id,
        parentId: unit.parentId,
        unitType: unit.unitType,
        childCount: unit.children.length,
      },
    ]),
  );

export const renderedFlowUnitIds = (
  nodes: readonly Node<FlowNodeData>[],
): ReadonlySet<string> =>
  new Set(
    nodes.flatMap((node) =>
      node.data.unitId === node.id ? [node.data.unitId] : [],
    ),
  );

type PendingFlowFocusRequest = Readonly<{
  fallbackToGraphEntry: boolean;
  expectedCurrentUnitId?: string;
  expectedExpanded?: boolean;
  selectTarget?: boolean;
  sourceScopeUnitId?: string;
  sourceNodes: readonly Node<FlowNodeData>[];
  targetUnitId: string;
}>;

export type FlowKeyboardHandlerContext = Readonly<{
  currentUnitIdState: CurrentUnitIdStateType;
  graphEntryRef: React.RefObject<HTMLDivElement | null>;
  navigationIndex: FlowKeyboardNavigationIndexCache["index"];
  nodes: readonly Node<FlowNodeData>[];
  onFocusDetail: (unitId: string) => void;
  onFocusSelector: (unitId?: string) => void;
  onKeyboardNavigation: (unitId: string) => void;
  onScopeChange: (targetScopeUnitId: string) => void;
  onSpatialMove?: (
    unitId: string,
    direction: FlowKeyboardNavigationMovement,
  ) => void;
  pendingFocusRequestRef: React.MutableRefObject<
    PendingFlowFocusRequest | undefined
  >;
  scopeUnitById: ReadonlyMap<
    string,
    { id: string; parentId?: string; unitType: string; childCount: number }
  >;
  toggleExpandedFlowNodeFromKeyboard: (unitId: string) => void;
  onNestedExpansion?: (unitId: string, expanded: boolean) => void;
}>;

const isNestedFlowNodeTarget = (
  event: React.KeyboardEvent<HTMLElement>,
): boolean => {
  const currentUnitId = getFlowNodeIdFromTarget(event.target);
  return (
    currentUnitId !== undefined &&
    getOwnedFlowNodeId(event.target) === undefined
  );
};

const shouldSkipFlowKeyboardEvent = (
  event: React.KeyboardEvent<HTMLElement>,
): boolean =>
  isNestedFlowNodeTarget(event) &&
  (isFlowInteractiveTarget(event.target) ||
    !isFlowSpatialNavigationKey(event.key));

const handleFlowDetailShortcut = ({
  event,
  currentUnitId,
  shortcut,
  context,
}: {
  event: React.KeyboardEvent<HTMLElement>;
  currentUnitId: string | undefined;
  shortcut: ReturnType<typeof resolveFlowViewerShortcut>;
  context: FlowKeyboardHandlerContext;
}): boolean => {
  if (shortcut !== "detail" || currentUnitId === undefined) return false;
  event.preventDefault();
  event.stopPropagation();
  context.onFocusDetail(currentUnitId);
  return true;
};

const handleFlowSelectorShortcut = ({
  event,
  currentUnitId,
  shortcut,
  context,
}: {
  event: React.KeyboardEvent<HTMLElement>;
  currentUnitId: string | undefined;
  shortcut: ReturnType<typeof resolveFlowViewerShortcut>;
  context: FlowKeyboardHandlerContext;
}): boolean => {
  const canFocusSelector =
    shortcut === "selector" &&
    (currentUnitId !== undefined || event.target === event.currentTarget);
  if (!canFocusSelector) return false;
  event.preventDefault();
  event.stopPropagation();
  context.onFocusSelector(currentUnitId);
  return true;
};

const handleFlowKeyboardShortcut = (
  event: React.KeyboardEvent<HTMLElement>,
  currentUnitId: string | undefined,
  context: FlowKeyboardHandlerContext,
): boolean => {
  const shortcut = resolveFlowViewerShortcut({
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    key: event.key,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  });
  return (
    handleFlowDetailShortcut({ event, currentUnitId, shortcut, context }) ||
    handleFlowSelectorShortcut({ event, currentUnitId, shortcut, context })
  );
};

const applyFlowNavigateAction = (
  action: Extract<
    NonNullable<
      ReturnType<typeof resolveFlowKeyboardNavigationKeyResult>["action"]
    >,
    { kind: "navigate" }
  >,
  context: FlowKeyboardHandlerContext,
): void => {
  context.onKeyboardNavigation(action.targetUnitId);
  focusRenderedFlowNode(
    context.graphEntryRef.current,
    action.targetUnitId,
    CSS.escape,
  );
  context.onSpatialMove?.(action.targetUnitId, action.movement);
};

const applyFlowScopeAction = (
  action: Extract<
    NonNullable<
      ReturnType<typeof resolveFlowKeyboardNavigationKeyResult>["action"]
    >,
    { kind: "enter-scope" | "return-scope" }
  >,
  context: FlowKeyboardHandlerContext,
): void => {
  context.pendingFocusRequestRef.current = {
    expectedCurrentUnitId: action.targetScopeId,
    fallbackToGraphEntry: true,
    selectTarget: true,
    sourceScopeUnitId: context.currentUnitIdState.currentUnitId,
    sourceNodes: context.nodes,
    targetUnitId: action.focusUnitId,
  };
  context.onScopeChange(action.targetScopeId);
};

const applyFlowExpansionAction = (
  action: Extract<
    NonNullable<
      ReturnType<typeof resolveFlowKeyboardNavigationKeyResult>["action"]
    >,
    { kind: "expand" | "collapse" }
  >,
  context: FlowKeyboardHandlerContext,
): void => {
  const expanded = action.kind === "expand";
  context.pendingFocusRequestRef.current = {
    expectedExpanded: expanded,
    fallbackToGraphEntry: true,
    sourceNodes: context.nodes,
    targetUnitId: action.targetUnitId,
  };
  context.toggleExpandedFlowNodeFromKeyboard(action.targetUnitId);
  context.onNestedExpansion?.(action.targetUnitId, expanded);
};

const applyFlowKeyboardAction = (
  action: NonNullable<
    ReturnType<typeof resolveFlowKeyboardNavigationKeyResult>["action"]
  >,
  context: FlowKeyboardHandlerContext,
): void => {
  const handlers = {
    navigate: applyFlowNavigateAction,
    "enter-scope": applyFlowScopeAction,
    "return-scope": applyFlowScopeAction,
    expand: applyFlowExpansionAction,
    collapse: applyFlowExpansionAction,
  } as const;
  handlers[action.kind](action as never, context);
};

const handleFlowKeyboardNavigation = (
  event: React.KeyboardEvent<HTMLElement>,
  currentUnitId: string,
  context: FlowKeyboardHandlerContext,
): void => {
  const result = resolveFlowKeyboardNavigationKeyResult(
    context.navigationIndex,
    {
      currentUnitId,
      currentScopeUnitId: context.currentUnitIdState.currentUnitId,
      key: event.key,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      scopeUnitById: context.scopeUnitById,
      shiftKey: event.shiftKey,
    },
  );
  if (!result.suppressDefault || !result.action) return;
  event.preventDefault();
  event.stopPropagation();
  applyFlowKeyboardAction(result.action, context);
};

const handleFlowKeyboardNavigationIfPresent = (
  event: React.KeyboardEvent<HTMLElement>,
  currentUnitId: string | undefined,
  context: FlowKeyboardHandlerContext,
): void => {
  if (currentUnitId)
    handleFlowKeyboardNavigation(event, currentUnitId, context);
};

export const handleFlowNodeKeyDownEvent = (
  event: React.KeyboardEvent<HTMLElement>,
  context: FlowKeyboardHandlerContext,
): void => {
  const currentUnitId = getFlowNodeIdFromTarget(event.target);
  if (shouldSkipFlowKeyboardEvent(event)) return;
  if (handleFlowKeyboardShortcut(event, currentUnitId, context)) return;
  handleFlowKeyboardNavigationIfPresent(event, currentUnitId, context);
};

type CreateReactFlowDataOptions = {
  searchMatchedUnitIds?: ReadonlySet<string>;
  unitById?: ReadonlyMap<string, FlowGraphUnitDto>;
  nestedExpansionState?: NestedExpansionStateType;
  nodeDecorations?: ReadonlyMap<string, ExpandedNodeDecoration>;
  positionOverrides?: ReadonlyMap<string, { x: number; y: number }>;
  searchedUnitId?: string;
  selectedUnitId?: string;
};

type CreateReactFlowDataParams = {
  graph: FlowGraphDto;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
  theme: Theme;
  dialogDataState: DialogDataStateType;
  currentUnitIdState: CurrentUnitIdStateType;
  options?: CreateReactFlowDataOptions;
};

type FlowNodeDataBuildContext = Omit<CreateReactFlowDataParams, "graph">;
type ReactFlowNodeBuildContext = FlowNodeDataBuildContext & {
  basePx: number;
  initialNodeGeometry: ReturnType<typeof createFlowNodeGeometryPx>;
};

const nestedPanelBoundsNodeId = (unitId: string): string =>
  `${unitId}::nested-panel-bounds`;

const toNodeData = (
  node: FlowGraphNodeDto,
  context: FlowNodeDataBuildContext,
): FlowNodeData => {
  const { unitDefinitionByPath, dialogDataState, currentUnitIdState, options } =
    context;
  const unitDefinition = unitDefinitionByPath.get(node.metadata.absolutePath);

  const unit = options?.unitById?.get(node.id);
  return {
    nestedPanel: options?.nodeDecorations?.get(node.id),
    unitId: node.id,
    absolutePath: node.metadata.absolutePath,
    unitDefinition,
    label: node.label,
    comment: node.metadata.comment,
    ty: node.metadata.ty,
    gty: node.metadata.gty,
    isAncestor: node.metadata.isAncestor,
    isCurrent: node.metadata.isCurrent,
    isRootJobnet: node.metadata.isRootJobnet,
    hasSchedule: node.metadata.hasSchedule,
    hasWaitedFor: node.metadata.hasWaitedFor,
    semanticDiffHighlight: node.metadata.semanticDiffHighlight,
    isSearchMatch: options?.searchMatchedUnitIds?.has(node.id) ?? false,
    isCurrentSearchResult: options?.searchedUnitId === node.id,
    isSelected: options?.selectedUnitId === node.id,
    canExpandNested:
      !node.metadata.isCurrent &&
      !node.metadata.isAncestor &&
      !!unit &&
      isExpandableNestedUnit(unit),
    isExpandedNested: options?.nestedExpansionState?.expandedUnitIds.has(
      node.id,
    ),
    toggleExpandedUnitId: options?.nestedExpansionState?.toggleExpandedUnitId,
    ...dialogDataState,
    ...currentUnitIdState,
  };
};

const edgeStrokeColor = (
  highlight: FlowGraphSemanticDiffHighlight | undefined,
  theme: Theme,
): string | undefined => {
  const paletteKey = highlight
    ? {
        "confirmation-required": "warning",
        removed: "error",
        added: "success",
        changed: "info",
      }[highlight.kind]
    : undefined;
  return paletteKey ? theme.palette[paletteKey].main : undefined;
};

const toEdgeData = (edge: FlowGraphEdgeDto): Edge["data"] =>
  edge.semanticDiffHighlight
    ? {
        flowRelationType: edge.type,
        semanticDiffHighlight: edge.semanticDiffHighlight,
      }
    : undefined;

const edgeStrokeWidth = (highlight: FlowGraphSemanticDiffHighlight): number =>
  highlight.kind === "confirmation-required" ? 4 : 3;

const edgeDashArray = (highlight: FlowGraphSemanticDiffHighlight): string =>
  ({
    removed: "7 4",
    added: "7 4",
    changed: "2 4",
    "confirmation-required": "10 3 2 3",
  })[highlight.kind];

const toEdgeStyle = (edge: FlowGraphEdgeDto, theme: Theme): Edge["style"] => {
  const highlight = edge.semanticDiffHighlight;
  if (!highlight) return undefined;
  return {
    stroke: edgeStrokeColor(highlight, theme),
    strokeWidth: edgeStrokeWidth(highlight),
    strokeDasharray: edgeDashArray(highlight),
  };
};

const toArrowMarker = (color?: string): Edge["markerEnd"] => ({
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color,
});

const toEdgeInteraction = (): Pick<
  Edge,
  "focusable" | "selectable" | "reconnectable" | "deletable"
> => ({
  focusable: false,
  selectable: false,
  reconnectable: false,
  deletable: false,
});

const toEdgeAccessibility = (edge: FlowGraphEdgeDto): Edge["domAttributes"] =>
  edge.semanticDiffHighlight ? { "aria-hidden": "true" } : undefined;

const toEdgeClassName = (edge: FlowGraphEdgeDto): string | undefined =>
  edge.semanticDiffHighlight
    ? `semantic-diff-edge semantic-diff-edge-${edge.semanticDiffHighlight.kind}`
    : undefined;

const toEdgeMarkers = (
  edge: FlowGraphEdgeDto,
  theme: Theme,
): Pick<Edge, "markerStart" | "markerEnd"> => ({
  markerStart: edge.type === "con" ? toArrowMarker() : undefined,
  markerEnd: toArrowMarker(edgeStrokeColor(edge.semanticDiffHighlight, theme)),
});

const isAnimatedEdge = (edge: FlowGraphEdgeDto): boolean =>
  edge.type === "con" ||
  edge.semanticDiffHighlight?.kind === "confirmation-required" ||
  edge.semanticDiffHighlight?.kind === "added";

const toEdge = (edge: FlowGraphEdgeDto, theme: Theme): Edge => ({
  id: edge.id ?? flowGraphEdgeId(edge),
  className: toEdgeClassName(edge),
  domAttributes: toEdgeAccessibility(edge),
  type: "smoothstep",
  source: edge.source,
  target: edge.target,
  ...toEdgeInteraction(),
  data: toEdgeData(edge),
  style: toEdgeStyle(edge, theme),
  ...toEdgeMarkers(edge, theme),
  animated: isAnimatedEdge(edge),
});

const toNodePosition = (
  node: FlowGraphNodeDto,
  basePx: number,
  options?: CreateReactFlowDataOptions,
): { x: number; y: number } =>
  options?.positionOverrides?.get(node.id) ??
  calculateFlowGraphNodePosition(node, basePx);

const toReactFlowNode = (
  node: FlowGraphNodeDto,
  context: ReactFlowNodeBuildContext,
): Node<FlowNodeData> => {
  const selected = context.options?.selectedUnitId === node.id;
  return {
    id: node.id,
    type: node.type,
    selected,
    selectable: false,
    draggable: false,
    connectable: false,
    deletable: false,
    focusable: true,
    ariaRole: "group",
    ariaLabel: node.label,
    domAttributes: {
      "aria-current": node.metadata.isCurrent ? "true" : undefined,
    },
    initialWidth: context.initialNodeGeometry.width,
    initialHeight: context.initialNodeGeometry.height,
    data: toNodeData(node, context),
    position: toNodePosition(node, context.basePx, context.options),
  };
};

const toNestedPanelBoundsNode = (
  node: Node<FlowNodeData>,
): Node<FlowNodeData> | undefined => {
  const nestedPanel = node.data.nestedPanel;
  if (!nestedPanel) {
    return undefined;
  }

  return {
    id: nestedPanelBoundsNodeId(node.id),
    type: "group",
    data: { label: "" } as FlowNodeData,
    position: {
      x: node.position.x + nestedPanel.panelOffsetXPx,
      y: node.position.y + nestedPanel.panelOffsetYPx,
    },
    width: nestedPanel.panelWidthPx,
    height: nestedPanel.panelHeightPx,
    initialWidth: nestedPanel.panelWidthPx,
    initialHeight: nestedPanel.panelHeightPx,
    style: {
      width: nestedPanel.panelWidthPx,
      height: nestedPanel.panelHeightPx,
      opacity: 0,
      pointerEvents: "none",
      background: "transparent",
      border: "none",
    },
    selectable: false,
    draggable: false,
    connectable: false,
    focusable: false,
    ariaRole: "presentation",
    domAttributes: {
      "aria-hidden": true,
    },
  };
};

export const createReactFlowData = ({
  graph,
  ...context
}: CreateReactFlowDataParams): {
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
} => {
  const basePx = context.theme.typography.htmlFontSize;
  const nodeContext = {
    ...context,
    basePx,
    initialNodeGeometry: createFlowNodeGeometryPx(basePx),
  };
  const nodes: Node<FlowNodeData>[] = graph.nodes.map((node) =>
    toReactFlowNode(node, nodeContext),
  );
  const nestedPanelBoundsNodes = nodes
    .map(toNestedPanelBoundsNode)
    .filter((node): node is Node<FlowNodeData> => !!node);

  const edges: Edge[] = graph.edges.map((edge) => toEdge(edge, context.theme));

  return { nodes: [...nodes, ...nestedPanelBoundsNodes], edges };
};
export const isPendingFlowExpansionReady = (
  request: PendingFlowFocusRequest,
  targetNode: Node<FlowNodeData> | undefined,
): boolean =>
  request.expectedExpanded === undefined ||
  !targetNode ||
  Boolean(targetNode.data.isExpandedNested) === request.expectedExpanded;

export const focusPendingFlowTarget = (
  target: FlowKeyboardFocusTarget,
  graphEntryRef: React.RefObject<HTMLDivElement | null>,
): boolean =>
  target.kind === "node"
    ? focusRenderedFlowNode(
        graphEntryRef.current,
        target.targetUnitId,
        CSS.escape,
      )
    : false;

export type PendingFlowFocusStep =
  | { kind: "idle" | "wait" | "cancel" }
  | {
      kind: "apply";
      request: PendingFlowFocusRequest;
      target: FlowKeyboardFocusTarget;
    };

export const resolvePendingFlowFocusStep = ({
  currentUnitIdState,
  nodes,
  pendingFocusRequestRef,
}: {
  currentUnitIdState: CurrentUnitIdStateType;
  nodes: readonly Node<FlowNodeData>[];
  pendingFocusRequestRef: React.MutableRefObject<
    PendingFlowFocusRequest | undefined
  >;
}): PendingFlowFocusStep => {
  const request = pendingFocusRequestRef.current;
  if (!request) return { kind: "idle" };
  const renderedUnitIds = renderedFlowUnitIds(nodes);
  return toPendingFlowFocusStep(
    request,
    resolvePendingFlowTarget({
      request,
      currentUnitIdState,
      nodes,
      renderedUnitIds,
    }),
  );
};

const resolvePendingFlowTarget = ({
  request,
  currentUnitIdState,
  nodes,
  renderedUnitIds,
}: {
  request: PendingFlowFocusRequest;
  currentUnitIdState: CurrentUnitIdStateType;
  nodes: readonly Node<FlowNodeData>[];
  renderedUnitIds: ReadonlySet<string>;
}): ReturnType<typeof resolveFlowKeyboardScopeFocusDecision> => {
  if (request.expectedCurrentUnitId) {
    return resolveFlowKeyboardScopeFocusDecision({
      currentScopeUnitId: currentUnitIdState.currentUnitId,
      expectedScopeUnitId: request.expectedCurrentUnitId,
      renderedUnitIds,
      sourceNodesChanged: request.sourceNodes !== nodes,
      sourceScopeUnitId: request.sourceScopeUnitId,
      targetUnitId: request.targetUnitId,
    });
  }
  if (request.sourceNodes === nodes) return { kind: "wait" };
  return resolveFlowKeyboardFocusTarget(renderedUnitIds, request.targetUnitId);
};

const toPendingFlowFocusStep = (
  request: PendingFlowFocusRequest,
  target: ReturnType<typeof resolveFlowKeyboardScopeFocusDecision>,
): PendingFlowFocusStep => {
  const stepKind = ({ wait: "wait", cancel: "cancel", node: "apply" } as const)[
    target.kind
  ];
  const stepFactories = {
    wait: () => ({ kind: "wait" as const }),
    cancel: () => ({ kind: "cancel" as const }),
    apply: () => ({ kind: "apply" as const, request, target }),
  };
  return stepFactories[stepKind]();
};
