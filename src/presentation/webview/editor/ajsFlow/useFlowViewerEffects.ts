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
import {
  toAjsDocument,
  UnitListDocumentDto,
} from "../../../../application/unit-list/unitListDocument";
import { REVEAL_UNIT } from "../../../../shared/webviewEvents";
import { getRevealUnitAbsolutePath } from "../revealUnit";
import {
  resolveFlowNodeCenter,
  resolveFlowViewportFocusAction,
  resolveFlowViewportFocusDecision,
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

const scheduleViewportFocusFrame = (
  fitViewFrameRef: FitViewFrameRef,
  reactFlowInstanceRef: MutableRefObject<ReactFlowInstance<Node, Edge> | null>,
  options: ScheduleViewportFocusFrameOptions,
) => {
  cancelFitViewFrame(fitViewFrameRef);
  fitViewFrameRef.current = window.requestAnimationFrame(() => {
    const instance = reactFlowInstanceRef.current;
    const action = resolveFlowViewportFocusAction(options);
    if (action.kind === "setCenter" && instance) {
      const center = resolveFlowNodeCenter(
        instance.getNodesBounds([action.targetUnitId]),
      );
      void instance.setCenter(center.x, center.y, {
        duration: 250,
        zoom: instance.getZoom(),
      });
    } else {
      void instance?.fitView({
        padding: action.targetUnitId ? 0.8 : 0.22,
        duration: action.targetUnitId ? 250 : undefined,
        nodes: action.targetUnitId ? [{ id: action.targetUnitId }] : undefined,
      });
    }
    options.onFit?.();
    fitViewFrameRef.current = undefined;
  });
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
    if (!hasFitViewTarget({ nodes, reactFlowInstanceRef })) {
      return undefined;
    }

    const decision = resolveFlowViewportFocusDecision({
      renderedUnitIds: new Set(nodes.map(({ id }) => id)),
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
    if (!decision) {
      return undefined;
    }

    scheduleViewportFocusFrame(fitViewFrameRef, reactFlowInstanceRef, {
      kind: decision.kind,
      targetUnitId: decision.targetUnitId,
      onFit: () => {
        if (decision.kind === "search") {
          handledSearchFocusVersionRef.current = focusRequestVersion;
        }
        if (decision.kind === "selection") {
          handledSelectionFocusVersionRef.current =
            selectionFocusRequestVersion;
        }
        handledLayoutRequestIdentityRef.current = layoutRequestIdentity;
      },
    });
    return () => cancelFitViewFrame(fitViewFrameRef);
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
  useEffect(() => {
    const changeDocumentFn = (_type: string, data: unknown) => {
      const nextDocument = data
        ? toAjsDocument(data as UnitListDocumentDto)
        : undefined;
      setAjsDocument(() => nextDocument);
      setCurrentUnitId(() =>
        resolveNextCurrentUnitId(nextDocument, prevUnitEntityId.current),
      );
    };
    window.EventBridge.addCallback("changeDocument", changeDocumentFn);
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
