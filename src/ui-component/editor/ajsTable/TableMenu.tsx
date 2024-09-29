import React, { FC, memo, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import Loop from '@mui/icons-material/Loop';
import ViewColumn from '@mui/icons-material/ViewColumn';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';
import { TableMenuStateType } from './TableContents';

const TableMenu: FC<TableMenuStateType> = ({ setMenuStatus }) => {

    console.log('render TableMenu.');

    const { lang, scrollType, updateMyAppResource } = useMyAppContext();

    const [open, setOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
        setOpen(() => true);
    };

    return (
        <>
            <IconButton
                size='small'
                edge='start'
                aria-label='menu'
                sx={{
                    marginRight: 2,
                }}
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
                open={open}
                onClose={() => setOpen(() => false)}
            >
                <MenuItem
                    id='menuItem1'
                    onClick={() => {
                        console.log('click menuItem1');
                        setOpen(() => false)
                        setMenuStatus((prev) => ({ ...prev, menuItem1: true }));
                    }}>
                    <ListItemIcon><ViewColumn /></ListItemIcon>
                    <ListItemText>{localeMap('menu.menuItem1', lang)}</ListItemText>
                </MenuItem>
                <MenuItem
                    id='menuItem2'
                    onClick={() => {
                        console.log('click menuItem2');
                        setOpen(() => false)
                        updateMyAppResource({ scrollType: scrollType === 'table' ? 'window' : 'table' });
                    }}>
                    <ListItemIcon><Loop /></ListItemIcon>
                    {scrollType === 'table' && <ListItemText>{localeMap('menu.menuItem2.window', lang)}</ListItemText>}
                    {scrollType === 'window' && <ListItemText>{localeMap('menu.menuItem2.table', lang)}</ListItemText>}
                </MenuItem>
            </Menu >
        </>
    );
};
export default memo(TableMenu)