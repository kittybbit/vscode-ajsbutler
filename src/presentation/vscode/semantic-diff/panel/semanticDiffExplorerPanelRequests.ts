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
  if (!request || request.type !== "resource") return false;
  if (!options.isDisposed()) postResourceMessage(request.data, options.panel);
  return true;
};

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
  const sidecar = actionOptions.deps.scheduleImpactSidecarRegistry?.resolve(
    actionOptions.context,
  );
  if (!sidecar || !actionOptions.openScheduleImpactCalendarPanel) {
    await options.post(
      createSemanticDiffExplorerFailureMessage(
        options.session.sessionId,
        request.requestId,
        request.actionId,
        createSemanticDiffExplorerError("unknown-action"),
      ),
      epoch,
    );
    return;
  }
  try {
    actionOptions.openScheduleImpactCalendarPanel({
      parentSessionId: options.session.sessionId,
      context: actionOptions.context,
      sidecar,
      displayLanguage: options.session.displayLanguage,
    });
    await options.post(
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
  } catch {
    await options.post(
      createSemanticDiffExplorerActionResultMessage(
        options.session.sessionId,
        request.requestId,
        request.actionId,
        null,
        createSemanticDiffExplorerError("output-failed"),
      ),
      epoch,
    );
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
  } else {
    const isCalendarAction =
      options.actionOptions.calendarActionId === request.actionId;
    if (isCalendarAction) {
      await processCalendarAction(request, epoch, options);
      return;
    }
    await processSemanticDiffExplorerAction(
      request,
      epoch,
      options.actionOptions,
    );
  }
};

export const handleSemanticDiffExplorerRequest = async (
  value: unknown,
  options: PanelRequestOptions,
): Promise<void> => {
  if (options.isDisposed()) return;
  if (processCommonResourceRequest(value, options)) return;
  const request = parseRequest(value, options);
  if (request === undefined) {
    await options.post(
      invalidRequestMessage(value, options),
      options.disposeEpoch(),
    );
    return;
  }
  options.setLatestRequestId(request.requestId);
  await processRequest(request, options.disposeEpoch(), options);
};
