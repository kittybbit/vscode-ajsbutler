import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import TableChartIcon from "@mui/icons-material/TableChart";
import { ActionIcon, AjsNode, FlowNodeCard, handleStyle } from "./AjsNode";
import {
  handleClickNavigateToTable,
  handleKeyDownNavigateToTable,
} from "./Utils";

type JobNode = Node<AjsNode, "job">;
type JobNodeProps = NodeProps<JobNode>;
const JobNode: FC<JobNodeProps> = ({ data }: JobNodeProps) => {
  console.log("render JobNode.");

  return (
    <>
      <FlowNodeCard data={data} kind="job">
        <ActionIcon
          title="Open the matching unit in the unit list."
          ariaLabel="Open the matching unit in the unit list."
          onClick={handleClickNavigateToTable(data)}
          onKeyDown={handleKeyDownNavigateToTable(data)}
          icon={<TableChartIcon fontSize="inherit" />}
        />
      </FlowNodeCard>
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
    </>
  );
};

export default memo(JobNode);
