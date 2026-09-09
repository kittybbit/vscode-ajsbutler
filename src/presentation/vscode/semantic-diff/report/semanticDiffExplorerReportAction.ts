import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import {
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputMode,
  type SemanticDiffOutputModeItem,
} from "../../../semantic-diff/semanticDiffOutput";
import { runSemanticDiffExplorerReportAction } from "./semanticDiffExplorerReportActionRunner";

export type SemanticDiffExplorerReportActionDeps = Readonly<{
  showQuickPick: (
    items: readonly SemanticDiffOutputModeItem[],
    options?: { readonly placeHolder?: string },
  ) => Thenable<SemanticDiffOutputModeItem | undefined>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  presentOutput?: typeof presentSemanticDiffOutput;
  language?: string;
  isCurrent?: () => boolean;
}>;

export type SemanticDiffExplorerReportActionResult =
  | Readonly<{
      ok: true;
      mode: SemanticDiffOutputMode;
      document: SemanticDiffOutputDocument;
    }>
  | Readonly<{ ok: false; code: "cancelled" | "output-failed" }>;

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
