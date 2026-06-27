import React, {
  FC,
  Fragment,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Table } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { useMyAppContext } from "../MyContexts";
import { localeMap } from "../../../../domain/services/i18n/nls";
import { OPERATION, SAVE } from "../../../../shared/webviewEvents";
import { exportCsvView } from "./exportCsvView";
import DisplayColumnSelector from "./DisplayColumnSelector";
import SharedHeaderSearchField from "../shared/HeaderSearchField";
import type {
  TableSearchDirection,
  TableSearchResultPosition,
} from "./tableSearchState";

type HeaderProps = {
  table: Table<UnitListRowView>;
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

type SearchEndAdornmentProps = {
  canNavigate: boolean;
  resultPosition?: TableSearchResultPosition;
  onNavigate: (direction: TableSearchDirection) => void;
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

export const getAjsTableSearchHelperText = (
  searchedAbsolutePath?: string,
  resultPosition?: TableSearchResultPosition,
): string =>
  resultPosition?.total === 0
    ? "No units match in the list."
    : searchedAbsolutePath
      ? "Matched row is selected in the list."
      : "Search units by visible values, path, comment, or parameter value.";

const SearchEndAdornment: FC<SearchEndAdornmentProps> = ({
  canNavigate,
  resultPosition,
  onNavigate,
}) => (
  <Fragment>
    {resultPosition && (
      <Typography
        variant="caption"
        component="span"
        aria-label={`${resultPosition.current} of ${resultPosition.total} list search results`}
        sx={{ minWidth: "2.75rem", textAlign: "center" }}
      >
        {resultPosition.current}/{resultPosition.total}
      </Typography>
    )}
    <Tooltip title="Previous list search result (Shift+Enter).">
      <span>
        <IconButton
          size="small"
          aria-label="Previous list search result."
          onClick={() => onNavigate("previous")}
          disabled={!canNavigate}
        >
          <NavigateBeforeIcon fontSize="inherit" />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip title="Next list search result (Enter).">
      <span>
        <IconButton
          size="small"
          aria-label="Next list search result."
          onClick={() => onNavigate("next")}
          disabled={!canNavigate}
        >
          <NavigateNextIcon fontSize="inherit" />
        </IconButton>
      </span>
    </Tooltip>
  </Fragment>
);

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  searchedAbsolutePath,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const searchHelperText = getAjsTableSearchHelperText(
    searchedAbsolutePath,
    searchResultPosition,
  );

  const handleSearchSubmit = useCallback(() => {
    onSearchSubmit(searchValue);
  }, [onSearchSubmit, searchValue]);
  const handleSearchEnter = useCallback(
    (shiftKey: boolean) =>
      onSearchNavigate(searchValue, shiftKey ? "previous" : "next"),
    [onSearchNavigate, searchValue],
  );
  const handleSearchClear = useCallback(() => {
    setSearchValue("");
    onSearchClear();
    searchInputRef.current?.focus();
  }, [onSearchClear]);
  const handleSearchNavigate = useCallback(
    (direction: TableSearchDirection) =>
      onSearchNavigate(searchValue, direction),
    [onSearchNavigate, searchValue],
  );

  return (
    <SharedHeaderSearchField
      placeholderLabel="Search unit list"
      helperText={searchHelperText}
      value={searchValue}
      onValueChange={setSearchValue}
      onEnter={handleSearchEnter}
      onBlur={handleSearchSubmit}
      onClear={handleSearchClear}
      clearDisabled={searchValue.length === 0 && !searchedAbsolutePath}
      inputRef={searchInputRef}
      sx={{ width: "20rem", maxWidth: "32vw", flexShrink: 0 }}
      endAdornment={
        <SearchEndAdornment
          resultPosition={searchResultPosition}
          canNavigate={(searchResultPosition?.total ?? 0) > 0}
          onNavigate={handleSearchNavigate}
        />
      }
    />
  );
};

const Header: FC<HeaderProps> = ({
  table,
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

  const [open, setOpen] = useState(false);
  const [columnSelectorAnchor, setColumnSelectorAnchor] =
    useState<HTMLElement | null>(null);

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
          <Tooltip title={controlLabels.columns}>
            <IconButton
              size="small"
              aria-label={controlLabels.columns}
              onClick={openColumnSelector}
            >
              <DisplaySettingsIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Stack flexGrow={1} />
          <Tooltip title={controlLabels.copyCsv}>
            <IconButton
              aria-label={controlLabels.copyCsv}
              size="small"
              onClick={handleCopy}
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={controlLabels.saveCsv}>
            <IconButton
              aria-label={controlLabels.saveCsv}
              size="small"
              onClick={handleSave}
            >
              <SaveIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Chip
            size="small"
            variant="outlined"
            label={formatUnitCountLabel(visibleRowCount, totalRowCount)}
          />
        </Toolbar>
        <DisplayColumnSelector
          table={table}
          columnVisibility={table.getState().columnVisibility}
          anchorEl={columnSelectorAnchor}
          open={Boolean(columnSelectorAnchor)}
          onClose={closeColumnSelector}
        />
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
      </AppBar>
    </>
  );
};
export default memo(Header);
