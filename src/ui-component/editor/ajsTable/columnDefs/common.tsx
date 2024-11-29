import React from 'react';
import { Box } from '@mui/material';
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { ParamSymbol, TySymbol } from "../../../../domain/values/AjsType";
import Parameter from '../../../../domain/models/parameters/Parameter';

type BoxType = Parameter | PrimitiveType;
export type AccessorType = BoxType | BoxType[];

/** accessorFn for cell method of tableDefaultColumnDef. */
export const defaultAccessorFn = <T extends AccessorType>(param: ParamSymbol) => {
    return (row: UnitEntity /*, index: number*/): T => {
        return row.params(param) as T;
    }
};

const defaultFn = (param: BoxType) => {
    if (param instanceof Parameter) {
        return param.value();
    }
    return new String(param).toString();
};

export const box = (param: BoxType, index: number = 0, fn: (param: BoxType) => string | undefined = defaultFn) => {
    // String
    if (!(param instanceof Parameter)) {
        return <Box
            key={index}
            data-param={undefined}
            data-raw={param}
            data-inherited={false}
            data-defalut={false}
        >
            {fn(param)}
        </Box>
    }
    // Parameter
    return <Box
        key={index}
        data-param={param.parameter}
        data-raw={param.rawValue}
        data-inherited={param.inherited}
        data-defalut={param.isDefault}
        sx={
            () => {
                if (param.isDefault || param.inherited) {
                    return { color: 'text.disabled' }
                }
                return {}
            }
        }
    >
        {fn(param)}
    </Box>
};

/** When ty matches, invoke accessorFn. */
export const tyAccessorFn = <T extends AccessorType>(targetTy: TySymbol[], accessorFn: (row: UnitEntity, index: number) => T) => {
    return (row: UnitEntity, index: number): T => {
        return targetTy.includes(row.ty.value())
            ? accessorFn(row, index)
            : undefined as T;
    }
};