import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Card, CardActions, CardHeader, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import { G } from "../../../../domain/models/units/G";
import { ActionIcon, AjsNode, cardActionsSxProps, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import { handleClickDialogOpen, handleKeyDownDialogOpen } from "./Utils";

export type JobGroupNode = Node<AjsNode<G>, 'jobgroup'>;
type JobGroupNodeProp = NodeProps<JobGroupNode>;
const JobGroupNode: FC<JobGroupNodeProp> = ({ data }: JobGroupNodeProp) => {

    console.log('render JobGroupNode.');
    const { unitEntity } = data;

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
            </CardActions>
        </Card>
    );
};

export default memo(JobGroupNode);