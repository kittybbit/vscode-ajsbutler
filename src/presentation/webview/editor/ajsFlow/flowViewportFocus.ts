export type FlowViewportFocusRequest = {
  targetUnitId?: string;
  version: number;
};

export type FlowViewportFocusDecision = {
  kind: "search" | "selection" | "layout";
  targetUnitId?: string;
};

type TargetFocusKind = Exclude<FlowViewportFocusDecision["kind"], "layout">;

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
  decision.kind !== "layout" && decision.targetUnitId
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

type TargetRequestParams = {
  handledVersion: number;
  kind: TargetFocusKind;
  renderedUnitIds: ReadonlySet<string>;
  request: FlowViewportFocusRequest;
};

const hasUnhandledFocusRequest = (
  request: FlowViewportFocusRequest,
  handledVersion: number,
): boolean => request.version > handledVersion;

const resolveRenderedTargetDecision = (
  kind: TargetFocusKind,
  targetUnitId: string,
  renderedUnitIds: ReadonlySet<string>,
): FlowViewportFocusDecision | null =>
  renderedUnitIds.has(targetUnitId) ? { kind, targetUnitId } : null;

const resolveTargetRequest = ({
  kind,
  request,
  handledVersion,
  renderedUnitIds,
}: TargetRequestParams): FlowViewportFocusDecision | null | undefined => {
  if (!hasUnhandledFocusRequest(request, handledVersion)) {
    return undefined;
  }
  if (!request.targetUnitId) {
    return undefined;
  }
  return resolveRenderedTargetDecision(
    kind,
    request.targetUnitId,
    renderedUnitIds,
  );
};

const firstTargetDecision = (
  decisions: ReadonlyArray<FlowViewportFocusDecision | null | undefined>,
): FlowViewportFocusDecision | null | undefined =>
  decisions.find((decision) => decision !== undefined);

const resolveLayoutFocusDecision = (
  layoutChanged: boolean,
): FlowViewportFocusDecision | undefined =>
  layoutChanged ? { kind: "layout" } : undefined;

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
  const targetDecision = firstTargetDecision([
    resolveTargetRequest({
      kind: "search",
      request: searchRequest,
      handledVersion: handledSearchVersion,
      renderedUnitIds,
    }),
    resolveTargetRequest({
      kind: "selection",
      request: selectionRequest,
      handledVersion: handledSelectionVersion,
      renderedUnitIds,
    }),
  ]);
  return targetDecision !== undefined
    ? targetDecision
    : resolveLayoutFocusDecision(layoutChanged);
};
