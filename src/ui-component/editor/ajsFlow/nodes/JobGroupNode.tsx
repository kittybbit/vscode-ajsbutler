import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { Box, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { G } from "../../../../domain/models/units/G";
import {
  ActionIcon,
  AjsNode,
  nodeActionsSxProps,
  nodeSxProps,
  NameOrComment,
  TyTitle,
} from "./AjsNode";
import { handleClickDialogOpen, handleKeyDownDialogOpen } from "./Utils";
import classNames from "classnames";

export type JobGroupNode = Node<AjsNode<G>, "jobgroup">;
type JobGroupNodeProp = NodeProps<JobGroupNode>;
const JobGroupNode: FC<JobGroupNodeProp> = ({ data }: JobGroupNodeProp) => {
  console.log("render JobGroupNode.");
  const { unitEntity, isAncestor } = data;

  return (
    <>
      <Stack
        id={unitEntity.id}
        sx={nodeSxProps}
        className={classNames({
          ancestor: isAncestor,
        })}
      >
        <TyTitle
          ty={unitEntity.ty.value()}
          gty={unitEntity.gty?.value() as "n" | "p"}
        />
        {/* action */}
        <Box sx={nodeActionsSxProps}>
          <ActionIcon
            title="View the unit definition."
            ariaLabel="View the unit definition."
            onClick={handleClickDialogOpen(data)}
            onKeyDown={handleKeyDownDialogOpen(data)}
            icon={<DescriptionIcon fontSize="inherit" />}
          />
        </Box>
      </Stack>
      <NameOrComment value={unitEntity.name} />
      <NameOrComment value={unitEntity.cm?.value()} />
    </>
  );
};

export default memo(JobGroupNode);
