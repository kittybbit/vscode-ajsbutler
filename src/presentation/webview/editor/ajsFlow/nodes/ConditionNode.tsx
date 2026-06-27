import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { ActionIcon, AjsNode, FlowNodeCard } from "./AjsNode";
import { handleClickChildOpen, handleKeyDownChildOpen } from "./Utils";

type ConditionNode = Node<AjsNode, "condition">;
type ConditionNodeProps = NodeProps<ConditionNode>;
const ConditionNode: FC<ConditionNodeProps> = ({
  data,
}: ConditionNodeProps) => {
  console.log("render ConditionNode.");

  const { isCurrent } = data;

  return (
    <>
      <FlowNodeCard
        data={data}
        kind="condition"
        className={isCurrent ? "current" : undefined}
        headerAction={
          !isCurrent ? (
            <ActionIcon
              title="Open the condition."
              ariaLabel="Open the condition."
              onClick={handleClickChildOpen(data)}
              onKeyDown={handleKeyDownChildOpen(data)}
              icon={<FolderOpenIcon fontSize="inherit" />}
            />
          ) : undefined
        }
      />
    </>
  );
};

export default memo(ConditionNode);
