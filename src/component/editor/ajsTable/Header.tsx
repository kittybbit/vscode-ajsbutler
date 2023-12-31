import React, { Dispatch, SetStateAction, useState } from 'react';
import { Alert, AppBar, IconButton, Snackbar, Stack, Toolbar, Tooltip } from '@mui/material';
import TableMenu from './TableMenu';
import SearchBox from './SearchBox';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import DisplayColumnSelector from './DisplayColumnSelector';
import { Table } from '@tanstack/table-core';
import { toCsv } from '../../../domain/services/export/csv';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';

export type MyMenuStatusType = {
    menuItem1: boolean,
}
export type MenuType = {
    menuStatus: MyMenuStatusType,
    setMenuStatus: Dispatch<SetStateAction<MyMenuStatusType>>
}

const Header = (params: { table: Table<UnitEntity> }) => {

    console.log('render Header.');

    const { table } = params;
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

    return <>
        <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
            </Toolbar>
        </AppBar>
        <DisplayColumnSelector
            table={table}
            menuStatus={menuStatus}
            setMenuStatus={setMenuStatus}
        />
    </>;
};
export default Header;