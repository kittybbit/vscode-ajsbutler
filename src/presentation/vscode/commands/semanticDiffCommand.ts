import type * as vscode from "vscode";
import type {
  GitHeadDefinitionResult,
  ReadGitHeadDefinition,
} from "../../../application/semantic-diff/GitHeadDefinitionSourcePort";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import type { SemanticDiffComparisonPeriod } from "../../../application/semantic-diff/semanticDiffDto";
import {
  parseSemanticDiffComparisonPeriod,
  type SemanticDiffComparisonPeriodInvalidReason,
} from "../../../application/semantic-diff/parseSemanticDiffComparisonPeriod";
import type {
  BuildSemanticDiffPresentationArtifacts,
  BuildSemanticDiffPresentationArtifactsInput,
  BuildSemanticDiffPresentationArtifactsResult,
  SemanticDiffPresentationArtifacts,
} from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffSourceHandleIdAllocator } from "../../../application/parsing/AjsParserWithSourceIndexPort";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
  SemanticDiffSourceCaptureFactory,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import { isSemanticDiffSourceCaptureError } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceCaptureEntry } from "../semantic-diff/source/semanticDiffExplorerSourceTypes";
import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffExplorerSessionId } from "../../../application/semantic-diff/semanticDiffExplorerDto";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/semanticDiffExplorerPanel";
import {
  readBeforeDefinitionStep,
  selectBeforeForCommand,
  selectModeForEditor,
} from "./semanticDiffCommandSelection";
import { readSemanticDiffActiveEditor } from "./semanticDiffCommandEditor";
import {
  buildSemanticDiffReportDataStep as buildReportDataStep,
  readSemanticDiffReportInputStep as readReportInputStep,
} from "./semanticDiffCommandBuild";
import {
  commandError,
  continueCommandStep,
  failedStep,
  mapCommandStep,
  readyStep,
  safeShowErrorMessage,
} from "./semanticDiffCommandSteps";
import type {
  CommandFailure,
  CommandReportData,
  CommandReportRequest,
  CommandStep,
  SemanticDiffCommandErrorCode,
  SemanticDiffCommandFailureResult,
} from "./semanticDiffCommandSteps";
import {
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputMode,
  type SemanticDiffOutputModeItem,
} from "../../semantic-diff/semanticDiffOutput";
import {
  getSemanticDiffCommandLocalization,
  localizeGitHeadUnavailableReason,
  type SemanticDiffCommandLocalization,
} from "./semanticDiffCommandLocalization";

export type SemanticDiffGitHeadSnapshotReservation = Readonly<{
  uri: vscode.Uri;
  release(): void;
}>;

export type SemanticDiffGitHeadSnapshotProvider = Readonly<{
  reserve(content: string):
    | Readonly<{
        kind: "reserved";
        reservation: SemanticDiffGitHeadSnapshotReservation;
      }>
    | Readonly<{
        kind: "unavailable";
        reason: "capacity-exceeded";
      }>;
}>;

export const COMPARE_SEMANTIC_DIFF_COMMAND = "ajsbutler.compareSemanticDiff";

export const MAX_SEMANTIC_DIFF_SOURCE_BYTES = 8 * 1024 * 1024;

export type SemanticDiffWorkflowQuickPickItem = Readonly<{
  workflowKind: "file" | "git-head" | "no-period" | "specify-period";
  label: string;
  description?: string;
}>;

export type SemanticDiffReportAction = "displayed";

export type SemanticDiffCommandResult =
  | {
      ok: true;
      sessionId: SemanticDiffExplorerSessionId;
      action: "explorer-opened";
      source: "file" | "git-head";
      period: "not-requested" | "evaluated";
    }
  | {
      ok: true;
      report: string;
      action: SemanticDiffReportAction;
    }
  | SemanticDiffCommandFailureResult;

export type SemanticDiffCommandDeps = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showQuickPick: (
    items: readonly SemanticDiffOutputModeItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffOutputModeItem | undefined>;
  showWorkflowQuickPick?: (
    items: readonly SemanticDiffWorkflowQuickPickItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffWorkflowQuickPickItem | undefined>;
  showInputBox?: (
    options?: vscode.InputBoxOptions,
  ) => Thenable<string | undefined>;
  showOpenDialog: (
    options: vscode.OpenDialogOptions,
  ) => Thenable<vscode.Uri[] | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  readFile: (uri: vscode.Uri) => Thenable<Uint8Array>;
  openTextDocument?: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  language?: string;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  buildSemanticDiffPresentationArtifacts?: BuildSemanticDiffPresentationArtifacts;
  readGitHeadDefinition?: ReadGitHeadDefinition;
  gitHeadSnapshotProvider?: SemanticDiffGitHeadSnapshotProvider;
  scheduleComparisonPeriod?: SemanticDiffComparisonPeriod;
  beginSemanticDiffSourceCapture?: SemanticDiffSourceCaptureFactory;
  sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator;
  registerSemanticDiffSourceCapture?: (
    context: SemanticDiffOutputContext,
    entry: SemanticDiffSourceCaptureEntry,
  ) => void;
  unregisterSemanticDiffSourceCapture?: (
    context: SemanticDiffOutputContext,
  ) => void;
  buildSemanticDiffOutputContext?: (
    result: Parameters<typeof buildSemanticDiffOutputContext>[0],
  ) => SemanticDiffOutputContext;
  openExplorer?: (
    context: SemanticDiffOutputContext,
  ) => Promise<SemanticDiffExplorerSessionHandle>;
  openScheduleAwareExplorerSession?: (
    artifacts: SemanticDiffPresentationArtifacts,
  ) => Promise<SemanticDiffExplorerSessionHandle>;
  presentSemanticDiffOutput?: (
    context: SemanticDiffOutputContext,
    mode: SemanticDiffOutputMode,
    language?: string,
  ) => SemanticDiffOutputDocument;
};

type CommandReadyReport = Extract<
  ReturnType<BuildSemanticDiffReportData>,
  { ok: true }
>["result"];

type CommandReadyExplorer = {
  readonly result: CommandReadyReport;
  readonly context: SemanticDiffOutputContext;
  readonly sourceCaptureRelease?: () => void;
  readonly presentation?: SemanticDiffPresentationArtifacts;
};

type SourceBinding = Extract<SemanticDiffSourceCaptureBindResult, { ok: true }>;

type SourceBindingStep = CommandStep<void>;
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

const prepareAndValidateSourceBinding = (
  options: SourceBindingOptions,
): PreparedSourceBindingStep => {
  const capture = options.request.sourceCapture;
  if (!capture) {
    return readyStep(undefined);
  }
  const prepared = prepareSourceBinding(capture, options.context);
  return prepared.kind === "failed"
    ? prepared
    : validateSourceBinding(options, prepared.value);
};

const rollbackFailedBinding = (
  options: SourceBindingOptions,
  step: SourceBindingStep,
): SourceBindingStep => {
  if (step.kind === "failed") {
    rollbackSourceCapture(options);
  }
  return step;
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

const registerSourceBinding = (
  options: SourceBindingOptions,
  binding: SourceBinding,
): SourceBindingStep => {
  try {
    const sources = options.request.sourceDescriptors;
    if (
      sources === undefined ||
      !options.deps.registerSemanticDiffSourceCapture
    ) {
      return sourceBindingFailure(
        "Semantic diff source targets could not be registered.",
      );
    }
    const entry: SemanticDiffSourceCaptureEntry = {
      binding,
      sources,
      release: options.releaseSourceCapture,
    };
    options.deps.registerSemanticDiffSourceCapture(options.context, entry);
    return readyStep(undefined);
  } catch {
    return sourceBindingFailure(
      "Semantic diff source targets could not be registered.",
    );
  }
};

const bindAndRegisterExplorerSources = (
  options: SourceBindingOptions,
): SourceBindingStep => {
  const prepared = prepareAndValidateSourceBinding(options);
  if (prepared.kind === "failed") {
    return rollbackFailedBinding(options, prepared);
  }
  if (!prepared.value) {
    return readyStep(undefined);
  }
  return rollbackFailedBinding(
    options,
    registerSourceBinding(options, prepared.value),
  );
};

const createSourceCaptureRelease = (
  sourceCapture: SemanticDiffSourceCapture | undefined,
): (() => void) => {
  let released = false;
  return (): void => {
    if (released) return;
    released = true;
    sourceCapture?.release();
  };
};

type PresentationCommandData = CommandReportData & {
  readonly result: CommandReadyReport;
  readonly presentation: SemanticDiffPresentationArtifacts;
};

type WorkflowSourceDescriptor = ImmutableSourceDescriptor & {
  uri: vscode.Uri;
};

type WorkflowExplorerResult = {
  handle: SemanticDiffExplorerSessionHandle;
  source: "file" | "git-head";
  period: "not-requested" | "evaluated";
};

type WorkflowAfterSnapshot = {
  uri: vscode.Uri;
  version: number | null;
  text: string;
};

type WorkflowSourceRequest = {
  after: WorkflowAfterSnapshot;
  before: WorkflowSourceDescriptor;
  source: "file" | "git-head";
  providerReservation?: SemanticDiffGitHeadSnapshotReservation;
};

type WorkflowArtifactState = {
  artifacts: SemanticDiffPresentationArtifacts;
  capture: SemanticDiffSourceCapture;
  sources: {
    before: WorkflowSourceDescriptor;
    after: WorkflowSourceDescriptor;
  };
  source: "file" | "git-head";
  period: "not-requested" | "evaluated";
  release: () => void;
};

const workflowFailure = failedStep;

const unregisterAndReleaseWorkflowCapture = (
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

type SourceValidationFailure = Readonly<{
  code: SemanticDiffCommandErrorCode;
  message: string;
}>;

const sourceTextFailureDetail = (
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): SourceValidationFailure => ({
  code: side === "after" ? "after-non-text" : "before-file-non-text",
  message:
    side === "after"
      ? localization.afterNonText
      : localization.beforeFileNonText,
});

const sourceSizeFailureDetail = (
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): SourceValidationFailure => ({
  code: side === "after" ? "after-too-large" : "before-file-too-large",
  message:
    side === "after"
      ? localization.afterTooLarge
      : localization.beforeFileTooLarge,
});

const sourceValidationFailure = (
  text: string,
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): SourceValidationFailure | undefined => {
  if (text.includes("\u0000")) {
    return sourceTextFailureDetail(side, localization);
  }
  return new TextEncoder().encode(text).byteLength >
    MAX_SEMANTIC_DIFF_SOURCE_BYTES
    ? sourceSizeFailureDetail(side, localization)
    : undefined;
};

const sourceTextFailure = (
  text: string,
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined => {
  const detail = sourceValidationFailure(text, side, localization);
  return detail ? workflowFailure(detail.code, detail.message) : undefined;
};

type ParseFailureKind = "before" | "after" | "both" | "none";

const parseFailureKind = (
  result: Extract<BuildSemanticDiffPresentationArtifactsResult, { ok: false }>,
): ParseFailureKind => {
  const failedSides =
    Number(result.errors.before.length > 0) +
    Number(result.errors.after.length > 0) * 2;
  return (["none", "before", "after", "both"] as const)[
    failedSides
  ] as ParseFailureKind;
};

const parseFailureMessage = (
  result: Extract<BuildSemanticDiffPresentationArtifactsResult, { ok: false }>,
  localization: SemanticDiffCommandLocalization,
): string => {
  const messages: Record<ParseFailureKind, string> = {
    before: localization.parseFailedBefore,
    after: localization.parseFailedAfter,
    both: localization.parseFailedBoth,
    none: localization.parseFailed,
  };
  return messages[parseFailureKind(result)];
};

const readWorkflowEditor = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandStep<vscode.TextEditor> => {
  try {
    const activeEditor = deps.getActiveEditor();
    return activeEditor
      ? readyStep(activeEditor)
      : workflowFailure("no-active-editor", localization.noActiveEditor);
  } catch {
    return workflowFailure(
      "active-editor-failed",
      localization.activeEditorFailed,
    );
  }
};

const snapshotFromWorkflowEditor = (
  editor: vscode.TextEditor,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  try {
    const document = editor.document;
    const text = document.getText();
    return describeWorkflowAfter(document, text, localization);
  } catch {
    return workflowFailure(
      "active-editor-failed",
      localization.activeEditorFailed,
    );
  }
};

const describeWorkflowAfter = (
  document: vscode.TextDocument,
  text: string,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  const textStep = validateWorkflowAfterText(text, localization);
  return textStep.kind === "failed"
    ? textStep
    : workflowAfterSnapshot(document, textStep.value, localization);
};

const validateWorkflowAfterText = (
  text: string,
  localization: SemanticDiffCommandLocalization,
): CommandStep<string> => {
  const failure = sourceTextFailure(text, "after", localization);
  return failure ? failure : readyStep(text);
};

const workflowAfterSnapshot = (
  document: vscode.TextDocument,
  text: string,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  if (!document.uri) {
    return workflowFailure(
      "active-editor-failed",
      localization.activeEditorFailed,
    );
  }
  return readyStep({
    uri: document.uri,
    version: typeof document.version === "number" ? document.version : null,
    text,
  });
};

const readWorkflowAfterSnapshot = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  const editorStep = readWorkflowEditor(deps, localization);
  return editorStep.kind === "failed"
    ? editorStep
    : snapshotFromWorkflowEditor(editorStep.value, localization);
};

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

const selectWorkflowSelection = async <T>({
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

type WorkflowSourceSelection =
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

const selectWorkflowSource = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowSourceSelection> => {
  return selectWorkflowSelection({
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
};

type WorkflowPeriodSelection =
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

const workflowCancellation = (
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  workflowFailure("cancelled", localization.cancelled, false);

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
): Promise<WorkflowPeriodMode> => {
  return selectWorkflowSelection({
    deps,
    items: workflowPickItems([
      ["no-period", localization.noSchedulePeriod],
      ["specify-period", localization.specifySchedulePeriod],
    ]),
    options: workflowPickOptions(
      localization.periodPicker,
      localization.periodPickerTitle,
    ),
    map: periodModeFromItem,
  });
};

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
    ? workflowFailure("comparison-failed", localization.comparisonFailed)
    : workflowFailure(
        "comparison-failed",
        periodValidationMessage(localization, selection.reason),
      );

const workflowSourceFailure = (
  selection: Extract<WorkflowSourceSelection, { kind: "failed" }>,
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  selection.reason === "host"
    ? workflowFailure("comparison-failed", localization.comparisonFailed)
    : workflowFailure("source-picker-failed", localization.sourcePickerFailed);

const readWorkflowBefore = async (
  deps: SemanticDiffCommandDeps,
  uri: vscode.Uri,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceDescriptor>> => {
  if (!deps.openTextDocument) {
    return workflowFailure(
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
  deps: SemanticDiffCommandDeps,
  uri: vscode.Uri,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<vscode.TextDocument>> => {
  try {
    return readyStep(await deps.openTextDocument!(uri));
  } catch {
    return workflowFailure(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

type WorkflowBeforeDescription = Readonly<{
  deps: SemanticDiffCommandDeps;
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
    return workflowFailure(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

const selectWorkflowFile = async (
  deps: SemanticDiffCommandDeps,
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
    return workflowFailure(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

const readWorkflowSourceFile = async (
  deps: SemanticDiffCommandDeps,
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
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined =>
  deps.readGitHeadDefinition
    ? undefined
    : workflowFailure(
        "git-head-unavailable",
        localization.gitHeadUnavailable,
        true,
        "extension-missing",
      );

const missingGitHeadProvider = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined =>
  deps.gitHeadSnapshotProvider
    ? undefined
    : workflowFailure(
        "git-head-unavailable",
        localization.gitHeadUnavailable,
        true,
        "api-unavailable",
      );

const gitHeadDependencyFailure = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined =>
  missingGitHeadReader(deps, localization) ??
  missingGitHeadProvider(deps, localization);

const readGitHeadResult = async (
  readGitHeadDefinition: NonNullable<
    SemanticDiffCommandDeps["readGitHeadDefinition"]
  >,
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
    return workflowFailure(
      "git-head-unavailable",
      localizeGitHeadUnavailableReason(localization, result.reason),
      true,
      result.reason,
    );
  }
  return result.ref === "HEAD"
    ? readyStep(result)
    : workflowFailure(
        "git-head-unavailable",
        localization.gitHeadUnavailable,
        true,
        "api-unavailable",
      );
};

type GitHeadWorkflowOptions = Readonly<{
  deps: SemanticDiffCommandDeps;
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
    return workflowFailure(
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
    return workflowFailure(
      "git-head-unavailable",
      localization.gitHeadReadFailed,
      true,
      "read-failed",
    );
  }
};

const readWorkflowGitHead = async (
  deps: SemanticDiffCommandDeps,
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

const prepareWorkflowSource = async (
  deps: SemanticDiffCommandDeps,
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

const selectionToStep = (
  selection: WorkflowSourceSelection,
  localization: SemanticDiffCommandLocalization,
): CommandStep<"file" | "git-head"> => {
  if (selection.kind === "cancelled") return workflowCancellation(localization);
  if (selection.kind === "failed")
    return workflowSourceFailure(selection, localization);
  return readyStep(selection.kind);
};

const beginWorkflowCapture = (
  deps: SemanticDiffCommandDeps,
  source: WorkflowSourceRequest,
  localization: SemanticDiffCommandLocalization,
): CommandStep<{
  before: WorkflowSourceDescriptor;
  after: WorkflowSourceDescriptor;
  capture: SemanticDiffSourceCapture;
}> => {
  if (
    !deps.beginSemanticDiffSourceCapture ||
    !deps.buildSemanticDiffPresentationArtifacts
  ) {
    source.providerReservation?.release();
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  try {
    const after: WorkflowSourceDescriptor = {
      side: "after",
      sourceHandleId: deps.sourceHandleIdAllocator(),
      text: source.after.text,
      version: source.after.version,
      uri: source.after.uri,
    };
    const capture = deps.beginSemanticDiffSourceCapture({
      before: {
        side: source.before.side,
        sourceHandleId: source.before.sourceHandleId,
        text: source.before.text,
        version: source.before.version,
      },
      after: {
        side: after.side,
        sourceHandleId: after.sourceHandleId,
        text: after.text,
        version: after.version,
      },
    });
    return readyStep({ before: source.before, after, capture });
  } catch {
    source.providerReservation?.release();
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
};

const buildWorkflowArtifacts = (
  deps: SemanticDiffCommandDeps,
  source: WorkflowSourceRequest,
  selection: Extract<
    WorkflowPeriodSelection,
    { kind: "not-requested" | "evaluated" }
  >,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowArtifactState> => {
  const captureStep = beginWorkflowCapture(deps, source, localization);
  if (captureStep.kind === "failed") return captureStep;
  const releaseSourceCapture = createSourceCaptureRelease(
    captureStep.value.capture,
  );
  let released = false;
  const release = (): void => {
    if (released) return;
    released = true;
    releaseSourceCapture();
    source.providerReservation?.release();
  };
  const input: BuildSemanticDiffPresentationArtifactsInput =
    selection.kind === "evaluated"
      ? {
          beforeContent: source.before.text,
          afterContent: captureStep.value.after.text,
          options: { scheduleComparisonPeriod: selection.period },
        }
      : {
          beforeContent: source.before.text,
          afterContent: captureStep.value.after.text,
        };
  try {
    const result = deps.buildSemanticDiffPresentationArtifacts!(
      input,
      captureStep.value.capture.parser,
    );
    if ("ok" in result && result.ok === false) {
      release();
      return workflowFailure(
        "parse-failed",
        parseFailureMessage(result, localization),
      );
    }
    return readyStep({
      artifacts: result as SemanticDiffPresentationArtifacts,
      capture: captureStep.value.capture,
      sources: {
        before: captureStep.value.before,
        after: captureStep.value.after,
      },
      source: source.source,
      period: selection.kind === "evaluated" ? "evaluated" : "not-requested",
      release,
    });
  } catch (error: unknown) {
    release();
    return workflowFailure(
      isSemanticDiffSourceCaptureError(error)
        ? "source-capture-failed"
        : "comparison-failed",
      isSemanticDiffSourceCaptureError(error)
        ? localization.sourceCaptureFailed
        : localization.comparisonFailed,
    );
  }
};

const bindWorkflowCapture = (
  state: WorkflowArtifactState,
  localization: SemanticDiffCommandLocalization,
): CommandStep<SourceBinding> => {
  try {
    const binding = state.capture.bind(state.artifacts.context);
    return binding.ok
      ? readyStep(binding)
      : workflowFailure(
          "source-capture-failed",
          localization.sourceCaptureFailed,
        );
  } catch {
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
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
  if (!deps.registerSemanticDiffSourceCapture) {
    state.release();
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  const entry: SemanticDiffSourceCaptureEntry = {
    binding: binding.value,
    sources: state.sources,
    release: state.release,
  };
  try {
    deps.registerSemanticDiffSourceCapture(state.artifacts.context, entry);
  } catch {
    unregisterAndReleaseWorkflowCapture(
      deps,
      state.artifacts.context,
      state.release,
    );
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  if (!deps.openScheduleAwareExplorerSession) {
    unregisterAndReleaseWorkflowCapture(
      deps,
      state.artifacts.context,
      state.release,
    );
    return workflowFailure(
      "explorer-open-failed",
      localization.explorerOpenFailed,
    );
  }
  try {
    const handle = await deps.openScheduleAwareExplorerSession(state.artifacts);
    return readyStep({
      handle,
      source: state.source,
      period: state.period,
    });
  } catch {
    unregisterAndReleaseWorkflowCapture(
      deps,
      state.artifacts.context,
      state.release,
    );
    return workflowFailure(
      "explorer-open-failed",
      localization.explorerOpenFailed,
    );
  }
};

const runFileComparisonWorkflow = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareWorkflowSource(deps, after, localization),
  );
  const periodStep = await continueCommandStep(sourceStep, async (source) => {
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
  });
  const artifactStep = await continueCommandStep(
    periodStep,
    ({ source, selection }) =>
      buildWorkflowArtifacts(deps, source, selection, localization),
  );
  return continueCommandStep(artifactStep, (state) =>
    openWorkflowArtifacts(deps, state, localization),
  );
};

const prepareCalendarCompatibilitySource = async (
  deps: SemanticDiffCommandDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> =>
  readWorkflowSourceFile(deps, after, localization);

const runCalendarCompatibilityWorkflow = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareCalendarCompatibilitySource(deps, after, localization),
  );
  const selection: Extract<
    WorkflowPeriodSelection,
    { kind: "not-requested" | "evaluated" }
  > =
    deps.scheduleComparisonPeriod === undefined
      ? { kind: "not-requested" }
      : { kind: "evaluated", period: deps.scheduleComparisonPeriod };
  const artifactStep = await continueCommandStep(sourceStep, (source) =>
    buildWorkflowArtifacts(deps, source, selection, localization),
  );
  return continueCommandStep(artifactStep, (state) =>
    openWorkflowArtifacts(deps, state, localization),
  );
};

const beginPresentationSourceCapture = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): SemanticDiffSourceCapture | undefined => {
  if (!deps.beginSemanticDiffSourceCapture) return undefined;
  if (request.beforeUri === undefined || request.afterUri === undefined) {
    throw new Error("Source capture requires source URIs.");
  }
  const before: ImmutableSourceDescriptor & { uri: vscode.Uri } = {
    side: "before",
    sourceHandleId: deps.sourceHandleIdAllocator(),
    text: request.input.beforeContent,
    version: request.beforeVersion,
    uri: request.beforeUri,
  };
  const after: ImmutableSourceDescriptor & { uri: vscode.Uri } = {
    side: "after",
    sourceHandleId: deps.sourceHandleIdAllocator(),
    text: request.input.afterContent,
    version: request.afterVersion,
    uri: request.afterUri,
  };
  request.sourceDescriptors = { before, after };
  return deps.beginSemanticDiffSourceCapture({
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
};

const buildPresentationArtifactsStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): CommandStep<PresentationCommandData> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const adapter = deps.buildSemanticDiffPresentationArtifacts;
  if (!adapter) {
    return failedStep(
      "display-failed",
      "Semantic diff calendar artifacts could not be prepared.",
      true,
    );
  }
  let sourceCapture: SemanticDiffSourceCapture | undefined;
  try {
    sourceCapture = beginPresentationSourceCapture(deps, request);
    const input: BuildSemanticDiffPresentationArtifactsInput =
      deps.scheduleComparisonPeriod === undefined
        ? request.input
        : {
            ...request.input,
            options: {
              scheduleComparisonPeriod: deps.scheduleComparisonPeriod,
            },
          };
    const result = adapter(input, sourceCapture?.parser);
    if ("ok" in result && result.ok === false) {
      sourceCapture?.release();
      return failedStep(
        "parse-failed",
        parseFailureMessage(result, localization),
        true,
      );
    }
    const presentation = result as SemanticDiffPresentationArtifacts;
    return readyStep({
      ...request,
      result: presentation.context.result,
      presentation,
      sourceCapture,
    });
  } catch (error: unknown) {
    sourceCapture?.release();
    return failedStep(
      isSemanticDiffSourceCaptureError(error)
        ? "display-failed"
        : "parse-failed",
      isSemanticDiffSourceCaptureError(error)
        ? "Semantic diff source capture could not be established."
        : localization.parseFailed,
      true,
    );
  }
};

const createExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  result: CommandReadyReport,
  releaseSourceCapture: () => void,
): CommandStep<SemanticDiffOutputContext> => {
  try {
    const createContext =
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
    return readyStep(createContext(result));
  } catch {
    releaseSourceCapture();
    return failedStep(
      "render-failed",
      "Semantic diff report could not be prepared.",
      true,
    );
  }
};

const buildExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & {
    result: CommandReadyReport;
    presentation?: SemanticDiffPresentationArtifacts;
  },
): CommandStep<CommandReadyExplorer> => {
  const releaseSourceCapture = createSourceCaptureRelease(
    request.sourceCapture,
  );
  const contextStep = request.presentation
    ? readyStep(request.presentation.context)
    : createExplorerContextStep(deps, request.result, releaseSourceCapture);
  if (contextStep.kind === "failed") return contextStep;
  const bindingStep = bindAndRegisterExplorerSources({
    deps,
    request,
    context: contextStep.value,
    releaseSourceCapture,
  });
  return bindingStep.kind === "failed"
    ? bindingStep
    : readyStep({
        result: request.result,
        context: contextStep.value,
        presentation: request.presentation,
        sourceCaptureRelease: releaseSourceCapture,
      });
};

const openExplorerStep = async (
  deps: SemanticDiffCommandDeps,
  request: CommandReadyExplorer,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  if (request.presentation && deps.openScheduleAwareExplorerSession) {
    try {
      return readyStep(
        await deps.openScheduleAwareExplorerSession(request.presentation),
      );
    } catch {
      deps.unregisterSemanticDiffSourceCapture?.(request.context);
      request.sourceCaptureRelease?.();
      return failedStep(
        "display-failed",
        "Semantic diff Explorer could not be opened.",
        true,
      );
    }
  }
  if (!deps.openExplorer) {
    request.sourceCaptureRelease?.();
    return failedStep(
      "display-failed",
      "Semantic diff Explorer could not be opened.",
      true,
    );
  }
  try {
    return readyStep(await deps.openExplorer(request.context));
  } catch {
    deps.unregisterSemanticDiffSourceCapture?.(request.context);
    request.sourceCaptureRelease?.();
    return failedStep(
      "display-failed",
      "Semantic diff Explorer could not be opened.",
      true,
    );
  }
};

const selectExplorerBefore = async (
  deps: SemanticDiffCommandDeps,
  activeEditor: vscode.TextEditor,
): Promise<CommandStep<CommandReportRequest>> => {
  return mapCommandStep(
    await readBeforeDefinitionStep(deps),
    (beforeDefinition): CommandReportRequest => ({
      activeEditor,
      mode: "full" as SemanticDiffOutputMode,
      beforeContent: beforeDefinition.content,
      beforeUri: beforeDefinition.uri,
      beforeVersion: beforeDefinition.version,
      afterUri: activeEditor.document.uri,
      afterVersion:
        typeof activeEditor.document.version === "number"
          ? activeEditor.document.version
          : null,
    }),
  );
};

const runExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  const activeEditor = readSemanticDiffActiveEditor(deps);
  const beforeDefinition = await continueCommandStep(activeEditor, (editor) =>
    selectExplorerBefore(deps, editor),
  );
  const reportInput = await continueCommandStep(beforeDefinition, (request) =>
    readReportInputStep(request),
  );
  const reportData = await continueCommandStep(reportInput, (request) =>
    deps.buildSemanticDiffPresentationArtifacts &&
    deps.openScheduleAwareExplorerSession
      ? buildPresentationArtifactsStep(deps, request)
      : buildReportDataStep(deps, request),
  );
  const context = await continueCommandStep(reportData, (request) =>
    buildExplorerContextStep(deps, request),
  );
  return continueCommandStep(context, (request) =>
    openExplorerStep(deps, request),
  );
};

const renderReportStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & { result: CommandReadyReport },
): CommandStep<SemanticDiffOutputDocument> => {
  let step: CommandStep<SemanticDiffOutputDocument>;
  try {
    const createContext =
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
    const present = deps.presentSemanticDiffOutput ?? presentSemanticDiffOutput;
    const context = createContext(request.result);
    step = readyStep(present(context, request.mode, deps.language));
  } catch {
    step = failedStep(
      "render-failed",
      "Semantic diff report could not be rendered.",
      true,
    );
  }
  return step;
};

const displayReportStep = async (
  deps: SemanticDiffCommandDeps,
  output: SemanticDiffOutputDocument,
): Promise<CommandStep<SemanticDiffOutputDocument>> => {
  let step: CommandStep<SemanticDiffOutputDocument>;
  try {
    await deps.openReport(output);
    step = readyStep(output);
  } catch {
    step = failedStep(
      "display-failed",
      "Semantic diff report could not be displayed.",
      true,
    );
  }
  return step;
};

const runSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffOutputDocument>> => {
  const activeEditor = readSemanticDiffActiveEditor(deps);
  const selectedMode = await continueCommandStep(activeEditor, (editor) =>
    selectModeForEditor(deps, editor),
  );
  const beforeDefinition = await continueCommandStep(
    selectedMode,
    (selection) => selectBeforeForCommand(deps, selection),
  );
  const reportInput = await continueCommandStep(beforeDefinition, (request) =>
    readReportInputStep(request),
  );
  const reportData = await continueCommandStep(reportInput, (request) =>
    buildReportDataStep(deps, request),
  );
  const output = await continueCommandStep(reportData, (request) =>
    renderReportStep(deps, request),
  );
  return continueCommandStep(output, (report) =>
    displayReportStep(deps, report),
  );
};

const finalizeCommandFailure = async (
  deps: SemanticDiffCommandDeps,
  failure: CommandFailure["error"],
): Promise<SemanticDiffCommandResult> => {
  const message =
    failure.code === "cancelled"
      ? getSemanticDiffCommandLocalization(deps.language).cancelled
      : failure.message;
  if (failure.notify) {
    await safeShowErrorMessage(deps, message);
  }
  return commandError(failure.code, message, failure.reason);
};

const finalizeSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
  step: CommandStep<SemanticDiffOutputDocument>,
): Promise<SemanticDiffCommandResult> =>
  step.kind === "failed"
    ? finalizeCommandFailure(deps, step.error)
    : { ok: true, report: step.value.content, action: "displayed" };

const finalizeExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
  step: CommandStep<SemanticDiffExplorerSessionHandle>,
): Promise<SemanticDiffCommandResult> =>
  step.kind === "failed"
    ? finalizeCommandFailure(deps, step.error)
    : {
        ok: true,
        action: "explorer-opened",
        sessionId: step.value.sessionId,
        source: "file",
        period: "not-requested",
      };

const finalizeWorkflowExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
  step: CommandStep<WorkflowExplorerResult>,
): Promise<SemanticDiffCommandResult> =>
  step.kind === "failed"
    ? finalizeCommandFailure(deps, step.error)
    : {
        ok: true,
        action: "explorer-opened",
        sessionId: step.value.handle.sessionId,
        source: step.value.source,
        period: step.value.period,
      };

export const executeCompareSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<SemanticDiffCommandResult> => {
  const hasCalendarAdapter =
    deps.buildSemanticDiffPresentationArtifacts !== undefined &&
    deps.openScheduleAwareExplorerSession !== undefined;
  const hasWorkflowUi =
    deps.showWorkflowQuickPick !== undefined || deps.showInputBox !== undefined;
  if (hasCalendarAdapter && hasWorkflowUi) {
    return finalizeWorkflowExplorerCommand(
      deps,
      await runFileComparisonWorkflow(deps),
    );
  }
  if (hasCalendarAdapter && !hasWorkflowUi) {
    return finalizeWorkflowExplorerCommand(
      deps,
      await runCalendarCompatibilityWorkflow(deps),
    );
  }
  return deps.openExplorer
    ? finalizeExplorerCommand(deps, await runExplorerCommand(deps))
    : finalizeSemanticDiffCommand(deps, await runSemanticDiffCommand(deps));
};
