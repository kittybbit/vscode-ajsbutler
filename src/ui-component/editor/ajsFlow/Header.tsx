import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppBar from "@mui/material/AppBar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SearchIcon from "@mui/icons-material/Search";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import UnfoldMore from "@mui/icons-material/UnfoldMore";
import ViewColumn from "@mui/icons-material/ViewColumn";
import FlowMenu from "./FlowMenu";
import {
  CurrentUnitIdStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./FlowContents";
import { localeMap } from "../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";

type HeaderProps = {
  flowMenuState: FlowMenuStateType;
  drawerWidthState: DrawerWidthStateType;
  currentUnit?: AjsUnit;
  unitById: ReadonlyMap<string, AjsUnit>;
  currentUnitIdState: CurrentUnitIdStateType;
  canToggleExpandAllNestedUnits: boolean;
  hasExpandedAllNestedUnits: boolean;
  toggleExpandAllNestedUnits: () => void;
  searchedUnitId?: string;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
};

const Header: FC<HeaderProps> = ({
  flowMenuState,
  drawerWidthState,
  currentUnit,
  unitById,
  currentUnitIdState,
  canToggleExpandAllNestedUnits,
  hasExpandedAllNestedUnits,
  toggleExpandAllNestedUnits,
  searchedUnitId,
  onSearchSubmit,
  onSearchClear,
}) => {
  console.log("render Header.");

  const { setMenuStatus } = flowMenuState;
  const { setDrawerWidth } = drawerWidthState;
  const { setCurrentUnitId } = currentUnitIdState;
  const { lang, os } = useMyAppContext();
  const isMac = os === "darwin";
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const breadcrumbs = useMemo(() => {
    const crumbs: ReactElement[] = [];

    const build = (unit?: AjsUnit) => {
      if (!unit) return;
      const createCrumb = (target: AjsUnit): ReactElement =>
        target.id === currentUnit?.id ? (
          <Typography key={target.id} color="inherit">
            {target.name}
          </Typography>
        ) : (
          <Link
            key={target.id}
            color="inherit"
            onClick={() => setCurrentUnitId(target.id)}
          >
            {target.name}
          </Link>
        );

      crumbs.push(createCrumb(unit));

      if (unit.unitType !== "n" || !unit.isRootJobnet) {
        build(unit.parentId ? unitById.get(unit.parentId) : undefined);
      }
    };

    build(currentUnit);
    return crumbs.reverse();
  }, [currentUnit, setCurrentUnitId, unitById]);

  const menuItem1Label = useMemo(
    () => localeMap("flow.menu.menuItem1", lang),
    [lang],
  );
  const currentUnitLabel = useMemo(() => {
    if (!currentUnit) {
      return undefined;
    }
    if (currentUnit.unitType === "n" && currentUnit.isRootJobnet) {
      return "ROOT JOBNET";
    }
    return currentUnit.unitType.toUpperCase();
  }, [currentUnit]);

  const handleToggleMenu1 = useCallback(() => {
    setDrawerWidth(0);
    setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
  }, [setDrawerWidth, setMenuStatus]);
  const handleShortcut = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if ((isMac ? event.metaKey : event.ctrlKey) && event.key === "f") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    },
    [isMac],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [handleShortcut]);
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setSearchValue(event.target.value),
    [],
  );
  const handleSearchSubmit = useCallback(() => {
    onSearchSubmit(searchValue);
  }, [onSearchSubmit, searchValue]);
  const handleSearchKeyUp = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit],
  );
  const handleSearchClear = useCallback(() => {
    setSearchValue("");
    onSearchClear();
    searchInputRef.current?.focus();
  }, [onSearchClear]);
  const expandAllLabel = hasExpandedAllNestedUnits
    ? "Collapse all nested jobnets."
    : "Expand all nested jobnets.";
  const searchHelperText = searchedUnitId
    ? "Matched unit is highlighted in the current scope."
    : "Search current scope by partial unit name, comment, or path.";

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: (theme) => `${theme.palette.background.paper}f2`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ gap: 1.25, minHeight: "3.5rem" }}>
          <FlowMenu
            flowMenuState={flowMenuState}
            drawerWidthState={drawerWidthState}
          />
          <Tooltip title={menuItem1Label}>
            <IconButton
              size="small"
              aria-label="toggleMenu1"
              onClick={handleToggleMenu1}
            >
              <ViewColumn fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={expandAllLabel}>
            <span>
              <IconButton
                size="small"
                aria-label="toggleExpandAllNestedJobnets"
                onClick={toggleExpandAllNestedUnits}
                disabled={!canToggleExpandAllNestedUnits}
              >
                {hasExpandedAllNestedUnits ? (
                  <UnfoldLess fontSize="inherit" />
                ) : (
                  <UnfoldMore fontSize="inherit" />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <TextField
            size="small"
            variant="standard"
            placeholder={`Search current scope...(${isMac ? "\u2318" : "CTRL+"}F)`}
            helperText={searchHelperText}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyUp={handleSearchKeyUp}
            onBlur={handleSearchSubmit}
            inputRef={searchInputRef}
            sx={{ width: "20rem", maxWidth: "32vw", flexShrink: 0 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Clear flow search.">
                      <span>
                        <IconButton
                          size="small"
                          aria-label="Clear flow search."
                          onClick={handleSearchClear}
                          disabled={searchValue.length === 0 && !searchedUnitId}
                        >
                          <ClearAllIcon fontSize="inherit" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              flex: 1,
              "& .MuiBreadcrumbs-ol": {
                flexWrap: "nowrap",
              },
            }}
          >
            {breadcrumbs}
          </Breadcrumbs>
          {currentUnitLabel && (
            <Chip
              size="small"
              label={currentUnitLabel}
              color={currentUnit?.isRootJobnet ? "primary" : "default"}
              variant="outlined"
            />
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
