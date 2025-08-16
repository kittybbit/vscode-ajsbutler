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
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import { N } from "../../../domain/models/units/N";
import {
  CurrentUnitEntityStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./FlowContents";

type FlowSelectorProps = {
  unitEntities: UnitEntity[];
  flowMenuState: FlowMenuStateType;
  currentUnitEntityState: CurrentUnitEntityStateType;
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
  unitEntities,
  currentUnitEntityState: currentUnitEntityState,
  flowMenuState,
  drawerWidthState,
}) => {
  console.log("render FlowSelector.");

  const { menuStatus, setMenuStatus } = flowMenuState;
  const { currentUnitEntity, setCurrentUnitEntity } = currentUnitEntityState;
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
    let current = currentUnitEntity;
    while (current) {
      set.add(current.id);
      current = current.parent;
    }
    return (target?: UnitEntity) => (target ? set.has(target.id) : false);
  }, [currentUnitEntity]);

  const renderUnitEntities = (
    unitEntities: UnitEntity[],
    currentUnitEntity: UnitEntity | undefined,
    isAncestorOf: (target?: UnitEntity) => boolean,
    setCurrentUnitEntity: (u: UnitEntity) => void,
  ): React.ReactNode[] => {
    return unitEntities.map((unitEntity) => {
      if (unitEntity.ty.value() === "g") {
        return (
          <Accordion
            key={unitEntity.id}
            sx={{ marginLeft: `${unitEntity.depth}em` }}
            expanded={isAncestorOf(unitEntity)}
            onChange={() => setCurrentUnitEntity(unitEntity)}
          >
            <AccordionSummary>{unitEntity.name}</AccordionSummary>
            {renderUnitEntities(
              unitEntity.children,
              currentUnitEntity,
              isAncestorOf,
              setCurrentUnitEntity,
            )}
          </Accordion>
        );
      }
      if (unitEntity.ty.value() === "n" && (unitEntity as N).isRootJobnet) {
        return (
          <AccordionActions
            key={unitEntity.id}
            disableSpacing
            onClick={() => setCurrentUnitEntity(unitEntity)}
            sx={{ marginLeft: `${unitEntity.depth}em` }}
          >
            {isAncestorOf(unitEntity) && (
              <CheckCircleOutlineIcon
                fontSize="inherit"
                sx={{ marginRight: "0.25em" }}
              />
            )}
            {unitEntity.name}
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
        {renderUnitEntities(
          unitEntities,
          currentUnitEntity,
          isAncestorOf,
          setCurrentUnitEntity,
        )}
      </Drawer>
    </>
  );
};

export default memo(FlowSelector);
