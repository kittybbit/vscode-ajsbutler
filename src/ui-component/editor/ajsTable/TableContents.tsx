import React, { useEffect, useMemo, useState } from 'react';
import { CssBaseline, Stack, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useReactTable } from '@tanstack/react-table';
import { FilterMeta, Row, SortingState, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';
import { rankItem } from '@tanstack/match-sorter-utils';
import { parse } from 'flatted';
import { useMyAppContext } from '../MyContexts';
import { AccessorType, tableColumnDef, tableDefaultColumnDef } from './tableColumnDef';
import Header from './Header';
import VirtualizedTable from './VirtualizedTable';
import { Unit } from '../../../domain/values/Unit';
import { UnitEntity, tyFactory } from '../../../domain/models/UnitEntities';
import { Parameter } from '../../../domain/models/ParameterEntities';

const ajsGlobalFilterFn = (row: Row<UnitEntity>, columnId: string, value: string, addMeta: (meta: FilterMeta) => void) => {

    const cellValue = row.getValue<AccessorType>(columnId);
    if (cellValue === undefined) {
        return false;
    }

    const targetValue: AccessorType = Array.isArray(cellValue) ? cellValue : [cellValue];

    // Rank the item
    const itemRank = targetValue
        .map(v => {
            if (v && v instanceof Parameter) {
                return v.value();
            }
            if (v && typeof v === 'string') {
                return v;
            }
            return (new String(v)).toString();
        })
        .map(v => rankItem(v, value))
        .find(v => v.passed);
    if (itemRank === undefined) {
        return false;
    }

    // Store the ranking info
    addMeta(itemRank)

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

const TableContents = () => {

    console.log('render TableContents.');

    const { isDarkMode, lang, scrollType } = useMyAppContext();

    const [unitEntities, setUnitEntities] = useState<UnitEntity[]>();
    const changeDodumentFn = (type: string, data: unknown) => {
        try {
            const newUnitEntities: UnitEntity[] = parse(data as string)
                .map((rootUnitOfJSON: Unit) => Unit.createFromJSON(rootUnitOfJSON)) // all unit in root unit.
                .flat()
                .map((unit: Unit) => tyFactory(unit));
            setUnitEntities(() => newUnitEntities);
        } catch {
            setUnitEntities(() => []);
        }
    };
    useEffect(() => {
        window.EventBridge.addCallback('changeDocument', changeDodumentFn);
        window.vscode.postMessage({ type: 'ready' });
        return () => {
            window.EventBridge.removeCallback('changeDocument', changeDodumentFn);
        }
    }, []); // fire this when mount.

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable<UnitEntity>({
        columns: useMemo(() => tableColumnDef(lang), [lang]),
        data: useMemo(() => unitEntities ?? [], [unitEntities]),
        state: {
            globalFilter: globalFilter,
            sorting: sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: ajsGlobalFilterFn,
        getColumnCanGlobalFilter: () => true, // return true for all column
        defaultColumn: tableDefaultColumnDef,
        debugAll: DEVELOPMENT,
    });

    const theme = useMemo(() => createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light'
        }
    }), [isDarkMode]);

    return <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header table={table} scrollType={scrollType} />
            <VirtualizedTable table={table} scrollType={scrollType} />
            <Stack direction='row' justifyContent='flex-end' spacing={2}>
                <Typography>{table.getRowModel().rows.length} of {unitEntities?.length}</Typography>
            </Stack>
        </ThemeProvider>
        {DEVELOPMENT && <pre>{JSON.stringify(table.getState(), null, 2)}</pre>}
    </>;
};
export default TableContents;