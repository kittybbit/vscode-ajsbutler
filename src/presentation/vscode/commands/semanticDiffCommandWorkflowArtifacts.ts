import type {
  BuildSemanticDiffPresentationArtifactsInput,
  BuildSemanticDiffPresentationArtifactsResult,
  SemanticDiffPresentationArtifacts,
} from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
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
  type WorkflowSourceDescriptor,
  type WorkflowSourceRequest,
} from "./semanticDiffCommandWorkflowSource";
import {
  selectWorkflowPeriodStep,
  type WorkflowPeriodSelection,
} from "./semanticDiffCommandWorkflowPeriod";
import { parseFailureMessage } from "./semanticDiffCommandWorkflowInput";
import { readWorkflowAfterSnapshot } from "./semanticDiffCommandWorkflowInput";
import {
  bindWorkflowCapture,
  createSourceCaptureRelease,
  registerWorkflowSource,
  unregisterAndReleaseWorkflowCapture,
  type SourceBinding,
} from "./semanticDiffCommandSourceBinding";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/panel/semanticDiffExplorerPanel";

export type WorkflowExplorerResult = Readonly<{
  handle: SemanticDiffExplorerSessionHandle;
  source: "file" | "git-head";
  period: "not-requested" | "evaluated";
}>;

export type WorkflowArtifactState = Readonly<{
  artifacts: SemanticDiffPresentationArtifacts;
  capture: WorkflowCaptureState["capture"];
  sources: {
    before: WorkflowSourceDescriptor;
    after: WorkflowSourceDescriptor;
  };
  source: "file" | "git-head";
  period: "not-requested" | "evaluated";
  release: () => void;
}>;

type WorkflowArtifactSelection = Extract<
  WorkflowPeriodSelection,
  { kind: "not-requested" | "evaluated" }
>;

export type WorkflowArtifactBuildOptions = Readonly<{
  deps: SemanticDiffCommandDeps;
  source: WorkflowSourceRequest;
  selection: WorkflowArtifactSelection;
  localization: SemanticDiffCommandLocalization;
}>;

type WorkflowArtifactResultContext = Readonly<{
  result: BuildSemanticDiffPresentationArtifactsResult;
  capture: WorkflowCaptureState;
  source: WorkflowSourceRequest;
  selection: WorkflowArtifactSelection;
  localization: SemanticDiffCommandLocalization;
  release: () => void;
}>;

const isWorkflowParseFailure = (
  result: BuildSemanticDiffPresentationArtifactsResult,
): result is Extract<
  BuildSemanticDiffPresentationArtifactsResult,
  { ok: false }
> => "ok" in result && result.ok === false;

const buildWorkflowArtifactState = ({
  result,
  capture,
  source,
  selection,
  release,
}: WorkflowArtifactResultContext): CommandStep<WorkflowArtifactState> =>
  readyStep({
    artifacts: result as SemanticDiffPresentationArtifacts,
    capture: capture.capture,
    sources: { before: capture.before, after: capture.after },
    source: source.source,
    period: selection.kind === "evaluated" ? "evaluated" : "not-requested",
    release,
  });

const workflowArtifactResult = (
  context: WorkflowArtifactResultContext,
): CommandStep<WorkflowArtifactState> => {
  if (isWorkflowParseFailure(context.result)) {
    context.release();
    return failedStep(
      "parse-failed",
      parseFailureMessage(context.result, context.localization),
    );
  }
  return buildWorkflowArtifactState(context);
};

const createWorkflowRelease = (
  releaseSourceCapture: () => void,
  providerReservation: WorkflowSourceRequest["providerReservation"],
): (() => void) => {
  let released = false;
  return (): void => {
    if (released) return;
    released = true;
    releaseSourceCapture();
    providerReservation?.release();
  };
};

const createWorkflowArtifactInput = (
  source: WorkflowSourceRequest,
  after: WorkflowSourceDescriptor,
  selection: WorkflowArtifactSelection,
): BuildSemanticDiffPresentationArtifactsInput => ({
  beforeContent: source.before.text,
  afterContent: after.text,
  ...(selection.kind === "evaluated"
    ? { options: { scheduleComparisonPeriod: selection.period } }
    : {}),
});

export const buildWorkflowArtifacts = (
  options: WorkflowArtifactBuildOptions,
): CommandStep<WorkflowArtifactState> => {
  const { deps, source, selection, localization } = options;
  const captureStep = beginWorkflowCapture(deps, source, localization);
  if (captureStep.kind === "failed") return captureStep;
  const releaseSourceCapture = createSourceCaptureRelease(
    captureStep.value.capture,
  );
  const release = createWorkflowRelease(
    releaseSourceCapture,
    source.providerReservation,
  );
  try {
    const adapter = deps.buildSemanticDiffPresentationArtifacts!;
    const result = adapter(
      createWorkflowArtifactInput(source, captureStep.value.after, selection),
      captureStep.value.capture.parser,
    );
    return workflowArtifactResult({
      result,
      capture: captureStep.value,
      source,
      selection,
      localization,
      release,
    });
  } catch (error: unknown) {
    release();
    return workflowArtifactError(error, localization);
  }
};

const workflowArtifactError = (
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

type WorkflowOpenFailureContext = Readonly<{
  deps: SemanticDiffCommandDeps;
  state: WorkflowArtifactState;
  localization: SemanticDiffCommandLocalization;
  code: "source-capture-failed" | "explorer-open-failed";
}>;

const selectWorkflowFailureMessage = ({
  localization,
  code,
}: WorkflowOpenFailureContext): string =>
  code === "source-capture-failed"
    ? localization.sourceCaptureFailed
    : localization.explorerOpenFailed;

const workflowOpenFailure = ({
  deps,
  state,
  localization,
  code,
}: WorkflowOpenFailureContext): CommandFailure => {
  unregisterAndReleaseWorkflowCapture(
    deps,
    state.artifacts.context,
    state.release,
  );
  return failedStep(
    code,
    selectWorkflowFailureMessage({ deps, state, localization, code }),
  );
};

const openRegisteredWorkflowArtifacts = async (
  deps: SemanticDiffCommandDeps,
  state: WorkflowArtifactState,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  if (deps.openScheduleAwareExplorerSession === undefined) {
    return workflowOpenFailure({
      deps,
      state,
      localization,
      code: "explorer-open-failed",
    });
  }
  try {
    const handle = await deps.openScheduleAwareExplorerSession(state.artifacts);
    return readyStep({
      handle,
      source: state.source,
      period: state.period,
    });
  } catch {
    return workflowOpenFailure({
      deps,
      state,
      localization,
      code: "explorer-open-failed",
    });
  }
};

type OpenRegisteredWorkflowCaptureContext = Readonly<{
  deps: SemanticDiffCommandDeps;
  state: WorkflowArtifactState;
  binding: SourceBinding;
  localization: SemanticDiffCommandLocalization;
}>;

const openRegisteredWorkflowCapture = async ({
  deps,
  state,
  binding,
  localization,
}: OpenRegisteredWorkflowCaptureContext): Promise<
  CommandStep<WorkflowExplorerResult>
> => {
  const registration = registerWorkflowSource(deps, state, binding);
  if (registration === "missing") {
    state.release();
    return failedStep(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  return registration === "registered"
    ? openRegisteredWorkflowArtifacts(deps, state, localization)
    : workflowOpenFailure({
        deps,
        state,
        localization,
        code: "source-capture-failed",
      });
};

const openWorkflowArtifacts = async (
  deps: SemanticDiffCommandDeps,
  state: WorkflowArtifactState,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const binding = bindWorkflowCapture(state, localization);
  if (binding.kind === "failed") {
    state.release();
    return binding;
  }
  return openRegisteredWorkflowCapture({
    deps,
    state,
    binding: binding.value,
    localization,
  });
};

export const runFileComparisonWorkflow = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareWorkflowSource(deps, after, localization),
  );
  const periodStep = await continueCommandStep(sourceStep, (source) =>
    selectWorkflowPeriodStep(deps, source, localization),
  );
  const artifactStep = await continueCommandStep(
    periodStep,
    ({ source, selection }) =>
      buildWorkflowArtifacts({ deps, source, selection, localization }),
  );
  return continueCommandStep(artifactStep, (state) =>
    openWorkflowArtifacts(deps, state, localization),
  );
};

const prepareCalendarCompatibilitySource = async (
  deps: SemanticDiffCommandDeps,
  after: import("./semanticDiffCommandWorkflowInput").WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> =>
  prepareWorkflowSource(deps, after, localization);

export const runCalendarCompatibilityWorkflow = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareCalendarCompatibilitySource(deps, after, localization),
  );
  const selection: WorkflowArtifactSelection =
    deps.scheduleComparisonPeriod === undefined
      ? { kind: "not-requested" }
      : { kind: "evaluated", period: deps.scheduleComparisonPeriod };
  const artifactStep = await continueCommandStep(sourceStep, (source) =>
    buildWorkflowArtifacts({ deps, source, selection, localization }),
  );
  return continueCommandStep(artifactStep, (state) =>
    openWorkflowArtifacts(deps, state, localization),
  );
};
