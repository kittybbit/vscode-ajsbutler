import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import { isSemanticDiffSourceCaptureError } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";
import { failedStep, readyStep } from "./semanticDiffCommandSteps";
import type {
  CommandFailure,
  CommandReportData,
  CommandReportRequest,
  CommandStep,
} from "./semanticDiffCommandSteps";

export const readSemanticDiffReportInputStep = (
  request: CommandReportRequest,
): CommandStep<CommandReportData> => {
  let step: CommandStep<CommandReportData>;
  try {
    step = readyStep({
      ...request,
      input: {
        beforeContent: request.beforeContent,
        afterContent: request.activeEditor.document.getText(),
      },
    });
  } catch {
    step = failedStep(
      "read-failed",
      "Active JP1/AJS definition could not be read.",
      true,
    );
  }
  return step;
};

const createSourceDescriptors = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): NonNullable<CommandReportData["sourceDescriptors"]> => {
  const sourceHandleIds = deps.sourceHandleIdAllocator;
  const before: ImmutableSourceDescriptor = {
    side: "before",
    sourceHandleId: sourceHandleIds(),
    text: request.input.beforeContent,
    version: request.beforeVersion,
  };
  const after: ImmutableSourceDescriptor = {
    side: "after",
    sourceHandleId: sourceHandleIds(),
    text: request.input.afterContent,
    version: request.afterVersion,
  };
  if (request.beforeUri === undefined || request.afterUri === undefined) {
    throw new Error("Source capture requires source URIs.");
  }
  return {
    before: { ...before, uri: request.beforeUri },
    after: { ...after, uri: request.afterUri },
  };
};

const beginSourceCapture = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): SemanticDiffSourceCapture | undefined => {
  if (!deps.beginSemanticDiffSourceCapture || !deps.openExplorer) {
    return undefined;
  }
  const sourceDescriptors = createSourceDescriptors(deps, request);
  request.sourceDescriptors = sourceDescriptors;
  return deps.beginSemanticDiffSourceCapture({
    before: {
      side: sourceDescriptors.before.side,
      sourceHandleId: sourceDescriptors.before.sourceHandleId,
      text: sourceDescriptors.before.text,
      version: sourceDescriptors.before.version,
    },
    after: {
      side: sourceDescriptors.after.side,
      sourceHandleId: sourceDescriptors.after.sourceHandleId,
      text: sourceDescriptors.after.text,
      version: sourceDescriptors.after.version,
    },
  });
};

const beginSourceCaptureStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): CommandStep<SemanticDiffSourceCapture | undefined> => {
  try {
    return readyStep(beginSourceCapture(deps, request));
  } catch {
    return failedStep(
      "display-failed",
      "Semantic diff source capture could not be established.",
      true,
    );
  }
};

const buildReportResultStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
  sourceCapture: SemanticDiffSourceCapture | undefined,
): CommandStep<
  CommandReportData & {
    result: Extract<
      ReturnType<BuildSemanticDiffReportData>,
      { ok: true }
    >["result"];
  }
> => {
  const reportResult = deps.buildSemanticDiffReportData(
    request.input,
    sourceCapture?.parser,
  );
  if (reportResult.ok) {
    return readyStep({
      ...request,
      result: reportResult.result,
      sourceCapture,
    });
  }
  sourceCapture?.release();
  return failedStep(
    "parse-failed",
    "Semantic diff could not parse one or both JP1/AJS definitions.",
    true,
  );
};

const reportBuildFailure = (
  error: unknown,
  sourceCapture: SemanticDiffSourceCapture | undefined,
): CommandFailure => {
  sourceCapture?.release();
  const captureFailed = isSemanticDiffSourceCaptureError(error);
  return failedStep(
    captureFailed ? "display-failed" : "parse-failed",
    captureFailed
      ? "Semantic diff source capture could not be established."
      : "Semantic diff could not parse one or both JP1/AJS definitions.",
    true,
  );
};

export const buildSemanticDiffReportDataStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): CommandStep<
  CommandReportData & {
    result: Extract<
      ReturnType<BuildSemanticDiffReportData>,
      { ok: true }
    >["result"];
  }
> => {
  const sourceCaptureStep = beginSourceCaptureStep(deps, request);
  if (sourceCaptureStep.kind === "failed") {
    return sourceCaptureStep;
  }
  try {
    return buildReportResultStep(deps, request, sourceCaptureStep.value);
  } catch (error: unknown) {
    return reportBuildFailure(error, sourceCaptureStep.value);
  }
};
