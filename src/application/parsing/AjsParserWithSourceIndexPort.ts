import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import type { AjsParserError, ParseAjsResult } from "./AjsParserPort";

export type SemanticDiffSourceIndexId = string & {
  readonly __semanticDiffSourceIndexId: unique symbol;
};

export type SemanticDiffSourceHandleId = string & {
  readonly __semanticDiffSourceHandleId: unique symbol;
};

export type SemanticDiffCaptureScopeId = string & {
  readonly __semanticDiffCaptureScopeId: unique symbol;
};

export const SEMANTIC_DIFF_SOURCE_INDEX_ID_PREFIX = "sde-source-index-";
export const SEMANTIC_DIFF_SOURCE_HANDLE_ID_PREFIX = "sde-source-handle-";
export const SEMANTIC_DIFF_CAPTURE_SCOPE_ID_PREFIX = "sde-capture-scope-";

const sourceIndexIdPattern = /^sde-source-index-[1-9][0-9]*$/;
const sourceHandleIdPattern = /^sde-source-handle-[1-9][0-9]*$/;
const captureScopeIdPattern = /^sde-capture-scope-[1-9][0-9]*$/;

export const isSemanticDiffSourceIndexId = (
  value: unknown,
): value is SemanticDiffSourceIndexId =>
  typeof value === "string" && sourceIndexIdPattern.test(value);

export const isSemanticDiffSourceHandleId = (
  value: unknown,
): value is SemanticDiffSourceHandleId =>
  typeof value === "string" && sourceHandleIdPattern.test(value);

export const isSemanticDiffCaptureScopeId = (
  value: unknown,
): value is SemanticDiffCaptureScopeId =>
  typeof value === "string" && captureScopeIdPattern.test(value);

export type SemanticDiffSourceIndexIdAllocator =
  () => SemanticDiffSourceIndexId;
export type SemanticDiffSourceHandleIdAllocator =
  () => SemanticDiffSourceHandleId;
export type SemanticDiffCaptureScopeIdAllocator =
  () => SemanticDiffCaptureScopeId;

const assertSequence = (sequence: number, label: string): void => {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError(`${label} sequence must be a positive integer.`);
  }
};

export const createSemanticDiffSourceIndexId = (
  sequence: number,
): SemanticDiffSourceIndexId => {
  assertSequence(sequence, "A source index ID");
  return `${SEMANTIC_DIFF_SOURCE_INDEX_ID_PREFIX}${sequence}` as SemanticDiffSourceIndexId;
};

export const createSemanticDiffSourceHandleId = (
  sequence: number,
): SemanticDiffSourceHandleId => {
  assertSequence(sequence, "A source handle ID");
  return `${SEMANTIC_DIFF_SOURCE_HANDLE_ID_PREFIX}${sequence}` as SemanticDiffSourceHandleId;
};

export const createSemanticDiffCaptureScopeId = (
  sequence: number,
): SemanticDiffCaptureScopeId => {
  assertSequence(sequence, "A capture scope ID");
  return `${SEMANTIC_DIFF_CAPTURE_SCOPE_ID_PREFIX}${sequence}` as SemanticDiffCaptureScopeId;
};

export const createSemanticDiffSourceIndexIdAllocator = (
  start = 1,
): SemanticDiffSourceIndexIdAllocator => {
  let sequence = start;
  return () => createSemanticDiffSourceIndexId(sequence++);
};

export const createSemanticDiffSourceHandleIdAllocator = (
  start = 1,
): SemanticDiffSourceHandleIdAllocator => {
  let sequence = start;
  return () => createSemanticDiffSourceHandleId(sequence++);
};

export const createSemanticDiffCaptureScopeIdAllocator = (
  start = 1,
): SemanticDiffCaptureScopeIdAllocator => {
  let sequence = start;
  return () => createSemanticDiffCaptureScopeId(sequence++);
};

export type SemanticDiffSourcePosition = Readonly<{
  line: number;
  character: number;
}>;

export type SemanticDiffSourceRange = Readonly<{
  start: SemanticDiffSourcePosition;
  end: SemanticDiffSourcePosition;
}>;

export type SemanticDiffSourceParameterOccurrence = Readonly<{
  parameterKey: string;
  occurrenceOrdinal: number;
  range: SemanticDiffSourceRange;
}>;

export type SemanticDiffSourceUnitEntry = Readonly<{
  unitId: string;
  headerRange: SemanticDiffSourceRange;
  nameRange: SemanticDiffSourceRange | null;
  parameterOccurrences: readonly SemanticDiffSourceParameterOccurrence[];
}>;

export type SemanticDiffSourceIndex = Readonly<{
  sourceIndexId: SemanticDiffSourceIndexId;
  unitEntries: readonly SemanticDiffSourceUnitEntry[];
}>;

export type ParseAjsWithSourceIndexResult =
  | {
      ok: true;
      document: AjsDocument;
      sourceIndex: SemanticDiffSourceIndex;
    }
  | Extract<ParseAjsResult, { ok: false }>;

export interface AjsParserWithSourceIndexPort {
  parseWithSourceIndex(content: string): ParseAjsWithSourceIndexResult;
}

export type SemanticDiffSourceLookupRequest =
  | Readonly<{
      sourceIndexId: SemanticDiffSourceIndexId;
      unitId: string;
      targetKind: "unit" | "jobnet" | "jobgroup";
    }>
  | Readonly<{
      sourceIndexId: SemanticDiffSourceIndexId;
      unitId: string;
      targetKind: "attribute";
      parameterKey: string;
    }>;

export type SemanticDiffSourceLookupFailureCode =
  | "source-index-missing"
  | "unit-missing"
  | "parameter-key-missing"
  | "parameter-occurrence-missing"
  | "unsupported-target-kind"
  | "malformed-source"
  | "stale-source"
  | "expired-source-index";

export type SemanticDiffSourceLookupResult =
  | Readonly<{
      primaryRange: SemanticDiffSourceRange;
      occurrences: readonly SemanticDiffSourceRange[];
    }>
  | Readonly<{ code: SemanticDiffSourceLookupFailureCode }>;

export type SemanticDiffSourceLookupPort = {
  lookup(
    request: SemanticDiffSourceLookupRequest,
  ): SemanticDiffSourceLookupResult;
};

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactKeys = (
  value: unknown,
  keys: readonly string[],
): value is Record<string, unknown> =>
  isPlainRecord(value) &&
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  Number.isInteger(value) &&
  value >= 0;

const isPosition = (value: unknown): value is SemanticDiffSourcePosition =>
  hasExactKeys(value, ["line", "character"]) &&
  isNonNegativeInteger(value.line) &&
  isNonNegativeInteger(value.character);

const comparePositions = (
  left: SemanticDiffSourcePosition,
  right: SemanticDiffSourcePosition,
): number => left.line - right.line || left.character - right.character;

const isRange = (value: unknown): value is SemanticDiffSourceRange =>
  hasExactKeys(value, ["start", "end"]) &&
  isPosition(value.start) &&
  isPosition(value.end) &&
  comparePositions(value.start, value.end) <= 0;

const isParameterOccurrence = (
  value: unknown,
): value is SemanticDiffSourceParameterOccurrence =>
  hasExactKeys(value, ["parameterKey", "occurrenceOrdinal", "range"]) &&
  typeof value.parameterKey === "string" &&
  value.parameterKey.length > 0 &&
  isNonNegativeInteger(value.occurrenceOrdinal) &&
  isRange(value.range);

const areParameterOccurrencesValid = (
  value: unknown,
): value is readonly SemanticDiffSourceParameterOccurrence[] => {
  if (!Array.isArray(value)) return false;
  const nextOrdinals = new Map<string, number>();
  let previous: SemanticDiffSourceParameterOccurrence | undefined;
  for (const occurrence of value) {
    if (!isParameterOccurrence(occurrence)) return false;
    const expectedOrdinal = nextOrdinals.get(occurrence.parameterKey) ?? 0;
    if (
      occurrence.occurrenceOrdinal !== expectedOrdinal ||
      (previous !== undefined &&
        comparePositions(previous.range.start, occurrence.range.start) > 0)
    ) {
      return false;
    }
    nextOrdinals.set(occurrence.parameterKey, expectedOrdinal + 1);
    previous = occurrence;
  }
  return true;
};

const isUnitEntry = (value: unknown): value is SemanticDiffSourceUnitEntry =>
  hasExactKeys(value, [
    "unitId",
    "headerRange",
    "nameRange",
    "parameterOccurrences",
  ]) &&
  typeof value.unitId === "string" &&
  value.unitId.length > 0 &&
  isRange(value.headerRange) &&
  (value.nameRange === null || isRange(value.nameRange)) &&
  areParameterOccurrencesValid(value.parameterOccurrences);

export const validateSemanticDiffSourceIndex = (
  value: unknown,
  expectedId?: SemanticDiffSourceIndexId,
): value is SemanticDiffSourceIndex =>
  hasExactKeys(value, ["sourceIndexId", "unitEntries"]) &&
  isSemanticDiffSourceIndexId(value.sourceIndexId) &&
  (expectedId === undefined || value.sourceIndexId === expectedId) &&
  Array.isArray(value.unitEntries) &&
  value.unitEntries.every(isUnitEntry);

const freezePosition = (
  position: SemanticDiffSourcePosition,
): SemanticDiffSourcePosition => Object.freeze({ ...position });

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

/**
 * Validates and detaches a parser-owned DTO before a capture scope retains it.
 * The explicit reconstruction prevents mutable parser objects or extra fields
 * from crossing the application/host lifetime boundary.
 */
export const freezeSemanticDiffSourceIndex = (
  value: unknown,
): SemanticDiffSourceIndex | undefined => {
  if (!validateSemanticDiffSourceIndex(value)) return undefined;
  return Object.freeze({
    sourceIndexId: value.sourceIndexId,
    unitEntries: Object.freeze(value.unitEntries.map(freezeUnitEntry)),
  });
};

const isLookupRequest = (
  value: unknown,
): value is SemanticDiffSourceLookupRequest => {
  if (!isPlainRecord(value)) return false;
  if (
    typeof value.sourceIndexId !== "string" ||
    typeof value.unitId !== "string" ||
    typeof value.targetKind !== "string"
  ) {
    return false;
  }
  if (value.targetKind === "attribute") {
    const parameterKey = value.parameterKey;
    return (
      hasExactKeys(value, [
        "sourceIndexId",
        "unitId",
        "targetKind",
        "parameterKey",
      ]) &&
      typeof parameterKey === "string" &&
      parameterKey.length > 0
    );
  }
  return (
    hasExactKeys(value, ["sourceIndexId", "unitId", "targetKind"]) &&
    (value.targetKind === "unit" ||
      value.targetKind === "jobnet" ||
      value.targetKind === "jobgroup")
  );
};

const isAttributeRequestMissingParameterKey = (value: unknown): boolean => {
  if (!isPlainRecord(value) || value.targetKind !== "attribute") return false;
  if (
    typeof value.sourceIndexId !== "string" ||
    typeof value.unitId !== "string"
  ) {
    return false;
  }
  const hasBaseKeys = hasExactKeys(value, [
    "sourceIndexId",
    "unitId",
    "targetKind",
  ]);
  const hasParameterKey = hasExactKeys(value, [
    "sourceIndexId",
    "unitId",
    "targetKind",
    "parameterKey",
  ]);
  return (
    (hasBaseKeys || hasParameterKey) &&
    (typeof value.parameterKey !== "string" || value.parameterKey.length === 0)
  );
};

export const lookupSemanticDiffSourceIndex = (
  index: SemanticDiffSourceIndex | undefined,
  request: unknown,
  expiredIds: ReadonlySet<SemanticDiffSourceIndexId> = new Set(),
): SemanticDiffSourceLookupResult => {
  if (isAttributeRequestMissingParameterKey(request)) {
    return { code: "parameter-key-missing" };
  }
  if (!isLookupRequest(request)) return { code: "unsupported-target-kind" };
  if (!isSemanticDiffSourceIndexId(request.sourceIndexId)) {
    return { code: "source-index-missing" };
  }
  if (index === undefined) {
    return {
      code: expiredIds.has(request.sourceIndexId)
        ? "expired-source-index"
        : "source-index-missing",
    };
  }
  if (!validateSemanticDiffSourceIndex(index, request.sourceIndexId)) {
    return { code: "malformed-source" };
  }
  const matches = index.unitEntries.filter(
    (entry) => entry.unitId === request.unitId,
  );
  if (matches.length !== 1) return { code: "unit-missing" };
  const entry = matches[0]!;
  if (request.targetKind !== "attribute") {
    const hasName =
      entry.nameRange !== null &&
      comparePositions(entry.nameRange.start, entry.nameRange.end) < 0;
    return {
      primaryRange: hasName ? entry.nameRange! : entry.headerRange,
      occurrences: [],
    };
  }
  const occurrences = entry.parameterOccurrences
    .filter((occurrence) => occurrence.parameterKey === request.parameterKey)
    .map((occurrence) => occurrence.range);
  if (occurrences.length === 0) return { code: "parameter-occurrence-missing" };
  return { primaryRange: occurrences[0]!, occurrences };
};

export class SemanticDiffSourceIndexRegistry
  implements SemanticDiffSourceLookupPort
{
  readonly #indexes = new Map<
    SemanticDiffSourceIndexId,
    SemanticDiffSourceIndex
  >();
  readonly #expired = new Set<SemanticDiffSourceIndexId>();

  public register(index: SemanticDiffSourceIndex): void {
    const frozenIndex = freezeSemanticDiffSourceIndex(index);
    if (frozenIndex === undefined) {
      throw new TypeError("Malformed source index.");
    }
    this.#indexes.set(frozenIndex.sourceIndexId, frozenIndex);
    this.#expired.delete(frozenIndex.sourceIndexId);
  }

  public unregister(sourceIndexId: SemanticDiffSourceIndexId): boolean {
    const removed = this.#indexes.delete(sourceIndexId);
    if (removed) this.#expired.add(sourceIndexId);
    return removed;
  }

  public get(
    sourceIndexId: SemanticDiffSourceIndexId,
  ): SemanticDiffSourceIndex | undefined {
    return this.#indexes.get(sourceIndexId);
  }

  public lookup(
    request: SemanticDiffSourceLookupRequest,
  ): SemanticDiffSourceLookupResult {
    const sourceIndexId =
      isPlainRecord(request) &&
      isSemanticDiffSourceIndexId(request.sourceIndexId)
        ? request.sourceIndexId
        : undefined;
    return lookupSemanticDiffSourceIndex(
      sourceIndexId === undefined
        ? undefined
        : this.#indexes.get(sourceIndexId),
      request,
      this.#expired,
    );
  }

  public get size(): number {
    return this.#indexes.size;
  }

  public clear(): void {
    this.#indexes.forEach((_value, key) => this.#expired.add(key));
    this.#indexes.clear();
  }
}

export const isAjsParserError = (
  value: ParseAjsWithSourceIndexResult,
): value is { ok: false; errors: AjsParserError[] } => value.ok === false;
