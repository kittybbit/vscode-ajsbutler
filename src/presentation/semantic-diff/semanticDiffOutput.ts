import type {
  SemanticDiffOutputContext,
  SemanticDiffOutputMode,
} from "../../application/semantic-diff/semanticDiffDto";
import { renderSemanticDiffAuditMarkdown } from "./renderSemanticDiffAuditMarkdown";
import { renderSemanticDiffMarkdown } from "./renderSemanticDiffMarkdown";
import { renderSemanticDiffSummaryMarkdown } from "./renderSemanticDiffSummaryMarkdown";
import { renderSemanticDiffJson } from "./serializeSemanticDiffJson";

export type { SemanticDiffOutputMode } from "../../application/semantic-diff/semanticDiffDto";

export type SemanticDiffOutputLanguageId = "markdown" | "json";

export type SemanticDiffOutputDocument = {
  readonly mode: SemanticDiffOutputMode;
  readonly languageId: SemanticDiffOutputLanguageId;
  readonly extension: ".md" | ".json";
  readonly mediaType:
    | "text/markdown; charset=utf-8"
    | "application/json; charset=utf-8";
  readonly content: string;
};

export const SEMANTIC_DIFF_MARKDOWN_MEDIA_TYPE =
  "text/markdown; charset=utf-8" as const;

const markdownDocument = (
  context: SemanticDiffOutputContext,
  mode: Exclude<SemanticDiffOutputMode, "json">,
  language?: string,
): SemanticDiffOutputDocument => {
  const content =
    mode === "summary"
      ? renderSemanticDiffSummaryMarkdown(context, language)
      : mode === "audit"
        ? renderSemanticDiffAuditMarkdown(context, language)
        : renderSemanticDiffMarkdown(context, language);
  return {
    mode,
    languageId: "markdown",
    extension: ".md",
    mediaType: SEMANTIC_DIFF_MARKDOWN_MEDIA_TYPE,
    content,
  };
};

/**
 * Present an already-built immutable context in the requested output mode.
 * This dispatcher owns no comparison, aggregation, or context construction.
 */
export const presentSemanticDiffOutput = (
  context: SemanticDiffOutputContext,
  mode: SemanticDiffOutputMode,
  language?: string,
): SemanticDiffOutputDocument => {
  switch (mode) {
    case "summary":
    case "full":
    case "audit":
      return markdownDocument(context, mode, language);
    case "json": {
      const { content } = renderSemanticDiffJson(context);
      return {
        mode,
        languageId: "json",
        extension: ".json",
        mediaType: "application/json; charset=utf-8",
        content,
      };
    }
  }
};

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

/** Shared picker logic used by the standalone command and future Explorer output actions. */
export const pickSemanticDiffOutputMode = async (
  showQuickPick: SemanticDiffOutputModePicker,
): Promise<SemanticDiffOutputMode | undefined> =>
  (
    await showQuickPick(semanticDiffOutputModeItems, {
      placeHolder: "Select Semantic Diff Output",
    })
  )?.mode;
