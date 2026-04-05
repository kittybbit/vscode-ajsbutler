import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Box, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import classNames from "classnames";
import {
  ActionIcon,
  AjsNode,
  nodeActionsSxProps,
  nodeSxProps,
  NameOrComment,
  TyTitle,
  handleStyle,
} from "./AjsNode";
import {
  handleClickChildOpen,
  handleClickDialogOpen,
  handleKeyDownChildOpen,
  handleKeyDownDialogOpen,
} from "./Utils";

export type JobNetNode = Node<AjsNode, "jobnet">;
type JobNetNodeProps = NodeProps<JobNetNode>;

const JobNetNode: FC<JobNetNodeProps> = ({ data }: JobNetNodeProps) => {
  console.log("render JobNetNode.");

  const {
    unitId,
    isAncestor,
    isCurrent,
    hasSchedule,
    hasWaitedFor,
    isRootJobnet,
    label,
    comment,
    ty,
  } = data;

  return (
    <>
      <Stack
        id={unitId}
        sx={nodeSxProps}
        className={classNames({
          current: isCurrent,
          ancestor: isAncestor,
        })}
      >
        <TyTitle ty={ty} />
        {/* action */}
        <Box sx={nodeActionsSxProps}>
          <ActionIcon
            title="View the unit definition."
            ariaLabel="View the unit definition."
            onClick={handleClickDialogOpen(data)}
            onKeyDown={handleKeyDownDialogOpen(data)}
            icon={<DescriptionIcon fontSize="inherit" />}
          />
          {!isCurrent && (
            <ActionIcon
              title="Open the jobnet."
              ariaLabel="Open the jobnet."
              onClick={handleClickChildOpen(data)}
              onKeyDown={handleKeyDownChildOpen(data)}
              icon={<FolderOpenIcon fontSize="inherit" />}
            />
          )}
          {hasSchedule && (
            <ActionIcon
              title="This job net has schedule."
              ariaLabel="This job net has schedule."
              icon={<ScheduleIcon fontSize="inherit" />}
              disableRipple
            />
          )}
          {hasWaitedFor && (
            <ActionIcon
              title="This jobnet will wait for another unit."
              ariaLabel="This jobnet will wait for another unit."
              icon={<HourglassEmptyIcon fontSize="inherit" />}
              disableRipple
            />
          )}
        </Box>
      </Stack>
      {!isRootJobnet && !isCurrent && (
        <>
          <Handle type="source" position={Position.Right} style={handleStyle} />
          <Handle type="target" position={Position.Left} style={handleStyle} />
        </>
      )}
      <NameOrComment value={label} />
      <NameOrComment value={comment} />
    </>
  );
};

export default memo(JobNetNode);
