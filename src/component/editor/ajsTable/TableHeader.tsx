import { HeaderGroup } from '@tanstack/table-core';
import { UnitEntity } from '../../../domain/models/UnitEntities';
import { SxProps, TableCell, TableRow, TableSortLabel, Theme } from '@mui/material';
import React from 'react';
import { flexRender } from '@tanstack/react-table';

const styleTableCell: SxProps<Theme> = {
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
    '&:first-child': {
        position: 'sticky',
        left: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: (theme) => theme.palette.background.default,
    },
};

export const TableHeader = (props: { headerGroup: HeaderGroup<UnitEntity> }) => {

    console.log('render TableHeader.');

    const { headerGroup } = props;

    return <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(header => {
            const isPlaceholder = header.isPlaceholder;
            const isLeaf = header.subHeaders.length === 0;
            const canSort = header.column.columnDef.enableSorting || header.column.columnDef.enableMultiSort;
            let headerContent;
            if (isPlaceholder) {
                headerContent = undefined;
            } else if (!isLeaf || (isLeaf && !canSort)) {
                headerContent = flexRender(header.column.columnDef.header, header.getContext());
            } else if (isLeaf && canSort) {
                const isSorted = header.column.getIsSorted();
                if (isSorted) {
                    headerContent = <TableSortLabel
                        active={true}
                        direction={isSorted}
                        onClick={header.column.getToggleSortingHandler()}
                    >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableSortLabel>
                } else {
                    headerContent = <TableSortLabel
                        active={isSorted}
                        onClick={header.column.getToggleSortingHandler()}
                    >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableSortLabel>
                }
            }
            return <TableCell
                key={header.id}
                colSpan={header.colSpan}
                sx={styleTableCell}
            >
                {headerContent}
            </TableCell>
        })}
    </TableRow >
}