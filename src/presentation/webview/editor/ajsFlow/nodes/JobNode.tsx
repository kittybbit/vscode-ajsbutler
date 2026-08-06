import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { FlowNodeCard, handleStyle } from "./AjsNode";
import type { FlowNodeData } from "../flowNodePresentationModel";

type JobNode = Node<FlowNodeData, "job">;
type JobNodeProps = NodeProps<JobNode>;
const JobNode: FC<JobNodeProps> = ({ data }: JobNodeProps) => {
  console.log("render JobNode.");

  return (
    <>
      <FlowNodeCard data={data} kind="job" />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
    </>
  );
};

export default memo(JobNode);
