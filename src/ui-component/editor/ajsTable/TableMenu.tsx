import React, { FC, memo, useRef, useState } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Loop from "@mui/icons-material/Loop";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { useMyAppContext } from "../MyContexts";
import { localeMap } from "../../../domain/services/i18n/nls";
import { DrawerWidthStateType, TableMenuStateType } from "./TableContents";

type TableMenuProps = {
  tableMenuState: TableMenuStateType;
  drawerWidthState: DrawerWidthStateType;
};

const TableMenu: FC<TableMenuProps> = ({
  tableMenuState,
  drawerWidthState,
}) => {
  console.log("render TableMenu.");

  const { lang, scrollType, updateMyAppResource } = useMyAppContext();
  const { setMenuStatus } = tableMenuState;
  const { setDrawerWidth } = drawerWidthState;

  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMenuClick = () => {
    setOpen(() => true);
  };

  return (
    <>
      <IconButton
        size="small"
        edge="start"
        aria-label="menu"
        ref={ref}
        href="" //dummy
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={() => setOpen(() => false)}
      >
        <MenuItem
          id="menuItem1"
          onClick={() => {
            console.log("click menuItem1");
            setOpen(() => false);
            setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
            setDrawerWidth((prev) => (prev !== 0 ? 0 : prev));
          }}
        >
          <ListItemIcon>
            <DisplaySettingsIcon />
          </ListItemIcon>
          <ListItemText>{localeMap("table.menu.menuItem1", lang)}</ListItemText>
        </MenuItem>
        <MenuItem
          id="menuItem2"
          onClick={() => {
            console.log("click menuItem2");
            setOpen(() => false);
            updateMyAppResource({
              scrollType: scrollType === "table" ? "window" : "table",
            });
          }}
        >
          <ListItemIcon>
            <Loop />
          </ListItemIcon>
          {scrollType === "table" && (
            <ListItemText>
              {localeMap("table.menu.menuItem2.window", lang)}
            </ListItemText>
          )}
          {scrollType === "window" && (
            <ListItemText>
              {localeMap("table.menu.menuItem2.table", lang)}
            </ListItemText>
          )}
        </MenuItem>
      </Menu>
    </>
  );
};
export default memo(TableMenu);
