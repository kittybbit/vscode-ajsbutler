import React, { Dispatch, ReactElement, SetStateAction, useCallback, useState } from 'react';
import { Alert, AppBar, IconButton, Slide, Snackbar, Stack, Toolbar, Tooltip, useScrollTrigger } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import { Table } from '@tanstack/table-core';
import TableMenu from './TableMenu';
import SearchBox from './SearchBox';
import DisplayColumnSelector from './DisplayColumnSelector';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import { toCsv } from '../../../domain/services/export/csv';
import { MyAppResource } from '../MyContexts';

export type MyMenuStatusType = {
    menuItem1: boolean,
}
export type MenuType = {
    menuStatus: MyMenuStatusType,
    setMenuStatus: Dispatch<SetStateAction<MyMenuStatusType>>
}

const Header = (params: { table: Table<UnitEntity>, scrollType: MyAppResource['scrollType'] }) => {

    console.log('render Header.');

    const { table, scrollType } = params;
    const [menuStatus, setMenuStatus] = useState<MyMenuStatusType>({
        menuItem1: false,
    });
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

    return <>
        <HideOnScroll>
            <AppBar position={scrollType === 'window' ? 'fixed' : 'sticky'}>
                <Toolbar>
                    <TableMenu
                        menuStatus={menuStatus}
                        setMenuStatus={setMenuStatus}
                    />
                    <SearchBox table={table} />
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
            </AppBar>
        </HideOnScroll>
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
        <DisplayColumnSelector
            table={table}
            menuStatus={menuStatus}
            setMenuStatus={setMenuStatus}
        />
    </>;
};
export default Header;