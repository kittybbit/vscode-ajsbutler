import type { SemanticDiffExplorerLeaf, SemanticDiffExplorerTreeNode } from "./semanticDiffExplorerDto";
import { COMPARISON_LEVEL_FINDINGS_GROUP } from "./semanticDiffExplorerDto";
import { freeze, freezeArray } from "./semanticDiffExplorerProjectionSupport";
import { placementForLeaf, pathFromSegments, type PathPlacement } from "./semanticDiffExplorerProjectionPaths";

export type MutableTreeNode = {
  id: string;
  kind: "root" | "job-group" | "unit";
  label: string;
  path: string | null;
  children: Map<string, MutableTreeNode>;
  leaves: SemanticDiffExplorerLeaf[];
};

type MutableNodeInput = Pick<MutableTreeNode, "id" | "kind" | "label" | "path">;

const newMutableNode = (input: MutableNodeInput): MutableTreeNode => ({
  ...input,
  children: new Map(),
  leaves: [],
});

const comparisonGroup = (root: MutableTreeNode): MutableTreeNode => {
  const key = "comparison-level";
  const existing = root.children.get(key);
  if (existing !== undefined) return existing;
  const group = newMutableNode({
    id: "group:comparison-level",
    kind: "job-group",
    label: COMPARISON_LEVEL_FINDINGS_GROUP,
    path: null,
  });
  root.children.set(key, group);
  return group;
};

const childKey = (kind: MutableTreeNode["kind"], path: string | null): string =>
  `${kind}\u0000${path ?? ""}`;

type ChildInput = {
  current: MutableTreeNode;
  placement: PathPlacement;
  segment: string;
  index: number;
};

const childForPlacement = (input: ChildInput): MutableTreeNode => {
  const { current, placement, segment, index } = input;
  const path = pathFromSegments(placement.segments.slice(0, index + 1));
  const kind =
    index === placement.segments.length - 1 ? placement.finalKind : "job-group";
  const key = childKey(kind, path);
  const existing = current.children.get(key);
  if (existing !== undefined) return existing;
  const child = newMutableNode({
    id: `${kind}:${path ?? ""}`,
    kind,
    label: segment,
    path,
  });
  current.children.set(key, child);
  return child;
};

const pathNodeForLeaf = (
  root: MutableTreeNode,
  placement: PathPlacement,
): MutableTreeNode => {
  let current = root;
  placement.segments.forEach((segment, index) => {
    current = childForPlacement({ current, placement, segment, index });
  });
  return current;
};

const insertPlacedLeaf = (
  root: MutableTreeNode,
  leaf: SemanticDiffExplorerLeaf,
  placement: PathPlacement,
): void => {
  pathNodeForLeaf(root, placement).leaves.push(leaf);
};

const insertLeaf = (
  root: MutableTreeNode,
  leaf: SemanticDiffExplorerLeaf,
): void => {
  const placement = placementForLeaf(leaf);
  if (placement === null) {
    comparisonGroup(root).leaves.push(leaf);
    return;
  }
  insertPlacedLeaf(root, leaf, placement);
};

export const compareUtf16 = (left: string, right: string): number => {
  const limit = Math.min(left.length, right.length);
  const indexes = Array.from({ length: limit }, (_, index) => index);
  const mismatch = indexes.find(
    (index) => left.charCodeAt(index) !== right.charCodeAt(index),
  );
  return mismatch === undefined
    ? left.length - right.length
    : left.charCodeAt(mismatch) - right.charCodeAt(mismatch);
};

const stablePrimitiveKey = (value: unknown): string | null => {
  const type = typeof value;
  const primitiveKeys = new Map<string, (value: unknown) => string>([
    ["string", (item) => `string:${JSON.stringify(item)}`],
    ["number", (item) => `number:${String(item)}`],
    ["boolean", (item) => `boolean:${String(item)}`],
    ["undefined", () => "undefined"],
  ]);
  return primitiveKeys.get(type)?.(value) ??
    (type === "object" ? null : `${type}:${String(value)}`);
};

const stableArrayKey = (value: readonly unknown[]): string =>
  `[${value.map(stableValueKey).join(",")}]`;

const stableObjectKey = (value: Record<string, unknown>): string =>
  `{${Object.keys(value)
    .sort(compareUtf16)
    .map((key) => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
    .join(",")}}`;

export const stableValueKey = (value: unknown): string => {
  if (value === null) return "null";
  const primitive = stablePrimitiveKey(value);
  if (primitive !== null) return primitive;
  return stableComplexKey(value);
};

const stableComplexKey = (value: unknown): string => {
  if (Array.isArray(value)) return stableArrayKey(value);
  return stableObjectKey(value as Record<string, unknown>);
};

const leafKindOrder = new Map<string, number>([
  ["change", 0],
  ["confirmation", 1],
  ["unsupported", 2],
  ["limitation", 3],
  ["schedule", 4],
]);

const leafSortKey = (leaf: SemanticDiffExplorerLeaf): string => leaf.recordId;

const compareChildren = (
  left: MutableTreeNode,
  right: MutableTreeNode,
): number => {
  const rankDifference = comparisonRank(left) - comparisonRank(right);
  if (rankDifference !== 0) return rankDifference;
  return compareLabels(left, right);
};

const comparisonRank = (node: MutableTreeNode): number =>
  node.path === null ? 1 : 0;

const compareLabels = (left: MutableTreeNode, right: MutableTreeNode): number => {
  const labelDifference = compareUtf16(left.label, right.label);
  return labelDifference !== 0
    ? labelDifference
    : compareUtf16(left.id, right.id);
};

const compareLeaves = (
  left: SemanticDiffExplorerLeaf,
  right: SemanticDiffExplorerLeaf,
): number => {
  const leftRank = leafKindOrder.get(left.kind) ?? Number.MAX_SAFE_INTEGER;
  const rightRank = leafKindOrder.get(right.kind) ?? Number.MAX_SAFE_INTEGER;
  const kindDifference = leftRank - rightRank;
  if (kindDifference !== 0) return kindDifference;
  const keyDifference = compareUtf16(leafSortKey(left), leafSortKey(right));
  return keyDifference !== 0
    ? keyDifference
    : compareUtf16(left.id, right.id);
};

export const freezeTree = (node: MutableTreeNode): SemanticDiffExplorerTreeNode =>
  freeze({
    id: node.id,
    kind: node.kind,
    label: node.label,
    path: node.path,
    children: freezeArray(
      [...node.children.values()].sort(compareChildren).map(freezeTree),
    ),
    leaves: freezeArray([...node.leaves].sort(compareLeaves)),
  });

export const buildTree = (
  leaves: readonly SemanticDiffExplorerLeaf[],
): SemanticDiffExplorerTreeNode => {
  const root = newMutableNode({
    id: "root",
    kind: "root",
    label: "Semantic Diff",
    path: null,
  });
  leaves.forEach((leaf) => insertLeaf(root, leaf));
  return freezeTree(root);
};
