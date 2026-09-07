import type {
  SemanticDiffSourceIndex,
  SemanticDiffSourceIndexId,
} from "./AjsParserWithSourceIndexPort";
import { hasExactKeys } from "./semanticDiffSourceIndexPrimitives";
import { isUnitEntry } from "./semanticDiffSourceIndexValueGuards";

export {
  compareSourcePositions,
  hasExactKeys,
  isPlainRecord,
} from "./semanticDiffSourceIndexPrimitives";
export { isSourceRange } from "./semanticDiffSourceIndexValueGuards";

export const validateSourceIndexShape = (
  value: unknown,
  expectedId?: SemanticDiffSourceIndexId,
): value is SemanticDiffSourceIndex => {
  if (!hasExactKeys(value, ["sourceIndexId", "unitEntries"])) return false;
  if (!hasValidIndexIdentity(value, expectedId)) return false;
  return hasValidIndexEntries(value);
};

const hasValidIndexIdentity = (
  value: Record<string, unknown>,
  expectedId: SemanticDiffSourceIndexId | undefined,
): boolean => {
  if (typeof value.sourceIndexId !== "string") return false;
  return expectedId === undefined || value.sourceIndexId === expectedId;
};

const hasValidIndexEntries = (value: Record<string, unknown>): boolean => {
  if (!Array.isArray(value.unitEntries)) return false;
  return value.unitEntries.every(isUnitEntry);
};
