import type React from "react";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import {
  renderExplorerRowLabel,
  type ExplorerRow,
} from "./semanticDiffExplorerTree";

type MoveDirection = "first" | "last" | "next" | "previous";

const moveIndex: Readonly<
  Record<MoveDirection, (length: number, selected: number) => number>
> = {
  first: () => 0,
  last: (length) => length - 1,
  next: (length, selected) =>
    Math.min(length - 1, selected < 0 ? 0 : selected + 1),
  previous: (_length, selected) => Math.max(0, selected < 0 ? 0 : selected - 1),
};

const moveTreeSelection = ({
  rows,
  selectedIndex,
  direction,
  focus,
}: Readonly<{
  rows: readonly ExplorerRow[];
  selectedIndex: number;
  direction: MoveDirection;
  focus: (id: string) => void;
}>): string | undefined => {
  if (rows.length === 0) return undefined;
  const row = rows[moveIndex[direction](rows.length, selectedIndex)];
  if (!row) return undefined;
  focus(row.id);
  return row.id;
};

const createMoveHandler =
  ({
    event,
    rows,
    selectedIndex,
    focus,
    announce,
    labels,
  }: Readonly<{
    event: React.KeyboardEvent<HTMLDivElement>;
    rows: readonly ExplorerRow[];
    selectedIndex: number;
    focus: (id: string) => void;
    announce: (value: string) => void;
    labels: SemanticDiffExplorerLabels;
  }>): ((direction: MoveDirection) => void) =>
  (direction) => {
    event.preventDefault();
    const id = moveTreeSelection({ rows, selectedIndex, direction, focus });
    const next = rows.find((candidate) => candidate.id === id);
    if (next)
      announce(labels.selected(renderExplorerRowLabel({ row: next, labels })));
  };

export const handleExplorerTreeKey = ({
  event,
  row,
  rows,
  activeIndex,
  selectedIndex,
  focus,
  toggle,
  announce,
  labels,
}: Readonly<{
  event: React.KeyboardEvent<HTMLDivElement>;
  row: ExplorerRow | undefined;
  rows: readonly ExplorerRow[];
  activeIndex: number;
  selectedIndex: number;
  focus: (id: string) => void;
  toggle: (id: string) => void;
  announce: (value: string) => void;
  labels: SemanticDiffExplorerLabels;
}>): void => {
  if (!row) return;
  const move = createMoveHandler({
    event,
    rows,
    selectedIndex,
    focus,
    announce,
    labels,
  });
  const keyHandler = explorerKeyHandlers[event.key];
  if (keyHandler)
    keyHandler({
      event,
      row,
      rows,
      activeIndex,
      focus,
      toggle,
      announce,
      labels,
      move,
    });
};

type ExplorerKeyContext = Readonly<{
  event: React.KeyboardEvent<HTMLDivElement>;
  row: ExplorerRow;
  rows: readonly ExplorerRow[];
  activeIndex: number;
  focus: (id: string) => void;
  toggle: (id: string) => void;
  announce: (value: string) => void;
  labels: SemanticDiffExplorerLabels;
  move: (direction: MoveDirection) => void;
}>;
type ExplorerKeyHandler = (context: ExplorerKeyContext) => void;

const selectRow = ({
  row,
  focus,
  announce,
  labels,
}: ExplorerKeyContext): void => {
  focus(row.id);
  announce(labels.selected(renderExplorerRowLabel({ row, labels })));
};
const toggleRow = ({
  row,
  toggle,
  announce,
  labels,
}: ExplorerKeyContext): void => {
  toggle(row.id);
  const label = labels.group(row.node?.label ?? "");
  announce(row.expanded ? labels.collapsed(label) : labels.expanded(label));
};
const handleEnter: ExplorerKeyHandler = (context) => {
  context.event.preventDefault();
  if (context.row.kind === "group") toggleRow(context);
  else selectRow(context);
};
const handleRight: ExplorerKeyHandler = (context) => {
  const { row, event } = context;
  const child = context.rows[context.activeIndex + 1];
  if (row.kind === "group" && !row.expanded) {
    event.preventDefault();
    toggleRow(context);
  } else if (child?.parentId === row.id) {
    event.preventDefault();
    selectRow({ ...context, row: child });
  }
};
const handleLeft: ExplorerKeyHandler = (context) => {
  const { row } = context;
  const expandedGroup = row.kind === "group" && row.expanded;
  if (expandedGroup) return collapseGroup(context);
  selectParent(context);
};

const collapseGroup = (context: ExplorerKeyContext): void => {
  context.event.preventDefault();
  toggleRow(context);
};

const selectParent = (context: ExplorerKeyContext): void => {
  const parent = context.row.parentId
    ? context.rows.find((candidate) => candidate.id === context.row.parentId)
    : undefined;
  if (!parent) return;
  context.event.preventDefault();
  selectRow({ ...context, row: parent });
};

const explorerKeyHandlers: Readonly<Record<string, ExplorerKeyHandler>> = {
  ArrowDown: ({ move }) => move("next"),
  ArrowUp: ({ move }) => move("previous"),
  Home: ({ move }) => move("first"),
  End: ({ move }) => move("last"),
  Enter: handleEnter,
  ArrowRight: handleRight,
  ArrowLeft: handleLeft,
};
