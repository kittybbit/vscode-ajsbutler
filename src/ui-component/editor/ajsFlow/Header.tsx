import React, { FC, memo, ReactElement } from "react";
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

  const flatten = (
    unitEntity: UnitEntity | undefined,
    breadcrumbs: ReactElement[],
  ): void => {
    if (!unitEntity) return;

    // Function to create a breadcrumb element based on whether it's the current entity
    const createBreadcrumbElement = (entity: UnitEntity): ReactElement =>
      entity === currentUnitEntity ? (
        <Typography key={entity.id} color="inherit">
          {entity.name}
        </Typography>
      ) : (
        <Link
          key={entity.id}
          color="inherit"
          onClick={() => setCurrentUnitEntity(() => entity)}
        >
          {entity.name}
        </Link>
      );

    // Add the current entity to the breadcrumb list
    breadcrumbs.push(createBreadcrumbElement(unitEntity));

    // Recursively process the parent if it exists and does not meet the "isRootJobnet" condition
    if (unitEntity.ty.value() !== "n" || !(unitEntity as N).isRootJobnet) {
      flatten(unitEntity.parent, breadcrumbs);
    }
  };
  const breadcrumbs: ReactElement[] = [];
  flatten(currentUnitEntity, breadcrumbs);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <FlowMenu
            flowMenuState={flowMenuState}
            drawerWidthState={drawerWidthState}
          />
          <Tooltip title={localeMap("flow.menu.menuItem1", lang)}>
            <IconButton
              size="small"
              aria-label="toggleMenu1"
              onClick={() => {
                setDrawerWidth(() => 0);
                setMenuStatus((prev) => ({
                  ...prev,
                  menuItem1: !prev.menuItem1,
                }));
              }}
            >
              <ViewColumn fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs.reverse()}
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default memo(Header);
