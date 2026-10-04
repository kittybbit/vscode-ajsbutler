import type * as vscode from "vscode";
import type {
  GitHeadDefinitionResult,
  ReadGitHeadDefinition,
} from "../../../application/semantic-diff/GitHeadDefinitionSourcePort";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureFactory,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import { localizeGitHeadUnavailableReason } from "./semanticDiffCommandLocalization";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import {
  failedStep,
  continueCommandStep,
  mapCommandStep,
  readyStep,
  type CommandFailure,
  type CommandStep,
} from "./semanticDiffCommandSteps";
import type {
  SemanticDiffCommandDeps,
  SemanticDiffGitHeadSnapshotReservation,
} from "./semanticDiffCommand";
import {
  selectionToStep,
  selectWorkflowSource,
  workflowCancellation,
} from "./semanticDiffCommandWorkflowSelection";
import {
  sourceTextFailure,
  type WorkflowAfterSnapshot,
} from "./semanticDiffCommandWorkflowInput";

type WorkflowDocumentReaderDeps = Pick<
  SemanticDiffCommandDeps,
  "openTextDocument"
>;
type WorkflowSourceIdDeps = Pick<
  SemanticDiffCommandDeps,
  "sourceHandleIdAllocator"
>;
type WorkflowFilePickerDeps = Pick<SemanticDiffCommandDeps, "showOpenDialog">;
type WorkflowFileSourceDeps = WorkflowDocumentReaderDeps &
  WorkflowSourceIdDeps &
  WorkflowFilePickerDeps;
type WorkflowGitReaderDeps = Pick<
  SemanticDiffCommandDeps,
  "readGitHeadDefinition"
>;
type WorkflowGitProviderDeps = Pick<
  SemanticDiffCommandDeps,
  "gitHeadSnapshotProvider"
>;
type WorkflowGitHeadDeps = WorkflowGitReaderDeps &
  WorkflowGitProviderDeps &
  WorkflowSourceIdDeps;
type WorkflowSourceSelectionDeps = Pick<
  SemanticDiffCommandDeps,
  "showWorkflowQuickPick" | "showQuickPick"
>;
export type WorkflowSourcePreparationDeps = WorkflowSourceSelectionDeps &
  WorkflowFileSourceDeps &
  WorkflowGitHeadDeps;
type WorkflowCaptureDeps = Pick<
  SemanticDiffCommandDeps,
  | "sourceHandleIdAllocator"
  | "beginSemanticDiffSourceCapture"
  | "buildSemanticDiffPresentationArtifacts"
>;

export type WorkflowSourceDescriptor = ImmutableSourceDescriptor & {
  uri: vscode.Uri;
};

export type WorkflowSourceRequest = Readonly<{
  after: WorkflowAfterSnapshot;
  before: WorkflowSourceDescriptor;
  source: "file" | "git-head";
  providerReservation?: SemanticDiffGitHeadSnapshotReservation;
}>;

export type WorkflowCaptureState = Readonly<{
  before: WorkflowSourceDescriptor;
  after: WorkflowSourceDescriptor;
  capture: SemanticDiffSourceCapture;
}>;

const readWorkflowBefore = async (
  deps: WorkflowDocumentReaderDeps & WorkflowSourceIdDeps,
  uri: vscode.Uri,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceDescriptor>> => {
  if (!deps.openTextDocument) {
    return failedStep(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
  const document = await readWorkflowDocument(deps, uri, localization);
  return document.kind === "failed"
    ? document
    : describeWorkflowBefore({
        deps,
        uri,
        document: document.value,
        localization,
      });
};

const readWorkflowDocument = async (
  deps: WorkflowDocumentReaderDeps,
  uri: vscode.Uri,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<vscode.TextDocument>> => {
  try {
    return readyStep(await deps.openTextDocument!(uri));
  } catch {
    return failedStep(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

type WorkflowBeforeDescription = Readonly<{
  deps: WorkflowSourceIdDeps;
  uri: vscode.Uri;
  document: vscode.TextDocument;
  localization: SemanticDiffCommandLocalization;
}>;

const describeWorkflowBefore = ({
  deps,
  uri,
  document,
  localization,
}: WorkflowBeforeDescription): CommandStep<WorkflowSourceDescriptor> => {
  try {
    const text = document.getText();
    const textFailure = sourceTextFailure(text, "before", localization);
    return (
      textFailure ??
      readyStep({
        side: "before",
        sourceHandleId: deps.sourceHandleIdAllocator(),
        text,
        version: typeof document.version === "number" ? document.version : null,
        uri,
      })
    );
  } catch {
    return failedStep(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

const selectWorkflowFile = async (
  deps: WorkflowFilePickerDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<vscode.Uri>> => {
  try {
    const selected = await deps.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: localization.selectDefinitionFile,
    });
    return selected?.[0]
      ? readyStep(selected[0])
      : workflowCancellation(localization);
  } catch {
    return failedStep(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

const readWorkflowSourceFile = async (
  deps: WorkflowFileSourceDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> => {
  const selected = await selectWorkflowFile(deps, localization);
  return continueCommandStep(selected, async (uri) => {
    const before = await readWorkflowBefore(deps, uri, localization);
    return mapCommandStep(before, (value) => ({
      after,
      before: value,
      source: "file" as const,
    }));
  });
};

const missingGitHeadReader = (
  deps: WorkflowGitReaderDeps,
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined =>
  deps.readGitHeadDefinition
    ? undefined
    : failedStep(
        "git-head-unavailable",
        localization.gitHeadUnavailable,
        true,
        "extension-missing",
      );

const missingGitHeadProvider = (
  deps: WorkflowGitProviderDeps,
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined =>
  deps.gitHeadSnapshotProvider
    ? undefined
    : failedStep(
        "git-head-unavailable",
        localization.gitHeadUnavailable,
        true,
        "api-unavailable",
      );

const gitHeadDependencyFailure = (
  deps: WorkflowGitReaderDeps & WorkflowGitProviderDeps,
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined =>
  missingGitHeadReader(deps, localization) ??
  missingGitHeadProvider(deps, localization);

const readGitHeadResult = async (
  readGitHeadDefinition: NonNullable<ReadGitHeadDefinition>,
  after: WorkflowAfterSnapshot,
): Promise<GitHeadDefinitionResult> => {
  try {
    return await readGitHeadDefinition({ documentUri: after.uri.toString() });
  } catch {
    return { kind: "unavailable", reason: "read-failed" };
  }
};

const validateGitHeadResult = (
  result: GitHeadDefinitionResult,
  localization: SemanticDiffCommandLocalization,
): CommandStep<Extract<GitHeadDefinitionResult, { kind: "ready" }>> => {
  if (result.kind === "unavailable") {
    return failedStep(
      "git-head-unavailable",
      localizeGitHeadUnavailableReason(localization, result.reason),
      true,
      result.reason,
    );
  }
  return result.ref === "HEAD"
    ? readyStep(result)
    : failedStep(
        "git-head-unavailable",
        localization.gitHeadUnavailable,
        true,
        "api-unavailable",
      );
};

type GitHeadWorkflowOptions = Readonly<{
  deps: WorkflowGitProviderDeps & WorkflowSourceIdDeps;
  after: WorkflowAfterSnapshot;
  result: Extract<GitHeadDefinitionResult, { kind: "ready" }>;
  localization: SemanticDiffCommandLocalization;
}>;

const workflowFromGitHead = ({
  deps,
  after,
  result,
  localization,
}: GitHeadWorkflowOptions): CommandStep<WorkflowSourceRequest> => {
  const reservation = deps.gitHeadSnapshotProvider!.reserve(result.content);
  if (reservation.kind === "unavailable") {
    return failedStep(
      "explorer-open-failed",
      localization.gitHeadSnapshotCapacity,
    );
  }
  try {
    return readyStep({
      after,
      before: {
        side: "before",
        sourceHandleId: deps.sourceHandleIdAllocator(),
        text: result.content,
        version: 1,
        uri: reservation.reservation.uri,
      },
      source: "git-head",
      providerReservation: reservation.reservation,
    });
  } catch {
    reservation.reservation.release();
    return failedStep(
      "git-head-unavailable",
      localization.gitHeadReadFailed,
      true,
      "read-failed",
    );
  }
};

const readWorkflowGitHead = async (
  deps: WorkflowGitHeadDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> => {
  const dependencyFailure = gitHeadDependencyFailure(deps, localization);
  if (dependencyFailure) return dependencyFailure;
  const result = await readGitHeadResult(deps.readGitHeadDefinition!, after);
  const validated = validateGitHeadResult(result, localization);
  return validated.kind === "failed"
    ? validated
    : workflowFromGitHead({
        deps,
        after,
        result: validated.value,
        localization,
      });
};

export const prepareWorkflowSource = async (
  deps: WorkflowSourcePreparationDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> => {
  const selection = await selectWorkflowSource(deps, localization);
  const selectionStep = selectionToStep(selection, localization);
  return continueCommandStep(selectionStep, (kind) =>
    kind === "git-head"
      ? readWorkflowGitHead(deps, after, localization)
      : readWorkflowSourceFile(deps, after, localization),
  );
};

const createWorkflowAfterDescriptor = (
  deps: WorkflowSourceIdDeps,
  source: WorkflowSourceRequest,
): WorkflowAfterSnapshot & WorkflowSourceDescriptor => ({
  side: "after",
  sourceHandleId: deps.sourceHandleIdAllocator(),
  text: source.after.text,
  version: source.after.version,
  uri: source.after.uri,
});

const createWorkflowCaptureInput = (
  before: WorkflowSourceDescriptor,
  after: WorkflowAfterSnapshot & WorkflowSourceDescriptor,
): Parameters<SemanticDiffSourceCaptureFactory>[0] => ({
  before: {
    side: before.side,
    sourceHandleId: before.sourceHandleId,
    text: before.text,
    version: before.version,
  },
  after: {
    side: after.side,
    sourceHandleId: after.sourceHandleId,
    text: after.text,
    version: after.version,
  },
});

const workflowCaptureDependenciesAvailable = (
  deps: WorkflowCaptureDeps,
): boolean =>
  deps.beginSemanticDiffSourceCapture !== undefined &&
  deps.buildSemanticDiffPresentationArtifacts !== undefined;

export const beginWorkflowCapture = (
  deps: WorkflowCaptureDeps,
  source: WorkflowSourceRequest,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowCaptureState> => {
  if (!workflowCaptureDependenciesAvailable(deps)) {
    source.providerReservation?.release();
    return failedStep(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  try {
    const after = createWorkflowAfterDescriptor(deps, source);
    const capture = deps.beginSemanticDiffSourceCapture!(
      createWorkflowCaptureInput(source.before, after),
    );
    return readyStep({ before: source.before, after, capture });
  } catch {
    source.providerReservation?.release();
    return failedStep(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
};
