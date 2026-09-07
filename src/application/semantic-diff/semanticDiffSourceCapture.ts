import type { AjsParserPort, ParseAjsResult } from "../parsing/AjsParserPort";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  isSemanticDiffSourceHandleId,
  SemanticDiffSourceIndexRegistry,
  type AjsParserWithSourceIndexPort,
  type SemanticDiffCaptureScopeId,
  type SemanticDiffSourceHandleId,
  type SemanticDiffSourceIndex,
  type SemanticDiffSourceLookupRequest,
  type SemanticDiffSourceLookupResult,
} from "../parsing/AjsParserWithSourceIndexPort";
import type {
  SemanticDiffOutputContext,
  SemanticDiffSide,
} from "./semanticDiffDto";

export type ImmutableSourceDescriptor = Readonly<{
  side: SemanticDiffSide;
  sourceHandleId: SemanticDiffSourceHandleId;
  text: string;
  version: number | null;
}>;

export type SemanticDiffSourceCaptureInput = Readonly<{
  before: ImmutableSourceDescriptor;
  after: ImmutableSourceDescriptor;
}>;

export type SemanticDiffSourceCaptureBindResult =
  | Readonly<{
      ok: true;
      context: SemanticDiffOutputContext;
      before: Readonly<{
        sourceIndex: SemanticDiffSourceIndex;
        sourceHandleId: SemanticDiffSourceHandleId;
      }>;
      after: Readonly<{
        sourceIndex: SemanticDiffSourceIndex;
        sourceHandleId: SemanticDiffSourceHandleId;
      }>;
    }>
  | Readonly<{
      ok: false;
      code:
        | "capture-parser-failed"
        | "capture-incomplete"
        | "capture-already-bound"
        | "capture-released";
    }>;

export type SemanticDiffSourceCaptureErrorCode =
  | "capture-order-invalid"
  | "capture-input-mismatch"
  | "capture-extra-parse"
  | "capture-released";

export class SemanticDiffSourceCaptureError extends Error {
  public readonly code: SemanticDiffSourceCaptureErrorCode;

  public constructor(code: SemanticDiffSourceCaptureErrorCode) {
    super(code);
    this.name = "SemanticDiffSourceCaptureError";
    this.code = code;
  }
}

export type SemanticDiffSourceCapture = Readonly<{
  parser: AjsParserPort;
  bind(context: SemanticDiffOutputContext): SemanticDiffSourceCaptureBindResult;
  release(): void;
}>;

export type SemanticDiffSourceCaptureFactory = (
  input: SemanticDiffSourceCaptureInput,
) => SemanticDiffSourceCapture;

type CaptureState = "collecting" | "bound" | "registered" | "released";

const scopeIds = createSemanticDiffCaptureScopeIdAllocator();
const bindingRegistrations = new WeakMap<object, () => void>();
const bindingActivity = new WeakMap<object, () => boolean>();
const bindingScopeIds = new WeakMap<object, SemanticDiffCaptureScopeId>();
const bindingIndexRegistries = new WeakMap<
  object,
  SemanticDiffSourceIndexRegistry
>();

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactKeys = (
  value: unknown,
  keys: readonly string[],
): value is Record<string, unknown> =>
  isPlainRecord(value) &&
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));

const descriptorIsValid = (
  descriptor: unknown,
  expectedSide: SemanticDiffSide,
): descriptor is ImmutableSourceDescriptor =>
  hasExactKeys(descriptor, ["side", "sourceHandleId", "text", "version"]) &&
  descriptor.side === expectedSide &&
  isSemanticDiffSourceHandleId(descriptor.sourceHandleId) &&
  typeof descriptor.text === "string" &&
  (descriptor.version === null ||
    (typeof descriptor.version === "number" &&
      Number.isSafeInteger(descriptor.version) &&
      descriptor.version >= 0));

const inputIsValid = (
  input: unknown,
): input is SemanticDiffSourceCaptureInput =>
  hasExactKeys(input, ["before", "after"]) &&
  descriptorIsValid(input.before, "before") &&
  descriptorIsValid(input.after, "after");

const sameContent = (
  content: string,
  descriptor: ImmutableSourceDescriptor,
): boolean => content === descriptor.text;

const createCapture = (
  input: SemanticDiffSourceCaptureInput,
  enrichedParser: AjsParserWithSourceIndexPort,
  scopeId: SemanticDiffCaptureScopeId,
): SemanticDiffSourceCapture => {
  if (!inputIsValid(input)) {
    throw new TypeError("Malformed semantic diff source descriptor.");
  }

  let capturedInput: SemanticDiffSourceCaptureInput | undefined = Object.freeze(
    {
      before: Object.freeze({ ...input.before }),
      after: Object.freeze({ ...input.after }),
    },
  );

  let state: CaptureState = "collecting";
  let parseOrdinal = 0;
  let beforeResult: ParseAjsResult | undefined;
  let afterResult: ParseAjsResult | undefined;
  let beforeIndex: SemanticDiffSourceIndex | undefined;
  let afterIndex: SemanticDiffSourceIndex | undefined;
  const indexRegistry = new SemanticDiffSourceIndexRegistry();
  let activeBinding: SemanticDiffSourceCaptureBinding | undefined;

  const parse = (content: string): ParseAjsResult => {
    if (state === "released") {
      throw new SemanticDiffSourceCaptureError("capture-released");
    }
    const sourceInput = capturedInput;
    if (sourceInput === undefined) {
      throw new SemanticDiffSourceCaptureError("capture-released");
    }
    if (parseOrdinal >= 2) {
      throw new SemanticDiffSourceCaptureError("capture-extra-parse");
    }

    const expected =
      parseOrdinal === 0 ? sourceInput.before : sourceInput.after;
    const opposite =
      parseOrdinal === 0 ? sourceInput.after : sourceInput.before;
    if (!sameContent(content, expected)) {
      throw new SemanticDiffSourceCaptureError(
        sameContent(content, opposite) &&
        sourceInput.before.text !== sourceInput.after.text
          ? "capture-order-invalid"
          : "capture-input-mismatch",
      );
    }

    const result = enrichedParser.parseWithSourceIndex(content);
    parseOrdinal += 1;
    if (parseOrdinal === 1) {
      beforeResult = result;
      if (result.ok) {
        try {
          indexRegistry.register(result.sourceIndex);
          beforeIndex = indexRegistry.get(result.sourceIndex.sourceIndexId);
        } catch {
          beforeIndex = undefined;
        }
      }
    } else {
      afterResult = result;
      if (result.ok) {
        try {
          indexRegistry.register(result.sourceIndex);
          afterIndex = indexRegistry.get(result.sourceIndex.sourceIndexId);
        } catch {
          afterIndex = undefined;
        }
      }
    }
    return result.ok === true
      ? { ok: true, document: result.document }
      : { ok: false, errors: result.errors };
  };

  const bind = (
    context: SemanticDiffOutputContext,
  ): SemanticDiffSourceCaptureBindResult => {
    if (state === "released") return { ok: false, code: "capture-released" };
    if (state === "bound" || state === "registered") {
      return { ok: false, code: "capture-already-bound" };
    }
    if (beforeResult === undefined || afterResult === undefined) {
      return { ok: false, code: "capture-incomplete" };
    }
    if (beforeResult.ok === false || afterResult.ok === false) {
      return { ok: false, code: "capture-parser-failed" };
    }
    if (
      beforeIndex === undefined ||
      afterIndex === undefined ||
      indexRegistry.get(beforeIndex.sourceIndexId) !== beforeIndex ||
      indexRegistry.get(afterIndex.sourceIndexId) !== afterIndex
    ) {
      return { ok: false, code: "capture-incomplete" };
    }
    const sourceInput = capturedInput;
    if (sourceInput === undefined) {
      return { ok: false, code: "capture-released" };
    }

    state = "bound";
    const binding: SemanticDiffSourceCaptureBinding = Object.freeze({
      ok: true,
      context,
      before: Object.freeze({
        sourceIndex: beforeIndex,
        sourceHandleId: sourceInput.before.sourceHandleId,
      }),
      after: Object.freeze({
        sourceIndex: afterIndex,
        sourceHandleId: sourceInput.after.sourceHandleId,
      }),
    });
    activeBinding = binding;
    bindingScopeIds.set(binding, scopeId);
    bindingIndexRegistries.set(binding, indexRegistry);
    bindingRegistrations.set(binding, () => {
      if (state === "bound") state = "registered";
    });
    bindingActivity.set(binding, () => state !== "released");
    return binding;
  };

  const release = (): void => {
    if (state === "released") return;
    state = "released";
    beforeResult = undefined;
    afterResult = undefined;
    beforeIndex = undefined;
    afterIndex = undefined;
    capturedInput = undefined;
    indexRegistry.clear();
    if (activeBinding !== undefined) {
      bindingIndexRegistries.delete(activeBinding);
      activeBinding = undefined;
    }
  };

  const parser: AjsParserPort = { parse };
  const capture = Object.freeze({ parser, bind, release });
  return capture;
};

export const registerSemanticDiffSourceCaptureScope = (
  binding: SemanticDiffSourceCaptureBinding,
): void => {
  if (bindingScopeIds.has(binding)) bindingRegistrations.get(binding)?.();
};

export const isSemanticDiffSourceCaptureBindingActive = (
  binding: SemanticDiffSourceCaptureBinding,
): boolean => bindingActivity.get(binding)?.() === true;

/**
 * Resolves only through the capture scope that owns the bound index. A source
 * action cannot substitute an index from another scope or a released scope.
 */
export const lookupSemanticDiffSourceCaptureBinding = (
  binding: SemanticDiffSourceCaptureBinding,
  side: SemanticDiffSide,
  request: unknown,
): SemanticDiffSourceLookupResult => {
  if (!isSemanticDiffSourceCaptureBindingActive(binding)) {
    return { code: "expired-source-index" };
  }
  if (side !== "before" && side !== "after") {
    return { code: "expired-source-index" };
  }
  const expected = binding[side].sourceIndex.sourceIndexId;
  if (!isPlainRecord(request) || request.sourceIndexId !== expected) {
    return { code: "expired-source-index" };
  }
  return (
    bindingIndexRegistries
      .get(binding)
      ?.lookup(request as SemanticDiffSourceLookupRequest) ?? {
      code: "expired-source-index",
    }
  );
};

export const createBeginSemanticDiffSourceCapture =
  (
    enrichedParser: AjsParserWithSourceIndexPort,
  ): SemanticDiffSourceCaptureFactory =>
  (input) =>
    createCapture(input, enrichedParser, scopeIds());

/**
 * Injectable application entry point. Production composition uses
 * createBeginSemanticDiffSourceCapture so infrastructure never crosses this
 * boundary; the optional parser is useful for pure contract tests.
 */
export const beginSemanticDiffSourceCapture = (
  input: SemanticDiffSourceCaptureInput,
  enrichedParser?: AjsParserWithSourceIndexPort,
): SemanticDiffSourceCapture => {
  if (enrichedParser === undefined) {
    throw new TypeError("An enriched parser is required to begin capture.");
  }
  return createCapture(input, enrichedParser, scopeIds());
};

export const isSemanticDiffSourceCaptureError = (
  error: unknown,
): error is SemanticDiffSourceCaptureError =>
  error instanceof SemanticDiffSourceCaptureError;

export type SemanticDiffSourceCaptureBinding = Extract<
  SemanticDiffSourceCaptureBindResult,
  { ok: true }
>;
