import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";

const group15 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group15', //Job common attribute information
        header: ajsTableColumnHeader['group15'],
        columns: [
            {
                id: 'group15.col1',
                header: ajsTableColumnHeader['group15.col1'],
                accessorFn: defaultAccessorFn('eu'),
            },
            {
                id: 'group15.col2',
                header: ajsTableColumnHeader['group15.col2'],
                accessorFn: defaultAccessorFn('etm'),
            },
            {
                id: 'group15.col3',
                header: ajsTableColumnHeader['group15.col3'],
                accessorFn: defaultAccessorFn('fd'),
            },
            {
                id: 'group15.col4',
                header: ajsTableColumnHeader['group15.col4'],
                accessorFn: defaultAccessorFn('jty'),
            },
            columnHelper.group({
                id: 'group15.group1',
                header: ajsTableColumnHeader['group15.group1'],
                columns: [
                    {
                        id: 'group15.group1.col1',
                        header: ajsTableColumnHeader['group15.group1.col1'],
                        accessorFn: defaultAccessorFn('ts1'),
                    },
                    {
                        id: 'group15.group1.col2',
                        header: ajsTableColumnHeader['group15.group1.col2'],
                        accessorFn: defaultAccessorFn('td1'),
                    },
                    {
                        id: 'group15.group1.col3',
                        header: ajsTableColumnHeader['group15.group1.col3'],
                        accessorFn: defaultAccessorFn('top1'),
                    }
                ]
            }),
            columnHelper.group({
                id: 'group15.group2',
                header: ajsTableColumnHeader['group15.group2'],
                columns: [
                    {
                        id: 'group15.group2.col1',
                        header: ajsTableColumnHeader['group15.group2.col1'],
                        accessorFn: defaultAccessorFn('ts2'),
                    },
                    {
                        id: 'group15.group2.col2',
                        header: ajsTableColumnHeader['group15.group2.col2'],
                        accessorFn: defaultAccessorFn('td2'),
                    },
                    {
                        id: 'group15.group2.col3',
                        header: ajsTableColumnHeader['group15.group2.col3'],
                        accessorFn: defaultAccessorFn('top2'),
                    }
                ]
            }),
            columnHelper.group({
                id: 'group15.group3',
                header: ajsTableColumnHeader['group15.group3'],
                columns: [
                    {
                        id: 'group15.group3.col1',
                        header: ajsTableColumnHeader['group15.group3.col1'],
                        accessorFn: defaultAccessorFn('ts3'),
                    },
                    {
                        id: 'group15.group3.col2',
                        header: ajsTableColumnHeader['group15.group3.col2'],
                        accessorFn: defaultAccessorFn('td3'),
                    },
                    {
                        id: 'group15.group3.col3',
                        header: ajsTableColumnHeader['group15.group3.col3'],
                        accessorFn: defaultAccessorFn('top3'),
                    }
                ]
            }),
            columnHelper.group({
                id: 'group15.group4',
                header: ajsTableColumnHeader['group15.group4'],
                columns: [
                    {
                        id: 'group15.group4.col1',
                        header: ajsTableColumnHeader['group15.group4.col1'],
                        accessorFn: defaultAccessorFn('ts4'),
                    },
                    {
                        id: 'group15.group4.col2',
                        header: ajsTableColumnHeader['group15.group4.col2'],
                        accessorFn: defaultAccessorFn('td4'),
                    },
                    {
                        id: 'group15.group4.col3',
                        header: ajsTableColumnHeader['group15.group4.col3'],
                        accessorFn: defaultAccessorFn('top4'),
                    }
                ]
            })
        ]
    });
};

export default group15;