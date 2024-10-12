import React, { Dispatch, FC, memo, ReactElement, SetStateAction, useCallback, useState } from 'react';
import { Alert, AppBar, IconButton, Slide, Snackbar, Stack, Toolbar, Tooltip, useScrollTrigger } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import ViewColumn from '@mui/icons-material/ViewColumn';
import Loop from '@mui/icons-material/Loop';
import { Table } from '@tanstack/table-core';
import TableMenu from './TableMenu';
import SearchBox from './SearchBox';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import { toCsv } from '../../../domain/services/export/csv';
import { TableMenuStateType } from './TableContents';
import { useMyAppContext } from '../MyContexts';
import { localeMap } from '../../../domain/services/i18n/nls';


type HeaderProps = {
    table: Table<UnitEntity>,
    tableMenuState: TableMenuStateType,
    setDrawerWidth: Dispatch<SetStateAction<number | null>>,
};

const Header: FC<HeaderProps> = ({ table, tableMenuState, setDrawerWidth }) => {

    console.log('render Header.');

    const { lang, scrollType, updateMyAppResource } = useMyAppContext();

    const [open, setOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(toCsv(table));
        setOpen(true);
    };

    const handleSave = () => {
        window.vscode.postMessage({ type: 'save', data: toCsv(table) });
    };

    const HideOnScroll = useCallback(({ children }: { children: ReactElement }) => {
        console.log('render HideOnScroll.');

        const trigger = useScrollTrigger({
            target: window,
            threshold: 0,
        });
        return (
            <Slide appear={false} direction="down" in={!trigger}>
                {children}
            </Slide>
        );
    }, []);

    return (
        <>
            <HideOnScroll>
                <AppBar position='sticky'>
                    <Toolbar>
                        <TableMenu
                            {...tableMenuState}
                        />
                        <SearchBox
                            globalFilter={table.getState().globalFilter}
                            setGlobalFilter={table.setGlobalFilter}
                        />
                        <Tooltip title={localeMap('menu.menuItem1', lang)}>
                            <IconButton
                                size='small'
                                aria-label='toggleMenu1'
                                onClick={
                                    () => {
                                        tableMenuState.setMenuStatus((prev) => ({ ...prev, menuItem1: !prev.menuItem1 }));
                                        setDrawerWidth((prev) => prev !== 0 ? 0 : prev);
                                    }
                                }
                            >
                                <ViewColumn fontSize='inherit' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={localeMap(scrollType === 'table' ? 'menu.menuItem2.window' : 'menu.menuItem2.table', lang)}>
                            <IconButton
                                size='small'
                                aria-label='toggleMenu2'
                                onClick={() => {
                                    updateMyAppResource({ scrollType: scrollType === 'table' ? 'window' : 'table' });
                                }}
                            >
                                <Loop fontSize='inherit' />
                            </IconButton>
                        </Tooltip>
                        <Stack flexGrow={1} />
                        <Tooltip title='Copy the contents to clipbord as csv.'>
                            <IconButton aria-label='Copy the contents to clipbord as csv.' size='small' onClick={handleCopy}>
                                <ContentCopyIcon fontSize='inherit' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Save the contents as csv.'>
                            <IconButton aria-label='Save the contents as csv.' size='small' onClick={handleSave}>
                                <SaveIcon fontSize='inherit' />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                    <Snackbar
                        sx={{ position: 'absolute' }}
                        open={open}
                        autoHideDuration={2500}
                        onClose={() => setOpen(false)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <Alert severity='info'>Copied</Alert>
                    </Snackbar>
                </AppBar>
            </HideOnScroll>
        </>
    );
};
export default memo(Header);