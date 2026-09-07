import { validateSourceIndexShape } from "./semanticDiffSourceIndexGuards";
import {
  isAttributeRequestMissingParameterKey,
  isLookupRequest,
} from "./semanticDiffSourceIndexRequestGuards";
import {
  compareSourcePositions,
  isPlainRecord,
} from "./semanticDiffSourceIndexPrimitives";
import { isSemanticDiffSourceIndexId } from "./AjsParserWithSourceIndexPort";
import type {
  SemanticDiffSourceIndex,
  SemanticDiffSourceIndexId,
  SemanticDiffSourceLookupRequest,
  SemanticDiffSourceLookupResult,
  SemanticDiffSourceRange,
  SemanticDiffSourceUnitEntry,
} from "./AjsParserWithSourceIndexPort";

const freezePosition = (position: SemanticDiffSourceRange["start"]) =>
  Object.freeze({ ...position });

const freezeRange = (range: SemanticDiffSourceRange): SemanticDiffSourceRange =>
  Object.freeze({
    start: freezePosition(range.start),
    end: freezePosition(range.end),
  });

const freezeUnitEntry = (
  entry: SemanticDiffSourceUnitEntry,
): SemanticDiffSourceUnitEntry =>
  Object.freeze({
    unitId: entry.unitId,
    headerRange: freezeRange(entry.headerRange),
    nameRange: entry.nameRange === null ? null : freezeRange(entry.nameRange),
    parameterOccurrences: Object.freeze(
      entry.parameterOccurrences.map((occurrence) =>
        Object.freeze({
          parameterKey: occurrence.parameterKey,
          occurrenceOrdinal: occurrence.occurrenceOrdinal,
          range: freezeRange(occurrence.range),
        }),
      ),
    ),
  });

export const freezeSourceIndexValue = (
  value: unknown,
): SemanticDiffSourceIndex | undefined => {
  if (!validateSourceIndexShape(value)) return undefined;
  return Object.freeze({
    sourceIndexId: value.sourceIndexId,
    unitEntries: Object.freeze(value.unitEntries.map(freezeUnitEntry)),
  });
};

const findUniqueUnitEntry = (
  index: SemanticDiffSourceIndex,
  unitId: string,
): SemanticDiffSourceUnitEntry | undefined => {
  const matches = index.unitEntries.filter((entry) => entry.unitId === unitId);
  return matches.length === 1 ? matches[0] : undefined;
};

const lookupUnitTarget = (
  entry: SemanticDiffSourceUnitEntry,
): SemanticDiffSourceLookupResult => {
  const hasName =
    entry.nameRange !== null &&
    compareSourcePositions(entry.nameRange.start, entry.nameRange.end) < 0;
  return {
    primaryRange: hasName ? entry.nameRange! : entry.headerRange,
    occurrences: [],
  };
};

const lookupAttributeTarget = (
  entry: SemanticDiffSourceUnitEntry,
  parameterKey: string,
): SemanticDiffSourceLookupResult => {
  const occurrences = entry.parameterOccurrences
    .filter((occurrence) => occurrence.parameterKey === parameterKey)
    .map((occurrence) => occurrence.range);
  return occurrences.length === 0
    ? { code: "parameter-occurrence-missing" }
    : { primaryRange: occurrences[0]!, occurrences };
};

const lookupUnitTargetKind = (
  entry: SemanticDiffSourceUnitEntry,
  request: SemanticDiffSourceLookupRequest,
): SemanticDiffSourceLookupResult =>
  request.targetKind === "attribute"
    ? lookupAttributeTarget(entry, request.parameterKey)
    : lookupUnitTarget(entry);

const indexFailure = (
  index: SemanticDiffSourceIndex | undefined,
  sourceIndexId: SemanticDiffSourceIndexId,
  expiredIds: ReadonlySet<SemanticDiffSourceIndexId>,
): SemanticDiffSourceLookupResult | undefined => {
  if (index !== undefined) return undefined;
  return {
    code: expiredIds.has(sourceIndexId)
      ? "expired-source-index"
      : "source-index-missing",
  };
};

type PreparedLookup =
  | {
      ok: true;
      index: SemanticDiffSourceIndex;
      request: SemanticDiffSourceLookupRequest;
    }
  | { ok: false; result: SemanticDiffSourceLookupResult };

type ParsedRequest =
  | { ok: true; request: SemanticDiffSourceLookupRequest }
  | { ok: false; result: SemanticDiffSourceLookupResult };

const parseRequest = (request: unknown): ParsedRequest => {
  if (isAttributeRequestMissingParameterKey(request)) {
    return { ok: false, result: { code: "parameter-key-missing" } };
  }
  if (!isLookupRequest(request)) {
    return { ok: false, result: { code: "unsupported-target-kind" } };
  }
  return { ok: true, request };
};

type PreparedIndex =
  | { ok: true; index: SemanticDiffSourceIndex }
  | { ok: false; result: SemanticDiffSourceLookupResult };

const sourceIndexIdError = (
  request: SemanticDiffSourceLookupRequest,
): SemanticDiffSourceLookupResult | undefined =>
  isSemanticDiffSourceIndexId(request.sourceIndexId)
    ? undefined
    : { code: "source-index-missing" };

const sourceIndexShapeError = (
  index: SemanticDiffSourceIndex | undefined,
  sourceIndexId: SemanticDiffSourceIndexId,
): SemanticDiffSourceLookupResult | undefined =>
  validateSourceIndexShape(index, sourceIndexId)
    ? undefined
    : { code: "malformed-source" };

const prepareIndex = (
  index: SemanticDiffSourceIndex | undefined,
  request: SemanticDiffSourceLookupRequest,
  expiredIds: ReadonlySet<SemanticDiffSourceIndexId>,
): PreparedIndex => {
  const idError = sourceIndexIdError(request);
  if (idError !== undefined) return { ok: false, result: idError };
  const indexError =
    indexFailure(index, request.sourceIndexId, expiredIds) ??
    sourceIndexShapeError(index, request.sourceIndexId);
  return indexError === undefined
    ? { ok: true, index: index! }
    : { ok: false, result: indexError };
};

const prepareLookup = (
  index: SemanticDiffSourceIndex | undefined,
  request: unknown,
  expiredIds: ReadonlySet<SemanticDiffSourceIndexId>,
): PreparedLookup => {
  const parsed = parseRequest(request);
  if (parsed.ok === false) return parsed;
  const preparedIndex = prepareIndex(index, parsed.request, expiredIds);
  if (preparedIndex.ok === false) return preparedIndex;
  return { ok: true, index: preparedIndex.index, request: parsed.request };
};

export const lookupSemanticDiffSourceIndex = (
  index: SemanticDiffSourceIndex | undefined,
  request: unknown,
  expiredIds: ReadonlySet<SemanticDiffSourceIndexId> = new Set(),
): SemanticDiffSourceLookupResult => {
  const prepared = prepareLookup(index, request, expiredIds);
  if (prepared.ok === false) return prepared.result;
  const entry = findUniqueUnitEntry(prepared.index, prepared.request.unitId);
  return entry === undefined
    ? { code: "unit-missing" }
    : lookupUnitTargetKind(entry, prepared.request);
};

export const getRequestSourceIndexId = (
  request: unknown,
): SemanticDiffSourceIndexId | undefined =>
  isPlainRecord(request) && isSemanticDiffSourceIndexId(request.sourceIndexId)
    ? request.sourceIndexId
    : undefined;
