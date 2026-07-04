import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import {
  AjsDocument,
  findRootJobnet,
  flattenAjsUnits,
} from "../../../../domain/models/ajs/AjsDocument";
import { toAjsDocument } from "../../../../application/unit-list/unitListDocument";
import { toDurationBucket } from "../../../../application/telemetry/telemetryBuckets";
import {
  createPerformanceEvent,
  REVEAL_UNIT,
} from "../../../../shared/webviewEvents";
import { getRevealUnitAbsolutePath } from "../revealUnit";
import {
  resolveFlowNodeCenter,
  resolveFlowViewportFocusAction,
  resolveFlowViewportFocusDecision,
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
  reactFlowInstanceRef,
  searchedUnitId,
  selectionFocusRequestVersion,
  selectionFocusTargetUnitId,
}: UseFlowViewerFitViewParams) => {
  const fitViewFrameRef = useRef<number | undefined>(undefined);
  const handledSearchFocusVersionRef = useRef(0);
  const handledSelectionFocusVersionRef = useRef(0);
  const handledLayoutRequestIdentityRef = useRef<object | undefined>(undefined);

  useEffect(() => {
    return runFlowViewerFitViewEffect(
      {
        edges,
        focusRequestVersion,
        layoutRequestIdentity,
        nodes,
        reactFlowInstanceRef,
        searchedUnitId,
        selectionFocusRequestVersion,
        selectionFocusTargetUnitId,
      },
      {
        fitViewFrameRef,
        handledLayoutRequestIdentityRef,
        handledSearchFocusVersionRef,
        handledSelectionFocusVersionRef,
      },
    );
  }, [
    edges,
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    reactFlowInstanceRef,
    searchedUnitId,
    selectionFocusRequestVersion,
    selectionFocusTargetUnitId,
  ]);
};

type UseFlowScopeResetParams = {
  ajsDocument?: AjsDocument;
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
  ajsDocument,
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
    ajsDocument,
    currentUnitId,
    preserveSearchOnNextScopeChange,
    resetSearch,
    setExpandedUnitIds,
  ]);
};

type UseFlowDocumentSubscriptionParams = {
  prevUnitEntityId: MutableRefObject<string | undefined>;
  setAjsDocument: Dispatch<SetStateAction<AjsDocument | undefined>>;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
};

const resolveNextCurrentUnitId = (
  nextDocument: AjsDocument | undefined,
  prevUnitId: string | undefined,
): string | undefined => {
  if (!nextDocument) {
    return undefined;
  }
  const units = flattenAjsUnits(nextDocument.rootUnits);
  return prevUnitId
    ? units.find((unit) => unit.id === prevUnitId)?.id
    : findRootJobnet(nextDocument)?.id;
};

export const useFlowDocumentSubscription = ({
  prevUnitEntityId,
  setAjsDocument,
  setCurrentUnitId,
}: UseFlowDocumentSubscriptionParams) => {
  const renderReadyStartedAt = useRef(performance.now());
  useEffect(() => {
    const changeDocumentFn = (_type: string, data: unknown) => {
      const nextDocument = data ? toAjsDocument(data) : undefined;
      setAjsDocument(() => nextDocument);
      setCurrentUnitId(() =>
        resolveNextCurrentUnitId(nextDocument, prevUnitEntityId.current),
      );
    };
    window.EventBridge.addCallback("changeDocument", changeDocumentFn);
    window.vscode.postMessage(
      createPerformanceEvent({
        operation: "flow_render",
        result: "success",
        durationBucket: toDurationBucket(
          performance.now() - renderReadyStartedAt.current,
        ),
      }),
    );
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocumentFn);
    };
  }, [prevUnitEntityId, setAjsDocument, setCurrentUnitId]);
};

type UseRevealUnitSubscriptionParams = {
  handleRevealUnit: (absolutePath: string) => void;
};

export const useRevealUnitSubscription = ({
  handleRevealUnit,
}: UseRevealUnitSubscriptionParams) => {
  useEffect(() => {
    const revealUnitFn = (_type: string, data: unknown) => {
      const absolutePath = getRevealUnitAbsolutePath(data);
      if (!absolutePath) {
        return;
      }
      handleRevealUnit(absolutePath);
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
