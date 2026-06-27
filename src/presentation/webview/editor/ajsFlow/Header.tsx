import React, {
  FC,
  Fragment,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import UnfoldMore from "@mui/icons-material/UnfoldMore";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SharedHeaderSearchField from "../shared/HeaderSearchField";
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
  resultPosition?: FlowSearchResultPosition;
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

const useHeaderSearchField = ({
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}: Pick<
  HeaderSearchFieldProps,
  "onSearchNavigate" | "onSearchSubmit" | "onSearchClear"
>) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);
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

  return {
    handleSearchChange,
    handleSearchClear,
    handleSearchEnter,
    handleSearchSubmit,
    searchInputRef,
    searchValue,
  };
};

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
  </Fragment>
);

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
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
    handleSearchEnter,
    handleSearchSubmit,
    searchInputRef,
    searchValue,
  } = useHeaderSearchField({
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
    <SharedHeaderSearchField
      placeholderLabel="Search current scope"
      helperText={searchHelperText}
      value={searchValue}
      onValueChange={handleSearchChange}
      onEnter={handleSearchEnter}
      onBlur={handleSearchSubmit}
      onClear={handleSearchClear}
      clearDisabled={searchValue.length === 0 && !searchedUnitId}
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
