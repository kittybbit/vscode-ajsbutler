import type { ParseAjsResult, AjsParserPort } from "../parsing/AjsParserPort";
import type {
  AjsParserWithSourceIndexPort,
  SemanticDiffSourceIndex,
} from "../parsing/AjsParserWithSourceIndexPort";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCaptureBindResult,
  SemanticDiffSourceCaptureErrorCode,
} from "./semanticDiffSourceCapture";
import type { CaptureSession } from "./semanticDiffSourceCaptureScope";

type ParseAttempt =
  | { ok: true; descriptor: ImmutableSourceDescriptor }
  | { ok: false; code: SemanticDiffSourceCaptureErrorCode };

const isReleasedSession = (session: CaptureSession): boolean =>
  session.state === "released" || session.input === undefined;

const getExpectedDescriptor = (
  session: CaptureSession,
): ImmutableSourceDescriptor | undefined => {
  if (session.input === undefined) return undefined;
  return session.parseOrdinal === 0
    ? session.input.before
    : session.input.after;
};

const isOppositeContent = (
  session: CaptureSession,
  content: string,
): boolean => {
  const input = session.input!;
  const opposite = session.parseOrdinal === 0 ? input.after : input.before;
  if (content !== opposite.text) return false;
  return input.before.text !== input.after.text;
};

const getContentMismatchCode = (
  session: CaptureSession,
  content: string,
): SemanticDiffSourceCaptureErrorCode | undefined => {
  const expected = getExpectedDescriptor(session)!;
  if (content === expected.text) return undefined;
  return isOppositeContent(session, content)
    ? "capture-order-invalid"
    : "capture-input-mismatch";
};

const parseAttemptError = (
  session: CaptureSession,
  content: string,
): SemanticDiffSourceCaptureErrorCode | undefined => {
  let code: SemanticDiffSourceCaptureErrorCode | undefined;
  if (isReleasedSession(session)) {
    code = "capture-released";
  } else if (session.parseOrdinal >= 2) {
    code = "capture-extra-parse";
  } else {
    code = getContentMismatchCode(session, content);
  }
  return code;
};

export const resolveParseAttempt = (
  session: CaptureSession,
  content: string,
): ParseAttempt => {
  const code = parseAttemptError(session, content);
  const descriptor = getExpectedDescriptor(session);
  return code === undefined
    ? { ok: true, descriptor: descriptor! }
    : { ok: false, code };
};

const toParseResult = (
  result: ReturnType<AjsParserWithSourceIndexPort["parseWithSourceIndex"]>,
): ParseAjsResult =>
  result.ok === true
    ? { ok: true, document: result.document }
    : { ok: false, errors: result.errors };

const retainIndex = (
  result: ReturnType<AjsParserWithSourceIndexPort["parseWithSourceIndex"]>,
  registry: CaptureSession["indexRegistry"],
): SemanticDiffSourceIndex | undefined => {
  if (!result.ok) return undefined;
  try {
    registry.register(result.sourceIndex);
    return registry.get(result.sourceIndex.sourceIndexId);
  } catch {
    return undefined;
  }
};

export const recordParseResult = (
  session: CaptureSession,
  result: ReturnType<AjsParserWithSourceIndexPort["parseWithSourceIndex"]>,
): void => {
  session.parseOrdinal += 1;
  const parsed = toParseResult(result);
  const index = retainIndex(result, session.indexRegistry);
  if (session.parseOrdinal === 1) {
    session.beforeResult = parsed;
    session.beforeIndex = index;
    return;
  }
  session.afterResult = parsed;
  session.afterIndex = index;
};

type BindFailureCode = Extract<
  SemanticDiffSourceCaptureBindResult,
  { ok: false }
>["code"];

const isBindingState = (state: CaptureSession["state"]): boolean =>
  state === "bound" || state === "registered";

const getLifecycleBindFailure = (
  session: CaptureSession,
): BindFailureCode | undefined => {
  if (session.state === "released") return "capture-released";
  if (isBindingState(session.state)) return "capture-already-bound";
  return undefined;
};

const hasBothParseResults = (session: CaptureSession): boolean =>
  session.beforeResult !== undefined && session.afterResult !== undefined;

const hasParserError = (session: CaptureSession): boolean =>
  session.beforeResult?.ok === false || session.afterResult?.ok === false;

const getResultBindFailure = (
  session: CaptureSession,
): BindFailureCode | undefined => {
  if (!hasBothParseResults(session)) return "capture-incomplete";
  return hasParserError(session) ? "capture-parser-failed" : undefined;
};

const indexesAreRetained = (session: CaptureSession): boolean =>
  session.beforeIndex !== undefined &&
  session.afterIndex !== undefined &&
  session.indexRegistry.get(session.beforeIndex.sourceIndexId) ===
    session.beforeIndex &&
  session.indexRegistry.get(session.afterIndex.sourceIndexId) ===
    session.afterIndex;

const getIndexBindFailure = (
  session: CaptureSession,
): BindFailureCode | undefined => {
  if (session.input === undefined) return "capture-released";
  return indexesAreRetained(session) ? undefined : "capture-incomplete";
};

export const bindFailure = (
  session: CaptureSession,
): BindFailureCode | undefined =>
  getLifecycleBindFailure(session) ??
  getResultBindFailure(session) ??
  getIndexBindFailure(session);

export const createScopeParser = (
  session: CaptureSession,
  enrichedParser: AjsParserWithSourceIndexPort,
  createError: (code: SemanticDiffSourceCaptureErrorCode) => Error,
): AjsParserPort => ({
  parse: (content) => {
    const attempt = resolveParseAttempt(session, content);
    if (attempt.ok === false) throw createError(attempt.code);
    const result = enrichedParser.parseWithSourceIndex(content);
    recordParseResult(session, result);
    return toParseResult(result);
  },
});
