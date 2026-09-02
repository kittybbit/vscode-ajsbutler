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

export const buildSemanticDiffSummary = (
  result: SemanticDiffResult,
): SemanticDiffSummary => {
  const changeCountsByKind = zeroCounts(changeKinds);
  const changeCountsByElementKind = zeroCounts(elementKinds);
  const changeCountsByAttributeCategory = zeroCounts(attributeCategories);
  const unsupportedCountsByKind = zeroCounts(unsupportedKinds);
  let confirmationRequiredCount = result.confirmationRequired.length;

  result.changes.forEach((change) => {
    changeCountsByKind[change.kind] += 1;
    changeCountsByElementKind[change.elementKind] += 1;
    if (change.elementKind === "attribute" && change.attributeCategory) {
      changeCountsByAttributeCategory[change.attributeCategory] += 1;
    }
    if (change.confirmationLevel === "confirmation-required") {
      confirmationRequiredCount += 1;
    }
  });

  result.unsupportedItems.forEach((item) => {
    unsupportedCountsByKind[item.kind] += 1;
  });

  const scheduleRunChangeCount =
    result.scheduleComparison?.runChanges.length ?? 0;
  const hasUncalculated =
    result.unsupportedItems.some((item) => item.kind === "uncalculated") ||
    result.limitations.some((limitation) => limitation.kind === "uncalculated");
  const hasFindings =
    result.changes.length > 0 ||
    result.confirmationRequired.length > 0 ||
    result.unsupportedItems.length > 0 ||
    result.limitations.length > 0 ||
    scheduleRunChangeCount > 0;

  return {
    changeCountsByKind,
    changeCountsByElementKind,
    changeCountsByAttributeCategory,
    unsupportedCountsByKind,
    confirmationRequiredCount,
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
