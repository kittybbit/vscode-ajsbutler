import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/semanticDiffDto";
import {
  SEMANTIC_DIFF_JSON_MEDIA_TYPE,
  type SemanticDiffJsonOutput,
  type SemanticDiffJsonV2,
} from "./semanticDiffJson";
import { projectResult, projectSummary } from "./semanticDiffJsonProjection";
import { assertNoUndefined } from "./semanticDiffJsonValidation";

/** Build the explicit version 2 JSON DTO without mutating the source context. */
export const buildSemanticDiffJsonV2 = (
  context: SemanticDiffOutputContext,
): SemanticDiffJsonV2 => {
  const document: SemanticDiffJsonV2 = {
    schema: "ajsbutler.semantic-diff",
    schemaVersion: 2,
    summary: projectSummary(context.summary),
    result: projectResult(context.result),
  };
  assertNoUndefined(document);
  return document;
};

/** Serialize one immutable output context as deterministic locale-neutral JSON. */
export const serializeSemanticDiffJson = (
  context: SemanticDiffOutputContext,
): string => `${JSON.stringify(buildSemanticDiffJsonV2(context), null, 2)}\n`;

/** Return JSON content with the media type needed by a later host dispatcher. */
export const renderSemanticDiffJson = (
  context: SemanticDiffOutputContext,
): SemanticDiffJsonOutput => ({
  mediaType: SEMANTIC_DIFF_JSON_MEDIA_TYPE,
  content: serializeSemanticDiffJson(context),
});
