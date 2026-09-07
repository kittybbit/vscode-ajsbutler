import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerActionAvailability,
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerCard,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerTreeNode,
  SemanticDiffExplorerViewModel,
} from "./semanticDiffExplorerDto";
import type { SemanticDiffSide } from "./semanticDiffDto";
import { isSemanticDiffExplorerError } from "./semanticDiffExplorerRecordGuards";

export const SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES = 8 * 1024 * 1024;

export type SemanticDiffExplorerErrorCode =
  | "invalid-request"
  | "unknown-session"
  | "unknown-action"
  | "stale-request"
  | "superseded-session"
  | "disposed-session"
  | "record-not-found"
  | "unavailable-target"
  | "stale-source"
  | "source-lookup-failed"
  | "flow-not-ready"
  | "flow-target-missing"
  | "output-failed"
  | "payload-too-large"
  | "host-disposed";

export type ErrorCode = SemanticDiffExplorerErrorCode;

export type SemanticDiffExplorerErrorDetail = Readonly<{
  side: SemanticDiffSide | null;
  targetId: string | null;
}>;

export type ExplorerError = Readonly<{
  code: SemanticDiffExplorerErrorCode;
  detail: SemanticDiffExplorerErrorDetail | null;
}>;

export type SemanticDiffExplorerActionOutcome = Readonly<{
  kind: "source" | "flow" | "output";
  status: "completed" | "unavailable";
  side: SemanticDiffSide | null;
  targetId: string | null;
}>;

export type SemanticDiffExplorerReadyRequest = Readonly<{
  type: "ready";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: null;
}>;

export type SemanticDiffExplorerRefreshRequest = Readonly<{
  type: "refresh";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: null;
}>;

export type SemanticDiffExplorerActionRequest = Readonly<{
  type: "action";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: SemanticDiffExplorerActionId;
}>;

export type SemanticDiffExplorerRequest =
  | SemanticDiffExplorerReadyRequest
  | SemanticDiffExplorerRefreshRequest
  | SemanticDiffExplorerActionRequest;

export type SemanticDiffExplorerReadyReply = Readonly<{
  type: "ready" | "refreshed";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: null;
  ok: boolean;
  payload: SemanticDiffExplorerViewModel | null;
  error: ExplorerError | null;
}>;

export type SemanticDiffExplorerActionReply = Readonly<{
  type: "action";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: SemanticDiffExplorerActionId;
  ok: boolean;
  payload: SemanticDiffExplorerActionOutcome | null;
  error: ExplorerError | null;
}>;

export type SemanticDiffExplorerReply =
  | SemanticDiffExplorerReadyReply
  | SemanticDiffExplorerActionReply;

export type SemanticDiffExplorerSessionMessage = Readonly<{
  type: "session";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: null;
  actionId: null;
  ok: true;
  payload: SemanticDiffExplorerViewModel;
  error: null;
}>;

export type SemanticDiffExplorerActionResultMessage = Readonly<{
  type: "action-result";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: SemanticDiffExplorerActionId;
  ok: boolean;
  payload: SemanticDiffExplorerActionOutcome | null;
  error: ExplorerError | null;
}>;

export type SemanticDiffExplorerFailureMessage = Readonly<{
  type: "failure";
  sessionId: SemanticDiffExplorerSessionId | null;
  requestId: number | null;
  actionId: SemanticDiffExplorerActionId | null;
  ok: false;
  payload: null;
  error: ExplorerError;
}>;

export type SemanticDiffExplorerCloseMessage = Readonly<{
  type: "close";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: null;
  actionId: null;
  ok: true;
  payload: null;
  error: null;
}>;

export type SemanticDiffExplorerHostMessage =
  | SemanticDiffExplorerSessionMessage
  | SemanticDiffExplorerActionResultMessage
  | SemanticDiffExplorerFailureMessage
  | SemanticDiffExplorerCloseMessage;

export type SemanticDiffExplorerMessage =
  | SemanticDiffExplorerRequest
  | SemanticDiffExplorerReply
  | SemanticDiffExplorerHostMessage;

export type SemanticDiffExplorerMessageValidationOptions = Readonly<{
  expectedSessionId?: SemanticDiffExplorerSessionId;
  actionIds?:
    | SemanticDiffExplorerActionLookup
    | ReadonlySet<SemanticDiffExplorerActionId>;
  minimumRequestId?: number;
  maxBytes?: number;
}>;

export type SemanticDiffExplorerMessageValidationResult =
  | Readonly<{ ok: true; value: SemanticDiffExplorerMessage }>
  | Readonly<{
      ok: false;
      code:
        | "invalid-request"
        | "unknown-session"
        | "unknown-action"
        | "stale-request"
        | "payload-too-large";
    }>;

export {
  isSemanticDiffExplorerViewModel,
} from "./semanticDiffExplorerViewGuards";
export {
  parseSemanticDiffExplorerHostMessage,
  parseSemanticDiffExplorerReply,
  parseSemanticDiffExplorerRequest,
} from "./semanticDiffExplorerMessageParsers";
export {
  serializeSemanticDiffExplorerMessage,
  validateSemanticDiffExplorerMessage,
  isSemanticDiffExplorerMessage,
} from "./semanticDiffExplorerMessageValidation";

const assertResponsePayload = (
  payload: object | null,
  error: ExplorerError | null,
): void => {
  if ((payload === null) === (error === null)) {
    throw new TypeError(
      "Explorer response payload and error must use complementary nullability.",
    );
  }
};

export const createSemanticDiffExplorerError = (
  code: SemanticDiffExplorerErrorCode,
  detail: SemanticDiffExplorerErrorDetail | null = null,
): ExplorerError => {
  const error = { code, detail };
  if (!isSemanticDiffExplorerError(error)) {
    throw new TypeError("Unknown or malformed Explorer error.");
  }
  return error;
};

export const createSemanticDiffExplorerReadyRequest = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
): SemanticDiffExplorerReadyRequest => ({
  type: "ready",
  sessionId,
  requestId,
  actionId: null,
});

export const createSemanticDiffExplorerRefreshRequest = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
): SemanticDiffExplorerRefreshRequest => ({
  type: "refresh",
  sessionId,
  requestId,
  actionId: null,
});

export const createSemanticDiffExplorerActionRequest = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
  actionId: SemanticDiffExplorerActionId,
): SemanticDiffExplorerActionRequest => ({
  type: "action",
  sessionId,
  requestId,
  actionId,
});

type ActionOutcomeArgs = [
  SemanticDiffExplorerActionOutcome["kind"],
  SemanticDiffExplorerActionOutcome["status"],
  (SemanticDiffSide | null)?,
  (string | null)?,
];

export const createSemanticDiffExplorerActionOutcome = (
  ...args: ActionOutcomeArgs
): SemanticDiffExplorerActionOutcome => {
  const [kind, status, side = null, targetId = null] = args;
  return { kind, status, side, targetId };
};

type ReadyReplyArgs = [
  SemanticDiffExplorerSessionId,
  number,
  SemanticDiffExplorerViewModel | null,
  (ExplorerError | null)?,
];

const createReadyReply = (
  type: "ready" | "refreshed",
  ...args: ReadyReplyArgs
): SemanticDiffExplorerReadyReply => {
  const [sessionId, requestId, payload, error = null] = args;
  assertResponsePayload(payload, error);
  return {
    type,
    sessionId,
    requestId,
    actionId: null,
    ok: error === null && payload !== null,
    payload,
    error,
  };
};

export const createSemanticDiffExplorerReadyReply = (
  ...args: ReadyReplyArgs
): SemanticDiffExplorerReadyReply => createReadyReply("ready", ...args);

export const createSemanticDiffExplorerRefreshReply = (
  ...args: ReadyReplyArgs
): SemanticDiffExplorerReadyReply => createReadyReply("refreshed", ...args);

type ActionReplyArgs = [
  SemanticDiffExplorerSessionId,
  number,
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerActionOutcome | null,
  (ExplorerError | null)?,
];

const createActionReply = (
  type: "action" | "action-result",
  ...args: ActionReplyArgs
): SemanticDiffExplorerActionReply | SemanticDiffExplorerActionResultMessage => {
  const [sessionId, requestId, actionId, payload, error = null] = args;
  assertResponsePayload(payload, error);
  return {
    type,
    sessionId,
    requestId,
    actionId,
    ok: error === null && payload !== null,
    payload,
    error,
  };
};

export const createSemanticDiffExplorerActionReply = (
  ...args: ActionReplyArgs
): SemanticDiffExplorerActionReply =>
  createActionReply("action", ...args) as SemanticDiffExplorerActionReply;

export const createSemanticDiffExplorerSessionMessage = (
  sessionId: SemanticDiffExplorerSessionId,
  payload: SemanticDiffExplorerViewModel,
): SemanticDiffExplorerSessionMessage => ({
  type: "session",
  sessionId,
  requestId: null,
  actionId: null,
  ok: true,
  payload,
  error: null,
});

export const createSemanticDiffExplorerActionResultMessage = (
  ...args: ActionReplyArgs
): SemanticDiffExplorerActionResultMessage =>
  createActionReply("action-result", ...args) as SemanticDiffExplorerActionResultMessage;

type FailureArgs = [
  SemanticDiffExplorerSessionId | null,
  number | null,
  SemanticDiffExplorerActionId | null,
  ExplorerError,
];

export const createSemanticDiffExplorerFailureMessage = (
  ...args: FailureArgs
): SemanticDiffExplorerFailureMessage => {
  const [sessionId, requestId, actionId, error] = args;
  return {
    type: "failure",
    sessionId,
    requestId,
    actionId,
    ok: false,
    payload: null,
    error,
  };
};

export const createSemanticDiffExplorerCloseMessage = (
  sessionId: SemanticDiffExplorerSessionId,
): SemanticDiffExplorerCloseMessage => ({
  type: "close",
  sessionId,
  requestId: null,
  actionId: null,
  ok: true,
  payload: null,
  error: null,
});

export type {
  SemanticDiffExplorerActionAvailability,
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerCard,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerTreeNode,
  SemanticDiffExplorerViewModel,
};
