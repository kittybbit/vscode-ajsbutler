import React, { useEffect, useMemo, useState } from 'react';
import { useReactTable } from '@tanstack/react-table';
import { FilterMeta, Row, SortingState, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';
import { AccessorType, tableColumnDef, tableDefaultColumnDef } from './tableColumnDef';
import { useMyAppContext } from '../MyContexts';
import { UnitEntity, tyFactory } from '../../../domain/models/UnitEntities';
import VirtualizedTable from './VirtualizedTable';
import { CssBaseline, Stack, ThemeProvider, Typography, createTheme } from '@mui/material';
import Header from './Header';
import { parse } from 'flatted';
import { Unit } from '../../../domain/values/Unit';
import StaticTable from './StaticTable';
import { toCsv } from '../../../domain/services/export/csv';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Parameter } from '../../../domain/models/ParameterEntities';

const TableContents = () => {

    console.log('render TableContents.');

    const { isDarkMode, lang, tableType } = useMyAppContext();

    const [unitEntities, setUnitEntities] = useState<UnitEntity[]>();
    const fn = (type: string, data: unknown) => {
        const newUnitEntities: UnitEntity[] = parse(data as string)
            .map((rootUnitOfJSON: Unit) => Unit.createFromJSON(rootUnitOfJSON)) // all unit in root unit.
            .flat()
            .map((unit: Unit) => tyFactory(unit));
        setUnitEntities(() => newUnitEntities);
    };
    useEffect(() => {
        window.EventBridge.addCallback('changeDocument', fn);
        window.vscode.postMessage({ type: 'ready' });
        return () => {
            window.EventBridge.removeCallback('changeDocument', fn);
        }
    }, []); // fire this when mount.


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
            <Header
                table={table}
            />
            {
                tableType === 'virtual'
                    ? <VirtualizedTable table={table} />
                    : <StaticTable table={table} />
            }
            <Stack direction='row' justifyContent='flex-end' spacing={2}>
                <Typography>{table.getRowModel().rows.length} of {unitEntities?.length}</Typography>
            </Stack>
        </ThemeProvider>
        {DEVELOPMENT && <pre>{JSON.stringify(table.getState(), null, 2)}</pre>}
        {DEVELOPMENT && <pre>{toCsv(table)}</pre>}
    </>;
};
export default TableContents;