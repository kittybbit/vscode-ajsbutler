import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import { runSemanticDiffExplorerReportAction } from "./semanticDiffExplorerReportActionRunner";
export type {
  SemanticDiffExplorerReportActionDeps,
  SemanticDiffExplorerReportActionResult,
} from "./semanticDiffExplorerReportActionTypes";
import type {
  SemanticDiffExplorerReportActionDeps,
  SemanticDiffExplorerReportActionResult,
} from "./semanticDiffExplorerReportActionTypes";

/**
 * The Explorer output button is deliberately a thin consumer of the
 * structured-output dispatcher. The caller supplies the retained context;
 * this function never compares, summarizes, or reconstructs it.
 */
export const executeSemanticDiffExplorerReportAction = async (
  context: SemanticDiffOutputContext,
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<SemanticDiffExplorerReportActionResult> => {
  return runSemanticDiffExplorerReportAction(context, deps);
};

export const runSemanticDiffExplorerOutputAction =
  executeSemanticDiffExplorerReportAction;
