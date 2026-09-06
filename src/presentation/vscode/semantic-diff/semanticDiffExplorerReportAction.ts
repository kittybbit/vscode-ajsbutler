import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/semanticDiffDto";
import {
  pickSemanticDiffOutputMode,
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputMode,
  type SemanticDiffOutputModeItem,
} from "../../semantic-diff/semanticDiffOutput";

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
  let mode: SemanticDiffOutputMode | undefined;
  try {
    mode = await pickSemanticDiffOutputMode((items, options) =>
      deps.showQuickPick(items, options),
    );
  } catch {
    return { ok: false, code: "output-failed" };
  }
  if (deps.isCurrent && !deps.isCurrent()) {
    return { ok: false, code: "cancelled" };
  }
  if (!mode) return { ok: false, code: "cancelled" };
  try {
    if (deps.isCurrent && !deps.isCurrent()) {
      return { ok: false, code: "cancelled" };
    }
    const document = (deps.presentOutput ?? presentSemanticDiffOutput)(
      context,
      mode,
      deps.language,
    );
    if (deps.isCurrent && !deps.isCurrent()) {
      return { ok: false, code: "cancelled" };
    }
    await deps.openReport(document);
    if (deps.isCurrent && !deps.isCurrent()) {
      return { ok: false, code: "cancelled" };
    }
    return { ok: true, mode, document };
  } catch {
    return { ok: false, code: "output-failed" };
  }
};

export const runSemanticDiffExplorerOutputAction =
  executeSemanticDiffExplorerReportAction;
