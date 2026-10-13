import type {
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceCaptureEntry } from "../semantic-diff/source/semanticDiffExplorerSourceTypes";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  failedStep,
  readyStep,
  type CommandStep,
} from "./semanticDiffCommandSteps";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import type { WorkflowSourceDescriptor } from "./semanticDiffCommandWorkflowSource";

export type SourceBinding = Readonly<
  Extract<SemanticDiffSourceCaptureBindResult, { ok: true }>
>;

export const createSourceCaptureRelease = (
  sourceCapture: SemanticDiffSourceCapture | undefined,
): (() => void) => {
  let released = false;
  return (): void => {
    if (released) return;
    released = true;
    sourceCapture?.release();
  };
};

export const unregisterAndReleaseWorkflowCapture = (
  deps: Pick<SemanticDiffCommandDeps, "unregisterSemanticDiffSourceCapture">,
  context: SemanticDiffOutputContext,
  release: () => void,
): void => {
  try {
    deps.unregisterSemanticDiffSourceCapture?.(context);
  } catch {
    // Release must still complete if best-effort registry rollback fails.
  } finally {
    release();
  }
};

export type WorkflowBindingState = Readonly<{
  context: SemanticDiffOutputContext;
  capture: SemanticDiffSourceCapture;
  sources: {
    before: WorkflowSourceDescriptor;
    after: WorkflowSourceDescriptor;
  };
  release: () => void;
}>;

export const bindWorkflowCapture = (
  state: WorkflowBindingState,
  localization: SemanticDiffCommandLocalization,
): CommandStep<SourceBinding> => {
  try {
    const binding = state.capture.bind(state.context);
    return binding.ok
      ? readyStep(binding)
      : failedStep("source-capture-failed", localization.sourceCaptureFailed);
  } catch {
    return failedStep(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
};

export const workflowSourceEntry = (
  state: WorkflowBindingState,
  binding: SourceBinding,
): SemanticDiffSourceCaptureEntry => ({
  binding,
  sources: state.sources,
  release: state.release,
});

export type WorkflowSourceRegistrationResult =
  | "registered"
  | "missing"
  | "failed";

export const registerWorkflowSource = (
  deps: Pick<SemanticDiffCommandDeps, "registerSemanticDiffSourceCapture">,
  state: WorkflowBindingState,
  binding: SourceBinding,
): WorkflowSourceRegistrationResult => {
  const register = deps.registerSemanticDiffSourceCapture;
  if (register === undefined) return "missing";
  try {
    register(state.context, workflowSourceEntry(state, binding));
    return "registered";
  } catch {
    return "failed";
  }
};
