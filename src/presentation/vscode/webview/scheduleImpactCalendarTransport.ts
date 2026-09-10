import type { SemanticDiffScheduleImpact } from "../../../application/semantic-diff/semanticDiffScheduleImpact";

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

const isJsonValue = (
  value: unknown,
  ancestors = new Set<object>(),
): boolean => {
  if (value === null) return true;
  switch (typeof value) {
    case "string":
    case "boolean":
      return true;
    case "number":
      return Number.isFinite(value);
    case "undefined":
    case "function":
    case "symbol":
    case "bigint":
      return false;
    case "object":
      break;
    default:
      return false;
  }

  if (ancestors.has(value)) return false;
  ancestors.add(value);
  try {
    if (Object.prototype.hasOwnProperty.call(value, "toJSON")) return false;
    if (Array.isArray(value)) {
      if (Object.getOwnPropertySymbols(value).length > 0) return false;
      for (let index = 0; index < value.length; index += 1) {
        if (!Object.prototype.hasOwnProperty.call(value, index)) return false;
        if (!isJsonValue(value[index], ancestors)) return false;
      }
      return Object.keys(value).every((key) => {
        const index = Number(key);
        return (
          Number.isSafeInteger(index) &&
          index >= 0 &&
          String(index) === key &&
          index < value.length
        );
      });
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) return false;
    if (Object.getOwnPropertySymbols(value).length > 0) return false;
    return Object.keys(value).every((key) =>
      isJsonValue(value[key], ancestors),
    );
  } catch {
    return false;
  } finally {
    ancestors.delete(value);
  }
};

const messageSizeError = (
  value: unknown,
  options: ScheduleImpactCalendarValidationOptions | undefined,
): ScheduleImpactCalendarErrorCode | undefined => {
  if (!isJsonValue(value)) return "invalid-request";
  try {
    const encodedBytes = new TextEncoder().encode(
      JSON.stringify(value),
    ).byteLength;
    return encodedBytes >
      (options?.maxBytes ?? SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES)
      ? "payload-too-large"
      : undefined;
  } catch {
    return undefined;
  }
};

const matchesRequestOptions = (
  sessionId: string,
  requestId: number,
  options: ScheduleImpactCalendarValidationOptions | undefined,
): ScheduleImpactCalendarErrorCode | undefined => {
  if (
    options?.expectedSessionId !== undefined &&
    sessionId !== options.expectedSessionId
  ) {
    return "unknown-session";
  }
  if (
    options?.minimumRequestId !== undefined &&
    requestId <= options.minimumRequestId
  ) {
    return "stale-request";
  }
  return undefined;
};

const validateRequest = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarRequest> => {
  const sizeError = messageSizeError(value, options);
  if (sizeError) return { ok: false, code: sizeError };
  if (
    !isPlainRecord(value) ||
    !ownKeys(value, ["type", "sessionId", "requestId"])
  ) {
    return { ok: false, code: "invalid-request" };
  }
  if (
    (value.type !== "ready" && value.type !== "refresh") ||
    !isSessionId(value.sessionId) ||
    !isRequestId(value.requestId)
  ) {
    return { ok: false, code: "invalid-request" };
  }
  const optionError = matchesRequestOptions(
    value.sessionId,
    value.requestId,
    options,
  );
  if (optionError) return { ok: false, code: optionError };
  return {
    ok: true,
    value: {
      type: value.type,
      sessionId: value.sessionId,
      requestId: value.requestId,
    },
  };
};

const validateError = (
  value: unknown,
): value is ScheduleImpactCalendarError => {
  if (!isPlainRecord(value) || !ownKeys(value, ["code", "detail"]))
    return false;
  if (
    value.code !== "invalid-request" &&
    value.code !== "unknown-session" &&
    value.code !== "stale-request" &&
    value.code !== "disposed-session" &&
    value.code !== "payload-too-large" &&
    value.code !== "host-disposed"
  ) {
    return false;
  }
  if (value.detail === null) return true;
  return (
    isPlainRecord(value.detail) &&
    ownKeys(value.detail, ["side", "targetId"]) &&
    (value.detail.side === null ||
      value.detail.side === "before" ||
      value.detail.side === "after") &&
    (value.detail.targetId === null ||
      typeof value.detail.targetId === "string")
  );
};

const validateHostMessage = (
  value: unknown,
  options?: ScheduleImpactCalendarValidationOptions,
): ScheduleImpactCalendarValidationResult<ScheduleImpactCalendarHostMessage> => {
  const sizeError = messageSizeError(value, options);
  if (sizeError) return { ok: false, code: sizeError };
  if (
    !isPlainRecord(value) ||
    !ownKeys(value, [
      "type",
      "sessionId",
      "requestId",
      "ok",
      "payload",
      "error",
    ])
  ) {
    return { ok: false, code: "invalid-request" };
  }
  if (value.type === "close") {
    if (
      !isSessionId(value.sessionId) ||
      value.requestId !== null ||
      value.ok !== true ||
      value.payload !== null ||
      value.error !== null
    )
      return { ok: false, code: "invalid-request" };
    if (
      options?.expectedSessionId !== undefined &&
      value.sessionId !== options.expectedSessionId
    ) {
      return { ok: false, code: "unknown-session" };
    }
    return { ok: true, value: value as ScheduleImpactCalendarCloseMessage };
  }
  if (value.type === "session") {
    if (
      !isSessionId(value.sessionId) ||
      !isRequestId(value.requestId) ||
      value.ok !== true ||
      value.error !== null ||
      !isPlainRecord(value.payload) ||
      !isJsonValue(value.payload)
    )
      return { ok: false, code: "invalid-request" };
    const optionError = matchesRequestOptions(
      value.sessionId,
      value.requestId,
      options,
    );
    if (optionError) return { ok: false, code: optionError };
    return { ok: true, value: value as ScheduleImpactCalendarSessionMessage };
  }
  if (value.type === "failure") {
    if (
      (value.sessionId !== null && !isSessionId(value.sessionId)) ||
      (value.requestId !== null && !isRequestId(value.requestId)) ||
      value.ok !== false ||
      value.payload !== null ||
      !validateError(value.error)
    )
      return { ok: false, code: "invalid-request" };
    if (
      value.sessionId !== null &&
      options?.expectedSessionId !== undefined &&
      value.sessionId !== options.expectedSessionId
    ) {
      return { ok: false, code: "unknown-session" };
    }
    const failureRequestId = value.requestId;
    if (
      isRequestId(failureRequestId) &&
      options?.minimumRequestId !== undefined &&
      failureRequestId <= options.minimumRequestId
    )
      return { ok: false, code: "stale-request" };
    return { ok: true, value: value as ScheduleImpactCalendarFailureMessage };
  }
  return { ok: false, code: "invalid-request" };
};

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
