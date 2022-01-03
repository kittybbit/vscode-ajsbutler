import React, { Dispatch, SetStateAction, useState } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import TableMenu from './TableMenu';
import SearchBox from './SearchBox';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import DisplayColumnSelector from './DisplayColumnSelector';
import { Table } from '@tanstack/table-core';

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

    return <>
        <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <TableMenu
                    menuStatus={menuStatus}
                    setMenuStatus={setMenuStatus}
                />
                <SearchBox table={table} />
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