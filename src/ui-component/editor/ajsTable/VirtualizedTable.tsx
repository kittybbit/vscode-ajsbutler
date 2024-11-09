import React, { FC, memo } from 'react';
import { flexRender, HeaderGroup, Row } from '@tanstack/react-table';
import { ItemProps, TableVirtuoso } from 'react-virtuoso';
import { Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, useTheme } from '@mui/material';
import TableHeader from './TableHeader';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import { MyAppResource } from '../MyContexts';

type VirtualizedTableProps = {
    rows: Row<UnitEntity>[],
    headerGroups: HeaderGroup<UnitEntity>[],
    scrollType: MyAppResource['scrollType'],
};

const VirtualizedTable: FC<VirtualizedTableProps> = ({ rows, headerGroups, scrollType }) => {

    console.log('render VirtualizedTable.');

    const styleTableCell: SxProps<Theme> = {
        whiteSpace: 'nowrap',
        verticalAlign: 'top',
        '&:first-child': {
            position: 'sticky',
            left: 0,
        }
    };
    const theme = useTheme();

    const tableComponents = {
        Scroller: scrollType === 'table'
            ? React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
                return <TableContainer
                    {...props}
                    ref={ref}
                    component={Paper}
                    elevation={3}
                />
            })
            : React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
                return <TableContainer
                    {...props}
                    ref={ref}
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
                sx={{
                    zIndex: (theme) => theme.zIndex.appBar,
                }}
            />
        }),
        TableRow: (props: ItemProps<Row<UnitEntity>>) => <TableRow
            {...props}
            hover={true}
        />,
        TableBody: React.forwardRef<HTMLTableSectionElement>(function tableBody(props, ref) {
            return <TableBody
                {...props}
                ref={ref}
            />
        }),
    };

    const toolbarHeight = theme.mixins.toolbar.minHeight;
    return (
        <>
            <TableVirtuoso
                style={
                    scrollType === 'table'
                        ? {
                            width: `calc(100vw - 2em)`,
                            height: `calc(100vh - ${toolbarHeight}px - 2em)`,
                            maxHeight: `calc(100vh - ${toolbarHeight}px - 2em)`,
                        }
                        : {
                            width: `calc(100vw - 2em)`,
                            height: 'auto',
                            maxHeight: 'none',
                            overflow: 'visible',
                        }
                }
                useWindowScroll={scrollType === 'window'}
                data={rows}
                components={tableComponents}
                fixedHeaderContent={
                    () => headerGroups
                        .map(headerGroup =>
                            <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
                        )
                }
                itemContent={
                    (index: number, data: Row<UnitEntity>) => {
                        const row = data;
                        return row.getVisibleCells().map(cell => {
                            return <TableCell key={cell.id} sx={styleTableCell}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        })
                    }
                }
            />
        </>
    );
};
export default memo(VirtualizedTable);