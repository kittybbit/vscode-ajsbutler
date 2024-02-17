import React, { useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import Loop from '@mui/icons-material/Loop';
import ViewColumn from '@mui/icons-material/ViewColumn';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';
import { MenuType } from './Header';

const TableMenu = (params: MenuType) => {

    console.log('render TableMenu.');

    const { lang, tableType, updateMyAppResource } = useMyAppContext();
    const { setMenuStatus } = params;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <>
        <IconButton
            size='small'
            edge='start'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
        >
            <MenuIcon />
        </IconButton>
        <Menu
            id='menu'
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem
                id='menuItem1'
                onClick={() => {
                    console.log('click menuItem1');
                    handleClose();
                    setMenuStatus((prev) => ({ ...prev, menuItem1: true }));
                }}>
                <ListItemIcon><ViewColumn /></ListItemIcon>
                <ListItemText>{localeMap('menu.menuItem1', lang)}</ListItemText>
            </MenuItem>
            <MenuItem
                id='menuItem2'
                onClick={() => {
                    console.log('click menuItem2');
                    handleClose();
                    updateMyAppResource({ tableType: tableType === 'virtual' ? 'static' : 'virtual' });
                }}>
                <ListItemIcon><Loop /></ListItemIcon>
                {tableType === 'virtual' && <ListItemText>{localeMap('menu.menuItem2.static', lang)}</ListItemText>}
                {tableType === 'static' && <ListItemText>{localeMap('menu.menuItem2.virtual', lang)}</ListItemText>}
            </MenuItem>
        </Menu >
    </>;
};
export default TableMenu;