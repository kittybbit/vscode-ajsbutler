import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { AjsNode, FlowNodeCard, handleStyle } from "./AjsNode";

type JobNode = Node<AjsNode, "job">;
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
