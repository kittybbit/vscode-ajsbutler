import type {
  SemanticDiffExplorerCard,
  SemanticDiffExplorerTreeNode,
  SemanticDiffExplorerViewModel,
  SemanticDiffExplorerLeaf,
} from "./semanticDiffExplorerDto";
import {
  asPlainRecord,
  hasExactKeys,
  isDenseArray,
  isNullableString,
} from "./semanticDiffExplorerMessagePrimitives";
import { isSemanticDiffExplorerLeaf } from "./semanticDiffExplorerLeafGuards";

const cardKeys = new Map<string, readonly string[]>([
  ["changes", ["added", "removed", "changed", "renamed", "moved"]],
  ["elements", ["job-group", "jobnet", "unit", "relation", "attribute"]],
  ["attributes", [
    "execution-environment",
    "execution-definition",
    "start-condition",
    "end-control",
    "abnormal-end-control",
    "wait-condition",
    "external-integration",
    "schedule",
  ]],
  ["confirmation-required", ["required"]],
  ["unsupported", ["unsupported", "uninterpretable", "uncalculated"]],
  ["limitations", ["total"]],
  ["schedule-run-changes", ["total"]],
]);

const cardOrder: readonly SemanticDiffExplorerCard["id"][] = [
  "changes",
  "elements",
  "attributes",
  "confirmation-required",
  "unsupported",
  "limitations",
  "schedule-run-changes",
];

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const hasCardShape = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["id", "count", "counts"]) &&
  typeof record.id === "string" &&
  isNonNegativeInteger(record.count) &&
  asPlainRecord(record.counts) !== null;

const hasCountValues = (counts: Record<string, unknown>): boolean =>
  Object.values(counts).every(isNonNegativeInteger);

const isCardValue = (
  record: Record<string, unknown>,
  counts: Record<string, unknown>,
  keys: readonly string[],
): boolean =>
  hasExactKeys(counts, keys) &&
  hasCountValues(counts) &&
  record.count === sumCounts(counts);

const isCardRecord = (record: Record<string, unknown>): boolean => {
  const counts = asPlainRecord(record.counts);
  const keys = cardKeys.get(record.id as string);
  return counts === null || keys === undefined
    ? false
    : isCardValue(record, counts, keys);
};

const sumCounts = (counts: Record<string, unknown>): number =>
  Object.values(counts).reduce<number>(
    (sum, count) => sum + (count as number),
    0,
  );

export const isSemanticDiffExplorerCard = (
  value: unknown,
): value is SemanticDiffExplorerCard => {
  const record = asPlainRecord(value);
  return record !== null && hasCardShape(record) && isCardRecord(record);
};

const hasTreeKeys = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["id", "kind", "label", "path", "children", "leaves"]);

const hasTreeLabels = (record: Record<string, unknown>): boolean =>
  typeof record.id === "string" &&
  typeof record.label === "string" &&
  isNullableString(record.path);

const hasTreeArrays = (record: Record<string, unknown>): boolean =>
  isDenseArray(record.children) && isDenseArray(record.leaves);

const isTreeShape = (record: Record<string, unknown>): boolean =>
  hasTreeKeys(record) && hasTreeLabels(record) && hasTreeArrays(record);

const isTreeKind = (value: unknown): value is "root" | "job-group" | "unit" =>
  value === "root" || value === "job-group" || value === "unit";

const isRootShape = (record: Record<string, unknown>): boolean =>
  record.kind === "root" && record.id === "root" && record.path === null &&
  isEmptyArray(record.leaves);

const isEmptyArray = (value: unknown): boolean =>
  Array.isArray(value) && value.length === 0;

const isNonRootShape = (record: Record<string, unknown>): boolean =>
  record.kind !== "root" && record.id !== "root";

const isTreeKindShape = (record: Record<string, unknown>): boolean =>
  record.kind === "root" ? isRootShape(record) : isNonRootShape(record);

const isTreeChildren = (children: readonly unknown[]): boolean =>
  children.every((child) => {
    const record = asPlainRecord(child);
    return record !== null && record.kind !== "root" && isTreeNode(record);
  });

const isTreeLeaves = (leaves: readonly unknown[]): boolean =>
  leaves.every(isSemanticDiffExplorerLeaf);

export const isTreeNode = (
  value: unknown,
): value is SemanticDiffExplorerTreeNode => {
  const record = asPlainRecord(value);
  if (record === null || !isTreeShape(record) || !isTreeKind(record.kind)) {
    return false;
  }
  return [
    isTreeKindShape(record),
    isTreeChildren(record.children as readonly unknown[]),
    isTreeLeaves(record.leaves as readonly unknown[]),
  ].every(Boolean);
};

export const countTreeLeaves = (node: SemanticDiffExplorerTreeNode): number =>
  node.leaves.length +
  node.children.reduce((sum, child) => sum + countTreeLeaves(child), 0);

const isConfirmationOnlyLeaf = (leaf: SemanticDiffExplorerLeaf): boolean =>
  leaf.kind === "confirmation" ||
  (leaf.kind === "change" &&
    leaf.confirmationLevel === "confirmation-required");

const treeContainsOnlyConfirmationLeaves = (
  node: SemanticDiffExplorerTreeNode,
): boolean => {
  const leavesValid = node.leaves.every(isConfirmationOnlyLeaf);
  const childrenValid = node.children.every(treeContainsOnlyConfirmationLeaves);
  return leavesValid && childrenValid;
};

const hasViewKeys = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["filter", "cards", "tree", "leafCount", "status"]);

const isExplorerFilter = (value: unknown): boolean =>
  value === "all" || value === "confirmation-required";

const isCardList = (value: unknown): boolean => {
  if (!isDenseArray(value) || value.length !== cardOrder.length) return false;
  const cards = value as SemanticDiffExplorerCard[];
  return (
    cards.every(isSemanticDiffExplorerCard) &&
    cards.every((card, index) => card.id === cardOrder[index])
  );
};

const isViewShape = (record: Record<string, unknown>): boolean =>
  hasViewKeys(record) && isExplorerFilter(record.filter) && isCardList(record.cards);

const isRootTree = (tree: SemanticDiffExplorerTreeNode): boolean =>
  tree.kind === "root" &&
  tree.id === "root" &&
  tree.path === null &&
  tree.leaves.length === 0;

const isStatusValid = (
  record: Record<string, unknown>,
  leafCount: number,
): boolean => {
  if (leafCount > 0) return record.status === "findings";
  return record.filter === "all"
    ? record.status === "empty"
    : record.status === "filter-empty";
};

const isViewCountsValid = (
  record: Record<string, unknown>,
  leafCount: number,
): boolean =>
  countTreeLeaves(record.tree as SemanticDiffExplorerTreeNode) === leafCount;

const isRootViewRecord = (record: Record<string, unknown>): boolean => {
  const tree = record.tree as SemanticDiffExplorerTreeNode;
  const leafCount = record.leafCount;
  if (!isNonNegativeInteger(leafCount)) return false;
  const filterTreeValid =
    record.filter === "all" || treeContainsOnlyConfirmationLeaves(tree);
  return [
    isRootTree(tree),
    isViewCountsValid(record, leafCount),
    isStatusValid(record, leafCount),
    filterTreeValid,
  ].every(Boolean);
};

const isViewRecord = (record: Record<string, unknown>): boolean => {
  if (!isTreeNode(record.tree)) return false;
  return isViewShape(record) && isRootViewRecord(record);
};

export const isSemanticDiffExplorerViewModel = (
  value: unknown,
): value is SemanticDiffExplorerViewModel => {
  const record = asPlainRecord(value);
  return record !== null && isViewRecord(record);
};
