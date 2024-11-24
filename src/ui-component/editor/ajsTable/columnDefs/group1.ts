import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import * as ty from '@resource/i18n/ty';
import { Gty } from "../../../../domain/models/parameters";
import { defaultAccessorFn } from "./common";

const group1 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
    tyDefinition: typeof ty.en
): GroupColumnDef<UnitEntity, unknown> => columnHelper.group(
    {
        id: 'group1', //Unit definition information
        header: ajsTableColumnHeader['group1'],
        columns: [
            {
                id: 'group1.col1',
                header: ajsTableColumnHeader['group1.col1'],
                accessorFn: row => row.name,
            },
            {
                id: 'group1.col2',
                header: ajsTableColumnHeader['group1.col2'],
                accessorFn: row => row.parent ? row.parent.absolutePath : '/',
            },
            {
                id: 'group1.col3',
                header: ajsTableColumnHeader['group1.col3'],
                accessorFn: row => {
                    if (row.ty.value() === 'g') {
                        const gty = row.params<Gty>('gty')?.value();
                        return gty === 'p'
                            ? tyDefinition['g']['gty']['p']
                            : tyDefinition['g']['gty']['n'];
                    }
                    return tyDefinition[row.ty.value()].name
                },
            },
            {
                id: 'group1.col4',
                header: ajsTableColumnHeader['group1.col4'],
                accessorFn: defaultAccessorFn('cty'),
            },
            {
                id: 'group1.col5',
                header: ajsTableColumnHeader['group1.col5'],
                accessorFn: row => row.parent?.el?.find(v => v.name === row.name)?.hv,
            },
            {
                id: 'group1.col6',
                header: ajsTableColumnHeader['group1.col6'],
                accessorFn: row => row.sz,
            }
        ]
    });

export default group1;