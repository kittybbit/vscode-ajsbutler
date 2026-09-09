import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import {
  pickSemanticDiffOutputMode,
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputMode,
} from "../../../semantic-diff/semanticDiffOutput";
import type {
  SemanticDiffExplorerReportActionDeps,
  SemanticDiffExplorerReportActionResult,
} from "./semanticDiffExplorerReportActionTypes";

type ReportModeSelection =
  | Readonly<{ ok: true; mode: SemanticDiffOutputMode }>
  | Readonly<{ ok: false; code: "cancelled" | "output-failed" }>;

const currentReportAction = (
  deps: SemanticDiffExplorerReportActionDeps,
): boolean => deps.isCurrent?.() ?? true;

const selectReportMode = async (
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<ReportModeSelection> => {
  let selection: ReportModeSelection;
  try {
    const mode = await pickSemanticDiffOutputMode((items, options) =>
      deps.showQuickPick(items, options),
    );
    selection = mode ? { ok: true, mode } : { ok: false, code: "cancelled" };
  } catch {
    selection = { ok: false, code: "output-failed" };
  }
  return selection;
};

const createReportDocument = (
  context: SemanticDiffOutputContext,
  mode: SemanticDiffOutputMode,
  deps: SemanticDiffExplorerReportActionDeps,
): SemanticDiffOutputDocument =>
  (deps.presentOutput ?? presentSemanticDiffOutput)(
    context,
    mode,
    deps.language,
  );

const openReportDocument = async (
  document: SemanticDiffOutputDocument,
  mode: SemanticDiffOutputMode,
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<SemanticDiffExplorerReportActionResult> => {
  const operation = currentReportAction(deps)
    ? Promise.resolve(deps.openReport(document)).then(() =>
        completedReport(document, mode, deps),
      )
    : Promise.resolve<SemanticDiffExplorerReportActionResult>({
        ok: false,
        code: "cancelled",
      });
  return operation.catch(() => ({ ok: false, code: "output-failed" }));
};

const completedReport = (
  document: SemanticDiffOutputDocument,
  mode: SemanticDiffOutputMode,
  deps: SemanticDiffExplorerReportActionDeps,
): SemanticDiffExplorerReportActionResult =>
  currentReportAction(deps)
    ? { ok: true, mode, document }
    : { ok: false, code: "cancelled" };

const presentAndOpenReport = async (
  context: SemanticDiffOutputContext,
  mode: SemanticDiffOutputMode,
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<SemanticDiffExplorerReportActionResult> => {
  const document = createReportDocument(context, mode, deps);
  return openReportDocument(document, mode, deps);
};

const presentSelectedReport = (
  context: SemanticDiffOutputContext,
  mode: SemanticDiffOutputMode,
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<SemanticDiffExplorerReportActionResult> =>
  currentReportAction(deps)
    ? presentAndOpenReport(context, mode, deps)
    : Promise.resolve({ ok: false, code: "cancelled" });

const completeReportSelection = async (
  context: SemanticDiffOutputContext,
  selection: ReportModeSelection,
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<SemanticDiffExplorerReportActionResult> => {
  const operation: Promise<SemanticDiffExplorerReportActionResult> =
    "mode" in selection
      ? presentSelectedReport(context, selection.mode, deps)
      : Promise.resolve({ ok: false, code: selection.code });
  return operation.catch(() => ({ ok: false, code: "output-failed" }));
};

export const runSemanticDiffExplorerReportAction = async (
  context: SemanticDiffOutputContext,
  deps: SemanticDiffExplorerReportActionDeps,
): Promise<SemanticDiffExplorerReportActionResult> => {
  const selection = await selectReportMode(deps);
  return completeReportSelection(context, selection, deps);
};
