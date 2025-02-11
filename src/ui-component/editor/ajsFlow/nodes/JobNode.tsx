import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Box, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {
  ActionIcon,
  AjsNode,
  nodeActionsSxProps,
  nodeSxProps,
  NameOrComment,
  TyTitle,
  handleStyle,
} from "./AjsNode";
import { handleClickDialogOpen, handleKeyDownDialogOpen } from "./Utils";

export type JobNode = Node<AjsNode, "job">;
type JobNodeProps = NodeProps<JobNode>;
const JobNode: FC<JobNodeProps> = ({ data }: JobNodeProps) => {
  console.log("render JobNode.");

  const { unitEntity } = data;

  const hasWaitedFor =
    "hasWaitedFor" in unitEntity && (unitEntity.hasWaitedFor as boolean);

  return (
    <>
      <Stack id={unitEntity.id} sx={nodeSxProps}>
        <TyTitle ty={unitEntity.ty.value()} />
        {/* action */}
        <Box sx={nodeActionsSxProps}>
          <ActionIcon
            title="View the unit definition."
            ariaLabel="View the unit definition."
            onClick={handleClickDialogOpen(data)}
            onKeyDown={handleKeyDownDialogOpen(data)}
            icon={<DescriptionIcon fontSize="inherit" />}
          />
          {hasWaitedFor && (
            <ActionIcon
              title="This job will wait for another unit."
              ariaLabel="This job will wait for another unit."
              icon={<HourglassEmptyIcon fontSize="inherit" />}
            />
          )}
        </Box>
      </Stack>
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <NameOrComment value={unitEntity.name} />
      <NameOrComment value={unitEntity.cm?.value()} />
    </>
  );
};

export default memo(JobNode);
