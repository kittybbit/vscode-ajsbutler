import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Card, CardActions, CardHeader, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { N } from "../../../../domain/models/units/N";
import { ActionIcon, AjsNode, cardActionsSxProps, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import {
    handleClickChildOpen, handleClickDialogOpen,
    handleKeyDownChildOpen, handleKeyDownDialogOpen
} from "./Utils";

export type JobNetNode = Node<AjsNode<N>, "jobnet">;
type JobNetNodeProps = NodeProps<JobNetNode>;

const JobNetNode: FC<JobNetNodeProps> = ({ data }: JobNetNodeProps) => {
    console.log("render JobNetNode.");

    const { unitEntity, currentUnitEntity } = data;
    const isCurrentUnit = unitEntity === currentUnitEntity;

    return (
        <Card id={unitEntity.id} sx={cardSxProps} raised={isCurrentUnit}>
            {/* header */}
            <Tooltip title={unitEntity.cm?.value()} placement="top">
                <CardHeader disableTypography sx={cardHeaderSxProps} title={unitEntity.name} />
            </Tooltip>
            {/* action */}
            <CardActions disableSpacing sx={cardActionsSxProps}>
                <ActionIcon
                    title="View the unit definition."
                    ariaLabel="View the unit definition."
                    onClick={handleClickDialogOpen(data)}
                    onKeyDown={handleKeyDownDialogOpen(data)}
                    icon={<DescriptionIcon fontSize="inherit" />}
                />
                {!isCurrentUnit && (
                    <ActionIcon
                        title="Open the jobnet."
                        ariaLabel="Open the jobnet."
                        onClick={handleClickChildOpen(data)}
                        onKeyDown={handleKeyDownChildOpen(data)}
                        icon={<FolderOpenIcon fontSize="inherit" />}
                    />
                )}
                {unitEntity.hasSchedule && (
                    <ActionIcon
                        title="This job net has schedule."
                        ariaLabel="This job net has schedule."
                        icon={<ScheduleIcon fontSize="inherit" />}
                        disableRipple
                    />
                )}
                {unitEntity.hasWaitedFor && (
                    <ActionIcon
                        title="This jobnet will wait for another unit."
                        ariaLabel="This jobnet will wait for another unit."
                        icon={<HourglassEmptyIcon fontSize="inherit" />}
                        disableRipple
                    />
                )}
            </CardActions>
            {!unitEntity.isRootJobnet && !isCurrentUnit && (
                <>
                    <Handle type="source" position={Position.Right} />
                    <Handle type="target" position={Position.Left} />
                </>
            )}
        </Card>
    );
};

export default memo(JobNetNode);