import type {
  SemanticDiffOutputContext,
  SemanticDiffOutputMode,
} from "../../../application/semantic-diff/semanticDiffDto";
import { renderSemanticDiffAuditMarkdown } from "./renderSemanticDiffAuditMarkdown";
import { renderSemanticDiffMarkdown } from "./renderSemanticDiffMarkdown";
import { renderSemanticDiffSummaryMarkdown } from "./renderSemanticDiffSummaryMarkdown";
import { renderSemanticDiffJson } from "./serializeSemanticDiffJson";
import type { SemanticDiffMarkdownRenderer } from "./semanticDiffMarkdownTypes";

export type { SemanticDiffOutputMode } from "../../../application/semantic-diff/semanticDiffDto";

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
): SemanticDiffOutputDocument => ({
  mode,
  languageId: "markdown",
  extension: ".md",
  mediaType: SEMANTIC_DIFF_MARKDOWN_MEDIA_TYPE,
  content: markdownRenderers[mode](context, language),
});

const markdownRenderers: Record<
  Exclude<SemanticDiffOutputMode, "json">,
  SemanticDiffMarkdownRenderer
> = {
  summary: renderSemanticDiffSummaryMarkdown,
  full: renderSemanticDiffMarkdown,
  audit: renderSemanticDiffAuditMarkdown,
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
