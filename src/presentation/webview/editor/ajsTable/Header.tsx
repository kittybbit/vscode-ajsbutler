import React, { FC, memo, useCallback, useState } from "react";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { Table, VisibilityState } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import { useMyAppContext } from "../MyContexts";
import {
  formatUnitInformationMessage,
  unitInformationMessage,
} from "../unitInformationLocalization";
import {
  createViewerOperationRequest,
  createViewerPerformanceRequest,
  createViewerSaveRequest,
} from "../../viewerRequestMessages";
import { exportCsvView } from "./exportCsvView";
import DisplayColumnSelector from "./DisplayColumnSelector";
import {
  HeaderSearchControl,
  resolveHeaderSearchHelperText,
} from "../shared/HeaderSearchField";
import type { HeaderSearchControlLabels } from "../shared/HeaderSearchField";
import type {
  TableSearchDirection,
  TableSearchResultPosition,
} from "./tableSearchState";

type HeaderProps = {
  table: Table<UnitListRowView>;
  columnVisibility: VisibilityState;
  searchedAbsolutePath?: string;
  searchResultPosition?: TableSearchResultPosition;
  onSearchNavigate: (query: string, direction: TableSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
  onCopied?: () => void;
  visibleRowCount: number;
  totalRowCount: number;
};

type HeaderSearchFieldProps = Pick<
  HeaderProps,
  | "searchedAbsolutePath"
  | "searchResultPosition"
  | "onSearchNavigate"
  | "onSearchSubmit"
  | "onSearchClear"
>;

type HeaderCsvActionsProps = {
  table: Table<UnitListRowView>;
  copyCsvLabel: string;
  saveCsvLabel: string;
  copiedLabel: string;
  onCopied?: () => void;
};

type HeaderColumnSelectorButtonProps = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const formatUnitCountLabel = (
  visibleRowCount: number,
  totalRowCount: number,
  language = "en",
): string =>
  formatUnitInformationMessage("a11y.table.count", language, {
    total: totalRowCount,
    visible: visibleRowCount,
  });

export const getAjsTableHeaderControlLabels = (lang: string) => ({
  columns: unitInformationMessage("table.menu.menuItem1", lang),
  copyCsv: unitInformationMessage("a11y.table.copyCsv", lang),
  saveCsv: unitInformationMessage("a11y.table.saveCsv", lang),
});

const getTableHeaderSearchLabels = (
  language: string,
): HeaderSearchControlLabels => ({
  helperText: {
    noResults: unitInformationMessage("a11y.table.search.noResults", language),
    matched: unitInformationMessage("a11y.table.search.matched", language),
    idle: unitInformationMessage("a11y.table.search.idle", language),
  },
  navigation: {
    resultAriaLabel: (position) => `${position.current} / ${position.total}`,
    previousTooltip: unitInformationMessage("a11y.search.previous", language),
    previousAriaLabel: unitInformationMessage("a11y.search.previous", language),
    nextTooltip: unitInformationMessage("a11y.search.next", language),
    nextAriaLabel: unitInformationMessage("a11y.search.next", language),
  },
});

export const getAjsTableSearchHelperText = (
  searchedAbsolutePath?: string,
  resultPosition?: TableSearchResultPosition,
  language = "en",
): string =>
  resolveHeaderSearchHelperText(
    searchedAbsolutePath,
    resultPosition,
    getTableHeaderSearchLabels(language).helperText,
  );

export const createCsvExportPerformanceEvent = (
  durationMs: number,
  rowCount: number,
) =>
  createViewerPerformanceRequest({
    operation: "csv_export",
    result: "success",
    durationBucket: toDurationBucket(durationMs),
    rowCountBucket: toCountBucket(rowCount),
  });

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  searchedAbsolutePath,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => {
  const { lang = "en" } = useMyAppContext();
  return (
    <HeaderSearchControl<TableSearchDirection>
      matchedTargetId={searchedAbsolutePath}
      resultPosition={searchResultPosition}
      placeholderLabel={unitInformationMessage(
        "a11y.table.search.placeholder",
        lang,
      )}
      labels={getTableHeaderSearchLabels(lang)}
      onSearchNavigate={onSearchNavigate}
      onSearchSubmit={onSearchSubmit}
      onSearchClear={onSearchClear}
    />
  );
};

const HeaderColumnSelectorButton: FC<HeaderColumnSelectorButtonProps> = ({
  label,
  onClick,
}) => (
  <Tooltip title={label}>
    <IconButton size="small" aria-label={label} onClick={onClick}>
      <DisplaySettingsIcon fontSize="inherit" />
    </IconButton>
  </Tooltip>
);

const HeaderCsvActions: FC<HeaderCsvActionsProps> = ({
  table,
  copyCsvLabel,
  saveCsvLabel,
  copiedLabel,
  onCopied,
}) => {
  const [open, setOpen] = useState(false);

  const exportCsvWithPerformanceTelemetry = useCallback(() => {
    const startedAt = performance.now();
    const csv = exportCsvView(table);
    window.vscode.postMessage(
      createCsvExportPerformanceEvent(
        performance.now() - startedAt,
        table.getRowModel().rows.length,
      ),
    );
    return csv;
  }, [table]);

  const handleCopy = useCallback(() => {
    const csv = exportCsvWithPerformanceTelemetry();
    window.vscode.postMessage(createViewerOperationRequest("copy.csv"));
    navigator.clipboard.writeText(csv);
    setOpen(true);
    onCopied?.();
  }, [exportCsvWithPerformanceTelemetry, onCopied]);

  const handleSave = useCallback(() => {
    const csv = exportCsvWithPerformanceTelemetry();
    window.vscode.postMessage(createViewerOperationRequest("save.csv"));
    window.vscode.postMessage(createViewerSaveRequest(csv));
  }, [exportCsvWithPerformanceTelemetry]);

  return (
    <>
      <Tooltip title={copyCsvLabel}>
        <IconButton aria-label={copyCsvLabel} size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title={saveCsvLabel}>
        <IconButton aria-label={saveCsvLabel} size="small" onClick={handleSave}>
          <SaveIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Snackbar
        sx={{ position: "absolute" }}
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity="info" variant="filled" aria-hidden="true">
          {copiedLabel}
        </Alert>
      </Snackbar>
    </>
  );
};

const Header: FC<HeaderProps> = ({
  table,
  columnVisibility,
  searchedAbsolutePath,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
  onCopied,
  visibleRowCount,
  totalRowCount,
}) => {
  console.log("render Header.");

  const { lang } = useMyAppContext();
  const controlLabels = getAjsTableHeaderControlLabels(lang);

  const [columnSelectorAnchor, setColumnSelectorAnchor] =
    useState<HTMLElement | null>(null);

  const openColumnSelector = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setColumnSelectorAnchor(event.currentTarget);
    },
    [],
  );

  const closeColumnSelector = useCallback(() => {
    setColumnSelectorAnchor(null);
  }, []);

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          flexShrink: 0,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: (theme) => `${theme.palette.background.paper}f2`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ gap: 1.25, minHeight: "3.5rem" }}>
          <HeaderSearchField
            searchedAbsolutePath={searchedAbsolutePath}
            searchResultPosition={searchResultPosition}
            onSearchNavigate={onSearchNavigate}
            onSearchSubmit={onSearchSubmit}
            onSearchClear={onSearchClear}
          />
          <HeaderColumnSelectorButton
            label={controlLabels.columns}
            onClick={openColumnSelector}
          />
          <Stack flexGrow={1} />
          <HeaderCsvActions
            table={table}
            copyCsvLabel={controlLabels.copyCsv}
            saveCsvLabel={controlLabels.saveCsv}
            copiedLabel={unitInformationMessage("a11y.table.copied", lang)}
            onCopied={onCopied}
          />
          <Chip
            size="small"
            variant="outlined"
            label={formatUnitCountLabel(visibleRowCount, totalRowCount, lang)}
          />
        </Toolbar>
        <DisplayColumnSelector
          table={table}
          columnVisibility={columnVisibility}
          anchorEl={columnSelectorAnchor}
          open={Boolean(columnSelectorAnchor)}
          onClose={closeColumnSelector}
        />
      </AppBar>
    </>
  );
};
export default memo(Header);
