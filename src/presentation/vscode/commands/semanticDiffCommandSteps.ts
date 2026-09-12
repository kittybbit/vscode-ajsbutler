import type * as vscode from "vscode";
import type { GitHeadDefinitionUnavailableReason } from "../../../application/semantic-diff/GitHeadDefinitionSourcePort";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffOutputMode } from "../../semantic-diff/semanticDiffOutput";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";

type SemanticDiffCommandErrorCodes = {
  "no-active-editor": unknown;
  "active-editor-failed": unknown;
  "after-non-text": unknown;
  "after-too-large": unknown;
  "source-picker-failed": unknown;
  "git-head-unavailable": unknown;
  cancelled: unknown;
  "before-file-read-failed": unknown;
  "before-file-non-text": unknown;
  "before-file-too-large": unknown;
  "mode-picker-failed": unknown;
  "read-failed": unknown;
  "parse-failed": unknown;
  "comparison-failed": unknown;
  "source-capture-failed": unknown;
  "render-failed": unknown;
  "display-failed": unknown;
  "explorer-open-failed": unknown;
};

export type SemanticDiffCommandErrorCode = keyof SemanticDiffCommandErrorCodes;

export type SemanticDiffCommandError = {
  code: SemanticDiffCommandErrorCode;
  message: string;
  reason?: GitHeadDefinitionUnavailableReason;
};

export type SemanticDiffCommandFailureResult = {
  ok: false;
  error: SemanticDiffCommandError;
};

export type CommandFailure = {
  kind: "failed";
  error: SemanticDiffCommandError & { notify: boolean };
};

export type CommandStep<T> = { kind: "ready"; value: T } | CommandFailure;

export type CommandSelection = {
  activeEditor: vscode.TextEditor;
  mode: SemanticDiffOutputMode;
};

export type CommandReportRequest = CommandSelection & {
  beforeContent: string;
  beforeUri?: vscode.Uri;
  beforeVersion: number | null;
  afterUri?: vscode.Uri;
  afterVersion: number | null;
};

export type CommandReportData = CommandReportRequest & {
  input: Parameters<BuildSemanticDiffReportData>[0];
  sourceCapture?: SemanticDiffSourceCapture;
  sourceDescriptors?: Readonly<{
    before: ImmutableSourceDescriptor & { uri: vscode.Uri };
    after: ImmutableSourceDescriptor & { uri: vscode.Uri };
  }>;
};

export type CommandReadyReport = Extract<
  ReturnType<BuildSemanticDiffReportData>,
  { ok: true }
>["result"];

export type CommandReadyExplorer = {
  readonly result: CommandReadyReport;
  readonly context: SemanticDiffOutputContext;
  readonly sourceCaptureRelease?: () => void;
};

export const readyStep = <T>(value: T): CommandStep<T> => ({
  kind: "ready",
  value,
});

type FailedStepArguments = readonly [
  code: SemanticDiffCommandErrorCode,
  message: string,
  notify?: boolean,
  reason?: GitHeadDefinitionUnavailableReason,
];

export const failedStep = (...args: FailedStepArguments): CommandFailure => {
  const [code, message, notify, reason] = args;
  return {
    kind: "failed",
    error: {
      code,
      message,
      notify: notify ?? true,
      ...(reason ? { reason } : {}),
    },
  };
};

export const continueCommandStep = async <T, U>(
  step: CommandStep<T>,
  next: (value: T) => CommandStep<U> | Promise<CommandStep<U>>,
): Promise<CommandStep<U>> =>
  step.kind === "failed" ? step : await next(step.value);

export const mapCommandStep = <T, U>(
  step: CommandStep<T>,
  map: (value: T) => U,
): CommandStep<U> =>
  step.kind === "failed" ? step : readyStep(map(step.value));

export const commandError = (
  code: SemanticDiffCommandErrorCode,
  message: string,
  reason?: GitHeadDefinitionUnavailableReason,
): SemanticDiffCommandFailureResult => ({
  ok: false,
  error: { code, message, ...(reason ? { reason } : {}) },
});

export const safeShowErrorMessage = async (
  deps: SemanticDiffCommandDeps,
  message: string,
): Promise<void> => {
  try {
    await deps.showErrorMessage(message);
  } catch {
    // A notification failure must not replace the command's repository-owned result.
  }
};
