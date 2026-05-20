import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import MuiAccordion, { type AccordionProps } from "@mui/material/Accordion";
import MuiAccordionActions, {
  type AccordionActionsProps,
} from "@mui/material/AccordionActions";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import {
  CurrentUnitIdStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./flowViewerStateTypes";

type FlowSelectorProps = {
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  flowMenuState: FlowMenuStateType;
  currentUnitIdState: CurrentUnitIdStateType;
  drawerWidthState: DrawerWidthStateType;
};

type FlowSelectorTreeProps = {
  rootUnits: AjsUnit[];
  isAncestorOf: (target?: AjsUnit) => boolean;
  setCurrentUnitId: (unitId: string) => void;
};

type FlowSelectorUnitProps = {
  unit: AjsUnit;
  isAncestorOf: (target?: AjsUnit) => boolean;
  setCurrentUnitId: (unitId: string) => void;
};

type FlowSelectorToolbarProps = {
  drawerRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
};

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    square
    slotProps={{
      heading: { component: "div" },
    }}
    {...props}
  />
))(() => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  boxShadow: "none",
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon fontSize="inherit" />}
    sx={{ minHeight: "2em" }}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  borderRadius: theme.spacing(1),
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

const AccordionActions = styled((props: AccordionActionsProps) => (
  <MuiAccordionActions {...props} />
))(() => ({
  justifyContent: "flex-start",
  paddingLeft: 0,
  paddingRight: 0,
}));

const isRootJobnetUnit = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

const getParentUnit = (
  unit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): AjsUnit | undefined =>
  unit.parentId ? unitById.get(unit.parentId) : undefined;

const collectAncestorIds = (
  current: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
  ancestorIds: Set<string>,
): Set<string> => {
  if (!current) {
    return ancestorIds;
  }
  ancestorIds.add(current.id);
  return collectAncestorIds(
    getParentUnit(current, unitById),
    unitById,
    ancestorIds,
  );
};

const buildAncestorIds = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): Set<string> =>
  collectAncestorIds(
    currentUnitId ? unitById.get(currentUnitId) : undefined,
    unitById,
    new Set<string>(),
  );

const useAncestorMatcher = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): ((target?: AjsUnit) => boolean) => {
  const ancestorIds = useMemo(
    () => buildAncestorIds(currentUnitId, unitById),
    [currentUnitId, unitById],
  );
  return useCallback(
    (target?: AjsUnit) => (target ? ancestorIds.has(target.id) : false),
    [ancestorIds],
  );
};

const useDrawerWidthObserver = (
  setDrawerWidth: DrawerWidthStateType["setDrawerWidth"],
) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) {
      return () => {};
    }
    const observer = new ResizeObserver(([entry]) => {
      setDrawerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [setDrawerWidth]);
  return drawerRef;
};

const FlowGroupUnit: FC<FlowSelectorUnitProps> = ({
  unit,
  isAncestorOf,
  setCurrentUnitId,
}) => (
  <Accordion
    key={unit.id}
    sx={{
      marginLeft: `${unit.depth * 0.85}em`,
      marginRight: "0.5em",
      marginBottom: "0.3em",
      border: (theme) => `1px solid ${theme.palette.divider}`,
      backgroundColor: isAncestorOf(unit)
        ? "action.selected"
        : "background.paper",
    }}
    expanded={isAncestorOf(unit)}
    onChange={() => setCurrentUnitId(unit.id)}
  >
    <AccordionSummary>{unit.name}</AccordionSummary>
    <FlowSelectorTree
      rootUnits={unit.children}
      isAncestorOf={isAncestorOf}
      setCurrentUnitId={setCurrentUnitId}
    />
  </Accordion>
);

const RootJobnetUnit: FC<FlowSelectorUnitProps> = ({
  unit,
  isAncestorOf,
  setCurrentUnitId,
}) => {
  const isAncestor = isAncestorOf(unit);
  return (
    <AccordionActions
      key={unit.id}
      disableSpacing
      onClick={() => setCurrentUnitId(unit.id)}
      sx={{
        marginLeft: `${unit.depth * 0.85}em`,
        marginRight: "0.75em",
        marginBottom: "0.2em",
        borderRadius: "999px",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: isAncestor ? "action.selected" : "background.paper",
        paddingX: "0.75em",
      }}
    >
      {isAncestor && (
        <CheckCircleOutlineIcon
          fontSize="inherit"
          sx={{ marginRight: "0.25em" }}
        />
      )}
      {unit.name}
    </AccordionActions>
  );
};

const FlowSelectorUnit: FC<FlowSelectorUnitProps> = ({
  unit,
  isAncestorOf,
  setCurrentUnitId,
}) => {
  if (unit.unitType === "g") {
    return (
      <FlowGroupUnit
        unit={unit}
        isAncestorOf={isAncestorOf}
        setCurrentUnitId={setCurrentUnitId}
      />
    );
  }
  if (isRootJobnetUnit(unit)) {
    return (
      <RootJobnetUnit
        unit={unit}
        isAncestorOf={isAncestorOf}
        setCurrentUnitId={setCurrentUnitId}
      />
    );
  }
  return null;
};

const FlowSelectorTree: FC<FlowSelectorTreeProps> = ({
  rootUnits,
  isAncestorOf,
  setCurrentUnitId,
}) => (
  <>
    {rootUnits.map((unit) => (
      <FlowSelectorUnit
        key={unit.id}
        unit={unit}
        isAncestorOf={isAncestorOf}
        setCurrentUnitId={setCurrentUnitId}
      />
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
        position: "sticky",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          marginRight: "auto",
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        FLOW TREE
      </Typography>
      <IconButton onClick={onClose}>
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
}) => {
  console.log("render FlowSelector.");

  const { menuStatus, setMenuStatus } = flowMenuState;
  const { currentUnitId, setCurrentUnitId } = currentUnitIdState;
  const { setDrawerWidth } = drawerWidthState;

  const handleClose = () => {
    setDrawerWidth(() => 0);
    setMenuStatus((prev) => {
      return { ...prev, ...{ menuItem1: false } };
    });
  };

  const isAncestorOf = useAncestorMatcher(currentUnitId, unitById);
  const drawerRef = useDrawerWidthObserver(setDrawerWidth);

  return (
    <>
      <Drawer
        anchor="left"
        variant="persistent"
        open={menuStatus.menuItem1}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: "18rem",
              borderRight: (theme) => `1px solid ${theme.palette.divider}`,
              background: (theme) =>
                `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            },
          },
        }}
      >
        <FlowSelectorToolbar drawerRef={drawerRef} onClose={handleClose} />
        <FlowSelectorTree
          rootUnits={rootUnits}
          isAncestorOf={isAncestorOf}
          setCurrentUnitId={setCurrentUnitId}
        />
      </Drawer>
    </>
  );
};

export default memo(FlowSelector);
