import type * as vscode from "vscode";
import type { SemanticDiffComparisonPeriod } from "../../../application/semantic-diff/semanticDiffDto";
import {
  parseSemanticDiffComparisonPeriod,
  type SemanticDiffComparisonPeriodInvalidReason,
} from "../../../application/semantic-diff/parseSemanticDiffComparisonPeriod";
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
import {
  selectWorkflowSelection,
  workflowCancellation,
} from "./semanticDiffCommandWorkflowSelection";
import type { WorkflowSourceRequest } from "./semanticDiffCommandWorkflowSource";

export type WorkflowPeriodSelection =
  | { kind: "not-requested" }
  | { kind: "evaluated"; period: SemanticDiffComparisonPeriod }
  | { kind: "cancelled" }
  | {
      kind: "failed";
      reason: "invalid-from" | "invalid-to" | "non-increasing" | "host";
    };

const periodValidationMessage = (
  localization: SemanticDiffCommandLocalization,
  reason: SemanticDiffComparisonPeriodInvalidReason,
): string => {
  switch (reason) {
    case "invalid-from":
      return localization.invalidFromDate;
    case "invalid-to":
      return localization.invalidToDate;
    case "non-increasing":
      return localization.nonIncreasingPeriod;
  }
};

const showWorkflowInput = (
  deps: SemanticDiffCommandDeps,
  options: vscode.InputBoxOptions,
): Thenable<string | undefined> =>
  deps.showInputBox ? deps.showInputBox(options) : Promise.resolve(undefined);

type WorkflowPeriodMode =
  | { kind: "not-requested" }
  | { kind: "specify-period" }
  | { kind: "cancelled" }
  | { kind: "failed"; reason: "invalid-from" | "host" };

const periodModeFromItem = (
  selected: SemanticDiffWorkflowQuickPickItem | undefined,
): WorkflowPeriodMode => {
  if (!selected) return { kind: "cancelled" };
  const mode = {
    "no-period": "not-requested",
    "specify-period": "specify-period",
  }[selected.workflowKind as "no-period" | "specify-period" | "invalid"];
  return mode
    ? { kind: mode as "not-requested" | "specify-period" }
    : { kind: "failed", reason: "invalid-from" };
};

const selectWorkflowPeriodMode = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowPeriodMode> =>
  selectWorkflowSelection({
    deps,
    items: [
      { workflowKind: "no-period", label: localization.noSchedulePeriod },
      {
        workflowKind: "specify-period",
        label: localization.specifySchedulePeriod,
      },
    ],
    options: {
      placeHolder: localization.periodPicker,
      title: localization.periodPickerTitle,
    },
    map: periodModeFromItem,
  });

const workflowFromDateOptions = (
  localization: SemanticDiffCommandLocalization,
): vscode.InputBoxOptions => ({
  title: localization.fromDateTitle,
  prompt: localization.fromDatePrompt,
  placeHolder: localization.datePlaceholder,
  validateInput: (value) => {
    const parsed = parseSemanticDiffComparisonPeriod({
      from: value,
      to: "9999-12-31",
    });
    return parsed.kind === "invalid" && parsed.reason === "invalid-from"
      ? localization.invalidFromDate
      : undefined;
  },
});

const workflowToDateOptions = (
  from: string,
  localization: SemanticDiffCommandLocalization,
): vscode.InputBoxOptions => ({
  title: localization.toDateTitle,
  prompt: localization.toDatePrompt,
  placeHolder: localization.datePlaceholder,
  validateInput: (value) => {
    const parsed = parseSemanticDiffComparisonPeriod({ from, to: value });
    return parsed.kind === "invalid"
      ? periodValidationMessage(localization, parsed.reason)
      : undefined;
  },
});

const readWorkflowDate = (
  deps: SemanticDiffCommandDeps,
  options: vscode.InputBoxOptions,
): Thenable<string | undefined> => showWorkflowInput(deps, options);

type WorkflowPeriodInputs =
  | { kind: "ready"; from: string; to: string }
  | { kind: "cancelled" }
  | { kind: "unavailable" };

const periodInputsFromValues = (
  from: string | undefined,
  to: string | undefined,
): WorkflowPeriodInputs =>
  from === undefined || to === undefined
    ? { kind: "cancelled" }
    : { kind: "ready", from, to };

const readWorkflowPeriodValues = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<Readonly<{ from?: string; to?: string }>> => {
  const from = await readWorkflowDate(
    deps,
    workflowFromDateOptions(localization),
  );
  const to =
    from === undefined
      ? undefined
      : await readWorkflowDate(deps, workflowToDateOptions(from, localization));
  return { from, to };
};

const readWorkflowPeriodInputs = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowPeriodInputs> => {
  const values = await readWorkflowPeriodValues(deps, localization);
  return deps.showInputBox
    ? periodInputsFromValues(values.from, values.to)
    : { kind: "unavailable" };
};

const periodSelectionFromDates = (
  from: string,
  to: string,
): WorkflowPeriodSelection => {
  const parsed = parseSemanticDiffComparisonPeriod({ from, to });
  return parsed.kind === "valid"
    ? { kind: "evaluated", period: parsed.period }
    : { kind: "failed", reason: parsed.reason };
};

const PERIOD_INPUT_FAILURES: Record<
  "cancelled" | "unavailable",
  WorkflowPeriodSelection
> = {
  cancelled: { kind: "cancelled" },
  unavailable: { kind: "failed", reason: "invalid-from" },
};

const periodSelectionFromInputs = (
  inputs: WorkflowPeriodInputs,
): WorkflowPeriodSelection =>
  inputs.kind === "ready"
    ? periodSelectionFromDates(inputs.from, inputs.to)
    : PERIOD_INPUT_FAILURES[inputs.kind];

const readWorkflowPeriodDates = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowPeriodSelection> =>
  periodSelectionFromInputs(await readWorkflowPeriodInputs(deps, localization));

const selectWorkflowPeriod = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowPeriodSelection> => {
  const mode = await selectWorkflowPeriodMode(deps, localization);
  if (mode.kind !== "specify-period") return mode;
  try {
    return await readWorkflowPeriodDates(deps, localization);
  } catch {
    return { kind: "failed", reason: "host" };
  }
};

const workflowPeriodFailure = (
  selection: Extract<WorkflowPeriodSelection, { kind: "failed" }>,
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  selection.reason === "host"
    ? failedStep("comparison-failed", localization.comparisonFailed)
    : failedStep(
        "comparison-failed",
        periodValidationMessage(localization, selection.reason),
      );

export const selectWorkflowPeriodStep = async (
  deps: SemanticDiffCommandDeps,
  source: WorkflowSourceRequest,
  localization: SemanticDiffCommandLocalization,
): Promise<
  CommandStep<{
    source: WorkflowSourceRequest;
    selection: Extract<
      WorkflowPeriodSelection,
      { kind: "not-requested" | "evaluated" }
    >;
  }>
> => {
  const selection = await selectWorkflowPeriod(deps, localization);
  if (selection.kind === "cancelled") {
    source.providerReservation?.release();
    return workflowCancellation(localization);
  }
  if (selection.kind === "failed") {
    source.providerReservation?.release();
    return workflowPeriodFailure(selection, localization);
  }
  return readyStep({ source, selection });
};
