import React from 'react';
import { HeaderGroup } from '@tanstack/table-core';
import { flexRender } from '@tanstack/react-table';
import { SxProps, TableCell, TableRow, TableSortLabel, Theme } from '@mui/material';
import { UnitEntity } from '../../../domain/models/UnitEntities';

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
            const headerTitle = flexRender(header.column.columnDef.header, header.getContext());
            let headerContent;
            if (isPlaceholder) {
                headerContent = undefined;
            } else if (!isLeaf || (isLeaf && !canSort)) {
                headerContent = headerTitle;
            } else if (isLeaf && canSort) {
                const isSorted = header.column.getIsSorted();
                headerContent = <TableSortLabel
                    active={isSorted === false ? false : true}
                    direction={isSorted !== false ? isSorted : undefined}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                        '&:focus-visible': { outline: '-webkit-focus-ring-color auto 1px' }
                    }}
                >
                    {headerTitle}
                </TableSortLabel>
            }
            return <TableCell
                key={header.id}
                colSpan={header.colSpan}
                sx={styleTableCell}
            >
                {headerContent}
            </TableCell>
        })}
    </TableRow>
}