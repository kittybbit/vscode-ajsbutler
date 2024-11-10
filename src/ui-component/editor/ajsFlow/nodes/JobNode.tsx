import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { AjsNode, cardActionsSxProps, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import { handleClickDialogOpen, handleKeyDownDialogOpen } from "./Utils";

export type JobNode = Node<AjsNode, 'job'>;
type JobNodeProps = NodeProps<JobNode>;
const JobNode: FC<JobNodeProps> = (props) => {

    console.log('render JobNode.');

    const { unitEntity } = props.data;

    const hasWaitedFor = 'hasWaitedFor' in unitEntity && unitEntity.hasWaitedFor as boolean;

    return <>
        <Card
            id={unitEntity.id}
            sx={cardSxProps}
        >
            <Tooltip title={unitEntity.cm?.value()} placement="top">
                <CardHeader
                    disableTypography
                    sx={cardHeaderSxProps}
                    title={unitEntity.name}
                />
            </Tooltip>
            <CardActions
                disableSpacing
                sx={cardActionsSxProps}
            >
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
                {hasWaitedFor
                    && <Tooltip title='This job will wait for another unit.'>
                        <IconButton
                            aria-label='This job will wait for another unit.'
                            size='small'
                            disableRipple
                        >
                            <HourglassEmptyIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>
                }
            </CardActions>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </Card>
    </>;
};

export default memo(JobNode);