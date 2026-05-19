import type { SxProps, Theme } from "@mui/material/styles";
import type { AjsNode } from "./AjsNode";

type NodeVisualState = Pick<
  AjsNode,
  "isCurrent" | "isAncestor" | "isRootJobnet" | "isSearchMatch" | "nestedPanel"
>;

type NestedPanel = NonNullable<NodeVisualState["nestedPanel"]>;

const nodeBorderRadius = ({ isAncestor }: NodeVisualState): string =>
  isAncestor ? "1.35em" : "50%";

const nodeBorderWidth = ({
  isCurrent,
  isRootJobnet,
}: NodeVisualState): string =>
  isCurrent ? "3px" : isRootJobnet ? "2px" : "1px";

const nodeBorderColor =
  ({ isCurrent, isSearchMatch, isRootJobnet }: NodeVisualState) =>
  (theme: Theme): string => {
    if (isCurrent) {
      return theme.palette.info.main;
    }
    if (isSearchMatch) {
      return theme.palette.success.main;
    }
    if (isRootJobnet) {
      return theme.palette.primary.main;
    }
    return theme.palette.divider;
  };

const nodeBackground =
  ({ isCurrent, isSearchMatch, isAncestor, isRootJobnet }: NodeVisualState) =>
  (theme: Theme): string => {
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
  };

const nodeBoxShadow =
  ({ isCurrent, isSearchMatch, isAncestor }: NodeVisualState) =>
  (theme: Theme): string => {
    if (isCurrent) {
      return `0 0 0 4px ${theme.palette.info.light}30, ${theme.shadows[6]}`;
    }
    if (isSearchMatch) {
      return `0 0 0 3px ${theme.palette.success.light}30, ${theme.shadows[4]}`;
    }
    if (isAncestor) {
      return theme.shadows[4];
    }
    return theme.shadows[2];
  };

const nestedPanelSxProps = (nestedPanel?: NestedPanel) => {
  if (!nestedPanel) {
    return undefined;
  }
  return {
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
  };
};

const nodeButtonColor =
  ({ isCurrent, isSearchMatch }: NodeVisualState) =>
  (theme: Theme): string => {
    if (isCurrent) {
      return theme.palette.info.dark;
    }
    if (isSearchMatch) {
      return theme.palette.success.dark;
    }
    return theme.palette.text.secondary;
  };

export const buildNodeSxProps = (
  visualState: NodeVisualState,
): SxProps<Theme> => ({
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  width: "7.25em",
  minHeight: "7.25em",
  paddingX: "0.55em",
  paddingY: "0.45em",
  borderRadius: nodeBorderRadius(visualState),
  borderWidth: nodeBorderWidth(visualState),
  borderStyle: "solid",
  borderColor: nodeBorderColor(visualState),
  background: nodeBackground(visualState),
  boxShadow: nodeBoxShadow(visualState),
  justifyContent: "center",
  alignItems: "center",
  gap: "0.15em",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
  },
  "&::after": nestedPanelSxProps(visualState.nestedPanel),
  "& button": {
    color: nodeButtonColor(visualState),
  },
});
