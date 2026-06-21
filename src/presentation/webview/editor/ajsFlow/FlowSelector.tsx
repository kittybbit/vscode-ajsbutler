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
import { CurrentUnitIdStateType } from "./flowViewerStateTypes";
import {
  collectFlowTreeAncestorUnitIds,
  isUnitInCurrentFlowScope,
} from "./flowTreeSelection";
import { useResponsiveFlowPanelCollapse } from "./useResponsiveFlowPanelCollapse";

type FlowSelectorProps = {
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  currentUnitIdState: CurrentUnitIdStateType;
  hoveredUnitId?: string;
  selectedUnitId?: string;
  onHoverUnit: (unitId: string) => void;
  onLeaveUnit: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
};

type FlowSelectorTreeProps = {
  units: readonly AjsUnit[];
  currentPathUnitIds: ReadonlySet<string>;
  currentUnit?: AjsUnit;
  expandedUnitIds: ReadonlySet<string>;
  hoveredUnitId?: string;
  onHoverUnit: (unitId: string) => void;
  onLeaveUnit: (unitId: string) => void;
  onOpenScope: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
  selectedUnitId?: string;
  setExpanded: (unitId: string, expanded: boolean) => void;
  setRowRef: (unitId: string, element: HTMLElement | null) => void;
  unitById: ReadonlyMap<string, AjsUnit>;
};

type FlowSelectorUnitProps = Omit<FlowSelectorTreeProps, "units"> & {
  unit: AjsUnit;
};

type FlowSelectorToolbarProps = {
  onCollapse: () => void;
};

const isRootJobnetUnit = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

export const isSelectableFlowScopeUnit = (unit: AjsUnit): boolean =>
  isRootJobnetUnit(unit);

const mergeUnitIds = (
  current: ReadonlySet<string>,
  requiredUnitIds: readonly (string | undefined)[],
): Set<string> =>
  new Set([
    ...current,
    ...requiredUnitIds.filter((unitId): unitId is string => Boolean(unitId)),
  ]);

const useExpandedFlowTreeState = (
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
) => {
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  useEffect(() => {
    const requiredUnitIds = [
      ...collectFlowTreeAncestorUnitIds(currentUnitId, unitById),
      currentUnitId,
      ...collectFlowTreeAncestorUnitIds(selectedUnitId, unitById),
    ];
    setExpandedUnitIds((current) => mergeUnitIds(current, requiredUnitIds));
  }, [currentUnitId, selectedUnitId, unitById]);

  const setExpanded = useCallback((unitId: string, expanded: boolean) => {
    setExpandedUnitIds((current) => {
      const next = new Set(current);
      if (expanded) {
        next.add(unitId);
      } else {
        next.delete(unitId);
      }
      return next;
    });
  }, []);

  return { expandedUnitIds, setExpanded };
};

const useSelectedTreeRowScroll = (
  selectedUnitId: string | undefined,
  expandedUnitIds: ReadonlySet<string>,
) => {
  const rowByUnitIdRef = useRef(new Map<string, HTMLElement>());
  const setRowRef = useCallback(
    (unitId: string, element: HTMLElement | null) => {
      if (element) {
        rowByUnitIdRef.current.set(unitId, element);
      } else {
        rowByUnitIdRef.current.delete(unitId);
      }
    },
    [],
  );

  useEffect(() => {
    if (!selectedUnitId) {
      return undefined;
    }
    let scrollFrameId: number | undefined;
    const expansionFrameId = window.requestAnimationFrame(() => {
      scrollFrameId = window.requestAnimationFrame(() => {
        rowByUnitIdRef.current.get(selectedUnitId)?.scrollIntoView({
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
  }, [expandedUnitIds, selectedUnitId]);

  return setRowRef;
};

const FlowSelectorUnit: FC<FlowSelectorUnitProps> = ({
  unit,
  currentPathUnitIds,
  currentUnit,
  expandedUnitIds,
  hoveredUnitId,
  onHoverUnit,
  onLeaveUnit,
  onOpenScope,
  onSelectUnit,
  selectedUnitId,
  setExpanded,
  setRowRef,
  unitById,
}) => {
  const hasChildren = unit.children.length > 0;
  const isExpanded = hasChildren && expandedUnitIds.has(unit.id);
  const isHovered = hoveredUnitId === unit.id;
  const isSelected = selectedUnitId === unit.id;
  const isCurrent = currentUnit?.id === unit.id;
  const isInCurrentScope = isUnitInCurrentFlowScope(
    unit,
    currentUnit,
    unitById,
  );

  return (
    <Box>
      <Stack
        ref={(element) => setRowRef(unit.id, element)}
        data-flow-tree-unit-id={unit.id}
        direction="row"
        alignItems="center"
        onMouseEnter={() => {
          if (isInCurrentScope) {
            onHoverUnit(unit.id);
          }
        }}
        onMouseLeave={() => {
          if (isInCurrentScope) {
            onLeaveUnit(unit.id);
          }
        }}
        sx={{
          minHeight: "2.25rem",
          marginX: 0.75,
          marginY: 0.15,
          paddingLeft: `${Math.max(0, unit.depth) * 0.65}rem`,
          borderRadius: 1.5,
          border: (theme) =>
            `1px solid ${isSelected ? theme.palette.secondary.main : "transparent"}`,
          outline: (theme) =>
            isHovered ? `2px solid ${theme.palette.primary.main}` : "none",
          outlineOffset: "-2px",
          backgroundColor: isSelected
            ? "action.selected"
            : isHovered
              ? "action.hover"
              : currentPathUnitIds.has(unit.id)
                ? "action.hover"
                : "transparent",
        }}
      >
        {hasChildren ? (
          <IconButton
            size="small"
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${unit.name}`}
            onClick={() => setExpanded(unit.id, !isExpanded)}
          >
            {isExpanded ? (
              <ExpandMoreIcon fontSize="inherit" />
            ) : (
              <ChevronRightIcon fontSize="inherit" />
            )}
          </IconButton>
        ) : (
          <Box sx={{ width: 28, flexShrink: 0 }} />
        )}
        <ButtonBase
          disabled={!isInCurrentScope}
          aria-current={isCurrent ? "true" : undefined}
          aria-pressed={isSelected}
          onClick={() => onSelectUnit(unit.id)}
          sx={{
            minWidth: 0,
            minHeight: "2rem",
            flex: 1,
            justifyContent: "flex-start",
            borderRadius: 1,
            paddingX: 0.5,
            opacity: isInCurrentScope ? 1 : 0.56,
          }}
        >
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
          <Tooltip title={unit.absolutePath} placement="right">
            <Typography variant="body2" noWrap>
              {unit.name}
            </Typography>
          </Tooltip>
        </ButtonBase>
        {isSelectableFlowScopeUnit(unit) && (
          <Tooltip title="Open as graph scope">
            <IconButton
              size="small"
              aria-label={`Open ${unit.name} as graph scope`}
              onClick={() => onOpenScope(unit.id)}
            >
              <FolderOpenIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto">
          <FlowSelectorTree
            units={unit.children}
            currentPathUnitIds={currentPathUnitIds}
            currentUnit={currentUnit}
            expandedUnitIds={expandedUnitIds}
            hoveredUnitId={hoveredUnitId}
            onOpenScope={onOpenScope}
            onHoverUnit={onHoverUnit}
            onLeaveUnit={onLeaveUnit}
            onSelectUnit={onSelectUnit}
            selectedUnitId={selectedUnitId}
            setExpanded={setExpanded}
            setRowRef={setRowRef}
            unitById={unitById}
          />
        </Collapse>
      )}
    </Box>
  );
};

const FlowSelectorTree: FC<FlowSelectorTreeProps> = ({ units, ...props }) => (
  <>
    {units.map((unit) => (
      <FlowSelectorUnit key={unit.id} unit={unit} {...props} />
    ))}
  </>
);

const FlowSelectorToolbar: FC<FlowSelectorToolbarProps> = ({ onCollapse }) => {
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
        FLOW TREE
      </Typography>
      <IconButton aria-label="Collapse flow tree" onClick={onCollapse}>
        {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Toolbar>
  );
};

const FlowSelector: FC<FlowSelectorProps> = ({
  rootUnits,
  unitById,
  currentUnitIdState,
  hoveredUnitId,
  selectedUnitId,
  onHoverUnit,
  onLeaveUnit,
  onSelectUnit,
}) => {
  console.log("render FlowSelector.");

  const { currentUnitId, setCurrentUnitId } = currentUnitIdState;
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const { collapse, collapsed, expand } =
    useResponsiveFlowPanelCollapse(isNarrow);
  const currentUnit = currentUnitId ? unitById.get(currentUnitId) : undefined;
  const currentPathUnitIds = useMemo(
    () =>
      new Set([
        ...collectFlowTreeAncestorUnitIds(currentUnitId, unitById),
        ...(currentUnitId ? [currentUnitId] : []),
      ]),
    [currentUnitId, unitById],
  );
  const { expandedUnitIds, setExpanded } = useExpandedFlowTreeState(
    currentUnitId,
    selectedUnitId,
    unitById,
  );
  const setRowRef = useSelectedTreeRowScroll(selectedUnitId, expandedUnitIds);

  if (collapsed) {
    return (
      <Paper
        component="aside"
        aria-label="Collapsed flow tree"
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
          <Tooltip title="Expand flow tree" placement="right">
            <IconButton
              size="small"
              aria-label="Expand flow tree"
              onClick={expand}
            >
              {theme.direction === "ltr" ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      component="aside"
      aria-label="Flow tree"
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
      <FlowSelectorToolbar onCollapse={collapse} />
      <Box sx={{ minHeight: 0, flex: 1, overflow: "auto", paddingY: 0.5 }}>
        <FlowSelectorTree
          units={rootUnits}
          currentPathUnitIds={currentPathUnitIds}
          currentUnit={currentUnit}
          expandedUnitIds={expandedUnitIds}
          hoveredUnitId={hoveredUnitId}
          onOpenScope={setCurrentUnitId}
          onHoverUnit={onHoverUnit}
          onLeaveUnit={onLeaveUnit}
          onSelectUnit={onSelectUnit}
          selectedUnitId={selectedUnitId}
          setExpanded={setExpanded}
          setRowRef={setRowRef}
          unitById={unitById}
        />
      </Box>
    </Paper>
  );
};

export default memo(FlowSelector);
