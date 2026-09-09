import {
  createSemanticDiffExplorerFailureMessage,
  createSemanticDiffExplorerSessionMessage,
  createSemanticDiffExplorerError,
  parseSemanticDiffExplorerRequest,
  validateSemanticDiffExplorerMessage,
  type SemanticDiffExplorerHostMessage,
  type SemanticDiffExplorerRequest,
} from "../../../../application/semantic-diff/semanticDiffExplorerMessages";
import type {
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerSession,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import { processSemanticDiffExplorerAction } from "./semanticDiffExplorerPanelActions";

type PanelRequestOptions = Readonly<{
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
