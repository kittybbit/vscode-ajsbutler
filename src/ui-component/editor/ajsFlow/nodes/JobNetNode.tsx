import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { N } from "../../../../domain/models/units/N";
import { AjsNode, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import { handleClickChildOpen, handleClickDialogOpen, handleKeyDownChildOpen, handleKeyDownDialogOpen } from "./Utils";

export type JobNetNode = Node<AjsNode<N>, 'jobnet'>;
type JobNetNodeProps = NodeProps<JobNetNode>;
const JobNetNode: FC<JobNetNodeProps> = (props: JobNetNodeProps) => {

    console.log('render JobNetNode.');

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
                sx={cardHeaderSxProps}
                title={unitEntity.name}
            />
            <CardActions disableSpacing>
                <Tooltip title='View the unit definition.'>
                    <IconButton
                        aria-label="View the unit definition."
                        size='small'
                        onClick={handleClickDialogOpen(props.data)}
                        onKeyDown={handleKeyDownDialogOpen(props.data)}
                    >
                        <DescriptionIcon fontSize='inherit' />
                    </IconButton>
                </Tooltip>
                {!myself
                    && <Tooltip title='Open the jobnet.'>
                        <IconButton
                            aria-label="Open the jobnet."
                            size='small'
                            onClick={handleClickChildOpen(props.data)}
                            onKeyDown={handleKeyDownChildOpen(props.data)}
                        >
                            <FolderOpenIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>}
                {unitEntity.hasSchedule
                    && <Tooltip title='This job net has schedule.'>
                        <IconButton
                            aria-label='This job net has schedule.'
                            size='small'
                            disableRipple
                        >
                            <ScheduleIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>
                }
                {unitEntity.hasWaitedFor
                    && <Tooltip title='This jobnet will wait for another unit.'>
                        <IconButton
                            aria-label='This jobnet will wait for another unit.'
                            size='small'
                            disableRipple
                        >
                            <HourglassEmptyIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>
                }
            </CardActions>
            {unitEntity.isRootJobnet || myself
                ? undefined
                : <>
                    <Handle type="source" position={Position.Right} />
                    <Handle type="target" position={Position.Left} />
                </>
            }
        </Card>
    </>;
};

export default memo(JobNetNode);