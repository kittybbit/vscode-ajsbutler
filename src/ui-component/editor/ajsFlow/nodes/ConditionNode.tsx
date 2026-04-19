import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
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
  handleClickChildOpen,
  handleClickDialogOpen,
  handleClickNavigateToTable,
  handleKeyDownChildOpen,
  handleKeyDownDialogOpen,
  handleKeyDownNavigateToTable,
} from "./Utils";

export type ConditionNode = Node<AjsNode, "condition">;
type ConditionNodeProps = NodeProps<ConditionNode>;
const ConditionNode: FC<ConditionNodeProps> = ({
  data,
}: ConditionNodeProps) => {
  console.log("render ConditionNode.");

  const { unitId, isAncestor, isCurrent, label, comment, ty } = data;

  return (
    <>
      <Stack
        id={unitId}
        sx={buildNodeSxProps({ isCurrent, isAncestor, isRootJobnet: false })}
        className={isCurrent ? "current" : undefined}
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
          <ActionIcon
            title="Open the matching unit in the unit list."
            ariaLabel="Open the matching unit in the unit list."
            onClick={handleClickNavigateToTable(data)}
            onKeyDown={handleKeyDownNavigateToTable(data)}
            icon={<TableChartIcon fontSize="inherit" />}
          />
          {!isCurrent && (
            <ActionIcon
              title="Open the condition."
              ariaLabel="Open the condition."
              onClick={handleClickChildOpen(data)}
              onKeyDown={handleKeyDownChildOpen(data)}
              icon={<FolderOpenIcon fontSize="inherit" />}
            />
          )}
        </Box>
      </Stack>
      <NameOrComment value={label} />
      <NameOrComment value={comment} />
    </>
  );
};

export default memo(ConditionNode);
