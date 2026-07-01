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
import { useMyAppContext } from "../MyContexts";
import { localeMap } from "../../../../domain/services/i18n/nls";
import { OPERATION, SAVE } from "../../../../shared/webviewEvents";
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
};

type HeaderColumnSelectorButtonProps = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const formatUnitCountLabel = (
  visibleRowCount: number,
  totalRowCount: number,
): string => `${visibleRowCount} / ${totalRowCount} units`;

export const getAjsTableHeaderControlLabels = (lang: string) => ({
  columns: localeMap("table.menu.menuItem1", lang),
  copyCsv: "Copy the contents to clipbord as csv.",
  saveCsv: "Save the contents as csv.",
});

const tableHeaderSearchLabels: HeaderSearchControlLabels = {
  helperText: {
    noResults: "No units match in the list.",
    matched: "Matched row is selected in the list.",
    idle: "Search units by visible values, path, comment, or parameter value.",
  },
  navigation: {
    resultAriaLabel: (position) =>
      `${position.current} of ${position.total} list search results`,
    previousTooltip: "Previous list search result (Shift+Enter).",
    previousAriaLabel: "Previous list search result.",
    nextTooltip: "Next list search result (Enter).",
    nextAriaLabel: "Next list search result.",
  },
};

export const getAjsTableSearchHelperText = (
  searchedAbsolutePath?: string,
  resultPosition?: TableSearchResultPosition,
): string =>
  resolveHeaderSearchHelperText(
    searchedAbsolutePath,
    resultPosition,
    tableHeaderSearchLabels.helperText,
  );

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  searchedAbsolutePath,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => (
  <HeaderSearchControl<TableSearchDirection>
    matchedTargetId={searchedAbsolutePath}
    resultPosition={searchResultPosition}
    placeholderLabel="Search unit list"
    labels={tableHeaderSearchLabels}
    onSearchNavigate={onSearchNavigate}
    onSearchSubmit={onSearchSubmit}
    onSearchClear={onSearchClear}
  />
);

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
}) => {
  const [open, setOpen] = useState(false);

  const handleCopy = useCallback(() => {
    const csv = exportCsvView(table);
    window.vscode.postMessage({ type: OPERATION, data: "copy.csv" });
    navigator.clipboard.writeText(csv);
    setOpen(true);
  }, [table]);

  const handleSave = useCallback(() => {
    const csv = exportCsvView(table);
    window.vscode.postMessage({ type: OPERATION, data: "save.csv" });
    window.vscode.postMessage({ type: SAVE, data: csv });
  }, [table]);

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
        <Alert severity="info" variant="filled">
          Copied
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
          />
          <Chip
            size="small"
            variant="outlined"
            label={formatUnitCountLabel(visibleRowCount, totalRowCount)}
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
