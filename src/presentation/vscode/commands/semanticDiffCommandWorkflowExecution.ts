import type { SemanticDiffOutputDocument } from "../../semantic-diff/report/semanticDiffOutput";
import type {
  SemanticDiffCommandDeps,
  SemanticDiffCommandResult,
} from "./semanticDiffCommand";
import type { CommandStep } from "./semanticDiffCommandSteps";
import {
  runDefinitionComparisonWorkflow,
  type WorkflowExplorerResult,
} from "./semanticDiffCommandWorkflowArtifacts";

export type SemanticDiffCommandExecution = (
  deps: SemanticDiffCommandDeps,
) => Promise<SemanticDiffCommandResult>;

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

type ExecutionHandlers = Readonly<{
  finalizeWorkflow: (
    deps: FinalizationDeps,
    step: CommandStep<WorkflowExplorerResult>,
  ) => Promise<SemanticDiffCommandResult>;
  finalizeReport: (
    deps: FinalizationDeps,
    step: CommandStep<SemanticDiffOutputDocument>,
  ) => Promise<SemanticDiffCommandResult>;
  runReport: (
    deps: ReportRunnerDeps,
  ) => Promise<CommandStep<SemanticDiffOutputDocument>>;
}>;

export const commandExecution = (
  deps: Pick<SemanticDiffCommandDeps, "openExplorer">,
  handlers: ExecutionHandlers,
): SemanticDiffCommandExecution =>
  deps.openExplorer
    ? async (commandDeps) =>
        handlers.finalizeWorkflow(
          commandDeps,
          await runDefinitionComparisonWorkflow(commandDeps),
        )
    : async (commandDeps) =>
        handlers.finalizeReport(
          commandDeps,
          await handlers.runReport(commandDeps),
        );
