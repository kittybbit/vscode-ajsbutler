import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import { AjsNode, FlowNodeCard } from "./AjsNode";
import classNames from "classnames";

type JobGroupNode = Node<AjsNode, "jobgroup">;
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
