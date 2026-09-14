import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
} from "react";
import type { VirtuosoHandle } from "react-virtuoso";
import {
  filterSemanticDiffExplorerViewModel,
  type SemanticDiffExplorerViewModel,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import {
  allExpandableNodeIds,
  flattenSemanticDiffExplorerTree,
  type ExplorerRow,
} from "./semanticDiffExplorerTreeData";
import { focusExplorerRowAfterVirtualizedScroll } from "./semanticDiffExplorerFocus";

export const useExplorerFilterState = (
  viewModel: SemanticDiffExplorerViewModel,
): Readonly<{
  filter: SemanticDiffExplorerViewModel["filter"];
  filteredViewModel: SemanticDiffExplorerViewModel;
  setFilter: (value: SemanticDiffExplorerViewModel["filter"]) => void;
}> => {
  const [filter, setFilter] = useState(viewModel.filter);
  const baseViewModel =
    viewModel.filter === "all"
      ? viewModel
      : filterSemanticDiffExplorerViewModel(viewModel, "all");
  const filteredViewModel = useMemo(
    () => filterSemanticDiffExplorerViewModel(baseViewModel, filter),
    [baseViewModel, filter],
  );
  return { filter, filteredViewModel, setFilter };
};

export const useExplorerTreeState = (
  tree: SemanticDiffExplorerViewModel["tree"],
): Readonly<{
  expanded: Set<string>;
  rows: readonly ExplorerRow[];
  toggleExpanded: (id: string) => void;
}> => {
  const [expanded, setExpanded] = useState<Set<string>>(() =>
    allExpandableNodeIds(tree),
  );
  const rows = useMemo(
    () => flattenSemanticDiffExplorerTree(tree, expanded),
    [expanded, tree],
  );
  const toggleExpanded = useCallback(
    (id: string): void =>
      setExpanded((current) => toggleExpandedState(current, id)),
    [],
  );
  return { expanded, rows, toggleExpanded };
};

const toggleExpandedState = (current: Set<string>, id: string): Set<string> => {
  const next = new Set(current);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

const initializeSelection = ({
  rows,
  selectedId,
  latentSelection,
  setSelectedId,
}: Readonly<{
  rows: readonly ExplorerRow[];
  selectedId: string | undefined;
  latentSelection: MutableRefObject<string | undefined>;
  setSelectedId: Dispatch<SetStateAction<string | undefined>>;
}>): void => {
  if (rows.length === 0 || selectedId) return;
  setSelectedId(selectionFallback({ rows, latentSelection }));
};

const selectionFallback = ({
  rows,
  latentSelection,
}: Readonly<{
  rows: readonly ExplorerRow[];
  latentSelection: MutableRefObject<string | undefined>;
}>): string => {
  const latent = latentSelection.current;
  return latent && rows.some((row) => row.id === latent) ? latent : rows[0]!.id;
};

const focusRenderedRow = (
  element: HTMLElement,
  treeRef: RefObject<HTMLDivElement | null>,
): void => {
  element.scrollIntoView({ block: "nearest" });
  treeRef.current?.focus({ preventScroll: true });
};

const scrollVirtualizedRow = ({
  index,
  virtualizedScrollToIndex,
  virtuosoRef,
}: Readonly<{
  index: number;
  virtualizedScrollToIndex?: (index: number) => void;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
}>): void => {
  virtualizedScrollToIndex?.(index);
  if (!virtualizedScrollToIndex)
    virtuosoRef.current?.scrollToIndex({
      index,
      align: "center",
      behavior: "auto",
    });
};
const scheduleExplorerFocus = ({
  id,
  rowElements,
  treeRef,
  mounted,
}: Readonly<{
  id: string;
  rowElements: MutableRefObject<Map<string, HTMLElement>>;
  treeRef: RefObject<HTMLDivElement | null>;
  mounted: MutableRefObject<boolean>;
}>): void => {
  focusExplorerRowAfterVirtualizedScroll({
    id,
    getElement: (rowId) => rowElements.current.get(rowId),
    focus: () => {
      if (mounted.current) treeRef.current?.focus({ preventScroll: true });
    },
    requestAnimationFrame: window.requestAnimationFrame,
  });
};
const focusVirtualizedRow = ({
  id,
  index,
  rows,
  virtualizedScrollToIndex,
  virtuosoRef,
  rowElements,
  treeRef,
  mounted,
}: Readonly<{
  id: string;
  index: number;
  rows: readonly ExplorerRow[];
  virtualizedScrollToIndex?: (index: number) => void;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
  rowElements: MutableRefObject<Map<string, HTMLElement>>;
  treeRef: RefObject<HTMLDivElement | null>;
  mounted: MutableRefObject<boolean>;
}>): void => {
  if (
    index < 0 ||
    rows.length <= 200 ||
    (!virtuosoRef.current && !virtualizedScrollToIndex)
  )
    return;
  scrollVirtualizedRow({ index, virtualizedScrollToIndex, virtuosoRef });
  scheduleExplorerFocus({ id, rowElements, treeRef, mounted });
};

const focusExplorerSelection = ({
  id,
  rows,
  rowElements,
  treeRef,
  mounted,
  virtuosoRef,
  virtualizedScrollToIndex,
  setSelectedId,
  latentSelection,
}: Readonly<{
  id: string;
  rows: readonly ExplorerRow[];
  rowElements: MutableRefObject<Map<string, HTMLElement>>;
  treeRef: RefObject<HTMLDivElement | null>;
  mounted: MutableRefObject<boolean>;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
  virtualizedScrollToIndex?: (index: number) => void;
  setSelectedId: Dispatch<SetStateAction<string | undefined>>;
  latentSelection: MutableRefObject<string | undefined>;
}>): void => {
  latentSelection.current = id;
  setSelectedId(id);
  const element = rowElements.current.get(id);
  if (element) return focusRenderedRow(element, treeRef);
  focusVirtualizedRow({
    id,
    index: rows.findIndex((row) => row.id === id),
    rows,
    virtualizedScrollToIndex,
    virtuosoRef,
    rowElements,
    treeRef,
    mounted,
  });
};

const markUnmounted = (mounted: MutableRefObject<boolean>): void => {
  mounted.current = false;
};
const registerExplorerRow = (
  rowElements: MutableRefObject<Map<string, HTMLElement>>,
  id: string,
  element: HTMLElement | null,
): void => {
  if (element) rowElements.current.set(id, element);
  else rowElements.current.delete(id);
};
const firstExplorerIndex = (length: number): number => (length > 0 ? 0 : -1);
const activeExplorerIndex = (selectedIndex: number, length: number): number =>
  selectedIndex >= 0 ? selectedIndex : firstExplorerIndex(length);
const activeExplorerId = (
  rows: readonly ExplorerRow[],
  index: number,
): string | undefined => (index >= 0 ? rows[index]!.id : undefined);

export const useExplorerSelection = (
  rows: readonly ExplorerRow[],
  virtualizedScrollToIndex?: (index: number) => void,
): Readonly<{
  selectedId: string | undefined;
  selectedIndex: number;
  activeIndex: number;
  activeId: string | undefined;
  focusSelected: (id: string) => void;
  registerRow: (id: string, element: HTMLElement | null) => void;
  treeRef: RefObject<HTMLDivElement | null>;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
}> => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const latentSelection = useRef<string | undefined>(undefined);
  const treeRef = useRef<HTMLDivElement>(null);
  const rowElements = useRef(new Map<string, HTMLElement>());
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const mounted = useRef(true);
  const selectedIndex = rows.findIndex((row) => row.id === selectedId);
  const activeIndex = activeExplorerIndex(selectedIndex, rows.length);
  const activeId = activeExplorerId(rows, activeIndex);

  useEffect(
    () =>
      initializeSelection({ rows, selectedId, latentSelection, setSelectedId }),
    [rows, selectedId],
  );
  useEffect(() => () => markUnmounted(mounted), []);

  const focusSelected = useCallback(
    (id: string): void =>
      focusExplorerSelection({
        id,
        rows,
        rowElements,
        treeRef,
        mounted,
        virtuosoRef,
        virtualizedScrollToIndex,
        setSelectedId,
        latentSelection,
      }),
    [rows, virtualizedScrollToIndex],
  );

  const registerRow = useCallback(
    (id: string, element: HTMLElement | null): void =>
      registerExplorerRow(rowElements, id, element),
    [],
  );

  return {
    selectedId,
    selectedIndex,
    activeIndex,
    activeId,
    focusSelected,
    registerRow,
    treeRef,
    virtuosoRef,
  };
};
