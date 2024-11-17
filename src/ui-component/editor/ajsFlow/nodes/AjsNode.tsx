import React, { FC } from "react";
import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";
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
    paddingTop: '0.25em',
    paddingBottom: '0em',
};

export const cardActionsSxProps: SxProps<Theme> = {
    paddingTop: '0.25em',
    paddingBottom: '0em',
};

export const ActionIcon: FC<{
    title: string;
    ariaLabel: string;
    onClick?: () => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
    icon: React.ReactNode;
    disableRipple?: boolean;
}> = ({ title, ariaLabel, onClick, onKeyDown, icon, disableRipple = false }) => (
    <Tooltip title={title}>
        <IconButton
            aria-label={ariaLabel}
            size="small"
            onClick={onClick}
            onKeyDown={onKeyDown}
            disableRipple={disableRipple}
        >
            {icon}
        </IconButton>
    </Tooltip>
);