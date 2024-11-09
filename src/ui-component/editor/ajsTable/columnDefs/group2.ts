import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { box, defaultAccessorFn } from "./common";

const group2 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group2', //Unit common definition information
        header: ajsTableColumnHeader['group2'],
        columns: [
            {
                id: 'group2.col1',
                header: ajsTableColumnHeader['group2.col1'],
                accessorFn: row => row.cm,
            },
            {
                id: 'group2.col2',
                header: ajsTableColumnHeader['group2.col2'],
                accessorFn: row => {
                    const ar = row.previous;
                    return ar.map(v => v.f);
                },
                cell: props => props
                    .getValue<string[]>()
                    .map((v: string, i: number) => box(v, i)),
            },
            {
                id: 'group2.col3',
                header: ajsTableColumnHeader['group2.col3'],
                accessorFn: row => {
                    const ar = row.previous;
                    return ar.map(v => v.relationType);
                },
                cell: props => props
                    .getValue<string[]>()
                    .map((v: string, i: number) => box(v, i)),
            },
            {
                id: 'group2.col4',
                header: ajsTableColumnHeader['group2.col4'],
                accessorFn: defaultAccessorFn('ex'),
            },
            {
                id: 'group2.col5',
                header: ajsTableColumnHeader['group2.col5'],
                accessorFn: defaultAccessorFn('ncl'),
            },
            {
                id: 'group2.col6',
                header: ajsTableColumnHeader['group2.col6'],
                accessorFn: defaultAccessorFn('ncn'),
            },
            {
                id: 'group2.col7',
                header: ajsTableColumnHeader['group2.col7'],
                accessorFn: defaultAccessorFn('ncs'),
            },
            {
                id: 'group2.col8',
                header: ajsTableColumnHeader['group2.col8'],
                accessorFn: defaultAccessorFn('ncex'),
            },
            {
                id: 'group2.col9',
                header: ajsTableColumnHeader['group2.col9'],
                accessorFn: defaultAccessorFn('nchn'),
            },
            {
                id: 'group2.col10',
                header: ajsTableColumnHeader['group2.col10'],
                accessorFn: defaultAccessorFn('ncsv'),
            }
        ]
    });
};

export default group2;