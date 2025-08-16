import React, { FC } from "react";
import {
  Box,
  IconButton,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import {
  CurrentUnitEntityStateType,
  DialogDataStateType,
} from "../FlowContents";
import { TySymbol } from "../../../../domain/values/AjsType";
import { tyDefinitionLang } from "../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../../MyContexts";

export type AjsNode<T extends UnitEntity = UnitEntity> = {
  unitEntity: T;
} & DialogDataStateType &
  CurrentUnitEntityStateType &
  Record<string, unknown>;

export const nodeSxProps: SxProps<Theme> = {
  width: "6em",
  height: "6em",
  borderRadius: "50%",
  backgroundColor: (theme) => theme.palette.background.default,
  boxShadow: (theme) => theme.shadows[1],
  justifyContent: "center",
  "&.current": {
    borderStyle: "solid",
    borderColor: (theme) => theme.palette.action.active,
  },
  "&.ancestor": {
    borderRadius: "10%",
  },
};

export const handleStyle = {
  top: "3em",
};

const nodeTitleSxProps: SxProps<Theme> = {
  height: "1em",
  paddingTop: "0.25em",
  paddingBottom: "0em",
  textAlign: "center",
};

export const nodeActionsSxProps: SxProps<Theme> = {
  paddingTop: "0.25em",
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
  width: "6em",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
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
