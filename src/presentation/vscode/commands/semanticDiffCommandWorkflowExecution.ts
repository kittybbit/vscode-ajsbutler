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
  type WorkflowExplorerResult,
} from "./semanticDiffCommandWorkflowArtifacts";
import { runExplorerCommand } from "./semanticDiffCommandExplorerWorkflow";

export type SemanticDiffCommandExecution = (
  deps: SemanticDiffCommandDeps,
) => Promise<SemanticDiffCommandResult>;

type WorkflowRunner = (
  deps: SemanticDiffCommandDeps,
) => Promise<CommandStep<WorkflowExplorerResult>>;

type ExplorerRunner = (
  deps: SemanticDiffCommandDeps,
) => Promise<CommandStep<SemanticDiffExplorerSessionHandle>>;

type ExecutionHandlers = Readonly<{
  finalizeWorkflow: (
    deps: SemanticDiffCommandDeps,
    step: CommandStep<WorkflowExplorerResult>,
  ) => Promise<SemanticDiffCommandResult>;
  finalizeExplorer: (
    deps: SemanticDiffCommandDeps,
    step: CommandStep<SemanticDiffExplorerSessionHandle>,
  ) => Promise<SemanticDiffCommandResult>;
  finalizeReport: (
    deps: SemanticDiffCommandDeps,
    step: CommandStep<SemanticDiffOutputDocument>,
  ) => Promise<SemanticDiffCommandResult>;
  runReport: (
    deps: SemanticDiffCommandDeps,
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

const hasCalendarAdapter = (deps: SemanticDiffCommandDeps): boolean =>
  deps.buildSemanticDiffPresentationArtifacts !== undefined &&
  deps.openScheduleAwareExplorerSession !== undefined;

const selectCalendarRunner = (deps: SemanticDiffCommandDeps): WorkflowRunner =>
  deps.showWorkflowQuickPick !== undefined || deps.showInputBox !== undefined
    ? runFileComparisonWorkflow
    : runCalendarCompatibilityWorkflow;

const selectExecutionRunner = (
  deps: SemanticDiffCommandDeps,
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
  deps: SemanticDiffCommandDeps,
  handlers: ExecutionHandlers,
): SemanticDiffCommandExecution => selectExecutionRunner(deps, handlers);
