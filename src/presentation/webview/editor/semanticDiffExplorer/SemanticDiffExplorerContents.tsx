import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import {
  getSemanticDiffExplorerLabels,
  type SemanticDiffExplorerLabels,
} from "./semanticDiffExplorerLocalization";
import {
  useExplorerFilterState,
  useExplorerSelection,
  useExplorerTreeState,
} from "./semanticDiffExplorerViewState";
import SemanticDiffExplorerHeader from "./Header";
import SemanticDiffExplorerSummaryCards from "./SummaryCards";
import SemanticDiffExplorerTreePanel from "./ExplorerTreePanel";
import ResultEmptyState from "../shared/result/ResultEmptyState";
import ResultStatusChip from "../shared/result/ResultStatusChip";

export type SemanticDiffExplorerThemeMode = "light" | "dark";

export type SemanticDiffExplorerContentsProps = Readonly<{
  viewModel: SemanticDiffExplorerViewModel;
  language: string;
  themeMode: SemanticDiffExplorerThemeMode;
  outputAction?: (element?: HTMLElement) => void;
  calendarAction?: (element?: HTMLElement) => void;
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

export const SemanticDiffExplorerContents = ({
  viewModel,
  language,
  themeMode,
  outputAction,
  calendarAction,
  action,
  hostAnnouncement,
  virtualizedScrollToIndex,
}: SemanticDiffExplorerContentsProps): React.ReactElement => {
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
    <Stack
      component="main"
      aria-labelledby="semantic-diff-explorer-title"
      data-semantic-diff-theme-mode={themeMode}
      data-semantic-diff-explorer-contents="true"
      spacing={0}
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        p: { xs: 1, sm: 2 },
        overflowWrap: "anywhere",
      }}
    >
      <SemanticDiffExplorerHeader
        labels={labels}
        language={language}
        filter={filter}
        setFilter={setFilter}
        setAnnouncement={setAnnouncement}
        outputAction={outputAction}
        calendarAction={calendarAction}
      />
      <SemanticDiffExplorerSummaryCards
        viewModel={filteredViewModel}
        labels={labels}
        language={language}
      />
      {filteredViewModel.status === "findings" ? (
        <ResultStatusChip
          label={explorerStatus(filteredViewModel, labels)}
          ariaLabel={explorerStatus(filteredViewModel, labels)}
          role="status"
        />
      ) : (
        <ResultEmptyState>
          {explorerStatus(filteredViewModel, labels)}
        </ResultEmptyState>
      )}
      <Typography
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{ minHeight: "1.5em" }}
      >
        {announcement}
      </Typography>
      <SemanticDiffExplorerTreePanel
        {...selection}
        rows={rows}
        labels={labels}
        language={language}
        action={action}
        toggleExpanded={toggleExpanded}
        setAnnouncement={setAnnouncement}
      />
    </Stack>
  );
};

export default SemanticDiffExplorerContents;
