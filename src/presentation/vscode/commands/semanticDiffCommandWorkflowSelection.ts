import type * as vscode from "vscode";
import {
  failedStep,
  readyStep,
  type CommandFailure,
  type CommandStep,
} from "./semanticDiffCommandSteps";
import type {
  SemanticDiffCommandDeps,
  SemanticDiffWorkflowQuickPickItem,
} from "./semanticDiffCommand";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import type { SemanticDiffOutputModeItem } from "../../semantic-diff/semanticDiffOutput";

const workflowQuickPick = (
  deps: SemanticDiffCommandDeps,
  items: readonly SemanticDiffWorkflowQuickPickItem[],
  options: vscode.QuickPickOptions,
): Thenable<SemanticDiffWorkflowQuickPickItem | undefined> => {
  if (deps.showWorkflowQuickPick) {
    return deps.showWorkflowQuickPick(items, options);
  }
  return deps.showQuickPick(
    items as unknown as readonly SemanticDiffOutputModeItem[],
    options,
  ) as unknown as Thenable<SemanticDiffWorkflowQuickPickItem | undefined>;
};

type WorkflowQuickPickResult =
  | { kind: "selected"; item: SemanticDiffWorkflowQuickPickItem | undefined }
  | { kind: "failed" };

type WorkflowPickKind = SemanticDiffWorkflowQuickPickItem["workflowKind"];

const workflowPickItems = (
  entries: readonly (readonly [WorkflowPickKind, string])[],
): SemanticDiffWorkflowQuickPickItem[] =>
  entries.map(([workflowKind, label]) => ({ workflowKind, label }));

const workflowPickOptions = (
  placeHolder: string,
  title: string,
): vscode.QuickPickOptions => ({ placeHolder, title });

const selectWorkflowItem = async (
  deps: SemanticDiffCommandDeps,
  items: readonly SemanticDiffWorkflowQuickPickItem[],
  options: vscode.QuickPickOptions,
): Promise<WorkflowQuickPickResult> => {
  try {
    return {
      kind: "selected",
      item: await workflowQuickPick(deps, items, options),
    };
  } catch {
    return { kind: "failed" };
  }
};

type WorkflowSelectionOptions<T> = Readonly<{
  deps: SemanticDiffCommandDeps;
  items: readonly SemanticDiffWorkflowQuickPickItem[];
  options: vscode.QuickPickOptions;
  map: (item: SemanticDiffWorkflowQuickPickItem | undefined) => T;
}>;

export const selectWorkflowSelection = async <T>({
  deps,
  items,
  options,
  map,
}: WorkflowSelectionOptions<T>): Promise<
  T | { kind: "failed"; reason: "host" }
> => {
  const selection = await selectWorkflowItem(deps, items, options);
  return selection.kind === "failed"
    ? { kind: "failed", reason: "host" }
    : map(selection.item);
};

export type WorkflowSourceSelection =
  | { kind: "file" }
  | { kind: "git-head" }
  | { kind: "cancelled" }
  | { kind: "failed"; reason: "host" | "invalid" };

const sourceSelectionFromItem = (
  selected: SemanticDiffWorkflowQuickPickItem | undefined,
): WorkflowSourceSelection => {
  if (!selected) return { kind: "cancelled" };
  const sourceKind = {
    file: "file",
    "git-head": "git-head",
  }[selected.workflowKind as "file" | "git-head" | "invalid"];
  return sourceKind
    ? { kind: sourceKind as "file" | "git-head" }
    : { kind: "failed", reason: "invalid" };
};

export const selectWorkflowSource = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowSourceSelection> =>
  selectWorkflowSelection({
    deps,
    items: workflowPickItems([
      ["file", localization.selectDefinitionFile],
      ["git-head", localization.gitHead],
    ]),
    options: workflowPickOptions(
      localization.sourcePicker,
      localization.sourcePickerTitle,
    ),
    map: sourceSelectionFromItem,
  });

export const workflowCancellation = (
  localization: SemanticDiffCommandLocalization,
): CommandFailure => failedStep("cancelled", localization.cancelled, false);

export const selectionToStep = (
  selection: WorkflowSourceSelection,
  localization: SemanticDiffCommandLocalization,
): CommandStep<"file" | "git-head"> => {
  if (selection.kind === "cancelled") return workflowCancellation(localization);
  if (selection.kind === "failed") {
    return workflowSourceFailure(selection, localization);
  }
  return readyStep(selection.kind);
};

export const workflowSourceFailure = (
  selection: Extract<WorkflowSourceSelection, { kind: "failed" }>,
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  selection.reason === "host"
    ? failedStep("comparison-failed", localization.comparisonFailed)
    : failedStep("source-picker-failed", localization.sourcePickerFailed);
