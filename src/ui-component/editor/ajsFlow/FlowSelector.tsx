import React, { FC, memo, useEffect, useMemo, useRef } from "react";
import {
  Accordion as MuiAccordion,
  AccordionActions as MuiAccordionActions,
  AccordionSummary as MuiAccordionSummary,
  Drawer,
  IconButton,
  Toolbar,
  useTheme,
  AccordionProps,
  styled,
  AccordionSummaryProps,
  AccordionActionsProps,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import {
  CurrentUnitIdStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./FlowContents";

type FlowSelectorProps = {
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  flowMenuState: FlowMenuStateType;
  currentUnitIdState: CurrentUnitIdStateType;
  drawerWidthState: DrawerWidthStateType;
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
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon fontSize="inherit" />}
    sx={{ minHeight: "2em" }}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
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
}));

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

  const theme = useTheme();

  const handleClose = () => {
    setDrawerWidth(() => 0);
    setMenuStatus((prev) => {
      return { ...prev, ...{ menuItem1: false } };
    });
  };

  const isAncestorOf = useMemo(() => {
    const set = new Set<string>();
    let current = currentUnitId ? unitById.get(currentUnitId) : undefined;
    while (current) {
      set.add(current.id);
      current = current.parentId ? unitById.get(current.parentId) : undefined;
    }
    return (target?: AjsUnit) => (target ? set.has(target.id) : false);
  }, [currentUnitId, unitById]);

  const renderUnitEntity = (
    units: AjsUnit[],
    isAncestorOf: (target?: AjsUnit) => boolean,
    setCurrentUnitId: (unitId: string) => void,
  ): React.ReactNode[] => {
    return units.map((unit) => {
      if (unit.unitType === "g") {
        return (
          <Accordion
            key={unit.id}
            sx={{ marginLeft: `${unit.depth}em` }}
            expanded={isAncestorOf(unit)}
            onChange={() => setCurrentUnitId(unit.id)}
          >
            <AccordionSummary>{unit.name}</AccordionSummary>
            {renderUnitEntity(unit.children, isAncestorOf, setCurrentUnitId)}
          </Accordion>
        );
      }
      if (unit.unitType === "n" && unit.isRootJobnet) {
        return (
          <AccordionActions
            key={unit.id}
            disableSpacing
            onClick={() => setCurrentUnitId(unit.id)}
            sx={{ marginLeft: `${unit.depth}em` }}
          >
            {isAncestorOf(unit) && (
              <CheckCircleOutlineIcon
                fontSize="inherit"
                sx={{ marginRight: "0.25em" }}
              />
            )}
            {unit.name}
          </AccordionActions>
        );
      }
      return null;
    });
  };

  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return () => {};
    const observer = new ResizeObserver(([entry]) => {
      setDrawerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [setDrawerWidth]);

  return (
    <>
      <Drawer
        anchor="left"
        variant="persistent"
        open={menuStatus.menuItem1}
        onClose={handleClose}
      >
        <Toolbar
          ref={drawerRef}
          sx={{
            position: "sticky",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={handleClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Toolbar>
        {renderUnitEntity(rootUnits, isAncestorOf, setCurrentUnitId)}
      </Drawer>
    </>
  );
};

export default memo(FlowSelector);
