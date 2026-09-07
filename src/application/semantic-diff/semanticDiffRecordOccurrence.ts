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
  if (
    recordId === null ||
    occurrence === null ||
    !Number.isSafeInteger(occurrence) ||
    occurrence < 0
  ) {
    return undefined;
  }
  let matchingOccurrence = 0;
  for (const record of records) {
    if (record.id !== recordId) continue;
    if (matchingOccurrence === occurrence) return record;
    matchingOccurrence += 1;
  }
  return undefined;
};

/** Parse the host-private occurrence suffix from a projected leaf ID. */
export const parseSemanticDiffRecordOccurrence = (
  leafId: string,
): number | null => {
  const separator = leafId.lastIndexOf(":");
  if (separator < 0) return null;
  const occurrence = Number(leafId.slice(separator + 1));
  return Number.isSafeInteger(occurrence) && occurrence >= 0
    ? occurrence
    : null;
};
