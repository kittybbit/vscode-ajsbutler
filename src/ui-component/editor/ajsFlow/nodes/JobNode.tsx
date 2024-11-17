import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Card, CardActions, CardHeader, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { ActionIcon, AjsNode, cardActionsSxProps, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import { handleClickDialogOpen, handleKeyDownDialogOpen } from "./Utils";

export type JobNode = Node<AjsNode, 'job'>;
type JobNodeProps = NodeProps<JobNode>;
const JobNode: FC<JobNodeProps> = ({ data }: JobNodeProps) => {

    console.log('render JobNode.');

    const { unitEntity } = data;

    const hasWaitedFor = 'hasWaitedFor' in unitEntity && unitEntity.hasWaitedFor as boolean;

    return (
        <Card
            id={unitEntity.id}
            sx={cardSxProps}
        >
            {/* header */}
            <Tooltip title={unitEntity.cm?.value()} placement="top">
                <CardHeader
                    disableTypography
                    sx={cardHeaderSxProps}
                    title={unitEntity.name}
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
                {hasWaitedFor
                    && <ActionIcon
                        title="This job will wait for another unit."
                        ariaLabel="This job will wait for another unit."
                        icon={<HourglassEmptyIcon fontSize='inherit' />}
                    />}
            </CardActions>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </Card>
    );
};

export default memo(JobNode);