/** A source-order occurrence carried through presentation sorting. */
export type SemanticDiffRecordWithOccurrence<T> = Readonly<{
  record: T;
  occurrence: number;
}>;

/** Assign duplicate ordinals before any presentation ordering is applied. */
export const withSourceOrderOccurrences = <T extends { id: string }>(
  records: readonly T[],
): SemanticDiffRecordWithOccurrence<T>[] => {
  const occurrenceById = new Map<string, number>();
  return records.map((record) => {
    const occurrence = occurrenceById.get(record.id) ?? 0;
    occurrenceById.set(record.id, occurrence + 1);
    return { record, occurrence };
  });
};

/** Resolve a duplicate record by the ordinal assigned in source order. */
export const recordAtSourceOccurrence = <T extends { id: string }>(
  records: readonly T[],
  recordId: string | null,
  occurrence: number | null,
): T | undefined => {
  if (!isValidOccurrenceLookup(recordId, occurrence)) return undefined;
  return findOccurrence(records, recordId, occurrence);
};

const isValidOccurrenceLookup = (
  recordId: string | null,
  occurrence: number | null,
): occurrence is number =>
  recordId !== null &&
  occurrence !== null &&
  Number.isSafeInteger(occurrence) &&
  occurrence >= 0;

const findOccurrence = <T extends { id: string }>(
  records: readonly T[],
  recordId: string,
  occurrence: number,
): T | undefined =>
  records.filter((record) => record.id === recordId)[occurrence];

const parseOccurrenceSuffix = (suffix: string): number | null => {
  const occurrence = Number(suffix);
  return Number.isSafeInteger(occurrence) && occurrence >= 0
    ? occurrence
    : null;
};

/** Parse the host-private occurrence suffix from a projected leaf ID. */
export const parseSemanticDiffRecordOccurrence = (
  leafId: string,
): number | null => {
  const separator = leafId.lastIndexOf(":");
  return separator < 0
    ? null
    : parseOccurrenceSuffix(leafId.slice(separator + 1));
};
