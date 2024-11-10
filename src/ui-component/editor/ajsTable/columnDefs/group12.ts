import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";

const group12 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group12', //Judgment job definition information
        header: ajsTableColumnHeader['group12'],
        columns: [
            {
                id: 'group12.col1',
                header: ajsTableColumnHeader['group12.col1'],
                accessorFn: defaultAccessorFn('ej'),
            },
            columnHelper.group({
                id: 'group12.group1',
                header: ajsTableColumnHeader['group12.group1'],
                columns: [
                    {
                        id: 'group12.group1.col1',
                        header: ajsTableColumnHeader['group12.group1.col1'],
                        accessorFn: defaultAccessorFn('ejc'),
                    },
                    {
                        id: 'group12.group1.col2',
                        header: ajsTableColumnHeader['group12.group1.col2'],
                        accessorFn: defaultAccessorFn('ejl'),
                    },
                    {
                        id: 'group12.group1.col3',
                        header: ajsTableColumnHeader['group12.group1.col3'],
                        accessorFn: defaultAccessorFn('ejs'),
                    },
                    {
                        id: 'group12.group1.col4',
                        header: ajsTableColumnHeader['group12.group1.col4'],
                        accessorFn: defaultAccessorFn('ejm'),
                    },
                    {
                        id: 'group12.group1.col5',
                        header: ajsTableColumnHeader['group12.group1.col5'],
                        accessorFn: defaultAccessorFn('ejh'),
                    },
                    {
                        id: 'group12.group1.col6',
                        header: ajsTableColumnHeader['group12.group1.col6'],
                        accessorFn: defaultAccessorFn('ejg'),
                    },
                    {
                        id: 'group12.group1.col7',
                        header: ajsTableColumnHeader['group12.group1.col7'],
                        accessorFn: defaultAccessorFn('eju'),
                    },
                    {
                        id: 'group12.group1.col8',
                        header: ajsTableColumnHeader['group12.group1.col8'],
                        accessorFn: defaultAccessorFn('ejt'),
                    },
                    {
                        id: 'group12.group1.col9',
                        header: ajsTableColumnHeader['group12.group1.col9'],
                        accessorFn: defaultAccessorFn('eji'),
                    }
                ]
            }),
            {
                id: 'group12.col2',
                header: ajsTableColumnHeader['group12.col2'],
                accessorFn: defaultAccessorFn('ejv'),
            },
            {
                id: 'group12.col3',
                header: ajsTableColumnHeader['group12.col3'],
                accessorFn: defaultAccessorFn('ejf'),
            }
        ]
    });
};

export default group12;