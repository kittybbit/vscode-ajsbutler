import React, { useCallback } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import Paper from "@mui/material/Paper";
import {
  ExplorerRowView,
  renderExplorerRowLabel,
  type ExplorerRow,
} from "./semanticDiffExplorerTree";
import { handleExplorerTreeKey } from "./semanticDiffExplorerKeyboard";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import { semanticDiffExplorerFocusSx } from "../../shared/muiTheme";
import ResultSection from "../shared/result/ResultSection";

export type SemanticDiffExplorerTreePanelProps = Readonly<{
  rows: readonly ExplorerRow[];
  labels: SemanticDiffExplorerLabels;
  language: string;
  selectedId: string | undefined;
  activeId: string | undefined;
  activeIndex: number;
  selectedIndex: number;
  action?: (actionId: string, element?: HTMLElement) => void;
  focusSelected: (id: string) => void;
  toggleExpanded: (id: string) => void;
  registerRow: (id: string, element: HTMLElement | null) => void;
  treeRef: React.RefObject<HTMLDivElement | null>;
  virtuosoRef: React.RefObject<VirtuosoHandle | null>;
  setAnnouncement: (value: string) => void;
}>;

const createRowHandlers = ({
  row,
  labels,
  focusSelected,
  toggleExpanded,
  setAnnouncement,
}: Readonly<{
  row: ExplorerRow;
  labels: SemanticDiffExplorerLabels;
  focusSelected: (id: string) => void;
  toggleExpanded: (id: string) => void;
  setAnnouncement: (value: string) => void;
}>): Pick<
  React.ComponentProps<typeof ExplorerRowView>,
  "onSelect" | "onToggle"
> => ({
  onSelect: () => {
    focusSelected(row.id);
    setAnnouncement(labels.selected(renderExplorerRowLabel({ row, labels })));
  },
  onToggle: () => {
    focusSelected(row.id);
    toggleExpanded(row.id);
    const label = labels.group(row.node?.label ?? "");
    setAnnouncement(
      row.expanded ? labels.collapsed(label) : labels.expanded(label),
    );
  },
});

export const SemanticDiffExplorerTreePanel = ({
  rows,
  labels,
  language,
  selectedId,
  activeId,
  activeIndex,
  selectedIndex,
  action,
  focusSelected,
  toggleExpanded,
  registerRow,
  treeRef,
  virtuosoRef,
  setAnnouncement,
}: SemanticDiffExplorerTreePanelProps): React.ReactElement => {
  const renderRow = useCallback(
    (_index: number, row: ExplorerRow): React.ReactElement => {
      const handlers = createRowHandlers({
        row,
        labels,
        focusSelected,
        toggleExpanded,
        setAnnouncement,
      });
      return (
        <ExplorerRowView
          row={row}
          selected={row.id === selectedId}
          labels={labels}
          language={language}
          {...handlers}
          onAction={action}
          rowRef={(element) => registerRow(row.id, element)}
        />
      );
    },
    [
      action,
      focusSelected,
      labels,
      registerRow,
      selectedId,
      setAnnouncement,
      toggleExpanded,
    ],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void =>
    handleExplorerTreeKey({
      event,
      row: rows[activeIndex],
      rows,
      activeIndex,
      selectedIndex,
      focus: focusSelected,
      toggle: toggleExpanded,
      announce: setAnnouncement,
      labels,
    });

  return (
    <ResultSection title={labels.tree} ariaLabel={labels.tree} sx={{ mb: 0 }}>
      <Paper
        ref={treeRef}
        role="tree"
        tabIndex={0}
        aria-activedescendant={activeId}
        aria-label={labels.tree}
        variant="outlined"
        data-semantic-diff-explorer-tree="true"
        onKeyDown={handleKeyDown}
        sx={{
          minHeight: "12rem",
          height: "calc(100vh - 18rem)",
          minWidth: 0,
          overflow: "auto",
          p: 0.5,
          backgroundColor: "transparent",
          ...semanticDiffExplorerFocusSx,
        }}
      >
        {rows.length > 200 ? (
          <Virtuoso
            ref={virtuosoRef}
            data={rows}
            totalCount={rows.length}
            overscan={20 * 48}
            itemContent={renderRow}
          />
        ) : (
          rows.map((row, index) => (
            <React.Fragment key={row.id}>
              {renderRow(index, row)}
            </React.Fragment>
          ))
        )}
      </Paper>
    </ResultSection>
  );
};

export default SemanticDiffExplorerTreePanel;
