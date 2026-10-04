import type { SemanticDiffOutputDocument } from "../../semantic-diff/report/semanticDiffOutput";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/panel/semanticDiffExplorerPanel";
import type {
  SemanticDiffCommandDeps,
  SemanticDiffCommandResult,
} from "./semanticDiffCommand";
import type { CommandStep } from "./semanticDiffCommandSteps";
import {
  runCalendarCompatibilityWorkflow,
  runFileComparisonWorkflow,
  type CalendarCompatibilityWorkflowDeps,
  type WorkflowExplorerResult,
} from "./semanticDiffCommandWorkflowArtifacts";
import {
  runExplorerCommand,
  type ExplorerCommandDeps,
} from "./semanticDiffCommandExplorerWorkflow";

export type SemanticDiffCommandExecution = (
  deps: SemanticDiffCommandDeps,
) => Promise<SemanticDiffCommandResult>;

type WorkflowRunnerDeps = CalendarCompatibilityWorkflowDeps;
type ExplorerRunnerDeps = ExplorerCommandDeps;
type ReportRunnerDeps = Pick<
  SemanticDiffCommandDeps,
  | "getActiveEditor"
  | "showQuickPick"
  | "showOpenDialog"
  | "openTextDocument"
  | "readFile"
  | "sourceHandleIdAllocator"
  | "beginSemanticDiffSourceCapture"
  | "openExplorer"
  | "buildSemanticDiffReportData"
  | "buildSemanticDiffOutputContext"
  | "presentSemanticDiffOutput"
  | "openReport"
  | "language"
>;
type FinalizationDeps = Pick<
  SemanticDiffCommandDeps,
  "showErrorMessage" | "language"
>;

type WorkflowRunner = (
  deps: WorkflowRunnerDeps,
) => Promise<CommandStep<WorkflowExplorerResult>>;

type ExplorerRunner = (
  deps: ExplorerRunnerDeps,
) => Promise<CommandStep<SemanticDiffExplorerSessionHandle>>;

type ExecutionHandlers = Readonly<{
  finalizeWorkflow: (
    deps: FinalizationDeps,
    step: CommandStep<WorkflowExplorerResult>,
  ) => Promise<SemanticDiffCommandResult>;
  finalizeExplorer: (
    deps: FinalizationDeps,
    step: CommandStep<SemanticDiffExplorerSessionHandle>,
  ) => Promise<SemanticDiffCommandResult>;
  finalizeReport: (
    deps: FinalizationDeps,
    step: CommandStep<SemanticDiffOutputDocument>,
  ) => Promise<SemanticDiffCommandResult>;
  runReport: (
    deps: ReportRunnerDeps,
  ) => Promise<CommandStep<SemanticDiffOutputDocument>>;
}>;

export const executeWorkflowCommand =
  (
    runner: WorkflowRunner,
    finalize: ExecutionHandlers["finalizeWorkflow"],
  ): SemanticDiffCommandExecution =>
  async (deps) =>
    finalize(deps, await runner(deps));

export const executeExplorerCommand =
  (
    runner: ExplorerRunner,
    finalize: ExecutionHandlers["finalizeExplorer"],
  ): SemanticDiffCommandExecution =>
  async (deps) =>
    finalize(deps, await runner(deps));

export const executeReportCommand =
  (
    handlers: Pick<ExecutionHandlers, "finalizeReport" | "runReport">,
  ): SemanticDiffCommandExecution =>
  async (deps) =>
    handlers.finalizeReport(deps, await handlers.runReport(deps));

const hasCalendarAdapter = (
  deps: Pick<
    SemanticDiffCommandDeps,
    | "buildSemanticDiffPresentationArtifacts"
    | "openScheduleAwareExplorerSession"
  >,
): boolean =>
  deps.buildSemanticDiffPresentationArtifacts !== undefined &&
  deps.openScheduleAwareExplorerSession !== undefined;

const selectCalendarRunner = (
  deps: Pick<SemanticDiffCommandDeps, "showWorkflowQuickPick" | "showInputBox">,
): WorkflowRunner =>
  deps.showWorkflowQuickPick !== undefined || deps.showInputBox !== undefined
    ? runFileComparisonWorkflow
    : runCalendarCompatibilityWorkflow;

const selectExecutionRunner = (
  deps: Pick<
    SemanticDiffCommandDeps,
    | "buildSemanticDiffPresentationArtifacts"
    | "openScheduleAwareExplorerSession"
    | "showWorkflowQuickPick"
    | "showInputBox"
    | "openExplorer"
  >,
  handlers: ExecutionHandlers,
): SemanticDiffCommandExecution => {
  if (hasCalendarAdapter(deps)) {
    return executeWorkflowCommand(
      selectCalendarRunner(deps),
      handlers.finalizeWorkflow,
    );
  }
  return deps.openExplorer
    ? executeExplorerCommand(runExplorerCommand, handlers.finalizeExplorer)
    : executeReportCommand(handlers);
};

export const commandExecution = (
  deps: Pick<
    SemanticDiffCommandDeps,
    | "buildSemanticDiffPresentationArtifacts"
    | "openScheduleAwareExplorerSession"
    | "showWorkflowQuickPick"
    | "showInputBox"
    | "openExplorer"
  >,
  handlers: ExecutionHandlers,
): SemanticDiffCommandExecution => selectExecutionRunner(deps, handlers);
