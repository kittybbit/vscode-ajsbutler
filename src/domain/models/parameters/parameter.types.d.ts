import { ParamSymbol } from '../../values/AjsType';
import { UnitEntity } from '../units/UnitEntity';

export type ParamBase = {
    'unit': UnitEntity;
    'parameter': ParamSymbol;
};

export type ParamInternal = ParamBase
    & {
        'inherited': boolean; // whether inherited or not
        'rawValue'?: string; // actual value
        'defaultRawValue'?: string; // default value
        'position': number; // defined position
    };