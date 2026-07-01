import React, { FC, memo } from "react";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import UnfoldMore from "@mui/icons-material/UnfoldMore";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {
  HeaderSearchControl,
  resolveHeaderSearchHelperText,
} from "../shared/HeaderSearchField";
import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import type { HeaderSearchControlLabels } from "../shared/HeaderSearchField";
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

type ExpandAllNestedUnitsButtonProps = {
  canToggle: boolean;
  expanded: boolean;
  onToggle: () => void;
};

type RelationshipFocusButtonProps = {
  canEnable: boolean;
  enabled: boolean;
  onToggle: () => void;
};

type MiniMapButtonProps = {
  shown: boolean;
  onToggle: () => void;
};

const isRootJobnet = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

const flowHeaderSearchLabels: HeaderSearchControlLabels = {
  helperText: {
    noResults: "No units match in the current scope.",
    matched: "Matched unit is highlighted in the current scope.",
    idle: "Search current scope by unit name, comment, or path.",
  },
  navigation: {
    resultAriaLabel: (position) =>
      `${position.current} of ${position.total} search results`,
    previousTooltip: "Previous flow search result (Shift+Enter).",
    previousAriaLabel: "Previous flow search result.",
    nextTooltip: "Next flow search result (Enter).",
    nextAriaLabel: "Next flow search result.",
  },
};

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
  resolveHeaderSearchHelperText(
    searchedUnitId,
    resultPosition,
    flowHeaderSearchLabels.helperText,
  );

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  searchedUnitId,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => (
  <HeaderSearchControl<FlowSearchDirection>
    matchedTargetId={searchedUnitId}
    resultPosition={searchResultPosition}
    placeholderLabel="Search current scope"
    labels={flowHeaderSearchLabels}
    onSearchNavigate={onSearchNavigate}
    onSearchSubmit={onSearchSubmit}
    onSearchClear={onSearchClear}
  />
);

const ExpandAllNestedUnitsButton: FC<ExpandAllNestedUnitsButtonProps> = ({
  canToggle,
  expanded,
  onToggle,
}) => (
  <Tooltip title={getExpandAllLabel(expanded)}>
    <span>
      <IconButton
        size="small"
        aria-label="toggleExpandAllNestedJobnets"
        onClick={onToggle}
        disabled={!canToggle}
      >
        {expanded ? (
          <UnfoldLess fontSize="inherit" />
        ) : (
          <UnfoldMore fontSize="inherit" />
        )}
      </IconButton>
    </span>
  </Tooltip>
);

const RelationshipFocusButton: FC<RelationshipFocusButtonProps> = ({
  canEnable,
  enabled,
  onToggle,
}) => (
  <Tooltip
    title={
      enabled
        ? "Exit relationship focus mode."
        : "Focus on selected node relationships."
    }
  >
    <span>
      <IconButton
        size="small"
        aria-label="toggleRelationshipFocusMode"
        aria-pressed={enabled}
        color={enabled ? "primary" : "default"}
        onClick={onToggle}
        disabled={!canEnable}
      >
        <CenterFocusStrongIcon fontSize="inherit" />
      </IconButton>
    </span>
  </Tooltip>
);

const MiniMapButton: FC<MiniMapButtonProps> = ({ shown, onToggle }) => (
  <Tooltip title={shown ? "Hide MiniMap." : "Show MiniMap."}>
    <IconButton
      size="small"
      aria-label="Toggle flow graph MiniMap visibility."
      aria-pressed={shown}
      color={shown ? "primary" : "default"}
      onClick={onToggle}
    >
      <MapOutlinedIcon fontSize="inherit" />
    </IconButton>
  </Tooltip>
);

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
          <ExpandAllNestedUnitsButton
            canToggle={canToggleExpandAllNestedUnits}
            expanded={hasExpandedAllNestedUnits}
            onToggle={toggleExpandAllNestedUnits}
          />
          <RelationshipFocusButton
            canEnable={canEnableFocusMode}
            enabled={focusModeEnabled}
            onToggle={toggleFocusMode}
          />
          <MiniMapButton shown={showMiniMap} onToggle={toggleMiniMap} />
          <CurrentUnitBadge currentUnit={currentUnit} />
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
