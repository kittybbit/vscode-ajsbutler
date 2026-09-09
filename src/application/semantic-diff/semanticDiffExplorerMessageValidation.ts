import type {
  ExplorerError,
  SemanticDiffExplorerMessage,
  SemanticDiffExplorerMessageValidationOptions,
  SemanticDiffExplorerMessageValidationResult,
} from "./semanticDiffExplorerMessages";
import {
  isSemanticDiffExplorerActionId,
  isSemanticDiffExplorerSessionId,
} from "./semanticDiffExplorerDto";
import {
  asPlainRecord,
  isFinitePositiveInteger,
  isJsonValue,
} from "./semanticDiffExplorerMessagePrimitives";
import {
  parseSemanticDiffExplorerHostMessage,
  parseSemanticDiffExplorerReply,
  parseSemanticDiffExplorerRequest,
} from "./semanticDiffExplorerMessageParsers";

type ValidationCode =
  | "invalid-request"
  | "unknown-session"
  | "unknown-action"
  | "stale-request"
  | "payload-too-large";

const invalid = (
  code: ValidationCode,
): SemanticDiffExplorerMessageValidationResult => ({ ok: false, code });

const jsonByteLength = (value: unknown): number | null => {
  if (!isJsonValue(value)) return null;
  try {
    return new TextEncoder().encode(JSON.stringify(value)).byteLength;
  } catch {
    return null;
  }
};

const sessionMismatch = (
  record: Record<string, unknown>,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  isSemanticDiffExplorerSessionId(record.sessionId) &&
  options.expectedSessionId !== undefined &&
  record.sessionId !== options.expectedSessionId;

const actionMismatch = (
  record: Record<string, unknown>,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  isSemanticDiffExplorerActionId(record.actionId) &&
  options.actionIds !== undefined &&
  !options.actionIds.has(record.actionId);

const staleRequest = (
  record: Record<string, unknown>,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  isFinitePositiveInteger(record.requestId) &&
  options.minimumRequestId !== undefined &&
  record.requestId <= options.minimumRequestId;

const validationFallback = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): ValidationCode => {
  const record = asPlainRecord(value);
  if (record === null) return "invalid-request";
  const checks: ReadonlyArray<readonly [boolean, ValidationCode]> = [
    [sessionMismatch(record, options), "unknown-session"],
    [actionMismatch(record, options), "unknown-action"],
    [staleRequest(record, options), "stale-request"],
  ];
  return checks.find(([matches]) => matches)?.[1] ?? "invalid-request";
};

const parseMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): SemanticDiffExplorerMessage | undefined =>
  parseSemanticDiffExplorerRequest(value, options) ??
  parseSemanticDiffExplorerReply(value, options) ??
  parseSemanticDiffExplorerHostMessage(value, options);

const validateByteLimit = (
  value: unknown,
  maxBytes: number,
): SemanticDiffExplorerMessageValidationResult | null => {
  const bytes = jsonByteLength(value);
  if (bytes === null) return invalid("invalid-request");
  return bytes > maxBytes ? invalid("payload-too-large") : null;
};

export const validateSemanticDiffExplorerMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
  maxBytes = options.maxBytes ?? 8 * 1024 * 1024,
): SemanticDiffExplorerMessageValidationResult => {
  const byteError = validateByteLimit(value, maxBytes);
  if (byteError !== null) return byteError;
  const parsed = parseMessage(value, options);
  return parsed === undefined
    ? invalid(validationFallback(value, options))
    : { ok: true, value: parsed };
};

export const isSemanticDiffExplorerMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): value is SemanticDiffExplorerMessage =>
  validateSemanticDiffExplorerMessage(value, options).ok;

export const serializeSemanticDiffExplorerMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): Readonly<
  | {
      ok: true;
      value: SemanticDiffExplorerMessage;
      json: string;
      bytes: number;
    }
  | { ok: false; error: ExplorerError }
> => {
  const validation = validateSemanticDiffExplorerMessage(value, options);
  if ("code" in validation) {
    return { ok: false, error: { code: validation.code, detail: null } };
  }
  const json = JSON.stringify(validation.value);
  const bytes = new TextEncoder().encode(json).byteLength;
  return { ok: true, value: validation.value, json, bytes };
};
