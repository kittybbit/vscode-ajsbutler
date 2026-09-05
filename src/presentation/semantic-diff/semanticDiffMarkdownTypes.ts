import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";

/** The Markdown projections owned by the structured-output presentation. */
export type SemanticDiffMarkdownMode = "summary" | "full" | "audit";

export type SemanticDiffMarkdownRenderer = (
  context: SemanticDiffOutputContext,
  language?: string,
) => string;
