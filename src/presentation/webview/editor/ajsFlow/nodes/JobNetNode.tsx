import React, { FC, memo } from "react";
import Box from "@mui/material/Box";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import classNames from "classnames";
import { ActionIcon, AjsNode, FlowNodeCard, handleStyle } from "./AjsNode";
import { handleClickChildOpen, handleClickNestedToggle } from "./Utils";
import { useMyAppContext } from "../../MyContexts";
import {
  formatUnitInformationMessage,
  unitInformationMessage,
} from "../../unitInformationLocalization";

type JobNetNode = Node<AjsNode, "jobnet">;
type JobNetNodeProps = NodeProps<JobNetNode>;
type JobNetHeaderActionKind = "openScope" | "toggleNested";
type JobNetHeaderActionRule = {
  kind: JobNetHeaderActionKind;
  isVisible: (data: Pick<AjsNode, "canExpandNested" | "isCurrent">) => boolean;
};

const headerActionRules: readonly JobNetHeaderActionRule[] = [
  {
    kind: "openScope",
    isVisible: ({ isCurrent }) => !isCurrent,
  },
  {
    kind: "toggleNested",
    isVisible: ({ canExpandNested, isCurrent }) =>
      !isCurrent && Boolean(canExpandNested),
  },
];

export const getJobNetHeaderActionKinds = ({
  canExpandNested,
  isCurrent,
}: Pick<AjsNode, "canExpandNested" | "isCurrent">): JobNetHeaderActionKind[] =>
  headerActionRules
    .filter((rule) => rule.isVisible({ canExpandNested, isCurrent }))
    .map((rule) => rule.kind);

type JobNetHeaderActionProps = {
  data: AjsNode;
};

const OpenScopeAction: FC<JobNetHeaderActionProps> = ({ data }) => (
  <LocalizedOpenScopeAction data={data} />
);

const LocalizedOpenScopeAction: FC<JobNetHeaderActionProps> = ({ data }) => {
  const { lang = "en" } = useMyAppContext();
  const label = formatUnitInformationMessage("a11y.flow.node.openScope", lang, {
    name: data.label,
  });
  return (
    <ActionIcon
      title={label}
      ariaLabel={label}
      onClick={handleClickChildOpen(data)}
      icon={<FolderOpenIcon fontSize="inherit" />}
    />
  );
};

const NestedToggleAction: FC<JobNetHeaderActionProps> = ({ data }) => {
  const { lang = "en" } = useMyAppContext();
  const label = unitInformationMessage(
    data.isExpandedNested
      ? "a11y.flow.node.collapseNested"
      : "a11y.flow.node.expandNested",
    lang,
  );
  return (
    <ActionIcon
      title={label}
      ariaLabel={label}
      onClick={handleClickNestedToggle(data)}
      icon={
        data.isExpandedNested ? (
          <UnfoldLessIcon fontSize="inherit" />
        ) : (
          <UnfoldMoreIcon fontSize="inherit" />
        )
      }
    />
  );
};

const actionComponentByKind: Record<
  JobNetHeaderActionKind,
  FC<JobNetHeaderActionProps>
> = {
  openScope: OpenScopeAction,
  toggleNested: NestedToggleAction,
};

const renderJobNetHeaderActions = (data: AjsNode): React.ReactNode => {
  const headerActionKinds = getJobNetHeaderActionKinds(data);
  return headerActionKinds.length > 0 ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.25em" }}>
      {headerActionKinds.map((actionKind) =>
        React.createElement(actionComponentByKind[actionKind], {
          key: actionKind,
          data,
        }),
      )}
    </Box>
  ) : undefined;
};

const JobNetHandles: FC<Pick<AjsNode, "isRootJobnet" | "isCurrent">> = ({
  isRootJobnet,
  isCurrent,
}) =>
  !isRootJobnet && !isCurrent ? (
    <>
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
    </>
  ) : undefined;

const JobNetNode: FC<JobNetNodeProps> = ({ data }: JobNetNodeProps) => {
  console.log("render JobNetNode.");

  return (
    <>
      <FlowNodeCard
        data={data}
        kind="jobnet"
        className={classNames({
          current: data.isCurrent,
          ancestor: data.isAncestor,
        })}
        headerAction={renderJobNetHeaderActions(data)}
      />
      <JobNetHandles
        isRootJobnet={data.isRootJobnet}
        isCurrent={data.isCurrent}
      />
    </>
  );
};

export default memo(JobNetNode);
