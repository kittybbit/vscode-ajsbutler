import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
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

type UseFlowScopeResetParams = {
  documentIdentity?: object;
  currentUnitId?: string;
  resetScope: () => void;
};

export const useFlowScopeReset = ({
  documentIdentity,
  currentUnitId,
  resetScope,
}: UseFlowScopeResetParams) => {
  useEffect(() => {
    resetScope();
  }, [documentIdentity, currentUnitId, resetScope]);
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

type FlowViewerOverflowElements = {
  body: HTMLElement;
  bodyOverflow: string;
  documentElement: HTMLElement;
  documentElementOverflow: string;
  root: HTMLElement | null;
  rootHeight: string;
  rootOverflow: string;
};

const getFlowViewerOverflowElements = (): FlowViewerOverflowElements => {
  const root = document.getElementById("root");
  return {
    body: document.body,
    bodyOverflow: document.body.style.overflow,
    documentElement: document.documentElement,
    documentElementOverflow: document.documentElement.style.overflow,
    root,
    rootHeight: root?.style.height ?? "",
    rootOverflow: root?.style.overflow ?? "",
  };
};

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
  bodyOverflow,
  documentElement,
  documentElementOverflow,
  root,
  rootHeight,
  rootOverflow,
}: FlowViewerOverflowElements) => {
  documentElement.style.overflow = documentElementOverflow;
  body.style.overflow = bodyOverflow;
  if (root) {
    root.style.overflow = rootOverflow;
    root.style.height = rootHeight;
  }
};

export const useFlowViewerOverflow = () => {
  useEffect(() => {
    const elements = getFlowViewerOverflowElements();
    applyFlowViewerOverflow(elements);
    return () => resetFlowViewerOverflow(elements);
  }, []);
};
