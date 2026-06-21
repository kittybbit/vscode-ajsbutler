import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TableChartIcon from "@mui/icons-material/TableChart";
import { ActionIcon, AjsNode, FlowNodeCard } from "./AjsNode";
import {
  handleClickChildOpen,
  handleClickNavigateToTable,
  handleKeyDownChildOpen,
  handleKeyDownNavigateToTable,
} from "./Utils";

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
      >
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
      </FlowNodeCard>
    </>
  );
};

export default memo(ConditionNode);
