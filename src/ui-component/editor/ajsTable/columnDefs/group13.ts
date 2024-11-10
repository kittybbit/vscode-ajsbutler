import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";

const group13 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group13', //Event job definition information
        header: ajsTableColumnHeader['group13'],
        columns: [
            {
                id: 'group13.col1',
                header: ajsTableColumnHeader['group13.col1'],
                accessorFn: defaultAccessorFn('tmitv'),
            },
            {
                id: 'group13.col2',
                header: ajsTableColumnHeader['group13.col2'],
                accessorFn: defaultAccessorFn('etn'),
            },
            {
                id: 'group13.col3',
                header: ajsTableColumnHeader['group13.col3'],
                accessorFn: defaultAccessorFn('flwf'),
            },
            columnHelper.group({
                id: 'group13.group1',
                header: ajsTableColumnHeader['group13.group1'],
                columns: [
                    {
                        id: 'group13.group1.col1',
                        header: ajsTableColumnHeader['group13.group1.col1'],
                        accessorFn: defaultAccessorFn('flwc'),
                    },
                    {
                        id: 'group13.group1.col2',
                        header: ajsTableColumnHeader['group13.group1.col2'],
                        accessorFn: defaultAccessorFn('flco'),
                    }
                ]
            }),
            {
                id: 'group13.col4',
                header: ajsTableColumnHeader['group13.col4'],
                accessorFn: defaultAccessorFn('flwi'),
            },
            {
                id: 'group13.col5',
                header: ajsTableColumnHeader['group13.col5'],
                accessorFn: defaultAccessorFn('evwid'),
            },
            {
                id: 'group13.col6',
                header: ajsTableColumnHeader['group13.col6'],
                accessorFn: defaultAccessorFn('evhst'),
            },
            {
                id: 'group13.col7',
                header: ajsTableColumnHeader['group13.col7'],
                accessorFn: defaultAccessorFn('evwms'),
            },
            {
                id: 'group13.col8',
                header: ajsTableColumnHeader['group13.col8'],
                accessorFn: defaultAccessorFn('ets'),
            }
        ]
    });
};

export default group13;