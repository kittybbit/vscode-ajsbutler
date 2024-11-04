import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from '@resource/i18n/ajscolumn';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn, tyAccessorFn } from "./common";
import { Gty } from "../../../../domain/models/parameters/ParameterEntities";
import { Chip } from "@mui/material";

const group5 = (
    columnHelper: ColumnHelper<UnitEntity>,
    ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
    return columnHelper.group({
        id: 'group5', //Job group definition information
        header: ajsTableColumnHeader['group5'],
        columns: [
            {
                id: 'group5.col1',
                header: ajsTableColumnHeader['group5.col1'],
                accessorFn: tyAccessorFn(['g'], defaultAccessorFn('sdd')),
            },
            {
                id: 'group5.col2',
                header: ajsTableColumnHeader['group5.col2'],
                accessorFn: tyAccessorFn(['g'], defaultAccessorFn('md')),
            },
            {
                id: 'group5.col3',
                header: ajsTableColumnHeader['group5.col3'],
                accessorFn: tyAccessorFn(['g'], defaultAccessorFn('stt')),
            },
            {
                id: 'group5.col4',
                header: ajsTableColumnHeader['group5.col4'],
                accessorFn: tyAccessorFn(['g'], defaultAccessorFn('gty')),
                cell: param => {
                    const gty = param.getValue<Gty | undefined>();
                    if (gty === undefined) {
                        return undefined;
                    }
                    return gty.value() === 'n'
                        ? <Chip color='primary' label='Normal' />
                        : <Chip color='secondary' label='Planning' />;
                }
            }
        ]
    })
};

export default group5;