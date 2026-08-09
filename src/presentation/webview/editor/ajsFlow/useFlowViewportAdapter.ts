import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import type { FlowNodeData } from "./flowNodePresentationModel";
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

export type FlowViewportInstanceRef = MutableRefObject<ReactFlowInstance<
  Node<FlowNodeData>,
  Edge
> | null>;

export type FlowRendererReady = (
  instance: ReactFlowInstance<Node<FlowNodeData>, Edge>,
) => void;

type UseFlowViewportAdapterParams = {
  edges: Edge[];
  focusRequestVersion: number;
  layoutRequestIdentity: object;
  nodes: Node[];
  preserveViewportRequestVersion: number;
  searchedUnitId?: string;
  selectionFocusRequestVersion: number;
  selectionFocusTargetUnitId?: string;
};

type FlowViewportFrameRef = MutableRefObject<number | undefined>;

type FlowViewportAdapterRefs = {
  fitViewFrameRef: FlowViewportFrameRef;
  handledLayoutRequestIdentityRef: MutableRefObject<object | undefined>;
  handledPreserveViewportVersionRef: MutableRefObject<number>;
  handledSearchFocusVersionRef: MutableRefObject<number>;
  handledSelectionFocusVersionRef: MutableRefObject<number>;
};

type ScheduleViewportFocusFrameOptions = {
  kind: "search" | "selection" | "layout";
  onFit?: () => void;
  targetUnitId?: string;
};

const cancelViewportFocusFrame = (frameRef: FlowViewportFrameRef): void => {
  if (frameRef.current === undefined) return;
  window.cancelAnimationFrame(frameRef.current);
  frameRef.current = undefined;
};

const applySetCenterAction = (
  instance: ReactFlowInstance<Node, Edge>,
  targetUnitId: string,
): void => {
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
): void => {
  void instance?.fitView({
    padding: resolveFitViewPadding(targetUnitId),
    duration: resolveFitViewDuration(targetUnitId),
    nodes: resolveFitViewNodes(targetUnitId),
  });
};

const applyViewportFocusAction = (
  instance: ReactFlowInstance<Node, Edge> | null,
  action: FlowViewportFocusAction,
): void => {
  if (action.kind === "setCenter" && instance) {
    applySetCenterAction(instance, action.targetUnitId);
    return;
  }
  applyFitViewAction(instance, action.targetUnitId);
};

const runViewportFocusFrame = (
  frameRef: FlowViewportFrameRef,
  instanceRef: FlowViewportInstanceRef,
  options: ScheduleViewportFocusFrameOptions,
): void => {
  const action = resolveFlowViewportFocusAction(options);
  applyViewportFocusAction(instanceRef.current, action);
  options.onFit?.();
  frameRef.current = undefined;
};

const scheduleViewportFocusFrame = (
  frameRef: FlowViewportFrameRef,
  instanceRef: FlowViewportInstanceRef,
  options: ScheduleViewportFocusFrameOptions,
): void => {
  cancelViewportFocusFrame(frameRef);
  frameRef.current = window.requestAnimationFrame(() =>
    runViewportFocusFrame(frameRef, instanceRef, options),
  );
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
  }: UseFlowViewportAdapterParams,
  refs: Pick<
    FlowViewportAdapterRefs,
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
    handledSearchVersion: refs.handledSearchFocusVersionRef.current,
    selectionRequest: {
      targetUnitId: selectionFocusTargetUnitId,
      version: selectionFocusRequestVersion,
    },
    handledSelectionVersion: refs.handledSelectionFocusVersionRef.current,
    layoutChanged:
      refs.handledLayoutRequestIdentityRef.current !== layoutRequestIdentity,
  });

const preservePendingKeyboardExpansionViewport = (
  params: UseFlowViewportAdapterParams,
  refs: Pick<
    FlowViewportAdapterRefs,
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
    UseFlowViewportAdapterParams,
    | "focusRequestVersion"
    | "layoutRequestIdentity"
    | "selectionFocusRequestVersion"
  >,
  refs: Pick<
    FlowViewportAdapterRefs,
    | "handledLayoutRequestIdentityRef"
    | "handledSearchFocusVersionRef"
    | "handledSelectionFocusVersionRef"
  >,
): void => {
  if (decision.kind === "search") {
    refs.handledSearchFocusVersionRef.current = focusRequestVersion;
  }
  if (decision.kind === "selection") {
    refs.handledSelectionFocusVersionRef.current = selectionFocusRequestVersion;
  }
  refs.handledLayoutRequestIdentityRef.current = layoutRequestIdentity;
};

const runViewportAdapterEffect = (
  params: UseFlowViewportAdapterParams,
  instanceRef: FlowViewportInstanceRef,
  refs: FlowViewportAdapterRefs,
): (() => void) | undefined => {
  if (!instanceRef.current || params.nodes.length === 0) return undefined;
  if (preservePendingKeyboardExpansionViewport(params, refs)) return undefined;

  const decision = resolveCurrentViewportFocusDecision(params, refs);
  if (!decision) return undefined;
  scheduleViewportFocusFrame(refs.fitViewFrameRef, instanceRef, {
    kind: decision.kind,
    targetUnitId: decision.targetUnitId,
    onFit: () => updateHandledViewportFocus(decision, params, refs),
  });
  return () => cancelViewportFocusFrame(refs.fitViewFrameRef);
};

export const useFlowViewportAdapter = (
  params: UseFlowViewportAdapterParams,
): {
  onRendererReady: FlowRendererReady;
  reactFlowInstanceRef: FlowViewportInstanceRef;
} => {
  const reactFlowInstanceRef = useRef<ReactFlowInstance<
    Node<FlowNodeData>,
    Edge
  > | null>(null);
  const fitViewFrameRef = useRef<number | undefined>(undefined);
  const handledSearchFocusVersionRef = useRef(0);
  const handledSelectionFocusVersionRef = useRef(0);
  const handledPreserveViewportVersionRef = useRef(0);
  const handledLayoutRequestIdentityRef = useRef<object | undefined>(undefined);
  const [rendererReadyVersion, setRendererReadyVersion] = useState(0);

  const {
    edges,
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    preserveViewportRequestVersion,
    searchedUnitId,
    selectionFocusRequestVersion,
    selectionFocusTargetUnitId,
  } = params;

  useEffect(() => {
    return runViewportAdapterEffect(
      {
        edges,
        focusRequestVersion,
        layoutRequestIdentity,
        nodes,
        preserveViewportRequestVersion,
        searchedUnitId,
        selectionFocusRequestVersion,
        selectionFocusTargetUnitId,
      },
      reactFlowInstanceRef,
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
    rendererReadyVersion,
    searchedUnitId,
    selectionFocusRequestVersion,
    selectionFocusTargetUnitId,
  ]);

  const onRendererReady = useCallback<FlowRendererReady>((instance) => {
    reactFlowInstanceRef.current = instance;
    setRendererReadyVersion((version) => version + 1);
  }, []);

  return { onRendererReady, reactFlowInstanceRef };
};
