import React, { KeyboardEvent } from 'react';
import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import { SxProps, Table, TableBody, TableCell, TableHead, TableRow, Theme, Toolbar } from '@mui/material';
import { TableHeader } from './TableHeader';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import { useUnitEntityDialog } from './UnitEntityDialog';

const StaticTable = (props: { table: ReactTable<UnitEntity> }) => {

    console.log('render StaticTable.');

    const { table } = props;

    // control dialog
    const { setDialogData, UnitEntityDialog } = useUnitEntityDialog();
    const handleClickOpen = (unitEntity: UnitEntity) => () => {
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

    return <>
        <Toolbar />

        <Table size='small' >
            <TableHead sx={{ backgroundColor: (theme) => theme.palette.background.default }}>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
                ))}
            </TableHead>
            <TableBody>
                {table.getRowModel().rows.map(row => {
                    return <TableRow
                        key={row.id}
                        hover={true}
                        onDoubleClick={handleClickOpen(row.original)}
                        onKeyDown={handleKeyDown(row.original)}
                    >
                        {row.getVisibleCells().map(cell => {
                            return (
                                <TableCell key={cell.id} sx={styleTableCell}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                })}
            </TableBody>
        </Table>
        <UnitEntityDialog />
    </>;
};
export default StaticTable;