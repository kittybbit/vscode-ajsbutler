import type { AjsParserPort } from "../parsing/AjsParserPort";
import {
  type AjsParserWithSourceIndexPort,
  type SemanticDiffCaptureScopeIdAllocator,
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
import { SemanticDiffSourceCaptureRegistry } from "./semanticDiffSourceCaptureRegistry";
import { createSemanticDiffSourceCaptureScope } from "./semanticDiffSourceCaptureScope";

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

const bindingRegistry = new SemanticDiffSourceCaptureRegistry();

export const registerSemanticDiffSourceCaptureScope = (
  binding: SemanticDiffSourceCaptureBinding,
): void => bindingRegistry.activate(binding);

export const isSemanticDiffSourceCaptureBindingActive = (
  binding: SemanticDiffSourceCaptureBinding,
): boolean => bindingRegistry.isActive(binding);

export const lookupSemanticDiffSourceCaptureBinding = (
  binding: SemanticDiffSourceCaptureBinding,
  side: SemanticDiffSide,
  request: unknown,
): SemanticDiffSourceLookupResult =>
  bindingRegistry.lookup(binding, side, request);

export const createBeginSemanticDiffSourceCapture =
  (
    enrichedParser: AjsParserWithSourceIndexPort,
    scopeIdAllocator: SemanticDiffCaptureScopeIdAllocator,
  ): SemanticDiffSourceCaptureFactory =>
  (input) =>
    createCapture(input, enrichedParser, scopeIdAllocator());

/**
 * Injectable application entry point. Production composition uses
 * createBeginSemanticDiffSourceCapture so infrastructure never crosses this
 * boundary. Both the enriched parser and capture-scope allocator are
 * required dependencies; callers must provide them explicitly.
 */
export const beginSemanticDiffSourceCapture = (
  input: SemanticDiffSourceCaptureInput,
  enrichedParser: AjsParserWithSourceIndexPort,
  scopeIdAllocator: SemanticDiffCaptureScopeIdAllocator,
): SemanticDiffSourceCapture => {
  return createCapture(input, enrichedParser, scopeIdAllocator());
};

const createCapture = (
  input: SemanticDiffSourceCaptureInput,
  enrichedParser: AjsParserWithSourceIndexPort,
  scopeId: SemanticDiffCaptureScopeId,
): SemanticDiffSourceCapture =>
  createSemanticDiffSourceCaptureScope({
    input,
    enrichedParser,
    scopeId,
    registry: bindingRegistry,
    createError: (code) => new SemanticDiffSourceCaptureError(code),
  });

export const isSemanticDiffSourceCaptureError = (
  error: unknown,
): error is SemanticDiffSourceCaptureError =>
  error instanceof SemanticDiffSourceCaptureError;

export type SemanticDiffSourceCaptureBinding = Extract<
  SemanticDiffSourceCaptureBindResult,
  { ok: true }
>;

export type { SemanticDiffSourceLookupRequest };
