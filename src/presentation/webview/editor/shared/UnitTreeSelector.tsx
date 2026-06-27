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

type UnitTreeSelectorToolbarProps = {
  onCollapse: () => void;
  title: string;
};

const defaultCanOpenScopeUnit = (): boolean => false;
const defaultIsUnitEnabled = (): boolean => true;

const mergeUnitIds = (
  current: ReadonlySet<string>,
  requiredUnitIds: readonly (string | undefined)[],
): Set<string> =>
  new Set([
    ...current,
    ...requiredUnitIds.filter((unitId): unitId is string => Boolean(unitId)),
  ]);

const useExpandedUnitTreeState = (
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
) => {
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  useEffect(() => {
    const requiredUnitIds = [
      ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
      currentUnitId,
      ...collectUnitTreeAncestorUnitIds(selectedUnitId, unitById),
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
  const hasChildren = unit.children.length > 0;
  const isExpanded = hasChildren && expandedUnitIds.has(unit.id);
  const isEnabled = isUnitEnabled(unit);
  const isHovered = hoveredUnitId === unit.id;
  const isSelected = selectedUnitId === unit.id;
  const isCurrent = currentUnitId === unit.id;

  return (
    <Box>
      <Stack
        ref={(element) => setRowRef(unit.id, element)}
        data-unit-tree-unit-id={unit.id}
        direction="row"
        alignItems="center"
        onMouseEnter={() => {
          if (isEnabled) {
            onHoverUnit?.(unit.id);
          }
        }}
        onMouseLeave={() => {
          if (isEnabled) {
            onLeaveUnit?.(unit.id);
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
          disabled={!isEnabled}
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
            opacity: isEnabled ? 1 : 0.56,
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
        {canOpenScopeUnit(unit) && onOpenScope && (
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
          <UnitTreeSelectorTree
            units={unit.children}
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
        </Collapse>
      )}
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

const UnitTreeSelector: FC<UnitTreeSelectorProps> = ({
  rootUnits,
  unitById,
  currentUnitId,
  hoveredUnitId,
  selectedUnitId,
  title = "UNIT TREE",
  ariaLabel = "Unit tree",
  collapsedAriaLabel = "Collapsed unit tree",
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
    () =>
      new Set([
        ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
        ...(currentUnitId ? [currentUnitId] : []),
      ]),
    [currentUnitId, unitById],
  );
  const { expandedUnitIds, setExpanded } = useExpandedUnitTreeState(
    currentUnitId,
    selectedUnitId,
    unitById,
  );
  const setRowRef = useSelectedTreeRowScroll(selectedUnitId, expandedUnitIds);

  if (collapsed) {
    return (
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
      <UnitTreeSelectorToolbar onCollapse={collapse} title={title} />
      <Box sx={{ minHeight: 0, flex: 1, overflow: "auto", paddingY: 0.5 }}>
        <UnitTreeSelectorTree
          units={rootUnits}
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
    </Paper>
  );
};

export default memo(UnitTreeSelector);
