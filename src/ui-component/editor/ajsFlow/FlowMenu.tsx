import React, { FC, memo, useState } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { DrawerWidthStateType, FlowMenuStateType } from "./FlowContents";
import { useMyAppContext } from "../MyContexts";
import { LocaleKeyType, localeMap } from "../../../domain/services/i18n/nls";

type FlowMenuProps = {
  flowMenuState: FlowMenuStateType;
  drawerWidthState: DrawerWidthStateType;
};

const FlowMenu: FC<FlowMenuProps> = ({ flowMenuState, drawerWidthState }) => {
  console.log("render FlowMenu.");

  const { lang } = useMyAppContext();
  const { setMenuStatus } = flowMenuState;
  const { setDrawerWidth } = drawerWidthState;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleToggleMenuItem1 = () => {
    setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
    setDrawerWidth((prev) => (prev === 0 ? prev : 0));
  };

  const menuItems = [
    {
      id: "menuItem1",
      icon: <ViewColumnIcon />,
      label: localeMap("flow.menu.menuItem1" as LocaleKeyType, lang),
      action: handleToggleMenuItem1,
    },
  ];

  return (
    <>
      <IconButton
        size="small"
        edge="start"
        aria-label="menu"
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuItems.map(({ id, icon, label, action }) => (
          <MenuItem
            key={id}
            onClick={() => {
              action();
              handleMenuClose();
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default memo(FlowMenu);
