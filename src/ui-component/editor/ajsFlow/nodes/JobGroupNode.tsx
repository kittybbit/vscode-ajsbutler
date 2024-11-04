import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import { G } from "../../../../domain/models/units/G";
import { AjsNode, cardHeaderSxProps, cardSxProps } from "./AjsNode";
import { handleClickDialogOpen, handleKeyDownDialogOpen } from "./Utils";

export type JobGroupNode = Node<AjsNode<G>, 'jobgroup'>;
type JobGroupNodeProp = NodeProps<JobGroupNode>;
const JobGroupNode: FC<JobGroupNodeProp> = (props: JobGroupNodeProp) => {

    console.log('render JobGroupNode.');
    const { unitEntity } = props.data;

    return <>
        <Card
            id={unitEntity.id}
            sx={cardSxProps}
        >
            <CardHeader
                disableTypography
                sx={cardHeaderSxProps}
                title={unitEntity.name}
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
            </CardActions>
        </Card>
    </>;
};

export default memo(JobGroupNode);