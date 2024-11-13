// import * as vscode from 'vscode';
import React, { Dispatch, SetStateAction } from 'react';
import { CellContext, createColumnHelper } from '@tanstack/table-core';
import { IconButton, Tooltip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { UnitEntity } from '../../../domain/models/units/UnitEntities';
import { ajsTableColumnHeaderLang, paramDefinitionLang, tyDefinitionLang } from '../../../domain/services/i18n/nls';
import { AccessorType, box } from './columnDefs/common';
import group1 from './columnDefs/group1';
import group2 from './columnDefs/group2';
import group3 from './columnDefs/group3';
import group4 from './columnDefs/group4';
import group5 from './columnDefs/group5';
import group6 from './columnDefs/group6';
import group7 from './columnDefs/group7';
import group8 from './columnDefs/group8';
import group9 from './columnDefs/group9';
import group10 from './columnDefs/group10';
import group11 from './columnDefs/group11';
import group12 from './columnDefs/group12';
import group13 from './columnDefs/group13';
import group14 from './columnDefs/group14';
import group15 from './columnDefs/group15';
import group16 from './columnDefs/group16';
import group17 from './columnDefs/group17';
import group18 from './columnDefs/group18';
import group19 from './columnDefs/group19';
import group20 from './columnDefs/group20';

// default setting of 
export const tableDefaultColumnDef = {
    enableHiding: true,
    enableSorting: true,
    cell: (props: CellContext<UnitEntity, unknown>) => {
        const param = props.getValue<AccessorType>();
        // undefined
        if (param === undefined) {
            return undefined;
        }
        if (Array.isArray(param)) {
            return <>{param.map((v, i) => box(v, i))}</>;
        }
        return box(param);
    },
};

export const tableColumnDef = (language: string | undefined = 'en', setDialogData: Dispatch<SetStateAction<UnitEntity | undefined>>) => {

    // column titles
    const ajsTableColumnHeader = ajsTableColumnHeaderLang(language);
    // tyDefinition
    const tyDefinition = tyDefinitionLang(language);
    // paramter
    const paramDefinition = paramDefinitionLang(language);

    const columnHelper = createColumnHelper<UnitEntity>();

    return [
        columnHelper.display({
            id: '#',
            header: '#',
            cell: props => <>
                <span id={props.row.original.id} tabIndex={0}>{props.row.index + 1}</span>
                <Tooltip title='View the unit definition'>
                    <IconButton
                        size='small'
                        aria-label='View the unit definition'
                        onClick={
                            () => setDialogData(props.row.original)
                        }
                    >
                        <DescriptionIcon fontSize='inherit' />
                    </IconButton>
                </Tooltip>
            </>,
            enableHiding: false,
            enableSorting: false,
            enableGlobalFilter: false,
        }),
        group1(columnHelper, ajsTableColumnHeader, tyDefinition),
        group2(columnHelper, ajsTableColumnHeader),
        group3(columnHelper, ajsTableColumnHeader),
        group4(columnHelper, ajsTableColumnHeader),
        group5(columnHelper, ajsTableColumnHeader),
        group6(columnHelper, ajsTableColumnHeader),
        group7(columnHelper, ajsTableColumnHeader),
        group8(columnHelper, ajsTableColumnHeader),
        group9(columnHelper, ajsTableColumnHeader),
        group10(columnHelper, ajsTableColumnHeader, paramDefinition),
        group11(columnHelper, ajsTableColumnHeader),
        group12(columnHelper, ajsTableColumnHeader),
        group13(columnHelper, ajsTableColumnHeader),
        group14(columnHelper, ajsTableColumnHeader),
        group15(columnHelper, ajsTableColumnHeader),
        group16(columnHelper, ajsTableColumnHeader),
        group17(columnHelper, ajsTableColumnHeader),
        group18(columnHelper, ajsTableColumnHeader),
        group19(columnHelper, ajsTableColumnHeader),
        group20(columnHelper, ajsTableColumnHeader),
    ]
};