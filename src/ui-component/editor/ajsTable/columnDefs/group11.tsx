import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";
import { Rating } from "@mui/material";
import { J, Rj, Pj, Rp } from "../../../../domain/models/units/J";
import { Qj } from "../../../../domain/models/units/Qj";

const group11 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group11', //Basic job definition information
        header: ajsTableColumnHeader['group11'],
        columns: [
            {
                id: 'group11.col1',
                header: ajsTableColumnHeader['group11.col1'],
                accessorFn: defaultAccessorFn('te'),
            },
            {
                id: 'group11.col2',
                header: ajsTableColumnHeader['group11.col2'],
                accessorFn: defaultAccessorFn('sc'),
            },
            {
                id: 'group11.col3',
                header: ajsTableColumnHeader['group11.col3'],
                accessorFn: defaultAccessorFn('prm'),
            },
            {
                id: 'group11.col4',
                header: ajsTableColumnHeader['group11.col4'],
                accessorFn: defaultAccessorFn('env'),
            },
            {
                id: 'group11.col5',
                header: ajsTableColumnHeader['group11.col5'],
                accessorFn: defaultAccessorFn('ev'),
            },
            {
                id: 'group11.col6',
                header: ajsTableColumnHeader['group11.col6'],
                accessorFn: defaultAccessorFn('wkp'),
            },
            {
                id: 'group11.col7',
                header: ajsTableColumnHeader['group11.col7'],
                accessorFn: defaultAccessorFn('si'),
            },
            columnHelper.group({
                id: 'group11.group1',
                header: ajsTableColumnHeader['group11.group1'],
                columns: [
                    {
                        id: 'group11.group1.col1',
                        header: ajsTableColumnHeader['group11.group1.col1'],
                        accessorFn: defaultAccessorFn('so'),
                    },
                    {
                        id: 'group11.group1.col2',
                        header: ajsTableColumnHeader['group11.group1.col2'],
                        accessorFn: defaultAccessorFn('soa'),
                    }
                ]
            }),
            columnHelper.group({
                id: 'group11.group2',
                header: ajsTableColumnHeader['group11.group2'],
                columns: [
                    {
                        id: 'group11.group2.col1',
                        header: ajsTableColumnHeader['group11.group2.col1'],
                        accessorFn: defaultAccessorFn('se'),
                    },
                    {
                        id: 'group11.group2.col2',
                        header: ajsTableColumnHeader['group11.group2.col2'],
                        accessorFn: defaultAccessorFn('sea'),
                    }
                ]
            }),
            {
                id: 'group11.col8',
                header: ajsTableColumnHeader['group11.col8'],
                accessorFn: defaultAccessorFn('qm'),
            },
            {
                id: 'group11.col9',
                header: ajsTableColumnHeader['group11.col9'],
                accessorFn: defaultAccessorFn('qu'),
            },
            {
                id: 'group11.col10',
                header: ajsTableColumnHeader['group11.col10'],
                accessorFn: defaultAccessorFn('req'),
            },
            {
                id: 'group11.col11',
                header: ajsTableColumnHeader['group11.col11'],
                accessorFn: row => {
                    return ['j', 'rj', 'pj', 'qj'].some(v => v === row.ty.value())
                        ? (row as J | Rj | Pj | Rp | Qj).priority
                        : undefined;
                },
                cell: props => {
                    const priority = props.getValue<number | undefined>();
                    return priority
                        ? <Rating value={priority} size='small' sx={{ position: 'inherit' }} readOnly />
                        : undefined;
                }
            },
            columnHelper.group({
                id: 'group11.group3',
                header: ajsTableColumnHeader['group11.group3'],
                columns: [
                    {
                        id: 'group11.group3.col1',
                        header: ajsTableColumnHeader['group11.group3.col1'],
                        accessorFn: defaultAccessorFn('jd'),
                    },
                    {
                        id: 'group11.group3.col2',
                        header: ajsTableColumnHeader['group11.group3.col2'],
                        accessorFn: defaultAccessorFn('wth'),
                    },
                    {
                        id: 'group11.group3.col3',
                        header: ajsTableColumnHeader['group11.group3.col3'],
                        accessorFn: defaultAccessorFn('tho'),
                    },
                    {
                        id: 'group11.group3.col4',
                        header: ajsTableColumnHeader['group11.group3.col4'],
                        accessorFn: defaultAccessorFn('jdf'),
                    }
                ]
            }),
            {
                id: 'group11.col12',
                header: ajsTableColumnHeader['group11.col12'],
                accessorFn: defaultAccessorFn('abr'),
            },
            columnHelper.group({
                id: 'group11.group4',
                header: ajsTableColumnHeader['group11.group4'],
                columns: [
                    {
                        id: 'group11.group4.col1',
                        header: ajsTableColumnHeader['group11.group4.col1'],
                        accessorFn: defaultAccessorFn('rjs'),
                    },
                    {
                        id: 'group11.group4.col2',
                        header: ajsTableColumnHeader['group11.group4.col2'],
                        accessorFn: defaultAccessorFn('rje'),
                    }
                ]
            }),
            {
                id: 'group11.col13',
                header: ajsTableColumnHeader['group11.col13'],
                accessorFn: defaultAccessorFn('rec'),
            },
            {
                id: 'group11.col14',
                header: ajsTableColumnHeader['group11.col14'],
                accessorFn: defaultAccessorFn('rei'),
            },
            {
                id: 'group11.col15',
                header: ajsTableColumnHeader['group11.col15'],
                accessorFn: defaultAccessorFn('un'),
            }
        ]
    });
};

export default group11;