import type { SemanticDiffScheduleImpact } from "../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  allChecksPass,
  encodedScheduleImpactCalendarJsonBytes,
  isScheduleImpactCalendarJsonValue,
} from "./scheduleImpactCalendarJson";

export const SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES = 8 * 1024 * 1024;

export type ScheduleImpactCalendarSessionId = string & {
  readonly __scheduleImpactCalendarSessionId: unique symbol;
};

export type ScheduleImpactCalendarRequest = Readonly<{
  type: "ready" | "refresh";
  sessionId: ScheduleImpactCalendarSessionId;
  requestId: number;
}>;

export type ScheduleImpactCalendarErrorCode =
  | "invalid-request"
  | "unknown-session"
  | "stale-request"
  | "disposed-session"
  | "payload-too-large"
  | "host-disposed";

export type ScheduleImpactCalendarErrorDetail = Readonly<{
  side: "before" | "after" | null;
  targetId: string | null;
}>;

export type ScheduleImpactCalendarError = Readonly<{
  code: ScheduleImpactCalendarErrorCode;
  detail: ScheduleImpactCalendarErrorDetail | null;
}>;

export type ScheduleImpactCalendarSessionMessage = Readonly<{
  type: "session";
  sessionId: ScheduleImpactCalendarSessionId;
  requestId: number;
  ok: true;
  payload: SemanticDiffScheduleImpact;
  error: null;
}>;

export type ScheduleImpactCalendarFailureMessage = Readonly<{
  type: "failure";
  sessionId: ScheduleImpactCalendarSessionId | null;
  requestId: number | null;
  ok: false;
  payload: null;
  error: ScheduleImpactCalendarError;
}>;

export type ScheduleImpactCalendarCloseMessage = Readonly<{
  type: "close";
  sessionId: ScheduleImpactCalendarSessionId;
  requestId: null;
  ok: true;
  payload: null;
  error: null;
}>;

export type ScheduleImpactCalendarHostMessage =
  | ScheduleImpactCalendarSessionMessage
  | ScheduleImpactCalendarFailureMessage
  | ScheduleImpactCalendarCloseMessage;

export type ScheduleImpactCalendarMessage =
  | ScheduleImpactCalendarRequest
  | ScheduleImpactCalendarHostMessage;

export type ScheduleImpactCalendarValidationOptions = Readonly<{
  expectedSessionId?: string;
  minimumRequestId?: number;
  maxBytes?: number;
}>;

export type ScheduleImpactCalendarValidationResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; code: ScheduleImpactCalendarErrorCode }>;

const ownKeys = (value: Record<string, unknown>, keys: readonly string[]) => {
  const expected = new Set(keys);
  const actual = Object.keys(value);
  return (
    actual.length === expected.size && actual.every((key) => expected.has(key))
  );
};

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

const isSessionId = (
  value: unknown,
): value is ScheduleImpactCalendarSessionId =>
  typeof value === "string" && value.length > 0;

const isRequestId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

const messageSizeError = (
  value: unknown,
  options: ScheduleImpactCalendarValidationOptions | undefined,
): ScheduleImpactCalendarErrorCode | undefined => {
  const validJson = isScheduleImpactCalendarJsonValue(value);
  if (!validJson) return "invalid-request";
  const bytes = encodedScheduleImpactCalendarJsonBytes(value);
  const maxBytes =
    options?.maxBytes ?? SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES;
  const sizeErrors: readonly [undefined, ScheduleImpactCalendarErrorCode] = [
    undefined,
    "payload-too-large",
  ];
  return sizeErrors[Number(bytes !== undefined && bytes > maxBytes)];
};

const matchesSession = (
  sessionId: string,
  expectedSessionId: string | undefined,
): ScheduleImpactCalendarErrorCode | undefined =>
  expectedSessionId !== undefined && sessionId !== expectedSessionId
    ? "unknown-session"
    : undefined;

const matchesRequestId = (
  requestId: number,
  minimumRequestId: number | undefined,
): ScheduleImpactCalendarErrorCode | undefined =>
  minimumRequestId !== undefined && requestId <= minimumRequestId
    ? "stale-request"
    : undefined;

const matchesRequestOptions = (
  sessionId: string,
  requestId: number,
  options: ScheduleImpactCalendarValidationOptions | undefined,
): ScheduleImpactCalendarErrorCode | undefined =>
  matchesSession(sessionId, options?.expectedSessionId) ??
  matchesRequestId(requestId, options?.minimumRequestId);

const invalidResult = <T>(
  code: ScheduleImpactCalendarErrorCode = "invalid-request",
): ScheduleImpactCalendarValidationResult<T> => ({ ok: false, code });

const validResult = <T>(
  value: T,
): ScheduleImpactCalendarValidationResult<T> => ({ ok: true, value });

const resultFromError = <T>(
  error: ScheduleImpactCalendarErrorCode | undefined,
  value: T,
): ScheduleImpactCalendarValidationResult<T> =>
  error ? invalidResult(error) : validResult(value);

const withMessageSize = <T>(
  value: unknown,
  options: ScheduleImpactCalendarValidationOptions | undefined,
  validate: () => ScheduleImpactCalendarValidationResult<T>,
): ScheduleImpactCalendarValidationResult<T> => {
  const sizeError = messageSizeError(value, options);
  return sizeError ? invalidResult(sizeError) : validate();
};

const isRequestType = (value: unknown): value is "ready" | "refresh" =>
  value === "ready" || value === "refresh";

const requestEnvelope = (
  value: unknown,
): Record<string, unknown> | undefined =>
  isPlainRecord(value) && ownKeys(value, ["type", "sessionId", "requestId"])
    ? value
    : undefined;

const hasRequestFields = (value: Record<string, unknown>): boolean =>
  allChecksPass([
    () => isRequestType(value.type),
    () => isSessionId(value.sessionId),
    () => isRequestId(value.requestId),
  ]);

const validateRequestShape = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarRequest> => {
  const envelope = requestEnvelope(value);
  return envelope && hasRequestFields(envelope)
    ? resultFromError<ScheduleImpactCalendarRequest>(
        matchesRequestOptions(
          envelope.sessionId as string,
          envelope.requestId as number,
          options,
        ),
        {
          type: envelope.type as "ready" | "refresh",
          sessionId: envelope.sessionId as ScheduleImpactCalendarSessionId,
          requestId: envelope.requestId as number,
        },
      )
    : invalidResult();
};

const validateRequest = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarRequest> =>
  withMessageSize(value, options, () => validateRequestShape(value, options));

const errorCodes = new Set<ScheduleImpactCalendarErrorCode>([
  "invalid-request",
  "unknown-session",
  "stale-request",
  "disposed-session",
  "payload-too-large",
  "host-disposed",
]);

const errorDetailSides = new Set([null, "before", "after"]);

const isErrorDetailTarget = (value: unknown): boolean =>
  value === null || typeof value === "string";

const isErrorDetail = (value: unknown): boolean => {
  if (value === null) return true;
  if (!isPlainRecord(value)) return false;
  return allChecksPass([
    () => ownKeys(value, ["side", "targetId"]),
    () => errorDetailSides.has(value.side as string | null),
    () => isErrorDetailTarget(value.targetId),
  ]);
};

const validateError = (value: unknown): value is ScheduleImpactCalendarError =>
  isPlainRecord(value) &&
  ownKeys(value, ["code", "detail"]) &&
  errorCodes.has(value.code as ScheduleImpactCalendarErrorCode) &&
  isErrorDetail(value.detail);

const hostEnvelope = (value: unknown): Record<string, unknown> | undefined =>
  isPlainRecord(value) &&
  ownKeys(value, ["type", "sessionId", "requestId", "ok", "payload", "error"])
    ? value
    : undefined;

const hasCloseFields = (value: Record<string, unknown>): boolean =>
  allChecksPass([
    () => isSessionId(value.sessionId),
    () => value.requestId === null,
    () => value.ok === true,
    () => value.payload === null,
    () => value.error === null,
  ]);

const validateClose = (
  value: Record<string, unknown>,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarCloseMessage> => {
  if (!hasCloseFields(value)) return invalidResult();
  const sessionError = matchesSession(
    value.sessionId as string,
    options?.expectedSessionId,
  );
  return resultFromError(
    sessionError,
    value as ScheduleImpactCalendarCloseMessage,
  );
};

const hasSessionFields = (value: Record<string, unknown>): boolean =>
  allChecksPass([
    () => isSessionId(value.sessionId),
    () => isRequestId(value.requestId),
    () => value.ok === true,
    () => value.error === null,
    () => isPlainRecord(value.payload),
    () => isScheduleImpactCalendarJsonValue(value.payload),
  ]);

const validateSession = (
  value: Record<string, unknown>,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarSessionMessage> => {
  if (!hasSessionFields(value)) return invalidResult();
  const optionError = matchesRequestOptions(
    value.sessionId as string,
    value.requestId as number,
    options,
  );
  return resultFromError(
    optionError,
    value as ScheduleImpactCalendarSessionMessage,
  );
};

const hasFailureFields = (value: Record<string, unknown>): boolean =>
  allChecksPass([
    () => value.sessionId === null || isSessionId(value.sessionId),
    () => value.requestId === null || isRequestId(value.requestId),
    () => value.ok === false,
    () => value.payload === null,
    () => validateError(value.error),
  ]);

const failureSessionError = (
  value: Record<string, unknown>,
  expectedSessionId: string | undefined,
): ScheduleImpactCalendarErrorCode | undefined =>
  value.sessionId === null
    ? undefined
    : matchesSession(value.sessionId as string, expectedSessionId);

const failureRequestError = (
  value: Record<string, unknown>,
  minimumRequestId: number | undefined,
): ScheduleImpactCalendarErrorCode | undefined =>
  value.requestId === null || minimumRequestId === undefined
    ? undefined
    : matchesRequestId(value.requestId as number, minimumRequestId);

const validateFailure = (
  value: Record<string, unknown>,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarFailureMessage> => {
  if (!hasFailureFields(value)) return invalidResult();
  const sessionError = failureSessionError(value, options?.expectedSessionId);
  if (sessionError) return invalidResult(sessionError);
  const requestError = failureRequestError(value, options?.minimumRequestId);
  return resultFromError(
    requestError,
    value as ScheduleImpactCalendarFailureMessage,
  );
};

type HostValidator = (
  value: Record<string, unknown>,
  options?: ScheduleImpactCalendarValidationOptions,
) => ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarHostMessage>;

const hostValidators = new Map<string, HostValidator>([
  ["close", validateClose as HostValidator],
  ["session", validateSession as HostValidator],
  ["failure", validateFailure as HostValidator],
]);

const validateHostShape = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarHostMessage> => {
  const envelope = hostEnvelope(value);
  const validator = envelope && hostValidators.get(String(envelope.type));
  return validator ? validator(envelope, options) : invalidResult();
};

const validateHostMessage = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarHostMessage> =>
  withMessageSize(value, options, () => validateHostShape(value, options));

export const createScheduleImpactCalendarError = (
  code: ScheduleImpactCalendarErrorCode,
  detail: ScheduleImpactCalendarErrorDetail | null = null,
): ScheduleImpactCalendarError => ({ code, detail });

export const createScheduleImpactCalendarReadyRequest = (
  sessionId: ScheduleImpactCalendarSessionId | string,
  requestId: number,
): ScheduleImpactCalendarRequest => ({
  type: "ready",
  sessionId: sessionId as ScheduleImpactCalendarSessionId,
  requestId,
});

export const createScheduleImpactCalendarRefreshRequest = (
  sessionId: ScheduleImpactCalendarSessionId | string,
  requestId: number,
): ScheduleImpactCalendarRequest => ({
  type: "refresh",
  sessionId: sessionId as ScheduleImpactCalendarSessionId,
  requestId,
});

export const createScheduleImpactCalendarSessionMessage = (
  sessionId: ScheduleImpactCalendarSessionId | string,
  requestId: number,
  payload: SemanticDiffScheduleImpact,
): ScheduleImpactCalendarSessionMessage => ({
  type: "session",
  sessionId: sessionId as ScheduleImpactCalendarSessionId,
  requestId,
  ok: true,
  payload,
  error: null,
});

export const createScheduleImpactCalendarFailureMessage = (
  sessionId: ScheduleImpactCalendarSessionId | string | null,
  requestId: number | null,
  error: ScheduleImpactCalendarError,
): ScheduleImpactCalendarFailureMessage => ({
  type: "failure",
  sessionId: sessionId as ScheduleImpactCalendarSessionId | null,
  requestId,
  ok: false,
  payload: null,
  error,
});

export const createScheduleImpactCalendarCloseMessage = (
  sessionId: ScheduleImpactCalendarSessionId | string,
): ScheduleImpactCalendarCloseMessage => ({
  type: "close",
  sessionId: sessionId as ScheduleImpactCalendarSessionId,
  requestId: null,
  ok: true,
  payload: null,
  error: null,
});

export const parseScheduleImpactCalendarRequest = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarRequest | undefined => {
  const result = validateRequest(value, options);
  return result.ok ? result.value : undefined;
};

export const parseScheduleImpactCalendarHostMessage = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarHostMessage | undefined => {
  const result = validateHostMessage(value, options);
  return result.ok ? result.value : undefined;
};

export const validateScheduleImpactCalendarMessage = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarMessage> => {
  const isRequestEnvelope =
    isPlainRecord(value) &&
    (value.type === "ready" || value.type === "refresh");
  const request = validateRequest(value, options);
  if (request.ok || isRequestEnvelope) return request;
  return validateHostMessage(
    value,
    options,
  ) as ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarMessage>;
};

export const isScheduleImpactCalendarMessage = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): value is ScheduleImpactCalendarMessage =>
  validateScheduleImpactCalendarMessage(value, options).ok;

export type SerializedScheduleImpactCalendarMessage =
  | Readonly<{
      ok: true;
      value: ScheduleImpactCalendarMessage;
      json: string;
      bytes: number;
    }>
  | Readonly<{
      ok: false;
      error: ScheduleImpactCalendarError;
    }>;

export const serializeScheduleImpactCalendarMessage = (
  value: ScheduleImpactCalendarMessage,
  options?: ScheduleImpactCalendarValidationOptions,
): SerializedScheduleImpactCalendarMessage => {
  const valid = validateScheduleImpactCalendarMessage(value, options);
  if (valid.ok === false) {
    return { ok: false, error: createScheduleImpactCalendarError(valid.code) };
  }
  const json = JSON.stringify(valid.value);
  const bytes = new TextEncoder().encode(json).byteLength;
  if (bytes > SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES) {
    return {
      ok: false,
      error: createScheduleImpactCalendarError("payload-too-large"),
    };
  }
  return { ok: true, value: valid.value, json, bytes };
};
