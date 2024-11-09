import React, { FC, memo, useRef, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import ViewColumn from '@mui/icons-material/ViewColumn';
import { DrawerWidthStateType, FlowMenuStateType } from './FlowContents';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';

type FlowMenuProps = {
    flowMenuState: FlowMenuStateType,
    drawerWidthState: DrawerWidthStateType,
};

const FlowMenu: FC<FlowMenuProps> = ({ flowMenuState, drawerWidthState }) => {

    console.log('render FlowMenu.');

    const { lang } = useMyAppContext();
    const { setMenuStatus } = flowMenuState;
    const { setDrawerWidth } = drawerWidthState;

    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLAnchorElement>(null);
    const handleMenuClick = () => {
        setOpen(() => true);
    };

    return <>
        <IconButton
            size='small'
            edge='start'
            aria-label='menu'
            ref={ref}
            href='' //dummy
            onClick={handleMenuClick}
        >
            <MenuIcon />
        </IconButton>
        <Menu
            id='menu'
            anchorEl={ref.current}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={() => setOpen(() => false)}
        >
            <MenuItem
                id='menuItem1'
                onClick={() => {
                    console.log('click menuItem1');
                    setOpen(() => false)
                    setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
                    setDrawerWidth((prev) => prev !== 0 ? 0 : prev);
                }}>
                <ListItemIcon><ViewColumn /></ListItemIcon>
                <ListItemText>{localeMap('flow.menu.menuItem1', lang)}</ListItemText>
            </MenuItem>
        </Menu >
    </>;
};
export default memo(FlowMenu);