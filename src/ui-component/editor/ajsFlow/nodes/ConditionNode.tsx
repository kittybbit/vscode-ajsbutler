import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Rc } from "../../../../domain/models/units/Rc";
import { AjsNode, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import { handleClickChildOpen, handleClickDialogOpen, handleKeyDownChildOpen, handleKeyDownDialogOpen } from "./Utils";

export type ConditionNode = Node<AjsNode<Rc>, 'condition'>;
type ConditionNodeProps = NodeProps<ConditionNode>;
const ConditionNode: FC<ConditionNodeProps> = (props: ConditionNodeProps) => {

    console.log('render ConditionNode.');

    const { unitEntity, currentUnitEntity } = props.data;
    const myself = unitEntity === currentUnitEntity;

    return <>
        <Card
            id={unitEntity.id}
            sx={cardSxProps}
            raised={myself}
        >
            <CardHeader
                disableTypography
                avatar={<GavelIcon fontSize="inherit" />}
                title={unitEntity.name}
                sx={cardHeaderSxProps}
            />
            <CardActions disableSpacing>
                <Tooltip title='View the unit definition'>
                    <IconButton
                        aria-label="View the unit definition"
                        size='small'
                        onClick={handleClickDialogOpen(props.data)}
                        onKeyDown={handleKeyDownDialogOpen(props.data)}
                    >
                        <DescriptionIcon fontSize='inherit' />
                    </IconButton>
                </Tooltip>
                {!myself
                    && <Tooltip title='Open the condition.'>
                        <IconButton
                            aria-label="Open the condition."
                            size='small'
                            onClick={handleClickChildOpen(props.data)}
                            onKeyDown={handleKeyDownChildOpen(props.data)}
                        >
                            <FolderOpenIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>}
            </CardActions>
        </Card>
    </>;
};

export default memo(ConditionNode);