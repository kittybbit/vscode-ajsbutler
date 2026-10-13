import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import type {
  WorkflowContextState,
  WorkflowExplorerResult,
} from "./semanticDiffCommandWorkflowArtifacts";
import {
  failedStep,
  readyStep,
  type CommandStep,
  type CommandFailure,
} from "./semanticDiffCommandSteps";
import {
  bindWorkflowCapture,
  registerWorkflowSource,
  unregisterAndReleaseWorkflowCapture,
  type SourceBinding,
} from "./semanticDiffCommandSourceBinding";

export type WorkflowContextOpenDeps = Pick<
  SemanticDiffCommandDeps,
  | "registerSemanticDiffSourceCapture"
  | "unregisterSemanticDiffSourceCapture"
  | "openExplorer"
>;

type WorkflowOpenFailureContext = Readonly<{
  deps: Pick<SemanticDiffCommandDeps, "unregisterSemanticDiffSourceCapture">;
  state: WorkflowContextState;
  localization: SemanticDiffCommandLocalization;
  code: "source-capture-failed" | "explorer-open-failed";
}>;

const selectWorkflowFailureMessage = ({
  localization,
  code,
}: Pick<WorkflowOpenFailureContext, "localization" | "code">): string =>
  code === "source-capture-failed"
    ? localization.sourceCaptureFailed
    : localization.explorerOpenFailed;

const workflowOpenFailure = ({
  deps,
  state,
  localization,
  code,
}: WorkflowOpenFailureContext): CommandFailure => {
  unregisterAndReleaseWorkflowCapture(deps, state.context, state.release);
  return failedStep(code, selectWorkflowFailureMessage({ localization, code }));
};

const openRegisteredWorkflowContext = async (
  deps: WorkflowContextOpenDeps,
  state: WorkflowContextState,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  if (deps.openExplorer === undefined) {
    return workflowOpenFailure({
      deps,
      state,
      localization,
      code: "explorer-open-failed",
    });
  }
  try {
    const handle = await deps.openExplorer(state.context);
    return readyStep({
      handle,
      source: state.source,
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
  deps: WorkflowContextOpenDeps;
  state: WorkflowContextState;
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
    ? openRegisteredWorkflowContext(deps, state, localization)
    : workflowOpenFailure({
        deps,
        state,
        localization,
        code: "source-capture-failed",
      });
};

export const openWorkflowContext = async (
  deps: WorkflowContextOpenDeps,
  state: WorkflowContextState,
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
