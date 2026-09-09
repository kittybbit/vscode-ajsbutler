import type { SemanticDiffOutputContext } from "./semanticDiffDto";
import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerActionIdAllocator,
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerCard,
  SemanticDiffExplorerFilter,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerSession,
  SemanticDiffExplorerSessionIdAllocator,
  SemanticDiffExplorerTreeNode,
  SemanticDiffExplorerViewModel,
} from "./semanticDiffExplorerDto";
import {
  buildCards,
  createLeaves,
} from "./semanticDiffExplorerProjectionLeaves";
import {
  semanticDiffChangeTargetSide,
  semanticDiffConfirmationTargetSide,
} from "./semanticDiffExplorerProjectionSupport";
import { buildTree } from "./semanticDiffExplorerProjectionTree";
import { freeze } from "./semanticDiffExplorerProjectionSupport";

const unfilteredViewByFilteredView = new WeakMap<
  object,
  SemanticDiffExplorerViewModel
>();

export { semanticDiffChangeTargetSide, semanticDiffConfirmationTargetSide };
export const resolveSemanticDiffChangeTargetSide = semanticDiffChangeTargetSide;
export const resolveSemanticDiffConfirmationTargetSide =
  semanticDiffConfirmationTargetSide;

const hasConfirmation = (leaf: SemanticDiffExplorerLeaf): boolean =>
  leaf.kind === "confirmation" ||
  (leaf.kind === "change" &&
    leaf.confirmationLevel === "confirmation-required");

const filterTreeLeaves = (
  node: SemanticDiffExplorerTreeNode,
  filter: SemanticDiffExplorerFilter,
): readonly SemanticDiffExplorerLeaf[] =>
  filter === "all" ? node.leaves : node.leaves.filter(hasConfirmation);

const filterTreeChildren = (
  node: SemanticDiffExplorerTreeNode,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerTreeNode[] =>
  node.children
    .map((child) => filterTree(child, filter))
    .filter((child): child is SemanticDiffExplorerTreeNode => child !== null);

const isEmptyFilteredGroup = (
  node: SemanticDiffExplorerTreeNode,
  leaves: readonly SemanticDiffExplorerLeaf[],
  children: readonly SemanticDiffExplorerTreeNode[],
): boolean =>
  node.kind !== "root" && leaves.length === 0 && children.length === 0;

const filterTree = (
  node: SemanticDiffExplorerTreeNode,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerTreeNode | null => {
  const leaves = filterTreeLeaves(node, filter);
  const children = filterTreeChildren(node, filter);
  if (isEmptyFilteredGroup(node, leaves, children)) return null;
  return freeze({
    ...node,
    leaves: freeze(leaves),
    children: freeze(children),
  });
};

const countLeaves = (node: SemanticDiffExplorerTreeNode): number =>
  node.leaves.length +
  node.children.reduce((sum, child) => sum + countLeaves(child), 0);

const createViewModel = (
  cards: readonly SemanticDiffExplorerCard[],
  tree: SemanticDiffExplorerTreeNode,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel => {
  const leafCount = countLeaves(tree);
  const status = explorerStatus(leafCount, filter);
  return freeze({ filter, cards, tree, leafCount, status });
};

const explorerStatus = (
  leafCount: number,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel["status"] => {
  if (leafCount > 0) return "findings";
  return filter === "all" ? "empty" : "filter-empty";
};

export type BuildSemanticDiffExplorerViewOptions = {
  readonly actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
};

/** Build the projection from one already-built output context. */
export const buildSemanticDiffExplorerViewModel = (
  context: SemanticDiffOutputContext,
  options: BuildSemanticDiffExplorerViewOptions,
): SemanticDiffExplorerViewModel => {
  const leaves = createLeaves(context, options.actionIdAllocator);
  return createViewModel(buildCards(context), buildTree(leaves), "all");
};

export const buildSemanticDiffExplorerView = buildSemanticDiffExplorerViewModel;

/** Apply only the panel-local filter; cards and context remain unchanged. */
export const filterSemanticDiffExplorerViewModel = (
  viewModel: SemanticDiffExplorerViewModel,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel => {
  if (viewModel.filter === filter) return viewModel;
  const restored = restoreUnfilteredView(viewModel, filter);
  if (restored !== null) return restored;
  return createFilteredView(viewModel, filter);
};

const restoreUnfilteredView = (
  viewModel: SemanticDiffExplorerViewModel,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel | null => {
  if (filter !== "all") return null;
  return unfilteredViewByFilteredView.get(viewModel) ?? null;
};

const createFilteredView = (
  viewModel: SemanticDiffExplorerViewModel,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerViewModel => {
  const tree = filterTree(viewModel.tree, filter);
  if (tree === null) throw new Error("The Explorer root cannot be removed.");
  const filtered = createViewModel(viewModel.cards, tree, filter);
  if (filter !== "all") unfilteredViewByFilteredView.set(filtered, viewModel);
  return filtered;
};

export const applySemanticDiffExplorerFilter =
  filterSemanticDiffExplorerViewModel;

export type CreateSemanticDiffExplorerSessionOptions = {
  readonly displayLanguage?: string;
  readonly sessionIdAllocator: SemanticDiffExplorerSessionIdAllocator;
  readonly actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
};

const actionIdsInTree = (
  tree: SemanticDiffExplorerTreeNode,
): Set<SemanticDiffExplorerActionId> => {
  const ids = new Set<SemanticDiffExplorerActionId>();
  collectTreeActionIds(tree, ids);
  return ids;
};

const collectLeafActionIds = (
  leaf: SemanticDiffExplorerLeaf,
  ids: Set<SemanticDiffExplorerActionId>,
): void => {
  [leaf.actions.source, leaf.actions.flow]
    .map((action) => action.actionId)
    .filter(
      (actionId): actionId is SemanticDiffExplorerActionId => actionId !== null,
    )
    .forEach((actionId) => ids.add(actionId));
};

const collectTreeActionIds = (
  node: SemanticDiffExplorerTreeNode,
  ids: Set<SemanticDiffExplorerActionId>,
): void => {
  node.leaves.forEach((leaf) => collectLeafActionIds(leaf, ids));
  node.children.forEach((child) => collectTreeActionIds(child, ids));
};

const createActionLookup = (
  ids: Iterable<SemanticDiffExplorerActionId>,
): SemanticDiffExplorerActionLookup => {
  const values = Object.freeze([...new Set(ids)]);
  const membership = new Set(values);
  return Object.freeze({
    size: values.length,
    has: (value: unknown): value is SemanticDiffExplorerActionId =>
      typeof value === "string" &&
      membership.has(value as SemanticDiffExplorerActionId),
    toArray: (): readonly SemanticDiffExplorerActionId[] => values,
  });
};

/** Create one session while retaining the exact context object identity. */
export const createSemanticDiffExplorerSession = (
  context: SemanticDiffOutputContext,
  options: CreateSemanticDiffExplorerSessionOptions,
): SemanticDiffExplorerSession => {
  const allViewModel = buildSemanticDiffExplorerViewModel(context, {
    actionIdAllocator: options.actionIdAllocator,
  });
  return freeze({
    sessionId: options.sessionIdAllocator(),
    context,
    displayLanguage: options.displayLanguage ?? "en",
    viewModel: allViewModel,
    allViewModel,
    actionIds: createActionLookup(actionIdsInTree(allViewModel.tree)),
  });
};

export const setSemanticDiffExplorerFilter = (
  session: SemanticDiffExplorerSession,
  filter: SemanticDiffExplorerFilter,
): SemanticDiffExplorerSession =>
  session.viewModel.filter === filter
    ? session
    : freeze({
        ...session,
        viewModel: filterSemanticDiffExplorerViewModel(
          session.allViewModel,
          filter,
        ),
      });

export const getSemanticDiffExplorerActionIds = (
  session: SemanticDiffExplorerSession,
): readonly SemanticDiffExplorerActionId[] => session.actionIds.toArray();
