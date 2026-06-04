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
} from "../../../domain/models/ajs/AjsDocument";
import { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import { toAjsDocument } from "../../../application/unit-list/unitListDocumentView";
import { REVEAL_UNIT } from "../../../shared/webviewEvents";
import { getRevealUnitAbsolutePath } from "../revealUnit";

type UseFlowViewerFitViewParams = {
  edges: Edge[];
  nodes: Node[];
  reactFlowInstanceRef: MutableRefObject<ReactFlowInstance<Node, Edge> | null>;
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
}: UseFlowViewerFitViewParams): boolean =>
  !!reactFlowInstanceRef.current && nodes.length > 0;

const cancelFitViewFrame = (fitViewFrameRef: FitViewFrameRef) => {
  if (fitViewFrameRef.current) {
    window.cancelAnimationFrame(fitViewFrameRef.current);
    fitViewFrameRef.current = undefined;
  }
};

const scheduleFitViewFrame = (
  fitViewFrameRef: FitViewFrameRef,
  reactFlowInstanceRef: MutableRefObject<ReactFlowInstance<Node, Edge> | null>,
) => {
  cancelFitViewFrame(fitViewFrameRef);
  fitViewFrameRef.current = window.requestAnimationFrame(() => {
    void reactFlowInstanceRef.current?.fitView({ padding: 0.22 });
    fitViewFrameRef.current = undefined;
  });
};

export const useFlowViewerFitView = ({
  edges,
  nodes,
  reactFlowInstanceRef,
}: UseFlowViewerFitViewParams) => {
  const fitViewFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!hasFitViewTarget({ edges, nodes, reactFlowInstanceRef })) {
      return undefined;
    }

    scheduleFitViewFrame(fitViewFrameRef, reactFlowInstanceRef);
    return () => cancelFitViewFrame(fitViewFrameRef);
  }, [edges, nodes, reactFlowInstanceRef]);
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
