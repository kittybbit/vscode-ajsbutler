import type { ParseAjsResult } from "../parsing/AjsParserPort";
import {
  SemanticDiffSourceIndexRegistry,
  type AjsParserWithSourceIndexPort,
  type SemanticDiffCaptureScopeId,
  type SemanticDiffSourceIndex,
} from "../parsing/AjsParserWithSourceIndexPort";
import type { SemanticDiffOutputContext } from "./semanticDiffDto";
import type {
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
  SemanticDiffSourceCaptureBinding,
  SemanticDiffSourceCaptureErrorCode,
  SemanticDiffSourceCaptureInput,
} from "./semanticDiffSourceCapture";
import { SemanticDiffSourceCaptureRegistry } from "./semanticDiffSourceCaptureRegistry";
import {
  freezeCaptureInput,
  isValidCaptureInput,
} from "./semanticDiffSourceCaptureGuards";
import {
  bindFailure,
  createScopeParser,
} from "./semanticDiffSourceCaptureParsing";

type CaptureState = "collecting" | "bound" | "registered" | "released";
type CaptureErrorFactory = (code: SemanticDiffSourceCaptureErrorCode) => Error;

export type CaptureSession = {
  input?: SemanticDiffSourceCaptureInput;
  state: CaptureState;
  parseOrdinal: number;
  beforeResult?: ParseAjsResult;
  afterResult?: ParseAjsResult;
  beforeIndex?: SemanticDiffSourceIndex;
  afterIndex?: SemanticDiffSourceIndex;
  activeBinding?: SemanticDiffSourceCaptureBinding;
  indexRegistry: SemanticDiffSourceIndexRegistry;
};

const createBinding = (
  context: SemanticDiffOutputContext,
  session: CaptureSession,
): SemanticDiffSourceCaptureBinding =>
  Object.freeze({
    ok: true,
    context,
    before: Object.freeze({
      sourceIndex: session.beforeIndex!,
      sourceHandleId: session.input!.before.sourceHandleId,
    }),
    after: Object.freeze({
      sourceIndex: session.afterIndex!,
      sourceHandleId: session.input!.after.sourceHandleId,
    }),
  });

const releaseSession = (
  session: CaptureSession,
  registry: SemanticDiffSourceCaptureRegistry,
): void => {
  if (session.state === "released") return;
  session.state = "released";
  session.beforeResult = undefined;
  session.afterResult = undefined;
  session.beforeIndex = undefined;
  session.afterIndex = undefined;
  session.input = undefined;
  session.indexRegistry.clear();
  if (session.activeBinding !== undefined) {
    registry.remove(session.activeBinding);
    session.activeBinding = undefined;
  }
};

type CaptureScopeOptions = {
  input: SemanticDiffSourceCaptureInput;
  enrichedParser: AjsParserWithSourceIndexPort;
  scopeId: SemanticDiffCaptureScopeId;
  registry: SemanticDiffSourceCaptureRegistry;
  createError: CaptureErrorFactory;
};

const createScopeBinder =
  (
    session: CaptureSession,
    scopeId: SemanticDiffCaptureScopeId,
    registry: SemanticDiffSourceCaptureRegistry,
  ): ((
    context: SemanticDiffOutputContext,
  ) => SemanticDiffSourceCaptureBindResult) =>
  (context) =>
    bindScope({ session, context, scopeId, registry });

type BindScopeOptions = {
  session: CaptureSession;
  context: SemanticDiffOutputContext;
  scopeId: SemanticDiffCaptureScopeId;
  registry: SemanticDiffSourceCaptureRegistry;
};

const bindScope = (
  options: BindScopeOptions,
): SemanticDiffSourceCaptureBindResult => {
  const { session, context, scopeId, registry } = options;
  const failure = bindFailure(session);
  if (failure !== undefined) return { ok: false, code: failure };
  session.state = "bound";
  const binding = createBinding(context, session);
  session.activeBinding = binding;
  registry.add({
    binding,
    scopeId,
    indexRegistry: session.indexRegistry,
    activate: () => setRegisteredState(session),
    isActive: () => session.state !== "released",
  });
  return binding;
};

const setRegisteredState = (session: CaptureSession): void => {
  if (session.state === "bound") session.state = "registered";
};

export const createSemanticDiffSourceCaptureScope = (
  options: CaptureScopeOptions,
): SemanticDiffSourceCapture => {
  if (!isValidCaptureInput(options.input)) {
    throw new TypeError("Malformed semantic diff source descriptor.");
  }
  const session: CaptureSession = {
    input: freezeCaptureInput(options.input),
    state: "collecting",
    parseOrdinal: 0,
    indexRegistry: new SemanticDiffSourceIndexRegistry(),
  };
  const parser = createScopeParser(
    session,
    options.enrichedParser,
    options.createError,
  );
  const bind = createScopeBinder(session, options.scopeId, options.registry);
  const release = (): void => releaseSession(session, options.registry);
  return Object.freeze({ parser, bind, release });
};
