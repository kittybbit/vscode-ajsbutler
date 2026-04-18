import React, { FC, memo, ReactElement, useCallback, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ViewColumn from "@mui/icons-material/ViewColumn";
import FlowMenu from "./FlowMenu";
import {
  CurrentUnitIdStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./FlowContents";
import { localeMap } from "../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";

type HeaderProps = {
  flowMenuState: FlowMenuStateType;
  drawerWidthState: DrawerWidthStateType;
  currentUnit?: AjsUnit;
  unitById: ReadonlyMap<string, AjsUnit>;
  currentUnitIdState: CurrentUnitIdStateType;
};

const Header: FC<HeaderProps> = ({
  flowMenuState,
  drawerWidthState,
  currentUnit,
  unitById,
  currentUnitIdState,
}) => {
  console.log("render Header.");

  const { setMenuStatus } = flowMenuState;
  const { setDrawerWidth } = drawerWidthState;
  const { setCurrentUnitId } = currentUnitIdState;
  const { lang } = useMyAppContext();

  const breadcrumbs = useMemo(() => {
    const crumbs: ReactElement[] = [];

    const build = (unit?: AjsUnit) => {
      if (!unit) return;
      const createCrumb = (target: AjsUnit): ReactElement =>
        target.id === currentUnit?.id ? (
          <Typography key={target.id} color="inherit">
            {target.name}
          </Typography>
        ) : (
          <Link
            key={target.id}
            color="inherit"
            onClick={() => setCurrentUnitId(target.id)}
          >
            {target.name}
          </Link>
        );

      crumbs.push(createCrumb(unit));

      if (unit.unitType !== "n" || !unit.isRootJobnet) {
        build(unit.parentId ? unitById.get(unit.parentId) : undefined);
      }
    };

    build(currentUnit);
    return crumbs.reverse();
  }, [currentUnit, setCurrentUnitId, unitById]);

  const menuItem1Label = useMemo(
    () => localeMap("flow.menu.menuItem1", lang),
    [lang],
  );
  const handleToggleMenu1 = useCallback(() => {
    setDrawerWidth(0);
    setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
  }, [setDrawerWidth, setMenuStatus]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <FlowMenu
            flowMenuState={flowMenuState}
            drawerWidthState={drawerWidthState}
          />
          <Tooltip title={menuItem1Label}>
            <IconButton
              size="small"
              aria-label="toggleMenu1"
              onClick={handleToggleMenu1}
            >
              <ViewColumn fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
