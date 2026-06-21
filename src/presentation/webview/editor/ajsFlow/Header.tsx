import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
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
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useMyAppContext } from "../MyContexts";
import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import type {
  FlowSearchDirection,
  FlowSearchResultPosition,
} from "./flowSearchState";

type HeaderProps = {
  currentUnit?: AjsUnit;
  canToggleExpandAllNestedUnits: boolean;
  hasExpandedAllNestedUnits: boolean;
  toggleExpandAllNestedUnits: () => void;
  canEnableFocusMode: boolean;
  focusModeEnabled: boolean;
  toggleFocusMode: () => void;
  showMiniMap: boolean;
  toggleMiniMap: () => void;
  searchedUnitId?: string;
  searchResultPosition?: FlowSearchResultPosition;
  onSearchNavigate: (query: string, direction: FlowSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
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

export const getCurrentUnitLabel = (
  currentUnit?: AjsUnit,
): string | undefined => {
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
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      sx={{ minWidth: 0, marginLeft: "auto" }}
    >
      <Tooltip title={currentUnit?.absolutePath ?? currentUnit?.name}>
        <Typography variant="body2" noWrap sx={{ maxWidth: "16rem" }}>
          {currentUnit?.name}
        </Typography>
      </Tooltip>
      <Chip
        size="small"
        label={currentUnitLabel}
        color={currentUnit?.isRootJobnet ? "primary" : "default"}
        variant="outlined"
      />
    </Stack>
  );
};

const Header: FC<HeaderProps> = ({
  currentUnit,
  canToggleExpandAllNestedUnits,
  hasExpandedAllNestedUnits,
  toggleExpandAllNestedUnits,
  canEnableFocusMode,
  focusModeEnabled,
  toggleFocusMode,
  showMiniMap,
  toggleMiniMap,
  searchedUnitId,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => {
  console.log("render Header.");

  const { os } = useMyAppContext();
  const isMac = os === "darwin";
  const expandAllLabel = getExpandAllLabel(hasExpandedAllNestedUnits);

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
            isMac={isMac}
            searchedUnitId={searchedUnitId}
            searchResultPosition={searchResultPosition}
            onSearchNavigate={onSearchNavigate}
            onSearchSubmit={onSearchSubmit}
            onSearchClear={onSearchClear}
          />
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
          <Tooltip
            title={
              focusModeEnabled
                ? "Exit relationship focus mode."
                : "Focus on selected node relationships."
            }
          >
            <span>
              <IconButton
                size="small"
                aria-label="toggleRelationshipFocusMode"
                aria-pressed={focusModeEnabled}
                color={focusModeEnabled ? "primary" : "default"}
                onClick={toggleFocusMode}
                disabled={!canEnableFocusMode}
              >
                <CenterFocusStrongIcon fontSize="inherit" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={showMiniMap ? "Hide MiniMap." : "Show MiniMap."}>
            <IconButton
              size="small"
              aria-label="Toggle flow graph MiniMap visibility."
              aria-pressed={showMiniMap}
              color={showMiniMap ? "primary" : "default"}
              onClick={toggleMiniMap}
            >
              <MapOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <CurrentUnitBadge currentUnit={currentUnit} />
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
