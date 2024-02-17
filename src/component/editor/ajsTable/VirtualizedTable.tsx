import React, { KeyboardEvent, useMemo } from 'react';
import { flexRender, Table as ReactTable, Row } from '@tanstack/react-table';
import { ItemProps, TableVirtuoso } from 'react-virtuoso';
import { Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Toolbar } from '@mui/material';
import { TableHeader } from './TableHeader';
import { useUnitEntityDialog } from './UnitEntityDialog';
import { UnitEntity } from '../../../domain/models/UnitEntities';

const VirtualizedTable = (props: { table: ReactTable<UnitEntity> }) => {

    console.log('render VirtualizedTable.');

    const { table } = props;
    const rows = table.getRowModel().rows;
    const headerGroups = table.getHeaderGroups();

    // control dialog
    const { setDialogData, UnitEntityDialog } = useUnitEntityDialog();
    const handleClickDialogOpen = (unitEntity: UnitEntity) => () => {
        setDialogData(unitEntity);
    };
    const handleKeyDown = (unitEntity: UnitEntity) => (event: KeyboardEvent<HTMLTableRowElement>) => {
        event.key === 'Enter' && setDialogData(unitEntity);
    };

    const styleTableCell: SxProps<Theme> = {
        whiteSpace: 'nowrap',
        verticalAlign: 'top',
        '&:first-child': {
            position: 'sticky',
            left: 0,
            backgroundColor: (theme) => theme.palette.background.default,
        }
    };

    const tableComponents = {
        Scroller: React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
            return <TableContainer
                {...props}
                ref={ref}
                component={Paper}
                elevation={3}
            />
        }),
        Table: (props: object) => <Table
            {...props}
            size='small'
            stickyHeader
        />,
        TableHead: React.forwardRef<HTMLTableSectionElement>(function tableHead(props, ref) {
            return <TableHead
                {...props}
                ref={ref}
                sx={{ position: 'sticky', top: 0, backgroundColor: (theme) => theme.palette.background.default, zIndex: (theme) => theme.zIndex.appBar }}
            />
        }),
        TableRow: (props: ItemProps<Row<UnitEntity>>) => <TableRow
            {...props}
            hover={true}
            onDoubleClick={handleClickDialogOpen(props.item.original)}
            onKeyDown={handleKeyDown(props.item.original)}
        />,
        TableBody: React.forwardRef<HTMLTableSectionElement>(function tableBody(props, ref) {
            return <TableBody
                {...props}
                ref={ref}
            />
        }),
    };

    return <>
        <Toolbar />
        {useMemo(() => <TableVirtuoso
            style={{
                height: 'calc(100vh - 100px)',
                maxHeight: 'calc(100vh - 100px)',
                overflow: 'scroll',
            }}
            data={rows}
            components={tableComponents}
            fixedHeaderContent={
                () => headerGroups
                    .map(headerGroup =>
                        <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
                    )
            }
            itemContent={
                (index, data) => {
                    const row = data;
                    return row.getVisibleCells().map(cell => {
                        return <TableCell key={cell.id} sx={styleTableCell}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    })
                }
            }
        />, [table.getState()])}
        <UnitEntityDialog />
    </>
};
export default VirtualizedTable;