import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Box, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {
  ActionIcon,
  AjsNode,
  nodeActionsSxProps,
  nodeSxProps,
  NameOrComment,
  TyTitle,
} from "./AjsNode";
import {
  handleClickChildOpen,
  handleClickDialogOpen,
  handleKeyDownChildOpen,
  handleKeyDownDialogOpen,
} from "./Utils";

export type ConditionNode = Node<AjsNode, "condition">;
type ConditionNodeProps = NodeProps<ConditionNode>;
const ConditionNode: FC<ConditionNodeProps> = ({
  data,
}: ConditionNodeProps) => {
  console.log("render ConditionNode.");

  const { unitId, isCurrent, label, comment, ty } = data;

  return (
    <>
      <Stack
        id={unitId}
        sx={nodeSxProps}
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
