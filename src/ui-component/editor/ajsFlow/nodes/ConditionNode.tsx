import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Card, CardActions, CardHeader, Tooltip } from "@mui/material";
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Rc } from "../../../../domain/models/units/Rc";
import { ActionIcon, AjsNode, cardActionsSxProps, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import {
    handleClickChildOpen, handleClickDialogOpen,
    handleKeyDownChildOpen, handleKeyDownDialogOpen
} from "./Utils";

export type ConditionNode = Node<AjsNode<Rc>, 'condition'>;
type ConditionNodeProps = NodeProps<ConditionNode>;
const ConditionNode: FC<ConditionNodeProps> = ({ data }: ConditionNodeProps) => {

    console.log('render ConditionNode.');

    const { unitEntity, currentUnitEntity } = data;
    const myself = unitEntity === currentUnitEntity;

    return (
        <Card
            id={unitEntity.id}
            sx={cardSxProps}
            raised={myself}
        >
            {/* header */}
            <Tooltip title={unitEntity.cm?.value()} placement="top">
                <CardHeader
                    disableTypography
                    avatar={<GavelIcon fontSize="inherit" />}
                    title={unitEntity.name}
                    sx={cardHeaderSxProps}
                />
            </Tooltip>
            {/* action */}
            <CardActions
                disableSpacing
                sx={cardActionsSxProps}
            >
                <ActionIcon
                    title="View the unit definition."
                    ariaLabel="View the unit definition."
                    onClick={handleClickDialogOpen(data)}
                    onKeyDown={handleKeyDownDialogOpen(data)}
                    icon={<DescriptionIcon fontSize="inherit" />}
                />
                {!myself
                    && <ActionIcon
                        title="Open the condition."
                        ariaLabel="Open the condition."
                        onClick={handleClickChildOpen(data)}
                        onKeyDown={handleKeyDownChildOpen(data)}
                        icon={<FolderOpenIcon fontSize='inherit' />}
                    />}
            </CardActions>
        </Card>
    );
};

export default memo(ConditionNode);