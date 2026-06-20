export type FlowViewportFocusRequest = {
  targetUnitId?: string;
  version: number;
};

export type FlowViewportFocusDecision = {
  kind: "search" | "selection" | "layout";
  targetUnitId?: string;
};

type FlowNodeBounds = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type FlowNodeCenter = {
  x: number;
  y: number;
};

export type FlowViewportFocusAction =
  | { kind: "fitView"; targetUnitId?: string }
  | { kind: "setCenter"; targetUnitId: string };

export const resolveFlowNodeCenter = ({
  height,
  width,
  x,
  y,
}: FlowNodeBounds): FlowNodeCenter => ({
  x: x + width / 2,
  y: y + height / 2,
});

export const resolveFlowViewportFocusAction = (
  decision: FlowViewportFocusDecision,
): FlowViewportFocusAction =>
  decision.kind === "selection" && decision.targetUnitId
    ? { kind: "setCenter", targetUnitId: decision.targetUnitId }
    : { kind: "fitView", targetUnitId: decision.targetUnitId };

type ResolveFlowViewportFocusDecisionParams = {
  renderedUnitIds: ReadonlySet<string>;
  searchRequest: FlowViewportFocusRequest;
  handledSearchVersion: number;
  selectionRequest: FlowViewportFocusRequest;
  handledSelectionVersion: number;
  layoutChanged: boolean;
};

const resolveTargetRequest = (
  kind: "search" | "selection",
  request: FlowViewportFocusRequest,
  handledVersion: number,
  renderedUnitIds: ReadonlySet<string>,
): FlowViewportFocusDecision | null | undefined => {
  if (request.version <= handledVersion) {
    return undefined;
  }
  if (!request.targetUnitId) {
    return undefined;
  }
  return renderedUnitIds.has(request.targetUnitId)
    ? { kind, targetUnitId: request.targetUnitId }
    : null;
};

export const resolveFlowViewportFocusDecision = ({
  renderedUnitIds,
  searchRequest,
  handledSearchVersion,
  selectionRequest,
  handledSelectionVersion,
  layoutChanged,
}: ResolveFlowViewportFocusDecisionParams):
  | FlowViewportFocusDecision
  | null
  | undefined => {
  const searchDecision = resolveTargetRequest(
    "search",
    searchRequest,
    handledSearchVersion,
    renderedUnitIds,
  );
  if (searchDecision !== undefined) {
    return searchDecision;
  }

  const selectionDecision = resolveTargetRequest(
    "selection",
    selectionRequest,
    handledSelectionVersion,
    renderedUnitIds,
  );
  if (selectionDecision !== undefined) {
    return selectionDecision;
  }

  return layoutChanged ? { kind: "layout" } : undefined;
};
