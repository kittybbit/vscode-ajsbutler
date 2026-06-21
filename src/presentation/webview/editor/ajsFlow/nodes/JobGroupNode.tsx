import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import TableChartIcon from "@mui/icons-material/TableChart";
import { ActionIcon, AjsNode, FlowNodeCard } from "./AjsNode";
import {
  handleClickNavigateToTable,
  handleKeyDownNavigateToTable,
} from "./Utils";
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
      >
        <ActionIcon
          title="Open the matching unit in the unit list."
          ariaLabel="Open the matching unit in the unit list."
          onClick={handleClickNavigateToTable(data)}
          onKeyDown={handleKeyDownNavigateToTable(data)}
          icon={<TableChartIcon fontSize="inherit" />}
        />
      </FlowNodeCard>
    </>
  );
};

export default memo(JobGroupNode);
