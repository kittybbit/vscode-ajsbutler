import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChangeKind,
  SemanticDiffElementKind,
  SemanticDiffResult,
  SemanticDiffOutputContext,
  SemanticDiffSummary,
  SemanticDiffUnsupportedKind,
} from "./semanticDiffDto";

const changeKinds: SemanticDiffChangeKind[] = [
  "added",
  "removed",
  "changed",
  "renamed",
  "moved",
];

const elementKinds: SemanticDiffElementKind[] = [
  "job-group",
  "jobnet",
  "unit",
  "relation",
  "attribute",
];

const attributeCategories: SemanticDiffAttributeCategory[] = [
  "execution-environment",
  "execution-definition",
  "start-condition",
  "end-control",
  "abnormal-end-control",
  "wait-condition",
  "external-integration",
  "schedule",
];

const unsupportedKinds: SemanticDiffUnsupportedKind[] = [
  "unsupported",
  "uninterpretable",
  "uncalculated",
];

const zeroCounts = <T extends string>(keys: readonly T[]): Record<T, number> =>
  Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;

type SemanticDiffSummaryCounts = {
  changeCountsByKind: Record<SemanticDiffChangeKind, number>;
  changeCountsByElementKind: Record<SemanticDiffElementKind, number>;
  changeCountsByAttributeCategory: Record<
    SemanticDiffAttributeCategory,
    number
  >;
  confirmationRequiredCount: number;
};

const createSummaryCounts = (): SemanticDiffSummaryCounts => ({
  changeCountsByKind: zeroCounts(changeKinds),
  changeCountsByElementKind: zeroCounts(elementKinds),
  changeCountsByAttributeCategory: zeroCounts(attributeCategories),
  confirmationRequiredCount: 0,
});

const attributeCategoryForChange = (
  change: SemanticDiffResult["changes"][number],
): SemanticDiffAttributeCategory | undefined =>
  change.elementKind === "attribute" ? change.attributeCategory : undefined;

const countChange = (
  counts: SemanticDiffSummaryCounts,
  change: SemanticDiffResult["changes"][number],
): void => {
  counts.changeCountsByKind[change.kind] += 1;
  counts.changeCountsByElementKind[change.elementKind] += 1;
  const attributeCategory = attributeCategoryForChange(change);
  if (attributeCategory) {
    counts.changeCountsByAttributeCategory[attributeCategory] += 1;
  }
  counts.confirmationRequiredCount += Number(
    change.confirmationLevel === "confirmation-required",
  );
};

const countChanges = (
  changes: SemanticDiffResult["changes"],
): SemanticDiffSummaryCounts => {
  const counts = createSummaryCounts();
  changes.forEach((change) => countChange(counts, change));
  return counts;
};

const countUnsupportedItems = (
  items: SemanticDiffResult["unsupportedItems"],
): Record<SemanticDiffUnsupportedKind, number> => {
  const counts = zeroCounts(unsupportedKinds);
  items.forEach((item) => {
    counts[item.kind] += 1;
  });
  return counts;
};

const hasUncalculatedItems = <T extends { kind: string }>(
  items: T[],
): boolean => items.some((item) => item.kind === "uncalculated");

const hasSummaryFindings = (counts: number[]): boolean =>
  counts.some((count) => count > 0);

export const buildSemanticDiffSummary = (
  result: SemanticDiffResult,
): SemanticDiffSummary => {
  const changeCounts = countChanges(result.changes);
  const unsupportedCountsByKind = countUnsupportedItems(
    result.unsupportedItems,
  );
  const scheduleRunChangeCount =
    result.scheduleComparison?.runChanges.length ?? 0;
  const hasUncalculated =
    hasUncalculatedItems(result.unsupportedItems) ||
    hasUncalculatedItems(result.limitations);
  const hasFindings = hasSummaryFindings([
    result.changes.length,
    result.confirmationRequired.length,
    result.unsupportedItems.length,
    result.limitations.length,
    scheduleRunChangeCount,
  ]);

  return {
    changeCountsByKind: changeCounts.changeCountsByKind,
    changeCountsByElementKind: changeCounts.changeCountsByElementKind,
    changeCountsByAttributeCategory:
      changeCounts.changeCountsByAttributeCategory,
    unsupportedCountsByKind,
    confirmationRequiredCount:
      result.confirmationRequired.length +
      changeCounts.confirmationRequiredCount,
    limitationCount: result.limitations.length,
    scheduleRunChangeCount,
    hasUncalculated,
    hasFindings,
  };
};

export const buildSemanticDiffOutputContext = (
  result: SemanticDiffResult,
): SemanticDiffOutputContext => {
  const summary = buildSemanticDiffSummary(result);
  return Object.freeze({ result, summary });
};
