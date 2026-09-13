import type {
  BuildSemanticDiffPresentationArtifactsResult,
  SemanticDiffPresentationArtifacts,
} from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffSourceCaptureFactory } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/semanticDiffExplorerPanel";
import { readBeforeDefinitionStep } from "./semanticDiffCommandSelection";
import { readSemanticDiffActiveEditor } from "./semanticDiffCommandEditor";
import {
  buildSemanticDiffReportDataStep as buildReportDataStep,
  readSemanticDiffReportInputStep as readReportInputStep,
} from "./semanticDiffCommandBuild";
import {
  failedStep,
  mapCommandStep,
  readyStep,
  continueCommandStep,
  type CommandFailure,
  type CommandReportData,
  type CommandReportRequest,
  type CommandStep,
} from "./semanticDiffCommandSteps";
import type {
  CommandReadyReport,
  SemanticDiffCommandDeps,
} from "./semanticDiffCommand";
import { getSemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import {
  bindAndRegisterExplorerSources,
  cleanupExplorerRequest,
  createSourceCaptureRelease,
  type SourceBindingStep,
} from "./semanticDiffCommandSourceBinding";
import { isSemanticDiffSourceCaptureError } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import { parseFailureMessage } from "./semanticDiffCommandWorkflowInput";

type PresentationSourceDescriptors = NonNullable<
  CommandReportData["sourceDescriptors"]
>;

type PresentationCommandData = CommandReportData & {
  readonly result: CommandReadyReport;
  readonly presentation: SemanticDiffPresentationArtifacts;
};

export type CommandReadyExplorer = Readonly<{
  readonly result: CommandReadyReport;
  readonly context: SemanticDiffOutputContext;
  readonly sourceCaptureRelease?: () => void;
  readonly presentation?: SemanticDiffPresentationArtifacts;
}>;

const beginPresentationSourceCapture = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
):
  | ReturnType<
      NonNullable<SemanticDiffCommandDeps["beginSemanticDiffSourceCapture"]>
    >
  | undefined => {
  if (deps.beginSemanticDiffSourceCapture === undefined) return undefined;
  const descriptors = createPresentationSourceDescriptors(deps, request);
  request.sourceDescriptors = descriptors;
  return deps.beginSemanticDiffSourceCapture(
    createPresentationCaptureInput(descriptors),
  );
};

const createPresentationSourceDescriptors = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): PresentationSourceDescriptors => {
  if (request.beforeUri === undefined || request.afterUri === undefined) {
    throw new Error("Source capture requires source URIs.");
  }
  return {
    before: {
      side: "before",
      sourceHandleId: deps.sourceHandleIdAllocator(),
      text: request.input.beforeContent,
      version: request.beforeVersion,
      uri: request.beforeUri,
    },
    after: {
      side: "after",
      sourceHandleId: deps.sourceHandleIdAllocator(),
      text: request.input.afterContent,
      version: request.afterVersion,
      uri: request.afterUri,
    },
  };
};

const createPresentationCaptureInput = (
  descriptors: PresentationSourceDescriptors,
): Parameters<SemanticDiffSourceCaptureFactory>[0] => ({
  before: {
    side: descriptors.before.side,
    sourceHandleId: descriptors.before.sourceHandleId,
    text: descriptors.before.text,
    version: descriptors.before.version,
  },
  after: {
    side: descriptors.after.side,
    sourceHandleId: descriptors.after.sourceHandleId,
    text: descriptors.after.text,
    version: descriptors.after.version,
  },
});

const presentationArtifactInput = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
) =>
  deps.scheduleComparisonPeriod === undefined
    ? request.input
    : {
        ...request.input,
        options: {
          scheduleComparisonPeriod: deps.scheduleComparisonPeriod,
        },
      };

const presentationParseFailure = (
  result: Extract<BuildSemanticDiffPresentationArtifactsResult, { ok: false }>,
  localization: ReturnType<typeof getSemanticDiffCommandLocalization>,
): CommandFailure =>
  failedStep("parse-failed", parseFailureMessage(result, localization), true);

type PresentationArtifactResultContext = Readonly<{
  request: CommandReportData;
  result: BuildSemanticDiffPresentationArtifactsResult;
  sourceCapture:
    | ReturnType<
        NonNullable<SemanticDiffCommandDeps["beginSemanticDiffSourceCapture"]>
      >
    | undefined;
  localization: ReturnType<typeof getSemanticDiffCommandLocalization>;
}>;

const isPresentationParseFailure = (
  result: BuildSemanticDiffPresentationArtifactsResult,
): result is Extract<
  BuildSemanticDiffPresentationArtifactsResult,
  { ok: false }
> => "ok" in result && result.ok === false;

const buildPresentationArtifactState = ({
  request,
  result,
  sourceCapture,
}: PresentationArtifactResultContext & {
  result: SemanticDiffPresentationArtifacts;
}): CommandStep<PresentationCommandData> =>
  readyStep({
    ...request,
    result: result.context.result,
    presentation: result,
    sourceCapture,
  });

const presentationArtifactResult = (
  context: PresentationArtifactResultContext,
): CommandStep<PresentationCommandData> => {
  if (isPresentationParseFailure(context.result)) {
    context.sourceCapture?.release();
    return presentationParseFailure(context.result, context.localization);
  }
  return buildPresentationArtifactState({
    ...context,
    result: context.result as SemanticDiffPresentationArtifacts,
  });
};

const presentationArtifactError = (
  error: unknown,
  sourceCapture:
    | ReturnType<
        NonNullable<SemanticDiffCommandDeps["beginSemanticDiffSourceCapture"]>
      >
    | undefined,
  localization: ReturnType<typeof getSemanticDiffCommandLocalization>,
): CommandFailure => {
  sourceCapture?.release();
  const captureFailed = isSemanticDiffSourceCaptureError(error);
  return failedStep(
    captureFailed ? "display-failed" : "parse-failed",
    captureFailed
      ? "Semantic diff source capture could not be established."
      : localization.parseFailed,
    true,
  );
};

const buildPresentationArtifactsStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): CommandStep<PresentationCommandData> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const adapter = deps.buildSemanticDiffPresentationArtifacts;
  if (!adapter) {
    return failedStep(
      "display-failed",
      "Semantic diff calendar artifacts could not be prepared.",
      true,
    );
  }
  let sourceCapture:
    | ReturnType<
        NonNullable<SemanticDiffCommandDeps["beginSemanticDiffSourceCapture"]>
      >
    | undefined;
  try {
    sourceCapture = beginPresentationSourceCapture(deps, request);
    const result = adapter(
      presentationArtifactInput(deps, request),
      sourceCapture?.parser,
    );
    return presentationArtifactResult({
      request,
      result,
      sourceCapture,
      localization,
    });
  } catch (error: unknown) {
    return presentationArtifactError(error, sourceCapture, localization);
  }
};

const createExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  result: CommandReadyReport,
  releaseSourceCapture: () => void,
): CommandStep<SemanticDiffOutputContext> => {
  try {
    const createContext =
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
    return readyStep(createContext(result));
  } catch {
    releaseSourceCapture();
    return failedStep(
      "render-failed",
      "Semantic diff report could not be prepared.",
      true,
    );
  }
};

const explorerContextStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & {
    result: CommandReadyReport;
    presentation?: SemanticDiffPresentationArtifacts;
  },
  releaseSourceCapture: () => void,
): CommandStep<SemanticDiffOutputContext> =>
  request.presentation
    ? readyStep(request.presentation.context)
    : createExplorerContextStep(deps, request.result, releaseSourceCapture);

type ExplorerRequestContext = Readonly<{
  request: CommandReportData & {
    result: CommandReadyReport;
    presentation?: SemanticDiffPresentationArtifacts;
  };
  context: SemanticDiffOutputContext;
  bindingStep: SourceBindingStep;
  releaseSourceCapture: () => void;
}>;

const isExplorerBindingFailure = (
  bindingStep: SourceBindingStep,
): bindingStep is Extract<SourceBindingStep, { kind: "failed" }> =>
  bindingStep.kind === "failed";

const buildExplorerRequest = ({
  request,
  context,
  bindingStep,
  releaseSourceCapture,
}: ExplorerRequestContext): CommandStep<CommandReadyExplorer> => {
  if (isExplorerBindingFailure(bindingStep)) {
    return { kind: "failed", error: bindingStep.error };
  }
  return readyStep({
    result: request.result,
    context,
    presentation: request.presentation,
    sourceCaptureRelease: releaseSourceCapture,
  });
};

const buildExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & {
    result: CommandReadyReport;
    presentation?: SemanticDiffPresentationArtifacts;
  },
): CommandStep<CommandReadyExplorer> => {
  const releaseSourceCapture = createSourceCaptureRelease(
    request.sourceCapture,
  );
  const contextStep = explorerContextStep(deps, request, releaseSourceCapture);
  if (contextStep.kind === "failed") return contextStep;
  const bindingStep = bindAndRegisterExplorerSources({
    deps,
    request,
    context: contextStep.value,
    releaseSourceCapture,
  });
  return buildExplorerRequest({
    request,
    context: contextStep.value,
    bindingStep,
    releaseSourceCapture,
  });
};

const failedExplorerOpen = (): CommandFailure =>
  failedStep(
    "display-failed",
    "Semantic diff Explorer could not be opened.",
    true,
  );

const openScheduleAwareExplorer = async (
  deps: SemanticDiffCommandDeps,
  request: CommandReadyExplorer,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  try {
    return readyStep(
      await deps.openScheduleAwareExplorerSession!(request.presentation!),
    );
  } catch {
    cleanupExplorerRequest(deps, request);
    return failedExplorerOpen();
  }
};

const openDefaultExplorer = async (
  deps: SemanticDiffCommandDeps,
  request: CommandReadyExplorer,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  if (deps.openExplorer === undefined) {
    request.sourceCaptureRelease?.();
    return failedExplorerOpen();
  }
  try {
    return readyStep(await deps.openExplorer(request.context));
  } catch {
    cleanupExplorerRequest(deps, request);
    return failedExplorerOpen();
  }
};

const openExplorerStep = async (
  deps: SemanticDiffCommandDeps,
  request: CommandReadyExplorer,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> =>
  request.presentation && deps.openScheduleAwareExplorerSession
    ? openScheduleAwareExplorer(deps, request)
    : openDefaultExplorer(deps, request);

const selectExplorerBefore = async (
  deps: SemanticDiffCommandDeps,
  activeEditor: import("vscode").TextEditor,
): Promise<CommandStep<CommandReportRequest>> =>
  mapCommandStep(
    await readBeforeDefinitionStep(deps),
    (beforeDefinition): CommandReportRequest => ({
      activeEditor,
      mode: "full",
      beforeContent: beforeDefinition.content,
      beforeUri: beforeDefinition.uri,
      beforeVersion: beforeDefinition.version,
      afterUri: activeEditor.document.uri,
      afterVersion:
        typeof activeEditor.document.version === "number"
          ? activeEditor.document.version
          : null,
    }),
  );

export const runExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  const activeEditor = readSemanticDiffActiveEditor(deps);
  const beforeDefinition = await continueCommandStep(activeEditor, (editor) =>
    selectExplorerBefore(deps, editor),
  );
  const reportInput = await continueCommandStep(beforeDefinition, (request) =>
    readReportInputStep(request),
  );
  const reportData = await continueCommandStep(reportInput, (request) =>
    deps.buildSemanticDiffPresentationArtifacts &&
    deps.openScheduleAwareExplorerSession
      ? buildPresentationArtifactsStep(deps, request)
      : buildReportDataStep(deps, request),
  );
  const context = await continueCommandStep(reportData, (request) =>
    buildExplorerContextStep(deps, request),
  );
  return continueCommandStep(context, (request) =>
    openExplorerStep(deps, request),
  );
};
