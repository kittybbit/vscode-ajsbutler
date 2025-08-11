import React, { FC, memo, ReactElement, useCallback, useMemo } from "react";
import {
  AppBar,
  Breadcrumbs,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ViewColumn from "@mui/icons-material/ViewColumn";
import FlowMenu from "./FlowMenu";
import {
  CurrentUnitEntityStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./FlowContents";
import { localeMap } from "../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import { N } from "../../../domain/models/units/N";

type HeaderProps = {
  flowMenuState: FlowMenuStateType;
  drawerWidthState: DrawerWidthStateType;
  currentUnitEntityState: CurrentUnitEntityStateType;
};

const Header: FC<HeaderProps> = ({
  flowMenuState,
  drawerWidthState,
  currentUnitEntityState,
}) => {
  console.log("render Header.");

  const { setMenuStatus } = flowMenuState;
  const { setDrawerWidth } = drawerWidthState;
  const { currentUnitEntity, setCurrentUnitEntity } = currentUnitEntityState;
  const { lang } = useMyAppContext();

  const breadcrumbs = useMemo(() => {
    const crumbs: ReactElement[] = [];

    const build = (unitEntity?: UnitEntity) => {
      if (!unitEntity) return;
      const createCrumb = (entity: UnitEntity): ReactElement =>
        entity === currentUnitEntity ? (
          <Typography key={entity.id} color="inherit">
            {entity.name}
          </Typography>
        ) : (
          <Link
            key={entity.id}
            color="inherit"
            onClick={() => setCurrentUnitEntity(entity)}
          >
            {entity.name}
          </Link>
        );

      crumbs.push(createCrumb(unitEntity));

      if (unitEntity.ty.value() !== "n" || !(unitEntity as N).isRootJobnet) {
        build(unitEntity.parent);
      }
    };

    build(currentUnitEntity);
    return crumbs.reverse();
  }, [currentUnitEntity, setCurrentUnitEntity]);

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
