import React, { FC } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ScheduleIcon from "@mui/icons-material/Schedule";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitDefinitionDialogDto } from "../../../../../application/unit-definition/buildUnitDefinition";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
} from "../flowViewerStateTypes";
import { TySymbol } from "../../../../../domain/values/AjsType";
import { unitTypeLabel } from "../../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../../MyContexts";
import {
  FlowNodeStatus,
  FlowNodeKind,
  FlowNodeHeaderTone,
  resolveFlowNodeStatuses,
  resolveFlowNodeHeaderTone,
  shouldRenderNodeComment,
} from "./flowNodeDisplay";
import type { FlowRelationshipFocusRole } from "../flowRelationshipFocus";
import { buildNodeSxProps } from "./nodeSxProps";
import { flowNodeHandleTop } from "./flowNodeGeometry";
export { buildNodeSxProps } from "./nodeSxProps";

export type AjsNode = {
  nestedPanel?: {
    panelOffsetXPx: number;
    panelOffsetYPx: number;
    panelWidthPx: number;
    panelHeightPx: number;
  };
  unitId: string;
  absolutePath: string;
  unitDefinition: UnitDefinitionDialogDto;
  label: string;
  comment?: string;
  ty: TySymbol;
  gty?: "n" | "p";
  isAncestor: boolean;
  isCurrent: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  isHovered?: boolean;
  isSearchMatch?: boolean;
  isCurrentSearchResult?: boolean;
  isSelected?: boolean;
  relationshipFocusRole?: FlowRelationshipFocusRole;
  canExpandNested?: boolean;
  isExpandedNested?: boolean;
  toggleExpandedUnitId?: (unitId: string) => void;
} & DialogDataStateType &
  CurrentUnitIdStateType &
  Record<string, unknown>;

export const nodeBadgeSxProps: SxProps<Theme> = {
  minWidth: "3.8em",
  paddingX: "0.55em",
  paddingY: "0.15em",
  borderRadius: "999px",
  border: (theme) => `1px solid ${theme.palette.divider}`,
  backgroundColor: (theme) => theme.palette.background.default,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  lineHeight: 1.2,
  textAlign: "center",
};

export const handleStyle = {
  top: flowNodeHandleTop,
};

const nodeTitleSxProps: SxProps<Theme> = {
  minWidth: "2.8em",
  paddingX: "0.5em",
  paddingY: "0.15em",
  borderRadius: "999px",
  backgroundColor: (theme) => theme.palette.background.paper,
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  lineHeight: 1.2,
  textAlign: "center",
};

export const nodeActionsSxProps: SxProps<Theme> = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: "1.5em",
  marginTop: "auto",
  paddingX: "0.35em",
  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
  textAlign: "center",
};

export const TyTitle: FC<{
  ty: TySymbol;
  gty?: "n" | "p";
}> = ({ ty, gty }) => {
  const { lang = "en" } = useMyAppContext();
  return (
    <Tooltip title={unitTypeLabel(ty, lang, gty)} arrow={true} placement="top">
      <Box sx={nodeTitleSxProps}>{ty.toUpperCase()}</Box>
    </Tooltip>
  );
};
const iconButtonSx: SxProps<Theme> = { padding: "0.1em" };
export const ActionIcon: FC<{
  title: string;
  ariaLabel: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  icon: React.ReactNode;
  disableRipple?: boolean;
}> = ({
  title,
  ariaLabel,
  onClick,
  onKeyDown,
  icon,
  disableRipple = false,
}) => (
  <Tooltip title={title}>
    <IconButton
      aria-label={ariaLabel}
      size="small"
      onClick={onClick}
      onKeyDown={onKeyDown}
      disableRipple={disableRipple}
      sx={iconButtonSx}
    >
      {icon}
    </IconButton>
  </Tooltip>
);
const nameOrCommentSx: SxProps<Theme> = {
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  textAlign: "center",
  lineHeight: 1.2,
};
const NameOrComment: React.FC<{
  value?: string;
}> = ({ value }) => {
  return (
    <Tooltip title={value}>
      <Typography variant="body1" fontSize="small" sx={nameOrCommentSx}>
        {value}
      </Typography>
    </Tooltip>
  );
};

export const NodeNameAndComment: React.FC<{
  label?: string;
  comment?: string;
}> = ({ label, comment }) => (
  <Box
    sx={{
      boxSizing: "border-box",
      width: "100%",
      minWidth: 0,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingX: "0.6em",
    }}
  >
    <NameOrComment value={label} />
    {shouldRenderNodeComment(label, comment) && (
      <NameOrComment value={comment} />
    )}
  </Box>
);

const headerSxByTone: Record<FlowNodeHeaderTone, SxProps<Theme>> = {
  neutral: {
    borderColor: (theme) => theme.palette.grey[500],
    backgroundColor: (theme) => theme.palette.action.hover,
  },
  primary: {
    borderColor: (theme) => theme.palette.primary.main,
    backgroundColor: (theme) => `${theme.palette.primary.main}18`,
  },
  warning: {
    borderColor: (theme) => theme.palette.warning.main,
    backgroundColor: (theme) => `${theme.palette.warning.main}18`,
  },
  info: {
    borderColor: (theme) => theme.palette.info.main,
    backgroundColor: (theme) => `${theme.palette.info.main}18`,
  },
};

const statusPresentation: Record<
  FlowNodeStatus,
  { title: string; icon: React.ReactNode }
> = {
  schedule: {
    title: "This unit has a schedule.",
    icon: <ScheduleIcon fontSize="inherit" />,
  },
  waitedFor: {
    title: "This unit waits for another unit.",
    icon: <HourglassEmptyIcon fontSize="inherit" />,
  },
};

export type FlowNodeHeaderItemKind = "rootBadge" | FlowNodeStatus | "action";

export const getFlowNodeHeaderItemKinds = (
  data: Pick<AjsNode, "hasSchedule" | "hasWaitedFor" | "isRootJobnet">,
  hasHeaderAction: boolean,
): FlowNodeHeaderItemKind[] => [
  ...(data.isRootJobnet
    ? (["rootBadge"] satisfies FlowNodeHeaderItemKind[])
    : []),
  ...resolveFlowNodeStatuses(data),
  ...(hasHeaderAction ? (["action"] satisfies FlowNodeHeaderItemKind[]) : []),
];

const NodeStatusIndicators: FC<{ data: AjsNode }> = ({ data }) => {
  const statuses = getFlowNodeHeaderItemKinds(data, false).filter(
    (itemKind): itemKind is FlowNodeStatus =>
      itemKind === "schedule" || itemKind === "waitedFor",
  );
  if (statuses.length === 0) {
    return null;
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3em",
        color: "text.secondary",
        fontSize: "0.75rem",
      }}
    >
      {statuses.map((status) => {
        const presentation = statusPresentation[status];
        return (
          <Tooltip key={status} title={presentation.title}>
            <Box
              component="span"
              role="img"
              aria-label={presentation.title}
              sx={{ display: "inline-flex" }}
            >
              {presentation.icon}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export const FlowNodeCard: FC<{
  data: AjsNode;
  kind: FlowNodeKind;
  className?: string;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ data, kind, className, headerAction, children }) => (
  <Stack id={data.unitId} sx={buildNodeSxProps(data)} className={className}>
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        minHeight: "1.5em",
        paddingX: "0.45em",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid",
        ...headerSxByTone[resolveFlowNodeHeaderTone(kind)],
      }}
    >
      <TyTitle ty={data.ty} gty={data.gty} />
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.25em" }}>
        {data.isRootJobnet && <Box sx={nodeBadgeSxProps}>ROOT</Box>}
        <NodeStatusIndicators data={data} />
        {headerAction}
      </Box>
    </Box>
    <NodeNameAndComment label={data.label} comment={data.comment} />
    {children && <Box sx={nodeActionsSxProps}>{children}</Box>}
  </Stack>
);
