import React, { FC, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TableChartIcon from "@mui/icons-material/TableChart";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import classNames from "classnames";
import { ActionIcon, AjsNode, FlowNodeCard, handleStyle } from "./AjsNode";
import {
  handleClickChildOpen,
  handleClickNavigateToTable,
  handleClickNestedToggle,
  handleKeyDownChildOpen,
  handleKeyDownNavigateToTable,
  handleKeyDownNestedToggle,
} from "./Utils";

type JobNetNode = Node<AjsNode, "jobnet">;
type JobNetNodeProps = NodeProps<JobNetNode>;

const JobNetNode: FC<JobNetNodeProps> = ({ data }: JobNetNodeProps) => {
  console.log("render JobNetNode.");

  const {
    isAncestor,
    isCurrent,
    isRootJobnet,
    canExpandNested,
    isExpandedNested,
  } = data;

  return (
    <>
      <FlowNodeCard
        data={data}
        kind="jobnet"
        className={classNames({
          current: isCurrent,
          ancestor: isAncestor,
        })}
        headerAction={
          !isCurrent && canExpandNested ? (
            <ActionIcon
              title={
                isExpandedNested
                  ? "Collapse the nested jobnet."
                  : "Expand the nested jobnet."
              }
              ariaLabel={
                isExpandedNested
                  ? "Collapse the nested jobnet."
                  : "Expand the nested jobnet."
              }
              onClick={handleClickNestedToggle(data)}
              onKeyDown={handleKeyDownNestedToggle(data)}
              icon={
                isExpandedNested ? (
                  <UnfoldLessIcon fontSize="inherit" />
                ) : (
                  <UnfoldMoreIcon fontSize="inherit" />
                )
              }
            />
          ) : undefined
        }
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
            title="Open the jobnet."
            ariaLabel="Open the jobnet."
            onClick={handleClickChildOpen(data)}
            onKeyDown={handleKeyDownChildOpen(data)}
            icon={<FolderOpenIcon fontSize="inherit" />}
          />
        )}
      </FlowNodeCard>
      {!isRootJobnet && !isCurrent && (
        <>
          <Handle type="source" position={Position.Right} style={handleStyle} />
          <Handle type="target" position={Position.Left} style={handleStyle} />
        </>
      )}
    </>
  );
};

export default memo(JobNetNode);
