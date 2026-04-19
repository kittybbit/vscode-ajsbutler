import React, { FC } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import { CurrentUnitIdStateType, DialogDataStateType } from "../FlowContents";
import { TySymbol } from "../../../../domain/values/AjsType";
import { tyDefinitionLang } from "../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../../MyContexts";

export type AjsNode = {
  nestedPanel?: {
    panelOffsetXPx: number;
    panelOffsetYPx: number;
    panelWidthPx: number;
    panelHeightPx: number;
  };
  unitId: string;
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
  isSearchMatch?: boolean;
  canExpandNested?: boolean;
  isExpandedNested?: boolean;
  toggleExpandedUnitId?: (unitId: string) => void;
} & DialogDataStateType &
  CurrentUnitIdStateType &
  Record<string, unknown>;

export const buildNodeSxProps = ({
  isCurrent,
  isAncestor,
  isRootJobnet,
  isSearchMatch,
  nestedPanel,
}: Pick<
  AjsNode,
  "isCurrent" | "isAncestor" | "isRootJobnet" | "isSearchMatch" | "nestedPanel"
>): SxProps<Theme> => ({
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  width: "7.25em",
  minHeight: "7.25em",
  paddingX: "0.55em",
  paddingY: "0.45em",
  borderRadius: isAncestor ? "1.35em" : "50%",
  borderWidth: isCurrent ? "3px" : isRootJobnet ? "2px" : "1px",
  borderStyle: "solid",
  borderColor: (theme) =>
    isCurrent
      ? theme.palette.info.main
      : isSearchMatch
        ? theme.palette.success.main
        : isRootJobnet
          ? theme.palette.primary.main
          : theme.palette.divider,
  background: (theme) => {
    if (isCurrent) {
      return `linear-gradient(160deg, ${theme.palette.info.light}22 0%, ${theme.palette.background.paper} 58%, ${theme.palette.background.default} 100%)`;
    }
    if (isSearchMatch) {
      return `linear-gradient(180deg, ${theme.palette.success.light}20 0%, ${theme.palette.background.paper} 100%)`;
    }
    if (isAncestor) {
      return `linear-gradient(180deg, ${theme.palette.warning.light}1f 0%, ${theme.palette.background.paper} 100%)`;
    }
    if (isRootJobnet) {
      return `linear-gradient(180deg, ${theme.palette.primary.light}18 0%, ${theme.palette.background.paper} 100%)`;
    }
    return theme.palette.background.paper;
  },
  boxShadow: (theme) =>
    isCurrent
      ? `0 0 0 4px ${theme.palette.info.light}30, ${theme.shadows[6]}`
      : isSearchMatch
        ? `0 0 0 3px ${theme.palette.success.light}30, ${theme.shadows[4]}`
        : isAncestor
          ? theme.shadows[4]
          : theme.shadows[2],
  justifyContent: "center",
  alignItems: "center",
  gap: "0.15em",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
  },
  "&::after": nestedPanel
    ? {
        content: '""',
        position: "absolute",
        left: `${nestedPanel.panelOffsetXPx}px`,
        top: `${nestedPanel.panelOffsetYPx}px`,
        width: `${nestedPanel.panelWidthPx}px`,
        height: `${nestedPanel.panelHeightPx}px`,
        borderRadius: "1.5em",
        border: (theme) => `1px solid ${theme.palette.primary.light}`,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.primary.light}10 0%, ${theme.palette.background.paper}cc 100%)`,
        boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.divider}`,
        pointerEvents: "none",
        zIndex: -1,
      }
    : undefined,
  "& button": {
    color: (theme) =>
      isCurrent
        ? theme.palette.info.dark
        : isSearchMatch
          ? theme.palette.success.dark
          : theme.palette.text.secondary,
  },
});

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
  top: "3.6em",
};

const nodeTitleSxProps: SxProps<Theme> = {
  minHeight: "1.6em",
  paddingTop: "0.1em",
  paddingBottom: "0em",
  textAlign: "center",
};

export const nodeActionsSxProps: SxProps<Theme> = {
  minHeight: "1.8em",
  paddingTop: "0.1em",
  paddingBottom: "0em",
  textAlign: "center",
};

export const TyTitle: FC<{
  ty: TySymbol;
  gty?: "n" | "p";
}> = ({ ty, gty }) => {
  const { lang = "en" } = useMyAppContext();
  const tyDefinition = tyDefinitionLang(lang);
  return (
    <Tooltip
      title={
        ty === "g" && gty ? tyDefinition[ty].gty[gty] : tyDefinition[ty].name
      }
      arrow={true}
      placement="top"
    >
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
  width: "7.25em",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  textAlign: "center",
};
export const NameOrComment: React.FC<{
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
