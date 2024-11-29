import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { Prm } from "../../../../domain/models/parameters";

const group17 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group17', //Tool unit definition information
        header: ajsTableColumnHeader['group17'],
        columns: [
            columnHelper.group({
                id: 'group17.group1',
                header: ajsTableColumnHeader['group17.group1'],
                columns: [
                    {
                        id: 'group17.group1.col1',
                        header: ajsTableColumnHeader['group17.group1.col1'],
                        accessorFn: row => ['cpj', 'rcpj'].includes(row.ty.value()) ? row.params<Prm>('prm') : undefined,
                    },
                    {
                        id: 'group17.group1.col2',
                        header: ajsTableColumnHeader['group17.group1.col2'],
                        accessorFn: row => ['cpj', 'rcpj'].includes(row.ty.value()) ? row.params('env') : undefined,
                    }
                ]
            })
        ]
    });
};

export default group17;