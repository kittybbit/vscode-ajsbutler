import React, { FC, memo } from "react";
import { Node, NodeProps } from "@xyflow/react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { ActionIcon, FlowNodeCard } from "./AjsNode";
import type { FlowNodeData } from "../flowNodePresentationModel";
import { handleClickChildOpen } from "./Utils";
import { useMyAppContext } from "../../MyContexts";
import { unitInformationMessage } from "../../unitInformationLocalization";

type ConditionNode = Node<FlowNodeData, "condition">;
type ConditionNodeProps = NodeProps<ConditionNode>;
const ConditionNode: FC<ConditionNodeProps> = ({
  data,
}: ConditionNodeProps) => {
  console.log("render ConditionNode.");

  const { isCurrent } = data;
  const { lang = "en" } = useMyAppContext();

  return (
    <>
      <FlowNodeCard
        data={data}
        kind="condition"
        className={isCurrent ? "current" : undefined}
        headerAction={
          !isCurrent ? (
            <ActionIcon
              title={unitInformationMessage(
                "a11y.flow.node.openCondition",
                lang,
              )}
              ariaLabel={unitInformationMessage(
                "a11y.flow.node.openCondition",
                lang,
              )}
              onClick={handleClickChildOpen(data)}
              icon={<FolderOpenIcon fontSize="inherit" />}
            />
          ) : undefined
        }
      />
    </>
  );
};

export default memo(ConditionNode);
