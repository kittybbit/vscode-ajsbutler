import React, { useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import GlobalStyles from "@mui/material/GlobalStyles";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ThemeProvider } from "@mui/material/styles";
import {
  filterSemanticDiffExplorerViewModel,
  type SemanticDiffExplorerViewModel,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerFocusSx,
  semanticDiffExplorerGlobalStyles,
} from "../shared/muiTheme";
import {
  ExplorerRowView,
  renderExplorerRowLabel,
  type ExplorerRow,
} from "./semanticDiffExplorerTree";
import { handleExplorerTreeKey } from "./semanticDiffExplorerKeyboard";
import {
  getSemanticDiffExplorerLabels,
  semanticDiffExplorerCardLabel,
  type SemanticDiffExplorerLabels,
} from "./semanticDiffExplorerLocalization";
import {
  useExplorerFilterState,
  useExplorerSelection,
  useExplorerTreeState,
} from "./semanticDiffExplorerViewState";
import type { SemanticDiffExplorerThemeMode } from "./semanticDiffExplorerThemeMode";

export type SemanticDiffExplorerViewProps = Readonly<{
  viewModel: SemanticDiffExplorerViewModel;
  language?: string;
  themeMode?: SemanticDiffExplorerThemeMode;
  outputAction?: (element?: HTMLElement) => void;
  action?: (actionId: string, element?: HTMLElement) => void;
  hostAnnouncement?: string;
  virtualizedScrollToIndex?: (index: number) => void;
}>;

const explorerStatus = (
  viewModel: SemanticDiffExplorerViewModel,
  labels: SemanticDiffExplorerLabels,
): string =>
  ({
    findings: labels.findings,
    empty: labels.empty,
    "filter-empty": labels.filterEmpty,
  })[viewModel.status];

const ExplorerCards = ({
  viewModel,
  labels,
  language,
}: Readonly<{
  viewModel: SemanticDiffExplorerViewModel;
  labels: SemanticDiffExplorerLabels;
  language: string;
}>): React.ReactElement => (
  <Box
    component="section"
    aria-label={labels.summaryCards}
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
      gap: 1.5,
      mb: 2,
    }}
  >
    {viewModel.cards.map((card) => (
      <Card
        component="article"
        variant="outlined"
        key={card.id}
        aria-label={`${semanticDiffExplorerCardLabel(card.id, language)}: ${card.count}`}
        sx={{ minWidth: 0, borderColor: "divider" }}
      >
        <CardContent>
          <Typography
            component="h2"
            variant="h6"
            sx={{ overflowWrap: "anywhere" }}
          >
            {semanticDiffExplorerCardLabel(card.id, language)}
          </Typography>
          <Typography
            component="output"
            variant="h4"
            aria-label={`${card.count}`}
          >
            {card.count}
          </Typography>
          <Box component="dl" sx={{ m: 0 }}>
            {Object.entries(card.counts).map(([key, count]) => (
              <Box key={key} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Typography component="dt" variant="body2">
                  {labels.value(key)}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0 }}>
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

const ExplorerHeader = ({
  labels,
  filter,
  setFilter,
  setAnnouncement,
  outputAction,
}: Readonly<{
  labels: SemanticDiffExplorerLabels;
  filter: SemanticDiffExplorerViewModel["filter"];
  setFilter: (value: SemanticDiffExplorerViewModel["filter"]) => void;
  setAnnouncement: (value: string) => void;
  outputAction?: (element?: HTMLElement) => void;
}>): React.ReactElement => {
  const filterRef = useRef<HTMLSelectElement>(null);
  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const next = event.target.value as SemanticDiffExplorerViewModel["filter"];
    setFilter(next);
    filterRef.current?.focus();
    setAnnouncement(next === "all" ? labels.all : labels.confirmationRequired);
  };
  return (
    <Stack component="header" spacing={2} sx={{ mb: 2 }}>
      <Typography component="h1" variant="h4" id="semantic-diff-explorer-title">
        {labels.title}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        useFlexGap
        sx={{ flexWrap: "wrap", alignItems: { sm: "center" } }}
      >
        <Button
          type="button"
          variant="contained"
          startIcon={<OpenInNewIcon aria-hidden="true" />}
          onClick={(event) => outputAction?.(event.currentTarget)}
          sx={semanticDiffExplorerFocusSx}
        >
          {labels.output}
        </Button>
        <FormControl sx={{ minWidth: 14 * 16, maxWidth: "100%" }}>
          <InputLabel htmlFor="semantic-diff-explorer-filter">
            {labels.filter}
          </InputLabel>
          <NativeSelect
            id="semantic-diff-explorer-filter"
            value={filter}
            inputProps={{ "aria-label": labels.filter }}
            ref={filterRef}
            onChange={handleFilterChange}
            sx={{
              minWidth: 0,
              maxWidth: "100%",
              ...semanticDiffExplorerFocusSx,
            }}
          >
            <option value="all">{labels.all}</option>
            <option value="confirmation-required">
              {labels.confirmationRequired}
            </option>
          </NativeSelect>
        </FormControl>
      </Stack>
    </Stack>
  );
};

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

const ExplorerTree = ({
  rows,
  labels,
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
}: Readonly<{
  rows: readonly ExplorerRow[];
  labels: SemanticDiffExplorerLabels;
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
}>): React.ReactElement => {
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
    <Paper
      ref={treeRef}
      role="tree"
      tabIndex={0}
      aria-activedescendant={activeId}
      aria-label={labels.tree}
      variant="outlined"
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
          <React.Fragment key={row.id}>{renderRow(index, row)}</React.Fragment>
        ))
      )}
    </Paper>
  );
};

export const SemanticDiffExplorerView = ({
  viewModel,
  language = "en",
  themeMode = "light",
  outputAction,
  action,
  hostAnnouncement,
  virtualizedScrollToIndex,
}: SemanticDiffExplorerViewProps): React.ReactElement => {
  const labels = getSemanticDiffExplorerLabels(language);
  const { filter, filteredViewModel, setFilter } =
    useExplorerFilterState(viewModel);
  const { rows, toggleExpanded } = useExplorerTreeState(filteredViewModel.tree);
  const selection = useExplorerSelection(rows, virtualizedScrollToIndex);
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (hostAnnouncement) setAnnouncement(hostAnnouncement);
  }, [hostAnnouncement]);
  return (
    <ThemeProvider theme={createSemanticDiffTheme({ mode: themeMode })}>
      <CssBaseline />
      <GlobalStyles styles={semanticDiffExplorerGlobalStyles} />
      <Box
        component="main"
        aria-labelledby="semantic-diff-explorer-title"
        data-semantic-diff-theme-mode={themeMode}
        sx={{
          width: "100%",
          minWidth: 0,
          minHeight: "100vh",
          p: { xs: 1, sm: 2 },
          overflowWrap: "anywhere",
        }}
      >
        <ExplorerHeader
          labels={labels}
          filter={filter}
          setFilter={setFilter}
          setAnnouncement={setAnnouncement}
          outputAction={outputAction}
        />
        <ExplorerCards
          viewModel={filteredViewModel}
          labels={labels}
          language={language}
        />
        <Typography component="p" role="status" sx={{ mb: 1 }}>
          {explorerStatus(filteredViewModel, labels)}
        </Typography>
        <Typography
          component="div"
          aria-live="polite"
          aria-atomic="true"
          sx={{ minHeight: "1.5em" }}
        >
          {announcement}
        </Typography>
        <ExplorerTree
          {...selection}
          rows={rows}
          labels={labels}
          action={action}
          toggleExpanded={toggleExpanded}
          setAnnouncement={setAnnouncement}
        />
      </Box>
    </ThemeProvider>
  );
};

export {
  flattenSemanticDiffExplorerTree,
  focusExplorerRowAfterVirtualizedScroll,
} from "./semanticDiffExplorerTree";
export const applyExplorerFilter = filterSemanticDiffExplorerViewModel;
export default SemanticDiffExplorerView;
