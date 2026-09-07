import type {
  SemanticDiffExplorerHostMessage,
  SemanticDiffExplorerMessageValidationOptions,
  SemanticDiffExplorerReply,
  SemanticDiffExplorerRequest,
} from "./semanticDiffExplorerMessages";
import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerSessionId,
} from "./semanticDiffExplorerDto";
import type {
  ExplorerError,
  SemanticDiffExplorerActionOutcome,
  SemanticDiffExplorerActionReply,
  SemanticDiffExplorerReadyReply,
} from "./semanticDiffExplorerMessages";
import {
  isSemanticDiffExplorerActionId,
  isSemanticDiffExplorerSessionId,
} from "./semanticDiffExplorerDto";
import {
  asPlainRecord,
  hasExactKeys,
  isFinitePositiveInteger,
  isJsonValue,
} from "./semanticDiffExplorerMessagePrimitives";
import {
  isSemanticDiffExplorerActionOutcome,
  isSemanticDiffExplorerError,
} from "./semanticDiffExplorerRecordGuards";
import { isSemanticDiffExplorerViewModel } from "./semanticDiffExplorerViewGuards";

type MessageRecord = Record<string, unknown>;
const all = (checks: readonly boolean[]): boolean => checks.every(Boolean);

const messageKeys = ["type", "sessionId", "requestId", "actionId"];
const responseKeys = [
  "type",
  "sessionId",
  "requestId",
  "actionId",
  "ok",
  "payload",
  "error",
];

const asJsonRecord = (value: unknown): MessageRecord | null => {
  const record = asPlainRecord(value);
  return record !== null && isJsonValue(record) ? record : null;
};

const sessionMatches = (
  sessionId: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): sessionId is SemanticDiffExplorerSessionId => {
  if (!isSemanticDiffExplorerSessionId(sessionId)) return false;
  return (
    options.expectedSessionId === undefined ||
    sessionId === options.expectedSessionId
  );
};

const actionMatches = (
  actionId: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): actionId is SemanticDiffExplorerActionId => {
  if (!isSemanticDiffExplorerActionId(actionId)) return false;
  return options.actionIds === undefined || options.actionIds.has(actionId);
};

const isFreshRequestId = (
  requestId: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): requestId is number => {
  if (!isFinitePositiveInteger(requestId)) return false;
  return (
    options.minimumRequestId === undefined ||
    requestId > options.minimumRequestId
  );
};

const isRequestEnvelope = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): record is MessageRecord & {
  type: string;
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
} => hasExactKeys(record, messageKeys) && isRequestIdentity(record, options);

const isRequestIdentity = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  typeof record.type === "string" &&
  sessionMatches(record.sessionId, options) &&
  isFreshRequestId(record.requestId, options);

const requestForType = (
  record: MessageRecord & {
    type: string;
    sessionId: SemanticDiffExplorerSessionId;
    requestId: number;
  },
  options: SemanticDiffExplorerMessageValidationOptions,
): SemanticDiffExplorerRequest | undefined => {
  const shared = { sessionId: record.sessionId, requestId: record.requestId };
  if (isReadyRequest(record)) return buildReadyRequest(record, shared);
  return isActionRequest(record, options)
    ? buildActionRequest(record, shared)
    : undefined;
};

const isReadyRequest = (record: MessageRecord): boolean =>
  (record.type === "ready" || record.type === "refresh") &&
  record.actionId === null;

const buildReadyRequest = (
  record: MessageRecord,
  shared: { sessionId: SemanticDiffExplorerSessionId; requestId: number },
): SemanticDiffExplorerRequest => ({
  ...shared,
  type: record.type as "ready" | "refresh",
  actionId: null,
});

const isActionRequest = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  record.type === "action" && actionMatches(record.actionId, options);

const buildActionRequest = (
  record: MessageRecord,
  shared: { sessionId: SemanticDiffExplorerSessionId; requestId: number },
): SemanticDiffExplorerRequest => ({
  ...shared,
  type: "action",
  actionId: record.actionId as SemanticDiffExplorerActionId,
});

export const parseSemanticDiffExplorerRequest = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerRequest | undefined => {
  const record = asJsonRecord(value);
  if (record === null || !isRequestEnvelope(record, options)) return undefined;
  return requestForType(record, options);
};

const isResponseEnvelope = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): record is MessageRecord & {
  type: string;
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  ok: boolean;
} => hasExactKeys(record, responseKeys) && isResponseIdentity(record, options);

const isResponseIdentity = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  typeof record.type === "string" &&
  sessionMatches(record.sessionId, options) &&
  isFreshRequestId(record.requestId, options) &&
  typeof record.ok === "boolean";

type ResponsePair = {
  ok: boolean;
  payload: unknown;
  error: unknown;
  isPayload: (value: unknown) => boolean;
};

const isSuccessfulResponse = ({
  payload,
  error,
  isPayload,
}: ResponsePair): boolean =>
  payload !== null && isPayload(payload) && error === null;

const isFailedResponse = ({ payload, error }: ResponsePair): boolean =>
  payload === null && isSemanticDiffExplorerError(error);

const responsePairIsValid = (response: ResponsePair): boolean =>
  response.ok ? isSuccessfulResponse(response) : isFailedResponse(response);

const parseReadyReply = (
  record: MessageRecord & {
    type: string;
    sessionId: SemanticDiffExplorerSessionId;
    requestId: number;
    ok: boolean;
  },
): SemanticDiffExplorerReadyReply | undefined => {
  const isReadyType = record.type === "ready" || record.type === "refreshed";
  const responseIsValid = responsePairIsValid({
    ok: record.ok,
    payload: record.payload,
    error: record.error,
    isPayload: isSemanticDiffExplorerViewModel,
  });
  if (!isReadyType || record.actionId !== null || !responseIsValid) {
    return undefined;
  }
  return {
    type: record.type,
    sessionId: record.sessionId,
    requestId: record.requestId,
    actionId: null,
    ok: record.ok,
    payload: record.payload,
    error: record.error,
  } as SemanticDiffExplorerReadyReply;
};

const parseActionReply = (
  record: MessageRecord & {
    type: string;
    sessionId: SemanticDiffExplorerSessionId;
    requestId: number;
    ok: boolean;
  },
  options: SemanticDiffExplorerMessageValidationOptions,
): SemanticDiffExplorerActionReply | undefined => {
  const isAction =
    record.type === "action" && actionMatches(record.actionId, options);
  const responseIsValid = responsePairIsValid({
    ok: record.ok,
    payload: record.payload,
    error: record.error,
    isPayload: isSemanticDiffExplorerActionOutcome,
  });
  if (!isAction || !responseIsValid) {
    return undefined;
  }
  return {
    type: "action",
    sessionId: record.sessionId,
    requestId: record.requestId,
    actionId: record.actionId as SemanticDiffExplorerActionId,
    ok: record.ok,
    payload: record.payload as SemanticDiffExplorerActionOutcome | null,
    error: record.error as ExplorerError | null,
  };
};

export const parseSemanticDiffExplorerReply = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerReply | undefined => {
  const record = asJsonRecord(value);
  if (record === null || !isResponseEnvelope(record, options)) return undefined;
  return parseReadyReply(record) ?? parseActionReply(record, options);
};

const hostEnvelope = (value: unknown): MessageRecord | null =>
  asJsonRecord(value);

const isSessionMessage = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  hasExactKeys(record, responseKeys) &&
  record.type === "session" &&
  isSessionMessageBody(record, options);

const isSessionMessageBody = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean => {
  const session = sessionMatches(record.sessionId, options);
  const controlFields =
    record.requestId === null && record.actionId === null && record.ok === true;
  return (
    session &&
    controlFields &&
    record.error === null &&
    isSemanticDiffExplorerViewModel(record.payload)
  );
};

const isCloseMessage = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  hasExactKeys(record, responseKeys) &&
  record.type === "close" &&
  isCloseMessageBody(record, options);

const isCloseMessageBody = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean => {
  const session = sessionMatches(record.sessionId, options);
  const controlFields =
    record.requestId === null && record.actionId === null && record.ok === true;
  return (
    session && controlFields && record.payload === null && record.error === null
  );
};

const isFailureMessage = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean => {
  const requestFresh =
    record.requestId === null || isFreshRequestId(record.requestId, options);
  const sessionValid =
    record.sessionId === null || sessionMatches(record.sessionId, options);
  const actionValid =
    record.actionId === null || actionMatches(record.actionId, options);
  const envelope =
    hasExactKeys(record, responseKeys) && record.type === "failure";
  const failure = record.ok === false && record.payload === null;
  return all([
    envelope,
    sessionValid,
    requestFresh,
    actionValid,
    failure,
    isSemanticDiffExplorerError(record.error),
  ]);
};

const isActionResultMessage = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean => {
  const envelope =
    hasExactKeys(record, responseKeys) &&
    isActionResultIdentity(record, options);
  return all([
    envelope,
    responsePairIsValid({
      ok: record.ok as boolean,
      payload: record.payload,
      error: record.error,
      isPayload: isSemanticDiffExplorerActionOutcome,
    }),
  ]);
};

const isActionResultIdentity = (
  record: MessageRecord,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  all([
    record.type === "action-result",
    sessionMatches(record.sessionId, options),
    isFreshRequestId(record.requestId, options),
    actionMatches(record.actionId, options),
    typeof record.ok === "boolean",
  ]);

const buildSessionMessage = (
  record: MessageRecord,
): SemanticDiffExplorerHostMessage => ({
  type: "session",
  sessionId: record.sessionId as SemanticDiffExplorerSessionId,
  requestId: null,
  actionId: null,
  ok: true,
  payload:
    record.payload as import("./semanticDiffExplorerDto").SemanticDiffExplorerViewModel,
  error: null,
});

const buildCloseMessage = (
  record: MessageRecord,
): SemanticDiffExplorerHostMessage => ({
  type: "close",
  sessionId: record.sessionId as SemanticDiffExplorerSessionId,
  requestId: null,
  actionId: null,
  ok: true,
  payload: null,
  error: null,
});

const buildFailureMessage = (
  record: MessageRecord,
): SemanticDiffExplorerHostMessage => ({
  type: "failure",
  sessionId: record.sessionId as SemanticDiffExplorerSessionId | null,
  requestId: record.requestId as number | null,
  actionId: record.actionId as SemanticDiffExplorerActionId | null,
  ok: false,
  payload: null,
  error: record.error as ExplorerError,
});

const buildActionResultMessage = (
  record: MessageRecord,
): SemanticDiffExplorerHostMessage => ({
  type: "action-result",
  sessionId: record.sessionId as SemanticDiffExplorerSessionId,
  requestId: record.requestId as number,
  actionId: record.actionId as SemanticDiffExplorerActionId,
  ok: record.ok as boolean,
  payload: record.payload as SemanticDiffExplorerActionOutcome | null,
  error: record.error as ExplorerError | null,
});

export const parseSemanticDiffExplorerHostMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerHostMessage | undefined => {
  const record = hostEnvelope(value);
  if (record === null) return undefined;
  const builders = [
    [isSessionMessage, buildSessionMessage],
    [isCloseMessage, buildCloseMessage],
    [isFailureMessage, buildFailureMessage],
    [isActionResultMessage, buildActionResultMessage],
  ] as const;
  const match = builders.find(([matches]) => matches(record, options));
  return match === undefined ? undefined : match[1](record);
};
