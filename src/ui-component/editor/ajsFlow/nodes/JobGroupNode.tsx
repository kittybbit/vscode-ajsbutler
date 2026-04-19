import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import {
  ActionIcon,
  AjsNode,
  buildNodeSxProps,
  nodeActionsSxProps,
  NameOrComment,
  TyTitle,
} from "./AjsNode";
import {
  handleClickDialogOpen,
  handleClickNavigateToTable,
  handleKeyDownDialogOpen,
  handleKeyDownNavigateToTable,
} from "./Utils";
import classNames from "classnames";

export type JobGroupNode = Node<AjsNode, "jobgroup">;
type JobGroupNodeProp = NodeProps<JobGroupNode>;
const JobGroupNode: FC<JobGroupNodeProp> = ({ data }: JobGroupNodeProp) => {
  console.log("render JobGroupNode.");
  const { unitId, isAncestor, label, comment, ty, gty } = data;

  return (
    <>
      <Stack
        id={unitId}
        sx={buildNodeSxProps({
          isCurrent: false,
          isAncestor,
          isRootJobnet: false,
        })}
        className={classNames({
          ancestor: isAncestor,
        })}
      >
        <TyTitle ty={ty} gty={gty} />
        {/* action */}
        <Box sx={nodeActionsSxProps}>
          <ActionIcon
            title="View the unit definition."
            ariaLabel="View the unit definition."
            onClick={handleClickDialogOpen(data)}
            onKeyDown={handleKeyDownDialogOpen(data)}
            icon={<DescriptionIcon fontSize="inherit" />}
          />
          <ActionIcon
            title="Open the matching unit in the unit list."
            ariaLabel="Open the matching unit in the unit list."
            onClick={handleClickNavigateToTable(data)}
            onKeyDown={handleKeyDownNavigateToTable(data)}
            icon={<TableChartIcon fontSize="inherit" />}
          />
        </Box>
      </Stack>
      <NameOrComment value={label} />
      <NameOrComment value={comment} />
    </>
  );
};

export default memo(JobGroupNode);
