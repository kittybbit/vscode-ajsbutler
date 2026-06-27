import React, { FC, memo } from "react";
import Box from "@mui/material/Box";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import classNames from "classnames";
import { ActionIcon, AjsNode, FlowNodeCard, handleStyle } from "./AjsNode";
import {
  handleClickChildOpen,
  handleClickNestedToggle,
  handleKeyDownChildOpen,
  handleKeyDownNestedToggle,
} from "./Utils";

type JobNetNode = Node<AjsNode, "jobnet">;
type JobNetNodeProps = NodeProps<JobNetNode>;
type JobNetHeaderActionKind = "openScope" | "toggleNested";

export const getJobNetHeaderActionKinds = ({
  canExpandNested,
  isCurrent,
}: Pick<AjsNode, "canExpandNested" | "isCurrent">): JobNetHeaderActionKind[] =>
  isCurrent
    ? []
    : [
        "openScope",
        ...(canExpandNested
          ? (["toggleNested"] satisfies JobNetHeaderActionKind[])
          : []),
      ];

const JobNetNode: FC<JobNetNodeProps> = ({ data }: JobNetNodeProps) => {
  console.log("render JobNetNode.");

  const {
    isAncestor,
    isCurrent,
    isRootJobnet,
    canExpandNested,
    isExpandedNested,
  } = data;
  const headerActionKinds = getJobNetHeaderActionKinds(data);

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
          headerActionKinds.length > 0 ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.25em" }}>
              {headerActionKinds.map((actionKind) =>
                actionKind === "openScope" ? (
                  <ActionIcon
                    key={actionKind}
                    title="Open the jobnet."
                    ariaLabel="Open the jobnet."
                    onClick={handleClickChildOpen(data)}
                    onKeyDown={handleKeyDownChildOpen(data)}
                    icon={<FolderOpenIcon fontSize="inherit" />}
                  />
                ) : (
                  <ActionIcon
                    key={actionKind}
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
                ),
              )}
            </Box>
          ) : undefined
        }
      />
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
