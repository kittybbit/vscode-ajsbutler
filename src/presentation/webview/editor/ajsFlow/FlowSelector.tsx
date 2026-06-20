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
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import {
  CurrentUnitIdStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./flowViewerStateTypes";
import {
  collectFlowTreeAncestorUnitIds,
  isUnitInCurrentFlowScope,
} from "./flowTreeSelection";

type FlowSelectorProps = {
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  flowMenuState: FlowMenuStateType;
  currentUnitIdState: CurrentUnitIdStateType;
  drawerWidthState: DrawerWidthStateType;
  selectedUnitId?: string;
  onSelectUnit: (unitId: string) => void;
};

type FlowSelectorTreeProps = {
  units: readonly AjsUnit[];
  currentPathUnitIds: ReadonlySet<string>;
  currentUnit?: AjsUnit;
  expandedUnitIds: ReadonlySet<string>;
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
  drawerRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
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

const useDrawerWidthObserver = (
  setDrawerWidth: DrawerWidthStateType["setDrawerWidth"],
) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = drawerRef.current;
    if (!element) {
      return () => {};
    }
    const observer = new ResizeObserver(([entry]) => {
      setDrawerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [setDrawerWidth]);
  return drawerRef;
};

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
  onOpenScope,
  onSelectUnit,
  selectedUnitId,
  setExpanded,
  setRowRef,
  unitById,
}) => {
  const hasChildren = unit.children.length > 0;
  const isExpanded = hasChildren && expandedUnitIds.has(unit.id);
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
        sx={{
          minHeight: "2.25rem",
          marginX: 0.75,
          marginY: 0.15,
          paddingLeft: `${Math.max(0, unit.depth) * 0.65}rem`,
          borderRadius: 1.5,
          border: (theme) =>
            `1px solid ${isSelected ? theme.palette.secondary.main : "transparent"}`,
          backgroundColor: isSelected
            ? "action.selected"
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
            onOpenScope={onOpenScope}
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

const FlowSelectorToolbar: FC<FlowSelectorToolbarProps> = ({
  drawerRef,
  onClose,
}) => {
  const theme = useTheme();
  return (
    <Toolbar
      ref={drawerRef}
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
      <IconButton aria-label="Close flow tree" onClick={onClose}>
        {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Toolbar>
  );
};

const FlowSelector: FC<FlowSelectorProps> = ({
  rootUnits,
  unitById,
  currentUnitIdState,
  flowMenuState,
  drawerWidthState,
  selectedUnitId,
  onSelectUnit,
}) => {
  console.log("render FlowSelector.");

  const { menuStatus, setMenuStatus } = flowMenuState;
  const { currentUnitId, setCurrentUnitId } = currentUnitIdState;
  const { setDrawerWidth } = drawerWidthState;
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
  const drawerRef = useDrawerWidthObserver(setDrawerWidth);
  const handleClose = () => {
    setDrawerWidth(0);
    setMenuStatus((current) => ({ ...current, menuItem1: false }));
  };

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={menuStatus.menuItem1}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: "18rem",
            overflow: "hidden",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            background: (theme) =>
              `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        },
      }}
    >
      <FlowSelectorToolbar drawerRef={drawerRef} onClose={handleClose} />
      <Box sx={{ minHeight: 0, flex: 1, overflow: "auto", paddingY: 0.5 }}>
        <FlowSelectorTree
          units={rootUnits}
          currentPathUnitIds={currentPathUnitIds}
          currentUnit={currentUnit}
          expandedUnitIds={expandedUnitIds}
          onOpenScope={setCurrentUnitId}
          onSelectUnit={onSelectUnit}
          selectedUnitId={selectedUnitId}
          setExpanded={setExpanded}
          setRowRef={setRowRef}
          unitById={unitById}
        />
      </Box>
    </Drawer>
  );
};

export default memo(FlowSelector);
