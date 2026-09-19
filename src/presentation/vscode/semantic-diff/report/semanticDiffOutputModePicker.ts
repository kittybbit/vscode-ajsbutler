import type { SemanticDiffOutputMode } from "../../../semantic-diff/report/semanticDiffOutput";

export type SemanticDiffOutputModeItem = {
  readonly mode: SemanticDiffOutputMode;
  readonly label: string;
  readonly description: string;
};

/** Full is deliberately first so the existing human-readable path is the default. */
export const semanticDiffOutputModeItems: readonly SemanticDiffOutputModeItem[] =
  [
    { mode: "full", label: "Full", description: "Default detailed report" },
    {
      mode: "summary",
      label: "Summary",
      description: "Compact change overview",
    },
    { mode: "audit", label: "Audit", description: "Evidence and constraints" },
    {
      mode: "json",
      label: "JSON",
      description: "Structured machine-readable output",
    },
  ];

export type SemanticDiffOutputModePicker = (
  items: readonly SemanticDiffOutputModeItem[],
  options?: { readonly placeHolder?: string },
) => Thenable<SemanticDiffOutputModeItem | undefined>;

export const pickSemanticDiffOutputMode = async (
  showQuickPick: SemanticDiffOutputModePicker,
): Promise<SemanticDiffOutputMode | undefined> =>
  (
    await showQuickPick(semanticDiffOutputModeItems, {
      placeHolder: "Select Semantic Diff Output",
    })
  )?.mode;
