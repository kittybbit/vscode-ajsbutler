import type * as vscode from "vscode";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";
import { readSemanticDiffBeforeFile } from "./semanticDiffCommandReading";
import { pickSemanticDiffOutputMode } from "../semantic-diff/report/semanticDiffOutputModePicker";
import { type SemanticDiffOutputMode } from "../../semantic-diff/report/semanticDiffOutput";
import {
  failedStep,
  mapCommandStep,
  readyStep,
} from "./semanticDiffCommandSteps";
import type {
  CommandFailure,
  CommandReportRequest,
  CommandSelection,
  CommandStep,
} from "./semanticDiffCommandSteps";

type BeforeSelection =
  | { kind: "selected"; uri: vscode.Uri }
  | { kind: "cancelled" }
  | { kind: "failed" };

const selectBeforeUri = async (
  deps: SemanticDiffCommandDeps,
): Promise<BeforeSelection> => {
  let result: BeforeSelection;
  try {
    const selected = await deps.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: "Select Before Definition",
    });
    const beforeUri = selected?.[0];
    result = beforeUri
      ? { kind: "selected", uri: beforeUri }
      : { kind: "cancelled" };
  } catch {
    result = { kind: "failed" };
  }
  return result;
};

export const readBeforeDefinition = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "ready"; content: string; version: number | null; uri: vscode.Uri }
  | { kind: "cancelled" }
  | { kind: "failed" }
> => {
  const selection = await selectBeforeUri(deps);
  return selection.kind === "selected"
    ? readSemanticDiffBeforeFile(deps, selection.uri)
    : selection;
};

export const selectOutputMode = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "selected"; mode: SemanticDiffOutputMode }
  | { kind: "cancelled" }
  | { kind: "failed" }
> => {
  try {
    const mode = await pickSemanticDiffOutputMode((items, options) =>
      deps.showQuickPick(items, options),
    );
    return mode ? { kind: "selected", mode } : { kind: "cancelled" };
  } catch {
    return { kind: "failed" };
  }
};

const outputModeFailures: Record<"cancelled" | "failed", CommandFailure> = {
  cancelled: failedStep("cancelled", "Semantic diff was cancelled.", false),
  failed: failedStep(
    "mode-picker-failed",
    "Semantic diff output mode could not be selected.",
    true,
  ),
};

const selectOutputModeStep = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffOutputMode>> => {
  const selectedMode = await selectOutputMode(deps);
  return selectedMode.kind === "selected"
    ? readyStep(selectedMode.mode)
    : outputModeFailures[selectedMode.kind];
};

export const selectModeForEditor = async (
  deps: SemanticDiffCommandDeps,
  activeEditor: vscode.TextEditor,
): Promise<CommandStep<CommandSelection>> =>
  mapCommandStep(await selectOutputModeStep(deps), (mode) => ({
    activeEditor,
    mode,
  }));

const beforeDefinitionFailures: Record<"cancelled" | "failed", CommandFailure> =
  {
    cancelled: failedStep("cancelled", "Semantic diff was cancelled.", false),
    failed: failedStep(
      "read-failed",
      "Selected before definition could not be read.",
      true,
    ),
  };

export const readBeforeDefinitionStep = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  CommandStep<
    Extract<Awaited<ReturnType<typeof readBeforeDefinition>>, { kind: "ready" }>
  >
> => {
  const beforeDefinition = await readBeforeDefinition(deps);
  return beforeDefinition.kind === "ready"
    ? readyStep(beforeDefinition)
    : beforeDefinitionFailures[beforeDefinition.kind];
};

export const selectBeforeForCommand = async (
  deps: SemanticDiffCommandDeps,
  selection: CommandSelection,
): Promise<CommandStep<CommandReportRequest>> =>
  mapCommandStep(
    await readBeforeDefinitionStep(deps),
    (beforeDefinition): CommandReportRequest => ({
      ...selection,
      beforeContent: beforeDefinition.content,
      beforeUri: beforeDefinition.uri,
      beforeVersion: beforeDefinition.version,
      afterUri: selection.activeEditor.document.uri,
      afterVersion:
        typeof selection.activeEditor.document.version === "number"
          ? selection.activeEditor.document.version
          : null,
    }),
  );
