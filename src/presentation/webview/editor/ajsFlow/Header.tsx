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
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { HeaderSearchControlLabels } from "../shared/HeaderSearchField";
import type {
  FlowSearchDirection,
  FlowSearchResultPosition,
} from "./flowSearchState";
import { unitInformationMessage } from "../unitInformationLocalization";

type HeaderProps = {
  currentUnit?: FlowGraphUnitDto;
  language: string;
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
  language: string;
  searchedUnitId?: string;
  searchResultPosition?: FlowSearchResultPosition;
  onSearchNavigate: (query: string, direction: FlowSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
};

type CurrentUnitBadgeProps = {
  currentUnit?: FlowGraphUnitDto;
};

type ExpandAllNestedUnitsButtonProps = {
  language: string;
  canToggle: boolean;
  expanded: boolean;
  onToggle: () => void;
};

type RelationshipFocusButtonProps = {
  language: string;
  canEnable: boolean;
  enabled: boolean;
  onToggle: () => void;
};

type MiniMapButtonProps = {
  language: string;
  shown: boolean;
  onToggle: () => void;
};

const isRootJobnet = (unit: FlowGraphUnitDto): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

const getFlowHeaderSearchLabels = (
  language: string,
): HeaderSearchControlLabels => ({
  helperText: {
    noResults: unitInformationMessage("a11y.flow.search.noResults", language),
    matched: unitInformationMessage("a11y.flow.search.matched", language),
    idle: unitInformationMessage("a11y.flow.search.idle", language),
  },
  navigation: {
    resultAriaLabel: (position) => `${position.current} / ${position.total}`,
    previousTooltip: unitInformationMessage("a11y.search.previous", language),
    previousAriaLabel: unitInformationMessage("a11y.search.previous", language),
    nextTooltip: unitInformationMessage("a11y.search.next", language),
    nextAriaLabel: unitInformationMessage("a11y.search.next", language),
  },
});

export const getCurrentUnitLabel = (
  currentUnit?: FlowGraphUnitDto,
  language = "en",
): string | undefined => {
  if (!currentUnit) {
    return undefined;
  }
  if (isRootJobnet(currentUnit)) {
    return unitInformationMessage("a11y.flow.rootJobnet", language);
  }
  return currentUnit.unitType.toUpperCase();
};

const getExpandAllLabel = (
  hasExpandedAllNestedUnits: boolean,
  language: string,
): string =>
  unitInformationMessage(
    hasExpandedAllNestedUnits
      ? "a11y.flow.controls.collapseAll"
      : "a11y.flow.controls.expandAll",
    language,
  );

const HeaderSearchField: FC<HeaderSearchFieldProps> = ({
  language,
  searchedUnitId,
  searchResultPosition,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
}) => (
  <HeaderSearchControl<FlowSearchDirection>
    matchedTargetId={searchedUnitId}
    resultPosition={searchResultPosition}
    placeholderLabel={unitInformationMessage(
      "a11y.flow.search.placeholder",
      language,
    )}
    labels={getFlowHeaderSearchLabels(language)}
    onSearchNavigate={onSearchNavigate}
    onSearchSubmit={onSearchSubmit}
    onSearchClear={onSearchClear}
  />
);

const ExpandAllNestedUnitsButton: FC<ExpandAllNestedUnitsButtonProps> = ({
  language,
  canToggle,
  expanded,
  onToggle,
}) => (
  <Tooltip title={getExpandAllLabel(expanded, language)}>
    <span>
      <IconButton
        size="small"
        aria-label={getExpandAllLabel(expanded, language)}
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
  language,
  canEnable,
  enabled,
  onToggle,
}) => (
  <Tooltip
    title={
      enabled
        ? unitInformationMessage(
            "a11y.flow.controls.exitRelationships",
            language,
          )
        : unitInformationMessage(
            "a11y.flow.controls.focusRelationships",
            language,
          )
    }
  >
    <span>
      <IconButton
        size="small"
        aria-label={
          enabled
            ? unitInformationMessage(
                "a11y.flow.controls.exitRelationships",
                language,
              )
            : unitInformationMessage(
                "a11y.flow.controls.focusRelationships",
                language,
              )
        }
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

const MiniMapButton: FC<MiniMapButtonProps> = ({
  language,
  shown,
  onToggle,
}) => {
  const label = unitInformationMessage(
    shown ? "a11y.flow.controls.hideMinimap" : "a11y.flow.controls.showMinimap",
    language,
  );
  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        aria-label={label}
        aria-pressed={shown}
        color={shown ? "primary" : "default"}
        onClick={onToggle}
      >
        <MapOutlinedIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

const CurrentUnitBadge: FC<CurrentUnitBadgeProps & { language: string }> = ({
  currentUnit,
  language,
}) => {
  const currentUnitLabel = getCurrentUnitLabel(currentUnit, language);
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
  language,
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
            language={language}
            searchedUnitId={searchedUnitId}
            searchResultPosition={searchResultPosition}
            onSearchNavigate={onSearchNavigate}
            onSearchSubmit={onSearchSubmit}
            onSearchClear={onSearchClear}
          />
          <ExpandAllNestedUnitsButton
            language={language}
            canToggle={canToggleExpandAllNestedUnits}
            expanded={hasExpandedAllNestedUnits}
            onToggle={toggleExpandAllNestedUnits}
          />
          <RelationshipFocusButton
            language={language}
            canEnable={canEnableFocusMode}
            enabled={focusModeEnabled}
            onToggle={toggleFocusMode}
          />
          <MiniMapButton
            language={language}
            shown={showMiniMap}
            onToggle={toggleMiniMap}
          />
          <CurrentUnitBadge currentUnit={currentUnit} language={language} />
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
