import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import type { AjsParserError, ParseAjsResult } from "./AjsParserPort";
import {
  hasExactKeys,
  isPlainRecord,
  validateSourceIndexShape,
} from "./semanticDiffSourceIndexGuards";
import {
  freezeSourceIndexValue,
  getRequestSourceIndexId,
  lookupSemanticDiffSourceIndex as lookupSourceIndex,
} from "./semanticDiffSourceIndexLookup";

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

export const validateSemanticDiffSourceIndex = (
  value: unknown,
  expectedId?: SemanticDiffSourceIndexId,
): value is SemanticDiffSourceIndex =>
  validateSourceIndexShape(value, expectedId) &&
  isSemanticDiffSourceIndexId(value.sourceIndexId);

/**
 * Validates and detaches a parser-owned DTO before a capture scope retains it.
 * The explicit reconstruction prevents mutable parser objects or extra fields
 * from crossing the application/host lifetime boundary.
 */
export const freezeSemanticDiffSourceIndex = (
  value: unknown,
): SemanticDiffSourceIndex | undefined =>
  validateSemanticDiffSourceIndex(value)
    ? freezeSourceIndexValue(value)
    : undefined;

export const lookupSemanticDiffSourceIndex = (
  index: SemanticDiffSourceIndex | undefined,
  request: unknown,
  expiredIds: ReadonlySet<SemanticDiffSourceIndexId> = new Set(),
): SemanticDiffSourceLookupResult =>
  lookupSourceIndex(index, request, expiredIds);

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
    const sourceIndexId = getRequestSourceIndexId(request);
    return lookupSourceIndex(
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

export { hasExactKeys, isPlainRecord };
