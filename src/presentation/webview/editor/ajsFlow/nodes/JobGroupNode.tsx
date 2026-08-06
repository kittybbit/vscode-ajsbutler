import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { FlowNodeCard } from "./AjsNode";
import type { FlowNodeData } from "../flowNodePresentationModel";
import classNames from "classnames";

type JobGroupNode = Node<FlowNodeData, "jobgroup">;
type JobGroupNodeProp = NodeProps<JobGroupNode>;
const JobGroupNode: FC<JobGroupNodeProp> = ({ data }: JobGroupNodeProp) => {
  console.log("render JobGroupNode.");
  const { isAncestor } = data;

  return (
    <>
      <FlowNodeCard
        data={data}
        kind="jobgroup"
        className={classNames({
          ancestor: isAncestor,
        })}
      />
    </>
  );
};

export default memo(JobGroupNode);
