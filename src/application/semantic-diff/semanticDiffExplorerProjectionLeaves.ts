import type {
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffLimitation,
  SemanticDiffOutputContext,
  SemanticDiffScheduleRunChange,
  SemanticDiffUnsupportedItem,
} from "./semanticDiffDto";
import type {
  SemanticDiffExplorerActionIdAllocator,
  SemanticDiffExplorerCard,
  SemanticDiffExplorerCardId,
  SemanticDiffExplorerLeaf,
} from "./semanticDiffExplorerDto";
import { withSourceOrderOccurrences } from "./semanticDiffRecordOccurrence";
import {
  compareUtf16,
  stableValueKey,
} from "./semanticDiffExplorerProjectionTree";
import {
  changeLeaf,
  confirmationLeaf,
  freeze,
  limitationLeaf,
  scheduleLeaf,
  unsupportedLeaf,
} from "./semanticDiffExplorerProjectionSupport";

type Identified = { id: string };

const sortedRecords = <T>(
  records: readonly T[],
  identifier: (record: T) => string,
): T[] =>
  [...records].sort((left, right) => {
    const keyDifference = compareUtf16(identifier(left), identifier(right));
    return keyDifference !== 0
      ? keyDifference
      : compareUtf16(stableValueKey(left), stableValueKey(right));
  });

const sortedOccurrences = <T extends Identified>(
  records: readonly T[],
): Array<{ record: T; occurrence: number }> =>
  withSourceOrderOccurrences(records).sort((left, right) => {
    const keyDifference = compareUtf16(left.record.id, right.record.id);
    return keyDifference !== 0
      ? keyDifference
      : compareUtf16(stableValueKey(left.record), stableValueKey(right.record));
  });

const changeLeaves = (
  records: readonly SemanticDiffChange[],
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerLeaf[] =>
  sortedOccurrences(records).map(({ record, occurrence }) =>
    changeLeaf(record, occurrence, actionIdAllocator),
  );

const confirmationLeaves = (
  records: readonly SemanticDiffConfirmationRequiredItem[],
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerLeaf[] =>
  sortedOccurrences(records).map(({ record, occurrence }) =>
    confirmationLeaf(record, occurrence, actionIdAllocator),
  );

const unsupportedLeaves = (
  records: readonly SemanticDiffUnsupportedItem[],
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerLeaf[] =>
  sortedOccurrences(records).map(({ record, occurrence }) =>
    unsupportedLeaf(record, occurrence, actionIdAllocator),
  );

const occurrenceCounter = () => {
  const occurrences = new Map<string, number>();
  return (key: string): number => {
    const occurrence = occurrences.get(key) ?? 0;
    occurrences.set(key, occurrence + 1);
    return occurrence;
  };
};

const limitationLeaves = (
  records: readonly SemanticDiffLimitation[],
): SemanticDiffExplorerLeaf[] => {
  const nextOccurrence = occurrenceCounter();
  return sortedRecords(records, (item) => item.code).map((item) =>
    limitationLeaf(item, nextOccurrence(`limitation:${item.code}`)),
  );
};

const scheduleLeaves = (
  records: readonly SemanticDiffScheduleRunChange[],
): SemanticDiffExplorerLeaf[] => {
  const nextOccurrence = occurrenceCounter();
  return sortedRecords(records, (item) => item.id).map((item) =>
    scheduleLeaf(item, nextOccurrence(`schedule:${item.id}`)),
  );
};

export const createLeaves = (
  context: SemanticDiffOutputContext,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): readonly SemanticDiffExplorerLeaf[] =>
  freeze([
    ...changeLeaves(context.result.changes, actionIdAllocator),
    ...confirmationLeaves(
      context.result.confirmationRequired,
      actionIdAllocator,
    ),
    ...unsupportedLeaves(context.result.unsupportedItems, actionIdAllocator),
    ...limitationLeaves(context.result.limitations),
    ...scheduleLeaves(context.result.scheduleComparison?.runChanges ?? []),
  ]);

const total = (counts: Readonly<Record<string, number>>): number =>
  Object.values(counts).reduce((sum, count) => sum + count, 0);

const card = (
  id: SemanticDiffExplorerCardId,
  count: number,
  counts: Readonly<Record<string, number>>,
): SemanticDiffExplorerCard =>
  freeze({ id, count, counts: freeze({ ...counts }) });

export const buildCards = (
  context: SemanticDiffOutputContext,
): readonly SemanticDiffExplorerCard[] => {
  const summary = context.summary;
  return freeze([
    card(
      "changes",
      total(summary.changeCountsByKind),
      summary.changeCountsByKind,
    ),
    card(
      "elements",
      total(summary.changeCountsByElementKind),
      summary.changeCountsByElementKind,
    ),
    card(
      "attributes",
      total(summary.changeCountsByAttributeCategory),
      summary.changeCountsByAttributeCategory,
    ),
    card("confirmation-required", summary.confirmationRequiredCount, {
      required: summary.confirmationRequiredCount,
    }),
    card(
      "unsupported",
      total(summary.unsupportedCountsByKind),
      summary.unsupportedCountsByKind,
    ),
    card("limitations", summary.limitationCount, {
      total: summary.limitationCount,
    }),
    card("schedule-run-changes", summary.scheduleRunChangeCount, {
      total: summary.scheduleRunChangeCount,
    }),
  ]);
};
