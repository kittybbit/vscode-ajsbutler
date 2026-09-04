import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import {
  SEMANTIC_DIFF_JSON_MEDIA_TYPE,
  type SemanticDiffJsonOutput,
  type SemanticDiffJsonV1,
} from "./semanticDiffJson";
import { projectResult, projectSummary } from "./semanticDiffJsonProjection";
import { assertNoUndefined } from "./semanticDiffJsonValidation";

/** Build the explicit version 1 JSON DTO without mutating the source context. */
export const buildSemanticDiffJsonV1 = (
  context: SemanticDiffOutputContext,
): SemanticDiffJsonV1 => {
  const document: SemanticDiffJsonV1 = {
    schema: "ajsbutler.semantic-diff",
    schemaVersion: 1,
    summary: projectSummary(context.summary),
    result: projectResult(context.result),
  };
  assertNoUndefined(document);
  return document;
};

/** Serialize one immutable output context as deterministic locale-neutral JSON. */
export const serializeSemanticDiffJson = (
  context: SemanticDiffOutputContext,
): string => `${JSON.stringify(buildSemanticDiffJsonV1(context), null, 2)}\n`;

/** Return JSON content with the media type needed by a later host dispatcher. */
export const renderSemanticDiffJson = (
  context: SemanticDiffOutputContext,
): SemanticDiffJsonOutput => ({
  mediaType: SEMANTIC_DIFF_JSON_MEDIA_TYPE,
  content: serializeSemanticDiffJson(context),
});
