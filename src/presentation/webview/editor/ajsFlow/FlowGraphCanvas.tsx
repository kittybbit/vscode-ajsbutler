import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import JobNode from "./nodes/JobNode";
import JobNetNode from "./nodes/JobNetNode";
import JobGroupNode from "./nodes/JobGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import type { FlowNodeData } from "./flowNodePresentationModel";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { FlowGraphSemanticDiffHighlightKind } from "../../../../application/flow-graph/buildFlowGraphCore";
import {
  type FlowMiniMapColors,
  resolveFlowMiniMapNodeFill,
  resolveFlowMiniMapNodeStroke,
} from "./flowMiniMap";
import {
  focusRenderedFlowNode,
  resolveFlowKeyboardNavigationIndexCache,
  resolveFlowGraphEntryTabIndex,
  readOnlyFlowInteractionProps,
  type FlowKeyboardFocusTarget,
  type FlowKeyboardNavigationIndexCache,
} from "./flowKeyboardNavigation";
import { flowAriaLabelConfig } from "./flowAccessibility";
import {
  formatUnitInformationMessage,
  unitInformationMessage,
} from "../unitInformationLocalization";
import type { FlowKeyboardNavigationMovement } from "./flowKeyboardNavigation";
import type { ViewerAnnouncementHostHandle } from "../shared/viewerAnnouncements";
import type { Theme } from "@mui/material/styles";
import type {
  FlowRendererReady,
  FlowViewportInstanceRef,
} from "./useFlowViewportAdapter";
import type { CurrentUnitIdStateType } from "./flowViewerStateTypes";
import {
  resolveFlowGraphFocusRequest,
  type FlowGraphFocusRequest,
} from "./flowViewportFocus";
import {
  flowNavigationNodes,
  flowScopeUnitById,
  handleFlowNodeKeyDownEvent,
  isPendingFlowExpansionReady,
  focusPendingFlowTarget,
  resolvePendingFlowFocusStep,
  renderedFlowUnitIds,
  type FlowKeyboardHandlerContext,
  type PendingFlowFocusStep,
} from "./flowGraphView";

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };
const minimumViewportZoom = 0.02;

const semanticDiffLegendLabelKey = (
  state: FlowGraphSemanticDiffHighlightKind,
): string =>
  state === "confirmation-required"
    ? "semanticDiff.flow.badge.confirmationRequired"
    : `semanticDiff.flow.badge.${state}`;

const nodeTypes: NodeTypes = {
  job: JobNode,
  jobnet: JobNetNode,
  jobgroup: JobGroupNode,
  condition: ConditionNode,
};

type FlowGraphCanvasProps = {
  edges: Edge[];
  language: string;
  miniMapColors: FlowMiniMapColors;
  nodes: Node<FlowNodeData>[];
  onNodeClick: (event: React.MouseEvent, node: Node<FlowNodeData>) => void;
  onNodeMouseEnter: (event: React.MouseEvent, node: Node<FlowNodeData>) => void;
  onNodeMouseLeave: (event: React.MouseEvent, node: Node<FlowNodeData>) => void;
  onRendererReady: FlowRendererReady;
  reactFlowInstanceRef: FlowViewportInstanceRef;
  selectedUnitId?: string;
  showMiniMap: boolean;
  theme: Theme;
};

type FlowGraphSelectionSyncProps = Pick<
  FlowGraphCanvasProps,
  "nodes" | "reactFlowInstanceRef" | "selectedUnitId"
>;

export type FlowGraphPanelProps = {
  clearGraphHoveredUnit: (unitId: string) => void;
  currentUnitIdState: CurrentUnitIdStateType;
  edges: Edge[];
  focusRequest: FlowGraphFocusRequest;
  graphHoveredUnit: (unitId: string) => void;
  miniMapColors: FlowMiniMapColors;
  nodes: Node<FlowNodeData>[];
  onFocusDetail: (unitId: string) => void;
  onFocusSelector: (unitId?: string) => void;
  onKeyboardNavigation: (unitId: string) => void;
  onRendererReady: FlowRendererReady;
  onScopeChange: (targetScopeUnitId: string) => void;
  onNestedExpansion?: (unitId: string, expanded: boolean) => void;
  onNodeSelected?: (unitId: string) => void;
  onSpatialMove?: (
    unitId: string,
    direction: FlowKeyboardNavigationMovement,
  ) => void;
  language: string;
  graphAriaLabel: string;
  reactFlowInstanceRef: FlowViewportInstanceRef;
  selectFlowNode: (unitId: string) => void;
  selectedUnitId?: string;
  showMiniMap: boolean;
  theme: Theme;
  toggleExpandedFlowNodeFromKeyboard: (unitId: string) => void;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

export type SemanticDiffRelationDuplicateGroup = Readonly<{
  sourceUnitId: string;
  targetUnitId: string;
  relationType: "seq" | "con";
  count: number;
}>;

type FlowAnnouncementActionsInput = Readonly<{
  announcementHostRef: React.RefObject<ViewerAnnouncementHostHandle | null>;
  language: string;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
}>;

export const useFlowAnnouncementActions = ({
  announcementHostRef,
  language,
  unitById,
}: FlowAnnouncementActionsInput) => {
  const announceFlow = useCallback(
    (eventKey: string, message: string) =>
      announcementHostRef.current?.announce({ eventKey, message }),
    [announcementHostRef],
  );
  const getFlowUnitName = useCallback(
    (unitId: string): string => unitById.get(unitId)?.name ?? unitId,
    [unitById],
  );
  const announceFlowSelection = useCallback(
    (unitId: string) =>
      announceFlow(
        `flow:selected:${unitId}`,
        formatUnitInformationMessage("a11y.announce.selected", language, {
          unit: getFlowUnitName(unitId),
        }),
      ),
    [announceFlow, getFlowUnitName, language],
  );
  const announceFlowSpatialMove = useCallback(
    (unitId: string, direction: FlowKeyboardNavigationMovement) =>
      announceFlow(
        `flow:moved:${unitId}:${direction}`,
        formatUnitInformationMessage("a11y.announce.moved", language, {
          direction: formatUnitInformationMessage(
            `a11y.direction.${direction}`,
            language,
          ),
          unit: getFlowUnitName(unitId),
        }),
      ),
    [announceFlow, getFlowUnitName, language],
  );
  const announceFlowNestedExpansion = useCallback(
    (unitId: string, expanded: boolean) => {
      const state = expanded ? "expanded" : "collapsed";
      announceFlow(
        `flow:nested:${unitId}:${state}`,
        formatUnitInformationMessage(`a11y.announce.${state}`, language, {
          unit: getFlowUnitName(unitId),
        }),
      );
    },
    [announceFlow, getFlowUnitName, language],
  );
  return {
    announceFlow,
    announceFlowNestedExpansion,
    announceFlowSelection,
    announceFlowSpatialMove,
    getFlowUnitName,
  };
};

type FlowAnnouncementEffectsInput = Readonly<{
  announceFlow: (eventKey: string, message: string) => void;
  currentScopeUnitId: string | undefined;
  duplicateGroups: readonly SemanticDiffRelationDuplicateGroup[];
  focusModeEnabled: boolean;
  getFlowUnitName: (unitId: string) => string;
  language: string;
  searchResultPosition: { current: number; total: number } | undefined;
  searchedUnitId: string | undefined;
}>;

type FlowAnnouncement = Readonly<{ eventKey: string; message: string }>;

const duplicateRelationAnnouncement = (
  groups: readonly SemanticDiffRelationDuplicateGroup[],
  language: string,
  getFlowUnitName: (unitId: string) => string,
): FlowAnnouncement | undefined => {
  if (groups.length === 0) return undefined;
  const signature = groups
    .map(
      ({ sourceUnitId, targetUnitId, relationType, count }) =>
        `${sourceUnitId}:${targetUnitId}:${relationType}:${count}`,
    )
    .join("|");
  const message = groups
    .map(({ sourceUnitId, targetUnitId, count }) =>
      formatUnitInformationMessage(
        "a11y.announce.semanticDiffRelations",
        language,
        {
          source: getFlowUnitName(sourceUnitId),
          target: getFlowUnitName(targetUnitId),
          count,
        },
      ),
    )
    .join(" ");
  return { eventKey: `flow:semantic-diff-relations:${signature}`, message };
};

const flowSearchAnnouncement = ({
  position,
  searchedUnitId,
  language,
  getFlowUnitName,
}: {
  position: FlowAnnouncementEffectsInput["searchResultPosition"];
  searchedUnitId: string | undefined;
  language: string;
  getFlowUnitName: (unitId: string) => string;
}): FlowAnnouncement | undefined => {
  if (position === undefined) return flowSearchClearedAnnouncement(language);
  return flowSearchPositionAnnouncement({
    position,
    searchedUnitId,
    language,
    getFlowUnitName,
  });
};

const flowSearchPositionAnnouncement = ({
  position,
  searchedUnitId,
  language,
  getFlowUnitName,
}: {
  position: { current: number; total: number };
  searchedUnitId: string | undefined;
  language: string;
  getFlowUnitName: (unitId: string) => string;
}): FlowAnnouncement | undefined => {
  if (position.total === 0) return flowSearchEmptyAnnouncement(language);
  return searchedUnitId === undefined
    ? undefined
    : flowSearchResultAnnouncement({
        position,
        searchedUnitId,
        language,
        getFlowUnitName,
      });
};

const flowSearchResultAnnouncement = ({
  position,
  searchedUnitId,
  language,
  getFlowUnitName,
}: {
  position: { current: number; total: number };
  searchedUnitId: string;
  language: string;
  getFlowUnitName: (unitId: string) => string;
}): FlowAnnouncement => ({
  eventKey: `flow:search:${searchedUnitId}:${position.current}:${position.total}`,
  message: formatUnitInformationMessage(
    "a11y.announce.searchResults",
    language,
    {
      count: position.total,
      current: position.current,
      total: position.total,
      unit: getFlowUnitName(searchedUnitId),
    },
  ),
});

const flowSearchClearedAnnouncement = (language: string): FlowAnnouncement => ({
  eventKey: "flow:search:cleared",
  message: unitInformationMessage("a11y.announce.searchCleared", language),
});

const flowSearchEmptyAnnouncement = (language: string): FlowAnnouncement => ({
  eventKey: "flow:search:no-results",
  message: unitInformationMessage("a11y.announce.searchNoResults", language),
});

const announceFlowIfPresent = (
  announceFlow: (eventKey: string, message: string) => void,
  announcement: FlowAnnouncement | undefined,
): void => {
  if (announcement) announceFlow(announcement.eventKey, announcement.message);
};

const useDuplicateRelationAnnouncement = ({
  announceFlow,
  duplicateGroups,
  getFlowUnitName,
  language,
}: Pick<
  FlowAnnouncementEffectsInput,
  "announceFlow" | "duplicateGroups" | "getFlowUnitName" | "language"
>): void => {
  useEffect(() => {
    const announcement = duplicateRelationAnnouncement(
      duplicateGroups,
      language,
      getFlowUnitName,
    );
    announceFlowIfPresent(announceFlow, announcement);
  }, [announceFlow, duplicateGroups, getFlowUnitName, language]);
};

const useScopeAnnouncement = ({
  announceFlow,
  currentScopeUnitId,
  getFlowUnitName,
  language,
}: Pick<
  FlowAnnouncementEffectsInput,
  "announceFlow" | "currentScopeUnitId" | "getFlowUnitName" | "language"
>): void => {
  const previousScopeIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const announcement = scopeChangeAnnouncement({
      previousScopeId: previousScopeIdRef.current,
      currentScopeUnitId,
      language,
      getFlowUnitName,
    });
    previousScopeIdRef.current = currentScopeUnitId;
    announceFlowIfPresent(announceFlow, announcement);
  }, [announceFlow, currentScopeUnitId, getFlowUnitName, language]);
};

const scopeChangeAnnouncement = ({
  previousScopeId,
  currentScopeUnitId,
  language,
  getFlowUnitName,
}: {
  previousScopeId: string | undefined;
  currentScopeUnitId: string | undefined;
  language: string;
  getFlowUnitName: (unitId: string) => string;
}): FlowAnnouncement | undefined =>
  previousScopeId !== undefined &&
  currentScopeUnitId !== undefined &&
  previousScopeId !== currentScopeUnitId
    ? {
        eventKey: `flow:scope:${currentScopeUnitId}`,
        message: formatUnitInformationMessage(
          "a11y.announce.scopeChanged",
          language,
          { unit: getFlowUnitName(currentScopeUnitId) },
        ),
      }
    : undefined;

const useSearchAnnouncement = ({
  announceFlow,
  getFlowUnitName,
  language,
  searchResultPosition,
  searchedUnitId,
}: Pick<
  FlowAnnouncementEffectsInput,
  | "announceFlow"
  | "getFlowUnitName"
  | "language"
  | "searchResultPosition"
  | "searchedUnitId"
>): void => {
  const hasObservedSearchRef = useRef(false);
  useEffect(() => {
    const isFirstSearchObservation = !hasObservedSearchRef.current;
    hasObservedSearchRef.current = true;
    if (isFirstSearchObservation) return;
    const announcement = flowSearchAnnouncement({
      position: searchResultPosition,
      searchedUnitId,
      language,
      getFlowUnitName,
    });
    announceFlowIfPresent(announceFlow, announcement);
  }, [
    announceFlow,
    getFlowUnitName,
    language,
    searchResultPosition,
    searchedUnitId,
  ]);
};

const useFocusModeAnnouncement = ({
  announceFlow,
  focusModeEnabled,
  language,
}: Pick<
  FlowAnnouncementEffectsInput,
  "announceFlow" | "focusModeEnabled" | "language"
>): void => {
  const previousFocusModeRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    const announcement = focusModeAnnouncement({
      previousFocusMode: previousFocusModeRef.current,
      focusModeEnabled,
      language,
    });
    previousFocusModeRef.current = focusModeEnabled;
    announceFlowIfPresent(announceFlow, announcement);
  }, [announceFlow, focusModeEnabled, language]);
};

const focusModeAnnouncement = ({
  previousFocusMode,
  focusModeEnabled,
  language,
}: {
  previousFocusMode: boolean | undefined;
  focusModeEnabled: boolean;
  language: string;
}): FlowAnnouncement | undefined => {
  const announcementFactory =
    focusModeAnnouncementFactories[
      `${String(previousFocusMode)}:${String(focusModeEnabled)}`
    ];
  return announcementFactory?.(language);
};

const focusModeAnnouncementFactories: Readonly<
  Record<string, (language: string) => FlowAnnouncement>
> = {
  "false:true": (language) => ({
    eventKey: "flow:relationships:on",
    message: unitInformationMessage("a11y.announce.relationshipsOn", language),
  }),
  "true:false": (language) => ({
    eventKey: "flow:relationships:off",
    message: unitInformationMessage("a11y.announce.relationshipsOff", language),
  }),
};

export const useFlowAnnouncementEffects = (
  input: FlowAnnouncementEffectsInput,
): void => {
  useDuplicateRelationAnnouncement(input);
  useScopeAnnouncement(input);
  useSearchAnnouncement(input);
  useFocusModeAnnouncement(input);
};

const syncSelectedFlowNode = (
  instance: NonNullable<FlowViewportInstanceRef["current"]>,
  unitId: string | undefined,
  isSelected: boolean,
): void => {
  const node = unitId ? instance.getNode(unitId) : undefined;
  if (!node) return;
  updateFlowNodeSelection({
    instance,
    unitId: unitId ?? "",
    node,
    isSelected,
  });
};

const updateFlowNodeSelection = ({
  instance,
  unitId,
  node,
  isSelected,
}: {
  instance: NonNullable<FlowViewportInstanceRef["current"]>;
  unitId: string;
  node: NonNullable<
    ReturnType<NonNullable<FlowViewportInstanceRef["current"]>["getNode"]>
  >;
  isSelected: boolean;
}): void => {
  updateFlowNodeProperty(node.selected, isSelected, () =>
    instance.updateNode(unitId, { selected: isSelected }),
  );
  updateFlowNodeProperty(node.data.isSelected, isSelected, () =>
    instance.updateNodeData(unitId, { isSelected }),
  );
};

const updateFlowNodeProperty = (
  currentValue: unknown,
  isSelected: boolean,
  update: VoidFunction,
): void => {
  if (Boolean(currentValue) !== isSelected) update();
};

const useSyncSelectedFlowNode = ({
  nodes,
  reactFlowInstanceRef,
  selectedUnitId,
}: FlowGraphSelectionSyncProps): void => {
  const previousSelectedUnitIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const instance = reactFlowInstanceRef.current;
    if (!instance) return;
    syncSelectedFlowNode(instance, previousSelectedUnitIdRef.current, false);
    syncSelectedFlowNode(instance, selectedUnitId, true);
    previousSelectedUnitIdRef.current = selectedUnitId;
  }, [nodes, reactFlowInstanceRef, selectedUnitId]);
};

const readSemanticDiffHighlightKind = (
  data:
    | { semanticDiffHighlight?: { kind?: FlowGraphSemanticDiffHighlightKind } }
    | undefined,
): FlowGraphSemanticDiffHighlightKind | undefined => {
  return data?.semanticDiffHighlight?.kind;
};

const addSemanticDiffState = (
  states: Set<FlowGraphSemanticDiffHighlightKind>,
  data:
    | { semanticDiffHighlight?: { kind?: FlowGraphSemanticDiffHighlightKind } }
    | undefined,
): void => {
  const kind = readSemanticDiffHighlightKind(data);
  if (kind) states.add(kind);
};

const collectSemanticDiffStates = (
  nodes: readonly Node<FlowNodeData>[],
  edges: readonly Edge[],
): FlowGraphSemanticDiffHighlightKind[] => {
  const states = new Set<FlowGraphSemanticDiffHighlightKind>();
  nodes.forEach((node) => addSemanticDiffState(states, node.data));
  edges.forEach((edge) =>
    addSemanticDiffState(
      states,
      edge.data as
        | {
            semanticDiffHighlight?: {
              kind?: FlowGraphSemanticDiffHighlightKind;
            };
          }
        | undefined,
    ),
  );
  return [...states];
};

type PendingFlowFocusRequest = Readonly<{
  fallbackToGraphEntry: boolean;
  expectedCurrentUnitId?: string;
  expectedExpanded?: boolean;
  selectTarget?: boolean;
  sourceScopeUnitId?: string;
  sourceNodes: readonly Node<FlowNodeData>[];
  targetUnitId: string;
}>;

const focusPendingFlowNode = ({
  request,
  target,
  nodes,
  graphEntryRef,
  selectFlowNode,
}: {
  request: PendingFlowFocusRequest;
  target: FlowKeyboardFocusTarget;
  nodes: readonly Node<FlowNodeData>[];
  graphEntryRef: React.RefObject<HTMLDivElement | null>;
  selectFlowNode: (unitId: string) => void;
}): void => {
  const targetNode = nodes.find(
    (node) => node.data.unitId === request.targetUnitId,
  );
  if (!isPendingFlowExpansionReady(request, targetNode)) return;
  const focused = focusPendingFlowTarget(target, graphEntryRef);
  selectPendingFlowTarget({ focused, request, selectFlowNode });
  focusPendingFlowFallback({ focused, request, graphEntryRef });
};

const selectPendingFlowTarget = ({
  focused,
  request,
  selectFlowNode,
}: {
  focused: boolean;
  request: PendingFlowFocusRequest;
  selectFlowNode: (unitId: string) => void;
}): void => {
  if (focused && request.selectTarget) selectFlowNode(request.targetUnitId);
};

const focusPendingFlowFallback = ({
  focused,
  request,
  graphEntryRef,
}: {
  focused: boolean;
  request: PendingFlowFocusRequest;
  graphEntryRef: React.RefObject<HTMLDivElement | null>;
}): void => {
  if (!focused && request.fallbackToGraphEntry) {
    graphEntryRef.current?.focus({ preventScroll: true });
  }
};

const applyPendingFlowFocusStep = ({
  step,
  nodes,
  graphEntryRef,
  pendingFocusRequestRef,
  selectFlowNode,
}: {
  step: PendingFlowFocusStep;
  nodes: readonly Node<FlowNodeData>[];
  graphEntryRef: React.RefObject<HTMLDivElement | null>;
  pendingFocusRequestRef: React.MutableRefObject<
    PendingFlowFocusRequest | undefined
  >;
  selectFlowNode: (unitId: string) => void;
}): void => {
  if (step.kind === "cancel") {
    pendingFocusRequestRef.current = undefined;
  }
  if (step.kind === "apply") {
    focusPendingFlowNode({
      request: step.request,
      target: step.target,
      nodes,
      graphEntryRef,
      selectFlowNode,
    });
    pendingFocusRequestRef.current = undefined;
  }
};

const usePendingFlowFocus = ({
  currentUnitIdState,
  nodes,
  selectFlowNode,
}: Pick<
  FlowGraphPanelProps,
  "currentUnitIdState" | "nodes" | "selectFlowNode"
>) => {
  const graphEntryRef = useRef<HTMLDivElement>(null);
  const pendingFocusRequestRef = useRef<PendingFlowFocusRequest | undefined>(
    undefined,
  );
  useEffect(() => {
    applyPendingFlowFocusStep({
      step: resolvePendingFlowFocusStep({
        currentUnitIdState,
        nodes,
        pendingFocusRequestRef,
      }),
      nodes,
      graphEntryRef,
      pendingFocusRequestRef,
      selectFlowNode,
    });
  }, [currentUnitIdState, nodes, selectFlowNode]);
  return { graphEntryRef, pendingFocusRequestRef };
};

const applyFlowGraphFocusDecision = ({
  decision,
  graphEntryRef,
  selectFlowNode,
  selectTarget,
}: {
  decision: ReturnType<typeof resolveFlowGraphFocusRequest>;
  graphEntryRef: React.RefObject<HTMLDivElement | null>;
  selectFlowNode: (unitId: string) => void;
  selectTarget: boolean;
}): boolean => {
  const focused = focusFlowGraphDecisionTarget(decision, graphEntryRef);
  if (decision.kind === "node" && focused && selectTarget) {
    selectFlowNode(decision.targetUnitId);
  }
  return focused;
};

const focusFlowGraphDecisionTarget = (
  decision: ReturnType<typeof resolveFlowGraphFocusRequest>,
  graphEntryRef: React.RefObject<HTMLDivElement | null>,
): boolean => {
  if (decision.kind === "wait") return false;
  if (decision.kind === "node") {
    return focusRenderedFlowNode(
      graphEntryRef.current,
      decision.targetUnitId,
      CSS.escape,
    );
  }
  graphEntryRef.current?.focus({ preventScroll: true });
  return true;
};

const applyFlowGraphFocusRequest = ({
  currentUnitIdState,
  focusRequest,
  nodes,
  graphEntryRef,
  selectFlowNode,
  handledFocusRequestRevisionRef,
}: {
  currentUnitIdState: CurrentUnitIdStateType;
  focusRequest: FlowGraphFocusRequest;
  nodes: readonly Node<FlowNodeData>[];
  graphEntryRef: React.RefObject<HTMLDivElement | null>;
  selectFlowNode: (unitId: string) => void;
  handledFocusRequestRevisionRef: React.MutableRefObject<number>;
}): void => {
  if (focusRequest.revision <= handledFocusRequestRevisionRef.current) return;
  const decision = resolveFlowGraphFocusRequest(
    focusRequest,
    currentUnitIdState.currentUnitId,
    renderedFlowUnitIds(nodes),
  );
  const applied = applyFlowGraphFocusDecision({
    decision,
    graphEntryRef,
    selectFlowNode,
    selectTarget: focusRequest.selectTarget,
  });
  if (applied) handledFocusRequestRevisionRef.current = focusRequest.revision;
};

const useFlowGraphFocusRequest = ({
  currentUnitIdState,
  focusRequest,
  nodes,
  selectFlowNode,
  graphEntryRef,
}: Pick<
  FlowGraphPanelProps,
  "currentUnitIdState" | "focusRequest" | "nodes" | "selectFlowNode"
> & { graphEntryRef: React.RefObject<HTMLDivElement | null> }): void => {
  const handledFocusRequestRevisionRef = useRef(0);
  useEffect(() => {
    applyFlowGraphFocusRequest({
      currentUnitIdState,
      focusRequest,
      nodes,
      graphEntryRef,
      selectFlowNode,
      handledFocusRequestRevisionRef,
    });
  }, [currentUnitIdState, focusRequest, graphEntryRef, nodes, selectFlowNode]);
};

const FlowGraphPanelComponent: FC<FlowGraphPanelProps> = ({
  clearGraphHoveredUnit,
  currentUnitIdState,
  edges,
  focusRequest,
  graphHoveredUnit,
  miniMapColors,
  nodes,
  onFocusDetail,
  onFocusSelector,
  onKeyboardNavigation,
  onRendererReady,
  onScopeChange,
  onNestedExpansion,
  onNodeSelected,
  onSpatialMove,
  language,
  graphAriaLabel,
  reactFlowInstanceRef,
  selectFlowNode,
  selectedUnitId,
  showMiniMap,
  theme,
  toggleExpandedFlowNodeFromKeyboard,
  unitById,
}) => {
  const { graphEntryRef, pendingFocusRequestRef } = usePendingFlowFocus({
    currentUnitIdState,
    nodes,
    selectFlowNode,
  });
  const navigationIndexCacheRef =
    useRef<FlowKeyboardNavigationIndexCache>(undefined);
  const navigationNodes = flowNavigationNodes(nodes, unitById);
  const scopeUnitById = useMemo(() => flowScopeUnitById(unitById), [unitById]);
  navigationIndexCacheRef.current = resolveFlowKeyboardNavigationIndexCache(
    navigationIndexCacheRef.current,
    navigationNodes,
  );
  const navigationIndex = navigationIndexCacheRef.current.index;
  useFlowGraphFocusRequest({
    currentUnitIdState,
    focusRequest,
    nodes,
    selectFlowNode,
    graphEntryRef,
  });

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<FlowNodeData>) => {
      selectFlowNode(node.id);
      onNodeSelected?.(node.id);
    },
    [onNodeSelected, selectFlowNode],
  );
  const handleNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node<FlowNodeData>) =>
      graphHoveredUnit(node.id),
    [graphHoveredUnit],
  );
  const handleNodeMouseLeave = useCallback(
    (_event: React.MouseEvent, node: Node<FlowNodeData>) =>
      clearGraphHoveredUnit(node.id),
    [clearGraphHoveredUnit],
  );
  const keyboardContext: FlowKeyboardHandlerContext = {
    currentUnitIdState,
    graphEntryRef,
    navigationIndex,
    nodes,
    onFocusDetail,
    onFocusSelector,
    onKeyboardNavigation,
    onScopeChange,
    onSpatialMove,
    pendingFocusRequestRef,
    scopeUnitById,
    toggleExpandedFlowNodeFromKeyboard,
    onNestedExpansion,
  };
  const handleFlowNodeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) =>
      handleFlowNodeKeyDownEvent(event, keyboardContext),
    [keyboardContext],
  );

  return (
    <Paper
      ref={graphEntryRef}
      role="region"
      aria-label={graphAriaLabel}
      tabIndex={resolveFlowGraphEntryTabIndex(nodes)}
      onKeyDownCapture={handleFlowNodeKeyDown}
      variant="outlined"
      sx={{
        flex: 1,
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      <FlowGraphCanvas
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onRendererReady={onRendererReady}
        reactFlowInstanceRef={reactFlowInstanceRef}
        selectedUnitId={selectedUnitId}
        showMiniMap={showMiniMap}
        theme={theme}
        language={language}
        miniMapColors={miniMapColors}
      />
    </Paper>
  );
};

FlowGraphPanelComponent.displayName = "FlowGraphPanel";
export const FlowGraphPanel = memo(FlowGraphPanelComponent);

const SemanticDiffLegend: FC<{
  states: readonly FlowGraphSemanticDiffHighlightKind[];
  language: string;
}> = ({ states, language }) => {
  if (states.length === 0) return null;
  return (
    <Box
      component="aside"
      role="note"
      aria-label={unitInformationMessage(
        "a11y.flow.semanticDiff.legend",
        language,
      )}
      data-semantic-diff-legend="true"
      sx={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 5,
        display: "flex",
        gap: 0.75,
        flexWrap: "wrap",
        padding: "0.35rem 0.5rem",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        backgroundColor: "background.paper",
        fontSize: "0.72rem",
        "@media (forced-colors: active)": {
          color: "CanvasText",
          backgroundColor: "Canvas",
          borderColor: "CanvasText",
        },
        "body.vscode-high-contrast &": {
          color: "var(--vscode-foreground, CanvasText)",
          backgroundColor: "var(--vscode-editor-background, Canvas)",
          borderColor: "var(--vscode-foreground, CanvasText)",
        },
      }}
    >
      {states.map((state) => (
        <span key={state} data-semantic-diff-legend-state={state}>
          {unitInformationMessage(semanticDiffLegendLabelKey(state), language)}
        </span>
      ))}
    </Box>
  );
};

const FlowGraphCanvas: FC<FlowGraphCanvasProps> = ({
  edges,
  language,
  miniMapColors,
  nodes,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onRendererReady,
  reactFlowInstanceRef,
  selectedUnitId,
  showMiniMap,
  theme,
}) => {
  useSyncSelectedFlowNode({
    nodes,
    reactFlowInstanceRef,
    selectedUnitId,
  });

  const semanticDiffStates = collectSemanticDiffStates(nodes, edges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      defaultViewport={defaultViewport}
      colorMode={theme.palette.mode}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      onInit={onRendererReady}
      ariaLabelConfig={flowAriaLabelConfig(language)}
      {...readOnlyFlowInteractionProps}
      fitView
      minZoom={minimumViewportZoom}
      fitViewOptions={{
        padding: 0.22,
        minZoom: minimumViewportZoom,
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color={theme.palette.divider}
      />
      <Controls
        position="bottom-left"
        showInteractive={false}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
        }}
      />
      {showMiniMap && (
        <MiniMap<Node<FlowNodeData>>
          className="ajs-flow-minimap"
          ariaLabel={unitInformationMessage(
            "a11y.flow.reactFlow.minimap",
            language,
          )}
          pannable
          zoomable
          position="bottom-right"
          nodeColor={(node) => resolveFlowMiniMapNodeFill(node, miniMapColors)}
          nodeStrokeColor={(node) =>
            resolveFlowMiniMapNodeStroke(node, miniMapColors)
          }
          nodeStrokeWidth={3}
          bgColor={theme.palette.background.paper}
          maskColor={`${theme.palette.background.default}66`}
          maskStrokeColor="transparent"
          maskStrokeWidth={0}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            opacity: 1,
            boxShadow: theme.shadows[3],
          }}
        />
      )}
      <SemanticDiffLegend states={semanticDiffStates} language={language} />
    </ReactFlow>
  );
};

FlowGraphCanvas.displayName = "FlowGraphCanvas";

export default FlowGraphCanvas;
