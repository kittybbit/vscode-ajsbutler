import type {
  SemanticDiffOutputDocument,
  SemanticDiffOutputMode,
  presentSemanticDiffOutput,
} from "../../../semantic-diff/report/semanticDiffOutput";
import type { SemanticDiffOutputModeItem } from "./semanticDiffOutputModePicker";

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
