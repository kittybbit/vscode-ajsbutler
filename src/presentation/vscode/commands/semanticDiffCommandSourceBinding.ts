import type { SemanticDiffPresentationArtifacts } from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type {
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceCaptureEntry } from "../semantic-diff/source/semanticDiffExplorerSourceTypes";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  failedStep,
  readyStep,
  type CommandFailure,
  type CommandReportData,
  type CommandStep,
} from "./semanticDiffCommandSteps";
import type {
  CommandReadyReport,
  SemanticDiffCommandDeps,
} from "./semanticDiffCommand";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import type { WorkflowSourceDescriptor } from "./semanticDiffCommandWorkflowSource";

export type SourceBinding = Readonly<
  Extract<SemanticDiffSourceCaptureBindResult, { ok: true }>
>;

export type SourceBindingStep = CommandStep<void>;
type PreparedSourceBindingStep = CommandStep<SourceBinding | undefined>;

type SourceBindingOptions = Readonly<{
  deps: SemanticDiffCommandDeps;
  request: CommandReportData & { result: CommandReadyReport };
  context: SemanticDiffOutputContext;
  releaseSourceCapture: () => void;
}>;

const sourceBindingFailure = (message: string): CommandFailure =>
  failedStep("display-failed", message, true);

const rollbackSourceCapture = (options: SourceBindingOptions): void => {
  try {
    options.deps.unregisterSemanticDiffSourceCapture?.(options.context);
  } catch {
    // Release must still complete if a best-effort registry rollback fails.
  }
  options.releaseSourceCapture();
};

const prepareSourceBinding = (
  capture: SemanticDiffSourceCapture,
  context: SemanticDiffOutputContext,
): CommandStep<SourceBinding> => {
  try {
    const binding = capture.bind(context);
    return binding.ok
      ? readyStep(binding)
      : sourceBindingFailure(
          "Semantic diff source targets could not be prepared.",
        );
  } catch {
    return sourceBindingFailure(
      "Semantic diff source targets could not be prepared.",
    );
  }
};

const validateSourceBinding = (
  options: SourceBindingOptions,
  binding: SourceBinding,
): PreparedSourceBindingStep => {
  if (!options.deps.registerSemanticDiffSourceCapture) {
    return sourceBindingFailure(
      "Semantic diff source targets could not be registered.",
    );
  }
  return options.request.sourceDescriptors === undefined
    ? sourceBindingFailure(
        "Semantic diff source targets could not be registered.",
      )
    : readyStep(binding);
};

const prepareAndValidateSourceBinding = (
  options: SourceBindingOptions,
): PreparedSourceBindingStep => {
  const capture = options.request.sourceCapture;
  if (!capture) return readyStep(undefined);
  const prepared = prepareSourceBinding(capture, options.context);
  return prepared.kind === "failed"
    ? prepared
    : validateSourceBinding(options, prepared.value);
};

const rollbackFailedBinding = (
  options: SourceBindingOptions,
  step: SourceBindingStep,
): SourceBindingStep => {
  if (step.kind === "failed") rollbackSourceCapture(options);
  return step;
};

type SourceBindingRegistrationContext = Readonly<{
  options: SourceBindingOptions;
  binding: SourceBinding;
}>;

const isMissingSourceRegistration = (options: SourceBindingOptions): boolean =>
  options.request.sourceDescriptors === undefined ||
  options.deps.registerSemanticDiffSourceCapture === undefined;

const buildSourceCaptureEntry = ({
  options,
  binding,
}: SourceBindingRegistrationContext):
  | SemanticDiffSourceCaptureEntry
  | undefined => {
  if (isMissingSourceRegistration(options)) return undefined;
  const sources = options.request.sourceDescriptors;
  return sources
    ? { binding, sources, release: options.releaseSourceCapture }
    : undefined;
};

const invokeSourceRegistration = (
  options: SourceBindingOptions,
  entry: SemanticDiffSourceCaptureEntry,
): boolean => {
  const register = options.deps.registerSemanticDiffSourceCapture;
  if (!register) return false;
  try {
    register(options.context, entry);
    return true;
  } catch {
    return false;
  }
};

const registerSourceBinding = ({
  options,
  binding,
}: SourceBindingRegistrationContext): SourceBindingStep => {
  const entry = buildSourceCaptureEntry({ options, binding });
  if (!entry) {
    return sourceBindingFailure(
      "Semantic diff source targets could not be registered.",
    );
  }
  return invokeSourceRegistration(options, entry)
    ? readyStep(undefined)
    : sourceBindingFailure(
        "Semantic diff source targets could not be registered.",
      );
};

const registerPreparedSourceBinding = (
  options: SourceBindingOptions,
  prepared: PreparedSourceBindingStep,
): SourceBindingStep => {
  if (prepared.kind === "failed") return prepared;
  return prepared.value
    ? registerSourceBinding({ options, binding: prepared.value })
    : readyStep(undefined);
};

export const bindAndRegisterExplorerSources = (
  options: SourceBindingOptions,
): SourceBindingStep => {
  const prepared = prepareAndValidateSourceBinding(options);
  return rollbackFailedBinding(
    options,
    registerPreparedSourceBinding(options, prepared),
  );
};

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
  deps: SemanticDiffCommandDeps,
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
  artifacts: SemanticDiffPresentationArtifacts;
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
    const binding = state.capture.bind(state.artifacts.context);
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
  deps: SemanticDiffCommandDeps,
  state: WorkflowBindingState,
  binding: SourceBinding,
): WorkflowSourceRegistrationResult => {
  const register = deps.registerSemanticDiffSourceCapture;
  if (register === undefined) return "missing";
  try {
    register(state.artifacts.context, workflowSourceEntry(state, binding));
    return "registered";
  } catch {
    return "failed";
  }
};

export const cleanupExplorerRequest = (
  deps: SemanticDiffCommandDeps,
  request: Readonly<{
    context: SemanticDiffOutputContext;
    sourceCaptureRelease?: () => void;
  }>,
): void => {
  deps.unregisterSemanticDiffSourceCapture?.(request.context);
  request.sourceCaptureRelease?.();
};
