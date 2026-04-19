import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import classNames from "classnames";
import {
  ActionIcon,
  AjsNode,
  buildNodeSxProps,
  nodeBadgeSxProps,
  nodeActionsSxProps,
  NameOrComment,
  TyTitle,
  handleStyle,
} from "./AjsNode";
import {
  handleClickChildOpen,
  handleClickDialogOpen,
  handleClickNestedToggle,
  handleKeyDownChildOpen,
  handleKeyDownDialogOpen,
  handleKeyDownNestedToggle,
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
    isSearchMatch,
    canExpandNested,
    isExpandedNested,
    label,
    comment,
    ty,
  } = data;

  return (
    <>
      <Stack
        id={unitId}
        sx={buildNodeSxProps({
          isCurrent,
          isAncestor,
          isRootJobnet,
          isSearchMatch,
          nestedPanel: data.nestedPanel,
        })}
        className={classNames({
          current: isCurrent,
          ancestor: isAncestor,
        })}
      >
        {isRootJobnet && <Box sx={nodeBadgeSxProps}>ROOT</Box>}
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
          {!isCurrent && canExpandNested && (
            <ActionIcon
              title={
                isExpandedNested
                  ? "Collapse the nested jobnet."
                  : "Expand the nested jobnet."
              }
              ariaLabel={
                isExpandedNested
                  ? "Collapse the nested jobnet."
                  : "Expand the nested jobnet."
              }
              onClick={handleClickNestedToggle(data)}
              onKeyDown={handleKeyDownNestedToggle(data)}
              icon={
                isExpandedNested ? (
                  <UnfoldLessIcon fontSize="inherit" />
                ) : (
                  <UnfoldMoreIcon fontSize="inherit" />
                )
              }
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
