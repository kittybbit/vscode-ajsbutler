import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
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
import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { collectUnitTreeAncestorUnitIds } from "./unitTreeSelection";
import { useResponsivePanelCollapse } from "./useResponsivePanelCollapse";

export type UnitTreeSelectorProps = {
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  currentUnitId?: string;
  hoveredUnitId?: string;
  selectedUnitId?: string;
  title?: string;
  ariaLabel?: string;
  collapsedAriaLabel?: string;
  autoScrollSelectedUnit?: boolean;
  canOpenScopeUnit?: (unit: AjsUnit) => boolean;
  isUnitEnabled?: (unit: AjsUnit) => boolean;
  onHoverUnit?: (unitId: string) => void;
  onLeaveUnit?: (unitId: string) => void;
  onOpenScope?: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
};

type UnitTreeSelectorTreeProps = {
  units: readonly AjsUnit[];
  canOpenScopeUnit: (unit: AjsUnit) => boolean;
  currentPathUnitIds: ReadonlySet<string>;
  currentUnitId?: string;
  expandedUnitIds: ReadonlySet<string>;
  hoveredUnitId?: string;
  isUnitEnabled: (unit: AjsUnit) => boolean;
  onHoverUnit?: (unitId: string) => void;
  onLeaveUnit?: (unitId: string) => void;
  onOpenScope?: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
  selectedUnitId?: string;
  setExpanded: (unitId: string, expanded: boolean) => void;
  setRowRef: (unitId: string, element: HTMLElement | null) => void;
};

type UnitTreeSelectorUnitProps = Omit<UnitTreeSelectorTreeProps, "units"> & {
  unit: AjsUnit;
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
  unit: AjsUnit;
  onToggle: () => void;
};

type UnitTreeRowButtonProps = Pick<
  UnitTreeRowState,
  "isCurrent" | "isEnabled" | "isSelected"
> & {
  unit: AjsUnit;
  onSelect: () => void;
};

type UnitTreeOpenScopeActionProps = Pick<UnitTreeRowState, "canOpenScope"> & {
  unit: AjsUnit;
  onOpenScope?: (unitId: string) => void;
};

type UnitTreeRowFrameProps = Pick<UnitTreeSelectorUnitProps, "setRowRef"> & {
  children: React.ReactNode;
  rowState: UnitTreeRowState;
  unit: AjsUnit;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

type UnitTreeNestedChildrenProps = Pick<
  UnitTreeRowState,
  "hasChildren" | "isExpanded"
> &
  Omit<UnitTreeSelectorTreeProps, "units"> & {
    unit: AjsUnit;
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
  rootUnits: readonly AjsUnit[];
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
  unitById: ReadonlyMap<string, AjsUnit>,
): readonly (string | undefined)[] => [
  ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
  currentUnitId,
  ...collectUnitTreeAncestorUnitIds(selectedUnitId, unitById),
];

const collectCurrentPathUnitIds = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
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
  unitById: ReadonlyMap<string, AjsUnit>,
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

  return setRowRef;
};

const resolveUnitTreeRowState = (
  unit: AjsUnit,
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
  <ButtonBase
    disabled={!isEnabled}
    aria-current={isCurrent ? "true" : undefined}
    aria-pressed={isSelected}
    onClick={onSelect}
    sx={{
      minWidth: 0,
      minHeight: "2rem",
      flex: 1,
      justifyContent: "flex-start",
      borderRadius: 1,
      paddingX: 0.5,
      opacity: isEnabled ? 1 : 0.56,
    }}
  >
    <UnitTreeStatusIcons isCurrent={isCurrent} isSelected={isSelected} />
    <Tooltip title={unit.absolutePath} placement="right">
      <Typography variant="body2" noWrap>
        {unit.name}
      </Typography>
    </Tooltip>
  </ButtonBase>
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
      <UnitTreeSelectorTree units={unit.children} {...props} />
    </Collapse>
  ) : null;

const UnitTreeRowFrame: FC<UnitTreeRowFrameProps> = ({
  children,
  rowState,
  setRowRef,
  unit,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Stack
    ref={(element) => setRowRef(unit.id, element)}
    data-unit-tree-unit-id={unit.id}
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
    <Box>
      <UnitTreeRowFrame
        rowState={rowState}
        setRowRef={setRowRef}
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
    <Box sx={{ minHeight: 0, flex: 1, overflow: "auto", paddingY: 0.5 }}>
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
  const setRowRef = useSelectedTreeRowScroll(
    autoScrollSelectedUnit,
    selectedUnitId,
    expandedUnitIds,
  );

  const expandedPanel = (
    <ExpandedUnitTreePanel
      ariaLabel={ariaLabel}
      rootUnits={rootUnits}
      title={title}
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
