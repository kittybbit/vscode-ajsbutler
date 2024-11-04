import { SxProps, Theme } from "@mui/material";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { CurrentUnitEntityStateType, DialogDataStateType } from "../FlowContents";

export type AjsNode<T extends UnitEntity = UnitEntity> = {
    unitEntity: T,
}
    & DialogDataStateType
    & CurrentUnitEntityStateType
    & Record<string, unknown>;


export const cardSxProps: SxProps<Theme> = {
    width: '15rem',
};

export const cardHeaderSxProps: SxProps<Theme> = {
    height: '1em',
    paddingTop: '0em',
    paddingBottom: '0em',
};
