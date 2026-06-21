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
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { Table } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import TableMenu from "./TableMenu";
import SearchBox from "./SearchBox";
import { DrawerWidthStateType, TableMenuStateType } from "./TableContents";
import { useMyAppContext } from "../MyContexts";
import { localeMap } from "../../../../domain/services/i18n/nls";
import { OPERATION, SAVE } from "../../../../shared/webviewEvents";
import { exportCsvView } from "./exportCsvView";
import { AjsTableSearchMode } from "./globalFilter";

type HeaderProps = {
  table: Table<UnitListRowView>;
  tableMenuState: TableMenuStateType;
  drawerWidthState: DrawerWidthStateType;
  searchMode: AjsTableSearchMode;
  setSearchMode: (mode: AjsTableSearchMode) => void;
  visibleRowCount: number;
  totalRowCount: number;
};

export const formatUnitCountLabel = (
  visibleRowCount: number,
  totalRowCount: number,
): string => `${visibleRowCount} / ${totalRowCount} units`;

const Header: FC<HeaderProps> = ({
  table,
  tableMenuState,
  drawerWidthState,
  searchMode,
  setSearchMode,
  visibleRowCount,
  totalRowCount,
}) => {
  console.log("render Header.");

  const { lang, scrollType, updateMyAppResource } = useMyAppContext();
  const { setMenuStatus } = tableMenuState;
  const { setDrawerWidth } = drawerWidthState;

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

  const toggleMenu1 = useCallback(() => {
    setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
    setDrawerWidth((prev) => (prev !== 0 ? 0 : prev));
  }, [setMenuStatus, setDrawerWidth]);

  const toggleScrollType = useCallback(() => {
    updateMyAppResource({
      scrollType: scrollType === "table" ? "window" : "table",
    });
  }, [scrollType, updateMyAppResource]);

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
          <TableMenu
            tableMenuState={tableMenuState}
            drawerWidthState={drawerWidthState}
          />
          <SearchBox
            globalFilter={table.getState().globalFilter}
            setGlobalFilter={table.setGlobalFilter}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
          />
          <Tooltip title={localeMap("table.menu.menuItem1", lang)}>
            <IconButton
              size="small"
              aria-label="toggleMenu1"
              onClick={toggleMenu1}
            >
              <DisplaySettingsIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={localeMap(
              scrollType === "table"
                ? "table.menu.menuItem2.window"
                : "table.menu.menuItem2.table",
              lang,
            )}
          >
            <IconButton
              size="small"
              aria-label="toggleMenu2"
              onClick={toggleScrollType}
            >
              {scrollType === "table" ? (
                <UnfoldLessIcon fontSize="inherit" />
              ) : (
                <UnfoldMoreIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
          <Stack flexGrow={1} />
          <Tooltip title="Copy the contents to clipbord as csv.">
            <IconButton
              aria-label="Copy the contents to clipbord as csv."
              size="small"
              onClick={handleCopy}
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save the contents as csv.">
            <IconButton
              aria-label="Save the contents as csv."
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
