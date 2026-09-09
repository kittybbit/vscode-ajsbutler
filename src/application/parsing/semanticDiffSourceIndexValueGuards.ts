import type {
  SemanticDiffSourceParameterOccurrence,
  SemanticDiffSourceRange,
  SemanticDiffSourceUnitEntry,
} from "./AjsParserWithSourceIndexPort";
import {
  compareSourcePositions,
  hasExactKeys,
  isNonNegativeInteger,
} from "./semanticDiffSourceIndexPrimitives";

const isPosition = (
  value: unknown,
): value is SemanticDiffSourceRange["start"] =>
  hasExactKeys(value, ["line", "character"]) && isPositionValues(value);

const isPositionValues = (value: Record<string, unknown>): boolean => {
  if (!isNonNegativeInteger(value.line)) return false;
  return isNonNegativeInteger(value.character);
};

export const isSourceRange = (
  value: unknown,
): value is SemanticDiffSourceRange => {
  if (!hasExactKeys(value, ["start", "end"])) return false;
  return hasValidRangeValues(value);
};

const hasValidRangeValues = (value: Record<string, unknown>): boolean => {
  if (!isPosition(value.start)) return false;
  if (!isPosition(value.end)) return false;
  return compareSourcePositions(value.start, value.end) <= 0;
};

const isParameterOccurrence = (
  value: unknown,
): value is SemanticDiffSourceParameterOccurrence => {
  if (!hasExactKeys(value, ["parameterKey", "occurrenceOrdinal", "range"])) {
    return false;
  }
  return hasValidParameterKey(value) && isValidOccurrenceValues(value);
};

const hasValidParameterKey = (value: Record<string, unknown>): boolean =>
  typeof value.parameterKey === "string" && value.parameterKey.length > 0;

const isValidOccurrenceValues = (value: Record<string, unknown>): boolean => {
  if (!isNonNegativeInteger(value.occurrenceOrdinal)) return false;
  return isSourceRange(value.range);
};

const isOccurrenceInOrder = (
  occurrence: SemanticDiffSourceParameterOccurrence,
  previous: SemanticDiffSourceParameterOccurrence | undefined,
  nextOrdinals: Map<string, number>,
): boolean => {
  const expectedOrdinal = nextOrdinals.get(occurrence.parameterKey) ?? 0;
  const followsSourceOrder =
    previous === undefined ||
    compareSourcePositions(previous.range.start, occurrence.range.start) <= 0;
  return occurrence.occurrenceOrdinal === expectedOrdinal && followsSourceOrder;
};

const areParameterOccurrencesValid = (
  value: unknown,
): value is readonly SemanticDiffSourceParameterOccurrence[] => {
  if (!Array.isArray(value)) return false;
  const nextOrdinals = new Map<string, number>();
  let previous: SemanticDiffSourceParameterOccurrence | undefined;
  return value.every((candidate) => {
    const occurrence = toAcceptedOccurrence(candidate, previous, nextOrdinals);
    previous = occurrence ?? previous;
    return occurrence !== undefined;
  });
};

const toAcceptedOccurrence = (
  value: unknown,
  previous: SemanticDiffSourceParameterOccurrence | undefined,
  nextOrdinals: Map<string, number>,
): SemanticDiffSourceParameterOccurrence | undefined => {
  const occurrence = isParameterOccurrence(value) ? value : undefined;
  if (!isAcceptedOccurrence(occurrence, previous, nextOrdinals))
    return undefined;
  nextOrdinals.set(occurrence.parameterKey, occurrence.occurrenceOrdinal + 1);
  return occurrence;
};

const isAcceptedOccurrence = (
  occurrence: SemanticDiffSourceParameterOccurrence | undefined,
  previous: SemanticDiffSourceParameterOccurrence | undefined,
  nextOrdinals: Map<string, number>,
): occurrence is SemanticDiffSourceParameterOccurrence =>
  occurrence !== undefined &&
  isOccurrenceInOrder(occurrence, previous, nextOrdinals);

export const isUnitEntry = (
  value: unknown,
): value is SemanticDiffSourceUnitEntry => {
  if (
    !hasExactKeys(value, [
      "unitId",
      "headerRange",
      "nameRange",
      "parameterOccurrences",
    ])
  ) {
    return false;
  }
  return hasUnitIdentity(value) && hasUnitEntryRanges(value);
};

const hasUnitIdentity = (value: Record<string, unknown>): boolean =>
  typeof value.unitId === "string" && value.unitId.length > 0;

const hasUnitEntryRanges = (value: Record<string, unknown>): boolean => {
  if (!isSourceRange(value.headerRange)) return false;
  return hasNameRangeAndOccurrences(value);
};

const hasNameRangeAndOccurrences = (
  value: Record<string, unknown>,
): boolean => {
  if (value.nameRange !== null && !isSourceRange(value.nameRange)) return false;
  return areParameterOccurrencesValid(value.parameterOccurrences);
};
