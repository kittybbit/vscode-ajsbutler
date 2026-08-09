import React, { FC, KeyboardEvent, memo, useMemo } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { useMyAppContext } from "../MyContexts";
import {
  formatUnitInformationMessage,
  unitInformationMessage,
} from "../unitInformationLocalization";
import {
  isUnitTreeRowNavigable,
  resolveVisibleUnitTreeRows,
} from "./unitTreeNavigation";
import {
  notifyEnabledUnit,
  resolveUnitTreeRowBackgroundColor,
  resolveUnitTreeRowBorderColor,
  resolveUnitTreeRowBorderStyle,
  resolveUnitTreeRowOutline,
  resolveUnitTreeRowState,
  type UnitTreeFocusRequest,
  type UnitTreeRowState,
} from "./unitTreeSelectorModel";
import { createUnitTreeRowInteraction } from "./unitTreeRowInteraction";
import {
  collectCurrentPathUnitIds,
  useExpandedUnitTreeState,
  useSelectedTreeRowScroll,
} from "./useUnitTreeSelectorState";
import { useUnitTreeSelectorFocus } from "./useUnitTreeSelectorFocus";
import { useUnitTreeSelectorKeyboard } from "./useUnitTreeSelectorKeyboard";
import { useResponsivePanelCollapse } from "./useResponsivePanelCollapse";
import {
  viewerFocusBorder,
  viewerPathBorder,
  viewerSelectionBorder,
} from "./viewerThemeStyles";

export type { UnitTreeFocusRequest } from "./unitTreeSelectorModel";

export type UnitTreeSelectorProps = {
  rootUnits: FlowGraphUnitDto[];
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>;
  currentUnitId?: string;
  hoveredUnitId?: string;
  selectedUnitId?: string;
  title?: string;
  ariaLabel?: string;
  collapsedAriaLabel?: string;
  autoScrollSelectedUnit?: boolean;
  focusRequest?: UnitTreeFocusRequest;
  canOpenScopeUnit?: (unit: FlowGraphUnitDto) => boolean;
  isUnitEnabled?: (unit: FlowGraphUnitDto) => boolean;
  onHoverUnit?: (unitId: string) => void;
  onLeaveUnit?: (unitId: string) => void;
  onOpenScope?: (unitId: string) => void;
  onEscape?: VoidFunction;
  onEnterUnit?: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
};

type UnitTreeSelectorTreeProps = {
  units: readonly FlowGraphUnitDto[];
  canOpenScopeUnit: (unit: FlowGraphUnitDto) => boolean;
  currentPathUnitIds: ReadonlySet<string>;
  currentUnitId?: string;
  expandedUnitIds: ReadonlySet<string>;
  hoveredUnitId?: string;
  isUnitEnabled: (unit: FlowGraphUnitDto) => boolean;
  onHoverUnit?: (unitId: string) => void;
  onLeaveUnit?: (unitId: string) => void;
  onOpenScope?: (unitId: string) => void;
  onEscape?: VoidFunction;
  onEnterUnit?: (unitId: string) => void;
  onRowFocus: (unitId: string) => void;
  onRowKeyDown: (event: KeyboardEvent<HTMLElement>, unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
  selectedUnitId?: string;
  setExpanded: (unitId: string, expanded: boolean) => void;
  setRowRef: (unitId: string, element: HTMLElement | null) => void;
};

type UnitTreeSelectorUnitProps = Omit<UnitTreeSelectorTreeProps, "units"> & {
  unit: FlowGraphUnitDto;
};

type UnitTreeExpandControlProps = Pick<
  UnitTreeRowState,
  "hasChildren" | "isExpanded"
> & {
  unit: FlowGraphUnitDto;
  onToggle: () => void;
};

type UnitTreeRowButtonProps = Pick<
  UnitTreeRowState,
  "isCurrent" | "isEnabled" | "isSelected"
> & {
  unit: FlowGraphUnitDto;
};

type UnitTreeOpenScopeActionProps = Pick<UnitTreeRowState, "canOpenScope"> & {
  unit: FlowGraphUnitDto;
  onOpenScope?: (unitId: string) => void;
};

type UnitTreeRowFrameProps = {
  children: React.ReactNode;
  rowState: UnitTreeRowState;
  unit: FlowGraphUnitDto;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

type UnitTreeNestedChildrenProps = Pick<
  UnitTreeRowState,
  "hasChildren" | "isExpanded"
> &
  Omit<UnitTreeSelectorTreeProps, "units"> & {
    unit: FlowGraphUnitDto;
  };

type UnitTreeSelectorToolbarProps = {
  onCollapse: () => void;
  title: string;
};

type CollapsedUnitTreeRailProps = {
  collapsedAriaLabel: string;
  direction: "ltr" | "rtl";
  onExpand: () => void;
  title: string;
};

type ExpandedUnitTreePanelProps = Omit<UnitTreeSelectorTreeProps, "units"> & {
  ariaLabel: string;
  onCollapse: () => void;
  onKeyDownCapture?: (event: KeyboardEvent<HTMLElement>) => void;
  rootUnits: readonly FlowGraphUnitDto[];
  treeTabIndex: 0 | -1;
  title: string;
};

const defaultCanOpenScopeUnit = (): boolean => false;
const defaultIsUnitEnabled = (): boolean => true;

export const UNIT_TREE_ACTION_SIZE_PX = 28;

const unitTreeActionSx = {
  width: UNIT_TREE_ACTION_SIZE_PX,
  height: UNIT_TREE_ACTION_SIZE_PX,
  minWidth: UNIT_TREE_ACTION_SIZE_PX,
  minHeight: UNIT_TREE_ACTION_SIZE_PX,
  padding: 0,
};

const UnitTreeExpandIcon: FC<Pick<UnitTreeRowState, "isExpanded">> = ({
  isExpanded,
}) =>
  isExpanded ? (
    <ExpandMoreIcon fontSize="inherit" />
  ) : (
    <ChevronRightIcon fontSize="inherit" />
  );

const UnitTreeExpandControl: FC<UnitTreeExpandControlProps> = ({
  hasChildren,
  isExpanded,
  unit,
  onToggle,
}) => {
  const { lang = "en" } = useMyAppContext();
  if (!hasChildren) {
    return <Box sx={{ width: 28, flexShrink: 0 }} />;
  }
  return (
    <IconButton
      size="small"
      tabIndex={-1}
      aria-label={formatUnitInformationMessage(
        isExpanded ? "a11y.tree.collapse" : "a11y.tree.expand",
        lang,
        { title: unit.name },
      )}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      sx={unitTreeActionSx}
    >
      <UnitTreeExpandIcon isExpanded={isExpanded} />
    </IconButton>
  );
};

const UnitTreeStatusIcons: FC<
  Pick<UnitTreeRowState, "isCurrent" | "isSelected">
> = ({ isCurrent, isSelected }) => (
  <>
    {isSelected && (
      <RadioButtonCheckedIcon
        color="secondary"
        fontSize="inherit"
        sx={{ marginRight: 0.5 }}
      />
    )}
    {isCurrent && (
      <CheckCircleOutlineIcon
        color="primary"
        fontSize="inherit"
        sx={{ marginRight: 0.5 }}
      />
    )}
  </>
);

const UnitTreeRowButton: FC<UnitTreeRowButtonProps> = ({
  isCurrent,
  isEnabled,
  isSelected,
  unit,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      minWidth: 0,
      minHeight: "2rem",
      flex: 1,
      justifyContent: "flex-start",
      borderRadius: 1,
      paddingX: 0.5,
      opacity: isEnabled ? 1 : 0.56,
      cursor: isEnabled ? "pointer" : "default",
    }}
  >
    <UnitTreeStatusIcons isCurrent={isCurrent} isSelected={isSelected} />
    <Tooltip title={unit.absolutePath} placement="right">
      <Typography variant="body2" noWrap>
        {unit.name}
      </Typography>
    </Tooltip>
  </Box>
);

const UnitTreeOpenScopeAction: FC<UnitTreeOpenScopeActionProps> = ({
  canOpenScope,
  unit,
  onOpenScope,
}) => {
  const { lang = "en" } = useMyAppContext();
  if (!canOpenScope || !onOpenScope) return null;
  const label = formatUnitInformationMessage("a11y.tree.openScope", lang, {
    name: unit.name,
  });
  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        tabIndex={-1}
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          onOpenScope(unit.id);
        }}
        sx={unitTreeActionSx}
      >
        <FolderOpenIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

const UnitTreeNestedChildren: FC<UnitTreeNestedChildrenProps> = ({
  hasChildren,
  isExpanded,
  unit,
  ...props
}) =>
  hasChildren ? (
    <Collapse in={isExpanded} timeout="auto">
      <Box role="group">
        <UnitTreeSelectorTree units={unit.children} {...props} />
      </Box>
    </Collapse>
  ) : null;

const UnitTreeRowFrame: FC<UnitTreeRowFrameProps> = ({
  children,
  rowState,
  unit,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Stack
    data-unit-tree-row="true"
    direction="row"
    alignItems="center"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    sx={{
      minHeight: "2.25rem",
      marginX: 0.75,
      marginY: 0.15,
      paddingLeft: `${Math.max(0, unit.depth) * 0.65}rem`,
      borderRadius: 1.5,
      border: (theme) =>
        `1px solid ${resolveUnitTreeRowBorderColor(
          rowState,
          viewerSelectionBorder(theme),
        )}`,
      borderStyle: resolveUnitTreeRowBorderStyle(rowState),
      borderWidth: rowState.isSelected ? 2 : 1,
      borderInlineStart: (theme) =>
        rowState.isInCurrentPath
          ? `3px dashed ${viewerPathBorder(theme)}`
          : undefined,
      outline: (theme) =>
        resolveUnitTreeRowOutline(rowState, theme.palette.primary.main),
      outlineOffset: "-2px",
      backgroundColor: resolveUnitTreeRowBackgroundColor(rowState),
      "@media (forced-colors: active)": {
        backgroundColor: "Canvas",
        borderColor: rowState.isSelected ? "CanvasText" : "Canvas",
        borderInlineStartColor: rowState.isInCurrentPath
          ? "Highlight"
          : undefined,
        outlineColor: rowState.isHovered ? "Highlight" : undefined,
      },
    }}
  >
    {children}
  </Stack>
);

const UnitTreeSelectorUnit: FC<UnitTreeSelectorUnitProps> = ({
  unit,
  canOpenScopeUnit,
  currentPathUnitIds,
  currentUnitId,
  expandedUnitIds,
  hoveredUnitId,
  isUnitEnabled,
  onHoverUnit,
  onLeaveUnit,
  onOpenScope,
  onEscape,
  onEnterUnit,
  onRowFocus,
  onRowKeyDown,
  onSelectUnit,
  selectedUnitId,
  setExpanded,
  setRowRef,
}) => {
  const rowState = resolveUnitTreeRowState(unit, {
    canOpenScopeUnit,
    currentPathUnitIds,
    currentUnitId,
    expandedUnitIds,
    hoveredUnitId,
    isUnitEnabled,
    hasOpenScopeHandler: Boolean(onOpenScope),
    selectedUnitId,
  });
  const handleToggle = () => setExpanded(unit.id, !rowState.isExpanded);
  const handleMouseEnter = () =>
    notifyEnabledUnit(rowState.isEnabled, unit.id, onHoverUnit);
  const handleMouseLeave = () =>
    notifyEnabledUnit(rowState.isEnabled, unit.id, onLeaveUnit);
  const rowInteraction = createUnitTreeRowInteraction({
    isEnabled: rowState.isEnabled,
    onSelectUnit,
    unitId: unit.id,
  });

  return (
    <Box
      ref={(element: HTMLElement | null) => setRowRef(unit.id, element)}
      role="treeitem"
      tabIndex={-1}
      aria-current={rowState.isCurrent ? "true" : undefined}
      aria-disabled={!rowState.isEnabled ? "true" : undefined}
      aria-expanded={rowState.hasChildren ? rowState.isExpanded : undefined}
      aria-level={unit.depth + 1}
      aria-selected={rowState.isSelected}
      data-unit-tree-unit-id={unit.id}
      onMouseDown={rowInteraction.onMouseDown}
      onClick={rowInteraction.onClick}
      onFocus={(event) => {
        if (event.target === event.currentTarget) {
          onRowFocus(unit.id);
        }
      }}
      onKeyDown={(event) => onRowKeyDown(event, unit.id)}
      sx={{
        "&:focus-visible > [data-unit-tree-row]": {
          outline: (theme) => `2px solid ${viewerFocusBorder(theme)}`,
          outlineOffset: "-2px",
          "@media (forced-colors: active)": {
            outline: "2px solid Highlight",
          },
        },
      }}
    >
      <UnitTreeRowFrame
        rowState={rowState}
        unit={unit}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UnitTreeExpandControl
          hasChildren={rowState.hasChildren}
          isExpanded={rowState.isExpanded}
          unit={unit}
          onToggle={handleToggle}
        />
        <UnitTreeRowButton
          isCurrent={rowState.isCurrent}
          isEnabled={rowState.isEnabled}
          isSelected={rowState.isSelected}
          unit={unit}
        />
        <UnitTreeOpenScopeAction
          canOpenScope={rowState.canOpenScope}
          unit={unit}
          onOpenScope={onOpenScope}
        />
      </UnitTreeRowFrame>
      <UnitTreeNestedChildren
        hasChildren={rowState.hasChildren}
        isExpanded={rowState.isExpanded}
        unit={unit}
        canOpenScopeUnit={canOpenScopeUnit}
        currentPathUnitIds={currentPathUnitIds}
        currentUnitId={currentUnitId}
        expandedUnitIds={expandedUnitIds}
        hoveredUnitId={hoveredUnitId}
        isUnitEnabled={isUnitEnabled}
        onHoverUnit={onHoverUnit}
        onLeaveUnit={onLeaveUnit}
        onOpenScope={onOpenScope}
        onEscape={onEscape}
        onEnterUnit={onEnterUnit}
        onRowFocus={onRowFocus}
        onRowKeyDown={onRowKeyDown}
        onSelectUnit={onSelectUnit}
        selectedUnitId={selectedUnitId}
        setExpanded={setExpanded}
        setRowRef={setRowRef}
      />
    </Box>
  );
};

const UnitTreeSelectorTree: FC<UnitTreeSelectorTreeProps> = ({
  units,
  ...props
}) => (
  <>
    {units.map((unit) => (
      <UnitTreeSelectorUnit key={unit.id} unit={unit} {...props} />
    ))}
  </>
);

const UnitTreeSelectorToolbar: FC<UnitTreeSelectorToolbarProps> = ({
  onCollapse,
  title,
}) => {
  const theme = useTheme();
  const { lang = "en" } = useMyAppContext();
  const collapseLabel = formatUnitInformationMessage(
    "a11y.tree.collapse",
    lang,
    { title: title.toLowerCase() },
  );
  return (
    <Toolbar
      sx={{
        flexShrink: 0,
        borderBottom: (currentTheme) =>
          `1px solid ${currentTheme.palette.divider}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{ marginRight: "auto", fontWeight: 700, letterSpacing: "0.08em" }}
      >
        {title}
      </Typography>
      <IconButton aria-label={collapseLabel} onClick={onCollapse}>
        {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Toolbar>
  );
};

const CollapsedUnitTreeRail: FC<CollapsedUnitTreeRailProps> = ({
  collapsedAriaLabel,
  direction,
  onExpand,
  title,
}) => (
  <Paper
    component="aside"
    aria-label={collapsedAriaLabel}
    variant="outlined"
    sx={{
      width: 48,
      minWidth: 48,
      height: "100%",
      borderRadius: 3,
      boxSizing: "border-box",
    }}
  >
    <LocalizedCollapsedTreeExpand
      direction={direction}
      onExpand={onExpand}
      title={title}
    />
  </Paper>
);

const LocalizedCollapsedTreeExpand: FC<
  Pick<CollapsedUnitTreeRailProps, "direction" | "onExpand" | "title">
> = ({ direction, onExpand, title }) => {
  const { lang = "en" } = useMyAppContext();
  const label = formatUnitInformationMessage("a11y.tree.expand", lang, {
    title: title.toLowerCase(),
  });
  return (
    <Stack alignItems="center" sx={{ paddingY: 1 }}>
      <Tooltip title={label} placement="right">
        <IconButton size="small" aria-label={label} onClick={onExpand}>
          {direction === "ltr" ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const ExpandedUnitTreePanel: FC<ExpandedUnitTreePanelProps> = ({
  ariaLabel,
  onCollapse,
  onKeyDownCapture,
  rootUnits,
  title,
  treeTabIndex,
  ...treeProps
}) => (
  <Paper
    component="aside"
    aria-label={ariaLabel}
    variant="outlined"
    sx={{
      width: "18rem",
      minWidth: "18rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderRadius: 3,
      boxSizing: "border-box",
      background: (currentTheme) =>
        `linear-gradient(180deg, ${currentTheme.palette.background.paper} 0%, ${currentTheme.palette.background.default} 100%)`,
      "body.vscode-high-contrast &": {
        background: "var(--vscode-editor-background, Canvas)",
      },
    }}
  >
    <UnitTreeSelectorToolbar onCollapse={onCollapse} title={title} />
    <Box
      role="tree"
      aria-label={ariaLabel}
      tabIndex={treeTabIndex}
      onKeyDownCapture={onKeyDownCapture}
      sx={{ minHeight: 0, flex: 1, overflow: "auto", paddingY: 0.5 }}
    >
      <UnitTreeSelectorTree units={rootUnits} {...treeProps} />
    </Box>
  </Paper>
);

const UnitTreeSelector: FC<UnitTreeSelectorProps> = ({
  rootUnits,
  unitById,
  currentUnitId,
  hoveredUnitId,
  selectedUnitId,
  title,
  ariaLabel,
  collapsedAriaLabel,
  autoScrollSelectedUnit = true,
  focusRequest,
  canOpenScopeUnit = defaultCanOpenScopeUnit,
  isUnitEnabled = defaultIsUnitEnabled,
  onHoverUnit,
  onLeaveUnit,
  onOpenScope,
  onEscape,
  onEnterUnit,
  onSelectUnit,
}) => {
  const theme = useTheme();
  const { lang = "en" } = useMyAppContext();
  const resolvedTitle =
    title ?? unitInformationMessage("a11y.tree.title", lang);
  const resolvedAriaLabel =
    ariaLabel ?? unitInformationMessage("a11y.tree.label", lang);
  const resolvedCollapsedAriaLabel =
    collapsedAriaLabel ?? unitInformationMessage("a11y.tree.collapsed", lang);
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const { collapse, collapsed, expand } = useResponsivePanelCollapse(isNarrow);
  const currentPathUnitIds = useMemo(
    () => collectCurrentPathUnitIds(currentUnitId, unitById),
    [currentUnitId, unitById],
  );
  const { expandedUnitIds, setExpanded } = useExpandedUnitTreeState(
    currentUnitId,
    selectedUnitId,
    focusRequest?.targetUnitId,
    unitById,
  );
  const { rowByUnitIdRef, setRowRef } = useSelectedTreeRowScroll(
    autoScrollSelectedUnit,
    selectedUnitId,
    expandedUnitIds,
  );
  const visibleRows = useMemo(
    () =>
      resolveVisibleUnitTreeRows(
        rootUnits,
        expandedUnitIds,
        (unit) => isUnitEnabled(unit as FlowGraphUnitDto),
        (unit) => canOpenScopeUnit(unit as FlowGraphUnitDto),
      ),
    [canOpenScopeUnit, expandedUnitIds, isUnitEnabled, rootUnits],
  );
  const navigableVisibleRows = useMemo(
    () => visibleRows.filter(isUnitTreeRowNavigable),
    [visibleRows],
  );

  const { handleRowFocus, requestRowFocus } = useUnitTreeSelectorFocus({
    collapsed,
    expand,
    focusRequest,
    navigableVisibleRows,
    rowByUnitIdRef,
    selectedUnitId,
  });
  const { handleRowKeyDown, handleSelectorKeyDownCapture } =
    useUnitTreeSelectorKeyboard({
      onEnterUnit,
      onEscape,
      onOpenScope,
      onSelectUnit,
      requestRowFocus,
      setExpanded,
      visibleRows,
    });

  const expandedPanel = (
    <ExpandedUnitTreePanel
      ariaLabel={resolvedAriaLabel}
      rootUnits={rootUnits}
      title={resolvedTitle}
      treeTabIndex={navigableVisibleRows.length > 0 ? -1 : 0}
      canOpenScopeUnit={canOpenScopeUnit}
      currentPathUnitIds={currentPathUnitIds}
      currentUnitId={currentUnitId}
      expandedUnitIds={expandedUnitIds}
      hoveredUnitId={hoveredUnitId}
      isUnitEnabled={isUnitEnabled}
      onCollapse={collapse}
      onKeyDownCapture={handleSelectorKeyDownCapture}
      onHoverUnit={onHoverUnit}
      onLeaveUnit={onLeaveUnit}
      onOpenScope={onOpenScope}
      onEscape={onEscape}
      onEnterUnit={onEnterUnit}
      onRowFocus={handleRowFocus}
      onRowKeyDown={handleRowKeyDown}
      onSelectUnit={onSelectUnit}
      selectedUnitId={selectedUnitId}
      setExpanded={setExpanded}
      setRowRef={setRowRef}
    />
  );
  const collapsedRail = (
    <CollapsedUnitTreeRail
      collapsedAriaLabel={resolvedCollapsedAriaLabel}
      direction={theme.direction}
      title={resolvedTitle}
      onExpand={expand}
    />
  );

  return collapsed ? collapsedRail : expandedPanel;
};

export default memo(UnitTreeSelector);
