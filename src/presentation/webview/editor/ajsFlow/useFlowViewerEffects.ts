import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import {
  type ValidatedFlowGraphDocument,
  validateFlowGraphDocument,
} from "../../../../application/flow-graph/flowGraphDocument";
import type { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import { toUnitDefinitionByPath } from "../../../../application/unit-definition/unitDefinitionDocument";
import { toDurationBucket } from "../../../../application/telemetry/telemetryBuckets";
import {
  parseNavigationRequest,
  type NavigationRequestDto,
} from "../../../../application/navigation/resolveNavigationTarget";
import { CHANGE_DOCUMENT, REVEAL_UNIT } from "../../viewerHostMessages";
import {
  createViewerPerformanceRequest,
  createViewerReadyRequest,
} from "../../viewerRequestMessages";
import {
  resolveFlowNodeCenter,
  resolveFlowViewportFocusAction,
  resolveFlowViewportFocusDecision,
  shouldPreserveFlowViewport,
} from "./flowViewportFocus";
import type {
  FlowViewportFocusAction,
  FlowViewportFocusDecision,
} from "./flowViewportFocus";

type UseFlowViewerFitViewParams = {
  edges: Edge[];
  focusRequestVersion: number;
  layoutRequestIdentity: object;
  nodes: Node[];
  preserveViewportRequestVersion: number;
  reactFlowInstanceRef: MutableRefObject<ReactFlowInstance<Node, Edge> | null>;
  searchedUnitId?: string;
  selectionFocusRequestVersion: number;
  selectionFocusTargetUnitId?: string;
};

type FlowViewerOverflowElements = {
  body: HTMLElement;
  documentElement: HTMLElement;
  root: HTMLElement | null;
};

type FitViewFrameRef = MutableRefObject<number | undefined>;

type FlowViewerFitViewRefs = {
  fitViewFrameRef: FitViewFrameRef;
  handledLayoutRequestIdentityRef: MutableRefObject<object | undefined>;
  handledPreserveViewportVersionRef: MutableRefObject<number>;
  handledSearchFocusVersionRef: MutableRefObject<number>;
  handledSelectionFocusVersionRef: MutableRefObject<number>;
};

const hasFitViewTarget = ({
  nodes,
  reactFlowInstanceRef,
}: Pick<
  UseFlowViewerFitViewParams,
  "nodes" | "reactFlowInstanceRef"
>): boolean => !!reactFlowInstanceRef.current && nodes.length > 0;

const cancelFitViewFrame = (fitViewFrameRef: FitViewFrameRef) => {
  if (fitViewFrameRef.current !== undefined) {
    window.cancelAnimationFrame(fitViewFrameRef.current);
    fitViewFrameRef.current = undefined;
  }
};

type ScheduleViewportFocusFrameOptions = {
  kind: "search" | "selection" | "layout";
  onFit?: () => void;
  targetUnitId?: string;
};

const applySetCenterAction = (
  instance: ReactFlowInstance<Node, Edge>,
  targetUnitId: string,
) => {
  const center = resolveFlowNodeCenter(instance.getNodesBounds([targetUnitId]));
  void instance.setCenter(center.x, center.y, {
    duration: 250,
    zoom: instance.getZoom(),
  });
};

const resolveFitViewPadding = (targetUnitId?: string): number =>
  targetUnitId ? 0.8 : 0.22;

const resolveFitViewDuration = (targetUnitId?: string): number | undefined =>
  targetUnitId ? 250 : undefined;

const resolveFitViewNodes = (
  targetUnitId?: string,
): Array<{ id: string }> | undefined =>
  targetUnitId ? [{ id: targetUnitId }] : undefined;

const applyFitViewAction = (
  instance: ReactFlowInstance<Node, Edge> | null,
  targetUnitId?: string,
) => {
  void instance?.fitView({
    padding: resolveFitViewPadding(targetUnitId),
    duration: resolveFitViewDuration(targetUnitId),
    nodes: resolveFitViewNodes(targetUnitId),
  });
};

const applyViewportFocusAction = (
  instance: ReactFlowInstance<Node, Edge> | null,
  action: FlowViewportFocusAction,
) => {
  if (action.kind === "setCenter" && instance) {
    applySetCenterAction(instance, action.targetUnitId);
    return;
  }
  applyFitViewAction(instance, action.targetUnitId);
};

const runViewportFocusFrame = (
  fitViewFrameRef: FitViewFrameRef,
  reactFlowInstanceRef: MutableRefObject<ReactFlowInstance<Node, Edge> | null>,
  options: ScheduleViewportFocusFrameOptions,
) => {
  const action = resolveFlowViewportFocusAction(options);
  applyViewportFocusAction(reactFlowInstanceRef.current, action);
  options.onFit?.();
  fitViewFrameRef.current = undefined;
};

const scheduleViewportFocusFrame = (
  fitViewFrameRef: FitViewFrameRef,
  reactFlowInstanceRef: MutableRefObject<ReactFlowInstance<Node, Edge> | null>,
  options: ScheduleViewportFocusFrameOptions,
) => {
  cancelFitViewFrame(fitViewFrameRef);
  fitViewFrameRef.current = window.requestAnimationFrame(() => {
    runViewportFocusFrame(fitViewFrameRef, reactFlowInstanceRef, options);
  });
};

const toRenderedUnitIds = (nodes: readonly Node[]): ReadonlySet<string> =>
  new Set(nodes.map(({ id }) => id));

const resolveCurrentViewportFocusDecision = (
  {
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    searchedUnitId,
    selectionFocusRequestVersion,
    selectionFocusTargetUnitId,
  }: UseFlowViewerFitViewParams,
  {
    handledLayoutRequestIdentityRef,
    handledSearchFocusVersionRef,
    handledSelectionFocusVersionRef,
  }: Pick<
    FlowViewerFitViewRefs,
    | "handledLayoutRequestIdentityRef"
    | "handledSearchFocusVersionRef"
    | "handledSelectionFocusVersionRef"
  >,
): FlowViewportFocusDecision | null | undefined =>
  resolveFlowViewportFocusDecision({
    renderedUnitIds: toRenderedUnitIds(nodes),
    searchRequest: {
      targetUnitId: searchedUnitId,
      version: focusRequestVersion,
    },
    handledSearchVersion: handledSearchFocusVersionRef.current,
    selectionRequest: {
      targetUnitId: selectionFocusTargetUnitId,
      version: selectionFocusRequestVersion,
    },
    handledSelectionVersion: handledSelectionFocusVersionRef.current,
    layoutChanged:
      handledLayoutRequestIdentityRef.current !== layoutRequestIdentity,
  });

const preservePendingKeyboardExpansionViewport = (
  params: UseFlowViewerFitViewParams,
  refs: Pick<
    FlowViewerFitViewRefs,
    "handledLayoutRequestIdentityRef" | "handledPreserveViewportVersionRef"
  >,
): boolean => {
  const layoutChanged =
    refs.handledLayoutRequestIdentityRef.current !==
    params.layoutRequestIdentity;
  if (
    !shouldPreserveFlowViewport({
      requestVersion: params.preserveViewportRequestVersion,
      handledVersion: refs.handledPreserveViewportVersionRef.current,
      layoutChanged,
    })
  ) {
    return false;
  }
  refs.handledPreserveViewportVersionRef.current =
    params.preserveViewportRequestVersion;
  refs.handledLayoutRequestIdentityRef.current = params.layoutRequestIdentity;
  return true;
};

const updateHandledViewportFocus = (
  decision: FlowViewportFocusDecision,
  {
    focusRequestVersion,
    layoutRequestIdentity,
    selectionFocusRequestVersion,
  }: Pick<
    UseFlowViewerFitViewParams,
    | "focusRequestVersion"
    | "layoutRequestIdentity"
    | "selectionFocusRequestVersion"
  >,
  {
    handledLayoutRequestIdentityRef,
    handledSearchFocusVersionRef,
    handledSelectionFocusVersionRef,
  }: Pick<
    FlowViewerFitViewRefs,
    | "handledLayoutRequestIdentityRef"
    | "handledSearchFocusVersionRef"
    | "handledSelectionFocusVersionRef"
  >,
) => {
  if (decision.kind === "search") {
    handledSearchFocusVersionRef.current = focusRequestVersion;
  }
  if (decision.kind === "selection") {
    handledSelectionFocusVersionRef.current = selectionFocusRequestVersion;
  }
  handledLayoutRequestIdentityRef.current = layoutRequestIdentity;
};

const scheduleResolvedViewportFocus = (
  decision: FlowViewportFocusDecision,
  params: UseFlowViewerFitViewParams,
  refs: FlowViewerFitViewRefs,
) => {
  scheduleViewportFocusFrame(
    refs.fitViewFrameRef,
    params.reactFlowInstanceRef,
    {
      kind: decision.kind,
      targetUnitId: decision.targetUnitId,
      onFit: () => updateHandledViewportFocus(decision, params, refs),
    },
  );
};

const runFlowViewerFitViewEffect = (
  params: UseFlowViewerFitViewParams,
  refs: FlowViewerFitViewRefs,
): (() => void) | undefined => {
  if (!hasFitViewTarget(params)) {
    return undefined;
  }
  if (preservePendingKeyboardExpansionViewport(params, refs)) {
    return undefined;
  }

  const decision = resolveCurrentViewportFocusDecision(params, refs);
  if (!decision) {
    return undefined;
  }

  scheduleResolvedViewportFocus(decision, params, refs);
  return () => cancelFitViewFrame(refs.fitViewFrameRef);
};

export const useFlowViewerFitView = ({
  edges,
  focusRequestVersion,
  layoutRequestIdentity,
  nodes,
  preserveViewportRequestVersion,
  reactFlowInstanceRef,
  searchedUnitId,
  selectionFocusRequestVersion,
  selectionFocusTargetUnitId,
}: UseFlowViewerFitViewParams) => {
  const fitViewFrameRef = useRef<number | undefined>(undefined);
  const handledSearchFocusVersionRef = useRef(0);
  const handledSelectionFocusVersionRef = useRef(0);
  const handledPreserveViewportVersionRef = useRef(0);
  const handledLayoutRequestIdentityRef = useRef<object | undefined>(undefined);

  useEffect(() => {
    return runFlowViewerFitViewEffect(
      {
        edges,
        focusRequestVersion,
        layoutRequestIdentity,
        nodes,
        preserveViewportRequestVersion,
        reactFlowInstanceRef,
        searchedUnitId,
        selectionFocusRequestVersion,
        selectionFocusTargetUnitId,
      },
      {
        fitViewFrameRef,
        handledLayoutRequestIdentityRef,
        handledPreserveViewportVersionRef,
        handledSearchFocusVersionRef,
        handledSelectionFocusVersionRef,
      },
    );
  }, [
    edges,
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    preserveViewportRequestVersion,
    reactFlowInstanceRef,
    searchedUnitId,
    selectionFocusRequestVersion,
    selectionFocusTargetUnitId,
  ]);
};

type UseFlowScopeResetParams = {
  documentIdentity?: object;
  currentUnitId?: string;
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>;
  resetSearch: () => void;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
};

const clearExpandedUnitIds = (
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>,
) => {
  setExpandedUnitIds((prev) => (prev.length === 0 ? prev : []));
};

const shouldPreserveSearchOnScopeChange = (
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>,
): boolean => {
  if (!preserveSearchOnNextScopeChange.current) {
    return false;
  }

  preserveSearchOnNextScopeChange.current = false;
  return true;
};

const resetFlowScopeState = ({
  preserveSearchOnNextScopeChange,
  resetSearch,
  setExpandedUnitIds,
}: Pick<
  UseFlowScopeResetParams,
  "preserveSearchOnNextScopeChange" | "resetSearch" | "setExpandedUnitIds"
>) => {
  clearExpandedUnitIds(setExpandedUnitIds);
  if (!shouldPreserveSearchOnScopeChange(preserveSearchOnNextScopeChange)) {
    resetSearch();
  }
};

export const useFlowScopeReset = ({
  documentIdentity,
  currentUnitId,
  preserveSearchOnNextScopeChange,
  resetSearch,
  setExpandedUnitIds,
}: UseFlowScopeResetParams) => {
  useEffect(() => {
    resetFlowScopeState({
      preserveSearchOnNextScopeChange,
      resetSearch,
      setExpandedUnitIds,
    });
  }, [
    documentIdentity,
    currentUnitId,
    preserveSearchOnNextScopeChange,
    resetSearch,
    setExpandedUnitIds,
  ]);
};

type UseFlowDocumentSubscriptionParams = {
  previousUnitIdRef: MutableRefObject<string | undefined>;
  setFlowDocument: Dispatch<
    SetStateAction<ValidatedFlowGraphDocument | undefined>
  >;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setUnitDefinitionByPath: Dispatch<
    SetStateAction<ReadonlyMap<string, UnitDefinitionDialogDto>>
  >;
};

const resolveNextCurrentUnitId = (
  nextDocument: ValidatedFlowGraphDocument | undefined,
  prevUnitId: string | undefined,
): string | undefined => {
  if (!nextDocument) {
    return undefined;
  }
  if (prevUnitId) {
    return nextDocument.index.unitById.get(prevUnitId)?.id;
  }
  for (const unit of nextDocument.index.unitById.values()) {
    if (unit.unitType === "n" && unit.isRootJobnet) {
      return unit.id;
    }
  }
  return undefined;
};

export const resolveFlowDocumentChange = (
  data: unknown,
  previousUnitId: string | undefined,
) => {
  const validation = data ? validateFlowGraphDocument(data) : undefined;
  const flowDocument =
    validation?.status === "available" ? validation : undefined;
  return {
    flowDocument,
    currentUnitId: resolveNextCurrentUnitId(flowDocument, previousUnitId),
    unitDefinitionByPath: toUnitDefinitionByPath(data),
  };
};

export const useFlowDocumentSubscription = ({
  previousUnitIdRef,
  setFlowDocument,
  setCurrentUnitId,
  setUnitDefinitionByPath,
}: UseFlowDocumentSubscriptionParams) => {
  const renderReadyStartedAt = useRef(performance.now());
  useEffect(() => {
    const changeDocumentFn = (_type: string, data: unknown) => {
      const nextState = resolveFlowDocumentChange(
        data,
        previousUnitIdRef.current,
      );
      setFlowDocument(() => nextState.flowDocument);
      setUnitDefinitionByPath(() => nextState.unitDefinitionByPath);
      setCurrentUnitId(() => nextState.currentUnitId);
    };
    window.EventBridge.addCallback(CHANGE_DOCUMENT, changeDocumentFn);
    window.vscode.postMessage(
      createViewerPerformanceRequest({
        operation: "flow_render",
        result: "success",
        durationBucket: toDurationBucket(
          performance.now() - renderReadyStartedAt.current,
        ),
      }),
    );
    window.vscode.postMessage(createViewerReadyRequest());
    return () => {
      window.EventBridge.removeCallback(CHANGE_DOCUMENT, changeDocumentFn);
    };
  }, [
    previousUnitIdRef,
    setFlowDocument,
    setCurrentUnitId,
    setUnitDefinitionByPath,
  ]);
};

type UseRevealUnitSubscriptionParams = {
  handleRevealUnit: (request: NavigationRequestDto) => void;
};

export const useRevealUnitSubscription = ({
  handleRevealUnit,
}: UseRevealUnitSubscriptionParams) => {
  useEffect(() => {
    const revealUnitFn = (_type: string, data: unknown) => {
      const result = parseNavigationRequest(data);
      if (result.status === "available") handleRevealUnit(result.request);
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    return () => {
      window.EventBridge.removeCallback(REVEAL_UNIT, revealUnitFn);
    };
  }, [handleRevealUnit]);
};

const getFlowViewerOverflowElements = (): FlowViewerOverflowElements => ({
  body: document.body,
  documentElement: document.documentElement,
  root: document.getElementById("root"),
});

const applyFlowViewerOverflow = ({
  body,
  documentElement,
  root,
}: FlowViewerOverflowElements) => {
  documentElement.style.overflow = "hidden";
  body.style.overflow = "hidden";
  if (root) {
    root.style.overflow = "hidden";
    root.style.height = "100%";
  }
};

const resetFlowViewerOverflow = ({
  body,
  documentElement,
  root,
}: FlowViewerOverflowElements) => {
  documentElement.style.overflow = "";
  body.style.overflow = "";
  if (root) {
    root.style.overflow = "";
    root.style.height = "";
  }
};

export const useFlowViewerOverflow = () => {
  useEffect(() => {
    const elements = getFlowViewerOverflowElements();
    applyFlowViewerOverflow(elements);
    return () => resetFlowViewerOverflow(elements);
  }, []);
};
