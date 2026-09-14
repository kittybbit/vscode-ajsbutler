import type {
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerTreeNode,
} from "../../../../application/semantic-diff/semanticDiffExplorer";

export type ExplorerRow = Readonly<{
  id: string;
  kind: "group" | "leaf";
  level: number;
  position: number;
  size: number;
  parentId: string | undefined;
  node?: SemanticDiffExplorerTreeNode;
  leaf?: SemanticDiffExplorerLeaf;
  expanded?: boolean;
}>;

type ExplorerRowInput = Readonly<{
  node: SemanticDiffExplorerTreeNode;
  level: number;
  parentId: string | undefined;
  position: number;
  size: number;
  expanded: ReadonlySet<string>;
  rows: ExplorerRow[];
}>;

const appendGroupRow = ({
  node,
  level,
  position,
  size,
  parentId,
  expanded,
  rows,
}: Readonly<{
  node: Exclude<SemanticDiffExplorerTreeNode, { kind: "root" }>;
  level: number;
  position: number;
  size: number;
  parentId: string | undefined;
  expanded: ReadonlySet<string>;
  rows: ExplorerRow[];
}>): void => {
  rows.push({
    id: node.id,
    kind: "group",
    level,
    position,
    size,
    parentId,
    node,
    expanded: expanded.has(node.id),
  });
};

const appendGroupRowIfPresent = (input: ExplorerRowInput): void => {
  if (input.node.kind !== "root") {
    appendGroupRow({
      node: input.node,
      level: input.level,
      position: input.position,
      size: input.size,
      parentId: input.parentId,
      expanded: input.expanded,
      rows: input.rows,
    });
  }
};

const hasVisibleChildren = (
  node: SemanticDiffExplorerTreeNode,
  expanded: ReadonlySet<string>,
): boolean => node.kind === "root" || expanded.has(node.id);

const appendLeafRows = ({
  node,
  level,
  parentId,
  size,
  rows,
}: Readonly<{
  node: SemanticDiffExplorerTreeNode;
  level: number;
  parentId: string;
  size: number;
  rows: ExplorerRow[];
}>): void => {
  node.leaves.forEach((leaf, index) =>
    rows.push({
      id: leaf.id,
      kind: "leaf",
      level: level + 1,
      position: index + 1,
      size,
      parentId,
      leaf,
    }),
  );
};

const appendChildRows = ({
  node,
  level,
  expanded,
  size,
  rows,
}: Readonly<{
  node: SemanticDiffExplorerTreeNode;
  level: number;
  expanded: ReadonlySet<string>;
  size: number;
  rows: ExplorerRow[];
}>): void => {
  node.children.forEach((child, index) =>
    appendExplorerRows({
      node: child,
      level: level + 1,
      parentId: node.id,
      position: node.leaves.length + index + 1,
      size,
      expanded,
      rows,
    }),
  );
};

const appendExplorerRows = ({
  node,
  level,
  parentId,
  position,
  size,
  expanded,
  rows,
}: ExplorerRowInput): void => {
  appendGroupRowIfPresent({
    node,
    level,
    position,
    size,
    parentId,
    expanded,
    rows,
  });
  if (!hasVisibleChildren(node, expanded)) return;
  const sizeForChildren = node.leaves.length + node.children.length;
  appendLeafRows({
    node,
    level,
    parentId: node.id,
    size: sizeForChildren,
    rows,
  });
  appendChildRows({ node, level, expanded, size: sizeForChildren, rows });
};

export const flattenSemanticDiffExplorerTree = (
  root: SemanticDiffExplorerTreeNode,
  expanded: ReadonlySet<string>,
): ExplorerRow[] => {
  const rows: ExplorerRow[] = [];
  appendExplorerRows({
    node: root,
    level: 0,
    parentId: undefined,
    position: 1,
    size: 1,
    expanded,
    rows,
  });
  return rows;
};

export const allExpandableNodeIds = (
  root: SemanticDiffExplorerTreeNode,
): Set<string> => {
  const ids = new Set<string>();
  const visit = (node: SemanticDiffExplorerTreeNode): void => {
    if (node.kind !== "root") ids.add(node.id);
    node.children.forEach(visit);
  };
  visit(root);
  return ids;
};
