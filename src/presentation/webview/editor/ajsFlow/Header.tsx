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
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import UnfoldMore from "@mui/icons-material/UnfoldMore";
import ViewColumn from "@mui/icons-material/ViewColumn";
import FlowMenu from "./FlowMenu";
import {
  CurrentUnitIdStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./flowViewerStateTypes";
import { localeMap } from "../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import type {
  FlowSearchDirection,
  FlowSearchResultPosition,
} from "./flowSearchState";

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
  searchResultPosition?: FlowSearchResultPosition;
  onSearchNavigate: (query: string, direction: FlowSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
};

type HeaderBreadcrumbsProps = {
  currentUnit?: AjsUnit;
  unitById: ReadonlyMap<string, AjsUnit>;
  setCurrentUnitId: (unitId: string) => void;
};

type HeaderSearchFieldProps = {
  isMac: boolean;
  searchedUnitId?: string;
  searchResultPosition?: FlowSearchResultPosition;
  onSearchNavigate: (query: string, direction: FlowSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
};

type CurrentUnitBadgeProps = {
  currentUnit?: AjsUnit;
};

type SearchEndAdornmentProps = {
  canNavigate: boolean;
  clearDisabled: boolean;
  resultPosition?: FlowSearchResultPosition;
  onClear: () => void;
  onNavigate: (direction: FlowSearchDirection) => void;
};

const isRootJobnet = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

const getParentUnit = (
  unit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): AjsUnit | undefined =>
  unit.parentId ? unitById.get(unit.parentId) : undefined;

const collectBreadcrumbUnits = (
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): AjsUnit[] => {
  if (!currentUnit) {
    return [];
  }
  if (isRootJobnet(currentUnit)) {
    return [currentUnit];
  }
  return [
    ...collectBreadcrumbUnits(getParentUnit(currentUnit, unitById), unitById),
    currentUnit,
  ];
};

const getCurrentUnitLabel = (currentUnit?: AjsUnit): string | undefined => {
  if (!currentUnit) {
    return undefined;
  }
  if (isRootJobnet(currentUnit)) {
    return "ROOT JOBNET";
  }
  return currentUnit.unitType.toUpperCase();
};

const getExpandAllLabel = (hasExpandedAllNestedUnits: boolean): string =>
  hasExpandedAllNestedUnits
    ? "Collapse all nested jobnets."
    : "Expand all nested jobnets.";

const getSearchHelperText = (
  searchedUnitId?: string,
  resultPosition?: FlowSearchResultPosition,
): string =>
  resultPosition?.total === 0
    ? "No units match in the current scope."
    : searchedUnitId
      ? "Matched unit is highlighted in the current scope."
      : "Search current scope by unit name, comment, or path.";

const shouldFocusSearch = (
  event: globalThis.KeyboardEvent,
  isMac: boolean,
): boolean => (isMac ? event.metaKey : event.ctrlKey) && event.key === "f";

const focusSearchFromShortcut = (
  event: globalThis.KeyboardEvent,
  isMac: boolean,
  searchInputRef: React.RefObject<HTMLInputElement | null>,
): void => {
  if (!shouldFocusSearch(event, isMac)) {
    return;
  }
  event.preventDefault();
  searchInputRef.current?.focus();
};

const useSearchShortcut = (
  isMac: boolean,
  searchInputRef: React.RefObject<HTMLInputElement | null>,
): void => {
  const handleShortcut = useCallback(
    (event: globalThis.KeyboardEvent) =>
      focusSearchFromShortcut(event, isMac, searchInputRef),
    [isMac, searchInputRef],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [handleShortcut]);
};

const useHeaderSearchField = ({
  isMac,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}: Pick<
  HeaderSearchFieldProps,
  "isMac" | "onSearchNavigate" | "onSearchSubmit" | "onSearchClear"
>) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  useSearchShortcut(isMac, searchInputRef);

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
      if (event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      onSearchNavigate(searchValue, event.shiftKey ? "previous" : "next");
    },
    [onSearchNavigate, searchValue],
  );
  const handleSearchClear = useCallback(() => {
    setSearchValue("");
    onSearchClear();
    searchInputRef.current?.focus();
  }, [onSearchClear]);

  return {
    handleSearchChange,
    handleSearchClear,
    handleSearchKeyUp,
    handleSearchSubmit,
    searchInputRef,
    searchValue,
  };
};

const HeaderBreadcrumbs: FC<HeaderBreadcrumbsProps> = ({
  currentUnit,
  unitById,
  setCurrentUnitId,
}) => {
  const breadcrumbUnits = useMemo(
    () => collectBreadcrumbUnits(currentUnit, unitById),
    [currentUnit, unitById],
  );
  const createCrumb = useCallback(
    (target: AjsUnit): ReactElement =>
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
      ),
    [currentUnit?.id, setCurrentUnitId],
  );

  return (
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
      {breadcrumbUnits.map(createCrumb)}
    </Breadcrumbs>
  );
};

const SearchStartAdornment: FC = () => (
  <InputAdornment position="start">
    <SearchIcon fontSize="small" />
  </InputAdornment>
);

const SearchEndAdornment: FC<SearchEndAdornmentProps> = ({
  canNavigate,
  clearDisabled,
  resultPosition,
  onClear,
  onNavigate,
}) => (
  <InputAdornment position="end">
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.25}
      onMouseDown={(event) => event.preventDefault()}
    >
      {resultPosition && (
        <Typography
          variant="caption"
          component="span"
          aria-label={`${resultPosition.current} of ${resultPosition.total} search results`}
          sx={{ minWidth: "2.75rem", textAlign: "center" }}
        >
          {resultPosition.current}/{resultPosition.total}
        </Typography>
      )}
      <Tooltip title="Previous flow search result (Shift+Enter).">
        <span>
          <IconButton
            size="small"
            aria-label="Previous flow search result."
            onClick={() => onNavigate("previous")}
            disabled={!canNavigate}
          >
            <NavigateBeforeIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Next flow search result (Enter).">
        <span>
          <IconButton
            size="small"
            aria-label="Next flow search result."
            onClick={() => onNavigate("next")}
            disabled={!canNavigate}
          >
            <NavigateNextIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Clear flow search.">
        <span>
          <IconButton
            size="small"
            aria-label="Clear flow search."
            onClick={onClear}
            disabled={clearDisabled}
          >
            <ClearAllIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  </InputAdornment>
);

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  isMac,
  searchedUnitId,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => {
  const searchHelperText = getSearchHelperText(
    searchedUnitId,
    searchResultPosition,
  );
  const {
    handleSearchChange,
    handleSearchClear,
    handleSearchKeyUp,
    handleSearchSubmit,
    searchInputRef,
    searchValue,
  } = useHeaderSearchField({
    isMac,
    onSearchNavigate,
    onSearchSubmit,
    onSearchClear,
  });
  const handleSearchNavigate = useCallback(
    (direction: FlowSearchDirection) =>
      onSearchNavigate(searchValue, direction),
    [onSearchNavigate, searchValue],
  );

  return (
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
          startAdornment: <SearchStartAdornment />,
          endAdornment: (
            <SearchEndAdornment
              resultPosition={searchResultPosition}
              canNavigate={(searchResultPosition?.total ?? 0) > 0}
              onClear={handleSearchClear}
              onNavigate={handleSearchNavigate}
              clearDisabled={searchValue.length === 0 && !searchedUnitId}
            />
          ),
        },
      }}
    />
  );
};

const CurrentUnitBadge: FC<CurrentUnitBadgeProps> = ({ currentUnit }) => {
  const currentUnitLabel = getCurrentUnitLabel(currentUnit);
  if (!currentUnitLabel) {
    return null;
  }
  return (
    <Chip
      size="small"
      label={currentUnitLabel}
      color={currentUnit?.isRootJobnet ? "primary" : "default"}
      variant="outlined"
    />
  );
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
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => {
  console.log("render Header.");

  const { setMenuStatus } = flowMenuState;
  const { setDrawerWidth } = drawerWidthState;
  const { setCurrentUnitId } = currentUnitIdState;
  const { lang, os } = useMyAppContext();
  const isMac = os === "darwin";

  const menuItem1Label = useMemo(
    () => localeMap("flow.menu.menuItem1", lang),
    [lang],
  );

  const handleToggleMenu1 = useCallback(() => {
    setDrawerWidth(0);
    setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
  }, [setDrawerWidth, setMenuStatus]);
  const expandAllLabel = getExpandAllLabel(hasExpandedAllNestedUnits);

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
          <HeaderSearchField
            isMac={isMac}
            searchedUnitId={searchedUnitId}
            searchResultPosition={searchResultPosition}
            onSearchNavigate={onSearchNavigate}
            onSearchSubmit={onSearchSubmit}
            onSearchClear={onSearchClear}
          />
          <HeaderBreadcrumbs
            currentUnit={currentUnit}
            unitById={unitById}
            setCurrentUnitId={setCurrentUnitId}
          />
          <CurrentUnitBadge currentUnit={currentUnit} />
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
