import React, {
  FC,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { collectUnitTreeAncestorUnitIds } from "./unitTreeSelection";
import {
  resolveUnitTreeNavigationKey,
  resolveVisibleUnitTreeRows,
} from "./unitTreeNavigation";
import { useResponsivePanelCollapse } from "./useResponsivePanelCollapse";

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
  canOpenScopeUnit?: (unit: FlowGraphUnitDto) => boolean;
  isUnitEnabled?: (unit: FlowGraphUnitDto) => boolean;
  onHoverUnit?: (unitId: string) => void;
  onLeaveUnit?: (unitId: string) => void;
  onOpenScope?: (unitId: string) => void;
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

type UnitTreeRowState = {
  hasChildren: boolean;
  isCurrent: boolean;
  isEnabled: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isInCurrentPath: boolean;
  isSelected: boolean;
  canOpenScope: boolean;
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
  onSelect: () => void;
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
  rootUnits: readonly FlowGraphUnitDto[];
  treeTabIndex: 0 | -1;
  title: string;
};

const defaultCanOpenScopeUnit = (): boolean => false;
const defaultIsUnitEnabled = (): boolean => true;

const isDefinedUnitId = (unitId: string | undefined): unitId is string =>
  unitId !== undefined && unitId.length > 0;

export const mergeUnitIds = (
  current: Set<string>,
  requiredUnitIds: readonly (string | undefined)[],
): Set<string> => {
  const newUnitIds = requiredUnitIds.filter(
    (unitId): unitId is string =>
      isDefinedUnitId(unitId) && !current.has(unitId),
  );
  return newUnitIds.length > 0 ? new Set([...current, ...newUnitIds]) : current;
};

const collectRequiredExpandedUnitIds = (
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>,
): readonly (string | undefined)[] => [
  ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
  currentUnitId,
  ...collectUnitTreeAncestorUnitIds(selectedUnitId, unitById),
];

const collectCurrentPathUnitIds = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>,
): ReadonlySet<string> =>
  new Set([
    ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
    ...[currentUnitId].filter(isDefinedUnitId),
  ]);

const setUnitExpanded = (
  current: Set<string>,
  unitId: string,
  expanded: boolean,
): Set<string> => {
  const next = new Set(current);
  if (expanded) {
    next.add(unitId);
  } else {
    next.delete(unitId);
  }
  return next;
};

const useExpandedUnitTreeState = (
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>,
) => {
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  useEffect(() => {
    setExpandedUnitIds((current) =>
      mergeUnitIds(
        current,
        collectRequiredExpandedUnitIds(currentUnitId, selectedUnitId, unitById),
      ),
    );
  }, [currentUnitId, selectedUnitId, unitById]);

  const setExpanded = useCallback((unitId: string, expanded: boolean) => {
    setExpandedUnitIds((current) => setUnitExpanded(current, unitId, expanded));
  }, []);

  return { expandedUnitIds, setExpanded };
};

const scheduleSelectedTreeRowScroll = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  selectedUnitId: string,
): (() => void) => {
  let scrollFrameId: number | undefined;
  const expansionFrameId = window.requestAnimationFrame(() => {
    scrollFrameId = window.requestAnimationFrame(() => {
      rowByUnitId.get(selectedUnitId)?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    });
  });
  return () => {
    window.cancelAnimationFrame(expansionFrameId);
    if (scrollFrameId !== undefined) {
      window.cancelAnimationFrame(scrollFrameId);
    }
  };
};

const setUnitTreeRowRef = (
  rowByUnitId: Map<string, HTMLElement>,
  unitId: string,
  element: HTMLElement | null,
) => {
  if (element) {
    rowByUnitId.set(unitId, element);
  } else {
    rowByUnitId.delete(unitId);
  }
};

const maybeScheduleSelectedTreeRowScroll = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  autoScrollSelectedUnit: boolean,
  selectedUnitId: string | undefined,
): (() => void) | undefined =>
  selectedUnitId && autoScrollSelectedUnit
    ? scheduleSelectedTreeRowScroll(rowByUnitId, selectedUnitId)
    : undefined;

const useSelectedTreeRowScroll = (
  autoScrollSelectedUnit: boolean,
  selectedUnitId: string | undefined,
  expandedUnitIds: ReadonlySet<string>,
) => {
  const rowByUnitIdRef = useRef(new Map<string, HTMLElement>());
  const setRowRef = useCallback(
    (unitId: string, element: HTMLElement | null) => {
      setUnitTreeRowRef(rowByUnitIdRef.current, unitId, element);
    },
    [],
  );

  useEffect(() => {
    return maybeScheduleSelectedTreeRowScroll(
      rowByUnitIdRef.current,
      autoScrollSelectedUnit,
      selectedUnitId,
    );
  }, [autoScrollSelectedUnit, expandedUnitIds, selectedUnitId]);

  return { rowByUnitIdRef, setRowRef };
};

const focusUnitTreeRow = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  unitId: string,
): boolean => {
  const treeItem = rowByUnitId.get(unitId);
  if (!treeItem) return false;
  treeItem.focus({ preventScroll: true });
  treeItem
    .querySelector<HTMLElement>("[data-unit-tree-row]")
    ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  return true;
};

const resolveUnitTreeRowState = (
  unit: FlowGraphUnitDto,
  props: Pick<
    UnitTreeSelectorUnitProps,
    | "canOpenScopeUnit"
    | "currentPathUnitIds"
    | "currentUnitId"
    | "expandedUnitIds"
    | "hoveredUnitId"
    | "isUnitEnabled"
    | "onOpenScope"
    | "selectedUnitId"
  >,
): UnitTreeRowState => {
  const hasChildren = unit.children.length > 0;
  return {
    hasChildren,
    isCurrent: props.currentUnitId === unit.id,
    isEnabled: props.isUnitEnabled(unit),
    isExpanded: hasChildren && props.expandedUnitIds.has(unit.id),
    isHovered: props.hoveredUnitId === unit.id,
    isInCurrentPath: props.currentPathUnitIds.has(unit.id),
    isSelected: props.selectedUnitId === unit.id,
    canOpenScope: props.canOpenScopeUnit(unit) && Boolean(props.onOpenScope),
  };
};

const notifyEnabledUnit = (
  isEnabled: boolean,
  unitId: string,
  callback: ((unitId: string) => void) | undefined,
) => {
  if (isEnabled) {
    callback?.(unitId);
  }
};

const resolveUnitTreeRowBackgroundColor = ({
  isHovered,
  isInCurrentPath,
  isSelected,
}: UnitTreeRowState): string =>
  [
    { matches: isSelected, color: "action.selected" },
    { matches: isHovered, color: "action.hover" },
    { matches: isInCurrentPath, color: "action.hover" },
  ].find(({ matches }) => matches)?.color ?? "transparent";

const resolveUnitTreeRowBorderColor = (
  rowState: UnitTreeRowState,
  selectedColor: string,
): string => (rowState.isSelected ? selectedColor : "transparent");

const resolveUnitTreeRowOutline = (
  rowState: UnitTreeRowState,
  hoveredColor: string,
): string => (rowState.isHovered ? `2px solid ${hoveredColor}` : "none");

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
  if (!hasChildren) {
    return <Box sx={{ width: 28, flexShrink: 0 }} />;
  }
  return (
    <IconButton
      size="small"
      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${unit.name}`}
      onClick={onToggle}
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
  onSelect,
}) => (
  <Box
    role="presentation"
    onMouseDown={
      isEnabled
        ? (event) => {
            event.preventDefault();
            event.currentTarget
              .closest<HTMLElement>('[role="treeitem"]')
              ?.focus({ preventScroll: true });
          }
        : undefined
    }
    onClick={isEnabled ? onSelect : undefined}
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
}) =>
  canOpenScope && onOpenScope ? (
    <Tooltip title="Open as graph scope">
      <IconButton
        size="small"
        aria-label={`Open ${unit.name} as graph scope`}
        onClick={() => onOpenScope(unit.id)}
      >
        <FolderOpenIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  ) : null;

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
          theme.palette.secondary.main,
        )}`,
      outline: (theme) =>
        resolveUnitTreeRowOutline(rowState, theme.palette.primary.main),
      outlineOffset: "-2px",
      backgroundColor: resolveUnitTreeRowBackgroundColor(rowState),
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
    onOpenScope,
    selectedUnitId,
  });
  const handleToggle = () => setExpanded(unit.id, !rowState.isExpanded);
  const handleSelect = () => onSelectUnit(unit.id);
  const handleMouseEnter = () =>
    notifyEnabledUnit(rowState.isEnabled, unit.id, onHoverUnit);
  const handleMouseLeave = () =>
    notifyEnabledUnit(rowState.isEnabled, unit.id, onLeaveUnit);

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
      onFocus={(event) => {
        if (event.target === event.currentTarget) {
          onRowFocus(unit.id);
        }
      }}
      onKeyDown={(event) => onRowKeyDown(event, unit.id)}
      sx={{
        "&:focus-visible > [data-unit-tree-row]": {
          outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          outlineOffset: "-2px",
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
          onSelect={handleSelect}
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
      <IconButton
        aria-label={`Collapse ${title.toLowerCase()}`}
        onClick={onCollapse}
      >
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
    <Stack alignItems="center" sx={{ paddingY: 1 }}>
      <Tooltip title={`Expand ${title.toLowerCase()}`} placement="right">
        <IconButton
          size="small"
          aria-label={`Expand ${title.toLowerCase()}`}
          onClick={onExpand}
        >
          {direction === "ltr" ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  </Paper>
);

const ExpandedUnitTreePanel: FC<ExpandedUnitTreePanelProps> = ({
  ariaLabel,
  onCollapse,
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
    }}
  >
    <UnitTreeSelectorToolbar onCollapse={onCollapse} title={title} />
    <Box
      role="tree"
      aria-label={ariaLabel}
      tabIndex={treeTabIndex}
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
  title = "UNIT TREE",
  ariaLabel = "Unit tree",
  collapsedAriaLabel = "Collapsed unit tree",
  autoScrollSelectedUnit = true,
  canOpenScopeUnit = defaultCanOpenScopeUnit,
  isUnitEnabled = defaultIsUnitEnabled,
  onHoverUnit,
  onLeaveUnit,
  onOpenScope,
  onSelectUnit,
}) => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const { collapse, collapsed, expand } = useResponsivePanelCollapse(isNarrow);
  const currentPathUnitIds = useMemo(
    () => collectCurrentPathUnitIds(currentUnitId, unitById),
    [currentUnitId, unitById],
  );
  const { expandedUnitIds, setExpanded } = useExpandedUnitTreeState(
    currentUnitId,
    selectedUnitId,
    unitById,
  );
  const { rowByUnitIdRef, setRowRef } = useSelectedTreeRowScroll(
    autoScrollSelectedUnit,
    selectedUnitId,
    expandedUnitIds,
  );
  const visibleRows = useMemo(
    () =>
      resolveVisibleUnitTreeRows(rootUnits, expandedUnitIds, (unit) =>
        isUnitEnabled(unit as FlowGraphUnitDto),
      ),
    [expandedUnitIds, isUnitEnabled, rootUnits],
  );
  const focusedUnitIdRef = useRef<string | undefined>(undefined);
  const pendingFocusUnitIdRef = useRef<string | undefined>(undefined);
  const enabledVisibleRows = useMemo(
    () => visibleRows.filter((row) => row.isEnabled),
    [visibleRows],
  );

  const setActiveRow = useCallback(
    (unitId: string | undefined) => {
      const previousUnitId = focusedUnitIdRef.current;
      if (previousUnitId && previousUnitId !== unitId) {
        rowByUnitIdRef.current
          .get(previousUnitId)
          ?.setAttribute("tabindex", "-1");
      }
      if (unitId) {
        rowByUnitIdRef.current.get(unitId)?.setAttribute("tabindex", "0");
      }
      focusedUnitIdRef.current = unitId;
    },
    [rowByUnitIdRef],
  );

  useEffect(() => {
    const currentUnitId = focusedUnitIdRef.current;
    if (
      currentUnitId &&
      enabledVisibleRows.some((row) => row.id === currentUnitId)
    ) {
      setActiveRow(currentUnitId);
      return;
    }
    const fallbackUnitId =
      enabledVisibleRows.find((row) => row.id === selectedUnitId)?.id ??
      enabledVisibleRows[0]?.id;
    if (
      currentUnitId &&
      fallbackUnitId &&
      rowByUnitIdRef.current
        .get(currentUnitId)
        ?.contains(document.activeElement)
    ) {
      pendingFocusUnitIdRef.current = fallbackUnitId;
    }
    setActiveRow(fallbackUnitId);
  }, [enabledVisibleRows, rowByUnitIdRef, selectedUnitId, setActiveRow]);

  const requestRowFocus = useCallback(
    (unitId: string) => {
      setActiveRow(unitId);
      pendingFocusUnitIdRef.current = focusUnitTreeRow(
        rowByUnitIdRef.current,
        unitId,
      )
        ? undefined
        : unitId;
    },
    [rowByUnitIdRef, setActiveRow],
  );

  useEffect(() => {
    const pendingUnitId = pendingFocusUnitIdRef.current;
    if (!pendingUnitId) return;
    if (!enabledVisibleRows.some((row) => row.id === pendingUnitId)) {
      pendingFocusUnitIdRef.current = undefined;
      return;
    }
    if (focusUnitTreeRow(rowByUnitIdRef.current, pendingUnitId)) {
      pendingFocusUnitIdRef.current = undefined;
    }
  }, [enabledVisibleRows, expandedUnitIds, rowByUnitIdRef]);

  const handleRowFocus = useCallback(
    (unitId: string) => {
      setActiveRow(unitId);
    },
    [setActiveRow],
  );

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, unitId: string) => {
      if (event.target !== event.currentTarget) return;
      const result = resolveUnitTreeNavigationKey(visibleRows, unitId, {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        key: event.key,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      });
      if (!result.suppressDefault) return;
      event.preventDefault();
      event.stopPropagation();
      const action = result.action;
      if (!action) return;
      switch (action.kind) {
        case "collapse":
        case "expand":
          setExpanded(action.targetUnitId, action.kind === "expand");
          return;
        case "focus":
          requestRowFocus(action.targetUnitId);
          return;
        case "select":
          onSelectUnit(action.targetUnitId);
          return;
      }
    },
    [onSelectUnit, requestRowFocus, setExpanded, visibleRows],
  );

  const expandedPanel = (
    <ExpandedUnitTreePanel
      ariaLabel={ariaLabel}
      rootUnits={rootUnits}
      title={title}
      treeTabIndex={enabledVisibleRows.length > 0 ? -1 : 0}
      canOpenScopeUnit={canOpenScopeUnit}
      currentPathUnitIds={currentPathUnitIds}
      currentUnitId={currentUnitId}
      expandedUnitIds={expandedUnitIds}
      hoveredUnitId={hoveredUnitId}
      isUnitEnabled={isUnitEnabled}
      onCollapse={collapse}
      onHoverUnit={onHoverUnit}
      onLeaveUnit={onLeaveUnit}
      onOpenScope={onOpenScope}
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
      collapsedAriaLabel={collapsedAriaLabel}
      direction={theme.direction}
      title={title}
      onExpand={expand}
    />
  );

  return collapsed ? collapsedRail : expandedPanel;
};

export default memo(UnitTreeSelector);
