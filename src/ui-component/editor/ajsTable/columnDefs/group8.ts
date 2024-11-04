import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn, tyAccessorFn } from "./common";

const grouup8 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group8', //Jobnet connector definition information
        header: ajsTableColumnHeader['group8'],
        columns: [
            {
                id: 'group8.col1',
                header: ajsTableColumnHeader['group8.col1'],
                accessorFn: tyAccessorFn(['nc'], defaultAccessorFn('ncr')),
            }
        ]
    });
};

export default grouup8;