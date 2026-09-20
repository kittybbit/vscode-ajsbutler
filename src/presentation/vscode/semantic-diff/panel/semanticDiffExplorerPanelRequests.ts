import type * as vscode from "vscode";
import {
  createSemanticDiffExplorerActionResultMessage,
  createSemanticDiffExplorerFailureMessage,
  createSemanticDiffExplorerSessionMessage,
  createSemanticDiffExplorerError,
  parseSemanticDiffExplorerRequest,
  validateSemanticDiffExplorerMessage,
  type SemanticDiffExplorerHostMessage,
  type SemanticDiffExplorerRequest,
} from "../../../../application/semantic-diff/semanticDiffExplorerMessages";
import { parseViewerRequest } from "../../../webview/viewerRequestMessages";
import { postResourceMessage } from "../../webview/messageHandlers";
import type {
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerSession,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import { processSemanticDiffExplorerAction } from "./semanticDiffExplorerPanelActions";

type PanelRequestOptions = Readonly<{
  panel: vscode.WebviewPanel;
  session: SemanticDiffExplorerSession;
  actionIds: SemanticDiffExplorerActionLookup;
  isDisposed: () => boolean;
  disposeEpoch: () => number;
  latestRequestId: () => number;
  setLatestRequestId: (requestId: number) => void;
  post(
    message: SemanticDiffExplorerHostMessage,
    expectedEpoch: number,
  ): Promise<void>;
  actionOptions: Parameters<typeof processSemanticDiffExplorerAction>[2];
}>;

const processCommonResourceRequest = (
  value: unknown,
  options: PanelRequestOptions,
): boolean => {
  const request = parseViewerRequest(value);
  if (request?.type !== "resource") return false;
  postResourceMessage(request.data, options.panel);
  return true;
};

const postUnknownCalendarAction = (
  request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> =>
  options.post(
    createSemanticDiffExplorerFailureMessage(
      options.session.sessionId,
      request.requestId,
      request.actionId,
      createSemanticDiffExplorerError("unknown-action"),
    ),
    epoch,
  );

const postCalendarActionOutputFailure = (
  request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> =>
  options.post(
    createSemanticDiffExplorerActionResultMessage(
      options.session.sessionId,
      request.requestId,
      request.actionId,
      null,
      createSemanticDiffExplorerError("output-failed"),
    ),
    epoch,
  );

const postCalendarActionCompleted = (
  request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> =>
  options.post(
    createSemanticDiffExplorerActionResultMessage(
      options.session.sessionId,
      request.requestId,
      request.actionId,
      {
        kind: "output",
        status: "completed",
        side: null,
        targetId: null,
      },
    ),
    epoch,
  );

const processCalendarAction = async (
  request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> => {
  const { actionOptions } = options;
  const calendarActionId = actionOptions.calendarActionId;
  if (calendarActionId === undefined || request.actionId !== calendarActionId) {
    return;
  }
  const outcome = openCalendarAction(request, options);
  await calendarActionResponses[outcome](request, epoch, options);
};

const calendarActionResponses: Readonly<
  Record<
    "completed" | "unknown" | "failed",
    (
      request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
      epoch: number,
      options: PanelRequestOptions,
    ) => Promise<void>
  >
> = {
  completed: postCalendarActionCompleted,
  unknown: postUnknownCalendarAction,
  failed: postCalendarActionOutputFailure,
};

const openCalendarAction = (
  request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
  options: PanelRequestOptions,
): "completed" | "unknown" | "failed" => {
  const { actionOptions } = options;
  const sidecar = actionOptions.deps.scheduleImpactSidecarRegistry?.resolve(
    actionOptions.context,
  );
  if (!sidecar || !actionOptions.openScheduleImpactCalendarPanel)
    return "unknown";
  return invokeCalendarAction(options, sidecar);
};

const invokeCalendarAction = (
  options: PanelRequestOptions,
  sidecar: NonNullable<
    ReturnType<
      NonNullable<
        PanelRequestOptions["actionOptions"]["deps"]["scheduleImpactSidecarRegistry"]
      >["resolve"]
    >
  >,
): "completed" | "failed" => {
  try {
    options.actionOptions.openScheduleImpactCalendarPanel!({
      parentSessionId: options.session.sessionId,
      context: options.actionOptions.context,
      sidecar,
      displayLanguage: options.session.displayLanguage,
    });
    return "completed";
  } catch {
    return "failed";
  }
};

const invalidRequestMessage = (
  value: unknown,
  options: PanelRequestOptions,
): SemanticDiffExplorerHostMessage => {
  const validation = validateSemanticDiffExplorerMessage(value, {
    expectedSessionId: options.session.sessionId,
    actionIds: options.actionIds,
    minimumRequestId: options.latestRequestId(),
  });
  const errorCode = "code" in validation ? validation.code : "invalid-request";
  return createSemanticDiffExplorerFailureMessage(
    null,
    null,
    null,
    createSemanticDiffExplorerError(errorCode),
  );
};

const parseRequest = (
  value: unknown,
  options: PanelRequestOptions,
): SemanticDiffExplorerRequest | undefined => {
  const validation = validateSemanticDiffExplorerMessage(value, {
    expectedSessionId: options.session.sessionId,
    actionIds: options.actionIds,
    minimumRequestId: options.latestRequestId(),
  });
  return "code" in validation
    ? undefined
    : parseSemanticDiffExplorerRequest(value, {
        expectedSessionId: options.session.sessionId,
        actionIds: options.actionIds,
        minimumRequestId: options.latestRequestId(),
      });
};

const processReadyRequest = async (
  request: Extract<SemanticDiffExplorerRequest, { type: "ready" | "refresh" }>,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> =>
  options.post(
    createSemanticDiffExplorerSessionMessage(
      options.session.sessionId,
      options.session.viewModel,
    ),
    epoch,
  );

const processRequest = async (
  request: SemanticDiffExplorerRequest,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> => {
  if (request.type === "ready" || request.type === "refresh") {
    await processReadyRequest(request, epoch, options);
    return;
  }
  await processActionRequest(request, epoch, options);
};

const processActionRequest = async (
  request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
  epoch: number,
  options: PanelRequestOptions,
): Promise<void> => {
  if (options.actionOptions.calendarActionId === request.actionId) {
    await processCalendarAction(request, epoch, options);
    return;
  }
  await processSemanticDiffExplorerAction(
    request,
    epoch,
    options.actionOptions,
  );
};

export const handleSemanticDiffExplorerRequest = async (
  value: unknown,
  options: PanelRequestOptions,
): Promise<void> => {
  if (options.isDisposed()) return;
  await processIncomingRequest(value, options);
};

const processIncomingRequest = async (
  value: unknown,
  options: PanelRequestOptions,
): Promise<void> => {
  if (processCommonResourceRequest(value, options)) return;
  const request = parseRequest(value, options);
  if (request === undefined) {
    await postInvalidRequest(value, options);
    return;
  }
  options.setLatestRequestId(request.requestId);
  await processRequest(request, options.disposeEpoch(), options);
};

const postInvalidRequest = (
  value: unknown,
  options: PanelRequestOptions,
): Promise<void> =>
  options.post(invalidRequestMessage(value, options), options.disposeEpoch());
