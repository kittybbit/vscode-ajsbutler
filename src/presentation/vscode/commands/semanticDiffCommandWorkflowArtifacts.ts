import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  openWorkflowContext,
  type WorkflowContextOpenDeps,
} from "./semanticDiffCommandExplorerWorkflow";
import type {
  BuildSemanticDiffReportDataInput,
  BuildSemanticDiffReportDataResult,
} from "../../../application/semantic-diff/buildSemanticDiffReportData";
import { isSemanticDiffSourceCaptureError } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import {
  continueCommandStep,
  failedStep,
  readyStep,
  type CommandFailure,
  type CommandStep,
} from "./semanticDiffCommandSteps";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import { getSemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";
import {
  beginWorkflowCapture,
  prepareWorkflowSource,
  type WorkflowCaptureState,
  type WorkflowSourcePreparationDeps,
  type WorkflowSourceDescriptor,
  type WorkflowSourceRequest,
} from "./semanticDiffCommandWorkflowSource";
import { parseFailureMessage } from "./semanticDiffCommandWorkflowInput";
import { readWorkflowAfterSnapshot } from "./semanticDiffCommandWorkflowInput";
import { createSourceCaptureRelease } from "./semanticDiffCommandSourceBinding";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/panel/semanticDiffExplorerPanel";

type WorkflowContextBuildDeps = Pick<
  SemanticDiffCommandDeps,
  | "sourceHandleIdAllocator"
  | "beginSemanticDiffSourceCapture"
  | "buildSemanticDiffReportData"
  | "buildSemanticDiffOutputContext"
>;

type FileComparisonWorkflowDeps = Pick<
  SemanticDiffCommandDeps,
  "getActiveEditor" | "language"
> &
  WorkflowSourcePreparationDeps &
  WorkflowContextBuildDeps &
  WorkflowContextOpenDeps;

export type WorkflowExplorerResult = Readonly<{
  handle: SemanticDiffExplorerSessionHandle;
  source: "file" | "git-head";
}>;

export type WorkflowContextState = Readonly<{
  context: SemanticDiffOutputContext;
  capture: WorkflowCaptureState["capture"];
  sources: {
    before: WorkflowSourceDescriptor;
    after: WorkflowSourceDescriptor;
  };
  source: "file" | "git-head";
  release: () => void;
}>;

export type WorkflowContextBuildOptions = Readonly<{
  deps: WorkflowContextBuildDeps;
  source: WorkflowSourceRequest;
  localization: SemanticDiffCommandLocalization;
}>;

type WorkflowContextResultContext = Readonly<{
  deps: WorkflowContextBuildDeps;
  result: Extract<BuildSemanticDiffReportDataResult, { ok: true }>;
  capture: WorkflowCaptureState;
  source: WorkflowSourceRequest;
  localization: SemanticDiffCommandLocalization;
  release: () => void;
}>;

const buildWorkflowContextState = ({
  deps,
  result,
  capture,
  source,
  release,
}: WorkflowContextResultContext): CommandStep<WorkflowContextState> =>
  readyStep({
    context: (
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext
    )(result.result),
    capture: capture.capture,
    sources: { before: capture.before, after: capture.after },
    source: source.source,
    release,
  });

const createWorkflowRelease = (
  releaseSourceCapture: () => void,
  providerReservation: WorkflowSourceRequest["providerReservation"],
): (() => void) => {
  let released = false;
  return (): void => {
    if (released) return;
    released = true;
    try {
      releaseSourceCapture();
    } finally {
      providerReservation?.release();
    }
  };
};

const createWorkflowContextInput = (
  source: WorkflowSourceRequest,
  after: WorkflowSourceDescriptor,
): BuildSemanticDiffReportDataInput => ({
  beforeContent: source.before.text,
  afterContent: after.text,
});

const buildCapturedWorkflowContext = (
  options: WorkflowContextBuildOptions,
  capture: WorkflowCaptureState,
): CommandStep<WorkflowContextState> => {
  const { deps, source, localization } = options;
  const releaseSourceCapture = createSourceCaptureRelease(capture.capture);
  const release = createWorkflowRelease(
    releaseSourceCapture,
    source.providerReservation,
  );
  try {
    const adapter = deps.buildSemanticDiffReportData!;
    const result = adapter(
      createWorkflowContextInput(source, capture.after),
      capture.capture.parser,
    );
    if (result.ok === false) {
      release();
      return failedStep(
        "parse-failed",
        parseFailureMessage(result, localization),
      );
    }
    return buildWorkflowContextState({
      deps,
      result,
      capture,
      source,
      localization,
      release,
    });
  } catch (error: unknown) {
    release();
    return workflowContextError(error, localization);
  }
};

export const buildWorkflowContext = (
  options: WorkflowContextBuildOptions,
): CommandStep<WorkflowContextState> => {
  const capture = beginWorkflowCapture(
    options.deps,
    options.source,
    options.localization,
  );
  return capture.kind === "failed"
    ? capture
    : buildCapturedWorkflowContext(options, capture.value);
};

const workflowContextError = (
  error: unknown,
  localization: SemanticDiffCommandLocalization,
): CommandFailure => {
  const captureFailed = isSemanticDiffSourceCaptureError(error);
  return failedStep(
    captureFailed ? "source-capture-failed" : "comparison-failed",
    captureFailed
      ? localization.sourceCaptureFailed
      : localization.comparisonFailed,
  );
};

export const runDefinitionComparisonWorkflow = async (
  deps: FileComparisonWorkflowDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareWorkflowSource(deps, after, localization),
  );
  const contextStep = await continueCommandStep(sourceStep, (source) =>
    buildWorkflowContext({ deps, source, localization }),
  );
  return continueCommandStep(contextStep, (state) =>
    openWorkflowContext(deps, state, localization),
  );
};
